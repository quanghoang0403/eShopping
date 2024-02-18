import { createHttp } from "../utils/http-common";

const controller = "deliveryMethod";
const getStoreConfigDeliveryMethods = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/get-store-config-delivery-methods`, data);
};

const deliveryMethodDataService = {
  getStoreConfigDeliveryMethods,
};

export default deliveryMethodDataService;
