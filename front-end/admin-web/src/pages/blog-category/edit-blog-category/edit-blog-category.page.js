import { Button, Card, Col, Divider, Form, Input, InputNumber, Row, Space, Tooltip, message } from 'antd';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import PageTitle from 'components/page-title';
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';
import FnbFroalaEditor from 'components/shop-froala-editor';
import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple';
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component';
import { DELAYED_TIME } from 'constants/default.constants';
import { ExclamationIcon, TrashFill } from 'constants/icons.constants';
import { PermissionKeys } from 'constants/permission-key.constants';
import BlogCategoryDataService from 'data-services/blog/blog-category-data.service';
import BlogDataService from 'data-services/blog/blog-data.service';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { executeAfter, getValidationMessages } from 'utils/helpers';
import { BadgeSEOKeyword } from 'components/badge-keyword-SEO/badge-keyword-SEO.component'
export default function EditBlogCategory() {
  const [form] = Form.useForm()
  const match = useRouteMatch()
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [t] = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)
  const [keywordSEOs, setKeywordSEOList] = useState([]);
  const [keywordSEO, setKeywordSEO] = useState({})
  const [isKeywordSEOChange, setIsKewwordSEOChange] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const history = useHistory()
  const pageData = {
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnUpdate: t('button.edit'),
    btnDelete: t('button.delete'),
    btnDiscard: t('button.discard'),
    updateSuccess: t('blogCategory.categoryUpdateSuccess'),
    updateFail: t('blogCategory.categoryUpdateFail'),
    DeleteSuccess: t('blogCategory.blogCategoryDeletedSuccess'),
    DeleteFail: t('blogCategory.blogCategoryDeletedFailed'),
    confirmDeleteMessage: t('dialog.confirmDeleteMessage'),
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave'),
      confirmDelete: t('dialog.confirmDelete')
    },
    description: {
      title: t('blogCategory.labelDescription'),
      placeholder: t('blogCategory.placeholderDescription'),
      maxLength: 200
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
  const getallBlogs = async () => {
    const blog = await BlogDataService.getAllBlogsAsync()
    if (blog) {
      setBlogs(blog)
    }
  }
  const onSubmitForm = async () => {
    const data = await form.validateFields()
    const blogCategoryEditModel = {
      id: match?.params?.blogCategoryId,
      name: data.name,
      priority: data.priority,
      blogs: data.blogs?.map(b => { return { id: b, position: data.blogs.indexOf(b) } }),
      keywordSEO: keywordSEOs.map(kw => kw.value)?.join(',') || null,
      titleSEO: data.titleSEO,
      descriptionSEO: data.descriptionSEO,
      description: data.description,
      content: data.content
    }
    console.log(blogCategoryEditModel)
    const res = await BlogCategoryDataService.editBlogCategoryAsync(blogCategoryEditModel)
    try {
      if (res) {
        message.success(pageData.updateSuccess)
        onCompleted()
      }
    }
    catch (err) {
      message.error(pageData.updateFail)
      form.setFields(getValidationMessages(errors));
    }
  }
  const getInitData = () => {
    const id = match?.params?.blogCategoryId
    if (id) {
      BlogCategoryDataService.getBlogCategoryByIdAsync(id).then(res => {
        const blogCategory = res
        if (blogCategory) {
          form.setFieldsValue({
            id: blogCategory.id,
            name: blogCategory.name,
            priority: blogCategory.priority,
            blogs: blogCategory.blogs?.map(b => b.id),
            titleSEO: blogCategory.titleSEO,
            descriptionSEO: blogCategory.descriptionSEO,
            description: blogCategory.description,
            content: blogCategory.content
          })
          setTitle(blogCategory.name)
          setKeywordSEOList(blogCategory?.keywordSEO?.split(',').map(kw => { return { id: kw, value: kw } }) || [])
        }
      }).catch(err => {
        message.error(err)
      })
    }

  }
  useEffect(() => {
    getInitData()
    getallBlogs()
  }, [])
  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    }
    else {
      setShowConfirm(false)
      onCompleted();
    }
  }
  const onCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      history?.push('/blog-category')
    }, DELAYED_TIME)
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
  const formatDeleteMessage = (text, name) => {
    const mess = t(text, { name })
    return mess
  }
  const onRemoveItem = async () => {
    try {
      const res = await BlogCategoryDataService.deleteBlogCategoryAsync(match?.params?.blogCategoryId)
      if (res) {
        message.success(formatDeleteMessage(pageData.DeleteSuccess, title));
        executeAfter(500, () => onCompleted())
      }
    } catch (err) {
      message.error(formatDeleteMessage(pageData.DeleteFail, title))
    }
  }
  return (
    <>
      <Form form={form} onFieldsChange={() => setIsChangeForm(true)}>
        <Row className="shop-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <PageTitle content={title} />
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Space className="float-right header-control">
              <ActionButtonGroup
                arrayButton={[
                  {
                    action: (
                      <ShopAddNewButton
                        type="primary"
                        text={pageData.btnUpdate}
                        onClick={() => onSubmitForm()}
                        className="float-right"
                      />
                    ),
                    permission: PermissionKeys.ADMIN
                  },
                  {
                    action: (
                      <Button onClick={() => setConfirmDeleteVisible(true)} type="primary" danger className="d-flex justify-content-center align-items-center">
                        <TrashFill />
                        {pageData.btnDelete}

                      </Button>
                    ),
                    permission: PermissionKeys.ADMIN
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
            </Space>
          </Col>
        </Row>
        <Row gutter={[16, 24]}>
          <Col xs={24} sm={24} md={24} lg={16}>
            <Card className="shop-card">
              <Row gutter={[16, 24]}>
                <Col span={24}>
                  <h4 className="shop-form-label">
                    {pageData.generalInformation.name.title}
                    <span className="text-danger mx-1">*</span>
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
                      id="blog-category-name"
                      allowClear
                      showCount
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
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
                    name={'priority'}
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
                </Col>
              </Row>
              <Row>
                <Col span={24}>
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
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <h4 className="shop-form-label">
                    {pageData.generalInformation.content.title}
                  </h4>
                  <Form.Item
                    name={['content']}
                  >
                    <FnbFroalaEditor
                      onChange={(value) => { setIsChangeForm(true); }}
                      placeholder={pageData.generalInformation.content.placeholder}
                      charCounterMax={-1}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
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

                  <div>
                    {
                      keywordSEOs.length > 0 ? <BadgeSEOKeyword onClose={removeSEOKeyword} keywords={keywordSEOs} /> : ''
                    }

                    <div className='d-flex mt-3'>
                      <Input
                        className="shop-input-with-count"
                        showCount
                        value={keywordSEO?.value || ''}
                        placeholder={pageData.SEOInformation.keyword.placeholder}
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
                        permission={PermissionKeys.ADMIN}
                        disabled={!isKeywordSEOChange}
                        text={pageData.SEOInformation.keyword.btnAdd}
                        className={'mx-4'}
                        onClick={addSEOKeywords}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Card className="w-100 shop-card h-auto">
              <Row className="mb-4">
                <h4 className="title-group">{pageData.generalInformation.blogs.title}</h4>
                <Form.Item
                  name={['blogs']}
                  className="item-name"
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
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmDelete}
        content={formatDeleteMessage(pageData.confirmDeleteMessage, title)}
        okText={pageData.btnDelete}
        cancelText={pageData.btnIgnore}
        skipPermission={true}
        onOk={onRemoveItem}
        onCancel={() => setConfirmDeleteVisible(false)}
        visible={confirmDeleteVisible}
      />
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.leaveDialog.confirmLeave}
        onCancel={() => setShowConfirm(false)}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
