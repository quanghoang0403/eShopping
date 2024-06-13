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

interface IProductCategoryDetail extends ISEO {}

interface IProductRootCategoryDetail extends ISEO {}
