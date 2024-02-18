import { Col, DatePicker, Form, Input, Radio, Row, Space, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { ArrowLeftIcon, CalendarIcon, EyeOffThinIcon, EyeOpenThinIcon } from "../../../assets/icons.constants";
import loadingIcon from "../../../assets/icons/loadingIcon.gif";
import { FnbInput } from "../../../components/fnb-input/fnb-input.component";
import { EnumGenderAccount } from "../../../constants/enums";
import { PASSWORD_CHARACTER } from "../../../constants/login.constants";
import { DateFormat } from "../../../constants/string.constants";

import { BCButton } from "../../../components/BCButton";
import { BCTypography } from "../../../components/BCTypography";
import "./form-input-information.component.scss";

export default function AccountInformationForm(props) {
  const { handleBack, onLogin, form, isLoading, themePageConfig, isRegisterWithoutOTP } = props;
  const isMobile = useMediaQuery({ maxWidth: 740 });
  const [t] = useTranslation();

  const translateData = {
    userProfile: t("myProfile.accountInfo.userProfile", "Thông tin tài khoản"),
    pleaseEnterYourName: t("myProfile.accountInfo.pleaseEnterYourName", "Vui lòng nhập tên của bạn"),
    pleaseEnterYourFamilyName: t("myProfile.accountInfo.pleaseEnterYourFamilyName", "Vui lòng nhập họ của bạn"),
    enterYourName: t("myProfile.accountInfo.enterYourName", "Nhập tên của bạn"),
    enterFamilyName: t("myProfile.accountInfo.enterFamilyName", "Nhập họ của bạn"),
    emailPlaceholder: t("myProfile.accountInfo.inputEmail", "Nhập email của bạn"),
    validEmailPattern: t("myProfile.accountInfo.validEmailPattern", "Email không có giá trị"),
    birthdayPlaceholder: t("myProfile.accountInfo.inputBirthDay", "Chọn ngày sinh của bạn"),
    gender: t("myProfile.accountInfo.gender", "Giới tính"),
    male: t("myProfile.accountInfo.male", "Nam"),
    female: t("myProfile.accountInfo.female", "Nữ"),
    other: t("myProfile.accountInfo.other", "Khác"),
    register: t("myProfile.accountInfo.btnRegister", "Tạo tài khoản"),
    enterPassword: t("myProfile.accountInfo.enterPassword", "Vui lòng nhập mật khẩu"),
    minPasswordCharacter: t(
      "myProfile.accountInfo.minPasswordCharacter",
      "Mật khẩu quá ngắn (tối thiểu {{minPasswordChar}} ký tự)",
      { minPasswordChar: PASSWORD_CHARACTER.minPasswordChar },
    ),
    enterYourPassword: t("myProfile.accountInfo.enterYourPassword", "Vui lòng nhập mật khẩu"),
  };

  const [gender, setGender] = useState(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const onGenderChange = (e) => {
    setGender(e.target.value);
  };

  const onFinish = () => {
    form.validateFields().then((values) => {
      onLogin();
    });
  };

  const NoBackspaceInput = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  return (
    <div className="register-container" id="id-register-container">
      <Form
        className="bc-form form-input-info-account"
        id="id-form-input-info-account"
        autoComplete="off"
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        form={form}
      >
        {isLoading && (
          <div className="loading-overlay">
            <img src={loadingIcon} alt="" width={64} className="loading" />
          </div>
        )}
        <div className="account-information-form-theme1">
          {isMobile ? (
            <Typography.Link onClick={handleBack} className="arrow-left-title">
              <ArrowLeftIcon /> {translateData.userProfile}
            </Typography.Link>
          ) : (
            <Row className="account-info-title">
              <Typography.Link onClick={handleBack} className="arrow-left-title">
                <ArrowLeftIcon />
              </Typography.Link>
              <Space className="form-title">
                <h3 className="acc-info">{translateData.userProfile}</h3>
              </Space>
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

          <Row className="personal-info-theme1">
            <Col span={24}>
              <Row>
                <Col span={24} className="form-label">
                  <BCTypography level={2}>{t("form.requiredInformation")}</BCTypography>
                </Col>
                <Col sm={24} xs={24} lg={24} className="personal-info-fullname">
                  <Form.Item
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: translateData.pleaseEnterYourName,
                      },
                    ]}
                  >
                    <FnbInput
                      className="fnb-input-theme"
                      placeholder={translateData.enterYourName + "*"}
                      maxLength={20}
                      onChange={(e) => setIsButtonVisible(e.target.value.length > 0)}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} xs={24} lg={24} className="personal-info-fullname">
                  <Form.Item name="lastName">
                    <FnbInput className="fnb-input-theme" maxLength={20} placeholder={translateData.enterFamilyName} />
                  </Form.Item>
                </Col>
                <Col sm={24} xs={24} lg={24} className="personal-info-password">
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: translateData.enterPassword,
                      },
                      {
                        message: translateData.minPasswordCharacter,
                        min: 6,
                      },
                    ]}
                  >
                    <Input.Password
                      className="fnb-input-theme"
                      placeholder={translateData.enterYourPassword + "*"}
                      iconRender={(visible) => (
                        <Typography.Link>{visible ? <EyeOffThinIcon /> : <EyeOpenThinIcon />}</Typography.Link>
                      )}
                      maxLength={PASSWORD_CHARACTER.maxPasswordChar}
                      onKeyDown={NoBackspaceInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <Row>
                <Col span={24} className="form-label">
                  <BCTypography level={2}>{t("form.optionalInformation")}</BCTypography>
                </Col>
                <Col sm={24} xs={24} lg={24} className="personal-info-email">
                  <Form.Item name="referralCode">
                    <FnbInput
                      className="fnb-input-theme"
                      maxLength={20}
                      placeholder={t("form.enterYourReferralCode")}
                      onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} xs={24} lg={24} className="personal-info-email">
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: translateData.validEmailPattern,
                      },
                    ]}
                  >
                    <FnbInput className="fnb-input-theme" maxLength={50} placeholder={translateData.emailPlaceholder} />
                  </Form.Item>
                </Col>
                <Col sm={24} xs={24} lg={24} className="personal-info-gender">
                  <Row>
                    <Col span={24} sm={6} className="gender-title">
                      {translateData.gender}
                    </Col>
                    <Col span={24} sm={18}>
                      <Form.Item name="gender">
                        <Radio.Group onChange={onGenderChange} defaultValue={EnumGenderAccount.Female} value={gender}>
                          <Radio value={EnumGenderAccount.Female}>{translateData.female}</Radio>
                          <Radio value={EnumGenderAccount.Male}>{translateData.male}</Radio>
                          <Radio value={EnumGenderAccount.Other}>{translateData.other}</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col sm={24} xs={24} lg={24} className="personal-info-birthday">
                  <Space
                    direction="vertical"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Form.Item name="birthDay">
                      <DatePicker
                        suffixIcon={<CalendarIcon />}
                        className="fnb-date-picker w-100"
                        placement="topLeft"
                        format={DateFormat.DD_MM_YYYY}
                        placeholder={translateData.birthdayPlaceholder}
                      />
                    </Form.Item>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>

          <BCButton
            disabled={!isButtonVisible}
            htmlType="submit"
            className="account-info-save"
            themePageConfig={themePageConfig}
          >
            {translateData.register.toUpperCase()}
          </BCButton>
        </div>
      </Form>
    </div>
  );
}
