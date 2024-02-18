import http from "../../utils/http-common";

const controller = "deliveryConfig";

const updateDeliveryConfigAsync = (data) => {
  return http.put(`/${controller}/update-delivery-config`, data);
};

const updateAhaMoveConfigAsync = (data) => {
  return http.put(`/${controller}/update-ahamove-config`, data);
};

const updateGrabConfigAsync = (data) => {
  return http.put(`/${controller}/update-grab-config`, data);
};

const deliveryConfigService = {
  updateDeliveryConfigAsync,
  updateAhaMoveConfigAsync,
  updateGrabConfigAsync,
};

export default deliveryConfigService;
