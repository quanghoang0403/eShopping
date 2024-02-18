import http from "../../../../utils/http-common";

const controller = "menuManagement";

const getOnlineStoreMenuByIdAsync = (id) => {
  return http.get(`/${controller}/get-online-store-menu-by-id/${id}`);
};

const getCreateMenuPrepareDataAsync = () => {
  return http.get(`/${controller}/get-create-menu-prepare-data`);
};

const menuManagementDataService = {
  getOnlineStoreMenuByIdAsync,
  getCreateMenuPrepareDataAsync,
};
export default menuManagementDataService;
