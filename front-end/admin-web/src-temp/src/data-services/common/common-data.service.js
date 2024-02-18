import http from "utils/http-common";
import qs from 'query-string'

const commonAPI = {
  getAllBranchManagement: '/branch/get-all-branch-management',
  getAreasAreaTablesByBranchId: '/area/branch',
};

const getAllBranchManagementAsync = () => {
  return http.get(commonAPI.getAllBranchManagement);
};

const getAreasAreaTablesByBranchIdAsync = (params) => {
  return http.get(commonAPI.getAreasAreaTablesByBranchId, {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  });
};

const commonDataService = {
  getAllBranchManagementAsync,
  getAreasAreaTablesByBranchIdAsync,
};

export default commonDataService;
