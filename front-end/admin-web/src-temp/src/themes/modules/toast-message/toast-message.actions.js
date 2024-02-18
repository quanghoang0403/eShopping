import actionTypes from "./toast-message.types";

export function setToastMessageMaxDiscount(data) {
  return { type: actionTypes.SET_TOAST_MESSAGE_MAX_DISCOUNT, payload: data };
}

export function setToastMessageAddUpdateProductToCart(data) {
  return { type: actionTypes.SET_TOAST_MESSAGE_ADD_UPDATE_PRODUCT_CART_ITEM, payload: data };
}

export function setToastMessageAddToCart(data) {
  return { type: actionTypes.SET_TOAST_MESSAGE_ADD_TO_CART, payload: data };
}

export function setToastMessageUpdateToCart(data) {
  return { type: actionTypes.SET_TOAST_MESSAGE_UPDATE_TO_CART, payload: data };
}

export function setToastMessageCancelOrder(data) {
  return { type: actionTypes.SET_TOAST_MESSAGE_CANCEL_ORDER, payload: data };
}

export function setToastMessageDiscountCodeCheckout(data) {
  return { type: actionTypes.SET_TOAST_MESSAGE_DISCOUNT_CODE_CHECKOUT, payload: data };
}

export function setResetToastMessage() {
  return { type: actionTypes.SET_RESET_TOAST_MESSAGE };
}
