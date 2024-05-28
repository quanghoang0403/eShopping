import http from "utils/http-common";
const controller = 'product'
const getAllProductsAsync = ()=>{
  return http.get(`/${controller}/get-all-products`);
}
const createProductAsync = data=>{
  return http.post(`/${controller}/create-product`,data)
}
const getProductsByFilterAsync = (pageNumber,pageSize,keySearch,productCategoryId,statusId,filterAll)=>{
  return http.get(`/${controller}/get-products?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch}&ProductCategoryId=${productCategoryId}&Status=${statusId}&filterAll=${filterAll}`)
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
const getProductsByCategoryIdAsync = (id,keySearch)=>{
  return http.get(`/${controller}/get-products?ProductCategoryId=${id}&KeySearch=${keySearch}&FilterAll=${true}`)
}
const changeFeatureStatus = data=>{
  const {id,isActivate} = data
  return http.put(`/${controller}/change-featured-status?Id=${id}&IsActivate=${isActivate}`)
}
const productDataService = {
  getAllProductsAsync,
  createProductAsync,
  getProductsByFilterAsync,
  deleteProductByIdAsync,
  getProductByIdAsync,
  updateProductAsync,
  changeStatusAsync,
  getProductsByCategoryIdAsync,
  changeFeatureStatus
}
export default productDataService;
