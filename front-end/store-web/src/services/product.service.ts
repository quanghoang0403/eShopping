import APIService, { buildQueryString } from './base'

export default class ProductService {
  static async getProducts(request: IGetProductsRequest): Promise<IPagingResponse<IProduct>> {
    const queryParams = buildQueryString(request);
    return await APIService.get(
      `/product/get-products?${queryParams}`
    )
  }

  static async getProductByUrl(url: string): Promise<IProduct> {
    return await APIService.get(`/product/get-product-by-url?url=${url}`)
  }

  static async getAllProductCategories(): Promise<IProductCategory[]> {
    return await APIService.get(`/productCategory/get-all-product-categories`)
  }

  static async getProductCategoryByUrl(url: string): Promise<IProductCategoryDetail> {
    return await APIService.get(`/productCategory/get-product-category-by-url?url=${url}`)
  }
}
