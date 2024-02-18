import actionTypes from "./session.types";

export const setLanguageSession = (data) => {
  return { type: actionTypes.LANGUAGE_SESSION, payload: data };
};

export const setThemeCustomizeConfig = (data) => {
  return { type: actionTypes.SET_THEME_CUSTOMIZE_CONFIG, payload: data };
};
export const setLoginSession = (data) => {
  return { type: actionTypes.SET_LOGIN_SESSION, payload: data };
};

export const setCartItems = (data) => {
  return { type: actionTypes.SET_CART_ITEMS, payload: data };
};

export const setNearestStoreBranches = (data) => {
  return { type: actionTypes.SET_NEAREST_STORE_BRANCHES, payload: data };
};

export const setDeliveryAddress = (data) => {
  return { type: actionTypes.SET_DELIVERY_ADDRESS, payload: data };
};

export const setPaymentMethods = (data) => {
  return { type: actionTypes.SET_PAYMENT_METHODS, payload: data };
};

export const setDeliveryMethods = (data) => {
  return { type: actionTypes.SET_DELIVERY_METHODS, payload: data };
};

export const setOrderInfo = (data) => {
  return { type: actionTypes.SET_ORDER_INFO, payload: data };
};

export const setIsOpenReceiverAddressDialog = (data) => {
  return { type: actionTypes.SET_IS_OPEN_RECEIVER_ADDRESS_DIALOG, payload: data };
};

export const setOrderPaymentMethod = (data) => {
  return { type: actionTypes.SET_ORDER_PAYMENT_METHOD, payload: data };
};

export const setUserInfo = (data) => {
  return { type: actionTypes.SET_USER_INFO, payload: data };
};

export const setDataCallBackAddToCart = (data) => {
  return { type: actionTypes.SET_DATA_CALL_BACK_ADD_TO_CART, payload: data };
};

export const setShowFlashSaleInActive = (data) => {
  return { type: actionTypes.SET_SHOW_FLASH_SALE_IN_ACTIVE, payload: data };
};

export const setNotificationDialog = (data) => {
  return { type: actionTypes.SET_NOTIFICATION_DIALOG, payload: data };
};

export const setDiscountCodes = (data) => {
  return { type: actionTypes.SET_DISCOUNT_CODES, payload: data };
};

export const setAppliedDiscountCodes = (data) => {
  return { type: actionTypes.SET_APPLIED_DISCOUNT_CODES, payload: data };
};

export const setToastMessage = (data) => {
  return { type: actionTypes.SET_TOAST_MESSAGE, payload: data };
};

export const setSelectedSubMenuId = (data) => {
  return { type: actionTypes.SET_SELECTED_SUB_MENU_ID, payload: data };
};

export const setDeliverySchedule = (data) => {
  return { type: actionTypes.SET_DELIVERY_SCHEDULE, payload: data };
};

export const setPOSCartItems = (data) => {
  return { type: actionTypes.SET_POS_CART_ITEMS, payload: data };
};

export const setWorkingHourByBranch = (data) => {
  return { type: actionTypes.SET_WORKING_HOUR, payload: data };
};

export const setPackageExpiredInfo = (data) => {
  return { type: actionTypes.SET_PACKAGE_EXPIRED_INFO, payload: data };
};

export const setLoyaltyPointInformation = (data) => {
  return { type: actionTypes.SET_LOYALTY_POINT, payload: data };
};

export const setStoreConfig = (data) => {
  return { type: actionTypes.SET_STORE_CONFIG, payload: data};
};

export const setAddressList = (data) => {
  return { type: actionTypes.SET_ADDRESS_LIST, payload: data};
}