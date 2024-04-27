import { encryptWithAES } from "./securityHelpers"

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

export const removeStorage = (key) => {
  localStorage.removeItem(key)
}

export const clearStorage = () => {
  localStorage.clear()
  // removeStorage(localStorageKeys.TOKEN)
  // removeStorage(localStorageKeys.REFRESH_TOKEN)
  // removeStorage(localStorageKeys.PERMISSIONS)
  // removeStorage('persist:root')
}

export const setStorageToken = (data) => {
  const jsonPermissions = JSON.stringify(data.permissions)
  const encodeData = encryptWithAES(jsonPermissions)
  setStorage(localStorageKeys.PERMISSIONS, encodeData)
  setStorage(localStorageKeys.TOKEN, data.token)
  setStorage(localStorageKeys.REFRESH_TOKEN, data.refreshToken)
}

