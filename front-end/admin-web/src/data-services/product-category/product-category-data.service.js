import http from "utils/http-common";
const controller = 'productcategory';
const createProductCategoryAsync = (data) => {
    return http.post(`/${controller}/create-product-category`,data);
}
const getProductCategoriesAsync = (pageNumber,pageSize,keySearch)=>{
    return http.get(`/${controller}/get-product-categories?PageNumber=${pageNumber}&KeySearch=${keySearch}&PageSize=${pageSize}`)
}
const deleteProductCategoryByIdAsync = (id) => {
    return http.delete(`${controller}/delete-product-category-by-id/${id}`)
}
const getProductCategoryByIdAsync = (id) => {
    return http.get(`${controller}/get-product-category-by-id/${id}`)
}
const updateProductCategoryAsync = (data) => {
    return http.put(`${controller}/update-product-category`,data)
}
const getAllProductCategoriesAsync = ()=>{
    return http.get(`/${controller}/get-all-product-categories`)
}
const productCategoryDataService = {
    createProductCategoryAsync,
    getProductCategoriesAsync,
    deleteProductCategoryByIdAsync,
    getProductCategoryByIdAsync,
    updateProductCategoryAsync,
    getAllProductCategoriesAsync
}
export default productCategoryDataService;