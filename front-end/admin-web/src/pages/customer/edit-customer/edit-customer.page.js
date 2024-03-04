import { Button, Col, DatePicker, Form, Image, Input, message, Modal, Radio, Row } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbImageSelectComponent } from 'components/fnb-image-select/fnb-image-select.component'
import { FnbSelectSingle } from 'components/fnb-select-single/fnb-select-single'
import { FnbTextArea } from 'components/fnb-text-area/fnb-text-area.component'
import PageTitle from 'components/page-title'
import { CustomerGenderConstant } from 'constants/customer.constant'
import { DELAYED_TIME } from 'constants/default.constants'
import { CalendarNewIcon } from 'constants/icons.constants'
import { images } from 'constants/images.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { formatCurrency, formatNumber, getValidationMessages } from 'utils/helpers'
import '../create-customer/create-customer.page.scss'
import './index.scss'

export default function EditCustomerPage (props) {
  const { t, customerDataService, history, match } = props
  const fnbImageSelectRef = React.useRef()

  const pageData = {
    title: t('customer:titleEdit'),
    generalInformation: t('customer:titleInfo'),
    btnCancel: t('button:cancel'),
    btnUpdate: t('button:update'),
    btnEdit: t('button:edit'),
    btnSave: t('button:save'),
    btnLeave: t('button:leave'),
    btnDiscard: t('button:discard'),
    btnDelete: t('button:delete'),
    btnIgnore: t('button:ignore'),
    customerUpdateSuccess: t('dashboard:customerUpdateSuccess'),
    customerUpdateFail: t('dashboard:customerUpdateFail'),
    customerDeleteSuccess: t('customer:customerDeleteSuccess'),
    customerDeleteFail: t('customer:customerDeleteFail'),
    discard: t('button:discard'),
    name: t('customer:name'),
    phone: t('customer:phone'),
    address: t('customer:address'),
    email: t('customer:email'),
    birthday: t('customer:birthday'),
    gender: t('customer:gender'),
    male: t('customer:male'),
    female: t('customer:female'),
    other: t('customer:other'),

    namePlaceholder: t('customer:namePlaceholder'),
    emailPlaceholder: t('customer:emailPlaceholder'),
    phonePlaceholder: t('customer:phonePlaceholder'),
    addressPlaceholder: t('customer:addressPlaceholder'),
    birthdayPlaceholder: t('customer:birthdayPlaceholder'),

    nameValidation: t('customer:nameValidation'),
    phoneValidation: t('customer:phoneValidation'),
    emailValidation: t('customer:emailValidation'),
    emailInvalidEmail: t('customer:emailInvalidEmail'),

    mustBeBetweenOneAndHundredCharacters: t('form:mustBeBetweenOneAndHundredCharacters'),
    allowNumberOnly: t('form:allowNumberOnly'),
    validPhonePattern: t('form:validPhonePattern'),

    city: t('form:city'),
    district: t('form:district'),
    ward: t('form:ward'),

    selectCity: t('form:selectCity'),
    selectDistrict: t('form:selectDistrict'),
    selectWard: t('form:selectWard'),

    totalOrder: t('dashboard:totalOrder'),
    totalMoney: t('dashboard:totalMoney'),

    leaveDialog: {
      confirmLeaveTitle: t('dialog:confirmLeaveTitle'),
      confirmLeaveContent: t('dialog:confirmLeaveContent'),
      confirmLeave: t('dialog:confirmLeave'),
      confirmDelete: t('dialog:confirmDelete'),
      confirmDeleteMessage: t('dialog:confirmDeleteMessage')
    }
  }

  const [form] = Form.useForm()
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [genderSelected, setGenderSelected] = useState(CustomerGenderConstant.Female)
  const [districts, setDistricts] = useState([])
  const [cities, setCities] = useState([])
  const [wards, setWards] = useState([])
  const [wardsByDistrictId, setWardsByDistrictId] = useState([])
  const [districtsByCityId, setDistrictsByCityId] = useState([])
  const [customer, setCustomer] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [showConfirmLeave, setShowConfirmLeave] = useState(false)
  useEffect(() => {
    // getInitDataAsync();
  }, [])

  const getInitDataAsync = async () => {
    const promises = []
    promises.push(customerDataService.getCustomerByIdAsync(match?.params?.customerId))
    const [customerResponse] = await Promise.all(promises)

    const { cities, districts, wards } = customerResponse
    setCities(cities)
    setDistricts(districts)
    setWards(wards)
    let cityId = null
    let districtId = null
    let wardId = null
    /// Set customer data
    if (customerResponse) {
      const { customer } = customerResponse
      cityId = customer?.cityId
      districtId = customer?.districtId
      wardId = customer?.wardId

      setCustomer(customer)
      setGenderSelected(customer?.gender)
      onChangeCity(cityId)
      onChangeDistrict(districtId)
      setCustomerName(customer?.firstName)
      const initField = {
        ...customer,
        birthDay: customer?.birthday ? moment.utc(customer?.birthday).local() : null,
        phone: customer?.phoneNumber
      }
      form.setFieldsValue(initField)

      const districtsFilteredByCity = districts?.filter((item) => item.cityId === cityId) ?? []
      setDistrictsByCityId(districtsFilteredByCity)

      const wardsFilteredByCity = wards?.filter((item) => item.districtId === districtId) ?? []
      setWardsByDistrictId(wardsFilteredByCity)

      if (fnbImageSelectRef && fnbImageSelectRef.current) {
        fnbImageSelectRef.current.setImageUrl(customer?.thumbnail ?? images.imgDefault)
        setSelectedImage(customer?.thumbnail ?? images.imgDefault)
      }
    }
  }

  const onFinish = async (values) => {
    const editUserRequestModel = {
      ...values,
      gender: genderSelected,
      addressId: customer?.addressId,
      id: match?.params?.customerId,
      thumbnail:
        fnbImageSelectRef.current.getImageUrl() === images.imgDefault ? null : fnbImageSelectRef.current.getImageUrl(),
      birthDay: values.birthDay ? moment.utc(values.birthDay).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2) : null,
      tags
    }
    customerDataService
      .updateCustomerAsync(editUserRequestModel)
      .then((res) => {
        if (res) {
          gotoCustomerPage()
          message.success(pageData.customerUpdateSuccess)
        } else {
          message.error(pageData.customerUpdateFail)
        }
      })
      .catch((errs) => {
        form.setFields(getValidationMessages(errs))
      })
  }

  const onGenderChange = (e) => {
    setGenderSelected(e.target.value)
  }

  const onChangeCity = (event) => {
    const districtsFilteredByCity = districts?.filter((item) => item.cityId === event) ?? []
    setDistrictsByCityId(districtsFilteredByCity)

    const formValue = form.getFieldsValue()
    formValue.address.districtId = null
    formValue.address.wardId = null
    formValue.districtId = null
    formValue.wardId = null
    form.setFieldsValue(formValue)
  }

  const onChangeDistrict = (event) => {
    const wardsFilteredByCity = wards?.filter((item) => item.districtId === event) ?? []
    setWardsByDistrictId(wardsFilteredByCity)

    const formValue = form.getFieldsValue()
    formValue.address.wardId = null
    formValue.wardId = null
    form.setFieldsValue(formValue)
  }

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    const mess = t(pageData.leaveDialog.confirmDeleteMessage, { name })
    return mess
  }

  const handleDeleteItem = async (id) => {
    await customerDataService.deleteCustomerByIdAsync(id).then((res) => {
      if (res) {
        gotoCustomerPage()
        message.success(pageData.customerDeleteSuccess)
      } else {
        message.error(pageData.customerDeleteFail)
      }
    })
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const onDeleteCustomer = () => {
    setShowConfirm(true)
  }

  const gotoCustomerPage = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      return history.push('/customer')
    }, DELAYED_TIME)
  }

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirmLeave(true)
    } else {
      setShowConfirmLeave(false)
      gotoCustomerPage()
    }
  }

  const onDiscardLeaveModal = () => {
    setShowConfirmLeave(false)
  }

  return (
    <Form
      autoComplete="off"
      name="basic"
      labelCol={{
        span: 8
      }}
      wrapperCol={{
        span: 24
      }}
      onFinish={onFinish}
      onFieldsChange={() => {
        if (!isChangeForm) setIsChangeForm(true)
      }}
      form={form}
    >
      <div>
        <Row className="staff-header-box">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle
                content={customerName}
                isNormal={true}
              />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12} className="fnb-form-item-btn">
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button type="primary" htmlType="submit" className="btn-edit-customer">
                      {pageData.btnUpdate}
                    </Button>
                  ),
                  permission: PermissionKeys.EDIT_CUSTOMER
                },
                {
                  action: (
                    <a onClick={() => onCancel()} className="action-cancel">
                      {pageData.btnLeave}
                    </a>
                  ),
                  permission: null
                },
                {
                  action: (
                    <a onClick={() => onDeleteCustomer()} className="action-delete">
                      {pageData.btnDelete}
                    </a>
                  ),
                  permission: PermissionKeys.EDIT_CUSTOMER
                }
              ]}
            />
          </Col>
        </Row>
        <div className="clearfix"></div>
        <div className="customer-edit-card">
          <div className="title-session">
            <span>{pageData.generalInformation}</span>
          </div>
          <Row>
            <Col sm={24} xs={24} lg={8}>
              <div className="left-card">
                <div className="left-card-image">
                  <FnbImageSelectComponent ref={fnbImageSelectRef} messageTooBigSize={pageData.fileSizeLimit} />
                </div>
                <div className="info-container">
                  <div className="other-info-box">
                    <div className="total">
                      <span className="text-left">{pageData.totalOrder}</span>
                      <span className="total-amount">
                        <b>{formatNumber(customer?.totalOrder)}</b>
                      </span>
                    </div>
                    <div className="total">
                      <span className="text-left">{pageData.totalMoney}</span>
                      <span className="total-amount">
                        <b>{formatCurrency(customer?.totalMoney)}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={24} xs={24} lg={16} className="customer-edit-card-right-padding">
              <Row style={{ display: 'grid' }}>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">
                      {pageData.name} <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                      name={'firstName'}
                      rules={[
                        {
                          required: true,
                          message: pageData.nameValidation
                        },
                        { type: 'string', warningOnly: true },
                        {
                          validator: (_, value) =>
                            value?.length > 0 && value.trim() === '' ? Promise.reject() : Promise.resolve(),
                          message: `${pageData.name} ${pageData.mustBeBetweenOneAndHundredCharacters}`
                        },
                        {
                          type: 'string',
                          max: 100,
                          min: 1,
                          message: `${pageData.name} ${pageData.mustBeBetweenOneAndHundredCharacters}`
                        }
                      ]}
                    >
                      <Input
                        className="fnb-input-with-count"
                        showCount
                        maxLength={100}
                        size="large"
                        onChange={(event) => {
                          setCustomerName(event.target.value)
                        }}
                        placeholder={pageData.namePlaceholder}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">
                      {pageData.phone}
                      <span className="text-danger"> *</span>
                    </h4>
                    <Form.Item
                      name={'phone'}
                      rules={[
                        {
                          required: true,
                          message: pageData.phoneValidation
                        },
                        {
                          pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im,
                          message: pageData.validPhonePattern
                        }
                      ]}
                    >
                      <Input
                        maxLength={15}
                        className="fnb-input-addon-before"
                        size="large"
                        placeholder={pageData.phonePlaceholder}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.address}</h4>
                    <Form.Item name={['address', 'address1']}>
                      <Input
                        className="fnb-input"
                        size="large"
                        placeholder={pageData.addressPlaceholder}
                        maxLength={255}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.email}</h4>
                    <Form.Item
                      name={'email'}
                      rules={[
                        {
                          type: 'email',
                          message: pageData.emailInvalidEmail
                        }
                      ]}
                    >
                      <Input className="fnb-input" size="large" placeholder={pageData.emailPlaceholder} />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.city}</h4>
                    <Form.Item name={['address', 'cityId']}>
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
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.birthday}</h4>
                    <Form.Item name={'birthDay'}>
                      <DatePicker
                        suffixIcon={<CalendarNewIcon />}
                        className="fnb-date-picker w-100"
                        format={DateFormat.DD_MM_YYYY}
                        onChange={(date) => setStartDate(date)}
                        placeholder={pageData.birthdayPlaceholder}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.district}</h4>
                    <Form.Item name={['address', 'districtId']}>
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
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.gender}</h4>
                    <Form.Item className="form-gender-customer-edit">
                      <Radio.Group onChange={onGenderChange} value={`${genderSelected}`}>
                        <Row gutter={[16, 8]}>
                          <Col sm={24} xs={24} lg={8}>
                            <Radio value={CustomerGenderConstant.Female}>{pageData.female}</Radio>
                          </Col>
                          <Col sm={24} xs={24} lg={8}>
                            <Radio value={CustomerGenderConstant.Male}>{pageData.male}</Radio>
                          </Col>
                          <Col sm={24} xs={24} lg={8}>
                            <Radio value={CustomerGenderConstant.Other}>{pageData.other}</Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    {isDefaultCountry
                      ? (
                      <>
                        <h4 className="fnb-form-label">{pageData.ward}</h4>
                        <Form.Item name={['address', 'wardId']}>
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
                      </>
                        )
                      : (
                      <>
                        <h4 className="fnb-form-label">{pageData.labelState}</h4>
                        <Form.Item name={['address', 'stateId']}>
                          <FnbSelectSingle
                            placeholder={pageData.selectCityStateRegion}
                            option={states?.map((item) => ({
                              id: item.id,
                              name: item.name
                            }))}
                            showSearch
                          />
                        </Form.Item>
                      </>
                        )}
                  </Col>
                </Row>
                <Row gutter={[25, 25]}>
                  <Col sm={24} xs={24} lg={24} className="form-row">
                    <h4 className="fnb-form-label">{pageData.note}</h4>
                    <Form.Item
                      name={'note'}
                      rules={[
                        {
                          max: 1000,
                          message: pageData.descriptionMaximum
                        }
                      ]}
                    >
                      <FnbTextArea showCount maxLength={1000} rows={4}></FnbTextArea>
                    </Form.Item>
                  </Col>
                </Row>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmDelete}
        content={formatDeleteMessage(customer?.fullName)}
        okText={pageData.btnDelete}
        cancelText={pageData.btnIgnore}
        permission={PermissionKeys.EDIT_CUSTOMER}
        skipPermission={true}
        onOk={() => handleDeleteItem(match?.params?.customerId)}
        onCancel={onDiscard}
        visible={showConfirm}
      />
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirmLeave}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.leaveDialog.confirmLeave}
        onCancel={onDiscardLeaveModal}
        onOk={gotoCustomerPage}
        isChangeForm={isChangeForm}
      />
    </Form>
  )
}
