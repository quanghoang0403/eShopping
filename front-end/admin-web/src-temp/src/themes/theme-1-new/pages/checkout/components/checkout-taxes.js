import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { formatTextNumber } from "../../../../utils/helpers";
import { mockupTaxes } from "../default-data";
import "./checkout-taxes.scss";
export default function CheckOutTaxes(props) {
  const { isMockup } = props;
  const { t } = useTranslation();
  const pageData = {
    tax: t("checkOutPage.tax", "Tax"),
    vat: t("checkOutPage.vat", "VAT"),
  };
  let taxes = useSelector((state) => state?.session?.orderInfo?.cartValidated?.taxes ?? []);
  if (isMockup) {
    taxes = mockupTaxes;
  }
  const renderTaxes = taxes
    ?.filter((tax) => tax?.value > 0)
    ?.sort((a, b) => (a.name > b.name ? 1 : -1))
    ?.map((tax) => {
      return (
        <>
          <div className="taxItem">
            <div className="vat">{tax?.name}</div>
            <div className="amount">{formatTextNumber(tax?.value)} đ</div>
          </div>
        </>
      );
    });

  return (
    <>
      {taxes.some((tax) => tax.value > 0) ? (
        <div className="checkout-taxes-theme1">
          <div className="title">{pageData.tax}</div>
          <div className="taxList">{renderTaxes}</div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
