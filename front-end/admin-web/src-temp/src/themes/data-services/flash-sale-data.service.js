import { createHttp } from "../utils/http-common";

const controller = "FlashSale";

const getFlashSaleTodayStoreWebAsync = (deliveryAddress) => {
  const http = createHttp();
  const isStoreAppActiveNow = window.isStoreAppWebView ?? false;
  return http.get(`/${controller}/get-flash-sale-today-store-web?branchId=${deliveryAddress}&isStoreAppActiveNow=${isStoreAppActiveNow}`);
};

const verifyProductFlashSaleAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/verify-product-flash-sale`, data);
};

const flashSaleDataService = {
  getFlashSaleTodayStoreWebAsync,
  verifyProductFlashSaleAsync,
};

export default flashSaleDataService;
