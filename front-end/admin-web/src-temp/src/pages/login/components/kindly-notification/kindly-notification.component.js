import { Button, Checkbox, Image, Modal } from "antd";
import notificationImage from "assets/images/kindly-notification.png";
import { accountStatusConstants } from "constants/account-status.constants";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { localStorageKeys, setStorage } from "utils/localStorage.helpers";
import "./kindly-notification.component.scss";

const { forwardRef, useImperativeHandle } = React;
export const KindlyNotificationComponent = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const [visible, setVisible] = React.useState(false);
  const [kindlyNotifyType, setKindlyNotifyType] = React.useState({});
  const [packageName, setPackageName] = React.useState(null);
  const [expireDays, setExpireDays] = React.useState(null);
  const [isPackageInfo, setIsPackageInfo] = React.useState(false);
  const [isBranchPackage, setIsBranchPackage] = React.useState(null);
  const history = useHistory();

  const pageData = {
    title: t("activateAccount.title"),
    dear: t("activateAccount.dear"),
    your: t("activateAccount.your"),
    waitingApproval: t("activateAccount.waitingApproval"),
    please: t("activateAccount.please"),
    hotline: t("activateAccount.hotline"),
    email: t("activateAccount.email"),
    activateAccount: t("activateAccount.activateAccount"),
    gotIt: t("activateAccount.gotIt"),
    aPackageExpiredNext7Days: t("activateAccount.aPackageExpiredNext7Days"),
    aPackageExpired: t("activateAccount.aPackageExpired"),
    allPackageExpired: t("activateAccount.allPackageExpired"),
    titlePackageInfo: t("activateAccount.titlePackageInfo"),
    ignore: t("button.ignore"),
    renew: t("packageTable.renew"),
  };

  useImperativeHandle(ref, () => ({
    setKindlyNotifyType(kindlyNotifyType) {
      setKindlyNotifyType(kindlyNotifyType);
      setVisible(true);
    },
    setPackageName(packageName) {
      setPackageName(packageName);
    },
    setExpireDays(expireDays) {
      setExpireDays(expireDays);
    },
    setIsPackageInfo(isPackageInfo) {
      setIsPackageInfo(isPackageInfo);
    },
    setIsBranchPackage(isBranchPackage) {
      setIsBranchPackage(isBranchPackage);
    },
  }));

  const onClickActivateAccount = () => {
    if (props.onActive) {
      props.onActive();
      setVisible(false);
    }
  };

  const onRenewPackage = () => {
    if (isBranchPackage) {
      history.push("/branch-purchase");
    } else {
      history.push("/billing");
    }
  };

  const renderActionButton = () => {
    if (kindlyNotifyType === accountStatusConstants.waitingForApproval) {
      return (
        <Button
          className="activate-account-btn"
          onClick={() => {
            setVisible(false);
            if (props.onClick) {
              props.onClick();
            }
          }}
        >
          {pageData.gotIt}
        </Button>
      );
    }

    if (
      kindlyNotifyType === accountStatusConstants.aPackageExpiredNext7Days ||
      kindlyNotifyType === accountStatusConstants.aPackageExpired
    ) {
      return (
        <>
          <div className="modal-footer">
            <Button
              className="ignore-btn"
              onClick={() => {
                setVisible(false);
                props.redirectHomePage();
              }}
            >
              {pageData.ignore}
            </Button>

            <Button className="renew-btn" onClick={onRenewPackage}>
              {pageData.renew}
            </Button>
          </div>
        </>
      );
    }

    if (kindlyNotifyType === accountStatusConstants.allPackageExpired) {
      return (
        <>
          <div className="modal-footer">
            <Button className="renew-btn" onClick={onRenewPackage}>
              {pageData.renew}
            </Button>
          </div>
        </>
      );
    }

    return (
      <Button className="activate-account-btn" onClick={onClickActivateAccount}>
        {pageData.activateAccount}
      </Button>
    );
  };

  const renderContent = () => {
    switch (kindlyNotifyType) {
      case accountStatusConstants.waitingForApproval:
        return <p className="your-text">{pageData.waitingApproval}</p>;
      case accountStatusConstants.aPackageExpiredNext7Days:
        return (
          <div
            className="your-text"
            dangerouslySetInnerHTML={{
              __html: t(pageData.aPackageExpiredNext7Days, {
                package_name: t(packageName),
                expire_days: expireDays,
              }),
            }}
          ></div>
        );
      case accountStatusConstants.aPackageExpired:
        return (
          <div
            className="your-text"
            dangerouslySetInnerHTML={{
              __html: t(pageData.aPackageExpired, {
                package_name: t(packageName),
              }),
            }}
          ></div>
        );
      case accountStatusConstants.allPackageExpired:
        return (
          <div
            className="your-text"
            dangerouslySetInnerHTML={{
              __html: t(pageData.allPackageExpired),
            }}
          ></div>
        );
      default:
        return <p className="your-text">{pageData.your}</p>;
    }
  };
  const onCheckShowAgainChange = (e) => {
    setStorage(localStorageKeys.IS_SHOW_AGAIN_PACKAGE_EXPIRE, e.target.checked);
  };

  return (
    <>
      {isPackageInfo ? (
        <Modal width={716} className="modal-kindly-notification " closeIcon visible={visible} footer={null}>
          <h3 className="title title-package-expire-info">{pageData.titlePackageInfo}</h3>
          <div className="img-notification">
            <Image preview={false} className="img-width" src={notificationImage} />
          </div>
          <p className="dear-text">{pageData.dear}</p>
          {renderContent()}
          <p className="contact-text">
            {pageData.hotline}: <span>(028) 7303 0800</span> - {pageData.email}: <span>hotro@gosell.vn</span>
          </p>
          <div hidden={kindlyNotifyType === accountStatusConstants.allPackageExpired}>
            <Checkbox
              onChange={(e) => {
                onCheckShowAgainChange(e);
              }}
              className="check-box-style"
            >
              {"Don't show again"}
            </Checkbox>
          </div>
          {renderActionButton()}
        </Modal>
      ) : (
        <Modal width={716} className="modal-notification" closeIcon visible={visible} footer={null}>
          <h3 className="title">{pageData.title}</h3>
          <div className="img-notification">
            <Image preview={false} width={242} src={notificationImage} />
          </div>
          <p className="dear-text">{pageData.dear}</p>
          {renderContent()}
          <p className="please-text">{pageData.please}</p>
          <p className="contact-text">
            {pageData.hotline}: <span>(028) 7303 0800</span> - {pageData.email}: <span>hotro@gosell.vn</span>
          </p>
          {renderActionButton()}
        </Modal>
      )}
    </>
  );
});
