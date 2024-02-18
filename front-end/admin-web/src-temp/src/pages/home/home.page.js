import { Card, Col, Row, Table } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import { FnbListBranches } from "components/fnb-list-branches/fnb-list-branches";
import FnbParagraph from "components/fnb-paragraph/fnb-paragraph";
import { FnBWidget } from "components/fnb-widget/fnb-widget.component";
import { RevenueLineChartComponent } from "components/line-chart/line-chart.component";
import PageTitle from "components/page-title";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { CostIcon, CubeIcon, FolderIcon, RevenueIcon } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { TRANSACTION_TABPANE_KEY } from "constants/report.constants";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { resetSession } from "store/modules/session/session.actions";
import { formatTextNumber, getCurrency, tokenExpired } from "utils/helpers";
import { getStorage, localStorageKeys } from "utils/localStorage.helpers";
import StaffActivitiesComponent from "./components/staff-activities.component";
import "./index.scss";

function Home(props) {
  const { orderDataService } = props;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const currency = getCurrency();
  const pageData = {
    title: t("dashboard.title"),
    order: t("dashboard.order"),
    revenue: t("dashboard.revenue"),
    cost: t("dashboard.cost"),
    txt_reduce: t("dashboard.txt_reduce"),
    txt_increase: t("dashboard.txt_increase"),
    allBranch: t("dashboard.allBranch"),
    date: {
      yesterday: "dashboard.compareDate.yesterday",
      previousDay: "dashboard.compareDate.previousDay",
      lastWeek: "dashboard.compareDate.lastWeek",
      previousWeek: "dashboard.compareDate.previousWeek",
      lastMonth: "dashboard.compareDate.lastMonth",
      previousMonth: "dashboard.compareDate.previousMonth",
      lastYear: "dashboard.compareDate.lastYear",
      previousSession: t("dashboard.compareDate.previousSession"),
    },
    noDataFound: t("table.noDataFound"),
    topSellingProductTitle: t("dashboard.topSellingProduct.title"),
    topSellingProductSeemore: t("dashboard.topSellingProduct.seemore"),
    topSellingProductViewMore: t("dashboard.topSellingProduct.viewMore"),
    topSellingProductItems: t("dashboard.topSellingProduct.productItems"),
    topCustomerTitle: t("dashboard.topCustomer.title"),
    recentlyActivitiesText: t("homePage.recentlyActivitiesText"),
  };

  const [initData, setInitData] = useState({});
  const [branchId, setBranchId] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString("en-US"),
    endDate: moment().toDate().toLocaleDateString("en-US"),
  });
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.date.yesterday);
  const [typeOptionDate, setTypeOptionDate] = useState(OptionDateTime.today);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const tableLineChartRef = React.useRef(null);
  const [dataChart, setDataChart] = useState();
  const languageSession = useSelector((state) => state.session?.languageSession);

  useEffect(() => {
    let isTokenExpired = checkTokenExpired();
    if (isTokenExpired) {
      dispatch(resetSession());
      props.history.push("/login");
    } else {
      getInfoData(branchId, selectedDate, typeOptionDate);
      getStatisticalData(branchId, selectedDate, typeOptionDate);
    }
  }, []);

  useEffect(() => {
    if (tableLineChartRef && tableLineChartRef.current) {
      tableLineChartRef.current.fillData(selectedDate, typeOptionDate, dataChart);
    }
  }, [languageSession]);

  const checkTokenExpired = () => {
    let isTokenExpired = true;
    let token = getStorage(localStorageKeys.TOKEN);
    if (token || token !== null) {
      isTokenExpired = tokenExpired(token);
    }
    return isTokenExpired;
  };

  const getInfoData = (branchId, date, typeOptionDate) => {
    getOrderInfoByFilter(branchId, date, typeOptionDate);
    onConditionCompare(OptionDateTime.today);
  };

  const getStatisticalData = (branchId, date, typeOptionDate) => {
    let req = {
      branchId: branchId ?? "",
      startDate: date?.startDate,
      endDate: date?.endDate,
      segmentTimeOption: typeOptionDate,
    };

    orderDataService
      .calculateStatisticalDataAsync(req)
      .then((res) => {
        if (tableLineChartRef && tableLineChartRef.current) {
          tableLineChartRef.current.fillData(date, typeOptionDate, res);
        }
        setDataChart(res);
      })
      .catch((errors) => {
        if (tableLineChartRef && tableLineChartRef.current) {
          tableLineChartRef.current.fillData(date, typeOptionDate, { orderData: [] });
        }
        setDataChart({ orderData: [] });
      });
  };

  const getOrderInfoByFilter = async (branchId, date, typeOptionDate) => {
    // startDate and endDate are local time from client
    let startDate = moment(date?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(date?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId ?? "",
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
    };
    const resultSummaryWidget = await orderDataService.getOrderBusinessSummaryWidgetAsync({
      ...req,
      startDate: date?.startDate,
      endDate: date?.endDate,
    });
    const resultTopSellingProduct = await orderDataService.getOrderTopSellingProductAsync(req);

    setInitData(resultSummaryWidget);
    setTopSellingProducts(resultTopSellingProduct.listTopSellingProduct);
    setTopCustomers(resultTopSellingProduct.listTopCustomer);
  };

  const renderWidgets = () => {
    let listBusiness = [
      {
        total: formatTextNumber(initData?.totalOrder),
        name: pageData.order,
        percent: initData?.percentOrder,
        icon: <CubeIcon className="icon-cube" />,
        isDecrease: initData?.orderIsDecrease,
      },
      {
        total: formatTextNumber(initData?.totalRevenue),
        name: pageData.revenue,
        percent: initData?.percentRevenue,
        icon: <RevenueIcon className="icon-cube" />,
        isDecrease: initData?.revenueIsDecrease,
      },
      {
        total: formatTextNumber(initData?.totalCost),
        name: pageData.cost,
        percent: initData?.percentCost,
        icon: <CostIcon className="icon-cube" />,
        isDecrease: initData?.costIsDecrease,
      },
    ];

    const widgets = listBusiness?.map((item, index) => {
      const value = `${item?.total} ${index === 0 ? "" : currency}`;
      const descriptionFormat = "{{status}} {{value}}% {{compareWith}}";
      const status = item?.isDecrease ? pageData.txt_reduce : pageData.txt_increase;
      const description = `${t(descriptionFormat, {
        status: status,
        value: item?.percent,
        compareWith: t(titleConditionCompare),
      })}`;
      return (
        <Col key={index} className="col-group-business col-with-auto">
          <FnBWidget
            title={item?.name}
            icon={item?.icon}
            value={value}
            description={description}
            isIncrease={!item?.isDecrease}
          />
        </Col>
      );
    });

    return <>{widgets}</>;
  };

  const handleChangeBranch = (branchId) => {
    setBranchId(branchId);
    getOrderInfoByFilter(branchId, selectedDate, typeOptionDate);
    getStatisticalData(branchId, selectedDate, typeOptionDate);
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    setTypeOptionDate(typeOptionDate);
    getOrderInfoByFilter(branchId, date, typeOptionDate);
    getStatisticalData(branchId, date, typeOptionDate);
  };

  const onConditionCompare = (key) => {
    let titleConditionCompare = "";
    switch (key) {
      case OptionDateTime.today:
        titleConditionCompare = pageData.date.yesterday;
        break;
      case OptionDateTime.yesterday:
        titleConditionCompare = pageData.date.previousDay;
        break;
      case OptionDateTime.thisWeek:
        titleConditionCompare = pageData.date.lastWeek;
        break;
      case OptionDateTime.lastWeek:
        titleConditionCompare = pageData.date.previousWeek;
        break;
      case OptionDateTime.thisMonth:
        titleConditionCompare = pageData.date.lastMonth;
        break;
      case OptionDateTime.lastMonth:
        titleConditionCompare = pageData.date.previousMonth;
        break;
      case OptionDateTime.thisYear:
        titleConditionCompare = pageData.date.lastYear;
        break;
      default:
        break;
    }

    setTitleConditionCompare(titleConditionCompare);
  };

  const tableTopSellingProductSettings = {
    pageSize: 20,
    columns: [
      {
        dataIndex: "productName",
        align: "left",
        render: (value, record) => {
          return isTabletOrMobile ? (
            <Row className="table-selling-product-row">
              <div className="table-selling-product-row-title">
                <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
                <div className="table-selling-product-thumbnail">
                  <Thumbnail src={record?.thumbnail} />
                </div>
                <div className="table-selling-product-name">
                  <Row>
                    <Col span={24} className="table-selling-product-text-product-name">
                      <Link to={`/product/details/${record?.productId}`} target="_blank">
                        <FnbParagraph>{value}</FnbParagraph>
                      </Link>
                    </Col>
                  </Row>
                  <Row style={record?.priceName && { marginTop: "4px" }}>
                    <Col span={24} className="table-selling-product-text-no" style={{ fontSize: "14px" }}>
                      {record?.priceName}
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="table-selling-product-row-description">
                <Row>
                  <Col
                    span={24}
                    className="table-selling-product-text-product-name table-selling-product-text-no-font-size"
                  >
                    {`${record?.quantity} ${pageData.topSellingProductItems}`}
                  </Col>
                </Row>
                <Row className="table-selling-product-text-no table-selling-product-quantity-style">
                  <Col span={24}>{`${formatTextNumber(record?.totalCost)} ${getCurrency()}`}</Col>
                </Row>
              </div>
            </Row>
          ) : (
            <Row className="table-selling-product-row">
              <div className="table-selling-product-row-title">
                <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
                <div className="table-selling-product-thumbnail">
                  <Thumbnail src={record?.thumbnail} />
                </div>
                <Col span={10} className="table-selling-product-no">
                  <Row>
                    <Col
                      span={24}
                      className="table-selling-product-text-product-name table-selling-product-name-overflow"
                    >
                      <Link to={`/product/details/${record?.productId}`} target="_blank">
                        <FnbParagraph>{value}</FnbParagraph>
                      </Link>
                    </Col>
                  </Row>
                  <Row style={record?.priceName && { marginTop: "4px" }}>
                    <Col span={24} className="table-selling-product-text-no table-selling-product-text-no-font-size">
                      {record?.priceName}
                    </Col>
                  </Row>
                </Col>
              </div>
              <div className="table-selling-product-row-description">
                <Row>
                  <Col
                    span={24}
                    className="table-selling-product-text-product-name table-selling-product-text-no-font-size"
                  >
                    {`${record?.quantity} ${pageData.topSellingProductItems}`}
                  </Col>
                </Row>
                <Row className="table-selling-product-text-no table-selling-product-quantity-style">
                  <Col span={24}>{`${formatTextNumber(record?.totalCost)} ${getCurrency()}`}</Col>
                </Row>
              </div>
            </Row>
          );
        },
      },
    ],
  };

  const tableTopCustomerSettings = {
    pageSize: 20,
    columns: [
      {
        dataIndex: "customerName",
        width: "65%",
        align: "left",
        render: (value, record) => {
          return isTabletOrMobile ? (
            <div className="table-customer-row">
              <Row>
                <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
                <div className="table-selling-product-thumbnail">
                  <Thumbnail src={record?.thumbnail} />
                </div>
                <div className="table-selling-product-no table-selling-product-name-mobile">
                  <Row>
                    <Col span={24} className="table-selling-product-text-product-name">
                      <Link to={`/customer/detail/${record?.id}`} target="_blank">
                        <FnbParagraph>{value}</FnbParagraph>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>
          ) : (
            <Row>
              <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
              <div className="table-selling-product-thumbnail">
                <Thumbnail src={record?.thumbnail} />
              </div>
              <Col span={10} className="table-selling-product-no">
                <Row>
                  <Col
                    span={24}
                    className="table-selling-product-text-product-name table-selling-product-name-overflow"
                  >
                    <Link to={`/customer/detail/${record?.id}`} target="_blank">
                      <FnbParagraph>{value}</FnbParagraph>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          );
        },
      },
      {
        dataIndex: "cost",
        width: "35%",
        align: "right",
        render: (value) => {
          return isTabletOrMobile ? (
            <>
              <div className="table-selling-product-item-mobile table-customer-row table-customer-item-mobile-margin">
                <Row className="table-selling-product-text-no table-selling-product-text-no-font-size">
                  <Col span={24}>{`${formatTextNumber(value)} ${getCurrency()}`}</Col>
                </Row>
              </div>
            </>
          ) : (
            <>
              <Row className="table-selling-product-text-no table-selling-product-text-no-font-size">
                <Col span={24}>{`${formatTextNumber(value)} ${getCurrency()}`}</Col>
              </Row>
            </>
          );
        },
      },
    ],
  };

  const renderTopSellingProductAndCustomer = () => {
    return (
      <>
        <Row className="mt-5">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} style={isTabletOrMobile ? "" : { paddingRight: "20px" }}>
            <Card
              className={
                isTabletOrMobile
                  ? "fnb-box custom-box card-selling-product-thumbnail"
                  : "fnb-box custom-box card-selling-product-thumbnail top-selling-product-card-width"
              }
            >
              <Row className="group-header-top-selling-product-box">
                <Col xs={18} sm={18} lg={18}>
                  <p style={{ color: "#2B2162" }}>{pageData.topSellingProductTitle}</p>
                </Col>
                <Col xs={6} sm={6} lg={6} className="table-selling-product-see-more-text-align">
                  <p
                    className="table-selling-product-see-more"
                    onClick={() => {
                      props.history.push(`/report/transaction/${TRANSACTION_TABPANE_KEY.PRODUCT}`);
                    }}
                  >
                    {pageData.topSellingProductViewMore}
                  </p>
                </Col>
              </Row>
              <Table
                locale={{
                  emptyText: (
                    <>
                      <p className="text-center table-emty-icon">
                        <FolderIcon />
                      </p>
                      <p className="text-center body-2 table-emty-text">{pageData.noDataFound}</p>
                    </>
                  ),
                }}
                className="fnb-table form-table table-selling-product"
                columns={tableTopSellingProductSettings.columns}
                dataSource={topSellingProducts}
                pagination={false}
              />
            </Card>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={isTabletOrMobile ? { marginTop: "36px" } : { paddingLeft: "20px" }}
          >
            <Card
              className={
                isTabletOrMobile
                  ? "fnb-box custom-box card-selling-product-thumbnail"
                  : "fnb-box custom-box card-selling-product-thumbnail top-selling-product-card-width"
              }
            >
              <Row className="group-header-top-selling-product-box">
                <Col xs={18} sm={18} lg={18}>
                  <p style={{ color: "#2B2162" }}>{pageData.topCustomerTitle}</p>
                </Col>
                <Col xs={6} sm={6} lg={6} className="table-selling-product-see-more-text-align">
                  <p
                    className="table-selling-product-see-more"
                    onClick={() => {
                      props.history.push("/report/customer");
                    }}
                  >
                    {pageData.topSellingProductSeemore}
                  </p>
                </Col>
              </Row>
              <Table
                locale={{
                  emptyText: (
                    <>
                      <p className="text-center table-emty-icon">
                        <FolderIcon />
                      </p>
                      <p className="text-center body-2 table-emty-text">{pageData.noDataFound}</p>
                    </>
                  ),
                }}
                className="fnb-table form-table table-selling-product"
                columns={tableTopCustomerSettings.columns}
                dataSource={topCustomers}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <Row className="fnb-form-title" gutter={[0, 29]}>
      <Col span={24}>
        <Row gutter={[24, 24]} align="middle" justify="center" className="top-dashboard">
          <Col xs={24} sm={24} md={24} lg={8}>
            <PageTitle className="mb-0 title-dashboard" content={pageData.title} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={16} className="fnb-form-btn-popover">
            <Row className="fnb-row-top" gutter={[24, 24]} justify="end">
              <FnbListBranches onChangeEvent={handleChangeBranch} />
              <FnbDatePicker
                selectedDate={selectedDate}
                setSelectedDate={(date, typeOptionDate) => onSelectedDatePicker(date, typeOptionDate)}
                setConditionCompare={onConditionCompare}
              />
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[44, 28]} className="row-width-auto">
          {renderWidgets()}
        </Row>
        <Row gutter={[40, 0]}>
          <Col xs={24} sm={24} lg={16} className="mt-4">
            <Row>
              <RevenueLineChartComponent ref={tableLineChartRef} />
            </Row>
            {renderTopSellingProductAndCustomer()}
          </Col>
          <Col xs={24} sm={24} lg={8} className="mt-4">
            <StaffActivitiesComponent />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Home;
