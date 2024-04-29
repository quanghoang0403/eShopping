import { Button, Card, Col, Form, Input, Row, Tooltip, Typography, message, Divider, Space, InputNumber } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import FnbCard from 'components/shop-card/shop-card.component'
import FnbFroalaEditor from 'components/shop-froala-editor'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { FnbUploadImageComponent } from 'components/shop-upload-image/shop-upload-image.component'
import PageTitle from 'components/page-title'
import SelectBlogTagComponent from '../components/select-tag-blog.components'
import TextDanger from 'components/text-danger'
import { DELAYED_TIME } from 'constants/default.constants'
import { ExclamationIcon, IconBtnAdd, WarningIcon } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import blogDataService from 'data-services/blog/blog-data.service'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { convertSeoUrl } from 'utils/helpers'
import './create-blog.page.scss'
import moment from 'moment'
import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple'
import BlogCategoryDataService from 'data-services/blog/blog-category-data.service'
import { BadgeSEOKeyword, SEO_KEYWORD_COLOR_LENGTH } from 'components/badge-keyword-SEO/badge-keyword-SEO.component'
const { Text } = Typography

export default function CreateBlogPage() {
  const [t] = useTranslation()
  const history = useHistory()
  const [blockNavigation, setBlockNavigation] = useState(false)
  const [image, setImage] = useState(null)

  const [categories, setCategories] = useState([])
  const [disableCreateButton, setDisableCreateButton] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isClickSubmitForm, setIsClickSubmitForm] = useState(false)
  const [tagDataTemp, setTagDataTemp] = useState([])
  const [tags, setTags] = useState([])
  const [tagError, setTagError] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState(null)
  const [showCategoryNameValidateMessage, setShowCategoryNameValidateMessage] = useState(false)
  const [isCategoryNameExisted, setIsCategoryNameExisted] = useState(false)
  const [SEOUrlLink, setSEOUrlLink] = useState('')
  const [SEOTitle, setSEOTitle] = useState('')
  const [SEODescription, setSEODescription] = useState('')
  const [blogContent, setBlogContent] = useState('')
  const [showBlogContentValidateMessage, setShowBlogContentValidateMessage] = useState(false)
  const [blogName, setBlogName] = useState('')
  const reduxState = useSelector((state) => state)
  const state = useSelector((state) => state)
  const userFullName = state?.session?.currentUser?.fullName
  const createdTimeDefault = moment().format(DateFormat.DD_MM_YYYY)
  const [isShowWarningSEOTitle, setIsShowWarningSEOTitle] = useState(false)
  const [isShowWarningSEODescription, setIsShowWarningSEODescription] = useState(false)
  const [keywordSEOs,setKeywordSEOList] = useState([]);
  const [keywordSEO,setKeywordSEO] = useState({})
  const [isKeywordSEOChange,setIsKewwordSEOChange] = useState(false)

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
    title: t('blog.pageTitle'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.create'),
    btnAddNew: t('button.addNew'),
    btnDiscard: t('button.discard'),
    fail:t('blog.blogCreateFail'),
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
        btnAdd:t('form.AddSEOKeywords')
      },
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

  useEffect(() => {
    getInitData()
  }, [])

  // validate form again if clicked submit form and change language

  const getInitData = async () => {
    await getCategories()
  }

  const getCategories = async () => {
    const resCategory = await BlogCategoryDataService.getAllBlogCategoryAsync()
    if (resCategory) {
      setCategories(resCategory.blogCategories)
    }
  }

  const onSubmitForm = () => {
    setIsClickSubmitForm(true)
    if (blogContent.length === 0) {
      setShowBlogContentValidateMessage(true)
      return
    }
    form
      .validateFields()
      .then(async (values) => {
        const request = {
          ...values,
          content: blogContent,
          thumbnail: image?.url,
          description: blogContent.replace(/<.*?>/gm, '').slice(0, 200),
          keywordSEO:keywordSEOs.map(kw=>kw.value)?.join(',') || null,
          author:userFullName || ''
        }
        const res = await blogDataService.createBlogAsync(request)
        if (res) {
          message.success(pageData.createBlogSuccess)
          onCompleted()
        } else {
          message.error(pageData.fail)
        }
      })
      .catch((errors) => { 
        if (errors?.errorFields?.length > 0) {
          const elementId = `basic_${errors?.errorFields[0]?.name.join('_')}_help`
          scrollToElement(elementId)
        }
        message.error(errors)
      })
  }
  const scrollToElement = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }
  const onChangeImage = (file) => {
    setImage(file)
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

  const changeForm = (e) => {
    setIsChangeForm(true)
    setDisableCreateButton(false)
  }

  const onChangeOption = (id) => {
    const formValue = form.getFieldsValue()

    formValue.blogCategoryId = id
    form.setFieldsValue(formValue)
  }
  const addSEOKeywords = (e)=>{
    e.preventDefault();
    setKeywordSEOList(list=> !list.find(kw=>kw.id === keywordSEO.id && keywordSEO.value!=='')?[...list,keywordSEO]:[...list]);
    setKeywordSEO({});
  }
  const removeSEOKeyword = (keyword)=>{
    setKeywordSEOList(list=> list.filter(kw=>kw.id !== keyword.id));
  }
  return (
    <>
      <Row className="shop-row-page-header">
        <Col xs={24} sm={24} lg={12} md={12}>
          <p className="card-header">
            <PageTitle content={pageData.title} />
          </p>
        </Col>
        <Col span={12} xs={24} sm={24} md={12} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={disableCreateButton}
                    icon={<IconBtnAdd className="icon-btn-add-product" />}
                    className="btn-add-product"
                    onClick={onSubmitForm}
                  >
                    {pageData.btnAddNew}
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
        className="create-blog"
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
        onChange={() => {
          if (!blockNavigation) setBlockNavigation(true)
        }}
      >
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
                        id="product-name"
                        onChange={(e) => setBlogName(e.target.value)}
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
                      name={'blogCategoryIds'}
                      rules={[
                        {
                          required: pageData.generalInformation.category.required,
                          message: pageData.generalInformation.category.blogCategoryValidateMessage
                        }
                      ]}
                    >
                      <FnbSelectMultiple
                        onChange={onChangeOption}
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
                    <FnbFroalaEditor
                      value={blogContent}
                      placeholder={pageData.generalInformation.blogContent.blogContentPlaceholder}
                      onChange={(value) => {
                        if (value !== '' && value !== '<div></div>') setIsChangeForm(true)
                        setBlogContent(value)
                      }}
                      charCounterMax={-1}
                    />
                    <TextDanger
                      className="text-error-add-unit"
                      visible={showBlogContentValidateMessage}
                      text={pageData.generalInformation.blogContent.validateMessage}
                    />
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
                    <h4 className="shop-form-label mt-3">
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
                    </h4>
                    <div className="create-blog-overview">
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
                    </div>
                    <h4 className="shop-form-label">
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
                        className=" material-edit-cost-per-unit-tool-tip"
                      >
                        <span>
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </h4>
                    <Form.Item name={'titleSEO'}>
                      <Input
                        className="shop-input-with-count"
                        placeholder={pageData.SEO.SEOTitlePlaceholder}
                        maxLength={100}
                        onChange={(e) => {
                          setIsChangeForm(true)
                          e.target.value.length < 50 || e.target.value.length > 60
                            ? setIsShowWarningSEOTitle(true)
                            : setIsShowWarningSEOTitle(false)
                          setSEOTitle(e.target.value)
                        }}
                        showCount
                      />
                      <div hidden={!isShowWarningSEOTitle} className="seo-warning-message">
                        <div className="icon-warning">
                          <WarningIcon />
                        </div>
                        <div className="text-warning">
                          <span>{pageData.messageMatchSuggestSEOTitle}</span>
                        </div>
                      </div>
                    </Form.Item>

                    <h4 className="shop-form-label">
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
                        <span>
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </h4>
                    <Form.Item name={'descriptionSEO'}>
                      <Input
                        className="shop-input-with-count"
                        placeholder={pageData.SEO.SEODescriptionPlaceholder}
                        maxLength={255}
                        onChange={(e) => {
                          setIsChangeForm(true)
                          e.target.value.length < 155 || e.target.value.length > 160
                            ? setIsShowWarningSEODescription(true)
                            : setIsShowWarningSEODescription(false)
                          setSEODescription(e.target.value)
                        }}
                        showCount
                      />
                      <div hidden={!isShowWarningSEODescription} className="seo-warning-message">
                        <div className="icon-warning">
                          <WarningIcon />
                        </div>
                        <div className="text-warning">
                          <span>{pageData.messageMatchSuggestSEODescription}</span>
                        </div>
                      </div>
                    </Form.Item>

                      <div className='d-flex'>
                        <h3 className="shop-form-label mt-16">
                          {pageData.SEO.SEOKeywords}
                        </h3>
                        <Tooltip placement="topLeft" title={pageData.SEO.SEOKeywordsTooltip}>
                          <span className="ml-12 mt-16">
                            <ExclamationIcon />
                          </span>
                        </Tooltip>
                      </div>
                      <div>
                      {
                        keywordSEOs.length >0 ? <BadgeSEOKeyword onClose={removeSEOKeyword} keywords={keywordSEOs}/> :''
                      }
                      
                      <div className='d-flex mt-3'>
                          <Input
                            className="shop-input-with-count" 
                            showCount
                            value={keywordSEO?.value || ''}
                            placeholder={pageData.SEO.SEOKeywordsPlaceholder}
                            onChange={e=>{
                              if(e.target.value !== ''){
                                setKeywordSEO({
                                  id:e.target.value,
                                  value:e.target.value,
                                  colorIndex: Math.floor(Math.random() * SEO_KEYWORD_COLOR_LENGTH)
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

            <Col className="right-create-product" xs={24} sm={24} md={24} lg={24}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Card className="w-100 shop-card h-auto">
                    <h4 className="title-group">{pageData.media.title}</h4>
                    <h4 className="shop-form-label">{pageData.media.bannerTitle}</h4>
                    <Row className={`non-image ${image !== null ? 'have-image' : ''}`}>
                      <Col span={24} className={`image-product ${image !== null ? 'justify-left' : ''}`}>
                        <div style={{ display: 'flex' }}>
                          <Form.Item>
                            <FnbUploadImageComponent
                              buttonText={pageData.media.uploadImage}
                              onChange={onChangeImage}
                            />
                          </Form.Item>
                          {/* <a className="upload-image-url" hidden={image !== null}>
                            {pageData.media.addFromUrl}
                          </a> */}
                        </div>
                      </Col>
                      <Col span={24} className="text-non-image" hidden={image !== null}>
                        <Text disabled>
                          {pageData.media.textNonImage}
                          <br />
                          {pageData.media.bestDisplayImage}
                        </Text>
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
                    <Row style={{ margin: '15px' }}>
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
