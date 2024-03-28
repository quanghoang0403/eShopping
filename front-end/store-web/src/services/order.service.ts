import { AxiosResponse } from 'axios'
import APIService from './base'

interface IGetOrdersRequest extends IBaseRequest {
  startDate: Date
  endDate: Date
}

interface IGetOrdersResponse extends IBaseResponse {
  orders: IOrder[]
}

interface IUpdateOrderRequest {}

interface ICreateOrderRequest {}

export default class OrderService {
  static getOrders(request: IGetOrdersRequest): Promise<AxiosResponse<IGetOrdersResponse>> {
    return APIService.get(
      `/order/get-orders?pageNumber=${request.pageNumber}&pageSize=${request.pageSize}&keySearch=${request.keySearch}&startDate=${request.startDate}&endDate=${request.endDate}`
    )
  }

  static getOrderById(id: string): Promise<AxiosResponse<IOrderDetail>> {
    return APIService.get(`/order/get-order-by-id?id=${id}`)
  }

  static updateOrder(request: IUpdateOrderRequest): Promise<AxiosResponse> {
    return APIService.put(`/order/update-order`, request)
  }

  static cancelOrder(id: string): Promise<AxiosResponse> {
    return APIService.put(`/order/cancel-order?id=${id}`)
  }

  static getOrderHistoryByOrderId(id: string): Promise<AxiosResponse<IOrderHistory[]>> {
    return APIService.get(`/order/get-order-history-by-order-id?id=${id}`)
  }

  static checkout(request: ICreateOrderRequest): Promise<AxiosResponse<{ id: string }>> {
    return APIService.post(`/order/checkout`, request)
  }
}
