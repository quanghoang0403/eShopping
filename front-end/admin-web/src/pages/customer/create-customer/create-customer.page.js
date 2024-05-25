import { Card, Col, DatePicker, Form, Input, message, Radio, Row, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import PageTitle from 'components/page-title'
import { CustomerGenderConstant } from 'constants/customer.constant'
import { DELAYED_TIME } from 'constants/default.constants'
import { CalendarNewIcon } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import customerDataService from 'data-services/customer/customer-data.service'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { getValidationMessages } from 'utils/helpers'
import './create-customer.page.scss'
import AddressDataService from 'data-services/address/address-data.service'

export default function CreateCustomerPage(props) {
  const [t] = useTranslation()
  const history = useHistory()
  const pageData = {
    btnCancel: t('button.cancel'),
    btnSave: t('button.add'),
    btnDiscard: t('button.discard'),
    title: t('customer.titleAddNew'),
    generalInformation: t('customer.titleInfo'),
    customerAddSuccess: t('customer.customerAddSuccess'),
    name: t('customer.name'),
    phone: t('customer.phone'),
    address: t('customer.address'),
    email: t('customer.email'),
    birthday: t('customer.birthday'),
    gender: t('customer.gender'),
    male: t('customer.male'),
    female: t('customer.female'),
    other: t('customer.other'),

    namePlaceholder: t('customer.namePlaceholder'),
    emailPlaceholder: t('customer.emailPlaceholder'),
    phonePlaceholder: t('customer.phonePlaceholder'),
    addressPlaceholder: t('customer.addressPlaceholder'),
    birthdayPlaceholder: t('customer.birthdayPlaceholder'),

    nameValidation: t('customer.nameValidation'),
    phoneValidation: t('customer.phoneValidation'),
    emailValidation: t('customer.emailValidation'),
    emailInvalidEmail: t('customer.emailInvalidEmail'),

    allowNumberOnly: t('form.allowNumberOnly'),
    validPhonePattern: t('form.validPhonePattern'),
    city: t('form.city'),
    district: t('form.district'),
    ward: t('form.ward'),
    selectCity: t('form.inputCity'),
    selectDistrict: t('form.selectDistrict'),
    validDistrict: t('form.validDistrict'),
    selectWard: t('form.selectWard'),
    labelAddress: t('form.address'),
    inputAddress: t('form.inputAddress'),
    validAddress: t('form.validAddress'),
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
    }
  }

  const [form] = Form.useForm()
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [genderSelected, setGenderSelected] = useState(CustomerGenderConstant.Male)
  const [address, setAddress] = useState('')
  const [cities, setCities] = useState([])
  const [wardsByDistrictId, setWardsByDistrictId] = useState([])
  const [districtsByCityId, setDistrictsByCityId] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    // Call API
    getCitiesInfo();
  }, [])
  const getCitiesInfo = async () => {
    const cities = await AddressDataService.getAllCitiesAsync();
    if (cities) {
      setCities(cities)
    }
  }
  const getWardsInfo = async districtId => {
    const wards = await AddressDataService.getWardsByDistrictId(districtId);
    if (wards) {
      setWardsByDistrictId(wards)
    }
  }
  const getDistrictsInfo = async cityId => {
    const districts = await AddressDataService.getDistrictsByCityId(cityId)
    if (districts) {
      setDistrictsByCityId(districts)
    }
  }
  const clickCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      navigateToManagementPage()
    }
  }

  const onFinish = async () => {
    form.validateFields().then(async (values) => {
      const dataSave = {
        ...values,
        birthDay: values.birthDay ? moment.utc(values.birthDay).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2) : null,
      }
      customerDataService
        .createCustomerAsync(dataSave)
        .then((res) => {
          if (res) {
            setIsChangeForm(false)
            // navigate to management list
            navigateToManagementPage()
            message.success(pageData.customerAddSuccess)
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessages(errs))
        })
    })
  }

  const onGenderChange = (e) => {
    setGenderSelected(e.target.value)
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const navigateToManagementPage = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      return history.push('/customer')
    }, DELAYED_TIME)
  }

  const onChangeCity = async (cityId) => {
    await getDistrictsInfo(cityId)

    const formValue = form.getFieldsValue()
    // formValue.address.districtId = null
    // formValue.address.wardId = null
    formValue.districtId = null
    formValue.wardId = null
    form.setFieldsValue(formValue)
  }

  const onChangeDistrict = async (districtId) => {
    await getWardsInfo(districtId)

    const formValue = form.getFieldsValue()
    // formValue.address.wardId = null
    formValue.wardId = null
    form.setFieldsValue(formValue)
  }

  const renderAddress = () => {
    return (
      <>
        <Row gutter={[25, 25]} className="form-row">
          <Col sm={24} md={24} className="w-100">
            <h4 className="shop-form-label">{pageData.address}</h4>
            <Form.Item className="form-create-customer" name={['address']}>
              <Input className="shop-input" size="large" placeholder={pageData.addressPlaceholder} maxLength={255} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[25, 25]} className="form-row">
          <Col sm={24} md={8} className="w-100">
            <h4 className="shop-form-label">{pageData.city}</h4>
            <Form.Item name={['cityId']} className="last-item">
              <FnbSelectSingle
                size="large"
                placeholder={pageData.selectCity}
                onChange={onChangeCity}
                showSearch
                autoComplete="none"
                option={cities?.map((item, index) => ({
                  id: item.id,
                  name: item.name
                }))}
              />
            </Form.Item>
          </Col>
          <Col sm={24} md={8} className="w-100">
            <h4 className="shop-form-label">{pageData.district}</h4>
            <Form.Item name={['districtId']} className="last-item">
              <FnbSelectSingle
                size="large"
                placeholder={pageData.selectDistrict}
                onChange={onChangeDistrict}
                showSearch
                autoComplete="none"
                option={districtsByCityId?.map((item, index) => ({
                  id: item.id,
                  name: item.name
                }))}
              />
            </Form.Item>
          </Col>
          <Col sm={24} md={8} className="w-100">
            <h4 className="shop-form-label">{pageData.ward}</h4>
            <Form.Item name={['wardId']} className="last-item">
              <FnbSelectSingle
                size="large"
                placeholder={pageData.selectWard}
                showSearch
                option={wardsByDistrictId?.map((item, index) => ({
                  id: item.id,
                  name: item.name
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.leaveDialog.confirmLeave}
        onCancel={onDiscard}
        onOk={navigateToManagementPage}
        isChangeForm={isChangeForm}
      />
      <Row className="shop-row-page-header">
        <Space className="page-title">
          <PageTitle content={pageData.title} />
        </Space>
        <ActionButtonGroup
          arrayButton={[
            {
              action: <ShopAddNewButton onClick={onFinish} className="btn-add" text={pageData.btnSave} />,
              permission: PermissionKeys.CREATE_CUSTOMER
            },
            {
              action: (
                <p className="shop-text-action-group mr-3 action-cancel" onClick={clickCancel}>
                  {pageData.btnCancel}
                </p>
              ),
              permission: null
            }
          ]}
        />
      </Row>

      <div className="clearfix"></div>
      <Form
        autoComplete="off"
        name="basic"
        labelCol={{
          span: 8
        }}
        wrapperCol={{
          span: 24
        }}
        onFieldsChange={() => {
          if (!isChangeForm) setIsChangeForm(true)
        }}
        form={form}
      >
        <Content>
          <Card className="shop-card">
            <Row>
              <Col span={24}>
                <h5 className="title-group">{pageData.generalInformation}</h5>
              </Col>
            </Row>
            <Row style={{ display: 'grid' }}>
              <Row gutter={[25, 25]} className="form-row">
                <Col sm={24} md={8} className="w-100">
                  <h4 className="shop-form-label">
                    {pageData.name} <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    className="last-item"
                    name={'fullName'}
                    rules={[
                      {
                        required: true,
                        message: pageData.nameValidation,
                        validator: (_, value) => (value.trim() !== '' ? Promise.resolve() : Promise.reject())
                      },
                      { type: 'string', warningOnly: true },
                      {
                        type: 'string',
                        max: 100,
                        min: 1
                      }
                    ]}
                  >
                    <Input
                      className="shop-input-with-count"
                      showCount
                      maxLength={100}
                      size="large"
                      placeholder={pageData.namePlaceholder}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[25, 25]} className="form-row">
                <Col sm={24} md={12} className="w-100">
                  <h4 className="shop-form-label">
                    {pageData.phone}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    className="last-item"
                    name={'phoneNumber'}
                    rules={[
                      {
                        required: true,
                        message: pageData.phoneValidation
                      },
                      {
                        pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                        message: pageData.validPhonePattern
                      }
                    ]}
                  >
                    <Input
                      className="shop-input-addon-before"
                      size="large"
                      placeholder={pageData.phonePlaceholder}
                      // addonBefore={prefixSelector}
                      maxLength={15}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} className="w-100">
                  <h4 className="shop-form-label">{pageData.email}</h4>
                  <Form.Item
                    className="form-create-customer"
                    name={'email'}
                    rules={[
                      {
                        required: false,
                        message: pageData.emailValidation
                      },
                      {
                        type: 'email',
                        message: pageData.emailInvalidEmail
                      }
                    ]}
                  >
                    <Input className="shop-input" size="large" placeholder={pageData.emailPlaceholder} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[25, 25]} className="form-row">
                <Col sm={24} md={12} className="w-100">
                  <h4 className="shop-form-label">{pageData.birthday}</h4>
                  <Form.Item name={'birthDay'} className="last-item">
                    <DatePicker
                      suffixIcon={<CalendarNewIcon />}
                      className="shop-date-picker w-100"
                      format={DateFormat.DD_MM_YYYY}
                      onChange={(date) => setStartDate(date)}
                      placeholder={pageData.birthdayPlaceholder}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} className="w-100">
                  <h4 className="shop-form-label">{pageData.gender}</h4>
                  <Form.Item
                    name={'gender'}
                    className="form-create-customer form-gender"
                    style={{ marginBottom: '34.14px !important' }}
                  >
                    <Radio.Group className='d-flex' onChange={onGenderChange} defaultValue={genderSelected}>
                      <Radio value={CustomerGenderConstant.Female}>{pageData.female}</Radio>
                      <Radio className="last-gender-option" value={CustomerGenderConstant.Male}>
                        {pageData.male}
                      </Radio>
                      <Radio className="last-gender-option" value={CustomerGenderConstant.Other}>
                        {pageData.other}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              {renderAddress()}
            </Row>
          </Card>
        </Content>
      </Form>
    </>
  )
}
