export const EnumCustomerAddressType = {
  Home: 0,
  Work: 1,
};

export const EnumFlashSaleStatus = {
  FlashSaleHasEnded: 0,
  FlashSaleIsHappening: 1,
  FlashSaleIsComing: 2,
};

export const EnumOrderStatusStoreWeb = {
  ToConfirm: 3,
  Processing: 4,
  Delivering: 5,
  Completed: 6,
  Canceled: 2,
  Draft: 7,
};

export const EnumReservationStatusStoreWeb = {
  Cancelled: 0,
  WaitToConfirm: 1,
  Confirmed: 2,
  Serving: 3,
  Completed: 4,
  All: -1
};

export const EnumGenderAccount = {
  Male: 1,
  Female: 2,
  Other: 3,
};

export const EnumOrderStatus = {
  New: 0,
  Returned: 1,
  Canceled: 2,
  ToConfirm: 3,
  Processing: 4,
  Delivering: 5,
  Completed: 6,
  Draft: 7,
};

export const EnumOrderStatusIncludeStringKey = {
  New: { id: 0, name: "New" },
  Returned: { id: 1, name: "Returned" },
  Canceled: { id: 2, name: "Canceled" },
  ToConfirm: { id: 3, name: "ToConfirm" },
  Processing: { id: 4, name: "Processing" },
  Delivering: { id: 5, name: "Delivering" },
  Completed: { id: 6, name: "Completed" },
  Draft: { id: 7, name: "Draft" },
};

export const EnumDeliveryMethod = {
  SELF_DELIVERY: 1,
  AHAMOVE: 2,
  COD: 3,
  GrabExpress: 4
};

export const EnumProductStatus = {
  InActive: 0,
  Active: 1,
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

export const EnumPromotion = {
  DiscountTotal: 0,
  DiscountProduct: 1,
  DiscountProductCategory: 2,
};

export const EnumPromotionType = {
  DISCOUNT_CODE: "DISCOUNT_CODE",
  STORE_CODE: "STORE_CODE",
};

export const EnumPromotionModalType = {
  VOUCHER: "VOUCHER",
  STORE: "STORE",
};

export const ListPromotionType = [
  {
    key: 0,
    name: "promotion.discount.total",
  },
  {
    key: 1,
    name: "promotion.discount.product",
  },
  {
    key: 2,
    name: "promotion.discount.productCategory",
  },
];

export const EnumPromotionTabKey = {
  discountCode: "code",
  storeDiscount: "store",
};

export const EnumBlogName = {
  BLOG_PAGE: "blog-page",
  DETAIL_PAGE: "detail-page",
};

export const EnumProfileName = {
  CURRENT_PASSWORD: "currentPassword",
  NEW_PASSWORD: "newPassword",
};

export const enumOrderType = {
  INSTORE: 0,
  DELIVERY: 1,
  TAKE_AWAY: 2,
  ONLINE_DELIVERY: 3,
  PICK_UP: 4,
};

export const colorOrderType = {
  Pickup: "#FF8C21",
  Delivery: "#1CA362",
};

export const EnumPointConfigurationType = {
  LOYALTY: 0,
  REFERRAL: 1
};
