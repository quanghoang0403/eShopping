import { DiscountAmount } from "../../components/discount-amount/discount-amount.component";
import { EnumPromotionSummary } from "../../constants/enums";
import "./discount-code-popover.scss";
export default function DiscountPopoverComponent({ discount, promotionType }) {
  if (!discount || ![EnumPromotionSummary.DiscountCode, EnumPromotionSummary.Discount].includes(promotionType)) {
    return <></>;
  }

  return (
    <div className="discount-item-popover">
      <div className="name">
        {promotionType === EnumPromotionSummary.DiscountCode ? (
          <div className="discount-code-popover">
            <div className="discount-code-name">{discount?.promotionCode}</div>
          </div>
        ) : (
          <>
            {discount?.promotionName} {discount?.percentNumber > 0 && `(${discount?.percentNumber} %)`}
          </>
        )}
      </div>
      <div className="amount">
        <DiscountAmount value={discount?.promotionValue ?? discount?.maximunDiscountValue} />
      </div>
    </div>
  );
}
