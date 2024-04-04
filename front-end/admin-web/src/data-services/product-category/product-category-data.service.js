import http from "utils/http-common";
const controller = 'productcategory';
const createProductCategoryAsync = (data) => {
    return http.post(`/${controller}/create-product-category`,data);
}
const productCategoryDataService = [
    createProductCategoryAsync
]
export default productCategoryDataService;