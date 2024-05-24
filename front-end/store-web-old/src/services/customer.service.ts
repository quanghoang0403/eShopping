import { AxiosResponse } from 'axios'
import APIService from './base'

export default class CustomerService {
  static async getCustomerById(): Promise<AxiosResponse<ICustomer>> {
    return await APIService.get(`/customer/get-customer-by-id`)
  }

  static async createCustomer(request: ICreateCustomerRequest): Promise<AxiosResponse> {
    return await APIService.post(`/customer/create-customer`, request)
  }

  static async updateCustomer(request: IUpdateCustomerRequest): Promise<AxiosResponse> {
    return await APIService.put(`/customer/update-customer`, request)
  }

  static async updatePassword(request: IUpdatePasswordRequest): Promise<AxiosResponse> {
    return await APIService.put(`/customer/update-password`, request)
  }
}
