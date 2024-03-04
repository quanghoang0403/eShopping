import { CheckOutlined } from '@ant-design/icons'
import { Card, Form, Radio, Row } from 'antd'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { useEffect, useState } from 'react'
import { isJsonString } from 'utils/helpers'
import { getStorage, localStorageKeys, setStorage } from 'utils/localStorage.helpers'
import '../index.scss'
import { useTranslation } from 'react-i18next'
export default function FilterProduct (props) {
  const [form] = Form.useForm()
  const { categories, onShowFilter, pageSize, keySearch, setDataFilter } = props
  const defaultValue = ''
  const [resetFilter, setResetFilter] = useState(false)
  const { t } = useTranslation()
  const pageData = {
    filter: {
      category: {
        title: t('table:categoryFilterTitle'),
        all: t('table:categoryFilterAll'),
        placeholder: t('table:categoryFilterPlaceholder')
      },
      status: {
        title: t('table:statusFilterTitle'),
        all: t('table:statusFilterAll'),
        active: t('table:statusFilterActive'),
        inactive: t('table:statusFilterInactive')
      },
      resetAllFilters: t('table:resetAllFilters')
    }
  }

  useEffect(() => {
    props.tableFuncs.current = onResetForm
    const sessionProductFilter = getStorage(localStorageKeys.PRODUCT_FILTER)
    if (isJsonString(sessionProductFilter)) {
      const productFilter = JSON.parse(sessionProductFilter)
      if (productFilter && productFilter.count > 0) {
        form.setFieldsValue(productFilter)
      }
    }
  }, [])

  const onApplyFilter = () => {
    const formValue = form.getFieldsValue()
    formValue.count = countFilterControl(formValue)
    setStorage(localStorageKeys.PRODUCT_FILTER, JSON.stringify(formValue))
    props.fetchDataProducts(formValue, 1, pageSize, keySearch)
    setDataFilter(formValue)
    setResetFilter(!(formValue.count < 1))
  }

  const countFilterControl = (formValue) => {
    const countCategory = formValue.productCategoryId === '' || formValue.productCategoryId === undefined ? 0 : 1
    const countStatus = formValue.statusId === '' || formValue.statusId === undefined ? 0 : 1
    return countCategory + countStatus
  }

  const onResetForm = () => {
    form?.resetFields()
    onApplyFilter()
    if (onShowFilter) {
      onShowFilter(false)
    }
  }

  return (
    <Form form={form} onFieldsChange={onApplyFilter} className="product-filter">
      <Card className="form-filter-popover">

        <Row>
          <div className="first-column">
            <span>{pageData.filter.category.title}</span>
          </div>

          <div className="second-column">
            <Form.Item name="productCategoryId">
              <FnbSelectSingle
                placeholder={pageData.filter.category.placeholder}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={categories}
              />
            </Form.Item>
          </div>
        </Row>
        <Row>
          <div className="first-column">
            <span>{pageData.filter.status.title}</span>
          </div>

          <div className="second-column">
            <Form.Item name="statusId">
              <Radio.Group defaultValue={defaultValue} buttonStyle="solid">
                <Radio.Button value={defaultValue}>
                  <CheckOutlined className="check-icon" /> {pageData.filter.status.all}
                </Radio.Button>
                <Radio.Button value={1}>
                  <CheckOutlined className="check-icon" /> {pageData.filter.status.active}
                </Radio.Button>
                <Radio.Button value={0}>
                  <CheckOutlined className="check-icon" /> {pageData.filter.status.inactive}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
        </Row>

        <Row className="row-reset-filter">
          <a
            onClick={() => onResetForm()}
            className="reset-filter"
            aria-current={!resetFilter && 'inventory-history-filter'}
          >
            {pageData.filter.resetAllFilters}
          </a>
        </Row>
      </Card>
    </Form>
  )
}
