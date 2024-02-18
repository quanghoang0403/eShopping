import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import { setUserInfo } from "../../../modules/session/session.actions";
import { storeConfigSelector } from "../../../modules/session/session.reducers";
import { firebase } from "../../../utils/firebase";
import { getStorage, localStorageKeys, removeStorage } from "../../../utils/localStorage.helpers";
import { AccountInformationIcon, AddressListIcon, LogoutIcon, OrdersIcon, ReservationMyProfile } from "../../assets/icons.constants";
import { profileTabTheme1 } from "../../constants/string.constants";
import "./account.component.scss";

export function AccountComponent(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const urlMyProfile = "/my-profile";
  const isMobile = useMediaQuery({ maxWidth: 740 });
  const dispatch = useDispatch();
  const customerInfo = useSelector((state) => state.session?.userInfo ?? null);
  const isAllowReserveTable = useSelector(storeConfigSelector)?.isAllowReserveTable;

  const translateData = {
    accountInformation: t("myProfile.accountInfo.accountInformation", "Account information"),
    order: t("myProfile.accountInfo.order", "Order"),
    addressList: t("myProfile.accountInfo.addressList", "Address list"),
    logout: t("myProfile.accountInfo.logout", "Logout"),
    editProfile: t("myProfile.accountInfo.editProfile", "Edit profile"),
    myReservations: t("reserve.myReservations", "My Reservations"),
  };

  useEffect(() => {
    if (customerInfo) {
      if (customerInfo?.firstName === null || customerInfo?.firstName === "") {
        const customerInfoLS = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
        dispatch(setUserInfo(customerInfoLS));
      }
    }
  }, [customerInfo]);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        removeStorage(localStorageKeys.LOGIN);
        removeStorage(localStorageKeys.TOKEN);
        removeStorage(localStorageKeys.CUSTOMER_INFO);
        dispatch(setUserInfo(null));
        let pathname = window.location.pathname;
        if (pathname === "/" || pathname === "/home") {
          window.location.replace("/");
        } else {
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="account-header-theme1-container">
        <div className="account-info">
          <img
            preview={false}
            alt=""
            src={
              JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.thumbnail ??
              "/images/default-theme/avatar-profile-default.png"
            }
          />
          <div className="account-name">
            <span className="text-line-clamp-2">{`${customerInfo?.firstName ?? ""} ${
              customerInfo?.lastName ?? ""
            }`}</span>
            <a href={urlMyProfile}>{translateData.editProfile}</a>
          </div>
        </div>
        <div className="account-list">
          {isMobile && (
            <a href={`${urlMyProfile}/${profileTabTheme1.accountInformation}`} className="account-title">
              <span>
                <AccountInformationIcon />
              </span>
              {translateData.accountInformation}
            </a>
          )}
          <a href={`${urlMyProfile}/${profileTabTheme1.orders}`} className="account-title">
            <span>
              <OrdersIcon />
            </span>
            {translateData.order}
          </a>
          {isAllowReserveTable ? (
            <a href={`${urlMyProfile}/${profileTabTheme1.myReservations}`} className="account-title">
              <span>
                <ReservationMyProfile />
              </span>
              {translateData.myReservations}
            </a>
          ) : (
            <></>
          )}
          <a href={`${urlMyProfile}/${profileTabTheme1.addressList}`} className="account-title">
            <span>
              <AddressListIcon />
            </span>
            {translateData.addressList}
          </a>
          <a className="account-title" href onClick={() => handleLogout()}>
            <span>
              <LogoutIcon />
            </span>
            {translateData.logout}
          </a>
        </div>
      </div>
    </>
  );
}
