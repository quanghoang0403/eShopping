interface IProduct {
  id: string
  code: number
  name: string
  thumbnail: string
  percentNumber?: number
  priceValue: number
  priceDiscount?: number
}

interface IProductDetail extends ISEO {
  code: number
  thumbnail: string
  isFeatured?: boolean
  gallery: string[]
  productCategory: IProductCategory
  productPrices: IProductPrice[]
}

interface IProductPrice {
  id: string
  priceName: string
  percentNumber?: number
  priceValue: number
  priceDiscount: number
  quantityLeft: number
  thumbnail?: string
}

interface IProductCategory {
  id: string
  name: string
  urlSEO: string
  isShowOnHome?: boolean
}

interface IProductCategoryDetail extends ISEO {}

enum EnumSortType {
  Default = 0,
  PriceAsc = 1,
  PriceDesc = 2,
}

interface IGetProductsRequest extends IBaseRequest {
  productCategoryId?: string
  isFeatured?: boolean
  isDiscounted?: boolean
  sortType: EnumSortType
}

interface IGetProductsResponse extends IBaseResponse {
  products: IProduct[]
}
