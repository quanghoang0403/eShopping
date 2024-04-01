import { AxiosResponse } from 'axios'
import APIService from './base'

export default class ProductService {
  static async getProducts(request: IGetProductsRequest): Promise<AxiosResponse<IGetProductsResponse>> {
    return await APIService.get(
      `/product/get-products?pageNumber=${request.pageNumber}&pageSize=${request.pageSize}&keySearch=${request.keySearch}&productCategoryId=${request.productCategoryId}&isFeatured=${request.isFeatured}&isDiscounted=${request.isDiscounted}&sortType=${request.sortType}`
    )
  }

  static async getProductById(id: string): Promise<AxiosResponse<IProductDetail>> {
    return await APIService.get(`/product/get-product-by-id?id=${id}`)
  }

  static async getAllProductCategories(): Promise<AxiosResponse<IProductCategory[]>> {
    return await APIService.get(`/productCategory/get-all-product-categories`)
  }

  static async getProductCategoryById(id: string): Promise<AxiosResponse<IProductCategoryDetail>> {
    return await APIService.get(`/productCategory/get-product-category-by-id?id=${id}`)
  }
}
