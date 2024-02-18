import { Button, Col, Input, Popover, Radio, Row, message } from "antd";
import jwt_decode from "jwt-decode";
import { isEqual } from "lodash";
import moment from "moment";
import "moment/locale/vi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import branchDataService from "../../../../data-services/branch-data.services";
import customerDataService from "../../../../data-services/customer-data.service";
import deliveryDataService from "../../../../data-services/delivery-data.service";
import orderDataService from "../../../../data-services/order-data.service";
import paymentDataService from "../../../../data-services/payment-data.service";
import paymentMethodDataService from "../../../../data-services/paymentMethod-data.service";
import storeBranchWorkingHourDataService from "../../../../data-services/store-branch-working-hour.service";
import { store } from "../../../../modules/index";
import {
  setCartItems,
  setDeliveryAddress,
  setDiscountCodes,
  setNotificationDialog,
  setOrderInfo,
} from "../../../../modules/session/session.actions";
import { setMoMoPaymentResponse } from "../../../../modules/third-party-response/third-party-response.actions";
import {
  setToastMessageAddUpdateProductToCart,
  setToastMessageMaxDiscount,
} from "../../../../modules/toast-message/toast-message.actions";
import { useAppCtx } from "../../../../providers/app.provider";
import { logService } from "../../../../services/log/log.service";
import { checkOutOfStockAllProductWhenUpdateCart } from "../../../../services/material/check-out-of-stock.service";
import maxDiscountService from "../../../../services/max-discount.services";
import orderService from "../../../../services/orders/order-service";
import reduxService from "../../../../services/redux.services";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import {
  areArraysEqual,
  checkNonEmptyArray,
  checkOnKeyPressValidation,
  convertLocalTime,
  formatTextNumber,
  roundNumber,
} from "../../../../utils/helpers";
import { HttpStatusCode } from "../../../../utils/http-common";
import { getStorage, localStorageKeys } from "../../../../utils/localStorage.helpers";
import {
  ArrowRightWhite,
  CheckoutCompleteIcon,
  DiscountCodeIcon,
  NoteIcon,
  PointLogo,
  RemoveDiscountCodeIcon,
} from "../../../assets/icons.constants";
import checkout_arrow_down from "../../../assets/icons/checkout-arrow-down.svg";
import checkout_arrow_up from "../../../assets/icons/checkout-arrow-up.svg";
import emptyCart from "../../../assets/images/check-out-empty-cart.png";
import discountPercentImage from "../../../assets/images/discount-percent.png";
import { BCButton } from "../../../components/BCButton";
import BankTransferPayment from "../../../components/BankTransferPayment/BankTransferPayment";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog.component";
import NotificationDialog from "../../../components/notification-dialog/notification-dialog.component";
import OverlayLoadingFullScreenComponent from "../../../components/overlay-loading-full-screen/OverlayLoadingFullScreenComponent";
import { EnumDeliveryMethod } from "../../../constants/delivery-method.constants";
import { EnumDayOfWeek, EnumNextTimeOpenType, EnumPromotion, enumOrderType } from "../../../constants/enums";
import { defaultCookingTime } from "../../../constants/number.constants";
import { PaymentMethodType } from "../../../constants/payment-method.constants";
import { theme1ElementCustomize } from "../../../constants/store-web-page.constants";
import { PHONE_NUMBER_REGEX } from "../../../constants/string.constants";
import "../../../stylesheets/fnb-radio-antd.scss";
import { mockupCheckout, shippingIcons } from "../default-data";
import CheckOutCash from "./checkout-cash";
import CheckoutDeliveryInfo from "./checkout-delivery-info/checkout-delivery-info.component";
import CheckOutDiscounts from "./checkout-discounts";
import CheckOutMomo from "./checkout-momo";
import CheckOutMomoFailed from "./checkout-momo-failed";
import CheckOutMomoSuccess from "./checkout-momo-success";
import CheckOutMomoWeb from "./checkout-momo-web";
import CheckOutTaxes from "./checkout-taxes";
import "./checkout.detail.scss";
import CheckOutProductItem from "./checkout.product.item";
import UseDiscount from "./get-discount-button/get-discount-button";
import { UsePointComponent } from "./use-point/use-point.component";

export default function CheckOutDetail(props) {
  const {
    configuration,
    colorGroups,
    clickToFocusCustomize,
    isDefault,
    isCustomize,
    config: themePageConfig,
    general,
  } = props;

  const checkoutColorGroup = useMemo(() => {
    if (Boolean(general)) {
      const colorGroup = general?.color?.colorGroups?.find((c) => c.id === themePageConfig?.checkout?.colorGroupId);
      if (Boolean(colorGroup)) {
        return colorGroup;
      }
    }

    return undefined;
  }, [themePageConfig]);

  const readPhoneFromStorage = () => {
    if (clickToFocusCustomize || isDefault) {
      return mockupCheckout.phone;
    }
    const loginData = JSON.parse(getStorage(localStorageKeys.LOGIN));
    return loginData?.phone;
  };
  const defaultCustomerName = () => {
    if (clickToFocusCustomize || isDefault) {
      return mockupCheckout.name;
    }
    let customerInfo = getStorage(localStorageKeys.CUSTOMER_INFO);
    if (customerInfo) customerInfo = JSON.parse(customerInfo);
    return customerInfo?.fullName ?? readPhoneFromStorage();
  };
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { Toast } = useAppCtx();
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const backgroundImage = configuration?.backgroundImage;
  const backgroundColor = configuration?.backgroundColor;
  const backgroundType = configuration?.backgroundType;
  const colorGroup = colorGroups?.find((c) => c.id === configuration?.colorGroupId);
  const momoPaymentResponse = useSelector((state) => state?.thirdParty?.momoPaymentResponse ?? null);
  const reduxOrderInfo = useSelector((state) => state?.session?.orderInfo ?? null);
  const isChangedProductPriceVar = reduxOrderInfo?.cartValidated?.isChangedProductPrice;
  const reduxShoppingCart = useSelector((state) => state?.session?.cartItems ?? []);
  const currentSignature = useSelector((state) => state?.session?.orderInfo?.cartValidated?.signature);
  const discountCodes = useSelector((state) => state?.session?.discountCodes ?? []);
  const appliedDiscountCodes = useSelector((state) => state?.session?.appliedDiscountCodes ?? {});
  const [orderNotes, setOrderNotes] = useState("");
  const [shoppingCart, setShoppingCart] = useState([]);
  const [customerName, setCustomerName] = useState(defaultCustomerName());
  const [phone, setPhone] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isShowCash, setIsShowCash] = useState(false);
  const [isShowMomo, setIsShowMomo] = useState(false);
  const [isShowUseDiscount, setIsShowUseDiscount] = useState(false);
  const [paymentBankTransfer, setPaymentBankTransfer] = useState(null);
  const [orderId, setOrderId] = useState(false);
  const [orderStringCode, setOrderStringCode] = useState(null);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditPhone, setIsEditPhone] = useState(false);
  const [isShowDiscount, setIsShowDiscount] = useState(false);
  const [isShowFeeAndTax, setIsShowFeeAndTax] = useState(false);
  const [momoQRCodeURL, setMomoQRCodeURL] = useState(false);
  const [momoDeeplink, setMomoDeeplink] = useState(false);
  const [usingMomoWeb, setUsingMomoWeb] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [isShowPaymentMomoFailed, setIsShowPaymentMomoFailed] = useState(false);
  const [momoError, setMomoError] = useState(null);
  const [isShowPaymentMomoSuccess, setIsShowPaymentMomoSuccess] = useState(false);
  const [isShowNotifyDialog, setIsShowNotifyDialog] = useState(false);
  const [contentNotifyDialog, setContentNotifyDialog] = useState("");
  const [currentOrderInfo, setCurrentOrderInfo] = useState({});
  const [isCreateOrderProcessing, setIsCreateOrderProcessing] = useState(false);
  const momoMinimumAmount = 1000;
  const [isClickComplete, setIsClickComplete] = useState(false);
  const [isShowVerifyProductPriceDialog, setIsShowVerifyProductPriceDialog] = useState(false);
  const [isShowNotifyCustomerRankDialog, setIsShowNotifyCustomerRankDialog] = useState(false);
  let deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  let branchAddress = useSelector((state) => state?.session?.deliveryAddress?.branchAddress);
  const calculateCustomerLoyaltyPoint = useSelector(
    (state) => state?.session?.orderInfo?.cartValidated?.calculateCustomerLoyaltyPoint,
  );
  const currentCartItem = useSelector((state) => state?.session?.cartItems);
  const [responseDataMomo, setResponseDataMomo] = useState(null);
  const [isUsePoint, setIsUsePoint] = useState(false);
  const [currentAvailablePoint, setCurrentAvailablePoint] = useState(0);
  const [isShowUsePointContent, setIsShowUsePointContent] = useState(false);
  const [isShowVerifyUsePointDialog, setIsShowVerifyUsePointDialog] = useState(false);
  const [verifyUsePointDialogMessage, setVerifyUsePointDialogMessage] = useState("");
  const usePointComponentRef = useRef();
  const [earnPoint, setEarnPoint] = useState(0);
  const [isInitData, setIsInitData] = useState(true);
  const [isNotAvailableItem, setIsNotAvailableItem] = useState(false);
  const [estimateTime, setEstimateTime] = useState(defaultCookingTime);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);
  const [isShowCloseStoreDialog, setIsShowCloseStoreDialog] = useState(false);
  const [branchOpenTime, setBranchOpenTime] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [iShowIconFeeTax, setIShowIconFeeTax] = useState(true);
  const location = useLocation();
  const paymentMethodId = location?.state?.paymentMethodId;
  const deliveryMethodId = location?.state?.deliveryMethodId;
  const orderTypeId = location?.state?.orderTypeId;
  const taxes = useSelector((state) => state?.session?.orderInfo?.cartValidated?.taxes ?? []);
  const deliveryMethodInRedux = useSelector((state) => state?.session?.orderInfo?.deliveryMethod ?? 0);
  const enumPaymentMethodSelected = paymentMethods?.find(
    (p) => p?.paymentMethodId === paymentMethod,
  )?.paymentMethodEnumId;
  const enumDeliveryMethodSelected = deliveryMethods?.find(
    (p) => p?.deliveryMethodId === deliveryMethod,
  )?.enumDeliveryMethod;
  //Load mockup data if in customize or original preview
  if (clickToFocusCustomize || isDefault) {
    deliveryAddress = mockupCheckout.deliveryAddress;
  }
  const [isAllowShowSelectAddressSuccessful, setIsAllowShowSelectAddressSuccessful] = useState(false);
  const hasDiscounts =
    (reduxOrderInfo?.cartValidated?.promotions && reduxOrderInfo?.cartValidated?.promotions?.length > 0) ||
    reduxOrderInfo?.cartValidated?.customerDiscountAmount > 0 ||
    reduxOrderInfo?.cartValidated?.totalDiscountAmount > 0;
  const hasTaxes = reduxOrderInfo?.cartValidated?.taxes && reduxOrderInfo?.cartValidated?.taxes?.length > 0;
  const pageData = {
    addMoreProducts: t("checkOutPage.addMoreProducts", "Add more products"),
    changeAddress: t("checkOutPage.changeAddress", "Change another address"),
    configureAddress: t("checkOutPage.configureAddress", "Configure address"),
    noAddressMessage: t("checkOutPage.noAddressMessage", "You have no shipping address. Please configure one"),
    complete: t("checkOutPage.complete", "Complete"),
    deliveryTo: t("checkOutPage.deliveryTo", "Delivery to"),
    discount: t("checkOutPage.discount", "Discount"),
    feeAndTax: t("checkOutPage.feeAndTax", "Fee & Tax"),
    shippingFee: t("checkOutPage.shippingFee", "Shipping Fee"),
    useDiscountMessage: t("checkOutPage.useDiscountMessage", "Sử dụng giảm giá"),
    discountHasBeenApplied: t("checkOutPage.discountHasBeenApplied", "Đã áp dụng giảm giá"),
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
    invalidPhoneNumber: t("checkOutPage.invalidPhoneNumber", "Invalid phone number"),
    customerRankChangeNotification: t(
      "checkOutPage.customerRankChangeNotification",
      "Cấu hình hạng thành viên đã có thay đổi, </br>vui lòng kiểm tra lại đơn hàng.",
    ),
    inactive: t(
      "promotion.flashSale.description.inactive",
      "Chương trình Flash sales đã kết thúc. Các sản phẩm sẽ được trả về giá bán ban đầu.",
    ),
    minimumPurchaseValue: t(
      "promotion.flashSale.description.minimumPurchaseValue",
      "Đơn hàng không đạt điều kiện giá trị tối thiểu, các sản phẩm flash sale không hợp lệ sẽ được trả về giá bán ban đầu.",
    ),
    overLimited: t(
      "promotion.flashSale.description.overLimited",
      "Chiến dịch giảm giá Flash sale đã được sử dụng vượt giới hạn.",
    ),
    notFound: t("promotion.flashSale.description.notFound", "Không tìm thấy chiến dịch Flash Sale."),
    gotIt: t("storeWebPage.generalUse.gotIt", "Got it!"),
    noPaymentMethod: t("checkOutPage.noPaymentMethod", "No payment method"),
    momoMinimumAmount: t("momo.minimumAmount", "The minimum payment on order is 1000đ via MoMo"),
    selectAddressSuccessful: t("checkOutPage.selectAddressSuccessful", "Select address successful"),
    deliveryMethod: {
      shopDelivery: t("deliveryMethod.shopDelivery"),
      ahamove: t("deliveryMethod.ahamove"),
      grabExpress: t("deliveryMethod.grabExpress", "Grab Express"),
    },
    updateCartItemToastMessage: t("updateCartItemToastMessage", "Món ăn đã được cập nhật thành công"),
    notePlaceHolder: t("checkOutPage.notePlaceHolder", "Nhập ghi chú"),
    createOrderPaymentErrorMessage: t(
      "checkOutPage.createOrderPaymentErrorMessage",
      "Không thể tạo đơn hàng với phương thức thanh toán này, vui lòng kiểm tra lại!",
    ),
    paymentMethods: {
      cash: t("paymentMethod.cash", "Cash"),
      bankTransfer: t("paymentMethod.bankTransfer", "Bank Transfer"),
    },
    okay: t("order.okay"),
    notification: t("storeWebPage.generalUse.Notification", "Thông báo"),
    earnPointMessage: t(
      "checkOutPage.earnPointMessage",
      "Bạn sẽ kiếm được <span class = {{earn_points}}>{{earnPoints}}</span> điểm khi hoàn thành đơn hàng.",
    ),
    productNotInBranch: t("form.productNotInBranch", "Rất tiếc, Sản phẩm này không có sẵn ở chi nhánh hiện tại"),
    pleaseSelectBranchAddress: t("storeWebPage.pleaseSelectBranchAddress", "Vui lòng chọn chi nhánh mua hàng!"),
    soSorryNotificationWorkingHour: t(
      "storeBranch.soSorryNotificationWorkingHour",
      "Rất xin lỗi! Hiện tại không phải thời gian làm việc của cửa hàng. Vui lòng quay lại vào lúc <strong>{{timeWorkingHour}} {{dayOfWeek}}</strong>",
    ),
    iGotIt: t("loginPage.iGotIt", "I got it"),
    outOfStock: t("storeWebPage.productDetailPage.outOfStock", "outOfStock"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Sorry! Product is not enough of stock"),
    okay: t("form.okay"),
    notification: t("loginPage.notification"),
    textOutOfStockRemove: t(
      "storeWebPage.productDetailPage.textOutOfStockRemove",
      "So sorry! Some product has been out of stock. They will be removed from the cart!",
    ),
    checkDeliveryEstimateTime: t(
      "checkOutPage.checkDeliveryEstimateTime",
      "Thời gian giao hàng không phù hợp, vui lòng chọn lại!",
    ),
    checkPickupEstimateTime: t(
      "checkOutPage.checkPickupEstimateTime",
      "Thời gian lấy hàng không phù hợp, vui lòng chọn lại!",
    ),
    justSupportOrderHasPaymentByCOD: t(
      "checkOutPage.justSupportOrderHasPaymentByCOD",
      "*Chỉ hỗ trợ đơn hàng có thanh toán bằng COD (tiền mặt).",
    ),
  };

  const currentCartValidated = useSelector((state) => state?.session?.orderInfo?.cartValidated);

  const reduxData = { ...reduxService.getAllData() };
  const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
  const storeConfig = JSON.parse(jsonConfig);
  const storeId = storeConfig?.storeId;
  const customerId = reduxData?.orderInfo?.deliveryInfo?.customerId ?? null;
  const firstdeliveryFee = reduxData?.deliveryMethods?.[0]?.pricing ?? 0;
  const currentDiscountCodes = checkNonEmptyArray(reduxData?.discountCodes) ? reduxData?.discountCodes : [];

  const [isShowCheckEstimateTime, setIsShowCheckEstimateTime] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //#region Check working hour
  async function getWorkingHour() {
    const workingHour = await storeBranchWorkingHourDataService.getStoreBranchWorkingHour(branchAddress?.id ?? null);
    if (workingHour) {
      setWorkingHour(workingHour?.data?.storeBranchWorkingHours);
    }
  }

  async function checkIfBranchIsClosed() {
    let isClosed = false;
    const workingHour = await branchDataService.getWorkingHourByBranchIdAsync(branchAddress?.id ?? null);
    const workingHourResult = workingHour?.data;
    if (workingHourResult?.isClosed === true) {
      setBranchOpenTime(workingHourResult?.workingHour?.openTime);
      if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[1].key) {
        setDayOfWeek(EnumNextTimeOpenType[workingHourResult?.workingHour?.nextTimeOpen - 1].name);
      } else if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[2].key) {
        setDayOfWeek(EnumDayOfWeek[workingHourResult?.workingHour?.dayOfWeek].name);
      }
      isClosed = true;
    }
    return isClosed;
  }

  function handleSetDefaultPaymentMethodWhenChangeOrderType() {
    if (deliveryAddress?.orderType === enumOrderType.PICK_UP) {
      const paymentMethodCashId = paymentMethods?.find(
        (p) => p?.paymentMethodEnumId === PaymentMethodType.Cash,
      )?.paymentMethodId;
      if (paymentMethodCashId) {
        onChangePaymentMethod(null, paymentMethodCashId);
      }
    }
  }
  //#endregion

  useEffect(() => {
    // Get cart in redux to calculate then update cart in redex, local storage
    calculateShoppingCart();

    const loginData = JSON.parse(getStorage(localStorageKeys.LOGIN));
    if (!clickToFocusCustomize && !isDefault) {
      getWorkingHour();

      loadPaymentMethods();
      let customerInfo = getStorage(localStorageKeys.CUSTOMER_INFO);
      if (customerInfo) customerInfo = JSON.parse(customerInfo);
      const token = getStorage(localStorageKeys.TOKEN);
      const decoded_token = token && jwt_decode(token);
      setAccountId(decoded_token?.ACCOUNT_ID);
      setCustomerName(decoded_token?.FULL_NAME ? decoded_token?.FULL_NAME : customerInfo?.fullName);
      setCountryCode(loginData?.countryCode);
      setPhone(loginData?.phone);
    } else {
      setCountryCode(loginData?.countryCode);
      setCustomerName(mockupCheckout.name);
      setPhone(mockupCheckout.phone);
      setDeliveryMethods(mockupCheckout.deliveryMethods);
      setDeliveryMethod(mockupCheckout.deliveryMethods[0].deliveryMethodId);
      setPaymentMethods(mockupCheckout.paymentMethods);
      setPaymentMethod(mockupCheckout.paymentMethods[0].paymentMethodId);
    }
    setIsInitData(false);
  }, []);

  useEffect(() => {
    // update shopping cart in this page by sync data from redux
    const updateShoppingCart = () => {
      if (!isEqual(shoppingCart, reduxShoppingCart)) {
        setShoppingCart(reduxShoppingCart);
      }
    };
    updateShoppingCart();
  }, [reduxShoppingCart]);

  useEffect(() => {
    async function fetchData() {
      //Bypass if in customize or original preview theme mode
      if (!clickToFocusCustomize && !isDefault && !isCustomize) {
        getDeliveryInfoFromLoginSession();
        await initDataDeliveryMethods(deliveryAddress);
      }
      if (deliveryAddress?.receiverAddress && isAllowShowSelectAddressSuccessful) {
        Toast.success({
          message: pageData.selectAddressSuccessful,
          placement: "top",
        });
      }
    }
    fetchData();
  }, [deliveryAddress]);

  useEffect(() => {
    //Bypass if in customize or original preview theme mode
    if (!clickToFocusCustomize && !isDefault && !isCustomize) {
      if (momoPaymentResponse) {
        const { result, message } = momoPaymentResponse;
        if (result === true) {
          onMomoSuccess();
        } else {
          onMomoFailed(message);
        }
      }
    }
  }, [momoPaymentResponse]);

  useEffect(() => {
    if (!isInitData) {
      calculateShoppingCart();
    }
  }, [deliveryMethod]);

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
              setShoppingCart([]);
              setCurrentOrderInfo(undefined);
              dispatch(setOrderInfo(undefined));
            }
          });
      }, 5000);

      return () => clearInterval(intervalGetPaymentStatusID);
    }
  }, [responseDataMomo]);

  useEffect(() => {
    calculateShoppingCart();
  }, [deliveryMethodInRedux]);

  useEffect(() => {
    setIsShowPaymentMomoSuccess(false);
  }, []);

  useEffect(() => {
    if (!isCustomize) {
      const isEqual = areArraysEqual(appliedDiscountCodes?.discountCodes, discountCodes);
      if (!isEqual) {
        const numberOfDiscountCodeApplied = appliedDiscountCodes?.discountCodes?.length ?? 0;
        const numberOfDiscountCode = discountCodes?.length ?? 0;

        //numberOfDiscountCode > numberOfDiscountCodeApplied that is, apply additional discount codes
        const isShowToastMessageDiscountCode = numberOfDiscountCode > numberOfDiscountCodeApplied;
        checkDiscountCodeApplied(isShowToastMessageDiscountCode);
      }
    }
  }, [discountCodes]);

  useEffect(() => {
    if (!isCustomize) {
      dispatch(setDiscountCodes(appliedDiscountCodes?.discountCodes ?? []));
    }
  }, [appliedDiscountCodes]);

  const [workingHour, setWorkingHour] = useState(null);

  const loadPaymentMethods = async () => {
    const res = await paymentMethodDataService.getStoreConfigPaymentMethods(storeId, branchAddress?.id);
    if (!res?.data) return;
    const paymentMethodsRes = res?.data?.sort((a, b) => (a.paymentMethodName > b.paymentMethodName ? 1 : -1));
    const indexPaymentMethodBankTransfer = paymentMethodsRes?.findIndex(
      (p) => p?.paymentMethodEnumId === PaymentMethodType.BankTransfer,
    );
    if (indexPaymentMethodBankTransfer !== -1) {
      paymentMethodsRes.push(paymentMethodsRes.splice(indexPaymentMethodBankTransfer, 1)[0]);
    }

    setPaymentMethods(paymentMethodsRes);
    if (paymentMethodId != undefined && paymentMethodId != null) {
      setPaymentMethod(paymentMethodId);
      const bankTransferData = paymentMethodsRes?.find(
        (p) => p?.paymentMethodId === paymentMethodId && p?.paymentMethodEnumId === PaymentMethodType.BankTransfer,
      );
      if (bankTransferData) {
        setPaymentBankTransfer(bankTransferData);
      } else {
        setPaymentBankTransfer(null);
      }
    } else if (paymentMethodsRes?.length > 0) {
      setPaymentMethod(paymentMethodsRes[0].paymentMethodId);
      setPaymentBankTransfer(null);
    }
    handleSetDefaultPaymentMethodWhenChangeOrderType();
  };

  const handleOkayVerifyUsePoint = () => {
    setIsShowVerifyUsePointDialog(false);
    callApiValidateCartItems(false, null, false);
    setIsUsePoint(false);
    window.isUsePoint = false;
    usePointComponentRef?.current?.setIsChecked(false);
  };

  const handleVerifyCustomerLoyaltyPoint = async () => {
    let isVerifyFailed = false;
    const { availablePoint, redeemPointExchangeValue } = calculateCustomerLoyaltyPoint;
    if (availablePoint >= 0 && redeemPointExchangeValue >= 0) {
      const res = await customerDataService.verifyCustomerLoyaltyPointAsync(availablePoint, redeemPointExchangeValue);
      if (res) {
        const { isUsePointFailed, errorMessage } = res?.data?.response;
        if (isUsePointFailed === true) {
          setVerifyUsePointDialogMessage(t(errorMessage));
          setIsShowVerifyUsePointDialog(true);
          isVerifyFailed = true;
        }
      }
    }

    return isVerifyFailed;
  };

  const handleSwitchIsUsePoint = async (checked) => {
    setIsUsePoint(checked);
    window.isUsePoint = checked;
    if (checked) {
      //Verify before calculate
      handleVerifyCustomerLoyaltyPoint();
      callApiValidateCartItems(false, null, true);
    } else {
      callApiValidateCartItems(false, null, false);
    }
  };

  const isHasAddress = () => {
    if (!deliveryAddress?.receiverAddress) return false;
    return true;
  };

  const getDeliveryInfoFromLoginSession = () => {
    const token = getStorage(localStorageKeys.TOKEN);
    const loginData = JSON.parse(getStorage(localStorageKeys.LOGIN));
    const decoded_token = token && jwt_decode(token);
    const customerId = decoded_token?.ID;
    const accountId = decoded_token?.ACCOUNT_ID;
    const customerName = decoded_token?.FULL_NAME;
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

    setCurrentOrderInfo(orderInfo);
    dispatch(setOrderInfo(orderInfo));
  };

  const getOrderInfo = () => {
    const reduxState = store.getState();
    const session = reduxState?.session;
    const requestCartItems = session?.cartItems?.map((item) => {
      mappingOrderCartItem(item);
    });
    const orderInfo = {
      ...session?.orderInfo,
      cartItems: requestCartItems ?? [],
      orderNotes: orderNotes,
    };

    return orderInfo;
  };

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

  const calculateShoppingCart = (cartItems) => {
    //Not call API when in customize or preview page
    if (clickToFocusCustomize || isDefault || isCustomize) return;
    if (window.callApiValidateCartItems) {
      clearTimeout(window.callApiValidateCartItems);
    }
    window.callApiValidateCartItems = setTimeout(() => {
      callApiValidateCartItems(false, cartItems, isUsePoint);
    }, 200);
  };

  const initDataDeliveryMethods = async (deliveryAddress) => {
    if (deliveryAddress) {
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
      };
      const res = await deliveryDataService.calculateDeliveryFee(request);
      if (res) {
        //Sort to select cheapest shipping fee
        const listDeliveryMethods = res?.data?.deliveryPricings;
        if (listDeliveryMethods?.length > 0) {
          const listDeliveryMethodsSortByEnum = listDeliveryMethods.sort(
            (a, b) => a.enumDeliveryMethod - b.enumDeliveryMethod,
          );

          const deliveryMethod = deliveryMethodId
            ? listDeliveryMethods.find((delivery) => delivery.deliveryMethodId === deliveryMethodId)
            : listDeliveryMethods.reduce(function (min, current) {
                return current.pricing < min.pricing ? current : min;
              }, listDeliveryMethods[0]);

          setDeliveryMethods(listDeliveryMethodsSortByEnum);
          setDeliveryFee(deliveryMethod?.pricing);
          setDeliveryMethod(deliveryMethod?.deliveryMethodId);
          setEstimateTime(deliveryMethod?.estimateTime);

          ///Set cooking time if type pick up
          if (deliveryAddress?.orderType === enumOrderType.PICK_UP) {
            const shopDelivery = listDeliveryMethodsSortByEnum?.find(
              (item) => item.enumDeliveryMethod === EnumDeliveryMethod.ShopDelivery,
            );
            setEstimateTime(shopDelivery?.estimateTime);
          }
        }
      }
    }
  };

  const callApiValidateCartItems = async (
    isCheckChangedData,
    cartItems,
    isActiveUsedPoint,
    isOrderCreating = false,
    isShowToastMessageDiscountCode = false,
  ) => {
    //Not call API when in customize or preview page
    if (clickToFocusCustomize || isDefault) return;

    let isChangedProductPrice = false;

    if (!cartItems || cartItems?.length === 0) {
      const reduxState = store.getState();
      const session = reduxState?.session;
      cartItems = session?.cartItems ?? [];
    }

    let deliveryFees = 0;
    if (deliveryFee) {
      deliveryFees = deliveryFee;
    } else {
      deliveryFees = firstdeliveryFee;
    }

    ///Set delivery fee = 0 when PickUp
    if (deliveryAddress?.orderType === enumOrderType.PICK_UP) {
      deliveryFees = 0;
    }

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
      isCheckoutPage: true,
    };

    isChangedProductPrice = await shoppingCartService.verifyAndUpdateCart(dataRequest);
    setIsAllowShowSelectAddressSuccessful(true);
    return isChangedProductPrice;
  };

  const callBackCheckFlashSale = (message) => {
    setContentNotifyDialog(message);
    setIsShowNotifyDialog(true);
  };

  const detailStyle =
    backgroundType === 1
      ? {
          background: backgroundColor,
        }
      : {
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        };

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
  const onUpdateCartQuantity = async (id, quantity, cartIndex, isIncrease) => {
    if (!shoppingCart || shoppingCart.length === 0) return;
    let data = [...shoppingCart];

    if (isIncrease) {
      //Check out of stock
      const cartData = [...shoppingCart];
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
      if (verifyOutOfStock) {
        const notificationDialog = {
          isShow: true,
          content: pageData.textOutOfStock,
        };
        dispatch(setNotificationDialog(notificationDialog));
        return;
      }
    }

    data = data.map((cart, index) =>
      cart.id === id && index === cartIndex ? { ...cart, quantity: Math.max(cart.quantity + quantity, 1) } : cart,
    );
    data = data.filter((cart) => cart.quantity > 0);
    document.getElementById("cart-quantity").innerText = data?.reduce((total, cart) => {
      return total + cart.quantity;
    }, 0);

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
      quantity: currentOrderInfo?.cartValidated?.isDiscountOnTotal ? 2 : data[cartIndex]?.quantity,
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
    dispatch(setCartItems(data));
    setShoppingCart(data);
    calculateShoppingCart(data);
  };

  const compareProduct = (firstProduct, secondProduct) => {
    let isTheSame = false;
    if (
      firstProduct?.id === secondProduct?.id &&
      firstProduct?.productPrice?.flashSaleId === secondProduct?.productPrice?.flashSaleId &&
      firstProduct?.productPrice?.id === secondProduct?.productPrice?.id &&
      firstProduct?.options?.every((firstOption) => {
        return secondProduct?.options?.some(
          (secondOption) => firstOption?.optionLevelId === secondOption?.optionLevelId,
        );
      }) &&
      firstProduct?.toppings.length === secondProduct?.toppings.length &&
      firstProduct?.toppings?.every((firstTopping) => {
        return secondProduct?.toppings?.some(
          (secondTopping) =>
            secondTopping?.id === firstTopping?.id && secondTopping?.quantity === firstTopping?.quantity,
        );
      })
    ) {
      isTheSame = true;
    }
    return isTheSame;
  };

  const mergeProducts = (product, productList) => {
    if (productList) {
      var index = productList.findIndex((productItem) => {
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

  const onUpdateItemHasFlashSaleInCart = (cartItems) => {
    var productsAppliedFlashSaleFailed = cartItems.filter(
      (item) => !item?.isFlashSale && item?.flashSaleId !== null && item?.flashSaleId !== undefined,
    );
    let shoppingCartEdit = JSON.parse(localStorage.getItem(localStorageKeys.STORE_CART));
    let shoppingCartNew = [];
    productsAppliedFlashSaleFailed?.forEach((product) => {
      let indexEdit = shoppingCartEdit.findIndex(
        (cart) =>
          cart?.productPrice?.id === product?.productPriceId &&
          cart?.productPrice?.flashSaleId === product?.flashSaleId,
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
    setShoppingCart(shoppingCartEdit);
    shoppingCartService.setStoreCartLocalStorage(shoppingCartNew);
  };

  const addMoreProducts = () => {
    //Bypass if in customize or original preview theme mode
    if (clickToFocusCustomize || isDefault) return;
    history.push("/product-list");
    dispatch(setToastMessageAddUpdateProductToCart(null));
  };

  const isHasCustomerName = () => {
    if (!customerName) return false;
    return true;
  };

  const isHasPhone = () => {
    if (!phone) return false;
    return phone;
  };

  const checkValidData = () => {
    //Bypass if in customize theme or original theme preview
    if (clickToFocusCustomize || isDefault) return false;
    if (!customerName) return false;
    if (!phone || !PHONE_NUMBER_REGEX.test(phone)) return false;
    if (
      !deliveryAddress ||
      !deliveryAddress?.orderType ||
      deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY
    ) {
      if (!deliveryAddress?.receiverAddress) {
        openShippingAddressModal();
        return false;
      }
    }
    if (!branchAddress) {
      return false;
    }
    const enumPaymentMethod = paymentMethods?.find((p) => p?.paymentMethodId === paymentMethod)?.paymentMethodEnumId;
    if (totalAmount() < momoMinimumAmount && enumPaymentMethod === PaymentMethodType.Momo && shoppingCart?.length > 0) {
      Toast.success({
        message: pageData.momoMinimumAmount,
        placement: "top",
      });
      return false;
    }
    return shoppingCart?.filter((p) => p.quantity > 0).length > 0;
  };

  const onChangeCustomerName = (e) => {
    setIsEditName(true);
    setCustomerName(e.target.value);
  };

  const onChangePhone = (e) => {
    setIsEditPhone(true);
    setPhone(e.target.value);
  };

  const getReceiverRemarks = (phone, loginUserInfo) => {
    if (phone !== loginUserInfo?.phoneNumber) {
      return `Backup: ${loginUserInfo?.fullName} - ${loginUserInfo?.phoneNumber}`;
    }
    return "";
  };

  const getLoginUserInfo = () => {
    const customerInfoJsonString = getStorage(localStorageKeys.CUSTOMER_INFO);
    const customerInfo = JSON.parse(customerInfoJsonString);

    return customerInfo;
  };

  const checkOutOrder = async () => {
    if (isCreateOrderProcessing) return;
    const reduxState = store.getState();
    const orderInfo = getOrderInfo();
    const { cartValidated } = orderInfo;

    //Check valid data before save order
    if (!cartValidated?.cartItems || !deliveryAddress) {
      return;
    }

    const enumDeliveryMethod = deliveryMethods?.find((d) => d.deliveryMethodId === deliveryMethod)?.enumDeliveryMethod;
    const enumPaymentMethod = paymentMethods?.find((p) => p.paymentMethodId === paymentMethod)?.paymentMethodEnumId;

    const branchAddress = reduxState?.session?.deliveryAddress?.branchAddress;
    const loginUserInfo = getLoginUserInfo();

    const createOrderRequest = {
      accountId: loginUserInfo?.accountId,
      branchId: branchAddress?.id ?? null,
      customerId: orderInfo?.deliveryInfo?.customerId ?? null,
      enumPaymentMethodId: enumPaymentMethod,
      isDeliveryOrder: true,
      deliveryMethodId: deliveryAddress?.orderType === enumOrderType.PICK_UP ? null : deliveryMethod,
      deliveryMethod: deliveryAddress?.orderType === enumOrderType.PICK_UP ? null : enumDeliveryMethod,
      cartItems: cartValidated?.cartItems,
      totalTax: cartValidated?.totalTax,
      deliveryFee: deliveryAddress?.orderType === enumOrderType.PICK_UP ? 0 : deliveryFee,
      receiverName: customerName,
      receiverPhone: phone,
      receiverAddress: {
        address: deliveryAddress?.receiverAddress?.address,
        lat: deliveryAddress?.receiverAddress?.lat,
        lng: deliveryAddress?.receiverAddress?.lng,
      },
      receiverRemarks: getReceiverRemarks(phone, loginUserInfo),
      note: orderNotes,
      userPhoneNumber: loginUserInfo?.phoneNumber,
      userFullName: loginUserInfo?.fullName,
      discountCodes: Array.isArray(discountCodes) ? discountCodes : [],
      isActiveUsedPoint: isUsePoint,
      scheduledTime: orderService.getScheduleTime(deliveryDate, timeSlot),
      enumOrderTypeId:
        deliveryAddress?.orderType === enumOrderType.PICK_UP ? enumOrderType.PICK_UP : enumOrderType.ONLINE_DELIVERY,
      isOrderCreating: true,
    };

    try {
      const response = await orderDataService.createStoreWebOrderAsync(createOrderRequest);
      if (response.status === HttpStatusCode.Ok) {
        let deeplink = null;
        const responseData = response.data;

        if (responseData?.paymentInfo) {
          const resultCode = responseData?.paymentInfo?.resultCode ?? 0;
          if (resultCode > 0) {
            console.error(responseData?.paymentInfo?.message);
            Toast.error({
              message: pageData.createOrderPaymentErrorMessage,
              placement: "top",
            });
            logService.trackTrace("[CREATE ORDER] " + JSON.stringify(responseData));
          } else {
            const qrCodeUrl = responseData?.paymentInfo?.qrCodeUrl;
            setMomoQRCodeURL(qrCodeUrl);

            deeplink = responseData?.paymentInfo?.deepLink;
            setMomoDeeplink(deeplink);
          }
        }

        setOrderId(responseData.orderId);
        setOrderStringCode(responseData.stringCode);

        if (enumPaymentMethod === PaymentMethodType.Cash || enumPaymentMethod === PaymentMethodType.BankTransfer) {
          setIsShowCash(true);
        } else if (enumPaymentMethod === PaymentMethodType.Momo) {
          if (!isMobile || !deeplink) setUsingMomoWeb(true);
          else setIsShowMomo(true);

          setResponseDataMomo(responseData);
        }
        dispatch(setDiscountCodes([]));
      } else if (response.status === HttpStatusCode.BadRequest) {
        calculateShoppingCart();
      }
    } catch (err) {}

    setIsCreateOrderProcessing(false);
  };

  const onShowToastMessageUpdateCartItem = () => {
    dispatch(
      setToastMessageAddUpdateProductToCart({
        icon: null,
        message: pageData.updateCartItemToastMessage,
      }),
    );
  };
  const [isShowMessageOutOfStock, setIsShowMessageOutOfStock] = useState(false);

  async function handleConfirmNotifyOutOfStock() {
    setIsShowMessageOutOfStock(false);
    let newCartItems = [...shoppingCart];
    const newCarts = shoppingCartService.removeOutOfStockCartItem(newCartItems);
    dispatch(setCartItems(newCarts));
    setShoppingCart(newCarts);
    calculateShoppingCart(newCarts);
  }

  function showPopupCheckTimePlaceOrder(time, date) {
    let isShowCheckEstimateTime = false;
    const now = moment();
    const estimateTime = convertLocalTime(time, date);
    if (estimateTime && now.isAfter(estimateTime)) {
      isShowCheckEstimateTime = true;
    }
    return isShowCheckEstimateTime;
  }

  const onCompleteCheckOut = async () => {
    //Check estimate time compare to now
    if (showPopupCheckTimePlaceOrder(timeSlot, deliveryDate)) {
      setIsShowCheckEstimateTime(true);
      return;
    }

    const orderInfo = getOrderInfo();
    const hasOutOfStockItem = orderInfo?.cartValidated?.cartItems?.some((item) => item.isOutOfStock === true);

    if (hasOutOfStockItem) {
      setIsShowMessageOutOfStock(true);
      return;
    }

    if (!checkValidData()) {
      return;
    }

    ///Handle check working hours when not select delivery time
    const isBranchClosed = await checkIfBranchIsClosed();
    if (isBranchClosed === true) {
      setIsShowCloseStoreDialog(true);
      return;
    }

    //Verify customer rank and rank discount
    var customerRankData = await customerDataService.getMembershipLevelInformation(customerId, storeId);

    if (customerRankData?.data) {
      if (
        customerRankData?.data?.customerMemberShipLevel !== currentCartValidated?.customerMemberShipLevel ||
        customerRankData?.data?.customerMemberShipDiscount !== currentCartValidated?.customerMemberShipDiscount ||
        customerRankData?.data?.customerMemberShipMaxDiscount !== currentCartValidated?.customerMemberShipMaxDiscount ||
        customerRankData?.data?.customerId !== customerId
      ) {
        setIsShowNotifyCustomerRankDialog(true);
        return;
      }
    }
    //Bypass if in customize theme or original theme preview
    if (clickToFocusCustomize || isDefault) return;
    setIsCreateOrderProcessing(true);

    const { availablePoint, redeemPointExchangeValue } = calculateCustomerLoyaltyPoint;

    let isUsePointFailed = false;
    if (isUsePoint && availablePoint >= 0 && redeemPointExchangeValue >= 0) {
      isUsePointFailed = await handleVerifyCustomerLoyaltyPoint();
    }
    if (isUsePointFailed === true) {
      setIsCreateOrderProcessing(false);
    } else {
      if (reduxOrderInfo?.cartValidated) {
        setIsNotAvailableItem(true);
      }
      const isChangedProductPrice = await callApiValidateCartItems(true, null, isUsePoint, true);

      if (isChangedProductPrice === true) {
        ///Call dialog and refresh
        return;
      } else {
        await checkOutOrder();
      }
    }
  };

  const openShippingAddressModal = () => {
    const chooseAddressModal = document.getElementsByClassName("receiver-address-select-button")[0];
    chooseAddressModal?.click();
  };

  const onChangeShippingMethod = (e) => {
    const delivery = deliveryMethods.find((s) => s.deliveryMethodId === e.target.value);
    setDeliveryMethod(e.target.value);
    setEstimateTime(delivery?.estimateTime);
    setDeliveryFee(delivery?.pricing);

    const newOrderInfo = {
      ...getOrderInfo(),
      shippingFee: deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY ? delivery?.pricing : 0,
      deliveryMethod: e.target.value,
    };
    dispatch(setOrderInfo(newOrderInfo));
  };

  const onChangePaymentMethod = (e, initValue) => {
    const value = initValue ?? e.target.value;
    setPaymentMethod(value);
    const bankTransferData = paymentMethods?.find(
      (p) => p?.paymentMethodId === value && p?.paymentMethodEnumId === PaymentMethodType.BankTransfer,
    );
    if (bankTransferData) {
      setPaymentBankTransfer(bankTransferData);
    } else {
      setPaymentBankTransfer(null);
    }
  };

  const showDiscount = () => {
    setIsShowDiscount(!isShowDiscount);
  };

  const showFeeAndTax = () => {
    setIsShowFeeAndTax(!isShowFeeAndTax);
  };

  const totalOriginalPrice = shoppingCart?.reduce(
    (sum, cart) =>
      sum + Math.floor(cart.quantity * (cart?.isCombo ? cart?.originalPrice : cart?.productPrice?.originalPrice)),
    0,
  );
  const totalToppings = shoppingCart?.reduce(
    (sum, cart) =>
      sum + cart.quantity * (cart?.isCombo ? cart?.totalOfToppingPrice : cart?.productPrice?.totalOfToppingPrice),
    0,
  );

  const totalOfToppingOriginalPrice = shoppingCart?.reduce(
    (sum, cart) =>
      sum +
      cart.quantity *
        (cart?.isCombo ? cart?.totalOfToppingPrice : cart?.productPrice?.totalOfToppingOriginalPrice ?? 0),
    0,
  );

  const totalDiscount = () => {
    const reduxState = store.getState();
    const cartValidated = reduxState?.session?.orderInfo?.cartValidated;
    var totalDiscountAmount = cartValidated?.totalDiscountAmount ?? 0;
    return roundNumber(totalDiscountAmount, 2);
  };
  const totalFee = () => {
    const reduxState = store.getState();
    const cartValidated = reduxState?.session?.orderInfo?.cartValidated;
    return cartValidated?.totalFee ?? 0;
  };
  const totalTax = () => {
    const reduxState = store.getState();
    const cartValidated = reduxState?.session?.orderInfo?.cartValidated;
    return cartValidated?.totalTax ?? 0;
  };
  const totalAmount = () => {
    const reduxState = store.getState();
    const orderInfo = getOrderSummary();
    const orderFee = totalFee();
    const orderTax = totalTax();
    const orderDeliveryFee = deliveryAddress?.orderType === enumOrderType.PICK_UP ? 0 : deliveryFee;
    var totalAmount = orderInfo?.total + (orderFee ?? 0) + (orderTax ?? 0);
    if (totalAmount < 0) {
      totalAmount = 0;
    }
    return Math.round(totalAmount);
  };

  const onViewOrderDetail = () => {
    setIsShowCash(false);
    setIsShowMomo(false);
    setUsingMomoWeb(false);
    setIsShowPaymentMomoFailed(false);
    setIsShowPaymentMomoSuccess(false);
    dispatch(setMoMoPaymentResponse(null));
    localStorage.removeItem(localStorageKeys.STORE_CART);

    const emptyCart = [];
    dispatch(setCartItems(emptyCart));
    setShoppingCart(emptyCart);
    document.getElementById("cart-quantity").innerText = "0";
    setCurrentOrderInfo(undefined);
    dispatch(setOrderInfo(undefined));
    if (orderId) {
      history.push("my-profile/2/" + orderId);
    }
  };

  const onCreateNewOrder = () => {
    setIsShowCash(false);
    setIsShowMomo(false);
    setUsingMomoWeb(false);
    setIsShowPaymentMomoFailed(false);
    setIsShowPaymentMomoSuccess(false);
    localStorage.removeItem(localStorageKeys.STORE_CART);
    const emptyCart = [];
    dispatch(setCartItems(emptyCart));
    setShoppingCart([]);
    document.getElementById("cart-quantity").innerText = "0";
    setCurrentOrderInfo(undefined);
    dispatch(setOrderInfo(undefined));
    history.push("/product-list");
  };

  const onDeleteDraftOrder = async () => {
    setUsingMomoWeb(false);
    if (orderId) {
      await orderDataService.deleteOrderAsync({ orderId: orderId });
    }
  };

  const onUsingMomoApp = () => {
    setUsingMomoWeb(false);
    setIsShowMomo(false);
    if (momoDeeplink) {
      window.location.assign(momoDeeplink);
    }
  };

  const onUsingMomoWeb = () => {
    setUsingMomoWeb(true);
    setIsShowMomo(false);
  };

  const onMomoSuccess = () => {
    setUsingMomoWeb(false);
    setIsShowMomo(false);
    setIsShowCash(false);
    setIsShowPaymentMomoSuccess(true);
  };

  const onMomoFailed = (error) => {
    setUsingMomoWeb(false);
    setIsShowMomo(false);
    setIsShowCash(false);
    setMomoError(error);
    setIsShowPaymentMomoFailed(true);
  };

  const handleConfirmNotify = () => {
    setIsShowNotifyDialog(false);
    callApiValidateCartItems(false, null, isUsePoint);
  };

  const handleConfirmNotifyCustomerRank = () => {
    setIsShowNotifyCustomerRankDialog(false);
    window.location.reload();
  };

  const handleOkayVerifyProductPrice = () => {
    setIsShowVerifyProductPriceDialog(false);
    callApiValidateCartItems(false, null, isUsePoint);
  };

  const onMomoExpire = (orderId) => {
    setUsingMomoWeb(false);
    setIsShowMomo(false);
    setIsShowCash(false);
    setIsClickComplete(false);
    setIsShowPaymentMomoFailed(true);
  };

  const showUseDiscount = () => {
    // Add the CSS class to the body element
    document.body.classList.add("drawer-open-use-discount");
    setIsShowUseDiscount(true);
  };

  const onCancelUseDiscount = () => {
    // Remove the CSS class from the body element
    document.body.classList.remove("drawer-open-use-discount");
    setIsShowUseDiscount(false);
    // calculateShoppingCart();
  };

  function handleRemoveDiscountCode(discountCode) {
    const index = discountCodes?.indexOf(discountCode);
    if (index !== -1) {
      discountCodes.splice(index, 1);
      reduxService.dispatch(setDiscountCodes(discountCodes));
    }
    calculateShoppingCart();
  }

  async function checkDiscountCodeApplied(isShowToastMessageDiscountCode) {
    setIsLoading(true);
    await callApiValidateCartItems(false, null, isUsePoint, false, isShowToastMessageDiscountCode);
    setIsShowVerifyProductPriceDialog(false);
    setIsLoading(false);
  }

  const renderShippingMethods = deliveryMethods.map((shipping) => {
    const icon = shippingIcons.find((x) => x.enumId === shipping.enumDeliveryMethod)?.icon;
    const isDeliveryGrapExpress = shipping.enumDeliveryMethod === EnumDeliveryMethod.GrabExpress;
    const isDisabledGrapExpress = enumPaymentMethodSelected !== PaymentMethodType.Cash && isDeliveryGrapExpress;
    const filterGrapExpress = isDisabledGrapExpress ? "check_out_filter_gray" : "";
    return (
      <>
        <Radio
          key={shipping.deliveryMethodId}
          value={shipping.deliveryMethodId}
          className={`shipping_method_item ${filterGrapExpress}`}
          disabled={isDisabledGrapExpress}
        >
          <div className="shipping_option_item">
            <div className="shipping_option_item_content">
              <img src={icon} className="shipping_icon" alt={shipping.deliveryMethodName} />
              <div className="shipping_name">
                {shipping.enumDeliveryMethod === EnumDeliveryMethod.ShopDelivery
                  ? pageData.deliveryMethod.shopDelivery
                  : shipping.enumDeliveryMethod === EnumDeliveryMethod.AhaMove
                  ? pageData.deliveryMethod.ahamove
                  : pageData.deliveryMethod.grabExpress}
              </div>
              <div className="shipping_amount">{formatTextNumber(shipping.pricing)}đ</div>
            </div>
            {isDeliveryGrapExpress && (
              <div className="shipping_note_grab_express">{pageData.justSupportOrderHasPaymentByCOD}</div>
            )}
          </div>
        </Radio>
      </>
    );
  });

  const renderPaymentMethods = paymentMethods
    ?.filter((p) =>
      deliveryAddress?.orderType === enumOrderType.PICK_UP
        ? p.paymentMethodEnumId === PaymentMethodType.Cash || p.paymentMethodEnumId === PaymentMethodType.BankTransfer
        : p,
    )
    .map((payment) => {
      let paymentName = payment?.paymentMethodName;
      const isPaymentCash = payment?.paymentMethodEnumId === PaymentMethodType.Cash;
      if (isPaymentCash) {
        paymentName = pageData.paymentMethods.cash;
      }
      if (payment?.paymentMethodEnumId === PaymentMethodType.BankTransfer) {
        paymentName = pageData.paymentMethods.bankTransfer;
      }
      const isDeliveryGrap = enumDeliveryMethodSelected === EnumDeliveryMethod.GrabExpress;
      const isDisable =
        deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY && isDeliveryGrap && !isPaymentCash;
      const classDisable = isDisable ? "check_out_filter_gray" : "";
      return (
        <>
          <Radio
            key={payment.paymentMethodId}
            value={payment.paymentMethodId}
            className={`payment_method_item ${classDisable}`}
            disabled={isDisable}
          >
            <div className="payment_option_item">
              <img src={payment?.icon} className="payment_icon" alt={paymentName} />
              <div className="payment_name">{paymentName}</div>
            </div>
          </Radio>
        </>
      );
    });

  const calTotalAmount = (value1, value2) => {
    const v1 = value1 ?? 0;
    const v2 = value2 ?? 0;
    return v1 + v2;
  };

  const getOrderSummary = () => {
    const cartValidated = reduxOrderInfo?.cartValidated ?? null;
    const orderDeliveryFee = deliveryAddress?.orderType === enumOrderType.PICK_UP ? 0 : deliveryFee;
    if (!cartValidated) return null;
    const orderInfo = {
      totalItem: cartValidated?.cartItems?.length,
      subTotal: cartValidated?.originalPrice ?? 0,
      discount: cartValidated?.totalDiscountAmount ?? 0,
      feeTax: calTotalAmount(cartValidated?.totalFee, cartValidated?.totalTax),
      total: calTotalAmount(cartValidated?.totalPriceAfterDiscount, orderDeliveryFee) ?? 0,
    };

    return orderInfo;
  };

  const setNote = (cart, note) => {
    const newShoppingCart = shoppingCart?.map((item) => (item === cart ? { ...item, message: note } : item));
    setShoppingCart(newShoppingCart);
    shoppingCartService.setStoreCartLocalStorage(newShoppingCart);
  };

  function DiscountListPopover() {
    return (
      <>
        <Popover
          placement="bottom"
          content={<CheckOutDiscounts isMockup={clickToFocusCustomize || isDefault} />}
          open={isShowDiscount}
          overlayClassName="checkout-discount-popover"
          onOpenChange={(isShowDiscount) => setIsShowDiscount(isShowDiscount)}
          trigger="click"
          getPopupContainer={(trigger) => trigger.parentElement}
          showArrow={false}
        >
          {hasDiscounts && (
            <img
              className="img_show_discount"
              src={isShowDiscount ? checkout_arrow_up : checkout_arrow_down}
              alt={totalDiscount()}
              onClick={showDiscount}
            />
          )}
        </Popover>
      </>
    );
  }

  function ApplyDiscountCode() {
    return (
      <div className="card-pacing-bottom">
        <div onClick={showUseDiscount} className="cart_use_discount">
          <img className="icon-use-discount" alt="" src={discountPercentImage} />
          <div className="amount">
            {currentDiscountCodes?.length > 0 ? pageData.discountHasBeenApplied : pageData.useDiscountMessage}
          </div>
          <div className="icon-arrow">
            <ArrowRightWhite className="icon-arrow-right" />
          </div>
        </div>
      </div>
    );
  }

  function OrderSummary() {
    const orderInfo = getOrderSummary();
    const subTotal = formatTextNumber(orderInfo?.subTotal);
    const total = formatTextNumber(totalAmount());
    const totalDeliveryFee =
      deliveryAddress?.orderType === enumOrderType.PICK_UP ? 0 : formatTextNumber(deliveryFee ?? 0);
    const totalFeeAndTax = formatTextNumber(totalFee() + totalTax());

    return (
      <div className="box_summary card-wrapper card-pacing-bottom">
        <div className="summary card-header">
          <p>{pageData.summary}</p>
        </div>
        <div className="card-body">
          <div className="cart_sub_total">
            <div className="title">{pageData.subTotal}</div>
            <div className="amount">
              {subTotal} {pageData.vnd}
            </div>
          </div>
          <div className="cart_discount">
            <div className="discount_title">
              <div className="title">{pageData.discount}</div>
              <DiscountListPopover />
            </div>
            <div className="amount">
              {formatTextNumber(-totalDiscount())} {pageData.vnd}
            </div>
          </div>
          {/* Discount code -- To do */}
          {discountCodes &&
            discountCodes?.map((discountCode) => (
              <div className="discount-code-tag">
                <span className="discount-code-background"></span>
                <span className="line"></span>
                <div className="prefix">
                  <DiscountCodeIcon />
                </div>
                <div className="title">{discountCode}</div>
                <div className="remove-icon" onClick={() => handleRemoveDiscountCode(discountCode)}>
                  <RemoveDiscountCodeIcon />
                </div>
              </div>
            ))}
          <div className="cart_fee_and_tax">
            <div className="fee_and_tax_title">
              <div className="title">{pageData.feeAndTax}</div>
              <Popover
                placement="bottom"
                content={<CheckOutTaxes isMockup={clickToFocusCustomize || isDefault} />}
                trigger="click"
                open={isShowFeeAndTax}
                onOpenChange={(isShowFeeAndTax) => setIsShowFeeAndTax(isShowFeeAndTax)}
                getPopupContainer={(trigger) => trigger.parentElement}
                showArrow={false}
              >
                {hasTaxes && iShowIconFeeTax && (
                  <img
                    className="img_show_fee_and_tax"
                    src={isShowFeeAndTax ? checkout_arrow_up : checkout_arrow_down}
                    alt={totalFeeAndTax}
                    onClick={showFeeAndTax}
                  />
                )}
              </Popover>
            </div>
            <div className="amount">
              {totalFeeAndTax} {pageData.vnd}
            </div>
          </div>
          <div className={`cart_shipping_fee ${deliveryAddress?.orderType === enumOrderType.PICK_UP && "d-none"}`}>
            <div className="title">{pageData.shippingFee}</div>
            <div className="amount">
              {totalDeliveryFee} {pageData.vnd}
            </div>
          </div>
          <div className="cart_amount">
            <div className="title">{pageData.total}</div>
            <div className="amount">
              {total} {pageData.vnd}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ReceivePointNotification() {
    const text = t(pageData.earnPointMessage, {
      earnPoints: formatTextNumber(earnPoint),
      earn_points: "earn-points",
    });
    return (
      <>
        <div className="receive-point-text">
          <PointLogo className="point-logo" />
          <span dangerouslySetInnerHTML={{ __html: text }}></span>
        </div>
      </>
    );
  }

  function CompleteButton() {
    return (
      <Button disabled={isCreateOrderProcessing} className="shipping_complete" onClick={onCompleteCheckOut}>
        <div className="button-title">
          <div className="shipping_complete_title">{pageData.complete}</div>
          <CheckoutCompleteIcon className="shipping_complete_icon" />
        </div>
      </Button>
    );
  }

  const handleClickUse = (code) => {
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

  const fetchDeliveryInfo = useCallback(() => {
    //Bypass if in customize or original preview theme mode
    if (!clickToFocusCustomize && !isDefault && !isCustomize) {
      getDeliveryInfoFromLoginSession();
      initDataDeliveryMethods(deliveryAddress);
    }
    if (deliveryAddress?.receiverAddress && isAllowShowSelectAddressSuccessful) {
      message.info(pageData.selectAddressSuccessful);
    }
  }, [deliveryAddress]);

  // USE EFFECT REGION
  useEffect(() => {
    calculateShoppingCart();
    loadPaymentMethods();
    setDeliveryDate(null);
    setTimeSlot(null);
    getWorkingHour();
  }, [branchAddress]);

  useEffect(() => {
    calculateShoppingCart();
    setDeliveryDate(null);
    setTimeSlot(null);
    handleSetDefaultPaymentMethodWhenChangeOrderType();
    if (deliveryAddress?.orderType === enumOrderType.PICK_UP) {
      const shopDelivery = deliveryMethods?.find((item) => item.enumDeliveryMethod === EnumDeliveryMethod.ShopDelivery);
      setEstimateTime(shopDelivery?.estimateTime);
    }
  }, [deliveryAddress?.orderType]);

  useEffect(() => {
    if (isChangedProductPriceVar) {
      const isOutOfStock = reduxOrderInfo?.cartValidated?.cartItems.some((item) => item.isOutOfStock);
      if (isOutOfStock) {
        setIsCreateOrderProcessing(false);
        setIsShowMessageOutOfStock(true);
      } else {
        setIsShowVerifyProductPriceDialog(true);
        setIsCreateOrderProcessing(false);
      }
    }
  }, [isChangedProductPriceVar]);

  useEffect(() => {
    if (calculateCustomerLoyaltyPoint) {
      const { isShowUsePoint, availablePoint, pointUsed, earnPoint } = calculateCustomerLoyaltyPoint;
      setIsShowUsePointContent(isShowUsePoint);
      setCurrentAvailablePoint(availablePoint);
      setEarnPoint(earnPoint);

      if (isUsePoint && isShowUsePoint && availablePoint === 0 && availablePoint === pointUsed) {
        setVerifyUsePointDialogMessage(t("loyaltyPoint.message.pointCannotRedeem"));
        setIsShowVerifyUsePointDialog(true);
      }
    }
  }, [calculateCustomerLoyaltyPoint]);

  useEffect(() => {
    // Get cart in redux to calculate then update cart in redex, local storage
    calculateShoppingCart();

    const loginData = JSON.parse(getStorage(localStorageKeys.LOGIN));
    if (!clickToFocusCustomize && !isDefault) {
      getWorkingHour();

      loadPaymentMethods();
      let customerInfo = getStorage(localStorageKeys.CUSTOMER_INFO);
      if (customerInfo) customerInfo = JSON.parse(customerInfo);
      const token = getStorage(localStorageKeys.TOKEN);
      const decoded_token = token && jwt_decode(token);
      setAccountId(decoded_token?.ACCOUNT_ID);
      setCustomerName(decoded_token?.FULL_NAME ? decoded_token?.FULL_NAME : customerInfo?.fullName);
      setCountryCode(loginData?.countryCode);
      setPhone(loginData?.phone);
    } else {
      setCountryCode(loginData?.countryCode);
      setCustomerName(mockupCheckout.name);
      setPhone(mockupCheckout.phone);
      setDeliveryMethods(mockupCheckout.deliveryMethods);
      setDeliveryMethod(mockupCheckout.deliveryMethods[0].deliveryMethodId);
      setPaymentMethods(mockupCheckout.paymentMethods);
      setPaymentMethod(mockupCheckout.paymentMethods[0].paymentMethodId);
    }
    setIsInitData(false);

    if (deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY && !deliveryAddress?.receiverAddress) {
      setTimeout(() => {
        openShippingAddressModal();
      }, 800);
    }

    setIsShowPaymentMomoSuccess(false);

    fetchDeliveryInfo();
  }, []);

  useEffect(() => {
    // update shopping cart in this page by sync data from redux
    const updateShoppingCart = () => {
      if (!isEqual(shoppingCart, reduxShoppingCart)) {
        setShoppingCart(reduxShoppingCart);
      }
    };
    updateShoppingCart();
  }, [reduxShoppingCart]);

  useEffect(() => {
    initDataDeliveryMethods(deliveryAddress);
  }, [deliveryAddress]);

  useEffect(() => {
    //Bypass if in customize or original preview theme mode
    if (!clickToFocusCustomize && !isDefault && !isCustomize) {
      if (momoPaymentResponse) {
        const { result, message } = momoPaymentResponse;
        if (result === true) {
          onMomoSuccess();
        } else {
          onMomoFailed(message);
        }
      }
    }
  }, [momoPaymentResponse]);

  useEffect(() => {
    if (!isInitData) {
      calculateShoppingCart();
    }
  }, [deliveryMethod]);

  useEffect(() => {
    if (!taxes.some((tax) => tax.value > 0)) {
      setIShowIconFeeTax(false);
    } else {
      setIShowIconFeeTax(true);
    }
  }, [taxes]);

  useEffect(() => {
    if (orderTypeId && orderTypeId !== deliveryAddress?.orderType) {
      if (orderTypeId === enumOrderType.ONLINE_DELIVERY || orderTypeId === enumOrderType.PICK_UP) {
        const currentDeliveryAddress = {
          ...deliveryAddress,
          orderType: orderTypeId,
        };
        dispatch(setDeliveryAddress(currentDeliveryAddress));
      }
    }
  }, [orderTypeId]);

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
              setShoppingCart([]);
              setCurrentOrderInfo(undefined);
              dispatch(setOrderInfo(undefined));
            }
          });
      }, 5000);

      return () => clearInterval(intervalGetPaymentStatusID);
    }
  }, [responseDataMomo]);

  useEffect(() => {
    calculateShoppingCart();
  }, [deliveryFee]);

  return (
    <>
      <div
        id="themeCheckoutCheckout"
        onClick={() => {
          if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.CheckoutCheckout);
        }}
      >
        {/* Working hour notification */}
        <ConfirmationDialog
          open={isShowCloseStoreDialog}
          title={pageData.notification}
          content={
            <span
              dangerouslySetInnerHTML={{
                __html: t(pageData.soSorryNotificationWorkingHour, {
                  timeWorkingHour: branchOpenTime,
                  dayOfWeek: t(dayOfWeek),
                }),
              }}
            ></span>
          }
          footer={[
            <Button className="btn-got-it" onClick={() => setIsShowCloseStoreDialog(false)}>
              {pageData.iGotIt}
            </Button>,
          ]}
          className="notification-time-out-working-hours"
          closable={false}
          maskClosable={true}
        />
        {/* Verify use point dialog */}
        <ConfirmationDialog
          title={pageData.notification}
          open={isShowVerifyUsePointDialog}
          onCancel={() => {}}
          onConfirm={handleOkayVerifyUsePoint}
          confirmLoading={false}
          className="checkout-theme1-notify-dialog"
          content={verifyUsePointDialogMessage}
          footer={[<Button onClick={handleOkayVerifyUsePoint}> {pageData.gotIt}</Button>]}
        />
        {/* Verify product price dialog */}
        <ConfirmationDialog
          open={isShowVerifyProductPriceDialog}
          onCancel={() => {}}
          onConfirm={handleOkayVerifyProductPrice}
          confirmLoading={false}
          className="checkout-theme1-notify-dialog"
          content={
            isNotAvailableItem
              ? pageData.productNotInBranch
              : "Product price(s) has been changed, please reload to see the latest prices or promotions."
          }
          footer={[<Button onClick={handleOkayVerifyProductPrice}> {"Okay"}</Button>]}
        />
        {/* Verify flash sale dialog */}
        <ConfirmationDialog
          open={isShowNotifyDialog}
          onCancel={() => {}}
          onConfirm={handleConfirmNotify}
          confirmLoading={false}
          className="checkout-theme1-notify-dialog"
          content={contentNotifyDialog}
          footer={[<Button onClick={handleConfirmNotify}>{pageData.gotIt}</Button>]}
        />

        {/* Verify customer rank */}
        <ConfirmationDialog
          open={isShowNotifyCustomerRankDialog}
          onCancel={() => {}}
          onConfirm={handleConfirmNotifyCustomerRank}
          confirmLoading={false}
          className="checkout-theme1-notify-dialog"
          content={
            <span
              dangerouslySetInnerHTML={{
                __html: t(pageData.customerRankChangeNotification),
              }}
            ></span>
          }
          title={pageData.notification}
          footer={[<Button onClick={handleConfirmNotifyCustomerRank}>{pageData.okay}</Button>]}
        />

        {isShowUseDiscount === true && (
          <UseDiscount
            {...props}
            visible={isShowUseDiscount}
            onCancel={() => onCancelUseDiscount()}
            onClickUse={(code) => handleClickUse(code)}
            isCustomize={isCustomize}
            colorGroup={colorGroup}
            isShowInputDiscountCode={false}
          />
        )}

        <CheckOutCash visible={isShowCash} onCancel={onCreateNewOrder} onOk={onViewOrderDetail} />
        <CheckOutMomo visible={isShowMomo} onCancel={onUsingMomoWeb} onOk={onUsingMomoApp} />
        <CheckOutMomoWeb
          visible={usingMomoWeb}
          onCancel={onDeleteDraftOrder}
          onMomoExpire={onMomoExpire}
          orderID={orderId}
          orderStringCode={orderStringCode}
          amount={totalAmount()}
          momoQRCodeURL={momoQRCodeURL}
          momoDeeplink={momoDeeplink}
        />
        <CheckOutMomoFailed
          visible={isShowPaymentMomoFailed}
          onCancel={() => {
            setIsShowPaymentMomoFailed(false);
            setIsClickComplete(false);
          }}
          orderID={orderId}
          error={momoError}
        />
        <CheckOutMomoSuccess
          visible={isShowPaymentMomoSuccess}
          onCancel={() => {
            setIsShowPaymentMomoSuccess(false);
          }}
          orderID={orderId}
          onViewDetail={onViewOrderDetail}
          onCreateNewOrder={onCreateNewOrder}
        />
        <div className="check_out_theme1_container" style={detailStyle}>
          <Row className="go-container">
            <Col sm={24} md={24} lg={24} xl={12} xxl={14} className="check_out_product">
              <div className="product_summary">
                <div className="total">
                  <div className="shoppingCart">{pageData.shoppingCart}</div>
                  <div className="quantity">
                    (
                    {!shoppingCart
                      ? 0
                      : shoppingCart?.reduce((total, cart) => {
                          return total + cart.quantity;
                        }, 0)}{" "}
                    {pageData.product})
                  </div>
                </div>
                <BCButton
                  htmlType="button"
                  className="add"
                  themePageConfig={{ colorGroup: checkoutColorGroup }}
                  onClick={addMoreProducts}
                >
                  {pageData.addMoreProducts}
                </BCButton>
              </div>
              <div
                className="check_out_empty_cart"
                style={
                  !shoppingCart || shoppingCart.length === 0
                    ? { display: "block", alignItems: "center" }
                    : { display: "none" }
                }
              >
                <img src={emptyCart} alt="Empty cart" style={{ marginTop: 40, width: "100%" }} />
              </div>
              <div className="product_detail">
                {shoppingCart?.map((cart, index) => {
                  return (
                    <CheckOutProductItem
                      cartItem={cart}
                      colorGroup={colorGroup}
                      currentIndex={index}
                      key={cart.id + index}
                      onUpdateCartQuantity={onUpdateCartQuantity}
                      onDeleteProduct={onDeleteProduct}
                      setCurrentCartItems={(cartItems) => {
                        setShoppingCart(cartItems);
                        callApiValidateCartItems(false, null, isUsePoint);
                      }}
                      onShowToastMessageUpdateCartItem={onShowToastMessageUpdateCartItem}
                      index={index}
                      setNote={setNote}
                    />
                  );
                })}
              </div>
            </Col>

            <Col sm={24} md={24} lg={24} xl={12} xxl={10} className="check_out_shipping">
              <CheckoutDeliveryInfo
                pageData={pageData}
                isHasAddress={isHasAddress}
                deliveryAddress={deliveryAddress}
                openShippingAddressModal={openShippingAddressModal}
                onChangeCustomerName={onChangeCustomerName}
                defaultCustomerName={defaultCustomerName}
                isHasCustomerName={isHasCustomerName}
                isEditName={isEditName}
                onChangePhone={onChangePhone}
                readPhoneFromStorage={readPhoneFromStorage}
                checkOnKeyPressValidation={checkOnKeyPressValidation}
                isHasPhone={isHasPhone}
                isEditPhone={isEditPhone}
                deliveryDate={deliveryDate}
                setDeliveryDate={setDeliveryDate}
                timeSlot={timeSlot}
                setTimeSlot={setTimeSlot}
                workingHour={workingHour}
                colorGroup={colorGroup}
                estimateTime={estimateTime}
              ></CheckoutDeliveryInfo>

              {/* Shipping method */}
              <div
                className={`box_shipping card-wrapper card-pacing-bottom ${
                  deliveryAddress?.orderType === enumOrderType.PICK_UP && "d-none"
                }`}
              >
                <div className="shipping card-header">
                  <p>{pageData.shippingMethod}</p>
                </div>
                <div className="card-body">
                  <Radio.Group
                    className="shipping_radio_shipping_method radio-style"
                    onChange={(e) => onChangeShippingMethod(e)}
                    value={deliveryMethod}
                  >
                    {deliveryMethods && renderShippingMethods}
                  </Radio.Group>
                </div>
              </div>

              {/* Payment method */}
              <div className="box_payment_method card-wrapper card-pacing-bottom">
                <div className="payment_method card-header">
                  <p>{pageData.paymentMethod}</p>
                </div>
                <div className="card-body">
                  <Radio.Group
                    className="shipping_radio_payment_method radio-style"
                    onChange={(e) => onChangePaymentMethod(e)}
                    value={paymentMethod}
                  >
                    {renderPaymentMethods}
                  </Radio.Group>

                  {paymentBankTransfer?.bankAccountInfo && (
                    <BankTransferPayment
                      bankAccountInfo={paymentBankTransfer?.bankAccountInfo}
                      className="bank-transfer-payment-checkout-theme1"
                    />
                  )}
                </div>
              </div>
              {paymentMethods.length === 0 && <div className="no_payment_method">{pageData.noPaymentMethod}</div>}
              <div className="card-pacing-bottom ">
                <Input
                  className="order-note-input"
                  prefix={<NoteIcon />}
                  placeholder={pageData.notePlaceHolder}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  maxLength={255}
                />
              </div>

              {isShowUsePointContent && (
                <UsePointComponent ref={usePointComponentRef} onChange={(e) => handleSwitchIsUsePoint(e)} />
              )}
              <ApplyDiscountCode />
              <OrderSummary />
              {earnPoint >= 0 && currentCartItem?.length > 0 && <ReceivePointNotification />}
              <CompleteButton />
            </Col>
          </Row>
        </div>
        <NotificationDialog
          open={isShowMessageOutOfStock}
          title={pageData.notification}
          className="checkout-theme1-notify-dialog"
          content={pageData.textOutOfStockRemove}
          footer={[<Button onClick={handleConfirmNotifyOutOfStock}>{pageData.okay}</Button>]}
          closable={true}
        />

        {/*Check delivery time or pickup time compare current*/}
        <NotificationDialog
          open={isShowCheckEstimateTime}
          title={pageData.notification}
          className="checkout-theme1-notify-dialog"
          content={
            deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY
              ? pageData.checkDeliveryEstimateTime
              : pageData.checkPickupEstimateTime
          }
          footer={[<Button onClick={() => setIsShowCheckEstimateTime(false)}>{pageData.okay}</Button>]}
          closable={true}
        />
      </div>
      {/*Loading check discount code*/}
      {isLoading && (
        <div className="loading-full-screen">
          <OverlayLoadingFullScreenComponent />
        </div>
      )}
    </>
  );
}
