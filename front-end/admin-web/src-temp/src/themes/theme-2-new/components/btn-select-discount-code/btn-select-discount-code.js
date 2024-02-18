import { Row } from "antd";
import React from "react";
import { DiscountCodePrefixIcon, DiscountCodeSuffixIcon } from "../../assets/icons.constants";
import "./btn-select-discount-code.scss";

export default function BtnSelectDiscountCode(props) {
  const {
    title = "Use Offers to get discounts",
    prefixIcon = <DiscountCodePrefixIcon />,
    suffixIcon = <DiscountCodeSuffixIcon />,
    onClick,
    isApply,
  } = props;

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Row
      className={`btn-select-discount-code ${isApply ? "btn-select-discount-code-apply" : ""}`}
      onClick={handleOnClick}
    >
      <div className="prefix-icon">{prefixIcon}</div>
      <div className="title">{title}</div>
      <div className="suffix-icon">{suffixIcon}</div>
    </Row>
  );
}
