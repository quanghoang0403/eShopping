import { AxiosResponse } from 'axios'
import APIService from './base'

export default class AddressService {
  static async getCities(): Promise<AxiosResponse<{ cities: IArea[] }>> {
    return await APIService.get('/address/get-all-cities')
  }

  static async getDistricts(id: number): Promise<AxiosResponse<{ districts: IArea[] }>> {
    return await APIService.get(`/address/get-districts-by-city-id?cityId=${id}`)
  }

  static async getWards(id: number): Promise<AxiosResponse<{ wards: IArea[] }>> {
    return await APIService.get(`/address/get-wards-by-district-id?districtId=${id}`)
  }
}
