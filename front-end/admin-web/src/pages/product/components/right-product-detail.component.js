import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react'
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component';
import '../edit-product/edit-product.scss'
import { useTranslation } from 'react-i18next'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single';
import { ProductGenderList } from 'constants/product-status.constants';
import ProductSizeCategoryDataService from 'data-services/product-category/product-size-category-data.service';
import RootCategoryDataService from 'data-services/product-category/product-root-category-data.service';
import productCategoryDataService from 'data-services/product-category/product-category-data.service';

export default function RightProductDetail({ form }) {
  const { t } = useTranslation()
  const pageData = {
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
    </Col>
  );
}
