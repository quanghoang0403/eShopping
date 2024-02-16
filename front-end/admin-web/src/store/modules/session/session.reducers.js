import Moment from "moment";
import { localStorageKeys, setStorage } from "utils/localStorage.helpers";
import { encryptWithAES } from "utils/securityHelpers";
import actionTypes from "./session.types";

const sessionInitialState = {
  fontFamily: "",
  storeInfo: {},
  auth: {},
  currentUser: {},
  requestRenderThemeCustomize: false,
  lastUpdated: 1439478405547,
  languageSession: undefined,
};

const sessionReducer = (state = sessionInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH:
      return {
        ...state,
        currentUser: action?.auth?.user,
        auth: action.auth,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_PERMISSIONS:
      const jsonPermissions = JSON.stringify(action.permissions);
      let encodeData = encryptWithAES(jsonPermissions);
      setStorage(localStorageKeys.PERMISSIONS, encodeData);
      return {
        ...state,
        permissions: action.permissions,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.currentUser,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.RESET_SESSION:
      return {
        ...sessionInitialState,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_AUTH_TOKEN:
      setStorage(localStorageKeys.TOKEN, action.token);
      return {
        ...state,
        auth: {
          ...state.auth,
          token: action.token,
          refreshToken: action.refreshToken,
          expire: action.expire,
        },
      };
    case actionTypes.LANGUAGE_SESSION:
      return { ...state, languageSession: action?.payload };
    case actionTypes.SET_WORKSPACE:
      const { auth, token, permissions } = action.data;
      const jsonWorkspacePermissions = JSON.stringify(permissions);
      let encodeJsonWorkspacePermissions = encryptWithAES(jsonWorkspacePermissions);
      setStorage(localStorageKeys.PERMISSIONS, encodeJsonWorkspacePermissions);
      setStorage(localStorageKeys.TOKEN, token);
      return {
        ...state,
        auth: auth,
        permissions: permissions,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_THUMBNAIL:
      return {
        ...state,
        auth: {
          ...state?.auth,
          user: {
            ...state?.auth?.user,
            thumbnail: action?.thumbnail,
          },
        },
      };
    case actionTypes.SET_PERMISSION_GROUP:
      const jsonPermissionGroup = JSON.stringify(action.permissionGroup);
      let encodePermissionGroupData = encryptWithAES(jsonPermissionGroup);
      setStorage(localStorageKeys.PERMISSION_GROUP, encodePermissionGroupData);
      return {
        ...state,
        permissionGroup: action.permissionGroup,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_FULL_NAME:
      return {
        ...state,
        auth: {
          ...state?.auth,
          user: {
            ...state?.auth?.user,
            fullName: action?.fullName,
          },
        },
      };
    case actionTypes.STORE_LOGO:
      return {
        ...state,
        storeLogo: action?.storeLogoUrl,
      };

    case actionTypes.SET_STORE_INFO:
      return {
        ...state,
        storeInfo: action.storeInfo,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_PREPARE_ADDRESS_DATA:
      return {
        ...state,
        prepareAddressData: {
          ...action.payload,
        },
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_THEME_CUSTOMIZE_CONFIG:
      return {
        ...state,
        themeConfig: { ...action.config },
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_THEME_CUSTOMIZE_CONFIG_DEFAULT:
      return {
        ...state,
        themeConfigDefault: action.config,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_THEME_CUSTOMIZE_MENU:
      return {
        ...state,
        themeConfigMenu: action.data,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_PREPARE_DATA_FOR_BANNER:
      return {
        ...state,
        prepareDataBanner: action.data,
      };
    case actionTypes.SET_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_INFORMATION_PUBLISH_STORE:
      return {
        ...state,
        informationPublishStore: action.data,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_REQUEST_RENDER_THEME_CUSTOMIZE:
      return {
        ...state,
        requestRenderThemeCustomize: !state.requestRenderThemeCustomize,
      };
    case actionTypes.SET_SELECTED_SUB_MENU_ID:
      return {
        ...state,
        selectedSubMenuID: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_POS_CART_ITEMS:
      return {
        ...state,
        posCartItems: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_THEME_FONT:
      return {
        ...state,
        fontFamily: action.payload,
        lastUpdated: Moment.utc().format("x"),
      };
    default:
      return state;
  }
};

export const sessionSelector = (state) => state.session;

export const storeInfoSelector = (state) => state?.session?.storeInfo ?? null;

export const themeFontSelector = (state) => state?.session?.fontFamily;
export const languageCodeSelector = (state) => state?.session?.languageSession?.default?.languageCode;
export const authSelector = (state) => state?.session?.auth;
export const currencyCodeSelector = (state) => state?.session?.auth?.user?.currencyCode;
export const exchangeRateUSDtoVNDSelector = (state) => state?.session?.storeInfo?.exchangeRateUSDtoVND;

export default sessionReducer;
