import { createHttp } from "../utils/http-common";

const controller = "menuManagement";

const getAllMenuManagementAsync = (pageNumber, pageSize, keySearch) => {
  const http = createHttp();
  return http.get(
    `/${controller}/get-all-menu-management?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const getAllMenuList = () => {
  const http = createHttp();
  return http.get(`/${controller}/get-all-menu-list`);
};

const checkMenuItemReferenceToParentMenuAsync = (menuId, currentLevel) => {
  const http = createHttp();
  return http.get(
    `/${controller}/check-menu-item-reference-to-parent-menu?menuId=${menuId}&currentLevel=${currentLevel}`
  );
};

const getCreateMenuPrepareDataAsync = () => {
  const http = createHttp();
  return http.get(`/${controller}/get-create-menu-prepare-data`);
};

const getOnlineStoreMenuByIdAsync = (id) => {
  const http = createHttp();
  return http.get(`/${controller}/get-online-store-menu-by-id/${id}`);
};

const getMenuItemReferenceToPageByPageIdAsync = (pageId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-menu-item-reference-to-page-by-page-id/${pageId}`);
};

const createMenuAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/create-menu`, data);
};

const updateMenuAsync = (data) => {
  const http = createHttp();
  return http.put(`/${controller}/update-menu`, data);
};

const updateMenuConditionAfterChangeLevelAsync = (data) => {
  const http = createHttp();
  return http.put(`/${controller}/update-menu-condition-after-change-level`, data);
};

const deleteMenuManagementByIdAsync = (id) => {
  const http = createHttp();
  return http.get(`/${controller}/delete-menu-management-by-id-async/${id}`);
};

const checkMenuManagementUseOnStore = (id) => {
  const http = createHttp();
  return http.get(`/${controller}/check-menu-management-use-on-store/${id}`);
};

const menuManagementDataService = {
  getAllMenuManagementAsync,
  getAllMenuList,
  getCreateMenuPrepareDataAsync,
  getMenuItemReferenceToPageByPageIdAsync,
  checkMenuItemReferenceToParentMenuAsync,
  getOnlineStoreMenuByIdAsync,
  createMenuAsync,
  updateMenuAsync,
  updateMenuConditionAfterChangeLevelAsync,
  deleteMenuManagementByIdAsync,
  checkMenuManagementUseOnStore,
};
export default menuManagementDataService;
