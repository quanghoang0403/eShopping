import http from '../../utils/http-common'

const controller = 'permission'

const getPermissionsAsync = (token) => {
  return http.get(`/${controller}/get-permissions?token=${token}`)
}
const getAllPermissionAsync = ()=>{
  return http.get(`/${controller}/get-all-permission-groups`)
}
const permissionDataService = {
  getPermissionsAsync,
  getAllPermissionAsync
}
export default permissionDataService
