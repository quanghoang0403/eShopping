import { Form, InputNumber, Radio } from "antd";
import { useSelector } from "react-redux";
import { checkOnKeyPressValidation } from "utils/helpers";
import "./fnb-input-discount.component.scss";

export function FnbInputDiscount({
  id,
  max,
  min,
  isPercentage,
  className,
  onChange,
  onChangeOption,
  placeholder,
  value,
}) {
  const state = useSelector((state) => state);
  const { storeInfo } = state?.session;
  let currencyCode = storeInfo?.currencyCode?.toString().toUpperCase();

  if (!currencyCode || currencyCode === null || currencyCode.trim() === "") {
    currencyCode = "VND";
  }

  return (
    <InputNumber
      id={id}
      value={value}
      onChange={onChange}
      max={max}
      min={min}
      placeholder={placeholder}
      className={`fnb-input-discount w-100 ${className}`}
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
      addonAfter={
        <Form.Item name={"isPercentage"} style={{ display: "contents" }}>
          <Radio.Group className="radio-group-discount" defaultValue={isPercentage} onChange={onChangeOption}>
            <Radio.Button value={true} className="percent-option">
              {"%"}
            </Radio.Button>
            <Radio.Button value={false} className="currency-option">
              {currencyCode}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      }
      onKeyPress={(event) => {
        const checkStatus = checkOnKeyPressValidation(event, id, min, max, isPercentage === true ? 0 : 2);
        if (!checkStatus) event.preventDefault();
      }}
    />
  );
}
