import { Button, Col, Form, Row, message } from 'antd';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME } from 'constants/default.constants'
import { IconBtnAdd } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import productDataService from 'data-services/product/product-data.service';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { getValidationMessagesWithParentField } from 'utils/helpers'
import '../edit-product/edit-product.scss'
import { useTranslation } from 'react-i18next'
import StockProductTable from '../components/stock-product.component';
import ProductSizeDataService from 'data-services/product/product-size-data.service';
import RightProductDetail from '../components/right-product-detail.component';
import LeftProductDetail from '../components/left-product-detail.component';

export default function CreateProductPage() {
  const history = useHistory()
  const [productSizes, setProductSizes] = useState([
    { id: '1', name: 'S' },
    { id: '2', name: 'M' },
    { id: '3', name: 'L' },
    { id: '4', name: 'XL' },
    { id: '5', name: 'XXL' }
  ])

  const [disableCreateButton, setDisableCreateButton] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false);
  const [form] = Form.useForm()

  useEffect(() => {
    //fetchProductSizes()
  }, [form.getFieldValue('productSizeCategoryId')])

  const { t } = useTranslation()
  const pageData = {
    title: t('product.addProduct'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.add'),
    btnDiscard: t('button.discard'),
    productNameExisted: t('product.productNameExisted'),
    productAddedSuccess: t('product.productAddedSuccess'),
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
    }
  }

  const fetchProductSizes = async () => {
    const productSizeCategoryId = form.getFieldValue('productSizeCategoryId')
    const productSizes = await ProductSizeDataService.GetProductSizeAsync(0, 100, '', productSizeCategoryId)
    if (productSizes) setProductSizes(productSizes.result);
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

  const onSubmitForm = () => {
    console.log(form.getFieldsValue())
    form
      .validateFields()
      .then(async (values) => {
        productDataService
          .createProductAsync(values)
          .then((res) => {
            if (res) {
              message.success(pageData.productAddedSuccess);
              setIsChangeForm(false);
              history.push('/product');
            }
          })
          .catch((errs) => {
            form.setFields(getValidationMessagesWithParentField(errs));
            console.error(errs)
          })
      })
      .catch((errors) => {
        if (errors?.errorFields?.length > 0) {
          const elementId = `basic_${errors?.errorFields[0]?.name.join('_')}_help`
          scrollToElement(elementId)
        }
      })
  }

  const changeForm = (e) => {
    const fields = form.getFieldsValue();
    fields.productVariants.forEach(productVariant => {
      if (productVariant.isUseBasePrice) {
        productVariant.priceOriginal = fields.priceOriginal;
        productVariant.priceValue = fields.priceValue;
        productVariant.priceDiscount = fields.priceDiscount;
        productVariant.percentNumber = fields.percentNumber;
        productVariant.startDate = fields.startDate;
        productVariant.endDate = fields.endDate;
      }
    });
    form.setFieldsValue(fields)
    setIsChangeForm(true)
    setDisableCreateButton(false)
  }

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
      onCompleted()
      return history.push('/product')
    }
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const onCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      return history.push('/product')
    }, DELAYED_TIME)
  }

  return (
    <>
      <Row className="shop-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={pageData.title} />
          </p>
        </Col>
        <Col span={12} xs={24} sm={24} md={24} lg={12} className="shop-form-item-btn">
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
                permission: PermissionKeys.CREATE_PRODUCT
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
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
      >
        <div className="col-input-full-width create-product-page">
          <Row className="grid-container-create-product">
            <LeftProductDetail form={form} changeForm={changeForm} />
            <RightProductDetail form={form} />
          </Row>
          <br />
          <Row>
            <StockProductTable form={form} productSizes={productSizes} />
          </Row>
        </div>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.confirmLeave}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  )
}
