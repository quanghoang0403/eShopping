import http from "../../utils/http-common";

const controller = "promotion";

const createPromotionAsync = (data) => {
  return http.post(`/${controller}/create-promotion`, data);
};

const getPromotionsAsync = (
  pageNumber,
  pageSize,
  keySearch,
  branchId,
  statusId,
  valueType,
  startDate,
  endDate,
  minMinimumPurchaseOnBill,
  maxMinimumPurchaseOnBill,
  applicableType,
  includeTopping
) => {
  return http.get(
    `/${controller}/get-promotions?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&branchId=${branchId}&statusId=${statusId}&valueType=${valueType}&startDate=${startDate}&endDate=${endDate}&minMinimumPurchaseOnBill=${minMinimumPurchaseOnBill}&maxMinimumPurchaseOnBill=${maxMinimumPurchaseOnBill}&applicableType=${applicableType}&includeTopping=${includeTopping}`
  );
};

const getPromotionCampaignUsageDetailAsync = (pageNumber, pageSize, promotionCampaignId) => {
  return http.get(
    `/${controller}/get-promotion-campaign-usage-detail?pageNumber=${pageNumber}&pageSize=${pageSize}&promotionCampaignId=${promotionCampaignId}`
  );
};

const stopPromotionByIdAsync = (id) => {
  return http.post(`/${controller}/stop-promotion-by-id/${id}`);
};

const deletePromotionByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-promotion-by-id/${id}`);
};

const getPromotionByIdAsync = (id) => {
  return http.get(`/${controller}/get-promotion-by-id/${id}`);
};

const updatePromotionAsync = (data) => {
  return http.put(`/${controller}/update-promotion`, data);
};

const promotionDataService = {
  createPromotionAsync,
  getPromotionsAsync,
  stopPromotionByIdAsync,
  deletePromotionByIdAsync,
  getPromotionByIdAsync,
  updatePromotionAsync,
  getPromotionCampaignUsageDetailAsync,
};
export default promotionDataService;
