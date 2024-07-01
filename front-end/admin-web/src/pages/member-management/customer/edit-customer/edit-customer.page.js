import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
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
import CustomerForm from '../components/customer-form.component';
import ShopActiveStatus from 'components/shop-active-status/shop-active-status.component';

export default function EditCustomerPage() {
  const [t] = useTranslation()
  const history = useHistory()
  const match = useRouteMatch()
  const pageData = {
    title: t('customer.titleEdit'),
    active: t('common.active'),
    generalInformation: t('customer.titleInfo'),
    btnCancel: t('button.cancel'),
    btnUpdate: t('button.save'),
    btnEdit: t('button.edit'),
    btnSave: t('button.save'),
    btnLeave: t('button.leave'),
    btnDiscard: t('button.discard'),
    btnDelete: t('button.delete'),
    btnIgnore: t('button.ignore'),
    customerUpdateSuccess: t('customer.customerUpdateSuccess'),
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
      confirmLeave: t('dialog.confirmLeave'),
      confirmDelete: t('dialog.confirmDelete'),
      confirmDeleteMessage: t('dialog.confirmDeleteMessage')
    }
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [customer, setCustomer] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  useEffect(() => {
    getInitDataAsync();
  }, []);

  const getInitDataAsync = () => {
    const promises = [];
    let tempCustomer ;
    promises.push(
      customerDataService.getCustomerByIdAsync(match?.params?.customerId),
    );
    const customerResponse = Promise.all(promises)
      .then(value=>{
        const [customer] = value
        const initField = {
          ...customer,
          birthDay: customer?.birthday
            ? moment.utc(customer?.birthday).local()
            : null
        };
        form.setFieldsValue(initField);
        tempCustomer = customer
        setCustomer(customer)
        const wardAndDistrictPromises = []
        wardAndDistrictPromises.push(AddressDataService.getDistrictsByCityId(customer.cityId))
        wardAndDistrictPromises.push(AddressDataService.getWardsByDistrictId(customer.districtId))
        return Promise.all(wardAndDistrictPromises)

      })
      .then(wardAndDistrict=>{
        const [districts,wards] = wardAndDistrict;
        const customerDistrict = districts.find(district=>district?.id === tempCustomer?.districtId)
        const customerWard = wards.find(ward=>ward?.id === tempCustomer?.wardId)
        form.setFieldValue('wardId',customerWard?.id)
        form.setFieldValue('districtId',customerDistrict?.id)
      }).catch(error=>{
        console.error(error)
      });
  };

  const onFinish = async (values) => {
    const editUserRequestModel = {
      id: match?.params?.customerId,
      ...values
    };
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

  const onChangeStatus = active=>{
    form.setFieldValue('isActive',!active)
    setCustomer(s=>({...s,isActive:!active}))
  }

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
  if(!customer) return <p>...Loadming </p>
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
          <Col xs={24} sm={24} lg={12} className='edit-title'>
            <p className="card-header">
              <PageTitle content={customer?.fullName} isNormal={true} />
            </p>
            <ShopActiveStatus status={customer?.isActive}/>
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
        <CustomerForm form={form} isEdit={true} onChangeStatus={onChangeStatus}/>
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
