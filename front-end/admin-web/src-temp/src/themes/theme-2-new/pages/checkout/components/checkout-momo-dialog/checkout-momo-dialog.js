import { LoadingOutlined } from "@ant-design/icons";
import { Modal, Spin } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { QRCode } from "react-qrcode-logo";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link, useHistory } from "react-router-dom";
import { addMinutes, convertMsToTime, formatTextNumber } from "../../../../../utils/helpers";
import checkoutFailed from "../../../../assets/icons/checkout-failed.svg";
import checkoutSuccess from "../../../../assets/icons/checkout-successfully.svg";
import { ReactComponent as QrCodeFrame } from "../../../../assets/icons/frame-qr-code.svg";
import logo from "../../../../assets/images/logo-footer.png";
import logoMomo from "../../../../assets/images/logo-momo.png";
import { PaymentStatus } from "../../../../constants/payment-method.constants";
import CheckOutMomo from "../checkout-momo";
import "./checkout-momo-dialog.scss";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const CheckoutMomoDialog = forwardRef((props, ref) => {
  const isMobileMode = useMediaQuery({ maxWidth: 600 });
  const { open, onCancel, onMomoExpire, onCompleted } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const momoPaymentResponse = useSelector((state) => state?.thirdParty?.momoPaymentResponse ?? null);
  const [momoPaymentExpiresLater, setMomoPaymentExpiresLater] = useState(null);
  const [qrCodeUrl, setQRCodeUrl] = useState("");
  const [paymentInfoData, setPaymentInfoData] = useState(null);
  const [isOpenMobileDialog, setIsOpenMobileDialog] = useState(false);
  const [isOpenMomoDesktopDialog, setIsOpenMomoDesktopDialog] = useState(false);
  const [existsPaymentSuccessStatus, setExistsPaymentSuccessStatus] = useState(false);

  const translateData = {
    orderNo: t("order.orderNo", "Order NO"),
    momoWaitMessage: t("order.momoWaitMessage", "Đang chờ bạn quét mã"),
    momoExpire: t("order.momoExpire", "Hết hạn sau:"),
    orderIsCreated: t("order.orderIsCreated", "Your order is created successful"),
    congratulation: t("order.congratulation", "Congratulation"),
    close: t("form.close", "Close"),
    viewOrder: t("order.viewOrder", "View order detail"),
    newOrder: t("order.newOrder", "Create new order"),
    momoFailed: t("order.momoFailed", "Sorry, we got issues on Payment via MoMo!"),
  };

  useImperativeHandle(ref, () => ({
    showPaymentInfo(data) {
      setPaymentInfoData({
        ...data,
        status: PaymentStatus.WAIT_FOR_PAY,
      });

      const myQRCodeUrl = data?.paymentInfo?.qrCodeUrl;
      setQRCodeUrl(myQRCodeUrl);
      runCountDownTime(data);
    },
    showPaymentFailed() {
      let newPaymentInfoData = {
        ...paymentInfoData,
        status: PaymentStatus.PAYMENT_FAILED,
      };
      setPaymentInfoData(newPaymentInfoData);
    },
  }));

  useEffect(() => {
    if (momoPaymentResponse) {
      const { result } = momoPaymentResponse;
      if (result === true) {
        showPaymentSuccess();
      } else {
        showPaymentFailed(momoPaymentResponse);
      }
    }
  }, [momoPaymentResponse]);

  const showPaymentSuccess = () => {
    setPaymentInfoData({
      ...paymentInfoData,
      status: PaymentStatus.PAYMENT_SUCCESS,
    });
    setExistsPaymentSuccessStatus(true);
  };

  const showPaymentFailed = (response) => {
    let newPaymentInfoData = {
      ...paymentInfoData,
      status: PaymentStatus.PAYMENT_FAILED,
    };

    if (response) {
      newPaymentInfoData = {
        ...newPaymentInfoData,
        message: response.data?.message,
      };
    }

    setPaymentInfoData(newPaymentInfoData);
  };

  const runCountDownTime = (paymentInfoData) => {
    const isRunning = true;
    const responseTime = paymentInfoData?.paymentInfo?.responseTime;
    let expiredTime = 0;
    if (responseTime) {
      expiredTime = addMinutes(new Date(responseTime), 10).getTime(); // expired after 10 mins, MOMO payment config
      const timeNow = new Date().getTime();
      const remainTime = expiredTime - timeNow;
      if (remainTime > 0) {
        const time = convertMsToTime(remainTime);
        setMomoPaymentExpiresLater(time);
        return isRunning;
      }
    }

    setMomoPaymentExpiresLater("");
    return false;
  };

  useEffect(() => {
    if (isMobileMode) {
      setIsOpenMobileDialog(open);
    } else {
      setIsOpenMomoDesktopDialog(open);
    }
  }, [open]);

  useEffect(() => {
    if (!isOpenMomoDesktopDialog) return;
    let interval = setInterval(() => {
      if (runCountDownTime(paymentInfoData) == false) {
        clearInterval(interval);
        onMomoExpire(paymentInfoData?.orderId);
        return;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpenMomoDesktopDialog]);

  const gotoProductList = () => {
    history.push("/product-list");
  };

  const onClickCloseDialog = () => {
    if (onCancel) {
      onCancel();
    }
    setIsOpenMomoDesktopDialog(false);
    setIsOpenMobileDialog(false);
  };

  const MobileDialog = (
    <CheckOutMomo
      visible={isOpenMobileDialog}
      onCancel={() => {
        /// open dialog web
        setIsOpenMomoDesktopDialog(true);
      }}
      onOk={() => {
        /// goto app
        const { paymentInfo } = paymentInfoData;
        const deepLink = paymentInfo.deepLink;
        window.location.href = deepLink;
      }}
    />
  );

  const DesktopDialog = (
    <Modal
      closable={true}
      maskClosable={false}
      className="check-out-momo-web-theme2"
      open={isOpenMomoDesktopDialog}
      onCancel={onClickCloseDialog}
      footer={(null, null)}
    >
      <div className="checkout-display-content">
        {paymentInfoData?.status === PaymentStatus.PAYMENT_SUCCESS ? (
          <>
            <img className="checkout-icon" src={checkoutSuccess} alt={paymentInfoData?.stringCode} />
            <div className="checkout-title">{translateData.congratulation}</div>
            <div className="checkout-message">
              {Boolean(paymentInfoData?.message) ? paymentInfoData?.message : translateData.orderIsCreated}
            </div>
            <div className="btn-view-order">
              <Link
                onClick={onCompleted}
                to={{
                  pathname: `/my-profile/3`,
                  state: {
                    orderId: paymentInfoData?.orderId,
                  },
                }}
              >
                {translateData.viewOrder}
              </Link>
            </div>
            <div className="btn-navigate-to" onClick={gotoProductList}>
              {translateData.newOrder}
            </div>
          </>
        ) : paymentInfoData?.status === PaymentStatus.PAYMENT_FAILED && !existsPaymentSuccessStatus ? (
          <>
            <img className="checkout-icon" src={checkoutFailed} alt={paymentInfoData?.stringCode} />
            <div className="checkout-title">{translateData.momoFailed}</div>
            <div className="checkout-message">{paymentInfoData?.message}</div>
            <div className="btn-close user-icon" onClick={onClickCloseDialog}>
              {translateData.close}
            </div>
          </>
        ) : !existsPaymentSuccessStatus ? (
          <>
            <img className="logo" src={logo} alt={paymentInfoData?.stringCode} />
            <div className="qrcode">
              <QrCodeFrame className="qr-code-frame" />
              {qrCodeUrl && <QRCode size={260} value={qrCodeUrl} logoImage={logoMomo} removeQrCodeBehindLogo={true} />}
            </div>
            <div className="title1">
              <Spin indicator={antIcon} /> &nbsp;{translateData.momoWaitMessage}
            </div>
            <div className="title2">
              {momoPaymentExpiresLater && (
                <>
                  {translateData.momoExpire} {momoPaymentExpiresLater}
                </>
              )}
            </div>
            <div className="amount">{formatTextNumber(paymentInfoData?.paymentInfo?.amount)} đ</div>
            <div className="code">
              {translateData.orderNo}: <b>#{paymentInfoData?.stringCode}</b>
            </div>
          </>
        ) : (
          <>
            <img className="checkout-icon" src={checkoutSuccess} alt={paymentInfoData?.stringCode} />
            <div className="checkout-title">{translateData.congratulation}</div>
            <div className="checkout-message">
              {Boolean(paymentInfoData?.message) ? paymentInfoData?.message : translateData.orderIsCreated}
            </div>
            <div className="btn-view-order">
              <Link
                onClick={onCompleted}
                to={{
                  pathname: `/my-profile/3`,
                  state: {
                    orderId: paymentInfoData?.orderId,
                  },
                }}
              >
                {translateData.viewOrder}
              </Link>
            </div>
            <div className="btn-navigate-to" onClick={gotoProductList}>
              {translateData.newOrder}
            </div>
          </>
        )}
      </div>
    </Modal>
  );

  return (
    <>
      {MobileDialog}
      {DesktopDialog}
    </>
  );
});
