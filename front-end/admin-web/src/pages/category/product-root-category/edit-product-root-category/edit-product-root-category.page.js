import { Card, Col, Form, Input, InputNumber, message, Row, Space, Tooltip} from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import PageTitle from 'components/page-title'
import { ExclamationIcon, PolygonIcon, TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { BadgeSEOKeyword } from 'components/badge-keyword-SEO/badge-keyword-SEO.component'
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import RootCategoryDataService from 'data-services/product-category/product-root-category-data.service'
import { isGuid } from 'constants/string.constants'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { ProductGender } from 'constants/product-status.constants'
import ProductRootCategoryForm from '../components/form-root-category.component'

export default function EditProductRootCategory() {
  const history = useHistory()
  const match = useRouteMatch()
  const [form] = Form.useForm()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [currentName, setCurrentName] = useState('')
  const [title, setTitle] = useState('')
  const [productCategoryName, setProductCategoryName] = useState('')
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)
  const [dataSelectedProducts, setDataSelectedProducts] = useState([])
  const [t] = useTranslation()

  const pageData = {
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnUpdate: t('button.edit'),
    btnDelete: t('button.delete'),
    btnDiscard: t('button.discard'),
    generalInformation: {
      title: t('productCategory.titleInfo'),
      name: {
        label: t('productCategory.labelName'),
        placeholder: t('productCategory.placeholderName'),
        required: true,
        maxLength: 100,
        validateMessage: t('productCategory.validateName')
      }
    },
    gender: {
      genderCategory: t('productCategory.genderCategory'),
      placeholderGender: t('productCategory.placeholderGender')
    },
    product: {
      title: t('productCategory.titleProduct'),
      placeholder: t('productCategory.placeholderProduct')
    },
    priority: {
      title: t('productCategory.titlePriority'),
      placeholder: t('productCategory.placeholderPriority'),
      validateMessage: t('productCategory.validatePriority'),
      tooltip: t('productCategory.tooltipPriority')
    },
    content: {
      title: t('productCategory.productCategoryContent'),
      placeholder: t('productCategory.placeholderContent')
    },
    description: {
      title: t('productCategory.categoryDescription'),
      placeholder: t('productCategory.placeholderCategoryDescription'),
      maxLength: 250
    },
    SEOInformation: {
      title: t('form.SEOConfiguration'),
      keyword: {
        label: t('form.SEOKeywords'),
        placeholder: t('form.SEOKeywordsPlaceholder'),
        tooltip: t('form.SEOKeywordsTooltip'),
        btnAdd: t('form.AddSEOKeywords')
      },
      SEOtitle: {
        label: t('form.SEOTitle'),
        placeholder: t('form.SEOTitlePlaceholder'),
        tooltip: t('form.SEOTitleTooltip'),
        validateMessage: t('form.messageMatchSuggestSEOTitle'),
        minlength: 50,
        maxLength: 100
      },
      description: {
        label: t('form.SEODescription'),
        placeholder: t('form.SEODescriptionPlaceholder'),
        validateMessage: t('form.messageMatchSuggestSEODescription'),
        minlength: 150,
        maxLength: 200,
        tooltip: t('form.SEODescriptionTooltip')
      }
    },
    productCategoryNameExisted: t('productCategory.productNameExisted'),
    productCategoryAddedSuccess: t('productCategory.productCategoryAddedSuccess'),
    productCategoryUpdateSuccess: t('productCategory.productCategoryUpdateSuccess'),
    productCategoryDeleteSuccess: t('productCategory.productCategoryDeleteSuccess'),
    productCategoryDeleteFail: t('productCategory.productCategoryDeleteFail'),
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave'),
      confirmDeleteMessage: t('dialog.confirmDeleteMessage'),
      confirmDelete: t('dialog.confirmDelete')
    },
    idNotFound: t('common.idNotFound')
  }

  const getEditData = () => {
    const { productRootCategoryId } = match?.params
    if (isGuid(productRootCategoryId)) {
      RootCategoryDataService.GetProductRootCatgoryByIdAsync(productRootCategoryId).then((response) => {
        if (response) {
          const productCategory = response
          /// Handle set data
          if (productCategory.products) {
            setDataSelectedProducts(productCategory.products)
            setProductCategoryName(productCategory.name)
          }
          setTitle(productCategory.name)
          setCurrentName(productCategory.name)

          form.setFieldsValue({
            ...productCategory
          })
        }
      })
    }
    else {
      message.error(pageData.idNotFound)
    }
  }

  const onCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      history?.push('/product-root-category')
    }, 0)
  }

  const onSubmitForm = async () => {
    const values = await form.validateFields();
    const updateProductRootCategoryRequestModel = {
      id: match?.params?.productRootCategoryId,
      ...values
    }
    try {
      const res = await RootCategoryDataService.EditProductRootCategory(updateProductRootCategoryRequestModel)
      if (res) {
        message.success(pageData.productCategoryUpdateSuccess)
        onCompleted()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
      onCompleted()
    }
  }

  const onRemoveItem = async () => {
    const { productRootCategoryId } = match?.params
    const res = await RootCategoryDataService.DeleteRootCategoryAsync(productRootCategoryId)
    if (res) {
      message.success(pageData.productCategoryDeleteSuccess)
      setIsChangeForm(false)
      history.push('/product-root-category')
    } else {
      message.error(pageData.productCategoryDeleteFail)
    }
  }

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    const mess = t(pageData.leaveDialog.confirmDeleteMessage, { name })
    return mess
  }

  useEffect(() => {
    getEditData()
  }, [])

  return (
    <>
      <Form form={form} layout="vertical" autoComplete="off" onFieldsChange={() => setIsChangeForm(true)}>
        <Row className="shop-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={title !== '' ? title : currentName} />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Space className="float-right header-control">
              <ActionButtonGroup
                arrayButton={[
                  {
                    action: (
                      <ShopAddNewButton
                        type="primary"
                        text={pageData.btnUpdate}
                        onClick={() => onSubmitForm()}
                        className="float-right"
                      />
                    ),
                    permission: PermissionKeys.EDIT_PRODUCT_CATEGORY
                  },
                  {
                    action: (
                      <button className="action-cancel" onClick={() => onCancel()}>
                        {pageData.btnCancel}
                      </button>
                    ),
                    permission: null
                  },
                  {
                    action: (
                      <button
                        className="action-delete"
                        style={{ background: 'none' }}
                        onClick={() => setConfirmDeleteVisible(true)}
                      >
                        {pageData.btnDelete}
                      </button>
                    ),
                    permission: PermissionKeys.EDIT_PRODUCT_CATEGORY
                  }
                ]}
              />
            </Space>
          </Col>
        </Row>
        <ProductRootCategoryForm/>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.leaveDialog.confirmLeave}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmDelete}
        content={formatDeleteMessage(productCategoryName)}
        okText={pageData.btnDelete}
        cancelText={pageData.btnIgnore}
        skipPermission={true}
        onOk={onRemoveItem}
        onCancel={() => setConfirmDeleteVisible(false)}
        visible={confirmDeleteVisible}
      />
    </>
  );
}