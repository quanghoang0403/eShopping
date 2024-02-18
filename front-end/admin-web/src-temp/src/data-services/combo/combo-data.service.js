import http from "../../utils/http-common";
import qs from "query-string";

const controller = "combo";

const getPrepareCreateProductComboDataAsync = () => {
  return http.get(`/${controller}/get-prepare-create-product-combo-data`);
};

const getCombosAsync = (params) => {
  return http.get(`/${controller}/get-combos`, {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { encode: false });
    },
  });
};

const getComboByIdAsync = (id) => {
  return http.get(`/${controller}/get-combo-by-id/${id}`);
};

const getAllProductInComboAsync = (params) => {
  return http.get(`/${controller}/get-all-product-in-combo`, { params });
};

const createComboAsync = (data) => {
  return http.post(`/${controller}/create-combo`, data);
};

const updateComboAsync = (data) => {
  return http.put(`/${controller}/update-combo`, data);
};

const deleteComboByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-combo-by-id/${id}`);
};

const stopComboByIdAsync = (id) => {
  return http.post(`/${controller}/stop-combo-by-id/${id}`);
};

const comboDataService = {
  getPrepareCreateProductComboDataAsync,
  getCombosAsync,
  getComboByIdAsync,
  getAllProductInComboAsync,
  createComboAsync,
  updateComboAsync,
  deleteComboByIdAsync,
  stopComboByIdAsync,
};

export default comboDataService;
