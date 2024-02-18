import { Card, Col, Form, Row, Input, Switch } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { getUrlQrCode } from "utils/helpers";
import "./style.scss";
import dataBank from 'assets/json/bank-infomation.json';
import { Download, EllipsisOutlined } from "constants/icons.constants";
import { useSelector } from "react-redux";
import jsQR from "jsqr";
import { QRCode } from 'react-qrcode-logo';
import fileDataService from "data-services/file/file-data.service";
import goFnbLogo from "assets/images/go-fnb-login-logo.png";

export const BranchBankTransferComponent = forwardRef((props, ref) => {
  const dataBankInfo = dataBank.data;
  const { t, isUseStoreBankAccount, setIsUseStoreBankAccount, setBankName, form } = props;
  const [isDefaultBankCountry, setIsDefaultBankCountry] = useState(true);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [acpId, setAcpId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [defaultCountryId, setDefaultCountryId] = useState("");
  const [logo, setLogo] = useState();
  const [valueQRCode, setValueQRCode] = useState();
  const reduxState = useSelector((state) => state);
  const myCanvas = useRef();
  const bgColor = '#f7f5ff';
  const logoPadding = 5;
  const offset = 0;
  const size = 162;
  const logoRadius = 0;
  const logoWidth = 22;
  const logoHeight = 22;

  const pageData = {
    titleBank: t("BranchBankTransfer.title"),
    useBankAccount: t("BranchBankTransfer.useBankAccount"),
    accountHolder: t("BranchBankTransfer.accountHolder"),
    inputAccountHolder: t("BranchBankTransfer.inputAccountHolder"),
    validAccountHolder: t("BranchBankTransfer.validAccountHolder"),
    bankName: t("BranchBankTransfer.bankName"),
    selectBankName: t("BranchBankTransfer.selectBankName"),
    validBankName: t("BranchBankTransfer.validBankName"),
    inputBankName: t("BranchBankTransfer.inputBankName"),
    validInputBankName: t("BranchBankTransfer.validInputBankName"),
    accountNumber: t("BranchBankTransfer.accountNumber"),
    allowNumberOnly: t("form.allowNumberOnly"),
    inputAccountNumber: t("BranchBankTransfer.inputAccountNumber"),
    validAccountNumber: t("BranchBankTransfer.validAccountNumber"),
    country: t("BranchBankTransfer.country"),
    selectCountry: t("BranchBankTransfer.selectCountry"),
    validCountry: t("BranchBankTransfer.validCountry"),
    labelProvince: t("form.province"),
    selectProvince: t("form.selectProvince"),
    validProvince: t("form.validProvince"),
    qRCode: t("BranchBankTransfer.qRCode"),
    bankBranchName: t("BranchBankTransfer.bankBranchName"),
    inputBankBranchName: t("BranchBankTransfer.inputBankBranchName"),
    swiftCode: t("BranchBankTransfer.swiftCode"),
    inputSwiftCode: t("BranchBankTransfer.inputSwiftCode"),
    routingNumber: t("BranchBankTransfer.routingNumber"),
    inputRoutingNumber: t("BranchBankTransfer.inputRoutingNumber"),
    download: t("BranchBankTransfer.download"),
    swiftCodeMaxLength: 100,
    routingNumberMaxLength: 100,
  };

  useImperativeHandle(ref, () => ({
    setInitBankAccountData(bankTransferResponse, prepareAddressDataResponse) {
      initDataBankAccount(bankTransferResponse, prepareAddressDataResponse);
    },
  }));

  const initDataBankAccount = (bankTransferResponse, prepareAddressDataResponse) => {
    const { countries, cities, defaultCountry } = prepareAddressDataResponse;
    setDefaultCountryId(defaultCountry?.id);
    setCountries(countries);
    setCities(cities);

    if (bankTransferResponse.branch) {
      const { branch } = bankTransferResponse;
      form.setFieldsValue({
        branch: {
          ...branch,
        },
      });
      setAcpId(branch?.acpId || "");
      setAccountNumber(branch?.accountNumber || "");
      setAccountHolder(branch?.accountHolder || "");
      branch?.bankCountryId === defaultCountry?.id ? setIsDefaultBankCountry(true) : setIsDefaultBankCountry(false);
      if (!branch?.bankCountryId) {
        form.setFieldValue("bankCountryId", defaultCountry?.id);
        setIsDefaultBankCountry(true);
      }
      if (branch?.acpId) {
        const bank = dataBankInfo.find(x => x.bin === branch?.acpId);
        setBankName(bank?.shortName + " - " + bank?.name || "");
      }
      if (branch?.bankName) {
        setBankName(branch?.bankName);
      }
      setValueQRCode(handleGetValueQRCode(branch?.acpId, branch?.accountNumber));

    } else {
      let formValue = form.getFieldsValue();
      if (Object.keys(formValue).length > 0) {
        form.setFieldsValue(formValue);
      }
      else {
        form.setFieldValue("bankCountryId", defaultCountry?.id);
      }
    }
  };

  const onChangeCountryBank = (countryId) => {
    countryId === defaultCountryId ? setIsDefaultBankCountry(true) : setIsDefaultBankCountry(false);
    form.setFieldValue("bankName", "");
    setBankName("");
  };

  const onChangeAccountHolder = (e) => {
    setAccountHolder(e.target.value || "");
  };

  const onChangeBankName = (bin) => {
    setAcpId(bin);
    const bank = dataBankInfo.find(x => x.bin === bin);
    setBankName(bank?.shortName + " - " + bank?.name || "");
    handleGetValueQRCode(bank?.bin, accountNumber);
  };

  const onChangeInputBankName = (e) => {
    setBankName(e.target.value || "");
  };

  const onChangeAccountNumber = (e) => {
    setAccountNumber(e.target.value || "");
    handleGetValueQRCode(acpId, e.target.value || "");
  };

  const onChangeSwitch = (checked) => {
    setIsUseStoreBankAccount(checked);
  };

  const handleDownload = async () => {
    const canvas = document.getElementById("react-qrcode-logo");
    if (canvas) {
      const url = canvas?.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = 'download-app-qr-code.png';
      link.href = url;
      link.click();
    }
  };

  const getBase64Image = async (url) => {
    const res = await fileDataService.getBase64Image(url);
    if (res?.imageData) {
      setLogo(res?.imageData);
      onChangeLogoCanvas(res?.imageData)
    }
  }

  const handleGetValueQRCode = async (acpId, accountNumber) => {
    const url = getUrlQrCode(acpId, accountNumber);
    if (url) {
      const context = myCanvas.current.getContext("2d");
      // QR Code Img
      let qRCodeImg = new Image();
      qRCodeImg.crossOrigin = "anonymous";
      qRCodeImg.src = url;
      qRCodeImg.onload = () => {
        context.drawImage(qRCodeImg, 0, 0, 200, 200);
      };

      setTimeout(() => {
        const imageDataQR = context.getImageData(0, 0, 200, 200);
        const value = jsQR(imageDataQR.data, 200, 200);
        setValueQRCode(value.data);
        const storeInfo = reduxState?.session?.informationPublishStore;
        let linkLogo = storeInfo.logo || goFnbLogo;
        getBase64Image(linkLogo);
      }, 1500);
    }
  };

  const onChangeLogoCanvas = (imageData) => {
    const canvas = document.getElementById('react-qrcode-logo');
    if (canvas && imageData) {
      const ctx = canvas.getContext('2d');
      const image = new Image();

      const roundedImage = (x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }

      image.onload = () => {
        ctx.save();

        const dWidthLogo = logoWidth;
        const dHeightLogo = logoHeight;
        const dxLogo = ((size - dWidthLogo) / 2);
        const dyLogo = ((size - dHeightLogo) / 2);

        ctx.beginPath()
        ctx.arc(size / 2, size / 2, dWidthLogo / 2 + logoPadding, 0, Math.PI * 2, false);
        ctx.arc(size / 2, size / 2, 0, 0, Math.PI * 2, true);
        ctx.strokeStyle = bgColor;
        ctx.fillStyle = bgColor;
        ctx.fill();

        roundedImage(dxLogo, dyLogo, dWidthLogo, dHeightLogo, logoRadius)
        ctx.clip();
        ctx.drawImage(image, dxLogo, dyLogo, dWidthLogo, dHeightLogo);

        ctx.restore();
      };
      image.src = imageData;
    }
  };

  return (
    <Card className="fnb-card w-100 mt-24 fnb-box card-bank-transfer">
      <Row className="card-title-box">
        <Col lg={12} span={24} className="d-flex-align-center">
          <h3 className="card-title">{pageData.titleBank}</h3>
        </Col>
        <Col lg={12} span={24} className="d-flex-align-right">
          <Row justify="end">
            <div className="switch-content">
              <div className="use-bank-content">
                {pageData.useBankAccount}
              </div>
              <Switch checked={isUseStoreBankAccount} onChange={onChangeSwitch} />
            </div>
          </Row>
        </Col>
      </Row>
      {
        isUseStoreBankAccount === false && (
          <>
            <Row gutter={[24, 24]}>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">
                  {pageData.accountHolder}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  name={"accountHolder"}
                  rules={[
                    { required: true, message: pageData.validAccountHolder },
                    { type: "string", warningOnly: true },
                    {
                      type: "string",
                      max: 100,
                      message: `${pageData.accountHolder} ${pageData.mustBeBetweenThreeAndOneHundredsCharacters}`,
                    },
                  ]}
                >
                  <Input
                    showCount
                    maxLength={100}
                    className="fnb-input-with-count"
                    placeholder={pageData.inputAccountHolder}
                    onChange={onChangeAccountHolder}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">
                  {pageData.bankName}
                  <span className="text-danger">*</span>
                </h4>
                {isDefaultBankCountry ? (
                  <>
                    <Form.Item
                      name="acpId"
                      rules={[
                        {
                          message: pageData.validBankName,
                          required: true,
                        },
                      ]}
                    >
                      <FnbSelectSingle
                        placeholder={pageData.selectBankName}
                        option={dataBankInfo?.map((item, index) => ({
                          id: item.bin,
                          name: item.shortName + ' - ' + item.name,
                          key: item.id
                        }))}
                        onChange={onChangeBankName}
                        showSearch
                      />
                    </Form.Item>
                  </>
                ) :
                  (
                    <Form.Item
                      name={"bankName"}
                      rules={[
                        { required: true, message: pageData.validInputBankName },
                        { type: "string", warningOnly: true },
                        {
                          type: "string",
                          max: 100,
                          message: `${pageData.bankName} ${pageData.mustBeBetweenThreeAndOneHundredsCharacters}`,
                        },
                      ]}
                    >
                      <Input
                        showCount
                        maxLength={100}
                        className="fnb-input-with-count"
                        placeholder={pageData.inputBankName}
                        onChange={onChangeInputBankName}
                      />
                    </Form.Item>
                  )}
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">
                  {pageData.accountNumber}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  name={"accountNumber"}
                  rules={[
                    { required: true, message: pageData.validAccountNumber },
                    {
                      pattern: /^\d+$/g,
                      max: 20,
                      message: pageData.allowNumberOnly,
                    },
                  ]}
                >
                  <Input
                    className="fnb-input-with-count"
                    placeholder={`${pageData.inputAccountNumber}`}
                    maxLength={20}
                    onChange={onChangeAccountNumber}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">
                  {pageData.country}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item name={"bankCountryId"}
                  rules={[{ required: true, message: pageData.validCountry }]}>
                  <FnbSelectSingle
                    placeholder={pageData.selectCountry}
                    size="large"
                    showSearch
                    autoComplete="none"
                    onChange={(e) => {
                      onChangeCountryBank(e);
                      // onChangeForm();
                    }}
                    option={countries?.map((item, index) => ({
                      id: item.id,
                      name: item.nicename,
                      key: item.id
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            {isDefaultBankCountry ? (
              <>
                <Row gutter={[24, 24]}>
                  <Col sm={24} xs={24} lg={12}>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">{pageData.labelProvince}</h4>
                        <Form.Item name="bankCityId">
                          <FnbSelectSingle
                            placeholder={pageData.selectProvince}
                            option={cities?.map((item, index) => ({
                              id: item.id,
                              name: item.name,
                              key: item.id
                            }))}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">{pageData.bankBranchName}</h4>
                        <Form.Item name={"bankBranchName"}
                          className="mb-0"
                          rules={[
                            { type: "string", warningOnly: true },
                            {
                              type: "string",
                              max: 100,
                              message: `${pageData.bankName} ${pageData.mustBeBetweenThreeAndOneHundredsCharacters}`,
                            },
                          ]}>
                          <Input
                            showCount
                            className="fnb-input-with-count"
                            placeholder={`${pageData.inputBankBranchName}`}
                            maxLength={100}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <div>
                      <canvas
                        id="myCanvas"
                        className="d-none"
                        ref={myCanvas}
                        width={200}
                        height={200}
                      />
                      <h4 className="fnb-form-label">{pageData.qRCode}</h4>
                      {
                        (acpId && accountNumber && accountHolder && logo && valueQRCode) ? (
                          <>
                            <div className='card-qr-code qr-code'>
                              <div className='card-qr-code qr-code qr-code-wrapper'>
                                <div>
                                  <QRCode
                                    size={size}
                                    quietZone={offset}
                                    bgColor={bgColor}
                                    value={valueQRCode}
                                  />
                                </div>
                                <div className="ant-image-mask download" onClick={handleDownload}>
                                  <div className="ant-image-mask-info">
                                    <span role="img" aria-label="eye" className="anticon anticon-eye">
                                      <Download />
                                      {pageData.download}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                          :
                          (<div className="qrcode-content">
                            <div className="icon-qrcode">
                              <EllipsisOutlined />
                            </div>
                          </div>)
                      }
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row gutter={[24, 24]}>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.swiftCode}</h4>
                    <Form.Item name={"swiftCode"} className="mb-0">
                      <Input
                        className="fnb-input-with-count"
                        maxLength={pageData.swiftCodeMaxLength}
                        placeholder={`${pageData.inputSwiftCode}`}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.routingNumber}</h4>
                    <Form.Item
                      className="mb-0"
                      name={"routingNumber"}
                    >
                      <Input
                        className="fnb-input-with-count"
                        maxLength={pageData.routingNumberMaxLength}
                        placeholder={`${pageData.inputRoutingNumber}`}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </>
        )
      }
    </Card>
  );
});
