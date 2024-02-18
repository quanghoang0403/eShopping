import { Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, CheckedIcon } from "../../assets/icons.constants";
import { HYPERLINK_SELECT_OPTION } from "../../constants/hyperlink.constants";

import "./fnb-select-hyperlink.scss";

export function FnbSelectHyperlink(props) {
  const [t] = useTranslation();
  const [hyperlinkOption, setHyperlinkOption] = useState(HYPERLINK_SELECT_OPTION);
  const {
    value,
    onChange,
    className,
    disabled,
    allowClear,
    showSearch,
    placeholder,
    dropdownRender,
    style,
    defaultValue,
    onSelect,
    fixed,
    option,
    listHeight,
  } = props;

  useEffect(() => {
    if (option) {
      setHyperlinkOption(option);
    }
  }, []);

  return (
    <>
      <Select
        getPopupContainer={fixed ? null : (trigger) => trigger.parentNode}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        style={style}
        className={`fnb-select-hyperlink ${className}`}
        popupClassName="fnb-select-hyperlink-dropdown"
        suffixIcon={<ArrowDown />}
        menuItemSelectedIcon={<CheckedIcon />}
        disabled={disabled}
        showSearch={showSearch}
        allowClear={allowClear}
        placeholder={placeholder}
        dropdownRender={dropdownRender}
        optionFilterProp="children"
        listHeight={listHeight}
        showArrow
        filterOption={(input, option) => {
          const newOption = t(option?.name);
          const inputStr = input.removeVietnamese();
          const hyperlink = newOption?.removeVietnamese();
          return hyperlink?.trim().toLowerCase().indexOf(inputStr.trim().toLowerCase()) >= 0;
        }}
      >
        {hyperlinkOption?.map((item) => (
          <Select.Option key={item.id} value={item.id} name={item?.name}>
            <div className="hyperlink-option">
              <div className="icon">{item.icon}</div>
              <div className="text-name">{t(item.name)}</div>
            </div>
          </Select.Option>
        ))}
      </Select>
    </>
  );
}
