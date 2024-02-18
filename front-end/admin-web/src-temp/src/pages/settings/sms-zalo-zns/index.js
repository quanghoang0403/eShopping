import { Button, Col, Form, Row, Switch, message } from "antd";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import storeDataService from "data-services/store/store-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { images } from "../../../constants/images.constants";
import "./index.scss";

const EnumESMSTypes = {
  SMS: 0,
  ZaloZns: 1,
};

function SmsZaloZnsPage() {
  const [smsActive, setSmsActive] = useState(false);
  const [zaloZnsActive, setZaloZnsActive] = useState(false);
  const [currentTab, setCurrentTab] = useState(EnumESMSTypes.SMS);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [storeConfigs, setStoreConfigs] = useState([]);

  const [t] = useTranslation();
  const [form] = Form.useForm();

  const translateData = {
    settings: t("text.smsZaloZns.settings", "Settings"),
    apiKey: t("text.smsZaloZns.apiKey", "API Key"),
    enterApiKey: t("text.smsZaloZns.enterApiKey", "Enter API Key"),
    pleaseEnterApiKey: t("text.smsZaloZns.pleaseEnterApiKey", "Please enter API Key"),
    secretKey: t("text.smsZaloZns.secretKey", "Secret Key"),
    enterSecretKey: t("text.smsZaloZns.enterSecretKey", "Enter Secret Key"),
    pleaseEnterSecretKey: t("text.smsZaloZns.pleaseEnterSecretKey", "Please enter API Key"),
    save: t("button.save", "Save"),
    updateSuccess: t("text.smsZaloZns.updateSuccess", "Updated successfully"),
    max100Characters: t("text.smsZaloZns.maximum100Characters"),
    inValidApiKeySecretKey: t("text.smsZaloZns.inValidApiKeySecretKey", "Invalid Api key/ Secret Key"),
    updateFailed: t("text.smsZaloZns.updateFailed", "Update failed"),
  };

  useEffect(() => {
    initConfig();
  }, []);

  useEffect(() => {
    handleInitForm(currentTab);
  }, [currentTab]);

  useEffect(() => {
    handleDisableSaveButton();
  }, [smsActive, zaloZnsActive]);

  //#region Events
  const onSave = async () => {
    setDisableSaveBtn(true);
    setIsLoading(true);
    form.validateFields().then(async (values) => {
      message.destroy();
      var req = {
        storeESMSConfigId: storeConfigs?.find((x) => x.type === currentTab)?.id,
        apiKey: values.apiKey,
        secretKey: values.secretKey,
        type: currentTab,
        isEnabled: getESMSTypeActive(currentTab),
      };
      await storeDataService
        .updateESMSConfig(req)
        .then(async (res) => {
          if (res) {
            responseMessage(res);
          } else {
            message.error(translateData.updateFailed);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          message.error(translateData.updateFailed);
          setIsLoading(false);
        });
    });
    setDisableSaveBtn(false);
    setIsLoading(false);
  };

  const onEnableProvider = async (type, value) => {
    const formValue = form.getFieldsValue();
    message.destroy();
    var req = {
      storeESMSConfigId: storeConfigs?.find((x) => x.type === currentTab)?.id,
      apiKey: formValue.apiKey,
      secretKey: formValue.secretKey,
      type: type,
      isEnabled: value,
      isEnabledOnly: true,
    };
    await storeDataService
      .updateESMSConfig(req)
      .then((res) => {
        setDisableSaveBtn(true);
        if (res) {
          responseMessage(res);
        } else {
          message.error(translateData.updateFailed);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        message.error(translateData.updateFailed);
      });
  };

  const responseMessage = async (res) => {
    if (res.isSuccess) {
      message.success(translateData.updateSuccess);
    } else if (!Boolean(res.isValidApiSecretKey)) {
      message.error(translateData.inValidApiKeySecretKey);
    } else {
      message.error(translateData.updateFailed);
    }
  };
  //#endregion

  //#region functions
  const initConfig = async () => {
    const res = await storeDataService.getESMSConfig();
    if (res) {
      const esmsConfigs = res.esmsConfigs;
      setStoreConfigs(esmsConfigs);
      setSmsActive(esmsConfigs?.find((x) => x.type === EnumESMSTypes.SMS)?.isEnable);
      setZaloZnsActive(esmsConfigs?.find((x) => x.type === EnumESMSTypes.ZaloZns)?.isEnable ?? false);
      handleInitForm(currentTab, esmsConfigs);
    }
    setDisableSaveBtn(true);
  };

  const handleInitForm = (curTab, esmsConfigs = storeConfigs) => {
    form.resetFields();
    let apiKey = "";
    let secretKey = "";
    if (curTab === EnumESMSTypes.SMS) {
      const storeSMS = esmsConfigs?.find((x) => x.type === EnumESMSTypes.SMS);
      if (storeSMS) {
        apiKey = storeSMS?.apiKey;
        secretKey = storeSMS?.secretKey;
      }
    }
    if (curTab === EnumESMSTypes.ZaloZns) {
      const storeZaloZns = esmsConfigs?.find((x) => x.type === EnumESMSTypes.ZaloZns);
      if (storeZaloZns) {
        apiKey = storeZaloZns?.apiKey;
        secretKey = storeZaloZns?.secretKey;
      }
    }
    form.setFieldsValue({
      apiKey,
      secretKey,
    });
  };

  const disableInput = () => {
    return (
      (smsActive === false && currentTab === EnumESMSTypes.SMS) ||
      (zaloZnsActive === false && currentTab === EnumESMSTypes.ZaloZns)
    );
  };

  const getESMSTypeActive = (currentTab) => {
    switch (currentTab) {
      case EnumESMSTypes.ZaloZns:
        return zaloZnsActive;
      default:
        return smsActive;
    }
  };

  const handleDisableSaveButton = () => {
    if (currentTab === EnumESMSTypes.SMS && smsActive === false) {
      setDisableSaveBtn(true);
    } else if (currentTab === EnumESMSTypes.ZaloZns && zaloZnsActive === false) {
      setDisableSaveBtn(true);
    } else {
      setDisableSaveBtn(false);
    }
  };

  //#endregion

  //#region render components

  const renderProvider = () => {
    return (
      <Col sm={24} md={8}>
        {/* SMS */}
        <Row className={`provider ${currentTab === EnumESMSTypes.SMS ? "active" : ""}`} align={"middle"}>
          <Col sm={12} md={20} onClick={() => setCurrentTab(EnumESMSTypes.SMS)}>
            <img src={smsActive ? images.smsLogo : images.smsLogoNoColor} />
            <span style={{ marginLeft: "8px" }}>SMS</span>
          </Col>
          <Col sm={12} md={4} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Switch
              checked={smsActive}
              onChange={(value) => {
                setSmsActive(value);
                onEnableProvider(EnumESMSTypes.SMS, value);
              }}
              disabled={currentTab !== EnumESMSTypes.SMS}
            />
          </Col>
        </Row>

        {/* TODO: Implement later */}
        {/* Zalo ZNS */}
        {/* <Row className={`provider ${currentTab === EnumESMSTypes.ZaloZns ? "active" : ""}`} align={"middle"}>
          <Col span={20} onClick={() => setCurrentTab(EnumESMSTypes.ZaloZns)}>
            <img src={zaloZnsActive ? images.zaloZns : images.zaloZnsNoColor} />
            <span style={{ marginLeft: "8px" }}>Zalo ZNS</span>
          </Col>
          <Col span={4} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Switch
              checked={zaloZnsActive}
              onChange={(value) => {
                setZaloZnsActive(value);
                onEnableProvider(EnumESMSTypes.ZaloZns, value)
              }}
              disabled={currentTab !== EnumESMSTypes.ZaloZns}
            />
          </Col>
        </Row> */}
      </Col>
    );
  };

  const renderProviderSetting = () => {
    return (
      <Col sm={24} md={16}>
        <Row align={"middle"} style={{ height: "108px" }}>
          <Col sm={16} md={20}>
            <span id="settingTitle">{translateData.settings}</span>
          </Col>
          <Col sm={8} md={4}>
            <Button type="primary" onClick={() => onSave()} disabled={disableSaveBtn} loading={isLoading}>
              {translateData.save}
            </Button>
          </Col>
        </Row>
        {renderProviderSettingConfig()}
      </Col>
    );
  };

  const renderProviderSettingConfig = () => {
    return (
      <Form
        autoComplete="off"
        name="basic"
        onFinish={onSave}
        form={form}
        onFieldsChange={() => setDisableSaveBtn(false)}
      >
        <Row className="mb-4">
          <Col span={24}>
            <h3 className="label require">{translateData.apiKey}</h3>
            <Form.Item
              name={"apiKey"}
              rules={[
                { required: true, message: translateData.pleaseEnterApiKey },
                {
                  type: "string",
                  max: 100,
                  message: "Max 100 characters",
                },
              ]}
            >
              <FnbInput
                type="password"
                autoComplete={false}
                placeholder={translateData.enterApiKey}
                disabled={disableInput()}
                maxLength={100}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <h3 className="label require">{translateData.secretKey}</h3>
            <Form.Item
              name={"secretKey"}
              rules={[
                { required: true, message: translateData.pleaseEnterSecretKey },
                {
                  type: "string",
                  max: 100,
                  message: "Max 100 characters",
                },
              ]}
            >
              <FnbInput
                type="password"
                autoComplete={false}
                placeholder={translateData.enterSecretKey}
                disabled={disableInput()}
                maxLength={100}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  //#endregion render components

  return (
    <div className="SmsZaloZnsPage">
      <Row gutter={24}>
        {renderProvider()}
        {renderProviderSetting()}
      </Row>
    </div>
  );
}

export default SmsZaloZnsPage;
