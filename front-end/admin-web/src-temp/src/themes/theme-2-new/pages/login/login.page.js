import { CaretDownOutlined } from "@ant-design/icons";
import { Button, Form, Input, Row, Select, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useMediaQuery } from "react-responsive";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { ScrollHeaderType } from "../../../constants/enums";
import countryDataService from "../../../data-services/country-data.service";
import customerDataService from "../../../data-services/customer-data.service";
import loginDataService from "../../../data-services/login-data.service";
import storeDataService from "../../../data-services/store-data.service";
import { store } from "../../../modules";
import { qrOrderSelector } from "../../../modules/order/order.reducers";
import { setOrderInfo, setUserInfo } from "../../../modules/session/session.actions";
import { useAppCtx } from "../../../providers/app.provider";
import { logService } from "../../../services/log/log.service";
import { auth, firebase } from "../../../utils/firebase";
import { checkOnKeyPressValidation, getStoreConfig } from "../../../utils/helpers";
import { getStorage, localStorageKeys, removeStorage, setStorage } from "../../../utils/localStorage.helpers";
import { EyeOffIcon, EyeOpenIcon } from "../../assets/icons.constants";
import closeIcon from "../../assets/icons/close-circle-login-wrong.svg";
import loadingIcon from "../../assets/icons/loadingIcon.gif";
import lockIcon from "../../assets/icons/lock.svg";
import loginPhoneIcon from "../../assets/icons/login_phone.svg";
import { BCButton } from "../../components/BCButton";
import ConfirmationDialog from "../../components/confirmation-dialog/confirmation-dialog.component";
import { FnbInput } from "../../components/fnb-input/fnb-input.component";
import { FirebaseMessage } from "../../constants/firebase-message.constants";
import { EnumLogin, KEYBOARD } from "../../constants/login.constants";
import PageType from "../../constants/page-type.constants";
import { theme2ElementCustomize } from "../../constants/store-web-page.constants";
import { DateFormat, profileTab } from "../../constants/string.constant";
import defaultConfig from "../../default-store.config";
import Index from "../../index";
import FormRegisterAccount from "./components/FormRegisterAccount";
import { LoginFooter } from "./components/LoginFooter";
import { InputOTP } from "antd-input-otp";
import "./login.page.scss";

const { Option } = Select;
function LoginPage(props) {
  const { clickToFocusCustomize, isDefault, themePageConfig, fontFamily, colorGroups } = props;

  const { Toast } = useAppCtx();
  const { t } = useTranslation();
  const config = JSON.parse(getStorage("config"));
  const history = useHistory();
  const vnCode = "84";
  const [phone, setPhone] = useState(null);
  const [mode, setMode] = useState(window.location.pathname === "/register" ? EnumLogin.REGISTER : EnumLogin.LOGIN);
  const [error, setError] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [countries, setCountries] = useState([]);
  const [countryCode, setCountryCode] = useState(vnCode);
  const [userCountry, setUserCountry] = useState(vnCode);
  const [checkOTP, setCheckOTP] = useState(null);
  const [isEditPhone, setIsEditPhone] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const waitTime = 120;
  const dropDownWidth = isMobile ? "350px" : "410px";
  const errorStyle = error ? { borderColor: "red", borderWidth: 3 } : undefined;
  const [firebaseOTPLoading, setFirebaseOTPLoading] = useState(false);
  const [firebaseErrorMessage, setFirebaseErrorMessage] = useState(null);
  const [isShowModalDialog, setIsShowModalDialog] = useState(false);
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  const [registerLoading, setRegisterLoading] = useState(false);
  const location = useLocation();
  const [updateCustomerInfo, setUpdateCustomerInfo] = useState(null);
  const [isLoginByPassword, setIsLoginByPassword] = useState(true);
  const [showWrongPhone, setShowWrongPhone] = useState(false);
  const reduxQROrder = useSelector(qrOrderSelector);
  const defaultConfigLogin = defaultConfig?.pages.find((login) => login.id === PageType.LOGIN_PAGE);
  const dispatch = useDispatch();
  const currentOrderInfo = store.getState().session?.orderInfo;
  const token = getStorage(localStorageKeys.TOKEN);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegisterWithoutOTP, setIsRegisterWithoutOTP] = useState(false);
  const OTP_LENGTH = 6;

  useEffect(() => {
    if (token) {
      history.push("/home");
    }
    countryDataService
      .getCountryList()
      .then((response) => {
        setCountries(response.data);
        loadCurrentCountry(response.data);
      })
      .catch((err) => {
        setUserCountry(vnCode);
        setCountryCode(vnCode);
      });

    if (location && location?.state && location?.state?.updateCustomerInfo) {
      const updateCustomerInfo = location?.state?.updateCustomerInfo;
      setMode(EnumLogin.OTP);
      setUpdateCustomerInfo(updateCustomerInfo);
      setCountryCode(updateCustomerInfo.phoneCode);
      setPhone(updateCustomerInfo.phoneNumber);
    }
  }, []);

  useEffect(() => {
    if (updateCustomerInfo) {
      onFireBaseOTP();
    }
  }, [updateCustomerInfo]);

  useEffect(() => {
    if (!isResend) return;
    if (countDown === 0) setIsResend(false);
    let interval = setInterval(() => {
      setCountDown((x) => {
        x <= 1 && clearInterval(interval);
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countDown]);

  const pageData = {
    login: t("loginPage.login", "Login"),
    register: t("loginPage.register", "Register"),
    continue: t("loginPage.continue", "Continue"),
    phoneNumber: t("loginPage.phoneNumber", "Phone number"),
    enterPhoneNumber: t("loginPage.enterPhoneNumber", "Enter phone number"),
    placeHolder: t("loginPage.placeHolder", "Phone number"),
    verification: t("loginPage.verification", "Verification"),
    pleaseEnterPhoneNumber: t("loginPage.pleaseEnterPhoneNumber", "Please enter phone number"),
    otpSendToYourPhone: t("loginPage.otpSendToYourPhone", "An authenticated code has been send to phone number"),
    didNotReceiveOTP: t("loginPage.didNotReceiveOTP", "Didn’t you receive any code?"),
    reSend: t("loginPage.reSend", "Resend"),
    inValidCode: t("loginPage.inValidCode", "Incorrect validation code. Please try again"),
    notification: t("loginPage.notification", "Notification"),
    sendOTP: t("loginPage.sendOTP", "OTP is sent only every 2 minutes. Please try again later!"),
    iGotIt: t("loginPage.iGotIt", "I got it"),
    firebaseOtpExpired: t(
      "firebase.otpExpired",
      "The OTP code entered wrong many times, please re-send another OTP to try again",
    ),
    firebaseGeneralMessage: t(
      "firebase.generalMessage",
      "So sorry! Something went wrong with OTP service, please try again later",
    ),
    informationHasBeenUpdatedSuccessfully: t(
      "myProfile.accountInfo.informationHasBeenUpdatedSuccessfully",
      "Thông tin đã được cập nhật thành công!",
    ),
    loginByPhone: t("loginPage.loginByPhone", "Đăng nhập bằng điện thoại"),
    loginByAccount: t("loginPage.loginByAccount", "Đăng nhập bằng tài khoản"),
    loginByPassword: t("loginPage.loginByPassword", "Đăng nhập bằng mật khẩu"),
    loginByOTP: t("loginPage.loginByOTP", "Đăng nhập bằng OTP"),
    enterYourPhoneNumber: t("loginPage.enterYourPhoneNumber", "Nhập số điện thoại của bạn"),
    enterYourPassword: t("loginPage.enterYourPassword", "Nhập mật khẩu của bạn"),
    enterWrongPhoneOrPassword: t("loginPage.enterWrongPhoneOrPassword", "Xin lỗi, bạn đã nhập sai thông tin"),
    phoneNumberInValid: t("loginPage.phoneNumberInValid", "Só điện thoại không hợp lệ."),
  };

  useEffect(() => {
    if (window.location.pathname === "/register") {
      setIsLoginByPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  const loadCurrentCountry = (countryList) => {
    if (!clickToFocusCustomize && !isDefault) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const apiKey = storeDataService.getGoogleApiKeyByStoreID();
          const mapURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

          fetch(mapURL)
            .then((response) => response.json())
            .then(
              (data) => {
                if (!data?.results || data?.results.length === 0) {
                  setUserCountry(vnCode);
                  setCountryCode(vnCode);
                } else {
                  const address_components = data.results[0].address_components.slice(-1).pop();
                  const iso = address_components.short_name;
                  let phoneCode = countryList.find((c) => c.iso === iso)?.phonecode;
                  if (!phoneCode) phoneCode = vnCode;
                  setUserCountry(phoneCode);
                  setCountryCode(phoneCode);
                }
              },
              (error) => {
                console.log(error);
                setUserCountry(vnCode);
                setCountryCode(vnCode);
              },
            );
        },
        (err) => {
          console.log(err);
          setUserCountry(vnCode);
          setCountryCode(vnCode);
        },
      );
    } else {
      setUserCountry(vnCode);
      setCountryCode(vnCode);
    }
  };

  const onChangeCountry = (e) => {
    setCountryCode(e);
  };

  const onChangePhone = (e) => {
    setIsEditPhone(true);
    setPhone(e.target.value);
  };

  /**
   * Handle login and register
   */
  const handleClickLogin = () => {
    const phoneNumber = document.getElementById("txtPhone").value;
    const isValidPhoneNumber = checkValidPhone(phoneNumber);
    if (Boolean(phoneNumber) && isValidPhoneNumber) {
      setPhone(phoneNumber);

      if (mode === EnumLogin.REGISTER) {
        handleRegisterAccount(phoneNumber);
      }
    }
  };

  // Listen on change phone number
  useEffect(() => {
    if (phone) {
      const isValidPhoneNumber = checkValidPhone(phone);
      if (isValidPhoneNumber === false) {
        return;
      }

      if (mode === EnumLogin.LOGIN) {
        setMode(EnumLogin.OTP);
        onFireBaseOTP();
      }
    }
  }, [phone]);

  const checkValidPhone = (inputPhoneNumber) => {
    if (!Boolean(inputPhoneNumber)) {
      setErrorMessage(pageData.pleaseEnterPhoneNumber);
      return false;
    }

    if (!inputPhoneNumber || inputPhoneNumber.length < 9) {
      setErrorMessage(pageData.phoneNumberInValid);
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    setError(false);
    setStorage(localStorageKeys.LOGIN, JSON.stringify({ countryCode: countryCode, phone: phone }));
    const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
    const storeConfig = JSON.parse(jsonConfig);
    let data;

    if (form && mode === EnumLogin.INPUT_INFO) {
      data = {
        phoneNumber: phone,
        phoneCode: countryCode,
        storeId: storeConfig?.storeId,
        branchId: branchAddress?.id,
        ...form.getFieldsValue(),
        birthDay: form.getFieldValue("birthDay") ? form.getFieldValue("birthDay").format(DateFormat.YYYY_MM_DD) : null,
      };
    } else {
      data = {
        phoneNumber: phone,
        phoneCode: countryCode,
        storeId: storeConfig?.storeId,
        isOTP: true, // Login with OTP
      };
    }
    setRegisterLoading(true);

    const loginResponse = await loginDataService.loginForCustomerByPhoneNumber(data);
    if (loginResponse) {
      setFirebaseOTPLoading(false);
      if (form) {
        setRegisterLoading(false);
      }
      if (loginResponse?.data?.isSuccess) {
        handleLoginSuccess(loginResponse);
      } else {
        setError(true);
        setIsResend(false);
        setCountDown(0);
      }
    } else {
      setFirebaseOTPLoading(false);
    }
  };

  const handleLoginSuccess = (loginResponse, userName) => {
    setStorage(localStorageKeys.TOKEN, loginResponse?.data?.data?.token);
    setStorage(
      localStorageKeys.LOGIN,
      JSON.stringify({ ...loginResponse, countryCode: countryCode, phone: userName ? userName : phone }),
    );
    setStorage(localStorageKeys.CUSTOMER_INFO, JSON.stringify(loginResponse?.data?.data?.customerInfo));
    setError(false);
    setIsResend(false);
    setCountDown(0);
    setMode(EnumLogin.SUCCESS);

    // Save delivery info to redux
    const customerInfo = loginResponse?.data?.data?.customerInfo;
    const orderInfo = {
      ...currentOrderInfo,
      deliveryInfo: {
        ...currentOrderInfo?.deliveryInfo,
        customerId: customerInfo?.customerId,
        accountId: customerInfo?.accountId,
        phoneNumber: customerInfo?.phoneNumber,
      },
    };

    dispatch(setUserInfo(customerInfo));
    dispatch(setOrderInfo(orderInfo));

    const checkOutHomePage = getStorage(localStorageKeys.CHECK_OUT_HOME_PAGE);
    if (checkOutHomePage) {
      removeStorage(localStorageKeys.CHECK_OUT_HOME_PAGE);
      history.push("/checkout");
    }
    const checkoutScanQrCode = getStorage(localStorageKeys.CHECK_OUT_SCAN_QR_CODE);
    if (checkoutScanQrCode) {
      removeStorage(localStorageKeys.CHECK_OUT_SCAN_QR_CODE);
      history.push(`/pos-checkout?qrCodeId=${reduxQROrder?.qrCodeId}`);
    }

    const reservePageList = JSON.parse(getStorage(localStorageKeys.MY_ACCOUNT_STATE));
    if (reservePageList?.currentTab === profileTab.myReservation) {
      history.push({
        pathname: `/my-profile/${profileTab.myOrder}`,
        state: { orderId: reservePageList?.orderId ?? "" },
      });
      removeStorage(localStorageKeys.MY_ACCOUNT_STATE);
    }
  };

  const handleLoginWithPassword = async ({ userName, password }) => {
    if (!userName || userName.length < 9) {
      setShowWrongPhone(true);
      return false;
    }
    let phoneStartWithZero = userName?.startsWith("0");
    const modifiedUserName = phoneStartWithZero ? userName.substring(1) : userName;
    // TODO: Call api authenticate
    try {
      const response = await loginDataService.customerLoginAsync({ userName: modifiedUserName, password });
      if (response && response.data.isSuccess === true) {
        handleLoginSuccess(response, modifiedUserName);
      }
    } catch (errors) {
      setShowWrongPhone(true);
    }
  };

  const onClickResend = () => {
    onFireBaseOTP();
    setIsResend(true);
    setCountDown(waitTime);
    handleResetOTPInput();
  };

  const handleResetOTPInput = () => {
    if (otpForm) {
      otpForm.resetFields(); // Reset OTP input
    }
  };

  const onFireBaseOTP = () => {
    if (!phone) return;
    if (firebase === undefined || firebase === null) return;
    if (firebase.auth === undefined || firebase.auth === null) return;
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-login", {
          size: "invisible",
        });
      }
      auth
        .signInWithPhoneNumber("+" + countryCode + phone, window.recaptchaVerifier)
        .then((result) => {
          setCheckOTP(result);
        })
        .catch((err) => {
          console.log(err);
          handleResetOTPInput();
          if (err.message === FirebaseMessage.OTP_EXPIRED) {
            setFirebaseErrorMessage(pageData.firebaseOtpExpired);
          } else {
            if (err.message) {
              setFirebaseErrorMessage(pageData.firebaseGeneralMessage);
              writeFirebaseLog(err.message);
            }
          }
          updateCustomerInfo ? history.push("/my-profile") : setMode(EnumLogin.LOGIN);
        });
    } catch (err) {
      if (err.message === FirebaseMessage.OTP_EXPIRED) {
        setFirebaseErrorMessage(pageData.firebaseOtpExpired);
      } else {
        if (err.message) {
          setFirebaseErrorMessage(pageData.firebaseGeneralMessage);
          writeFirebaseLog(err.message);
        }
      }
      updateCustomerInfo ? history.push("/my-profile") : setMode(EnumLogin.LOGIN);
    }
  };

  const handleRegisterAccount = async (phoneNumber) => {
    const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
    const storeConfig = JSON.parse(jsonConfig);
    let data = {
      phoneNumber: phoneNumber,
      phoneCode: countryCode,
      storeId: storeConfig?.storeId,
    };
    const response = await loginDataService.fetchExistsAccountAndCustomerByPhoneAsync(data);
    const { isExists } = response.data;
    if (isExists === true) {
      if (mode !== EnumLogin.REGISTER) {
        handleLogin();
      } else {
        Toast.warning({
          message: t("loginPage.accountAlreadyExisted"),
        });
      }
    } else {
      if (mode === EnumLogin.OTP) {
        setIsRegisterWithoutOTP(true);
      }
      setMode(EnumLogin.INPUT_INFO); // display register account form
      window.history.pushState(window.history.state, null, "/register");
      setTimeout(() => {
        const elementFormRegister = document.getElementById("id-form-input-info-account");
        const elementFormRegisterWrapper = document.getElementById("id-form-info-account-wapper");
        if (
          elementFormRegister &&
          elementFormRegisterWrapper &&
          window.innerHeight - 24 > elementFormRegister?.offsetHeight &&
          config?.general?.header?.scrollType === ScrollHeaderType.SCROLL
        ) {
          elementFormRegisterWrapper.scrollIntoView();
        }
      }, 100);
    }
  };

  const handleUpdateCustomerInfo = async () => {
    if (updateCustomerInfo) {
      try {
        const response = await customerDataService.updateCustomerProfile(updateCustomerInfo);
        if (response?.data?.isSuccess === true) {
          let customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
          setStorage(
            localStorageKeys.CUSTOMER_INFO,
            JSON.stringify({ ...customerInfo, fullName: updateCustomerInfo?.fullName }),
          );
          let loginInfo = JSON.parse(getStorage(localStorageKeys.LOGIN));
          setStorage(localStorageKeys.LOGIN, JSON.stringify({ ...loginInfo, countryCode: countryCode, phone: phone }));
          history.push("/my-profile");
          Toast.success({
            message: pageData.informationHasBeenUpdatedSuccessfully,
            placement: "top",
          });
        } else {
          Toast.error({
            message: t(response.message),
            placement: "top",
          });
        }
      } catch (errors) {
        Toast.error({
          message: errors,
          placement: "top",
        });
      }
    }
  };

  const handleConfirmSMSVerificationCode = (otp) => {
    if (!otp || otp.length < 6) return;

    if (checkOTP === undefined || checkOTP === null) {
      return;
    }

    try {
      checkOTP
      ?.confirm(otp)
      .then((result) => {
        setFirebaseOTPLoading(true);
        handleUserInfoAfterOTPVerified(phone);
      })
      .catch((err) => {
        console.log(err);
        setFirebaseOTPLoading(false);
        handleResetOTPInput();
        if (err.message === FirebaseMessage.OTP_EXPIRED) {
          setFirebaseErrorMessage(pageData.firebaseOtpExpired);
        } else {
          if (err.message) {
            setFirebaseErrorMessage(pageData.firebaseGeneralMessage);
            writeFirebaseLog(err.message);
          }
        }
        setError(true);
        if (updateCustomerInfo != null) {
          return;
        }
        removeStorage(localStorageKeys.LOGIN);
      });
    } catch(err) {
      setFirebaseOTPLoading(false);
      handleResetOTPInput();
    }
  };

  const handleUserInfoAfterOTPVerified = (phoneNumber) => {
    if (updateCustomerInfo) {
      handleUpdateCustomerInfo();
    } else {
      handleRegisterAccount(phoneNumber);
    }
  };

  const writeFirebaseLog = (message) => {
    const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
    const storeConfig = JSON.parse(jsonConfig);
    const logInfo = { storeID: storeConfig?.storeId, message: message };
    logService.trackTrace("[OTP LOG] " + JSON.stringify(logInfo));
  };

  const onChangeOtpInput = () => {
    const values = otpForm.getFieldsValue();
    if (values?.otp && values?.otp.length === OTP_LENGTH) {
      const otpValues = values?.otp;
      const otpString = otpValues.join("");
      handleConfirmSMSVerificationCode(otpString);
    }
  };

  const countryOptions =
    countries?.length > 0
      ? countries
          ?.sort((a, b) => (a.nicename > b.nicename ? 1 : -1))
          .filter((c) => c.nicename)
          .map((country, index) => {
            return (
              <Option key={index} value={country.phonecode} label={"+" + country.phonecode}>
                <div className="demo-option-label-item">
                  <span style={{ fontWeight: 700 }}>(+{country.phonecode})</span>
                  &nbsp;
                  <span style={{ fontWeight: 400 }}>{country.nicename}</span>
                </div>
              </Option>
            );
          })
      : [];

  const backgroundImage = themePageConfig?.backgroundImage ?? defaultConfigLogin?.config?.backgroundImage;
  const backgroundColor = themePageConfig?.backgroundColor;
  const backgroundType = themePageConfig?.backgroundType;
  const colorGroup = themePageConfig?.colorGroup;

  let detailStyle =
    backgroundType === 1
      ? {
          background: backgroundColor,
        }
      : {
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        };

  const handleOTPBack = () => {
    if (updateCustomerInfo) {
      history.push("/my-profile");
    } else {
      setMode(EnumLogin.LOGIN);
      setFirebaseErrorMessage(null);
      setError(false);
    }
  };

  const items = [
    {
      key: "1",
      label: pageData.loginByPassword,
    },
    {
      key: "2",
      label: pageData.loginByOTP,
    },
  ];

  const handleChangeLoginMode = () => {
    setShowWrongPhone(false);
    setIsLoginByPassword(!isLoginByPassword);
  };

  const StyledLogin = styled.div`
    .tab-login-account-theme2 {
      .ant-tabs-nav {
        .ant-tabs-nav-wrap {
          .ant-tabs-nav-list {
            .ant-tabs-tab-active {
              color: ${colorGroup?.buttonBackgroundColor};
              .ant-tabs-tab-btn {
                color: ${colorGroup?.buttonBackgroundColor};
              }
            }
            .ant-tabs-tab {
              .ant-tabs-tab-btn:hover {
                color: ${colorGroup?.buttonBackgroundColor};
              }
            }
            .ant-tabs-ink-bar {
              border-bottom: 3px solid ${colorGroup?.buttonBackgroundColor};
            }
          }
        }
      }
    }
  `;

  function handleToggleLoginAndRegisterForm() {
    const currentState = window.history.state;
    if (mode === EnumLogin.LOGIN) {
      setMode(EnumLogin.REGISTER);
      setIsLoginByPassword(false);
      window.history.pushState(currentState, null, "/register");
    } else {
      setMode(EnumLogin.LOGIN);
      setIsLoginByPassword(true);
      window.history.pushState(currentState, null, "/login");
    }
  }

  // Login succeed
  if (mode === EnumLogin.SUCCESS) {
    history.push("/");
  }

  // Login OTP form
  if (mode === EnumLogin.LOGIN || mode === EnumLogin.REGISTER) {
    if (isLoginByPassword) {
      return (
        <div
          style={detailStyle}
          className="login-page-wrapper"
          onClick={() => {
            if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.LoginPage);
          }}
        >
          <div className="login-page-container-theme2 ">
            <div className="login_page_theme2">
              <div className="login_title login-page-title" style={{ color: colorGroup?.titleColor }}>
                {mode === EnumLogin.LOGIN ? t(pageData.login) : t(pageData.register)}
              </div>
              {mode === EnumLogin.LOGIN && (
                <StyledLogin>
                  <Tabs
                    className="tab-login-account-theme2"
                    defaultActiveKey="1"
                    items={items}
                    onChange={handleChangeLoginMode}
                    style={{ fontFamily: fontFamily }}
                  />
                </StyledLogin>
              )}

              {showWrongPhone && (
                <div className="wrong-phone-or-password">
                  <span className="wrong-phone-or-password-text">
                    <img className="close_icon" src={closeIcon} alt="" />
                    <span className="wrong-phone-or-password-text-theme2">{pageData.enterWrongPhoneOrPassword}</span>
                  </span>
                </div>
              )}
              <div className="login_detail">
                <div className="login-by-account">
                  <img className="login_phone_icon" src={loginPhoneIcon} alt="" />
                  <Select
                    className="login_country"
                    popupClassName="login_country_popup"
                    onChange={onChangeCountry}
                    dropdownStyle={{ minWidth: dropDownWidth }}
                    suffixIcon={<CaretDownOutlined style={{ color: "#292D32" }} />}
                    defaultValue={{ value: userCountry, label: `+${userCountry}` }}
                    optionLabelProp="label"
                    bordered={false}
                  >
                    {countryOptions}
                  </Select>
                </div>
                <Form onFinish={handleLoginWithPassword} className="bc-form">
                  <Form.Item
                    name="userName"
                    rules={[
                      {
                        required: true,
                        message: pageData.enterYourPhoneNumber,
                      },
                    ]}
                    className="validate-password-theme2"
                  >
                    <FnbInput
                      autoFocus={true}
                      allowClear={true}
                      className="login_phone"
                      placeholder={pageData.enterYourPhoneNumber}
                    />
                  </Form.Item>
                  <img className="lock_icon" src={lockIcon} alt="" />
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        min: 6,
                        required: true,
                        message: pageData.enterYourPassword,
                      },
                    ]}
                    className="validate-phone-theme2"
                  >
                    <Input.Password
                      className="fnb-input-theme input-password-theme2"
                      placeholder={pageData.enterYourPassword}
                      iconRender={(visible) =>
                        visible ? (
                          <div style={{ cursor: "pointer" }}>
                            <EyeOpenIcon />
                          </div>
                        ) : (
                          <div style={{ cursor: "pointer" }}>
                            <EyeOffIcon />
                          </div>
                        )
                      }
                    />
                  </Form.Item>
                  <div className="login_button_box">
                    <BCButton
                      htmlType="submit"
                      className="login_button login-page-btn"
                      themePageConfig={themePageConfig}
                    >
                      {t("loginPage.login", "Đăng nhập")}
                    </BCButton>
                  </div>

                  <Row>
                    <LoginFooter
                      onClick={handleToggleLoginAndRegisterForm}
                      isLoginForm={mode === EnumLogin.LOGIN}
                      themePageConfig={themePageConfig}
                    />
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        style={detailStyle}
        className="login-page-wrapper"
        onClick={() => {
          if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.LoginPage);
        }}
      >
        <div className="login-page-container-theme2 ">
          <div className="login_page_theme2">
            <div className="login_title login-page-title" style={{ color: colorGroup?.titleColor }}>
              {mode === EnumLogin.LOGIN ? t(pageData.login) : t(pageData.register)}
            </div>

            {mode === EnumLogin.LOGIN && (
              <StyledLogin>
                <Tabs
                  className="tab-login-account-theme2"
                  defaultActiveKey="2"
                  items={items}
                  onChange={handleChangeLoginMode}
                  style={{ fontFamily: fontFamily }}
                />
              </StyledLogin>
            )}

            <div className="login_detail bc-form">
              <img className="login_phone_icon" src={loginPhoneIcon} alt="" />
              <Select
                className="login_country"
                popupClassName="login_country_popup"
                onChange={onChangeCountry}
                dropdownStyle={{ minWidth: dropDownWidth }}
                suffixIcon={<CaretDownOutlined style={{ color: "#292D32" }} />}
                defaultValue={{ value: userCountry, label: `+${userCountry}` }}
                optionLabelProp="label"
                bordered={false}
              >
                {countryOptions}
              </Select>
              <Input
                id="txtPhone"
                className="login_phone"
                maxLength={15}
                autoFocus={true}
                allowClear={true}
                placeholder={pageData.enterPhoneNumber}
                defaultValue={phone}
                onKeyDown={(event) => {
                  setErrorMessage("");
                  const phoneNumber = event.target.value;
                  if (event.key === KEYBOARD.ENTER && checkValidPhone(phoneNumber)) {
                    handleClickLogin();
                    return;
                  }
                  const checkValidKey = checkOnKeyPressValidation(event, "txtPhone", 0, null, 0);
                  if (!checkValidKey && event.key != "Delete" && event.key != "Del" && event.key != "Backspace") {
                    event.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  const pasteData = e?.clipboardData?.getData("Text");
                  //Only allow number only
                  if (!pasteData || isNaN(pasteData)) {
                    e.preventDefault();
                    return false;
                  }
                  return true;
                }}
                inputMode="tel"
              />
            </div>
            {Boolean(errorMessage) && !config?.customizeTheme && (
              <div className="login_phone_error">{errorMessage}</div>
            )}
            {firebaseErrorMessage && <div className="login_firebase_error">{firebaseErrorMessage}</div>}
            <div className="login_button_box">
              <BCButton
                htmlType="button"
                className="login_button login-page-btn"
                onClick={handleClickLogin}
                themePageConfig={themePageConfig}
              >
                {mode === EnumLogin.LOGIN ? t(pageData.login) : t(pageData.continue)}
              </BCButton>
            </div>

            <Row>
              <LoginFooter
                onClick={handleToggleLoginAndRegisterForm}
                isLoginForm={mode === EnumLogin.LOGIN}
                themePageConfig={themePageConfig}
              />
            </Row>
          </div>
        </div>
      </div>
    );
  }

  if (mode === EnumLogin.INPUT_INFO) {
    return (
      <FormRegisterAccount
        isRegisterWithoutOTP={isRegisterWithoutOTP}
        themePageConfig={themePageConfig}
        onLogin={handleLogin}
        form={form}
        registerLoading={registerLoading}
      />
    );
  }

  // Mode = OTP
  if (mode === EnumLogin.OTP) {
    return (
      <>
        <ConfirmationDialog
          open={isShowModalDialog}
          onCancel={() => {
            setIsShowModalDialog(false);
          }}
          onConfirm={() => {
            setIsShowModalDialog(false);
          }}
          confirmLoading={false}
          className="checkout-theme2-notify-dialog"
          content={pageData.sendOTP}
          footer={[
            <Button
              className="ant-btn-primary btn-got-it"
              onClick={() => {
                handleOTPBack();
              }}
            >
              {pageData.iGotIt}
            </Button>,
          ]}
        />
        <Form form={otpForm} onChange={onChangeOtpInput}>
          <div style={detailStyle} className="login-page-container-theme2">
            <div className="login_page_theme2">
              {firebaseOTPLoading && (
                <div className="loading-overlay">
                  <img src={loadingIcon} alt="" width={64} className="loading" />
                </div>
              )}
              <div className="login_otp_title1">{pageData.verification}</div>
              <div className="login_otp_title2">{pageData.otpSendToYourPhone}</div>
              <div className="login_otp_title3">
                (+{countryCode}){phone}
              </div>
              <div className="login_otp_numbers">
                <Form.Item
                  name="otp"
                  className="center-error-message"
                  rules={[{ validator: async () => Promise.resolve() }]}
                >
                  <InputOTP autoFocus inputType="numeric" length={OTP_LENGTH} />
                </Form.Item>
              </div>
              {(error || firebaseErrorMessage) && (
                <div className="login_otp_error">{firebaseErrorMessage ?? pageData.inValidCode}</div>
              )}
              {isResend && (
                <div
                  className="login_otp_resend2"
                  onClick={() => {
                    setIsShowModalDialog(true);
                  }}
                >
                  {pageData.reSend} {countDown}'s
                </div>
              )}
              {!isResend && <div className="login_otp_resend_title">{pageData.didNotReceiveOTP}</div>}
              {!isResend && (
                <div className="login_otp_resend1" onClick={onClickResend}>
                  {pageData.reSend}
                </div>
              )}
              {!isResend && (
                <div className="login_button_resend_box">
                  <BCButton onClick={onClickResend} htmlType="button" className="login_button_resend" themePageConfig={themePageConfig}>
                    {pageData.reSend}
                  </BCButton>
                </div>
              )}
              <div className="login_otp_footer"></div>
            </div>
          </div>
        </Form>
      </>
    );
  }
}

export default function Theme2Login(props) {
  const storeConfig = getStoreConfig();
  const pageStyle = storeConfig?.pages?.find((page) => page.id === PageType.LOGIN_PAGE);
  const colorGroup = storeConfig?.general?.color?.colorGroups?.find(
    (colorGroup) => colorGroup?.id === pageStyle?.config?.colorGroupId,
  );
  let themePageConfig = {
    ...pageStyle?.config,
    colorGroup,
  };
  return (
    <Index
      {...props}
      contentPage={(_props) => {
        if (props.isCustomize) {
          themePageConfig = _props?.config;
        }
        return (
          <LoginPage
            {..._props}
            clickToFocusCustomize={props?.clickToFocusCustomize}
            themePageConfig={themePageConfig}
            colorGroups={_props?.general?.color?.colorGroups}
            isDefault={props?.isDefault}
            pageId={props?.id}
          />
        );
      }}
    />
  );
}
