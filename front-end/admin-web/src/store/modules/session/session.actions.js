import { localStorageKeys } from "utils/localStorage.helpers";
import actionTypes from "./session.types";

export function setAuth(auth) {
  return { type: actionTypes.SET_AUTH, auth };
}

export function setToken(token) {
  return { type: actionTypes.SET_AUTH_TOKEN, token };
}

export function setPermissions(permissions) {
  return { type: actionTypes.SET_PERMISSIONS, permissions };
}

export function setPermissionGroup(permissionGroup) {
  return { type: actionTypes.SET_PERMISSION_GROUP, permissionGroup };
}
export function setCurrentUser(user) {
  return { type: actionTypes.SET_CURRENT_USER, user };
}

export function setWorkspace(data) {
  return { type: actionTypes.SET_WORKSPACE, data };
}

export function resetSession() {
  localStorage.removeItem(localStorageKeys.USED_TIME);
  localStorage.removeItem(localStorageKeys.TOKEN);
  localStorage.removeItem(localStorageKeys.PERMISSIONS);
  localStorage.removeItem("persist:root");
  return async (dispatch) => {
    dispatch({ type: actionTypes.RESET_SESSION });
  };
}

export const setLanguageSession = (data) => {
  return { type: actionTypes.LANGUAGE_SESSION, payload: data };
};

export const setThumbnailUser = (thumbnail) => {
  return { type: actionTypes.SET_THUMBNAIL, thumbnail };
};

export const setFullNameUser = (fullName) => {
  return { type: actionTypes.SET_FULL_NAME, fullName };
};

export const setStoreLogo = (storeLogoUrl) => {
  return { type: actionTypes.STORE_LOGO, storeLogoUrl };
};

export const setStoreInformation = (storeInfo) => {
  return { type: actionTypes.SET_STORE_INFO, storeInfo };
};

export const setPrepareAddressData = (prepareData) => {
  return { type: actionTypes.SET_PREPARE_ADDRESS_DATA, payload: prepareData };
};

export const setThemeCustomizeConfig = (config) => {
  return { type: actionTypes.SET_THEME_CUSTOMIZE_CONFIG, config };
};

export const setThemeCustomizeConfigDefault = (config) => {
  return { type: actionTypes.SET_THEME_CUSTOMIZE_CONFIG_DEFAULT, config };
};

export const setThemeCustomizeMenu = (data) => {
  return { type: actionTypes.SET_THEME_CUSTOMIZE_MENU, data };
};

export const setPrepareDataForBanner = (data) => {
  return { type: actionTypes.SET_PREPARE_DATA_FOR_BANNER, data };
};

export const setCartItems = (data) => {
  return { type: actionTypes.SET_CART_ITEMS, payload: data };
};

export const setInformationPublishStore = (data) => {
  return { type: actionTypes.SET_INFORMATION_PUBLISH_STORE, data };
};

export const setRequestRenderThemeCustomize = () => {
  return { type: actionTypes.SET_REQUEST_RENDER_THEME_CUSTOMIZE };
};

export const setSelectedSubMenuId = (data) => {
  return { type: actionTypes.SET_SELECTED_SUB_MENU_ID, payload: data };
};

export const setPOSCartItems = (data) => {
  return { type: actionTypes.SET_POS_CART_ITEMS, payload: data };
};

export const setThemeFont = (data) => {
  return { type: actionTypes.SET_THEME_FONT, payload: data };
};
