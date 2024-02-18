import { Button, Col, Form, Input, Row, message, Image } from "antd";
import { CancelButton } from "components/cancel-button";
import { paymentMethod } from "constants/payment-method.constants";
import paymentConfigDataService from "data-services/payment-config/payment-config-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function MoMoPaymentConfigComponent(props) {
  const { onCompleted, initData } = props;
  const [activeAuthenticateButton, setActiveAuthenticateButton] = useState(true);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const pageData = {
    partnerCode: t("payment.partnerCode"),
    partnerCodePlaceholder: t("payment.partnerCodePlaceholder"),
    partnerCodeValidationMessage: t("payment.partnerCodeValidationMessage"),
    accessKey: t("payment.accessKey"),
    accessKeyPlaceholder: t("payment.accessKeyPlaceholder"),
    accessKeyValidationMessage: t("payment.accessKeyValidationMessage"),
    publicKey: t("payment.publicKey", "Public key"), //new
    publicKeyPlaceholder: t("payment.publicKeyPlaceholder", "Enter public key"), //new
    publicKeyValidationMessage: t("payment.publicKeyValidationMessage", "Please enter public key"), //new
    secretKey: t("payment.secretKey"),
    secretKeyPlaceholder: t("payment.secretKeyPlaceholder"),
    secretKeyValidationMessage: t("payment.secretKeyValidationMessage"),
    btnAuthenticate: t("payment.authenticate"),
    updateSuccess: t("payment.updateSuccess"),
    logo: t("payment.logo")
  };
  useEffect(() => {
    setInitData(initData);
  }, []);

  const setInitData = (paymentMethod) => {
    const { paymentConfigs } = paymentMethod;
    if (paymentConfigs && paymentConfigs[0]) {
      const config = {
        paymentMethodId: paymentMethod?.id,
        ...paymentConfigs[0],
      };
      if (paymentConfigs && config) {
        form.setFieldsValue(config);
        setActiveAuthenticateButton(false);
      }
    }
  };

  const onClickAuthenticate = (values) => {
    paymentConfigDataService.updatePaymentConfigAsync(values).then((success) => {
      if (success === true) {
        message.success(pageData.updateSuccess);
        setIsChangeForm(false);
        onCompleted();
      }
    });
  };

  const onValidForm = () => {
    form
      .validateFields()
      .then((_) => {
        setActiveAuthenticateButton(false);
      })
      .catch((_) => {
        setActiveAuthenticateButton(true);
      });
  };

  const onCancel = () => {
    setInitData(initData);
    setIsChangeForm(false);
  }

  const onFormChanged = () => {
    setIsChangeForm(true);
  };
  
  return (
    <>
      <Form
        form={form}
        className="mt-3 enterprise-payment-config"
        layout="vertical"
        autoComplete="off"
        onFinish={onClickAuthenticate}
        onChange={onValidForm}
        onFieldsChange={(e) => { onFormChanged(); }}
      >
        <Row>
          <Col span={24} className="component-title mb-4">
            <h1 className="title">{t(initData?.name)}</h1>
            { isChangeForm &&
              <Row className="list-button">
                <CancelButton onOk={() => onCancel()} className="action-cancel">
                </CancelButton>
                <Button disabled={activeAuthenticateButton} type="primary" htmlType="submit" onClick={() => onClickAuthenticate()}>
                  {pageData.btnAuthenticate}
                </Button>
              </Row>
            }
          </Col>
          <Form.Item name="enumId" initialValue={paymentMethod.MoMo}>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="paymentMethodId">
            <Input type="hidden" />
          </Form.Item>
          <Col span={24}>
            <h4>{pageData.logo}</h4>
            <Image className={`title-center title-image ${initData?.paymentConfigs[0]?.isActivated ? "" : "disable"}`} preview={false} width={140} height={140} src={initData?.icon} />
          </Col>
          <Col span={24}>
            <h4 className="mt-4">{pageData.partnerCode}</h4>
            <Form.Item
              name="partnerCode"
              rules={[
                {
                  required: true,
                  message: pageData.partnerCodeValidationMessage,
                },
              ]}
            >
              <Input className="fnb-input" placeholder={pageData.partnerCodePlaceholder} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <h4>{pageData.accessKey}</h4>
            <Form.Item
              name="accessKey"
              rules={[
                {
                  required: true,
                  message: pageData.accessKeyValidationMessage,
                },
              ]}
            >
              <Input className="fnb-input" placeholder={pageData.accessKeyPlaceholder} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <h4>{pageData.publicKey}</h4>
            <Form.Item
              name="publicKey"
              rules={[
                {
                  required: true,
                  message: pageData.publicKeyValidationMessage,
                },
              ]}
            >
              <Input className="fnb-input" placeholder={pageData.publicKeyPlaceholder} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <h4>{pageData.secretKey}</h4>
            <Form.Item
              name="secretKey"
              rules={[
                {
                  required: true,
                  message: pageData.secretKeyValidationMessage,
                },
              ]}
            >
              <Input.Password className="fnb-input" placeholder={pageData.accessKeyPlaceholder} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
