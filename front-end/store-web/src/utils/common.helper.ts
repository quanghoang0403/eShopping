import { jwtDecode } from 'jwt-decode'

export const getCustomerId = () => {
  return true
}

export const isAuthorized = () => {
  return true
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
