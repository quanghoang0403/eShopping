import { Col, Row } from "antd";
import { FnbPieChart } from "components/fnb-pie-chart/fnb-pie-chart";
import { FnbTable } from "components/fnb-table/fnb-table";
import { NoDataFoundComponent } from "components/no-data-found/no-data-found.component";
import {
  BackToPieChartIcon,
  TriangleIncreaseIcon,
  TriangleReduceIcon,
} from "constants/icons.constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  formatTextNumber,
  getColorForChart,
  getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal,
} from "utils/helpers";
import "./customer-by-platform-pie-chart.component.scss";

export default function CustomerPlatformPieChartComponent({
  dataReportOrderList,
}) {
  const [t] = useTranslation();
  const [isChart, setIsChart] = useState(true);
  const [sumTotalCustomer, setSumTotalCustomer] = useState();
  const [columnCustomerReportTable, setColumnCustomerReportTable] = useState(
    []
  );
  const [dataReport, setDataReport] = useState();
  const [plotOptions, setPlotOptions] = useState();
  const [isViewAll, setIsViewAll] = useState(false);
  const maxRow = 5;
  
  const pageData = {
    totalOrder: t("order.totalOrder"),
    totalAmount: t("order.totalAmount"),
    detail: t("table.detail"),
    back: t("form.button.back"),
    total: t("table.total"),
    revenue: t("order.revenue"),
    chartName: t("report.customer.chartName"),
    platform: t("platform.title"),
    percentColumn: t("report.customer.percent"),
    customerNumberColumn: t("report.customer.customerNumber"),
    titleChart: t("report.customer.titleChart", "Customer"),
    viewAll: t("reportRevenue.viewAll"),
    hide: t("reportRevenue.hide"),
  };

  useEffect(() => {
    initialDataReport();
    getColumnCustomerPlatformTable();
  }, [dataReportOrderList, t]);

  useEffect(() => {
    getPlotOptions(sumTotalCustomer, pageData);
  }, [sumTotalCustomer]);

  const initialDataReport = () => {
    let totalCustomer = 0;
    const colorList = getColorForChart(249, 100, 24, dataReportOrderList?.length);
    let dataReportOrderListMapping = dataReportOrderList?.map((data, index) => {
      totalCustomer += data?.totalCustomer;
      return {
        ...data,
        color: colorList[index],
        label: data?.platformName,
        value: data?.totalCustomer,
      };
    });
    setSumTotalCustomer(totalCustomer);
    setDataReport(dataReportOrderListMapping);
  };

  const getColumnCustomerPlatformTable = () => {
    const columns = [
      {
        title: pageData.platform,
        dataIndex: "platformName",
        key: "platformName",
        align: "left",
        width: "40%",
      },
      {
        title: pageData.percentColumn,
        dataIndex: "percentageChangeFromThePreviousSession",
        key: "percentageChangeFromThePreviousSession",
        align: "right",
        width: "20%",
        render: (value, record) => {
          if (record?.isDecreaseFromThePreviousSession) {
            return (
              <>
                <TriangleReduceIcon style={{ marginRight: "10px" }} />
                {getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal(
                  value
                ) ?? 0}
                %
              </>
            );
          } else {
            return (
              <>
                <TriangleIncreaseIcon style={{ marginRight: "10px" }} />
                {getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal(
                  value
                ) ?? 0}
                %
              </>
            );
          }
        },
      },
      {
        title: pageData.customerNumberColumn,
        dataIndex: "totalCustomer",
        key: "totalCustomer",
        align: "right",
        width: "40%",
      },
    ];
    setColumnCustomerReportTable(columns);
  };

  const getPlotOptions = (total, translate) => {
    let options = {
      pie: {
        customScale: 1,
        offsetX: 0,
        offsetY: 0,
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {},
            value: {
              fontSize: "18px",
              fontWeight: "500",
              color: "#A5ABDE",
            },
            total: {
              show: true,
              showAlways: true,
              label: `${formatTextNumber(total)}`,
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "25px",
              color: "#50429B",
              formatter: (w) => {
                return translate.titleChart;
              },
            },
          },
        },
      },
    };
    setPlotOptions(options);
  };

  function renderCustomerReportPieChartDescription(pieChartDes) {
    // eslint-disable-next-line array-callback-return
    const colorDescriptions = pieChartDes?.map((item, index) => {
      if (isViewAll || index < maxRow) {
        return (
          <div
          className={`content-chart-information ${index > 0 && "padding-top"}`}
          key={index}
        >
          <div className="plat-form-name">
            <div
              className="dot-platform"
              style={{ backgroundColor: item?.color }}
            ></div>
            <div className="dot-platform-name">{item?.label}</div>
          </div>
          <div className="total-customer-value">{item?.totalCustomer}</div>
          <div className="percent-value">
            {item?.isDecreaseFromThePreviousSession ? (
              <>
                <TriangleReduceIcon style={{ marginRight: "10px" }} />
                {getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal(
                  item?.percentageChangeFromThePreviousSession
                )}
                %
              </>
            ) : (
              <>
                <TriangleIncreaseIcon style={{ marginRight: "10px" }} />
                {getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal(
                  item?.percentageChangeFromThePreviousSession
                )}
                %
              </>
            )}
          </div>
        </div>
        );
      }
    });
    return <>
      <div className="description-report" style={isViewAll ? {"overflowY": "auto "} : {}}>
        {colorDescriptions}
      </div>
      {dataReportOrderList?.length > maxRow &&
        (isViewAll
          ?
          <div className="pie-chart-report-legend padding-top">
            <div className="legend-link" onClick={() => setIsViewAll(false)}>
              {pageData.hide}&nbsp;&lt;
            </div>
          </div>
          :
          <div className="pie-chart-report-legend padding-top">
            <div className="legend-link" onClick={() => setIsViewAll(true)}>
              {pageData.viewAll}&nbsp;&gt;
            </div>
          </div>)
      }
    </>;
  }

  return (
    <div className="revenue-order-chart customer-pie-chart">
      <div
        className="revenue-order-chart-wrapper"
        style={{ display: !isChart ? "none" : "flex" }}
      >
        <div className="header-chart-detail m-0">
          <span className="pie-chart-title">{pageData.chartName}</span>
          <span
            className="pie-chart-title-detail"
            onClick={() => setIsChart(!isChart)}
          >
            {pageData.detail}
          </span>
        </div>
        {sumTotalCustomer > 0 ? (
          <Row className="height-100">
            <Col xs={24} sm={24} md={13} className="display-center">
              <FnbPieChart
                className="customer-report-pie-chart"
                plotOptions={plotOptions}
                title={pageData.revenue}
                dataSource={dataReport}
                ratioMobile={75}
              />
            </Col>
            <Col xs={24} sm={24} md={11} className="display-center">
              <div className="information-customer-report">
                {renderCustomerReportPieChartDescription(dataReport)}
              </div>
            </Col>
          </Row>
        ) : (
          <div className="no-data">
            <NoDataFoundComponent />
          </div>
        )}
      </div>
      <div
        className="revenue-order-chart-wrapper"
        style={{ display: isChart ? "none" : "flex" }}
      >
        <div className="header-chart-detail">
          <span className="back-to-icon" onClick={() => setIsChart(!isChart)}>
            <BackToPieChartIcon />
          </span>
          <span>{pageData.chartName}</span>
        </div>
        {sumTotalCustomer > 0 ? (
          <div className="table-chart-detail">
            <FnbTable
              columns={columnCustomerReportTable}
              dataSource={dataReportOrderList}
              className="table-revenue"
            />
          </div>
        ) : (
          <div className="no-data">
            <NoDataFoundComponent />
          </div>
        )}
      </div>
    </div>
  );
}
