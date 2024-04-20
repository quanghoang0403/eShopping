export const localStorageKeys = {
  TOKEN: 'TOKEN',
  PRODUCT_FILTER: 'PRODUCT_FILTER',
}

export const getStorage = (key: string) => {
  return localStorage.getItem(key)
}

export const setStorage = (key: string, value: string) => {
  localStorage.setItem(key, value)
}
