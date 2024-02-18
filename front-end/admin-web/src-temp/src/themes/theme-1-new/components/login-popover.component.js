import { useTranslation } from "react-i18next";
import { LogoutIcon, ReservationMyProfile } from "../assets/icons.constants";
import "./login-popover.component.scss";
import { profileTabTheme1 } from "../constants/string.constants";
import { useSelector } from "react-redux";
import { storeConfigSelector } from "../../modules/session/session.reducers";

export default function LoginPopover(props) {
  const [t] = useTranslation();
  const urlMyProfile = "my-profile";
  const pageData = {
    loginOrRegister: t("loginPage.loginOrRegister", "Login / Register"),
    myReservations: t("reserve.myReservations", "My Reservations"),
  };
  const isAllowReserveTable = useSelector(storeConfigSelector)?.isAllowReserveTable;

  return (
    <div className="login_content_theme1-wrapper">
      {isAllowReserveTable ? (
        <a
          href={`/${urlMyProfile}/${profileTabTheme1.myReservations}`}
          className="login_content_theme1 login_content_theme1__icon-reservation"
        >
          <ReservationMyProfile className="icon" />
          <div className="title">{pageData.myReservations}</div>
        </a>
      ) : (
        <></>
      )}
      <a href="/login" className="login_content_theme1">
        <LogoutIcon className="icon" />
        <div className="title">{pageData.loginOrRegister}</div>
      </a>
    </div>
  );
}
