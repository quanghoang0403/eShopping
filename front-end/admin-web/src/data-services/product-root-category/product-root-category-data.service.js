import http from "utils/http-common"
const controller = 'productrootcategory'
const CreateProductRootCategoryAsync = (data) => {
    return http.post(`${controller}/create-product-root-category`, data)
}
const GetProductRootCategoryAsync = (pageNumber, pageSize, keySearch, genderProduct) => {
    return http.get(`${controller}/get-product-root-categories?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch}&GenderProduct=${genderProduct}`)
}
const RootCategoryDataService = {
    CreateProductRootCategoryAsync,
    GetProductRootCategoryAsync
}
export default RootCategoryDataService