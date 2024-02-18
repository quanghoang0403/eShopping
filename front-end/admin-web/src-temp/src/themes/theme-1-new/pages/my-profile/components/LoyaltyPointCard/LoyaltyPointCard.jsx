import { Col, Row, Typography, Image, Tooltip } from "antd";
import "./LoyaltyPointCard.scss";
import { SolarMedalStarBold } from "../../../../assets/icons.constants";
import Barcode from "react-barcode";
import { useTranslation } from "react-i18next";
import { BAR_CODE_TYPE } from "../../../../constants/string.constants";
import { formatTextNumber } from "../../../../../utils/helpers";

export default function LoyaltyPointCardComponent(props) {
  const { customerBarcode, loyaltyPoint, firstName, lastName, isCustomize } = props;
  const [t] = useTranslation();
  const pageData = {
    points: t(
      "loyaltyPoint.avaiablePointsLoyalty",
      "{{points}} điểm",
      { points: formatTextNumber(loyaltyPoint?.availablePoint ? loyaltyPoint?.availablePoint : 0) },
    ),
  }

  return (
    <div className="loyalty-point-component">
      <Row>
        <Col xs={4} lg={6} className="membership-level-img">
          <Image
            preview={false}
            src={isCustomize || !loyaltyPoint?.thumbnail  ? "/images/default-theme/membership-level-default.png" : loyaltyPoint?.thumbnail}
          />
        </Col>
        <Col xs={20} lg={18} className="membership-info">
          <Row>
            <Col className="customer-name text-line-clamp-1">
              <Tooltip title={`${firstName ?? ""} ${lastName ?? ""}`}>
                <Typography.Text ellipsis className="customer-name-text">{`${firstName ?? ""} ${lastName ?? ""}`}</Typography.Text>
              </Tooltip>
            </Col>
            <Col className="membership-name">
              <Tooltip title={loyaltyPoint?.name}>
                <Typography.Text className="text-line-clamp-1 membership-name-text">{loyaltyPoint?.name}</Typography.Text>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="bar-code-container" flex-wrap="wrap">
        {customerBarcode && (
          <>
            <Col xs={24} lg={24} className="bar-code">
              <Barcode
                value={customerBarcode}
                width={2}
                height={28}
                displayValue={false}
                format={BAR_CODE_TYPE.CODE_128}
              />
            </Col>
            <Col xs={24} lg={24} className="bar-code-value">
              <div>
                <Typography.Text>{customerBarcode}</Typography.Text>
              </div>
            </Col>
          </>
        )}
      </Row>
      <Row className="point-amount">
        <SolarMedalStarBold className="solar-medal-star-bold-icon" />
        <span>
            {pageData.points}
        </span>
      </Row>
    </div>
  );
}
