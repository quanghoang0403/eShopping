import http from "../../utils/http-common";

const controller = "orderSlip";

const getOrderSlipConfigurationAsync = () => {
  return http.get(`/${controller}`);
};

const updateOrderSlipConfigurationAsync = (data) => {
  return http.put(`/${controller}`, data);
};

const orderSlipDataService = {
  getOrderSlipConfigurationAsync,
  updateOrderSlipConfigurationAsync,
};

export default orderSlipDataService;
