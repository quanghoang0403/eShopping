import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { Col, Row } from "antd";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../../utils/helpers";
import { FLashSaleLogo } from "../../assets/icons.constants";
import FnbFlashSaleBannerZeroComponent from "../fnb-flash-sale-banner-zero/fnb-flash-sale-banner-zero.component";
import "./fnb-flash-sale-banner.component.scss";

export default function FnbFlashSaleBannerComponent(props) {
  const { data, endAtZero, onComplete, className = "flip-countdown" } = props;
  const [t] = useTranslation();
  const translatedData = {
    endAfter: t("storeWebPage.flashSale.endAfter", "endAfter"),
  };

  const flashSaleCompleteRef = useRef();

  const handleComplete = () => {
    if (endAtZero) {
      flashSaleCompleteRef.current.style.display = "flex";
    }
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Row xs={24} className="flash-sale-banner">
      <Col xs={12} sm={8} className="flash-sale-banner-logo">
        <FLashSaleLogo />
      </Col>
      <Col xs={8} sm={16}>
        <Row className="flash-sale-banner-countdown">
          <div className="flash-sale-banner-title">{translatedData.endAfter.toUpperCase()}</div>
          <FlipClockCountdown
            className={className}
            onComplete={data?.promotionEndTime && handleComplete}
            to={formatDateTime(data?.promotionEndTime)}
            showSeparators={false}
            renderMap={[false, true, true, true]}
            showLabels={false}
            digitBlockStyle={{
              width: 24,
              height: 40,
              fontSize: 24,
              color: "#50429B",
              background: "#FFFFFF",
              fontWeight: 700,
            }}
            dividerStyle={{ color: "rgba(0, 0, 0, 0.1)", height: 1 }}
            separatorStyle={{ color: "#FFFFFF", size: "5px" }}
            duration={0.5}
          />
          <div className="flash-sale-zero" ref={flashSaleCompleteRef}>
            <FnbFlashSaleBannerZeroComponent />
          </div>
        </Row>
      </Col>
    </Row>
  );
}
