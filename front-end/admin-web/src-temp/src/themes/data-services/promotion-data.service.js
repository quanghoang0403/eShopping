import { createHttp } from "../utils/http-common";

const controller = "promotion";

const getPromotionsByBranchIdAsync = (branchId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-promotions-by-branchId?branchId=${branchId ?? ""}`);
};

const promotionDataService = {
  getPromotionsByBranchIdAsync,
};

export default promotionDataService;
