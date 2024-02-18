import actionTypes from "./order.type";

export function setQrCodeOrder(data) {
  return { type: actionTypes.SET_QR_ORDER, payload: data };
}

export function setPOSDiscountCodes(data) {
  return { type: actionTypes.SET_POS_DISCOUNT_CODES, payload: data };
}
