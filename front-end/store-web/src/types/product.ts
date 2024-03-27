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
