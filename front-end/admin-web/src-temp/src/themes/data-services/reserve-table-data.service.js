import { createHttp } from "../utils/http-common";

const controller = "reservetable";

const createReserveTableAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}`, data);
};

const getDetailAreaAndTableAsync = (storeId, branchId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-detail-area-and-table?StoreId=${storeId}&StoreBranchId=${branchId}`);
};

const cancelReserveTableByIdAsync = (storeId, id) => {
  const http = createHttp();
  return http.delete(`/${controller}/${storeId}/${id}`);
};

const getListReserveTableAsync = (
  storeId,
  pageNumber = 1,
  pageSize = 20,
  status = -1,
  listReserveTableCodes = "",
  isLoggedIn = true,
) => {
  const http = createHttp();
  return http.get(
    `/${controller}?storeId=${storeId}&pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}&listReserveTableCodes=${listReserveTableCodes}&isloggedin=${isLoggedIn}`,
  );
};

const synchronizeReserveTableAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/synchronize`, data);
};

const getReserveTableDetailAsync = (id) => {
  const http = createHttp();
  return http.get(`/${controller}/${id}`);
};

const getTotalStatusReserveTableAsync = (
  storeId,
  listReserveTableCodes = "",
  isLoggedIn = true
) => {
  const http = createHttp();
  return http.get(
    `/${controller}/get-total-status?storeId=${storeId}&listReserveTableCodes=${listReserveTableCodes}&isloggedin=${isLoggedIn}`,
  );
};

const reserveTableService = {
  createReserveTableAsync,
  getDetailAreaAndTableAsync,
  cancelReserveTableByIdAsync,
  getListReserveTableAsync,
  synchronizeReserveTableAsync,
  getReserveTableDetailAsync,
  getTotalStatusReserveTableAsync,
};

export default reserveTableService;