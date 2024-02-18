import languageService from "services/language/language.service";
import http from "../../utils/http-common";

const controller = "flashSale";

const createFlashSaleAsync = (data) => {
  return http.post(`/${controller}/create-flash-sale`, data, {
    headers: {
      ...http.headers,
      "X-Lang": languageService.getLang(),
    },
  });
};

const getFlashSalesAsync = (
  pageNumber,
  pageSize,
  keySearch,
  branchId,
  statusId,
  startDate,
  endDate,
  includeTopping,
  minMinimumPurchaseOnBill,
  maxMinimumPurchaseOnBill,
  timeZone
) => {
  return http.get(
    `/${controller}/get-all-flash-sale?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&branchId=${branchId}&statusId=${statusId}&startDate=${startDate}&endDate=${endDate}&includeTopping=${includeTopping}&minMinimumPurchaseOnBill=${minMinimumPurchaseOnBill}&maxMinimumPurchaseOnBill=${maxMinimumPurchaseOnBill}&timeZone=${timeZone}`
  );
};

const getFlashSaleByIdAsync = (id) => {
  return http.get(`/${controller}/get-flashsale-by-id/${id}`);
};

const editFlashSaleAsync = (data) => {
  return http.post(`/${controller}/edit-flash-sale`, data, {
    headers: {
      ...http.headers,
      "X-Lang": languageService.getLang(),
    },
  });
};

const deleteFlashSaleByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-flash-sale-by-id/${id}`);
};

const stopFlashSaleByIdAsync = (id) => {
  return http.post(`/${controller}/stop-flash-sale-by-id/${id}`);
};

const getFlashSaleByIdForDetailPageAsync = (id) => {
  return http.get(`/${controller}/get-flash-sale-by-id-for-detail-page/${id}`);
};

const getFlashSaleUsageDetailAsync = (pageNumber, pageSize, flashSaleId) => {
  return http.get(
    `/${controller}/get-flash-sale-usage-detail?pageNumber=${pageNumber}&pageSize=${pageSize}&flashSaleId=${flashSaleId}`
  );
};

const flashSaleDataService = {
  createFlashSaleAsync,
  getFlashSalesAsync,
  getFlashSaleByIdAsync,
  editFlashSaleAsync,
  deleteFlashSaleByIdAsync,
  stopFlashSaleByIdAsync,
  getFlashSaleByIdForDetailPageAsync,
  getFlashSaleUsageDetailAsync,
};
export default flashSaleDataService;
