import { createHttp } from "../utils/http-common";
const controller = "qrCode";

const getMakeOrderPositionInfoAsync = (qrCodeId) => {
  const http = createHttp();
  return http.get(`/${controller}/${qrCodeId}`);
};

const qrCodeDataService = {
  getMakeOrderPositionInfoAsync,
};

export default qrCodeDataService;
