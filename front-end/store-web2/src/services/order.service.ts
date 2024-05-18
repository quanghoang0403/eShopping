import { AxiosResponse } from 'axios'
import APIService from './base'

export default class OrderService {
  static async getOrders(request: IGetOrdersRequest): Promise<AxiosResponse<IGetOrdersResponse>> {
    return await APIService.get(
      `/order/get-orders?pageNumber=${request.pageNumber}&pageSize=${request.pageSize}&keySearch=${request.keySearch}&startDate=${request.startDate}&endDate=${request.endDate}`
    )
  }

  static async getOrderById(id: string): Promise<AxiosResponse<IOrderDetail>> {
    return await APIService.get(`/order/get-order-by-id?id=${id}`)
  }

  static async updateOrder(request: IUpdateOrderRequest): Promise<AxiosResponse> {
    return await APIService.put(`/order/update-order`, request)
  }

  static async cancelOrder(id: string): Promise<AxiosResponse> {
    return await APIService.put(`/order/cancel-order?id=${id}`)
  }

  static async getOrderHistoryByOrderId(id: string): Promise<AxiosResponse<IOrderHistory[]>> {
    return await APIService.get(`/order/get-order-history-by-order-id?id=${id}`)
  }

  static async checkout(request: ICreateOrderRequest): Promise<AxiosResponse<{ id: string }>> {
    return await APIService.post(`/order/checkout`, request)
  }

  static async getPaymentMethods(): Promise<AxiosResponse<IPaymentMethod[]>> {
    return await APIService.get(`/order/get-payment-methods`)
  }

  static async transferConfirm(request: { orderCode: number }): Promise<AxiosResponse<boolean>> {
    return await APIService.post(`/payment/transfer-confirm`, request)
  }
}
