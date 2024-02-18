import { env } from "../env";
import { createHttp } from "../utils/http-common";

const controller = "file";

const uploadFileAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/upload`, data, {
    baseURL: `${env.REACT_APP_ROOT_DOMAIN}/api`,
  });
};

const fileDataService = {
  uploadFileAsync,
};

export default fileDataService;
