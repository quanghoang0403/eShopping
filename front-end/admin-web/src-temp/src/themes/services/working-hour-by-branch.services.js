import branchDataService from "../data-services/branch-data.services";
import { store } from "../modules";
import { setWorkingHourByBranch } from "../modules/session/session.actions";

const getWorkingHourAsync = async (branchId) => {
  const result = await branchDataService.getWorkingHourByBranchIdAsync(branchId ?? null);
  return result?.data;
};

const fetchStoreBranchWorkingHoursAsync = async (branchId) => {
  const workingHour = await getWorkingHourAsync(branchId);
  if (workingHour) {
    store.dispatch(setWorkingHourByBranch({ ...workingHour, branchId }));
  }
};

const workingHourService = {
  getWorkingHourAsync,
  fetchStoreBranchWorkingHoursAsync,
};

export default workingHourService;
