enum EnumGenderProduct {
  All = 0,
  Male = 1,
  Female = 2,
  Kid = 3,
}
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
  gallery?: string[]
  productCategory?: IProductCategory
  productRootCategory?: IProductCategory
  productVariants: IProductVariant[]
  productSizes: IProductSize[]
  productStocks: IProductStock[]
}

interface IProductVariant {
  id: string
  name: string
  percentNumber?: number
  priceValue: number
  priceDiscount: number
  thumbnail?: string
}

interface IProductSize {
  id: string
  name: string
}

interface IProductStock {
  productVariantId: string
  productSizeId: string
  quantityLeft: number
}

enum EnumSortType {
  Default = 0,
  PriceAsc = 1,
  PriceDesc = 2,
}

interface IGetProductsRequest extends IPagingRequest {
  productCategoryId?: string
  productRootCategoryId?: string
  isFeatured?: boolean
  isDiscounted?: boolean
  isSoldOut?: boolean
  isNewIn?: boolean
  sortType: EnumSortType
}
