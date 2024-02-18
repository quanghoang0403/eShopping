import http from "../../utils/http-common";

const controller = "payment";

const getAllStorePersonalPaymentMethodAsync = () => {
  return http.get(`/${controller}/personal-payment`);
};

const createPersonalPaymentMethodRequest = data => {
  return http.post(`/${controller}/personal-payment`, data);
};

const updatePersonalPaymentMethodAsync = (id, body) => {
  return http.put(`/${controller}/personal-payment/${id}`, body);
};

const enablePersonalPaymentMethodAsync = data => {
  return http.put(`/${controller}/enable-personal-payment`, data);
};

const updatePositionPersonalPaymentMethodAsync = data => {
  return http.put(`/${controller}/position-personal-payment`, data);
};

const updatePositionEnterprisePaymentMethodAsync = data => {
  return http.put(`/${controller}/position-enterprise-payment`, data);
};

const paymentDataService = {
  getAllStorePersonalPaymentMethodAsync,
  createPersonalPaymentMethodRequest,
  updatePersonalPaymentMethodAsync,
  enablePersonalPaymentMethodAsync,
  updatePositionPersonalPaymentMethodAsync,
  updatePositionEnterprisePaymentMethodAsync
  
};
export default paymentDataService;
