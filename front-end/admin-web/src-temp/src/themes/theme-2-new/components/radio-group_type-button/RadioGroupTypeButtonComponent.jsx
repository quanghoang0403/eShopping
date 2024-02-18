import { Radio } from "antd";
import React from "react";
import { checkNonEmptyArray, formatTextCurrency } from "../../../utils/helpers";
import "./RadioGroupTypeButtonComponent.scss";

function RadioGroupTypeButtonComponent(props) {
  const { className, data = [], onChange, value } = props;

  if (!checkNonEmptyArray(data)) {
    return <></>;
  }

  return (
    <Radio.Group className={`radio-group--type-button ${className}`} onChange={onChange} value={value}>
      {data?.map((item) => {
        return (
          <Radio value={item?.id} className="radio-item--button">
            <div className="radio-item">
              <div className="radio-content">
                <span className="name">{item?.priceName}</span>
                <span className="value">{formatTextCurrency(item?.priceValue)}</span>
              </div>
            </div>
          </Radio>
        );
      })}
    </Radio.Group>
  );
}

export default React.memo(RadioGroupTypeButtonComponent, (prevProps, nextProps) => prevProps === nextProps);
