export const localStorageKeys = {
  TOKEN: 'TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  PRODUCT_FILTER: 'PRODUCT_FILTER',
}

export const getStorage = (key: string) => {
  if (typeof window !== 'undefined') return localStorage.getItem(key)
  else return ''
}

export const setStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') localStorage.setItem(key, value)
}

export const resetStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(localStorageKeys.PRODUCT_FILTER)
    localStorage.removeItem(localStorageKeys.TOKEN)
    localStorage.removeItem(localStorageKeys.REFRESH_TOKEN)
  }
}
