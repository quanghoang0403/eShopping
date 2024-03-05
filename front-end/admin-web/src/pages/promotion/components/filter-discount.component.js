import { CheckOutlined } from '@ant-design/icons'
import { Card, Col, DatePicker, Form, InputNumber, Radio, Row } from 'antd'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { inputNumberRange1To999999999 } from 'constants/default.constants'
import { CalendarNewIconBold } from 'constants/icons.constants'
import { DateFormat } from 'constants/string.constants'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { getCurrency } from 'utils/helpers'
import './filter-discount.component.scss'

export default function FilterDiscount (props) {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const { promotionTypeOptions, pageSize, keySearch, setDataFilter } = props
  const defaultValue = ''
  const [resetFilter, setResetFilter] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedValueType, setSelectedValueType] = useState('')
  const isMobileMode = useMediaQuery({ maxWidth: 575 })

  const pageData = {
    filter: {
      startDate: t('report.startDate'),
      endDate: t('report.endDate'),
      resetAllFilters: t('table:resetAllFilters'),
      button: t('button.clear'),
      status: {
        all: t('promotion:allStatus'),
        title: t('promotion:titleStatus'),
        active: t('promotion:active'),
        scheduled: t('promotion:scheduled'),
        finished: t('promotion:finished')
      },
      applicableType: t('promotion:applicableType'),
      valueType: t('promotion:valueType'),
      amount: t('promotion:amount'),
      minimumPurchaseOnBill: t('promotion:minimumPurchaseOnBill'),
      fromAmount: t('promotion:fromAmount'),
      toAmount: t('promotion:toAmount'),
      toAmountValidate: t('promotion:toAmountValidate'),
      amountValidateMessage: t('product:validatePrice')
    }
  }

  useEffect(() => {
    props.tableFuncs.current = onResetForm
  }, [])

  const onApplyFilter = () => {
    const fieldsErrors = form.getFieldsError()
    const isFormValid = fieldsErrors.find((item) => item?.errors?.length > 0)

    if (!isFormValid) {
      const formValue = form.getFieldsValue()
      formValue.count = countFilterControl(formValue)
      setDataFilter(formValue)
      setResetFilter(!(formValue.count < 1))
      props.fetchDataDiscount(1, pageSize, keySearch, formValue)
    }
  }

  const countFilterControl = (formValue) => {
    const checkStartDate = moment(formValue.startDate, 'YYYY-MM-DD').isValid()
    const checkEndDate = moment(formValue.endDate, 'YYYY-MM-DD').isValid()

    const countStatus = formValue.statusId === '' || formValue.statusId === undefined ? 0 : 1

    const countApplicableType = formValue.applicableType === '' || formValue.applicableType === undefined ? 0 : 1

    const countValueType = formValue.valueType === '' || formValue.valueType === undefined ? 0 : 1

    const countStartDate = formValue.startDate === '' || formValue.startDate === undefined || !checkStartDate ? 0 : 1

    const countEndDate = formValue.endDate === '' || formValue.endDate === undefined || !checkEndDate ? 0 : 1

    const countMinMinimumPurchaseOnBill =
      formValue.minMinimumPurchaseOnBill === '' ||
      formValue.minMinimumPurchaseOnBill === undefined ||
      formValue.minMinimumPurchaseOnBill === null
        ? 0
        : 1

    const countMaxMinimumPurchaseOnBill =
      formValue.maxMinimumPurchaseOnBill === '' ||
      formValue.maxMinimumPurchaseOnBill === undefined ||
      formValue.maxMinimumPurchaseOnBill === null
        ? 0
        : 1

    return (
      countValueType +
      countStatus +
      countStartDate +
      countEndDate +
      countMinMinimumPurchaseOnBill +
      countMaxMinimumPurchaseOnBill +
      countApplicableType
    )
  }

  const onResetForm = () => {
    form?.resetFields()
    onApplyFilter()
  }

  const onChangeStatus = (id) => {
    setSelectedStatus(id)
  }

  const onChangeValueType = (id) => {
    setSelectedValueType(id)
  }

  const disabledDateByStartDate = (current) => {
    // Can not select days before today and today
    return current && current < startDate
  }

  return (
    <Form form={form} onFieldsChange={onApplyFilter}>
      <Card className="discount-filter-scroll">
        <div className="discount-filter">
          <Card className="form-filter-discount-popover ">
            <Row style={{ alignItems: 'center', marginTop: '-12px' }}>
              <div className="first-column" style={isMobileMode ? { marginBottom: '-5px' } : { marginBottom: '0px' }}>
                <span>{pageData.filter.status.title}</span>
              </div>
              <div className="second-column">
                <Form.Item name="statusId">
                  <Radio.Group
                    value={selectedStatus}
                    defaultValue={defaultValue}
                    buttonStyle="solid"
                    onChange={(e) => onChangeStatus(e.target.value)}
                  >
                    <Radio.Button value={defaultValue}>
                      {selectedStatus === '' && <CheckOutlined className="check-icon" />} {pageData.filter.status.all}
                    </Radio.Button>
                    <Radio.Button value={2}>
                      {selectedStatus === 2 && <CheckOutlined className="check-icon" />} {pageData.filter.status.active}
                    </Radio.Button>
                    <Radio.Button value={1}>
                      {selectedStatus === 1 && <CheckOutlined className="check-icon" />}{' '}
                      {pageData.filter.status.scheduled}
                    </Radio.Button>
                    <Radio.Button value={3}>
                      {selectedStatus === 3 && <CheckOutlined className="check-icon" />}{' '}
                      {pageData.filter.status.finished}
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Row>

            <Row style={{ alignItems: 'center' }}>
              <div className="first-column">
                <span>{pageData.filter.applicableType}</span>
              </div>

              <div className="second-column">
                <Form.Item name="applicableType">
                  <FnbSelectSingle
                    className="form-select"
                    showSearch
                    defaultValue={defaultValue}
                    option={promotionTypeOptions}
                  />
                </Form.Item>
              </div>
            </Row>

            <Row style={{ alignItems: 'center', marginTop: '-12px' }}>
              <div className="first-column" style={isMobileMode ? { marginBottom: '-5px' } : { marginBottom: '0px' }}>
                <span>{pageData.filter.valueType}</span>
              </div>
              <div className="second-column">
                <Form.Item name="valueType">
                  <Radio.Group
                    value={selectedValueType}
                    defaultValue={defaultValue}
                    buttonStyle="solid"
                    onChange={(e) => onChangeValueType(e.target.value)}
                  >
                    <Radio.Button value={defaultValue}>
                      {selectedValueType === '' && <CheckOutlined className="check-icon" />}{' '}
                      {pageData.filter.status.all}
                    </Radio.Button>
                    <Radio.Button value={1}>
                      {selectedValueType === 1 && <CheckOutlined className="check-icon" />} {'%'}
                    </Radio.Button>
                    <Radio.Button value={2}>
                      {selectedValueType === 2 && <CheckOutlined className="check-icon" />} {pageData.filter.amount}
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Row>

            <Row style={{ alignItems: 'center' }}>
              <div className="first-column">
                <span>{pageData.filter.startDate}</span>
              </div>
              <div className="second-column">
                <Form.Item name="startDate">
                  <DatePicker
                    suffixIcon={<CalendarNewIconBold />}
                    placeholder={DateFormat.DD_MM_YYYY_DASH.toLowerCase()}
                    className="shop-date-picker w-100"
                    disabledDate={false}
                    format={DateFormat.DD_MM_YYYY_DASH}
                    onChange={(date) => {
                      setStartDate(date)

                      // Clear end date after select start date if endate < startdate only
                      const formValues = form.getFieldsValue()
                      if (formValues?.endDate != null && formValues?.endDate < date) {
                        form.setFieldsValue({
                          ...formValues,
                          startDate: null,
                          endDate: null
                        })
                      }
                    }}
                  />
                </Form.Item>
              </div>
            </Row>

            <Row style={{ alignItems: 'center' }}>
              <div className="first-column">
                <span>{pageData.filter.endDate}</span>
              </div>
              <div className="second-column">
                <Form.Item name="endDate">
                  <DatePicker
                    suffixIcon={<CalendarNewIconBold />}
                    placeholder={DateFormat.DD_MM_YYYY_DASH.toLowerCase()}
                    className="shop-date-picker w-100"
                    format={DateFormat.DD_MM_YYYY_DASH}
                    disabledDate={disabledDateByStartDate}
                  />
                </Form.Item>
              </div>
            </Row>

            <Row style={{ alignItems: 'center' }}>
              <div className="first-column">
                <span>{pageData.filter.minimumPurchaseOnBill}</span>
              </div>
              <div className="second-column">
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="minMinimumPurchaseOnBill"
                      rules={[
                        {
                          pattern: new RegExp(inputNumberRange1To999999999.range),
                          message: pageData.filter.amountValidateMessage
                        }
                      ]}
                    >
                      <InputNumber
                        className="w-100 shop-input-number"
                        placeholder={pageData.filter.fromAmount}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault()
                          }
                        }}
                        addonAfter={getCurrency()}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2} className="icon-between-date ">
                    {'-'}
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      name="maxMinimumPurchaseOnBill"
                      rules={[
                        {
                          pattern: new RegExp(inputNumberRange1To999999999.range),
                          message: pageData.filter.amountValidateMessage
                        },
                        () => ({
                          validator (_, value) {
                            const formValue = form.getFieldsValue()

                            if (
                              (value && value <= formValue?.minMinimumPurchaseOnBill) ||
                              (value === 0 && formValue?.minMinimumPurchaseOnBill >= 0)
                            ) {
                              return Promise.reject(
                                `${pageData.filter.toAmountValidate} ${formValue?.minMinimumPurchaseOnBill?.toLocaleString() || 0}`
                              )
                            }
                            return Promise.resolve()
                          }
                        })
                      ]}
                    >
                      <InputNumber
                        className="w-100 shop-input-number"
                        placeholder={pageData.filter.toAmount}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        addonAfter={getCurrency()}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault()
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Row>
          </Card>
        </div>
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
