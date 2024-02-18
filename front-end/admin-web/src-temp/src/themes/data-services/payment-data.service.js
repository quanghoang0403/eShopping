import { createHttp } from "../utils/http-common";

const controller = "Payment";

const updateStoreWebOrderMomoPayment = (requestId, orderId, amount) => {
  const http = createHttp();
  return http.put(
    `/${controller}/update-store-web-order-momo-payment?requestId=${requestId}&orderId=${orderId}&amount=${amount}`,
  );
};

const updateStoreWebOrderMomoPaymentWithPoint = (
  requestId,
  orderId,
  amount,
  isUsePoint,
  usedPoint,
  redeemPointExchangeValue,
) => {
  const http = createHttp();
  return http.put(
    `/${controller}/update-store-web-order-momo-payment?requestId=${requestId}&orderId=${orderId}&amount=${amount}&isActiveUsedPoint=${
      isUsePoint ?? ""
    }&usedPoint=${usedPoint ?? ""}&redeemPointExchangeValue=${redeemPointExchangeValue ?? ""}`,
  );
};

const paymentDataService = {
  updateStoreWebOrderMomoPayment,
  updateStoreWebOrderMomoPaymentWithPoint,
};

export default paymentDataService;
