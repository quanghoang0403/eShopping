import http from "utils/http-common";
const controller = 'product'
const getAllProductsAsync = ()=>{
    return http.get(`/${controller}/get-all-products`);
}
const createProductAsync = data=>{
    return http.post(`/${controller}/create-product`,data)
}
const getProductsByFilterAsync = (pageNumber,pageSize,keySearch,productCategoryId,statusId)=>{
    return http.get(`/${controller}/get-products?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch}`)
}
const deleteProductByIdAsync = id => {
    return http.delete(`/${controller}/delete-product-by-id/${id}`);
}
const getProductByIdAsync = id =>{
    return http.get(`/${controller}/get-product-by-id?Id=${id}`)
}
const updateProductAsync = data =>{
    return http.put(`/${controller}/update-product`,data)
}
const changeStatusAsync = id => {
    return http.put(`/${controller}/change-status/${id}`)
}
const productDataService = {
    getAllProductsAsync,
    createProductAsync,
    getProductsByFilterAsync,
    deleteProductByIdAsync,
    getProductByIdAsync,
    updateProductAsync,
    changeStatusAsync
}
export default productDataService;