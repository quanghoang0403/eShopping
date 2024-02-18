import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { formatTextCurrency, formatTextNumber, roundNumber } from "../../../../utils/helpers";
import { DiscountAmount } from "../../../components/discount-amount/discount-amount.component";
import DiscountPopoverComponent from "../../../components/discount-code-card/discount-code-popover.component";
import { PercentValue } from "../../../components/percent-value/percent-value.component";
import { EnumPromotionSummary } from "../../../constants/enums";
import { mockupDiscounts } from "../default-data";
import "./checkout-discounts.scss";
export default function CheckOutDiscounts(props) {
  //true: read data from mockup -> for customize & preview page
  const { isMockup } = props;
  const customerDiscountAmount = useSelector((state) =>
    roundNumber(state?.session?.orderInfo.cartValidated?.customerDiscountAmount ?? 0, 2),
  );
  const customerMemberShipLevel = useSelector(
    (state) => state?.session?.orderInfo.cartValidated?.customerMemberShipLevel ?? 0,
  );
  const customerMemberShipDiscount = useSelector(
    (state) => state?.session?.orderInfo.cartValidated?.customerMemberShipDiscount ?? 0,
  );
  let discounts = useSelector((state) => state?.session?.orderInfo?.cartValidated?.promotionsSummary ?? []);
  const calculateCustomerLoyaltyPoint = useSelector(
    (state) => state?.session?.orderInfo?.cartValidated?.calculateCustomerLoyaltyPoint,
  );

  const cartItems = useSelector((state) => state?.session?.orderInfo?.cartValidated?.cartItems) ?? [];

  if (isMockup) discounts = mockupDiscounts;
  const { t } = useTranslation();
  const pageData = {
    discount: t("checkOutPage.discount", "Discount"),
    customerMemberShip: t("checkOutPage.customerMemberShip", "Customer Membership"),
    rank: t("myProfile.myOrders.rank", "Hạng thành viên"),
    pointsUppercase: t("loyaltyPoint.pointsUppercase", "Điểm"),
    used: t("loyaltyPoint.used", "Sử dụng"),
    points: t("loyaltyPoint.points", "điểm"),
    flashSale: t("checkOutPage.flashSale", "Flash sale"),
    combo: t("checkOutPage.combo", "Combo"),
    discountCode: t("checkOutPage.discountCode", "Discount code"),
    promotion: t("checkOutPage.promotion", "Promotion"),
  };

  const renderPromotionList = (promotionType, title) => {
    const filteredDiscounts = discounts?.filter((x) => x?.promotionType === promotionType);

    return (
      filteredDiscounts?.length > 0 && (
        <div>
          {<div className="title">{title}</div>}
          <div className="discountList">
            {filteredDiscounts?.map((discount) => (
              <DiscountPopoverComponent key={discount?.id} discount={discount} promotionType={promotionType} />
            ))}
          </div>
        </div>
      )
    );
  };

  const renderDiscountCode = () => {
    return renderPromotionList(EnumPromotionSummary.DiscountCode, pageData.discountCode);
  };

  const renderPromotions = () => {
    return renderPromotionList(EnumPromotionSummary.Discount, pageData.promotion);
  };

  const renderLoyaltyPoint = () => {
    return (
      <>
        {/* Loyalty point */}
        {calculateCustomerLoyaltyPoint && calculateCustomerLoyaltyPoint?.pointUsed > 0 && (
          <div className="loyaltyPointItem">
            <p className="title-text">{pageData.pointsUppercase}</p>
            <div className="line"></div>
            <div className="loyaltyPointDetail">
              <div className="text-name">
                {pageData.used}
                <span className="text-point">{formatTextNumber(calculateCustomerLoyaltyPoint?.pointUsed)}</span>
                {pageData.points}
              </div>
              <div className="text-amount">
                -{formatTextCurrency(calculateCustomerLoyaltyPoint?.pricePointUsed ?? 0)}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="checkout-discounts-theme1">
        {renderDiscountCode()}
        {renderPromotions()}

        {customerDiscountAmount > 0 && (
          <div className="customerDiscount">
            <div className="title">{pageData?.rank}</div>
            <div className="detail">
              <div className="name">
                {customerMemberShipLevel} (<PercentValue value={customerMemberShipDiscount} />)
              </div>
              <div className="customerDiscountAmount">
                <DiscountAmount value={customerDiscountAmount} />
              </div>
            </div>
          </div>
        )}

        {renderLoyaltyPoint()}
      </div>
    </>
  );
}
