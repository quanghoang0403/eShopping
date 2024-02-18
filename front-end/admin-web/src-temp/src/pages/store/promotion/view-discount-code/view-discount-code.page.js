import { StopOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Row, Typography, message } from "antd";
import widgetOrange from "assets/images/widget-orange.png";
import widgetPurple from "assets/images/widget-purple.png";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { CancelButton } from "components/cancel-button";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import OverviewWidget from "components/overview-widget/overview-widget.component";
import PageTitle from "components/page-title";
import { StopFill, SummaryWidgetOrangeIcon, SummaryWidgetPurpleIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { Platform } from "constants/platform.constants";
import { ListPromotionType, PromotionStatus, PromotionType } from "constants/promotion.constants";
import { DateFormat } from "constants/string.constants";
import discountCodeDataService from "data-services/discount-code/discount-code-data.service";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useHistory, useRouteMatch } from "react-router-dom";
import { formatCurrency, formatDate, formatTextNumber, getCurrency } from "utils/helpers";
import { DiscountCodeUsageDetailComponent } from "./discount-code-usage-detail.component";
import "./view-discount-code.style.scss";

const { Text, Paragraph } = Typography;

export default function ViewDiscountCodePage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const [discountCodeData, setDiscountCodeData] = useState({});
  const [totalDiscountOrder, setTotalDiscountOrder] = useState(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  const [showModalUsageDetail, setShowModalUsageDetail] = useState(false);
  const [isPlatformPOS, setIsPlatformPOS] = useState(false);
  const [isPlatformGoFnbApp, setIsPlatformGoFnbApp] = useState(false);
  const [isPlatformStoreWeb, setIsPlatformStoreWeb] = useState(false);
  const [isPlatformStoreApp, setIsPlatformStoreApp] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmStop, setShowConfirmStop] = useState(false);
  const [showCountCustomerSegment, setShowCountCustomerSegment] = useState(false);
  const [isAllCustomers, setIsAllCustomers] = useState(true);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalSegment, setTotalSegment] = useState(0);

  const isMaxWidth500 = useMediaQuery({ maxWidth: 500 });
  const discountCodeUsageDetailRef = useRef();

  useEffect(() => {
    async function fetchData() {
      await getInitDataAsync(match?.params?.discountCodeId);
    }
    fetchData();
  }, []);

  const getInitDataAsync = async (discountCodeId) => {
    if (discountCodeId) {
      const res = await discountCodeDataService.getDiscountCodeByIdAsync(discountCodeId);
      if (res) {
        const { discountCode, totalDiscountOrder, totalDiscountAmount } = res;
        setDiscountCodeData(discountCode);
        setTotalDiscountOrder(totalDiscountOrder);
        setTotalDiscountAmount(totalDiscountAmount);
        setIsAllCustomers(discountCode?.isAllCustomers);
        if (!discountCode?.isAllCustomers) {
          setTotalSegment(discountCode?.totalSegment);
          setTotalCustomer(discountCode?.totalCustomer);
          setShowCountCustomerSegment(true);
        }
        discountCode?.platforms?.forEach((item) => {
          switch (item.platformId?.toLowerCase()) {
            case Platform.POS.toLowerCase():
              setIsPlatformPOS(true);
              break;
            case Platform.GoFnBApp.toLowerCase():
              setIsPlatformGoFnbApp(true);
              break;
            case Platform.StoreWebsite.toLowerCase():
              setIsPlatformStoreWeb(true);
              break;
            case Platform.StoreMobileApp.toLowerCase():
              setIsPlatformStoreApp(true);
              break;
            default:
              break;
          }
        });
      }
    }
  };

  const pageData = {
    leaveForm: t("messages.leaveForm"),
    create: t("promotion.create"),
    btnCancel: t("button.cancel"),
    btnLeave: t("button.leave"),
    btnEdit: t("button.edit"),
    btnSave: t("button.save"),
    okText: t("button.ok"),
    btnStop: t("button.stop"),
    btnDelete: t("button.delete", "Delete"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmStopDiscountCode: t("discountCode.confirmStopDiscountCode"),
    btnIgnore: t("button.ignore"),
    guideline: {
      title: t("discountCodeDetail.guideline.title"),
      content: t("discountCodeDetail.guideline.content"),
    },
    summary: {
      title: t("discountCodeDetail.summary.title"),
      viewDetail: t("discountCodeDetail.summary.viewDetail"),
      totalDiscountOrder: t("discountCodeDetail.summary.totalDiscountOrder"),
      totalDiscountAmount: t("discountCodeDetail.summary.totalDiscountAmount"),
    },
    generalInformation: {
      title: t("title.generalInformation"),
      name: t("discountCodeDetail.generalInformation.name"),
      applicableType: t("discountCodeDetail.generalInformation.applicableType"),
      discountValue: t("discountCodeDetail.generalInformation.discountValue"),
      maxDiscount: t("discountCodeDetail.generalInformation.maxDiscount"),
      startDate: t("discountCodeDetail.generalInformation.startDate"),
      endDate: t("discountCodeDetail.generalInformation.endDate"),
      condition: t("discountCodeDetail.generalInformation.condition"),
      product: t("discountCodeDetail.generalInformation.product"),
      productCategory: t("discountCodeDetail.generalInformation.productCategory"),
    },
    couponConditions: {
      title: t("discountCodeDetail.couponConditions.title"),
      minimumPurchase: t("discountCodeDetail.couponConditions.minimumPurchase"),
      allBranches: t("discountCodeDetail.couponConditions.allBranches"),
      branch: t("discountCodeDetail.couponConditions.branch"),
      platform: t("discountCodeDetail.couponConditions.platform"),
      includedTopping: t("discountCodeDetail.couponConditions.includedTopping"),
    },
    code: {
      title: t("discountCodeDetail.code.title"),
      usageLimits: {
        title: t("discountCodeDetail.code.usageLimits.title"),
        limitCoupon: t("discountCodeDetail.code.usageLimits.limitCoupon"),
        limitCustomer: t("discountCodeDetail.code.usageLimits.limitCustomer"),
      },
      discountCode: t("discountCodeDetail.code.discountCode"),
    },
    button: {
      btnDelete: t("button.delete"),
      btnIgnore: t("button.ignore"),
    },
    notificationTitle: t("form.notificationTitle"),
    stopDiscountCodeSuccess: t("discountCode.stopDiscountCodeSuccess"),
    stopDiscountCodeFail: t("discountCode.stopDiscountCodeFail"),
    deleteDiscountCodeMessage: t("discountCode.deleteDiscountCodeMessage"),
    deleteDiscountCodeSuccess: t("discountCode.deleteDiscountCodeSuccess"),
    deleteDiscountCodeFail: t("discountCode.deleteDiscountCodeFail"),
    allCustomers: t("discountCode.formCreate.allCustomers"),
    allProduct: t("discountCode.formCreate.allProducts"),
    allCategories: t("discountCode.formCreate.allCategories"),
  };

  const onClickViewUsageDetail = () => {
    setShowModalUsageDetail(true);
    discountCodeUsageDetailRef?.current?.fetchData(discountCodeData?.id);
  };

  const onCancelViewUsageDetail = () => {
    setShowModalUsageDetail(false);
  };

  const goBack = () => {
    history.push("/store/promotion/discountCode");
  };

  const goToEditPage = () => {
    history.push(`/store/discountCode/edit/${discountCodeData?.id}`);
  };

  const onStopDiscountCode = async (id) => {
    await discountCodeDataService.stopDiscountCodeByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.stopDiscountCodeSuccess);
        history.push("/store/promotion/discountCode");
      } else {
        message.error(pageData.stopDiscountCodeFail);
      }
    });
  };

  const formatDeleteMessage = (name) => {
    let mess = t(pageData.deleteDiscountCodeMessage, { name: name });
    return mess;
  };

  const onDeleteDiscountCode = async (id) => {
    await discountCodeDataService.deleteDiscountCodeByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.deleteDiscountCodeSuccess);
        history.push("/store/promotion/discountCode");
      } else {
        message.error(pageData.deleteDiscountCodeFail);
      }
    });
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle className="promotion-guideline-page-title" content={discountCodeData?.name} />
          <FnbGuideline placement="rightTop" title={pageData.guideline.title} content={pageData.guideline.content} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={
              discountCodeData?.statusId === PromotionStatus.Schedule
                ? [
                    {
                      action: (
                        <Button className="button-edit-qr-code" type="primary" onClick={goToEditPage}>
                          {pageData.btnEdit}
                        </Button>
                      ),
                      permission: PermissionKeys.EDIT_DISCOUNT_CODE,
                    },
                    {
                      action: <CancelButton buttonText={pageData.btnLeave} onOk={goBack} />,
                    },
                    {
                      action: (
                        <Button
                          className="button-stop-qr-code button-delete-qr-code"
                          type="link"
                          onClick={() => setShowConfirmDelete(true)}
                        >
                          {pageData.btnDelete}
                        </Button>
                      ),
                      permission: PermissionKeys.DELETE_DISCOUNT_CODE,
                    },
                  ]
                : discountCodeData?.statusId === PromotionStatus.Active
                ? [
                    {
                      action: (
                        <Button className="action-stop" type="primary" onClick={() => setShowConfirmStop(true)}>
                          {pageData.btnStop}
                        </Button>
                      ),
                      permission: PermissionKeys.STOP_DISCOUNT_CODE,
                    },
                    {
                      action: <CancelButton buttonText={pageData.btnLeave} onOk={goBack} />,
                    },
                  ]
                : [
                    {
                      action: (
                        <Button
                          onClick={() => history.push("/store/promotion/discountCode")}
                          className="material-view-button-edit"
                        >
                          {pageData.btnLeave}
                        </Button>
                      ),
                      permission: null,
                    },
                  ]
            }
          />
        </Col>
      </Row>

      {/* Overview widget */}
      <div className="card-discount-code-detail ">
        <div className="d-flex justify-space-between w-100">
          <div className="title-session">
            <span>{pageData.summary.title}</span>
          </div>
          <div className="view-detail-text ml-auto cursor-pointer" onClick={onClickViewUsageDetail}>
            <span>{pageData.summary.viewDetail}</span>
          </div>
        </div>
        {isMaxWidth500 ? (
          <div>
            <OverviewWidget
              backgroundImage={widgetPurple}
              widgetIcon={<SummaryWidgetPurpleIcon />}
              amount={formatTextNumber(totalDiscountOrder)}
              description={pageData.summary.totalDiscountOrder}
            />
            <OverviewWidget
              backgroundImage={widgetOrange}
              widgetIcon={<SummaryWidgetOrangeIcon />}
              className="mt-24"
              amount={formatTextNumber(totalDiscountAmount)}
              description={`${pageData.summary.totalDiscountAmount} (${getCurrency()})`}
            />
          </div>
        ) : (
          <Row gutter={[36, 36]}>
            <Col sm={24} lg={12}>
              <OverviewWidget
                backgroundImage={widgetPurple}
                widgetIcon={<SummaryWidgetPurpleIcon />}
                className="float-right"
                amount={formatTextNumber(totalDiscountOrder)}
                description={pageData.summary.totalDiscountOrder}
              />
            </Col>
            <Col sm={24} lg={12}>
              <OverviewWidget
                backgroundImage={widgetOrange}
                widgetIcon={<SummaryWidgetOrangeIcon />}
                amount={formatTextNumber(totalDiscountAmount)}
                description={`${pageData.summary.totalDiscountAmount} (${getCurrency()})`}
              />
            </Col>
          </Row>
        )}
      </div>

      {/* General information */}
      <Card className={`fnb-card card-discount-code-detail ${isMaxWidth500 ? "mt-36" : "mt-48"}`}>
        <div className="title-session">
          <span>{pageData.generalInformation.title}</span>
        </div>
        <Row>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.generalInformation.name}</p>
              <p className="text-detail">{discountCodeData?.name}</p>
            </div>
          </Col>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.generalInformation.applicableType}</p>
              <p className="text-detail">
                {ListPromotionType?.map((item) => {
                  if (item.key === discountCodeData?.discountCodeTypeId) {
                    return t(item.name);
                  }
                })}
              </p>
            </div>
          </Col>

          {discountCodeData?.discountCodeTypeId === PromotionType.DiscountProduct && (
            <Col span={24}>
              <h3 className="fnb-form-label material-view-lable-text-color">{pageData.generalInformation.product}</h3>
              <Row className="mb-3">
                {discountCodeData?.isApplyAllProducts ? (<Paragraph
                  style={{ maxWidth: "inherit" }}
                  placement="top"
                  ellipsis={{ tooltip: pageData.allProduct }}
                  color="#50429B"
                  className="material-view-branch-select material-view-text"
                >
                  {pageData.allProduct}
                </Paragraph>) :
                  discountCodeData?.productPrices?.map((item) => {
                    return (
                      <Paragraph
                        style={{ maxWidth: "inherit" }}
                        placement="top"
                        ellipsis={{ tooltip: item.productName }}
                        color="#50429B"
                        className="material-view-branch-select material-view-text"
                      >
                        {item?.productName + (item?.name ? `(${item?.name})` : "")}
                      </Paragraph>
                    );
                  })}
              </Row>
            </Col>
          )}

          {discountCodeData?.discountCodeTypeId === PromotionType.DiscountProductCategory && (
            <Col span={24}>
              <h3 className="fnb-form-label material-view-lable-text-color">
                {pageData.generalInformation.productCategory}
              </h3>
              <Row className="mb-3">
                {discountCodeData?.isApplyAllCategories ? (<Paragraph
                  style={{ maxWidth: "inherit" }}
                  placement="top"
                  ellipsis={{ tooltip: pageData.allCategories }}
                  color="#50429B"
                  className="material-view-branch-select material-view-text"
                >
                  {pageData.allCategories}
                </Paragraph>) :
                  discountCodeData?.productCategories?.map((item) => {
                    return (
                      <Paragraph
                        style={{ maxWidth: "inherit" }}
                        placement="top"
                        ellipsis={{ tooltip: item.productCategoryName }}
                        color="#50429B"
                        className="material-view-branch-select material-view-text"
                      >
                        {item.productCategoryName}
                      </Paragraph>
                    );
                  })}
              </Row>
            </Col>
          )}

          {discountCodeData?.isPercentDiscount ? (
            <>
              <Col xs={24} lg={discountCodeData?.maximumDiscountAmount > 0 ? 12 : 24}>
                <div className="text-container">
                  <p className="text-label">{pageData.generalInformation.discountValue}</p>
                  <p className="text-detail">{discountCodeData?.percentNumber}%</p>
                </div>
              </Col>
              {discountCodeData?.maximumDiscountAmount > 0 && (
                <Col sm={24} lg={12}>
                  <div className="text-container">
                    <p className="text-label">{pageData.generalInformation.maxDiscount}</p>
                    <p className="text-detail">{formatCurrency(discountCodeData?.maximumDiscountAmount)}</p>
                  </div>
                </Col>
              )}
            </>
          ) : (
            <Col span={24}>
              <div className="text-container">
                <p className="text-label">{pageData.generalInformation.discountValue}</p>
                <p className="text-detail">{formatCurrency(discountCodeData?.maximumDiscountAmount)}</p>
              </div>
            </Col>
          )}

          <Col sm={24} lg={12}>
            <div className="text-container">
              <p className="text-label">{pageData.generalInformation.startDate}</p>
              <p className="text-detail">
                {formatDate(discountCodeData?.startDate, DateFormat.DD_MM_YYYY_HH_MM_NO_COMMA)}
              </p>
            </div>
          </Col>
          <Col sm={24} lg={12}>
            <div className="text-container">
              <p className="text-label">{pageData.generalInformation.endDate}</p>
              <p className="text-detail">
                {formatDate(discountCodeData?.endDate, DateFormat.DD_MM_YYYY_HH_MM_NO_COMMA)}
              </p>
            </div>
          </Col>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.generalInformation.condition}</p>
              <p className="text-detail">{discountCodeData?.termsAndCondition}</p>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Coupon conditions */}
      <Card className="fnb-card card-discount-code-detail mt-3">
        <div className="title-session">
          <span>{pageData.couponConditions.title}</span>
        </div>
        <div>
          <Checkbox disabled checked={discountCodeData?.isMinimumPurchaseAmount}>
            <Text className="fnb-form-label material-view-lable-text-color">
              {pageData.couponConditions.minimumPurchase}
            </Text>
          </Checkbox>
        </div>
        {discountCodeData?.isMinimumPurchaseAmount && (
          <div>
            <p className="material-view-text" style={{ marginLeft: "35px" }}>
              {formatCurrency(discountCodeData?.minimumPurchaseAmount)}
            </p>
          </div>
        )}

        <div className="mt-3">
          <Checkbox checked={discountCodeData?.isAllBranches} disabled>
            <Text className="fnb-form-label material-view-lable-text-color">
              {pageData.couponConditions.allBranches}
            </Text>
          </Checkbox>
        </div>

        {!discountCodeData?.isAllBranches && (
          <div className="mt-3">
            <h3 className="fnb-form-label material-view-lable-text-color">{pageData.couponConditions.branch}</h3>
            <Row>
              <Col span={24}>
                <Row>
                  {discountCodeData?.branches?.map((item) => {
                    return (
                      <Paragraph
                        style={{ maxWidth: "inherit" }}
                        placement="top"
                        ellipsis={{ tooltip: item.branchName }}
                        color="#50429B"
                        className="material-view-branch-select material-view-text"
                      >
                        {item.branchName}
                      </Paragraph>
                    );
                  })}
                </Row>
              </Col>
            </Row>
          </div>
        )}

        <Checkbox checked={isAllCustomers} disabled className="mt-3">
          {pageData.allCustomers}
        </Checkbox>

        {showCountCustomerSegment && (
          <div
            className="selected-customer-segment selected-customer-segment-position"
            dangerouslySetInnerHTML={{
              __html: `${t("discountCode.formCreate.customerSegmentSelected", {
                totalSegment: totalSegment,
                totalCustomer: totalCustomer,
              })}`,
            }}
          ></div>
        )}

        <div className="mt-3">
          <h3 className="fnb-form-label material-view-lable-text-color">{pageData.couponConditions.platform}</h3>
          {isMaxWidth500 ? (
            <Row>
              <Col span={24}>
                <Checkbox checked={isPlatformPOS} disabled>
                  <Text className="fnb-form-label">POS</Text>
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox checked={isPlatformGoFnbApp} disabled>
                  <Text className="fnb-form-label">GoF&B App</Text>
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox checked={isPlatformStoreWeb} disabled>
                  <Text className="fnb-form-label">Store Website</Text>
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox checked={isPlatformStoreApp} disabled>
                  <Text className="fnb-form-label">Store App</Text>
                </Checkbox>
              </Col>
            </Row>
          ) : (
            <>
              <Checkbox checked={isPlatformPOS} disabled>
                <Text className="fnb-form-label">POS</Text>
              </Checkbox>
              <Checkbox checked={isPlatformGoFnbApp} disabled>
                <Text className="fnb-form-label">GoF&B App</Text>
              </Checkbox>
              <Checkbox checked={isPlatformStoreWeb} disabled>
                <Text className="fnb-form-label">Store Website</Text>
              </Checkbox>
              <Checkbox checked={isPlatformStoreApp} disabled>
                <Text className="fnb-form-label">Store App</Text>
              </Checkbox>
            </>
          )}
        </div>

        <div className="mt-3 mb-3">
          <Checkbox checked={discountCodeData?.isIncludedTopping} disabled>
            <Text className="fnb-form-label material-view-lable-text-color">
              {pageData.couponConditions.includedTopping}
            </Text>
          </Checkbox>
        </div>
      </Card>

      {/* Code */}
      <Card className="fnb-card card-discount-code-detail mt-3">
        <div className="title-session">
          <span>{pageData.code.title}</span>
        </div>
        <div>
          <Text className="fnb-form-label">{pageData.code.usageLimits.title}</Text>
        </div>
        <div className="mt-3">
          <Checkbox disabled checked={discountCodeData?.isLimitNumberCouponUse}>
            <Text className="fnb-form-label material-view-lable-text-color">
              {pageData.code.usageLimits.limitCoupon}
            </Text>
          </Checkbox>
        </div>
        {discountCodeData?.isLimitNumberCouponUse && (
          <div className="mt-3">
            <Text className="fnb-form-label" style={{ marginLeft: "35px" }}>
              {discountCodeData?.maximumLimitCouponUse}
            </Text>
          </div>
        )}

        <div className="mt-3">
          <Checkbox disabled checked={discountCodeData?.isLimitOneTimeUse}>
            <Text className="fnb-form-label material-view-lable-text-color">
              {pageData.code.usageLimits.limitCustomer}
            </Text>
          </Checkbox>
        </div>
        <div className="text-container mt-3">
          <p className="text-label"> {pageData.code.discountCode}</p>
          <p className="text-detail">{discountCodeData?.code?.toUpperCase()}</p>
        </div>
      </Card>

      {/* Usage detail */}
      <DiscountCodeUsageDetailComponent
        t={t}
        ref={discountCodeUsageDetailRef}
        showModalUsageDetail={showModalUsageDetail}
        onCancel={onCancelViewUsageDetail}
      />

      <DeleteConfirmComponent
        icon={<StopOutlined />}
        buttonIcon={<StopFill className="icon-del icon-discount-code-stop-fill" />}
        title={pageData.notificationTitle}
        content={t(pageData.confirmStopDiscountCode, { name: discountCodeData?.name })}
        okText={pageData.btnStop}
        okButtonProps={{ style: { backgroundColor: "#FF8C21", height: "60px", minWidth: "114px" } }}
        cancelText={pageData.btnIgnore}
        cancelButtonProps={{
          style: {
            backgroundColor: "transparent",
            border: "transparent",
            boxShadow: "none",
            height: "60px",
            minWidth: "114px",
          },
        }}
        permission={PermissionKeys.STOP_DISCOUNT_CODE}
        onOk={() => onStopDiscountCode(discountCodeData?.id)}
        onCancel={() => setShowConfirmStop(false)}
        tooltipTitle={pageData.btnStop}
        className="confirm-stop-modal-sizing"
        visible={showConfirmStop}
      />

      <DeleteConfirmComponent
        title={pageData.confirmDelete}
        content={formatDeleteMessage(discountCodeData?.name)}
        okText={pageData.button.btnDelete}
        cancelText={pageData.button.btnIgnore}
        permission={PermissionKeys.DELETE_DISCOUNT_CODE}
        onOk={() => onDeleteDiscountCode(discountCodeData?.id)}
        onCancel={() => setShowConfirmDelete(false)}
        visible={showConfirmDelete}
        className="confirm-stop-modal-sizing"
        okButtonProps={{ style: { backgroundColor: "#FF8C21", height: "60px", minWidth: "114px" } }}
        cancelButtonProps={{
          style: {
            backgroundColor: "transparent",
            border: "transparent",
            boxShadow: "none",
            height: "60px",
            minWidth: "114px",
          },
        }}
        buttonIcon={<></>}
        tooltipTitle={pageData.button.btnDelete}
      />
    </>
  );
}
