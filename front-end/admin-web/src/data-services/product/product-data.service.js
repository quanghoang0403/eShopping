import http from "utils/http-common";
const controller = 'product'
const getAllProductsAsync = ()=>{
    return http.get(`/${controller}/get-all-products`);
}
const productDataService = {
    getAllProductsAsync
}
export default productDataService;