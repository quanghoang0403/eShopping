import { Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { CopyIcon } from "../../assets/icons.constants";
import { EnDash } from "../../constants/string.constants";
import "./styles.scss";
import { useAppCtx } from "../../../providers/app.provider";

const BankTransferPayment = ({ bankAccountInfo = {}, className = "", width = 90, height = 90, orderId = "" }) => {
  const [t] = useTranslation();
  const { Toast } = useAppCtx();

  const translateData = {
    transferInfo: t("bankTransfer.transferInfo", "Thông tin chuyển khoản"),
    bankName: t("bankTransfer.bankName", "Ngân hàng"),
    accountNumber: t("bankTransfer.accountNumber", "Số tài khoản"),
    accountHolder: t("bankTransfer.accountHolder", "Chủ tài khoản"),
    content: t("bankTransfer.content", "Nội dung"),
    payment: t("bankTransfer.payment", `Thanh toán cho đơn hàng số {{orderId}}`, { orderId: orderId }),
    copySuccess: t("bankTransfer.copySuccess", "Sao chép thành công!"),
  };

  const openNotification = () => {
    Toast.success({
      message: translateData.copySuccess,
      placement: "bottom",
    });
  };

  return (
    <div className={`bank-transfer-theme1 ${className}`}>
      <div className="title">{translateData.transferInfo}</div>

      <div className="content-bank-account">
        {bankAccountInfo?.qrCodeUrl && bankAccountInfo?.isVietnameseBank && bankAccountInfo?.bankCode && (
          <div className="qr-code">
            <img src={bankAccountInfo?.qrCodeUrl} alt="Viet QR" width={width} height={height} />
          </div>
        )}

        <div className="bank-account-info">
          <div className="bank-name">
            <div className="bank-name-title">{translateData.bankName}</div>
            <div className="bank-name-text">{bankAccountInfo?.bankName ? bankAccountInfo?.bankName : EnDash}</div>
          </div>

          <div className="account-holder">
            <div className="account-holder-title">{translateData.accountHolder}</div>
            <div className="value-copy-icon">
              <div className="account-holder-text">
                {bankAccountInfo?.bankAccountName ? bankAccountInfo?.bankAccountName : EnDash}
              </div>
            </div>
          </div>

          <div className="account-number">
            <div className="account-number-title">{translateData.accountNumber}</div>
            <div className="value-copy-icon">
              <div className="account-number-text">
                {bankAccountInfo?.bankAccountNumber ? bankAccountInfo?.bankAccountNumber : EnDash}
              </div>
              <div className="copy-icon">
                <Typography.Paragraph
                  copyable={{
                    tooltips: false,
                    icon: [<CopyIcon />, <CopyIcon />],
                    text: bankAccountInfo?.bankAccountNumber,
                    onCopy: () => {
                      openNotification();
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="content">
            <div className="content-title">{translateData.content}</div>
            <div className="value-copy-icon">
              <div className="content-text">{translateData.payment}</div>
              <div className="copy-icon">
                <Typography.Paragraph
                  copyable={{
                    tooltips: false,
                    icon: [<CopyIcon />, <CopyIcon />],
                    text: translateData.payment,
                    onCopy: () => {
                      openNotification();
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransferPayment;
