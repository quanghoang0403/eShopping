import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { LogOutProfileIcon, MyReservationIcon } from "../assets/icons.constants";
import "./login-popover.component.scss";
export default function LoginPopover(props) {
  const { groupColorConfig, isAllowReserveTable } = props;
  const [t] = useTranslation();
  const history = useHistory();
  const pageData = {
    loginOrRegister: t("loginPage.loginOrRegister", "Login / Register"),
    myReservation: t("reservation.myReservation", "My reservations"),
  };
  const StyledTextLogin = styled.span`
    color: ${groupColorConfig?.textColor ? groupColorConfig?.textColor : "#282828"};
    &:hover {
      color: ${groupColorConfig?.buttonBackgroundColor ? groupColorConfig?.buttonBackgroundColor : "#DB4D29"};
    }
  `;
  return (
    <>
      <div className="login_content_theme2">
        {isAllowReserveTable && (
          <div className="item-content" onClick={() => history.push("/my-profile/5")}>
            <MyReservationIcon className="icon" />
            <div className="title my-reservation">
              <StyledTextLogin>{pageData.myReservation}</StyledTextLogin>
            </div>
          </div>
        )}

        <div
          className="item-content"
          onClick={() => {
            history.push("/login");
          }}
        >
          <LogOutProfileIcon className="icon" />
          <div className="title">
            <StyledTextLogin>{pageData.loginOrRegister}</StyledTextLogin>
          </div>
        </div>
      </div>
    </>
  );
}
