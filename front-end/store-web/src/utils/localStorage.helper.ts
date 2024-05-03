import cookie from 'js-cookie'

export const localStorageKeys = {
  TOKEN: 'TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  PRODUCT_FILTER: 'PRODUCT_FILTER',
}

export const getCookie = (key: string) => {
  if (typeof window !== 'undefined') cookie.get(key)
  else return ''
}

export const setCookie = (key: string, value: string) => {
  if (typeof window !== 'undefined') cookie.set(key, value)
}

export const removeCookie = (key: string) => {
  if (typeof window !== 'undefined') cookie.remove(key)
}

export const resetSession = () => {
  if (typeof window !== 'undefined') {
    removeCookie(localStorageKeys.TOKEN)
    removeCookie(localStorageKeys.REFRESH_TOKEN)
  }
}
