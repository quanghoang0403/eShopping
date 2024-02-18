import React from "react";
import flashSaleLogo from "../../assets/images/flash-sale-logo-theme2.png";
import { formatDateTime, formatTextNumber } from "../../../utils/helpers";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import "./fnb-flash-sale-banner.component.scss";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import FnbFlashSaleBannerZeroComponent from "../fnb-flash-sale-banner-zero/fnb-flash-sale-banner-zero.component";
import { useRef } from "react";

export default function FnbFlashSaleBannerComponent(props) {
  const { endTime, endAtZero, onComplete, className = "flip-countdown" } = props;
  const [t] = useTranslation();
  const translatedData = {
    endAfter: t("storeWebPage.flashSale.endAfter", "Kết thúc sau"),
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
        <img src={flashSaleLogo}></img>
      </Col>
      <Col xs={12} sm={16}>
        <Row className="flash-sale-banner-countdown-title">
          <div className="flash-sale-banner-title">{translatedData.endAfter.toUpperCase()}</div>
        </Row>
        <Row className="flash-sale-banner-countdown-calendar">
          <FlipClockCountdown
            className={className}
            onComplete={endTime && handleComplete}
            to={formatDateTime(endTime)}
            showSeparators={true}
            renderMap={[false, true, true, true]}
            showLabels={false}
            digitBlockStyle={{
              width: 25,
              height: 43,
              fontSize: 24,
              color: "#FFFFFF",
              background: "#FF8718",
              fontWeight: 700,
            }}
            dividerStyle={{ color: "rgba(0, 0, 0, 0.1)", height: 1 }}
            separatorStyle={{ color: "#FFFFFF", size: "4px" }}
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
