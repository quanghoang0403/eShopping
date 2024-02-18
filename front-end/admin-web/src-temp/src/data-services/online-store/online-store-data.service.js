import http from "../../utils/http-common";

const controller = "onlineStore";

const getAllStoreWebPageAsync = () => {
  return http.get(`/${controller}/get-all-store-web-page`);
};

const getStoreThemesAsync = () => {
  return http.get(`/${controller}/get-store-themes`);
};

const createStoreThemeAsync = (data) => {
  return http.post(`/${controller}/create-store-theme`, data);
};

const getStoreThemeConfiguration = (storeThemeId) => {
  return http.get(`/${controller}/get-store-theme-configuration?storeThemId=${storeThemeId}`);
};

const getThemeIdByStoreThemeId = (storeThemeId) => {
  return http.get(`/${controller}/get-theme-id-by-store-theme-id?storeThemId=${storeThemeId}`);
};

const updateStoreThemeConfiguration = (data) => {
  return http.post(`/${controller}/update-store-theme-configuration`, data);
};

const deleteThemeByIdAsync = (data) => {
  return http.delete(`/${controller}/delete-theme-by-id/${data}`);
};

const updateThemeName = (data) => {
  return http.put(`/${controller}/update-store-theme-name`, data);
}

const onlineStoreDataService = {
  getAllStoreWebPageAsync,
  getStoreThemesAsync,
  createStoreThemeAsync,
  getStoreThemeConfiguration,
  updateStoreThemeConfiguration,
  getThemeIdByStoreThemeId,
  deleteThemeByIdAsync,
  updateThemeName,
};
export default onlineStoreDataService;
