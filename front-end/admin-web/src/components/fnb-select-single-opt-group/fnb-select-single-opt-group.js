import { Select, Row, Col, Tooltip } from 'antd'
import { ArrowDown, CheckedIcon } from 'constants/icons.constants'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

import './fnb-select-single-opt-group.scss'

/**
 * SelectSingle component custom from antd select
 * @param {option, value, onChange, className, disabled, allowClear, showSearch, placeholder, dropdownRender, style, defaultValue } props
 * option: data select option [], map data [{id: "key", name: "value"}] first
 * other param are used as same as antd select, visit link https://ant.design/components/select/
 * @returns
 */

export function FnbSelectSingleOptGroup ({
  value,
  onChange,
  className,
  popupClassName,
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
  noTranslateOptionName,
  onPopupScroll,
  onFocus,
  onBlur,
  onSearch,
  onClear,
  optionGroup,
  suffixIcon
}) {
  const isScreenXL = useMediaQuery({ maxWidth: 1200 })
  const [t] = useTranslation()
  const groupNameMap = {}
  optionGroup.forEach((item) => {
    const group = item.group
    if (group in groupNameMap) {
      groupNameMap[group].push(item)
    } else {
      groupNameMap[group] = [item]
    }
  })

  const optionGroups = Object.keys(groupNameMap).map((group) => (
    <Select.OptGroup label={group || 'all'} key={group || 'all'}>
      {groupNameMap[group].map((item) => (
        <Select.Option key={item.id} value={item.id} name={item.name}>
          {item.name.length > 22 && !isScreenXL
            ? (
            <Tooltip placement="top" title={noTranslateOptionName ? item.name : t(item.name)}>
              {noTranslateOptionName ? item.name : t(item.name)}
            </Tooltip>
              )
            : noTranslateOptionName
              ? (
                  item.name
                )
              : (
                  t(item.name)
                )}
        </Select.Option>
      ))}
    </Select.OptGroup>
  ))

  return (
    <>
      <Select
        getPopupContainer={fixed ? null : (trigger) => trigger.parentNode}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        style={style}
        className={`fnb-select-single-opt-group ${className}`}
        popupClassName={`fnb-select-single-opt-group-dropdown ${popupClassName}`}
        suffixIcon={suffixIcon || <ArrowDown />}
        menuItemSelectedIcon={<CheckedIcon />}
        disabled={disabled}
        showSearch={showSearch}
        allowClear={allowClear}
        placeholder={placeholder}
        dropdownRender={dropdownRender}
        optionFilterProp="children"
        showArrow
        filterOption={(input, option) => {
          const newOption = t(option?.name)
          const inputStr = input.removeVietnamese()
          const name = newOption?.removeVietnamese()
          return name?.trim().toLowerCase().indexOf(inputStr.trim().toLowerCase()) >= 0
        }}
        onPopupScroll={onPopupScroll}
        onFocus={onFocus}
        onBlur={onBlur}
        onSearch={onSearch}
        onClear={onClear}
      >
        {optionGroups}
      </Select>
    </>
  )
}
