import { Button, message, notification, Input, Form } from "antd";
import { FnbNotifyDialog } from "components/fnb-notify-dialog/fnb-notify-dialog.component";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { PublishNotificationIcon } from "constants/icons.constants";
import { SignalRListenerConstants } from "constants/signalR-listener.constants";
import { DateFormat } from "constants/string.constants";
import { EnumStoreThemeStatus } from "constants/store-theme.constants";
import onlineStoreDataService from "data-services/online-store/online-store-data.service";
import themeDataService from "data-services/theme/theme-data.service";
import moment from "moment";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "services/auth.service";
import adminSocket from "sockets/admin-socket";
import { setInformationPublishStore } from "store/modules/session/session.actions";
import { convertUtcToLocalTime } from "utils/helpers";
import { PencilBlur } from "constants/icons.constants";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import "./store-theme-list.scss";
import { localStorageKeys } from "utils/localStorage.helpers";

export const StoreThemeList = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();
  const loggedUserInfo = getUserInfo();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [themeList, setThemeList] = useState([]);
  const [openFnbNotifyDialog, setOpenFnbNotifyDialog] = useState(false);
  const [publishStoreThemeId, setPublishStoreThemeId] = useState(null);
  const [isDisabledPublishButton, setIsDisabledPublishButton] = useState(false);
  const [indexShowEditStoreWebName, setIndexShowEditStoreWebName] = useState(-1);
  const [themeNameChanged, setThemeNameChanged] = useState("");
  const [publishedExpiredTime, setPublishedExpiredTime] = useState(null);
  const [form] = Form.useForm();

  const notificationKey = {
    PUBLISH_DOMAIN_INFO: 1,
    PUBLISH_WAITING_DIALOG: 2,
  };

  const translateData = {
    title: t("onlineStore.myTheme.title", "My theme"),
    onlineStoreMessagePublished: t("onlineStore.message.published", "Your store website published to"),
    createTime: t("onlineStore.myTheme.createTime", "Create time"),
    button: {
      addTheme: t("onlineStore.myTheme.button.addTheme", "Add theme"),
      publish: t("onlineStore.myTheme.button.publish", "Publish"),
      customize: t("onlineStore.myTheme.button.customize", "Customize"),
      ignore: t("button.ignore", "Ignore"),
      delete: t("button.delete", "Delete"),
      save: t("button.save", "Save"),
    },
    requireThemeNameMessage: t("onlineStore.myTheme.requireThemeNameMessage", "Please enter name for theme"),
    publish: {
      notification: t("theme.publish.notification", "Notification"),
      confirmMessage: t("theme.publish.confirmMessage", "Do you really want to publish this theme?"),
      customerWillSee: t(
        "theme.publish.customerWillSee",
        "Your customers will see this theme when they visit your online store."
      ),
      errorMessage: t("theme.publish.errorMessage", "Please wait a minute before publishing theme again!"),
      notifyMessage: t("theme.publish.notifyMessage", "Your customization will be updated after at least two minutes."),
      inProgress: t("theme.publish.inProgress", "The website is progress for publishing, it will take several minutes"),
      successMessage: t("theme.publish.successMessage", "Publish website successfully!"),
      failMessage: t("theme.publish.failMessage", "Publish website failed, please try again after few minutes!"),
      wellDone: t("theme.publish.wellDone", "Well done!"),
    },
    confirmDelete: {
      confirmationDeleteTitle: t("messages.pageConfirmationDeleteTitle"),
      confirmDeleteThemeContent: t("onlineStore.myTheme.confirmDelete.confirmDeleteThemeContent"),
    },
    messages: {
      updateSuccess: t("messages.updateSuccess"),
      updateFailed: t("messages.updateFailed"),
      deleteSuccess: t("onlineStore.myTheme.deleteThemeSuccess"),
      deleteFailed: t("onlineStore.myTheme.deleteThemeFail"),
    },
    enterThemeName: t("onlineStore.myTheme.enterThemeName"),
  };

  useImperativeHandle(ref, () => ({
    setMyThemeData(data, isCurrentThemePublishing) {
      setThemeList(data);
      if (isCurrentThemePublishing === true) {
        openPublishNotification();
        setIsDisabledPublishButton(true);
      }
    },
  }));

  useEffect(() => {
    if (publishedExpiredTime) {
      window.publishedExpiredTime = setInterval(() => {
        if (moment().isAfter(publishedExpiredTime)) {
          message.error(translateData.publish.failMessage);
          notification.close(notificationKey.PUBLISH_WAITING_DIALOG);
          setIsDisabledPublishButton(false);
          clearInterval(window.publishedExpiredTime);
        }
      }, 1000);
    }
    //Clearing the interval
    return () => clearInterval(window.publishedExpiredTime);
  }, [publishedExpiredTime]);

  useEffect(() => {
    initSocket();
    var publishCurrentThemeId = localStorage.getItem(localStorageKeys.PUBLISH_CURRENT_THEME_ID);
    if (publishCurrentThemeId) {
      publishStoreTheme(publishCurrentThemeId);
    }

    //Clean socket
    return () => {
      cleanSocket();
    };
  }, []);

  const initSocket = async () => {
    try {
      if (loggedUserInfo) {
        let userInfo = {
          storeId: loggedUserInfo?.storeId,
        };

        adminSocket.on(SignalRListenerConstants.PUBLISH_STORE_THEME, (isSuccess) => {
          if (isSuccess === true) {
            message.success(translateData.publish.successMessage);
          } else {
            message.error(translateData.publish.failMessage);
          }

          reloadDataStoreTheme();
          setIsDisabledPublishButton(false);
          notification.close(notificationKey.PUBLISH_WAITING_DIALOG);
          clearInterval(window.publishedExpiredTime);
          props.updateCurrentTheme();
        });

        await adminSocket.start();
        await adminSocket.invoke("JoinRoom", userInfo);
      }
    } catch (error) {}
  };

  const cleanSocket = () => {
    try {
      adminSocket.off(SignalRListenerConstants.PUBLISH_STORE_THEME);
    } catch (err) {
      message.error(err);
    }
  };

  /// Init form value
  const setFormValues = (item) => {
    form.setFieldsValue({
      name: item?.name,
    });
  };

  const reloadDataStoreTheme = async () => {
    const res = await onlineStoreDataService.getStoreThemesAsync();
    if (res) {
      const { storeThemes } = res;
      const result = storeThemes.filter((themeData) => themeData.isPublished === false);
      setThemeList(result);
    }
  };

  const formatCreateTime = (createdTime) => {
    let timeFormat = "-";
    const d = new Date();
    let day = d.getDate();

    if (createdTime) {
      const utcDate = moment.utc(createdTime).local().date();

      // If day is today, show time only
      if (day === utcDate) {
        timeFormat = convertUtcToLocalTime(createdTime).format(DateFormat.HH_MM);
      } else {
        timeFormat = convertUtcToLocalTime(createdTime).format(DateFormat.DD_MM_YYYY);
      }
    }

    return timeFormat;
  };

  const openNotification = (message) => {
    notificationApi.info({
      message: translateData.publish.notification,
      description: message,
      placement: "topRight",
      key: notificationKey.PUBLISH_DOMAIN_INFO,
      maxCount: 1,
    });
  };

  const closeNotification = () => {
    notification.close(notificationKey.PUBLISH_DOMAIN_INFO);
  };

  const openPublishNotification = () => {
    notification.destroy(notificationKey.PUBLISH_WAITING_DIALOG);
    notificationApi.open({
      duration: 9999,
      message: translateData.publish.wellDone,
      description: translateData.publish.inProgress,
      placement: "top",
      className: "publish-notification-box",
      key: notificationKey.PUBLISH_WAITING_DIALOG,
      icon: <PublishNotificationIcon />,
      closeIcon: <></>,
      maxCount: 1,
    });
  };

  const onClickEditStoreWebName = (index, item) => {
    setIndexShowEditStoreWebName(index);
    setThemeNameChanged(item?.name);
    setFormValues(item);
  };

  const handleDeleteTheme = async (id) => {
    var res = await onlineStoreDataService.deleteThemeByIdAsync(id);
    if (res) {
      message.success(translateData.messages.deleteSuccess);
      reloadDataStoreTheme();
    } else {
      message.error(translateData.messages.deleteFailed);
    }
  };

  const onClickSaveThemeName = async (id) => {
    form.validateFields().then(async () => {
      const data = { storeThemeId: id, storeThemeName: themeNameChanged };
      let response = await onlineStoreDataService.updateThemeName(data);
      if (response) {
        message.success(translateData.messages.updateSuccess);
        reloadDataStoreTheme();
        setIndexShowEditStoreWebName(-1);
      } else {
        message.error(translateData.messages.updateFailed);
      }
      setThemeNameChanged("");
    });
  };

  const handleChangeThemeName = (event) => {
    setThemeNameChanged(event.target.value);
  };

  const publishStoreTheme = async (publishStoreThemeId) => {
    if (publishStoreThemeId) {
      setOpenFnbNotifyDialog(false);
      const response = await themeDataService.publishStoreWebAsync(publishStoreThemeId);
      const { isSuccess, domain } = response;
      if (response && isSuccess) {
        let infoStore = reduxState?.session?.informationPublishStore;
        //save redux information store
        dispatch(setInformationPublishStore({ ...infoStore, domainName: domain }));
        const message = (
          <p>
            {translateData.onlineStoreMessagePublished}
            <a
              href={domain}
              target="_blank"
              style={{ paddingLeft: "5px" }}
              rel="noreferrer"
              onClick={closeNotification}
            >
              {domain}
            </a>
            <br />
            {translateData.publish.notifyMessage}
          </p>
        );
        openNotification(message);
        openPublishNotification();
        reloadDataStoreTheme();
        setIsDisabledPublishButton(true);

        ///Set publish expired time
        if (response?.publishExpiredTime) {
          const expiredTime = convertUtcToLocalTime(response?.publishExpiredTime);
          setPublishedExpiredTime(expiredTime);
        }
      } else {
        message.warning(translateData.publish.errorMessage);
      }

      localStorage.removeItem(localStorageKeys.PUBLISH_CURRENT_THEME_ID);
    }
  };

  return (
    <>
      <div className="w-100 my-theme-card">
        <div className="my-theme-header-box">
          <h3 className="my-theme-title mb-0">{translateData.title}</h3>
          <Button className="btn-add-theme float-right" type="primary" onClick={() => props.addNewTheme(true)}>
            {translateData.button.addTheme}
          </Button>
        </div>
      </div>
      <div className="w-100 fnb-card list-theme-card">
        <div className="list-theme-wrapper">
          {themeList?.map((item, index) => {
            return (
              <div key={index} className="list-theme-container">
                <div className="theme-image-box">
                  <Thumbnail src={item?.thumbnail || item?.theme?.thumbnail} width={256} height={156} />
                </div>
                <div className="theme-right-box">
                  <div className="theme-info-box">
                    {indexShowEditStoreWebName === index ? (
                      <Form autoComplete="off" name="basic" form={form}>
                        <Form.Item
                          name={"name"}
                          rules={[
                            {
                              required: true,
                              message: translateData.requireThemeNameMessage,
                            },
                          ]}
                        >
                          <div>
                            <Input
                              className="theme-name"
                              size="large"
                              maxLength={100}
                              defaultValue={item?.name}
                              onChange={handleChangeThemeName}
                              placeholder={translateData.enterThemeName}
                            ></Input>
                            <Button
                              htmlType="submit"
                              className="btn-save-theme-name mw-0"
                              onClick={() => onClickSaveThemeName(item?.id)}
                            >
                              {translateData.button.save}
                            </Button>
                          </div>
                        </Form.Item>
                      </Form>
                    ) : (
                      <div>
                        <span className="text-name">{item?.name || item?.theme?.name}</span>
                        <span className="pencilEditThemeName">
                          <PencilBlur onClick={() => onClickEditStoreWebName(index, item)}></PencilBlur>
                        </span>
                      </div>
                    )}

                    <p className="text-time mb-0">
                      <span>{translateData.createTime}:</span>
                      <span className="ml-2">{formatCreateTime(item?.createdTime)}</span>
                    </p>
                  </div>
                  <div className="theme-btn-box">
                    <Button
                      onClick={() => {
                        setPublishStoreThemeId(item?.id);
                        setOpenFnbNotifyDialog(true);
                        reloadDataStoreTheme();
                      }}
                      className="btn-publish mw-0"
                      style={{ opacity: isDisabledPublishButton ? 0.5 : 1 }}
                      htmlType="button"
                      disabled={isDisabledPublishButton}
                    >
                      {translateData.button.publish}
                    </Button>
                    <a href={`/online-store/theme-customize/${item?.id}`} target="_blank" rel="noreferrer">
                      <Button className="btn-customize mw-0" type="primary" htmlType="button">
                        {translateData.button.customize}
                      </Button>
                    </a>
                    <DeleteConfirmComponent
                      title={translateData.confirmDelete.confirmationDeleteTitle}
                      content={t(translateData.confirmDelete.confirmDeleteThemeContent, { themeName: item?.name })}
                      okText={translateData.button.delete}
                      cancelText={translateData.button.ignore}
                      buttonType={"TEXT-BORDER"}
                      buttonText={translateData.button.delete}
                      onOk={() => handleDeleteTheme(item?.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {notificationContextHolder}

      <FnbNotifyDialog
        title={translateData.publish.notification}
        open={openFnbNotifyDialog}
        cancelText={translateData.button.ignore}
        okText={translateData.button.publish}
        onOk={() => publishStoreTheme(publishStoreThemeId)}
        onCancel={() => setOpenFnbNotifyDialog(false)}
        content={() => {
          return (
            <p>
              {translateData.publish.confirmMessage} <br /> {translateData.publish.customerWillSee}
            </p>
          );
        }}
      />
    </>
  );
});
