import { useState, forwardRef, useImperativeHandle } from "react";
import { Switch } from "antd";
import "./use-point.scss";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export const UsePointComponent = forwardRef((props, ref) => {
  const { onChange } = props;
  const [t] = useTranslation();
  const calculateCustomerLoyaltyPoint = useSelector(
    (state) => state?.session?.orderInfo?.cartValidated?.calculateCustomerLoyaltyPoint,
  );

  const [isChecked, setIsChecked] = useState(false);

  useImperativeHandle(ref, () => ({
    setIsChecked(isChecked) {
      setIsChecked(isChecked);
    },
  }));

  return (
    <div className="use-point-container">
      <p className="text-left">
        <span>{t("loyaltyPoint.usePoints", "Đổi điểm")}</span>
        <span className="text-point">{calculateCustomerLoyaltyPoint?.availablePoint > 0 ? `(${calculateCustomerLoyaltyPoint?.availablePoint ?? 0})` : 0}</span>
      </p>
      <Switch
        className="use-point-switch"
        onChange={(e) => {
          onChange(e);
          setIsChecked(e);
        }}
        checked={isChecked}
      />
    </div>
  );
});
