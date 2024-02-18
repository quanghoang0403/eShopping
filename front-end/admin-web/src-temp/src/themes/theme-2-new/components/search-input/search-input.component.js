import { Input } from "antd";
import React from "react";
import "./search-input.component.scss";

export default function SearchInputComponent(props) {
  const {
    className,
    onChange,
    suffix = null,
    maxLength = 100,
    placeholder = "",
    isInstore,
    pleaseEnterDiscountCode = "",
    fontFamily,
  } = props;
  return (
    <div style={{ fontFamily: fontFamily }}>
      {isInstore && <div className="title-discount-code">{pleaseEnterDiscountCode}</div>}
      <Input
        className={`search-input ${className}`}
        suffix={suffix}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e)}
        style={{ fontFamily: fontFamily }}
      />
    </div>
  );
}
