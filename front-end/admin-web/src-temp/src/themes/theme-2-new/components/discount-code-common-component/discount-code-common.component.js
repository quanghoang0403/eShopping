import { ListPromotionType } from "../../constants/enums";

export function RenderDiscountCodeTypeNameFromTypeId(t, discountCodeDetail) {
  let discountCodeTypeName = "";
  ListPromotionType?.map((item) => {
    let discountType =
      discountCodeDetail?.discountCodeTypeId !== undefined
        ? discountCodeDetail?.discountCodeTypeId
        : discountCodeDetail?.promotionTypeId;
    if (item.key === discountType) {
      discountCodeTypeName = t(item.name);
    }
  });
  return discountCodeTypeName;
}
