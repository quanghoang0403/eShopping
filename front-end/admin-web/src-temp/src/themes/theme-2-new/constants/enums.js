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
  Canceled: 2,
  ToConfirm: 3,
  Processing: 4,
  Delivering: 5,
  Completed: 6,
  Draft: 7,
};

export const EnumGenderAccount = {
  Male: 1,
  Female: 2,
  Other: 3,
};

export const EnumResponseCode = {
  success: 200,
  flashSaleFailed: 1,
};

export const EnumFlashSaleResponseCode = {
  success: 200,
  inactive: 1,
  minimumPurchaseValue: 2,
  overLimited: 3,
  notFound: 4,
};

export const EnumComboType = {
  Flexible: 0,
  Specific: 1,
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

export const EnumNextTimeOpenType = [
  {
    key: 1,
    name: "storeBranch.today",
  },
  {
    key: 2,
    name: "storeBranch.tomorrow",
  },
  {
    key: 3,
    name: "storeBranch.nextDate",
  },
];

export const EnumDayOfWeek = [
  {
    key: 0,
    name: "storeBranch.sunday",
  },
  {
    key: 1,
    name: "storeBranch.monday",
  },
  {
    key: 2,
    name: "storeBranch.tuesday",
  },
  {
    key: 3,
    name: "storeBranch.wednesday",
  },
  {
    key: 4,
    name: "storeBranch.thursday",
  },
  {
    key: 5,
    name: "storeBranch.friday",
  },
  {
    key: 6,
    name: "storeBranch.saturday",
  },
];

export const enumOrderType = {
  IN_STORE: 0,
  ONLINE_DELIVERY: 3,
  PICK_UP: 4,
};

export const enumCheckInactiveProduct = {
  NOT_FOUND: 1,
};

export const EnumPromotionSummary = {
  Discount: 1,
  DiscountCode: 2,
  LoyaltyPointDiscount: 3,
  CustomerMembershipDiscount: 4,
};

export const enumReserveTable = {
  Cancelled: 0,
  WaitToConfirm: 1,
  Confirmed: 2,
  Serving: 3,
  Completed: 4,
};

export const EnumVerifyProductPromotionType = {};
