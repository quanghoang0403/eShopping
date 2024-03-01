import { Image, Select } from 'antd'
import { ArrowDown, SelectCheckedIcon } from 'constants/icons.constants'
import { images } from 'constants/images.constants'
import './fnb-select-multiple-product.scss'

/**
 * SelectMultiple component custom from antd select
 * @param {option, onChange, className, value, disabled, allowClear, showSearch, placeholder, dropdownRender, style, defaultValue } props
 * option: data select option [], map data [{id: "key", name: "value"}] first
 * other param are used as same as antd select, visit link https://ant.design/components/select/
 * @returns
 */
export function FnbSelectMultipleProduct (props) {
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
    listHeight
  } = props

  return (
    <>
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        mode="multiple"
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        style={style}
        className={`fnb-select-multiple-product ${className}`}
        dropdownClassName="fnb-select-multiple-product-dropdown"
        suffixIcon={<ArrowDown />}
        menuItemSelectedIcon={<SelectCheckedIcon />}
        disabled={disabled}
        showSearch={showSearch}
        allowClear={allowClear}
        placeholder={placeholder}
        listHeight={listHeight}
        dropdownRender={dropdownRender}
        optionFilterProp="children"
        optionLabelProp="label"
        showArrow
        filterOption={(input, option) => {
          const inputStr = input.removeVietnamese()
          const productName = option?.name?.removeVietnamese()
          return productName?.trim().toLowerCase().indexOf(inputStr.trim().toLowerCase()) >= 0
        }}
      >
        {option?.map((item) => (
          <Select.Option key={item?.id} value={item?.id} label={item?.name} name={item?.name}>
            <div className="product-option-box">
              <div className="img-box">
                <Image preview={false} src={item?.thumbnail ?? 'error'} fallback={images.productDefault} />
              </div>
              <span className="product-name">{item?.name}</span>
            </div>
          </Select.Option>
        ))}
      </Select>
    </>
  )
}
