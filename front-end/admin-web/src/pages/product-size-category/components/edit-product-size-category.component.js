import { useForm } from 'antd/lib/form/Form';
import ProductSizeCategoryDataService from 'data-services/product-category/product-size-category-data.service';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, Row, message } from 'antd';
import { FnbModal } from 'components/shop-modal/shop-modal-component';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import { useCurrentProductSizeCategoryContext } from '../product-size-category.page';

export default function EditProductSizeCategoryModal(props){
  const {visible, openModal, setIsChangeData} = props
  const productSizeCategory = useCurrentProductSizeCategoryContext()
  const [form] = useForm()
  const [t] = useTranslation()
  const [isChangeForm,setIsChangeForm] = useState(false)
  const [showConfirm,setShowConfirm] = useState(false)
  const pageData = {
    titleCreateNew:t('productSizeCategory.editProductSizeCategory'),
    labelName :t('productSizeCategory.labelName'),
    placeholderName:t('productSizeCategory.placeholderName') ,
    validateName:t('productSizeCategory.validateName'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.edit'),
    btnDiscard: t('button.discard'),
    leaveDialog: {
      confirmLeave: t('dialog.confirmLeave'),
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent')
    },
    successCreateSizeCategory:t('productSizeCategory.successEditProductSize')
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
    data.id = productSizeCategory?.id
    const res = await ProductSizeCategoryDataService.UpdateProductSizeCategoryAsync(data)
    if(res){
      setIsChangeData(true)
      handleCompleted()
      message.success(pageData.successCreateSizeCategory)
    }
  }

  useEffect(()=>{
    form.setFieldsValue({
      name: productSizeCategory?.name
    })
  },[productSizeCategory])

  const formContent = (
    <Form
      initialValues={{name:productSizeCategory?.name}}
      form={form}
      autoComplete="off"
      onFieldsChange={() => setIsChangeForm(true)}>
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