import moment from "moment";
import actionTypes from "./toast-message.types";

const processingInitialState = {
  isShowToastMessageMaxDiscount: null,
  lastUpdated: moment.utc(),
  isShowToastMessageAddToCart: null,
  isShowToastMessageUpdateToCart: null,
  isShowToastMessageCancelOrder: null,
  isShowToastMessageDiscountCodeCheckout: null,
};

const toastMessageReducer = (state = processingInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_TOAST_MESSAGE_MAX_DISCOUNT:
      return {
        ...state,
        isShowToastMessageMaxDiscount: action.payload,
      };

    case actionTypes.SET_TOAST_MESSAGE_ADD_UPDATE_PRODUCT_CART_ITEM:
      return {
        ...state,
        message: action.payload,
        lastUpdated: moment.utc().format("x"),
      };

    case actionTypes.SET_TOAST_MESSAGE_ADD_TO_CART:
      return {
        ...state,
        isShowToastMessageAddToCart: action.payload,
      };

    case actionTypes.SET_TOAST_MESSAGE_UPDATE_TO_CART:
      return {
        ...state,
        isShowToastMessageUpdateToCart: action.payload,
      };
    case actionTypes.SET_TOAST_MESSAGE_CANCEL_ORDER:
      return {
        ...state,
        isShowToastMessageCancelOrder: action.payload,
      };

    case actionTypes.SET_TOAST_MESSAGE_DISCOUNT_CODE_CHECKOUT:
      return {
        ...state,
        isShowToastMessageDiscountCodeCheckout: action.payload,
      };

    case actionTypes.SET_RESET_TOAST_MESSAGE:
      return {
        ...state,
        message: null,
      };

    default:
      return state;
  }
};

export const toastMessageSelector = (state) => state?.toastMessage?.message;

export default toastMessageReducer;
