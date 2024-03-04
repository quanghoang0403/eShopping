import React, { useEffect, useState } from 'react'
import { Card, Radio, Form } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { FnbSelectSingle } from 'components/fnb-select-single/fnb-select-single'
import { useTranslation } from 'react-i18next'
import { setStorage, localStorageKeys } from 'utils/localStorage.helpers'
import { FnbSelectSingleOptGroup } from 'components/fnb-select-single-opt-group/fnb-select-single-opt-group'
import './index.scss'

export default function FilterOrderReport (props) {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const { serviceTypes, paymentMethods, customers, orderStatus, onShowFilter, className } =
    props
  const defaultValue = ''
  const [showResetAllFilters, SetShowResetAllFilters] = useState(false)

  // #region PageData
  const pageData = {
    serviceType: t('reportRevenue.serviceType'),
    paymentMethod: t('report.shift.paymentMethod'),
    customer: t('table.customer'),
    status: t('table.status'),
    filter: {
      resetAllFilters: t('productManagement.filter.resetallfilters')
    },
    allTypes: t('order.allTypes'),
    allMethods: t('order.allMethods'),
    allCustomer: t('order.allCustomer'),
    allStatus: t('order.allStatus'),
    all: t('order.all'),
    enterprise: t('order.enterprise'),
    personal: t('order.personal')
  }
  // #endregion

  useEffect(() => {
    props.tableFuncs.current = onResetForm
  }, [])

  const onApplyFilter = () => {
    const formValue = form.getFieldsValue()
    formValue.count = countFilterControl(formValue)
    if (formValue.count > 0) {
      SetShowResetAllFilters(true)
    }
    setStorage(localStorageKeys.ORDER_REPORT_FILTER, JSON.stringify(formValue))
    props.fetchDataOrderReport(formValue)
  }

  const countFilterControl = (formValue) => {
    const countServiceType =
      formValue.serviceTypeId === '' || formValue.serviceTypeId === undefined
        ? 0
        : 1

    const countPaymentMethod =
      formValue.paymentMethodId === '' ||
        formValue.paymentMethodId === undefined
        ? 0
        : 1
    const countCustomer =
      formValue.customerId === '' || formValue.customerId === undefined ? 0 : 1

    const countStatus =
      formValue.orderStatusId === '' || formValue.orderStatusId === undefined
        ? 0
        : 1

    return countServiceType + countPaymentMethod + countCustomer + countStatus
  }

  const onResetForm = () => {
    SetShowResetAllFilters(false)
    form?.resetFields()
    onApplyFilter()
    if (onShowFilter) {
      onShowFilter(false)
    }
  }

  return (
    <Form form={form} onFieldsChange={onApplyFilter} className={className}>
      <Card className="form-filter-popover">
        <div className="rectangle"></div>
        <div className="filter-popover-row">
          <div className="first-column">
            <span>{pageData.serviceType}</span>
          </div>
          <div className="second-column">
            <Form.Item name="serviceTypeId">
              <FnbSelectSingle
                placeholder={pageData.allTypes}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={serviceTypes}
              />
            </Form.Item>
          </div>
        </div>
        <div className="filter-popover-row">
          <div className="first-column">
            <span>{pageData.paymentMethod}</span>
          </div>
          <div className="second-column">
            <Form.Item name="paymentMethodId">
              <FnbSelectSingleOptGroup
                className="payment-group item-input"
                popupClassName="payment-group-dropdown"
                placeholder={pageData.allMethods}
                optionGroup={paymentMethods?.map((item) => ({
                  id: item.id,
                  name: item.name,
                  group: item.type === paymentMethodType.All
                    ? ''
                    : (item.type === paymentMethodType.Enterprise ? pageData.enterprise : pageData.personal)
                }))}
                showSearch
                defaultValue={defaultValue}
              />
            </Form.Item>
          </div>
        </div>
        <div className="filter-popover-row">
          <div className="first-column">
            <span>{pageData.customer}</span>
          </div>
          <div className="second-column">
            <Form.Item name="customerId">
              <FnbSelectSingle
                placeholder={pageData.allCustomer}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={customers}
              />
            </Form.Item>
          </div>
        </div>
        <div className="filter-popover-row">
          <div className="first-column">
            <span>{pageData.status}</span>
          </div>
          <div className="second-column">
            <Form.Item name="orderStatusId">
              <FnbSelectSingle
                placeholder={pageData.allStatus}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={orderStatus}
              />
            </Form.Item>
          </div>
        </div>
        <div className={`clear-filter-container clear-filter-text ${showResetAllFilters ? '' : 'clear-filter-text-disable'}`}>
          <div onClick={() => onResetForm()}>
            {pageData.filter.resetAllFilters}
          </div>
        </div>
      </Card>
    </Form>
  )
}
