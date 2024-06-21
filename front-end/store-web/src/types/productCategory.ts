interface IProductRootCategory {
  id: string
  name: string
  urlSEO: string
}

interface IProductCategory {
  id: string
  productRootCategoryId: string
  name: string
  urlSEO: string
}

interface IMenuCategory {
  genderProduct: number
  productRootCategories: INavItemType[]
}

interface ICollectionDataResponse {
  genderProduct: number
  productRootCategoryId?: string
  productCategoryId?: string
  name: string,
  description: string,
  titleSEO?: string
  keywordSEO?: string
  descriptionSEO?: string
  data: IPagingResponse<IProduct>,
  productRootCategories: IProductRootCategory[],
  productCategories: IProductCategory[],
}

interface ISearchDataResponse {
  keySearch: string
  data: IPagingResponse<IProduct>,
  productRootCategories: IProductRootCategory[],
  productCategories: IProductCategory[],
}

interface IProductCategoryDetail extends ISEO {}

interface IProductRootCategoryDetail extends ISEO {}
