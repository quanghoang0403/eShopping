import { Card, Col, Form, Image, Input, InputNumber, message, Row, Space, Tooltip, Divider } from 'antd'
import { arrayMoveImmutable } from 'array-move'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import { FnbSelectMultipleProduct } from 'components/shop-select-multiple-product/shop-select-multiple-product'
import PageTitle from 'components/page-title'
import { DELAYED_TIME } from 'constants/default.constants'
import { ExclamationIcon, PolygonIcon, TrashFill } from 'constants/icons.constants'
import { images } from 'constants/images.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import productCategoryDataService from 'data-services/product-category/product-category-data.service'
import productDataService from 'data-services/product/product-data.service'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { getValidationMessages } from 'utils/helpers'
import { BadgeSEOKeyword } from 'components/badge-keyword-SEO/badge-keyword-SEO.component'
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import RootCategoryDataService from 'data-services/product-category/product-root-category-data.service'
import { isGuid } from 'constants/string.constants'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { ProductGender } from 'constants/product-status.constants'

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
  const [keywordSEOs, setKeywordSEOList] = useState([]);
  const [keywordSEO, setKeywordSEO] = useState({})
  const [isKeywordSEOChange, setIsKewwordSEOChange] = useState(false)
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

  const addSEOKeywords = (e) => {
    e.preventDefault();
    setKeywordSEOList(list => !list.find(kw => kw.id === keywordSEO.id) && keywordSEO.value !== '' ? [...list, keywordSEO] : [...list]);
    setKeywordSEO({ id: '', value: '' });
    setIsKewwordSEOChange(false)
  }

  const removeSEOKeyword = (keyword) => {
    setKeywordSEOList(list => list.filter(kw => kw.id !== keyword.id));
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
            id: productCategory.id,
            name: productCategory.name,
            priority: productCategory.priority,
            keywordSEO: productCategory.keywordSEO,
            titleSEO: productCategory.titleSEO,
            descriptionSEO: productCategory.descriptionSEO,
            description: productCategory.description,
            content: productCategory.content,
            genderProductId: productCategory.genderProduct
          })
          setKeywordSEOList(list => productCategory.keywordSEO?.split(',').reduce((acc, curr) => acc.concat({ id: curr, value: curr }), []) || [])
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
      name: values.name,
      priority: values.priority,
      content: values.content,
      titleSEO: values.titleSEO,
      descriptionSEO: values.descriptionSEO,
      description: values.description,
      keywordSEO: keywordSEOs.map(kw => kw.value)?.join(',') || null,
      genderProduct: values.genderProductId
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
        <Row>
          <div className="w-100">
            <Row gutter={[16, 16]}>
              <Col sm={24} xs={24} md={24} lg={16}>
                <Card className="shop-card">
                  <h2 className="label-information mt-16">{pageData.generalInformation.title}</h2>
                  <h3 className="shop-form-label mt-16">
                    {pageData.generalInformation.name.label}
                    <span className="text-danger">*</span>
                  </h3>
                  <Form.Item
                    name={['name']}
                    className="item-name"
                    rules={[
                      {
                        required: pageData.generalInformation.name.required,
                        message: pageData.generalInformation.name.validateMessage
                      }
                    ]}
                  >
                    <Input
                      className="shop-input-with-count"
                      showCount
                      placeholder={pageData.generalInformation.name.placeholder}
                      maxLength={pageData.generalInformation.name.maxLength}
                    />
                  </Form.Item>

                  <div className="d-flex">
                    <h3 className="shop-form-label mt-16">
                      {pageData.priority.title}
                      <span className="text-danger">*</span>
                    </h3>
                    <Tooltip placement="topLeft" title={pageData.priority.tooltip}>
                      <span className="ml-12 mt-16">
                        <ExclamationIcon />
                      </span>
                    </Tooltip>
                  </div>
                  <Form.Item
                    name={['priority']}
                    rules={[
                      {
                        required: true,
                        message: pageData.priority.validateMessage
                      }
                    ]}
                  >
                    <InputNumber
                      placeholder={pageData.priority.placeholder}
                      className="shop-input-number w-100"
                      min={1}
                      max={1000000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>

                  <div className="d-flex">
                    <h3 className="shop-form-label mt-16">
                      {pageData.content.title}
                    </h3>
                  </div>
                  <Form.Item name={['content']}>
                    <Input
                      className="shop-input-with-count"
                      showCount
                      placeholder={pageData.content.placeholder}
                    />
                  </Form.Item>

                  <h3 className="shop-form-label mt-16">
                    {pageData.description.title}
                  </h3>
                  <Form.Item
                    name={['description']}
                    className="item-name"
                  >
                    <FnbTextArea
                      showCount
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      id="product-category-description"
                      placeholder={pageData.description.placeholder}
                      maxLength={pageData.description.maxLength}
                    ></FnbTextArea>
                  </Form.Item>
                </Card>
              </Col>

              {/* product gender */}
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card className="shop-card">
                  <h3>{pageData.gender.genderCategory}</h3>
                  <Form.Item
                    name={['genderProductId']}
                    className="item-name"
                  >
                    <FnbSelectSingle
                      noTranslateOptionName={true}
                      option={Object.keys(ProductGender).map(gender => {
                        return {
                          id: ProductGender[gender],
                          name: gender
                        }
                      })}
                      placeholder={pageData.gender.placeholderGender}
                    />
                  </Form.Item>

                </Card>
              </Col>
            </Row>

            {/* seo info */}
            <Row className='mt-4'>
              <Card className='shop-card w-100'>
                <h2 className="label-information mt-16">{pageData.SEOInformation.title}</h2>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <div className='d-flex'>
                      <h3 className="shop-form-label mt-16">
                        {pageData.SEOInformation.SEOtitle.label}
                      </h3>
                      <Tooltip placement="topLeft" title={pageData.SEOInformation.SEOtitle.tooltip}>
                        <span className="ml-12 mt-16">
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </div>

                    <Form.Item
                      name={['titleSEO']}
                      className="item-name"
                      rules={[
                        {
                          min: pageData.SEOInformation.SEOtitle.minlength,
                          message: pageData.SEOInformation.SEOtitle.validateMessage
                        }
                      ]}
                    >
                      <Input
                        className="shop-input-with-count"
                        showCount
                        placeholder={pageData.SEOInformation.SEOtitle.placeholder}
                        minLength={pageData.SEOInformation.SEOtitle.minlength}
                        maxLength={pageData.SEOInformation.SEOtitle.maxLength}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <div className='d-flex'>
                      <h3 className="shop-form-label mt-16">
                        {pageData.SEOInformation.description.label}
                      </h3>
                      <Tooltip placement="topLeft" title={pageData.SEOInformation.description.tooltip}>
                        <span className="ml-12 mt-16">
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </div>
                    <Form.Item
                      name={['descriptionSEO']}
                      className="item-name"
                      rules={[
                        {
                          min: pageData.SEOInformation.description.minlength,
                          message: pageData.SEOInformation.description.validateMessage
                        }
                      ]}
                    >
                      <Input
                        className="shop-input-with-count"
                        showCount
                        placeholder={pageData.SEOInformation.description.placeholder}
                        minLength={pageData.SEOInformation.description.minlength}
                        maxLength={pageData.SEOInformation.description.maxLength}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <div className='d-flex'>
                      <h3 className="shop-form-label mt-16">
                        {pageData.SEOInformation.keyword.label}
                      </h3>
                      <Tooltip placement="topLeft" title={pageData.SEOInformation.keyword.tooltip}>
                        <span className="ml-12 mt-16">
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </div>

                    <div>
                      {
                        keywordSEOs.length > 0 ? <BadgeSEOKeyword onClose={removeSEOKeyword} keywords={keywordSEOs} /> : ''
                      }

                      <div className='d-flex mt-3'>
                        <Input
                          className="shop-input-with-count"
                          showCount
                          value={keywordSEO?.value || ''}
                          placeholder={pageData.SEOInformation.keyword.placeholder}
                          onChange={e => {
                            if (e.target.value !== '') {
                              setKeywordSEO({
                                id: e.target.value,
                                value: e.target.value
                              })
                              setIsKewwordSEOChange(true)
                            }
                          }}
                        />
                        <ShopAddNewButton
                          permission={PermissionKeys.CREATE_PRODUCT_CATEGORY}
                          disabled={!isKeywordSEOChange}
                          text={pageData.SEOInformation.keyword.btnAdd}
                          className={'mx-4'}
                          onClick={addSEOKeywords}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Row>
          </div>
        </Row>
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