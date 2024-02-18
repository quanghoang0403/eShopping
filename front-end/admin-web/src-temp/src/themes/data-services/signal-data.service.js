import { createHttp } from "../utils/http-common";
const controller = "signal";

const callWaiterAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/serve`, data);
};

const callPaymentAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/payment`, data);
};

const signalDataService = {
  callWaiterAsync,
  callPaymentAsync,
};

export default signalDataService;
