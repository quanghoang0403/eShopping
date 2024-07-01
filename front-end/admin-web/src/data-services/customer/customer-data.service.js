import http from 'utils/http-common';
const controller = 'customer'
const getCustomersAsync = (keySearch, pageNumber, pageSize) => {
  return http.get(`${controller}/get-customers?KeySearch=${keySearch}&PageNumber=${pageNumber}&PageSize=${pageSize}`)
}
const createCustomerAsync = data => {
  return http.post(`${controller}/create-customer`, data)
}
const getCustomerByIdAsync = id => {
  return http.get(`${controller}/get-customer-by-id?id=${id}`)
}
const deleteCustomerAsync = id=>{
  return http.delete(`${controller}/delete-customer-by-id/${id}`)
}
const updateCustomerAsync = data=>{
  return http.put(`${controller}/update-customer`,data)
}
const updateCustomerStatusAsync = id=>{
  return http.put(`${controller}/update-customer-status/${id}`)
}
const customerDataService = {
  getCustomersAsync,
  createCustomerAsync,
  getCustomerByIdAsync,
  deleteCustomerAsync,
  updateCustomerAsync,
  updateCustomerStatusAsync
}
export default customerDataService