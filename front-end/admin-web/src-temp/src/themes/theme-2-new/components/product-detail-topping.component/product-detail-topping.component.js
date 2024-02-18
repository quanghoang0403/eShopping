import { Button, Col, Row } from "antd";
import { formatTextNumber } from "../../../utils/helpers";
import "./product-detail-topping.component.scss";

function checkPrice(value) {
  const checkNum = Number.isInteger(value);
  if (checkNum) {
    return value;
  }
  else {
    return value?.toFixed(2);
  }
}

export function ProductDetailToppingComponent(props) {
  const {
    topping,
    updateQuantityTopping,
    maximumQuantityCustom,
    isStyleHorizontal = false,
    iconPlus,
    iconMinus,
    maximumLimit,
    quantityProduct,
  } = props;
  let maximumQuantity = maximumQuantityCustom ?? 99;
  return (
    <>
      {isStyleHorizontal ? (
        <div className="group-product-topping-item topping-horizontal">
          <div className="topping-name">
            <span className="name">{topping?.name}</span>
            <Row>
              {
                ((topping?.priceValue !== topping?.originalPrice ||
                  (topping?.priceValueInMaxDiscount !== topping?.originalPrice && topping.priceValueInMaxDiscount !== undefined))
                  && topping?.priceValue !== undefined
                  && topping?.originalPrice !== undefined) &&
                <Col>
                  <span className="topping-original-price-value">{formatTextNumber(checkPrice(topping?.originalPrice))}đ</span>
                </Col>
              }
              <Col>
                <span className="topping-price-value">
                  {formatTextNumber(checkPrice(topping.priceValueInMaxDiscount === undefined ? topping?.priceValue : topping.priceValueInMaxDiscount))}đ
                </span>
              </Col>
            </Row>
          </div>
          <div className="topping-change-quantity">
            <div
              className={`topping-quantity-btn-decrease ${topping?.quantity <= 0 && "display-none"}`}
              onClick={() =>
                updateQuantityTopping(-1, quantityProduct > maximumLimit && maximumLimit > 0 ? topping?.originalPrice : topping?.priceValue)
              }
            >
              {iconMinus}
            </div>
            <span className="topping-quantity-value" hidden={topping?.quantity <= 0}>
              {topping?.quantity}
            </span>
            <div
              className="topping-quantity-btn-increase"
              onClick={() =>
                updateQuantityTopping(1, quantityProduct > maximumLimit && maximumLimit > 0 ? topping?.originalPrice : topping?.priceValue)
              }
              aria-disabled={topping?.quantity >= 999}
            >
              {iconPlus}
            </div>
          </div>
        </div>
      ) : (
        <Row className="topping-item topping-horizontal topping-vertical">
          <Col span={12} xs={13} sm={14} className="style-text-customize">
            <span className="topping-name">{topping?.name}</span>
            <br />
            <p className="topping-price">
              {formatTextNumber(quantityProduct > maximumLimit ? topping?.originalPrice : topping?.priceValue)}đ
            </p>
          </Col>
          <Col span={8} xs={11} sm={10} className="modify-quantity">
            {topping?.quantity < maximumQuantity ? (
              <Button
                icon={iconPlus}
                className="btn-increase"
                onClick={() =>
                  updateQuantityTopping(
                    -1,
                    quantityProduct > maximumLimit ? topping?.originalPrice : topping?.priceValue
                  )
                }
              ></Button>
            ) : (
              <Button icon={iconPlus} className="btn-increase" disabled></Button>
            )}
            <span className="quantity-product">{topping?.quantity}</span>
            {topping?.quantity > 0 ? (
              <Button
                icon={iconMinus}
                className="btn-reduce"
                onClick={() =>
                  updateQuantityTopping(
                    1,
                    quantityProduct > maximumLimit ? topping?.originalPrice : topping?.priceValue
                  )
                }
              ></Button>
            ) : (
              <Button icon={iconMinus} className="btn-reduce d-none"></Button>
            )}
          </Col>
        </Row>
      )}
    </>
  );
}
