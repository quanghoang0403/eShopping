import http from 'utils/http-common'

const controller = 'productsize'
const CreateProductSizeAsync = data => {
  return http.post(`${controller}/create-product-size`, data)
}
const UpdateProductSizeAsync = data => {
  return http.put(`${controller}/update-product-size`, data)
}
const DeleteProductSizeAsync = id => {
  return http.delete(`${controller}/delete-product-size-by-id/${id}`)
}
const GetProductSizeByIdAsync = id => {
  return http.get(`${controller}/get-product-size-by-id/${id}`)
}
const GetProductSizesAsync = (pageNumber, pageSize, keySearch, sizeCategoryId) => {
  return http.get(`${controller}/get-products-size?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch}&ProductSizeCategoryId=${sizeCategoryId}`)
}
const GetAllProductSizesAsync = (productSizeCategoryId) => {
  return http.get(`${controller}/get-all-product-size?productSizeCategoryId=${productSizeCategoryId}`)
}
const ProductSizeDataService = {
  CreateProductSizeAsync,
  UpdateProductSizeAsync,
  DeleteProductSizeAsync,
  GetProductSizeByIdAsync,
  GetProductSizesAsync,
  GetAllProductSizesAsync
}
export default ProductSizeDataService