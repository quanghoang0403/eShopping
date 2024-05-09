import cookie from 'js-cookie'

export const cookieKeys = {
  COOKIE: 'Cookie',
  TOKEN: 'TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  PRODUCT_FILTER: 'PRODUCT_FILTER',
}

export const getCookie = (key: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${key}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  // if (typeof window !== 'undefined') cookies.get(key)
  // else return ''
}

export const setCookie = (key: string, value: string) => {
  if (typeof window !== 'undefined') cookie.set(key, value)
}

export const removeCookie = (key: string) => {
  if (typeof window !== 'undefined') cookie.remove(key)
}

export const resetSession = () => {
  if (typeof window !== 'undefined') {
    removeCookie(cookieKeys.TOKEN)
    removeCookie(cookieKeys.REFRESH_TOKEN)
  }
}
