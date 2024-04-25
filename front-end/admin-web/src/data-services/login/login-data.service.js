import http from '../../utils/http-common'

const controller = 'authenticate'

const authenticate = (data) => {
  const config = {
    withCredentials: false
  }

  return http.post(`/${controller}/authenticate`, data, config)
}

const loginDataService = {
  authenticate
}
export default loginDataService
