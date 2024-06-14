import { DateFormat } from 'constants/string.constants';
import BlogCategoryDataService from 'data-services/blog/blog-category-data.service';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Col, Form, Row, Card, Input, Tooltip, InputNumber} from 'antd'
import FnbFroalaEditor from 'components/shop-froala-editor';
import { ExclamationIcon } from 'constants/icons.constants';
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component';
import { BadgeSEOKeyword } from 'components/badge-keyword-SEO/badge-keyword-SEO.component';
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component';
import FnbCard from 'components/shop-card/shop-card.component';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple';

export default function BlogForm({setShowConfirm, showConfirm, isChangeForm,userFullName,onCompleted}){
  const [t] = useTranslation();
  const [categories, setCategories] = useState([])
  useEffect(() => {
    getInitData()
  }, [])
  const createdTimeDefault = moment().format(DateFormat.DD_MM_YYYY)

  // validate form again if clicked submit form and change language

  const getInitData = async () => {
    await getCategories()
  }

  const getCategories = async () => {
    const resCategory = await BlogCategoryDataService.getAllBlogCategoryAsync()
    if (resCategory) {
      setCategories(resCategory)
    }
  }
  const pageData = {
    priority: {
      title: t('productCategory.titlePriority'),
      placeholder: t('productCategory.placeholderPriority'),
      validateMessage: t('productCategory.validatePriority'),
      tooltip: t('productCategory.tooltipPriority')
    },
    title: t('blog.pageTitle'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.create'),
    btnAddNew: t('button.addNew'),
    btnDiscard: t('button.discard'),
    fail: t('blog.blogCreateFail'),
    generalInformation: {
      title: t('common.generalInformation'),
      name: {
        label: t('blog.blogTitle'),
        placeholder: t('blog.blogTitlePlaceholder'),
        required: true,
        maxLength: 255,
        validateMessage: t('blog.blogTitleValidateMessage')
      },
      category: {
        label: t('blog.blogCategory'),
        placeholder: t('blog.blogCategoryPlaceholder'),
        required: true,
        blogCategoryValidateMessage: t('blog.blogCategoryValidateMessage'),
        blogCategoryNameValidateMessage: t('blog.blogCategoryNameValidateMessage'),
        blogCategoryExisted: t('blog.blogCategoryExisted')
      },
      blogContent: {
        label: t('blog.blogContent'),
        required: true,
        validateMessage: t('blog.blogContentValidateMessage'),
        blogContentPlaceholder: t('blog.blogContentPlaceholder')
      },
      description:{
        labelDescription:t('blog.labelDescription'),
        placeholderDescription:t('blog.placeholderDescription')
      }
    },
    SEO: {
      title: t('form.SEOConfiguration'),
      SEOTitle: t('form.SEOTitle'),
      SEODescription: t('form.SEODescription'),
      SEOKeywords: t('form.SEOKeywords'),
      SEOTitlePlaceholder: t('form.SEOTitlePlaceholder'),
      SEODescriptionPlaceholder: t('form.SEODescriptionPlaceholder'),
      SEOKeywordsPlaceholder: t('form.SEOKeywordsPlaceholder'),
      SEOPreview: t('form.SEOPreview'),
      SEOOverviewTooltip: t('form.SEOOverviewTooltip'),
      SEOTitleTooltip: t('form.SEOTitleTooltip'),
      SEODescriptionTooltip: t('form.SEODescriptionTooltip'),
      SEOKeywordsTooltip: t('form.SEOKeywordsTooltip'),
      keyword: {
        label: t('form.SEOKeywords'),
        placeholder: t('form.SEOKeywordsPlaceholder'),
        tooltip: t('form.SEOKeywordsTooltip'),
        btnAdd: t('form.AddSEOKeywords')
      }
    },
    media: {
      title: t('blog.media'),
      bannerTitle: t('blog.bannerTitle'),
      textNonImage: t('file.textNonImage'),
      uploadImage: t('file.uploadImage'),
      // addFromUrl: t('file.addFromUrl'),
      bestDisplayImage: t('blog.bestDisplayImage')
    },
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
    },
    createdBy: t('blog.createdBy'),
    createdTime: t('blog.createdTime'),
    limitTagMessage: t('blog.limitTagMessage'),
    createBlogSuccess: t('blog.createBlogSuccess'),
    createBlogFailed: t('blog.createBlogFailed'),
    messageMatchSuggestSEOTitle: t('form.messageMatchSuggestSEOTitle'),
    messageMatchSuggestSEODescription: t('form.messageMatchSuggestSEODescription')
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  return (
    <>
      <div className="col-input-full-width">
        <Row className="grid-container">
          <Col className="left-create-product" xs={24} sm={24} md={24} lg={24}>
            <Card className="w-100 shop-card h-auto blog-form">
              <Row className="mb-4">
                <Col span={24}>
                  <h4 className="title-group">{pageData.generalInformation.title}</h4>

                  <h4 className="shop-form-label">
                    {pageData.generalInformation.name.label}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={'name'}
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
                      id="blog-name"
                      allowClear
                      showCount
                    />
                  </Form.Item>

                  <div className="d-flex">
                    <h4 className="shop-form-label mt-16">
                      {pageData.priority.title}
                      <span className="text-danger">*</span>
                    </h4>
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

                  <h4 className="shop-form-label">
                    {pageData.generalInformation.category.label} <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={'blogCategoryId'}
                    rules={[
                      {
                        required: pageData.generalInformation.category.required,
                        message: pageData.generalInformation.category.blogCategoryValidateMessage
                      }
                    ]}
                  >
                    <FnbSelectMultiple
                      className="unit-selector"
                      placeholder={pageData.generalInformation.category.placeholder}
                      allowClear
                      noTranslateOptionName
                      option={categories?.map((item) => ({
                        id: item.id,
                        name: item.name
                      }))}
                    />
                  </Form.Item>

                  <h4 className="shop-form-label">
                    {pageData.generalInformation.blogContent.label} <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={'content'}
                    rules={[{
                      required:true,
                      message:pageData.generalInformation.blogContent.validateMessage
                    }]}
                  >
                    <FnbFroalaEditor
                      placeholder={pageData.generalInformation.blogContent.blogContentPlaceholder}
                      charCounterMax={-1}
                    />
                  </Form.Item>
                  <h4 className="shop-form-label">
                    {pageData.generalInformation.description.labelDescription}{' '}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item name={'description'}>
                    <FnbTextArea
                      rows={6}
                      placeholder={pageData.generalInformation.description.placeholderDescription}
                      maxLength={255}
                      showCount
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <br />
          </Col>

          <Col className="price-product" style={{ marginTop: '-16px' }} xs={24} sm={24} md={24} lg={24}>
            <Card className="w-100 mt-1 shop-card h-auto">
              <Row>
                <Col span={24}>
                  <h4 className="title-group">{pageData.SEO.title}</h4>
                  {/* <h4 className="shop-form-label mt-3">
                    {pageData.SEO.SEOPreview}
                    <Tooltip
                      placement="topLeft"
                      title={() => {
                        return (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: pageData.SEO.SEOOverviewTooltip
                            }}
                          ></span>
                        )
                      }}
                      className=" material-edit-cost-per-unit-tool-tip"
                    >
                      <span>
                        <ExclamationIcon />
                      </span>
                    </Tooltip>
                  </h4> */}
                  {/* <div className="create-blog-overview">
                    <span style={{ fontSize: '18px' }}>{`<meta name="title" property="title" content="${!SEOTitle ? 'SEO on Title' : SEOTitle
                      }">`}</span>
                    <br />
                    <span style={{ fontSize: '18px' }}>
                      {`<meta name="description" property="description" content="${!SEODescription ? 'SEO on Description' : SEODescription
                        }">`}
                    </span>
                    <br />
                    <span style={{ fontSize: '18px' }}>
                      {`<meta name="keywords" property="keywords" content="${keywordSEOs.length > 0 ? keywordSEOs.map((x) => x.value).join(',') : 'SEO on Keywords'
                        }">`}
                    </span>
                  </div> */}
                  <div className='d-flex'>
                    <h4 className="shop-form-label">
                      {pageData.SEO.SEOTitle}

                    </h4>
                    <Tooltip
                      placement="topLeft"
                      title={() => {
                        return (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: pageData.SEO.SEOTitleTooltip
                            }}
                          ></span>
                        )
                      }}
                      className=" material-edit-cost-per-unit-tool-tip"
                    >
                      <span className='ml-1'>
                        <ExclamationIcon />
                      </span>
                    </Tooltip>
                  </div>

                  <Form.Item
                    name={'titleSEO'}
                    rules={[{
                      min:50,
                      max:60,
                      message:pageData.messageMatchSuggestSEOTitle
                    }]}
                  >
                    <Input
                      className="shop-input-with-count"
                      placeholder={pageData.SEO.SEOTitlePlaceholder}
                      maxLength={100}
                      showCount
                    />
                  </Form.Item>
                  <div className='d-flex mt-2'>
                    <h4 className="shop-form-label d-flex justify-content-center align-items-center">
                      {pageData.SEO.SEODescription}
                    </h4>
                    <Tooltip
                      placement="topLeft"
                      title={() => {
                        return (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: pageData.SEO.SEODescriptionTooltip
                            }}
                          ></span>
                        )
                      }}
                      className=" material-edit-cost-per-unit-tool-tip"
                    >
                      <span className='ml-1'>
                        <ExclamationIcon />
                      </span>
                    </Tooltip>
                  </div>

                  <Form.Item
                    name={'descriptionSEO'}
                    rules={[{
                      min:150,
                      max:160,
                      message:pageData.messageMatchSuggestSEOTitle
                    }]}
                  >
                    <FnbTextArea
                      rows={6}
                      placeholder={pageData.SEO.SEODescriptionPlaceholder}
                      maxLength={255}
                      showCount
                    />
                  </Form.Item>

                  <div className='d-flex'>
                    <h3 className="shop-form-label mt-16">
                      {pageData.SEO.SEOKeywords}
                    </h3>
                    <Tooltip placement="topLeft" title={pageData.SEO.SEOKeywordsTooltip}>
                      <span className="pt-3 ml-1">
                        <ExclamationIcon />
                      </span>
                    </Tooltip>
                  </div>
                  {/* keyword seo */}
                  <Form.Item name={'keywordSEO'}>
                    <BadgeSEOKeyword/>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <br />
          </Col>

          <Col className="right-create-product" xs={24} sm={24} md={24} lg={24}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Card className="w-100 shop-card h-auto">
                  <h4 className="title-group">{pageData.media.title}</h4>
                  <h4 className="shop-form-label">{pageData.media.bannerTitle}</h4>
                  <Row className={'non-image'}>
                    <Col span={24} className={'image-product'}>
                      <div className='blog-image' style={{ display: 'flex' }}>
                        <Form.Item name={'thumbnail'} className='mx-auto'>
                          <FnbImageSelectComponent
                            isShowBestDisplay={false}
                            messageTooBigSize={pageData.media.imageSizeTooBig}
                            bestDisplayImage={pageData.media.bestDisplayImage}
                          />
                        </Form.Item>
                        {/* <a className="upload-image-url" hidden={image !== null}>
                          {pageData.media.addFromUrl}
                        </a> */}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <FnbCard className="mt-4">
              <Row gutter={[24, 24]}>
                <Col sm={24} lg={24} className="w-100">
                  <Row className="mb-1 mt-3 create-blog-overview">
                    <Col span={24}>
                      <div className="left-column">{pageData.createdBy}</div>
                      <div className="right-column">
                        <div className="shop-form-label-right">{userFullName || '-'}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div className="left-column">{pageData.createdTime}</div>
                      <div className="right-column">
                        <div className="shop-form-label-right">{createdTimeDefault || '-'}</div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </FnbCard>
          </Col>
        </Row>
      </div>
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
    </>
  );
}