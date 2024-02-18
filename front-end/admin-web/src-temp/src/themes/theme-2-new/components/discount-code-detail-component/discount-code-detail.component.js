import { Col, Modal, Row, Space } from "antd";
import moment from "moment";
import "moment/locale/vi";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useAppCtx } from "../../../providers/app.provider";
import { DiscountCodeDetailIcon, DiscountCodeIcon } from "../../assets/icons.constants";
import { IconButtonClose } from "../../assets/icons/ButtonCloseIcon";
import { RenderDiscountCodeTypeNameFromTypeId } from "../discount-code-common-component/discount-code-common.component";
import "./discount-code-details.components.scss";

const StyledDiscountCodeDetail = styled.div`
  .discount-code-detail {
    .row-code .code .code-text {
      svg {
        path {
          stroke: ${(props) => props?.colorConfig?.buttonTextColor};
        }
      }
    }
  }
  .discount-code-detail {
    .discount-code-detail-body .text-detail {
      color: ${(props) => props?.colorConfig?.textColor};
    }
    .discount-code-detail-header {
      .row-name {
        color: ${(props) => props?.colorConfig?.titleColor};
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
      title: t("couponConditions.title", "Điều kiện áp dụng"),
      minimumPurchase: t("couponConditions.minimumPurchase", "Minimum purchase amount on bill"),
      allBranches: t("couponConditions.allBranches", "Tất cả chi nhánh"),
      branch: t("couponConditions.branch", "Chi nhánh"),
      platform: t("couponConditions.platform", "Nền tảng"),
      includedTopping: t("couponConditions.includedTopping", "Included Topping"),
    },
    termsAndCondition: t("discountCodeDetail.termsAndCondition", "Terms and conditions:"),
    isLimitNumberCouponUse: t(
      "discountCodeDetail.isLimitNumberCouponUse",
      "Limit number of time this coupon can be used",
    ),
    copySuccessfully: t("bankTransfer.copySuccess", "Copy successfully!"),
    product: t("discountCodeDetail.product", "Product"),
    branch: t("discountCodeDetail.branch", "Branch"),
    startDate: t("discountCodeDetail.startDate", "Start"),
    endDate: t("discountCodeDetail.endDate", "End"),
    productCategory: t("discountCodeDetail.productCategory", "Product Category"),
    limitOneTimeUse: t("discountCodeDetail.limitOneTimeUse", "Limit on used per customer"),
    discountValue: t("discountCodeDetail.discountValue", "Discount value"),
    maxDiscount: t("discountCodeDetail.maxDiscount", "Max discount"),
    yes: t("discountCodeDetail.yes", "Yes"),
    no: t("discountCodeDetail.no", "No"),
    discountCodeDetailText: t("discountCodeDetail.discountCodeDetailText", "Discount code detail"),
    allProducts: t("discountCodeDetail.allProducts", "All Products"),
    allCategories: t("discountCodeDetail.allCategories", "All Categories"),
  };
  function handleClickCoppyDiscountCode(code) {
    navigator.clipboard.writeText(code);
    Toast.success({
      message: translateData.copySuccessfully,
      placement: "top",
    });
  }

  function renderDiscountAmount(discountCodeDetail) {
    if (!discountCodeDetail?.isPercentDiscount) {
      if (discountCodeDetail?.maximumDiscountAmount > 0) {
        return <span className="text-detail">{discountCodeDetail?.maximumDiscountAmount?.toLocaleString()}đ</span>;
      }
    } else {
      return <span className="text-detail">{discountCodeDetail?.percentNumber}%</span>;
    }
  }

  function renderMaximumDiscount(discountCodeDetail, translateData) {
    if (discountCodeDetail?.maximumDiscountAmount > 0) {
      return (
        <div>
          <span className="text-title">{translateData.maxDiscount}</span>
          <span className="text-detail">{discountCodeDetail?.maximumDiscountAmount?.toLocaleString()}đ</span>
        </div>
      );
    }
    return null; // Trả về null nếu không có giảm giá tối đa
  }

  function formatDateTime(dateTime, language, format) {
    return moment.utc(dateTime).locale(language).local().format(format);
  }

  function renderProductOrCategoryList(discountCodeDetail, translateData) {
    if (discountCodeDetail?.discountCodeTypeId === 1) {
      // Loại mã giảm giá sản phẩm
      return (
        <Row className="row-group-title-detail">
          <div>
            <span className="text-title">{translateData.product}</span>
            <div className="detail">
              {discountCodeDetail?.discountCodeProducts?.map((product, index) => (
                <span className={`text-detail `}>{product.productName}</span>
              ))}
              {discountCodeDetail?.discountCodeProducts?.length == 0 ? (
                <span className={`text-detail `}>{translateData.allProducts}</span>
              ) : (
                ""
              )}
            </div>
          </div>
        </Row>
      );
    } else if (discountCodeDetail?.discountCodeTypeId === 2) {
      // Loại mã giảm giá danh mục sản phẩm
      return (
        <Row className="row-group-title-detail">
          <div>
            <span className="text-title">{translateData.productCategory}</span>
            <div className="detail">
              {discountCodeDetail?.discountCodeProductCategories?.map((category, index) => (
                <span className={`text-detail`}>{category?.productCategoryName}</span>
              ))}
              {discountCodeDetail?.discountCodeProductCategories?.length == 0 ? (
                <span className={`text-detail`}>{translateData.allCategories}</span>
              ) : (
                ""
              )}
            </div>
          </div>
        </Row>
      );
    }
    return null; // Trả về null nếu discountCodeDetail không phải loại 1 hoặc 2
  }

  function renderTermsAndConditions(discountCodeDetail, translateData) {
    if (discountCodeDetail?.termsAndCondition) {
      return (
        <Row className="row-group-title-detail">
          <span className="text-title">{translateData?.termsAndCondition}</span>
          <span className="text-detail">{discountCodeDetail?.termsAndCondition}</span>
        </Row>
      );
    }
    return null;
  }

  function renderMinimumPurchaseAmount(discountCodeDetail, translateData) {
    if (discountCodeDetail?.minimumPurchaseAmount > 0) {
      return (
        <Row className="row-group-title-detail">
          <div>
            <span className="text-title">{translateData.couponConditions.minimumPurchase}</span>
            <span className="text-detail">{discountCodeDetail?.minimumPurchaseAmount?.toLocaleString()}đ</span>
          </div>
        </Row>
      );
    }
    return null;
  }

  function renderBranches(branches) {
    return branches?.map((branch, index) => (
      <span className={`text-detail`} key={index}>
        {branch?.branchName}
      </span>
    ));
  }

  function renderPlatformNames(platforms) {
    return platforms?.map((platform) => platform?.platformName);
  }

  function renderYesNoValue(value, translateData) {
    return value ? translateData.yes : translateData.no;
  }

  return (
    <Modal
      title={
        <div
          style={{ background: colorConfig?.buttonBackgroundColor, color: colorConfig?.buttonTextColor }}
          className="modal-title"
        >
          {translateData.discountCodeDetailText}
        </div>
      }
      open={isOpenDiscountCodeDetail}
      onCancel={handleCancel}
      footer={null}
      bodyStyle={{ paddingBottom: "20px" }}
      wrapClassName="discount-code-detail-modal"
      closeIcon={<IconButtonClose color={colorConfig?.buttonTextColor} />}
    >
      <StyledDiscountCodeDetail colorConfig={colorConfig}>
        {discountCodeDetail && (
          <Col className="discount-code-detail">
            <div className="discount-code-detail-header">
              <div className="row-icon-discount">
                <DiscountCodeDetailIcon />
              </div>

              <div className="row-name">{discountCodeDetail?.name}</div>

              <div className="row-discount-code-type">
                <span className="discount-code-type">
                  {RenderDiscountCodeTypeNameFromTypeId(t, discountCodeDetail)}
                </span>
              </div>

              <div className="row-code">
                <div
                  className="code"
                  onClick={() => {
                    handleClickCoppyDiscountCode(discountCodeDetail?.code);
                  }}
                >
                  <DiscountCodeIcon />
                  <span className="code-text">{discountCodeDetail?.code}</span>
                </div>
              </div>
            </div>

            <div className="discount-code-detail-body">
              <Row gutter={[16, 16]} className="row-group-title-detail">
                <Col span={12}>
                  <span className="text-title">{translateData.discountValue}</span>
                  {renderDiscountAmount(discountCodeDetail)}
                </Col>

                <Col span={12}>{renderMaximumDiscount(discountCodeDetail, translateData)}</Col>
              </Row>

              <Row gutter={[16, 16]} className="row-group-title-detail">
                <Col span={12}>
                  <span className="text-title">{translateData.startDate}</span>
                  <span className="text-detail">
                    {formatDateTime(discountCodeDetail?.startDate, i18n.language, "DD/MM/YYYY, HH:mm")}
                  </span>
                </Col>

                <Col span={12}>
                  <span className="text-title">{translateData.endDate}</span>
                  <span className="text-detail">
                    {formatDateTime(discountCodeDetail?.endDate, i18n.language, "DD/MM/YYYY, HH:mm")}
                  </span>
                </Col>
              </Row>

              {renderProductOrCategoryList(discountCodeDetail, translateData)}

              {renderTermsAndConditions(discountCodeDetail, translateData)}

              {renderMinimumPurchaseAmount(discountCodeDetail, translateData)}

              <Row className="row-group-title-detail">
                <span className="text-title">{translateData.branch}</span>
                {discountCodeDetail?.isAllBranches && (
                  <span className={`text-detail`}>{translateData.couponConditions.allBranches}</span>
                )}
                {!discountCodeDetail?.isAllBranches && (
                  <div className="detail">{renderBranches(discountCodeDetail?.discountCodeBranches)}</div>
                )}
              </Row>

              <Row className="row-group-title-detail">
                <span className="text-title">{translateData.couponConditions.platform}</span>
                <span className="text-detail">
                  <Space size={"middle"}>{renderPlatformNames(discountCodeDetail?.discountCodePlatforms)}</Space>
                </span>
              </Row>

              <Row className="row-group-title-detail">
                <span className="text-title">{translateData.couponConditions.includedTopping} </span>
                <span className="text-detail">
                  {renderYesNoValue(discountCodeDetail?.isIncludedTopping, translateData)}
                </span>
              </Row>

              {discountCodeDetail?.isLimitNumberCouponUse && (
                <Row className="row-group-title-detail">
                  <div>
                    <span className="text-title">{translateData.isLimitNumberCouponUse}</span>
                    <span className="text-detail">{discountCodeDetail?.maximumLimitCouponUse}</span>
                  </div>
                </Row>
              )}

              <Row className="row-group-title-detail">
                <div>
                  <span className="text-title">{translateData.limitOneTimeUse}</span>
                  <span className="text-detail">
                    {renderYesNoValue(discountCodeDetail?.isLimitOneTimeUse, translateData)}
                  </span>
                </div>
              </Row>
            </div>
          </Col>
        )}
      </StyledDiscountCodeDetail>
    </Modal>
  );
}
