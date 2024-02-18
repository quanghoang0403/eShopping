import React from "react";
import { DecreaseQuantityIcon, IncreaseQuantityIcon } from "../../assets/icons.constants";
import { maximumQuantity } from "../../constants/string.constant";
import "./ChangeQuantityComponent.scss";

export const changeQuantityComponentSize = {
  Small: "small",
  Medium: "medium",
};

function ChangeQuantityComponent(props) {
  const {
    size = changeQuantityComponentSize.Medium,
    className,
    quantity,
    onDecreaseQuantity,
    onIncreaseQuantity,
    disableDecreaseQuantity = false,
    disableIncreaseQuantity = false,
  } = props;

  let classNameDecrease = `btn btn-decrease ${disableDecreaseQuantity && "btn-disable"}`;
  let classNameIncrease = `btn btn-increase ${disableIncreaseQuantity && "btn-disable"}`;

  function handleDecreaseQuantity() {
    if (onDecreaseQuantity && !disableDecreaseQuantity) {
      onDecreaseQuantity();
    }
  }

  function handleIncreaseQuantity() {
    if (onIncreaseQuantity && !disableIncreaseQuantity) {
      onIncreaseQuantity();
    }
  }

  return (
    <div className={`change-quantity change-quantity-${size} ${className}`}>
      <div className={classNameDecrease} hidden={quantity <= 0} onClick={handleDecreaseQuantity}>
        <DecreaseQuantityIcon />
      </div>
      {quantity > 0 && <span className="quantity">{quantity}</span>}
      <div className={classNameIncrease} hidden={quantity >= maximumQuantity} onClick={handleIncreaseQuantity}>
        <IncreaseQuantityIcon />
      </div>
    </div>
  );
}

export default React.memo(ChangeQuantityComponent, (prevProps, nextProps) => prevProps === nextProps);
