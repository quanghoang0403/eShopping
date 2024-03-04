import React, { useEffect, useState } from 'react'
import { Select, Row, Col } from 'antd'
import { ArrowDown, CheckedIcon, PlusOrangeIcon } from 'constants/icons.constants'
import { useTranslation } from 'react-i18next'
import './select-edit-new-item.scss'

const { Option } = Select

export default function SelectEditComponent (props) {
  const {
    placeholder,
    listOption,
    onChangeOption,
    addNewItem,
    isNameExisted,
    name,
    isEditProduct,
    className,
    allowClear,
    showSearch,
    onSearch,
    onSelect,
    fixed
  } = props
  const { t } = useTranslation()
  const [value, setValue] = useState(null)

  const pageData = {
    add: t('button:add')
  }

  useEffect(() => {
    if (isEditProduct) {
      props.functions.current = setValue
    }
  }, [])

  const orderListByKey = (data, key, order) => {
    const compareValues = (key, order = 'asc') => (elemA, elemB) => {
      if (!elemA.hasOwnProperty(key) || !elemB.hasOwnProperty(key)) return 0
      const comparison = elemA[key].localeCompare(elemB[key])
      return order === 'desc' ? comparison * -1 : comparison
    }
    return data.sort(compareValues(key, order))
  }

  return (
    <Select
      getPopupContainer={fixed ? null : (trigger) => trigger.parentNode}
      value={value}
      autoBlur={false}
      showSearch={showSearch}
      allowClear={allowClear}
      suffixIcon={<ArrowDown />}
      menuItemSelectedIcon={<CheckedIcon />}
      className={`w-100 shop-select-single ${className}`}
      onChange={onChangeOption}
      onSearch={onSearch}
      onSelect={onSelect}
      placeholder={placeholder}
      dropdownClassName="shop-select-single-dropdown"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().removeVietnamese().indexOf(input.toLowerCase().removeVietnamese()) >= 0
      }
      dropdownRender={(menu) => (
        <>
          <Row align="middle" justify="center">
            {(name && !isNameExisted) &&
              <Col span={24}>
                <Row align="middle" justify="center">
                  <div className="add-new-select w-100"
                    onClick={addNewItem}>
                    <PlusOrangeIcon className="icon-btn-add-new-select" />
                    <div className="keyword-add">
                      {`  ${pageData.add} "`}
                      <span style={{ fontWeight: 'bold' }}>{name}</span>
                      {'"'}
                    </div>
                  </div>
                </Row>
              </Col>
            }
            <Col span={24}>
              {menu}
            </Col>
          </Row>
        </>
      )}
    >
      {orderListByKey(listOption, 'name').map((item) => (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      ))}
    </Select>
  )
}
