import http from '../../utils/http-common'

const controller = 'authenticate'

const authenticate = (data) => {
  const config = {
    withCredentials: false
  }

  return http.post(`/${controller}/authenticate`, data, config)
}

const refreshTokenAndPermissionsAsync = (data) => {
  return http.post(`/${controller}/refresh-token-and-permissions`, data)
}

const loginDataService = {
  authenticate,
  refreshTokenAndPermissionsAsync
}
export default loginDataService
