import http from "utils/http-common";
const controller = 'productcategory';
const createProductCategoryAsync = (data) => {
    return http.post(`/${controller}/create-product-category`,data);
}
const getProductCategoriesAsync = (pageNumber,pageSize,keySearch)=>{
    return http.get(`/${controller}/get-product-categories?PageNumber=${pageNumber}&KeySearch=${keySearch}&PageSize=${pageSize}`)
}
const deleteProductCategoryByIdAsync = (id)=>{
    return http.delete(`${controller}/delete-product-category-by-id/${id}`)
}
const productCategoryDataService = {
    createProductCategoryAsync,
    getProductCategoriesAsync,
    deleteProductCategoryByIdAsync
}
export default productCategoryDataService;