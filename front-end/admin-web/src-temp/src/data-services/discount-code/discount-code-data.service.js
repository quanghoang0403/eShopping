import { createHttp } from "themes/utils/http-common";
import http from "../../utils/http-common";

const controller = "discountCode";

const createDiscountCodeAsync = (data) => {
  return http.post(`/${controller}/create-discount-code`, data);
};

const getDiscountCodeAsync = (
  pageNumber,
  pageSize,
  keySearch,
  branchId,
  statusId,
  valueType,
  startDate,
  endDate,
  minMinimumPurchaseOnBill,
  maxMinimumPurchaseOnBill,
  applicableType,
  includeTopping,
  platformId,
  codeType,
  timeZone
) => {
  return http.get(
    `/${controller}/get-all-discount-code?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&branchId=${branchId}&statusId=${statusId}&valueType=${valueType}&startDate=${startDate}&endDate=${endDate}&minMinimumPurchaseOnBill=${minMinimumPurchaseOnBill}&maxMinimumPurchaseOnBill=${maxMinimumPurchaseOnBill}&applicableType=${applicableType}&includeTopping=${includeTopping}&platformId=${platformId}&codeType=${codeType}&timeZone=${timeZone}`
  );
};

const getDiscountCodeByIdAsync = (id) => {
  return http.get(`/${controller}/get-discount-code-by-id/${id}`);
};

const getDiscountCodeUsageDetailAsync = (pageNumber, pageSize, discountCodeId) => {
  return http.get(
    `/${controller}/get-discount-code-usage-detail?pageNumber=${pageNumber}&pageSize=${pageSize}&discountCodeId=${discountCodeId}`
  );
};

const deleteDiscountCodeByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-discount-code-by-id/${id}`);
};

const stopDiscountCodeByIdAsync = (id) => {
  return http.post(`/${controller}/stop-discount-code-by-id/${id}`);
};

const generateDiscountCodeByStoreId = () => {
  return http.get(`/${controller}/generate-discount-code-by-store-id`);
};

const editDiscountCodeAsync = (data) => {
  return http.post(`/${controller}/edit-discount-code`, data);
};

const getAllDiscountCodeAsync = (params) => {
  const http = createHttp();
  return http.get(`/${controller}/get-all-discount-code-in-branch`, params);
};

const discountCodeDataService = {
  getDiscountCodeAsync,
  getDiscountCodeByIdAsync,
  getDiscountCodeUsageDetailAsync,
  deleteDiscountCodeByIdAsync,
  stopDiscountCodeByIdAsync,
  createDiscountCodeAsync,
  generateDiscountCodeByStoreId,
  editDiscountCodeAsync,
  getAllDiscountCodeAsync,
};
export default discountCodeDataService;
