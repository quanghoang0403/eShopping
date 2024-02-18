import { Button, Col, DatePicker, Form, Input, Radio, Row, message } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploading from "react-images-uploading";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import customerDataService from "../../../data-services/customer-data.service";
import { store } from "../../../modules";
import { setLoyaltyPointInformation, setUserInfo } from "../../../modules/session/session.actions";
import { storeConfigSelector } from "../../../modules/session/session.reducers";
import { useAppCtx } from "../../../providers/app.provider";
import { firebase } from "../../../utils/firebase";
import { fileNameNormalize, formatDateTime, jsonToFormData } from "../../../utils/helpers";
import { getStorage, localStorageKeys, removeStorage, setStorage } from "../../../utils/localStorage.helpers";
import { DateTimePickerIcon } from "../../assets/icons.constants";
import BellIcon from "../../assets/icons/bell-icon.svg";
import LogoutIcon from "../../assets/icons/log-out-profile-icon.svg";
import MyReservationIcon from "../../assets/icons/my-reservation-icon.svg";
import leftArrowIcon from "../../assets/images/left-arrow.svg";
import loyaltyPointIcon from "../../assets/images/loyalty-point-icon-menu.svg";
import myAccountIcon from "../../assets/images/my-account-icon.svg";
import myAddressIcon from "../../assets/images/my-address-icon.svg";
import profileImage from "../../assets/images/profile-image.png";
import uploadProfileImg from "../../assets/images/upload-profile-img.png";
import { backgroundTypeEnum } from "../../constants/store-web-page.constants";
import { DateFormat, ImageSizeDefault, PHONE_NUMBER_REGEX, profileTab } from "../../constants/string.constant";
import Index from "../../index";
import { LoyaltyPoint } from "./components/LoyaltyPoint";
import LoyaltyPointMembership from "./components/LoyaltyPointMembership/LoyaltyPointMembership";
import AddressListTheme2 from "./components/address-list/address-list.component";
import MyOrdersTheme2 from "./components/my-order/my-order.component";
import PasswordProfile from "./components/my-profile/components/password-profile";
import MyReservation from "./components/my-reservation/MyReservation";
import ReserveTableDetailPage from "./components/my-reservation/reserve-table-detail/ReserveTableDetail.page";
import OrderDetailComponent from "./components/order-detail.component";
import "./profile-page.page.scss";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

export default function ProfilePage(props) {
  const { isCustomize = false, fontFamily } = props;

  return (
    <Index
      {...props}
      contentPage={(props) => {
        return <ProfilePageContent isCustomize={isCustomize} fontFamily={fontFamily} {...props} />;
      }}
    />
  );
}

export function ProfilePageContent(props) {
  const colorGroup = props?.general?.color?.colorGroups?.find((g) => g.id === props?.config?.colorGroupId);
  const StyledMyProfilePage = styled.div`
    background: ${props?.config?.backgroundType === backgroundTypeEnum.Color
      ? props?.config?.backgroundColor
      : "url(" + props?.config?.backgroundImage + ") no-repeat"};
    background-size: cover;
  `;
  const { isCustomize, fontFamily } = props;
  const [isExistPhoneNumber, setIsExistPhoneNumber] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [customerInformation, setCustomerInformation] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const [form] = Form.useForm();
  const [t] = useTranslation();
  const MY_PROFILE = "my-profile";
  const isMediumScreen = useMediaQuery({ maxWidth: 1199 });
  const isAllowReserveTable = useSelector(storeConfigSelector)?.isAllowReserveTable;
  const pageData = {
    name: t("storeWebPage.profilePage.name"),
    familyName: t("storeWebPage.profilePage.familyName"),
    enterYourName: t("storeWebPage.profilePage.enterYourName"),
    enterYourFamilyName: t("storeWebPage.profilePage.enterYourFamilyName"),
    pleaseEnterYourName: t("storeWebPage.profilePage.pleaseEnterYourName"),
    pleaseEnterYourFamilyName: t("storeWebPage.profilePage.pleaseEnterYourFamilyName"),
    phoneNumber: t("storeWebPage.profilePage.phoneNumber"),
    pleaseEnterPhoneNumber: t("loginPage.pleaseEnterPhoneNumber", "Vui lòng nhập số điện thoại"),
    validPhonePattern: t("storeWebPage.profilePage.validPhonePattern"),
    existPhoneNumber: t("myProfile.accountInfo.existPhoneNumber", "Số điện thoại đã tồn tại"),
    birthday: t("storeWebPage.profilePage.birthday"),
    gender: t("storeWebPage.profilePage.gender"),
    male: t("storeWebPage.profilePage.male"),
    female: t("storeWebPage.profilePage.female"),
    other: t("storeWebPage.profilePage.other"),
    myAccount: t("storeWebPage.profilePage.myAccount"),
    myAddress: t("storeWebPage.profilePage.myAddress"),
    myOrder: t("storeWebPage.profilePage.myOrder"),
    loyaltyPoint: t("storeWebPage.profilePage.loyaltyPoint"),
    update: t("storeWebPage.profilePage.update"),
    enterEmail: t("storeWebPage.profilePage.enterEmail"),
    invalidEmail: t("storeWebPage.profilePage.invalidEmail"),
    informationHasBeenUpdatedSuccessfully: t(
      "myProfile.accountInfo.informationHasBeenUpdatedSuccessfully",
      "Thông tin đã được cập nhật thành công!",
    ),
    loyaltyPointDetail: t("loyaltyPoint.loyaltyPointDetail"),
    passWord: t("storeWebPage.profilePage.passWord"),
    requiredCharacters: t("storeWebPage.profilePage.requiredCharacters"),
    confirm: t("storeWebPage.profilePage.confirm"),
    cancel: t("storeWebPage.profilePage.cancel"),
    updateSuccess: t("storeWebPage.profilePage.updateSuccess"),
    myReservation: t("reservation.myReservation", "My Reservations"),
    loginOrRegister: t("loginPage.loginOrRegister", "Login / Register"),
    logOut: t("loginPage.logOut", "Log Out"),
    wrongCustomerInfo: t("messages.wrongCustomerInfo", "Something went wrong while get customer information!"),
  };

  const [currentTabInfor, setCurrentTabInfor] = useState(profileTab.myAccount);
  const [isNavigate, setIsNavigate] = useState(false);
  const [profileImageURL, setProfileImageURL] = useState();
  const [fullName, setFullName] = useState();
  const [gender, setGender] = useState();
  const [visibleOrderDetailPage, setVisibleOrderDetailPage] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [rank, setRank] = useState();
  const [badgeColor, setBadgeColor] = useState();
  const [loyaltyPointInfo, setLoyaltyPointInfo] = useState({});
  const [isActivated, setIsActivated] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [visibleReservationDetailPage, setVisibleReservationDetailPage] = useState(false);
  const inputNumberPhoneRef = useRef();
  const reduxState = store?.getState();
  const customerInfo = reduxState?.session?.userInfo;
  const { Toast } = useAppCtx();

  useEffect(() => {
    const reservationIdFromState = history.location.state?.reservationId;
    if (reservationIdFromState) {
      setReservationId(reservationIdFromState);
    }
  }, []);

  useEffect(() => {
    if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
      const myAccountState = JSON.parse(getStorage(localStorageKeys.MY_ACCOUNT_STATE));
      setCurrentTabInfor(myAccountState?.currentTab);
      setIsNavigate(myAccountState?.navigate);
    } else {
      let arrParam = window.location.pathname.split("/");
      let idParam = arrParam.slice(-1)[0];
      const profileTabExisted = Object.values(profileTab).includes(idParam);
      if (profileTabExisted) {
        setCurrentTabInfor(idParam);
        storeCurrentState(idParam, false);
      }
    }

    if (!isCustomize) {
      getCustomerInformation();
    }
  }, []);

  useEffect(() => {
    form.resetFields();
    setIsValidPhoneNumber(true);

    // Open order detail from router
    if (location && location?.state && location?.state?.orderId) {
      const orderId = location?.state?.orderId;
      navigateToOrderDetail(orderId);
    }
  }, [currentTabInfor]);

  useEffect(() => {
    const fetchCustomerLoyaltyPoint = async () => {
      if (!customerInfo?.accountId) return;
      const response = await customerDataService.getCustomerLoyaltyPointAsync(customerInfo.accountId);
      const isActivated = response?.data?.isActivated ?? false;
      if (isActivated) {
        const customerLoyaltyPoint = response.data.customerLoyaltyPoint;
        setLoyaltyPointInfo(customerLoyaltyPoint);
        setIsActivated(true);
        const loyaltyPoint = store.getState()?.session?.loyaltyPoint;
        const currentLoyaltyPoint = {
          ...loyaltyPoint,
          customerLoyaltyPoint: customerLoyaltyPoint,
          isActivated: isActivated,
        };
        store.dispatch(setLoyaltyPointInformation(currentLoyaltyPoint));
      }
    };

    fetchCustomerLoyaltyPoint();
  }, [customerInfo?.accountId]);

  useEffect(() => {
    if (!isMediumScreen) return;
    if (location?.pathname === `/${MY_PROFILE}/${profileTab.myReservation}`) {
      handleChangeTabMyReservation();
    }
  }, []);

  const storeCurrentState = (currentTab, navigate) => {
    const myAccountState = {
      currentTab: currentTab,
      navigate: navigate,
    };
    setStorage(localStorageKeys.MY_ACCOUNT_STATE, JSON.stringify(myAccountState));
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

  const getCustomerInformation = async () => {
    if (isCustomize) return;
    let customerInfoLS = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
    try {
      const resCustomerInfo = await customerDataService.getCustomerInfoAsync();
      if (resCustomerInfo) {
        if (customerInfoLS) {
          customerInfoLS = {
            ...customerInfoLS,
            email: resCustomerInfo?.data?.email,
            firstName: resCustomerInfo?.data?.firstName
              ? resCustomerInfo?.data?.firstName
              : resCustomerInfo?.data.fullName,
            lastName: resCustomerInfo?.data?.lastName,
            phoneNumber: resCustomerInfo?.data?.phoneNumber,
            birthday: dayjs(resCustomerInfo?.data?.birthday),
            gender: resCustomerInfo?.data?.gender,
            isHasPassword: resCustomerInfo?.data?.isHasPassword,
            fullName: resCustomerInfo?.data?.fullName,
          };
          setStorage(localStorageKeys.CUSTOMER_INFO, JSON.stringify(customerInfoLS));
        } else {
          customerInfoLS = resCustomerInfo;
        }
      }
    } catch (error) {
      if (location?.pathname === `/${MY_PROFILE}/${profileTab.myReservation}`) return;
      message.error(pageData.wrongCustomerInfo);
    }

    setCustomerInformation(customerInfoLS);
    form.setFieldsValue({
      accountId: customerInfoLS?.accountId,
      countryId: customerInfoLS?.countryId,
      countryCode: customerInfoLS?.countryCode,
      phoneCode: customerInfoLS?.phoneCode,
      email: customerInfoLS?.email,
      firstName: customerInfoLS?.firstName ? customerInfoLS?.firstName : customerInfoLS?.fullName,
      lastName: customerInfoLS?.lastName,
      phoneNumber: customerInfoLS?.phoneNumber,
      birthday: dayjs(customerInfoLS?.birthday),
      gender: customerInfoLS?.gender,
    });

    setProfileImageURL(customerInfoLS?.thumbnail);
    setFullName(customerInfoLS?.fullName);

    setRank(customerInfoLS?.rank);
    setBadgeColor(customerInfoLS?.badgeColor);
  };

  // Show validation message in form if the component is rendering again
  useEffect(() => {
    if (form.getFieldValue("firstName") != undefined) {
      form.validateFields();
    }
  });

  const onUploadImage = async (imageList) => {
    // data for submit
    let buildFileName = dayjs(new Date()).format(DateFormat.YYYY_MM_DD_HH_MM_SS);
    if (imageList[0]) {
      const requestData = {
        file: imageList[0].file,
        fileName: fileNameNormalize(buildFileName),
      };
      const requestFormData = jsonToFormData(requestData);
      const res = await customerDataService.uploadCustomerAvatar(requestFormData);
      if (res) {
        setProfileImageURL(imageList[0].data_url);
        Toast.error({
          message: pageData.updateSuccess,
          placement: "top",
        });
      } else {
        Toast.error({
          message: res.message,
          placement: "top",
        });
      }
    }
  };

  const uploadImageError = (errors, files) => {
    if (errors.maxFileSize) {
      Toast.error({
        message: t("storeWebPage.profilePage.imageMaxSizeMessage"),
        placement: "top",
      });
    }
  };

  const onGenderChange = (e) => {
    setGender(e.target.value);
  };

  const onPhoneChange = (event) => {
    setIsValidPhoneNumber(PHONE_NUMBER_REGEX?.test(event?.target?.value));
    setIsExistPhoneNumber(false);
    inputNumberPhoneRef.current?.focus();
  };

  useEffect(() => {
    inputNumberPhoneRef.current?.focus();
  }, [isExistPhoneNumber, isValidPhoneNumber]);

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber?.startsWith("0") ? phoneNumber.substring(1) : phoneNumber;
  };

  const onFinish = async () => {
    if (isCustomize) return;
    try {
      const values = await form.validateFields();
      values.birthday = values.birthday.format(DateFormat.YYYY_MM_DD);
      setIsValidPhoneNumber(PHONE_NUMBER_REGEX?.test(values?.phoneNumber));

      let isExist = await checkExistPhoneNumber();
      if (isExist) {
        setIsExistPhoneNumber(isExist);
        return;
      }

      let newPhoneNumber = formatPhoneNumber(values.phoneNumber);
      let oldPhoneNumber = formatPhoneNumber(customerInformation.phoneNumber);

      if (newPhoneNumber !== oldPhoneNumber || values.phoneCode !== customerInformation.phoneCode) {
        values.birthDay = formatDateTime(values.birthday);
        history.push({
          pathname: "/login",
          state: { updateCustomerInfo: values },
        });
        return;
      } else {
        inputNumberPhoneRef.current?.focus();
      }
      const response = await customerDataService.updateCustomerProfile(values);

      if (response?.data?.isSuccess === true) {
        getCustomerInformation();
        Toast.success({
          message: pageData.informationHasBeenUpdatedSuccessfully,
          placement: "top",
        });
      } else {
        Toast.error({
          message: response?.message,
          placement: "top",
        });
      }
    } catch (errors) {}
  };

  const handleOnClickBack = () => {
    setCurrentTabInfor(profileTab.myAccount);
    setIsNavigate(false);
    storeCurrentState(profileTab.myAccount, false);
  };

  const handleNavigateToOrderDetail = (orderId) => {
    setCurrentTabInfor(profileTab.myOrder);
    navigateToOrderDetail(orderId);
  };

  const navigateToOrderDetail = (orderId) => {
    setOrderId(orderId);
    setVisibleOrderDetailPage(true);
  };
  useEffect(() => {
    if (reservationId) {
      setCurrentTabInfor(profileTab.myReservation);
      setVisibleReservationDetailPage(true);
    }
  }, [reservationId]);

  const handleNavigateToReservationDetail = (reservationId) => {
    setCurrentTabInfor(profileTab.myReservation);
    setReservationId(reservationId);
    setVisibleReservationDetailPage(true);
  };
  const onLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        removeStorage(localStorageKeys.LOGIN);
        removeStorage(localStorageKeys.TOKEN);
        store.dispatch(setUserInfo({}));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const valuesProfile = {
    isNavigate: isNavigate,
    currentTabInfor: currentTabInfor,
    colorGroup: colorGroup,
    isExistPhoneNumber: isExistPhoneNumber,
  };

  const handleChangeTabAccount = () => {
    setVisibleOrderDetailPage(false);
    setCurrentTabInfor(profileTab.myAccount);
    setIsNavigate(true);
    storeCurrentState(profileTab.myAccount, true);
    getCustomerInformation();
  };

  const handleChangeTabAddress = () => {
    setVisibleOrderDetailPage(false);
    setCurrentTabInfor(profileTab.myAddress);
    setIsNavigate(true);
    storeCurrentState(profileTab.myAddress, true);
  };
  const handleChangeTabOrder = () => {
    setCurrentTabInfor(profileTab.myOrder);
    setIsNavigate(true);
    storeCurrentState(profileTab.myOrder, true);
  };

  const handleChangeTabLoyaltyPoint = () => {
    setCurrentTabInfor(profileTab.loyaltyPoint);
    setIsNavigate(true);
    storeCurrentState(profileTab.loyaltyPoint, true);
  };

  const handleChangeTabMyReservation = () => {
    setCurrentTabInfor(profileTab.myReservation);
    setIsNavigate(true);
    storeCurrentState(profileTab.myReservation, true);
  };

  const classNamePageContainer =
    currentTabInfor === profileTab.loyaltyPoint
      ? "page-container-loyalty-point"
      : currentTabInfor === profileTab.myReservation
      ? "page-container-my-reservation"
      : "";

  return (
    <StyledMyProfilePage className="profile-page-background">
      <div className={`page-container ${classNamePageContainer}`}>
        <div className="profile-page-wrapper">
          <div className={`profile-left-side ${isNavigate && "mobile-d-none tablet-d-none"}`}>
            {(isActivated && customerInformation?.accountId && loyaltyPointInfo) || isCustomize ? (
              <LoyaltyPoint
                uploadFile={{ onUploadImage, uploadImageError, profileImageURL, profileImage }}
                customerInfo={customerInformation ?? {}}
                loyaltyPointInfo={loyaltyPointInfo}
                isCustomize={isCustomize}
              />
            ) : (
              <>
                <div className="profile-contain">
                  <div className="profile-image">
                    <ImageUploading
                      onChange={onUploadImage}
                      dataURLKey="data_url"
                      onError={uploadImageError}
                      maxFileSize={ImageSizeDefault}
                    >
                      {({ onImageUpload }) => {
                        return (
                          <>
                            <img
                              onClick={onImageUpload}
                              className="upload-profile-img "
                              src={uploadProfileImg}
                              width="36"
                              height="36"
                              alt="avatar"
                            />

                            <img
                              className="profile-img"
                              src={profileImageURL ?? profileImage}
                              width="120"
                              height="120"
                              alt="profile"
                            />
                          </>
                        );
                      }}
                    </ImageUploading>
                  </div>
                  <div className="profile-name">
                    <div style={{ lineHeight: "36px" }} className="fullName-over-length">
                      {fullName}
                    </div>
                    {customerInformation?.accountId && isActivated ? (
                      <div className="profile-membership" style={badgeColor && { background: badgeColor }}>
                        {rank ?? "Classic Member"}
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            )}

            <div className="profile-infor-contain">
              {(customerInfo?.accountId || isCustomize) && (
                <>
                  <div
                    className={`profile-infor ${currentTabInfor === profileTab.myAccount && "profile-infor-active"}`}
                    onClick={handleChangeTabAccount}
                  >
                    <img src={myAccountIcon} width="18" height="22" alt="" />
                    {pageData.myAccount}
                  </div>
                  <div
                    className={`profile-infor ${currentTabInfor === profileTab.myAddress && "profile-infor-active"}`}
                    onClick={handleChangeTabAddress}
                  >
                    <img src={myAddressIcon} width="18" height="22" alt="" />
                    {pageData.myAddress}
                  </div>
                  <div
                    className={`profile-infor ${currentTabInfor === profileTab.myOrder && "profile-infor-active"}`}
                    onClick={handleChangeTabOrder}
                  >
                    <img src={BellIcon} width="24" height="24" alt="" />
                    {pageData.myOrder}
                  </div>
                </>
              )}

              {isAllowReserveTable ? (
                <div
                  className={`profile-infor ${currentTabInfor === profileTab.myReservation && "profile-infor-active"}`}
                  onClick={handleChangeTabMyReservation}
                >
                  <img src={MyReservationIcon} width="18" height="22" alt="" />
                  {pageData.myReservation}
                </div>
              ) : (
                <></>
              )}

              {isActivated || isCustomize ? (
                <div
                  className={`profile-infor ${currentTabInfor === profileTab.loyaltyPoint && "profile-infor-active"}`}
                  onClick={handleChangeTabLoyaltyPoint}
                >
                  <img src={loyaltyPointIcon} width="18" height="22" alt="" />
                  {pageData.loyaltyPointDetail}
                </div>
              ) : null}

              {!isCustomize &&
                (customerInfo?.accountId ? (
                  <button onClick={onLogout} className="btn-logout web-d-none">
                    {pageData.logOut}
                  </button>
                ) : (
                  <div onClick={() => history.push("/login")} className="profile-infor">
                    <img src={LogoutIcon} width="18" height="22" alt="Logout Icon" />
                    {pageData.loginOrRegister}
                  </div>
                ))}
            </div>
          </div>
          {isNavigate && !visibleOrderDetailPage && !visibleReservationDetailPage && (
            <div
              className={`navigate-profile-page web-d-none ${
                currentTabInfor === profileTab.loyaltyPoint && "profile-loyalty-point-hide"
              }`}
            >
              <img src={leftArrowIcon} width="24" height="24" alt="" onClick={handleOnClickBack} />
              {currentTabInfor === profileTab.myAccount && pageData.myAccount}
              {currentTabInfor === profileTab.myAddress && pageData.myAddress}
              {currentTabInfor === profileTab.myOrder && pageData.myOrder}
              {currentTabInfor === profileTab.loyaltyPoint && pageData.loyaltyPoint}
              {currentTabInfor === profileTab.myReservation && pageData.myReservation}
            </div>
          )}
          <div className="container-profile-right-side">
            <div
              className={`profile-right-side
            ${!isNavigate && "mobile-d-none tablet-d-none"}
            ${currentTabInfor === profileTab.myAddress && "mobile-address-content"}
            ${currentTabInfor === profileTab.myOrder && "profile-right-side-order-detail"}
            ${currentTabInfor === profileTab.myReservation && "profile-right-side-my-reservation"}`}
            >
              {currentTabInfor === profileTab.myAccount && (
                <>
                  <Form form={form} className="my-profile-info">
                    <div className="profile-card-title" style={{ color: colorGroup?.titleColor }}>
                      {pageData.myAccount}
                    </div>
                    <div className="profile-card-row">
                      <Form.Item hidden={true} name="accountId"></Form.Item>
                      <Form.Item hidden={true} name="countryId"></Form.Item>
                      <Form.Item hidden={true} name="countryCode"></Form.Item>
                      <Form.Item hidden={true} name="phoneCode"></Form.Item>
                      <div className="profile-card-label" style={{ color: colorGroup?.textColor }}>
                        {pageData.name}
                      </div>
                      <Form.Item
                        className="profile-card-form-input"
                        name="firstName"
                        rules={[
                          {
                            required: true,
                            message: pageData.pleaseEnterYourName,
                          },
                          {
                            type: "string",
                            max: 20,
                          },
                          {
                            validator: (_, value) =>
                              value.replace(/\s/g, "").length === 0 && value.length > 0
                                ? Promise.reject(new Error(pageData.pleaseEnterYourName))
                                : Promise.resolve(),
                          },
                        ]}
                      >
                        <Input
                          className="profile-card-input"
                          showCount
                          maxLength={20}
                          placeholder={pageData.enterYourName}
                        />
                      </Form.Item>
                    </div>
                    <div className="profile-card-row">
                      <div className="profile-card-label" style={{ color: colorGroup?.textColor }}>
                        {pageData.familyName}
                      </div>
                      <Form.Item
                        className="profile-card-form-input"
                        name="lastName"
                        rules={[
                          {
                            type: "string",
                            max: 20,
                          },
                        ]}
                      >
                        <Input
                          className="profile-card-input"
                          showCount
                          maxLength={20}
                          placeholder={pageData.enterYourFamilyName}
                        />
                      </Form.Item>
                    </div>
                    <div className="profile-card-row">
                      <div className="profile-card-label" style={{ color: colorGroup?.textColor }}>
                        {pageData.phoneNumber}
                      </div>
                      <Form.Item
                        className="profile-card-form-input"
                        name="phoneNumber"
                        onChange={onPhoneChange}
                        rules={[
                          {
                            required: true,
                            message: t(pageData.pleaseEnterPhoneNumber),
                          },
                          {
                            pattern: PHONE_NUMBER_REGEX,
                            message: pageData.validPhonePattern,
                          },
                        ]}
                      >
                        <Input ref={inputNumberPhoneRef} className="profile-card-input" />
                      </Form.Item>
                    </div>
                    {isExistPhoneNumber && <div className="exist-phone-code">{pageData.existPhoneNumber}</div>}
                    <div className="profile-card-row">
                      <div className="profile-card-label" style={{ color: colorGroup?.textColor }}>
                        Email
                      </div>
                      <Form.Item
                        className="profile-card-form-input"
                        name="email"
                        rules={[
                          {
                            required: false,
                            message: pageData.enterEmail,
                          },
                          {
                            type: "email",
                            message: pageData.invalidEmail,
                          },
                          {
                            type: "string",
                            max: 50,
                          },
                        ]}
                      >
                        <Input
                          className="profile-card-input"
                          placeholder={pageData.enterEmail}
                          showCount
                          maxLength={50}
                        />
                      </Form.Item>
                    </div>
                    <div className="profile-card-row">
                      <div className="profile-card-label" style={{ color: colorGroup?.textColor }}>
                        {pageData.gender}
                      </div>
                      <Form.Item name="gender">
                        <Radio.Group onChange={onGenderChange} value={gender} defaultValue={isCustomize && 2}>
                          <Row>
                            <Col>
                              <Radio value={2}>{pageData.female}</Radio>
                            </Col>
                            <Col>
                              <Radio value={1}>{pageData.male}</Radio>
                            </Col>
                            <Col>
                              <Radio value={3}>{pageData.other}</Radio>
                            </Col>
                          </Row>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                    <div className="profile-card-row">
                      <div className="profile-card-label" style={{ color: colorGroup?.textColor }}>
                        {pageData.birthday}
                      </div>
                      <Form.Item name="birthday">
                        <DatePicker
                          className="fnb-date-time-picker profile-card-input"
                          placeholder={"dd/mm/yyyy"}
                          suffixIcon={<DateTimePickerIcon />}
                          dropdownClassName="fnb-date-time-picker-dropdown"
                          format={DateFormat.DD_MM_YYYY}
                          showToday={false}
                          allowClear={false}
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
                    </div>
                    <div className="profile-card-button">
                      <Button
                        onClick={() => onFinish()}
                        htmlType="button"
                        disabled={isExistPhoneNumber || !isValidPhoneNumber}
                        className="btn-update"
                        style={{
                          color: colorGroup?.buttonTextColor,
                          backgroundColor: colorGroup?.buttonBackgroundColor,
                          border: colorGroup?.buttonBorderColor + "1px solid",
                        }}
                      >
                        {pageData.update}
                      </Button>
                    </div>
                  </Form>
                </>
              )}
              {currentTabInfor === profileTab.myAddress ? <AddressListTheme2 colorGroup={colorGroup} /> : null}
              {currentTabInfor === profileTab.myOrder ? (
                visibleOrderDetailPage ? (
                  <OrderDetailComponent orderId={orderId} setVisibleOrderDetailPage={setVisibleOrderDetailPage} />
                ) : (
                  <MyOrdersTheme2 navigateToOrderDetail={navigateToOrderDetail} isCustomize={isCustomize} />
                )
              ) : null}

              {currentTabInfor === profileTab.myReservation &&
                (visibleReservationDetailPage ? (
                  <ReserveTableDetailPage
                    colorGroup={colorGroup}
                    reservationId={reservationId}
                    navigateToOrderDetail={handleNavigateToOrderDetail}
                    setVisibleReservationDetailPage={setVisibleReservationDetailPage}
                  />
                ) : (
                  <MyReservation
                    colorGroup={colorGroup}
                    isCustomize={isCustomize}
                    navigateToOrderDetail={handleNavigateToOrderDetail}
                    navigateToReservationDetail={handleNavigateToReservationDetail}
                  />
                ))}

              {isActivated && currentTabInfor === profileTab.loyaltyPoint ? (
                <LoyaltyPointMembership
                  handleOnClickBack={handleOnClickBack}
                  navigateToOrderDetail={handleNavigateToOrderDetail}
                />
              ) : null}
            </div>

            <PasswordProfile data={valuesProfile} colorGroup={colorGroup} />
          </div>
        </div>
      </div>
    </StyledMyProfilePage>
  );
}
