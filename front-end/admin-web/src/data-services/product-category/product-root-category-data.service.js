import http from 'utils/http-common'
const controller = 'productrootcategory'
const CreateProductRootCategoryAsync = (data) => {
  return http.post(`${controller}/create-product-root-category`, data)
}
const GetProductRootCategoriesAsync = (pageNumber, pageSize, keySearch, genderProduct) => {
  return http.get(`${controller}/get-product-root-categories?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch}&GenderProduct=${genderProduct}`)
}
const GetAllProductRootCategoriesAsync = (genderProduct) => {
  return http.get(`${controller}/get-all-product-root-categories?genderProduct=${genderProduct}`)
}
const DeleteRootCategoryAsync = id => {
  return http.delete(`${controller}/delete-product-root-category-by-id/${id}`)
}
const EditProductRootCategory = data => {
  return http.put(`${controller}/update-product-root-category`, data)
}
const GetProductRootCatgoryByIdAsync = id => {
  return http.get(`${controller}/get-product-root-category-by-id/${id}`)
}
const RootCategoryDataService = {
  CreateProductRootCategoryAsync,
  GetProductRootCategoriesAsync,
  DeleteRootCategoryAsync,
  EditProductRootCategory,
  GetProductRootCatgoryByIdAsync,
  GetAllProductRootCategoriesAsync
}
export default RootCategoryDataService