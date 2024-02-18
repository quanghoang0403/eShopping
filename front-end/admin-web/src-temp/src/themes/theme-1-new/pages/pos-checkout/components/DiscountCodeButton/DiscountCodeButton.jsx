import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowRightWhite } from "../../../../assets/icons.constants";
import discountPercentImage from "../../../../assets/images/discount-percent.png";
import "./DiscountCodeButton.scss";

function DiscountCodeButton(props) {
  const { onClick, isBeingApplied = false, className } = props;
  const [t] = useTranslation();
  const pageData = {
    useDiscountMessage: t("checkOutPage.useDiscountMessage", "Sử dụng giảm giá"),
    discountHasBeenApplied: t("checkOutPage.discountHasBeenApplied", "Đã áp dụng giảm giá"),
  };
  function handleOnClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <div onClick={handleOnClick} className={`discount-code-button ${className}`}>
      <img className="icon-use-discount" alt="" src={discountPercentImage} />
      <div className="text">{isBeingApplied ? pageData.discountHasBeenApplied : pageData.useDiscountMessage}</div>
      <div className="icon-arrow">
        <ArrowRightWhite className="icon-arrow-right" />
      </div>
    </div>
  );
}

export default DiscountCodeButton;
