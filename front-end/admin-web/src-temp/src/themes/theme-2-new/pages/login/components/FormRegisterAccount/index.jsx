import { Card, Col, DatePicker, Form, Radio, Row, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { CalendarNewIcon } from "../../../../assets/icons.constants";
import loadingIcon from "../../../../assets/icons/loadingIcon.gif";
import { BCButton } from "../../../../components/BCButton";
import { BCTypography } from "../../../../components/BCTypography";
import { FnbInputPassword } from "../../../../components/FnbInputPassword";
import { FnbInput } from "../../../../components/fnb-input/fnb-input.component";
import { EnumGenderAccount } from "../../../../constants/enums";
import { DateFormat } from "../../../../constants/string.constant";
import "./FormRegisterAccount.scss";

export default function FormRegisterAccount(props) {
  const { onLogin, form, registerLoading, themePageConfig, isRegisterWithoutOTP } = props;
  const isMobile = useMediaQuery({ maxWidth: 740 });
  const { t } = useTranslation();
  const [gender, setGender] = useState(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const onGenderChange = (e) => {
    setGender(e.target.value);
  };

  const onFinish = () => {
    form.validateFields().then((values) => {
      onLogin();
    });
  };

  return (
    <div className="background-form-info-account-wapper" id="id-form-info-account-wapper">
      <Form className="bc-form form-input-info-account" id="id-form-input-info-account" autoComplete="off" name="basic" onFinish={onFinish} form={form}>
        {registerLoading && (
          <div className="loading-overlay">
            <img src={loadingIcon} alt="" width={64} className="loading" />
          </div>
        )}
        <Card className="account-information-form-theme2">
          {isMobile ? (
            <Row>
              <p className="arrow-left-title">{t("registerNewAccount")}</p>
            </Row>
          ) : (
            <Row className="account-info-title">
              <Col sm={24} xs={24} lg={24}>
                <h3 className="acc-info">{t("registerNewAccount")}</h3>
              </Col>
            </Row>
          )}

          {isRegisterWithoutOTP && (
            <Row className="register-without-otp-message">
              <Typography.Text>
                <div
                  className="message"
                  dangerouslySetInnerHTML={{
                    __html: t("loginPage.registerWithoutOTPWarningMessage", {
                      colorCode: `${themePageConfig?.colorGroup?.buttonBackgroundColor}`,
                    }),
                  }}
                ></div>
              </Typography.Text>
            </Row>
          )}

          <div className="personal-info-theme2">
            <Row className="form-label">
              <BCTypography level={2}>{t("form.requiredInformation")}</BCTypography>
            </Row>
            <Row className="personal-info-theme2-row">
              <Col sm={24} md={6} className="title-person-info-registration">
                {t("firstName")}
                <span style={{ color: "red" }}>*</span>
              </Col>
              <Col sm={24} md={18} className="personal-info-fullname">
                <Form.Item
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseEnterYourName"),
                    },
                  ]}
                >
                  <FnbInput
                    className="fnb-input-theme"
                    placeholder={t("enterYourName")}
                    onChange={(e) => setIsButtonVisible(e.target.value.length > 0)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className="personal-info-theme2-row">
              <Col sm={24} md={6} className="title-person-info-registration">
                {t("lastName")}
              </Col>
              <Col sm={24} md={18} className="personal-info-fullname">
                <Form.Item name="lastName">
                  <FnbInput className="fnb-input-theme" placeholder={t("enterYourLastName")} />
                </Form.Item>
              </Col>
            </Row>

            <Row className="personal-info-theme2-row">
              <Col sm={24} md={6} className="title-person-info-registration">
                {t("password")}
                <span style={{ color: "red" }}>*</span>
              </Col>
              <Col sm={24} md={18} className="personal-info-fullname">
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: t("passwordRequired"),
                    },
                    {
                      min: 6,
                      message: t("minPassword"),
                    },
                    {
                      max: 100,
                      message: t("maxPassword"),
                    },
                  ]}
                >
                  <FnbInputPassword className="fnb-input-theme" placeholder={t("enterPassword")} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="form-label">
              <BCTypography className="form-label" level={2}>
                {t("form.optionalInformation")}
              </BCTypography>
            </Row>

            <Row className="personal-info-theme2-row">
              <Col sm={24} md={6}>
                <div className="title-person-info-registration">{t("referralCode")}</div>
              </Col>
              <Col sm={24} md={18} className="personal-info-referral-code">
                <Form.Item name="referralCode">
                  <FnbInput
                    className="fnb-input-theme"
                    maxLength={20}
                    placeholder={t("form.enterYourReferralCode")}
                    onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row className="personal-info-theme2-row">
              <Col sm={24} md={6}>
                <div className="title-person-info-registration">{t("email")}</div>
              </Col>
              <Col sm={24} md={18} className="personal-info-email">
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: t("emailFormatInvalid"),
                    },
                  ]}
                >
                  <FnbInput className="fnb-input-theme" placeholder={t("enterYourEmail")} />
                </Form.Item>
              </Col>
            </Row>

            <Row className="personal-info-theme2-row">
              <Col sm={24} md={6}>
                <div className="title-person-info-registration">{t("gender")}</div>
              </Col>
              <Col sm={24} md={18} className="personal-info-gender">
                <Form.Item name="gender">
                  <Radio.Group onChange={onGenderChange} defaultValue={EnumGenderAccount.Female} value={gender}>
                    <Radio value={EnumGenderAccount.Female}>{t("female")}</Radio>
                    <Radio value={EnumGenderAccount.Male}>{t("male")}</Radio>
                    <Radio value={EnumGenderAccount.Other}>{t("other")}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row className="personal-info-theme2-row">
              <Col sm={24} md={6}>
                <div className="title-person-info-registration">{t("birthDay")}</div>
              </Col>
              <Col sm={24} md={18} className="personal-info-birthday">
                <Form.Item name="birthDay">
                  <DatePicker
                    format={DateFormat.DD_MM_YYYY}
                    placeholder={t("selectYourBirthday")}
                    suffixIcon={<CalendarNewIcon />}
                    placement="topLeft"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className="button-submit-registration">
              <Col className="personal-info-button-submit">
                <BCButton
                  disabled={!isButtonVisible}
                  htmlType="submit"
                  className="account-info-save"
                  themePageConfig={themePageConfig}
                >
                  {t("register")}
                </BCButton>
              </Col>
            </Row>
          </div>
        </Card>
      </Form>
    </div>
  );
}
