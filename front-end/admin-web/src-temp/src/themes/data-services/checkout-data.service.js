import { createHttp } from "../utils/http-common";

const controller = "checkOut";
const createCheckoutOrder = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/create-checkout-order`, data);
};

const checkOutOrderStatus = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/checkout-order-status`, data);
};

const getAvailableDiscounts = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/get-available-discounts`, data);
};

const checkOutDataService = {
  createCheckoutOrder,
  checkOutOrderStatus,
  getAvailableDiscounts,
};

export default checkOutDataService;
