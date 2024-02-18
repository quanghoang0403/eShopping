import { Radio, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BankTransferPayment from "../../../../components/BankTransferPayment/BankTransferPayment.jsx";
import CheckoutInfoCard from "../../../../components/checkout-info-cart/checkout-info-cart.component.js";
import { enumOrderType } from "../../../../constants/enum.js";
import { PaymentMethodType } from "../../../../constants/payment-method.constants";
import "../../../../stylesheets/fnb-radio-antd.scss";
import "./checkout-payment-method.scss";

export default function CheckoutPaymentMethod(props) {
  const {
    title,
    onChange,
    value,
    isDefault,
    mockupData,
    isCustomize,
    configuration,
    colorGroups,
    isDisableCashlessMethod,
  } = props;
  const paymentMethods = useSelector((state) => state.session.paymentMethods ?? []);
  const isPaymentBankTransfer = value?.paymentMethodEnumId === PaymentMethodType.BankTransfer;
  const imgSlash = isDefault || isCustomize ? "../.." : "";
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);

  const { t } = useTranslation();
  const pageData = {
    paymentMethods: {
      cash: t("paymentMethod.cash", "Cash"),
    },
  };
  let currentPaymentMethods = paymentMethods;
  if (deliveryAddress?.orderType === enumOrderType.PICK_UP) {
    currentPaymentMethods = paymentMethods?.filter(
      (item) =>
        item.paymentMethodEnumId === PaymentMethodType.Cash ||
        item.paymentMethodEnumId === PaymentMethodType.BankTransfer,
    );
  } else {
    currentPaymentMethods = paymentMethods;
  }

  return (
    <CheckoutInfoCard
      className="theme2-checkout-payment-method"
      title={title}
      configuration={configuration}
      colorGroups={colorGroups}
    >
      <>
        <Radio.Group
          className="payment-method-radio-group radio-style"
          onChange={(e) => {
            const paymentMethod = e.target.value;
            onChange && onChange(paymentMethod);
          }}
          value={value}
        >
          <Space direction="vertical">
            {(isDefault || isCustomize ? mockupData : currentPaymentMethods)?.map((paymentMethod) => {
              let paymentName = paymentMethod?.paymentMethodName;
              if (paymentMethod?.paymentMethodEnumId === PaymentMethodType.Cash) {
                paymentName = pageData.paymentMethods.cash;
              }

              const isCashlessMethod = paymentMethod?.paymentMethodEnumId !== PaymentMethodType.Cash;
              const isDisabled = isDisableCashlessMethod && isCashlessMethod;
              return (
                <>
                  <Radio
                    key={paymentMethod?.paymentMethodId}
                    value={paymentMethod}
                    disabled={isDisabled}
                    className="payment-method-radio"
                  >
                    <div className="payment-method-radio-label">
                      <div className="payment-method-radio-name">{paymentName}</div>
                      <div className="payment-method-radio-icon">
                        <img src={`${imgSlash}${paymentMethod?.icon}`} alt={paymentName} />
                      </div>
                    </div>
                  </Radio>
                </>
              );
            })}
          </Space>
        </Radio.Group>

        {isPaymentBankTransfer && (
          <BankTransferPayment
            bankAccountInfo={value?.bankAccountInfo}
            className="bank-transfer-payment-checkout-theme2"
          />
        )}
      </>
    </CheckoutInfoCard>
  );
}
