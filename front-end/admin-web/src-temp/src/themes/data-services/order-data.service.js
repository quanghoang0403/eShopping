import { createHttp } from "../utils/http-common";

const controller = "order";

const cancelOrderAsync = (data) => {
  const http = createHttp();
  return http.put(`/${controller}/customer-cancel-order`, data);
};

const getOrderDetailByIdAsync = (orderId, branchId = "") => {
  const http = createHttp();
  return http.get(`/${controller}/get-order-detail-store-web?orderId=${orderId}&branchId=${branchId}`);
};

const getOrderItemsByIdAsync = (orderId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-order-items-by-order-id?orderId=${orderId}`);
};

const verifyProductInShoppingCartAsync = (queryString) => {
  const http = createHttp();
  return http.get(`/${controller}/verify-product-in-shopping-cart?${queryString}`);
};

const createStoreWebOrderAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/create-store-web-order`, data);
};

const mergeProductToCartItem = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/merge-order-item`, data);
};

const deleteOrderAsync = (data) => {
  const http = createHttp();
  return http.put(`/${controller}/delete-order`, data);
};

const orderDataService = {
  cancelOrderAsync,
  getOrderDetailByIdAsync,
  verifyProductInShoppingCartAsync,
  createStoreWebOrderAsync,
  mergeProductToCartItem,
  deleteOrderAsync,
  getOrderItemsByIdAsync
};

export default orderDataService;
