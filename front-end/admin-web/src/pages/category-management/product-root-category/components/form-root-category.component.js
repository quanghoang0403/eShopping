import { useTranslation } from 'react-i18next'
import { ProductGender } from 'constants/product-status.constants';
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single';
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component';
import { ExclamationIcon } from 'constants/icons.constants';
import { BadgeSEOKeyword } from 'components/badge-keyword-SEO/badge-keyword-SEO.component';
import { Card, Col, Form, Input, InputNumber, Row, Tooltip, message } from 'antd';
import ChangeStatusButton from 'components/shop-change-active-status-button/shop-change-active-status-button.component';
export default function ProductRootCategoryForm(props){
  const {isEdit, onChangeStatus} = props
  const [t] = useTranslation()
  const pageData = {
    activate: t('product.activate'),
    title: t('root-category.createTitle'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.addNew'),
    btnDiscard: t('button.discard'),
    productCategoryAddedSuccess: t('productCategory.productCategoryAddedSuccess'),
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
    leaveDialog: {
      confirmLeave: t('dialog.confirmLeave'),
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent')
    }
  }

  return(
    <Row>
      <div className="w-100">
        <h2>{pageData.generalInformation.title}</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={24} lg={16}>
            <Card className="shop-card">

              {/* name */}
              <div className="d-flex justify-content-center align-items-center">
                <h3 className="shop-form-label mt-16">
                  {pageData.generalInformation.name.label}
                </h3>
                <span className="text-danger">*</span>
              </div>
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

              {/* content and priority */}
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={24} md={24} lg={12}>
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
                <Col xs={24} sm={24} md={24} lg={12}>
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

              {/* description form */}
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
          <Col xs={24} sm={24} md={24} lg={8}>
            <Card className={`w-100 shop-card shop-card-status ${!isEdit && 'd-none'}`}>
              <div className='d-flex align-items-center'>
                <h3 className='mr-5'>{pageData.activate}</h3>
                <Form.Item name={'isActive'}>
                  <ChangeStatusButton onChange={onChangeStatus}/>
                </Form.Item>
              </div>
            </Card>
            <Card className={`shop-card ${isEdit && 'mt-4'}`}>
              <h3>{pageData.gender.genderCategory}</h3>
              <Form.Item
                name={['genderProduct']}
                className="item-name"
                initialValue={ProductGender.All}
              >
                <FnbSelectSingle
                  noTranslateOptionName={true}
                  option={Object.keys(ProductGender).map(gender => {
                    return {
                      id: ProductGender[gender],
                      name: gender
                    }
                  })}
                  defaultValue={ProductGender.All}
                  placeholder={pageData.gender.placeholderGender}
                />
              </Form.Item>

            </Card>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <h2 className="shop-form-label mt-16">{pageData.SEOInformation.title}</h2>
            <Card className="shop-card">
              {/* title SEO */}
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

              {/* descriptionSEO */}
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

              {/* keywordSEO */}
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
            </Card>

          </Col>
        </Row>
      </div>
    </Row>
  )
}