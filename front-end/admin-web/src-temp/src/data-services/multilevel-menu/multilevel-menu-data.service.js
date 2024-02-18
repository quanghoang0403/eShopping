import http from "../../utils/http-common";

const controller = "multilevelmenu";

const createMenuAsync = (data) => {
  return http.post(`/${controller}`, data);
};

const getMenuByIdAsync = (id) => {
  return http.get(`/${controller}/${id}`);
};

const updateMenuAsync = (data) => {
  return http.put(`/${controller}`, data);
};

const deleteMenuAsync = (id) => { 
  return http.delete(`/${controller}/${id}`);
}

const getListMenuAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(`/${controller}?pageNumber=${pageNumber}&keySearch=${keySearch}`);
}

const multilevelMenuDataService = {
  createMenuAsync,
  getMenuByIdAsync,
  updateMenuAsync,
  deleteMenuAsync,
  getListMenuAsync
};

export default multilevelMenuDataService;
