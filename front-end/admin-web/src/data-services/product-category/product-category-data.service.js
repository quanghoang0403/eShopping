import http from 'utils/http-common';
const controller = 'productcategory';
const createProductCategoryAsync = (data) => {
  return http.post(`/${controller}/create-product-category`, data);
}
const getProductCategoriesAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(`/${controller}/get-product-categories?PageNumber=${pageNumber}&KeySearch=${keySearch}&PageSize=${pageSize}`)
}
const deleteProductCategoryByIdAsync = (id) => {
  return http.delete(`${controller}/delete-product-category-by-id/${id}`)
}
const getProductCategoryByIdAsync = (id) => {
  return http.get(`${controller}/get-product-category-by-id/${id}`)
}
const updateProductCategoryAsync = (data) => {
  return http.put(`${controller}/update-product-category`, data)
}
const getAllProductCategoriesAsync = (productRootCategoryId, genderProduct) => {
  return http.get(`/${controller}/get-all-product-categories?productRootCategoryId=${productRootCategoryId}&GenderProduct=${genderProduct}`)
}
const updateProductByCategoryAsync = data => {
  return http.put(`${controller}/update-product-list`, data)
}
const productCategoryDataService = {
  createProductCategoryAsync,
  getProductCategoriesAsync,
  deleteProductCategoryByIdAsync,
  getProductCategoryByIdAsync,
  updateProductCategoryAsync,
  getAllProductCategoriesAsync,
  updateProductByCategoryAsync
}
export default productCategoryDataService;
