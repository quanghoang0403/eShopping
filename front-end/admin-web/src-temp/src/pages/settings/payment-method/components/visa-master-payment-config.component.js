import React, { useEffect, useState } from "react";
import { Col, Row, Form, Input, Button, message } from "antd";
import { ChromeFilled, MailFilled, PhoneFilled } from "@ant-design/icons";
import { paymentMethod } from "constants/payment-method.constants";
import paymentConfigDataService from "data-services/payment-config/payment-config-data.service";
import { useTranslation } from "react-i18next";
import { CancelButton } from "components/cancel-button";

export function VisaMasterPaymentConfigComponent(props) {
  const { onCompleted, initData } = props;
  const [activeAuthenticateButton, setActiveAuthenticateButton] = useState(true);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const pageData = {
    partnerCode: "Terminate ID",
    partnerCodeValidationMessage: t("payment.secretKeyValidationMessage"),
    secretKey: t("payment.secretKey"),
    secretKeyPlaceholder: t("payment.secretKeyPlaceholder"),
    secretKeyValidationMessage: t("payment.secretKeyValidationMessage"),
    btnAuthenticate: t("button.save"),
    updateSuccess: t("payment.updateSuccess"),
    updateFailed: t("payment.updateFailed"),
    vnpayUrl: "https://vnpay.vn",
    vnpayMail: "khdn.cskh@vnpay.vn",
    vnpayPhone: "0243 8291 291",
  };

  useEffect(() => {
    setInitData(initData);
  }, []);

  const setInitData = paymentMethod => {
    const { paymentConfigs } = paymentMethod;
    const config = {
      paymentMethodId: paymentMethod?.id,
      partnerCode: paymentConfigs[0]?.partnerCode,
      secretKey: paymentConfigs[0]?.secretKey,
    };
    if (paymentConfigs && config) {
      form.setFieldsValue(config);
      setActiveAuthenticateButton(false);
    }
  };

  const onClickAuthenticate = values => {
    paymentConfigDataService.updatePaymentConfigAsync(values).then(success => {
      if (success === true) {
        message.success(pageData.updateSuccess);
      } else {
        message.error(pageData.updateFailed);
      }

      onCompleted();
    });
  };

  const onValidForm = () => {
    form
      .validateFields()
      .then(_ => {
        setActiveAuthenticateButton(false);
      })
      .catch(_ => {
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
        onFieldsChange={() => onFormChanged()}
      >
        <Row>
          <Col span={24} className="component-title mb-4">
            <h1 className="title">{t(initData?.name)}</h1>
            {isChangeForm &&
              <Row className="list-button">
                <CancelButton onOk={() => onCancel()} className="action-cancel">
                </CancelButton>
                <Button disabled={activeAuthenticateButton} type="primary" htmlType="submit" onClick={() => onClickAuthenticate()}>
                  {pageData.btnAuthenticate}
                </Button>
              </Row>
            }
          </Col>
          <Form.Item name="enumId" initialValue={paymentMethod.CreditDebitCard}>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="paymentMethodId">
            <Input type="hidden" />
          </Form.Item>
          <Col span={24}>
            <h4>{pageData.partnerCode}</h4>
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
      <Row gutter={[16, 16]} className="mt-5 pt-5">
        <Col span={8}>
          <div className="text-center">
            <a href={`${pageData.vnpayUrl}`} target={"_blank"} className="text-center">
              <div className="text-center">
                <ChromeFilled className="fs-30 color-black"></ChromeFilled>
              </div>
              {pageData.vnpayUrl}
            </a>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <a href={`mailto:${pageData.vnpayMail}`} target={"_blank"} className="text-center">
              <div className="text-center">
                <MailFilled className="fs-30 color-black" />
              </div>
              {pageData.vnpayMail}
            </a>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <a href={`tel:${pageData.vnpayPhone}`} target={"_blank"} className="text-center">
              <div className="text-center">
                <PhoneFilled className="fs-30 color-black" />
              </div>
              {pageData.vnpayPhone}
            </a>
          </div>
        </Col>
      </Row>
    </>
  );
}
