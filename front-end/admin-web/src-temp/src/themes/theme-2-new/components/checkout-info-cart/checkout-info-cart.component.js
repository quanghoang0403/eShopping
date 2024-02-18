import { Card } from "antd";
import React from "react";
import "./checkout-info-cart.component.scss";

function CheckoutInfoCard(props) {
  const { title, className } = props;
  const { configuration, colorGroups } = props;
  const colorGroup = colorGroups?.find((c) => c.id === configuration?.colorGroupId);
  const renderChildren = () => {
    return React.Children.map(props.children, (child) => {
      return React.cloneElement(child, {
        ...props,
      });
    });
  };

  return (
    <div className="checkout-info-cart">
      <Card headStyle={{color: colorGroup?.titleColor}} className={className} title={title}>
        {renderChildren()}
      </Card>
    </div>
  );
}

export default CheckoutInfoCard;
//ant-card-head
