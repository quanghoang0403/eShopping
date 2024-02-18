import { LoadingOutlined } from "@ant-design/icons";
import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { QRCode } from "react-qrcode-logo";
import { useMediaQuery } from "react-responsive";
import { convertMsToTime, formatTextNumber } from "../../../../utils/helpers";
import { ReactComponent as QrCodeFrame } from "../../../assets/icons/frame-qr-code.svg";
import logo from "../../../assets/images/coffee-mug-logo.png";
import logoMomo from "../../../assets/images/logo-momo.png";
import "./checkout-momo-web.scss";
export default function CheckOutMomoWeb(props) {
  const { visible, onCancel, onMomoExpire, orderID, orderStringCode, amount, momoQRCodeURL, momoDeeplink } = props;
  const { t } = useTranslation();
  const pageData = {
    orderNo: t("order.orderNo", "Order No"),
    momoWaitMessage: t("order.momoWaitMessage", "Waiting for code scan"),
    momoExpire: t("order.momoExpire", "Expires later:"),
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const momoTimeExpired = 600;
  const [time, setTime] = useState(momoTimeExpired);
  const isMaxWidth640 = useMediaQuery({ maxWidth: 640 });
  const className = isMaxWidth640 ? "check-out-momo-web-theme1-mobile" : "check-out-momo-web-theme1";
  useEffect(() => {
    if (!visible) return;
    setTime(momoTimeExpired);
    let interval = setInterval(() => {
      setTime((x) => {
        x <= 1 && clearInterval(interval);
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);
  if (!visible) return <></>;
  if (!momoQRCodeURL) return <></>;
  const divContent = (
    <>
      <div className="check-out-momo-qrcode-theme1">
        <img className="logo" src={logo} alt={orderStringCode} />
        <div className="qrcode">
          <QrCodeFrame className="qr-code-frame" />
          <QRCode size={310} value={momoQRCodeURL} logoImage={logoMomo} removeQrCodeBehindLogo={true} />
        </div>
        <div className="title1">
          <Spin indicator={antIcon} /> &nbsp;
          {pageData.momoWaitMessage}
        </div>
        <div className="title2">
          {pageData.momoExpire} {convertMsToTime(time * 1000)}
        </div>
        <div className="amount">{formatTextNumber(amount)} đ</div>
        <div className="code">
          {pageData.orderNo}: #{orderStringCode}
        </div>
      </div>
    </>
  );
  return (
    <Modal
      closable={true}
      maskClosable={false}
      className={className}
      open={visible}
      onCancel={onCancel}
      footer={(null, null)}
      title=""
    >
      {divContent}
    </Modal>
  );
}
