import { Select } from "antd";
import { useTranslation } from "react-i18next";
import { ArrowDown, CheckedIcon } from "../../assets/icons.constants";

import "./fnb-select-single.scss";

/**
 * SelectSingle component custom from antd select
 * @param {option, value, onChange, className, disabled, allowClear, showSearch, placeholder, dropdownRender, style, defaultValue } props
 * option: data select option [], map data [{id: "key", name: "value"}] first
 * other param are used as same as antd select, visit link https://ant.design/components/select/
 * @returns
 */

export function FnbSelectSingle({
  value,
  onChange,
  className,
  option,
  disabled,
  allowClear,
  showSearch,
  placeholder,
  dropdownRender,
  style,
  defaultValue,
  onSelect,
  fixed,
  controlId,
}) {
  const [t] = useTranslation();
  return (
    <>
      <Select
        getPopupContainer={fixed ? null : (trigger) => trigger.parentNode}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        style={style}
        className={`fnb-select-single ${className}`}
        popupClassName="fnb-select-single-dropdown"
        suffixIcon={<ArrowDown />}
        menuItemSelectedIcon={<CheckedIcon />}
        disabled={disabled}
        showSearch={showSearch}
        allowClear={allowClear}
        placeholder={placeholder}
        dropdownRender={dropdownRender}
        optionFilterProp="children"
        showArrow
        filterOption={(input, option) => {
          const newOption = t(option?.name);
          const inputStr = input.removeVietnamese();
          const name = newOption?.removeVietnamese();
          return name?.trim().toLowerCase().indexOf(inputStr.trim().toLowerCase()) >= 0;
        }}
      >
        {option?.map((item) => (
          <Select.Option key={item.id} value={item.id} name={item?.name}>
            {t(item?.name)}
          </Select.Option>
        ))}
      </Select>
    </>
  );
}
