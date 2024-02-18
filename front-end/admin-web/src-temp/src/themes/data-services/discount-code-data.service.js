import { createHttp } from "../utils/http-common";

const controller = "discountcode";

const getAllDiscountCodeAsync = (branchId, accountId) => {
  const http = createHttp();
  return http.get(
    `/${controller}/get-all-discount-code-in-branch?branchId=${branchId ?? ""}&accountId=${accountId ?? ""}`
  );
};

const redeemDiscountCodeAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/redeem-discount-code`, data);
};

const getAllDiscountCodeByAccountIdAsync = (branchId, accountId) => {
  const http = createHttp();
  return http.get(
    `/${controller}/get-discount-code-by-account-id?branchId=${branchId ?? ""}&accountId=${accountId ?? ""}`
  );
};

const getDiscountCodeDetailByIdAsync = (storeId, discountCodeId) => {
  const http = createHttp();
  return http.get(
    `/${controller}/get-discount-code-detail-by-id?storeId=${storeId ?? ""}&discountCodeId=${discountCodeId ?? ""}`,
  );
};

const discountCodeDataService = {
  getAllDiscountCodeAsync,
  redeemDiscountCodeAsync,
  getAllDiscountCodeByAccountIdAsync,
  getDiscountCodeDetailByIdAsync
};

export default discountCodeDataService;
