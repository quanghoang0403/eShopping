import APIService from './base'

export default class ProductCategoryService {
  static async getMenuCategory(): Promise<IMenuCategory[]> {
    return await APIService.get('/productRootCategory/get-menu-category')
  }
  static async getCollectionPageByUrl(slugs: string[]): Promise<ICollectionDataResponse> {
    const queryString = slugs.map(slug => `slugs=${slug}`).join('&');
    return await APIService.get(`/productRootCategory/get-collection-page-by-url?${queryString}`)
  }
  static async getSearchPage(keySearch: string): Promise<ISearchDataResponse> {
    return await APIService.get(`/productRootCategory/get-search-page?keySearch=${keySearch}`)
  }
  static async getHomePage(): Promise<IHomeDataResponse> {
    return await APIService.get(`/productRootCategory/get-home-page`)
  }
}
