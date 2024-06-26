import { Button, Col, Form, Row, Space, message } from 'antd';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import PageTitle from 'components/page-title';
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';
import { DELAYED_TIME } from 'constants/default.constants';
import { TrashFill } from 'constants/icons.constants';
import { PermissionKeys } from 'constants/permission-key.constants';
import BlogCategoryDataService from 'data-services/blog/blog-category-data.service';
import BlogDataService from 'data-services/blog/blog-data.service';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { executeAfter, getValidationMessages } from 'utils/helpers';
import BlogCategoryForm from '../components/blog-category-form.component';
import ShopActiveStatus from 'components/shop-active-status/shop-active-status.component';
import './edit-blog-category.component.scss'
export default function EditBlogCategory() {
  const [form] = Form.useForm()
  const match = useRouteMatch()
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [t] = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [blogCategoryDetail,setBlogCategoryDetail] = useState()
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

  const onSubmitForm = async () => {
    const data = await form.validateFields()
    const blogCategoryEditModel = {
      ...data,
      id: match?.params?.blogCategoryId,
      blogs: data.blogs?.map(b => { return { id: b, position: data.blogs.indexOf(b) } })
    }
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
            ...blogCategory,
            blogs:blogCategory.blogs.map(b=>b.id)
          })
          setTitle(blogCategory.name)
          setBlogCategoryDetail(blogCategory)
        }
      }).catch(err => {
        message.error(err)
      })
    }

  }
  useEffect(() => {
    getInitData()
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
          <Col xs={24} sm={24} lg={12} className='edit-title'>
            <PageTitle content={title}/>
            <ShopActiveStatus status={blogCategoryDetail?.isActive}/>
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
        <BlogCategoryForm form={form} isEditing={true} setBlogCategoryDetail={setBlogCategoryDetail}/>
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
