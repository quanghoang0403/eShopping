import { Button, Card, Checkbox, Col, DatePicker, Form, InputNumber, message, Row, Space, Switch } from "antd";
import PageTitle from "components/page-title";
import { useEffect, useState } from "react";

import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import FnbCard from "components/fnb-card/fnb-card.component";
import { inputNumberRange1To999999999 } from "constants/default.constants";
import { CalendarNewIconBold } from "constants/icons.constants";
import { DateFormat } from "constants/string.constants";
import customerDataService from "data-services/customer/customer-data.service";
import moment, { locale } from "moment";
import "moment/locale/vi";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { formatTextNumber, getCurrency } from "utils/helpers";
import "./loyalty-point-configuration.page.scss";

export default function LoyaltyPointConfiguration(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [showExpiryDate, setShowExpiryDate] = useState(false);
  const [showExpiryMembership, setShowExpiryMembership] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [expiryDate, setExpiryDate] = useState(null);
  const [expiryMembershipDate, setExpiryMembershipDate] = useState(null);
  const [earningExchangeNumber, setEarningExchangeNumber] = useState(0);
  const [redeemExchangeNumber, setRedeemExchangeNumber] = useState(0);
  const [currencyCode, setCurrencyCode] = useState();
  const [language, setLanguage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);

  const pageData = {
    btnSave: t("button.save"),
    btnCancel: t("button.cancel"),
    okText: t("button.ok"),
    leaveForm: t("messages.leaveForm"),
    title: t("loyaltyPoint.title"),
    exchange: t("loyaltyPoint.exchange"),
    pointProgram: t("loyaltyPoint.pointProgram"),
    earningPoint: t("loyaltyPoint.earningPoint"),
    redeemPoint: t("loyaltyPoint.redeemPoint"),
    expiryDateMessage: t("loyaltyPoint.expiryDateMessage"),
    enableExpiryDateMessage: t("loyaltyPoint.enableExpiryDateMessage"),
    earningMessage: t("loyaltyPoint.earningMessage"),
    redeemMessage: t("loyaltyPoint.redeemMessage"),
    earningOnePoint: t("loyaltyPoint.earningOnePoint"),
    redeemOnePoint: t("loyaltyPoint.redeemOnePoint"),
    pointValidateMessage: t("loyaltyPoint.pointValidateMessage"),
    modifySuccessMessage: t("loyaltyPoint.modifySuccessMessage"),
    modifySuccessErr: t("loyaltyPoint.modifySuccessErr"),
    enable: t("status.enable"),
    disable: t("status.disable"),
    point: {
      min: 0,
      max: 999999999,
    },
    btnConfirmLeave: t("button.confirmLeave"),
    discardBtn: t("button.discard"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    selectMembershipDate: t("loyaltyPoint.selectMembershipDate"),
    enableMembershipDate: t("loyaltyPoint.enableMembershipDate"),
    titleMembershipDate: t("loyaltyPoint.titleMembershipDate"),
    formatDateTime: "dd/mm",
    endTimeUTC: "23:59:59 (UTC + 7)",
  };

  useEffect(() => {
    setLanguage(t.language);
    setCurrencyCode(getCurrency());
    fetchInitData();
  }, [t.language]);

  const fetchInitData = async () => {
    await getConfigurationData();
  };

  const setInitialFormValue = async (res) => {
    if (res.hasData) {
      const { configuration } = res;
      const loyaltyPointConfig = {
        isActivated: configuration.isActivated,
        isExpiryDate: configuration.isExpiryDate,
        expiryDate: configuration.isExpiryDate ? moment.utc(configuration.expiryDate).local() : null,
        earningPointExchangeValue: configuration.earningPointExchangeValue,
        redeemPointExchangeValue: configuration.redeemPointExchangeValue,
        isExpiryMembershipDate: configuration.isExpiryMembershipDate,
        expiryMembershipDate: configuration.isExpiryMembershipDate
          ? moment.utc(configuration.expiryMembershipDate).local()
          : null,
      };
      setShowExpiryDate(configuration.isExpiryDate);
      setShowExpiryMembership(configuration.isExpiryMembershipDate);
      setEarningExchangeNumber(formatTextNumber(configuration.earningPointExchangeValue));
      setRedeemExchangeNumber(formatTextNumber(configuration.redeemPointExchangeValue));
      form.setFieldsValue({ loyaltyPointConfig });
    } else {
      const loyaltyPointConfig = {
        isActivated: false,
        isExpiryDate: false,
        earningPointExchangeValue: 0,
        redeemPointExchangeValue: 0,
      };
      setShowExpiryDate(false);
      setEarningExchangeNumber(formatTextNumber(loyaltyPointConfig.earningPointExchangeValue));
      setRedeemExchangeNumber(formatTextNumber(loyaltyPointConfig.redeemPointExchangeValue));
      form.setFieldsValue({ loyaltyPointConfig });
    }
  };

  const getConfigurationData = async () => {
    let res = await customerDataService.getLoyaltyPointByStoreIdAsync();
    setInitialFormValue(res);
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  const onFinish = async (value) => {
    var timeZone = new Date().getTimezoneOffset() / 60;
    if (!value.loyaltyPointConfig.expiryDate && value.loyaltyPointConfig.isExpiryDate) {
      message.error(pageData.modifySuccessErr);
      return;
    }
    if (!value.loyaltyPointConfig.expiryMembershipDate && value.loyaltyPointConfig.isExpiryMembershipDate) {
      message.error(pageData.selectMembershipDate);
      return;
    }

    let { loyaltyPointConfig } = value;
    if (loyaltyPointConfig.expiryDate) {
      let expiryDate = new Date(
        moment(loyaltyPointConfig.expiryDate).year(),
        moment(loyaltyPointConfig.expiryDate).month(),
        moment(loyaltyPointConfig.expiryDate).date(),
        12,
        0,
        0,
      );

      loyaltyPointConfig.expiryDate = moment(expiryDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2);
    }

    if (loyaltyPointConfig.expiryMembershipDate) {
      let expiryMembershipDate = new Date(
        moment(loyaltyPointConfig.expiryMembershipDate).year(),
        moment(loyaltyPointConfig.expiryMembershipDate).month(),
        moment(loyaltyPointConfig.expiryMembershipDate).date(),
        12,
        0,
        0,
      );
      loyaltyPointConfig.expiryMembershipDate = moment(expiryMembershipDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2);
    }

    loyaltyPointConfig.timeZone = timeZone;

    await customerDataService.modifyLoyaltyPointAsync(value.loyaltyPointConfig).then((res) => {
      if (res) {
        message.success(pageData.modifySuccessMessage);
        ReloadPage();
      }
    });
  };

  const onChangeEarningPoint = (value) => {
    setEarningExchangeNumber(formatTextNumber(value));
  };

  const onChangeRedeemPoint = (value) => {
    setRedeemExchangeNumber(formatTextNumber(value));
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      ReloadPage();
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
  };

  // Redirect to home page
  const ReloadPage = () => {
    setIsChangeForm(false);
    setShowConfirm(false);
    fetchInitData();
  };

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        onFieldsChange={(e) => changeForm(e)}
        className="loyalty-point-configuration"
      >
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <Space className="page-title">
              <PageTitle content={pageData.title} />
            </Space>
            <Space className="page-action-group"></Space>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button htmlType="submit" type="primary" className="btn-save-data">
                      {pageData.btnSave}
                    </Button>
                  ),
                  permission: null,
                },
                {
                  action: (
                    <a onClick={() => onCancel()} className="action-cancel btn-cancel-data">
                      {pageData.btnCancel}
                    </a>
                  ),
                  permission: null,
                },
              ]}
            />
          </Col>
        </Row>

        {/* Card enable loyalty point configuration */}
        <Card className="box-enable">
          <Row className="row-enable-config">
            <h2 className="title-enable">{pageData.title}</h2>
            <Form.Item name={["loyaltyPointConfig", "isActivated"]} valuePropName="checked">
              <Switch className="switch-enable" />
            </Form.Item>
          </Row>
        </Card>

        <FnbCard title={pageData.pointProgram} className="pt-4 mt-4 row-point-program">
          <div className="border-div">
            <div className="mb-4">
              <Form.Item name={["loyaltyPointConfig", "isExpiryDate"]} valuePropName="checked">
                <Checkbox onClick={() => setShowExpiryDate(!showExpiryDate)}>
                  {pageData.enableExpiryDateMessage}
                </Checkbox>
              </Form.Item>
              {showExpiryDate && (
                <>
                  <Row>
                    <span className="date-message">{pageData.expiryDateMessage}</span>
                    <Form.Item name={["loyaltyPointConfig", "expiryDate"]} className="input-date ml-4">
                      <DatePicker
                        suffixIcon={<CalendarNewIconBold />}
                        className="fnb-date-picker w-100"
                        disabledDate={disabledDate}
                        format={DateFormat.DD_MM}
                        onChange={(date) => setExpiryDate(date)}
                        placeholder={pageData.formatDateTime}
                        locale={language === "vi" ? locale : ""}
                      />
                    </Form.Item>
                    <span className="end-time-utc">{pageData.endTimeUTC}</span>
                  </Row>
                </>
              )}
            </div>
            <div className="mb-4">
              <Form.Item
                name={["loyaltyPointConfig", "isExpiryMembershipDate"]}
                valuePropName="checked"
                className="mt-4"
              >
                <Checkbox onClick={() => setShowExpiryMembership(!showExpiryMembership)}>
                  {pageData.enableMembershipDate}
                </Checkbox>
              </Form.Item>
              {showExpiryMembership && (
                <>
                  <Row>
                    <span className="date-message">{pageData.titleMembershipDate}</span>
                    <Form.Item name={["loyaltyPointConfig", "expiryMembershipDate"]} className="input-date ml-4">
                      <DatePicker
                        suffixIcon={<CalendarNewIconBold />}
                        className="fnb-date-picker w-100"
                        disabledDate={disabledDate}
                        format={DateFormat.DD_MM}
                        onChange={(date) => setExpiryMembershipDate(date)}
                        placeholder={pageData.formatDateTime}
                        locale={language === "vi" ? locale : ""}
                      />
                    </Form.Item>
                    <span className="end-time-utc">{pageData.endTimeUTC}</span>
                  </Row>
                </>
              )}
            </div>
          </div>
        </FnbCard>

        <FnbCard title={pageData.earningPoint} className="pt-4 mt-4 row-earn-point">
          <div className="border-div">
            <span className="title-exchange">{pageData.exchange}</span>
            <Row className="mt-2">
              <Row className="w-100 input-earn-point">
                <Form.Item
                  name={["loyaltyPointConfig", "earningPointExchangeValue"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.pointValidateMessage,
                    },
                    {
                      pattern: new RegExp(inputNumberRange1To999999999.range),
                      message: pageData.pointValidateMessage,
                    },
                  ]}
                  className="earning-point-change"
                >
                  <InputNumber
                    className="w-100 fnb-input-number"
                    placeholder="0"
                    min={1}
                    max={999999999}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    onChange={(value) => onChangeEarningPoint(value)}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <span className="earn-point">
                  <span style={{ marginRight: 20 }}>{getCurrency()}</span>
                  {pageData.earningOnePoint}
                </span>
              </Row>
              <Row className="mb-4">
                <Col span={24}>
                  <span className="spent-earn-point">
                    {t(pageData.earningMessage, {
                      number: earningExchangeNumber,
                      currency: currencyCode,
                    })}
                  </span>
                </Col>
              </Row>
            </Row>
          </div>
        </FnbCard>

        <FnbCard title={pageData.redeemPoint} className="pt-4 mt-4 row-redeem-point">
          <div className="border-div">
            <span className="title-exchange">{pageData.exchange}</span>
            <Row className="mt-2">
              <Row className="w-100 input-earn-point">
                <span className="earn-point earn-point-message ">{pageData.redeemOnePoint}</span>
                <Form.Item
                  name={["loyaltyPointConfig", "redeemPointExchangeValue"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.pointValidateMessage,
                    },
                    {
                      pattern: new RegExp(pageData.point.format),
                      message: pageData.pointValidateMessage,
                    },
                    {
                      pattern: new RegExp(pageData.point.range),
                      message: pageData.pointValidateMessage,
                    },
                  ]}
                  className="earning-point-change"
                >
                  <InputNumber
                    className="w-100 fnb-input-number"
                    placeholder="0"
                    min={1}
                    max={999999999}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    onChange={(value) => onChangeRedeemPoint(value)}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <span className="earn-point" style={{ marginRight: 20 }}>
                  {getCurrency()}
                </span>
              </Row>
              <Row className="mb-4">
                <Col span={24}>
                  <span className="spent-earn-point">
                    {t(pageData.redeemMessage, {
                      number: redeemExchangeNumber,
                      currency: currencyCode,
                    })}
                  </span>
                </Col>
              </Row>
            </Row>
          </div>
        </FnbCard>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.btnConfirmLeave}
        onCancel={onDiscard}
        onOk={ReloadPage}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
