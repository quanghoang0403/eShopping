import APIService from './base'

export default class ProductCategoryService {
  static async getMenuCategory(): Promise<IMenuCategory[]> {
    return await APIService.get('/productRootCategory/get-menu-category')
  }
  static async getCollectionPageByUrl(url: string): Promise<ICollectionDataResponse> {
    return await APIService.get(`/productRootCategory/get-collection-page-by-url?url=${url}`)
  }
  static async getSearchPage(keySearch: string): Promise<ICollectionDataResponse> {
    return await APIService.get(`/productRootCategory/get-search-page?keySearch=${keySearch}`)
  }
}
