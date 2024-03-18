export const localStorageKeys = {
  TOKEN: 'TOKEN',
  PRODUCT_FILTER: 'PRODUCT_FILTER',
}

export const getStorage = (key) => {
  return localStorage.getItem(key)
}

export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}
