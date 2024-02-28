import { CheckOutlined } from '@ant-design/icons'
import { Card, Form, Radio, Row } from 'antd'
import { FnbSelectSingle } from 'components/fnb-select-single/fnb-select-single'
import { useEffect, useState } from 'react'
import { isJsonString } from 'utils/helpers'
import { getStorage, localStorageKeys, setStorage } from 'utils/localStorage.helpers'
import '../index.scss'
export default function FilterProduct (props) {
  const [form] = Form.useForm()
  const { categories, onShowFilter, pageSize, keySearch, setDataFilter } = props
  const defaultValue = ''
  const [resetFilter, setResetFilter] = useState(false)

  const pageData = {
    filter: {
      button: 'Xóa bộ lọc',
      category: {
        title: 'Danh mục',
        all: 'Tất cả danh mục',
        placeholder: 'Chọn danh mục'
      },
      status: {
        title: 'Trạng thái',
        all: 'Tất cả',
        active: 'Đang hoạt động',
        inactive: 'Không hoạt động'
      },
      resetallfilters: 'Đặt lại tất cả các bộ lọc'
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
            {pageData.filter.resetallfilters}
          </a>
        </Row>
      </Card>
    </Form>
  )
}
