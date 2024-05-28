import { guidIdEmptyValue } from "constants/string.constants";
import http from "utils/http-common";
guidIdEmptyValue
const controller = "staff"
const createNewStaffAsync = data =>{
  return http.post(`/${controller}/create-staff`,data)
}
const getDataStaffManagementAsync = data =>{
  const  { pageNumber,pageSize,keySearch,groupPermissionId } = data
  return http.get(`/${controller}/get-staffs?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch}&PermissionId=${groupPermissionId || guidIdEmptyValue}`)
}
const getStaffByIdAsync = id =>{
  return http.get(`/${controller}/get-staff-by-id/${id}`)
}
const updateStaffAsync = data =>{
  return http.put(`/${controller}/update-staff`,data)
}
const deleteStaffByIdAsync = id=>{
  return http.delete(`/${controller}/delete-staff-by-id/${id}`)
}
const staffDataService = {
  createNewStaffAsync,
  getDataStaffManagementAsync,
  getStaffByIdAsync,
  updateStaffAsync,
  deleteStaffByIdAsync
}
export default staffDataService;
