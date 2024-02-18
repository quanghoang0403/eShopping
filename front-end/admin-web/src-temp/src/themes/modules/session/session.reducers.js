import Moment from "moment";
import actionTypes from "./session.types";

const sessionInitialState = {
  cartItems: [],
  paymentMethods: [],
  orderInfo: {
    subTotal: 0,
    discount: 0,
    feeTax: 0,
    total: 0,
    shippingFee: 0,
    totalItem: 0,
    deliveryInfo: {
      customerId: null,
      accountId: null,
      phoneNumber: null,
      addressId: null,
      address: null,
      lat: null,
      lng: null,
      receiverName: null,
    },
    paymentMethod: {
      paymentMethodId: null,
      paymentMethodName: null,
    },
    deliveryMethod: {
      deliveryMethodId: null,
      deliveryMethodName: null,
    },
    cartValidated: null,
  },
  userInfo: {
    firstName: null,
    lastName: null,
    addressList: []
  },
  discountCodes: [],
  appliedDiscountCodes: [],
  lastUpdated: 1439478405547,
  isShowFlashSaleInActive: false,
  callBackAddToCartFunction: null,
  languageSession: undefined,
  deliverySchedule: {
    scheduleDate: null,
    scheduleTime: null,
  },
  storeConfig: null
};

const sessionReducer = (state = sessionInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_THEME_CUSTOMIZE_CONFIG:
      return {
        ...state,
        themeConfig: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_LOGIN_SESSION:
      return {
        ...state,
        loginSession: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_NEAREST_STORE_BRANCHES:
      return {
        ...state,
        nearestStoreBranches: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_DELIVERY_ADDRESS:
      return {
        ...state,
        deliveryAddress: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_PAYMENT_METHODS:
      return {
        ...state,
        paymentMethods: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_DELIVERY_METHODS:
      return {
        ...state,
        deliveryMethods: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_IS_OPEN_RECEIVER_ADDRESS_DIALOG:
      return {
        ...state,
        isOpenReceiverAddressDialog: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_ORDER_INFO:
      return {
        ...state,
        orderInfo: {
          ...sessionInitialState.orderInfo,
          ...action.payload,
        },
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_ORDER_PAYMENT_METHOD:
      return {
        ...state,
        orderInfo: {
          ...sessionInitialState.orderInfo,
          paymentMethod: action.payload,
        },
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_DATA_CALL_BACK_ADD_TO_CART:
      return {
        ...state,
        callBackAddToCartFunction: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_SHOW_FLASH_SALE_IN_ACTIVE:
      return {
        ...state,
        isShowFlashSaleInActive: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_NOTIFICATION_DIALOG:
      return {
        ...state,
        notificationDialog: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_DISCOUNT_CODES:
      return {
        ...state,
        discountCodes: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_APPLIED_DISCOUNT_CODES:
      return {
        ...state,
        appliedDiscountCodes: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_TOAST_MESSAGE:
      return {
        ...state,
        toastMessage: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_SELECTED_SUB_MENU_ID:
      return {
        ...state,
        selectedSubMenuID: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_DELIVERY_SCHEDULE:
      return {
        ...state,
        deliverySchedule: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.LANGUAGE_SESSION:
      return { ...state, languageSession: action?.payload };
    case actionTypes.SET_POS_CART_ITEMS:
      return {
        ...state,
        posCartItems: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_WORKING_HOUR:
      return {
        ...state,
        workingHour: action.payload,
      };
    case actionTypes.SET_PACKAGE_EXPIRED_INFO:
      return {
        ...state,
        packageExpiredInfo: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_LOYALTY_POINT:
      return {
        ...state,
        loyaltyPoint: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_STORE_CONFIG:
      return {
        ...state,
        storeConfig: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    default:
      return state;
  }
};

export const discountCodesSelector = (state) => state?.session?.discountCodes ?? [];
export const posCartItemsSelector = (state) => state?.session?.posCartItems ?? [];
export const themeConfigSelector = (state) => state?.session?.themeConfig ?? null;
export const cartValidatedSelector = (state) => state?.session?.orderInfo?.cartValidated ?? {};
export const workingHourSelector = (state) => state?.session?.workingHour ?? {};
export const toastMessageSelector = (state) => state?.session?.toastMessage ?? {};
export const storeConfigSelector = (state) => state?.session?.storeConfig;
export const userInfoSelector = (state) => state?.session?.userInfo;

export default sessionReducer;
