import { AxiosResponse } from 'axios'
import APIService from './base'

export default class AddressService {
  static getCities(): Promise<AxiosResponse<IArea>> {
    return APIService.get('/address/get-all-cities')
  }

  static getDistricts(id: string): Promise<AxiosResponse<IArea>> {
    return APIService.get(`/address/get-districts-by-city-id?cityId=${id}`)
  }

  static getWards(id: string): Promise<AxiosResponse<IArea>> {
    return APIService.get(`/address/get-wards-by-district-id?districtId=${id}`)
  }
}
