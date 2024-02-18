import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const LoginFooter = (props) => {
  const { onClick, isLoginForm, themePageConfig } = props;
  const { t } = useTranslation();

  const Footer = styled.div`
     {
      margin-top: 10px;
      display: flex;
      align-content: center;
      justify-content: center;
      width: 100%;
      .register-link {
        padding-left: 4px;
        padding-right: 4px;
        text-decoration: underline;
      }
    }
  `;

  return (
    <Footer>
      <Typography.Text>{isLoginForm ? t("loginPage.haveNotAccount") : t("loginPage.haveAccount")}</Typography.Text>
      <Typography.Link
        className="register-link"
        onClick={onClick}
        style={{ color: `${themePageConfig?.colorGroup?.buttonBackgroundColor}` }}
      >
        {isLoginForm ? t("loginPage.register") : t("loginPage.login")}
      </Typography.Link>
      <Typography.Text>{t("loginPage.here")}</Typography.Text>
    </Footer>
  );
};
