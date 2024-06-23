import { Card, Col, Form, Input, Row, Tooltip } from 'antd';
import { ExclamationIcon } from 'constants/icons.constants';
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import React, { useEffect, useState } from 'react'
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component';
import '../edit-product/edit-product.scss'
import { useTranslation } from 'react-i18next'
import FnbFroalaEditor from 'components/shop-froala-editor';
import { BadgeSEOKeyword } from 'components/badge-keyword-SEO/badge-keyword-SEO.component';

export default function LeftProductDetail({ form, productData }) {
  const { t } = useTranslation()
  const pageData = {
    generalInformation: {
      title: t('product.titleInfo'),
      name: {
        label: t('product.labelName'),
        placeholder: t('product.placeholderName'),
        required: true,
        maxLength: 100,
        validateMessage: t('product.validateName')
      },
      description: {
        label: t('product.labelDescription'),
        placeholder: t('product.placeholderDescription'),
        required: false,
        maxLength: 255
      },
      labelGallery: t('product.labelGallery'),
      content: {
        label: t('product.labelProductContent'),
        placeholder: t('product.placeholderProductContent')
      }
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
    }
  }

  return (
    <Col className="left-create-product" xs={24} sm={24} md={24} lg={24}>
      <Card className="w-100 shop-card h-auto">
        <Row>
          <Col span={24}>
            <h4 className="title-group">{pageData.generalInformation.title}</h4>

            <h4 className="shop-form-label">
              {pageData.generalInformation.name.label}
              <span className="text-danger">*</span>
            </h4>
            <Form.Item
              name={['name']}
              rules={[
                {
                  required: pageData.generalInformation.name.required,
                  message: pageData.generalInformation.name.validateMessage
                }
              ]}
              validateFirst={true}
            >
              <Input
                showCount
                className="shop-input-with-count"
                placeholder={pageData.generalInformation.name.placeholder}
                maxLength={pageData.generalInformation.name.maxLength}
                id="product-name"
              />
            </Form.Item>

            <h4 className="shop-form-label">{pageData.generalInformation.labelGallery}</h4>
            <Form.Item name={['gallery']} rules={[]}>
              <FnbImageSelectComponent
                maxNumber={10}
                customTextNonImageClass={'create-edit-product-text-non-image'}
                customNonImageClass={'create-edit-product-non-image'}
              />
            </Form.Item>

            <h4 className="shop-form-label">{pageData.generalInformation.description.label}</h4>
            <Form.Item name={['description']} rules={[]}>
              <FnbTextArea
                showCount
                maxLength={pageData.generalInformation.description.maxLength}
                rows={3}
                id="product-description"
              />
            </Form.Item>
            <h4 className="shop-form-label">{pageData.generalInformation.content.label}</h4>
            <Form.Item name={['content']} rules={[]}>
              <FnbFroalaEditor
                placeholder={pageData.generalInformation.content.placeholder}
                charCounterMax={-1}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <br />
      <Card className="w-100 mt-1 shop-card h-auto">
        <Row>
          <Col span={24}>
            <h4 className="title-group">{pageData.SEOInformation.title}</h4>
            <div className='d-flex'>
              <h4 className="shop-form-label mt-16">{pageData.SEOInformation.SEOtitle.label}</h4>
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
                // {
                //   min: pageData.SEOInformation.SEOtitle.minlength,
                //   message: pageData.SEOInformation.SEOtitle.validateMessage
                // }
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
                // {
                //   min: pageData.SEOInformation.description.minlength,
                //   message: pageData.SEOInformation.description.validateMessage
                // }
              ]}
            >
              <FnbTextArea
                showCount
                maxLength={pageData.SEOInformation.description.maxLength}
                rows={3}
                id="product-category-SEO-description"
                placeholder={pageData.SEOInformation.description.placeholder}
              ></FnbTextArea>
            </Form.Item>

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

            <Form.Item name={['keywordSEO']} rules={[]}>
              <BadgeSEOKeyword />
            </Form.Item>
            <Form.Item hidden
              name={['isFeatured']}
              rules={[]}
            >
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}
