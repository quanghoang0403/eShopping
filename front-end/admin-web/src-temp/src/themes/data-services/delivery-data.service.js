import { createHttp } from "../utils/http-common";

const controller = "delivery";

const calculateDeliveryFee = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/cal-delivery-fee`, data);
};

const deliveryDataService = {
  calculateDeliveryFee,
};

export default deliveryDataService;
