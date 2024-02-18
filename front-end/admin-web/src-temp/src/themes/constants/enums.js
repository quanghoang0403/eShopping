export const EnumVerifyProductPromotionType = {
  /**
   *  Check the product and do not apply the promotion.
   */
  NotPromotion: 0,

  /**
   *  Verify Flash Sale.
   */
  FlashSale: 1,

  /**
   *   Verify discount product category, discount product.
   */
  Discount: 2,
};

export const EnumAddToCartType = {
  ComboPricing: 0,
  ComboProductPrice: 1,
  Product: 2,
};

export const EnumOrderMessageCode = {
  success: 1,
  FlashSaleIsApplied: 100,
  FlashSaleInactive: 101,
  FlashSaleMinimumPurchaseValue: 102,
  FlashSaleOverLimited: 103,
  FlashSaleNotFound: 104,
  FlashSaleNoApplicableProducts: 105,
  FlashSaleHasBeenChanged: 106,
};

export const EnumDiscountCodeResponseCode = {
  Success: 0,
  Expired: 1,
  MinimumPurchaseValue: 2,
  OverLimited: 3,
  OverLimitedPerCustomer: 4,
  NotFound: 5,
  BranchNotApplicable: 6,
  PlatformNotApplicable: 7,
  Existed: 8,
};

export const DiscountCodeResponseMessage = [
  {
    key: 0,
    message: "promotion.discountCode.redeemSuccessfully",
  },
  {
    key: 1,
    message: "promotion.discountCode.description.expired",
  },
  {
    key: 2,
    message: "promotion.discountCode.description.minimumPurchaseValue",
  },
  {
    key: 3,
    message: "promotion.discountCode.description.overLimited",
  },
  {
    key: 4,
    message: "promotion.discountCode.description.overLimitedPerCustomer",
  },
  {
    key: 5,
    message: "promotion.discountCode.description.notFound",
  },
  {
    key: 6,
    message: "promotion.discountCode.description.branchNotApplicable",
  },
  {
    key: 7,
    message: "promotion.discountCode.description.platformNotApplicable",
  },
  {
    key: 8,
    message: "promotion.discountCode.description.existed",
  },
];

export const EnumFlashSaleResponseCode = {
  Success: 200,
  Inactive: 1,
  MinimumPurchaseValue: 2,
  OverLimited: 3,
  NotFound: 4,
};

export const EnumQRCodeStatus = {
  Scheduled: 1,
  Active: 2,
  Finished: 3,
};

export const EnumOrderType = {
  Instore: 0,
  Delivery: 1,
  TakeAway: 2,
  Online: 3,
  PickUp: 4,
};

export const EnumTargetQRCode = {
  ShopMenu: 0,
  AddProductToCart: 1,
};

export const ScrollHeaderType = {
  SCROLL: 1,
  FIXED: 2,
};

export const enumCheckInactiveProduct = {
  NOT_FOUND: 1,
};

export const PromotionConfigType = {
  PRODUCT: "product",
  ORDER: "order",
  COMBINED: "combined",
};
