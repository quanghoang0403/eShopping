import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PACKAGE_EXPIRED } from "../../../constants/config.constants";
import { ReactComponent as CallCallingIcon } from "./call-calling.svg";
import PackageExpiredClock from "./package-expired-clock.png";
import "./package-expired-dialog.scss";
import { ReactComponent as SmsIcon } from "./sms.svg";

function PackageExpiredDialog() {
  const { t } = useTranslation();
  const packageExpiredInfo = useSelector((state) => state?.session?.packageExpiredInfo);
  const jsonConfig = localStorage.getItem("config");
  const storeConfig = JSON.parse(jsonConfig);
  const storeInfo = packageExpiredInfo?.storeInfo;

  const translateData = {
    notification: t("packageExpired.notification", "Thông báo"),
    dearCustomer: t("packageExpired.dearCustomer", "Kính gửi quý khách hàng!"),
    textSuspended: t(
      "packageExpired.textSuspended",
      "Cửa hàng <strong>{{store_name}}</strong> đã bị tạm ngừng do hết hạn.",
    ),
    pleaseContact: t("packageExpired.pleaseContact", "Vui lòng liên hệ với cửa hàng về vấn đề này"),
    storeName: storeConfig?.storeName ?? "",
    email: storeConfig?.email ?? "hotro@gosell.vn",
    phoneNumber: storeConfig?.phoneNumber ?? "028 7303 0800",
  };

  const storeName = storeInfo?.storeName ?? translateData.storeName;
  const email = storeInfo?.email ?? translateData.email;
  const phoneNumber = storeInfo?.phoneNumber ?? translateData.phoneNumber;

  function renderModal() {
    return (
      <Modal
        className="package-expired-modal"
        width={568}
        open={true}
        closable={false}
        footer={(null, null)}
        centered
        zIndex={9999}
      >
        <div className="package-expired-modal-content">
          <div className="title">{translateData.notification}</div>
          <div className="image-container">
            <img src={PackageExpiredClock} alt="" />
          </div>
          <div className="text-detail">
            <p>{translateData.dearCustomer}</p>
            <p className="line-spacing">
              <span
                dangerouslySetInnerHTML={{
                  __html: t(translateData.textSuspended, {
                    storeName: storeName,
                  }),
                }}
              ></span>
            </p>
            <p className="line-spacing">{translateData.pleaseContact}</p>
          </div>
          <div className="bottom-content">
            <div className="left-content">
              <div className="icon-box">
                <SmsIcon />
              </div>
              <div className="text-box">
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            </div>
            <div className="right-content">
              <div className="icon-box">
                <CallCallingIcon />
              </div>
              <div className="text-box">
                <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return <>{packageExpiredInfo?.errorType === PACKAGE_EXPIRED && renderModal()}</>;
}

export default PackageExpiredDialog;
