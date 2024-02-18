import { actionType } from "./theme-customize.types";

export const setHeaderMenuOptions = (data) => {
  return { type: actionType.SET_HEADER_MENU_OPTIONS, payload: data };
};

export function setThemeConfig(data) {
  return { type: actionType.SET_THEME_CONFIG, payload: data };
}

export function updateThemeHeaderMenu(data) {
  return { type: actionType.UPDATE_THEME_HEADER_MENU, payload: data };
}

export function updateThemeHeaderMenuScrollType(data) {
  return { type: actionType.UPDATE_THEME_HEADER_MENU_SCROLL_TYPE, payload: data };
}

export function clearThemeConfig() {
  return { type: actionType.CLEAR_THEME_CONFIG };
}
