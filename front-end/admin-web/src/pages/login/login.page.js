import { Button, Form, Image, Input, message, Row, Select } from "antd";
import "antd/dist/antd.css";
import jwt_decode from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  EyeIcon,
  EyeOpenIcon,
  LockIcon,
  UserNameIcon,
} from "constants/icons.constants";
import {
  resetSession,
  setAuth,
  setPermissionGroup,
  setPermissions,
  setToken,
} from "store/modules/session/session.actions";
import { getParamsFromUrl, tokenExpired } from "utils/helpers";
import { getStorage, localStorageKeys } from "utils/localStorage.helpers";
import { claimTypesConstants } from "../../constants/claim-types.constants";
import loginDataService from "../../data-services/login/login-data.service";
import permissionDataService from "data-services/permission/permission-data.service";
import "../../stylesheets/authenticator.scss";
import logo from "assets/images/logo.png";

const LoginPage = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const { search } = props.location;
    const params = getParamsFromUrl(search);
    const { username } = params;
    if (username) {
      form.setFieldsValue({
        userName: username,
      });
    }
    handleRedirectWithToken();
  }, []);

  const setUserAuth = (auth, token, permissions) => {
    dispatch(setAuth(auth));
    dispatch(setToken(token));
    dispatch(setPermissions(permissions));
  };

  const onFinish = (values) => {
    loginDataService
      .authenticate(values)
      .then((res) => {
        const { token, thumbnail } = res;
        var user = getUserInfo(token);
        var auth = {
          ...user,
          thumbnail: thumbnail,
        };
        setupWorkspace(token, auth);
      })
      .catch(() => {});
  };

  const getUserInfo = (token) => {
    let claims = jwt_decode(token);
    let user = {
      userId: claims[claimTypesConstants.id],
      accountId: claims[claimTypesConstants.accountId],
      fullName: claims[claimTypesConstants.fullName],
      email: claims[claimTypesConstants.email],
      accountType: claims[claimTypesConstants.accountType],
      thumbnail: claims[claimTypesConstants.thumbnail],
    };
    return user;
  };


  const setupWorkspace = (token, userInfo) => {
    let auth = { token: token, user: userInfo };
    /// get permissions
    permissionDataService.getPermissionsAsync(token).then((res) => {
      const { permissions, permissionGroups } = res;
      if (permissions.length > 0 && permissionGroups.length > 0) {
        message.success("Bạn đã đăng nhập thành công.");
        dispatch(setPermissionGroup(permissionGroups));
        setUserAuth(auth, token, permissions);
        props.history.push("/home");
      } else {
        message.error("Xin lỗi! Nhưng bạn không có quyền truy cập vào trang này.");
      }
    });
  };

  const checkTokenExpired = () => {
    let isTokenExpired = true;
    let token = getStorage(localStorageKeys.TOKEN);
    if (token || token !== null) {
      isTokenExpired = tokenExpired(token);
    }
    return isTokenExpired;
  };

  const handleRedirectWithToken = () => {
    let isTokenExpired = checkTokenExpired();
    if (isTokenExpired) {
      dispatch(resetSession());
    } else {
      props.history.push("/home");
    }
  };

  return (
    <div className="c-authenticator">
      <div className="form-logo">
        <div>
          <Image preview={false} src={logo} width={300} />
        </div>
      </div>
      <div className="div-form login-contain login-contain__right">
        <Form
          className="login-form login-inner login-inner__spacing"
          name="basic"
          autoComplete="off"
          onFinish={onFinish}
          form={form}
        >
          <div className="frm-content">


            {!isLogin && (
              <div className="error-field">
                <p>Bạn đã nhập sai Username hoặc Password.</p>
              </div>
            )}

            <h1 className="label-login">Đăng nhập</h1>
            <h4 className="label-input">Email</h4>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email",
                },
                {
                  type: "email",
                  message: "Vui lòng nhập mật khẩu",
                },
              ]}
            >
              <Input prefix={<UserNameIcon />} placeholder="Nhập email của bạn" />
            </Form.Item>

            <h4 className="label-input">Mật khẩu</h4>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập password",
                },
              ]}
            >
              <Input.Password
                prefix={<LockIcon />}
                iconRender={(visible) => (visible ? <EyeOpenIcon /> : <EyeIcon />)}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                ĐĂNG NHẬP
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
