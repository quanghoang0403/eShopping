interface IProduct extends ISEO {
  code: number
  thumbnail: string
  percentNumber?: number
  priceValue: number
  priceDiscount?: number
  isFeatured?: boolean
  isDiscounted?: boolean
  IsNewIn?: boolean
  IsSoldOut?: boolean
}

interface IProductDetail extends ISEO {
  code: number
  thumbnail: string
  isFeatured?: boolean
  isDiscounted?: boolean
  IsNewIn?: boolean
  IsSoldOut?: boolean
  gallery: string[]
  productCategory?: IProductCategory
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

interface IGetProductsRequest extends IPagingRequest {
  productCategoryId?: string
  isFeatured?: boolean
  isDiscounted?: boolean
  sortType: EnumSortType
}
