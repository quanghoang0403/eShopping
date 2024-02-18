import { Button, Card, Col, Form, Row, Tooltip, message } from "antd";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import { EnumGoogleConfigType } from "constants/google-config.constants";
import { GOOGLE_CONFIG_TYPE } from "constants/google.constant";
import { FirebaseCredentialIcon, GoogleConfigIcon, InfoCircleFlashSaleIcon } from "constants/icons.constants";
import storeDataService from "data-services/store/store-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import "./google-config.scss";

function GoogleConfig() {
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const isMobile = useMediaQuery({ maxWidth: 576 });
  const translateData = {
    btnSave: t("button.save"),
    updateSuccess: t("text.smsZaloZns.updateSuccess"),
    googleConfig: {
      title: t("googleConfig.title"),
      tooltip: t("googleConfig.tooltip"),
      key: t("googleConfig.key"),
      googleMap: t("googleConfig.googleMap"),
      keyPlaceholder: t("googleConfig.keyPlaceholder"),
      keyErrorMessage: t("googleConfig.keyErrorMessage"),
      updateSuccess: t("googleConfig.updateSuccess"),
      androidApp: t("googleConfig.androidApp"),
      iOSApp: t("googleConfig.iOSApp"),
      storeWeb: t("googleConfig.storeWeb"),
      pOS: t("googleConfig.pOS"),
      apiKeyPlaceholder: t("googleConfig.apiKeyPlaceholder"),
      keyInvalid: t("googleConfig.keyInvalid"),
      tooltipFireBase: t("googleConfig.tooltipFireBase"),
      placeholderFirebase: t("googleConfig.placeholderFirebase"),
      validateFirebase: t("googleConfig.validateFirebase"),
    },
    firebaseCredential: {
      title: isMobile ?  "Firebase" : "Firebase Credential",
    },
  };

  const [selectedConfig, setSelectedConfig] = useState(GOOGLE_CONFIG_TYPE.googleApi);
  const [statusGoogleApiTypes, setStatusGoogleApiTypes] = useState({});
  const [hiddenAndroidAppAPIKeySaveBtn, setHiddenAndroidAppAPIKeySaveBtn] = useState(true);
  const [hiddenFirebaseAPIKeySaveBtn, setHiddenFirebaseAPIKeySaveBtn] = useState(true);
  const [hiddenIOSAppAPIKeySaveBtn, setHiddenIOSAppAPIKeySaveBtn] = useState(true);
  const [hiddenStoreWebAPIKeySaveBtn, setHiddenStoreWebAPIKeySaveBtn] = useState(true);
  const [hiddenPosWebAPIKeySaveBtn, setHiddenPosWebAPIKeySaveBtn] = useState(true);

  useEffect(() => {
    initConfig();
  }, []);

  const onSave = async (enumGoogleConfigType) => {
    let formValues = form.getFieldsValue();
    const { androidAppAPIKey, iOSAppAPIKey, storeWebAPIKey, posWebAPIKey } = formValues;

    let isGoogleApiActive = false;
    switch (enumGoogleConfigType) {
      case EnumGoogleConfigType.AndroidAppAPIKey:
        if (Boolean(androidAppAPIKey)) {
          onCheckGoogleAPIKey(formValues, enumGoogleConfigType);
          isGoogleApiActive = true;
        }
        setStatusGoogleApiTypes({ ...statusGoogleApiTypes, isAndroidAppAPIKeyActive: isGoogleApiActive });
        break;

      case EnumGoogleConfigType.IOSAppAPIKey:
        if (Boolean(iOSAppAPIKey)) {
          onCheckGoogleAPIKey(formValues, enumGoogleConfigType);
          isGoogleApiActive = true;
        }
        setStatusGoogleApiTypes({ ...statusGoogleApiTypes, isIOSAppAPIKeyActive: isGoogleApiActive });
        break;

      case EnumGoogleConfigType.StoreWebAPIKey:
        if (Boolean(storeWebAPIKey)) {
          onCheckGoogleAPIKey(formValues, enumGoogleConfigType);
          isGoogleApiActive = true;
        }
        setStatusGoogleApiTypes({ ...statusGoogleApiTypes, isStoreWebAPIKeyActive: isGoogleApiActive });
        break;
      case EnumGoogleConfigType.FirebaseCredentials:
        form.validateFields().then(() => {
          if (Boolean(true)) {
            onCheckGoogleAPIKey(formValues, enumGoogleConfigType);
            isGoogleApiActive = true;
          }
          setStatusGoogleApiTypes({ ...statusGoogleApiTypes, isStoreWebAPIKeyActive: isGoogleApiActive });
        })
        break;

      default:
        if (Boolean(posWebAPIKey)) {
          onCheckGoogleAPIKey(formValues, enumGoogleConfigType);
          isGoogleApiActive = true;
        }
        setStatusGoogleApiTypes({ ...statusGoogleApiTypes, isPosWebAPIKeyActive: isGoogleApiActive });
        break;
    }
  };
  const IsJsonString = (str) => {
    if(str == null || str === undefined || str === '') return false
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }

  const onCheckGoogleAPIKey = async (formValues, enumGoogleConfigType) => {
    const { androidAppAPIKey, iOSAppAPIKey, storeWebAPIKey, posWebAPIKey, firebaseCredentialAPIKey } = formValues;

    var req = {
      googleConfig: {
        androidAppAPIKey: androidAppAPIKey,
        iOSAppAPIKey: iOSAppAPIKey,
        storeWebAPIKey: storeWebAPIKey,
        posWebAPIKey: posWebAPIKey,
        firebaseCredentialAPIKey: firebaseCredentialAPIKey,
      },
      enumGoogleConfigType: enumGoogleConfigType,
    };
    let res = await storeDataService.updateStoreGoogleConfigForPlatformAsync(req);
    if (res) {
      message.success(translateData.updateSuccess);
      switch (enumGoogleConfigType) {
        case EnumGoogleConfigType.AndroidAppAPIKey:
          setHiddenAndroidAppAPIKeySaveBtn(true);
          break;

        case EnumGoogleConfigType.IOSAppAPIKey:
          setHiddenIOSAppAPIKeySaveBtn(true);
          break;

        case EnumGoogleConfigType.StoreWebAPIKey:
          setHiddenStoreWebAPIKeySaveBtn(true);
          break;
          
        case EnumGoogleConfigType.FirebaseCredentials:
          setHiddenFirebaseAPIKeySaveBtn(true);
          break;

        default:
          setHiddenPosWebAPIKeySaveBtn(true);
          break;
      }
    }
  };

  const initConfig = async () => {
    const res = await storeDataService.getStoreGoogleConfigForPlatformAsync();
    if (res) {
      form.resetFields();
      form.setFieldsValue({
        androidAppAPIKey: res.androidAppAPIKey,
        iOSAppAPIKey: res.iosAppAPIKey,
        storeWebAPIKey: res.storeWebAPIKey,
        posWebAPIKey: res.posWebAPIKey,
        firebaseCredentialAPIKey: res.firebaseCredentialAPIKey,
      });
    }
  };

  const renderProvider = () => {
    let googleApiStyle = GOOGLE_CONFIG_TYPE.googleApi == selectedConfig ? "active" : "";
    let firebaseCredentialStyle = GOOGLE_CONFIG_TYPE.firebaseCredential == selectedConfig ? "active" : "";
    return (
      <Col sm={24} md={8}>
          <Row className="w-100">
            <Col md={24} sm={12}>
              <Row
                className={`provider ${googleApiStyle}`}
                align={"middle"}
                onClick={() => setSelectedConfig(GOOGLE_CONFIG_TYPE.googleApi)}
              >
                <Col>
                  <GoogleConfigIcon className="google-config-icon" />
                  <span className="google-map-text-style">{translateData.googleConfig.googleMap}</span>
                  <Tooltip placement="topLeft" overlayClassName="custom-width-tooltip" title={translateData.googleConfig.tooltip}>
                    <InfoCircleFlashSaleIcon className="google-config-tooltip" />
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col md={24} sm={12}>
              <Row
                className={`provider ${firebaseCredentialStyle}`}
                align={"middle"}
                onClick={() => setSelectedConfig(GOOGLE_CONFIG_TYPE.firebaseCredential)}
              >
                <Col>
                  <FirebaseCredentialIcon className="google-config-icon" />
                  <span className="google-map-text-style">{translateData.firebaseCredential.title}</span>
                  <Tooltip placement="topLeft" overlayClassName="custom-width-tooltip" title={translateData.googleConfig.tooltipFireBase}>
                    <InfoCircleFlashSaleIcon className="google-config-tooltip" />
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
      </Col>
    );
  };

  const renderProviderSetting = () => {
    return !isTabletOrMobile ? (
      <Col sm={24} md={16}>
        <Card className="google-config-card">
          <Row align={"middle"} style={{ height: "108px" }}>
            <Col sm={16} md={20}>
              <span id="settingTitle">{translateData.googleConfig.googleMap}</span>
            </Col>
          </Row>
          {renderProviderSettingConfig()}
        </Card>
      </Col>
    ) : (
      <Col span={24}>
        <Card className="google-config-card">
          <Row className="mb-2">
            <span id="settingTitle">{translateData.googleConfig.googleMap}</span>
          </Row>

          {renderProviderSettingConfig()}
        </Card>
      </Col>
    );
  };

  const renderProviderSettingConfig = () => {
    return (
      <Form autoComplete="off" name="basic" form={form}>
        <Row className="google-config-row-margin">
          <Col xs={24} sm={24} md={hiddenAndroidAppAPIKeySaveBtn ? 24 : 21}>
            <h3 className="label">{translateData.googleConfig.androidApp}</h3>
            <Form.Item name={"androidAppAPIKey"} className="form-google-item">
              <FnbInput
                type="password"
                autoComplete={false}
                placeholder={translateData.googleConfig.apiKeyPlaceholder}
                maxLength={101}
                onChange={() => setHiddenAndroidAppAPIKeySaveBtn(false)}
                className={"google-config-input"}
              />
            </Form.Item>
            {statusGoogleApiTypes?.isAndroidAppAPIKeyActive == false && (
              <span className="key-invalid">{translateData.googleConfig.keyInvalid}</span>
            )}
          </Col>
          <Col xs={24} sm={24} md={2} hidden={hiddenAndroidAppAPIKeySaveBtn}>
            <Button type="primary google-config-save-btn" onClick={() => onSave(EnumGoogleConfigType.AndroidAppAPIKey)}>
              {translateData.btnSave}
            </Button>
          </Col>
        </Row>
        <Row className="google-config-row-margin">
          <Col xs={24} sm={24} md={hiddenIOSAppAPIKeySaveBtn ? 24 : 21}>
            <h3 className="label">{translateData.googleConfig.iOSApp}</h3>
            <Form.Item name={"iOSAppAPIKey"} className="form-google-item">
              <FnbInput
                type="password"
                autoComplete={false}
                placeholder={translateData.googleConfig.apiKeyPlaceholder}
                maxLength={101}
                onChange={() => setHiddenIOSAppAPIKeySaveBtn(false)}
                className={"google-config-input"}
              />
            </Form.Item>
            {statusGoogleApiTypes?.isIOSAppAPIKeyActive == false && (
              <span className="key-invalid">{translateData.googleConfig.keyInvalid}</span>
            )}
          </Col>
          <Col xs={24} sm={24} md={2} hidden={hiddenIOSAppAPIKeySaveBtn}>
            <Button type="primary google-config-save-btn" onClick={() => onSave(EnumGoogleConfigType.IOSAppAPIKey)}>
              {translateData.btnSave}
            </Button>
          </Col>
        </Row>
        <Row className="google-config-row-margin">
          <Col xs={24} sm={24} md={hiddenStoreWebAPIKeySaveBtn ? 24 : 21}>
            <h3 className="label">{translateData.googleConfig.storeWeb}</h3>
            <Form.Item name={"storeWebAPIKey"} className="form-google-item">
              <FnbInput
                type="password"
                autoComplete={false}
                placeholder={translateData.googleConfig.apiKeyPlaceholder}
                maxLength={101}
                onChange={() => setHiddenStoreWebAPIKeySaveBtn(false)}
                className={"google-config-input"}
              />
            </Form.Item>
            {statusGoogleApiTypes?.isStoreWebAPIKeyActive == false && (
              <span className="key-invalid">{translateData.googleConfig.keyInvalid}</span>
            )}
          </Col>
          <Col xs={24} sm={24} md={2} hidden={hiddenStoreWebAPIKeySaveBtn}>
            <Button type="primary google-config-save-btn" onClick={() => onSave(EnumGoogleConfigType.StoreWebAPIKey)}>
              {translateData.btnSave}
            </Button>
          </Col>
        </Row>
        <Row className="google-config-row-margin">
          <Col xs={24} sm={24} md={hiddenPosWebAPIKeySaveBtn ? 24 : 21}>
            <h3 className="label">{translateData.googleConfig.pOS}</h3>
            <Form.Item name={"posWebAPIKey"} className="form-google-item">
              <FnbInput
                type="password"
                autoComplete={false}
                placeholder={translateData.googleConfig.apiKeyPlaceholder}
                maxLength={101}
                onChange={() => setHiddenPosWebAPIKeySaveBtn(false)}
                className={"google-config-input"}
              />
            </Form.Item>
            {statusGoogleApiTypes?.isPosWebAPIKeyActive == false && (
              <span className="key-invalid">{translateData.googleConfig.keyInvalid}</span>
            )}
          </Col>
          <Col xs={24} sm={24} md={2} hidden={hiddenPosWebAPIKeySaveBtn}>
            <Button type="primary google-config-save-btn" onClick={() => onSave(EnumGoogleConfigType.PosWebAPIKey)}>
              {translateData.btnSave}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // firebase
  const renderProviderFireBaseSetting = () => {
    return !isTabletOrMobile ? (
      <Col sm={24} md={16}>
        <Card className="firebase-config-card">
          <Row align={"middle"} style={{ height: "108px" }}>
            <Col sm={16} md={20}>
            <span id="settingTitle">{translateData.firebaseCredential.title}</span>
            </Col>
          </Row>
          {renderProviderSettingFireBaseConfig()}
        </Card>
      </Col>
    ) : (
      <Col span={24}>
        <Card className="firebase-config-card">
          <Row className="mb-2">
          <span id="settingTitle">{translateData.firebaseCredential.title}</span>
          </Row>
          {renderProviderSettingFireBaseConfig()}
        </Card>
      </Col>
    );
  };

  const renderProviderSettingFireBaseConfig = () => {
    return (
      <Form autoComplete="off" name="basic" form={form}>
        <Row className="google-config-row-margin">
          <Col xs={24} sm={24} md={hiddenFirebaseAPIKeySaveBtn ? 24 : 21}>
            <h3 className="label">Credential JSON</h3>
            <Form.Item 
            name={"firebaseCredentialAPIKey"} 
            className="form-google-item"
            rules={[
                  {
                    required: true,
                    message: translateData.googleConfig.validateFirebase,
                  },
                  {
                    validator: (_, value) => {
                      if (IsJsonString(value) || value === '') {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(new Error(translateData.googleConfig.validateFirebase));
                      }
                    },
                  }
                ]}
            >
              <FnbTextArea 
              className='inputFireBaseConfig' rows={28} 
              onChange={() => setHiddenFirebaseAPIKeySaveBtn(false)}
                placeholder={translateData.googleConfig.placeholderFirebase}
              ></FnbTextArea>
            </Form.Item>
            {statusGoogleApiTypes?.isAndroidAppAPIKeyActive === false && (
              <span className="key-invalid">{translateData.googleConfig.keyInvalid}</span>
            )}
          </Col>
          <Col xs={24} sm={24} md={2} hidden={hiddenFirebaseAPIKeySaveBtn}>
            <Button type="primary google-config-save-btn" onClick={() => onSave(EnumGoogleConfigType.FirebaseCredentials)}>
              {translateData.btnSave}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <div className="google-config-page">
      <Row gutter={24}>
        {renderProvider()}
        {GOOGLE_CONFIG_TYPE.googleApi === selectedConfig && renderProviderSetting()}
        {GOOGLE_CONFIG_TYPE.firebaseCredential === selectedConfig && renderProviderFireBaseSetting()}
      </Row>
    </div>
  );
}

export default GoogleConfig;
