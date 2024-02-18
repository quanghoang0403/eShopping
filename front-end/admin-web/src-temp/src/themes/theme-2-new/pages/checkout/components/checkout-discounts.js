import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { formatTextCurrency } from "../../../../utils/helpers";
import { Ellipse } from "../../../assets/icons.constants";
import DiscountPopoverComponent from "../../../components/discount-code-common-component/discount-code-popover.component";
import { EnumPromotionSummary } from "../../../constants/enums";
import "./checkout-discounts.scss";
export default function CheckOutDiscounts(props) {
  const discounts = useSelector((state) => state?.session?.orderInfo.cartValidated?.promotionsSummary ?? []);
  const customerDiscountAmount = useSelector(
    (state) => state?.session?.orderInfo.cartValidated?.customerDiscountAmount ?? 0,
  );
  const customerMemberShipLevel = useSelector(
    (state) => state?.session?.orderInfo.cartValidated?.customerMemberShipLevel ?? 0,
  );
  const customerMemberShipDiscount = useSelector(
    (state) => state?.session?.orderInfo.cartValidated?.customerMemberShipDiscount ?? 0,
  );
  const calculateCustomerLoyaltyPoint = useSelector(
    (state) => state?.session?.orderInfo?.cartValidated?.calculateCustomerLoyaltyPoint,
  );

  const cartItems = useSelector((state) => state?.session?.orderInfo?.cartValidated?.cartItems) ?? [];

  const { t } = useTranslation();
  const pageData = {
    promotion: t("checkOutPage.promotion", "Promotion"),
    discountCode: t("promotion.discountCode.title", "Discount Code"),
    customerMemberShip: t("checkOutPage.customerMemberShip", "Hạng thành viên"),
    points: t("checkOutPage.availablePoint.Points", "Điểm"),
    use: t("checkOutPage.availablePoint.use", "Dùng"),
    point: t("checkOutPage.availablePoint.point", "điểm"),
    flashSale: t("checkOutPage.flashSale", "Flash sale"),
    combo: t("checkOutPage.combo", "Combo"),
  };

  const renderPromotionList = (promotionType, title) => {
    const filteredDiscounts = discounts?.filter((x) => x?.promotionType === promotionType);

    return (
      <>
        {filteredDiscounts?.length > 0 && <div className="promotionTitle">{title}</div>}
        <div className="discountList">
          {filteredDiscounts?.map((discount) => (
            <DiscountPopoverComponent key={discount?.id} discount={discount} promotionType={promotionType} />
          ))}
        </div>
      </>
    );
  };

  const renderDiscountCode = () => {
    return renderPromotionList(EnumPromotionSummary.DiscountCode, pageData.discountCode);
  };

  const renderPromotions = () => {
    return renderPromotionList(EnumPromotionSummary.Discount, pageData.promotion);
  };

  return (
    <>
      <div className="checkout-discounts-theme2">
        {renderDiscountCode()}
        {renderPromotions()}

        {customerDiscountAmount > 0 && (
          <div className="customerDiscount">
            <div className="promotionTitle">{pageData.customerMemberShip}</div>
            <ul>
              <li style={{ marginLeft: "32px", fontSize: "20px" }}>
                <div className="detail">
                  <div className="discountName">
                    {customerMemberShipLevel + " (" + customerMemberShipDiscount + "%)"}
                  </div>
                  <div className="discountAmount">-{formatTextCurrency(customerDiscountAmount)}</div>
                </div>
              </li>
            </ul>
          </div>
        )}

        {!props?.isPos && calculateCustomerLoyaltyPoint && calculateCustomerLoyaltyPoint?.pointUsed > 0 && (
          <>
            <div className="promotionTitle">{pageData.points}</div>
            <div className="discountList">
              {/* Loyalty point */}
              <div className="discountItem">
                <div className="name">
                  <Ellipse className="discountItem-ellipse" />
                  {pageData.use}{" "}
                  <span className="discountItem-loyaltyPoint">{calculateCustomerLoyaltyPoint?.pointUsed}</span>{" "}
                  {pageData.point}
                </div>
                <div className="amount">-{formatTextCurrency(calculateCustomerLoyaltyPoint?.pricePointUsed ?? 0)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
