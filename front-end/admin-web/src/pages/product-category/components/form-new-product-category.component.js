import { Card, Col, Form, Image, Input, InputNumber, message, Row, Tooltip } from 'antd'
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
import { useEffect, useState } from 'react'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { getValidationMessages } from 'utils/helpers';
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import '../index.scss'

export default function FormNewProductCategory(props) {
  const { t, onCompleted, productCategoryDataService, productDataService } = props
  const [products, setProducts] = useState([])
  const [dataSelectedProducts, setDataSelectedProducts] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [form] = Form.useForm()

  const pageData = {
    title: t('productCategory.addProductCategory'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.addNew'),
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
    content: {
      title: t('productCategory.productCategoryContent'),
      placeholder: t('productCategory.placeholderContent')
    },
    description: {
      title: t('productCategory.categoryDescription'),
      placeholder: t('productCategory.placeholderCategoryDescription')
    },
    SEOInformation: {
      title: t('form.SEOConfiguration'),
      keyword: {
        label: t('form.SEOKeywords'),
        placeholder: t('form.SEOKeywordsPlaceholder'),
        tooltip: t('form.SEOKeywordsTooltip')
      },
      SEOtitle: {
        label: t('form.SEOTitle'),
        placeholder: t('form.SEOTitlePlaceholder'),
        tooltip: t('form.SEOTitleTooltip'),
        validateMessage: t('form.messageMatchSuggestSEOTitle'),
        minlength: 50
      },
      description: {
        label: t('form.SEODescription'),
        placeholder: t('form.SEODescriptionPlaceholder'),
        validateMessage: t('form.messageMatchSuggestSEODescription'),
        minlength: 150,
        maxLength: 160,
        tooltip: t('form.SEODescriptionTooltip')
      },
    },
    productCategoryNameExisted: t('productCategory.productNameExisted'),
    productCategoryAddedSuccess: t('productCategory.productCategoryAddedSuccess'),
    leaveDialog: {
      confirmLeave: t('dialog.confirmLeave'),
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent')
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    const res = await productDataService.getAllProductsAsync()
    if (res) {
      console.log(res);
      setProducts(res.products)
    }
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
    console.log(products);
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
                id: item?.id,
                name: item?.name,
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
    form.validateFields().then(async (values) => {
      const createProductCategoryRequestModel = {
        name: values.name,
        products: dataSelectedProducts,
        priority: values.priority,
        content: values.content,
        titleSEO: values.titleSEO,
        descriptionSEO: values.descriptionSEO,
        description: values.description,
        keywordSEO: values.keywordSEO
      }
      productCategoryDataService
        .createProductCategoryAsync(createProductCategoryRequestModel)
        .then((res) => {
          if (res) {
            message.success(pageData.productCategoryAddedSuccess)
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

  const handleCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      onCompleted()
    }, DELAYED_TIME)
  }

  return (
    <>
      <Form form={form} layout="vertical" autoComplete="off" onFieldsChange={() => setIsChangeForm(true)}>
        <Row className="shop-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={pageData.title} />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <ShopAddNewButton
                      onClick={() => onSubmitForm()}
                      className="float-right"
                      type="primary"
                      text={pageData.btnAddNew}
                    ></ShopAddNewButton>
                  ),
                  permission: PermissionKeys.CREATE_PRODUCT_CATEGORY
                },
                {
                  action: (
                    <button className="action-cancel" onClick={() => onCancel()}>
                      {pageData.btnCancel}
                    </button>
                  ),
                  permission: null
                }
              ]}
            />
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
              {/* content  */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={24} lg={12} span={12}>
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
                    ></FnbTextArea>
                  </Form.Item>
                </Col>
              </Row>
              {/* SEOConfiguration */}
              <h2 className="shop-form-label mt-16">{pageData.SEOInformation.title}</h2>
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
                    <FnbTextArea
                      showCount
                      maxLength={pageData.SEOInformation.description.maxLength}
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      id="product-category-SEO-description"
                      placeholder={pageData.SEOInformation.description.placeholder}
                    ></FnbTextArea>
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

                  <Form.Item
                    name={['keywordSEO']}
                    className="item-name"
                  >
                    <Input
                      className="shop-input-with-count"
                      showCount
                      placeholder={pageData.SEOInformation.keyword.placeholder}

                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>{renderSelectProduct()}</Row>
              <Row>{renderSelectedProduct()}</Row>
            </Card>
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
        onOk={handleCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  )
}
