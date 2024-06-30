import { jwtDecode } from 'jwt-decode'
import { cookieKeys, getCookie } from './localStorage.helper'
import { decode } from 'next-auth/jwt'
import { ExtendedToken } from '@/types/authNext'

export const serializeNextAuthToken = async (nextToken: string | undefined) => {
  if (nextToken) {
    try {
      const decoded = (await decode({
        token: nextToken,
        secret: process.env.NEXTAUTH_SECRET ?? '',
      })) as ExtendedToken
      return decoded
    } catch (error) {
      console.error('Error decoding next auth token:', error)
    }
  }
}

export const getCustomerId = async () => {
  const customerId = getCookie(cookieKeys.CUSTOMER_ID)
  if (customerId) {
    return customerId
  }
  const nextToken = getCookie(cookieKeys.NEXT_TOKEN)
  const decodedToken = await serializeNextAuthToken(nextToken)
  if (decodedToken) {
    return decodedToken.customerId
  }
}

export const isAuthorized = async (token?: string, nextToken?: string) => {
  console.log('nextToken', nextToken)
  const nextTokenCurrent = nextToken ?? getCookie(cookieKeys.NEXT_TOKEN)
  const tokenCurrent = token ?? getCookie(cookieKeys.TOKEN)
  console.log('nextTokenCurrent', nextTokenCurrent)
  if (nextTokenCurrent && !await nextTokenExpired(nextTokenCurrent)) {
    return true
  }
  if (tokenCurrent && !tokenExpired(tokenCurrent)) {
    return true
  }
  return false
}

export const tokenExpired = (token: string | null) => {
  if (token) {
    try {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000
      if (decodedToken.exp) return decodedToken.exp < currentTime
    } catch (error) {
      console.error('Error decoding token:', error)
      return true
    }
  }
  return true
}

export const nextTokenExpired = async (token: string) => {
  const decodedToken = await serializeNextAuthToken(token)
  return decodedToken && decodedToken.accessTokenExpiresAt && decodedToken.accessTokenExpiresAt < Date.now()
}

export const isSafariBrowser = () => {
  // return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  return navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') <= -1
}

export const hexToRGB = (h: string) => {
  let r: number | string = 0,
    g: number | string = 0,
    b: number | string = 0

  // 3 digits
  if (h.length == 4) {
    r = '0x' + h[1] + h[1]
    g = '0x' + h[2] + h[2]
    b = '0x' + h[3] + h[3]

    // 6 digits
  } else if (h.length == 7) {
    r = '0x' + h[1] + h[2]
    g = '0x' + h[3] + h[4]
    b = '0x' + h[5] + h[6]
  }

  return 'rgb(' + +r + ',' + +g + ',' + +b + ')'
}
