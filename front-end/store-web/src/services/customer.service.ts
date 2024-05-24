import APIService from './base'

export default class CustomerService {
  static async getCustomerById(): Promise<ICustomer> {
    return await APIService.get(`/customer/get-customer-by-id`)
  }

  static async createCustomer(request: ICreateCustomerRequest): Promise<boolean> {
    return await APIService.post(`/customer/create-customer`, request)
  }

  static async updateCustomer(request: IUpdateCustomerRequest): Promise<boolean> {
    return await APIService.put(`/customer/update-customer`, request)
  }

  static async updatePassword(request: IUpdatePasswordRequest): Promise<boolean> {
    return await APIService.put(`/customer/update-password`, request)
  }
}
