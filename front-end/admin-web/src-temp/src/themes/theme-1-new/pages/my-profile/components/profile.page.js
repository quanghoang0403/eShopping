import { Radio, message } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import customerDataService from "../../../../data-services/customer-data.service";
import { store } from "../../../../modules";
import { firebase } from "../../../../utils/firebase";
import { localStorageKeys, removeStorage, getStorage } from "../../../../utils/localStorage.helpers";
import {
  AccountInformationIcon,
  AddressListIcon,
  LogoutIcon,
  LoyaltyPointProfileIcon,
  OrdersIcon,
  ReservationMyProfile
} from "../../../assets/icons.constants";
import { backgroundTypeEnum } from "../../../constants/store-web-page.constants";
import { profileTabTheme1 } from "../../../constants/string.constants";
import LoyaltyPointCardContainer from "../../../container/LoyaltyPointCard/LoyaltyPointCardContainer";
import LoyaltyPointMembership from "./LoyaltyPointMembership/LoyaltyPointMembership";
import AddressListTheme1 from "./address-list/address-list.component";
import AccountInformationTheme1 from "./my-account/account-information.component";
import MyOrdersTheme1 from "./my-orders/my-order.component";
import "./profile.page.scss";
import { useAppCtx } from "../../../../providers/app.provider";
import ListReservations from "./my-reservations/list-reservations/list-reservations.component";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../../../modules/session/session.actions";
import { storeConfigSelector } from "../../../../modules/session/session.reducers";

export function ProfilePage(props) {
  const { config, isCustomize, general } = props;
  const [t] = useTranslation();
  const history = useHistory();
  const { Toast } = useAppCtx();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ maxWidth: 575 });
  const isPC = useMediaQuery({ minWidth: 992 });
  const isIpad = useMediaQuery({ maxWidth: 991 });
  const translateData = {
    accountInformation: t("myProfile.accountInfo.accountInformation", "Thông tin tài khoản"),
    orders: t("myProfile.myOrders.orders", "Đơn hàng"),
    addressList: t("myProfile.addressList.title", "Danh sách địa chỉ"),
    logout: t("myProfile.accountInfo.logout", "Đăng xuất"),
    loyaltyPointDetail: t("loyaltyPoint.loyaltyPointDetail"),
    reserve: t("reserve.myReservations"),
    loginOrRegister: t("loginPage.loginOrRegister"),
  };
  const colorGroup = general?.color?.colorGroups?.find((g) => g?.id === config?.colorGroupId);
  const [loyaltyPoint, setLoyaltyPoint] = useState({});
  const [isActiveLoyaltyPoint, setIsActiveLoyaltyPoint] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [activeScreen, setActiveScreen] = useState();
  const [isShowLeftContent, setIsShowLeftContent] = useState(true);
  const [isShowRightContent, setIsShowRightContent] = useState(false);
  const isAllowReserveTable = useSelector(storeConfigSelector)?.isAllowReserveTable;
  const LOGIN_STATUS = {
    IDLE: 'idle',
    IS_LOGIN: 'isLogin',
    NOT_LOGIN: 'notLogin'
  };
  const [isLoggedIn, setIsLoggedIn] = useState(LOGIN_STATUS.IDLE);

  const location = useLocation();

  useLayoutEffect(() => {
    const login = getStorage(localStorageKeys.LOGIN);
    if (login) {
      setIsLoggedIn(LOGIN_STATUS.IS_LOGIN);
    } else {
      setIsLoggedIn(LOGIN_STATUS.NOT_LOGIN);
    }
    getCustomerInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCustomerInfo = async () => {
    if (isCustomize) {
      setActiveScreen(profileTabTheme1.accountInformation);
      return;
    }
    const reduxState = store.getState();
    const customerInfo = reduxState?.session?.userInfo;
    if (customerInfo) {
      setCustomerInfo(customerInfo);

      if (customerInfo?.accountId) {
        try {
          customerDataService.getCustomerLoyaltyPointAsync(customerInfo?.accountId).then((response) => {
            if (response?.data?.customerLoyaltyPoint) {
              setLoyaltyPoint(response?.data?.customerLoyaltyPoint);
            }
            setIsActiveLoyaltyPoint(response?.data?.isActivated);
          });
        } catch (error) {
          Toast.error({
            message: error,
            placement: "top",
          });
        }
      }
    }
    handleActiveScreen();
  };

  const handleActiveScreen = async () => {
    let arrParam = window.location.pathname.split("/");
    let idParam = arrParam[2];
    var profileTabIds = Object.keys(profileTabTheme1).map((key) => profileTabTheme1[key].toString());
    const profileTabExisted = profileTabIds.indexOf(idParam) >= 0;

    if (location && location?.state && location?.state?.activeScreen) {
      let screen = location?.state?.activeScreen;
      setActiveScreen(parseInt(screen));
      setIsShowLeftContent(false);
      setIsShowRightContent(true);
      location.state = "";
    } else if (profileTabExisted) {
      setActiveScreen(parseInt(idParam));
      setIsShowLeftContent(false);
      setIsShowRightContent(true);
    } else {
      setActiveScreen(profileTabTheme1.accountInformation);
    }
  };

  const handleClickTitle = () => {
    setIsShowLeftContent(true);
    setIsShowRightContent(false);
    setActiveScreen(0);
  };

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        removeStorage(localStorageKeys.LOGIN);
        removeStorage(localStorageKeys.TOKEN);
        removeStorage(localStorageKeys.CUSTOMER_INFO);
        dispatch(setUserInfo(null));
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLoginOrRegister = () => {
    history.push("/login")
  }

  const screens = {
    accountInformation: {
      key: profileTabTheme1.accountInformation,
      component: <AccountInformationTheme1 {...props} isCustomize={isCustomize} handleClickTitle={handleClickTitle} colorGroup={colorGroup}/>,
    },
    loyaltyPoint: {
      key: profileTabTheme1.loyaltyPoint,
      component: (
        <LoyaltyPointMembership
          handleClickTitle={handleClickTitle}
          isActiveLoyaltyPoint={isActiveLoyaltyPoint}
          loyaltyPoint={loyaltyPoint}
        />
      ),
    },
    orders: {
      key: profileTabTheme1.orders,
      component: <MyOrdersTheme1 handleClickTitle={handleClickTitle} />,
    },
    addressList: {
      key: profileTabTheme1.addressList,
      component: <AddressListTheme1 handleClickTitle={handleClickTitle} />,
    },
    myReservations: {
      key: profileTabTheme1.myReservations,
      component: <ListReservations handleClickTitle={handleClickTitle} colorGroup={colorGroup} />,
    },
    logout: {
      key: profileTabTheme1.logout,
      component: <></>,
    },
    loginOrRegister: {
      key: profileTabTheme1.loginOrRegister,
      component: <></>,
    }
  };

  const renderScreenContent = () => {
    if (activeScreen) {
      // eslint-disable-next-line default-case
      switch (activeScreen) {
        case screens.accountInformation.key:
          return isLoggedIn  === LOGIN_STATUS.IS_LOGIN || isCustomize ? screens.accountInformation.component : <></>;
        case screens.loyaltyPoint.key:
          return isLoggedIn  === LOGIN_STATUS.IS_LOGIN || isCustomize ? screens.loyaltyPoint.component : <></>;
        case screens.orders.key:
          return isLoggedIn  === LOGIN_STATUS.IS_LOGIN || isCustomize ? screens.orders.component : <></>;
        case screens.addressList.key:
          return isLoggedIn  === LOGIN_STATUS.IS_LOGIN || isCustomize ? screens.addressList.component : <></>;
        case screens.myReservations.key:
          return isLoggedIn !== LOGIN_STATUS.IDLE ? screens.myReservations.component : <></>;
        case screens.logout.key:
          return handleLogout();
        case screens.loginOrRegister.key:
          return handleLoginOrRegister();
      }
    }
  };

  const StyledLeftProfile = styled.div`
    .ant-radio-button-wrapper.ant-radio-button-wrapper-checked.my-profile-item-rd {
      .my-profile-item-title {
        color: ${colorGroup?.titleColor};
      }
      .icon-profile-item-title {
        &__reservation {
          circle {
            fill: ${colorGroup?.titleColor};
          }
        }
      }
      svg > path {
        fill: ${colorGroup?.titleColor};
      }
    }
  `;

  const memoLeftMenuProfilePage = React.useMemo(() => {
    const reduxState = store.getState();
    let isLogin = false; 
    if(reduxState?.session?.userInfo?.accountId) isLogin = true;
    return (
      <StyledLeftProfile>
        <Content style={{ overflow: "initial", padding: 8 }}>
          <Radio.Group value={activeScreen} onChange={(e) => handleChangeScreen(e)}>
            {(isLogin || isCustomize) && (
              <Radio.Button value={screens.accountInformation.key} className="my-profile-item-rd">
                <AccountInformationIcon className="icon-profile-item-title" />
                <span className="my-profile-item-title">{translateData.accountInformation}</span>
              </Radio.Button>
            )}
            {isActiveLoyaltyPoint && isLogin ? (
              <Radio.Button value={screens.loyaltyPoint.key} className="my-profile-item-rd">
                <LoyaltyPointProfileIcon className="icon-profile-item-title loyalty-point-icon" />
                <span className="my-profile-item-title">{translateData.loyaltyPointDetail}</span>
              </Radio.Button>
            ) : null}
            {(isLogin || isCustomize) && (
              <Radio.Button value={screens.orders.key} className="my-profile-item-rd">
                <OrdersIcon className="icon-profile-item-title" />
                <span className="my-profile-item-title">{translateData.orders}</span>
              </Radio.Button>
            )}
            {(isLogin || isCustomize) && (
              <Radio.Button value={screens.addressList.key} className="my-profile-item-rd">
                <AddressListIcon className="icon-profile-item-title" />
                <span className="my-profile-item-title">{translateData.addressList}</span>
              </Radio.Button>
            )}
            {isAllowReserveTable ? (
              <Radio.Button value={screens.myReservations.key} className="my-profile-item-rd">
                <ReservationMyProfile className="icon-profile-item-title icon-profile-item-title__reservation" />
                <span className="my-profile-item-title">{translateData.reserve}</span>
              </Radio.Button>
            ) : (
              <></>
            )}
            {isLogin ? (
              <Radio.Button value={screens.logout.key} className="my-profile-item-rd">
                <LogoutIcon className="icon-profile-item-title" />
                <span className="my-profile-item-title">{translateData.logout}</span>
              </Radio.Button>
            ) : (
              <Radio.Button value={screens.loginOrRegister.key} className="my-profile-item-rd">
                <LogoutIcon className="icon-profile-item-title" />
                <span className="my-profile-item-title">{translateData.loginOrRegister}</span>
              </Radio.Button>
            )}
          </Radio.Group>
        </Content>
      </StyledLeftProfile>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translateData]);

  const handleChangeScreen = (e) => {
    setActiveScreen(e.target.value);
    if (e.target.value !== screens.logout.key && e.target.value !== screens.loginOrRegister.key) {
      history.push({
        pathname: window.location.pathname,
        state: { activeScreen: e.target.value },
      });
    }

    //Clear url
    window.history.replaceState(null, null, `/my-profile/${e.target.value}`);
    setIsShowLeftContent(false);
    setIsShowRightContent(true);
  };

  // TODO: add cancel component to order list <CancelOrderButton orderId={"00001"} />
  return (
    <div>
      <div
        className="my-profile-theme1-styled user-select-none-for-admin"
        style={
          config?.backgroundType === backgroundTypeEnum.Color
            ? {
                backgroundColor: config?.backgroundColor,
              }
            : {
                background: `url(${config?.backgroundImage}) no-repeat center/cover`,
              }
        }
      >
        <div className="my-profile-theme1-container main-session">
          {isPC && (
            <>
              <div
                className={`my-profile-left ${
                  isLoggedIn === LOGIN_STATUS.NOT_LOGIN ? "my-profile-left--not-login" : ""
                }`}
              >
                {(customerInfo || customerInfo?.customerLoyaltyPoint || isCustomize) && (
                  <LoyaltyPointCardContainer
                    customerInfo={customerInfo}
                    isCustomize={isCustomize}
                    config={config}
                    loyaltyPoint={loyaltyPoint}
                    isActivated={isActiveLoyaltyPoint}
                  ></LoyaltyPointCardContainer>
                )}
                {memoLeftMenuProfilePage}
              </div>
              <div className="my-profile-right">{renderScreenContent()}</div>
            </>
          )}
          {(isMobile || isIpad) && (
            <>
              {isShowLeftContent && (
                <div
                  className={`my-profile-left ${
                    isLoggedIn === LOGIN_STATUS.NOT_LOGIN ? "my-profile-left--not-login" : ""
                  }`}
                >
                  {(customerInfo || customerInfo?.customerLoyaltyPoint || isCustomize) && (
                    <LoyaltyPointCardContainer
                      customerInfo={customerInfo}
                      isCustomize={isCustomize}
                      config={config}
                      loyaltyPoint={loyaltyPoint}
                      isActivated={isActiveLoyaltyPoint}
                    ></LoyaltyPointCardContainer>
                  )}
                  {memoLeftMenuProfilePage}
                </div>
              )}
              {isShowRightContent && <div className="my-profile-right">{renderScreenContent()}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
