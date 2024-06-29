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
import '../index.scss'
import { BadgeSEOKeyword } from 'components/badge-keyword-SEO/badge-keyword-SEO.component'
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import ChangeStatusButton from 'components/shop-change-active-status-button/shop-change-active-status-button.component'
import ShopActiveStatus from 'components/shop-active-status/shop-active-status.component'
import RootCategoryDataService from 'data-services/product-category/product-root-category-data.service'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'

export default function EditProductCategoryPage(props) {
  const [t] = useTranslation()
  const history = useHistory()
  const match = useRouteMatch()
  const [form] = Form.useForm()
  const [productRootCategories, setProductRootCategories] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [productCategory, setProductCategory] = useState()
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)
  // const [dataSelectedProducts, setDataSelectedProducts] = useState([])
  const pageData = {
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnUpdate: t('button.edit'),
    btnDelete: t('button.delete'),
    btnDiscard: t('button.discard'),
    generalInformation: {
      activate: t('product.activate'),
      title: t('productCategory.titleInfo'),
      name: {
        label: t('productCategory.labelName'),
        placeholder: t('productCategory.placeholderName'),
        required: true,
        maxLength: 100,
        validateMessage: t('productCategory.validateName')
      }
    },
    product: {
      title: t('product.labelProductRootCategory'),
      placeholder: t('product.placeholderProductRootCategory')
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
    }
  }

  useEffect(() => {
    getProductRootCategories()
    getEditData()
  }, [])

  const onCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      history?.push('/product-category')
    }, DELAYED_TIME)
  }
  const getEditData = () => {
    const { productCategoryId } = match?.params
    if (productCategoryId) {
      productCategoryDataService.getProductCategoryByIdAsync(productCategoryId).then((response) => {
        if (response) {
          const productCategory = response
          /// Handle set data
          if (productCategory.products) {
            // setDataSelectedProducts(products.filter(p=>p.id === productCategory?.productRootCategoryId))
            setProductCategory(productCategory)
          }
          form.setFieldsValue({
            ...productCategory
          })
        }
      })
    }
  }

  const getProductRootCategories = () => {
    productDataService.getPreparedDataProductAsync().then((res) => {
      if (res) {
        setProductRootCategories(res.productRootCategories)
      }
    })
  }

  // const onSelectProduct = (ids) => {
  //   const productIds = ids
  //   const productList = [...dataSelectedProducts]
  //   productIds.forEach((productId, index) => {
  //     const product = products.find((p) => p.id === productId && !productList.find(p => p.id === productId))
  //     if (product) {
  //       const newProduct = { ...product, position: index + 1 }
  //       productList.push(newProduct)
  //     }
  //   })
  //   setDataSelectedProducts(productList)
  // }

  // const onDeleteSelectedProduct = (productId) => {
  //   let restProducts = dataSelectedProducts.filter((o) => o.id !== productId)
  //   restProducts = restProducts.map((product, index) => ({
  //     ...product,
  //     position: index + 1
  //   }))
  //   setDataSelectedProducts(restProducts)

  //   /// Set form value
  //   const formValues = form.getFieldsValue()
  //   let { productIds } = formValues
  //   productIds = productIds.filter((pid) => pid !== productId)
  //   form.setFieldsValue({ ...formValues, productIds })
  // }

  const renderSelectProduct = () => {
    return (
      <>
        <Col span={24}>
          <h3 className="shop-form-label mt-16">{pageData.product.title}</h3>
          <Form.Item name="productRootCategoryId">
            <FnbSelectSingle
              showSearch
              allowClear
              placeholder={pageData.product.placeholder}
              className="w-100"
              listHeight={480}
              option={productRootCategories}
            />
          </Form.Item>
        </Col>
      </>
    )
  }
  // #region Handle drag drop
  // const DragHandle = sortableHandle(({ component }) => {
  //   return (
  //     <Row gutter={[16, 16]} className="all-scroll">
  //       <Col span={1}>
  //         <div className="drag-handle">
  //           <PolygonIcon />
  //         </div>
  //       </Col>
  //       <Col span={23}>{component()}</Col>
  //     </Row>
  //   )
  // })

  // const renderProductInfo = (product) => {
  //   return (
  //     <div className="product-info">
  //       {/* <div className="product-position">
  //         <span>{product?.position}</span>
  //       </div> */}
  //       <div className="image-box">
  //         <Image src={product?.thumbnail || images.imgDefault} preview={false} />
  //       </div>
  //       <div className="product-name">
  //         <span>{product?.name}</span>
  //       </div>
  //     </div>
  //   )
  // }

  // const SortableItem = sortableElement(({ product }) => {
  //   return (
  //     <>
  //       <div className="selected-product-card mt-3">
  //         <Row>
  //           <Col span={22}>
  //             <DragHandle component={() => renderProductInfo(product)}></DragHandle>
  //           </Col>
  //           <Col span={2}>
  //             <div className="delete-icon">
  //               <TrashFill onClick={() => onDeleteSelectedProduct(product?.id)} />
  //             </div>
  //           </Col>
  //         </Row>
  //       </div>
  //     </>
  //   )
  // })

  // const onSortEnd = ({ oldIndex, newIndex }) => {
  //   let arraySorted = arrayMoveImmutable(dataSelectedProducts, oldIndex, newIndex)
  //   arraySorted = arraySorted.map((product, index) => ({
  //     ...product,
  //     position: index + 1
  //   }))
  //   setDataSelectedProducts(arraySorted)
  // }

  // const SortableList = sortableContainer(({ items }) => {
  //   return (
  //     <div className="selected-product-width mt-16">
  //       {items.map((value, index) => (
  //         <SortableItem key={value.id} index={index} product={value} />
  //       ))}
  //     </div>
  //   )
  // })

  // const renderSelectedProduct = () => {
  //   return <SortableList items={dataSelectedProducts} onSortEnd={onSortEnd} useDragHandle />
  // }
  // // #endregion

  const onSubmitForm = () => {
    form.validateFields().then((values) => {
      const updateProductCategoryRequestModel = {
        ...values
      }

      productCategoryDataService
        .updateProductCategoryAsync(updateProductCategoryRequestModel)
        .then((response) => {
          if (response) {
            message.success(pageData.productCategoryUpdateSuccess)
            onCompleted()
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

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
      onCompleted()
    }
  }

  const onRemoveItem = async () => {
    const { productCategoryId } = match?.params
    const res = await productCategoryDataService.deleteProductCategoryByIdAsync(productCategoryId)
    if (res) {
      message.success(pageData.productCategoryDeleteSuccess)
      setIsChangeForm(false)
      props?.history.push('/product-category')
    } else {
      message.error(pageData.productCategoryDeleteFail)
    }
  }

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    const mess = t(pageData.leaveDialog.confirmDeleteMessage, { name })
    return mess
  }

  const onChangeStatus = active=>{
    setProductCategory(p=>({...p,isActive:!active}))
    form.setFieldValue('isActive',!active)
  }

  return (
    <>
      <Form form={form} layout="vertical" autoComplete="off" onFieldsChange={() => setIsChangeForm(true)}>
        <Row className="shop-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header edit-title">
              <PageTitle content={productCategory?.name || ''} />
              <ShopActiveStatus status={productCategory?.isActive}/>
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
            <Card className="shop-card">
              <h2 className="label-information mt-16">{pageData.generalInformation.title}</h2>
              <Row gutter={[24, 24]}>
                <Col sm={24} md={24} lg={12}>
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
                </Col>
                <Col sm={24} md={24} lg={12}>
                  <div className='shop-card-status'>
                    <h3 className="shop-form-label mt-16">
                      {pageData.generalInformation.activate}
                    </h3>
                    <Form.Item name={['isActive']}>
                      <ChangeStatusButton onChange={onChangeStatus}/>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              {/* content  */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={24} lg={12} >
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
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} >
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
                </Col>
              </Row>
              {/* description */}
              <Row gutter={[24, 24]}>
                <Col span={24}>
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
                </Col>
              </Row>
              {/* SEOConfiguration */}
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
                  <Form.Item name={'keywordSEO'}>
                    <BadgeSEOKeyword/>
                  </Form.Item>
                </Col>
              </Row>
              <Row>{renderSelectProduct()}</Row>
              {/* <Row>{renderSelectedProduct()}</Row> */}
            </Card>
          </div>
        </Row>
        <Form.Item name="id" hidden="true"></Form.Item>
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
        content={formatDeleteMessage(productCategory?.name)}
        okText={pageData.btnDelete}
        cancelText={pageData.btnIgnore}
        skipPermission={true}
        onOk={onRemoveItem}
        onCancel={() => setConfirmDeleteVisible(false)}
        visible={confirmDeleteVisible}
      />
    </>
  )
}
