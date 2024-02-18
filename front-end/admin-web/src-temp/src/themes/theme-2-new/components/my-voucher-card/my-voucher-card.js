import { Button, Card, Col, Row } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import discountCodeDataService from "../../../data-services/discount-code-data.service";
import { getStoreConfig } from "../../../utils/helpers";
import { ClockIcon, DiscountCodeIcon } from "../../assets/icons.constants";
import { DiscountCodeDetailComponent } from "../discount-code-detail-component/discount-code-detail.component";
import "./my-voucher-card.scss";
function MyVoucherCard(props) {
  const { onClickRedeem, data, isSelected, className, idName, colorConfig, hiddenPromotion, isApply } = props;
  const [t] = useTranslation();
  const [isOpenDiscountCodeDetail, setIsOpenDiscountCodeDetail] = useState(false);
  const [discountCodeDetail, setDiscountCodeDetail] = useState(null);
  const translatedData = {
    apply: t("promotion.discountCode.apply", "Áp dụng"),
    remove: t("promotion.card.remove", "Loại bỏ"),
    endDate: t("promotion.card.endDate", "Hết hạn"),
  };
  async function showDiscountCodeDetail() {
    const storeConfig = getStoreConfig();
    const discountCodeDetail = await discountCodeDataService.getDiscountCodeDetailByIdAsync(
      storeConfig?.storeId,
      data?.id,
    );
    if (discountCodeDetail?.data?.discountCode) {
      hiddenPromotion(true);
      setIsOpenDiscountCodeDetail(true);
      setDiscountCodeDetail(discountCodeDetail?.data?.discountCode);
    }
  }
  function handleCancel() {
    setIsOpenDiscountCodeDetail(false);
    hiddenPromotion(false);
  }
  return (
    <>
      <DiscountCodeDetailComponent
        discountCodeDetail={discountCodeDetail}
        isOpenDiscountCodeDetail={isOpenDiscountCodeDetail}
        handleCancel={(e) => handleCancel()}
        colorConfig={colorConfig}
      />
      <div
        className={`my-voucher-card ${isSelected && " my-voucher-card-selected"} ${
          !isApply && " my-voucher-card-disabled "
        } ${className}`}
        id={idName}
      >
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
        <Card className={`cart-content${isApply ? "" : " disabled"}`}>
          <Row>
            <Col xs={16} className="content-left">
              <div className="title" onClick={showDiscountCodeDetail}>
                {data.title}
              </div>
              <div className="discount-code">
                <DiscountCodeIcon />
                <div className="code">{data.code}</div>
              </div>
              <div className="name-of-discount-type">{data.content}</div>
              <div className="footer">
                <div className="clock-icon">
                  <ClockIcon />
                </div>
                <div className="date-time">
                  {translatedData.endDate} {data.endDate}
                </div>
              </div>
            </Col>
            <Col xs={8} className="content-right">
              {isSelected ? (
                <Button className="btn-remove" onClick={() => onClickRedeem && onClickRedeem()}>
                  {translatedData.remove}
                </Button>
              ) : (
                <Button
                  className={`btn-apply${data?.isApply ? "" : " disabled"}`}
                  onClick={() => onClickRedeem && onClickRedeem()}
                >
                  {translatedData.apply}
                </Button>
              )}
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}

export default MyVoucherCard;
