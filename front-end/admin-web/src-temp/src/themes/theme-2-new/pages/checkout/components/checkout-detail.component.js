import { Button, Input, message } from "antd";
import jwt_decode from "jwt-decode";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Platform } from "../../../../constants/platform.constants";
import branchDataService from "../../../../data-services/branch-data.services";
import customerDataService from "../../../../data-services/customer-data.service";
import deliveryDataService from "../../../../data-services/delivery-data.service";
import orderDataService from "../../../../data-services/order-data.service";
import paymentDataService from "../../../../data-services/payment-data.service";
import paymentMethodDataService from "../../../../data-services/paymentMethod-data.service";
import { store } from "../../../../modules/index";
import {
  setCartItems,
  setDeliveryAddress,
  setDeliveryMethods,
  setDiscountCodes,
  setOrderInfo,
  setPaymentMethods,
} from "../../../../modules/session/session.actions";
import { setMoMoPaymentResponse } from "../../../../modules/third-party-response/third-party-response.actions";
import { setToastMessageMaxDiscount } from "../../../../modules/toast-message/toast-message.actions";
import { useAppCtx } from "../../../../providers/app.provider";
import { checkOutOfStockAllProductWhenUpdateCart } from "../../../../services/material/check-out-of-stock.service";
import maxDiscountService from "../../../../services/max-discount.services";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import {
  addMinutes,
  areArraysEqual,
  checkNonEmptyArray,
  convertLocalTime,
  formatTextNumber,
  getStoreConfig,
} from "../../../../utils/helpers";
import { HttpStatusCode } from "../../../../utils/http-common";
import { getStorage, localStorageKeys } from "../../../../utils/localStorage.helpers";
import { EarnPointLogo } from "../../../assets/icons.constants";
import checkoutAddIcon from "../../../assets/icons/checkout-add.svg";
import { ReactComponent as OrderNote } from "../../../assets/icons/note-icon.svg";
import noProductInCart from "../../../assets/images/no-product-in-cart.png";
import BtnSelectDiscountCode from "../../../components/btn-select-discount-code/btn-select-discount-code";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog.component";
import CustomizeDialog from "../../../components/customize-dialog/customize-dialog.component";
import NotificationDialog from "../../../components/notification-dialog/notification-dialog.component";
import OverlayLoadingFullScreenComponent from "../../../components/overlay-loading-full-screen/OverlayLoadingFullScreenComponent";
import PromotionListComponent from "../../../components/promotion-list/promotion-list.component";
import { EnumDeliveryMethod, EnumPromotion, enumOrderType } from "../../../constants/enum";
import { EnumDayOfWeek, EnumNextTimeOpenType } from "../../../constants/enums";
import { PaymentMethodType } from "../../../constants/payment-method.constants";
import { theme2ElementCustomize } from "../../../constants/store-web-page.constants";
import { DateFormat, PHONE_NUMBER_REGEX, ValidTimeRegex } from "../../../constants/string.constant";
import { mockupPaymentMethod } from "../components/checkout-payment-method/mockup-const/checkout-payment-mockup";
import { mockupDelivery } from "../components/delivery-method/mockup-const/delivery-method-mockup";
import UseAvailablePoint from "./available-point/available-point.component";
import "./checkout-detail.style.scss";
import { CheckoutMomoDialog } from "./checkout-momo-dialog/checkout-momo-dialog";
import CheckoutOrderItems from "./checkout-order-items";
import CheckoutPaymentMethod from "./checkout-payment-method/checkout-payment-method";
import { CheckoutSummary } from "./checkout-summary/checkout-summary.component";
import PaymentStatusDialog from "./create-order-status-dialog/create-order-status-dialog.component";
import { CheckoutDeliveryInfo } from "./delivery-info/delivery-info.component";
import { CheckoutDeliveryMethod } from "./delivery-method/delivery-method.component";
import { ReactComponent as NoteIcon } from "./note-icon.svg";

/// Releated to backend enum
const PaymentMethod = {
  MOMO: 0,
  ZALO_PAY: 1,
  CREDIT_DEBIT_CARD: 2,
  CASH: 3,
  VNPAY: 4,
  COD: 5,
  BANK_TRANSFER: 6,
};

const DEPAUSE_METHOD_TIME = 100; // miliseconds

const CheckOutDetail = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const checkoutMomoDialogRef = React.useRef();
  const storeConfig = getStoreConfig();
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const branchAddress = useSelector((state) => state?.session?.deliveryAddress?.branchAddress);
  const currentOrderInfo = store.getState().session?.orderInfo;
  const location = useLocation();
  const paymentMethodId = location?.state?.paymentMethodId;
  const deliveryMethodId = useSelector((state) => state?.session?.orderInfo?.deliveryMethod?.deliveryMethodId);
  const currentCartItem = useSelector((state) => state?.session?.cartItems);
  const translateData = {
    addMoreProducts: t("checkOutPage.addMoreProducts", "Add more products"),
    changeAddress: t("checkOutPage.changeAddress", "Change another address"),
    configureAddress: t("checkOutPage.configureAddress", "Configure address"),
    noAddressMessage: t("checkOutPage.noAddressMessage", "You have no shipping address. Please configure one"),
    complete: t("checkOutPage.complete", "Complete"),
    pay: t("checkOutPage.pay", "Pay"),
    deliveryTo: t("checkOutPage.deliveryTo", "Delivery to"),
    discount: t("checkOutPage.discount", "Discount"),
    feeAndTax: t("checkOutPage.feeAndTax", "Fee & Tax"),
    shippingFee: t("checkOutPage.shippingFee", "Shipping Fee"),
    paymentMethod: t("checkOutPage.paymentMethod", "Payment method"),
    products: t("checkOutPage.products", "Products"),
    shippingMethod: t("checkOutPage.shippingMethod", "Shipping method"),
    shoppingCart: t("checkOutPage.shoppingCart", "Shopping Cart"),
    summary: t("checkOutPage.summary", "Summary"),
    subTotal: t("checkOutPage.subTotal", "Subtotal"),
    total: t("checkOutPage.total", "Total"),
    product: t("checkOutPage.product", "Product"),
    vnd: t("checkOutPage.vnd", "VNĐ"),
    placeHolderName: t("checkOutPage.placeHolderName", "Full name"),
    placeHolderPhone: t("checkOutPage.placeHolderPhone", "Phone number"),
    placeHolderShippingAddress: t("checkOutPage.placeHolderShippingAddress", "Shipping Address"),
    missingCustomerNameMessage: t("checkOutPage.missingCustomerNameMessage", "Please enter name"),
    missingPhoneMessage: t("checkOutPage.missingPhoneMessage", "Please enter phone"),
    cartProduct: t("checkOutPage.cartProduct", "Product"),
    cartPrice: t("checkOutPage.cartPrice", "Price"),
    cartQuantity: t("checkOutPage.cartQuantity", "Quantity"),
    cartTotal: t("checkOutPage.cartTotal", "Total"),
    placeHolderNote: t("checkOutPage.laceHolderNote", "Note"),
    yourCart: t("checkOutPage.yourCart", "Your cart"),
    items: t("checkOutPage.items", "items"),
    gotIt: t("storeWebPage.generalUse.gotIt", "Got it!"),
    selectAddressSuccessful: t("checkOutPage.selectAddressSuccessful", "Select address successful"),
    momoMinimumAmount: t("momo.minimumAmount", "The minimum payment on order is 1000đ via MoMo"),
    orderNote: t("storeWebPage.editOrderItem.noteAMessageForTheStore", "Nhập ghi chú"),
    promotion: t("checkOutPage.promotion", "Khuyến mãi"),
    useDiscountMessage: t("checkOutPage.useDiscountMessage", "Sử dụng giảm giá"),
    discountHasBeenApplied: t("promotion.discountCode.description.success", "Đã áp dụng giảm giá"),
    usePoint: ("checkOutPage.usePoint", "Dùng điểm"),
    titleNotificationSwitch: t("loginPage.notification", "Thông báo"),
    contentZeroPoint: t(
      "checkOutPage.availablePoint.contentZeroPoint",
      "Không thể quy đổi điểm cho đơn hàng. Vui lòng kiểm tra lại.",
    ),
    contentUsePointNotMatchTime: t(
      "checkOutPage.availablePoint.contentUsePointNotMatchTime",
      "Số điểm sử dụng đã hết hạn hoặc có thay đổi, vui lòng kiểm tra lại đơn hàng.",
    ),
    contentUsePointHasChange: t(
      "checkOutPage.availablePoint.contentUsePointHasChange",
      "Cấu hình điểm đã được thay đổi, vui lòng kiểm tra lại đơn hàng.",
    ),
    iGotIt: t("checkOutPage.availablePoint.iGotIt", "Đã hiểu"),
    verifyCustomerRank: t(
      "checkOutPage.verifyCustomerRank",
      "Cấu hình hạng thành viên đã có thay đổi, vui lòng kiểm tra lại đơn hàng.",
    ),
    notification: t("storeWebPage.generalUse.notification", "Thông báo"),
    earnPointMessage: t(
      "checkOutPage.earnPointMessage",
      "Bạn sẽ kiếm được <span class = {{earn_points}}>{{earnPoints}}</span> điểm khi hoàn thành đơn hàng.",
    ),
    emptyCart: t("checkOutPage.emptyCart", "Không có gì trong giỏ hàng của bạn"),
    soSorryNotificationWorkingHour: t(
      "storeBranch.soSorryNotificationWorkingHour",
      "Rất xin lỗi! Hiện tại không phải thời gian làm việc của cửa hàng. Vui lòng quay lại vào lúc <strong>{{timeWorkingHour}} {{dayOfWeek}}</strong>",
    ),
    productPriceChange: t(
      "checkOutPage.productPriceChange",
      "Giá sản phẩm đã được thay đổi, vui lòng tải lại để xem giá hoặc khuyến mãi mới nhất.",
    ),
    okay: t("storeWebPage.generalUse.okay", "Okay"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Rất tiếc! Sản phẩm không còn đủ hàng"),
    someProductOutOfStock: t(
      "storeWebPage.productDetailPage.someProductOutOfStock",
      "Rất tiếc! Một số sản phẩm đã hết hàng.",
    ),
    willBeRemoveFromCart: t("storeWebPage.productDetailPage.willBeRemoveFromCart", "Chúng sẽ bị xóa khỏi giỏ hàng!"),
    cannotCreateOrder: t(
      "messages.cannotCreateOrder",
      "Chúng sẽ bị xóa khỏi giỏ hàng!",
      "Không thể tạo đơn, vui lòng kiểm tra lại",
    ),
    checkDeliveryEstimateTime: t(
      "checkOutPage.checkDeliveryEstimateTime",
      "Thời gian giao hàng không phù hợp, vui lòng chọn lại!",
    ),
    checkPickupEstimateTime: t(
      "checkOutPage.checkPickupEstimateTime",
      "Thời gian lấy hàng không phù hợp, vui lòng chọn lại!",
    ),
  };

  const { configuration, colorGroups, clickToFocusCustomize, isCustomize, isDefault } = props;
  const colorGroup = colorGroups?.find((c) => c.id === configuration?.colorGroupId);
  const backgroundImage = configuration?.backgroundImage;
  const backgroundColor = configuration?.backgroundColor;
  const backgroundType = configuration?.backgroundType;
  const storageConfig = JSON.parse(getStorage("config"));
  const mockupCustomize = storageConfig.customizeTheme;
  const [disablePayButton, setDisablePayButton] = useState(true);
  const [isCreateOrderProcessing, setIsCreateOrderProcessing] = useState(false);
  const [isHiddenPromotion, setIsHiddenPromotion] = useState(false);
  const [isOpenCheckoutMomoDialog, setIsOpenCheckoutMomoDialog] = useState(false);
  const [isOpenCreateOrderStatusDialog, setIsOpenCreateOrderStatusDialog] = useState(false);
  const [currentCheckoutInfo, setCurrentCheckoutInfo] = useState(null);
  const [currentDeliveryMethodSelected, setCurrentDeliveryMethodSelected] = useState(null);
  const [currentPaymentMethodSelected, setCurrentPaymentMethodSelected] = useState(null);
  const [orderResponseData, setOrderResponseData] = useState(null);
  const [isShowNotifyDialog, setIsShowNotifyDialog] = useState(false);
  const [isShowNotifyWorkingHoursDialog, setIsShowNotifyWorkingHoursDialog] = useState(false);
  const [timeWorkingHour, setTimeWorkingHour] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [contentNotifyDialog, setContentNotifyDialog] = useState("");
  const [isShowVerifyProductPriceDialog, setIsShowVerifyProductPriceDialog] = useState(false);
  const [isShowVerifyMembershipDiscount, setIsShowVerifyMembershipDiscount] = useState(false);
  const [isShowCheckEstimateTime, setIsShowCheckEstimateTime] = useState(false);
  const [responseDataMomo, setResponseDataMomo] = useState(null);
  const [isShowDiscountCodeDialog, setIsShowDiscountCodeDialog] = useState(false);
  const [showConfirmCheckLoyaltyPoint, setShowConfirmCheckLoyaltyPoint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const calculateCustomerLoyaltyPoint = useSelector(
    (state) => state?.session?.orderInfo?.cartValidated?.calculateCustomerLoyaltyPoint,
  );
  const isChangedProductPriceVar = useSelector(
    (state) => state?.session?.orderInfo?.cartValidated?.isChangedProductPrice,
  );
  const [currentAvailablePoint, setCurrentAvailablePoint] = useState(0);
  const [isShowUsePointContent, setIsShowUsePointContent] = useState(false);
  const [verifyUsePointDialogMessage, setVerifyUsePointDialogMessage] = useState("");
  const [isUsePoint, setIsUsePoint] = useState(false);
  const [isLoadingSwitchExchangePoint, setIsLoadingSwitchExchangePoint] = useState(false);
  const [isEditReceiver, setIsEditReceiver] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState();
  const [cookingTime, setCookingTime] = useState();

  /// Order info
  const [orderNotes, setOrderNotes] = useState("");
  const [shoppingCart, setShoppingCart] = useState([]);
  const [titleBtnSelectDiscountCode, setTitleBtnSelectDiscountCode] = useState(t(translateData.useDiscountMessage));
  const [isAllowShowSelectAddressSuccessful, setIsAllowShowSelectAddressSuccessful] = useState(false);
  const [isShowDialogOutOfStock, setIsShowDialogOutOfStock] = useState(false);
  const [isShowDialogRemoveFromCart, setIsShowDialogRemoveFromCart] = useState(false);
  const [earnPoint, setEarnPoint] = useState(0);
  const customerId = useSelector((state) => state?.session?.orderInfo?.cartValidated?.customerId);
  const momoMinimumAmount = 1000;

  const cartItemsInRedux = useSelector((state) => state.session.cartItems);
  const discountCodesInRedux = useSelector((state) => state.session?.discountCodes);
  const appliedDiscountCodes = useSelector((state) => state?.session?.appliedDiscountCodes ?? {});

  const { Toast } = useAppCtx();

  useEffect(() => {
    if (deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY && !deliveryAddress?.receiverAddress) {
      if (!isCustomize && !isDefault) {
        setTimeout(() => {
          const chooseAddressModal = document.getElementsByClassName("receiver-address-select-button-from-checkout")[0];
          return chooseAddressModal?.click();
        }, 800);
      }
    }
    calculateShoppingCart();
    initDataPaymentMethods();
    // Fix auto select delivery method on the first load data after update shopping cart
  }, []);

  useEffect(() => {
    if (!isCustomize) {
      const isEqual = areArraysEqual(appliedDiscountCodes?.discountCodes ?? [], discountCodesInRedux ?? []);
      if (!isEqual) {
        setIsLoading(true);

        const numberOfDiscountCodeApplied = appliedDiscountCodes?.discountCodes?.length ?? 0;
        const numberOfDiscountCode = discountCodesInRedux?.length ?? 0;

        //numberOfDiscountCode > numberOfDiscountCodeApplied that is, apply additional discount codes
        const isShowToastMessageDiscountCode = numberOfDiscountCode > numberOfDiscountCodeApplied;

        calculateShoppingCart(null, isShowToastMessageDiscountCode);
      }

      if (checkNonEmptyArray(discountCodesInRedux)) {
        setTitleBtnSelectDiscountCode(translateData.discountHasBeenApplied);
      } else {
        setTitleBtnSelectDiscountCode(translateData.useDiscountMessage);
      }
    }
  }, [discountCodesInRedux]);

  useEffect(() => {
    if (!isCustomize) {
      dispatch(setDiscountCodes(appliedDiscountCodes?.discountCodes ?? []));
    }
  }, [appliedDiscountCodes]);

  useEffect(() => {
    if (calculateCustomerLoyaltyPoint) {
      const { isShowUsePoint, availablePoint, pointUsed, earnPoint } = calculateCustomerLoyaltyPoint;
      setIsShowUsePointContent(isShowUsePoint);
      setCurrentAvailablePoint(availablePoint);
      setEarnPoint(earnPoint);

      if (isUsePoint && isShowUsePoint && availablePoint === 0 && availablePoint === pointUsed) {
        setVerifyUsePointDialogMessage(t("loyaltyPoint.message.pointCannotRedeem"));
        setShowConfirmCheckLoyaltyPoint(true);
      }
    }
  }, [calculateCustomerLoyaltyPoint]);

  useEffect(() => {
    setDisablePayButton(false);
  }, [shoppingCart]);

  useEffect(() => {
    calculateShoppingCart(null);
  }, [deliveryMethodId]);

  useEffect(() => {
    setShoppingCart(cartItemsInRedux);

    const reduxState = store.getState();
    const deliveryMethods = reduxState?.session?.deliveryMethods ?? [];
    if (deliveryMethodId != undefined && deliveryMethodId != null) {
      const deliveryMethod = deliveryMethods?.find((x) => x?.deliveryMethodId == deliveryMethodId);
      setCurrentDeliveryMethodSelected(deliveryMethod);
    } else if (deliveryMethods && deliveryMethods?.length > 0 && currentDeliveryMethodSelected == null) {
      //Sort to select cheapest shipping fee
      const sortedByPriceDeliveryMethod = deliveryMethods.sort((a, b) => a.pricing - b.pricing);
      setCurrentDeliveryMethodSelected(sortedByPriceDeliveryMethod[0]); // auto select first delivery method
    }
    if (isDefault) {
      setCurrentDeliveryMethodSelected(mockupDelivery[0]);
    }
  }, [cartItemsInRedux]);

  useEffect(() => {
    if (deliveryAddress?.receiverAddress && isAllowShowSelectAddressSuccessful) {
      message.info(translateData.selectAddressSuccessful);
    }
  }, [deliveryAddress?.receiverAddress]);

  useEffect(() => {
    if (!isCustomize) {
      // Set default orderType is ONLINE_DELIVERY if user not select any
      if (deliveryAddress?.orderType === undefined || deliveryAddress?.orderType === null) {
        dispatch(
          setDeliveryAddress({
            ...deliveryAddress,
            orderType: enumOrderType.ONLINE_DELIVERY,
          }),
        );
      }
      getDeliveryInfoFromLoginSession();

      if (deliveryAddress && currentCartItem) {
        depauseMethod("initDataDeliveryMethods", DEPAUSE_METHOD_TIME, () => {
          initDataDeliveryMethods(deliveryAddress, currentCartItem);
        });
      }
    }
  }, [deliveryAddress]);

  useEffect(() => {
    calculateShoppingCart();
    initDataPaymentMethods();
  }, [branchAddress]);

  useEffect(() => {
    if (currentDeliveryMethodSelected) {
      const newOrderInfo = {
        ...getOrderInfo(),
        shippingFee:
          deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY ? currentDeliveryMethodSelected?.pricing : 0,
        deliveryMethod: currentDeliveryMethodSelected,
      };
      dispatch(setOrderInfo(newOrderInfo));
    }
  }, [currentDeliveryMethodSelected]);

  useEffect(() => {
    if (currentPaymentMethodSelected) {
      const newOrderInfo = {
        ...getOrderInfo(),
        paymentMethod: currentPaymentMethodSelected,
      };
      dispatch(setOrderInfo(newOrderInfo));
    }
  }, [currentPaymentMethodSelected]);

  useEffect(() => {
    if (responseDataMomo) {
      let intervalGetPaymentStatusID = setInterval(() => {
        const { requestId, orderId, amount } = responseDataMomo.paymentInfo;
        if (!requestId) {
          return;
        }

        const { pointUsed, redeemPointExchangeValue } = calculateCustomerLoyaltyPoint;
        paymentDataService
          .updateStoreWebOrderMomoPaymentWithPoint(
            requestId,
            orderId,
            amount,
            isUsePoint,
            pointUsed,
            redeemPointExchangeValue,
          )
          .then((responseData) => {
            if (responseData?.data?.isSuccess) {
              var result = {
                result: responseData?.data?.isSuccess,
                message: responseData?.data?.message,
              };
              dispatch(setMoMoPaymentResponse(result));
              clearInterval(intervalGetPaymentStatusID);
              //reset cart
              if (responseData?.data?.isSuccess == true) {
                handlePaymentCompleted(true);
              }
            }
          });
      }, 5000);

      return () => clearInterval(intervalGetPaymentStatusID);
    }
  }, [responseDataMomo]);

  useEffect(() => {
    if (isChangedProductPriceVar) {
      const orderInfo = getOrderInfo();
      const hasOutOfStockItem = orderInfo?.cartValidated?.cartItems?.some((item) => item.isOutOfStock === true);
      if (hasOutOfStockItem) {
        setIsShowDialogRemoveFromCart(true);
      } else {
        setIsShowVerifyProductPriceDialog(true);
      }
      setIsCreateOrderProcessing(false);
      window.isCreateOrderCheckoutProcessing = false;
    }
  }, [isChangedProductPriceVar]);

  const createPackagesDelivery = (cartItem) => {
    if (cartItem?.isCombo) {
      return {
        name: cartItem?.name,
        description: cartItem?.name,
        quantity: cartItem?.quantity,
        price: cartItem?.sellingPrice,
      };
    } else {
      return {
        name: cartItem?.name,
        description: cartItem?.name,
        quantity: cartItem?.quantity,
        price: cartItem?.productPrice?.priceValue,
      };
    }
  };

  const calculateShoppingCart = (cartItems, isShowToastMessageDiscountCode = false) => {
    depauseMethod("callApiValidateCartItems", DEPAUSE_METHOD_TIME, () => {
      if (!isCustomize) {
        callApiValidateCartItems(false, cartItems, isUsePoint, null, isShowToastMessageDiscountCode);
      }
    });
  };

  const initDataShoppingCart = () => {
    const store_cart = JSON.parse(localStorage.getItem(localStorageKeys.STORE_CART));
    setShoppingCart(store_cart);
  };

  const getDeliveryInfoFromLoginSession = () => {
    const token = getStorage(localStorageKeys.TOKEN);
    const loginData = JSON.parse(getStorage(localStorageKeys.LOGIN));
    const customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
    const decoded_token = token && jwt_decode(token);
    const customerId = decoded_token?.ID;
    const accountId = decoded_token?.ACCOUNT_ID;
    const customerName = customerInfo?.fullName;
    const customerPhone = loginData?.phone;

    // Save delivery info to redux
    const orderInfo = {
      ...currentOrderInfo,
      deliveryInfo: {
        customerId: customerId,
        accountId: accountId,
        phoneNumber: customerPhone,
        addressId: deliveryAddress?.receiverAddress?.id,
        address: deliveryAddress?.receiverAddress?.addressDetail,
        lat: deliveryAddress?.receiverAddress?.lat,
        lng: deliveryAddress?.receiverAddress?.lng,
        receiverName: customerName,
      },
    };

    dispatch(setOrderInfo(orderInfo));
  };

  const initDataPaymentMethods = async () => {
    const res = await paymentMethodDataService.getPaymentMethods(storeConfig?.storeId, branchAddress?.id);
    if (res) {
      const paymentMethods = res?.data?.sort((a, b) => (a.paymentMethodName > b.paymentMethodName ? 1 : -1));
      const indexPaymentMethodBankTransfer = paymentMethods?.findIndex(
        (p) => p?.paymentMethodEnumId === PaymentMethodType.BankTransfer,
      );
      if (indexPaymentMethodBankTransfer !== -1) {
        paymentMethods.push(paymentMethods.splice(indexPaymentMethodBankTransfer, 1)[0]);
      }
      dispatch(setPaymentMethods(paymentMethods));
      setCurrentPaymentMethodSelected(paymentMethods?.[0]); // auto select first payment method
    }
    if (isDefault) {
      setCurrentPaymentMethodSelected(mockupPaymentMethod[0]);
    }
    if (paymentMethodId !== undefined && paymentMethodId != null && res) {
      const paymentMethods = res?.data?.sort((a, b) => (a.paymentMethodName > b.paymentMethodName ? 1 : -1));
      const indexPaymentMethodReOrder = paymentMethods?.findIndex(
        (method) => method.paymentMethodId === paymentMethodId,
      );
      setCurrentPaymentMethodSelected(paymentMethods[indexPaymentMethodReOrder]);
    }
  };

  const initDataDeliveryMethods = async (deliveryAddress, cartItems) => {
    const { branchAddress, receiverAddress } = deliveryAddress;
    const request = {
      storeBranchAddress: {
        address: branchAddress?.addressDetail,
        lat: branchAddress?.lat,
        lng: branchAddress?.lng,
      },
      receiverAddress: {
        address: receiverAddress?.addressDetail,
        lat: receiverAddress?.lat,
        lng: receiverAddress?.lng,
      },
      packages: cartItems?.map((item) => createPackagesDelivery(item)) || [],
    };
    const res = await deliveryDataService.calculateDeliveryFee(request);
    if (res) {
      //Set cooking time
      const cookingTime = res?.data?.deliveryPricings?.find(
        (item) => item.enumDeliveryMethod === EnumDeliveryMethod.SELF_DELIVERY,
      );
      setCookingTime(cookingTime);
      //Sort to select cheapest shipping fee
      const deliveryMethods = res?.data?.deliveryPricings?.sort((a, b) => (a.pricing > b.pricing ? 1 : -1));
      if (deliveryMethods) {
        const deliveryMethod = deliveryMethods.find((x) => x.deliveryMethodId === deliveryMethodId);
        const currentDeliveryMethod = deliveryMethod ?? deliveryMethods[0];
        setCurrentDeliveryMethodSelected(currentDeliveryMethod); // auto select first delivery method on the first init delivery methods list
        dispatch(setDeliveryMethods(deliveryMethods));
      }
    }
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

  const onChangeDeliveryMethod = (deliveryMethod) => {
    if (deliveryMethod) {
      setCurrentDeliveryMethodSelected(deliveryMethod);
    }
  };

  const onChangePaymentMethod = (paymentMethod) => {
    if (paymentMethod) {
      setCurrentPaymentMethodSelected(paymentMethod);
    }
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
  const onUpdateCartQuantity = async (id, quantity, cartIndex) => {
    if (!shoppingCart || shoppingCart.length === 0) return;
    let data = shoppingCart;
    //Check out of stock
    const cartData = [...data];
    const outOfStockIndices = cartData?.reduce((acc, item, index) => {
      if (item.isOutOfStock) {
        acc.push(index);
      }
      return acc;
    }, []);
    const verifyOutOfStock = await checkOutOfStockAllProductWhenUpdateCart(
      branchAddress?.id,
      cartData,
      cartIndex,
      quantity,
      outOfStockIndices,
    );
    if (verifyOutOfStock && quantity > 0) {
      setIsShowDialogOutOfStock(true);
      data = data.map((cart, index) =>
        cart.id === id && index === cartIndex ? { ...cart, quantity: Math.max(cart.quantity, 0) } : cart,
      );
      return;
    }

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

  async function handleConfirmNotifyOutOfStock() {
    setIsShowDialogRemoveFromCart(false);
    let newCartItems = [...shoppingCart];
    const newCarts = shoppingCartService.removeOutOfStockCartItem(newCartItems);
    dispatch(setCartItems(newCarts));
    setShoppingCart(newCarts);
    calculateShoppingCart(newCarts);
  }

  const onDeleteProduct = (id, cartIndex) => {
    if (!shoppingCart || shoppingCart.length === 0) return;
    let data = [...shoppingCart];
    data.splice(cartIndex, 1);
    dispatch(setCartItems(data));
    setShoppingCart(data);
    calculateShoppingCart(data);
  };

  const addMoreProducts = () => {
    history.push("/product-list");
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

  const callApiValidateCartItems = async (
    isCheckChangedData,
    cartItems,
    isActiveUsedPoint,
    isOrderCreating = false,
    isShowToastMessageDiscountCode = false,
  ) => {
    let isChangedProductPrice = false;
    if (!cartItems || cartItems?.length === 0) {
      const reduxState = store.getState();
      const session = reduxState?.session;
      cartItems = session?.cartItems ?? [];
    }

    const orderInfo = getOrderInfo();

    var deliveryFees = 0;
    if (orderInfo?.shippingFee) {
      deliveryFees = orderInfo?.shippingFee;
    }

    setDisablePayButton(false);
    setIsAllowShowSelectAddressSuccessful(true);

    // Get data from redux to verify. Done then save to local storage and redux.
    const dataRequest = {
      cartItems: cartItems,
      isCheckChangedData: isCheckChangedData,
      isActiveUsedPoint: isActiveUsedPoint,
      deliveryFee: deliveryFees,
      isCustomize: isCustomize,
      callBackCheckFlashSale: callBackCheckFlashSale,
      isOrderCreating: isOrderCreating,
      isShowToastMessageDiscountCode: isShowToastMessageDiscountCode,
    };
    isChangedProductPrice = await shoppingCartService.verifyAndUpdateCart(dataRequest);
    setIsLoading(false);
    return isChangedProductPrice;
  };

  const callBackCheckFlashSale = (message) => {
    setContentNotifyDialog(message);
    setIsShowNotifyDialog(true);
  };

  const getOrderInfo = () => {
    const reduxState = store.getState();
    const session = reduxState?.session;
    const requestCartItems = session?.cartItems?.map((item) => mappingOrderCartItem(item));
    const orderInfo = {
      ...session?.orderInfo,
      cartItems: requestCartItems ?? [],
      orderNotes: orderNotes,
      deliveryAddress: { ...session?.deliveryAddress },
    };

    return orderInfo;
  };

  const getLoginUserInfo = () => {
    const customerInfoJsonString = getStorage(localStorageKeys.CUSTOMER_INFO);
    const customerInfo = JSON.parse(customerInfoJsonString);

    return customerInfo;
  };

  const onCompleteCheckOut = async () => {
    //Check estimate time compare to now
    if (showPopupCheckTimePlaceOrder(timeSlot, deliveryDate)) {
      setIsShowCheckEstimateTime(true);
      return;
    }
    //Check address before pay order
    if (!deliveryAddress?.receiverAddress && deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY) {
      const chooseAddressModal = document.querySelector(".receiver-address-select-button");
      return chooseAddressModal?.click();
    }

    const orderInfo = getOrderInfo();
    const hasOutOfStockItem = orderInfo?.cartValidated?.cartItems?.some((item) => item.isOutOfStock === true);
    if (hasOutOfStockItem) {
      setIsShowDialogRemoveFromCart(true);
      return;
    }

    const reduxState = store.getState();
    const session = reduxState?.session;
    const storeConfig = getStoreConfig();

    //Check valid receiver info
    const isValidReceiver = checkValidReceiverInfo();
    if (!isValidReceiver) return;

    //Check Working Hours
    const workingHour = await branchDataService.getWorkingHourByBranchIdAsync(branchAddress?.id ?? null);
    const workingHourResult = workingHour?.data;
    if (workingHourResult?.isClosed === true) {
      setIsShowNotifyWorkingHoursDialog(true);
      setTimeWorkingHour(workingHourResult?.workingHour?.openTime);
      if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[1].key) {
        setDayOfWeek(EnumNextTimeOpenType[workingHourResult?.workingHour?.nextTimeOpen - 1].name);
      } else if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[2].key) {
        setDayOfWeek(EnumDayOfWeek[workingHourResult?.workingHour?.dayOfWeek].name);
      }
      return;
    }
    //Check Change Membership Rank
    let isChangeMembershipLevel = false;
    const customerId = session?.userInfo?.customerId;
    if (customerId) {
      const membershipLevelInfo = await customerDataService.getMembershipLevelInformation(
        customerId,
        storeConfig?.storeId,
      );
      if (membershipLevelInfo?.data) {
        isChangeMembershipLevel = checkChangeDiscountMembershipLevel(
          session.orderInfo.cartValidated,
          membershipLevelInfo.data,
        );
      }
    }
    if (isChangeMembershipLevel) {
      setIsShowVerifyMembershipDiscount(true);
    } else {
      const { availablePoint, redeemPointExchangeValue } = calculateCustomerLoyaltyPoint;
      let isUsePointFailed = false;
      if (isUsePoint && availablePoint >= 0 && redeemPointExchangeValue >= 0) {
        isUsePointFailed = await handleVerifyCustomerLoyaltyPoint();
      }
      if (isUsePointFailed === true) {
        setIsCreateOrderProcessing(false);
        window.isCreateOrderCheckoutProcessing = false;
      } else {
        const isChangedProductPrice = await callApiValidateCartItems(true, null, isUsePoint, true);
        if (isChangedProductPrice === true) {
          ///Call dialog and refresh
          return;
        } else {
          await submitCreateOrder();
        }
      }
    }
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

  function isTimeValid(timeSlot) {
    // Biểu thức chính quy kiểm tra định dạng giờ HH:mm
    const timePattern = ValidTimeRegex;

    // Kiểm tra nếu timeSlot là chuỗi và phù hợp với định dạng giờ hoặc là "Sớm nhất"
    if (typeof timeSlot === "string" && timePattern.test(timeSlot)) {
      return true;
    } else {
      return false;
    }
  }

  const handleChangeReceiver = (values) => {
    setReceiverInfo(values);
  };

  const checkValidReceiverInfo = () => {
    if (isEditReceiver) {
      const { receiverName, receiverPhone } = receiverInfo;
      const isValidName = receiverName;
      const isValidPhone = receiverPhone && PHONE_NUMBER_REGEX.test(receiverPhone);
      return isValidName && isValidPhone;
    }
    return true;
  };

  const getReceiverRemarks = (isEditReceiver, receiverInfo, deliveryInfo) => {
    if (isEditReceiver && receiverInfo?.receiverPhone !== deliveryInfo?.phoneNumber) {
      return `Backup: ${deliveryInfo?.receiverName} - ${deliveryInfo?.phoneNumber}`;
    }
    return "";
  };

  const submitCreateOrder = async () => {
    if (isCreateOrderProcessing) return;
    //TODO: show valid old valid  checkout info data response from api
    const reduxState = store.getState();
    const orderInfo = getOrderInfo();
    const { cartValidated, deliveryInfo, deliveryMethod, paymentMethod, deliveryAddress } = orderInfo;
    const branchAddress = reduxState?.session?.deliveryAddress?.branchAddress;
    const loginUserInfo = getLoginUserInfo();
    const createOrderRequest = {
      accountId: loginUserInfo?.accountId,
      branchId: branchAddress?.id ?? null,
      customerId: orderInfo?.deliveryInfo?.customerId ?? null,
      enumOrderTypeId:
        deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY
          ? enumOrderType.ONLINE_DELIVERY
          : enumOrderType.PICK_UP, // ORDER TYPE DELIVERY
      enumPaymentMethodId: currentPaymentMethodSelected?.paymentMethodEnumId ?? paymentMethod?.paymentMethodEnumId,
      isDeliveryOrder: true,
      deliveryMethodId: deliveryMethod?.deliveryMethodId ?? currentDeliveryMethodSelected?.deliveryMethodId,
      deliveryMethod: deliveryMethod?.enumDeliveryMethod ?? currentDeliveryMethodSelected?.enumDeliveryMethod,
      cartItems: cartValidated?.cartItems,
      totalTax: cartValidated?.totalTax,
      deliveryFee:
        deliveryAddress?.OrderType === enumOrderType.ONLINE_DELIVERY || deliveryAddress?.OrderType == undefined
          ? orderInfo?.shippingFee
          : 0,
      receiverName: isEditReceiver ? receiverInfo?.receiverName : deliveryInfo?.receiverName,
      receiverPhone: isEditReceiver ? receiverInfo?.receiverPhone : deliveryInfo?.phoneNumber,
      receiverAddress: {
        address: deliveryAddress?.receiverAddress?.address,
        lat: deliveryInfo?.lat,
        lng: deliveryInfo?.lng,
      },
      receiverRemarks: getReceiverRemarks(isEditReceiver, receiverInfo, deliveryInfo),
      note: orderNotes,
      orderCartInfo: cartValidated,
      userPhoneNumber: loginUserInfo?.phoneNumber,
      userFullName: loginUserInfo?.fullName,
      discountCodes: Array.isArray(discountCodesInRedux) ? discountCodesInRedux : [],
      isActiveUsedPoint: isUsePoint,
      scheduledTime: deliveryDate && isTimeValid(timeSlot) ? deliveryDate + " " + timeSlot : null,
      platformId: Platform.StoreWebsite,
      isOrderCreating: true,
    };

    var scheduledTime = moment(createOrderRequest.scheduledTime, DateFormat.YYYY_MM_DD_HH_MM);

    if (scheduledTime.isBefore(moment())) {
      createOrderRequest.scheduledTime = moment().format(DateFormat.YYYY_MM_DD_HH_MM);
    }

    if (createOrderRequest.deliveryMethod === undefined) {
      message.warning("Vui lòng chọn phương thức vận chuyển!");
      return;
    }

    if (createOrderRequest.enumPaymentMethodId === undefined) {
      message.warning("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    if (
      paymentMethod?.paymentMethodEnumId === PaymentMethodType.MoMo &&
      shoppingCart?.length > 0 &&
      (orderInfo?.cartValidated?.totalPriceAfterDiscount ?? 0) + (orderInfo?.shippingFee ?? 0) < momoMinimumAmount
    ) {
      message.info(translateData.momoMinimumAmount);
      return;
    }

    // pay button start loading
    setIsCreateOrderProcessing(true);
    window.isCreateOrderCheckoutProcessing = true;

    try {
      const response = await orderDataService.createStoreWebOrderAsync(createOrderRequest);
      if (response.status === HttpStatusCode.Ok) {
        const responseData = response.data;
        setOrderResponseData(responseData);
        gotoPaymentStep(responseData);
        dispatch(setDiscountCodes([]));
      } else {
        Toast.error({
          message: translateData.cannotCreateOrder,
          placement: "top",
        });
      }
    } catch (err) {
      console.error(err);
    }

    // pay button stop loading
    setIsCreateOrderProcessing(false);
    window.isCreateOrderCheckoutProcessing = false;
  };

  const getRemainingTime = (paymentInfoData) => {
    const responseTime = paymentInfoData?.paymentInfo?.responseTime;
    let expiredTime = 0;
    if (responseTime) {
      let responseDate = new Date(responseTime);
      expiredTime = addMinutes(responseDate, 10).getTime(); // expired after 10 mins, MOMO payment config
      const timeNow = new Date().getTime();
      const remainTime = expiredTime - timeNow;

      return remainTime;
    }
  };

  const gotoPaymentStep = (responseData) => {
    if (responseData) {
      const { paymentMethod } = responseData;
      switch (paymentMethod) {
        case PaymentMethod.MOMO:
          if (checkoutMomoDialogRef && checkoutMomoDialogRef.current) {
            checkoutMomoDialogRef.current.showPaymentInfo(responseData);
            const remainTime = getRemainingTime(responseData);
            if (remainTime > 0) {
              setCurrentCheckoutInfo(responseData);
              setIsOpenCheckoutMomoDialog(true);
              setResponseDataMomo(responseData);
            } else {
              setIsCreateOrderProcessing(false);
              window.isCreateOrderCheckoutProcessing = false;
              setCurrentCheckoutInfo(null);
            }
          }
          break;
        case PaymentMethod.CASH:
        default:
          setIsCreateOrderProcessing(false);
          window.isCreateOrderCheckoutProcessing = false;
          setIsOpenCreateOrderStatusDialog(true);

          // reset cart
          handlePaymentCompleted(true);
          break;
      }
    }
  };

  const handlePaymentCompleted = (isSuccess) => {
    if (isSuccess) {
      // Set empty cart
      const emptyCart = [];

      shoppingCartService.setStoreCartLocalStorage(emptyCart);
      dispatch(setCartItems(emptyCart));
      setShoppingCart([]);
      calculateShoppingCart();
    }
  };

  const handleConfirmNotify = () => {
    setIsShowNotifyDialog(false);
    callApiValidateCartItems(false, null, isUsePoint);
  };

  const handleOkayVerifyProductPrice = () => {
    setIsShowVerifyProductPriceDialog(false);
    callApiValidateCartItems(false, null, isUsePoint);
  };

  const handleOkayVerifyMembershipDiscount = () => {
    setIsShowVerifyMembershipDiscount(false);
    callApiValidateCartItems(false, null, isUsePoint);
  };

  const handleOkayCheckEstimateTime = () => {
    setIsShowCheckEstimateTime(false);
  };

  const getTotalIemsInShoppingCart = (shoppingCart) => {
    let totalItems = 0;
    if (shoppingCart) {
      shoppingCart.forEach((cartItem) => {
        totalItems += cartItem.quantity;
      });
    }

    return totalItems;
  };

  const CreateOrderButton = () => {
    return (
      <div className="button-create-order-and-payment">
        <Button
          loading={isCreateOrderProcessing}
          className="pay-button"
          onClick={onCompleteCheckOut}
          disabled={disablePayButton || isCreateOrderProcessing}
          style={{
            backgroundColor: colorGroup?.buttonBackgroundColor,
            borderColor: colorGroup?.buttonBorderColor,
          }}
        >
          {translateData.pay}
        </Button>
      </div>
    );
  };

  const detailStyle =
    backgroundType === 1
      ? {
          background: backgroundColor,
          display: configuration?.visible === false && "none",
        }
      : {
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          display: configuration?.visible === false && "none",
        };

  function hiddenPromotion(value) {
    setIsHiddenPromotion(value);
  }

  const changeDiscountCodeBeingApplied = (code) => {
    const reduxState = store.getState();
    const session = reduxState?.session;
    const discountCodesAreBeingApplied = Array.isArray(session?.discountCodes) ? session?.discountCodes : [];
    const discountCodesAreBeingAppliedNew = [...discountCodesAreBeingApplied];
    const indexExist = discountCodesAreBeingApplied?.findIndex((discountCode) => discountCode === code);
    if (indexExist === -1) {
      discountCodesAreBeingAppliedNew.push(code);
      dispatch(setDiscountCodes(discountCodesAreBeingAppliedNew));
    } else {
      discountCodesAreBeingAppliedNew.splice(indexExist, 1);
      dispatch(setDiscountCodes(discountCodesAreBeingAppliedNew));
    }
  };

  const handleCloseDiscountCodeDialog = () => {
    setIsShowDiscountCodeDialog(false);
  };

  const onConfirmCheckLoyaltyPoint = () => {
    setIsLoadingSwitchExchangePoint(false);
    setIsUsePoint(false);
    window.isUsePoint = false;
    setShowConfirmCheckLoyaltyPoint(false);
    window.location.reload();
  };

  const handleVerifyCustomerLoyaltyPoint = async () => {
    setIsLoadingSwitchExchangePoint(true);
    let isVerifyFailed = false;
    const { availablePoint, redeemPointExchangeValue } = calculateCustomerLoyaltyPoint;
    if (availablePoint >= 0 && redeemPointExchangeValue >= 0) {
      const res = await customerDataService.verifyCustomerLoyaltyPointAsync(availablePoint, redeemPointExchangeValue);
      if (res) {
        const { isUsePointFailed, errorMessage } = res?.data?.response;
        if (isUsePointFailed === true) {
          setVerifyUsePointDialogMessage(t(errorMessage));
          setShowConfirmCheckLoyaltyPoint(true);
          isVerifyFailed = true;
        }
      }
    }
    setIsLoadingSwitchExchangePoint(false);
    return isVerifyFailed;
  };

  const handleIsActiveAvailablePoint = (checked) => {
    setIsUsePoint(checked);
    window.isUsePoint = checked;
    if (checked) {
      //Verify before calculate
      handleVerifyCustomerLoyaltyPoint(customerId);
      callApiValidateCartItems(false, null, true);
    } else {
      callApiValidateCartItems(false, null, false);
    }
  };

  function ReceivePointNotification() {
    const text = t(translateData.earnPointMessage, {
      earnPoints: formatTextNumber(earnPoint),
      earn_points: "earn-points",
    });
    return (
      <>
        <div className="receive-point-text">
          <EarnPointLogo className="point-logo" />
          <span dangerouslySetInnerHTML={{ __html: text }}></span>
        </div>
      </>
    );
  }
  function showPopupCheckTimePlaceOrder(time, date) {
    let isShowCheckEstimateTime = false;
    const now = moment();
    try {
      let estimateTime = convertLocalTime(time, date);
      if (estimateTime && now.isAfter(estimateTime)) {
        isShowCheckEstimateTime = true;
      }
    } catch (error) {
      isShowCheckEstimateTime = true;
    }
    return isShowCheckEstimateTime;
  }

  const [deliveryDate, setDeliveryDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);

  const PromotionsDialogComponent = useMemo(
    () => (
      <CustomizeDialog
        {...props}
        className="discount-code-dialog"
        title={translateData.promotion}
        open={isShowDiscountCodeDialog && !isHiddenPromotion}
        closable={true}
        content={() => (
          <PromotionListComponent
            colorConfig={colorGroup}
            hiddenPromotion={hiddenPromotion}
            callBack={changeDiscountCodeBeingApplied}
            isShowInputDiscountCode={false}
          />
        )}
        onCancel={() => {
          handleCloseDiscountCodeDialog();
        }}
        footer={null}
      />
    ),
    [isShowDiscountCodeDialog, colorGroup, isHiddenPromotion],
  );

  return (
    <>
      {/*Check delivery time or pickup time compare current*/}
      <ConfirmationDialog
        open={isShowCheckEstimateTime}
        onCancel={() => {}}
        onConfirm={handleOkayCheckEstimateTime}
        confirmLoading={false}
        className="checkout-theme2-notify-dialog"
        title={translateData.notification}
        content={
          deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY
            ? translateData.checkDeliveryEstimateTime
            : translateData.checkPickupEstimateTime
        }
        footer={[
          <Button className="ant-btn-primary btn-got-it" onClick={handleOkayCheckEstimateTime}>
            {"Okay"}
          </Button>,
        ]}
      />
      {/* Show the dialog if payment method another MOMO */}
      <PaymentStatusDialog
        orderInfo={orderResponseData}
        open={isOpenCreateOrderStatusDialog}
        onCompleted={() => {
          setIsOpenCreateOrderStatusDialog(false);
        }}
      />

      {/* Loyalty point dialog */}
      <ConfirmationDialog
        className={"confirm-modal-config-switch-button"}
        title={translateData.titleNotificationSwitch}
        content={t(verifyUsePointDialogMessage)}
        open={showConfirmCheckLoyaltyPoint}
        okText={translateData.iGotIt}
        onConfirm={() => onConfirmCheckLoyaltyPoint()}
      />

      <CheckoutMomoDialog
        ref={checkoutMomoDialogRef}
        open={isOpenCheckoutMomoDialog}
        onCompleted={() => {
          handlePaymentCompleted(true);
        }}
        onCancel={() => {
          setIsOpenCheckoutMomoDialog(false);
          setIsCreateOrderProcessing(false);
          window.isCreateOrderCheckoutProcessing = false;
        }}
        onMomoExpire={() => {
          if (checkoutMomoDialogRef && checkoutMomoDialogRef.current) {
            checkoutMomoDialogRef.current.showPaymentFailed();
          }
          setIsCreateOrderProcessing(false);
          window.isCreateOrderCheckoutProcessing = false;
        }}
      />
      {/* Verify product price dialog */}
      <ConfirmationDialog
        open={isShowVerifyProductPriceDialog}
        onCancel={() => {}}
        onConfirm={handleOkayVerifyProductPrice}
        confirmLoading={false}
        className="checkout-theme2-notify-dialog"
        content={translateData.productPriceChange}
        footer={[
          <Button className="ant-btn-primary btn-got-it" onClick={handleOkayVerifyProductPrice}>
            {"Okay"}
          </Button>,
        ]}
      />
      {/* Verify Membership Discount */}
      <ConfirmationDialog
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
      {/* Verify flash sale dialog */}
      <ConfirmationDialog
        open={isShowNotifyDialog}
        onCancel={() => {}}
        onConfirm={handleConfirmNotify}
        confirmLoading={false}
        className="checkout-theme2-notify-dialog"
        content={contentNotifyDialog}
        footer={[
          <Button className="ant-btn-primary btn-got-it" onClick={handleConfirmNotify}>
            {translateData.gotIt}
          </Button>,
        ]}
      />
      {/* Discount code dialog */}
      {PromotionsDialogComponent}
      <div
        id="themeCheckoutCheckout"
        onClick={() => {
          if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.CheckoutCheckout);
        }}
      >
        <div style={detailStyle}>
          <div className="check_out_theme2_container page-container">
            <div className="check_out_product">
              <div className="product_summary">
                <div className="total">
                  <div className="shoppingCart" style={{ color: colorGroup?.titleColor }}>
                    {translateData.yourCart}
                  </div>
                  <div className="quantity">
                    <span className="total-quantity">
                      (
                      {!shoppingCart ? 0 : getTotalIemsInShoppingCart(shoppingCart.filter((cart) => cart.quantity > 0))}
                    </span>
                    <span>{translateData.items})</span>
                  </div>
                </div>
                <div className="add" onClick={addMoreProducts}>
                  <div className="add_icon">
                    <img src={checkoutAddIcon} alt={translateData.placeHolderNote} width={20} height={20} />
                  </div>
                  <div className="add_button">{translateData.addMoreProducts}</div>
                </div>
              </div>
              <div className="product_title product-title-web">
                <div style={{ flex: 2 }}>{translateData.cartProduct}</div>
                <div style={{ flex: 1 }}>{translateData.cartPrice}</div>
                <div style={{ flex: 1 }}>{translateData.cartQuantity}</div>
                <div style={{ flex: 1 }}>{translateData.cartTotal}</div>
              </div>
              <div className="product_title product-title-mobile">{translateData.cartProduct}</div>
              <div className="product_detail">
                {!mockupCustomize && shoppingCart?.length > 0 ? (
                  shoppingCart?.map((cart, index) => {
                    return (
                      <CheckoutOrderItems
                        key={cart.id + index}
                        cartItem={cart}
                        currentIndex={index}
                        onUpdateCartQuantity={onUpdateCartQuantity}
                        onDeleteProduct={onDeleteProduct}
                        setCurrentCartItems={(cartItems) => {
                          setShoppingCart(cartItems);
                          callApiValidateCartItems(false, null, isUsePoint);
                        }}
                        index={index}
                        storageConfig={storageConfig}
                        initDataShoppingCart={initDataShoppingCart}
                        calculateShoppingCart={calculateShoppingCart}
                      />
                    );
                  })
                ) : (
                  <div className="noProductInCart">
                    <img src={noProductInCart} alt=""></img>
                    <div className="noProductInCartText">{translateData.emptyCart}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="check_out_shipping">
              <div className="mb-24">
                <CheckoutDeliveryInfo
                  configuration={props?.configuration}
                  colorGroups={props?.colorGroups}
                  deliveryDate={deliveryDate}
                  setDeliveryDate={setDeliveryDate}
                  setTimeSlot={setTimeSlot}
                  timeSlot={timeSlot}
                  isEditReceiver={isEditReceiver}
                  setIsEditReceiver={setIsEditReceiver}
                  onValuesChange={handleChangeReceiver}
                  isCustomize={isCustomize}
                  currentDeliveryMethodSelected={
                    deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY
                      ? currentDeliveryMethodSelected
                      : cookingTime
                  }
                />
              </div>
              {deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY &&
                deliveryAddress?.receiverAddress?.address && (
                  <div className="mb-24">
                    <CheckoutDeliveryMethod
                      onChange={(e) => onChangeDeliveryMethod(e)}
                      value={currentDeliveryMethodSelected}
                      isDefault={isDefault}
                      isCustomize={isCustomize}
                      mockupData={mockupDelivery}
                      configuration={props?.configuration}
                      colorGroups={props?.colorGroups}
                      isCashPaymentMethod={currentPaymentMethodSelected?.paymentMethodEnumId === PaymentMethodType.Cash}
                    />
                  </div>
                )}
              <div className="mb-24">
                <CheckoutPaymentMethod
                  title={translateData.paymentMethod}
                  onChange={(e) => onChangePaymentMethod(e)}
                  value={currentPaymentMethodSelected}
                  isDefault={isDefault}
                  isCustomize={isCustomize}
                  mockupData={mockupPaymentMethod}
                  configuration={props?.configuration}
                  colorGroups={props?.colorGroups}
                  isDisableCashlessMethod={
                    currentDeliveryMethodSelected?.enumDeliveryMethod === EnumDeliveryMethod.GrabExpress &&
                    deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY
                  }
                />
              </div>
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
                  title={titleBtnSelectDiscountCode}
                  onClick={() => {
                    setIsShowDiscountCodeDialog(true);
                  }}
                />
              </div>
              {isShowUsePointContent && (
                <div className="w-100 available-point">
                  <UseAvailablePoint
                    onClick={handleIsActiveAvailablePoint}
                    isLoadingSwitchExchangePoint={isLoadingSwitchExchangePoint}
                    isActiveAvailablePoint={isUsePoint}
                  />
                </div>
              )}

              <div className="mb-24">
                <CheckoutSummary calculateShoppingCart={calculateShoppingCart} />
              </div>
              <CreateOrderButton />

              {earnPoint > 0 && currentCartItem?.length > 0 && <ReceivePointNotification />}
            </div>
          </div>
        </div>
      </div>
      <NotificationDialog
        open={isShowNotifyWorkingHoursDialog}
        title={translateData.notification}
        confirmLoading={false}
        className="checkout-theme1-notify-dialog"
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: t(translateData.soSorryNotificationWorkingHour, {
                timeWorkingHour: timeWorkingHour,
                dayOfWeek: t(dayOfWeek),
              }),
            }}
          ></span>
        }
        footer={[<Button onClick={() => setIsShowNotifyWorkingHoursDialog(false)}>{translateData.iGotIt}</Button>]}
        closable={true}
      />

      {/* Out of stock dialog */}
      <NotificationDialog
        open={isShowDialogOutOfStock}
        title={translateData.notification}
        confirmLoading={false}
        content={translateData.textOutOfStock}
        footer={[<Button onClick={() => setIsShowDialogOutOfStock(false)}>{translateData.iGotIt}</Button>]}
        closable={true}
      />

      {/* Remove item out of stock from cart dialog */}
      <NotificationDialog
        open={isShowDialogRemoveFromCart}
        title={translateData.notification}
        confirmLoading={false}
        content={
          <div>
            <p
              dangerouslySetInnerHTML={{
                __html: t(translateData.someProductOutOfStock),
              }}
            ></p>
            <p style={{ marginTop: 12 }}>{translateData.willBeRemoveFromCart}</p>
          </div>
        }
        footer={[<Button onClick={handleConfirmNotifyOutOfStock}>{translateData.okay}</Button>]}
        closable={true}
      />

      {/*Loading check discount code*/}
      {isLoading && (
        <div className="loading-full-screen">
          <OverlayLoadingFullScreenComponent />
        </div>
      )}
    </>
  );
};

export default CheckOutDetail;
