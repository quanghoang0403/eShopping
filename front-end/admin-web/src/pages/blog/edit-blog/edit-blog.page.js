import { Button, Card, Col, Form, Input, InputNumber, Row, Tooltip, message } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import FnbCard from 'components/shop-card/shop-card.component'
import FnbFroalaEditor from 'components/shop-froala-editor'
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME } from 'constants/default.constants'
import { ExclamationIcon} from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import {
  formatNumber,
  getValidationMessages
} from 'utils/helpers'
import './edit-blog.page.scss'
import BlogDataService from 'data-services/blog/blog-data.service'
import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple'
import BlogCategoryDataService from 'data-services/blog/blog-category-data.service'
import { BadgeSEOKeyword } from 'components/badge-keyword-SEO/badge-keyword-SEO.component'
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import moment from 'moment'

export default function EditBlogPage(props) {
  const [t] = useTranslation()
  const history = useHistory()
  const [blockNavigation, setBlockNavigation] = useState(false)
  const [categories, setCategories] = useState([])
  const [disableCreateButton, setDisableCreateButton] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [blogName, setBlogName] = useState('')
  const [blog, setBlog] = useState({})
  const [keywordSEOs, setKeywordSEOList] = useState([]);
  const [keywordSEO, setKeywordSEO] = useState({})
  const [isKeywordSEOChange, setIsKewwordSEOChange] = useState(false)

  useEffect(() => {
    getInitData()
  }, [])

  const [form] = Form.useForm()
  const pageData = {
    priority: {
      title: t('productCategory.titlePriority'),
      placeholder: t('productCategory.placeholderPriority'),
      validateMessage: t('productCategory.validatePriority'),
      tooltip: t('productCategory.tooltipPriority')
    },
    btnCancel: t('button.cancel'),
    btnUpdate: t('button.edit'),
    btnAddNew: t('button.addNew'),
    btnDiscard: t('button.discard'),
    generalInformation: {
      title: t('common.generalInformation'),
      name: {
        label: t('blog.blogTitle'),
        placeholder: t('blog.blogTitlePlaceholder'),
        required: true,
        maxLength: 255,
        validateMessage: t('blog.blogTitleValidateMessage')
      },
      blogCategory: {
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
      bestDisplayImage: t('blog.bestDisplayImage'),
      imageSizeTooBig: t('file.imageSizeTooBig')
    },
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
    },
    createdBy: t('blog.createdBy'),
    createdTime: t('blog.createdTime'),
    updatedTime: t('blog.updatedTime'),
    limitTagMessage: t('blog.limitTagMessage'),
    updateBlogSuccess: t('blog.updateBlogSuccess'),
    updateBlogFailed: t('blog.updateBlogFailed'),
    view: t('blog.view'),
    messageMatchSuggestSEOTitle: t('form.messageMatchSuggestSEOTitle'),
    messageMatchSuggestSEODescription: t('form.messageMatchSuggestSEODescription')
  }

  useEffect(() => {
    getInitData()
  }, [])

  // validate form again if clicked submit form and change language

  const getInitData = async () => {
    const { id } = props?.match?.params
    await getCategories()
    await BlogDataService
      .getBlogByIdAsync(id)
      .then((res) => {
        setBlog(res)
        mappingData(res)
      })
      .catch((errors) => {
        message.error(errors.message)
      })
  }

  const mappingData = (data) => {
    // mapping banner
    setBlogName(data?.name)
    setKeywordSEOList(data?.keywordSEO?.split(',').map(kw => { return { id: kw, value: kw } }) || [])
    // mapping general
    form.setFieldsValue({
      ...data,
      blogCategoryId: data?.blogCategories.map(b => b.id)
    })
  }

  const getCategories = async () => {
    const resCategory = await BlogCategoryDataService.getAllBlogCategoryAsync()
    if (resCategory) {
      setCategories(resCategory)
    }
  }

  const onSubmitForm = () => {
    form
      .validateFields()
      .then(async (values) => {
        const request = {
          blogDetailModel: {
            ...values,
            author: blog.author,
            id: props?.match?.params?.id,
            keywordSEO: keywordSEOs.map(kw => kw.value)?.join(',') || null
          }
        }
        const res = await BlogDataService.editBlogAsync(request.blogDetailModel)
        if (res) {
          message.success(pageData.updateBlogSuccess)
          onCompleted()
        }
      })
      .catch((errors) => {
        form.setFields(getValidationMessages(errors));
        message.error(errors.message)

      })
  }

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
      onCompleted()
      return history.push('/blog')
    }
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const onCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      return history.push('/blog')
    }, DELAYED_TIME)
  }

  const changeForm = () => {
    setIsChangeForm(true)
    setDisableCreateButton(false)
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
  return (
    <>
      <Row className="shop-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={blogName} />
          </p>
        </Col>
        <Col span={12} xs={24} sm={24} md={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={disableCreateButton}
                    className="btn-add-product"
                    onClick={onSubmitForm}
                  >
                    {pageData.btnUpdate}
                  </Button>
                ),
                permission: PermissionKeys.CREATE_BLOG
              },
              {
                action: (
                  <a onClick={() => onCancel()} className="action-cancel">
                    {pageData.btnCancel}
                  </a>
                ),
                permission: null
              }
            ]}
          />
        </Col>
      </Row>
      <Form
        form={form}
        name="basic"
        className="edit-blog"
        onFieldsChange={() => changeForm()}
        autoComplete="off"
        onChange={() => {
          if (!blockNavigation) setBlockNavigation(true)
        }}
      >
        <div className="col-input-full-width">
          <Row gutter={[12, 0]}>
            <Col xs={24} sm={24} md={16} lg={16} xl={15} xxl={16}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card className="w-100 shop-card h-auto">
                  <Row className="mb-4">
                    <Col span={24}>
                      <h4 className="title-group">
                        {pageData.generalInformation.title}
                      </h4>
                      <h4 className="shop-form-label">
                        {pageData.generalInformation.name.label}
                        <span className="text-danger">*</span>
                      </h4>
                      <Form.Item
                        name={'name'}
                        rules={[
                          {
                            required: pageData.generalInformation.name.required,
                            message:
                              pageData.generalInformation.name.validateMessage
                          }
                        ]}
                        validateFirst={true}
                      >
                        <Input
                          className="shop-input"
                          placeholder={
                            pageData.generalInformation.name.placeholder
                          }
                          maxLength={pageData.generalInformation.name.maxLength}
                          id="product-name"
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
                        {pageData.generalInformation.blogCategory.label}{' '}
                        <span className="text-danger">*</span>
                      </h4>
                      <Form.Item
                        name={'blogCategoryId'}
                        rules={[
                          {
                            required:
                              pageData.generalInformation.blogCategory.required,
                            message:
                              pageData.generalInformation.blogCategory
                                .blogCategoryValidateMessage
                          }
                        ]}
                      >
                        <FnbSelectMultiple
                          // onChange={onChangeOption}
                          className="unit-selector"
                          placeholder={
                            pageData.generalInformation.blogCategory.placeholder
                          }
                          allowClear
                          noTranslateOptionName
                          option={categories?.map((item) => ({
                            id: item.id,
                            name: item.name
                          }))}
                        />
                      </Form.Item>

                      <h4 className="shop-form-label">
                        {pageData.generalInformation.blogContent.label}{' '}
                        <span className="text-danger">*</span>
                      </h4>
                      <Form.Item name={'content'} rules={[{required:true,message:pageData.generalInformation.blogContent.validateMessage}]}>
                        <FnbFroalaEditor
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

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
                      {/* <div className="edit-blog-overview">
                        <span
                          style={{ fontSize: '18px' }}
                        >{`<meta name="title" property="title" content="${!titleSEO ? 'SEO on Title' : titleSEO
                          }">`}</span>
                        <br />
                        <span style={{ fontSize: '18px' }}>
                          {`<meta name="description" property="description" content="${!descriptionSEO
                            ? 'SEO on Description'
                            : descriptionSEO
                            }">`}
                        </span>
                        <br />
                        <span style={{ fontSize: '18px' }}>
                          {`<meta name="keywords" property="keywords" content="${keywordSEOs.length > 0
                            ? keywordSEOs.map((x) => x.value).join(',')
                            : 'SEO on Keywords'
                            }">`}
                        </span>
                      </div> */}
                      <h4 className="shop-form-label d-flex">
                        {pageData.SEO.SEOTitle}
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
                          className="material-edit-cost-per-unit-tool-tip"
                        >
                          <span className='ml-2'>
                            <ExclamationIcon />
                          </span>
                        </Tooltip>
                      </h4>
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

                      <h4 className="shop-form-label d-flex mt-2">
                        {pageData.SEO.SEODescription}
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
                          <span className='ml-2'>
                            <ExclamationIcon />
                          </span>
                        </Tooltip>
                      </h4>
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

                      <h4 className="shop-form-label d-flex">
                        {pageData.SEO.SEOKeywords}
                        <Tooltip
                          placement="topLeft"
                          title={() => {
                            return (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: pageData.SEO.SEOKeywordsTooltip
                                }}
                              ></span>
                            )
                          }}
                          className=" material-edit-cost-per-unit-tool-tip"
                        >
                          <span className='ml-2'>
                            <ExclamationIcon />
                          </span>
                        </Tooltip>
                      </h4>
                      <div>
                        {
                          keywordSEOs.length > 0 ? <BadgeSEOKeyword onClose={removeSEOKeyword} keywords={keywordSEOs} /> : ''
                        }

                        <div className='d-flex mt-2'>
                          <Input
                            className="shop-input-with-count"
                            showCount
                            value={keywordSEO?.value || ''}
                            placeholder={pageData.SEO.SEOKeywordsPlaceholder}
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
                            permission={PermissionKeys.CREATE_BLOG}
                            disabled={!isKeywordSEOChange}
                            text={pageData.SEO.keyword.btnAdd}
                            className={'mx-4'}
                            onClick={addSEOKeywords}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
                <br />
              </Col>
            </Col>

            {/* <Col xs={24} sm={24} md={16} lg={16} xl={15} xxl={16}> */}

            <Col xs={24} sm={24} md={8} lg={8} xl={9} xxl={8}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Card className="w-100 shop-card h-auto">
                      <h4 className="title-group">{pageData.media.title}</h4>
                      <h4 className="shop-form-label">
                        {pageData.media.bannerTitle}
                      </h4>
                      <Form.Item name={'thumbnail'}>
                        <FnbImageSelectComponent
                          messageTooBigSize={pageData.media.imageSizeTooBig}
                          isShowBestDisplay={true}
                          bestDisplayImage={pageData.media.bestDisplayImage}
                        />
                      </Form.Item>

                    </Card>
                  </Col>
                </Row>
                <FnbCard className="mt-4">
                  <Row gutter={[24, 24]}>
                    <Col sm={24} lg={24} className="w-100">
                      <Row className="mb-1 mt-3 edit-blog-overview-odd">
                        <Col span={24}>
                          <div className="left-column">{pageData.createdBy}</div>
                          <div className="right-column">
                            <div className="shop-form-label-right">
                              {blog?.author
                                ? blog?.author
                                : '-'}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="edit-blog-overview-even">
                        <Col span={24}>
                          <div className="left-column">
                            {pageData.createdTime}
                          </div>
                          <div className="right-column">
                            <div className="shop-form-label-right">
                              {blog?.createdTime
                                ? moment(blog?.createdTime)?.format(
                                  DateFormat.DD_MM_YYYY
                                )
                                : '-'}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-1 mt-3 edit-blog-overview-odd">
                        <Col span={24}>
                          <div className="left-column">{pageData.updatedTime}</div>
                          <div className="right-column">
                            <div className="shop-form-label-right">
                              {blog?.lastSavedTime
                                ? moment(blog?.lastSavedTime)?.format(DateFormat.DD_MM_YYYY)
                                : '-'}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="edit-blog-overview-even">
                        <Col span={24}>
                          <div className="left-column">{pageData.view}</div>
                          <div className="right-column">
                            <div className="shop-form-label-right">
                              {formatNumber(blog?.viewCount)}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </FnbCard>
              </Col>
            </Col>
          </Row>
        </div>
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
    </>
  )
}
