import { Button, Form, notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import accountDataService from "../../../../../../data-services/account-data-service";
import customerDataService from "../../../../../../data-services/customer-data.service";
import { getStorage, localStorageKeys, setStorage } from "../../../../../../utils/localStorage.helpers";
import { CheckToastMessagePasswordIcon, UpdatePasswordIcon } from "../../../../../assets/icons.constants";
import { FnbInputPassword } from "../../../../../components/FnbInputPassword";
import { profileTab } from "../../../../../constants/string.constant";
import "../../../profile-page.page.scss";
import "./change-password-toast-message.component.scss";

export default function PasswordProfile(props) {
  const { isNavigate, currentTabInfor, colorGroup, isExistPhoneNumber } = props.data;

  const [api, contextHolder] = notification.useNotification();

  const [t] = useTranslation();
  const [form] = Form.useForm();
  const [isSetupPassword, setIsSetupPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [isCheckPassword, setIsCheckPassword] = useState(false);
  const [isExistPassword, setIsExistPassword] = useState(false);

  const pageData = {
    password: t("storeWebPage.profilePage.password"),
    requiredCharacters: t("storeWebPage.profilePage.requiredCharacters"),
    confirm: t("storeWebPage.profilePage.confirm"),
    cancel: t("storeWebPage.profilePage.cancel"),
    update: t("storeWebPage.profilePage.update"),
    newPassword: t("storeWebPage.profilePage.newPassword"),
    currentPassword: t("storeWebPage.profilePage.currentPassword"),
    enterYourCurrentPassword: t("storeWebPage.profilePage.enterYourCurrentPassword"),
    pleaseEnterTheCurrentPassword: t("storeWebPage.profilePage.pleaseEnterTheCurrentPassword"),
    pleaseEnterTheNewPassword: t("storeWebPage.profilePage.pleaseEnterTheNewPassword"),
    yourAccountHasNotSetUpThePasswordYet: t("storeWebPage.profilePage.yourAccountHasNotSetUpThePasswordYet"),
    setupPassword: t("storeWebPage.profilePage.setupPassword"),
    passWordIsTooShort: t("storeWebPage.profilePage.passWordIsTooShort"),
    theCurrentPasswordIsInvalid: t("storeWebPage.profilePage.theCurrentPasswordIsInvalid"),
    passwordIsSetupSuccessfully: t("storeWebPage.profilePage.passwordIsSetupSuccessfully"),
    passwordIsUpdatedSuccessfully: t("storeWebPage.profilePage.passwordIsUpdatedSuccessfully"),
    pleaseEnterPassword: t("storeWebPage.profilePage.pleaseEnterPassword"),
  };

  useEffect(() => {
    let customerInfoLS = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
    setIsExistPassword(customerInfoLS?.isHasPassword ?? false);
  }, []);

  const getCustomerInformationDetail = async () => {
    let customerInfoLS = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
    let res = await customerDataService.getCustomerInfoAsync();
    if (res?.data) {
      const customerInfo = res?.data;
      if (customerInfo) {
        customerInfoLS = {
          ...customerInfoLS,
          isHasPassword: customerInfo?.isHasPassword,
        };
      }
    }
    setStorage(localStorageKeys.CUSTOMER_INFO, JSON.stringify({ ...customerInfoLS }));
    setIsExistPassword(customerInfoLS?.isHasPassword ?? false);
  };

  const openNotification = (placement, message) => {
    api.success({
      description: message,
      placement,
      closeIcon: false,
      className: "toast-message-calculation-change-password",
      icon: <CheckToastMessagePasswordIcon></CheckToastMessagePasswordIcon>,
      style: { width: "100%", left: "0%" },
    });
  };

  const onUpdatePassword = async () => {
    try {
      const values = await form.validateFields();
      const objectValues = {
        newPassword: values.newPassword ?? "",
        currentPassword: values.currentPassword ?? "",
      };
      const response = await accountDataService.updateAccountPasswordAsync(objectValues);
      if (response?.data?.success === true) {
        objectValues?.currentPassword !== ""
          ? openNotification("bottom", pageData.passwordIsUpdatedSuccessfully)
          : openNotification("bottom", pageData.passwordIsSetupSuccessfully);
        getCustomerInformationDetail();
        clearDataForm();
      }
    } catch (errors) {}
  };

  function clearDataForm() {
    form.setFieldValue("newPassword", "");
    form.setFieldValue("currentPassword", "");
  }

  async function handleValidataionPassword(password) {
    try {
      if (password.length === 0) {
        return false;
      }
      var response = await accountDataService.updateAccountPasswordAsync({
        currentPassword: password,
        newPassword: "",
      });

      if (response?.data?.errorCode === 0 && !response?.data?.success) {
        setCurrentPasswordError("");
        setIsCheckPassword(false);
      } else {
        setIsCheckPassword(true);
        setCurrentPasswordError(pageData.theCurrentPasswordIsInvalid);
      }
    } finally {
    }
  }

  const validatePassword = (rule, value) => {
    if (isCheckPassword) {
      return Promise.reject(currentPasswordError);
    }
    return Promise.resolve();
  };

  return (
    <>
      {contextHolder}
      {isExistPassword ? (
        <div
          className={`profile-right-side bottom
            ${!isNavigate && "mobile-d-none tablet-d-none"}
            ${currentTabInfor === profileTab.myAddress && "mobile-address-content"}
            ${currentTabInfor === profileTab.myOrder && "profile-right-side-order-detail"}`}
        >
          {currentTabInfor === profileTab.myAccount && (
            <>
              <Form form={form} className="my-profile-info">
                <div className="profile-card-title" style={{ color: colorGroup?.titleColor }}>
                  {pageData.password}
                </div>

                <div className="profile-card-row current-password">
                  <div className="profile-card-label" style={{ color: colorGroup?.textColor }}>
                    {pageData.currentPassword}
                  </div>
                  <Form.Item
                    className="profile-card-form-input"
                    name="currentPassword"
                    rules={[
                      {
                        required: true,
                        message: pageData.pleaseEnterTheCurrentPassword,
                      },
                      {
                        type: "string",
                        max: 100,
                        min: 6,
                        message: pageData.passWordIsTooShort,
                      },
                      {
                        validator: validatePassword,
                      },
                    ]}
                  >
                    <FnbInputPassword
                      className={"profile-text-input"}
                      placeholder={pageData.enterYourCurrentPassword}
                      isCustomize={true}
                      maxLength={100}
                      minLength={6}
                      value={currentPassword}
                      onBlur={(e) => {
                        handleValidataionPassword(e.target.value);
                        setTimeout(() => {
                          form.validateFields(["currentPassword"]);
                        }, 500);
                      }}
                    />
                  </Form.Item>
                </div>

                <div className="profile-card-row">
                  <div className="profile-card-label" style={{ color: colorGroup?.textColor }}>
                    {pageData.newPassword}
                  </div>
                  <Form.Item
                    className="profile-card-form-input"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: pageData.pleaseEnterTheNewPassword,
                      },
                      {
                        type: "string",
                        max: 100,
                        min: 6,
                        message: pageData.passWordIsTooShort,
                      },
                    ]}
                  >
                    <FnbInputPassword
                      className={"profile-text-input"}
                      placeholder={pageData.requiredCharacters}
                      maxLength={100}
                      minLength={6}
                      isCustomize={true}
                    />
                  </Form.Item>
                </div>

                <div className="btn-password">
                  <div>
                    <Button
                      onClick={() => onUpdatePassword()}
                      htmlType="button"
                      disabled={isExistPhoneNumber}
                      className="btn-update-password"
                      style={{
                        color: colorGroup?.buttonTextColor,
                        backgroundColor: colorGroup?.buttonBackgroundColor,
                        border: colorGroup?.buttonBorderColor + "1px solid",
                        cursor: isExistPhoneNumber ? "default" : "",
                      }}
                    >
                      {pageData.update}
                    </Button>
                  </div>
                </div>
              </Form>
            </>
          )}
        </div>
      ) : (
        <div
          className={`profile-right-side bottom
            ${!isNavigate && "mobile-d-none tablet-d-none"}
            ${currentTabInfor === profileTab.myAddress && "mobile-address-content"}
            ${currentTabInfor === profileTab.myOrder && "profile-right-side-order-detail"}`}
        >
          {currentTabInfor === profileTab.myAccount && (
            <>
              <Form form={form} className="my-profile-info">
                {isSetupPassword ? (
                  <div>
                    <div className="profile-card-title" style={{ color: colorGroup?.titleColor }}>
                      {pageData.password}
                    </div>

                    <div className="profile-card-row">
                      <div className="profile-card-label" style={{ color: colorGroup?.textColor }}>
                        {pageData.password}
                      </div>
                      <Form.Item
                        className="profile-card-form-input"
                        name="newPassword"
                        rules={[
                          {
                            required: true,
                            message: pageData.pleaseEnterPassword,
                          },
                          {
                            type: "string",
                            max: 100,
                            min: 6,
                            message: pageData.passWordIsTooShort,
                          },
                        ]}
                      >
                        <FnbInputPassword
                          className={"profile-text-input"}
                          placeholder={pageData.requiredCharacters}
                          maxLength={100}
                          minLength={6}
                          isCustomize={true}
                        />
                      </Form.Item>
                    </div>

                    <div className="btn-password">
                      <div>
                        <Button
                          disabled={isExistPhoneNumber}
                          className="btn-cancel"
                          onClick={() => {
                            setIsSetupPassword(false);
                          }}
                        >
                          <span className="content">{pageData.cancel}</span>
                        </Button>
                      </div>
                      <div>
                        <Button
                          onClick={() => onUpdatePassword()}
                          htmlType="button"
                          disabled={isExistPhoneNumber}
                          className="btn-update-password"
                          style={{
                            color: colorGroup?.buttonTextColor,
                            backgroundColor: colorGroup?.buttonBackgroundColor,
                            border: colorGroup?.buttonBorderColor + "1px solid",
                            cursor: isExistPhoneNumber ? "default" : "",
                          }}
                        >
                          {pageData.confirm}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="profile-card-title" style={{ color: colorGroup?.titleColor }}>
                      {pageData.password}
                    </div>
                    <div className="profile-password-setup">
                      <div>
                        <UpdatePasswordIcon />
                      </div>
                      <div className="title-warning">{pageData.yourAccountHasNotSetUpThePasswordYet}</div>
                      <div
                        className="title-setup"
                        onClick={() => {
                          setIsSetupPassword(true);
                        }}
                      >
                        {pageData.setupPassword}
                      </div>
                    </div>
                  </>
                )}
              </Form>
            </>
          )}
        </div>
      )}
    </>
  );
}
