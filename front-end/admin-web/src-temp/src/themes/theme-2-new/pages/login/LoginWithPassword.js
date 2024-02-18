import { Button, Form, Tabs } from "antd";
import { FnbInputPassword } from "../../components/FnbInputPassword";
import { FnbInput } from "../../components/fnb-input/fnb-input.component";
import { theme2ElementCustomize } from "../../constants/store-web-page.constants";
import loginPhoneIcon from "../../assets/icons/login_phone.svg";
import styled from "styled-components";

function LoginWithPassword({ t, style, clickToFocusCustomize, colorGroup, handleLogin, handleChangeLoginMode }) {
  const items = [
    {
      key: "1",
      label: t("loginPage.loginByAccount", "Đăng nhập bằng tài khoản"),
    },
    {
      key: "2",
      label: t("loginPage.loginByPhone", "Đăng nhập bằng điện thoại"),
    },
  ];

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
            .ant-tabs-ink-bar {
              border-bottom: 3px solid ${colorGroup?.buttonBackgroundColor};
            }
          }
        }
      }
    }
  `;

  return (
    <div
      style={style}
      className="login-page-wrapper"
      onClick={() => {
        if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.LoginPage);
      }}
    >
      <div className="login-page-container-theme2 ">
        <div className="login_page_theme2">
          <div className="login_title login-page-title" style={{ color: colorGroup?.textColor }}>
            {t("loginPage.login", "Đăng nhập")}
          </div>
          <StyledLogin>
            <Tabs
              className="tab-login-account-theme2"
              defaultActiveKey="1"
              items={items}
              onChange={handleChangeLoginMode}
            />
          </StyledLogin>

          <div className="login_detail">
            <Form onFinish={handleLogin}>
              <Form.Item
                name="userName"
                rules={[
                  {
                    required: true,
                    message: t("enterUserName"),
                  },
                ]}
              >
                <FnbInput
                  autoFocus={true}
                  allowClear={true}
                  className="fnb-input-theme"
                  placeholder={t("enterUserName")}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("enterPassword"),
                  },
                ]}
              >
                <FnbInputPassword className="fnb-input-theme" placeholder={t("enterPassword")} />
              </Form.Item>

              <div className="login_button_box">
                <Button
                  htmlType="submit"
                  className="login_button login-page-btn"
                  style={{
                    color: colorGroup?.buttonTextColor,
                    backgroundColor: colorGroup?.buttonBackgroundColor,
                    border: `1px solid ${colorGroup?.buttonBorderColor}`,
                  }}
                >
                  <span>{t("loginPage.login", "Đăng nhập")}</span>
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginWithPassword;
