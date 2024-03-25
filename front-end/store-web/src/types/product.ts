interface IProduct {
  id: string
  name: string
  thumbnail: string
  percentNumber?: number
  priceValue: number
  priceDiscount?: number
}

interface IProductDetail extends ISEO {
  gallery: string[]
  productCategoryName: string
  thumbnail: string
  productPrices: IProductPrice[]
}

interface IProductPrice {
  id: string
  priceName: string
  percentNumber?: number
  priceValue: number
  priceDiscount: number
  thumbnail?: string
}

interface IProductCategory extends ISEO {
  isShowOnHome: boolean
}
