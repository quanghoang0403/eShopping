import { Col, Modal, Row } from "antd";
import moment from "moment";
import "moment/locale/vi";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useAppCtx } from "../../../providers/app.provider";
import { CopyIcon } from "../../assets/icons.constants";
import { ListPromotionType } from "../../constants/enums";
import "./discount-code-details.components.scss";
const StyledDiscountCodeDetail = styled.div`
  .discount-code-detail {
    .row-code .code .code-text {
      svg {
        path {
          stroke: ${(props) => props?.colorConfig?.buttonBackgroundColor};
        }
      }
    }
    .percent {
      .percent-text {
        color: ${(props) => props?.colorConfig?.buttonBackgroundColor};
        border: 1px solid
          ${(props) =>
            props?.colorConfig?.buttonBackgroundColor != "transparent"
              ? props?.colorConfig?.buttonBackgroundColor
              : "#026f30"};
      }
      .unit {
        background: ${(props) =>
          props?.colorConfig?.buttonBackgroundColor != "transparent"
            ? props?.colorConfig?.buttonBackgroundColor
            : "#026f30"};
        border: 1px solid
          ${(props) =>
            props?.colorConfig?.buttonBackgroundColor != "transparent"
              ? props?.colorConfig?.buttonBackgroundColor
              : "#026f30"};
      }
    }
    .amount {
      .amount-text {
        color: ${(props) => props?.colorConfig?.buttonBackgroundColor};
        border: 1px solid
          ${(props) =>
            props?.colorConfig?.buttonBackgroundColor != "transparent"
              ? props?.colorConfig?.buttonBackgroundColor
              : "#026f30"};
      }
      .unit {
        background: ${(props) =>
          props?.colorConfig?.buttonBackgroundColor != "transparent"
            ? props?.colorConfig?.buttonBackgroundColor
            : "#026f30"};
        border: 1px solid
          ${(props) =>
            props?.colorConfig?.buttonBackgroundColor != "transparent"
              ? props?.colorConfig?.buttonBackgroundColor
              : "#026f30"};
      }
    }
    .discount-code-content .text-detail {
      color: ${(props) => props?.colorConfig?.textColor};
    }
    .discount-code-content .text-title {
      color: ${(props) => props?.colorConfig?.titleColor};
    }
    .discount-code-content .coupon-conditions {
      .platform {
        color: ${(props) => props?.colorConfig?.textColor};
      }
      li {
        color: ${(props) => props?.colorConfig?.textColor};
      }
      li::marker {
        color: ${(props) => props?.colorConfig?.titleColor};
      }
      .minimum-number {
        color: ${(props) => props?.colorConfig?.textColor};
      }
    }
  }
`;
export function DiscountCodeDetailComponent(props) {
  const { isOpenDiscountCodeDetail, handleCancel, discountCodeDetail, colorConfig } = props;
  const [t] = useTranslation();
  const { i18n } = useTranslation();
  const { Toast } = useAppCtx();
  const translateData = {
    couponConditions: {
      title: t("couponConditions.title", "Đang được áp dụng"),
      minimumPurchase: t("couponConditions.minimumPurchase", "Sử dụng"),
      allBranches: t("couponConditions.allBranches", "Bỏ chọn"),
      branch: t("couponConditions.branch", "Lấy mã"),
      platform: t("couponConditions.platform", "Không có ngày hết hạn"),
      includedTopping: t("couponConditions.includedTopping", "Không có ngày hết hạn"),
    },
    termsAndCondition: t("discountCodeDetail.termsAndCondition", "Terms and conditions:"),
    isLimitNumberCouponUse: t(
      "discountCodeDetail.isLimitNumberCouponUse",
      "Limit number of times this coupon can be used",
    ),
    copySuccessfully: t("bankTransfer.copySuccess", "Copy successfully!"),
    product: t("discountCodeDetail.product", "Product"),
    branch: t("discountCodeDetail.branch", "Branch"),
    startDate: t("discountCodeDetail.startDate", "Start Date"),
    endDate: t("discountCodeDetail.endDate", "End Date"),
    productCategory: t("discountCodeDetail.productCategory", "Product Category"),
    limitOneTimeUse: t("discountCodeDetail.limitOneTimeUse", "Limit on used per customer"),
    yes: t("discountCodeDetail.yes", "Yes"),
    no: t("discountCodeDetail.no", "No"),
    allProducts: t("discountCodeDetail.allProducts", "All Products"),
    allCategories: t("discountCodeDetail.allCategories", "All Categories"),
  };
  const onClickCopy = (code) => {
    navigator.clipboard.writeText(code);
    Toast.success({
      message: translateData.copySuccessfully,
      placement: "top",
    });
  };
  return (
    <>
      <Modal
        title={<div className="modal-title">{discountCodeDetail?.name}</div>}
        open={isOpenDiscountCodeDetail}
        onCancel={handleCancel}
        footer={null}
        wrapClassName="discount-code-modal"
      >
        {discountCodeDetail && (
          <StyledDiscountCodeDetail colorConfig={colorConfig}>
            <Col className="discount-code-detail">
              <div className="row-code">
                <div className="code">
                  <span
                    className="code-text"
                    onClick={() => {
                      onClickCopy(discountCodeDetail?.code);
                    }}
                  >
                    {discountCodeDetail?.code}
                    <CopyIcon />
                  </span>
                </div>
                <span className="discount-code-type">
                  {ListPromotionType?.map((item) => {
                    let discountType =
                      discountCodeDetail?.discountCodeTypeId !== undefined
                        ? discountCodeDetail?.discountCodeTypeId
                        : discountCodeDetail?.promotionTypeId;
                    if (item.key === discountType) {
                      return t(item.name);
                    }
                  })}
                </span>
                <span className="discount-code-type">
                  EXP: {moment.utc(discountCodeDetail?.endDate).locale(i18n.language).local().format("MMM DD, YYYY")}
                </span>
                {!discountCodeDetail?.isPercentDiscount && (
                  <div className="amount">
                    <span className="amount-text">{discountCodeDetail?.maximumDiscountAmount?.toLocaleString()}</span>
                    <span className="unit">đ</span>
                  </div>
                )}
                {discountCodeDetail?.isPercentDiscount &&
                  (discountCodeDetail?.maximumDiscountAmount > 0 ? (
                    <div className="percent">
                      <span className="percent-text">
                        {discountCodeDetail?.maximumDiscountAmount?.toLocaleString()}
                      </span>
                      <span className="unit">đ</span>
                    </div>
                  ) : (
                    <div className="percent">
                      <span className="percent-text">{discountCodeDetail?.percentNumber}</span>
                      <span className="unit">%</span>
                    </div>
                  ))}
              </div>

              <div className="discount-code-content">
                <Row>
                  {discountCodeDetail?.discountCodeTypeId == 1 && (
                    <div className="row-product">
                      <span className="text-title">{translateData.product}</span>
                      {discountCodeDetail?.discountCodeProducts?.map((product) => (
                        <li className="text-detail">{product.productName}</li>
                      ))}
                      {discountCodeDetail?.discountCodeProducts?.length == 0 ? (
                        <li className="text-detail">{translateData.allProducts}</li>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </Row>

                <Row>
                  {discountCodeDetail?.discountCodeTypeId == 2 && (
                    <div className="row-product-category">
                      <span className="text-title">{translateData.productCategory}</span>
                      {discountCodeDetail?.discountCodeProductCategories?.map((category) => (
                        <li className="text-detail">{category?.productCategoryName}</li>
                      ))}
                      {discountCodeDetail?.discountCodeProductCategories?.length == 0 ? (
                        <li className="text-detail">{translateData.allCategories}</li>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </Row>

                <Row>
                  <div className="row-branch">
                    <span className="text-title">{translateData.branch}</span>
                    <div className="detail">
                      {discountCodeDetail?.isAllBranches && (
                        <span className="text-detail">{translateData.couponConditions.allBranches}</span>
                      )}
                      {!discountCodeDetail?.isAllBranches &&
                        discountCodeDetail?.discountCodeBranches?.map((branch) => (
                          <span className="text-detail">{branch?.branchName}</span>
                        ))}
                    </div>
                  </div>
                </Row>

                <Row gutter={[16, 16]} className="row-time-exp">
                  <Col span={12}>
                    <span className="text-title">{translateData.startDate}</span>
                    <span className="text-detail">
                      {moment
                        .utc(discountCodeDetail?.startDate)
                        .locale(i18n.language)
                        .local()
                        .format("MMM DD, YYYY HH:mm")}
                    </span>
                  </Col>
                  <Col span={12}>
                    <span className="text-title">{translateData.endDate}</span>
                    <span className="text-detail">
                      {moment
                        .utc(discountCodeDetail?.endDate)
                        .locale(i18n.language)
                        .local()
                        .format("MMM DD, YYYY HH:mm")}
                    </span>
                  </Col>
                </Row>

                {discountCodeDetail?.termsAndCondition && (
                  <Row>
                    <div className="row-terms-and-condition">
                      <span className="text-title">{translateData?.termsAndCondition}</span>
                      <span className="text-detail">{discountCodeDetail?.termsAndCondition}</span>
                    </div>
                  </Row>
                )}

                <Row className="row-coupon-conditions">
                  <span className="text-title">{translateData.couponConditions.title}</span>
                  <ul className="coupon-conditions">
                    {discountCodeDetail?.minimumPurchaseAmount > 0 && (
                      <li>
                        {translateData.couponConditions.minimumPurchase}:{" "}
                        <span className="minimum-number">
                          {discountCodeDetail?.minimumPurchaseAmount?.toLocaleString()}đ
                        </span>
                      </li>
                    )}
                    <li>
                      {translateData.couponConditions.platform}
                      <span className="platform">
                        {" "}
                        (
                        {discountCodeDetail?.discountCodePlatforms?.map((platform, index) => (
                          <span key={platform?.platformId}>
                            {platform?.platformName}
                            {index === discountCodeDetail.discountCodePlatforms.length - 1 ? "" : ", "}
                          </span>
                        ))}
                        )
                      </span>
                    </li>
                    {discountCodeDetail?.isIncludedTopping && (
                      <li>{translateData.couponConditions.includedTopping} </li>
                    )}
                  </ul>
                </Row>

                {discountCodeDetail?.isLimitNumberCouponUse && (
                  <Row>
                    <div className="row-limit-coupon-use">
                      <span className="text-title">{translateData.isLimitNumberCouponUse}</span>
                      <span className="text-detail">{discountCodeDetail?.maximumLimitCouponUse?.toLocaleString()}</span>
                    </div>
                  </Row>
                )}

                <Row>
                  <div>
                    <span className="text-title">{translateData.limitOneTimeUse}</span>
                    <span className="text-detail">
                      {discountCodeDetail?.isLimitOneTimeUse ? translateData.yes : translateData.no}
                    </span>
                  </div>
                </Row>
              </div>
            </Col>
          </StyledDiscountCodeDetail>
        )}
      </Modal>
    </>
  );
}
