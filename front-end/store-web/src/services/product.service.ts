import { AxiosResponse } from 'axios'
import APIService from './base'

interface IGetProductsRequest extends IBaseRequest {
  productCategoryId?: string
  isFeatured?: boolean
  isDiscounted?: boolean
  sortType: EnumSortType
}

interface IGetProductsResponse extends IBaseResponse {
  products: IProduct[]
}

export default class ProductService {
  static getProducts(request: IGetProductsRequest): Promise<AxiosResponse<IGetProductsResponse>> {
    return APIService.get(
      `/product/get-products?pageNumber=${request.pageNumber}&pageSize=${request.pageSize}&keySearch=${request.keySearch}&productCategoryId=${request.productCategoryId}&isFeatured=${request.isFeatured}&isDiscounted=${request.isDiscounted}&sortType=${request.sortType}`
    )
  }

  static getProductById(id: string): Promise<AxiosResponse<IProductDetail>> {
    return APIService.get(`/product/get-product-by-id?id=${id}`)
  }

  static getAllProductCategories(): Promise<AxiosResponse<IProductCategory[]>> {
    return APIService.get(`/productCategory/get-all-product-categories`)
  }

  static getProductCategoryById(id: string): Promise<AxiosResponse<IProductCategoryDetail>> {
    return APIService.get(`/productCategory/get-product-category-by-id?id=${id}`)
  }
}
