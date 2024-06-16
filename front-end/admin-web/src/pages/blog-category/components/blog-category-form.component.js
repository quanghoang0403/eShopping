import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple';
import FnbFroalaEditor from 'components/shop-froala-editor';
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component';
import { Row, Col, Form, Card, Input, InputNumber, Tooltip } from 'antd';
import { BadgeSEOKeyword } from 'components/badge-keyword-SEO/badge-keyword-SEO.component'
import { ExclamationIcon } from 'constants/icons.constants';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import BlogDataService from 'data-services/blog/blog-data.service';
export default function BlogCategoryForm(){
  const [t] = useTranslation()
  const [blogs, setBlogs] = useState([])
  const pageData = {
    title: t('blogCategory.pageTitle'),
    btnDiscard: t('button.discard'),
    createSuccess: t('blogCategory.addBlogCategorySuccess'),
    createFail: t('blogCategory.addBlogCategoryFail'),
    btnSave: t('button.save'),
    btnCancel: t('button.cancel'),
    description: {
      title: t('blogCategory.labelDescription'),
      placeholder: t('blogCategory.placeholderDescription'),
      maxLength: 200
    },
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
    },
    generalInformation: {
      title: t('common.generalInformation'),
      name: {
        title: t('blogCategory.blogCategoryTitle'),
        placeholder: t('blogCategory.blogCategoryTitlePlaceholder'),
        validateMessage: t('blogCategory.blogCategoryNameValidation'),
        required: true,
        maxLength: 255
      },
      priority: {
        title: t('blogCategory.priority'),
        placeholder: t('blogCategory.placeholderPriority'),
        validateMessage: t('blogCategory.validatePriority'),
        required: true,
        tooltip: t('productCategory.tooltipPriority')
      },
      content: {
        title: t('blogCategory.blogCategoryContent'),
        placeholder: t('blogCategory.placeholderContent')
      },
      blogs: {
        title: t('blogCategory.addBlog'),
        placeholder: t('blogCategory.placeholderAddBlog')
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
        minlength: 50
      },
      description: {
        label: t('form.SEODescription'),
        placeholder: t('form.SEODescriptionPlaceholder'),
        validateMessage: t('form.messageMatchSuggestSEODescription'),
        minlength: 150,
        maxLength: 250,
        tooltip: t('form.SEODescriptionTooltip')
      }
    }
  }

  useEffect(() => {
    const getInitData = async () => {
      const blogs = await BlogDataService.getAllBlogsAsync();
      if (blogs) {
        setBlogs(blogs)
      }
    }
    getInitData();
  }, [])
  return(
    <Row gutter={[8, 8]}>
      <Col xs={24} sm={24} md={24} lg={16}>
        <Card className="w-100 shop-card h-auto" >
          <h4 className="title-group">{pageData.generalInformation.title}</h4>
          <Row className="mb-4">
            <Col span={24}>
              <h4 className="shop-form-label">
                {pageData.generalInformation.name.title}
                <span className="text-danger mx-1">*</span>
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
                  className="shop-input"
                  placeholder={pageData.generalInformation.name.placeholder}
                  maxLength={pageData.generalInformation.name.maxLength}
                  id="blog-category-name"
                  allowClear
                  showCount
                />
              </Form.Item>

              <div className="d-flex">
                <h4 className="shop-form-label">
                  {pageData.generalInformation.priority.title}
                </h4>
                <span className="text-danger mx-1">*</span>
                <Tooltip placement="topLeft" title={pageData.generalInformation.priority.tooltip}>
                  <span>
                    <ExclamationIcon />
                  </span>
                </Tooltip>
              </div>

              <Form.Item
                name={['priority']}
                rules={[
                  {
                    required: pageData.generalInformation.priority.required,
                    message: pageData.generalInformation.priority.validateMessage
                  }
                ]}
                validateFirst={true}
              >
                <InputNumber
                  placeholder={pageData.generalInformation.priority.placeholder}
                  className="shop-input-number w-100"
                  min={1}
                  max={1000000}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

              <h4 className="shop-form-label mt-16">
                {pageData.description.title}
              </h4>
              <Form.Item
                name={['description']}
                className="item-name"
              >
                <FnbTextArea
                  showCount
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  id="blog-category-description"
                  placeholder={pageData.description.placeholder}
                  maxLength={pageData.description.maxLength}
                ></FnbTextArea>
              </Form.Item>

              <h4 className="shop-form-label">
                {pageData.generalInformation.content.title}
              </h4>
              <Form.Item
                name={['content']}
              >
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
              >
                <Input
                  className="shop-input-with-count"
                  showCount
                  placeholder={pageData.SEOInformation.SEOtitle.placeholder}
                  minLength={pageData.SEOInformation.SEOtitle.minlength}
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
              >
                <FnbTextArea
                  showCount
                  maxLength={pageData.SEOInformation.description.maxLength}
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  id="blog-category-SEO-description"
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
              <Form.Item name={'keywordSEO'}>
                <BadgeSEOKeyword/>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={24} lg={8}>
        <Card className="w-100 shop-card h-auto">
          <h4 className="title-group">{pageData.generalInformation.blogs.title}</h4>
          <Row className="mb-4">
            <Form.Item
              name={['blogs']}
              className={'w-100'}
            >
              <FnbSelectMultiple
                placeholder={pageData.generalInformation.blogs.placeholder}
                option={blogs}
              />
            </Form.Item>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}