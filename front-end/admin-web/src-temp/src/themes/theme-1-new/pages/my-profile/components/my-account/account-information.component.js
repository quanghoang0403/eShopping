import { Button, Col, DatePicker, Form, Image, Input, Radio, Row, Select, message, notification } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import timezonePlugin from "dayjs/plugin/timezone";
import utcPlugin from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploading from "react-images-uploading";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import accountDataService from "../../../../../data-services/account-data-service";
import customerDataService from "../../../../../data-services/customer-data.service";
import { setUserInfo } from "../../../../../modules/session/session.actions";
import { useAppCtx } from "../../../../../providers/app.provider";
import { fileNameNormalize, jsonToFormData } from "../../../../../utils/helpers";
import { getStorage, localStorageKeys, setStorage } from "../../../../../utils/localStorage.helpers";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CameraIcon,
  CheckCircleIcon,
  EyeDisableIcon,
  EyeIcon,
  LockPassIcon,
} from "../../../../assets/icons.constants";
import { FnbInput } from "../../../../components/fnb-input/fnb-input.component";
import { EnumGenderAccount, passwordValidateCode } from "../../../../constants/enums";
import { PASSWORD_CHARACTER } from "../../../../constants/login.constants";
import { DateFormat, PHONE_NUMBER_REGEX } from "../../../../constants/string.constants";
import "./account-information.component.scss";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

export default function AccountInformationTheme1(props) {
  const { handleClickTitle, isCustomize, fontFamily, colorGroup } = props;
  const [form] = Form.useForm();
  const [formPass] = Form.useForm();
  const isMaxWidth990 = useMediaQuery({ maxWidth: 990 });
  const [t] = useTranslation();
  const [isExistPhoneNumber, setIsExistPhoneNumber] = useState(false);
  const [customerInformation, setCustomerInformation] = useState(null);
  const history = useHistory();
  const [profileImageURL, setProfileImageURL] = useState(
    JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.thumbnail,
  );
  const [isHasPassword, setIsHasPassword] = useState(false);
  const [isShowCreatePassword, setIsShowCreatePassword] = useState(false);
  const [isShowPasswordInvalidWarning, setIsShowPasswordInvalidWarning] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const { Toast } = useAppCtx();

  const translateData = {
    userProfile: t("myProfile.accountInfo.userProfile", "Thông tin tài khoản"),
    name: t("myProfile.accountInfo.name", "Tên"),
    familyName: t("myProfile.accountInfo.familyName", "Họ"),
    pleaseEnterYourName: t("myProfile.accountInfo.pleaseEnterYourName", "Vui lòng nhập tên của bạn"),
    enterYourName: t("myProfile.accountInfo.enterYourName", "Nhập tên của bạn"),
    enterFamilyName: t("myProfile.accountInfo.enterFamilyName", "Nhập họ của bạn"),
    phoneNumber: t("myProfile.accountInfo.phoneNumber", "Số điện thoại"),
    pleaseEnterPhoneNumber: t("loginPage.pleaseEnterPhoneNumber", "Vui lòng nhập số điện thoại"),
    validPhonePattern: t("myProfile.accountInfo.validPhonePattern", "Số điện thoại không hợp lệ"),
    existPhoneNumber: t(
      "myProfile.accountInfo.existPhoneNumber",
      "Số điện thoại bạn vừa nhập đã tồn tại. Vui lòng chọn số điện thoại khác",
    ),
    email: t("myProfile.accountInfo.email", "Email"),
    validEmailPattern: t("myProfile.accountInfo.validEmailPattern", "Email không có giá trị"),
    inputEmail: t("myProfile.accountInfo.inputEmail", "Nhập email của bạn"),
    birthday: t("myProfile.accountInfo.birthday", "Ngày sinh"),
    birthdayPlaceholder: t("myProfile.accountInfo.birthdayPlaceholder", "dd/mm/yyyy"),
    gender: t("myProfile.accountInfo.gender", "Giới tính"),
    male: t("myProfile.accountInfo.male", "Nam"),
    female: t("myProfile.accountInfo.female", "Nữ"),
    other: t("myProfile.accountInfo.other", "Khác"),
    update: t("myProfile.accountInfo.update", "Cập nhật"),
    saveChange: t("myProfile.accountInfo.saveChange", "Lưu thay đổi"),
    informationHasBeenUpdatedSuccessfully: t(
      "myProfile.accountInfo.informationHasBeenUpdatedSuccessfully",
      "Thông tin đã được cập nhật thành công!",
    ),
    changePassword: t("myProfile.accountInfo.changePassword", "Đổi mật khẩu"),
    enterCurrentPassword: t("myProfile.accountInfo.enterCurrentPassword", "Nhập mật khẩu hiện tại của bạn"),
    pleaseEnterNewPassword: t("myProfile.accountInfo.pleaseEnterNewPassword", "Vui lòng nhập mật khẩu mới của bạn"),
    pleaseEnterCurrentPassword: t(
      "myProfile.accountInfo.pleaseEnterCurrentPassword",
      "Vui lòng nhập mật khẩu hiện tại của bạn",
    ),
    currentPassword: t("myProfile.accountInfo.currentPassword", "Mật khẩu hiện tại"),
    newPassword: t("myProfile.accountInfo.newPassword", "Mật khẩu mới"),
    requiredCharacters: t("myProfile.accountInfo.requiredCharacters", "{{minPasswordChar}}+ ký tự", {
      minPasswordChar: PASSWORD_CHARACTER.minPasswordChar,
    }),
    passwordNotSetup: t("myProfile.accountInfo.passwordNotSetup", "Tài khoản của bạn chưa được thiết lập mật khẩu!"),
    setupPassword: t("myProfile.accountInfo.setupPassword", "Thiết lập mật khẩu"),
    cancel: t("myProfile.accountInfo.cancel", "Hủy"),
    minPasswordCharacter: t(
      "myProfile.accountInfo.minPasswordCharacter",
      "Mật khẩu quá ngắn (tối thiểu {{minPasswordChar}} ký tự)",
      { minPasswordChar: PASSWORD_CHARACTER.minPasswordChar },
    ),
    confirm: t("myProfile.accountInfo.confirm", "Xác nhận"),
    currentPassInvalid: t("myProfile.accountInfo.currentPassInvalid", "Mật khẩu hiện tại không đúng"),
    updatePassSuccess: t("myProfile.accountInfo.updatePassSuccess", "Mật khẩu đã được cập nhật thành công"),
    setupPassSucess: t("myProfile.accountInfo.setupPassSucess", "Mật khẩu đã được thiết lập thành công"),
    enterPassword: t("myProfile.accountInfo.enterPassword", "Vui lòng nhập mật khẩu"),
  };

  useEffect(() => {
    if (!isCustomize) {
      getCustomerInformation();
    }
  }, []);

  useEffect(() => {
    formPass.validateFields(["currentPassword"]);
  }, [isShowPasswordInvalidWarning]);

  const getCustomerInformation = async () => {
    const customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
    if (customerInfo) {
      setCustomerInformation(customerInfo);
      let birthDay = dayjs.utc(customerInfo?.birthday).local();
      form.setFieldsValue({
        accountId: customerInfo?.accountId,
        countryId: customerInfo?.countryId,
        countryCode: customerInfo?.countryCode,
        phoneCode: customerInfo?.phoneCode,
        email: customerInfo?.email,
        firstName: customerInfo?.firstName,
        lastName: customerInfo?.lastName,
        phoneNumber: customerInfo?.phoneNumber,
        birthDay: customerInfo?.birthday ? birthDay : null,
        gender: customerInfo?.gender,
      });
      setProfileImageURL(customerInfo?.thumbnail);
      setStorage(
        localStorageKeys.CUSTOMER_INFO,
        JSON.stringify({ ...customerInfo, thumbnail: customerInfo?.thumbnail }),
      );
      setIsHasPassword(customerInfo?.isHasPassword);
    } else {
      let res = await customerDataService.getCustomerInfoAsync();
      const customerInfo = res?.data;
      setCustomerInformation(customerInfo);
      form.setFieldsValue({
        accountId: customerInfo?.accountId,
        countryId: customerInfo?.countryId,
        countryCode: customerInfo?.countryCode,
        phoneCode: customerInfo?.phoneCode,
        email: customerInfo?.email,
        firstName: customerInfo?.firstName ? customerInfo?.firstName : customerInfo?.fullName,
        lastName: customerInfo?.lastName,
        phoneNumber: customerInfo?.phoneNumber,
        birthday: dayjs(customerInfo?.birthday),
        gender: customerInfo?.gender,
      });
    }
  };

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      let isExist = await checkExistPhoneNumber();
      if (isExist) {
        setIsExistPhoneNumber(isExist);
        return;
      }
      let newPhoneNumber = formatPhoneNumber(values.phoneNumber);
      let oldPhoneNumber = formatPhoneNumber(customerInformation.phoneNumber);
      if (newPhoneNumber !== oldPhoneNumber || values.phoneCode !== customerInformation.phoneCode) {
        history.push({
          pathname: "/login",
          state: { updateCustomerInfo: values },
        });
        //return to avoid asynchronous program calling the function below
        return;
      } else {
        form.setFieldValue("phoneNumber", customerInformation.phoneNumber);
      }
      const response = await customerDataService.updateCustomerProfile(values);

      if (response?.data?.isSuccess === true) {
        let customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
        try {
          const resCustomerInfo = await customerDataService.getCustomerInfoAsync();
          if (resCustomerInfo) {
            customerInfo = {
              ...customerInfo,
              email: resCustomerInfo?.data?.email,
              firstName: resCustomerInfo?.data?.firstName,
              lastName: resCustomerInfo?.data?.lastName,
              fullName: resCustomerInfo?.data?.firstName + " " + resCustomerInfo?.data?.lastName,
              phoneNumber: resCustomerInfo?.data?.phoneNumber,
              birthday: dayjs.utc(resCustomerInfo?.data?.birthday),
              gender: resCustomerInfo?.data?.gender,
            };
          }
        } catch (_error) {
          Toast.error({
            message: "Something went wrong while updating customer info!",
            placement: "top",
          });
        }

        setStorage(localStorageKeys.CUSTOMER_INFO, JSON.stringify(customerInfo));
        Toast.success({
          message: translateData.informationHasBeenUpdatedSuccessfully,
          placement: "top",
        });
        dispatch(setUserInfo(customerInfo));
      } else {
        Toast.error({
          message: response?.message,
          placement: "top",
        });
      }
    } catch (errors) {
      Toast.error({
        message: errors,
        placement: "top",
      });
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber?.startsWith("0") ? phoneNumber.substring(1) : phoneNumber;
  };

  const checkExistPhoneNumber = async () => {
    let data = {
      phoneCode: form.getFieldValue("phoneCode"),
      phoneNumber: form.getFieldValue("phoneNumber"),
    };
    let newPhoneNumber = formatPhoneNumber(data.phoneNumber);
    let oldPhoneNumber = formatPhoneNumber(customerInformation.phoneNumber);
    if (newPhoneNumber === oldPhoneNumber && data.phoneCode === customerInformation.phoneCode) {
      setIsExistPhoneNumber(false);
      return;
    }
    const isExist = await customerDataService.checkExistCustomerProfileAsync(data);
    if (isExist) {
      return isExist?.data.isExistCustomerProfile;
    }
  };

  const onUploadImage = async (imageList) => {
    // data for submit
    let buildFileName = moment(new Date()).format(DateFormat.YYYY_MM_DD_HH_MM_SS);
    if (imageList[0]) {
      const requestData = {
        file: imageList[0].file,
        fileName: fileNameNormalize(buildFileName),
      };
      const requestFormData = jsonToFormData(requestData);
      const res = await customerDataService.uploadCustomerAvatar(requestFormData);
      if (res) {
        setProfileImageURL(imageList[0].data_url);
        let customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
        setStorage(
          localStorageKeys.CUSTOMER_INFO,
          JSON.stringify({ ...customerInfo, thumbnail: imageList[0].data_url }),
        );
        Toast.success({
          message: "Update successfully!",
          placement: "top",
        });
      } else {
        message.error("response.message");
      }
    }
  };

  const uploadImageError = (errors, files) => {
    if (errors.maxFileSize === true) {
      Toast.error({
        message: "Image size too big",
        placement: "top",
      });
    }
  };

  const NoBackspaceInput = (e) => {
    setIsShowPasswordInvalidWarning(false);
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const onUpdatePassword = async () => {
    setIsShowPasswordInvalidWarning(false);
    try {
      const values = await formPass.validateFields();
      const updatePasswordRequest = {
        currentPassword: values?.currentPassword ?? "",
        newPassword: values?.newPassword ?? "",
      };
      const res = await accountDataService.updateAccountPasswordAsync(updatePasswordRequest);
      if (res) {
        if (res?.data.success) {
          if (updatePasswordRequest.currentPassword === "") {
            openNotification("bottom", translateData.setupPassSucess);
            setIsHasPassword(true);
            let customerInfoLS = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
            customerInfoLS = { ...customerInfoLS, isHasPassword: true };
            setStorage(localStorageKeys.CUSTOMER_INFO, JSON.stringify(customerInfoLS));
          } else {
            openNotification("bottom", translateData.updatePassSuccess);
          }

          clearPasswordForm();
        } else {
          if (res?.data?.errorCode === passwordValidateCode.invalidPassword) {
            setIsShowPasswordInvalidWarning(true);
          }
        }
      }
    } catch (errors) {
      Toast.error({
        message: errors,
        placement: "top",
      });
    }
  };

  const validatePassword = (rule, value) => {
    if (!isShowPasswordInvalidWarning) {
      return Promise.resolve();
    }
    return Promise.reject(translateData.currentPassInvalid);
  };

  const clearPasswordForm = () => {
    formPass.setFieldValue("currentPassword", "");
    formPass.setFieldValue("newPassword", "");
  };

  const openNotification = (placement, message) => {
    api.success({
      description: message,
      placement,
      closeIcon: false,
      className: "password-success-message",
      icon: <CheckCircleIcon></CheckCircleIcon>,
    });
  };

  const onCancelPass = () => {
    setIsShowCreatePassword(false);
    clearPasswordForm();
  };

  const StyledTitleHeading = styled.h3`
    color: ${colorGroup?.titleColor};
  `;

  const StyledPersonalInfo = styled.div`
    .ant-row .ant-col {
      color: ${colorGroup?.textColor};
    }
    .account-info-save,
    .password-info-save {
      background-color: ${colorGroup?.buttonBackgroundColor};
      color: ${colorGroup?.buttonTextColor};
      border: 1px solid ${colorGroup?.buttonBorderColor};
      &:hover {
        background-color: ${colorGroup?.buttonBackgroundColor};
        color: ${colorGroup?.buttonTextColor};
        border: 1px solid ${colorGroup?.buttonBorderColor};
      }
    }
  `;

  return (
    <>
      {contextHolder}
      <Form
        autoComplete="off"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 22,
        }}
        onFinish={onFinish}
        form={form}
        onFieldsChange={() => setIsExistPhoneNumber(false)}
      >
        <div className="account-information-theme1">
          {isMaxWidth990 ? (
            <a onClick={() => handleClickTitle()} className="arrow-left-title">
              <ArrowLeftIcon /> {translateData.userProfile}
            </a>
          ) : (
            <StyledTitleHeading className="acc-info">{translateData.userProfile}</StyledTitleHeading>
          )}
          <Row className="my-profile-account">
            <Col xxl={6} xl={6} sm={24}>
              <div className="my-profile-img">
                <ImageUploading onChange={onUploadImage} dataURLKey="data_url" onError={uploadImageError}>
                  {({ onImageUpload }) => {
                    return (
                      <>
                        <Image
                          preview={false}
                          src={profileImageURL ?? "/images/default-theme/avatar-profile-default.png"}
                        />
                        <CameraIcon
                          style={{
                            position: "absolute",
                            top: 20,
                            right: 15,
                          }}
                          onClick={onImageUpload}
                          className="camera-upload-img"
                        />
                      </>
                    );
                  }}
                </ImageUploading>
              </div>
            </Col>
            <Col xxl={18} xl={22}>
              <StyledPersonalInfo className="personal-info">
                <Row gutter={[0, 24]}>
                  <Col sm={24} xs={24} lg={6} className="info-title">
                    {translateData.name}
                  </Col>
                  <Col sm={24} xs={24} lg={18} className="personal-info-fullname">
                    <Form.Item hidden={true} name="accountId"></Form.Item>
                    <Form.Item
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: translateData.pleaseEnterYourName,
                        },
                        {
                          type: "string",
                          max: 20,
                        },
                        {
                          validator: (_, value) =>
                            value.replace(/\s/g, "").length === 0 && value.length > 0
                              ? Promise.reject(new Error(translateData.pleaseEnterYourName))
                              : Promise.resolve(),
                        },
                      ]}
                    >
                      <FnbInput
                        className="fnb-input-theme"
                        showCount
                        placeholder={translateData.enterYourName}
                        maxLength={20}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={6} className="info-title">
                    {translateData.familyName}
                  </Col>
                  <Col sm={24} xs={24} lg={18} className="personal-info-fullname">
                    <Form.Item
                      name="lastName"
                      rules={[
                        {
                          type: "string",
                          max: 20,
                        },
                      ]}
                    >
                      <FnbInput
                        className="fnb-input-theme"
                        showCount
                        placeholder={translateData.enterFamilyName}
                        maxLength={20}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={6} className="info-title">
                    {translateData.phoneNumber}
                  </Col>
                  <Col sm={24} xs={24} lg={18}>
                    <Row span={24} gutter={[16, 16]}>
                      <Col sm={7} xs={7} lg={4} className="personal-info-phone-code">
                        <Form.Item name="phoneCode">
                          <Select disabled={true}>
                            <Select.Option
                              value={customerInformation?.phoneCode}
                              label={"+" + customerInformation?.phoneCode}
                            >
                              <span>(+{customerInformation?.phoneCode})</span>
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col sm={17} xs={17} lg={20} className="personal-info-phone-number">
                        <Form.Item
                          name="phoneNumber"
                          rules={[
                            {
                              required: true,
                              message: t(translateData.pleaseEnterPhoneNumber),
                            },
                            {
                              pattern: PHONE_NUMBER_REGEX,
                              message: translateData.validPhonePattern,
                            },
                          ]}
                        >
                          <Input className="fnb-input-theme" maxLength={100} />
                        </Form.Item>
                      </Col>
                      {isExistPhoneNumber && <div className="exist-phone-code">{translateData.existPhoneNumber}</div>}
                    </Row>
                  </Col>
                  <Col sm={24} xs={24} lg={6} className="info-title">
                    {translateData.email}
                  </Col>
                  <Col sm={24} xs={24} lg={18} className="personal-info-email">
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: translateData.validEmailPattern,
                        },
                        {
                          type: "string",
                          max: 50,
                        },
                      ]}
                    >
                      <FnbInput
                        className="fnb-input-theme"
                        showCount
                        placeholder={translateData.inputEmail}
                        maxLength={50}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={6} className="info-title">
                    {translateData.birthday}
                  </Col>
                  <Col sm={24} xs={24} lg={18} className="personal-info-birth-day">
                    <Form.Item name="birthDay">
                      <DatePicker
                        suffixIcon={<CalendarIcon />}
                        className={`${isCustomize ? "fnb-date-picker" : "fnb-date-picker store-web"} w-100`}
                        format={DateFormat.DD_MM_YYYY}
                        placeholder={translateData.birthdayPlaceholder}
                        allowClear={false}
                        showToday={false}
                        style={{ fontFamily: fontFamily }}
                        onOpenChange={(isOpen) => {
                          // set font family for date picker dropdown content
                          if (isOpen) {
                            const element = document.querySelector(".ant-picker-dropdown");
                            if (element) {
                              element.style.fontFamily = fontFamily;
                            }
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={6} className="info-title">
                    {translateData.gender}
                  </Col>
                  <Col sm={24} xs={24} lg={18} className="personal-info-gender">
                    <Form.Item name="gender">
                      <Radio.Group defaultValue={isCustomize && EnumGenderAccount.Female}>
                        <Radio value={EnumGenderAccount.Male}>{translateData.male}</Radio>
                        <Radio value={EnumGenderAccount.Female}>{translateData.female}</Radio>
                        <Radio value={EnumGenderAccount.Other}>{translateData.other}</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Button
                  htmlType="submit"
                  className="account-info-save button-account-save-class"
                  disabled={isExistPhoneNumber}
                >
                  {translateData.saveChange}
                </Button>
              </StyledPersonalInfo>
            </Col>
          </Row>
        </div>
      </Form>

      <Form onFinish={onUpdatePassword} form={formPass} autoComplete="off" name="formChangePassword">
        <div className="account-information-theme1">
          {isMaxWidth990 ? (
            !isHasPassword ? (
              <span className="arrow-left-title change-pass-title">{translateData.setupPassword}</span>
            ) : (
              <span className="arrow-left-title change-pass-title">{translateData.changePassword}</span>
            )
          ) : (
            <>
              {!isHasPassword ? (
                <StyledTitleHeading className="acc-info acc-pass">{translateData.setupPassword}</StyledTitleHeading>
              ) : (
                <StyledTitleHeading className="acc-info acc-pass">{translateData.changePassword}</StyledTitleHeading>
              )}
            </>
          )}
          <Row className="my-profile-account">
            <Col xxl={6} xl={6} sm={24}></Col>
            <Col xxl={18} xl={22}>
              <StyledPersonalInfo className="personal-info">
                {/* Update password */}
                {isHasPassword && (
                  <div>
                    <Row gutter={[0, 24]}>
                      <Col sm={24} xs={24} lg={6} className="info-title">
                        {translateData.currentPassword}
                      </Col>
                      <Col sm={24} xs={24} lg={18} className="personal-info-fullname">
                        <Form.Item
                          name="currentPassword"
                          rules={[
                            {
                              required: true,
                              message: translateData.pleaseEnterCurrentPassword,
                            },
                            {
                              validator: validatePassword,
                            },
                          ]}
                        >
                          <Input.Password
                            className="fnb-input-pass"
                            placeholder={translateData.enterCurrentPassword}
                            iconRender={(visible) => (visible ? <EyeDisableIcon /> : <EyeIcon />)}
                            maxLength={PASSWORD_CHARACTER.maxPasswordChar}
                            onKeyDown={NoBackspaceInput}
                          />
                        </Form.Item>
                      </Col>
                      <Col sm={24} xs={24} lg={6} className="info-title">
                        {translateData.newPassword}
                      </Col>
                      <Col sm={24} xs={24} lg={18} className="personal-info-fullname">
                        <Form.Item
                          name="newPassword"
                          rules={[
                            {
                              required: true,
                              message: translateData.pleaseEnterNewPassword,
                            },
                            {
                              min: PASSWORD_CHARACTER.minPasswordChar,
                              message: translateData.minPasswordCharacter,
                            },
                          ]}
                        >
                          <Input.Password
                            className="fnb-input-pass"
                            placeholder={translateData.requiredCharacters}
                            iconRender={(visible) => (visible ? <EyeDisableIcon /> : <EyeIcon />)}
                            maxLength={PASSWORD_CHARACTER.maxPasswordChar}
                            onKeyDown={NoBackspaceInput}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="pass-action pass-action-password-info-save-theme1">
                      <Button htmlType="submit" className="password-info-save">
                        {translateData.update}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Create password */}
                {!isHasPassword && (
                  <div style={{ display: isShowCreatePassword ? "" : "none" }}>
                    <Row gutter={[16, 24]}>
                      <Col sm={24} xs={24} lg={6} className="info-title">
                        {translateData.newPassword}
                      </Col>
                      <Col sm={24} xs={24} lg={18} className="personal-info-fullname">
                        <Form.Item
                          name="newPassword"
                          rules={[
                            {
                              required: true,
                              message: translateData.enterPassword,
                            },
                            {
                              min: 6,
                              message: translateData.minPasswordCharacter,
                            },
                          ]}
                        >
                          <Input.Password
                            className="fnb-input-pass"
                            placeholder={translateData.requiredCharacters}
                            iconRender={(visible) => (visible ? <EyeDisableIcon /> : <EyeIcon />)}
                            maxLength={PASSWORD_CHARACTER.maxPasswordChar}
                            onKeyDown={NoBackspaceInput}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="pass-action" style={{ float: "right", textAlign: "right" }}>
                      <Button onClick={() => onCancelPass()} className="password-info-cancel">
                        {translateData.cancel}
                      </Button>
                      <Button htmlType="submit" className="password-info-save">
                        {translateData.confirm}
                      </Button>
                    </div>
                  </div>
                )}
              </StyledPersonalInfo>
            </Col>
          </Row>
          {!isHasPassword && (
            <div className="password-setup-container" style={{ display: isShowCreatePassword ? "none" : "" }}>
              <div className="password-setup">
                <LockPassIcon></LockPassIcon>
                <div className="password-not-setup">{translateData.passwordNotSetup}</div>
                <a className="setup-password-link" onClick={() => setIsShowCreatePassword(true)}>
                  <u>{translateData.setupPassword}</u>
                </a>
              </div>
            </div>
          )}
        </div>
      </Form>
    </>
  );
}
