import { Radio, Space } from "antd";
import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { formatTextNumber } from "../../../../../utils/helpers";
import CheckoutInfoCard from "../../../../components/checkout-info-cart/checkout-info-cart.component";
import "./delivery-method.style.scss";
import { EnumDeliveryMethod } from "../../../../constants/enum";

export const CheckoutDeliveryMethod = forwardRef((props, ref) => {
  const { onChange, value, isDefault, mockupData, isCustomize } = props;
  const [t] = useTranslation();

  const deliveryMethods = useSelector((state) => state.session.deliveryMethods ?? []);
  const deliveryAddress = useSelector((state) => state.session.deliveryAddress ?? null);

  useImperativeHandle(ref, () => ({}));

  const translatedData = {
    shippingMethod: t("checkOutPage.shippingMethod", "Shipping method"),
    justSupportOrderHasPaymentbyCashOnly: t(
      "checkOutPage.justSupportOrderHasPaymentbyCashOnly",
      "Just support order has payment by COD (cash) only",
    ),
  };

  const ValidateMessage = () => {
    if (!deliveryMethods || deliveryMethods?.length <= 0) {
      if (!deliveryAddress?.receiverAddress || !deliveryAddress?.branchAddress)
        return <p>Vui lòng chọn địa chỉ giao - nhận hàng</p>;
    }
  };
  const { configuration, colorGroups, isCashPaymentMethod = false } = props;
  return (
    <CheckoutInfoCard
      className="theme2-checkout-delivery-method"
      title={translatedData.shippingMethod.toUpperCase()}
      configuration={configuration}
      colorGroups={colorGroups}
    >
      <Radio.Group
        className="delivery-method-radio-group radio-style"
        onChange={(e) => {
          const deliveryMethod = e.target.value;
          onChange && onChange(deliveryMethod);
        }}
        value={value}
      >
        <Space direction="vertical">
          <ValidateMessage />
          {(isDefault || isCustomize ? mockupData : deliveryMethods)?.map((deliveryMethod, index) => {
            const deliveryMethodGrabExpress = deliveryMethod?.enumDeliveryMethod === EnumDeliveryMethod.GrabExpress;
            const isDisabled = !isCashPaymentMethod && deliveryMethodGrabExpress;
            return (
              <>
                <Radio
                  key={deliveryMethod?.deliveryMethodId}
                  value={deliveryMethod}
                  className={`delivery-method-radio${
                    index + 1 === deliveryMethods?.length ? " delivery-method-radio-last-child" : ""
                  }`}
                  disabled={isDisabled}
                >
                  <>
                    <div
                      className={`delivery-method-radio-label ${
                        deliveryMethodGrabExpress ? "delivery-method-radio-label-grab-express" : ""
                      }`}
                    >
                      <div className="delivery-method-radio-name">{deliveryMethod?.deliveryMethodName}</div>
                      <div className="delivery-method-radio-price">{formatTextNumber(deliveryMethod?.pricing)}đ</div>
                    </div>

                    {deliveryMethodGrabExpress && (
                      <div className="delivery-method-grab-express">
                        *{t(translatedData.justSupportOrderHasPaymentbyCashOnly)}
                      </div>
                    )}
                  </>
                </Radio>
              </>
            );
          })}
        </Space>
      </Radio.Group>
    </CheckoutInfoCard>
  );
});
