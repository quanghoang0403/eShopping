import APIService from './base'

export default class AddressService {
  static async getCities(): Promise<IArea[]> {
    return await APIService.get('/address/get-all-cities')
  }

  static async getDistricts(id: number): Promise<IArea[]> {
    return await APIService.get(`/address/get-districts-by-city-id?cityId=${id}`)
  }

  static async getWards(id: number): Promise<IArea[]> {
    return await APIService.get(`/address/get-wards-by-district-id?districtId=${id}`)
  }

  static async getMenu(id: number): Promise<IArea[]> {
    return await APIService.get(`/address/get-wards-by-district-id?districtId=${id}`)
  }
}
