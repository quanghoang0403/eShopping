import cookie from 'js-cookie'

export const cookieKeys = {
  TOKEN: 'TOKEN',
  NEXT_TOKEN: 'next-auth.session-token',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  CUSTOMER_ID: 'CUSTOMER_ID',
  PRODUCT_FILTER: 'PRODUCT_FILTER',
}

export const getCookie = (key: string) => {
  if (typeof window !== 'undefined') {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${key}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    else return ''
    //cookies.get(key)
  } else return ''
}

export const setCookie = (key: string, value: string) => {
  console.log('setCookie', key, value)
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
