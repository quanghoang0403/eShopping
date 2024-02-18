import { Col, Row } from "antd";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import discountCodeDataService from "../../../data-services/discount-code-data.service";
import { getStoreConfig } from "../../../utils/helpers";
import { DiscountCodeCardIcon, DiscountCodeIcon, StoreDiscountIcon } from "../../assets/icons.constants";
import { EnumPromotionType, ListPromotionType } from "../../constants/enum";
import { DateFormat } from "../../constants/string.constant";
import { DiscountCodeDetailComponent } from "../discount-code-detail-component/discount-code-detail.component";
import "./fnb-promotion-card.scss";
function FnbPromotionCard({ type, onClickRedeem, isShowRedeem, data, colorConfig, ...props }) {
  const [t] = useTranslation();
  const translatedData = {
    applied: t("promotion.card.applied", "Đang được sử dụng"),
    usePromotion: t("promotion.card.usePromotion", "Sử dụng"),
    redeem: t("promotion.card.redeem", "Lấy mã"),
    endDate: t("promotion.card.endDate", "Ngày cuối: "),
    includeTopping: t("promotion.discount.includeTopping", "Bao gồm topping"),
    noExpirationDate: t("promotion.card.noExpirationDate", "Không có ngày hết hạn"),
  };
  const isDiscountCode = type === EnumPromotionType.DISCOUNT_CODE;
  const [isOpenDiscountCodeDetail, setIsOpenDiscountCodeDetail] = useState(false);
  const [discountCodeDetail, setDiscountCodeDetail] = useState(null);
  const renderEndDateDiscount = (translatedEndDate, endDate) => (
    <p>
      {translatedEndDate} {moment.utc(endDate).local().format(DateFormat.DD_MM_YYYY_HH_mm)}
    </p>
  );

  const renderEndDateStore = (translatedEndDate, endDate) => {
    if (!endDate) {
      return <p>{translatedData.noExpirationDate}</p>;
    }
    return (
      <p>
        {translatedEndDate} {moment.utc(endDate).local().format(DateFormat.DD_MM_YYYY)}
      </p>
    );
  };

  async function showDiscountCodeDetail() {
    const storeConfig = getStoreConfig();
    const discountCodeDetail = await discountCodeDataService.getDiscountCodeDetailByIdAsync(
      storeConfig?.storeId,
      data?.id,
    );
    if (discountCodeDetail?.data?.discountCode) {
      setIsOpenDiscountCodeDetail(true);
      setDiscountCodeDetail(discountCodeDetail?.data?.discountCode);
    }
  }

  function handleCloseDiscountCodeDetail() {
    setIsOpenDiscountCodeDetail(false);
  }

  function renderPromotionType(promotionTypes, selectedTypeId, t) {
    const selectedType = promotionTypes.find((item) => item.key === selectedTypeId);
    if (selectedType) {
      return t(selectedType.name);
    }
    return null;
  }

  return (
    <div className={`fnb-promotion-card ${isDiscountCode ? "discount-code-style" : "store-code-style"}`}>
      <DiscountCodeDetailComponent
        discountCodeDetail={discountCodeDetail}
        isOpenDiscountCodeDetail={isOpenDiscountCodeDetail}
        handleCancel={handleCloseDiscountCodeDetail}
        colorConfig={colorConfig}
      />
      <Row className="row-header-card">
        <Col className="col-header-card">
          <div className="header-card">
            <div
              className={isDiscountCode ? "card-title-discount" : "card-title-store"}
              onClick={showDiscountCodeDetail}
            >
              <p>{data?.name}</p>
            </div>
          </div>
          {isDiscountCode && (
            <div className="discount-code">
              <div className="discount">
                <div className="icon">
                  <DiscountCodeIcon />
                </div>
                <div className="code">{data?.code}</div>
              </div>
            </div>
          )}
        </Col>
        <Col className="col-button-redeem">
          <div className="card-icon">
            <div className="card-icon-content">{isDiscountCode ? <DiscountCodeCardIcon /> : <StoreDiscountIcon />}</div>
          </div>
        </Col>
      </Row>

      <div className={`content-card ${isDiscountCode ? "content-card-discount" : ""}`}>
        <ul className="discount-type">
          <li>
            {renderPromotionType(ListPromotionType, data?.discountCodeTypeId, t)}
            {renderPromotionType(ListPromotionType, data?.promotionTypeId, t)}
          </li>
        </ul>
        <div className="discount-amount-parent">
          <span className="discount-amount">
            {data?.percentNumber > 0 ? data?.percentNumber + "%" : data?.maximumDiscountAmount + "đ"}
          </span>
        </div>
        <div className={isDiscountCode ? "end-date-discount" : "end-date-store"}>
          {isDiscountCode
            ? renderEndDateDiscount(translatedData.endDate, data?.endDate)
            : renderEndDateStore(translatedData.endDate, data?.endDate)}
        </div>
      </div>
    </div>
  );
}

export default FnbPromotionCard;
