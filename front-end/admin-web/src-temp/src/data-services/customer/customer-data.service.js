import languageService from "services/language/language.service";
import http, { downloadAsync } from "../../utils/http-common";

const controller = "customer";

const getCustomersAsync = (
  keySearch,
  pageNumber,
  pageSize,
  platformId = "",
  customerMembershipId = "",
  customerSegmentId = "",
  tagIds = ""
) => {
  return http.get(
    `/${controller}/get-customers?keySearch=${keySearch}&pageNumber=${pageNumber}&pageSize=${pageSize}&platformId=${platformId}&customerMembershipId=${customerMembershipId}&customerSegmentId=${customerSegmentId}&tagIds=${tagIds}`
  );
};

const GetCustomersBySegmentAsync = (pageNumber, pageSize, keySearch, customerSegmentId) => {
  return http.get(
    `/${controller}/get-customers-by-segment?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}
      &customerSegmentId=${customerSegmentId}`
  );
};

const createCustomerAsync = (data) => {
  return http.post(`/${controller}/create-customer`, data);
};

const deleteCustomerByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-customer-by-id/${id}`);
};

const getCustomerByIdAsync = (id) => {
  return http.get(`/${controller}/get-customer-by-id?id=${id}`);
};

const updateCustomerAsync = (data) => {
  return http.put(`/${controller}/update-customer`, data);
};

const getCustomerByAccumulatedPointAsync = (pageNumber, pageSize, accumulatedPoint) => {
  return http.get(
    `/${controller}/get-customer-by-accumulatedPoint?pageNumber=${pageNumber}&pageSize=${pageSize}&accumulatedPoint=${accumulatedPoint}`
  );
};

const getLoyaltyPointByStoreIdAsync = () => {
  return http.get(`/${controller}/get-loyalty-by-store-id`);
};

const modifyLoyaltyPointAsync = (data) => {
  return http.post(`/${controller}/modify-loyalty-point`, data);
};

const getCustomerReportPieChartAsync = (fromDate, toDate, branchId, segmentTimeOption) => {
  return http.get(`/${controller}/get-customer-report?fromDate=${fromDate}&toDate=${toDate}
  &branchId=${branchId}&segmentTimeOption=${segmentTimeOption}`);
};

const getCustomersByDateRangeAsync = (startDate, endDate, branchId) => {
  let query = `startDate=${startDate}&endDate=${endDate}`;
  if (branchId) {
    query += `&branchId=${branchId}`;
  }
  return http.get(`/${controller}/get-customers-by-date-range?${query}`);
};

const getCustomerTagAsync = () => {
  return http.get(`/${controller}/get-customer-tag`);
};

const exportAllCustomersAsync = (data) => {
  return downloadAsync(`/${controller}/export-all-customers?languageCode=${data}`);
};

const downloadImportCustomerTemplateAsync = (languageCode) => {
  return downloadAsync(`/${controller}/download-import-customer-template?languageCode=${languageCode}`);
};

const importCustomerAsync = (data) => {
  return http.post(`/${controller}/import`, data, {
    headers: {
      ...http.headers,
      "X-Lang": languageService.getLang(),
    },
  });
};

const downloadFileErrAsync = (data) => {
  return http.post(`/${controller}/download-file-err-template`, data, { observe: "response", responseType: "blob" });
};

const customerDataService = {
  getCustomersAsync,
  GetCustomersBySegmentAsync,
  createCustomerAsync,
  deleteCustomerByIdAsync,
  getCustomerByIdAsync,
  updateCustomerAsync,
  getCustomerByAccumulatedPointAsync,
  getLoyaltyPointByStoreIdAsync,
  modifyLoyaltyPointAsync,
  getCustomerReportPieChartAsync,
  getCustomersByDateRangeAsync,
  getCustomerTagAsync,
  exportAllCustomersAsync,
  downloadImportCustomerTemplateAsync,
  importCustomerAsync,
  downloadFileErrAsync
};

export default customerDataService;
