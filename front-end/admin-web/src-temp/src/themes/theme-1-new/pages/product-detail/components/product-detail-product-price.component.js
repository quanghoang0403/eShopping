import { Radio } from "antd";
import React from "react";
import { formatTextNumber } from "../../../../utils/helpers";
import "./product-detail-product-price.component.scss";

export default function ProductDetailProductPriceComponent(props) {
  const { productPrices, productPriceDefault, onChange } = props;
  return (
    <Radio.Group className="group" defaultValue={productPriceDefault} size="large" onChange={(e) => onChange(e)}>
      {productPrices.map((productPrice) => (
        <Radio.Button className="radio-option" value={productPrice}>
          <div className="group-price">
            <span>{productPrice?.priceName}</span>
            <p className="radio-option-price">{formatTextNumber(productPrice?.priceValue)}đ</p>
          </div>
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}
