import { Card, Col, Form, Image, Input, InputNumber, message, Row, Space, Tooltip } from 'antd'
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
// import productCategoryDataService from 'data-services/product-category/product-category-data.service'
// import productDataService from 'data-services/product/product-data.service'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { getValidationMessages } from 'utils/helpers'

import '../index.scss'

export default function EditProductCategoryPage (props) {
  const [t] = useTranslation()
  const history = useHistory()
  const match = useRouteMatch()
  const [form] = Form.useForm()
  const [products, setProducts] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [currentName, setCurrentName] = useState('')
  const [title, setTitle] = useState('')
  const [productCategoryName, setProductCategoryName] = useState('')
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)

  const pageData = {
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnUpdate: t('button.update'),
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
    getProducts()
    getEditData()
  }, [])

  const onCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      history?.push('/category')
    }, DELAYED_TIME)
  }

  const getEditData = () => {
    // const { productCategoryId } = match?.params
    // if (productCategoryId) {
    //   productCategoryDataService.getProductCategoryByIdAsync(productCategoryId).then((response) => {
    //     if (response) {
    //       const { productCategory } = response
    //       /// Handle set data
    //       if (productCategory.products) {
    //         setDataSelectedProducts(productCategory.products)
    //         setProductCategoryName(productCategory.name)
    //       }
    //       setTitle(productCategory.name)
    //       setCurrentName(productCategory.name)

    //       form.setFieldsValue({
    //         id: productCategory.id,
    //         name: productCategory.name,
    //         priority: productCategory.priority,
    //         productIds: productCategory.products?.map((x) => x.id)
    //       })
    //     }
    //   })
    // }
  }

  const getProducts = () => {
    productDataService.getAllProductsAsync().then((res) => {
      if (res) {
        setProducts(res.products)
      }
    })
  }

  const onSelectProduct = (ids) => {
    const productIds = ids
    const productList = []
    productIds.forEach((productId, index) => {
      const product = products.find((p) => p.id === productId)
      if (product) {
        const newProduct = { ...product, position: index + 1 }
        productList.push(newProduct)
      }
    })
    setDataSelectedProducts(productList)
  }

  const onDeleteSelectedProduct = (productId) => {
    let restProducts = dataSelectedProducts.filter((o) => o.id !== productId)
    restProducts = restProducts.map((product, index) => ({
      ...product,
      position: index + 1
    }))
    setDataSelectedProducts(restProducts)

    /// Set form value
    const formValues = form.getFieldsValue()
    let { productIds } = formValues
    productIds = productIds.filter((pid) => pid !== productId)
    form.setFieldsValue({ ...formValues, productIds })
  }

  const renderSelectProduct = () => {
    return (
      <>
        <Col span={24}>
          <h3 className="shop-form-label mt-16">{pageData.product.title}</h3>
          <Form.Item name="productIds">
            <FnbSelectMultipleProduct
              showSearch
              allowClear
              placeholder={pageData.product.placeholder}
              onChange={(value) => onSelectProduct(value)}
              className="w-100"
              listHeight={480}
              option={products?.map((item) => ({
                id: item.id,
                name: item.name,
                thumbnail: item?.thumbnail
              }))}
            ></FnbSelectMultipleProduct>
          </Form.Item>
        </Col>
      </>
    )
  }
  // #region Handle drag drop
  const DragHandle = sortableHandle(({ component }) => {
    return (
      <Row gutter={[16, 16]} className="all-scroll">
        <Col span={1}>
          <div className="drag-handle">
            <PolygonIcon />
          </div>
        </Col>
        <Col span={23}>{component()}</Col>
      </Row>
    )
  })

  const renderProductInfo = (product) => {
    return (
      <div className="product-info">
        <div className="product-position">
          <span>{product?.position}</span>
        </div>
        <div className="image-box">
          <Image src={product?.thumbnail || images.imgDefault} preview={false} />
        </div>
        <div className="product-name">
          <span>{product?.name}</span>
        </div>
      </div>
    )
  }

  const SortableItem = sortableElement(({ product }) => {
    return (
      <>
        <div className="selected-product-card mt-3">
          <Row>
            <Col span={22}>
              <DragHandle component={() => renderProductInfo(product)}></DragHandle>
            </Col>
            <Col span={2}>
              <div className="delete-icon">
                <TrashFill onClick={() => onDeleteSelectedProduct(product?.id)} />
              </div>
            </Col>
          </Row>
        </div>
      </>
    )
  })

  const onSortEnd = ({ oldIndex, newIndex }) => {
    let arraySorted = arrayMoveImmutable(dataSelectedProducts, oldIndex, newIndex)
    arraySorted = arraySorted.map((product, index) => ({
      ...product,
      position: index + 1
    }))
    setDataSelectedProducts(arraySorted)
  }

  const SortableList = sortableContainer(({ items }) => {
    return (
      <div className="selected-product-width mt-16">
        {items.map((value, index) => (
          <SortableItem key={value.id} index={index} product={value} />
        ))}
      </div>
    )
  })

  const renderSelectedProduct = () => {
    return <SortableList items={dataSelectedProducts} onSortEnd={onSortEnd} useDragHandle />
  }
  // #endregion

  const onSubmitForm = () => {
    // form.validateFields().then((values) => {
    //   const updateProductCategoryRequestModel = {
    //     id: values.id,
    //     name: values.name,
    //     products: dataSelectedProducts,
    //     priority: values.priority
    //   }

    //   productCategoryDataService
    //     .updateProductCategoryAsync(updateProductCategoryRequestModel)
    //     .then((response) => {
    //       if (response) {
    //         message.success(pageData.productCategoryUpdateSuccess)
    //         onCompleted()
    //       }
    //     })
    //     .catch((errs) => {
    //       form.setFields(getValidationMessages(errs))
    //     })
    // })
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
    // const res = await productCategoryDataService.deleteProductCategoryByIdAsync(productCategoryId)
    // if (res) {
    //   message.success(pageData.productCategoryDeleteSuccess)
    //   props?.history.push('/category')
    // } else {
    //   message.error(pageData.productCategoryDeleteFail)
    // }
  }

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    const mess = t(pageData.leaveDialog.confirmDeleteMessage, { name })
    return mess
  }

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
            <Card className="shop-card">
              <h2 className="label-information mt-16">{pageData.generalInformation.title}</h2>
              <Row gutter={[24, 24]}>
                <Col span={24}>
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
              </Row>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={24} lg={12} span={12}>
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
              </Row>
              <Row>{renderSelectProduct()}</Row>
              <Row>{renderSelectedProduct()}</Row>
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
        content={formatDeleteMessage(productCategoryName)}
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
