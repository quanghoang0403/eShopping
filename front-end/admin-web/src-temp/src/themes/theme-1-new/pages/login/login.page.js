import { Button, Col, Form, Input, message, Row, Select, Typography } from "antd";
import { InputOTP } from "antd-input-otp";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useMediaQuery } from "react-responsive";
import { useHistory, useLocation } from "react-router-dom";
import customerDataService from "../../../data-services/customer-data.service";
import loginDataService from "../../../data-services/login-data.service";
import storeDataService from "../../../data-services/store-data.service";
import { store } from "../../../modules";
import { setOrderInfo, setUserInfo } from "../../../modules/session/session.actions";
import { useAppCtx } from "../../../providers/app.provider";
import { getCountriesAsync } from "../../../services/addressServices";
import {
  confirmSMSVerificationCode,
  signInWithPhoneNumber,
  writeFirebaseLog,
} from "../../../services/auth/auth.services";
import { getStoreConfig } from "../../../utils/helpers";
import { getStorage, localStorageKeys, removeStorage, setStorage } from "../../../utils/localStorage.helpers";
import { EyeOffThinIcon, EyeOpenThinIcon } from "../../assets/icons.constants";
import back from "../../assets/icons/back.svg";
import loadingIcon from "../../assets/icons/loadingIcon.gif";
import { BCButton } from "../../components/BCButton";
import { FirebaseMessage } from "../../constants/firebase-message.constants";
import { EnumLogin } from "../../constants/login.constants";
import PageType from "../../constants/page-type.constants";
import { DateFormat } from "../../constants/string.constants";
import defaultConfig from "../../default-store.config";
import Index from "../../index";
import "./bc-login-form.scss";
import AccountInformationForm from "./components/form-input-information.component";
import LoginError from "./components/LoginError";
import "./login.otp.page.scss";
import "./login.page.scss";
import { ScrollHeaderType } from "../../../constants/enums";
const { Option } = Select;

function LoginPage(props) {
  const { config: themePageConfig, clickToFocusCustomize, isDefault, isCustomize } = props;
  const { Toast } = useAppCtx();
  const OTP_LENGTH = 6;
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const vnCode = "84";
  const waitTime = 120;
  const [phone, setPhone] = useState(null);
  const [mode, setMode] = useState(window.location.pathname === "/register" ? EnumLogin.REGISTER : EnumLogin.LOGIN);
  const [error, setError] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [countries, setCountries] = useState([]);
  const [countryCode, setCountryCode] = useState(vnCode);
  const [userCountry, setUserCountry] = useState(vnCode);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const dropDownWidth = isMobile ? "350px" : "410px";
  const [firebaseOTPLoading, setFirebaseOTPLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [firebaseErrorMessage, setFirebaseErrorMessage] = useState(null);
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [loginForm] = Form.useForm();
  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  const location = useLocation();
  const [updateCustomerInfo, setUpdateCustomerInfo] = useState(null);
  const currentOrderInfo = store.getState().session?.orderInfo;
  const [isLoginByPassword, setIsLoginByPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterWithoutOTP, setIsRegisterWithoutOTP] = useState(false);
  const token = getStorage(localStorageKeys.TOKEN);
  const config = getStoreConfig();

  useEffect(() => {
    if (token) {
      history.push("/home");
    }
    async function fetchData() {
      const countries = await getCountriesAsync();
      setCountries(countries);
      loadCurrentCountry(countries);
      setUserCountry(vnCode);
      setCountryCode(vnCode);
    }
    fetchData();

    if (location && location?.state && location?.state?.updateCustomerInfo) {
      const updateCustomerInfo = location?.state?.updateCustomerInfo;
      setMode(EnumLogin.OTP);
      setUpdateCustomerInfo(updateCustomerInfo);
      setCountryCode(updateCustomerInfo.phoneCode);
      setPhone(updateCustomerInfo.phoneNumber);
    }
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/register") {
      setIsLoginByPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  useEffect(() => {
    if (updateCustomerInfo) {
      onFirebaseOTPAsync(phone);
    }
  }, [updateCustomerInfo, phone]);

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

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [isLoginByPassword]);

  const pageData = {
    login: t("loginPage.login", "Login"),
    inputYourPassword: t("loginPage.inputYourPassword", "Input your Password"),
    phoneNumber: t("loginPage.phoneNumber", "Phone number"),
    placeHolder: t("loginPage.placeHolder", "Phone number"),
    verification: t("loginPage.verification", "Verification"),
    invalidPhoneNumber: t("loginPage.invalidPhoneNumber", "Invalid phone number"),
    invalidPassword: t("loginPage.invalidPassword", "Invalid password"),
    pleaseEnterPhoneNumber: t("loginPage.pleaseEnterPhoneNumber", "Please enter phone number"),
    pleaseEnterPassword: t("loginPage.pleaseEnterPassword", "Please enter phone number"),
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
    loginByPhone: t("loginPage.loginByPhone", "Login by Phone"),
    loginByPassword: t("loginPage.loginByPassword", "Login by Password"),
    textWrongPhoneAndPassword: t(
      "loginPage.textWrongPhoneAndPassword",
      "Sorry, you entered the wrong phone or password",
    ),
  };

  const customStyles = useMemo(() => {
    const isBackgroundColor = themePageConfig?.backgroundType === 1;
    if (isBackgroundColor) {
      return {
        background: themePageConfig?.backgroundColor,
      };
    }
    return {
      backgroundImage: "url(" + themePageConfig?.backgroundImage + ")",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    };
  }, [themePageConfig]);

  const loadCurrentCountry = (countryList) => {
    if (!clickToFocusCustomize && !isDefault) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          storeDataService.getGoogleApiKeyByStoreID().then((data) => {
            const apiKey = data?.data?.googleApiKey;
            if (!apiKey) {
              setUserCountry(vnCode);
              setCountryCode(vnCode);
              return;
            }
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
          });
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

  function redirectToAfterLogin() {
    const pathRedirectToAfterLogin = history?.location?.state?.redirectToAfterLogin;
    if (pathRedirectToAfterLogin) {
      history.push(pathRedirectToAfterLogin);
    }
  }

  const onLoginAsync = async () => {
    setError(false);
    //Verify OTP successfully
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
        email: form.getFieldValue("email"),
        gender: form.getFieldValue("gender"),
        firstName: form.getFieldValue("firstName"),
        lastName: form.getFieldValue("lastName"),
        birthDay: form.getFieldValue("birthDay") ? form.getFieldValue("birthDay").format(DateFormat.YYYY_MM_DD) : null,
        password: form.getFieldValue("password"),
      };
    } else {
      data = {
        phoneNumber: phone,
        phoneCode: countryCode,
        storeId: storeConfig?.storeId,
        isOTP: true,
      };
    }
    setRegisterLoading(true);
    try {
      const res = await loginDataService.loginForCustomerByPhoneNumber(data);
      setFirebaseOTPLoading(false);
      if (form) {
        setRegisterLoading(false);
      }
      if (res?.data?.isSuccess) {
        setStorage(localStorageKeys.TOKEN, res?.data?.data?.token);
        setStorage(localStorageKeys.CUSTOMER_INFO, JSON.stringify(res?.data?.data?.customerInfo));
        setError(false);
        setIsResend(false);
        setCountDown(0);
        setMode(EnumLogin.SUCCESS);

        // Save delivery info to redux
        const customerInfo = res?.data?.data?.customerInfo;
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
        redirectToAfterLogin();
      } else {
        setError(true);
        setIsResend(false);
        setCountDown(0);
      }
    } catch (err) {
      setFirebaseOTPLoading(false);
      console.log(err);
      Toast.error({
        message: err.message,
        placement: "top",
      });
    }
  };

  const handleUpdateCustomerInfo = async () => {
    if (updateCustomerInfo) {
      try {
        const response = await customerDataService.updateCustomerProfile(updateCustomerInfo);
        if (response?.data?.isSuccess === true) {
          let customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
          let newCustomerInfo = { ...customerInfo, ...updateCustomerInfo };
          setStorage(localStorageKeys.CUSTOMER_INFO, JSON.stringify(newCustomerInfo));
          dispatch(setUserInfo(newCustomerInfo));
          let loginInfo = JSON.parse(getStorage(localStorageKeys.LOGIN));
          setStorage(localStorageKeys.LOGIN, JSON.stringify({ ...loginInfo, countryCode: countryCode, phone: phone }));
          history.push("/my-profile");
          Toast.success({
            message: pageData.informationHasBeenUpdatedSuccessfully,
            placement: "top",
          });
        } else {
          message.error("response.message");
        }
      } catch (errors) {
        Toast.error({
          message: errors,
          placement: "top",
        });
      }
    }
  };

  const loginClick = async () => {
    if (loginForm) {
      const values = await loginForm.validateFields();
      const { phoneNumber, password } = values;
      let phoneStartWithZero = phoneNumber.startsWith("0");
      setPhone(phoneNumber);
      if (isLoginByPassword && phoneNumber && password) {
        setIsLoading(true);
        loginDataService
          .customerLoginAsync({ userName: phoneStartWithZero ? phoneNumber?.substring(1) : phoneNumber, password })
          .then((res) => {
            if (res?.data?.isSuccess) {
              setError(false);
              //Verify OTP successfully
              setStorage(
                localStorageKeys.LOGIN,
                JSON.stringify({
                  countryCode: countryCode,
                  phone: phoneStartWithZero ? phoneNumber?.substring(1) : phoneNumber,
                }),
              );
              setStorage(localStorageKeys.TOKEN, res?.data?.data?.token);
              setStorage(localStorageKeys.CUSTOMER_INFO, JSON.stringify(res?.data?.data?.customerInfo));
              setError(false);
              setIsResend(false);
              setCountDown(0);
              setMode(EnumLogin.SUCCESS);

              // Save delivery info to redux
              const customerInfo = res?.data?.data?.customerInfo;
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
              redirectToAfterLogin();
            }
          })
          .catch((err) => {
            setErrorMessage(pageData.textWrongPhoneAndPassword);
            setIsLoading(false);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        if (mode !== EnumLogin.REGISTER) {
          await onFirebaseOTPAsync(phoneNumber);
          setMode(EnumLogin.OTP);
        } else {
          await checkAccoutRegisterNotYet(phoneNumber);
        }
      }
    }
  };

  const onClickResend = () => {
    onFirebaseOTPAsync(phone);
    setIsResend(true);
    setCountDown(waitTime);
  };

  const onFirebaseOTPAsync = async (phoneNumber) => {
    if (!phoneNumber) return;
    const fullPhoneNumber = "+" + countryCode + phoneNumber;
    signInWithPhoneNumber(fullPhoneNumber, ({ success, data, message }) => {
      if (success) {
        // TODO: handle after send SMS success
      } else {
        if (message === FirebaseMessage.OTP_EXPIRED) {
          setFirebaseErrorMessage(pageData.firebaseOtpExpired);
        } else {
          if (message) {
            setFirebaseErrorMessage(pageData.firebaseGeneralMessage);
            writeFirebaseLog(message);
          }
        }
        updateCustomerInfo ? history.push("/my-profile") : setMode(EnumLogin.LOGIN);
      }
    });
  };

  const checkAccoutRegisterNotYet = async (phoneNumber) => {
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
        await onLoginAsync();
      } else {
        Toast.warning({
          message: t("loginPage.accountAlreadyExisted"),
        });
      }
    } else {
      if (mode === EnumLogin.OTP) {
        setIsRegisterWithoutOTP(true);
      }
      setMode(EnumLogin.INPUT_INFO);
      window.history.pushState(window.history.state, null, "/register");
      setTimeout(() => {
        const elementFormRegister = document.getElementById("id-form-input-info-account");
        const elementFormRegisterWrapper = document.getElementById("id-register-container");
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

  const handleConfirmSMSVerificationCode = (otpValues) => {
    if (!otpValues || otpValues.length < 6) return;
    setFirebaseOTPLoading(true);

    confirmSMSVerificationCode(otpValues, ({ success, data, message }) => {
      if (success) {
        updateCustomerInfo ? handleUpdateCustomerInfo() : checkAccoutRegisterNotYet(phone);
      } else {
        if (otpForm) {
          otpForm.resetFields(); // Reset OTP input
        }
        setFirebaseOTPLoading(false);

        if (message === FirebaseMessage.OTP_EXPIRED) {
          setFirebaseErrorMessage(pageData.firebaseOtpExpired);
        } else {
          if (message) {
            setFirebaseErrorMessage(pageData.firebaseGeneralMessage);
            writeFirebaseLog(message);
          }
        }

        setError(true);
        if (updateCustomerInfo != null) {
          return;
        }
        removeStorage(localStorageKeys.LOGIN);
      }
    });
  };

  const countryOptions = useMemo(() => {
    return countries?.length > 0 ? (
      countries
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
    ) : (
      <></>
    );
  }, [countries]);

  //Login succeed
  if (mode === EnumLogin.SUCCESS) {
    history.push("/");
  }

  const handleOTPBack = () => {
    setIsLoading(false);
    if (updateCustomerInfo) {
      history.push("/my-profile");
    } else {
      setMode(EnumLogin.LOGIN);
      setFirebaseErrorMessage(null);
      setError(false);
    }
  };

  const onChangeOtpInput = () => {
    const values = otpForm.getFieldsValue();
    if (values?.otp && values?.otp.length === OTP_LENGTH) {
      const otpValues = values?.otp;
      const otpString = otpValues.join("");
      handleConfirmSMSVerificationCode(otpString);
    }
  };

  const handleLoginFormChange = async () => {
    if (loginForm) {
      await loginForm.validateFields();
    }
  };

  function handleRedirectToRegisterForm() {
    setMode(EnumLogin.REGISTER);
    window.history.pushState(window.history.state, null, "/register");
    setIsLoginByPassword(false);
  }

  function handleRedirectToLoginForm() {
    setMode(EnumLogin.LOGIN);
    window.history.pushState(window.history.state, null, "/login");
    setIsLoginByPassword(true);
  }

  function handleContinueRegister() {
    loginClick();
  }

  // RENDER LOGIN AND REGISTER FORM
  if (mode === EnumLogin.LOGIN || mode === EnumLogin.REGISTER) {
    return (
      <div style={customStyles} className="login_page_theme1_container user-select-none-for-admin">
        <div
          className={`login_page_theme1 bc-login-form-container ${
            mode === EnumLogin.REGISTER ? "bc-register-form-container" : ""
          } ${errorMessage && "login_error"}`}
        >
          <Form form={loginForm} className="bc-form login-form bc-login-form">
            <div className="login_title text-line-clamp-1" style={{ color: themePageConfig?.colorGroup?.titleColor }}>
              {mode === EnumLogin.LOGIN ? pageData.login : t("loginPage.register")}
            </div>
            <LoginError message={errorMessage} />
            <Row className="login-detail-password bc-row">
              <Select
                className="login_country"
                popupClassName="login_country_popup"
                onChange={onChangeCountry}
                dropdownStyle={{ minWidth: dropDownWidth }}
                defaultValue={userCountry}
                optionLabelProp="label"
                bordered={false}
              >
                {countryOptions}
              </Select>
              <Form.Item
                name="phoneNumber"
                className="form-control"
                defaultValue={phone}
                rules={[
                  {
                    required: true,
                    message: pageData.pleaseEnterPhoneNumber,
                  },
                  {
                    type: "string",
                    max: 15,
                  },
                  {
                    pattern: /^[\+]?[(]?[0-9]{2}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                    message: pageData.invalidPhoneNumber,
                  },
                ]}
              >
                <Input
                  className="login-phone"
                  maxLength={15}
                  autoFocus={!isCustomize}
                  allowClear={true}
                  placeholder={pageData.placeHolder}
                  inputMode="tel"
                  onKeyDown={(event) => {
                    if (event.key === "Backspace") {
                      return event.stopPropagation();
                    }
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Row>
            {isLoginByPassword && (
              <Row className="bc-row">
                <Form.Item
                  className="form-control"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: pageData.pleaseEnterPassword,
                    },
                    {
                      min: 6,
                      message: pageData.invalidPassword,
                    },
                  ]}
                >
                  <Input.Password
                    minLength={6}
                    placeholder={pageData.inputYourPassword}
                    className="input-password"
                    iconRender={(visible) => (
                      <Typography.Link>{visible ? <EyeOffThinIcon /> : <EyeOpenThinIcon />}</Typography.Link>
                    )}
                  />
                </Form.Item>
              </Row>
            )}
            {!isLoginByPassword && firebaseErrorMessage && (
              <div className="login_firebase_error">{firebaseErrorMessage}</div>
            )}
            <Row className="login-button-box-password bc-row">
              {mode === EnumLogin.LOGIN && (
                <BCButton
                  loading={isLoading}
                  htmlType="button"
                  className="login-button"
                  onClick={loginClick}
                  themePageConfig={themePageConfig}
                >
                  {pageData.login}
                </BCButton>
              )}
              {mode === EnumLogin.REGISTER && (
                <BCButton
                  loading={isLoading}
                  htmlType="button"
                  className="login-button"
                  onClick={handleContinueRegister}
                  themePageConfig={themePageConfig}
                >
                  {t("loginPage.continue")}
                </BCButton>
              )}
            </Row>
            <Row className="form-footer-session">
              {mode === EnumLogin.LOGIN && (
                <>
                  <Col
                    span={24}
                    className="text-change-method-login"
                    onClick={() => {
                      setIsLoginByPassword(!isLoginByPassword);
                      setErrorMessage(null);
                    }}
                  >
                    <span>{isLoginByPassword ? pageData.loginByPhone : pageData.loginByPassword}</span>
                  </Col>

                  <Col span={24} className="content-center register-button">
                    <Typography.Text>{t("loginPage.haveNotAccount")}</Typography.Text>
                    <Typography.Link
                      style={{ color: `${themePageConfig?.colorGroup?.buttonBackgroundColor}` }}
                      onClick={handleRedirectToRegisterForm}
                      className="register-link"
                    >
                      {t("loginPage.register")}
                    </Typography.Link>
                    <Typography.Text>{t("loginPage.here")}</Typography.Text>
                  </Col>
                </>
              )}

              {mode === EnumLogin.REGISTER && (
                <>
                  <Col span={24} className="content-center register-button">
                    <Typography.Text>{t("loginPage.haveAccount")}</Typography.Text>
                    <Typography.Link
                      style={{ color: `${themePageConfig?.colorGroup?.buttonBackgroundColor}` }}
                      onClick={handleRedirectToLoginForm}
                      className="register-link"
                    >
                      {t("loginPage.login")}
                    </Typography.Link>
                    <Typography.Text>{t("loginPage.here")}</Typography.Text>
                  </Col>
                </>
              )}
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  if (mode === EnumLogin.OTP) {
    return (
      <Form form={otpForm} onChange={onChangeOtpInput}>
        <div style={customStyles} className="login_page_theme1_container">
          <div className="login_otp_container">
            <div className="login_otp_theme1">
              {firebaseOTPLoading && (
                <div className="loading-overlay">
                  <img src={loadingIcon} alt="" width={64} className="loading" />
                </div>
              )}
              <img className="login_back" src={back} alt={pageData.pleaseEnterOTP} onClick={handleOTPBack} />
              <div className="login_otp_title1">{pageData.verification}</div>
              <div className="login_otp_title2">{pageData.otpSendToYourPhone}</div>
              <div className="login_otp_title3">
                (+{countryCode}){phone?.startsWith("0") ? phone : "0" + phone}
              </div>
              <Form.Item
                name="otp"
                className="center-error-message"
                rules={[{ validator: async () => Promise.resolve() }]}
              >
                <InputOTP autoFocus inputType="numeric" length={OTP_LENGTH} />
              </Form.Item>
              {(error || firebaseErrorMessage) && (
                <div className="login_otp_error">{firebaseErrorMessage ?? pageData.inValidCode}</div>
              )}
              {isResend && (
                <div className="login_otp_resend2">
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
                  <Button className="login_button_resend" onClick={onClickResend}>
                    {pageData.reSend}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Form>
    );
  }

  if (mode === EnumLogin.INPUT_INFO) {
    return (
      <AccountInformationForm
        isRegisterWithoutOTP={isRegisterWithoutOTP}
        themePageConfig={themePageConfig}
        onLogin={onLoginAsync}
        form={form}
        isLoading={registerLoading}
        handleBack={() => {
          setMode(EnumLogin.LOGIN);
        }}
      />
    );
  }
}

export default function Theme1Login(props) {
  return (
    <Index
      {...props}
      contentPage={(_props) => {
        return <LoginPage {..._props} colorGroups={props?.general?.color?.colorGroups} />;
      }}
    />
  );
}
