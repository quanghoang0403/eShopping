import { Card, Col, Form, Input, InputNumber, Row, Tooltip, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import { BadgeSEOKeyword, SEO_KEYWORD_COLOR_LENGTH } from 'components/badge-keyword-SEO/badge-keyword-SEO.component';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import PageTitle from 'components/page-title';
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single';
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component';
import { ExclamationIcon } from 'constants/icons.constants';
import { PermissionKeys } from 'constants/permission-key.constants';
import { ProductGender } from 'constants/product-status.constants';
import RootCategoryDataService from 'data-services/product-category/product-root-category-data.service';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export default function CreateRootCategory(props) {
  const [t] = useTranslation()
  const history = useHistory();
  const [form] = useForm()
  const [isKeywordSEOChange, setIsKewwordSEOChange] = useState(false)
  const [keywordSEOs, setKeywordSEOList] = useState([]);
  const [keywordSEO, setKeywordSEO] = useState({})
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const addSEOKeywords = (e) => {
    e.preventDefault();
    setKeywordSEOList(list => !list.find(kw => kw.id === keywordSEO.id) && keywordSEO.value !== '' ? [...list, keywordSEO] : [...list]);
    setKeywordSEO({ id: '', value: '' });
    setIsKewwordSEOChange(false)
  }
  const removeSEOKeyword = (keyword) => {
    setKeywordSEOList(list => list.filter(kw => kw.id !== keyword.id));
  }
  const pageData = {
    title: t('root-category.createTitle'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.addNew'),
    btnDiscard: t('button.discard'),
    productCategoryAddedSuccess: t('productCategory.productCategoryAddedSuccess'),
    generalInformation: {
      title: t('productCategory.titleInfo'),
      name: {
        label: t('productCategory.labelName'),
        placeholder: t('productCategory.placeholderName'),
        required: true,
        maxLength: 100,
        validateMessage: t('productCategory.validateName')
      }

    },
    gender: {
      genderCategory: t('productCategory.genderCategory'),
      placeholderGender: t('productCategory.placeholderGender')
    },
    product: {
      title: t('productCategory.titleProduct'),
      placeholder: t('productCategory.placeholderProduct')
    },
    priority: {
      title: t('productCategory.titlePriority'),
      placeholder: t('productCategory.placeholderPriority'),
      validateMessage: t('productCategory.validatePriority'),
      tooltip: t('productCategory.tooltipPriority')
    },
    content: {
      title: t('productCategory.productCategoryContent'),
      placeholder: t('productCategory.placeholderContent')
    },
    description: {
      title: t('productCategory.categoryDescription'),
      placeholder: t('productCategory.placeholderCategoryDescription'),
      maxLength: 250
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
        minlength: 50,
        maxLength: 100
      },
      description: {
        label: t('form.SEODescription'),
        placeholder: t('form.SEODescriptionPlaceholder'),
        validateMessage: t('form.messageMatchSuggestSEODescription'),
        minlength: 150,
        maxLength: 200,
        tooltip: t('form.SEODescriptionTooltip')
      }
    },
    leaveDialog: {
      confirmLeave: t('dialog.confirmLeave'),
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent')
    }
  }
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
        <Row>
          <div className="w-100">
            <h2>{pageData.generalInformation.title}</h2>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} lg={16}>
                <Card className="shop-card">

                  {/* name */}
                  <div className="d-flex justify-content-center align-items-center">
                    <h3 className="shop-form-label mt-16">
                      {pageData.generalInformation.name.label}
                    </h3>
                    <span className="text-danger">*</span>
                  </div>
                  <Form.Item
                    name={['name']}
                    className="item-name"
                    rules={[
                      {
                        required: pageData.generalInformation.name.required,
                        message: pageData.generalInformation.name.validateMessage
                      }
                    ]}
                  >
                    <Input
                      className="shop-input-with-count"
                      showCount
                      placeholder={pageData.generalInformation.name.placeholder}
                      maxLength={pageData.generalInformation.name.maxLength}
                    />
                  </Form.Item>

                  {/* content and priority */}
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={24} md={24} lg={12}>
                      <div className="d-flex">
                        <h3 className="shop-form-label mt-16">
                          {pageData.priority.title}
                          <span className="text-danger">*</span>
                        </h3>
                        <Tooltip placement="topLeft" title={pageData.priority.tooltip}>
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
                            message: pageData.priority.validateMessage
                          }
                        ]}
                      >
                        <InputNumber
                          placeholder={pageData.priority.placeholder}
                          className="shop-input-number w-100"
                          min={1}
                          max={1000000}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12}>
                      <div className="d-flex">
                        <h3 className="shop-form-label mt-16">
                          {pageData.content.title}
                        </h3>
                      </div>
                      <Form.Item name={['content']}>
                        <Input
                          className="shop-input-with-count"
                          showCount
                          placeholder={pageData.content.placeholder}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* description form */}
                  <h3 className="shop-form-label mt-16">
                    {pageData.description.title}
                  </h3>
                  <Form.Item
                    name={['description']}
                    className="item-name"
                  >
                    <FnbTextArea
                      showCount
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      id="product-category-description"
                      placeholder={pageData.description.placeholder}
                      maxLength={pageData.description.maxLength}
                    ></FnbTextArea>
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card className="shop-card">
                  <h3>{pageData.gender.genderCategory}</h3>
                  <Form.Item
                    name={['genderProduct']}
                    className="item-name"
                    initialValue={ProductGender.All}
                  >
                    <FnbSelectSingle
                      noTranslateOptionName={true}
                      option={Object.keys(ProductGender).map(gender => {
                        return {
                          id: ProductGender[gender],
                          name: gender
                        }
                      })}
                      defaultValue={ProductGender.All}
                      placeholder={pageData.gender.placeholderGender}
                    />
                  </Form.Item>

                </Card>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <h2 className="shop-form-label mt-16">{pageData.SEOInformation.title}</h2>
                <Card className="shop-card">
                  {/* title SEO */}
                  <div className='d-flex'>
                    <h3 className="shop-form-label mt-16">
                      {pageData.SEOInformation.SEOtitle.label}
                    </h3>
                    <Tooltip placement="topLeft" title={pageData.SEOInformation.SEOtitle.tooltip}>
                      <span className="ml-12 mt-16">
                        <ExclamationIcon />
                      </span>
                    </Tooltip>
                  </div>

                  <Form.Item
                    name={['titleSEO']}
                    className="item-name"
                    rules={[
                      {
                        min: pageData.SEOInformation.SEOtitle.minlength,
                        message: pageData.SEOInformation.SEOtitle.validateMessage
                      }
                    ]}
                  >
                    <Input
                      className="shop-input-with-count"
                      showCount
                      placeholder={pageData.SEOInformation.SEOtitle.placeholder}
                      minLength={pageData.SEOInformation.SEOtitle.minlength}
                      maxLength={pageData.SEOInformation.SEOtitle.maxLength}
                    />
                  </Form.Item>

                  {/* descriptionSEO */}
                  <div className='d-flex'>
                    <h3 className="shop-form-label mt-16">
                      {pageData.SEOInformation.description.label}
                    </h3>
                    <Tooltip placement="topLeft" title={pageData.SEOInformation.description.tooltip}>
                      <span className="ml-12 mt-16">
                        <ExclamationIcon />
                      </span>
                    </Tooltip>
                  </div>
                  <Form.Item
                    name={['descriptionSEO']}
                    className="item-name"
                    rules={[
                      {
                        min: pageData.SEOInformation.description.minlength,
                        message: pageData.SEOInformation.description.validateMessage
                      }
                    ]}
                  >
                    <FnbTextArea
                      showCount
                      maxLength={pageData.SEOInformation.description.maxLength}
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      id="product-category-SEO-description"
                      placeholder={pageData.SEOInformation.description.placeholder}
                    ></FnbTextArea>
                  </Form.Item>

                  {/* keywordSEO */}
                  <div className='d-flex'>
                    <h3 className="shop-form-label mt-16">
                      {pageData.SEOInformation.keyword.label}
                    </h3>
                    <Tooltip placement="topLeft" title={pageData.SEOInformation.keyword.tooltip}>
                      <span className="ml-12 mt-16">
                        <ExclamationIcon />
                      </span>
                    </Tooltip>
                  </div>
                  <div>
                    {
                      keywordSEOs.length > 0 ? <BadgeSEOKeyword onClose={removeSEOKeyword} keywords={keywordSEOs} /> : ''
                    }

                    <div className='d-flex mt-3'>
                      <Input
                        className="shop-input-with-count"
                        showCount
                        value={keywordSEO?.value || ''}
                        placeholder={pageData.SEOInformation.keyword.placeholder}
                        onChange={e => {
                          if (e.target.value !== '') {
                            setKeywordSEO({
                              id: e.target.value,
                              value: e.target.value,
                              colorIndex: Math.floor(Math.random() * SEO_KEYWORD_COLOR_LENGTH)
                            })
                            setIsKewwordSEOChange(true)
                          }
                        }}
                      />
                      <ShopAddNewButton
                        permission={PermissionKeys.CREATE_PRODUCT_CATEGORY}
                        disabled={!isKeywordSEOChange}
                        text={pageData.SEOInformation.keyword.btnAdd}
                        className={'mx-4'}
                        onClick={addSEOKeywords}
                      />
                    </div>
                  </div>
                </Card>

              </Col>
            </Row>
          </div>
        </Row>
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