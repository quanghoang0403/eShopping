import { Col, Form, Input, Row, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import { FnbModal } from 'components/shop-modal/shop-modal-component';
import ProductSizeCategoryDataService from 'data-services/product-category/product-size-category-data.service';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function CreateProductSizeCategoryForm(props){
  const {visible,openModal,setIsChangeData} = props
  const [form] = useForm()
  const [t] = useTranslation()
  const [isChangeForm,setIsChangeForm] = useState(false)
  const [showConfirm,setShowConfirm] = useState(false)
  const pageData = {
    titleCreateNew:t('productSizeCategory.titleCreateNew'),
    labelName :t('productSizeCategory.labelName'),
    placeholderName:t('productSizeCategory.placeholderName') ,
    validateName:t('productSizeCategory.validateName'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.addNew'),
    btnDiscard: t('button.discard'),
    leaveDialog: {
      confirmLeave: t('dialog.confirmLeave'),
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent')
    },
    successCreateSizeCategory:t('productSizeCategory.successCreateSizeCategory')
  }

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
      openModal(false)
    }
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const handleCompleted = ()=>{
    setIsChangeForm(false)
    openModal(false)
    setShowConfirm(false)
  }

  const handleSubmit = async ()=>{
    const data = await form.validateFields()
    const res = await ProductSizeCategoryDataService.CreateProductSizeCategoryAsync(data)
    if(res){
      setIsChangeData(true)
      handleCompleted()
      message.success(pageData.successCreateSizeCategory)
    }
  }

  const formContent = (
    <Form form={form} autoComplete="off" onFieldsChange={() => setIsChangeForm(true)}>
      <Row gutter={[16,16]}>
        <Col span={24}>
          <div className='d-flex justify-content-center align-items-center'>
            <h3 className="shop-form-label mt-16">
              {pageData.labelName}
            </h3>
            <span className="text-danger ml-1 mt-1">*</span>
          </div>
          <Form.Item
            name={['name']}
            className="item-name"
            rules={[
              {
                required: true,
                message: pageData.validateName
              }
            ]}
          >
            <Input
              className="shop-input-with-count"
              showCount
              placeholder={pageData.placeholderName}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  return(
    <>
      <FnbModal
        content={formContent}
        visible={visible}
        title={pageData.titleCreateNew}
        okText={pageData.btnAddNew}
        cancelText={pageData.btnCancel}
        handleCancel={onCancel}
        onOk={handleSubmit}
      />

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