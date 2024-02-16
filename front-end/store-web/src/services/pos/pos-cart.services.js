import { t } from "i18next";
import moment from "moment";
import {
  EnumActionTypeOrderHistoryLocal,
  EnumOrderStatus,
  EnumOrderType,
  EnumQRCodeStatus,
  EnumTargetQRCode,
  ListEnumDiscountCodeError,
  OrderPaymentStatus,
} from "../../constants/enums";
import { PaymentMethodType } from "../../constants/payment-method.constants";
import { Platform } from "../../constants/platform.constants";
import { ToastMessageType } from "../../constants/toast-message.constants";
import comboDataService from "../../data-services/combo-data.service";
import discountCodeDataService from "../../data-services/discount-code-data.service";
import orderDataService from "../../data-services/order-data.service";
import orderSessionDataService from "../../data-services/order-session-data.services";
import productDataService from "../../data-services/product-data.service";
import { store } from "../../modules";
import { setPOSDiscountCodes, setPOSOrderDetail, setQrCodeOrder } from "../../modules/order/order.actions";
import { setProductListPageData } from "../../modules/product/product.actions";
import { setOrderInfo, setPOSCartItems, setToastMessage } from "../../modules/session/session.actions";
import { EnumPromotionSummary } from "../../theme/constants/enums";
import { formatTextNumber, isNonEmptyArray } from "../../utils/helpers";
import { HttpStatusCode } from "../../utils/http-common";
import { getStorage, localStorageKeys } from "../../utils/localStorage.helpers";
import orderService from "../orders/order-service";
import productComboAddToCartServices from "../product-combo-add-to-cart.services";
import reduxService from "../redux.services";
import shoppingCartService from "../shopping-cart/shopping-cart.service";

const paramIsLoadData = "isLoadData"; //data field to identify when adding products to the cart(Qr Order)
const maximumQuantity = 999;
const setStoreCartLocalStorage = (cartItems) => {
  localStorage.setItem(localStorageKeys.POS_CART, JSON.stringify(cartItems ?? []));
};

/**
 *
 * @param {*} data
 * @param {*} isVerifyCart is true : will call api calculate-product-cart-item to verify. Then set store cart according to verified data.
 */
const setPOSCart = (data, isVerifyCart) => {
  if (isVerifyCart) {
    verifyAndUpdateCart(data, false);
  } else {
    store.dispatch(setPOSCartItems([...data]));
  }
};

/**
 *
 * @param {*} cartItems
 * @param {*} isCheckChangedData is true: will check if the old cartItems and the new cartItems are different.
 * @returns If is true, it has changed.
 */
const verifyAndUpdateCart = (cartItems, isCheckChangedData) => {
  let isChangedProductPrice = false;
  const orderInfo = reduxService.getOrderInfo();
  const sessionData = { ...reduxService.getAllData() };
  const { userInfo } = sessionData;
  const qrOrderInfo = reduxService.getQROrderInfo();

  if (!cartItems) {
    cartItems = reduxService.getPOSCartItems();
  }
  const requestCartItems = cartItems?.map((item) => shoppingCartService.mappingOrderCartItem(item));

  const verifyCartRequest = {
    cartItems: requestCartItems ?? [],
    customerId: userInfo?.customerId ?? null,
    branchId: orderInfo?.qrOrder?.branchId ?? null,
    skipCheckOrderItems: true,
    isRequestVerifyCartItems: isCheckChangedData ?? false,
    oldSignature: sessionData?.orderInfo?.cartValidated?.signature ?? "",
    discountCode: "", //reduxData?.discountCode,
    discountCodes: orderInfo?.discountCodes ?? [],
    qrCodeId: qrOrderInfo?.qrCodeId,
    platformId: Platform.POS,
  };

  verifyCartAsync(verifyCartRequest)
    .then((response) => {
      if (response?.status === HttpStatusCode.Ok) {
        // update order info to redux after call to validate
        const newOrderInfo = {
          ...sessionData?.orderInfo,
          cartValidated: response.data,
        };

        isChangedProductPrice = newOrderInfo.cartValidated?.isChangedProductPrice;
        reduxService.dispatch(setOrderInfo(newOrderInfo));
        let newItemInCart = updateItemInCart(response?.data?.cartItems, cartItems);

        reduxService.dispatch(setPOSCartItems(newItemInCart));

        // Check discount Code -> Toast message
        if (isNonEmptyArray(verifyCartRequest?.discountCodes)) {
          const messageCode = response?.data?.message?.code;
          const descriptionTranslation = response?.data?.message?.descriptionTranslation;
          const extraData = response?.data?.message?.extraData;

          if (messageCode && ListEnumDiscountCodeError.includes(messageCode)) {
            const data = {
              isShow: true,
              message: t(descriptionTranslation, extraData),
              type: ToastMessageType.WARNING,
              duration: 3000,
              key: moment.now(),
            };
            store.dispatch(setToastMessage(data));

            // handle set discountcode applied QR ORDER (useEffect not call when discountcode change)
            handleAppliedDiscountCode(response?.data?.promotionsSummary);
            // Todo: handle displaying the applied discount code
          }

          // handle toast message discount code applied success
          if (messageCode === 0) {
            const reduxState = store?.getState();
            const toastMessage = reduxState?.session?.toastMessage;
            if (toastMessage?.key) {
              const toastMessageSuccess = { ...toastMessage, isShow: true };
              store.dispatch(setToastMessage(toastMessageSuccess));
              // handle set discountcode applied QR ORDER (useEffect not call when discountcode change)
              handleAppliedDiscountCode(response?.data?.promotionsSummary);
            }
          }
        }
      } else {
        // To do
      }
    })
    .catch((response) => {
      // To do
    });

  return isChangedProductPrice;
};

const handleAppliedDiscountCode = (promotionsSummary) => {
  const discountCodes = reduxService.getPOSDiscountCodes();
  let lengthDiscountCodes = discountCodes?.length ?? 0;
  const discountCodesApplied = promotionsSummary
    ?.filter((x) => x.promotionType === EnumPromotionSummary.DiscountCode)
    ?.map((item) => item.promotionCode);

  for (let i = 0; i < lengthDiscountCodes; i++) {
    if (!discountCodesApplied?.includes(discountCodes[i])) {
      discountCodes.splice(i, 1);
    }
  }
  reduxService.dispatch(setPOSDiscountCodes(discountCodes));
};

const verifyCartAsync = async (request) => {
  const response = await productDataService.getProductCartItemAsync(request);
  return response;
};

const updateItemInCart = (cartItemsNew, cartItemsOld) => {
  var cartItemsAfterCalculate = cartItemsNew;
  let shoppingCartNew = [];
  cartItemsAfterCalculate.forEach((product) => {
    if (product?.isCombo) {
      const _combo = shoppingCartService.mappingComboCalculateToComboLocal(product);
      let indexComboEdit = cartItemsOld.findIndex((cart) => {
        return shoppingCartService.compareCombo(_combo, cart);
      });
      if (indexComboEdit >= 0) {
        shoppingCartNew.push({
          ...cartItemsOld[indexComboEdit],
          quantity: product?.quantity,
          products: _combo?.products,
        });
      }
    } else {
      shoppingCartNew.push(shoppingCartService.mappingProductCalculateToProductLocal(product));
    }
  });
  localStorage.setItem(localStorageKeys.POS_CART, JSON.stringify(shoppingCartNew));
  return shoppingCartNew;
};

const fetchProductListPageDataAsync = async (data) => {
  const loadCombo = comboDataService.getCombosAsync(data);

  const request = {
    branchId: data?.branchId,
    platformId: Platform.POS,
  };
  const loadProduct = productDataService.getProductsAsync(request);
  const [rsCombos, rsProducts] = await Promise.all([loadCombo, loadProduct]);

  const responseDataCombo = rsCombos?.data;

  let results = [];
  if (responseDataCombo?.succeeded) {
    const combos = responseDataCombo?.data?.combos ?? [];
    results = [...combos];
  }

  const responseDataProduct = rsProducts?.data;
  if (responseDataProduct?.succeeded) {
    const products = responseDataProduct?.data?.productCategorys;
    results = [...results, ...products];
  }

  store.dispatch(setProductListPageData(results));
};

function handleUpdateCartQuantity(itemId, quantityVaries, cartIndex) {
  const posCartItems = reduxService.getPOSCartItems();
  if (!posCartItems || posCartItems.length === 0) return;
  let newCart = [...posCartItems];
  let cartItemEdit = newCart[cartIndex];
  if (cartItemEdit) {
    if (cartItemEdit.quantity < maximumQuantity) {
      cartItemEdit.quantity += quantityVaries;
      if (cartItemEdit.quantity <= 0) {
        newCart.splice(cartIndex, 1);
      }

      verifyAndUpdateCart(newCart);
    }
  }
}

function handleDeleteCartItem(itemId, cartIndex) {
  const posCartItems = reduxService.getPOSCartItems();
  if (!posCartItems || posCartItems.length === 0) return;
  let newCart = [...posCartItems];
  newCart.splice(cartIndex, 1);
  verifyAndUpdateCart(newCart);
}

async function cleanPOSCartAsync(callBack) {
  await new Promise((resolve) => {
    reduxService.dispatch(setPOSCartItems([]));
    const reduxSession = reduxService.getAllData();
    const reduxOrderInfo = reduxSession?.orderInfo;
    reduxService.dispatch(setOrderInfo({ ...reduxOrderInfo, cartValidated: {} }));
    reduxService.dispatch(setPOSDiscountCodes([]));
    resolve();
  });
  if (callBack) {
    callBack();
  }
}

//Todo
async function createOrderAsync(request = {}) {
  const { notes } = request;
  const posCartItems = reduxService.getPOSCartItems();
  const qrOrderInfo = reduxService.getQROrderInfo();
  const orderInfo = reduxService.getOrderInfo();
  const sessionData = reduxService.getAllData();
  const { userInfo } = sessionData;
  const requestCartItems = posCartItems?.map((item) => {
    return mappingOrderCartItem(item);
  });
  const feeIds = sessionData?.orderInfo?.cartValidated?.fees?.map((f) => f?.id);

  const createOrderRequest = {
    accountId: userInfo?.accountId,
    branchId: qrOrderInfo?.branchId ?? null,
    tableId: qrOrderInfo?.tableId ?? null,
    customerId: userInfo?.customerId,
    enumPaymentMethodId: PaymentMethodType.Cash,
    cartItems: requestCartItems,
    totalTax: 0, //check
    note: notes,
    userPhoneNumber: userInfo?.phoneNumber,
    userFullName: userInfo?.fullName,
    discountCodes: orderInfo?.discountCodes ?? [],
    enumOrderTypeId: EnumOrderType.Instore,
    orderFeeIds: feeIds ?? [],
    platformId: Platform.POS,
    qrOrderId: qrOrderInfo?.qrCodeId,
  };

  try {
    const response = await orderDataService.createStoreWebOrderAsync(createOrderRequest);
    if (response.status === HttpStatusCode.Ok) {
      handleSaveOrderActionHistory(
        response?.data,
        qrOrderInfo,
        EnumActionTypeOrderHistoryLocal.ORDER,
        "",
        posCartItems,
      );

      const orderDetail = {
        orderId: response.data?.orderId,
        code: response.data?.orderCode,
        stringCode: response.data?.stringCode,
        paymentMethod: response.data?.paymentMethod,
        qrOrderId: qrOrderInfo?.qrCodeId,
        orderSessionId: response?.data?.orderSessionId,
        orderSessionCode: response?.data?.orderSessionCode,
        stringOrderSessionCode: response?.data?.stringOrderSessionCode,
      };
      reduxService.dispatch(setPOSOrderDetail(orderDetail));

      return { isSuccess: true, message: "Tạo đơn thành công" }; //Todo
    } else if (response.status === HttpStatusCode.BadRequest) {
      const responseData = response.data;
      return { isSuccess: false, message: responseData?.message ?? "Tạo đơn thất bại" }; //Todo
    }
  } catch (err) {
    return { isSuccess: false, message: err?.data?.message ?? "Tạo đơn thất bại" };
  }
}

async function createOrderSessionAsync(request = {}) {
  const posCartItems = reduxService.getPOSCartItems();
  const orderInfo = reduxService.getOrderInfo();
  const qrOrderInfo = reduxService.getQROrderInfo();
  const requestCartItems = posCartItems?.map((item) => {
    return mappingOrderCartItem(item);
  });

  const createOrderRequest = {
    isInStore: true,
    orderId: orderInfo?.orderDetail?.orderId,
    cartItems: requestCartItems,
  };

  try {
    const response = await orderSessionDataService.addNewOrderSession(createOrderRequest);
    if (response.data?.succeeded) {
      handleSaveOrderActionHistory(
        response?.data?.data,
        qrOrderInfo,
        EnumActionTypeOrderHistoryLocal.ADD_ITEM,
        "",
        posCartItems,
      );
      return { isSuccess: true, message: response.data?.message, data: response?.data?.data };
    } else {
      const responseData = response.data;
      return { isSuccess: false, message: responseData?.message };
    }
  } catch (err) {
    return { isSuccess: false, message: err?.data?.message };
  }
}

function handleSaveOrderActionHistory(orderDetail, qrOrderInfo, actionType, message, posCartItems) {
  const customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
  if (customerInfo) {
    const orderActionHistories = [
      {
        orderId: orderDetail?.orderId,
        qrOrderId: qrOrderInfo?.qrCodeId,
        actionType: orderService.mappingActionTypesOrderActionToDatabase(actionType),
        createTime: new Date(),
        areaTableName: qrOrderInfo?.areaName,
        orderSessionId: orderDetail?.orderSessionId,
        orderSessionCode: orderDetail?.orderSessionCode,
      },
    ];
    orderService.createOrderActionHistories(orderActionHistories, customerInfo?.accountId);
  } else {
    const orderSessionData = {
      orderId: orderDetail?.orderId,
      stringCode: orderDetail?.stringCode,
      orderSessionId: orderDetail?.orderSessionId,
      orderSessionCode: orderDetail?.orderSessionCode,
      stringOrderSessionCode: orderDetail?.stringOrderSessionCode,
    };
    handleSaveOrderActionHistoryToLocal(posCartItems, orderSessionData, actionType, message);
  }
}

const mappingOrderCartItem = (cartItem) => {
  return {
    orderItemId: null, //
    productPriceId: cartItem?.productPrice?.id,
    quantity: cartItem?.quantity,
    notes: cartItem?.notes,
    flashSaleId: cartItem?.productPrice?.flashSaleId,
    options: cartItem?.options?.map((o) => {
      return {
        optionId: o.id,
        optionLevelId: o.optionLevelId,
      };
    }),
    toppings: cartItem?.toppings?.map((t) => {
      return {
        toppingId: t.id,
        quantity: t.quantity,
      };
    }),
    isCombo: cartItem?.isCombo ?? false,
    combo: cartItem?.isCombo
      ? {
          comboId: cartItem?.isCombo ? cartItem?.id : null,
          comboPricingId: cartItem?.comboPricingId,
          comboName: cartItem?.combo?.itemName ?? cartItem?.name,
          itemName: cartItem?.comboPricingName,
          thumbnail: cartItem?.thumbnail,
          originalPrice: cartItem?.originalPrice,
          sellingPrice: cartItem?.sellingPrice,
          sellingPriceAfterDiscount: cartItem?.sellingPrice,
          quantity: cartItem?.quantity,
          notes: cartItem?.notes,
          customName: cartItem?.comboPricingName,
          comboItems: cartItem?.products?.map((product) => {
            return {
              productId: product?.id,
              productPriceId: product?.productPrice?.id,
              itemName: product?.name,
              thumbnail: product?.thumbnail,
              quantity: product?.quantity ?? 1,
              note: product?.note,
              options: product?.options?.map((option) => {
                return {
                  optionId: option?.id,
                  optionLevelId: option?.optionLevelId,
                };
              }),
              toppings: product?.toppings?.map((topping) => {
                return {
                  toppingId: topping?.id,
                  quantity: topping?.quantity,
                  priceValue: topping?.priceValue,
                };
              }),
            };
          }),
        }
      : null,
    productId: !cartItem?.isCombo ? cartItem?.id : null,
  };
};

async function verifyDisCountCodeAsync(discountCode) {
  const qrOrderInfo = reduxService.getQROrderInfo();
  const sessionData = reduxService.getAllData();
  const { userInfo } = sessionData;

  const params = {
    discountCodeId: null,
    branchId: qrOrderInfo?.branchId ?? null,
    accountId: userInfo?.accountId,
    customerId: userInfo?.customerId,
    code: discountCode,
    platformId: Platform.POS,
  };

  try {
    const response = await discountCodeDataService.redeemDiscountCodeAsync(params);
    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    } else {
      return; //Todo
    }
  } catch (err) {}
}

function addDiscountCode(discountCode) {
  const discountCodes = reduxService.getPOSDiscountCodes();
  const isExist = discountCodes?.some((code) => code === discountCode);
  if (!isExist) {
    reduxService.dispatch(setPOSDiscountCodes([...discountCodes, discountCode]));
  }
}

function removeDiscountCode(discountCode) {
  const discountCodes = reduxService.getPOSDiscountCodes();
  const index = discountCodes?.findIndex((code) => code === discountCode);
  if (index !== -1) {
    const discountCodesNew = [...discountCodes];
    discountCodesNew.splice(index, 1);
    reduxService.dispatch(setPOSDiscountCodes(discountCodesNew));
  }
}

const mergeCartItemInRedux = (cartItems, callBack) => {
  let posCartItemsCurrent = reduxService.getPOSCartItems();
  let posCartItemsNew = [];

  if (posCartItemsCurrent?.length > 0) {
    posCartItemsNew = [...posCartItemsCurrent];
  }

  cartItems?.map((item) => {
    posCartItemsNew = shoppingCartService.mergeProducts(item, [...posCartItemsNew]);
  });

  posCartService.setStoreCartLocalStorage(posCartItemsNew);
  posCartService.setPOSCart(posCartItemsNew, false);

  if (callBack) {
    callBack(posCartItemsNew);
  }
};

function addQRCodeProductsToCart(qrOrderInfo, query, history, qrCodeId, callback) {
  const isLoadQRCodeData = query.get(paramIsLoadData);
  if (isLoadQRCodeData === "true" && qrOrderInfo?.qrCodeId === qrCodeId) {
    query.delete(paramIsLoadData);
    history.replace({
      search: query.toString(),
    });
    if (qrOrderInfo?.targetId === EnumTargetQRCode.AddProductToCart) {
      const products = qrOrderInfo?.products ?? [];
      const productsNew = products.map((item) =>
        productComboAddToCartServices.mappingToProductLocal(item, null, item?.productDetail?.quantity),
      );
      mergeCartItemInRedux(productsNew);
      verifyAndUpdateCart();
    }

    if (callback) {
      callback();
    }
  }
}

const verifyProductInShoppingCartAsync = async (storeId, branchId, callback) => {
  const jsonStringStoreCart = localStorage.getItem(localStorageKeys.POS_CART);
  const storeCart = JSON.parse(jsonStringStoreCart);
  const cartComboIds = storeCart
    ?.filter((cartItem) => cartItem.isCombo === true)
    .map((cartItem) => {
      return cartItem.id;
    });

  const cartProductIds = storeCart
    ?.filter((cartItem) => cartItem.isCombo === false)
    .map((cartItem) => {
      return cartItem.id;
    });

  if (cartComboIds?.length === 0 && cartProductIds?.length === 0) {
    return false;
  }

  let queryString = `storeId=${storeId}&branchId=${branchId}`;
  for (var comboIndex in cartComboIds) {
    queryString += `&comboIds=${cartComboIds[comboIndex]}`;
  }

  for (var productIndex in cartProductIds) {
    queryString += `&productIds=${cartProductIds[productIndex]}`;
  }

  const response = await orderDataService.verifyProductInShoppingCartAsync(queryString);
  if (response.status === HttpStatusCode.Ok) {
    const { comboIds, productIds } = response.data;
    const isComboValid =
      comboIds &&
      comboIds?.length > 0 &&
      cartComboIds &&
      cartComboIds?.length > 0 &&
      comboIds?.length === cartComboIds?.length;

    const isProductValid =
      productIds &&
      productIds?.length > 0 &&
      cartProductIds &&
      cartProductIds?.length > 0 &&
      productIds?.length === cartProductIds?.length;

    if (isComboValid === true && isProductValid === true) {
      return true;
    }

    let newStoreCart = [];
    if (callback) {
      const productWillRemove = storeCart?.filter(
        (cartItem) => cartItem.isCombo === false && !productIds?.find((pid) => pid === cartItem.id),
      );
      const comboWillRemove = storeCart?.filter(
        (cartItem) => cartItem.isCombo === true && !comboIds?.find((pid) => pid === cartItem.id),
      );
      const itemsWillRemove = comboWillRemove?.concat(productWillRemove);
      callback(itemsWillRemove);

      /// remove item not belong to branch
      newStoreCart = storeCart?.filter((cartItem) => !itemsWillRemove?.find((item) => item.id === cartItem.id));
    }

    const result = {
      responseData: response.data,
      newStoreCart: newStoreCart,
    };
    return result;
  } else {
    return false;
  }
};

function mappingCartValidatedToPromotionPopupData(cartValidated) {
  let promotionPopupData = [];
  const {
    promotionsSummary = [],
    customerDiscountAmount = 0,
    customerMemberShipLevel = "",
    customerMemberShipDiscount = 0,
  } = cartValidated;

  if (isNonEmptyArray(promotionsSummary)) {
    let discountObject = {
      name: t("checkOutPage.discount", "Discount"),
    };
    const discountDetails = promotionsSummary?.map((item) => {
      return {
        name: item?.promotionName,
        value: formatTextNumber(-item?.promotionValue) + "đ",
      };
    });
    discountObject.details = discountDetails;
    promotionPopupData.push(discountObject);
  }

  if (customerDiscountAmount > 0) {
    let customerDiscountObject = {
      name: t("myProfile.myOrders.rank", "Hạng thành viên"),
      details: [
        {
          name: customerMemberShipLevel + ` (${customerMemberShipDiscount}%)`,
          value: formatTextNumber(-customerDiscountAmount) + "đ",
        },
      ],
    };
    promotionPopupData.push(customerDiscountObject);
  }

  return promotionPopupData;
}

function mappingCartValidatedToFeeAndTaxPopupData(cartValidated) {
  let feeAndTaxPopupData = [];
  const { taxes = [], fees = [] } = cartValidated;

  if (isNonEmptyArray(fees)) {
    let feeObject = {
      name: t("orderDetail.feeText", "Fee"),
    };
    const feeDetails = fees?.map((item) => {
      return {
        name: item?.name,
        value:
          (item?.isPercentage === true
            ? formatTextNumber((item?.value * cartValidated?.originalPrice) / 100)
            : formatTextNumber(item?.value)) + "đ",
      };
    });
    feeObject.details = feeDetails;
    feeAndTaxPopupData.push(feeObject);
  }

  if (isNonEmptyArray(taxes)) {
    let taxObject = {
      name: t("checkOutPage.tax", "Tax"),
    };
    const taxDetails = taxes?.map((item) => {
      return {
        name: item?.name,
        value: formatTextNumber(item?.value) + "đ",
      };
    });
    taxObject.details = taxDetails;
    feeAndTaxPopupData.push(taxObject);
  }

  return feeAndTaxPopupData;
}

const handleSaveOrderActionHistoryToLocal = (posCartItems, orderSessionData, actionType, message) => {
  let orderInfo = message;
  if (posCartItems) {
    orderInfo = posCartItems.map((orderItem) => {
      const { isCombo, options, toppings, name, quantity, products } = orderItem;
      if (isCombo) {
        return {
          isCombo,
          quantity: quantity,
          itemName: name ?? orderItem?.comboPricingName,
          orderItems: products?.map((item) => {
            const { name, options, quantity, toppings } = item;
            return {
              itemName: name,
              quantity: quantity,
              priceName: orderItem?.productPrice?.priceName,
              options: options
                ?.map((o) => {
                  const { name, optionLevelName } = o;
                  if (optionLevelName) {
                    return `${name} (${optionLevelName})`;
                  }
                  return `${name}`;
                })
                ?.join(", "),
              toppings: toppings?.map((t) => {
                return {
                  ...t,
                  itemName: t?.name,
                  quantity: t?.quantity,
                };
              }),
            };
          }),
        };
      } else {
        return {
          isCombo: false,
          quantity: quantity,
          itemName: name,
          orderItems: [
            {
              itemName: name,
              quantity: quantity,
              priceName: orderItem?.productPrice?.priceName,
              options: options
                ?.map((o) => {
                  const { name, optionLevelName } = o;
                  if (optionLevelName) {
                    return `${name} (${optionLevelName})`;
                  }
                  return `${name}`;
                })
                ?.join(", "),
              toppings: toppings?.map((t) => {
                return {
                  ...t,
                  itemName: t?.name,
                  quantity: t?.quantity,
                };
              }),
            },
          ],
        };
      }
    });
  }

  // Save history
  const history = {
    action: actionType,
    content: orderInfo,
  };

  orderService.saveOrderActionHistoryToLocalStorage(history, orderSessionData);
};

const mappingOrderDetailItem = (cartItem) => {
  const products = cartItem?.orderComboItem?.orderComboProductPriceItems?.map((x) => ({
    id: x?.productPriceId,
    name: x?.itemName,
    options: x?.orderItemOptions?.map((option) => ({
      ...option,
      id: option?.id,
      isSetDefault: true,
      name: option?.optionName,
    })),
    /// todo update toppings later
    toppings: [],
    productPrice: x?.productPrice,
    thumbnail: x?.productPrice?.product?.thumbnail,
    statusId: x?.statusId,
  }));

  const productPrice = {
    flashSaleId: null,
    id: cartItem?.productPriceId,
    isApplyPromotion: false,
    isPercentDiscount: cartItem?.isPromotionDiscountPercentage,
    discountValue: 0,
    isIncludedTopping: false,
    maximumLimit: 0,
    priceValue: cartItem?.productPrice?.priceValue,
    originalPrice: cartItem?.originalPrice,
    priceAfterDiscountInStore:
      cartItem?.priceAfterDiscountIncludeTopping / (cartItem?.quantity ? cartItem?.quantity : 1),
    promotionEndTime: null,
    totalOfToppingOriginalPrice: 0,
    totalOfToppingPrice: 0,
    productCategoryId: "",
    priceName: cartItem?.productPrice?.priceName,
  };

  const toppingProduct = cartItem?.orderItemToppings?.map((topping) => ({
    ...topping,
    name: topping?.toppingName,
    priceValue: topping?.priceAfterDiscount,
  }));

  return {
    isCombo: cartItem?.isCombo,
    comboTypeId: cartItem?.isCombo ? cartItem?.comboTypeId : null,
    name: cartItem?.isCombo ? cartItem?.productPriceName : cartItem?.productPrice?.product?.name,
    notes: cartItem?.notes,
    originalPrice: cartItem?.originalPrice,
    sellingPrice: cartItem?.priceAfterDiscountIncludeTopping,
    quantity: cartItem?.quantity,
    statusId: cartItem?.statusId,
    thumbnail: cartItem?.isCombo
      ? cartItem?.orderComboItem?.combo?.thumbnail
      : cartItem?.productPrice?.product?.thumbnail,
    products: cartItem?.isCombo ? products : null,
    totalOfToppingPrice: 0, ///update later
    productPrice: cartItem?.isCombo ? null : productPrice,
    toppings: toppingProduct,
    quantityCompleted: cartItem?.quantityCompleted,
  };
};

const getOrderedByIdAsync = async (orderId, branchId, isMergeCartItemsByStatus) => {
  const response = await orderDataService.getOrderDetailByIdAsync(orderId, branchId, isMergeCartItemsByStatus);
  return response;
};

/**
 *
 * @param {*} orderDetail
 * @returns true has permission edit order session
 */
function getPermissionToEditOrder(orderDetail) {
  if (!orderDetail) return true;
  return (
    orderDetail?.orderPaymentStatusId !== OrderPaymentStatus.Paid &&
    ![EnumOrderStatus.Completed, EnumOrderStatus.Canceled, EnumOrderStatus.Delivering].includes(orderDetail?.statusId)
  );
}

async function cleanCartAndOrderInQROrderAsync(callBack) {
  await new Promise((resolve) => {
    cleanPOSCartAsync();
    reduxService.dispatch(setPOSOrderDetail({}));
    resolve();
  });
  if (callBack) {
    callBack();
  }
}

function handleSetQrCodeReduxFromMyOrderDetail(orderDetailData, callBackQrCodeExist, callBackQrCodeNotExist) {
  const {
    id: orderId,
    code,
    stringCode,
    paymentMethodId: paymentMethod,
    qrCodeId,
    branchId,
    storeBranch,
    areaName,
    storeId,
    storeName,
    tableName,
    orderTypeFirstCharacter,
    storeLogo,
  } = orderDetailData;

  const locationBranch =
    orderDetailData?.storeBranch?.address.address1 +
    ", " +
    orderDetailData?.storeBranch?.address?.ward?.prefix +
    " " +
    orderDetailData?.storeBranch?.address?.ward?.name +
    ", " +
    orderDetailData?.storeBranch?.address?.district?.prefix +
    " " +
    orderDetailData?.storeBranch?.address?.district?.name +
    ", " +
    orderDetailData?.storeBranch?.address?.city?.name +
    ", " +
    orderDetailData?.storeBranch?.address?.country?.nicename;

  const branchName = storeBranch?.branchName;
  const areaTableName = areaName && tableName ? `${areaName} - ${tableName}` : "";
  const orderDetail = {
    orderId,
    code,
    stringCode,
    paymentMethod,
    qrOrderId: qrCodeId,
    branchId,
    branchName,
    areaName,
  };

  reduxService.dispatch(setPOSOrderDetail(orderDetail));

  if (qrCodeId) {
    if (callBackQrCodeExist) {
      callBackQrCodeExist();
    }
  } else {
    const qrCodeData = {
      storeId,
      branchId,
      storeLogo: storeLogo,
      storeName,
      branchName: `${storeName} - ${branchName}`,
      branchAddress: locationBranch,
      areaName: areaTableName,
      serviceTypeId: EnumOrderType.Instore,
      targetId: EnumTargetQRCode.ShopMenu,
      qrCodeStatus: EnumQRCodeStatus.Active,
      isStopped: false,
    };

    reduxService.dispatch(setQrCodeOrder(qrCodeData));

    const request = {
      orderId,
      code: `${orderTypeFirstCharacter}${code}`,
      stringCode,
      paymentMethod,
      qrOrderId: qrCodeId,
      branchId,
      branchName,
      areaName,
    };

    reduxService.dispatch(setPOSOrderDetail(request));

    if (callBackQrCodeNotExist) {
      callBackQrCodeNotExist();
    }
  }
}

const posCartService = {
  setStoreCartLocalStorage,
  setPOSCart,
  verifyAndUpdateCart,
  fetchProductListPageDataAsync,
  handleUpdateCartQuantity,
  handleDeleteCartItem,
  cleanPOSCartAsync,
  createOrderAsync,
  verifyDisCountCodeAsync,
  addDiscountCode,
  removeDiscountCode,
  addQRCodeProductsToCart,
  verifyProductInShoppingCartAsync,
  mappingCartValidatedToPromotionPopupData,
  mappingCartValidatedToFeeAndTaxPopupData,
  getOrderedByIdAsync,
  mappingOrderDetailItem,
  getPermissionToEditOrder,
  cleanCartAndOrderInQROrderAsync,
  createOrderSessionAsync,
  handleSetQrCodeReduxFromMyOrderDetail,
  handleSaveOrderActionHistory,
};

export default posCartService;
