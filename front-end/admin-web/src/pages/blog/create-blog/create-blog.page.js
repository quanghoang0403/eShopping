import { Button, Card, Col, Form, Input, Row, Tooltip, Typography, message } from 'antd'
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
// import blogDataService from 'data-services/blog/blog-data.service'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { convertSeoUrl } from 'utils/helpers'
import './create-blog.page.scss'
const { Text } = Typography

export default function CreateBlogPage () {
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
  const createdTimeDefault = new Date().format(DateFormat.DD_MM_YYYY)
  const [isShowWarningSEOTitle, setIsShowWarningSEOTitle] = useState(false)
  const [isShowWarningSEODescription, setIsShowWarningSEODescription] = useState(false)

  useEffect(() => {
    getInitData()
  }, [])

  const [form] = Form.useForm()
  const pageData = {
    title: t('blog.pageTitle'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.create'),
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
      SEOKeywordsTooltip: t('form.SEOKeywordsTooltip')
    },
    media: {
      title: t('blog.media'),
      bannerTitle: t('blog.bannerTitle'),
      textNonImage: t('file.textNonImage'),
      uploadImage: t('file.uploadImage'),
      addFromUrl: t('file.addFromUrl'),
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
    getBlogTags()
  }, [])

  // validate form again if clicked submit form and change language

  const getInitData = async () => {
    await getCategories()
  }

  const getCategories = async () => {
    // const resCategory = await blogDataService.getBlogCategoryAsync()
    // if (resCategory) {
    //   setCategories(resCategory.blogCategories)
    // }
  }

  const getBlogTags = async () => {
    // const resBlogTag = await blogDataService.getBlogTagAsync()
    // if (resBlogTag) {
    //   setTagDataTemp(resBlogTag.blogTags)
    // }
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
          bannerImageUrl: image?.url,
          blogTags: tags,
          SEOTitle,
          SEODescription,
          description: blogContent.replace(/<.*?>/gm, '').slice(0, 200)
        }
        // const res = await blogDataService.createBlogAsync(request)
        // if (res?.isSuccess) {
        //   message.success(pageData.createBlogSuccess)
        //   onCompleted()
        // } else {
        //   message.error(pageData.fail)
        // }
      })
      .catch((errors) => {})
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

  const onAddNewCategory = async () => {
    if (!newCategoryName) {
      setShowCategoryNameValidateMessage(true)
      setIsCategoryNameExisted(false)
    }
    // const res = await blogDataService.createBlogCategoryAsync({
    //   name: newCategoryName
    // })
    // if (res.isSuccess) {
    //   /// Handle add new unit
    //   const newItem = {
    //     id: res.id,
    //     name: res.name
    //   }
    //   setCategories([newItem, ...categories])
    //   form.setFieldsValue({
    //     blogCategoryId: res.id
    //   })
    //   setNewCategoryName(null)
    //   setIsCategoryNameExisted(false)
    // } else {
    //   setIsCategoryNameExisted(true)
    // }
  }

  // Enter Category name and check existed
  const onNameChange = (event) => {
    if (categories.filter((u) => u.name.trim() === event.target.value.trim()).length > 0) {
      setIsCategoryNameExisted(true)
    } else {
      setIsCategoryNameExisted(false)
    }
    setShowCategoryNameValidateMessage(false)
    setNewCategoryName(event.target.value)
  }

  const onChangeOption = (id) => {
    const formValue = form.getFieldsValue()

    formValue.blogCategoryId = id
    form.setFieldsValue(formValue)
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
                    {pageData.btnSave}
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
                      name={'title'}
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
                      <FnbSelectSingle
                        onChange={onChangeOption}
                        className="unit-selector"
                        placeholder={pageData.generalInformation.category.placeholder}
                        allowClear
                        noTranslateOptionName
                        dropdownRender={(menu) => (
                          <>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} sm={24} md={24} lg={14}>
                                <Input
                                  className="shop-input unit-dropdown-input"
                                  allowClear="true"
                                  maxLength={100}
                                  onChange={(e) => {
                                    onNameChange(e)
                                  }}
                                  value={newCategoryName}
                                  id="blogCategory-input"
                                />
                                <TextDanger
                                  className="text-error-add-unit"
                                  visible={showCategoryNameValidateMessage}
                                  text={pageData.generalInformation.category.blogCategoryNameValidateMessage}
                                />
                                <TextDanger
                                  className="text-error-add-unit"
                                  visible={isCategoryNameExisted}
                                  text={pageData.generalInformation.category.blogCategoryExisted}
                                />
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={10}>
                                <ShopAddNewButton
                                  onClick={() => onAddNewCategory()}
                                  className="mt-16 ml-24 mw-0"
                                  type="primary"
                                  text={pageData.btnAddNew}
                                ></ShopAddNewButton>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={24}>
                                <div className={showCategoryNameValidateMessage ? 'mt-10' : 'mt-32'}>{menu}</div>
                              </Col>
                            </Row>
                          </>
                        )}
                        option={categories?.map((item) => ({
                          id: item.id,
                          name: item.name
                        }))}
                      ></FnbSelectSingle>
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
                      <span style={{ fontSize: '18px' }}>{`<meta name="title" property="title" content="${
                        !SEOTitle ? 'SEO on Title' : SEOTitle
                      }">`}</span>
                      <br />
                      <span style={{ fontSize: '18px' }}>
                        {`<meta name="description" property="description" content="${
                          !SEODescription ? 'SEO on Description' : SEODescription
                        }">`}
                      </span>
                      <br />
                      <span style={{ fontSize: '18px' }}>
                        {`<meta name="keywords" property="keywords" content="${
                          tags.length > 0 ? tags.map((x) => x.name).join(',') : 'SEO on Keywords'
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
                    <Form.Item name={'SEOTitle'}>
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
                    <Form.Item name={'SEODescription'}>
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

                    <h4 className="shop-form-label">
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
                        <span>
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </h4>
                    <Form.Item>
                      <SelectBlogTagComponent
                        tagDataTemp={tagDataTemp}
                        tags={tags}
                        setTags={setTags}
                        setTagError={setTagError}
                        setIsChangeForm={setIsChangeForm}
                      />
                      <span hidden={!tagError} className="customer-tag-error-message">
                        {pageData.limitTagMessage}
                      </span>
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
                    <Row className={`non-image ${image !== null ? 'have-image' : ''}`}>
                      <Col span={24} className={`image-product ${image !== null ? 'justify-left' : ''}`}>
                        <div style={{ display: 'flex' }}>
                          <Form.Item>
                            <FnbUploadImageComponent
                              buttonText={pageData.media.uploadImage}
                              onChange={onChangeImage}
                            />
                          </Form.Item>
                          <a className="upload-image-url" hidden={image !== null}>
                            {pageData.media.addFromUrl}
                          </a>
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
