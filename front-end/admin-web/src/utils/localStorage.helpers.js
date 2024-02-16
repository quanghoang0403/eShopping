export const localStorageKeys = {
  TOKEN: "TOKEN",
  PERMISSIONS: "PERMISSIONS",
  PERMISSION_GROUP: "PERMISSION_GROUP",
};

export const getStorage = (key) => {
  return localStorage.getItem(key);
};

export const setStorage = (key, value) => {
  localStorage.setItem(key, value);
};
