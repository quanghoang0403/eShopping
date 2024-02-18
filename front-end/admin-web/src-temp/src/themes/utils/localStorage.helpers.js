export const localStorageKeys = {
  STORE_CONFIG: "config",
  STORE_CART: "store_cart",
  BEST_SELLING_PRODUCT_IDS: "best_selling_product_ids",
  BEST_SELLING_CHECK_ALL_PRODUCT: "best_selling_check_all_product",
  BEST_SELLING_PRODUCT_LIST: "best_selling_product_list",
  STORE_DEFAULT_ADDRESS: "store_default_address",
  LOGIN: "login",
  TOKEN: "token",
  CUSTOMER_INFO: "customer_info",
  ACTIVE_MENU: "active_menu",
  CHECK_OUT_HOME_PAGE: "check_out_home_page",
  MY_ACCOUNT_STATE: "my_account_state",
  POS_CART: "pos_cart",
};

export const getStorage = (key) => {
  return localStorage.getItem(key);
};

export const setStorage = (key, value) => {
  localStorage.setItem(key, value);
};

export const removeStorage = (key) => {
  return localStorage.removeItem(key);
};
