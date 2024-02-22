import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, message, Space } from "antd";
import { useState } from "react";
// import userDataService from "../../../data-services/user/user-data.service";

import "./update-password.scss";

export function UpdatePasswordComponent(props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const pageData = {
    title: "Cập nhật mật khẩu",
    currentPassword: "Mật khẩu hiện tại",
    placeholderCurrentPassword: "Nhập mật khẩu hiện tại",
    showEmptyCurrentPassword: "Vui lòng nhập mật khẩu hiện tại",
    showWrongCurrentPassword: "Mật khẩu không đúng",
    newPassword: "Mật khẩu mới",
    placeholderNewPassword: "Nhập mật khẩu mới",
    showEmptyNewPassword: "Vui lòng nhập mật khẩu mới",
    confirmPassword: "Nhập lại mật khẩu mới",
    placeholderConfirmPassword: "Nhập lại mật khẩu mới",
    showConfirmNewPassword: "Vui lòng nhập lại mật khẩu mới",
    showNotMatchPassword: "Nhập lại mật khẩu và mật khẩu mới phải giống nhau",
    showThanksMessage: "Mật khẩu đã cập nhật thành công",
    showUpdateFailedMessage: "Mật khẩu cập nhật thất bại"
  };

  async function handleUpdate(e) {
    try {
      // var initData = await userDataService.updatePasswordAsync({
      //   currentPassword,
      //   newPassword,
      //   confirmPassword,
      // });

      // if (initData !== true) {
      //   message.warning(pageData.showUpdateFailedMessage);
      // } else {
      //   message.warning(pageData.showThanksMessage);
      //   setCurrentPassword("");
      //   setNewPassword("");
      //   setConfirmPassword("");
      // }
    } catch (error) {
      message.warning(pageData.showUpdateFailedMessage);
    }
  }

  async function handleValidataionPassword(password) {
    try {
      if (password.length === 0) {
        return false;
      }
      // var initData = await userDataService.validationPasswordAsync({
      //   currentPassword: password,
      // });

      // if (initData !== true) {
      //   setCurrentPasswordError(pageData.showWrongCurrentPassword);
      // } else {
      //   setCurrentPasswordError("");
      // }
    } finally {
      setPasswordFocus(false);
    }
  }

  function validataionPassword(value) {
    setCurrentPassword(value);
    if (value === "" || value.length < 1) {
      setCurrentPasswordError(pageData.showEmptyCurrentPassword);
      return;
    }
    setCurrentPasswordError("");
  }

  function validataionNewPassword(value) {
    setNewPassword(value);
    setConfirmPassword("");
    if (value.length === "" || value.length < 1) {
      setNewPasswordError(pageData.showEmptyNewPassword);
      return;
    }
    setNewPasswordError("");
  }

  function validataionConfirmPassword(value) {
    setConfirmPassword(value);
    if (value.length === "" || value.length < 1) {
      setConfirmPasswordError(pageData.showConfirmNewPassword);
      return;
    } else if (value.length > 0 && value !== newPassword) {
      setConfirmPasswordError(pageData.showNotMatchPassword);
      return;
    }
    setConfirmPasswordError("");
  }

  const renderError = (message) => {
    return (
      <div className="ant-form-item-explain-error up-error">{message}</div>
    );
  };

  const renderButton = () => {
    const condition = [
      currentPasswordError?.length === 0,
      newPasswordError?.length === 0,
      confirmPasswordError?.length === 0,
      currentPassword?.length > 0,
      newPassword?.length > 0,
      confirmPassword?.length > 0,
    ];
    if (condition.every((v) => v === true) && passwordFocus === false) {
      return (
        <div className="btn-wraper">
          <Button
            className="up-btn"
            visible={true}
            onClick={handleUpdate}
            type="dashed"
            shape="default"
            size="small"
          >
            update
          </Button>
        </div>
      );
    }
    return <div className="btn-wraper"></div>;
  };

  return (
    <div className="c-update-password c-update-password--border c-update-password--spacing">
      <div
        className="up-header up-header--spacing"
        size={"large"}
        align="baseline"
      >
        <h4 className="title-group title">{pageData.title}</h4>
        {renderButton()}
      </div>

      <div className="up-content">
        <div className="up-content-wrap up-content-wrap--spacing">
          <Space
            direction="vertical"
            className="up-content-wrap-textbox up-content-wrap-textbox--spacing"
          >
            <label className="fnb-form-label up-content-wrap-textbox-label">
              {pageData.currentPassword}
              <span className="text-danger">*</span>
            </label>
            <Input.Password
              className="up-content-wrap-textbox-input"
              placeholder={pageData.placeholderCurrentPassword}
              iconRender={(visible) =>
                visible && currentPassword?.length > 0 ? <EyeInvisibleOutlined /> : <EyeTwoTone />
              }
              value={currentPassword}
              onChange={(e) => validataionPassword(e.target.value)}
              onBlur={(e) => handleValidataionPassword(e.target.value)}
              onFocus={(e) => setPasswordFocus(true)}
              maxLength={100}
            />
            {renderError(currentPasswordError)}
          </Space>
        </div>

        <div className="up-content-wrap up-content-wrap--spacing">
          <Space
            direction="vertical"
            className="up-content-wrap-textbox up-content-wrap-textbox--spacing"
          >
            <label className="fnb-form-label up-content-wrap-textbox-label">
              {pageData.newPassword}
              <span className="text-danger">*</span>
            </label>
            <Input.Password
              className="up-content-wrap-textbox-input"
              placeholder={pageData.placeholderNewPassword}
              iconRender={(visible) =>
                visible && newPassword?.length > 0 ? <EyeInvisibleOutlined /> : <EyeTwoTone />
              }
              onChange={(e) => validataionNewPassword(e.target.value)}
              value={newPassword}
              maxLength={100}
            />
            {renderError(newPasswordError)}
          </Space>
          <Space
            direction="vertical"
            className="up-content-wrap-textbox up-content-wrap-textbox--spacing"
          >
            <label className="fnb-form-label up-content-wrap-textbox-label">
              {pageData.confirmPassword}
              <span className="text-danger">*</span>
            </label>
            <Input.Password
              className="up-content-wrap-textbox-input"
              placeholder={pageData.placeholderConfirmPassword}
              value={confirmPassword}
              iconRender={(visible) =>
                visible && confirmPassword?.length > 0 ? <EyeInvisibleOutlined /> : <EyeTwoTone />
              }
              onChange={(e) => validataionConfirmPassword(e.target.value)}
              maxLength={100}
            />
            {renderError(confirmPasswordError)}
          </Space>
        </div>
      </div>
    </div>
  );
}
