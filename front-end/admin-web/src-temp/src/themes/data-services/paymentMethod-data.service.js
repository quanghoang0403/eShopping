import { createHttp } from "../utils/http-common";

const controller = "PaymentMethod";
const getStoreConfigPaymentMethods = (storeId, branchId = "") => {
  const http = createHttp();
  return http.get(`/${controller}/get-store-config-payment-methods?storeId=${storeId}&branchId=${branchId}`);
};

const getPaymentMethods = (storeId, branchId = "") => {
  const http = createHttp();
  return http.get(`/${controller}/get-payment-methods?storeId=${storeId}&branchId=${branchId}`);
};

const paymentMethodDataService = {
  getStoreConfigPaymentMethods,
  getPaymentMethods,
};

export default paymentMethodDataService;
