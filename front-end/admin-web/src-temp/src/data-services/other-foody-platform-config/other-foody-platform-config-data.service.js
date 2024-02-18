import http from "../../utils/http-common";

const controller = "foodyPlatformConfig";

const getAllFoodyPlatformConfigAsync = () => {
  return http.get(`/${controller}`);
};

const createFoodyPlatformConfigAsync = data => {
  return http.post(`/${controller}`, data);
};

const updateFoodyPlatformConfigAsync = (data) => {
  return http.put(`/${controller}/${data.id}`, data);
};

const deleteFoodyPlatformConfigAsync = id => {
  return http.delete(`/${controller}/${id}`);
};

const setStatusFoodyPlatformConfigAsync = data => {
  return http.put(`/${controller}/set-status-foody-platform-config`, data);
};

const otherFoodyPlatformConfigDataService = {
  getAllFoodyPlatformConfigAsync,
  createFoodyPlatformConfigAsync,
  updateFoodyPlatformConfigAsync,
  setStatusFoodyPlatformConfigAsync,
  deleteFoodyPlatformConfigAsync
};
export default otherFoodyPlatformConfigDataService;
