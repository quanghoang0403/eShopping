import { createHttp } from "../utils/http-common";

const controller = "combo";

const getComboProductPriceByComboIdAsync = (id) => {
  const http = createHttp();
  return http.get(`/${controller}/get-combo-product-price-by-combo-id/${id}`);
};

const getComboPricingByComboPricingIdAsync = (comboPricingId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-combo-pricing-by-combo-pricing-id/${comboPricingId}`);
};

const getSimilarCombosByBranchIdAsync = () => {
  const http = createHttp();
  return http.get(`/${controller}/get-similar-combos-by-branch-id`);
};

const getCombosAsync = (data) => {
  const http = createHttp();
  const { branchId = "" } = data;
  return http.get(`/${controller}?branchId=${branchId}`);
};

const comboDataService = {
  getComboProductPriceByComboIdAsync,
  getComboPricingByComboPricingIdAsync,
  getSimilarCombosByBranchIdAsync,
  getCombosAsync,
};

export default comboDataService;
