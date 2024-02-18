import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { posDiscountCodesSelector } from "../../../../../modules/order/order.reducers";
import { cartValidatedSelector } from "../../../../../modules/session/session.reducers";
import posCartService from "../../../../../services/pos/pos-cart.services";
import { formatTextCurrency } from "../../../../../utils/helpers";
import { DiscountCodeIcon, RemoveDiscountCodeIcon } from "../../../../assets/icons.constants";
import NameAndValuePopover from "../../../../components/name-and-value-popup/NameAndValuePopover";
import "./SummaryComponent.scss";

function SummaryComponent() {
  const [t] = useTranslation();
  const cartValidated = useSelector(cartValidatedSelector);
  const discountCodes = useSelector(posDiscountCodesSelector);
  const pageData = {
    summary: t("checkOutPage.summary", "Summary"),
    subTotal: t("checkOutPage.subTotal", "Subtotal"),
    discount: t("checkOutPage.discount", "Discount"),
    feeAndTax: t("checkOutPage.feeAndTax", "Fee & Tax"),
    total: t("checkOutPage.total", "Total"),
    rank: t("myProfile.myOrders.rank", "Hạng thành viên"),
    tax: t("checkOutPage.tax", "Tax"),
  };

  const {
    totalFee = 0,
    totalTax = 0,
    originalPrice = 0,
    totalDiscountAmount = 0,
    totalPriceAfterDiscount = 0,
  } = cartValidated;

  const totalFeeAndTax = totalFee + totalTax;

  function handleRemoveDiscountCode(discountCode) {
    posCartService.removeDiscountCode(discountCode);
  }

  return (
    <div className="pos-checkout-summary">
      <div className="title">{pageData.summary}</div>
      <div className="content">
        <div className="line">
          <div span={16}>{pageData.subTotal}</div>
          <div span={8}>{formatTextCurrency(originalPrice)}</div>
        </div>
        <div className="line">
          <div span={16}>
            {pageData.discount}
            {totalDiscountAmount > 0 && (
              <div className="show-detail-icon">
                <NameAndValuePopover
                  className="discount-popover"
                  data={posCartService.mappingCartValidatedToPromotionPopupData(cartValidated)}
                />
              </div>
            )}
          </div>
          <div span={8}>{formatTextCurrency(-totalDiscountAmount)}</div>
        </div>
        {discountCodes?.map((discountCode) => (
          <div className="line">
            <div className="discount-code-tag">
              <span className="discount-code-background"></span>
              <div className="prefix">
                <DiscountCodeIcon />
              </div>
              <div className="discount-code">{discountCode}</div>
              <div className="remove-icon" onClick={() => handleRemoveDiscountCode(discountCode)}>
                <RemoveDiscountCodeIcon />
              </div>
            </div>
          </div>
        ))}
        <div className="line">
          <div span={16}>
            {pageData.feeAndTax}
            {totalFeeAndTax > 0 && (
              <div className="show-detail-icon">
                <NameAndValuePopover
                  className="fee-and-tax-popover"
                  placement={"topRight"}
                  data={posCartService.mappingCartValidatedToFeeAndTaxPopupData(cartValidated)}
                />
              </div>
            )}
          </div>
          <div span={8}>{formatTextCurrency(totalFeeAndTax)}</div>
        </div>
      </div>
      <div className="total">
        <div className="line">
          <div span={16}> {pageData.total}</div>
          <div span={8}>{formatTextCurrency(totalPriceAfterDiscount + totalFeeAndTax)}</div>
        </div>
      </div>
    </div>
  );
}

export default SummaryComponent;
