import http from 'utils/http-common'

const controller = 'productsizecategory'
const CreateProductSizeCategoryAsync = data => {
  return http.post(`${controller}/create-product-size-category`, data)
}
const GetProductSizesCategoriesAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(`${controller}/get-product-size-categories?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch}`)
}
const UpdateProductSizeCategoryAsync = data => {
  return http.put(`${controller}/update-product-size-category`, data)
}
const DeleteProductSizeCategoryAsync = id => {
  return http.delete(`${controller}/delete-product-size-category-by-id/${id}`)
}

const ProductSizeCategoryDataService = {
  CreateProductSizeCategoryAsync,
  GetProductSizesCategoriesAsync,
  UpdateProductSizeCategoryAsync,
  DeleteProductSizeCategoryAsync
}
export default ProductSizeCategoryDataService