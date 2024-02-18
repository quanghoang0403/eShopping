import { Radio } from "antd";
import React, { useState } from "react";
import { checkNonEmptyArray } from "../../../utils/helpers";
import { RadioNotSelectedIcon, RadioSelectedIcon } from "../../assets/icons.constants";
import "./RadioGroupTypeRadioComponent.scss";

function RadioGroupTypeRadioComponent(props) {
  const { className, data = [], onChange, defaultValue } = props;
  const [value, setValue] = useState(defaultValue);
  if (!checkNonEmptyArray(data)) {
    return <></>;
  }

  function handleChangeValue(e) {
    setValue(e?.target?.value);

    if (onChange) {
      onChange(e);
    }
  }
  return (
    <Radio.Group
      className={`radio-group--type-radio ${className}`}
      onChange={(e) => handleChangeValue(e)}
      defaultValue={defaultValue}
    >
      {data?.map((item) => {
        return (
          <Radio value={item?.id} className="radio-item">
            <span className="name">{item?.name}</span>
            {item?.id === value ? (
              <RadioSelectedIcon className="icon-selected" />
            ) : (
              <RadioNotSelectedIcon className="icon" />
            )}
          </Radio>
        );
      })}
    </Radio.Group>
  );
}

export default React.memo(RadioGroupTypeRadioComponent, (prevProps, nextProps) => prevProps === nextProps);
