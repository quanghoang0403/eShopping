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

const ProductSizeDataService = {
  CreateProductSizeAsync,
  UpdateProductSizeAsync,
  DeleteProductSizeAsync
}
export default ProductSizeDataService