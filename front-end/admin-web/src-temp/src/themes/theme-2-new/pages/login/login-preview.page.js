import { Button, Input } from "antd";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Index from "../../index";

import "./login.style.scss";

export default function LoginPage(props) {
  const [t] = useTranslation();
  const pageData = {
    login: t("storeWebPage.login.buttonLogin"),
    phoneNumber: t("storeWebPage.phoneNumber"),
  };
  const StyledLoginPage = styled.div`
    background: ${(props) =>
      props?.theme?.config?.backgroundType === 1
        ? props?.theme?.config?.backgroundColor
        : "url(" + props?.theme?.config?.backgroundImage + ") no-repeat top"};
    background-size: cover;
    .login-page-title {
      color: ${(props) => props?.theme?.config?.colorGroup?.titleColor};
    }
    .login-page-btn {
      background-color: ${(props) => props?.theme?.config?.colorGroup?.buttonBackgroundColor};
      border: ${(props) => "1px solid " + props?.theme?.config?.colorGroup?.buttonBorderColor} !important;
    }
    .login-page-btn span {
      color: ${(props) => props?.theme?.config?.colorGroup?.buttonTextColor};
    }
  `;

  return (
    <Index
      {...props}
      contentPage={(props) => {
        return (
          <StyledLoginPage className="login-page-wrapper">
            <div className="login-page-container-theme2">
              <h2 className="login-page-title">{props?.config?.title}</h2>
              <Input placeholder={pageData.phoneNumber} className="login-page-input" />
              <Button type="submit" className="login-page-btn">
                <span>{pageData.login}</span>
              </Button>
            </div>
          </StyledLoginPage>
        );
      }}
    />
  );
}
