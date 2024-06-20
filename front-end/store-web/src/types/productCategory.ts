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
  name: string,
  description: string,
  titleSEO?: string
  keywordSEO?: string
  descriptionSEO?: string
  products: IProduct[],
  productRootCategories: IProductRootCategory[],
  productCategories: IProductCategory[],
}

interface IProductCategoryDetail extends ISEO {}

interface IProductRootCategoryDetail extends ISEO {}
