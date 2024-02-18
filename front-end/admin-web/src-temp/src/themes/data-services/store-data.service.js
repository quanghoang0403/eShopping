import { createHttp } from "../utils/http-common";
const controller = "store";

const getGoogleApiKeyByStoreID = () => {
  const http = createHttp();
  return http.get(`/${controller}/get-google-api-key-by-store-id`);
};

const getClosestBranchByAddress = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/get-closest-branch-by-address`, data);
};

const getAllStoreTaxes = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/get-all-store-taxes`, data);
};

const getStoreConfig = (storeId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-store-config-data?storeId=${storeId}`);
};

const storeDataService = {
  getGoogleApiKeyByStoreID,
  getClosestBranchByAddress,
  getAllStoreTaxes,
  getStoreConfig,
};

export default storeDataService;
