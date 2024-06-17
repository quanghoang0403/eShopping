import { Button, Col, Form, Row, message } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME } from 'constants/default.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import {
  getValidationMessages
} from 'utils/helpers'
import './edit-blog.page.scss'
import BlogDataService from 'data-services/blog/blog-data.service'
import BlogForm from '../components/blog-form.component'
import { useSelector } from 'react-redux'

export default function EditBlogPage(props) {
  const [t] = useTranslation()
  const history = useHistory()
  const [blockNavigation, setBlockNavigation] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [blog, setBlog] = useState()
  const state = useSelector((state) => state)
  const userFullName = state?.session?.currentUser?.fullName
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

  const getInitData = async () => {
    const { id } = props?.match?.params
    await BlogDataService
      .getBlogByIdAsync(id)
      .then((res) => {
        // mapping general
        form.setFieldsValue({
          ...res,
          blogCategoryId: res?.blogCategories.map(b => b.id)
        })
        setBlog(res)
      })
      .catch((errors) => {
        message.error(errors.message)
      })
  }

  const onSubmitForm = () => {
    form
      .validateFields()
      .then(async (values) => {
        const request = {
          blogDetailModel: {
            ...values,
            author: blog.author,
            id: props?.match?.params?.id
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

  const onCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      return history.push('/blog')
    }, DELAYED_TIME)
  }

  const changeForm = () => {
    setIsChangeForm(true)
  }

  return (
    <>
      {blog ? (
        <>
          <Row className="shop-row-page-header">
            <Col xs={24} sm={24} lg={12}>
              <p className="card-header">
                <PageTitle content={blog?.name} />
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
                        disabled={!isChangeForm}
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
            <BlogForm
              userFullName={userFullName}
              showConfirm={showConfirm}
              setShowConfirm={setShowConfirm}
              isChangeForm={isChangeForm}
              onCompleted={onCompleted}
            />
          </Form>
        </>) : <p>Loading ...</p>
      }
    </>
  )
}
