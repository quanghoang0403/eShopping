import { Button, Col, Form, Row, message, Switch, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";
import { StoreGeneralConfigInfoCircleIcon } from "constants/icons.constants";
import otherFoodyPlatformConfigDataService from "data-services/other-foody-platform-config/other-foody-platform-config-data.service";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import { InputNumber } from "antd";
import React, {useState} from "react";
import { useTranslation } from "react-i18next";

const { forwardRef, useImperativeHandle } = React;
export const AddNewOtherFoodyPlatformConfigComponent = forwardRef((props, ref) => {
  const { onCompleted } = props;
  const [activeFunctionButton, setActiveFunctionButton] = useState(true);
  const [image, setImage] = useState(null);
  const [isAllowInputDiscountFromPromotion, setIsAllowInputDiscountFromPromotion] = useState(true);
  const [isAllowInputDiscountFromPartner, setIsAllowInputDiscountFromPartner] = useState(true);
  const [isRevalidateInput, setIsRevalidateInput] = useState(false);
  const { t } = useTranslation();
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
    btnCancel: t("otherFoodyPlatform.cancel"),
    btnAdd: t("otherFoodyPlatform.add"),
    addSuccess: t("messages.createPlatformSuccessfully"),
    addFailed: t("messages.createPlatformFailed"),
    generalInformation: {
      title: t("otherFoodyPlatform.generalInformation.title"),
      uploadImage: t("otherFoodyPlatform.generalInformation.addFile"),
    },
    upload: {
      addFromUrl: t("upload.addFromUrl"),
    },
    media: {
      title: t("otherFoodyPlatform.logo"),
      textNonImage: t("media.textNonImage"),
    },
    bestDisplayImage: t("messages.imageBestDisplay"),
    partnerCommissionValidationMessage: t("otherFoodyPlatform.partnerCommissionValidationMessage"),
    partnerCommissionPlaceholder: t("otherFoodyPlatform.partnerCommissionPlaceholder"),
  };

  useImperativeHandle(ref, () => ({
    reset() {
      reset();
    },
  }));

  const reset = () => {
    form.resetFields();
    setIsAllowInputDiscountFromPromotion(true);
    setIsAllowInputDiscountFromPartner(true);
    setImage(null);
  };

  const onClickAdd = (values) => {
    let newFoodyPlatform = {
      name: values.platFormName,
      logo: values?.image?.media?.url,
      partnerCommission: values.partnerCommission,
      isAllowInputDiscountFromPromotion: isAllowInputDiscountFromPromotion,
      isAllowInputDiscountFromPartner: isAllowInputDiscountFromPartner,
    }
    form.validateFields();
    otherFoodyPlatformConfigDataService.createFoodyPlatformConfigAsync(newFoodyPlatform).then((response) => {
      if (response?.isSuccess === true) {
        message.success(t(response.message));
        onCompleted();
      }
      else {
        message.error(t(response.message));
        setIsRevalidateInput(true);
      }
    }).catch((response) => {
      message.error(t(pageData.addFailed));
      setIsRevalidateInput(true);
    });
  };

  const onValidForm = () => {
    if (isRevalidateInput) {
      form.validateFields();
    }
  };

  const renderAddNewForm = () => {
      return <Form
        form={form}
        className="mt-3"
        layout="vertical"
        autoComplete="off"
        onFinish={onClickAdd}
        onChange={onValidForm}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <span className="platform-name">{pageData.platformName}<span className="required-field">*</span></span>
            <Form.Item
              name="platFormName"
              rules={[
                {
                  required: true,
                  message: pageData.platformNameValidationMessage,
                },
              ]}
            >
              <FnbInput showCount maxLength={100} placeholder={pageData.platformNamePlaceholder}/>
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
                  required: true,
                  message: pageData.partnerCommissionValidationMessage,
                },
              ]}
            >
              <InputNumber
                className="fnb-input-number w-100 discount-amount"
                defaultValue={""}
                addonAfter={<span style={{paddingRight: 15}}>%</span>}
                precision={2}
                max={100}
                min={0}
                placeholder={pageData.partnerCommissionPlaceholder}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} wrap={true}>
          <Col span={24} className="promotion-switch">
              <div className="discount-switch-button"> 
                <Switch checked={isAllowInputDiscountFromPromotion} onChange={(checked) => setIsAllowInputDiscountFromPromotion(checked)} />
              </div>
              <span className="discount-switch-title">
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
              <Switch checked={isAllowInputDiscountFromPartner} onChange={(checked) => setIsAllowInputDiscountFromPartner(checked)} />
            </div>
            <span className="partner-switch-title">
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
  }

  const onChangeImage = (file) => {
    setImage(file);
    setActiveFunctionButton(true);
  }

  const cancelAddNewFoodyPlatform = () => {
    onCompleted();
  }

  return (
    <>
      <Form
        form={form}
        className="mt-3"
        layout="vertical"
        autoComplete="off"
        onFinish={onClickAdd}
        onChange={onValidForm}
      >
        <Row gutter={[16, 16]}>
          <Col sm={24} xs={24} lg={16}>
            {renderAddNewForm()}
          </Col>
          <Col sm={24} xs={24} lg={8}>
              <h4 className="title-group">{pageData.media.title}</h4>
              <Row className={`non-image ${image !== null ? "have-image" : ""}`}>
                <Col span={24} className={`image-product ${image !== null ? "justify-left" : ""}`}>
                  <div style={{ display: "flex" }}>
                    <Form.Item name={["image", "media"]}>
                      <FnbUploadImageComponent
                        buttonText={pageData.generalInformation.uploadImage}
                        onChange={onChangeImage}
                      />
                    </Form.Item>
                    <a className="upload-image-url" hidden={image !== null ? true : false}>
                      {pageData.upload.addFromUrl}
                    </a>
                  </div>
                </Col>
                <Col
                  span={24}
                  className="create-edit-product-text-non-image"
                  hidden={image !== null ? true : false}
                >
                  <Text className="image-placeholder" disabled>
                    {pageData.media.textNonImage}
                  </Text>
                </Col>
              </Row>
          </Col>
        </Row>
        <Row gutter={[16, { xs: 8, sm: 24, md: 24, lg: 32 }]}>
          <Col sm={0} xs={0} lg={9}></Col>
          <Col sm={9} xs={9} lg={3}>
            <div className="pt-1">
              <Form.Item>
                <Button type="primary" className="cancel-button w-100 mt-4" disabled={!activeFunctionButton} onClick={cancelAddNewFoodyPlatform}>
                  {pageData.btnCancel}
                </Button>
              </Form.Item>
            </div>
          </Col>
          <Col sm={9} xs={9} lg={3}>
            <div className="pt-1">
              <Form.Item>
                <Button htmlType="submit" type="primary" className="w-100 mt-4" disabled={!activeFunctionButton}>
                  {pageData.btnAdd}
                </Button>
              </Form.Item>
            </div>
          </Col>
          <Col sm={0} xs={0} lg={9}></Col>
        </Row>
      </Form>
    </>
  );
});