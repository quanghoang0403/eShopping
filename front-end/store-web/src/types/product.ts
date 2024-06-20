interface IProduct extends ISEO {
  code: number
  thumbnail: string
  percentNumber?: number
  priceValue: number
  priceDiscount?: number
  isFeatured?: boolean
  isDiscounted?: boolean
  isNewIn?: boolean
  isSoldOut?: boolean
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

interface IGetProductsRequest extends IPagingRequest {
  isNewIn?: boolean;
  isDiscounted?: boolean;
  isFeatured?: boolean;
  genderProduct?: number;
  productRootCategoryIds: string[];
  productCategoryIds: string[];
  keySearch: string;
  sortType?: number;
}
