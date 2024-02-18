import React from "react";
import "./available-point.scss";
import { Row } from "antd";
import { UseAvailablePointIcon } from "../../../../assets/icons.constants";
import { useTranslation } from "react-i18next";
import SwitchButton from "../../../../components/SwitchButton/SwitchButton";
import { formatTextNumber } from "../../../../../utils/helpers";
import { useSelector } from "react-redux";

export default function UseAvailablePoint(props) {
  const { onClick, isActiveAvailablePoint, isLoadingSwitchExchangePoint } = props;
  const calculateCustomerLoyaltyPoint = useSelector(
    (state) => state?.session?.orderInfo?.cartValidated?.calculateCustomerLoyaltyPoint,
  );
  const { t } = useTranslation();
  const translateData = {
    use: t("checkOutPage.availablePoint.use", "Dùng"),
    point: t("checkOutPage.availablePoint.point", "điểm"),
    used: t("checkOutPage.availablePoint.use", "Đã dùng"),
  };

  const formatNumberString = (string) => {
    return string.replace(",", ".");
  };

  return (
    <Row className="available-point-title">
      <span className="available-point-icon">
        <UseAvailablePointIcon />
      </span>
      <div className="available-point-content">
        <span className="available-point-text">{translateData.use} </span>
        <span className="available-point-text-point">
          {calculateCustomerLoyaltyPoint?.availablePoint > 0 ? formatNumberString(formatTextNumber(`${calculateCustomerLoyaltyPoint?.availablePoint ?? 0}`)) : 0}{" "}
        </span>
        <span className="available-point-text">{translateData.point}</span>
      </div>
      <div className="available-point-switch">
        <SwitchButton
          isLoadingSwitchExchangePoint={isLoadingSwitchExchangePoint}
          isActiveAvailablePoint={isActiveAvailablePoint}
          onClick={onClick}
        />
      </div>
    </Row>
  );
}
