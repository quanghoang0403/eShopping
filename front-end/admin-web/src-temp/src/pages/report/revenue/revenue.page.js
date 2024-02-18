import { Button, Col, Image, Row } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import { FnbListBranches } from "components/fnb-list-branches/fnb-list-branches";
import { RevenueLineChartComponent } from "components/line-chart/line-chart.component";
import PageTitle from "components/page-title";
import RevenuePieChart from "components/revenue-pie-chart";
import { ExportIcon, TriangleIncreaseIcon, TriangleReduceIcon } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { TYPE } from "constants/report.constants";
import { DateFormat } from "constants/string.constants";
import orderDataService from "data-services/order/order-data.service";
import reportDataService from "data-services/report/report-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import languageService from "services/language/language.service";
import { formatCurrency, handleDownloadFile, hasPermission, getColorForChart } from "utils/helpers";
import { languageCodeSelector } from "store/modules/session/session.reducers";
import iconExtrafee from "../../../assets/images/icon-extra-fee.png";
import iconReceived from "../../../assets/images/icon-received.png";
import iconShippingFee from "../../../assets/images/icon-shipping-fee.png";
import iconTotalCost from "../../../assets/images/icon-total-cost.png";
import iconTotalDiscount from "../../../assets/images/icon-total-discount.png";
import iconTotalTax from "../../../assets/images/icon-total-tax.png";
import iconUnpaid from "../../../assets/images/icon-unpaid.png";
import "./revenue.page.scss";

function Revenue() {
  const [t] = useTranslation();
  const pageData = {
    title: t("report.summary"),
    totalCost: t("reportRevenue.totalCost"),
    totalDiscount: t("reportRevenue.totalDiscount"),
    shippingFee: t("reportRevenue.shippingFee"),
    extraFee: t("reportRevenue.extraFee"),
    totalRevenue: t("reportRevenue.totalRevenue"),
    profit: t("reportRevenue.profit"),
    paid: t("reportRevenue.paid"),
    received: t("reportRevenue.received"),
    unpaid: t("reportRevenue.unpaid"),
    txt_reduce: t("dashboard.txt_reduce"),
    txt_increase: t("dashboard.txt_increase"),
    allBranch: t("dashboard.allBranch"),
    date: {
      yesterday: t("dashboard.compareDate.yesterday"),
      previousDay: t("dashboard.compareDate.previousDay"),
      lastWeek: t("dashboard.compareDate.lastWeek"),
      previousWeek: t("dashboard.compareDate.previousWeek"),
      lastMonth: t("dashboard.compareDate.lastMonth"),
      previousMonth: t("dashboard.compareDate.previousMonth"),
      lastYear: t("dashboard.compareDate.lastYear"),
      previousSession: t("dashboard.compareDate.previousSession"),
    },
    platform: t("platform.title"),
    paymentMethod: t("payment.paymentMethod"),
    serviceType: t("reportRevenue.serviceType"),
    revenuePaymentMethod: t("reportRevenue.revenuePaymentMethod"),
    revenuePlatform: t("reportRevenue.revenuePlatform"),
    revenueServiceType: t("reportRevenue.revenueServiceType"),
    totalTax: t("reportRevenue.totalTax"),
    btnExport: t("button.export"),
  };

  const [initData, setInitData] = useState({});
  const [branchId, setBranchId] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().startOf("date").toDate(),
    endDate: moment().endOf("date").toDate(),
  });

  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.date.yesterday);
  const [typeOptionDate, setTypeOptionDate] = useState(OptionDateTime.today);
  const [revenueByPlatform, setRevenueByPlatform] = useState([]);
  const [revenueByPaymentMethod, setRevenueByPaymentMethod] = useState([]);
  const [revenueByServiceType, setRevenueByServiceType] = useState([]);
  const revenueChartReportRef = React.useRef(null);
  const averageRevenueChartReportRef = React.useRef(null);

  const languageCode = useSelector(languageCodeSelector);
  const languageSession = useSelector((state) => state.session?.languageSession);

  useEffect(() => {
    getInitialData(branchId, selectedDate, typeOptionDate);
    getOrderRevenuePieChartByFilter(branchId, selectedDate, typeOptionDate);
  }, []);

  useEffect(() => {
    switch (typeOptionDate) {
      case OptionDateTime.today:
        setTitleConditionCompare(pageData.date.yesterday);
        break;
      case OptionDateTime.yesterday:
        setTitleConditionCompare(pageData.date.previousDay);
        break;
      case OptionDateTime.thisWeek:
        setTitleConditionCompare(pageData.date.lastWeek);
        break;
      case OptionDateTime.lastWeek:
        setTitleConditionCompare(pageData.date.previousWeek);
        break;
      case OptionDateTime.thisMonth:
        setTitleConditionCompare(pageData.date.lastMonth);
        break;
      case OptionDateTime.lastMonth:
        setTitleConditionCompare(pageData.date.previousMonth);
        break;
      case OptionDateTime.thisYear:
        setTitleConditionCompare(pageData.date.lastYear);
        break;
      default:
        setTitleConditionCompare(pageData.date.previousSession);
        break;
    }
    getDataForRevenueLineChart(branchId, selectedDate, typeOptionDate);
  }, [languageSession, typeOptionDate]);

  const getInitialData = (branchId, date, typeOptionDate) => {
    getOrderInfoByFilter(branchId, date, typeOptionDate);
    getDataForRevenueLineChart(branchId, date, typeOptionDate);
    setTypeOptionDate(OptionDateTime.today);
  };

  const getOrderInfoByFilter = async (branchId, date, typeOptionDate) => {
    let startDate = moment(date?.startDate);
    let endDate = moment(date?.endDate);

    // Parse local time frome client to UTC time before comparation
    var fromDate = moment.utc(startDate).local().format(DateFormat.YYYY_MM_DD_HH_MM_SS_2);
    var toDate = moment.utc(endDate).local().format(DateFormat.YYYY_MM_DD_HH_MM_SS_2);

    let req = {
      branchId: branchId ?? "",
      startDate: fromDate,
      endDate: toDate,
      typeOptionDate: typeOptionDate,
    };

    const result = await orderDataService.getOrderBusinessRevenueWidgetAsync(req);

    setInitData(result);
  };

  const renderWidgetSummary = () => {
    let listSummary = [
      {
        total: formatCurrency(initData?.totalCost),
        name: pageData.totalCost,
        percent: initData?.percentCost,
        icon: <Image preview={false} src={iconTotalCost} />,
        isDecrease: initData?.costIsDecrease,
      },
      {
        total: formatCurrency(initData?.totalDiscount),
        name: pageData.totalDiscount,
        percent: initData?.percentDiscount,
        icon: <Image preview={false} src={iconTotalDiscount} />,
        isDecrease: initData?.discountIsDecrease,
      },
      {
        total: formatCurrency(initData?.totalShippingFee),
        name: pageData.shippingFee,
        percent: initData?.percentShippingFee,
        icon: <Image preview={false} src={iconShippingFee} />,
        isDecrease: initData?.shippingFeeIsDecrease,
      },
      {
        total: formatCurrency(initData?.totalExtraFee),
        name: pageData.extraFee,
        percent: initData?.percentExtraFee,
        icon: <Image preview={false} src={iconExtrafee} />,
        isDecrease: initData?.extraFeeIsDecrease,
      },
      {
        total: formatCurrency(initData?.totalTax),
        name: pageData.totalTax,
        percent: initData?.percentTax,
        icon: <Image preview={false} src={iconTotalTax} />,
        isDecrease: initData?.taxIsDecrease,
      },
    ];

    const widgetSummary = listSummary?.map((item, index) => {
      const descriptionFormat = "{{status}} {{value}}% {{compareWith}}";
      const status = item?.isDecrease ? pageData.txt_reduce : pageData.txt_increase;
      const description = `${t(descriptionFormat, {
        status: status,
        value: item?.percent,
        compareWith: t(titleConditionCompare),
      })}`;
      return (
        <Col key={index} xs={24} sm={24} className="report-widget-summary">
          <div className="group-information-summary">
            <div className="summary-icon">{item.icon}</div>
            <div className="summary-name">{item.name}</div>
            <div className="summary-compare">
              {!item?.isDecrease ? (
                <>
                  <TriangleIncreaseIcon className="icon-increase-triangle" />
                  {description}
                </>
              ) : (
                <>
                  <TriangleReduceIcon className="icon-increase-triangle" />
                  {description}
                </>
              )}
            </div>
            <div className="summary-total">{item?.total} </div>
          </div>
        </Col>
      );
    });

    return <>{widgetSummary}</>;
  };

  const renderWidgetRevenue = () => {
    let listRevenue = [
      {
        total: formatCurrency(initData?.totalRevenue),
        name: pageData.totalRevenue,
        percent: initData?.percentRevenue,
        paid: formatCurrency(initData?.totalRevenuePaid),
        unpaid: formatCurrency(initData?.totalRevenueUnpaid),
        iconReceived: <Image preview={false} src={iconReceived} />,
        iconUnpaid: <Image preview={false} src={iconUnpaid} />,
        isDecrease: initData?.revenueIsDecrease,
      },
      {
        total: formatCurrency(initData?.totalProfit),
        name: pageData.profit,
        percent: initData?.percentProfit,
        paid: formatCurrency(initData?.totalProfitPaid),
        unpaid: formatCurrency(initData?.totalProfitUnpaid),
        iconReceived: <Image preview={false} src={iconReceived} />,
        iconUnpaid: <Image preview={false} src={iconUnpaid} />,
        isDecrease: initData?.profitIsDecrease,
      },
    ];

    const widgetRevenue = listRevenue?.map((item, index) => {
      const descriptionFormat = "{{status}} {{value}}% {{compareWith}}";
      const status = !item?.isDecrease ? pageData.txt_increase : pageData.txt_reduce;
      const description = `${t(descriptionFormat, {
        status: status,
        value: Math.abs(item?.percent),
        compareWith: t(titleConditionCompare),
      })}`;
      return (
        <Col key={index} xs={24} sm={24} md={24} lg={12} className="report-widget-revenue">
          <div className="group-information-revenue">
            <div className="revenue-left-col">
              <div className="revenue-left-header">
                <span className="revenue-name">{item?.name}</span>
                <span className="revenue-total">{item?.total}</span>
              </div>
              <div className="revenue-left-footer-col">
                <div className="revenue-received-icon">{item?.iconReceived}</div>
                <div className="revenue-received-info">
                  <span className="revenue-received-name">{pageData.received}</span>
                  <span className="revenue-received-total">{item?.paid}</span>
                </div>
              </div>
            </div>
            <div className="revenue-right-col">
              <div className="revenue-compare">
                {!item?.isDecrease ? (
                  <>
                    <TriangleIncreaseIcon className="icon-increase-triangle" />
                    {description}
                  </>
                ) : (
                  <>
                    <TriangleReduceIcon className="icon-increase-triangle" />
                    {description}
                  </>
                )}
              </div>
              <div className="revenue-right-footer-col">
                <div className="revenue-received-icon">{item?.iconUnpaid}</div>
                <div className="revenue-received-info">
                  <span className="revenue-received-name">{pageData.unpaid}</span>
                  <span className="revenue-received-total">{item?.unpaid}</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      );
    });

    return <>{widgetRevenue}</>;
  };

  const handleChangeBranch = (branchId) => {
    setBranchId(branchId);
    getOrderInfoByFilter(branchId, selectedDate, typeOptionDate);
    getOrderRevenuePieChartByFilter(branchId, selectedDate, typeOptionDate);
    getDataForRevenueLineChart(branchId, selectedDate, typeOptionDate);
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    setTypeOptionDate(typeOptionDate);
    getOrderInfoByFilter(branchId, date, typeOptionDate);
    getOrderRevenuePieChartByFilter(branchId, date, typeOptionDate);
    getDataForRevenueLineChart(branchId, date, typeOptionDate);
  };

  /* Revenue by Pie Chart */
  const getOrderRevenuePieChartByFilter = (branchId, date, typeOptionDate) => {
    let startDate = moment(date?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(date?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId ?? "",
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
      type: TYPE.REVENUE,
    };
    orderDataService.getRevenueByTypeAsync(req).then((res) => {
      if (res) {
        setRevenueByPlatform(res.revenueByPlatforms);
        setRevenueByPaymentMethod(res.revenueByPaymentMethods);
        setRevenueByServiceType(res.revenueByServiceTypes);
      }
    });
  };

  const getDataForRevenueLineChart = (branchId, selectedDateTime, typeOptionDate) => {
    let req = {
      branchId: branchId ?? "",
      startDate: selectedDateTime?.startDate,
      endDate: selectedDateTime?.endDate,
      segmentTimeOption: typeOptionDate,
    };
    orderDataService.calculateStatisticalDataAsync(req).then((res) => {
      if (res) {
        let legendContainerId = "legendContainerId";
        if (revenueChartReportRef && revenueChartReportRef.current) {
          revenueChartReportRef.current.fillData(selectedDateTime, typeOptionDate, res, false, legendContainerId);
        }
        setTimeout(() => {
          legendContainerId = legendContainerId + 2;
          if (averageRevenueChartReportRef && averageRevenueChartReportRef.current) {
            averageRevenueChartReportRef.current.fillData(
              selectedDateTime,
              typeOptionDate,
              res,
              true,
              legendContainerId,
            );
          }
        }, 1000);
      }
    });
  };

  const getDataPlatformForPieChart = () => {
    const platformColor = getColorForChart(249, 100, 24, revenueByPlatform?.length);
    return revenueByPlatform?.map((item, index) => {
      return {
        label: item?.name,
        value: item?.totalAmount,
        color: platformColor[index],
        totalAmount: item?.totalAmount,
      };
    });
  };

  const getDataPaymentMethodForPieChart = () => {
    const paymentMethodColor = getColorForChart(29, 100, 50, revenueByPaymentMethod?.length);
    return revenueByPaymentMethod?.map((item, index) => {
      return {
        label: item?.name,
        value: item?.totalAmount,
        color: paymentMethodColor[index],
        totalAmount: item?.totalAmount,
      };
    });
  };

  const getDataServiceTypeForPieChart = () => {
    const serviceTypeColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(155, 216, 76, 0.2)",
      "rgba(175, 292, 92, 0.2)",
      "rgba(253, 102, 255, 0.2)",
    ];
    return revenueByServiceType?.map((item, index) => {
      return {
        label: item?.name,
        value: item?.totalAmount,
        color: serviceTypeColor[index],
        totalAmount: item?.totalAmount,
      };
    });
  };

  const exportSoldProductsAsync = async () => {
    let languageCode = languageService.getLang();
    var timeZone = new Date().getTimezoneOffset() / 60;

    let startDate = moment(selectedDate?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(selectedDate?.endDate).format(DateFormat.MM_DD_YYYY);

    let req = {
      branchId: branchId ?? "",
      typeOptionDate: typeOptionDate,
      startDate: startDate,
      endDate: endDate,
      segmentTimeOption: typeOptionDate,
      type: TYPE.REVENUE,
      languageCode: languageCode,
      timeZone: timeZone,
    };
    try {
      var response = await reportDataService.exportRevenueAsync(req);
      handleDownloadFile(response);
    } catch (ex) {
    }
  };
  const renderBtnExport = () => {
    const isHasPermissionExport = hasPermission(PermissionKeys.EXPORT_REVENUE_REPORT);
    if(!isHasPermissionExport) return null;
    return (
      <Col md={4} xs={24} style={{display:'flex', justifyContent:'flex-end'}}>
        <Button
          icon={<ExportIcon />}
          type="primary"
          className="fnb-add-new-button float-right"
          onClick={() => exportSoldProductsAsync()}
        >
          {pageData.btnExport}
        </Button>
      </Col>
    );
  };

  return (
    <>
      <Row className="fnb-form-title" gutter={[0, 29]}>
        <Col span={24}>
          <Row gutter={[24, 24]} align="middle" justify="center" className="top-dashboard">
            <Col xs={24} sm={24} md={24} lg={6}>
              <PageTitle className="mb-0 title-dashboard" content={pageData.title} />
            </Col>
            <Col xs={24} sm={24} md={24} lg={18} className="fnb-form-btn-popover">
              <Row className="fnb-row-top" gutter={[24, 24]} justify="end">
                {renderBtnExport()}
                <FnbListBranches onChangeEvent={handleChangeBranch} />
                <FnbDatePicker
                  selectedDate={selectedDate}
                  setSelectedDate={(date, typeOptionDate) => onSelectedDatePicker(date, typeOptionDate)}
                />
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} className="rpc-widget-summary">
            {renderWidgetSummary()}
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>{renderWidgetRevenue()}</Row>
        </Col>
      </Row>
      <Row gutter={[16, 30]}>
        <Col span={24} style={{ marginTop: 30 }}>
          <RevenueLineChartComponent ref={revenueChartReportRef} />
        </Col>
        <Col span={24}>
          <RevenueLineChartComponent chartTitle={t("chartAverageRevenue.title")} ref={averageRevenueChartReportRef} />
        </Col>
      </Row>
      <div className="c-revenue-pie-chart">
        {/* revenueByPlatform */}
        <div className="rpc-element">
          <div className="rpc-element-wrapper">
            <RevenuePieChart
              dataSourceRevenue={revenueByPlatform}
              getDataForPieChart={getDataPlatformForPieChart()}
              titleBack={pageData.platform.toUpperCase()}
              chartName={pageData.revenuePlatform}
            />
          </div>
        </div>

        {/* revenueByPaymentMethod */}
        <div className="rpc-element">
          <div className="rpc-element-wrapper">
            <RevenuePieChart
              key={languageCode}
              dataSourceRevenue={revenueByPaymentMethod}
              getDataForPieChart={getDataPaymentMethodForPieChart()}
              titleBack={pageData.paymentMethod.toUpperCase()}
              chartName={pageData.revenuePaymentMethod}
            />
          </div>
        </div>

        {/* revenueByServiceType */}
        <div className="rpc-element">
          <div className="rpc-element-wrapper">
            <RevenuePieChart
              dataSourceRevenue={revenueByServiceType}
              getDataForPieChart={getDataServiceTypeForPieChart()}
              titleBack={pageData.serviceType.toUpperCase()}
              chartName={pageData.revenueServiceType}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Revenue;
