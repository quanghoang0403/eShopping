import { Button, Card, Col, Form, InputNumber, message, Row, Space, Switch } from "antd";
import PageTitle from "components/page-title";
import { useEffect, useState } from "react";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import FnbCard from "components/fnb-card/fnb-card.component";
import { inputNumberRange1To999999999, inputNumberRange1To999999999DotAllow } from "constants/default.constants";
import "moment/locale/vi";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { formatterDecimalNumber, formatTextNumber, getCurrency, isDecimalKey, parserDecimalNumber } from "utils/helpers";
import "./referral-point-configuration.page.scss";
import storeDataService from "data-services/store/store-data.service";

export default function ReferralPointConfiguration(props) {
  const { setIsDataSave } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const [earningExchangeNumber, setEarningExchangeNumber] = useState(0);
  const [currencyCode, setCurrencyCode] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [originalData, setOriginalData] = useState();
  const isVietnamese = i18n.language === "vi";

  const pageData = {
    btnSave: t("button.save"),
    btnCancel: t("button.cancel"),
    okText: t("button.ok"),
    leaveForm: t("messages.leaveForm"),
    title: t("referralPoint.title"),
    enableTitle: t("referralPoint.enable"),
    pointProgram: t("referralPoint.pointProgram"),
    earningPoint: t("loyaltyPoint.earningPoint"),
    summary: t("referralPoint.summary"),
    earningMessage: t("referralPoint.earningMessage"),
    description: t("referralPoint.description"),
    earningPointRequired: t("referralPoint.earningPointRequired"),
    earningOnePoint: t("loyaltyPoint.earningOnePoint"),
    modifySuccessMessage: t("referralPoint.modifySuccessMessage"),
    exchange: t("loyaltyPoint.exchange"),
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
    selectMembershipDate: t("referralPoint.selectMembershipDate"),
    enableMembershipDate: t("referralPoint.enableMembershipDate"),
    titleMembershipDate: t("referralPoint.titleMembershipDate"),
    formatDateTime: "dd/mm",
    endTimeUTC: "23:59:59 (UTC + 7)",
  };

  useEffect(() => {
    setCurrencyCode(getCurrency());
    const errorFields = form.getFieldsError()
      .reduce((arr, field) => (field.errors.length && arr.push(field.name), arr), []);

    form.validateFields(errorFields);
  }, [i18n.language]);

  useEffect(() => {
    setIsDataSave(!isChangeForm);
  }, [isChangeForm])

  const fetchInitData = async () => {
    await getConfigurationData();
  };

  const setInitialFormValue = async (res) => {
    if (res.hasData) {
      const { configuration } = res;
      const referralPointConfig = {
        isActivated: configuration.isActivated,
        earningPointExchangeValue: configuration.earningPointExchangeValue
      };
      setEarningExchangeNumber(formatTextNumber(configuration.earningPointExchangeValue));
      form.setFieldsValue({ referralPointConfig });
      setOriginalData(referralPointConfig);
    } else {
      const referralPointConfig = {
        isActivated: false,
        earningPointExchangeValue: null,
      };
      setEarningExchangeNumber(formatTextNumber(referralPointConfig.earningPointExchangeValue));
      form.setFieldsValue({ referralPointConfig });
    }
  };

  const getConfigurationData = async () => {
    let res = await storeDataService.getReferralPointByStoreIdAsync();
    setInitialFormValue(res);
  };

  const onFinish = async (value) => {
    const res = await storeDataService.modifyReferralPointAsync(value.referralPointConfig);
      if (res) {
        message.success(pageData.modifySuccessMessage);
        ReloadPage();
      }
  };

  const onChangeEarningPoint = (value) => {
    setEarningExchangeNumber(formatTextNumber(value));
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

  const changeForm = () => {
    const currenctData =form.getFieldValue("referralPointConfig");
    setIsChangeForm(!originalData || currenctData.isActivated !== originalData.isActivated ||
      currenctData.earningPointExchangeValue !== originalData.earningPointExchangeValue);
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
        className="referral-point-configuration"
      >
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <Space className="page-title">
              <PageTitle content={pageData.title} />
            </Space>
            <Space className="page-action-group"></Space>
          </Col>
          { isChangeForm && 
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
          }
        </Row>
        <Card className="box-enable">
          <Row className="row-enable-config col-switch">
            <h2 className="title-enable">{pageData.enableTitle}</h2>
            <Form.Item name={["referralPointConfig", "isActivated"]} valuePropName="checked">
              <Switch className="switch-enable" />
            </Form.Item>
          </Row>
          <span className="title">
              { pageData.description}
          </span>
        </Card>
        <FnbCard title={pageData.earningPoint} className="p-4  mt-4 row-earn-point">
          <div className="border-div">
            <span className="title-exchange">{pageData.exchange}</span>
            <Row className="mt-2">
              <Row className="w-100 input-earn-point">
                <Form.Item
                  name={["referralPointConfig", "earningPointExchangeValue"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.earningPointRequired,
                    },
                    {
                      pattern: new RegExp(isVietnamese ? inputNumberRange1To999999999.range : inputNumberRange1To999999999DotAllow.range),
                      message: pageData.earningPointRequired,
                    },
                  ]}
                  className="earning-point-change"
                >
                  <InputNumber
                    className="w-100 fnb-input-number"
                    placeholder="0"
                    min={1}
                    max={999999999}
                    formatter={(value) => isVietnamese ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : formatterDecimalNumber(value, true)}
                    parser={(value) => isVietnamese ? value.replace(/\$\s?|(,*)/g, "") : parserDecimalNumber(value, true)}
                    onChange={(value) => onChangeEarningPoint(value)}
                    onKeyPress={(event) => {
                      if ((isVietnamese && !/[0-9]/.test(event.key)) || !isDecimalKey(event)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <div className="earn-point"> 
                  <span>{getCurrency()}</span>
                  <span>{pageData.earningOnePoint}</span>                  
                </div>
              </Row>
              <Row>
                <Col span={24} className="spent-earn-point">
                  <span>
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
