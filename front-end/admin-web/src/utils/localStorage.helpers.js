export const localStorageKeys = {
  TOKEN: "TOKEN",
  PERMISSIONS: "PERMISSIONS",
  PERMISSION_GROUP: "PERMISSION_GROUP",
  PRODUCT_FILTER: "PRODUCT_FILTER",
};

export const getStorage = (key) => {
  return localStorage.getItem(key);
};

export const setStorage = (key, value) => {
  localStorage.setItem(key, value);
};
