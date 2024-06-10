import {
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Modal,
  Radio,
  Row
} from 'antd';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component';
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single';
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component';
import PageTitle from 'components/page-title';
import { CustomerGenderConstant } from 'constants/customer.constant';
import { DELAYED_TIME } from 'constants/default.constants';
import { CalendarNewIcon } from 'constants/icons.constants';
import { images } from 'constants/images.constants';
import { PermissionKeys } from 'constants/permission-key.constants';
import { DateFormat } from 'constants/string.constants';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  formatCurrency,
  formatNumber,
  getValidationMessages
} from 'utils/helpers';
import '../create-customer/create-customer.page.scss';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';
import customerDataService from 'data-services/customer/customer-data.service';
import AddressDataService from 'data-services/address/address-data.service';

export default function EditCustomerPage(props) {
  const [t] = useTranslation()
  const history = useHistory()
  const match = useRouteMatch()
  const shopImageSelectRef = React.useRef();

  const pageData = {
    title: t('customer.titleEdit'),
    generalInformation: t('customer.titleInfo'),
    btnCancel: t('button.cancel'),
    btnUpdate: t('button.save'),
    btnEdit: t('button.edit'),
    btnSave: t('button.save'),
    btnLeave: t('button.leave'),
    btnDiscard: t('button.discard'),
    btnDelete: t('button.delete'),
    btnIgnore: t('button.ignore'),
    customerUpdateSuccess: t('dashboard.customerUpdateSuccess'),
    customerUpdateFail: t('dashboard.customerUpdateFail'),
    customerDeleteSuccess: t('customer.customerDeleteSuccess'),
    customerDeleteFail: t('customer.customerDeleteFail'),
    discard: t('button.discard'),
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

    mustBeBetweenOneAndHundredCharacters: t(
      'form.mustBeBetweenOneAndHundredCharacters'
    ),
    allowNumberOnly: t('form.allowNumberOnly'),
    validPhonePattern: t('form.validPhonePattern'),

    city: t('form.city'),
    district: t('form.district'),
    ward: t('form.ward'),

    selectCity: t('form.selectCity'),
    selectDistrict: t('form.selectDistrict'),
    selectWard: t('form.selectWard'),
    totalOrder: t('dashboard.totalOrder'),
    totalMoney: t('dashboard.totalMoney'),

    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave'),
      confirmDelete: t('dialog.confirmDelete'),
      confirmDeleteMessage: t('dialog.confirmDeleteMessage')
    }
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);
  const [customer, setCustomer] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  useEffect(() => {
    getInitDataAsync();
  }, []);

  const getInitDataAsync = () => {
    const promises = [];
    promises.push(
      customerDataService.getCustomerByIdAsync(match?.params?.customerId),
    );
    promises.push(AddressDataService.getAllCitiesAsync())
    const customerResponse = Promise.all(promises)
      .then(value=>{
        const [customer,cities] = value
        setCities(cities);
        const initField = {
          ...customer,
          birthDay: customer?.birthday
            ? moment.utc(customer?.birthday).local()
            : null,
          phone: customer?.phoneNumber
        };
        form.setFieldsValue(initField);
        const wardAndDistrictPromises = []
        wardAndDistrictPromises.push(AddressDataService.getDistrictsByCityId(customer.cityId))
        wardAndDistrictPromises.push(AddressDataService.getWardsByDistrictId(customer.districtId))
        return Promise.all(wardAndDistrictPromises)

      })
      .then(wardAndDistrict=>{
        const [districts,wards] = wardAndDistrict;
        setDistricts(districts);
        setWards(wards)

      }).catch(error=>{
        console.error(error)
      });
    // let cityId = null;
    // let districtId = null;
    // let wardId = null;
    // /// Set customer data
    // if (customerResponse) {
    //   const { customer } = customerResponse;
    //   cityId = customer?.cityId;
    //   districtId = customer?.districtId;
    //   wardId = customer?.wardId;

    //   setCustomer(customer);

    //   setCustomerName(customer?.firstName);
    //   const initField = {
    //     ...customer,
    //     birthDay: customer?.birthday
    //       ? moment.utc(customer?.birthday).local()
    //       : null,
    //     phone: customer?.phoneNumber
    //   };
    //   form.setFieldsValue(initField);

    //   const districtsFilteredByCity =
    //     districts?.filter((item) => item.cityId === cityId) ?? [];
    //   setDistrictsByCityId(districtsFilteredByCity);

    //   const wardsFilteredByCity =
    //     wards?.filter((item) => item.districtId === districtId) ?? [];
    //   setWardsByDistrictId(wardsFilteredByCity);

    if (shopImageSelectRef && shopImageSelectRef.current) {
      shopImageSelectRef.current.setImageUrl(
          customer?.thumbnail ?? images.imgDefault
      );
      setSelectedImage(customer?.thumbnail ?? images.imgDefault);
    }
    // }
  };

  const onFinish = async (values) => {
    const editUserRequestModel = {
      id: match?.params?.customerId,
      ...values,
      thumbnail:
        shopImageSelectRef.current.getImageUrl() === images.imgDefault
          ? null
          : shopImageSelectRef.current.getImageUrl()
    };
    console.log(editUserRequestModel)
    customerDataService
      .updateCustomerAsync(editUserRequestModel)
      .then((res) => {
        if (res) {
          gotoCustomerPage();
          message.success(pageData.customerUpdateSuccess);
        } else {
          message.error(pageData.customerUpdateFail);
        }
      })
      .catch((errs) => {
        form.setFields(getValidationMessages(errs));
      });
  };


  const onChangeCity = async(event) => {
    const districts = await AddressDataService.getDistrictsByCityId(event)
    setDistricts(districts)

    const formValue = form.getFieldsValue();
    formValue.districtId = null;
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const onChangeDistrict = async (event) => {
    const wards = await AddressDataService.getWardsByDistrictId(event)
    setWards(wards)
    const formValue = form.getFieldsValue();
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    const mess = t(pageData.leaveDialog.confirmDeleteMessage, { name });
    return mess;
  };

  const handleDeleteItem = async (id) => {
    await customerDataService.deleteCustomerAsync(id).then((res) => {
      if (res) {
        gotoCustomerPage();
        message.success(pageData.customerDeleteSuccess);
      } else {
        message.error(pageData.customerDeleteFail);
      }
    });
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onDeleteCustomer = () => {
    setShowConfirm(true);
  };

  const gotoCustomerPage = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push('/customer');
    }, DELAYED_TIME);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirmLeave(true);
    } else {
      setShowConfirmLeave(false);
      gotoCustomerPage();
    }
  };

  const onDiscardLeaveModal = () => {
    setShowConfirmLeave(false);
  };

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
        if (!isChangeForm) setIsChangeForm(true);
      }}
      form={form}
    >
      <div>
        <Row className="staff-header-box">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={customerName} isNormal={true} />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12} className="shop-form-item-btn">
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="btn-edit-customer"
                    >
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
                    <a
                      onClick={() => onDeleteCustomer()}
                      className="action-delete"
                    >
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
                  <FnbImageSelectComponent
                    ref={shopImageSelectRef}
                    messageTooBigSize={pageData.fileSizeLimit}
                  />
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
            <Col
              sm={24}
              xs={24}
              lg={16}
              className="customer-edit-card-right-padding"
            >
              <Row style={{ display: 'grid' }}>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="shop-form-label">
                      {pageData.name} <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                      name={'fullName'}
                      rules={[
                        {
                          required: true,
                          message: pageData.nameValidation
                        },
                        { type: 'string', warningOnly: true },
                        {
                          validator: (_, value) =>
                            value?.length > 0 && value.trim() === ''
                              ? Promise.reject()
                              : Promise.resolve(),
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
                        className="shop-input-with-count"
                        showCount
                        maxLength={100}
                        size="large"
                        onChange={(event) => {
                          setCustomerName(event.target.value);
                        }}
                        placeholder={pageData.namePlaceholder}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="shop-form-label">
                      {pageData.phone}
                      <span className="text-danger"> *</span>
                    </h4>
                    <Form.Item
                      name={'phoneNumber'}
                      rules={[
                        {
                          required: true,
                          message: pageData.phoneValidation
                        },
                        {
                          pattern:
                            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im,
                          message: pageData.validPhonePattern
                        }
                      ]}
                    >
                      <Input
                        maxLength={15}
                        className="shop-input-addon-before shop-input"
                        size="large"
                        placeholder={pageData.phonePlaceholder}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="shop-form-label">{pageData.address}</h4>
                    <Form.Item name={['address']}>
                      <Input
                        className="shop-input"
                        size="large"
                        placeholder={pageData.addressPlaceholder}
                        maxLength={255}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="shop-form-label">{pageData.email}</h4>
                    <Form.Item
                      name={'email'}
                      rules={[
                        {
                          type: 'email',
                          message: pageData.emailInvalidEmail
                        }
                      ]}
                    >
                      <Input
                        className="shop-input"
                        size="large"
                        placeholder={pageData.emailPlaceholder}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="shop-form-label">{pageData.city}</h4>
                    <Form.Item name={[ 'cityId']}>
                      <FnbSelectSingle
                        size="large"
                        placeholder={pageData.selectCity}
                        onChange={onChangeCity}
                        showSearch
                        autoComplete="none"
                        option={cities}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="shop-form-label">{pageData.birthday}</h4>
                    <Form.Item name={'birthDay'}>
                      <DatePicker
                        suffixIcon={<CalendarNewIcon />}
                        className="shop-date-picker w-100"
                        format={DateFormat.DD_MM_YYYY}
                        placeholder={pageData.birthdayPlaceholder}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="shop-form-label">{pageData.district}</h4>
                    <Form.Item name={['districtId']}>
                      <FnbSelectSingle
                        size="large"
                        placeholder={pageData.selectDistrict}
                        onChange={onChangeDistrict}
                        showSearch
                        autoComplete="none"
                        option={districts}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="shop-form-label">{pageData.gender}</h4>
                    <Form.Item name={'gender'} className="form-gender-customer-edit">
                      <Radio.Group>
                        <Row gutter={[16, 8]}>
                          <Col sm={24} xs={24} lg={8}>
                            <Radio value={CustomerGenderConstant.Female}>
                              {pageData.female}
                            </Radio>
                          </Col>
                          <Col sm={24} xs={24} lg={8}>
                            <Radio value={CustomerGenderConstant.Male}>
                              {pageData.male}
                            </Radio>
                          </Col>
                          <Col sm={24} xs={24} lg={8}>
                            <Radio value={CustomerGenderConstant.Other}>
                              {pageData.other}
                            </Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="shop-form-label">
                      {pageData.ward}
                    </h4>
                    <Form.Item name={['wardId']}>
                      <FnbSelectSingle
                        placeholder={pageData.selectWard}
                        option={wards}
                        showSearch
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]}>
                  <Col sm={24} xs={24} lg={24} className="form-row">
                    <h4 className="shop-form-label">{pageData.note}</h4>
                    <Form.Item
                      name={'note'}
                      rules={[
                        {
                          max: 1000,
                          message: pageData.descriptionMaximum
                        }
                      ]}
                    >
                      <FnbTextArea
                        showCount
                        maxLength={1000}
                        rows={4}
                      ></FnbTextArea>
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
  );
}
