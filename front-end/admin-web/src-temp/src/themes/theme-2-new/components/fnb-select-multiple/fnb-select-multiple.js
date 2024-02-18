import { Select } from "antd";
import { useTranslation } from "react-i18next";
import { ArrowDown, CheckboxCheckedIcon } from "../../assets/icons.constants";
import "./fnb-select-multiple.scss";

/**
 * SelectMultiple component custom from antd select
 * @param {option, onChange, className, value, disabled, allowClear, showSearch, placeholder, dropdownRender, style, defaultValue } props
 * option: data select option [], map data [{id: "key", name: "value"}] first
 * other param are used as same as antd select, visit link https://ant.design/components/select/
 * @returns
 */
export function FnbSelectMultiple(props) {
  const {
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
  } = props;

  const [t] = useTranslation();

  return (
    <>
      <Select
        getPopupContainer={fixed ? null : (trigger) => trigger.parentNode}
        mode="multiple"
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        style={style}
        className={`fnb-select-multiple ${className}`}
        popupClassName="fnb-select-multiple-dropdown"
        suffixIcon={<ArrowDown />}
        menuItemSelectedIcon={<CheckboxCheckedIcon />}
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
