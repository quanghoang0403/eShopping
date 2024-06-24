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

interface IProductCategoryDetail extends ISEO {}

interface IProductRootCategoryDetail extends ISEO {}
