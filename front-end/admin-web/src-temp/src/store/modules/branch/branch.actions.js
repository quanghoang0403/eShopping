import actionType from "./branch.type";

export function setBranchWorkingHoursData(workingHourData) {
  return { type: actionType.CREATE_BRANCH_WORKING_HOURS, payload: workingHourData };
}
