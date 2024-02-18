import { Card, Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { ClockIcon, StoreDiscountIcon } from "../../assets/icons.constants";
import "./promotion-card-in-store.scss";

function PromotionCardInStore(props) {
  const { data, className, idName, isSelected } = props;
  const [t] = useTranslation();
  const translatedData = {
    apply: t("promotion.discountCode.apply", "Áp dụng"),
    remove: t("promotion.card.remove", "Loại bỏ"),
    endDate: t("promotion.card.endDate", "Ngày cuối"),
  };
  return (
    <div className={`store-promotion-card ${isSelected && " store-promotion-card-selected"} ${className}`} id={idName}>
      <div className="left-circle">
        {Array(7)
          .fill(null)
          .map((_, idx) => (
            <div className="circle" key={idx}></div>
          ))}
      </div>
      <div className="right-circle">
        {Array(7)
          .fill(null)
          .map((_, idx) => (
            <div className="circle" key={idx}></div>
          ))}
      </div>
      <Card className="cart-content">
        <Row>
          <Col className="content-left">
            <StoreDiscountIcon />
          </Col>
          <Col className="content-right">
            <div className="title">{data.title}</div>
            <div className="value">{data.textValue}</div>
            <div className="name-of-discount-type">{data.content}</div>
            <div className="footer">
              {data?.endDate && (
                <>
                  <div className="clock-icon">
                    <ClockIcon />
                  </div>
                  <div className="date-time">
                    {translatedData.endDate} {data.endDate}
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default PromotionCardInStore;
