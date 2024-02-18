import http from "../../utils/http-common";

const controller = "transferMaterialHistory";

const getAllTransferMaterialHistoryAsync = (
  pageNumber,
  pageSize,
  keySearch,
  fromWarehouseId,
  toWarehouseId,
  updatedId,
  statusId,
  startDate,
  endDate
) => {
  return http.get(
    `/${controller}/get-all-transfer-material-history?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&fromWarehouseId=${fromWarehouseId}&toWarehouseId=${toWarehouseId}&updatedId=${updatedId}&statusId=${statusId}&startDate=${startDate}&endDate=${endDate}`
  );
};

const getAllTransferMaterialPlaceAsync = () => {
  return http.get(`/${controller}/get-all-place-transfer-material`);
};

const getAllUpdatedUserTransferMaterial = () => {
  return http.get(`/${controller}/get-all-updated-user-transfer-material`);
};



const transferMaterialHistoryDataService = {
  getAllTransferMaterialHistoryAsync,
  getAllTransferMaterialPlaceAsync,
  getAllUpdatedUserTransferMaterial,
};
export default transferMaterialHistoryDataService;
