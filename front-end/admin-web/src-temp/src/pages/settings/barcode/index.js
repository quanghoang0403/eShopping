import { Button, Card, Checkbox, Col, message, Row, Space, Typography } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { BarcodeType } from "constants/barcode-type.constants";
import { StampType, StampName } from "constants/stamp-type.constants";
import React, { useEffect, useState } from "react";
import { convertTextToBarcodeBase64, convertTextToQRCodeBase64Async, replaceParameter } from "utils/helpers";
import { FnbSelectSingleOptGroup } from "components/fnb-select-single-opt-group/fnb-select-single-opt-group";
import { Printer } from "components/Printer";
import "./index.scss";
const { Text } = Typography;

export default function BarcodeConfig(props) {
  const { t, barcodeDataService, onChangeForm } = props;

  const pageData = {
    title: t("barcode.title"),
    barcode: t("barcode.barcode"),
    type: t("barcode.type"),
    model: t("barcode.model"),
    size: t("barcode.size"),
    showItemName: t("barcode.showItemName"),
    showPrice: t("barcode.showPrice"),
    showCode: t("barcode.showCode"),
    isUpdatedSuccessfully: t("messages.isUpdatedSuccessfully"),
    save: t("button.save"),
    preview: t("barcode.preview"),
    configuration: t("barcode.configuration"),
    oneStamp: t("barcode.oneStamp"),
    twoStamp: t("barcode.twoStamp"),
    btnPrintPreview: t("button.printPreview"),
  };

  const printExampleData = {
    nameValue: "Mayonnaise",
    priceValue: "55,000",
    codeValue: "NVL10021001",
  };

  const [barcodeTypeList, setBarcodeTypeList] = useState([]);
  const [barcodeType, setBarcodeType] = useState(BarcodeType.barcode);
  const [stampTypeList, setStampTypeList] = useState([]);
  const [stampType, setStampType] = useState(StampType.mm50x30);
  const [showName, setShowName] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showCode, setShowCode] = useState(true);
  const [barcodeConfigs, setBarcodeConfigs] = useState([]);
  const [isDataInitialization, setIsDataInitialization] = useState(true);
  const [previewData, setPreviewData] = useState("");
  const printerRef = React.useRef(null);

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    changePreviewData();
  }, [isDataInitialization]);

  useEffect(() => {
    if (!isDataInitialization) {
      const indexEdit = barcodeConfigs.findIndex(
        (item) => item?.barcodeType === barcodeType && item?.stampType === stampType,
      );
      if (indexEdit !== -1) {
        let barcodeConfigsNew = [...barcodeConfigs];
        barcodeConfigsNew[indexEdit].isShowName = showName;
        barcodeConfigsNew[indexEdit].isShowPrice = showPrice;
        barcodeConfigsNew[indexEdit].isShowCode = showCode;
        setBarcodeConfigs(barcodeConfigsNew);
      }
      changePreviewData();
    }
  }, [showName, showPrice, showCode]);

  useEffect(() => {
    if (!isDataInitialization) {
      const indexExist = barcodeConfigs.findIndex(
        (item) => item?.barcodeType === barcodeType && item?.stampType === stampType,
      );
      if (indexExist === -1) {
        let barcodeConfigsNew = [...barcodeConfigs];
        barcodeConfigsNew.push({
          barcodeType: barcodeType,
          stampType: stampType,
          isShowName: true,
          isShowPrice: true,
          isShowCode: true,
        });
        setBarcodeConfigs(barcodeConfigsNew);

        setShowName(true);
        setShowPrice(true);
        setShowCode(true);
        handleSwapItem(indexExist, barcodeConfigsNew);
      } else {
        setShowName(barcodeConfigs[indexExist]?.isShowName);
        setShowPrice(barcodeConfigs[indexExist]?.isShowPrice);
        setShowCode(barcodeConfigs[indexExist]?.isShowCode);
        handleSwapItem(indexExist, barcodeConfigs);
      }

      changePreviewData();
    }
  }, [barcodeType, stampType]);

  const changePreviewData = async () => {
    let base64Image = "";
    if (barcodeType === BarcodeType.qrCode) {
      base64Image = await convertTextToQRCodeBase64Async(printExampleData.codeValue, { margin: 0 });
    } else {
      base64Image = convertTextToBarcodeBase64(printExampleData.codeValue, { displayValue: false });
    }
    const parameter = {
      productNameDisplay: getDisplayValue(showName),
      codeDisplay: getDisplayValue(showCode),
      priceDisplay: getDisplayValue(showPrice),
      productName: printExampleData.nameValue,
      productPriceName: "",
      code: printExampleData.codeValue,
      price: printExampleData.priceValue,
      base64Image: base64Image,
    };
    let template = stampTypeList?.find((item) => item?.id === stampType)?.template ?? "";

    template = replaceParameter(template, parameter);
    if (stampType === StampType.mm35x22) {
      template += " " + template;
    }
    setPreviewData(template);
  };

  const getDisplayValue = (isShow) => {
    if (isShow) {
      return "block";
    } else {
      return "none!important";
    }
  };

  const getInitialData = () => {
    barcodeDataService.getBarcodeConfigByStoreIdAsync().then((res) => {
      setStampTypeList(res.stampTypeList);
      setBarcodeTypeList(res.barcodeTypeList);
      if (res?.barcodeConfigs?.length > 0) {
        setBarcodeConfigs(res.barcodeConfigs);
        const config = { ...res.barcodeConfigs?.[0] };
        setBarcodeType(config.barcodeType);
        setStampType(config.stampType);
        setShowName(config.isShowName);
        setShowPrice(config.isShowPrice);
        setShowCode(config.isShowCode);
      }
      setIsDataInitialization(false);
    });
  };

  const onBarcodeTypeChange = (value) => {
    onChangeForm(true);
    setBarcodeType(value);
  };

  const onStampTypeChange = (value) => {
    onChangeForm(true);
    setStampType(value);
  };

  const handleSetShowName = (event) => {
    onChangeForm(true);
    setShowName(event.target.checked);
  };

  const handleSetShowPrice = (event) => {
    onChangeForm(true);
    setShowPrice(event.target.checked);
  };

  const handleSetShowCode = (event) => {
    onChangeForm(true);
    setShowCode(event.target.checked);
  };

  const onSave = () => {
    const request = {
      configs: barcodeConfigs,
    };
    barcodeDataService.updateBarcodeConfigByStoreIdAsync(request).then((res) => {
      if (res) {
        onChangeForm(false);
        message.success(`${pageData.barcode} ${pageData.isUpdatedSuccessfully}`);
      }
    });
  };

  function StringToHTML({ htmlString }) {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  }

  const printStamp = () => {
    if (printerRef && printerRef.current) {
      printerRef.current.printTemplate();
    }
  };

  const handleSwapItem = (index, arr) => {
    if (arr.length > 1) {
      const temp = arr[0];
      if (index === -1) {
        arr[0] = arr[arr.length - 1];
        arr[arr.length - 1] = temp;
      } else {
        arr[0] = arr[index];
        arr[index] = temp;
      }
    }
  };

  return (
    <>
      <Card className="fnb-card-full">
        <Row>
          <Col lg={12} md={12} xs={24}>
            <div className="card-title-barcode">{pageData.title}</div>
          </Col>
          <Col lg={12} md={12} xs={24}>
            <Space className="float-right">
              <Button htmlType="button" className="action-review" type="primary" onClick={printStamp}>
                {pageData.btnPrintPreview}
              </Button>
              <Button htmlType="submit" type="primary" onClick={onSave}>
                {pageData.save}
              </Button>
            </Space>
          </Col>
        </Row>
        <Row className="pt-4">
          <Col lg={14} md={12} xs={24} className="border-div">
            <Row>
              <Col xl={12} lg={24} md={24} xs={24} className="form-item-left-barcode">
                <h3>{pageData.type}</h3>
                <FnbSelectSingle
                  className="item-input"
                  option={barcodeTypeList?.map((item) => ({
                    id: item.id,
                    name: item.name,
                  }))}
                  onChange={onBarcodeTypeChange}
                  showSearch
                  value={barcodeType}
                />
              </Col>
              <Col xl={12} lg={24} md={24} xs={24} className="form-item-left-barcode">
                <h3>{pageData.size}</h3>
                <FnbSelectSingleOptGroup
                  className="item-input"
                  optionGroup={stampTypeList?.map((item) => ({
                    id: item.id,
                    name:
                      item.name === StampName.mm35x22
                        ? pageData.twoStamp + " | " + item.name
                        : pageData.oneStamp + " | " + item.name,
                    group: item.name === StampName.mm35x22 ? pageData.twoStamp + ":" : pageData.oneStamp + ":",
                  }))}
                  onChange={onStampTypeChange}
                  showSearch
                  value={stampType}
                />
              </Col>
            </Row>
            <Row className="pt-4">
              <Col span={24}>
                <div className="card-title-config">{pageData.configuration}</div>
              </Col>
              <Col span={24} className="pt-4">
                <Checkbox noStyle onChange={handleSetShowName} checked={showName}>
                  <Text>{pageData.showItemName}</Text>
                </Checkbox>
              </Col>
              <Col span={24} className="pt-4">
                <Checkbox noStyle onChange={handleSetShowPrice} checked={showPrice}>
                  <Text>{pageData.showPrice}</Text>
                </Checkbox>
              </Col>
              <Col span={24} className="pt-4">
                <Checkbox noStyle onChange={handleSetShowCode} checked={showCode}>
                  <Text>{pageData.showCode}</Text>
                </Checkbox>
              </Col>
            </Row>
          </Col>
          <Col lg={10} md={12} xs={24} className="div-vertically">
            <div className="preview-barcode">
              <Printer ref={printerRef} htmlContent={previewData} paddingBottom={0} />
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
}
