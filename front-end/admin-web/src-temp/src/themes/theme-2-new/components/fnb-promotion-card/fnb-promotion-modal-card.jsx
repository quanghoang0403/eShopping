import { Button, Card } from "antd";
import { useTranslation } from "react-i18next";
import { AppliedIcon, ClockIcon, DiscountCodeIcon, StoreDiscountIcon } from "../../assets/icons.constants";
import { EnumPromotionModalType } from "../../constants/enum";
import "./fnb-promotion-card.scss";

function FnbPromotionModalCard({
  props,
  type = EnumPromotionModalType.STORE,
  onClickRedeem,
  data,
  discountCodeIsBeingApplied,
  className,
  idName,
}) {
  const [t] = useTranslation();
  const translatedData = {
    apply: t("promotion.discountCode.apply", "Áp dụng"),
    remove: t("promotion.card.remove", "Loại bỏ"),
    endDate: t("promotion.card.endDate", "Ngày cuối"),
  };
  const isVoucher = type === EnumPromotionModalType.VOUCHER;
  const promotionClassName = isVoucher ? "voucher-promotion-card" : "store-promotion-card";

  return (
    <div className={`voucher-store-promotion-card ${promotionClassName} ${className}`} id={idName}>
      <ul className="left-half-circle">
        {Array(6)
          .fill(null)
          .map((_, idx) => (
            <li key={idx}></li>
          ))}
      </ul>
      <ul className="right-half-circle">
        {Array(6)
          .fill(null)
          .map((_, idx) => (
            <li key={idx}></li>
          ))}
      </ul>
      <Card {...props} className="modal-card-promotion">
        <div className="header-card">
          {!isVoucher && (
            <div className="discount-icon">
              <StoreDiscountIcon />
            </div>
          )}
          <div className="title-text">{data.title}</div>
          {!isVoucher && (
            <div className="applied-icon">
              <AppliedIcon />
            </div>
          )}
        </div>
        {isVoucher ? (
          <div className="content-card">
            <div className="left-content">
              <div className="discount-code">
                <div className="icon">
                  <DiscountCodeIcon />
                </div>
                <div className="code">{data.code}</div>
              </div>
              <div className="text-content">{data.content}</div>
            </div>
            {discountCodeIsBeingApplied && data.code === discountCodeIsBeingApplied ? (
              <div className="btn-remove">
                <Button onClick={() => onClickRedeem && onClickRedeem()}>{translatedData.remove}</Button>
              </div>
            ) : (
              <div className="btn-redeem">
                <Button onClick={() => onClickRedeem && onClickRedeem()}>{translatedData.apply}</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="content-card">{data.content}</div>
        )}
        <div className="dahsed-line"></div>
        <div className="footer-card">
          <div className="clock-icon">
            <ClockIcon />
          </div>
          <div className="date-time">
            {translatedData.endDate} {data.endDate}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FnbPromotionModalCard;
