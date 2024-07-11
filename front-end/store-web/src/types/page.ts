interface ICollectionDataResponse {
    genderProduct: number
    productRootCategoryId?: string
    productCategoryId?: string
    name: string
    description: string
    titleSEO?: string
    keywordSEO?: string
    descriptionSEO?: string
    productRootCategories: IProductRootCategory[]
    productCategories: IProductCategory[]
}
  
interface ISearchDataResponse {
    keySearch: string
    productRootCategories: IProductRootCategory[]
    productCategories: IProductCategory[]
}

interface IHomeDataResponse {
    discountedProducts: IProduct[]
    featuredProducts: IProduct[]
    newInProducts: IProduct[]
}