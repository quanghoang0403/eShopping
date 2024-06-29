import { Row, Col, Button, Form, message } from 'antd';
import PageTitle from 'components/page-title';
import { useTranslation } from 'react-i18next';
import BlogCategoryDataService from 'data-services/blog/blog-category-data.service'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import { IconBtnAdd } from 'constants/icons.constants';
import { PermissionKeys } from 'constants/permission-key.constants';
import { useEffect, useState } from 'react';
import { DELAYED_TIME } from 'constants/default.constants';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import { useHistory } from 'react-router';
import BlogDataService from 'data-services/blog/blog-data.service';
import { getValidationMessages } from 'utils/helpers';
import BlogCategoryForm from '../components/blog-category-form.component';
export default function CreateBlogCategory() {
  const [t] = useTranslation()
  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [blockNavigation, setBlockNavigation] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false);
  const history = useHistory()
  const pageData = {
    title: t('blogCategory.pageTitle'),
    btnDiscard: t('button.discard'),
    createSuccess: t('blogCategory.addBlogCategorySuccess'),
    createFail: t('blogCategory.addBlogCategoryFail'),
    btnSave: t('button.save'),
    btnCancel: t('button.cancel'),
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
    }
  }
  const onCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      return history.push('/blog-category')
    }, DELAYED_TIME)
  }
  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
      onCompleted()
      return history.push('/blog-category')
    }
  }
  const changeForm = () => {
    setIsChangeForm(true)
  }

  const onSubmitForm = () => {
    form.validateFields().then(async values => {
      const blogCategoryModel = {
        ...values,
        blogs: values?.blogs?.reduce((acc, blogId) => acc.concat({ id: blogId, position: values.blogs.indexOf(blogId) }), []) || []
      }
      const res = await BlogCategoryDataService.createBlogCategoryAsync(blogCategoryModel)
      if (res.status != 200) {
        message.success(pageData.createSuccess)
        onCompleted()
      }
    })
      .catch((errors) => {
        console.error(errors)
        form.setFields(getValidationMessages(errors));

      })
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
                    icon={<IconBtnAdd className="icon-btn-add-product" />}
                    className="btn-add-product"
                    onClick={onSubmitForm}
                  >
                    {pageData.btnSave}
                  </Button>
                ),
                permission: PermissionKeys.ADMIN
              },
              {
                action: (
                  <a onClick={() => onCancel()}
                    className="action-cancel">
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
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
        onChange={() => {
          if (!blockNavigation) setBlockNavigation(true)
        }}
      >
        <BlogCategoryForm isEditing={false}/>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.confirmLeave}
        onCancel={() => setShowConfirm(false)}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
