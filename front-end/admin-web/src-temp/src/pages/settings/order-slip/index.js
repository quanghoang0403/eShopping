import { Button, Card, Checkbox, Col, Form, Row, Select, Skeleton, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import { SelectCheckedIcon } from "constants/icons.constants";
import { storeInfoSelector } from "store/modules/session/session.reducers";
import useBuildBillTemplate from "hooks/useBuildBillTemplate";
import i18n from "utils/i18n";
import { useSelector } from "react-redux";
import { executeAfter } from "utils/helpers";
import { defaultBillConfigData, dynamicData, sampleItemList } from "./default.data";
import { Printer } from "components/Printer";
import "./index.scss";

export default function OrderSlipPage(props) {
  const { t, orderSlipDataService } = props;
  const [form] = Form.useForm();
  const orderSlipTemplateRef = React.useRef(null);
  const { Option } = Select;
  const storeInfo = useSelector(storeInfoSelector);
  const [allOrderSlipConfiguration, setAllOrderSlipConfiguration] = useState();
  const [buildTemplate, setBuildTemplate] = useBuildBillTemplate();
  const [currentTemplateConfig, setCurrentTemplateConfig] = useState(null);
  const [widthOrderSlipTemplate, setWidthOrderSlipTemplate] = useState(0);
  const [sampleTemplate, setSampleTemplate] = useState(null);
  const [orderSlipTemplateWithConfig, setOrderSlipTemplateWithConfig] = useState("");

  const pageData = {
    title: t("orderSlip.title"),
    btnPrintPreview: t("button.printPreview"),
    btnSave: t("button.save"),
    smallSizeOption: t("orderSlip.smallSizeOption"),
    mediumSizeOption: t("orderSlip.mediumSizeOption"),
    configuration: t("orderSlip.configuration"),
    showOrderSessionNo: t("orderSlip.showOrderSessionNo"),
    showAreaAndTable: t("orderSlip.showAreaAndTable"),
    showCreatedSessionTime: t("orderSlip.showCreatedSessionTime"),
    showCompletedSessionTme: t("orderSlip.showCompletedSessionTme"),
    showItemPrices: t("orderSlip.showItemPrices"),
    showTopping: t("orderSlip.showTopping"),
    showOption: t("orderSlip.showOption"),
    configureSuccessfully: t("orderSlip.configureSuccessfully"),
    frameSize: t("receipt.frameSize"),
  };

  const staticLabel = {
    storeName: storeInfo?.storeName,
  };

  const labelTranslated = {
    title: t("orderSlip.titleLabel"),
    sessionOrderNoLabel: t("orderSlip.sessionOrderNoLabel"),
    locationLabel: t("orderSlip.locationLabel"),
    createdSessionTimeLabel: t("orderSlip.createdSessionTimeLabel"),
    completedSessionTimeLabel: t("orderSlip.completedSessionTimeLabel"),
    itemNameColumnLabel: t("orderSlip.itemNameColumnLabel"),
    quantityColumnLabel: t("orderSlip.quantityColumnLabel"),
    unitPriceColumnLabel: t("orderSlip.unitPriceColumnLabel"),
    smallUnitPriceColumnLabel: t("orderSlip.smallUnitPriceColumnLabel"),
    totalAmountColumnLabel: t("orderSlip.totalAmountColumnLabel"),
    totalItemLabel: t("orderSlip.totalItemLabel"),
  };

  // Static data for bill
  const [currentOrderSlipConfigData, setCurrentOrderSlipConfigData] = useState({
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
        setOrderSlipTemplateWithConfig(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildTemplate, currentTemplateConfig, currentOrderSlipConfigData]);

  const getPreviewTemplateWithSampleData = (template) => {
    const params = {
      ...dynamicData, // Mockup dynamic data
      ...labelTranslated,
      ...currentOrderSlipConfigData,
    };
    const myTemplate = buildTemplate(template, sampleItemList, params);
    setSampleTemplate(myTemplate);
  };

  const getTemplateToSave = (template) => {
    const configParams = {
      ...currentOrderSlipConfigData,
    };
    const myTemplateWithConfig = buildTemplate(template, [], configParams);
    setOrderSlipTemplateWithConfig(myTemplateWithConfig);
  };

  const initDefaultTemplateAndConfig = async () => {
    const res = await orderSlipDataService.getOrderSlipConfigurationAsync();
    const { orderSlipConfigs } = res;
    setAllOrderSlipConfiguration(orderSlipConfigs);
    const defaultTemplateConfig = orderSlipConfigs?.find((i) => i.config.isDefault === true);
    setBuildTemplate(defaultTemplateConfig.template.buildTemplate);
    const defaultConfig = defaultTemplateConfig.config;
    setCurrentTemplateConfig(defaultTemplateConfig);
    setWidthOrderSlipTemplate(defaultConfig?.billFrameWidthPage);

    if (defaultConfig) {
      form.setFieldsValue({
        orderSlipConfiguration: defaultConfig,
      });

      updateOrderSlipConfigData(defaultConfig.config);
    }
  };

  const printTemplate = () => {
    if (orderSlipTemplateRef && orderSlipTemplateRef.current) {
      orderSlipTemplateRef.current.printTemplate();
    }
  };

  const updateOrderSlipConfigData = (configValues) => {
    if (!configValues) {
      const formValues = form.getFieldsValue();
      const { orderSlipConfiguration } = formValues;
      configValues = orderSlipConfiguration;
    }

    const {
      isShowOrderSessionNo,
      isShowAreaTable,
      isShowCreatedSessionTime,
      isShowCompletedSessionTime,
      isShowItemPrices,
      isShowTopping,
      isShowOption,
    } = configValues;
    const newOrderSlipConfigData = {
      ...currentOrderSlipConfigData,
      sessionOrderNoVisible: isShowOrderSessionNo ? "inline-flex" : "none",
      locationVisible: isShowAreaTable ? "inline-flex" : "none",
      createdSessionTimeVisible: isShowCreatedSessionTime ? "inline-flex" : "none",
      completedSessionTimeVisible: isShowCompletedSessionTime ? "inline-flex" : "none",
      toppingVisible: isShowTopping ? "block" : "none",
      optionVisible: isShowOption ? "block" : "none",
      itemPriceVisible: isShowItemPrices ? "inline-flex" : "none",
      itemPriceInVisible: !isShowItemPrices ? "inline-flex" : "none",
    };

    setCurrentOrderSlipConfigData(newOrderSlipConfigData);
  };

  const onChangeFrameSize = (frameSizeKey) => {
    const templateConfig = allOrderSlipConfiguration.find((x) => x.config.billFrameSize === frameSizeKey);
    setWidthOrderSlipTemplate(templateConfig?.config?.billFrameWidthPage);

    form.setFieldsValue({
      orderSlipConfiguration: templateConfig.config,
    });

    // Update template and config selected
    if (templateConfig.template.buildTemplate) {
      setBuildTemplate(templateConfig.template.buildTemplate);
    }
    setCurrentTemplateConfig(templateConfig);
    updateOrderSlipConfigData(templateConfig.config);
  };

  const onFinish = async (values) => {
    let submitData = { ...values.orderSlipConfiguration };
    if (submitData.passwordData === undefined) {
      submitData.passwordData = null;
    }
    if (orderSlipTemplateWithConfig) {
      submitData.template = orderSlipTemplateWithConfig;
    }

    const res = await orderSlipDataService.updateOrderSlipConfigurationAsync({
      orderSlipConfiguration: submitData,
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
        onChange={(e) => updateOrderSlipConfigData()}
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
          <Col xl={16} lg={12} md={12} sm={24} className="receipt-form">
            <Row>
              <Col span={24}>
                <p className="fnb-form-label">{pageData.frameSize}</p>
                <Form.Item name={["orderSlipConfiguration", "billFrameSize"]}>
                  <Select
                    onChange={onChangeFrameSize}
                    size="large"
                    placeholder="Select frame size"
                    autoComplete="none"
                    className="fnb-select-single"
                    popupClassName="fnb-select-single-dropdown"
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
              <Col span={24} className="configuration-form">
                <Row>
                  <Col span={24}>
                    <Form.Item name={["orderSlipConfiguration", "isShowOrderSessionNo"]} valuePropName="checked">
                      <Checkbox>{pageData.showOrderSessionNo}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["orderSlipConfiguration", "isShowAreaTable"]} valuePropName="checked">
                      <Checkbox>{pageData.showAreaAndTable}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["orderSlipConfiguration", "isShowCreatedSessionTime"]} valuePropName="checked">
                      <Checkbox>{pageData.showCreatedSessionTime}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["orderSlipConfiguration", "isShowCompletedSessionTime"]} valuePropName="checked">
                      <Checkbox>{pageData.showCompletedSessionTme}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["orderSlipConfiguration", "isShowItemPrices"]} valuePropName="checked">
                      <Checkbox>{pageData.showItemPrices}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["orderSlipConfiguration", "isShowTopping"]} valuePropName="checked">
                      <Checkbox>{pageData.showTopping}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name={["orderSlipConfiguration", "isShowOption"]} valuePropName="checked">
                      <Checkbox>{pageData.showOption}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col xl={8} lg={12} md={12} sm={24} className="template-preview">
            {!sampleTemplate && <Skeleton active paragraph={{ rows: 30 }} />}
            <Row className="template-preview-container">
              {sampleTemplate && (
                <Printer ref={orderSlipTemplateRef} htmlContent={sampleTemplate} widthBill={widthOrderSlipTemplate} />
              )}
            </Row>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
