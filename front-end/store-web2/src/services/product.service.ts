import { AxiosResponse } from 'axios'
import APIService from './base'

export default class ProductService {
  static async getProducts(request: IGetProductsRequest): Promise<IBaseResponse<IGetProductsResponse>> {
    return await APIService.get(
      `/product/get-products?pageNumber=${request.pageNumber}&pageSize=${request.pageSize}&keySearch=${request.keySearch}&productCategoryId=${request.productCategoryId}&isFeatured=${request.isFeatured}&isDiscounted=${request.isDiscounted}&sortType=${request.sortType}`
    )
  }

  static async getProductByUrl(url: string): Promise<IBaseResponse<IProductDetail>> {
    return await APIService.get(`/product/get-product-by-url?url=${url}`)
  }

  static async getAllProductCategories(): Promise<IBaseResponse<IProductCategory[]>> {
    return await APIService.get(`/productCategory/get-all-product-categories`)
  }

  static async getProductCategoryByUrl(url: string): Promise<IBaseResponse<IProductCategoryDetail>> {
    return await APIService.get(`/productCategory/get-product-category-by-url?url=${url}`)
  }
}
