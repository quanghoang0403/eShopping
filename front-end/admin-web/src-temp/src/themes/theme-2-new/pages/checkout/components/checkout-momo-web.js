import { LoadingOutlined } from "@ant-design/icons";
import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { formatTextNumber } from "../../../../utils/helpers";
import logo from "../../../assets/images/logo-footer.png";
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
  const [time, setTime] = useState(60);
  useEffect(() => {
    if (!visible) return;
    if (time === 0) {
      if (onMomoExpire) onMomoExpire(orderID);
      return;
    }

    let interval = setInterval(() => {
      setTime((x) => {
        x <= 1 && clearInterval(interval);
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);
  if (!momoQRCodeURL) return <></>;
  const divContent = (
    <>
      <div className="check-out-momo-qrcode-theme2">
        <img className="logo" src={logo} alt={orderStringCode} />
        <div className="qrcode">
          <QRCode size={330} value={momoQRCodeURL} logoImage={logoMomo} removeQrCodeBehindLogo={true} />
        </div>
        <div className="title1">
          <Spin indicator={antIcon} /> &nbsp;{pageData.momoWaitMessage}
        </div>
        <div className="title2">
          {pageData.momoExpire} {time}
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
      className="check-out-momo-web-theme2"
      open={visible}
      onCancel={onCancel}
      footer={(null, null)}
      title=""
    >
      {divContent}
    </Modal>
  );
}
