import { Button, Col, Form, Row, message } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME } from 'constants/default.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import blogDataService from 'data-services/blog/blog-data.service'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import './create-blog.page.scss'
import BlogForm from '../components/blog-form.component'
import { useHistory } from 'react-router-dom'

export default function CreateBlogPage() {
  const [t] = useTranslation()
  const history = useHistory()
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [blockNavigation, setBlockNavigation] = useState(false)
  const state = useSelector((state) => state)
  const userFullName = state?.session?.currentUser?.fullName
  const pageData = {
    title: t('blog.pageTitle'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.create'),
    btnAddNew: t('button.addNew'),
    createBlogSuccess: t('blog.createBlogSuccess'),
    createBlogFailed: t('blog.createBlogFailed')
  }
  const [form] = Form.useForm()

  const onSubmitForm = () => {
    form
      .validateFields()
      .then(async (values) => {
        console.log(values)
        const request = {
          ...values,
          author: userFullName || ''
        }
        const res = await blogDataService.createBlogAsync(request)
        if (res) {
          message.success(pageData.createBlogSuccess)
          onCompleted()
        }
      })
      .catch((errors) => {
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
                    disabled={!isChangeForm}
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
        <BlogForm
          userFullName={userFullName}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          isChangeForm={isChangeForm}
          onCompleted={onCompleted}
          isEditing={false}
        />

      </Form>
    </>
  )
}
