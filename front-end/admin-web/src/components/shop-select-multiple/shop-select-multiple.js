import React, { useState } from 'react'
import { ArrowDown, CheckboxCheckedIcon } from 'constants/icons.constants'
import { Select } from 'antd'
import './shop-select-multiple.scss'

/**
 * SelectMultiple component custom from antd select
 * @param {option, onChange, className, value, disabled, allowClear, showSearch, placeholder, dropdownRender, style, defaultValue } props
 * option: data select option [], map data [{id: "key", name: "value"}] first
 * other param are used as same as antd select, visit link https://ant.design/components/select/
 * @returns
 */
export function FnbSelectMultiple (props) {
  const [keywordFilter, setKeywordFilter] = useState()

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
    placement,
    onFocus,
    onBlur
  } = props

  const compareStringsByKeyword = (strA, strB, keyword) => {
    const lowerStrA = strA.toLowerCase()
    const lowerStrB = strB.toLowerCase()
    const lowerKeyword = keyword?.toLowerCase()

    const indexA = lowerStrA.indexOf(lowerKeyword)
    const indexB = lowerStrB.indexOf(lowerKeyword)

    if (indexA === -1 && indexB !== -1) return 1
    if (indexB === -1 && indexA !== -1) return -1

    return indexA - indexB
  }

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
        className={`shop-select-multiple ${className}`}
        dropdownClassName="shop-select-multiple-dropdown"
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
          setKeywordFilter(input)
          const inputValue = input.toLowerCase().removeVietnamese()
          const optionValue = option.children.toLowerCase().removeVietnamese()
          return optionValue.includes(inputValue)
        }}
        filterSort={(obA, obB) => {
          if (keywordFilter) {
            return compareStringsByKeyword(obA.children, obB.children, keywordFilter)
          }
        }}
        placement={placement}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {option?.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </>
  )
}
