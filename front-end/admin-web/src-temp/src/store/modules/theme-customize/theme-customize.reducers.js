import moment from "moment";
import { actionType } from "./theme-customize.types";

const initialState = {
  headerMenuOptions: [],
  data: null,
  lastUpdated: 1439478405547,
};

const reducer = (state = initialState, action) => {
  let draft = state.data;
  switch (action.type) {
    case actionType.SET_HEADER_MENU_OPTIONS:
      return {
        ...state,
        headerMenuOptions: action.payload,
        lastUpdated: moment.utc().format("x"),
      };

    case actionType.SET_THEME_CONFIG:
      return {
        ...state,
        data: action.payload,
        lastUpdated: moment.utc().format("x"),
      };

    case actionType.UPDATE_THEME_HEADER_MENU:
      draft["general"]["header"]["menuItems"] = action.payload["menuItems"];
      draft["general"]["header"]["menuId"] = action.payload["menuId"];
      return {
        ...state,
        data: { ...draft },
        lastUpdated: moment.utc().format("x"),
      };

    case actionType.UPDATE_THEME_HEADER_MENU_SCROLL_TYPE:
      draft["general"]["header"]["scrollType"] = action.payload;
      return {
        ...state,
        data: { ...draft },
        lastUpdated: moment.utc().format("x"),
      };

    case actionType.CLEAR_THEME_CONFIG:
      return {
        ...state,
        data: null,
        lastUpdated: moment.utc().format("x"),
      };
    default:
      return state;
  }
};

export const themeHeaderMenuOptionsSelector = (state) => state?.themeConfig?.headerMenuOptions;
export const themeConfigSelector = (state) => state?.themeConfig?.data;
export const themeGeneralConfigSelector = (state) => state?.themeConfig?.data?.general;
export const themeHeaderConfigSelector = (state) => state?.themeConfig?.data?.general?.header;

export default reducer;
