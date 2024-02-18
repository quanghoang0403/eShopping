import actionTypes from "./third-party-response.type";

export function setMoMoPaymentResponse(data) {
  return { type: actionTypes.SET_MOMO_PAYMENT_RESPONSE, payload: data };
}
