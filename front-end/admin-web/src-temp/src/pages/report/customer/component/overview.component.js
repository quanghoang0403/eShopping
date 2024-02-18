import { Col, Row } from "antd";
import FnbLineChartComponent from "components/fnb-line-chart";
import { CustomerReportWidgetIcon, TriangleIncreaseIcon, TriangleReduceIcon } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { theValueLastDayOfTheWeekend } from "constants/string.constants";
import customerDataService from "data-services/customer/customer-data.service";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { formatCurrencyWithSymbol, getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal } from "utils/helpers";
import CustomerPlatformPieChartComponent from "./customer-by-platform-pie-chart.component";
import { TopCustomerListReportComponent } from "./top-customer-report.component";
import { DateFormat } from "constants/string.constants";

export default function OverviewComponent(props) {
  const [t] = useTranslation();
  const tableTopCustomerRef = useRef();
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const { selectedDates, branchId, segmentTimeOption } = props;
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [selectedDateFormat, setSelectedDateFormat] = useState({});
  const pageData = {
    titleWidget: t("report.customer.titleWidget"),
    totalOrder: t("report.customer.totalOrder"),
    revenueByCustomer: t("report.customer.revenueByCustomer"),
    average: t("report.customer.average"),
    decrease: t("report.customer.decrease"),
    increase: t("report.customer.increase"),
    optionDatetime: {
      today: t("optionDatetime.today"),
      yesterday: t("optionDatetime.yesterday"),
      thisWeek: t("optionDatetime.thisWeek"),
      lastWeek: t("optionDatetime.lastWeek"),
      thisMonth: t("optionDatetime.thisMonth"),
      lastMonth: t("optionDatetime.lastMonth"),
      thisYear: t("optionDatetime.thisYear"),
      customize: t("optionDatetime.customize"),
      lastYear: t("optionDatetime.lastYear"),
      theDayBeforeYesterday: t("optionDatetime.theDayBeforeYesterday"),
      theWeekBeforeLast: t("optionDatetime.theWeekBeforeLast"),
      theMonthBeforeLast: t("optionDatetime.theMonthBeforeLast"),
    },
    title: t("report.customer.chartCustomer.title"),
    leftAxis: t("report.customer.chartCustomer.leftAxis"),
    rightAxis: t("report.customer.chartCustomer.rightAxis"),
    monday: t("report.customer.chartCustomer.weekdays.monday"),
    tuesday: t("report.customer.chartCustomer.weekdays.tuesday"),
    wednesday: t("report.customer.chartCustomer.weekdays.wednesday"),
    thursday: t("report.customer.chartCustomer.weekdays.thursday"),
    friday: t("report.customer.chartCustomer.weekdays.friday"),
    saturday: t("report.customer.chartCustomer.weekdays.saturday"),
    sunday: t("report.customer.chartCustomer.weekdays.sunday"),
    january: t("report.customer.chartCustomer.months.january"),
    february: t("report.customer.chartCustomer.months.february"),
    march: t("report.customer.chartCustomer.months.march"),
    april: t("report.customer.chartCustomer.months.april"),
    may: t("report.customer.chartCustomer.months.may"),
    june: t("report.customer.chartCustomer.months.june"),
    july: t("report.customer.chartCustomer.months.july"),
    august: t("report.customer.chartCustomer.months.august"),
    september: t("report.customer.chartCustomer.months.september"),
    october: t("report.customer.chartCustomer.months.october"),
    november: t("report.customer.chartCustomer.months.november"),
    december: t("report.customer.chartCustomer.months.december"),
  };

  const [dataCustomerReport, setDataCustomerReport] = useState();
  const [platformStatistical, setPlatformStatistical] = useState([]);

  useEffect(() => {
    if (selectedDates)
    {
      selectedDateFormat.startDate = moment(selectedDates?.startDate).format(DateFormat.MM_DD_YYYY);
      selectedDateFormat.endDate = moment(selectedDates?.endDate).format(DateFormat.MM_DD_YYYY);
    }
  }, [selectedDates]);

  useEffect(() => {
    getCustomerReportData();
    fetchCustomerGrowthData();
    getDataFilterTopCustomer();
  }, [segmentTimeOption, branchId, selectedDates]);

  const getCustomerReportData = async () => {
    const customerReportResult = await customerDataService.getCustomerReportPieChartAsync(
      selectedDateFormat?.startDate,
      selectedDateFormat?.endDate,
      branchId,
      segmentTimeOption,
    );

    setDataCustomerReport(customerReportResult);
    setPlatformStatistical(customerReportResult?.platformStatisticals);
  };

  const getPeriodForStatusWidget = (lastPeriodValue) => {
    let periodValue = null;
    switch (segmentTimeOption) {
      case OptionDateTime.today:
      case OptionDateTime.yesterday:
      case OptionDateTime.thisWeek:
      case OptionDateTime.lastWeek:
      case OptionDateTime.thisMonth:
      case OptionDateTime.lastMonth:
      case OptionDateTime.thisYear:
        periodValue = t(lastPeriodValue);
        break;
      default:
        periodValue = t("optionDatetime.lastPeriod", { dayOfNumber: lastPeriodValue });
        break;
    }

    return periodValue;
  };

  const fetchCustomerGrowthData = async () => {
    const customerData = await customerDataService.getCustomersByDateRangeAsync(
      selectedDateFormat?.startDate,
      selectedDateFormat?.endDate,
      branchId
    );
    const customerGrowthData = mapToCustomerGrowthData(customerData);
    setCustomerGrowth(customerGrowthData);
  };

  const convertToLocalTime = (time) => {
    return moment.utc(time).local();
  };

  const mapToCustomerGrowthDataByDay = (customerData, hours) => {
    const data = { newCustomerData: [], totalCustomerData: [] };
    let countByHour = 0;
    for (let index = 0; index <= hours; index++) {
      const group = customerData.filter((x) => convertToLocalTime(x?.createdTime).hour() === index);
      countByHour += group?.length;
      data.newCustomerData.push(group?.length);
      data.totalCustomerData.push(countByHour);
    }

    return data;
  };

  const mapToCustomerGrowthDataByWeek = (customerData, days) => {
    const data = { newCustomerData: [], totalCustomerData: [] };
    let count = 0;
    for (let index = 1; index <= days; index++) {
      let day = index === theValueLastDayOfTheWeekend ? 0 : index;
      const group = customerData.filter((x) => convertToLocalTime(x?.createdTime).day() === day);
      count += group?.length;
      data.newCustomerData.push(group?.length);
      data.totalCustomerData.push(count);
    }

    return data;
  };

  const mapToCustomerGrowthDataByMonth = (customerData, days) => {
    const data = { newCustomerData: [], totalCustomerData: [] };
    let countByHour = 0;
    for (let index = 1; index <= days; index++) {
      const group = customerData.filter((x) => convertToLocalTime(x?.createdTime).date() === index);
      countByHour += group?.length;
      data.newCustomerData.push(group?.length);
      data.totalCustomerData.push(countByHour);
    }

    return data;
  };

  const mapToCustomerGrowthDataByYear = (customerData) => {
    const data = { newCustomerData: [], totalCustomerData: [] };
    let countByMonth = 0;
    const currentMonth = moment().month();
    for (let index = 0; index <= currentMonth; index++) {
      const group = customerData.filter((x) => convertToLocalTime(x?.createdTime).month() === index);
      countByMonth += group?.length;
      data.newCustomerData.push(group?.length);
      data.totalCustomerData.push(countByMonth);
    }

    return data;
  };

  const mapToCustomerGrowthData = (customerData) => {
    let startDate = moment(selectedDates?.startDate);
    let endDate = moment(selectedDates?.endDate).add(1, "d").seconds(-1);
    let data = {};
    switch (segmentTimeOption) {
      case OptionDateTime.today:
        data = mapToCustomerGrowthDataByDay(customerData, moment().hour());
        break;
      case OptionDateTime.yesterday:
        data = mapToCustomerGrowthDataByDay(customerData, 24);
        break;
      case OptionDateTime.thisWeek:
        data = mapToCustomerGrowthDataByWeek(customerData, moment().day());
        break;
      case OptionDateTime.lastWeek:
        data = mapToCustomerGrowthDataByWeek(customerData, 7);
        break;
      case OptionDateTime.thisMonth:
        data = mapToCustomerGrowthDataByMonth(customerData, moment().date());
        break;
      case OptionDateTime.lastMonth:
        data = mapToCustomerGrowthDataByMonth(customerData, moment(startDate).daysInMonth());
        break;
      case OptionDateTime.thisYear:
        data = mapToCustomerGrowthDataByYear(customerData);
        break;
      case OptionDateTime.customize:
        const isSameDate = moment(startDate).date() === moment(endDate).date();
        const isSameMonth = moment(startDate).month() === moment(endDate).month();
        const isSameYear = moment(startDate).year() === moment(endDate).year();

        if (isSameYear && isSameMonth && isSameDate) {
          data = mapToCustomerGrowthDataByDay(customerData, 24);
        } else if (isSameYear && isSameMonth) {
          data = mapToCustomerGrowthDataByMonth(customerData, moment(startDate).daysInMonth());
        } else {
          data = mapToCustomerGrowthDataByYear(customerData);
        }
        break;
      default:
        break;
    }
    return data;
  };

  const getLabelsByDay = (hours) => {
    return Array.from({ length: hours }, (_item, i) => `${i}:00`);
  };

  const getLabelsByWeek = () => {
    return [
      pageData.monday,
      pageData.tuesday,
      pageData.wednesday,
      pageData.thursday,
      pageData.friday,
      pageData.saturday,
      pageData.sunday,
    ];
  };

  const getLabelsByMonth = (days) => {
    return Array.from({ length: days }, (_item, i) => i + 1);
  };

  const getLabelsByYear = () => {
    return [
      pageData.january,
      pageData.february,
      pageData.march,
      pageData.april,
      pageData.may,
      pageData.june,
      pageData.july,
      pageData.august,
      pageData.september,
      pageData.october,
      pageData.november,
      pageData.december,
    ];
  };

  const getLabels = () => {
    const startDate = moment(selectedDates?.startDate);
    const endDate = moment(selectedDates?.endDate);
    let segment = [];
    switch (segmentTimeOption) {
      case OptionDateTime.today:
      case OptionDateTime.yesterday:
        segment = getLabelsByDay(24);
        break;
      case OptionDateTime.thisWeek:
      case OptionDateTime.lastWeek:
        segment = getLabelsByWeek();
        break;
      case OptionDateTime.thisMonth:
      case OptionDateTime.lastMonth:
        let daysInMonth = moment(startDate).daysInMonth();
        segment = getLabelsByMonth(daysInMonth);
        break;
      case OptionDateTime.thisYear:
        segment = getLabelsByYear();
        break;
      case OptionDateTime.customize:
        const isSameDate = moment(startDate).date() === moment(endDate).date();
        const isSameMonth = moment(startDate).month() === moment(endDate).month();
        const isSameYear = moment(startDate).year() === moment(endDate).year();

        if (isSameYear && isSameMonth && isSameDate) {
          segment = getLabelsByDay(24);
        } else if (isSameYear && isSameMonth) {
          let daysInMonth = moment(startDate).daysInMonth();
          segment = getLabelsByMonth(daysInMonth);
        } else {
          segment = getLabelsByYear();
        }

        break;
      default:
        break;
    }
    return segment;
  };

  const data = {
    dateRange: selectedDates,
    dateOption: segmentTimeOption,
    labels: getLabels(),
    datasets: [
      {
        label: pageData.leftAxis,
        data: customerGrowth?.totalCustomerData,
        color: "#50429B",
      },
      {
        label: pageData.rightAxis,
        data: customerGrowth?.newCustomerData,
        color: "#FF8C21",
      },
    ],
  };

  const getDataFilterTopCustomer = () => {
    let currentDataFilter = {
      branchId: branchId,
      fromDate: selectedDateFormat?.startDate,
      toDate: selectedDateFormat?.endDate,
    };

    if (tableTopCustomerRef && tableTopCustomerRef.current) {
      tableTopCustomerRef.current.getDataFilter(currentDataFilter);
    }
  };

  return (
    <Row>
      <Col span={24}>
        <div className="customer-by-platform">
          <Row gutter={[isTabletOrMobile ? 20 : 24, isTabletOrMobile ? 24 : 0]}>
            <Col xs={24} sm={24} md={24} md={8} className="customer-report-widget">
              <div className="group-customer-widget-report">
                <div className="top-content-customer-report-widget">
                  <div className="icon-content-customer-report-widget">
                    <CustomerReportWidgetIcon />
                  </div>
                  <b className="title-widget">{pageData.titleWidget}</b>
                  <div className="compare-value">
                    {dataCustomerReport?.isDecreaseCustomerFromThePreviousSession ? (
                      <>
                        <TriangleReduceIcon />
                        &nbsp; &nbsp;
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `${t("report.customer.decrease", {
                              value:
                                getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal(
                                  dataCustomerReport?.percentageCustomerChangeFromThePreviousSession
                                ) ?? 0,
                              period: getPeriodForStatusWidget(dataCustomerReport?.lastPeriod),
                            })}`,
                          }}
                        ></div>
                      </>
                    ) : (
                      <>
                        <TriangleIncreaseIcon />
                        &nbsp; &nbsp;
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `${t("report.customer.increase", {
                              value:
                                getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal(
                                  dataCustomerReport?.percentageCustomerChangeFromThePreviousSession
                                ) ?? 0,
                              period: getPeriodForStatusWidget(dataCustomerReport?.lastPeriod),
                            })}`,
                          }}
                        ></div>
                      </>
                    )}
                  </div>
                  <b className="total-customer-value">{dataCustomerReport?.totalCustomer ?? 0}</b>
                </div>
                <div className="bottom-content-customer-report-widget">
                  <div className="total-order-customer">
                    <p>{pageData.totalOrder}:</p>
                    <b>{dataCustomerReport?.totalOrder ?? 0}</b>
                  </div>
                  <div className="revenue-by-customer">
                    <p>{pageData.revenueByCustomer}:</p>
                    <b>{formatCurrencyWithSymbol(dataCustomerReport?.revenueByCustomer ?? 0)}</b>
                  </div>
                  <div className="average">
                    <p>{pageData.average}:</p>
                    <b>
                      {t("report.customer.averageValue", {
                        value:
                          getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal(
                            dataCustomerReport?.averageOrder
                          ) ?? 0,
                      })}
                    </b>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={16} className="customer-report-chart">
              <div className="customer-report-chart-content">
                <CustomerPlatformPieChartComponent dataReportOrderList={platformStatistical} />
              </div>              
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={24}>
        <div className="customer-growth">
          <FnbLineChartComponent chartTitle={pageData.title} data={data} />
        </div>
      </Col>
      <Col span={24}>
        <TopCustomerListReportComponent ref={tableTopCustomerRef} />
      </Col>
    </Row>
  );
}
