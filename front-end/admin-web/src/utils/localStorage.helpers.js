export const localStorageKeys = {
  TOKEN: 'TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  PERMISSIONS: 'PERMISSIONS',
  PRODUCT_FILTER: 'PRODUCT_FILTER'
}

export const getStorage = (key) => {
  return localStorage.getItem(key)
}

export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}

export const resetStorage = () => {
  localStorage.removeItem(localStorageKeys.TOKEN)
  localStorage.removeItem(localStorageKeys.REFRESH_TOKEN)
  localStorage.removeItem(localStorageKeys.PERMISSIONS)
  localStorage.removeItem('persist:root')
}

