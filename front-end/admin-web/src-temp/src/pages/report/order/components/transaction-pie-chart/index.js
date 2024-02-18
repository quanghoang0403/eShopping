import { FnbTable } from "components/fnb-table/fnb-table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BackToPieChartIcon } from "constants/icons.constants";
import { NoDataFoundComponent } from "components/no-data-found/no-data-found.component";
import { FnbPieChart } from "components/fnb-pie-chart/fnb-pie-chart";
import { useMediaQuery } from "react-responsive";
import "./index.scss";

export default function TransactionPieChart(props) {
  const { dataSourceRevenue, getDataForPieChart, titleBack, chartName, height, maxRow = 5 } = props;
  const [t] = useTranslation();

  const [isChart, setIsChart] = useState(true);
  const [isViewAll, setIsViewAll] = useState(false);
  const isMaxWidth1080 = useMediaQuery({ maxWidth: 1080 });

  const pageData = {
    totalOrder: t("order.totalOrder"),
    totalAmount: t("order.totalAmount"),
    detail: t("table.detail"),
    back: t("form.button.back"),
    total: t("table.total"),
    orders: t("order.orders"),
    viewAll: t("reportRevenue.viewAll"),
    hide: t("reportRevenue.hide"),
  };

  const tableSettings = {
    columns: [
      {
        title: titleBack,
        dataIndex: "name",
        key: "name",
        align: "left",
        width: "50%",
      },
      {
        title: pageData.totalOrder,
        dataIndex: "totalOrder",
        key: "totalOrder",
        align: "right",
        width: "50%",
      },
    ],
  };

  function renderTransactionOrderPieChartDescription(pieChartDes) {
    let row = 0;
    const colorDescriptions = pieChartDes?.map((item) => {
      if (isViewAll) {
        return (
          <div className="pie-chart-report-legend">
            <div className="legend-name">
              <div className="icon-text">
                <div className="marker" style={{ backgroundColor: item?.color }}></div>
                <span className="legend-label text-long">{item?.label}</span>
              </div>
              <span className="legend-total">{item?.totalOrder}</span>
            </div>
          </div>
        );
      }
      else if (row < maxRow) {
        row++;
        return (
          <div className="pie-chart-report-legend">
            <div className="legend-name">
              <div className="icon-text">
                <div className="marker" style={{ backgroundColor: item?.color }}></div>
                <span className="legend-label text-long">{item?.label}</span>
              </div>
              <span className="legend-total">{item?.totalOrder}</span>
            </div>
          </div>
        );
      }
    });
    return (
      <>
        <div style={(isViewAll && dataSourceRevenue?.length > maxRow)
          ? { maxHeight: 170, overflowY: "scroll", paddingTop: "6px" } : {}}>
          {colorDescriptions}
        </div>
        {dataSourceRevenue?.length > maxRow &&
          (isViewAll
            ?
            <div className="pie-chart-report-legend">
              <div className="legend-link" onClick={() => setIsViewAll(false)}>
                {pageData.hide}&nbsp;&lt;
              </div>
            </div>
            :
            <div className="pie-chart-report-legend">
              <div className="legend-link" onClick={() => setIsViewAll(true)}>
                {pageData.viewAll}&nbsp;&gt;
              </div>
            </div>)
        }
      </>
    );
  }

  return (
    <div className="transaction-order-chart">
      <div className="transaction-order-chart-wrapper" style={{ display: !isChart ? "none" : "flex" }}>
        <>
          <div className="header-chart-detail">
            <span className="pie-chart-title">{chartName}</span>
            <span className="pie-chart-title-detail" onClick={() => setIsChart(!isChart)}>
              {pageData.detail}
            </span>
          </div>
          {isChart && dataSourceRevenue?.reduce((sumOrder, obj) => {
            return sumOrder + obj.totalOrder;
          }, 0) > 0 ? (
            <>
              <FnbPieChart
                className="order-report-pie-chart"
                //height={isMaxWidth1080 ? 260 : 320}
                plotOptions={{
                  pie: {
                    customScale: 0.7,
                    offsetX: 0,
                    offsetY: -40,
                    donut: {
                      size: "70%",
                      labels: {
                        show: true,
                        name: {},
                        value: {
                          fontSize: "18px",
                          fontWeight: "500",
                          color: "#50429B",
                        },
                        total: {
                          show: true,
                          showAlways: true,
                          label: getDataForPieChart?.reduce((sumOrder, obj) => {
                            return sumOrder + obj.value;
                          }, 0),
                          fontSize: "35px",
                          fontWeight: "600",
                          lineHeight: "38px",
                          color: "#50429B",
                          formatter: (w) => {
                            return pageData.orders;
                          },
                        },
                      },
                    },
                  },
                }}
                title={pageData.orders}
                dataSource={getDataForPieChart?.filter((x) => x?.value !== 0)}
                height={height}
              />
              <div className="transaction-chart-description">
                {renderTransactionOrderPieChartDescription(getDataForPieChart)}
              </div>
            </>
          ) : (
            <div className="no-data">
              <NoDataFoundComponent />
            </div>
          )}
        </>
      </div>
      <div className="transaction-order-chart-wrapper" style={{ display: isChart ? "none" : "flex" }}>
        <div className="header-chart-detail">
          <span className="back-to-icon" onClick={() => setIsChart(true)}>
            <BackToPieChartIcon />
          </span>
          <span>{chartName}</span>
        </div>
        {dataSourceRevenue?.reduce((sumOrder, obj) => {
          return sumOrder + obj.totalOrder;
        }, 0) > 0 ? (
          <div className="table-chart-detail">
            <FnbTable columns={tableSettings.columns} dataSource={dataSourceRevenue} className="table-revenue" />
            <hr />
            <table>
              <tr>
                <td width={"50%"}>{pageData.total}</td>
                <td width={"50%"}>
                  {dataSourceRevenue?.reduce((sumOrder, obj) => {
                    return sumOrder + obj.totalOrder;
                  }, 0)}
                </td>
              </tr>
            </table>
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
