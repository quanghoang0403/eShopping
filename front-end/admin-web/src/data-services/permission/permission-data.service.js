import http from '../../utils/http-common'

const controller = 'permission'

const getPermissionsAsync = (token) => {
  return http.get(`/${controller}/get-permissions?token=${token}`)
}

const permissionDataService = {
  getPermissionsAsync
}
export default permissionDataService
