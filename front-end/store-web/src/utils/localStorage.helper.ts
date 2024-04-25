export const localStorageKeys = {
  TOKEN: 'TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  PRODUCT_FILTER: 'PRODUCT_FILTER',
}

export const getStorage = (key: string) => {
  return localStorage.getItem(key)
}

export const setStorage = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const resetStorage = () => {
  localStorage.removeItem(localStorageKeys.PRODUCT_FILTER)
  localStorage.removeItem(localStorageKeys.TOKEN)
  localStorage.removeItem(localStorageKeys.REFRESH_TOKEN)
}
