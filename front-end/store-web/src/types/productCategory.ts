interface IProductRootCategory {
  id: string
  name: string
  urlSEO: string
  productCategories: IProductCategory[]
}

interface IProductCategory {
  id: string
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
  productCategories: IProductCategory[],
}

interface IProductCategoryDetail extends ISEO {}

interface IProductRootCategoryDetail extends ISEO {}
