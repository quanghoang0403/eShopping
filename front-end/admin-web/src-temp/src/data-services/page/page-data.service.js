import http from "../../utils/http-common";

const controller = "page";

const getAllPageAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(`/${controller}/get-all-page?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`);
};

const getPageByIdAsync = (id) => {
  return http.get(`/${controller}/get-page-by-id/${id}`);
};

const createPageAsync = (data) => {
  return http.post(`/${controller}/create-page`, data);
};

const updatePageAsync = (data) => {
  return http.put(`/${controller}/update-page`, data);
};

const deletePageByIdAsync = (pageId) => {
  return http.delete(`/${controller}/delete-page/${pageId}`);
};

const pageDataService = {
  getAllPageAsync,
  createPageAsync,
  getPageByIdAsync,
  updatePageAsync,
  deletePageByIdAsync,
};
export default pageDataService;
