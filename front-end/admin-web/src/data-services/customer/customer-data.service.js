import http from 'utils/http-common';
const controller = 'customer'
const getCustomersAsync = (keySearch, pageNumber, pageSize) => {
  return http.get(`${controller}/get-customers?KeySearch=${keySearch}&PageNumber=${pageNumber}&PageSize=${pageSize}`)
}
const createCustomerAsync = data => {
  return http.post(`${controller}/create-customer`, data)
}
const getCustomerByIdAsync = id => {
  return http.get(`${controller}/get-customer-by-id`, id)
}
const customerDataService = {
  getCustomersAsync,
  createCustomerAsync,
  getCustomerByIdAsync
}
export default customerDataService