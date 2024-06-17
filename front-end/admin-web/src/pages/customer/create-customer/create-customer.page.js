import { Form, message, Row, Space } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import PageTitle from 'components/page-title'
import { DELAYED_TIME } from 'constants/default.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import customerDataService from 'data-services/customer/customer-data.service'
import moment from 'moment'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { getValidationMessages } from 'utils/helpers'
import './create-customer.page.scss'
import CustomerForm from '../components/customer-form.component'
export default function CreateCustomerPage() {
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

  const [form] = Form.useForm()
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
        birthDay: values.birthDay ? moment.utc(values.birthDay).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2) : null
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


  const onDiscard = () => {
    setShowConfirm(false)
  }

  const navigateToManagementPage = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      return history.push('/customer')
    }, DELAYED_TIME)
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
        <CustomerForm form={form}/>
      </Form>
    </>
  )
}
