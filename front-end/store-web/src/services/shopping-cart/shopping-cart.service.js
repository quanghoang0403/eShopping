import { t } from "i18next";
import moment from "moment";
import { comboType, guidIdEmptyValue } from "../../constants/combo.constants";
import { ThemeKeys } from "../../constants/config.constants";
import { EnumOrderMessageCode, EnumVerifyProductPromotionType } from "../../constants/enums";
import { ToastMessageType } from "../../constants/toast-message.constants";
import orderDataService from "../../data-services/order-data.service";
import productDataService from "../../data-services/product-data.service";
import { store } from "../../modules";
import {
  setAppliedDiscountCodes,
  setCartItems,
  setOrderInfo,
  setToastMessage,
} from "../../modules/session/session.actions";
import { setToastMessageDiscountCodeCheckout } from "../../modules/toast-message/toast-message.actions";
import { getStoreConfig, isNonEmptyArray } from "../../utils/helpers";
import { HttpStatusCode } from "../../utils/http-common";
import { getStorage, localStorageKeys } from "../../utils/localStorage.helpers";
import reduxService from "../redux.services";

const compareProduct = (firstProduct, secondProduct) => {
  let isTheSame = false;
  if (
    firstProduct?.id === secondProduct?.id &&
    firstProduct?.notes === secondProduct?.notes &&
    firstProduct?.productPrice?.flashSaleId === secondProduct?.productPrice?.flashSaleId &&
    firstProduct?.productPrice?.id === secondProduct?.productPrice?.id &&
    firstProduct?.options?.every((firstOption) => {
      return secondProduct?.options?.some((secondOption) => firstOption?.optionLevelId === secondOption?.optionLevelId);
    }) &&
    firstProduct?.toppings?.length === secondProduct?.toppings?.length &&
    firstProduct?.toppings?.every((firstTopping) => {
      return secondProduct?.toppings?.some(
        (secondTopping) => secondTopping?.id === firstTopping?.id && secondTopping?.quantity === firstTopping?.quantity,
      );
    })
  ) {
    isTheSame = true;
  }
  return isTheSame;
};

const compareCombo = (firstCombo, secondCombo) => {
  let isTheSame = false;
  if (!secondCombo?.isCombo || firstCombo?.comboTypeId !== secondCombo?.comboTypeId) {
    return isTheSame;
  }
  if (
    firstCombo?.id === secondCombo?.id &&
    firstCombo?.notes === secondCombo?.notes &&
    (firstCombo?.comboTypeId !== comboType.comboPricing.id ||
      (firstCombo?.comboPricingId && firstCombo?.comboPricingId === secondCombo?.comboPricingId))
  ) {
    isTheSame = firstCombo?.products?.every((firstProduct) => {
      return secondCombo?.products?.some((secondProduct) => compareProduct(firstProduct, secondProduct));
    });
  }
  return isTheSame;
};

const mergeProducts = (product, productList) => {
  if (productList && Array.isArray(productList)) {
    var index = product?.isCombo
      ? productList.findIndex((productItem) => {
          return compareCombo(product, productItem);
        })
      : productList.findIndex((productItem) => {
          return compareProduct(product, productItem);
        });
    if (index >= 0) {
      let productListNew = productList;
      productListNew[index].quantity += product?.quantity;
      return productListNew;
    } else {
      productList.push(product);
      return productList;
    }
  } else {
    return [product];
  }
};

/**
 * Revert original price of cart item storage in local
 * @param {*} cartItems get from endpoint calculate-product-cart-item
 * @returns shopping cart new
 */
const updateItemHasFlashSaleInCart = (cartItems) => {
  var productsAppliedFlashSaleFailed = cartItems.filter(
    (item) => !item?.isFlashSale && item?.flashSaleId !== null && item?.flashSaleId !== undefined,
  );
  let shoppingCartEdit = JSON.parse(localStorage.getItem(localStorageKeys.STORE_CART));
  let shoppingCartNew = [];
  productsAppliedFlashSaleFailed?.forEach((product) => {
    let indexEdit = shoppingCartEdit.findIndex(
      (cart) =>
        cart?.productPrice?.id === product?.productPriceId && cart?.productPrice?.flashSaleId === product?.flashSaleId,
    );
    if (indexEdit > -1) {
      let cartEdit = { ...shoppingCartEdit[indexEdit] };
      cartEdit = {
        ...cartEdit,
        productPrice: {
          ...cartEdit?.productPrice,
          priceValue: product?.priceAfterDiscount,
          originalPrice: product?.originalPrice,
          flashSaleId: null,
          totalOfToppingPrice:
            cartEdit?.productPrice?.totalOfToppingOriginalPrice ?? cartEdit?.productPrice?.totalOfToppingPrice,
        },
        toppings: [
          ...cartEdit?.toppings?.map((topping) => {
            return { ...topping, priceValue: topping?.originalPrice };
          }),
        ],
      };
      shoppingCartEdit.splice(indexEdit, 1);
      shoppingCartNew = [...mergeProducts(cartEdit, shoppingCartEdit)];
    }
  });
  localStorage.setItem(localStorageKeys.STORE_CART, JSON.stringify(shoppingCartNew));
  return shoppingCartNew;
};

const updateStoreCart = (product, callback) => {
  const storeCart = getStorage(localStorageKeys.STORE_CART);
  let objectStoreCart = JSON.parse(storeCart);
  let storeCartNew = [];
  if (objectStoreCart && objectStoreCart.length > 0) {
    storeCartNew = mergeProducts(product, objectStoreCart);
  } else {
    storeCartNew.push(product);
  }
  setStoreCartLocalStorage(storeCartNew);
  if (callback) {
    callback(storeCartNew);
  }

  return storeCartNew;
};

const setStoreCartLocalStorage = (cartItems) => {
  localStorage.setItem(localStorageKeys.STORE_CART, JSON.stringify(cartItems ?? []));
  reduxService.dispatch(setCartItems(cartItems));
};

const verifyProductInShoppingCartAsync = async (storeId, branchId, callback) => {
  const jsonStringStoreCart = localStorage.getItem(localStorageKeys.STORE_CART);
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

const compareProductInCart = (firstProduct, secondProduct) => {
  let isTheSame = false;
  if (
    firstProduct?.id === secondProduct?.productId &&
    firstProduct?.notes === secondProduct?.notes &&
    firstProduct?.productPrice?.id === secondProduct?.productPriceId &&
    firstProduct?.options?.every((firstOption) => {
      const checkOption = secondProduct?.options?.some(
        (secondOption) => firstOption?.optionLevelId === secondOption?.optionLevelId,
      );
      return checkOption;
    }) &&
    firstProduct?.toppings?.length === secondProduct?.toppings?.length &&
    firstProduct?.toppings?.every((firstTopping) => {
      const checkTopping = secondProduct?.toppings?.some(
        (secondTopping) =>
          secondTopping?.toppingId === firstTopping?.id && secondTopping?.quantity === firstTopping?.quantity,
      );
      return checkTopping;
    })
  ) {
    isTheSame = true;
  }
  return isTheSame;
};

const mappingOptionsCalculateToOptionsLocal = (options) => {
  const newOptions = options?.map((o) => ({
    id: o?.optionId,
    name: o?.optionName,
    isSetDefault: o?.isSetDefault,
    optionLevelId: o?.optionLevelId,
    optionLevelName: o?.optionLevelName,
  }));
  return newOptions;
};

const mappingComboCalculateToComboLocal = (data) => {
  const newCombo = {
    id: data?.combo?.comboId,
    comboTypeId:
      data?.combo?.comboPricingId && data?.combo?.comboPricingId !== guidIdEmptyValue
        ? comboType.comboPricing.id
        : comboType.comboProductPrice.id,
    comboPricingId: data?.combo?.comboPricingId ?? null,
    isOutOfStock: data?.isOutOfStock,
    availableQuantity: data?.availableQuantity,
    products: data?.combo?.comboItems?.map((item) => {
      return {
        id: item?.productId,
        name: item?.itemName,
        thumbnail: item?.thumbnail,
        productPrice: {
          id: item?.productPriceId,
        },
        options: mappingOptionsCalculateToOptionsLocal(item?.options),
        toppings: item?.toppings.map((topping) => ({
          id: topping?.toppingId,
          name: topping?.name,
          quantity: topping?.quantity,
          priceValue: topping?.priceAfterDiscount,
          originalPrice: topping?.originalPrice,
        })),
      };
    }),
    notes: data?.combo?.notes,
  };
  return newCombo;
};

const mappingProductCalculateToProductLocal = (data) => {
  let _flashSaleId = null;
  let _promotionEndTime = null;
  let _maximumLimit = 0;
  let _isIncludedTopping = data?.isIncludedTopping;
  let _totalOfToppingOriginalPrice = 0;
  let _totalOfToppingPrice = 0;

  if (data?.isFlashSale) {
    _flashSaleId = data?.flashSaleId;
    _promotionEndTime = data?.flashSale?.endDate;
    _maximumLimit = data?.flashSale?.maximumLimit;
    _isIncludedTopping = data?.flashSale?.isIncludedTopping;
  }

  const _toppings = data?.toppings?.map((item) => {
    // item?.originalPrice, item?.priceAfterDiscount is price * quantity
    _totalOfToppingOriginalPrice += item?.originalPrice;
    _totalOfToppingPrice += item?.priceAfterDiscount;

    return {
      id: item?.toppingId,
      name: item?.name,
      quantity: item?.quantity,
      originalPrice: item?.originalPricePerUnit,
      priceValue: item?.priceAfterDiscountPerUnit,
    };
  });
  const newProduct = {
    id: data?.productId,
    isCombo: false,
    isFlashSale: data?.isFlashSale,
    isPromotionProductCategory: false,
    isPromotionTotalBill: false,
    notes: data?.notes,
    name: data?.itemName,
    options: mappingOptionsCalculateToOptionsLocal(data?.options),
    isOutOfStock: data?.isOutOfStock,
    availableQuantity: data?.availableQuantity,
    productPrice: {
      flashSaleId: _flashSaleId,
      id: data?.productPriceId,
      isApplyPromotion: data?.promotions?.length > 0 ? true : false,
      isPercentDiscount: data?.isPercentDiscount,
      discountValue: data?.discountValue,
      isIncludedTopping: _isIncludedTopping,
      maximumLimit: _maximumLimit,
      originalPrice: data?.originalPrice,
      priceName: data?.productPriceName,
      priceValue: data?.priceAfterDiscount,
      priceAfterDiscountInStore: data?.priceAfterDiscountInStore,
      promotionTag: data?.promotionTag,
      promotionEndTime: _promotionEndTime,
      totalOfToppingOriginalPrice: _totalOfToppingOriginalPrice,
      totalOfToppingPrice: _totalOfToppingPrice,
      promotionId: data?.promotionId,
      productCategoryId: data?.productCategoryId,
    },
    quantity: data?.quantity,
    thumbnail: data?.thumbnail,
    toppings: _toppings,
    dataDetails: {},
  };
  return newProduct;
};

const updateItemInCart = (cartItems) => {
  var cartItemsAfterCalculate = cartItems;
  let shoppingCartEdit = JSON.parse(localStorage.getItem(localStorageKeys.STORE_CART));
  let shoppingCartNew = [];
  cartItemsAfterCalculate.forEach((product) => {
    if (product?.isCombo) {
      const _combo = mappingComboCalculateToComboLocal(product);
      let indexComboEdit = shoppingCartEdit.findIndex((cart) => {
        return compareCombo(_combo, cart);
      });
      if (indexComboEdit >= 0) {
        shoppingCartNew.push({
          ...shoppingCartEdit[indexComboEdit],
          quantity: product?.quantity,
          products: _combo?.products,
          isOutOfStock: _combo?.isOutOfStock,
          availableQuantity: _combo?.availableQuantity,
        });
      }
    } else {
      shoppingCartNew.push(mappingProductCalculateToProductLocal(product));
    }
  });
  localStorage.setItem(localStorageKeys.STORE_CART, JSON.stringify(shoppingCartNew));
  return shoppingCartNew;
};

const mappingOrderCartItem = (cartItem) => {
  return {
    id: cartItem?.id,
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
          customName: cartItem?.name,
          thumbnail: cartItem?.thumbnail,
          originalPrice: cartItem?.originalPrice,
          sellingPrice: cartItem?.sellingPrice,
          sellingPriceAfterDiscount: cartItem?.sellingPrice,
          quantity: cartItem?.quantity,
          notes: cartItem?.notes,
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
    isOutOfStock: cartItem?.isOutOfStock,
    availableQuantity: cartItem?.availableQuantity,
  };
};

const verifyCartAsync = async (request) => {
  const response = await productDataService.getProductCartItemAsync(request);
  return response;
};

/**
 *
 * @param {*} cartItems
 * @param {*} isCheckChangedData is true: will check if the old cartItems and the new cartItems are different.
 * @returns If is true, it has changed.
 */
const verifyAndUpdateCart = async (data) => {
  let {
    cartItems,
    isCheckChangedData,
    isActiveUsedPoint,
    deliveryFee,
    isCustomize,
    callBackCheckFlashSale,
    isCreateOrder = false,
    isShowToastMessageDiscountCode = false,
    isCheckoutPage = false,
    isChangeQuantity = false, //Use for show toast message when change quantity of product or delete product
  } = data;

  const reduxData = { ...reduxService.getAllData() };
  let isChangedProductPrice = false;

  if (!cartItems) {
    cartItems = reduxData?.cartItems;
  }
  const requestCartItems = cartItems?.map((item) => mappingOrderCartItem(item));

  const storeConfig = getStoreConfig();
  if (!storeConfig) {
    console.error("Không tìm thấy store config!");
  }
  const verifyCartRequest = {
    cartItems: requestCartItems ?? [],
    customerId: reduxData?.orderInfo?.deliveryInfo?.customerId ?? null,
    storeId: storeConfig?.storeId ?? null,
    branchId: reduxData?.deliveryAddress?.branchAddress?.id ?? null,
    skipCheckOrderItems: true,
    isRequestVerifyCartItems: isCheckChangedData ?? false,
    oldSignature: reduxData?.orderInfo?.cartValidated?.signature,
    discountCodes: isNonEmptyArray(reduxData?.discountCodes) ? reduxData?.discountCodes : [],
    isRequestFromStoreWeb: true,
    isActiveUsedPoint: isActiveUsedPoint,
    deliveryFee: deliveryFee > 0 ? deliveryFee : reduxData?.orderInfo?.shippingFee ?? 0,
    isCreateOrder: isCreateOrder,
  };

  await verifyCartAsync(verifyCartRequest)
    .then((response) => {
      if (response?.status === HttpStatusCode.Ok) {
        // update order info to redux after call to validate
        const newOrderInfo = {
          ...reduxData?.orderInfo,
          cartValidated: response.data,
        };
        if (isCheckChangedData) {
          isChangedProductPrice = newOrderInfo.cartValidated?.isChangedProductPrice;
        }
        //Check Flash Sale
        if (
          response?.data?.message?.code &&
          (response?.data?.message?.code === EnumOrderMessageCode.FlashSaleNotFound ||
            response?.data?.message?.code === EnumOrderMessageCode.FlashSaleInactive ||
            response?.data?.message?.code === EnumOrderMessageCode.FlashSaleMinimumPurchaseValue ||
            response?.data?.message?.code === EnumOrderMessageCode.FlashSaleOverLimited ||
            response?.data?.message?.code === EnumOrderMessageCode.FlashSaleHasBeenChanged)
        ) {
          let contentError = t(response?.data?.message?.descriptionTranslation);
          if (callBackCheckFlashSale) {
            callBackCheckFlashSale(contentError);
          }
        }
        reduxService.dispatch(setOrderInfo(newOrderInfo));
        let newItemInCart = updateItemInCart(response?.data?.cartItems);

        reduxService.dispatch(setCartItems(newItemInCart));

        const discountCodesApplied = response?.data?.promotionsSummary
          ?.filter((item) => item?.promotionType === EnumVerifyProductPromotionType.Discount)
          ?.map((item) => item?.promotionCode);
        // Check discount Code -> Toast message
        if (
          isNonEmptyArray(verifyCartRequest?.discountCodes) &&
          storeConfig?.themeId?.toString().toLowerCase() === ThemeKeys.PhoViet
        ) {
          if (
            response?.data?.message?.code &&
            (response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeExpired ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeMinimumPurchaseValue ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeOverLimited ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeOverLimitedPerCustomer ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeNotFound ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeBranchNotApplicable ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodePlatformNotApplicable ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeCannotAppliedWithFlashSale ||
              response?.data?.message?.code === EnumOrderMessageCode.HigherDiscountAmountBeingApplied ||
              response?.data?.message?.code === EnumOrderMessageCode.CanNotAppliedAnyItem ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountProductsNotAvailable ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountOrderNotAvailable ||
              response?.data?.message?.code === EnumOrderMessageCode.ProductIsBeingAppliedFlashSale)
          ) {
            const data = {
              isShow: true,
              message: isChangeQuantity
                ? t("promotion.discountCode.description.promotionHasBeenChanged")
                : t(response?.data?.message?.descriptionTranslation, response?.data?.message?.extraData),
              type: ToastMessageType.WARNING,
              duration: 3000,
              key: moment.now(),
            };
            store.dispatch(setToastMessage(data));
            store.dispatch(setAppliedDiscountCodes({}));
          } else if (isShowToastMessageDiscountCode) {
            const data = {
              isShow: true,
              message: t("promotion.discountCode.description.appliedSuccessfully"),
              type: ToastMessageType.SUCCESS,
              duration: 3000,
              key: moment.now(),
            };
            store.dispatch(setToastMessage(data));
          }
          const _discountCodesApplied = {
            updatedTime: moment.now(),
            discountCodes: discountCodesApplied,
          };
          store.dispatch(setAppliedDiscountCodes(_discountCodesApplied));
        } else if (
          isNonEmptyArray(verifyCartRequest?.discountCodes) &&
          storeConfig?.themeId?.toString().toLowerCase() === ThemeKeys.TropicalFruit
        ) {
          if (
            response?.data?.message?.code &&
            (response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeExpired ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeMinimumPurchaseValue ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeOverLimited ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeOverLimitedPerCustomer ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeNotFound ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeBranchNotApplicable ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodePlatformNotApplicable ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountCodeCannotAppliedWithFlashSale ||
              response?.data?.message?.code === EnumOrderMessageCode.HigherDiscountAmountBeingApplied ||
              response?.data?.message?.code === EnumOrderMessageCode.CanNotAppliedAnyItem ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountProductsNotAvailable ||
              response?.data?.message?.code === EnumOrderMessageCode.DiscountOrderNotAvailable ||
              response?.data?.message?.code === EnumOrderMessageCode.ProductIsBeingAppliedFlashSale)
          ) {
            if (isCheckoutPage) {
              const discountCodeData = {
                isShowToastMessage: true,
                message: isChangeQuantity
                  ? t("promotion.discountCode.description.promotionHasBeenChanged")
                  : t(response?.data?.message?.descriptionTranslation, response?.data?.message?.extraData),
              };
              store.dispatch(setToastMessageDiscountCodeCheckout(discountCodeData));
            }
          } else if (isShowToastMessageDiscountCode) {
            if (isCheckoutPage) {
              const discountCodeData = {
                isShowToastMessage: true,
                message: t("promotion.discountCode.description.appliedSuccessfully"),
                type: ToastMessageType.SUCCESS,
              };
              store.dispatch(setToastMessageDiscountCodeCheckout(discountCodeData));
            }
          }
          const _discountCodesApplied = {
            updatedTime: moment.now(),
            discountCodes: discountCodesApplied,
          };
          store.dispatch(setAppliedDiscountCodes(_discountCodesApplied));
        }

        if (!isNonEmptyArray(verifyCartRequest?.discountCodes)) {
          const _discountCodesApplied = {
            updatedTime: moment.now(),
            discountCodes: [],
          };
          store.dispatch(setAppliedDiscountCodes(_discountCodesApplied));
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

const removeOutOfStockCartItem = (shoppingCart) => {
  let outOfStockIndexes = [];
  let newCartItems = [...shoppingCart];
  newCartItems.forEach((item, index) => {
    if (item.isOutOfStock === true) {
      if (item.availableQuantity > 0 && item.availableQuantity < item.quantity) {
        item.quantity = item.availableQuantity;
      } else {
        outOfStockIndexes.push(index);
      }
    }
  });

  outOfStockIndexes.sort((a, b) => b - a);
  outOfStockIndexes.forEach((index) => {
    if (index >= 0 && index < newCartItems.length) {
      newCartItems.splice(index, 1);
    }
  });

  return newCartItems;
};

/**
 *
 * @param {*} data
 * @param {*} isVerifyCart is true : will call api calculate-product-cart-item to verify. Then set store cart according to verified data.
 */
const setStoreCart = (data, isVerifyCart, deliveryFee = 0) => {
  if (isVerifyCart) {
    const dataRequest = {
      cartItems: data,
      isCheckChangedData: false,
      isActiveUsedPoint: window.isUsePoint,
      deliveryFee: deliveryFee,
    };
    verifyAndUpdateCart(dataRequest);
  } else {
    store.dispatch(setCartItems(data));
  }
};

const shoppingCartService = {
  updateItemHasFlashSaleInCart,
  updateStoreCart,
  verifyProductInShoppingCartAsync,
  setStoreCartLocalStorage,
  updateItemInCart,
  verifyAndUpdateCart,
  setStoreCart,
  compareProduct,
  mergeProducts,
  compareCombo,
  mappingOrderCartItem,
  mappingComboCalculateToComboLocal,
  mappingProductCalculateToProductLocal,
  removeOutOfStockCartItem,
};

export default shoppingCartService;
