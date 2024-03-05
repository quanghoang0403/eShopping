export const PromotionType = {
  /// <summary>
  /// DiscountTotal
  /// </summary>
  DiscountTotal: 0,

  /// <summary>
  /// DiscountProduct
  /// </summary>
  DiscountProduct: 1,

  /// <summary>
  /// In DiscountProductCategory
  /// </summary>
  DiscountProductCategory: 2
}

export const ListPromotionType = [
  {
    key: 0,
    name: 'promotion:discountTotal'
  },
  {
    key: 1,
    name: 'promotion:discountProduct'
  },
  {
    key: 2,
    name: 'promotion:discountProductCategory'
  }
]

export const PromotionStatus = {
  Schedule: 1,
  Active: 2,
  Finish: 3
}

export const PromotionTabLabel = {
  Discount: 'discount',
  FlashSale: 'flashsale',
  DiscountCode: 'discountcode'
}

export const PromotionTabKey = {
  Discount: '1',
  FlashSale: '2',
  DiscountCode: '3'
}
