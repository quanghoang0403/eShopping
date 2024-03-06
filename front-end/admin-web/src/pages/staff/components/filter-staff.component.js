import React, { useEffect } from 'react'
import { Card, Row, Form } from 'antd'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { useTranslation } from 'react-i18next'
import '../staff.page.scss'

export default function FilterStaff (props) {
  const { groupPermissions, onShowFilter } = props

  const [t] = useTranslation()
  const [form] = Form.useForm()
  const defaultValue = ''

  useEffect(() => {
    form.setFieldsValue({ permissionId: '' })
    props.tableFuncs.current = onResetForm
  }, [])

  const onResetForm = () => {
    form?.resetFields()
    onApplyFilter()
    onShowFilter(false)
  }

  // #region PageData
  const pageData = {
    filter: {
      button: t('button.filter'),
      resetData: t('button.resetData'),
      permission: {
        title: t('table.permissionFilterTitle'),
        all: t('table.permissionFilterAll'),
        placeholder: t('table.permissionFilterPlaceholder')
      }
    }
  }
  // #endregion

  const onApplyFilter = () => {
    const formValue = form.getFieldsValue()
    formValue.count = countFilterControl(formValue)

    props.fetchDataProducts(formValue)
  }

  const countFilterControl = (formValue) => {
    const countPermission =
      formValue?.permissionId === '' || formValue?.permissionId === undefined ? 0 : 1

    return countPermission
  }

  const onResetFilter = () => {
    const formData = { permissionId: '', count: 0 }
    form.setFieldsValue(formData)
    props.fetchDataProducts(formData)
    props?.onShowFilter(false)
  }

  return (
    <Form form={form} onFieldsChange={onApplyFilter}>
      <Card className="staff-form-filter-popover">
        <Row>
          <div className="staff-first-column">
            <span>{pageData.filter.permission.title}</span>
          </div>
          <div className="staff-second-column">
            <Form.Item name="permissionId">
              <FnbSelectSingle
                placeholder={pageData.filter.permission.placeholder}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={groupPermissions}
              />
            </Form.Item>
          </div>
        </Row>
        <Row className="row-reset-filter">
          <a onClick={onResetFilter} className="reset-filter">
            {pageData.filter.resetData}
          </a>
        </Row>
      </Card>
    </Form>
  )
}
