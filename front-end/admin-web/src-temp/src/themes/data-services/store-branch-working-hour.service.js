import { createHttp } from "../utils/http-common";
const controller = "storebranchworkinghour";

const getStoreBranchWorkingHour = (branchId) => {
  const http = createHttp();
  return http.get(`/${controller}/` + branchId);
};

const getStoreBranchWorkingHourForReserveTable = (storeBranchId) => {
  const http = createHttp();
  return http.get(
    `/${controller}/get-store-branch-working-hour?StoreBranchId=${storeBranchId}&IsGetConfigReserveTable=${true}`,
  );
};

const storeBranchWorkingHourDataService = {
  getStoreBranchWorkingHour,
  getStoreBranchWorkingHourForReserveTable,
};

export default storeBranchWorkingHourDataService;
