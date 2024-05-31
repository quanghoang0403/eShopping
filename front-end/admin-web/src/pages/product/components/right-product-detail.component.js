import { Button, Card, Col, Form, Input, Row } from 'antd';
import { FnbDeleteIcon } from 'components/shop-delete-icon/shop-delete-icon'
import { IconBtnAdd } from 'constants/icons.constants'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component';
import '../edit-product/edit-product.scss'
import { useTranslation } from 'react-i18next'
import moment from 'moment';
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single';
import { ProductGenderList } from 'constants/product-status.constants';
import ProductSizeCategoryDataService from 'data-services/product-category/product-size-category-data.service';
import RootCategoryDataService from 'data-services/product-category/product-root-category-data.service';
import productCategoryDataService from 'data-services/product-category/product-category-data.service';

export default function RightProductDetail({ form, productVariants, setProductVariants, productSizes }) {
  const { t } = useTranslation()
  const pageData = {
    productVariant: {
      title: t('product.variantInfo'),
      addVariant: t('product.addVariant'),
      label: t('product.labelVariant'),
      placeholder: t('product.placeholderVariant'),
      validateVariant: t('product.validateVariant')
    },
    productCategory: {
      label: t('product.labelCategory'),
      placeholder: t('product.placeholderCategory'),
      validateMessage: t('product.validateProductCategory')
    },
    productRootCategory: {
      label: t('product.labelProductRootCategory'),
      placeholder: t('product.placeholderProductRootCategory'),
      validateMessage: t('product.validateProductRootCategory')
    },
    gender: {
      label: t('product.labelGender'),
      placeholder: t('product.placeholderGender'),
      validateMessage: t('product.validateGender')
    },
    productSizeCategory: {
      label: t('product.labelProductSizeCategory'),
      placeholder: t('product.placeholderProductSizeCategory'),
      validateMessage: t('product.validateProductSizeCategory')
    },
    file: {
      title: t('file.title')
    },
    mediaNotExisted: t('product.validateImage')
  }

  const [productCategories, setProductCategories] = useState([])
  const [productRootCategories, setProductRootCategories] = useState([])
  const [productSizesCategory, setProductSizesCategory] = useState([])

  const fetchProductRootCategories = async () => {
    const gender = form.getFieldValue('genderProduct')
    const productRootCategories = await RootCategoryDataService.GetProductRootCategoryAsync(0, 100, '', gender)
    if (productRootCategories) setProductRootCategories(productRootCategories.result);
  }

  const fetchProductCategories = async () => {
    const gender = form.getFieldValue('genderProduct')
    const productRootCategoryId = form.getFieldValue('productRootCategoryId')
    const productCategories = await productCategoryDataService.getProductCategoriesAsync(0, 100, '', gender, productRootCategoryId)
    if (productCategories) setProductCategories(productCategories.result);
  }

  const fetchProductSizeCategories = async () => {
    const productSizeCategories = await ProductSizeCategoryDataService.GetAllProductSizeCategoryAsync()
    if (productSizeCategories) setProductSizesCategory(productSizeCategories.result);
  }

  const updateVariantName = (e, position) => {
    const updatedVariants = [...productVariants];
    updatedVariants[position].name = e.target.value;
    //setProductVariants(updatedVariants);
  }

  const onDeleteVariant = (index) => {
    const formValue = form.getFieldValue('productVariants')
    if (formValue.length > 0) {
      formValue.splice(index, 1)
      formValue.forEach((item, index) => (item.position = index))
    }
    //setProductVariants(formValue)
    form.setFieldValue('productVariants', formValue)
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    result.forEach((item, index) => (item.position = index))
    return result
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const formValue = form.getFieldValue('productVariants')
    const listVariant = reorder(formValue, result.source.index, result.destination.index)
    setProductVariants(listVariant)
    form.setFieldValue('productVariants', listVariant)
  }

  const onClickAddVariant = () => {
    const formValue = form.getFieldValue('productVariants')
    const newVariant = {
      position: productVariants.length,
      isUseBasePrice: true,
      thumbnail: '',
      name: '',
      priceValue: 0,
      priceOriginal: 0,
      priceDiscount: 0,
      percentNumber: 0,
      startDate: moment(),
      endDate: null,
      stocks: productSizes.map(size => ({
        sizeId: size.id,
        name: size.name,
        quantityLeft: 2
      }))
    }
    const listVariant = [...(formValue ?? productVariants), newVariant]
    setProductVariants(listVariant)
    form.setFieldValue('productVariants', listVariant)
    setTimeout(() => {
      const dragDropVariants = document.getElementById('dragDropVariants')
      dragDropVariants.scrollTop = dragDropVariants.scrollHeight
    }, 100)
  }

  const renderProductVariants = () => {
    return (
      <>
        <DragDropContext className="mt-4" onDragEnd={(result) => onDragEnd(result)}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="list-price">
                <div
                  id="dragDropVariants"
                  style={productVariants.length > 3 ? { height: 700, overflowY: 'scroll' } : { minHeight: productVariants.length * 64 }}
                >
                  <div style={{ minHeight: productVariants.length * 64 }}>
                    {productVariants.map((variant, index) => {
                      const position = (variant.position || 0) + 1
                      const thumbnail = form.getFieldValue(['productVariants', variant.position, 'thumbnail'])
                      return (
                        <Draggable key={variant.id} draggableId={position.toString()} index={index}>
                          {(provided) => (
                            <Row
                              className={'mb-4 pointer price-item'}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Col className="col-title">
                                <Row className="m-3 mr-4">
                                  <Col>
                                    <h3>{position + '.'} {pageData.productVariant.label}</h3>
                                  </Col>
                                  <Col className="w-100">
                                    <Form.Item
                                      name={['productVariants', variant.position, 'position']}
                                      hidden={true}
                                    >
                                      <Input />
                                    </Form.Item>
                                    <Form.Item name={['productVariants', variant.position, 'id']} hidden={true}>
                                      <Input />
                                    </Form.Item>
                                    <Form.Item
                                      name={['productVariants', variant.position, 'name']}
                                      rules={[
                                        {
                                          required: true,
                                          message: pageData.productVariant.validateVariant
                                        }
                                      ]}
                                      value={variant.name}
                                    >
                                      <Input
                                        className="shop-input"
                                        placeholder={pageData.productVariant.placeholder}
                                        id={`product-productVariants-${variant.position}-name`}
                                        onChange={(e) => updateVariantName(e, variant.position)}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col className='variant-thumnail'>
                                    <Form.Item
                                      name={['productVariants', variant.position, 'thumbnail']}
                                    >
                                      <FnbImageSelectComponent
                                        value={thumbnail}
                                        isShowBestDisplay={false}
                                        isShowTextNonImage={false}
                                        customTextNonImageClass={'create-edit-product-text-non-image'}
                                        customNonImageClass={'create-edit-product-non-image'}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Row span={2} className="icon-delete-price">
                                  <a
                                    className="m-4"
                                    onClick={() => onDeleteVariant(variant.position)}
                                  >
                                    <FnbDeleteIcon />
                                  </a>
                                </Row>
                              </Col>
                            </Row>
                          )}
                        </Draggable>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Col span={24}>
          <div className="mt-2">
            <Button
              type="primary"
              icon={<IconBtnAdd className="icon-btn-add-price" />}
              className="btn-add-price"
              onClick={onClickAddVariant}
            >
              {pageData.productVariant.addVariant}
            </Button>
          </div>
        </Col>
      </>
    )
  }

  useEffect(() => {
    fetchProductSizeCategories()
  }, [])

  useEffect(() => {
    fetchProductRootCategories()
    setProductCategories([])
  }, [form.getFieldValue('genderProduct')])

  useEffect(() => {
    fetchProductCategories()
  }, [form.getFieldValue('productRootCategoryId')])


  return (
    <Col className="right-create-product" xs={24} sm={24} md={24} lg={24}>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className="w-100 shop-card h-auto">
            <h4 className="title-group">{pageData.file.title}</h4>
            <Form.Item
              name={['thumbnail']}
              rules={[{
                required: true,
                message: pageData.mediaNotExisted
              }]}
            >
              <FnbImageSelectComponent
                customTextNonImageClass={'create-edit-product-text-non-image'}
                customNonImageClass={'create-edit-product-non-image'}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <br />
          <Card className="w-100 mt-1 shop-card h-auto">
            <h4 className="title-group">{pageData.gender.label}</h4>
            <Form.Item
              name={['genderProduct']}
              rules={[{
                required: true,
                message: pageData.gender.validateMessage
              }]}
            >
              <FnbSelectSingle
                noTranslateOptionName={true}
                option={ProductGenderList}
                placeholder={pageData.gender.placeholder}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <br />
          <Card className="w-100 mt-1 shop-card h-auto">
            <h4 className="title-group">{pageData.productRootCategory.label}</h4>
            <Form.Item
              name={['productRootCategoryId']}
              rules={[{
                required: true,
                message: pageData.productRootCategory.validateMessage
              }]}
            >
              <FnbSelectSingle
                placeholder={pageData.productRootCategory.placeholder}
                showSearch
                option={productRootCategories?.map((b) => ({
                  id: b.id,
                  name: b.name
                }))}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <br />
          <Card className="w-100 mt-1 shop-card h-auto">
            <h4 className="title-group">{pageData.productCategory.label}</h4>
            <Form.Item
              name={['productCategoryId']}
              rules={[{
                required: true,
                message: pageData.productCategory.validateMessage
              }]}
            >
              <FnbSelectSingle
                placeholder={pageData.productCategory.placeholder}
                showSearch
                option={productCategories?.map((b) => ({
                  id: b.id,
                  name: b.name
                }))}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <br />
          <Card className="w-100 mt-1 shop-card h-auto">
            <h4 className="title-group">{pageData.productSizeCategory.label}</h4>
            <Form.Item
              name={['productSizeCategoryId']}
              rules={[{
                required: true,
                message: pageData.productSizeCategory.validateMessage
              }]}
            >
              <FnbSelectSingle
                placeholder={pageData.productCategory.placeholder}
                showSearch
                option={productSizesCategory?.map((b) => ({
                  id: b.id,
                  name: b.name
                }))}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <br />
          <Card className="w-100 mt-1 shop-card h-auto">
            <h4 className="title-group">{pageData.productVariant.title}</h4>
            {renderProductVariants()}
          </Card>
        </Col>
      </Row>
    </Col>
  );
}
