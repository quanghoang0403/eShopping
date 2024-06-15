import { Card, Col, Form, Input, InputNumber, Row, Tooltip, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import PageTitle from 'components/page-title';
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';
import { PermissionKeys } from 'constants/permission-key.constants';
import RootCategoryDataService from 'data-services/product-category/product-root-category-data.service';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ProductRootCategoryForm from '../components/form-root-category.component';

export default function CreateRootCategory(props) {
  const [t] = useTranslation()
  const pageData = {
    title: t('root-category.createTitle'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.addNew'),
    btnDiscard: t('button.discard'),
    productCategoryAddedSuccess: t('productCategory.productCategoryAddedSuccess'),
    leaveDialog: {
      confirmLeave: t('dialog.confirmLeave'),
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent')
    }
  }
  const history = useHistory();
  const [form] = useForm()
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const handleCompleted = () => {
    setIsChangeForm(false)
    setShowConfirm(false)
    history.push('/product-root-category')
  }
  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    }
    else {
      handleCompleted()
    }

  }
  const onDiscard = () => {
    setShowConfirm(false)
  }
  const onSubmitForm = async () => {
    const dataValue = await form.validateFields()
    const res = await RootCategoryDataService.CreateProductRootCategoryAsync(dataValue)
    if (res) {
      message.success(pageData.productCategoryAddedSuccess)
      handleCompleted()
    }

  }
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFieldsChange={() => setIsChangeForm(true)}
      >
        <Row className="shop-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={pageData.title} />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <ShopAddNewButton
                      onClick={() => onSubmitForm()}
                      className="float-right"
                      type="primary"
                      text={pageData.btnAddNew}
                    ></ShopAddNewButton>
                  ),
                  permission: PermissionKeys.CREATE_PRODUCT_CATEGORY
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
          </Col>
        </Row>
        <ProductRootCategoryForm/>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.leaveDialog.confirmLeave}
        onCancel={onDiscard}
        onOk={handleCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}