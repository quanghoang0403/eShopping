import { Radio } from "antd";
import "./product-detail-option.component.scss";

export function ProductDetailOptionComponent(props) {
  const { option, defaultValue, onChangeOptions, iconPrefix, isStyleHorizontal = false } = props;
  return (
    <>
      {isStyleHorizontal ? (
        <div className="group-product-option-item radio-option-horizontal">
          <span className="option-name">{option?.name}</span>
          <Radio.Group
            className="option-level-value"
            defaultValue={defaultValue}
            buttonStyle="solid"
            onChange={(e) => {
              onChangeOptions(e);
            }}
          >
            {option?.optionLevels.map((optionLevel) => {
              return (
                <Radio.Button className="option-level-value-item" value={optionLevel}>
                  <div className="container-radio-option">
                    {iconPrefix && defaultValue?.id === optionLevel?.id && <span className={iconPrefix}>.</span>}
                    {optionLevel?.name}
                  </div>
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
      ) : (
        <Radio.Group
          defaultValue={defaultValue}
          size="large"
          onChange={(e) => onChangeOptions(e)}
          className="radio-option-vertical"
        >
          {option?.optionLevels?.map((optionLevel) => (
            <Radio.Button className="radio-option" value={optionLevel}>
              {optionLevel?.name}
            </Radio.Button>
          ))}
        </Radio.Group>
      )}
    </>
  );
}
