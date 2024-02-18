import http from "../../utils/http-common";

const controller = "transfermaterial";
const getTransferMaterialManagementsAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-transfer-materials?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const getTransferMaterialIdAsync = (id) => {
  return http.get(`/${controller}/get-transfer-materials-by-id/${id}`);
};

const getComboTransferMaterialDataAsync = (warehouseId) => {
  return http.get(`/${controller}/?fromWareHouseId=${warehouseId}`);
};

const createTransferMaterialAsync = (data) => {
  return http.post(`/${controller}/create-transfer-material`, data);
};

const updateTransferMaterialAsync = (data) => {
  return http.put(`/${controller}/update-transfer-material-by-id`, data);
}
const UpdateTransferMaterialStatusByIdAsync = (data) => {
  return http.post(`/${controller}/update-transfer-material-status-by-id`, data);
};

const CheckChangeTransferMaterialStatusByIdAsync = (data) => {
  return http.post(`/${controller}/check-change-transfer-material-status-by-id`, data);
};

const transferMaterialDataService = {
  getTransferMaterialManagementsAsync,
  getTransferMaterialIdAsync,
  getComboTransferMaterialDataAsync,
  createTransferMaterialAsync,
  updateTransferMaterialAsync,
  UpdateTransferMaterialStatusByIdAsync,
  CheckChangeTransferMaterialStatusByIdAsync,
};
export default transferMaterialDataService;
