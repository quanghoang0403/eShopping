export const EnumGender = {
  Male: 1,
  Female: 2,
  Other: 3,
}

export const EnumColorCategory = {
  Green: 0,
  Blue: 1,
  Orange: 2,
  Purple: 3,
  Pink: 4,
}

export const EnumSortType = {
  Default: 0,
  PriceAsc: 1,
  PriceDesc: 2,
}

export const EnumGenderProduct = {
  All: 0,
  Male: 1,
  Female: 2,
  Kid: 3,
}

export const EnumOrderStatus = {
  New: 0,
  Returned: 1,
  Canceled: 2,
  Confirmed: 3,
  Processing: 4,
  Delivering: 5,
  Completed: 6,
}

export const EnumPaymentMethod = {
  COD: 0,
  MoMo: 1,
  ZaloPay: 2,
  ShopeePay: 3,
  BankTransferVietQR: 4,
  VNPayQR: 5,
  PayOS: 6,
  ATM: 7,
  CreditDebitCard: 8,
}

export const mappingProductGender = [
  { id: EnumGenderProduct.All, name: 'Tất cả' },
  { id: EnumGenderProduct.Male, name: 'Nam' },
  { id: EnumGenderProduct.Female, name: 'Nữ' },
  { id: EnumGenderProduct.Kid, name: 'Trẻ em' },
]

export const mappingSortType = [
  { id: EnumSortType.Default, name: 'Mới nhất' },
  { id: EnumSortType.PriceAsc, name: 'Giá tăng dần' },
  { id: EnumSortType.PriceDesc, name: 'Giá giảm dần' },
]
