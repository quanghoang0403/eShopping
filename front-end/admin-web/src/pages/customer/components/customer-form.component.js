import { Card, Col, DatePicker, Form, Input, Radio, Row } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { CalendarNewIcon } from 'constants/icons.constants'
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component'
import { DateFormat } from 'constants/string.constants'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { CustomerGenderConstant } from 'constants/customer.constant'
import AddressDataService from 'data-services/address/address-data.service'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
export default function CustomerForm({form}){
  const [t] = useTranslation()
  const [genderSelected, setGenderSelected] = useState(CustomerGenderConstant.Male)
  const [cities, setCities] = useState([])
  const [wardsByDistrictId, setWardsByDistrictId] = useState([])
  const [districtsByCityId, setDistrictsByCityId] = useState([])
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
    media: {
      title: t('blog.media'),
      bannerTitle: t('blog.bannerTitle'),
      textNonImage: t('file.textNonImage'),
      uploadImage: t('file.uploadImage'),
      // addFromUrl: t('file.addFromUrl'),
      bestDisplayImage: t('blog.bestDisplayImage')
    },
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
    }
  }
  useEffect(() => {
    // Call API
    getCitiesInfo();
    const currentCity = form.getFieldValue('cityId')
    const currentWard = form.getFieldValue('wardId')
    const currentDistrict = form.getFieldValue('districtId')
    if(currentWard || currentDistrict){
      getDistrictsInfo(currentCity)
      getWardsInfo(currentDistrict)
    }
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

  return(
    <Content>
      <Card className="shop-card">
        <Row>
          <Col span={24}>
            <h5 className="title-group">{pageData.generalInformation}</h5>
          </Col>
        </Row>
        <Row style={{ display: 'grid' }}>
          <Row gutter={[25, 25]} className="form-row">
            <Col sm={24} md={8} lg={12}>
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
            <Col xs={24} sm={12} md={8} lg={12}>
              <Form.Item name={'thumbnail'} className='mx-auto'>
                <FnbImageSelectComponent
                  isShowBestDisplay={false}
                  messageTooBigSize={pageData.media.imageSizeTooBig}
                  bestDisplayImage={pageData.media.bestDisplayImage}
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
                  className="shop-input-addon-before shop-input"
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
                  // onChange={(date) => setStartDate(date)}
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
                <Radio.Group defaultValue={genderSelected}>
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
  );
}