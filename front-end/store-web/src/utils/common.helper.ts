import { claimTypesConstants } from '@/constants/claim-types.constants'
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

export const getUserInfo = (token: string | null) => {
  console.log('token: ', token)
  if (token) {
    try {
      const decodedToken = jwtDecode(token)
      console.log(decodedToken)
      const currentTime = Date.now() / 1000
      if (decodedToken.exp && decodedToken.exp < currentTime) return null
      const user: IUser = {
        // userId: decodedToken[claimTypesConstants.id],
        // accountId: decodedToken[claimTypesConstants.accountId],
        // fullName: decodedToken[claimTypesConstants.fullName],
        // email: decodedToken[claimTypesConstants.email],
        // accountType: decodedToken[claimTypesConstants.accountType],
        // thumbnail: decodedToken[claimTypesConstants.thumbnail]
      }
      return user
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }
  return null
}
