import { createHttp } from "../utils/http-common";

const controller = "storebranchworkinghour";

const getWorkingHourByStoreBranchIdAsync = (storeBranchId) => {
    const http = createHttp();
    return http.get(
      `/${controller}/${storeBranchId}`,
    );
  };

  const workingHoursDataService = {
    getWorkingHourByStoreBranchIdAsync
  };
  
  export default workingHoursDataService;
  