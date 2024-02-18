import http, { downloadAsync } from "../../utils/http-common";

const controller = "inventory";

const getInventoryHistoryManagementsAsync = (
  pageNumber,
  pageSize,
  keySearch,
  branchId,
  action,
  materialId,
  isActive,
  startDate,
  endDate,
  categoryId,
) => {
  return http.get(
    `/${controller}/get-all-inventory-history?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&branchId=${branchId}&action=${action}&materialId=${materialId}&isActive=${isActive}&startDate=${startDate}&endDate=${endDate}&categoryId=${categoryId}`,
  );
};

const exportInventoryHistory = (
  keySearch,
  branchId,
  action,
  materialId,
  isActive,
  startDate,
  endDate,
  languageCode,
  categoryId,
) => {
  return downloadAsync(
    `/${controller}/export-inventory-history?keySearch=${keySearch}&branchId=${branchId}&action=${action}&materialId=${materialId}&isActive=${isActive}&startDate=${startDate}&endDate=${endDate}&categoryId=${categoryId}&languageCode=${languageCode}`,
  );
};

const getFilterInventoryHistory = () => {
  return http.get(`/${controller}/get-filter-inventory-history`);
};

const getInventoryHistoryManagementByMaterialAsync = (
  pageNumber,
  pageSize,
  keySearch,
  branchId,
  action,
  materialId,
  isActive,
  startDate,
  endDate,
  categoryId,
) => {
  return http.get(
    `/${controller}/get-all-inventory-history-by-material?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&branchId=${branchId}&action=${action}&materialId=${materialId}&isActive=${isActive}&startDate=${startDate}&endDate=${endDate}&categoryId=${categoryId}`,
  );
};

const exportByMaterialAsync = (
  keySearch,
  branchId,
  action,
  materialId,
  isActive,
  startDate,
  endDate,
  languageCode,
  categoryId,
) => {
  return downloadAsync(
    `/${controller}/export-by-material?keySearch=${keySearch}&branchId=${branchId}&action=${action}&materialId=${materialId}&isActive=${isActive}&startDate=${startDate}&endDate=${endDate}&categoryId=${categoryId}&languageCode=${languageCode}`,
  );
};

const inventoryHistoryDataService = {
  getInventoryHistoryManagementsAsync,
  exportInventoryHistory,
  getFilterInventoryHistory,
  getInventoryHistoryManagementByMaterialAsync,
  exportByMaterialAsync,
};
export default inventoryHistoryDataService;
