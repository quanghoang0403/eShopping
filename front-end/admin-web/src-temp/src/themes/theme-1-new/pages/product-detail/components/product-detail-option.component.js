import { Radio } from "antd";
import React from "react";
import "./product-detail-option.component.scss";

export function ProductDetailOptionComponent(props) {
  const { option, defaultValue, onChangeOptions } = props;

  return (
    <Radio.Group className="group" defaultValue={defaultValue} size="large" onChange={(e) => onChangeOptions(e)}>
      {option?.optionLevels?.map((optionLevel) => (
        <Radio.Button className="radio-option" value={optionLevel}>
          {optionLevel?.name}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}
