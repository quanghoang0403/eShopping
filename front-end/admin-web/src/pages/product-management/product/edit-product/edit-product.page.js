import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, message, Row } from 'antd';
import { getValidationMessages } from 'utils/helpers';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import PageTitle from 'components/page-title';
import { DELAYED_TIME } from 'constants/default.constants';
import { PermissionKeys } from 'constants/permission-key.constants';
import { ProductStatus } from 'constants/product-status.constants';
import productDataService from 'data-services/product/product-data.service';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import DeleteProductComponent from '../components/delete-product.component';
import './edit-product.scss';
import { useTranslation } from 'react-i18next';
import StockProductTable from '../components/stock-product.component';
import RightProductDetail from '../components/right-product-detail.component';
import LeftProductDetail from '../components/left-product-detail.component';
import moment from 'moment';
import ShopActiveStatus from 'components/shop-active-status/shop-active-status.component';
import ChangeStatusButton from 'components/shop-change-active-status-button/shop-change-active-status-button.component';

export default function EditProductPage() {
  const history = useHistory()
  const match = useRouteMatch()
  const { t } = useTranslation()
  const [titleName, setTitleName] = useState('')
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [disableCreateButton, setDisableCreateButton] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [titleModal, setTitleModal] = useState('')
  const [preventDeleteProduct, setPreventDeleteProduct] = useState({})
  const [productSizes, setProductSizes] = useState([])
  const [productData, setProductData] = useState()

  const pageData = {
    title: t('product:addProduct'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.add'),
    btnDiscard: t('button.discard'),
    btnDelete: t('button.delete'),
    upload: {
      title: t('common.uploadTitle')
    },
    productNameExisted: t('product.productNameExisted'),
    productEditedSuccess: t('product.productEditedSuccess'),
    productDeleteSuccess: t('product.productDeleteSuccess'),
    productDeleteFail: t('product.productDeleteFail'),
    productActivatedSuccess: t('product.productActivatedSuccess'),
    productDeactivatedSuccess: t('product.productDeactivatedSuccess'),
    mediaNotExisted: t('product.validateImage'),
    file: {
      uploadImage: t('file.uploadImage'),
      title: t('file.title'),
      textNonImage: t('file.textNonImage'),
      bestDisplayImage: t('file.bestDisplayImage')
    },
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave'),
      confirmDelete: t('dialog.confirmDelete')
    },
    table: {
      name: t('table.name'),
      action: t('table.action')
    }
  }

  useEffect(() => {
    fetchProductDetail()
  }, [])

  useEffect(() => {
    const fields = form.getFieldsValue();
    fields.productVariants?.forEach(productVariant => {
      productVariant.stocks = fields.productSizes?.map(size => ({
        productSizeId: size.id,
        productSizeName: size.name,
        name: size.name,
        quantityLeft: 0
      }))
    });
  }, [productSizes])

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

  const fetchProductDetail = async () => {
    productDataService.getProductByIdAsync(match?.params?.id).then((data) => {
      const parsedData = {
        ...data,
        productVariants: data?.productVariants.map((productVariant, index) => ({
          ...productVariant,
          key: index + 1,
          startDate: productVariant.startDate ? moment(productVariant.startDate) : null,
          endDate: productVariant.endDate ? moment(productVariant.endDate) : null
        })),
        startDate: data.startDate ? moment(data.startDate) : null,
        endDate: data.endDate ? moment(data.endDate) : null
      };
      form.setFieldsValue(parsedData)
      setProductData(parsedData)
      setTitleName(parsedData?.name);
    });
  }

  const editProduct = () => {
    console.log(form.getFieldsValue())
    form
      .validateFields()
      .then(async (values) => {
        console.log(values);
        const payload = {
          ...values,
          productVariants: values?.productVariants.map((item, index) => ({
            ...item,
            priority: index
          })),
          id: match?.params?.id
        }
        productDataService
          .updateProductAsync(payload)
          .then((res) => {
            if (res) {
              message.success(pageData.productEditedSuccess);
              onCompleted();
            }
          })
          .catch((errs) => {
            form.setFields(getValidationMessages(errs));
          });
      })
      .catch((errors) => {
        if (errors?.errorFields?.length > 0) {
          const elementId = errors?.errorFields[0]?.name.join('-')
          scrollToElement(elementId)
        }
      })
  }

  const onFieldsChange = () => {
    setIsChangeForm(true)
    setDisableCreateButton(false)
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
      onCompleted()
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

  const onChangeStatus = async (active) => {
    setProductData(data=>{return {...data,isActive:!data.isActive}})
    form.setFieldValue('isActive',!active)
  }

  const handleDeleteItem = async (productId, productName) => {
    var res = await productDataService.deleteProductByIdAsync(productId);
    if (res) {
      onCompleted();
      message.success(pageData.productDeleteSuccess);
    } else {
      message.error(pageData.productDeleteFail);
    }
  }

  const handleOpenDeletePopup = () => {
    setTitleModal(pageData.leaveDialog.confirmDelete)
    setIsModalVisible(true)
  }

  return (
    <>
      {productData ? ( // Check if productData has data
        <>
          <Form
            form={form}
            name="basic"
            scrollToFirstError
            onFieldsChange={onFieldsChange}
            autoComplete="off"
          >
            <Row className="shop-row-page-header">
              <Col xs={24} sm={24} lg={12}>
                <Row>
                  <p className="card-header">
                    <PageTitle content={titleName} />
                  </p>
                  <ShopActiveStatus status={productData?.isActive}/>
                </Row>
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
                          icon={<PlusOutlined className="icon-btn-add-option" />}
                          className="btn-create-form"
                          onClick={editProduct}
                        >
                          {pageData.btnSave}
                        </Button>
                      ),
                      permission: PermissionKeys.EDIT_PRODUCT
                    },
                    {
                      action: (
                        <a onClick={() => onCancel()} className="action-cancel">
                          {pageData.btnCancel}
                        </a>
                      ),
                      permission: null
                    },
                    {
                      action: (
                        <Form.Item name={'isActive'}>
                          <ChangeStatusButton onClick={onChangeStatus}/>
                        </Form.Item>
                      ),
                      permission: PermissionKeys.EDIT_PRODUCT
                    },
                    {
                      action: (
                        <a onClick={() => handleOpenDeletePopup()} className="action-delete">
                          {pageData.btnDelete}
                        </a>
                      ),
                      permission: PermissionKeys.EDIT_PRODUCT
                    }
                  ]}
                />
              </Col>
            </Row>

            <div className="col-input-full-width create-product-page">
              <Row className="grid-container-create-product">
                <LeftProductDetail form={form} productData={productData} />
                <RightProductDetail form={form} productSizes={productSizes} setProductSizes={setProductSizes} productData={productData} />
              </Row>
              <br />
              <Row>
                <StockProductTable form={form} productSizes={productSizes} productData={productData} />
              </Row>
            </div>
          </Form>
          <DeleteProductComponent
            isModalVisible={isModalVisible}
            preventDeleteProduct={preventDeleteProduct}
            titleModal={titleModal}
            handleCancel={() => setIsModalVisible(false)}
            onDelete={handleDeleteItem}
          />
          <DeleteConfirmComponent
            title={pageData.leaveDialog.confirmLeaveTitle}
            content={pageData.leaveDialog.confirmLeaveContent}
            visible={showConfirm}
            skipPermission={true}
            cancelText={pageData.btnDiscard}
            okText={pageData.leaveDialog.confirmLeave}
            onCancel={onDiscard}
            onOk={onCompleted}
            isChangeForm={isChangeForm}
          />
        </>
      ) : (
        <p>Loading...</p> // Render loading indicator if productData is null or empty
      )}
    </>

  )
}
