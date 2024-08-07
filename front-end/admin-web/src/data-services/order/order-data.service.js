import http from 'utils/http-common'
const controller = 'order'
const GetOrdersAsync = (data) => {
  const { startDate, endDate, optionDate, pageNumber, pageSize, keySearch } = data
  return http.get(`/${controller}/get-orders?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch}&StartDate=${startDate}&EndDate=${endDate}&OptionDate=${optionDate}`)
}
const ChangeOrderStatusAsync = (data) => {
  return http.put(`/${controller}/update-order-status`, data)
}
const GetOrderDetailAsync = id =>{
  return http.get(`/${controller}/get-order-by-id/${id}`)
}
const OrderDataService = {
  GetOrdersAsync,
  ChangeOrderStatusAsync,
  GetOrderDetailAsync
}
export default OrderDataService
