import { Button, Card, Checkbox, Col, Form, Input, Row, Select, Skeleton, Space, message } from "antd";
import { Printer } from "components/Printer";
import { SelectCheckedIcon } from "constants/icons.constants";
import useBuildBillTemplate from "hooks/useBuildBillTemplate";
import React, { useEffect, useState } from "react";
import ImageUploader from "react-images-upload";
import { useSelector } from "react-redux";
import { storeInfoSelector } from "store/modules/session/session.reducers";
import { executeAfter } from "utils/helpers";
import i18n from "utils/i18n";
import { defaultBillConfigData, dynamicData, sampleItemList } from "./default.data";
import "./index.scss";
const { Option } = Select;

export default function ReceiptPage(props) {
  const { t, billDataService } = props;
  const [form] = Form.useForm();
  const billTemplateRef = React.useRef(null);
  const storeInfo = useSelector(storeInfoSelector);
  const [allBillConfiguration, setAllBillConfiguration] = useState();
  const [isDisableShowWifi, setIsDisableShowWifi] = useState(false);
  const [isDisableShowThanks, setIsDisableShowThanks] = useState(false);
  const [isDisableShowQR, setIsDisableShowQR] = useState(false);
  const [qrCodeThumbnail, setQrCodeThumbnail] = useState(null);
  const [imageRequired, setImageRequired] = useState(true);
  const [currentTemplateConfig, setCurrentTemplateConfig] = useState(null);
  const [buildTemplate, setBuildTemplate] = useBuildBillTemplate();
  const [sampleTemplate, setSampleTemplate] = useState(null);
  const [storeLogoBase64Image, setStoreLogoBase64Image] = useState("");
  const [billTemplateWithConfig, setBillTemplateWithConfig] = useState("");
  const [widthBillTemplate, setWidthBillTemplate] = useState(0);
  const [address, setAddress] = useState("");

  const pageData = {
    btnSave: t("button.save"),
    upload: t("button.upload"),
    btnPrintPreview: t("button.printPreview"),
    title: t("receipt.title"),
    frameSize: t("receipt.frameSize"),
    smallSizeOption: t("receipt.smallSizeOption"),
    mediumSizeOption: t("receipt.mediumSizeOption"),
    showLogo: t("receipt.showLogo"),
    showAddress: t("receipt.showAddress"),
    showOrderTime: t("receipt.showOrderTime"),
    showCashierName: t("receipt.showCashierName"),
    showCustomerName: t("receipt.showCustomerName"),
    showTopping: t("receipt.showTopping"),
    showOption: t("receipt.showOption"),
    showThanksMessage: t("receipt.showThanksMessage"),
    enterThanksMessage: t("receipt.enterThanksMessage"),
    showWifi: t("receipt.showWifi"),
    enterWifi: t("receipt.enterWifi"),
    showPassword: t("receipt.showPassword"),
    enterPassword: t("receipt.enterPassword"),
    showQRCode: t("receipt.showQRCode"),
    enterQRCode: t("receipt.enterQRCode"),
    enterQRThumbnail: t("receipt.enterQRThumbnail"),
    qrThumbnailButton: t("receipt.qrThumbnailButton"),
    configureSuccessfully: t("receipt.configureSuccessfully"),
    showBranchHotline: t("receipt.showBranchHotline"),
    showCustomerPhone: t("receipt.showCustomerPhone"),
    showCustomerAddress: t("receipt.showCustomerAddress"),
    showAreaAndTable: t("receipt.showAreaAndTable", "Show area & table"),
    showSubTotal: t("receipt.showSubTotal"),
    showDiscount: t("receipt.showDiscount"),
    showFee: t("receipt.showFee"),
    showTax: t("receipt.showTax"),
    showShippingFee: t("receipt.showShippingFee"),
    configuration: t("receipt.configuration"),
    no: t("invoice.no"),
    feeAndTax: t("invoice.feeAndTax"),
    paymentMethod: t("invoice.paymentMethod"),
    wifi: t("invoice.wifi"),
    cash: t("invoice.cash"),
  };

  const staticLabel = {
    storeName: storeInfo?.storeName,
  };

  const labelTranslated = {
    title: t("invoice.paymentInvoice"),
    orderCodeLabel: t("invoice.orderCode"),
    situationLabel: t("invoice.areaTable"),
    timeLabel: t("invoice.orderTime"),
    cashierLabel: t("invoice.cashierName"),
    customerLabel: t("invoice.customerName"),
    customerPhoneLabel: t("invoice.customerPhoneLabel"),
    customerAddressLabel: t("invoice.customerAddressLabel"),
    itemNameColumnLabel: t("invoice.product"),
    itemQuantityColumnLabel: t("invoice.billQuantity"),
    itemPriceColumnLabel: t("invoice.billPrice"),
    totalAmountColumnLabel: t("invoice.billTotal"),
    subTotalAmountLabel: t("invoice.tempTotal"),
    discountAmountLabel: t("invoice.discount"),
    cashLabel: t("invoice.receivedAmount"),
    refundsLabel: t("invoice.change"),
    passwordWifiLabel: t("invoice.password"),
    feeAmountLabel: t("invoice.feeAmountLabel"),
    taxAmountLabel: t("invoice.taxAmountLabel"),
    shippingFeeLabel: t("invoice.shippingFeeLabel"),
    totalAmountLabel: t("invoice.totalAmountLabel"),
    paymentMethodLabel: t("invoice.paymentMethodLabel"),
    paymentMethodName: t("invoice.cash"),
  };

  // Static data for bill
  const [currentBillConfigData, setCurrentBillConfigData] = useState({
    ...defaultBillConfigData,
    //...staticData,
    ...staticLabel,
    //...labelTranslated,
  });

  useEffect(() => {
    initDefaultTemplateAndConfig();
  }, []);

  useEffect(() => {
    if (buildTemplate && currentTemplateConfig) {
      const { template } = currentTemplateConfig;
      getPreviewTemplateWithSampleData(template);
      getTemplateToSave(template);
    }
  }, [i18n.language]);

  /// render template
  useEffect(() => {
    executeAfter(500, () => {
      if (buildTemplate && currentTemplateConfig) {
        const { template } = currentTemplateConfig;
        getPreviewTemplateWithSampleData(template);
        getTemplateToSave(template);
      } else {
        setSampleTemplate(null);
        setBillTemplateWithConfig(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeLogoBase64Image, buildTemplate, currentTemplateConfig, currentBillConfigData, qrCodeThumbnail]);

  const getPreviewTemplateWithSampleData = (template) => {
    const params = {
      ...dynamicData, // Mockup dynamic data
      ...labelTranslated,
      ...currentBillConfigData,
      storeLogo: storeLogoBase64Image,
      qrCode: qrCodeThumbnail,
      address: address,
    };
    const myTemplate = buildTemplate(template, sampleItemList, params);
    setSampleTemplate(myTemplate);
  };

  const getTemplateToSave = (template) => {
    const configParams = {
      ...currentBillConfigData,
      storeLogo: storeLogoBase64Image,
      qrCode: qrCodeThumbnail,
    };
    const myTemplateWithConfig = buildTemplate(template, [], configParams);
    setBillTemplateWithConfig(myTemplateWithConfig);
  };

  const initDefaultTemplateAndConfig = async () => {
    const res = await billDataService.getBillConfigurationAsync();
    const { billConfigs, addressInfo } = res;
    setAllBillConfiguration(billConfigs);
    setAddress(addressInfo);
    const defaultTemplateConfig = billConfigs?.find((i) => i.config.isDefault === true);
    setBuildTemplate(defaultTemplateConfig.template.buildTemplate);
    const defaultConfig = defaultTemplateConfig.config;
    setCurrentTemplateConfig(defaultTemplateConfig);
    setWidthBillTemplate(defaultConfig?.billFrameWidthPage);

    if (defaultConfig) {
      form.setFieldsValue({
        billConfiguration: defaultConfig,
      });
      setIsDisableShowWifi(defaultConfig.isShowWifiAndPassword);
      setIsDisableShowThanks(defaultConfig.isShowThanksMessage);
      setIsDisableShowQR(defaultConfig.isShowQRCode);
      setQrCodeThumbnail(defaultConfig.qrCodeThumbnail);

      if (defaultConfig.logo) {
        setStoreLogoBase64Image(defaultConfig.logo);
      }

      if (defaultConfig.qrCodeThumbnail) {
        setImageRequired(false);
      }

      updateBillConfigData(defaultConfig.config);
    }
  };

  const updateBillConfigData = (configValues) => {
    if (!configValues) {
      const formValues = form.getFieldsValue();
      const { billConfiguration } = formValues;
      configValues = billConfiguration;
    }

    const {
      isShowLogo,
      isShowAddress,
      isShowBranchHotLine,
      isShowOrderTime,
      isShowCashierName,
      isShowCustomerName,
      isShowCustomerPhone,
      isShowCustomerAddress,
      isShowAreaTable,
      isShowTopping,
      isShowOption,
      isShowSubTotal,
      isShowDiscount,
      isShowQRCode,
      isShowFee,
      isShowTax,
      isShowShippingFee,
      isShowThanksMessage,
      isShowWifiAndPassword,
      wifiData,
      passwordData,
      thanksMessageData,
      qrCodeData,
    } = configValues;
    const newBillConfigData = {
      ...currentBillConfigData,
      logoVisible: isShowLogo ? "inline-flex" : "none",
      addressVisible: isShowAddress ? "inline-flex" : "none",
      branchHotlineVisible: isShowBranchHotLine ? "block" : "none",
      timeVisible: isShowOrderTime ? "inline-flex" : "none",
      cashierNameVisible: isShowCashierName ? "inline-flex" : "none",
      customerNameVisible: isShowCustomerName ? "inline-flex" : "none",
      customerPhoneVisible: isShowCustomerPhone ? "inline-flex" : "none",
      customerAddressVisible: isShowCustomerAddress ? "inline-flex" : "none",
      situationVisible: isShowAreaTable ? "inline-flex" : "none",
      subtotalVisible: isShowSubTotal ? "inline-flex" : "none",
      toppingVisible: isShowTopping ? "block" : "none",
      optionVisible: isShowOption ? "block" : "none",
      discountVisible: isShowDiscount ? "inline-flex" : "none",
      feeVisible: isShowFee ? "inline-flex" : "none",
      taxVisible: isShowTax ? "inline-flex" : "none",
      shippingVisible: isShowShippingFee ? "inline-flex" : "none",
      thanksMessageVisible: isShowThanksMessage ? "block" : "none",
      wifiPasswordVisible: isShowWifiAndPassword ? "inline-flex" : "none",
      barcodeVisible: isShowQRCode ? "inline-flex" : "none",
      lastBreakLine: isShowSubTotal || isShowDiscount || isShowFee || isShowShippingFee || isShowTax ? "block" : "none",
      wifi: wifiData,
      passwordWifiValue: passwordData,
      thanksMessage: thanksMessageData,
      messageQRCode: qrCodeData,
    };

    setCurrentBillConfigData(newBillConfigData);
  };

  const onChangeFrameSize = (frameSizeKey) => {
    const templateConfig = allBillConfiguration.find((x) => x.config.billFrameSize === frameSizeKey);
    setWidthBillTemplate(templateConfig?.config?.billFrameWidthPage);

    form.setFieldsValue({
      billConfiguration: templateConfig.config,
    });

    setIsDisableShowWifi(templateConfig.config.isShowWifiAndPassword);
    setIsDisableShowThanks(templateConfig.config.isShowThanksMessage);
    setIsDisableShowQR(templateConfig.config.isShowQRCode);
    setQrCodeThumbnail(templateConfig.config.qrCodeThumbnail);

    if (templateConfig.config.qrCodeThumbnail) {
      setImageRequired(false);
    }

    // Update template and config selected
    if (templateConfig.template.buildTemplate) {
      setBuildTemplate(templateConfig.template.buildTemplate);
    }
    setCurrentTemplateConfig(templateConfig);
    updateBillConfigData(templateConfig.config);
  };

  const printTemplate = () => {
    if (billTemplateRef && billTemplateRef.current) {
      billTemplateRef.current.printTemplate();
    }
  };

  const onUploadImage = (image) => {
    const file = image[0];
    if (!file) {
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const imgBase64 = reader.result;
      setQrCodeThumbnail(imgBase64);
      setImageRequired(false);
    };
    reader.onerror = function (error) {
      message.error("Please try again!");
    };
  };

  const onFinish = async (values) => {
    const qrCodeImage = {
      qrCodeThumbnail: qrCodeThumbnail,
    };
    const fromData = values?.billConfiguration;
    if (fromData?.qrCodeThumbnail !== null) {
      delete fromData?.qrCodeThumbnail;
    }
    let submitData = { ...qrCodeImage, ...values.billConfiguration };
    if (submitData.passwordData === undefined) {
      submitData.passwordData = null;
    }
    if (billTemplateWithConfig) {
      submitData.template = billTemplateWithConfig;
    }

    const res = await billDataService.updateBillConfigurationAsync({
      billConfiguration: submitData,
    });

    if (res) {
      initDefaultTemplateAndConfig(values?.billConfiguration?.billFrameSize);
      message.success(pageData.configureSuccessfully);
    }
  };

  return (
    <Card bordered={false} className="fnb-card-full receipt-card">
      <Form
        autoComplete="off"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onFinish}
        form={form}
        onChange={(e) => updateBillConfigData()}
      >
        <Row gutter={[24, 24]} className="receipt-config-card-header">
          <Col lg={12} md={12} sm={24}>
            <p className="card-title-name">{pageData.title}</p>
          </Col>
          <Col lg={12} md={12} sm={24} className="card-button text-right">
            <Space>
              <Button htmlType="button" type="link" onClick={printTemplate} className="print-preview">
                {pageData.btnPrintPreview}
              </Button>
              <Button htmlType="submit" type="primary" className="save-button">
                {pageData.btnSave}
              </Button>
            </Space>
          </Col>
        </Row>
        <Row gutter={[24, 24]} className="receipt-config-card-body">
          <Col lg={16} md={16} sm={8} className="receipt-form">
            <Row>
              <Col span={24}>
                <h4 className="fnb-form-label">{pageData.frameSize}</h4>
                <Form.Item name={["billConfiguration", "billFrameSize"]}>
                  <Select
                    onChange={onChangeFrameSize}
                    size="large"
                    placeholder="Select frame size"
                    autoComplete="none"
                    className="fnb-select-single"
                    dropdownClassName="fnb-select-single-dropdown"
                    menuItemSelectedIcon={<SelectCheckedIcon style={{ padding: "5px" }} />}
                  >
                    <Option key={0} value={0}>
                      <p className="option-frame-size">{pageData.smallSizeOption}</p>
                    </Option>
                    <Option key={1} value={1}>
                      <p className="option-frame-size">{pageData.mediumSizeOption}</p>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <p className="card-title-name-configuration">{pageData.configuration}</p>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Row>
                  <Col span={12}>
                    <Form.Item name={["billConfiguration", "isShowLogo"]} valuePropName="checked">
                      <Checkbox>{pageData.showLogo}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item name={["billConfiguration", "isShowAddress"]} valuePropName="checked">
                      <Checkbox>{pageData.showAddress}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowBranchHotLine"]} valuePropName="checked">
                      <Checkbox>{pageData.showBranchHotline}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowOrderTime"]} valuePropName="checked">
                      <Checkbox>{pageData.showOrderTime}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowCashierName"]} valuePropName="checked">
                      <Checkbox>{pageData.showCashierName}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowCustomerName"]} valuePropName="checked">
                      <Checkbox>{pageData.showCustomerName}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowCustomerPhone"]} valuePropName="checked">
                      <Checkbox>{pageData.showCustomerPhone}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowCustomerAddress"]} valuePropName="checked">
                      <Checkbox>{pageData.showCustomerAddress}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowAreaTable"]} valuePropName="checked">
                      <Checkbox>{pageData.showAreaAndTable}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowTopping"]} valuePropName="checked">
                      <Checkbox>{pageData.showTopping}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowOption"]} valuePropName="checked">
                      <Checkbox>{pageData.showOption}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowSubTotal"]} valuePropName="checked">
                      <Checkbox>{pageData.showSubTotal}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowDiscount"]} valuePropName="checked">
                      <Checkbox>{pageData.showDiscount}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowFee"]} valuePropName="checked">
                      <Checkbox>{pageData.showFee}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowTax"]} valuePropName="checked">
                      <Checkbox>{pageData.showTax}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["billConfiguration", "isShowShippingFee"]} valuePropName="checked">
                      <Checkbox>{pageData.showShippingFee}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name={["billConfiguration", "isShowThanksMessage"]}
                      valuePropName="checked"
                      onChange={(e) => {
                        setIsDisableShowThanks(e?.target?.checked);
                      }}
                    >
                      <Checkbox>{pageData.showThanksMessage}</Checkbox>
                    </Form.Item>
                  </Col>

                  <Col span={24} className={isDisableShowThanks === true ? "d-block" : "d-none"}>
                    <Form.Item
                      name={["billConfiguration", "thanksMessageData"]}
                      rules={[
                        {
                          required: isDisableShowThanks,
                          message: pageData.enterThanksMessage,
                        },
                      ]}
                    >
                      <Input className="fnb-input" min={100} placeholder={pageData.enterThanksMessage} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name={["billConfiguration", "isShowWifiAndPassword"]}
                      valuePropName="checked"
                      onChange={(e) => {
                        setIsDisableShowWifi(e?.target?.checked);
                      }}
                    >
                      <Checkbox>{pageData.showWifi}</Checkbox>
                    </Form.Item>
                  </Col>

                  <Col span={24} className={isDisableShowWifi === true ? "d-block" : "d-none"}>
                    <Row>
                      <Col lg={24} md={24} sm={24}>
                        <h4 className="fnb-form-label wifi-password-lable">Wifi</h4>
                        <Form.Item
                          name={["billConfiguration", "wifiData"]}
                          rules={[
                            {
                              required: isDisableShowWifi,
                              message: pageData.enterWifi,
                            },
                          ]}
                        >
                          <Input className="fnb-input" min={100} placeholder={pageData.enterWifi} />
                        </Form.Item>
                      </Col>
                      <Col lg={24} md={24} sm={24}>
                        <h4 className="fnb-form-label wifi-password-lable">Password</h4>
                        <Form.Item name={["billConfiguration", "passwordData"]}>
                          <Input className="fnb-input" min={100} placeholder={pageData.enterPassword} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name={["billConfiguration", "isShowQRCode"]}
                      valuePropName="checked"
                      onChange={(e) => {
                        setIsDisableShowQR(e?.target?.checked);
                      }}
                    >
                      <Checkbox>{pageData.showQRCode}</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={24} className={isDisableShowQR === true ? "d-block" : "d-none"}>
                    <Row>
                      <Col lg={24} md={24} sm={24}>
                        <Form.Item
                          name={["billConfiguration", "qrCodeData"]}
                          rules={[
                            {
                              required: isDisableShowQR,
                              message: pageData.enterQRCode,
                            },
                          ]}
                        >
                          <Input className="fnb-input qrCode-input" min={100} placeholder={pageData.enterQRCode} />
                        </Form.Item>
                      </Col>
                      <Col lg={24} md={24} sm={24} className="button-upload-image">
                        <Form.Item
                          name={["billConfiguration", "qrCodeThumbnail"]}
                          rules={[
                            {
                              required: isDisableShowQR ? imageRequired : false,
                              message: pageData.enterQRThumbnail,
                            },
                          ]}
                          className="form-item-upload-qr-code"
                        >
                          <ImageUploader
                            withIcon={false}
                            label=""
                            singleImage={true}
                            buttonText={pageData.qrThumbnailButton}
                            onChange={(value) => onUploadImage(value)}
                            imgExtension={[".jpg", ".png", ".jpeg"]}
                            maxFileSize={5242880}
                            className="btn-upload-image"
                            errorStyle={{
                              fontStyle: "normal",
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "21x",
                              color: "#DB1B1B",
                            }}
                            fileSizeError=" file size is too big"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col lg={8} md={8} sm={24} className="template-preview">
            <p className="preview-text">Preview</p>
            {!sampleTemplate && <Skeleton active paragraph={{ rows: 30 }} />}
            {sampleTemplate && (
              <Printer ref={billTemplateRef} htmlContent={sampleTemplate} widthBill={widthBillTemplate} />
            )}
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
