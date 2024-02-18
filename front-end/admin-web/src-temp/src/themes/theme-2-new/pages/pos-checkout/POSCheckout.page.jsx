import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ToastMessageType } from "../../../constants/toast-message.constants";
import { store } from "../../../modules/index";
import { posDiscountCodesSelector, qrOrderSelector } from "../../../modules/order/order.reducers";
import {
  setDeliveryAddress,
  setPOSCartItems,
  setPackageExpiredInfo,
  setToastMessage,
} from "../../../modules/session/session.actions";
import { toastMessageSelector } from "../../../modules/session/session.reducers";
import { setToastMessageMaxDiscount } from "../../../modules/toast-message/toast-message.actions";
import { useAppCtx } from "../../../providers/app.provider";
import maxDiscountService from "../../../services/max-discount.services";
import orderService from "../../../services/orders/order-service";
import posCartService from "../../../services/pos/pos-cart.services";
import PackageExpiredDialog from "../../../shared/components/package-expired-dialog/package-expired-dialog.component";
import { checkNonEmptyArray } from "../../../utils/helpers";
import { getStorage, localStorageKeys, setStorage } from "../../../utils/localStorage.helpers";
import {
  CheckCircleIcon,
  DiscountCodeScanQrCodeIcon,
  ScanQRCodeSuccessfully,
  WarningDiscountCodeIcon,
} from "../../assets/icons.constants";
import checkoutAddIcon from "../../assets/icons/checkout-add.svg";
import { ReactComponent as OrderNote } from "../../assets/icons/note-icon.svg";
import BtnSelectDiscountCode from "../../components/btn-select-discount-code/btn-select-discount-code";
import CartProductDetailComponent from "../../components/cart-checkout-scan-qrcode/cart-product-detail.component";
import HeaderCartCheckout from "../../components/cart-checkout-scan-qrcode/header-cart-checkout.component";
import ConfirmationDialog from "../../components/confirmation-dialog/confirmation-dialog.component";
import CustomizeDialog from "../../components/customize-dialog/customize-dialog.component";
import PromotionListComponent from "../../components/promotion-list/promotion-list.component";
import { EnumPromotion } from "../../constants/enum";
import DialogCloseBranchContainer from "../../containers/close-branch/dialog-close-branch.container";
import { useSearchParams } from "../../hooks";
import { CheckoutSummary } from "../checkout/components/checkout-summary/checkout-summary.component";
import { ReactComponent as NoteIcon } from "../checkout/components/note-icon.svg";
import "./POSCheckout.style.scss";

const DEPAUSE_METHOD_TIME = 100; // miliseconds

function POSCheckoutPage(props) {
  const { fontFamily } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const nearestStoreBranches = useSelector((state) => state?.session?.nearestStoreBranches);
  const currentOrderInfo = store.getState().session?.orderInfo;
  const translateData = {
    pay: t("checkOutPage.pay", "Pay"),
    gotIt: t("storeWebPage.generalUse.gotIt", "Got it!"),
    selectAddressSuccessful: t("checkOutPage.selectAddressSuccessful", "Select address successful"),
    orderNote: t("storeWebPage.editOrderItem.noteAMessageForTheStore", "Nhập ghi chú"),
    promotion: t("checkOutPage.promotion", "Khuyến mãi"),
    useDiscountMessage: t("checkOutPage.useDiscountMessage", "Sử dụng giảm giá"),
    discountHasBeenApplied: t("promotion.discountCode.description.success", "Đã áp dụng giảm giá"),
    verifyCustomerRank: t(
      "checkOutPage.verifyCustomerRank",
      "Cấu hình hạng thành viên đã có thay đổi, vui lòng kiểm tra lại đơn hàng.",
    ),
    notification: t("storeWebPage.generalUse.notification", "Thông báo"),
    emptyCart: t("checkOutPage.emptyCart", "Không có gì trong giỏ hàng của bạn"),
    appliedSuccess: t("promotion.discountCode.description.appliedSuccess", "Mã giảm giá được áp dụng thành công."),
    confirmation: t("order.confirmation"),
    qrCodeIsOnlyValidAt: t(
      "messages.qrCodeIsOnlyValidAt",
      "Mã QR này chỉ khả dụng ở chi nhánh <strong>{{branchName}}</strong>",
    ),
    doYouWantToClearCartAndSwitchToThatBranch: t(
      "messages.doYouWantToClearCartAndSwitchToThatBranch",
      "Bạn có muốn xóa giỏ hàng và chuyển qua chi nhánh này không?",
    ),
    switchBranch: t("button.switchBranch"),
    no: t("button.no"),
    backToActionPage: t("button.backToActionPage"),
    returnToHomePage: t("button.returnToHomePage"),
    tableBeingUse: t("messages.tableBeingUse"),
  };

  const storageConfig = JSON.parse(getStorage("config"));
  const mockupCustomize = storageConfig.customizeTheme;
  const [disablePayButton, setDisablePayButton] = useState(true);
  const [isCreateOrderProcessing, setIsCreateOrderProcessing] = useState(false);
  const [isHiddenPromotion, setIsHiddenPromotion] = useState(false);
  const [orderResponseData, setOrderResponseData] = useState(null);
  const [isShowVerifyProductPriceDialog, setIsShowVerifyProductPriceDialog] = useState(false);
  const [isShowVerifyMembershipDiscount, setIsShowVerifyMembershipDiscount] = useState(false);
  const [isShowDiscountCodeDialog, setIsShowDiscountCodeDialog] = useState(false);
  const [isDiscountCodeSuccess, setIsDiscountCodeSuccess] = useState(false);

  /// Order info
  const [orderNotes, setOrderNotes] = useState("");
  const [shoppingCart, setShoppingCart] = useState([]);

  const cartItemsInRedux = useSelector((state) => state.session.posCartItems);
  const discountCodesInRedux = useSelector(posDiscountCodesSelector);
  const reduxQROrder = useSelector(qrOrderSelector);
  const isShowToastMessageDiscountCodes = useSelector(toastMessageSelector);
  const { Toast } = useAppCtx();
  const query = useSearchParams();
  const qrCodeId = query.get("qrCodeId");
  const paramIsLoadData = "isLoadData";
  const isLoadQRCodeData = query.get(paramIsLoadData);
  const [itemsWillRemove, setItemsWillRemove] = useState(null);
  const [cartFromLocalStore, setCartFromLocalStore] = useState([]);
  const [checkTable, setCheckTable] = useState(false);
  const [isShowNotifyDialogCloseBranch, setIsShowNotifyDialogCloseBranch] = useState(false);

  useEffect(() => {
    posCartService.verifyAndUpdateCart();
  }, [discountCodesInRedux]);

  useEffect(() => {
    setDisablePayButton(false);
  }, [shoppingCart]);

  useEffect(() => {
    setShoppingCart(cartItemsInRedux);
    posCartService.setStoreCartLocalStorage(cartItemsInRedux);
  }, [cartItemsInRedux]);

  useEffect(() => {
    if (isShowToastMessageDiscountCodes?.isShow) {
      setTimeout(function () {
        const toastMessageEmpty = {
          isShow: false,
          message: "",
          type: "",
          duration: 3000,
        };
        dispatch(setToastMessage(toastMessageEmpty));
      }, isShowToastMessageDiscountCodes?.duration ?? 3000);
      setIsDiscountCodeSuccess(false);
      Toast.show({
        messageType: isShowToastMessageDiscountCodes?.type,
        message: t(isShowToastMessageDiscountCodes?.message),
        icon:
          isShowToastMessageDiscountCodes?.type === ToastMessageType.WARNING ? (
            <WarningDiscountCodeIcon />
          ) : (
            <DiscountCodeScanQrCodeIcon />
          ),
        placement: "bottom",
        duration: 3,
      });
    }
  }, [isShowToastMessageDiscountCodes]);

  useEffect(() => {
    store?.dispatch(setPackageExpiredInfo(null));
    if (qrCodeId) {
      //check scan qr code add product to cart. reload page no add product to cart
      if (qrCodeId !== reduxQROrder?.qrCodeId || isLoadQRCodeData === "true") {
        fetchQRCodeData(qrCodeId).then((isSuccess) => {
          if (isSuccess) {
            handleAddProductToCartFirst();
          } else {
            goToHomePage();
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    store?.dispatch(setPackageExpiredInfo(null));
    const updateCart = async () => {
      if (cartFromLocalStore.length > 0) await posCartService.verifyAndUpdateCart(cartFromLocalStore);
    };
    updateCart();
  }, [cartFromLocalStore]);

  function handleAddProductToCartFirst() {
    if (cartItemsInRedux?.length > 0) {
      verifyPosCart(reduxQROrder?.branchId);
    }
    handleAddProductToCartSuccess();
  }

  function handleAddProductToCartSuccess() {
    posCartService.addQRCodeProductsToCart();
    query.delete(paramIsLoadData);
    history.replace({
      search: query.toString(),
    });
    Toast.show({
      messageType: "success",
      message: t("messages.scanQRCodeSuccessfully"),
      icon: <CheckCircleIcon />,
      placement: "bottom",
      duration: 3,
    });
  }

  function goToHomePage() {
    posCartService.cleanPOSCartAsync(history.push("/"));
    Toast.show({
      messageType: "warning",
      message: t("messages.qrCodeIsNotAvailable"),
      icon: <ScanQRCodeSuccessfully />,
      placement: "bottom",
      duration: 3,
    });
  }

  async function fetchQRCodeData(qrCodeId) {
    if (qrCodeId) {
      const response = await orderService.getQrCodeOrderAsync(qrCodeId);
      return response;
    }
  }

  const verifyPosCart = (storeBranchSelected) => {
    if (window.verifyPosCart) {
      clearTimeout(window.verifyPosCart);
    }
    window.verifyPosCart = setTimeout(async () => {
      const branchId = storeBranchSelected;
      const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
      const storeConfig = JSON.parse(jsonConfig);
      const storeId = storeConfig.storeId;

      const response = await posCartService.verifyProductInShoppingCartAsync(
        storeId,
        branchId,
        onDisplayItemWillRemoveFromCart,
      );
      setCartFromLocalStore(response?.newStoreCart);
    }, 1000);
  };

  const onDisplayItemWillRemoveFromCart = (itemsWillRemove) => {
    setItemsWillRemove(itemsWillRemove);
  };

  const calculateShoppingCart = (cartItems) => {
    depauseMethod("callApiValidateCartItems", DEPAUSE_METHOD_TIME, () => {
      callApiValidateCartItems(false, cartItems, false);
    });
  };

  const depauseMethod = (methodName, timeout, callBack) => {
    if (window[methodName]) {
      clearTimeout(window[methodName]);
    }

    window[methodName] = setTimeout(() => {
      if (callBack) {
        callBack();
      }
    }, timeout);
  };

  //#endregion

  const calculateDiscount = (price, promotion, currentDiscountValue = null) => {
    if (promotion && promotion?.isPercentDiscount) {
      let discountValue = (price * promotion?.percentNumber) / 100;
      if (promotion?.maximumDiscountAmount == 0) {
        return discountValue;
      }

      if (currentDiscountValue) {
        if (currentDiscountValue == promotion?.maximumDiscountAmount) {
          return 0;
        }

        return discountValue >= promotion?.maximumDiscountAmount
          ? promotion?.maximumDiscountAmount - currentDiscountValue
          : discountValue - currentDiscountValue;
      }
      if (promotion?.maximumDiscountAmount > 0) {
        return discountValue >= promotion?.maximumDiscountAmount ? promotion?.maximumDiscountAmount : discountValue;
      }

      return discountValue;
    } else {
      if (currentDiscountValue && currentDiscountValue <= promotion?.maximumDiscountAmount) {
        return promotion?.maximumDiscountAmount - currentDiscountValue;
      }

      return promotion.maximumDiscountAmount;
    }
  };

  const FindMaxPromotion = (promotions, price) => {
    let maxPromotion = null;
    let discountValue = 0;
    for (let i = 0; i < promotions.length; i++) {
      let promotion = promotions[i];
      let maxDiscount = calculateDiscount(price, promotion);
      if (maxDiscount >= discountValue) {
        discountValue = maxDiscount;
        maxPromotion = promotion;
      }
    }
    // Promotion value cannot be greater than product value
    if (discountValue > price) {
      discountValue = price;
    }

    return { maxPromotion, discountValue };
  };

  //Update shoppingcart when user click + or - button
  const onUpdateCartQuantity = (id, quantity, cartIndex) => {
    if (!shoppingCart || shoppingCart.length === 0) return;
    let data = shoppingCart;
    data = data.map((cart, index) =>
      cart.id === id && index === cartIndex ? { ...cart, quantity: Math.max(cart.quantity + quantity, 0) } : cart,
    );

    calculateShoppingCart(data);

    /// Handle calculation max discount
    let maximumDiscountAmount = data[cartIndex]?.productPrice?.maximumDiscountAmount;
    let totalPriceValue = data[cartIndex]?.quantity * data[cartIndex]?.productPrice?.priceValue;
    let isIncludedTopping = data[cartIndex]?.productPrice?.isIncludedTopping;
    // Discount total bill
    if (data[cartIndex]?.isFlashSale === false && data[cartIndex]?.isPromotionTotalBill) {
      var totalAmountOriginalPrice = data
        ?.filter((cart) => cart.isCombo === false)
        ?.reduce((amount, cartList) => {
          return (
            amount +
            (cartList?.productPrice?.originalPrice || 0) * cartList?.quantity +
            (cartList?.sellingPrice || 0) * cartList?.quantity
          );
        }, 0);
      const promotions = currentOrderInfo?.cartValidated?.promotions.filter(
        (p) => p.promotionType === EnumPromotion.DiscountTotal,
      );
      const { maxPromotion } = FindMaxPromotion(promotions, totalAmountOriginalPrice);
      maximumDiscountAmount = maxPromotion?.maximumDiscountAmount;
      isIncludedTopping = maxPromotion?.isIncludedTopping;
      // IsIncludedTopping
      if (maxPromotion?.isIncludedTopping === true) {
        totalAmountOriginalPrice = data
          ?.filter((cart) => cart.isCombo === false)
          ?.reduce((amount, cartList) => {
            return (
              amount +
              (cartList?.productPrice?.originalPrice || 0) * cartList?.quantity +
              (cartList?.sellingPrice || 0) * cartList?.quantity +
              (cartList?.productPrice?.totalOfToppingPrice || 0) * cartList?.quantity +
              (cartList?.totalOfToppingPrice || 0) * cartList?.quantity
            );
          }, 0);
      }
      //Total amount
      totalPriceValue = (totalAmountOriginalPrice * maxPromotion?.percentNumber) / 100;
    } else if (data[cartIndex]?.isPromotionProductCategory) {
      // Discount product category
      const productCategoryId = data[cartIndex]?.dataDetails?.product?.productDetail?.productCategoryId;
      let newCartItemsCategory = data?.filter(
        (item) =>
          item?.dataDetails?.product?.productDetail?.productCategoryId === productCategoryId && item?.isCombo === false,
      );
      totalAmountOriginalPrice = newCartItemsCategory?.reduce((amount, cartList) => {
        return (
          amount +
          (cartList?.productPrice?.originalPrice || 0) * cartList?.quantity +
          (cartList?.sellingPrice || 0) * cartList?.quantity
        );
      }, 0);

      const promotionCategories = currentOrderInfo?.cartValidated?.promotions.filter(
        (p) =>
          p.promotionType === EnumPromotion.DiscountProductCategory &&
          p.listPromotionProductCategory.find((cate) => cate === productCategoryId),
      );
      const { maxPromotion } = FindMaxPromotion(promotionCategories, totalAmountOriginalPrice);
      maximumDiscountAmount = maxPromotion?.maximumDiscountAmount;
      isIncludedTopping = maxPromotion?.isIncludedTopping;
      // IsIncludedTopping
      if (maxPromotion?.isIncludedTopping === true) {
        totalAmountOriginalPrice = newCartItemsCategory?.reduce((amount, cartList) => {
          return (
            amount +
            (cartList?.productPrice?.originalPrice || 0) * cartList?.quantity +
            (cartList?.sellingPrice || 0) * cartList?.quantity +
            (cartList?.productPrice?.totalOfToppingPrice || 0) * cartList?.quantity +
            (cartList?.totalOfToppingPrice || 0) * cartList?.quantity
          );
        }, 0);
      }
      //Total amount
      totalPriceValue = (totalAmountOriginalPrice * maxPromotion?.percentNumber) / 100;
    }
    const dataDiscount = {
      isFlashSale: data.some((item) => Boolean(item?.productPrice) && item?.productPrice["flashSaleId"]) ?? false, //Check null for productPrice
      isApplyPromotion: data[cartIndex]?.productPrice?.isApplyPromotion,
      isIncludedTopping: isIncludedTopping,
      isDiscountTotal: currentOrderInfo?.cartValidated?.isDiscountOnTotal,
      totalPriceValue: totalPriceValue,
      maximumDiscountAmount: maximumDiscountAmount,
    };
    maxDiscountService.calculationMaxDiscountService(
      dataDiscount,
      () => {
        dispatch(setToastMessageMaxDiscount(true));
      },
      () => {
        dispatch(setToastMessageMaxDiscount(false));
      },
    );
  };

  const onDeleteProduct = (id, cartIndex) => {
    if (!shoppingCart || shoppingCart.length === 0) return;
    let data = [...shoppingCart];
    data.splice(cartIndex, 1);
    dispatch(setPOSCartItems(data));
    setShoppingCart(data);
    calculateShoppingCart(data);
  };

  const addMoreProducts = () => {
    history.push("/pos");
  };

  const mappingOrderCartItem = (cartItem) => {
    return {
      orderItemId: null,
      dataDetails: cartItem?.dataDetails,
      productPriceId: cartItem?.productPrice?.id,
      flashSaleId: cartItem?.productPrice?.flashSaleId,
      quantity: cartItem?.quantity,
      notes: cartItem?.notes ?? "",
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
            comboName: cartItem?.name,
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

  const callApiValidateCartItems = async (isCheckChangedData, cartItems, isActiveUsedPoint) => {
    let isChangedProductPrice = false;
    if (!cartItems || cartItems?.length === 0) {
      const reduxState = store.getState();
      const session = reduxState?.session;
      cartItems = session?.posCartItems ?? [];
    }

    const orderInfo = getOrderInfo();

    var deliveryFees = 0;
    if (orderInfo?.shippingFee) {
      deliveryFees = orderInfo?.shippingFee;
    }

    setDisablePayButton(false);

    // Get data from redux to verify. Done then save to local storage and redux.
    isChangedProductPrice = await posCartService.verifyAndUpdateCart(
      cartItems,
      isCheckChangedData,
      isActiveUsedPoint,
      deliveryFees,
    );

    return isChangedProductPrice;
  };

  const getOrderInfo = () => {
    const reduxState = store.getState();
    const session = reduxState?.session;
    const requestCartItems = session?.posCartItems?.map((item) => mappingOrderCartItem(item));
    const orderInfo = {
      ...session?.orderInfo,
      cartItems: requestCartItems ?? [],
      orderNotes: orderNotes,
      deliveryAddress: { ...session?.deliveryAddress },
    };

    return orderInfo;
  };

  const checkChangeDiscountMembershipLevel = (orderInfor, membershipDiscount) => {
    if (
      orderInfor?.customerId === membershipDiscount?.customerId &&
      orderInfor?.customerMemberShipLevel === membershipDiscount?.customerMemberShipLevel &&
      orderInfor?.customerMemberShipDiscount === membershipDiscount?.customerMemberShipDiscount &&
      orderInfor?.customerMemberShipMaxDiscount === membershipDiscount?.customerMemberShipMaxDiscount
    ) {
      return false;
    } else {
      return true;
    }
  };

  const submitCreateOrder = async () => {
    if (isCreateOrderProcessing) return;
    setIsCreateOrderProcessing(true);
    const request = {
      notes: orderNotes,
    };
    var response = await posCartService.createOrderAsync(request);
    setIsCreateOrderProcessing(false);
    if (response?.isSuccess) {
      const responseData = response.data;
      setOrderResponseData(responseData);
      const emptyCart = [];
      posCartService.setStoreCartLocalStorage(emptyCart);
      setShoppingCart([]);
      calculateShoppingCart();
      Toast.show({
        messageType: "success",
        message: t("order.orderIsCreated"),
        icon: <CheckCircleIcon />,
        placement: "bottom",
        duration: 3,
      });
      posCartService.cleanPOSCartAsync(history.push("/"));
    } else {
      setCheckTable(true);
    }
  };

  const handleCallback = () => {
    setIsShowNotifyDialogCloseBranch(false);
    submitCreateOrder();
  };

  const handleOkayVerifyProductPrice = () => {
    setIsShowVerifyProductPriceDialog(false);
    callApiValidateCartItems(false, null, false);
  };

  const handleOkayVerifyMembershipDiscount = () => {
    setIsShowVerifyMembershipDiscount(false);
    callApiValidateCartItems(false, null, false);
  };

  const CreateOrderButton = () => {
    return (
      <div className="button-create-order-and-payment">
        <Button
          loading={isCreateOrderProcessing}
          className="pay-button"
          onClick={() => setIsShowNotifyDialogCloseBranch(true)}
          disabled={disablePayButton || isCreateOrderProcessing || shoppingCart?.length === 0}
        >
          {translateData.pay}
        </Button>
      </div>
    );
  };

  function hiddenPromotion(value) {
    setIsHiddenPromotion(value);
  }

  const changeDiscountCodeBeingApplied = (code) => {
    handleCloseDiscountCodeDialog();
    posCartService.addDiscountCode(code);
    successfulDiscountCode();
  };

  const handleCloseDiscountCodeDialog = () => {
    setIsShowDiscountCodeDialog(false);
  };
  const successfulDiscountCode = () => {
    handleCloseDiscountCodeDialog();
    setTimeout(() => {
      setIsDiscountCodeSuccess(false);
    }, 1500);
    setIsDiscountCodeSuccess(true);
  };

  const ToastMessageDiscountCodeSuccess = () => {
    return (
      <>
        {isDiscountCodeSuccess && (
          <div className="toast-message-scan-qr-code">
            <div className="toast-message-discount-code-scan-qr-code">
              <DiscountCodeScanQrCodeIcon />
              <span>{translateData.appliedSuccess}</span>
            </div>
          </div>
        )}
      </>
    );
  };

  const handleConfirmDialogSwitchBranch = () => {
    posCartService.setStoreCartLocalStorage([]);
    dispatch(setPOSCartItems([]));
    handleSwitchBranch();
    handleAddProductToCartSuccess();
    setItemsWillRemove(null);
  };

  const handleCancelDialogSwitchBranch = () => {
    setItemsWillRemove(null);
    addMoreProducts();
  };

  const handleSwitchBranch = () => {
    const branchSelected = nearestStoreBranches?.find((x) => x.branchId !== reduxQROrder?.branchId);
    const currentDeliveryAddress = {
      ...deliveryAddress,
      receiverAddress: deliveryAddress?.receiverAddress,
      branchAddress: branchSelected,
    };
    dispatch(setDeliveryAddress(currentDeliveryAddress));
  };

  const handleBackToActionPage = () => {
    history.push(`/action-page?qrCodeId=${reduxQROrder?.qrCodeId}`);
  };
  const handleBackToHomePage = () => {
    const emptyCart = [];
    posCartService.setStoreCartLocalStorage(emptyCart);
    setShoppingCart([]);
    posCartService.cleanPOSCartAsync(history.push("/"));
  };

  return (
    <>
      <ConfirmationDialog
        {...props}
        className={"confirm-modal-qr-config"}
        title={translateData.confirmation}
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: `${t(translateData.qrCodeIsOnlyValidAt, {
                branchName: reduxQROrder?.branchName,
              })}. 
                  ${translateData.doYouWantToClearCartAndSwitchToThatBranch}`,
            }}
          />
        }
        open={itemsWillRemove && itemsWillRemove?.length > 0}
        okText={translateData.switchBranch}
        cancelText={translateData.no}
        onCancel={() => handleCancelDialogSwitchBranch()}
        onConfirm={() => handleConfirmDialogSwitchBranch()}
      />
      <ConfirmationDialog
        {...props}
        className={"modal-confirm-table-being-used-theme2"}
        title={translateData.confirmation}
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: `${t(translateData.tableBeingUse, {
                area: reduxQROrder?.areaName,
              })}. `,
            }}
          />
        }
        open={checkTable}
        okText={translateData.backToActionPage}
        onConfirm={() => handleBackToActionPage()}
        cancelText={translateData.returnToHomePage}
        onCancel={() => handleBackToHomePage()}
      />
      {/* Verify product price dialog */}
      <ConfirmationDialog
        {...props}
        open={isShowVerifyProductPriceDialog}
        onCancel={() => {}}
        onConfirm={handleOkayVerifyProductPrice}
        confirmLoading={false}
        className="checkout-theme2-notify-dialog"
        content={"Product price(s) has been changed, please reload to see the latest prices or promotions."}
        footer={[
          <Button className="ant-btn-primary btn-got-it" onClick={handleOkayVerifyProductPrice}>
            {"Okay"}
          </Button>,
        ]}
      />
      {/* Verify Membership Discount */}
      <ConfirmationDialog
        {...props}
        open={isShowVerifyMembershipDiscount}
        onCancel={() => {}}
        onConfirm={handleOkayVerifyMembershipDiscount}
        confirmLoading={false}
        className="checkout-theme2-notify-dialog"
        title={translateData.notification}
        content={translateData.verifyCustomerRank}
        footer={[
          <Button className="ant-btn-primary btn-got-it" onClick={handleOkayVerifyMembershipDiscount}>
            {"Okay"}
          </Button>,
        ]}
      />
      {/* Discount code dialog */}
      <CustomizeDialog
        {...props}
        className="discount-code-instore"
        title={<span style={{ fontFamily: fontFamily }}>{translateData.promotion}</span>}
        open={isShowDiscountCodeDialog && !isHiddenPromotion}
        closable={true}
        forceRenderContent
        content={() => (
          <PromotionListComponent
            {...props}
            hiddenPromotion={hiddenPromotion}
            callBack={handleCloseDiscountCodeDialog}
            isPos={true}
            branchIdPos={reduxQROrder?.branchId}
            isShowInputDiscountCode={true}
            discountCodesPos={discountCodesInRedux}
          />
        )}
        onCancel={() => {
          handleCloseDiscountCodeDialog();
        }}
        footer={null}
      />
      <div id="themeCheckoutCheckout" style={{ fontFamily: fontFamily }}>
        <div>
          <div className="check_out_theme2_container page-container pos-page">
            <CartProductDetailComponent
              {...props}
              shoppingCart={shoppingCart}
              checkoutAddIcon={checkoutAddIcon}
              addMoreProducts={addMoreProducts}
              mockupCustomize={mockupCustomize}
              onUpdateCartQuantity={onUpdateCartQuantity}
              onDeleteProduct={onDeleteProduct}
              setShoppingCart={setShoppingCart}
              isCart={false}
              branchId={reduxQROrder?.branchId}
            />

            {/* Right side */}
            <div className="check_out_shipping">
              <div className="mb-24 note">
                <Input
                  className="note-input"
                  prefix={orderNotes ? <OrderNote /> : <NoteIcon />}
                  placeholder={translateData.orderNote}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  maxLength={255}
                />
              </div>
              <div className="w-100">
                <BtnSelectDiscountCode
                  title={
                    checkNonEmptyArray(discountCodesInRedux)
                      ? translateData.discountHasBeenApplied
                      : translateData.useDiscountMessage
                  }
                  onClick={() => {
                    setIsShowDiscountCodeDialog(true);
                  }}
                  isApply={discountCodesInRedux.length > 0}
                />
              </div>

              <div className="mb-24">
                <CheckoutSummary calculateShoppingCart={calculateShoppingCart} isPos={true} />
              </div>
              <CreateOrderButton />
              <ToastMessageDiscountCodeSuccess />
              {isShowNotifyDialogCloseBranch && (
                <DialogCloseBranchContainer
                  callback={handleCallback}
                  open={isShowNotifyDialogCloseBranch}
                  onClose={setIsShowNotifyDialogCloseBranch}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function POSCheckout(props) {
  const { fontFamily } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const login = () => {
    setStorage(localStorageKeys.CHECK_OUT_SCAN_QR_CODE, true);
    history.push("/login");
  };

  const getLogin = () => {
    store?.dispatch(setPackageExpiredInfo(null));
    posCartService.verifyAndUpdateCart();
    const loginData = getStorage(localStorageKeys.LOGIN);
    return loginData;
  };
  return (
    <>
      <ConfirmationDialog
        {...props}
        open={!getLogin()}
        onCancel={login}
        onConfirm={login}
        confirmLoading={false}
        className="modal_login_theme2"
        content={t("checkOutPage.loginMessage")}
        title={<span style={{ fontFamily: fontFamily }}>{t("checkOutPage.login")}</span>}
        footer={[
          <Button className="modal_login_button" type="primary" style={{ fontFamily: fontFamily }} onClick={login}>
            {t("checkOutPage.login")}
          </Button>,
        ]}
      />
      <HeaderCartCheckout {...props} title={t("orderDetail.btnCheckOut")} />
      <POSCheckoutPage {...props} />
      <PackageExpiredDialog />
    </>
  );
}
