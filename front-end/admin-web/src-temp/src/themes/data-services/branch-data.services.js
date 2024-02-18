import { createHttp } from "../utils/http-common";

const controller = "branch";

const getBranchesByCustomerAddressAsync = (lat, lng, isNotSelectCustomerAddress = false) => {
  const http = createHttp();
  return http.get(
    `/${controller}/get-branches-by-customer-address?lat=${lat}&lng=${lng}&isNotSelectCustomerAddress=${isNotSelectCustomerAddress}`
  );
};

const getWorkingHourByBranchIdAsync = (branchId) => {
  const http = createHttp();
  if (branchId) {
    return http.get(`/${controller}/get-working-hour-by-branch-id?branchId=${branchId}`);
  }
  return null;
};

const branchDataService = {
  getBranchesByCustomerAddressAsync,
  getWorkingHourByBranchIdAsync,
};

export default branchDataService;
