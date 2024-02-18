import http from "../../utils/http-common";

const controller = "theme";

const publishStoreWebAsync = (storeThemeId) => {
  return http.get(`/${controller}/publish-store-web?storeThemeId=${storeThemeId}`);
};

const getThemeByIdAsync = (themeId) => {
  return http.get(`/${controller}/get-theme-by-id/${themeId}`);
};

const themeDataService = {
  publishStoreWebAsync,
  getThemeByIdAsync,
};

export default themeDataService;
