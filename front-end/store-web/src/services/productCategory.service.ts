import APIService from './base'

export default class ProductCategoryService {
  static async getMenuCategory(): Promise<IMenuCategory[]> {
    return await APIService.get('/productRootCategory/get-menu-category')
  }
  static async getCollectionPageByUrl(): Promise<ICollectionDataResponse> {
    return await APIService.get('/productRootCategory/get-collection-page-by-url')
  }
}
