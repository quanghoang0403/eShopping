import { Button, Col, Form, Input, Row, message, Switch, Tooltip, Space } from "antd";
import { env } from "env";
import { InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Text from "antd/lib/typography/Text";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import otherFoodyPlatformConfigDataService from "data-services/other-foody-platform-config/other-foody-platform-config-data.service";
import { StoreGeneralConfigInfoCircleIcon } from "constants/icons.constants";

export function OtherFoodyPlatformConfigComponent(props) {
  const otherFoodyPlatformDefaultLogoPath = `assets/images/default-foody-platform-logo.png`;
  const otherFoodyPlatformDefaultLogo = `${env.REACT_APP_ROOT_DOMAIN}/${otherFoodyPlatformDefaultLogoPath}`;
  const { onCompleted, initData } = props;
  const [activeButton, setActiveButton] = useState(true);
  const [activeDeleteButton, setActiveDeleteButton] = useState(true);
  const [foodyPlatformConfig, setFoodyPlatformConfig] = useState();
  const [image, setImage] = useState(null);
  const [isAllowInputDiscountFromPromotion, setIsAllowInputDiscountFromPromotion] = useState(false);
  const [isAllowInputDiscountFromPartner, setIsAllowInputDiscountFromPartner] = useState(false);
  const [isDefaultImageUsed, setIsDefaultImageUsed] = useState(false);
  const [displayDeleteFoodyPlatformConfirmation, setDisplayDeleteFoodyPlatformConfirmation] = useState(false);
  const [deleteFoodyPlatformContent, setDeleteFoodyPlatformContent] = useState("");
  const [enableEditing, setEnableEditing] = useState(false);
  const [isFieldsModified, setIsFieldsModified] = useState(false);
  const [allowToChangeLogo, setAllowToChangeLogo] = useState(false);
  const [isRevalidateInput, setIsRevalidateInput] = useState(false);
  const { t } = useTranslation();
  const fnbImageSelectRef = React.useRef();
  const [form] = Form.useForm();
  const pageData = {
    logo: t("otherFoodyPlatform.logo"),
    platformName: t("otherFoodyPlatform.platformName"),
    platformNamePlaceholder: t("otherFoodyPlatform.platformNamePlaceholder"),
    partnerCommission: t("otherFoodyPlatform.partnerCommission"),
    platformNameValidationMessage: t("otherFoodyPlatform.platformNameValidationMessage"),
    allowInputDiscountFromPromotion: t("otherFoodyPlatform.allowInputDiscountFromPromotion"),
    allowInputDiscountFromPromotionTooltip: t("otherFoodyPlatform.allowInputDiscountFromPromotionTooltip"),
    allowInputDiscountFromPartner: t("otherFoodyPlatform.allowInputDiscountFromPartner"),
    allowInputDiscountFromPartnerTooltip: t("otherFoodyPlatform.allowInputDiscountFromPartnerTooltip"),
    updateFailed: t("messages.updatePlatformFailed"),
    deleteFailed: t("messages.deletePlatformFailed"),
    generalInformation: {
      title: t("otherFoodyPlatform.generalInformation.title"),
      uploadImage: t("otherFoodyPlatform.generalInformation.addFile"),
    },
    upload: {
      addFromUrl: t("upload.addFromUrl"),
    },
    media: {
      title: t("media.title"),
      textNonImage: t("media.textNonImage"),
    },
    bestDisplayImage: t("messages.imageBestDisplay"),
    btnUpdate: t("otherFoodyPlatform.update"),
    btnCancel: t("otherFoodyPlatform.cancel"),
    btnDelete: t("otherFoodyPlatform.delete"),
    deleteFoodyPlatformConfirmationTitle: t("otherFoodyPlatform.deleteFoodyPlatformConfirmationTitle"),
    deleteFoodyPlatformConfirmationCancellation: t("otherFoodyPlatform.deleteFoodyPlatformConfirmationCancellation"),
    deleteFoodyPlatformConfirmationOk: t("otherFoodyPlatform.deleteFoodyPlatformConfirmationOk"),
    partnerCommissionValidationMessage: t("otherFoodyPlatform.partnerCommissionValidationMessage"),
    partnerCommissionPlaceholder: t("otherFoodyPlatform.partnerCommissionPlaceholder")
  };

  useEffect(() => {
    form.resetFields(["partnerCommission", "name"]);
    if (initData) {
      setInitData(initData);
    }
    if (initData?.isActive) {
      form.validateFields();
    }
  }, [initData]);

  useEffect(() => {
    setEnableEditing(initData?.isActive);
  }, [initData?.isActive]);

  const setInitData = (data) => {
    form.setFieldValue("id", data?.id);
    form.setFieldValue("name", data?.name);
    form.setFieldValue("partnerCommission", data?.partnerCommission);
    form.setFieldValue("logo", data?.logo);
    setImage(initData?.logo);
    setIsDefaultImageUsed(false);
    setIsAllowInputDiscountFromPromotion(data?.isAllowInputDiscountFromPromotion);
    setIsAllowInputDiscountFromPartner(data?.isAllowInputDiscountFromPartner)
    setFoodyPlatformConfig(data);
    setEnableEditing(initData?.isActive);
    setActiveButton(initData?.isActive);
    setActiveDeleteButton(Boolean(!initData?.foodyPlatformId));
    setIsFieldsModified(false);
    setAllowToChangeLogo(Boolean(!initData?.foodyPlatformId));
    setIsRevalidateInput(false);
    fnbImageSelectRef.current.setImageUrl([initData?.logo]);
  };

  const onClickUpdate = (values) => {
    let updatedFoodyPlatform = {
      id: values?.id,
      name: values?.name,
      logo: initData?.foodyPlatformId || isDefaultImageUsed ? null : values?.logo,
      partnerCommission: values.partnerCommission,
      isAllowInputDiscountFromPromotion: isAllowInputDiscountFromPromotion,
      isAllowInputDiscountFromPartner: isAllowInputDiscountFromPartner,
    }

    otherFoodyPlatformConfigDataService.updateFoodyPlatformConfigAsync(updatedFoodyPlatform).then((response) => {
      if (response?.isSuccess === true) {
        message.success(t(response.message));
        onCompleted();
      }
      else {
        message.error(t(response.message));
        setIsRevalidateInput(true);
      }
    }).catch((response) => {
      message.error(t(pageData.updateFailed));
      setIsRevalidateInput(true);
    });
  };

  const onValidForm = () => {
    if (isRevalidateInput) {
      form.validateFields();
    }
  };

  const onChangeImage = (file) => {
    if (!file) {
      //Reset to default image automatically after image is removed
      setTimeout(() => {
        fnbImageSelectRef.current.setImageUrl([otherFoodyPlatformDefaultLogo]);
        setImage(otherFoodyPlatformDefaultLogo);
        form.setFieldValue("logo", null);
      }, 0);
    }
    else {
      setImage(file);
      form.setFieldValue("logo", file);
    }
    setIsFieldsModified(true);
  }

  const handleDisplayDeleteConfirmationDialog = () => {
    setDeleteFoodyPlatformContent(
      t("otherFoodyPlatform.deleteFoodyPlatformConfirmationContent")
      .replace('{{name}}', `
        <span class="alert-text">
          ${foodyPlatformConfig?.name}
        </span>
      `)
    );
    setDisplayDeleteFoodyPlatformConfirmation(true);
  }

  const handleDeleteFoodyPLatform = () => {
    if (foodyPlatformConfig?.id) {
      otherFoodyPlatformConfigDataService.deleteFoodyPlatformConfigAsync(foodyPlatformConfig?.id).then((response) => {
        if (response?.isSuccess === true) {
          message.success(t(response.message));
          onCompleted();
        }
        else {
          message.error(t(response.message));
        }
      }).catch((response) => {
        message.error(t(pageData.deleteFailed));
      });
    }
    setDisplayDeleteFoodyPlatformConfirmation(false);
  }

  const handleCancelDeleteFoodyPLatform = () => {
    setDisplayDeleteFoodyPlatformConfirmation(false);
  }

  const handleCancelEditingFoodyPlayform = () => {
    setInitData(initData);
  }

  const handleChangePlatformName = () => {
    setIsFieldsModified(true);
  }

  const handleChangePartnerCommission = () => {
    setIsFieldsModified(true);
  }

  const handleChangeIsAllowInputDiscountFromPromotion = checked => {
    setIsAllowInputDiscountFromPromotion(checked);
    setIsFieldsModified(true);
  }

  const handleChangeIsAllowInputDiscountFromPartner = checked => {
    setIsAllowInputDiscountFromPartner(checked);
    setIsFieldsModified(true);
  }

  return (
    <>
      <Form
        form={form}
        className="mt-3"
        layout="vertical"
        autoComplete="off"
        onFinish={onClickUpdate}
        onChange={onValidForm}
      >
        <DeleteConfirmComponent
            title={pageData.deleteFoodyPlatformConfirmationTitle}
            content={deleteFoodyPlatformContent}
            visible={displayDeleteFoodyPlatformConfirmation}
            skipPermission={true}
            cancelText={pageData.deleteFoodyPlatformConfirmationCancellation}
            okText={pageData.deleteFoodyPlatformConfirmationOk}
            onCancel={handleCancelDeleteFoodyPLatform}
            onOk={handleDeleteFoodyPLatform}
          />
        <Row gutter={[16, 16]}>
          <Col sm={24} xs={24} lg={16}>
            <Tooltip placement="topLeft" overlayClassName="tooltip-foody-platform" title={t(foodyPlatformConfig?.name)}>
              <div className="foody-platform-title limited-character-one-line">{foodyPlatformConfig?.name}</div>
            </Tooltip>
          </Col>
          {(activeDeleteButton || (activeButton && isFieldsModified)) &&
            <Col sm={24} xs={24} lg={8}>
              <Form.Item>
                <Space className="group-button">
                  {
                    activeDeleteButton &&
                    <Button htmlType="button" className="delete-button" type="primary" onClick={handleDisplayDeleteConfirmationDialog}>
                      {pageData.btnDelete}
                    </Button>
                  }
                  {
                    activeButton && isFieldsModified && (
                      <Button htmlType="button" className="cancel-button" type="primary" onClick={handleCancelEditingFoodyPlayform}>
                        {pageData.btnCancel}
                      </Button>
                    )
                  }
                  {
                    activeButton && isFieldsModified && (
                    <Button className="update-button" htmlType="submit" type="primary">
                        {pageData.btnUpdate}
                      </Button>
                    )
                  }
                </Space>
              </Form.Item>
            </Col>
          }
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <h3>{pageData.logo}</h3>
            <Form.Item
              name="logo"
            >
              <Row className={`non-image ${image !== null ? "have-image" : ""}`}>
                <Col span={24} className={`image-product ${image !== null ? "justify-left" : ""}`}>
                  <Form.Item name={["image", "media"]}>
                    <div style={foodyPlatformConfig?.isActive ? {} : {filter: 'grayscale(100%)'}}>
                    <FnbImageSelectComponent
                      ref={fnbImageSelectRef}
                      buttonText={pageData.generalInformation.uploadImage}
                      onChange={onChangeImage}
                      isDisabled={!enableEditing || !allowToChangeLogo}
                    />
                    </div>
                  </Form.Item>
                </Col>
                <Col
                  span={24}
                  className="create-edit-product-text-non-image"
                  hidden={image !== null ? true : false}
                >
                  <Text disabled>
                    {pageData.media.textNonImage}
                    <br />
                    {pageData.bestDisplayImage}
                  </Text>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Form.Item name="id">
            <Input type="hidden"/>
          </Form.Item>
          <Col span={24}>
            <span className="platform-name">{pageData.platformName}<span className="required-field">*</span></span>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: pageData.platformNameValidationMessage,
                },
              ]}
            >
              <FnbInput
                showCount
                maxLength={100}
                disabled={!enableEditing}
                placeholder={pageData.platformNamePlaceholder}
                onChange={handleChangePlatformName}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <span className="partner-commission">{pageData.partnerCommission}</span>
            <Form.Item
              name="partnerCommission"
              rules={[
                {
                  required: enableEditing,
                  message: pageData.partnerCommissionValidationMessage,
                },
              ]}
            >
              <InputNumber
                className="fnb-input-number w-100 discount-amount"
                defaultValue={foodyPlatformConfig?.partnerCommission}
                addonAfter={<span style={{paddingRight: 15}}>%</span>}
                disabled={!enableEditing}
                precision={2}
                max={100}
                min={0}
                placeholder={pageData.partnerCommissionPlaceholder}
                onChange={handleChangePartnerCommission}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} wrap={true}>
          <Col span={24} className="promotion-switch">
            <div className="discount-switch-button"> 
              <Switch disabled={!enableEditing} checked={isAllowInputDiscountFromPromotion} onChange={handleChangeIsAllowInputDiscountFromPromotion} />
            </div>
            <span className="discount-switch-title ml-1" >
              {pageData.allowInputDiscountFromPromotion}
            </span>
            <Tooltip
              placement="topLeft"
              useCssRight
              autoAdjustOverflow={true}
              overlayClassName="tooltip-foody-platform"
              overlay={pageData.allowInputDiscountFromPromotionTooltip}
            >
              <span className="discount-switch-icon">
                <StoreGeneralConfigInfoCircleIcon className="exclamation-circle"/>
              </span>
            </Tooltip>
          </Col>
        </Row>

        <br/>

        <Row gutter={[16, 16]}>
          <Col span={24} className="discount-switch">
            <div className="partner-switch-button"> 
              <Switch disabled={!enableEditing} checked={isAllowInputDiscountFromPartner} onChange={handleChangeIsAllowInputDiscountFromPartner} />
            </div>
            <span className="partner-switch-title ml-0">
              {pageData.allowInputDiscountFromPartner}
            </span>
            <Tooltip
              placement="topLeft"
              useCssRight
              autoAdjustOverflow={true}
              overlayClassName="tooltip-foody-platform"
              title={pageData.allowInputDiscountFromPartnerTooltip}
            >
              <span className="partner-switch-icon">
                <StoreGeneralConfigInfoCircleIcon className="exclamation-circle"/>
              </span>
            </Tooltip>
          </Col>
        </Row>
      </Form>
    </>
  );
}
