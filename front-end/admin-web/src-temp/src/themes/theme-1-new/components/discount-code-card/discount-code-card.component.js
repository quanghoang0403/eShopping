import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import discountCodeDataService from "../../../data-services/discount-code-data.service";
import { formatTextNumber, getStoreConfig } from "../../../utils/helpers";
import { CheckDiscountCodeIcon, DatetimeDiscountCodeIcon, PercentDiscountCodeIcon } from "../../assets/icons.constants";
import { ListPromotionType } from "../../constants/enums";
import { DateFormat, Percent, currency } from "../../constants/string.constants";
import { DiscountCodeDetailComponent } from "../discount-code-detail-component/discount-code-detail.component";
import "./discount-code-card.component.scss";
export function DiscountCodeCard(props) {
  const {
    data,
    isShowRedeem,
    isHomepage,
    onClickRedeem,
    onClickUse,
    isActive,
    isCheckOutPage,
    isApply,
    colorConfig,
    hiddenDiscount,
  } = props;
  const isDiscountCode = data?.code ?? false;
  const [isOpenDiscountCodeDetail, setIsOpenDiscountCodeDetail] = useState(false);
  const [discountCodeDetail, setDiscountCodeDetail] = useState(null);
  const [t] = useTranslation();
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });

  const translateData = {
    currentlyBeingApplied: t("promotion.discountCode.currentlyBeingApplied", "Đang được áp dụng"),
    use: t("promotion.discountCode.use", "Sử dụng"),
    unChecked: t("promotion.discountCode.unChecked", "Bỏ chọn"),
    redeem: t("promotion.discountCode.redeem", "Lấy mã"),
    unlimited: t("promotion.discountCode.unlimited", "Không có ngày hết hạn"),
  };

  const onHandleClickUse = (code) => {
    onClickUse(code);
  };

  const renderEndDateStore = (endDate) => {
    if (!endDate) {
      return <span>{translateData.unlimited}</span>;
    }
    return (
      <span>
        {moment.utc(data?.endDate).local().format(DateFormat.ll) +
          " - " +
          moment.utc(data?.endDate).local().format(DateFormat.HH_MM)}
      </span>
    );
  };

  const showDiscountCodeDetail = async () => {
    const storeConfig = getStoreConfig();
    const discountCodeDetail = await discountCodeDataService.getDiscountCodeDetailByIdAsync(
      storeConfig?.storeId,
      data?.id,
    );
    if (discountCodeDetail?.data?.discountCode) {
      hiddenDiscount && hiddenDiscount(true);
      setIsOpenDiscountCodeDetail(true);
      setDiscountCodeDetail(discountCodeDetail?.data?.discountCode);
    }
  };

  const handleCloseDiscountCodeDetail = () => {
    hiddenDiscount && hiddenDiscount(false);
    setIsOpenDiscountCodeDetail(false);
  };
  return (
    <div
      className={`fnb-discount-code-card-theme-1 ${isCheckOutPage ? "discount-code-card-check-out-modal" : ""} ${
        isActive && "apply"
      }`}
    >
      <DiscountCodeDetailComponent
        discountCodeDetail={discountCodeDetail}
        isOpenDiscountCodeDetail={isOpenDiscountCodeDetail}
        handleCancel={handleCloseDiscountCodeDetail}
        colorConfig={colorConfig}
      />
      <div className={`discount-code-apply ${isActive && "apply-total"}`}>
        <CheckDiscountCodeIcon />
        <span>{translateData.currentlyBeingApplied}</span>
      </div>
      <div
        className={`${
          isShowRedeem
            ? "discount-code-content"
            : isApply || !isDiscountCode || isHomepage
            ? "discount-code-content-store-discount"
            : "discount-code-content-store-discount disabled"
        }`}
      >
        <div className="discount-code-content-name" onClick={showDiscountCodeDetail}>
          <div>
            <span className="discount-icon">
              <PercentDiscountCodeIcon />
            </span>
          </div>
          <span className="text-line-clamp-1">{data?.name}</span>
        </div>
        {data?.code && (
          <div className="discount-code-code">
            <span>{data?.code}</span>
          </div>
        )}
        <div className="discount-code-type-redeem">
          <p className="discount-code-type">
            {ListPromotionType?.map((item) => {
              let discountType =
                data?.discountCodeTypeId !== undefined ? data?.discountCodeTypeId : data?.promotionTypeId;
              if (item.key === discountType) {
                return t(item.name);
              }
            })}
          </p>
          {isShowRedeem === true && !isMaxWidth575 && (
            <p className="discount-code-redeem" onClick={() => onClickRedeem(data?.id)}>
              {translateData.redeem}
            </p>
          )}
        </div>
        <div className="discount-code-currency">
          <div className="value">
            <span>
              {formatTextNumber(data?.isPercentDiscount === true ? data?.percentNumber : data?.maximumDiscountAmount)}
            </span>
          </div>
          <div className="currency">
            <span>{data?.isPercentDiscount === true ? Percent : currency.d}</span>
          </div>
        </div>
        <hr className="discount-code-hr" />
        <div className="discount-code-inverted"></div>
        <div className="discount-code-datetime">
          {
            <>
              <DatetimeDiscountCodeIcon />
              {isShowRedeem === true && data?.endDate ? (
                <span>
                  {moment.utc(data?.endDate).local().format(DateFormat.ll) +
                    " - " +
                    moment.utc(data?.endDate).local().format(DateFormat.HH_MM)}
                </span>
              ) : (
                renderEndDateStore(data?.endDate)
              )}
            </>
          }

          <span>
            {isShowRedeem === true && isMaxWidth575 && (
              <p className="discount-code-redeem" onClick={() => onClickRedeem(data?.id)}>
                {translateData.redeem}
              </p>
            )}
          </span>
        </div>
        {isHomepage === true || (
          <>
            <div
              className={`discount-code-card${isActive ? "-active" : isApply ? "" : " disabled"}`}
              onClick={() => {
                onHandleClickUse(data?.code);
              }}
            >
              <span>{isActive ? translateData.unChecked : translateData.use}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
