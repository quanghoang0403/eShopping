import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { formatTextNumber } from "../../../../utils/helpers";
import "./checkout-taxes.scss";
export default function CheckOutTaxes(props) {
  const { fontFamily } = props;
  const { t } = useTranslation();
  const pageData = {
    tax: t("orderDetail.taxText", "Tax"),
    vat: t("checkOutPage.vat", "VAT"),
    fee: t("orderDetail.feeText", "Fee"),
  };
  const taxes = useSelector((state) => state?.session?.orderInfo?.cartValidated?.taxes ?? []);
  const fees = useSelector((state) => state?.session?.orderInfo?.cartValidated?.fees ?? []);
  const renderTaxes = taxes
    ?.filter((tax) => tax?.value > 0)
    ?.sort((a, b) => (a.name > b.name ? 1 : -1))
    ?.map((tax) => {
      return (
        <>
          <div className="taxItem">
            <div className="taxName">{tax?.name}</div>
            <div className="taxAmount">{formatTextNumber(tax?.value)} đ</div>
          </div>
        </>
      );
    });

  const renderFees = fees
    ?.filter((fee) => fee?.value > 0)
    ?.sort((a, b) => (a.name > b.name ? 1 : -1))
    ?.map((fee) => {
      return (
        <>
          <div className="taxItem">
            <div className="taxName">{fee?.name}</div>
            <div className="taxAmount">
              {fee?.isPercentage === true
                ? formatTextNumber((fee?.value * props?.originalPrice) / 100)
                : formatTextNumber(fee?.value)}{" "}
              đ
            </div>
          </div>
        </>
      );
    });

  return (
    <div style={{ fontFamily: fontFamily }}>
      {fees.some((fee) => fee.value > 0) ? (
        <div className="checkout-taxes-theme2">
          <div className="taxTitle">{pageData.fee}</div>
          <div className="taxList">{renderFees}</div>
        </div>
      ) : (
        ""
      )}
      {taxes.some((tax) => tax.value > 0) ? (
        <div className="checkout-taxes-theme2">
          <div className="taxTitle">{pageData.tax}</div>
          <div className="taxList">{renderTaxes}</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
