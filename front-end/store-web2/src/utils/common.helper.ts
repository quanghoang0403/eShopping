import { jwtDecode } from 'jwt-decode'

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
