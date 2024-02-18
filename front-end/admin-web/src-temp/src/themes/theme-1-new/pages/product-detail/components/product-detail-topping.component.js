import { Button, Col, Row } from "antd";
import React from "react";
import styled from "styled-components";
import { formatTextNumber } from "../../../../utils/helpers";
import { MinusOutlined, PlusOutlined } from "../../../assets/icons.constants";
import "./product-detail-topping.component.scss";

function checkPrice(value) {
  const checkNum = Number.isInteger(value);
  if (checkNum) {
    return value;
  } else {
    return value?.toFixed(2);
  }
}

export function ProductDetailToppingComponent(props) {
  const { topping, updateQuantityTopping, maximumQuantityCustom, maximumLimit, quantityProduct, colorGroup } = props;
  let maximumQuantity = maximumQuantityCustom ?? 99;
  const StyledButtonPlusTopping = styled.div`
    svg rect {
      fill: ${colorGroup?.buttonBackgroundColor};
    }
  `;

  return (
    <Row className="topping-item">
      <Col span={19} xs={17} sm={17} md={17} lg={17} xl={19} xxl={19} className="style-text-customize">
        <div className="text-one-line">
          <span className="topping-name">{topping?.name}</span>
          <div className="align-right">
            <div>
              {(topping?.priceValue < topping?.originalPrice ||
                (topping?.priceValueInMaxDiscount !== topping?.originalPrice &&
                  topping?.priceValueInMaxDiscount !== undefined)) &&
                topping?.priceValue !== undefined &&
                topping?.originalPrice !== undefined && (
                  <p className="topping-original-price">{formatTextNumber(checkPrice(topping?.originalPrice))}đ</p>
                )}
            </div>
            <div>
              <p className="topping-price">
                +
                {topping.priceValueInMaxDiscount === undefined
                  ? formatTextNumber(checkPrice(topping?.priceValue))
                  : formatTextNumber(checkPrice(topping?.priceValueInMaxDiscount))}
                đ
              </p>
            </div>
          </div>
        </div>
      </Col>
      <Col span={5} xs={7} sm={7} md={7} lg={7} xl={5} xxl={5} className="modify-quantity-topping">
        <div className={`group-topping ${topping?.quantity > 0 ? "active" : ""}`}>
          {topping?.quantity < maximumQuantity ? (
            <Button
              icon={<PlusOutlined />}
              className="btn-increase"
              onClick={() =>
                updateQuantityTopping(
                  1,
                  quantityProduct > maximumLimit || maximumLimit === undefined
                    ? topping?.originalPrice ?? topping?.priceValue
                    : topping?.priceValue,
                )
              }
            ></Button>
          ) : (
            <Button icon={<PlusOutlined />} className="btn-increase" disabled></Button>
          )}
          <span className="quantity-product">{topping?.quantity > 0 ? topping?.quantity : 0}</span>
          {topping?.quantity > 0 ? (
            <Button
              icon={<MinusOutlined />}
              className="btn-reduce"
              onClick={() =>
                updateQuantityTopping(
                  -1,
                  quantityProduct > maximumLimit || maximumLimit === undefined
                    ? topping?.originalPrice ?? topping?.priceValue
                    : topping?.priceValue,
                )
              }
            ></Button>
          ) : (
            <Button icon={<MinusOutlined />} className="btn-reduce"></Button>
          )}
        </div>
      </Col>
    </Row>
  );
}
