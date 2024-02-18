import React from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { PackageStatus } from "constants/packageStatus.constants";

/**
 * Badge package Status
 * @param {bool} status - Status of the badge
 * @returns Activated, Expired, WaitingForActivation or Canceled label
 */
export function BadgePackageStatus(props) {
  const [t] = useTranslation();
  const { packageStatus } = props;

  const pageData = {
    activated: t("status.activated"),
    canceled: t("status.canceled"),
    expired: t("status.expired"),
    waitingForActivation: t("status.waitingForActivation")
  };

  const renderStatus = () => {
    switch(packageStatus){
        case PackageStatus.ACTIVATED:
            return (
                <span className="badge-package-status activated">
                  <span> {pageData.activated}</span>
                </span>
            );
        case PackageStatus.EXPIRED:
            return (
                <span className="badge-package-status expired">
                  <span> {pageData.expired}</span>
                </span>
            );
        case PackageStatus.WAITING_FOR_ACTIVATION:
            return (
                <span className="badge-package-status waitingForActivation">
                  <span> {pageData.waitingForActivation}</span>
                </span>
            );
        default:
            return (
                <span className="badge-package-status default">
                  <span> {pageData.canceled}</span>
                </span>
            );
    }
  };

  return <>{renderStatus()}</>;
}
