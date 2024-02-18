import http from "../../utils/http-common";

const controller = "promotionconfig";

const getPromotionConfigAsync = () => {
  return http.get(`/${controller}`);
};

const updatePromotionConfigAsync = (data) => {
  return http.put(`/${controller}`, data);
};

const promotionConfigDataService = {
  getPromotionConfigAsync,
  updatePromotionConfigAsync
};
export default promotionConfigDataService;
