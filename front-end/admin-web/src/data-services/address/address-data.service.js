import http from "utils/http-common";
const controller = 'address'
const getAllCitiesAsync = () => {
    return http.get(`${controller}/get-all-cities`)
}
const getDistrictsByCityId = cityId => {
    return http.get(`${controller}/get-districts-by-city-id?CityId=${cityId}`)
}
const getWardsByDistrictId = wardId => {
    return http.get(`${controller}/get-wards-by-district-id?DistrictId=${wardId}`)
}
const AddressDataService = {
    getAllCitiesAsync,
    getDistrictsByCityId,
    getWardsByDistrictId
}
export default AddressDataService