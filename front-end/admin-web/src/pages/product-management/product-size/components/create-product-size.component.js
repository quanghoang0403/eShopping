import { Col, Form, Input, InputNumber, Row, Tooltip, message } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbModal } from 'components/shop-modal/shop-modal-component'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { ExclamationIcon } from 'constants/icons.constants'
import ProductSizeDataService from 'data-services/product/product-size-data.service'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function CreateProductSizeModal(props){
  const {visible,openModal,setIsChangeData,allProductSizeCategory,currentProductSizeCategory,setOpenProductSizeTable} = props
  const [t] = useTranslation()
  const [form] = useForm()
  const [showConfirm,setShowConfirm] = useState(false)
  const [isChangeForm,setIsChangeForm] = useState(false)
  const pageData = {
    titleCreateNew:t('productSizeCategory.titleCreateNew'),
    labelName :t('productSizeCategory.labelName'),
    placeholderName:t('productSizeCategory.placeholderName') ,
    labelPriority:t('productSizeCategory.labelPriority'),
    placeholderPriority:t('productSizeCategory.placeholderPriority'),
    validateName:t('productSizeCategory.validateName'),
    validatePriority: t('productCategory.validatePriority'),
    tooltip: t('productCategory.tooltipPriority'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.addNew'),
    btnDiscard: t('button.discard'),
    leaveDialog: {
      confirmLeave: t('dialog.confirmLeave'),
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent')
    },
    productSizeCategory:{
      label:t('productSizeCategory.labelProductSizeCategory'),
      placeholder:t('productSizeCategory.placeholderProductSizeCategory'),
      validateMessage:t('productSizeCategory.validateProductSizeCategory')
    },
    successCreateProductSize:t('productSizeCategory.successCreateProductSize')
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
    resetValue()
    setOpenProductSizeTable(false)
  }

  const resetValue = ()=>{
    const values = form.getFieldsValue();
    Object.keys(values).forEach(k=>{
      if(k !== 'productSizeCategoryId'){
        values[k] = null
      }

    })
    form.setFieldsValue(values)
  }

  const handleSubmit = async ()=>{
    const data = await form.validateFields()
    const res = await ProductSizeDataService.CreateProductSizeAsync(data)
    if(res){
      setIsChangeData(true)
      handleCompleted()
      message.success(pageData.successCreateProductSize)
    }
  }

  const createProductSizeForm = (
    <Form initialValues={{productSizeCategoryId:currentProductSizeCategory?.id}} form={form} autoComplete="off" onFieldsChange={() => setIsChangeForm(true)}>
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
        <Col span={24} >
          <div className="d-flex">
            <h3 className="shop-form-label mt-16">
              {pageData.labelPriority}
              <span className="text-danger">*</span>
            </h3>
            <Tooltip placement="topLeft" title={pageData.tooltip}>
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
                message: pageData.validatePriority
              }
            ]}
          >
            <InputNumber
              placeholder={pageData.placeholderPriority}
              className="shop-input-number w-100"
              min={1}
              max={1000000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <div className="d-flex">
            <h3 className="shop-form-label mt-16">
              {pageData.productSizeCategory.label}

            </h3>
            <span className="text-danger">*</span>
          </div>
          <Form.Item
            name={['productSizeCategoryId']}
            rules={[
              {
                required: true,
                message: pageData.productSizeCategory.validateMessage
              }
            ]}
          >
            <FnbSelectSingle
              option={allProductSizeCategory}
              disabled
              placeholder={pageData.productSizeCategory.placeholder}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
  return(
    <>
      <FnbModal
        content={createProductSizeForm}
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
  )
}