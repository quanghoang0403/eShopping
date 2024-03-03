import { SwapLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Popover, Radio, Row, Table, Tooltip, Typography, message } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import FnbParagraph from "components/fnb-paragraph/fnb-paragraph";
import { FnbPieChart } from "components/fnb-pie-chart/fnb-pie-chart";
import { FnbTable } from "components/fnb-table/fnb-table";
import { NoDataFoundComponent } from "components/no-data-found/no-data-found.component";
import PageTitle from "components/page-title";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { TopSellingProductComponent } from "components/top-selling-product/top-selling-product";
import { localeDateFormat } from "constants/default.constants";
import {
  BranchIcon,
  DownIcon,
  ExportIcon,
  InfoCircleIcon,
  TotalSoldItemsIcon,
  TriangleIncreaseIcon,
  TriangleReduceIcon,
} from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { DateFormat } from "constants/string.constants";
import branchDataService from "data-services/branch/branch-data.service";
import orderDataService from "data-services/order/order-data.service";
import reportDataService from "data-services/report/report-data.service";
import "font-awesome/css/font-awesome.min.css";
import moment from "moment";
import { useEffect, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import languageService from "services/language/language.service";
import { formatCurrency, formatNumber, getCurrency, handleDownloadFile, hasPermission } from "utils/helpers";
import { ProductReportWidgetComponent } from "../product-report-widget/product-report-widget.component";
import "./product-report.component.scss";
import { PermissionKeys } from "../../../../constants/permission-key.constants";
import { useSelector } from "react-redux";
import { languageCodeSelector } from "store/modules/session/session.reducers";
import { ColumnNameTableSoldProduct } from "constants/report.constants";

const { Text, Paragraph } = Typography;

export default function ReportProductTransaction(props) {
  const [t] = useTranslation();
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

  const pageData = {
    id: t("table.id"),
    status: t("table.status"),
    type: t("table.type"),
    detail: t("table.detail"),
    customer: t("table.customer"),
    point: t("customer.point"),
    total: t("table.total"),
    paymentMethod: t("payment.paymentMethod"),
    discount: t("table:discount"),
    grossTotal: t("table.grossTotal"),
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
      previousSession: "dashboard.compareDate.previousSession",
    },
    noDataFound: t("table.noDataFound"),
    topSellingProductTitle: t("dashboard.topSellingProduct.title"),
    topSellingProductSeemore: t("dashboard.topSellingProduct.seemore"),
    topSellingProductItems: t("dashboard.topSellingProduct.items"),
    topCustomerTitle: t("dashboard.topCustomer.title"),
    btnExport: t("button:export"),
    totalOrder: t("order.totalOrder"),
    reportTitle: t("report.product.reportTitle"),
    totalSoldItem: t("report.product.totalSoldItem"),
    average: t("report.product.average"),
    itemPerOrder: t("report.product.itemPerOrder"),
    costGoodsSold: t("report.product.costGoodsSold"),
    costGoodsAdd: t("report.product.costGoodsAdd"),
    profit: t("report.product.profit"),
    revenue: t("dashboard.revenue"),
    netRevenue: t("report.product.netRevenue"),
    grossRevenue: t("report.product.grossRevenue"),
    grossRevenueTooltip: t("report.product.grossRevenueTooltip"),
    cost: t("dashboard.cost"),
    percent: "%",
    bestSellingProducts: t("dashboard.bestSellingProduct.title"),
    worstSellingProducts: t("dashboard.worstSellingProduct.title"),
    no: t("table.no"),
    product: t("menu.product"),
    category: t("form:category"),
    quantity: t("table.quantity"),
    amount: t("report.product.amount"),
    soldProducts: t("report.product.soldProduct"),
    summary: t("report.summary"),
  };

  const [ellipsis, setEllipsis] = useState(true);
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.date.yesterday);
  const [visible, setVisible] = useState(false);
  const [branches, setBranches] = useState([]);
  const [typeOptionDate, setTypeOptionDate] = useState(OptionDateTime.today);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString(localeDateFormat.enUS),
    endDate: moment().toDate().toLocaleDateString(localeDateFormat.enUS),
  });
  const [branchName, setBranchName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [productTransactionReport, setProductTransactionReport] = useState({});
  const [productReportWidgetData, setProductReportWidgetData] = useState({});
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [worstSellingProducts, setWorstSellingProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [sortNo, setSortNo] = useState(null);
  const [sortProductName, setSortProductName] = useState(null);
  const [sortCategory, setSortCategory] = useState(null);
  const [sortQuantity, setSortQuantity] = useState(null);
  const [sortAmount, setSortAmount] = useState(null);
  const [sortCost, setSortCost] = useState(null);
  const [page, setPage] = useState(1);
  const [pageProductSold, setPageProductSold] = useState(1);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const pageSize = 20;
  const numberDisplayItem = 5;
  const [isLoadingTopProductSold, setIsLoadingTopProductSold] = useState(false);
  const [isLoadingTopProduct, setIsLoadingTopProduct] = useState(false);
  const [totalTopProductSoldRecord, setTotalTopProductSoldRecord] = useState(0);
  const [totalTopProductRecord, setTotalTopProductRecord] = useState(0);
  const languageCode = useSelector(languageCodeSelector);

  useEffect(() => {
    const fetchData = async () => {
      getInfoDataAsync(branchId, selectedDate, typeOptionDate);
    };
    fetchData();
  }, []);

  const onScrollProductSoldSpace = async (event) => {
    let target = event.target;
    let top = target.scrollTop;
    let offsetHeight = target.offsetHeight;
    let max = target.scrollHeight;
    let current = top + offsetHeight;
    const range = 100;

    const currentTotalDataTable = soldProducts?.length;
    if (
      current + range >= max &&
      isLoadingTopProductSold === false &&
      currentTotalDataTable < totalTopProductSoldRecord
    ) {
      setIsLoadingTopProductSold(true);
      await lazyLoadingProductSold(
        pageProductSold + 1,
        pageSize,
        sortNo,
        sortProductName,
        sortCategory,
        sortQuantity,
        sortAmount,
        sortCost,
      );
    }
  };

  const onScrollTopProductSpace = async (event) => {
    let target = event.target;
    let top = target.scrollTop;
    let offsetHeight = target.offsetHeight;
    let max = target.scrollHeight;
    let current = top + offsetHeight;
    const range = 100;

    const currentTotalDataTable = topSellingProducts?.length;
    if (current + range >= max && isLoadingTopProduct === false && currentTotalDataTable < totalTopProductRecord) {
      setIsLoadingTopProduct(true);
      await lazyLoadingTopProduct(page + 1);
    }
  };

  const lazyLoadingProductSold = async (
    page,
    size,
    sortNo,
    sortProductName,
    sortCategory,
    sortQuantity,
    sortAmount,
    sortCost,
  ) => {
    let startDate = moment(selectedDate?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(selectedDate?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId ?? "",
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
      pageNumber: page,
      pageSize: size,
      sortNo: sortNo,
      sortProductName: sortProductName,
      sortCategory: sortCategory,
      sortQuantity: sortQuantity,
      sortAmount: sortAmount,
      sortCost: sortCost,
    };

    var productSolds = await orderDataService.getOrderSoldProductAsync(req);
    var data = productSolds.listSoldProduct?.map((s) => mappingRecordToColumns(s));
    setSoldProducts(data);
    setIsLoadingTopProductSold(false);
    setTotalTopProductSoldRecord(productSolds?.totalSoldProduct);
    setPageProductSold(page);
  };

  const lazyLoadingTopProduct = async (page) => {
    let startDate = moment(selectedDate?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(selectedDate?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId ?? "",
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
      pageNumber: page,
      pageSize: pageSize,
    };
    let products = await reportDataService.getTopSellingProductAsync(req);
    setTopSellingProducts(products.listAllTopSellingProduct);
    setWorstSellingProducts(products.listAllWorstSellingProduct);
    setIsLoadingTopProduct(false);
    setTotalTopProductRecord(products.totalTopSellingProduct);
    setPage(page);
  };

  const mappingRecordToColumns = (item) => {
    return {
      no: item?.no,
      productName: item?.productName,
      category: item?.category,
      quantity: formatNumber(item?.quantity),
      totalCost: formatNumber(item?.totalCost),
      totalProductCost: formatNumber(item?.totalProductCost),
      thumbnail: item?.thumbnail,
      priceName: item?.priceName,
      productId: item?.productId,
    };
  };

  const getInfoDataAsync = async (branchId, date, typeOptionDate) => {
    var response = await branchDataService.getAllBranchsAsync();
    if (response && response?.branchs) {
      const { branchs } = response;
      setBranches(branchs);
    }

    setBranchName(pageData.allBranch);
    onConditionCompare(OptionDateTime.today);
    getOrderInfoByFilterAsync(branchId, date, typeOptionDate);
  };

  const listBranch = (
    <>
      <Row className="branch-content">
        <Col span={24}>
          <Radio.Group onChange={(e) => handleChangeBranchAsync(e)} className="group-branch">
            <Row>
              <Col span={24}>
                <Radio.Button key={null} value={null} className="branch-option">
                  {pageData.allBranch}
                </Radio.Button>
              </Col>
            </Row>
            {branches?.map((item, index) => {
              return (
                <Row key={index}>
                  <Col span={24}>
                    <Radio.Button key={item?.id} value={item?.id} className="branch-option">
                      {item?.name}
                    </Radio.Button>
                  </Col>
                </Row>
              );
            })}
          </Radio.Group>
        </Col>
      </Row>
    </>
  );

  const handleChangeBranchAsync = async (e) => {
    let branchIdSelected = e?.target?.value;
    if (branchIdSelected !== null) {
      setBranchId(branchIdSelected);
      let branchInfo = branches.find((b) => b.id === branchIdSelected);
      setBranchName(branchInfo?.name);
    } else {
      branchIdSelected = "";
      setBranchId(null);
      setBranchName(pageData.allBranch);
    }

    await getOrderInfoByFilterAsync(branchIdSelected, selectedDate, typeOptionDate);
    setVisible(false);
  };

  const getOrderInfoByFilterAsync = async (branchId, date, typeOptionDate) => {
    let startDate = moment(date?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(date?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId ?? "",
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
      pageNumber: 1,
      pageSize: pageSize,
    };

    const orderProductReportResponse = await orderDataService.getOrderProductReportAsync(req);
    setProductTransactionReport(orderProductReportResponse);
    const { averageOrder, totalOrder, totalSoldItems } = orderProductReportResponse?.orderProductReport;
    var newProductReportWidgetData = {
      icon: <TotalSoldItemsIcon className="icon-cube" />,
      title: pageData.totalSoldItem,
      value: totalSoldItems,
      totalOrder: totalOrder,
      description: productReportWidgetDescription(orderProductReportResponse?.orderProductReport),
      average: `${averageOrder}`,
    };

    setProductReportWidgetData(newProductReportWidgetData);
    let products = await reportDataService.getTopSellingProductAsync(req);
    setTopSellingProducts(products.listAllTopSellingProduct);
    setWorstSellingProducts(products.listAllWorstSellingProduct);

    var productSolds = await orderDataService.getOrderSoldProductAsync(req);
    var data = productSolds.listSoldProduct?.map((s) => mappingRecordToColumns(s));
    setSoldProducts(data);
    setTotalQuantity(productSolds?.totalQuantity);
    setTotalAmount(productSolds?.totalAmount);
    setTotalCost(productSolds?.totalCost);
    setTotalTopProductSoldRecord(productSolds?.totalSoldProduct);
    setTotalTopProductRecord(products.totalTopSellingProduct);
  };

  const onSelectedDatePickerAsync = async (date, typeOptionDate) => {
    setSelectedDate(date);
    setTypeOptionDate(typeOptionDate);
    await getOrderInfoByFilterAsync(branchId, date, typeOptionDate);
  };

  const onConditionCompare = (key) => {
    switch (key) {
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
        break;
    }
  };

  const productReportWidgetDescription = (orderProductReport) => {
    if (!orderProductReport) return <></>;
    const { percentage, isDecrease } = orderProductReport;
    const icon = !isDecrease ? (
      <TriangleIncreaseIcon className="icon-increase-triangle" />
    ) : (
      <TriangleReduceIcon className="icon-increase-triangle ml-2" />
    );

    const description = t("{{increase}} <span>{{value}}%</span> {{compareWith}}", {
      increase: !isDecrease ? t(pageData.txt_increase) : t(pageData.txt_reduce),
      value: Math.abs(percentage),
      compareWith: t(titleConditionCompare),
    });

    return (
      <>
        <div className="description-report">
          {icon}
          <Paragraph
            className="label"
            ellipsis={
              ellipsis
                ? {
                    rows: 1,
                    expandable: false,
                    symbol: "",
                    tooltip: description,
                  }
                : false
            }
          >
            <p dangerouslySetInnerHTML={{ __html: description }}></p>
          </Paragraph>
        </div>
      </>
    );
  };

  const getDataForPieChart = () => {
    const { productCostReport, profitPercentage, isDecrease, totalProfit } = productTransactionReport;
    if (productCostReport) {
      const { percentage, totalCost } = productCostReport;
      const pieChartData = [
        {
          label: pageData.cost, /// Required for pie chart
          value: totalCost, /// Required for pie chart
          color: "#50429B", /// Required for pie chart
          comparePercent: percentage,
          isDecrease: productCostReport?.isDecrease,
        },
        {
          label: pageData.profit,
          value: totalProfit,
          color: "#6C5ACA",
          comparePercent: profitPercentage,
          isDecrease: isDecrease,
        },
      ];

      return pieChartData;
    }

    return [];
  };

  function renderRevenuePieChartDescriptions(pieChartDes) {
    const { productCostReport, totalProfit, totalNet } = productTransactionReport;
    const colorDescriptions = pieChartDes?.map((item) => {
      const icon = !item?.isDecrease ? (
        <TriangleIncreaseIcon className="icon-increase-triangle mr-2" />
      ) : (
        <TriangleReduceIcon className="icon-increase-triangle mr-2" />
      );

      return (
        <div className="pie-chart-report-legend">
          <div className="legend-name">
            <div className="marker" style={{ backgroundColor: item?.color }}></div>
            <span className="legend-label">{item?.label}</span>
          </div>
          <div className="legend-value">
            <span>{icon}</span>
            <span>
              {item?.comparePercent} {pageData.percent}
            </span>
          </div>
        </div>
      );
    });

    return (
      <>
        <div className="mb-5">{colorDescriptions}</div>
        <div className="description-summary">
          <div className="d-flex">
            <span className="mr-2">{pageData.netRevenue}</span>
            <span className="ml-1 pointer">
              <Tooltip placement="top" title={pageData.grossRevenueTooltip}>
                <InfoCircleIcon size={24} />
              </Tooltip>
            </span>
          </div>
          <div className="summary-value">{formatCurrency(totalNet)}</div>
        </div>
        <div className="description-summary">
          <div>{pageData.costGoodsSold}</div>
          <div className="summary-value">{formatCurrency(productCostReport?.totalCost)}</div>
        </div>
        <div className="description-summary total">
          <div>{pageData.profit}</div>
          <div>{formatCurrency(totalProfit)}</div>
        </div>
      </>
    );
  }

  function renderPieChart() {
    if (productTransactionReport?.totalRevenue > 0) {
      return (
        <>
          <FnbPieChart
            width={"340px"}
            height={"340px"}
            className="product-report-pie-chart"
            title={pageData.grossRevenue}
            unit={getCurrency()}
            isShowTotalRevenue={true}
            dataSource={getDataForPieChart()}
            totalRevenue={productTransactionReport?.totalRevenue}
          />
          <div class="chart-description-wrapper">{renderRevenuePieChartDescriptions(getDataForPieChart())}</div>
        </>
      );
    } else {
      return (
        <div className="no-data">
          <NoDataFoundComponent />
        </div>
      );
    }
  }

  const resetSort = () => {
    setSortNo(null);
    setSortProductName(null);
    setSortCategory(null);
    setSortQuantity(null);
    setSortAmount(null);
    setSortCost(null);
  };

  const handleSortTable = (sortColumn) => {
    resetSort();

    switch (sortColumn) {
      //ProductName
      case ColumnNameTableSoldProduct.PRODUCT:
        if (sortProductName === "ascend") {
          setSortProductName("descent");
          lazyLoadingProductSold(pageProductSold, pageSize, null, "descent", null, null, null, null);
        } else if (sortProductName === "descent") {
          setSortProductName(null);
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, null, null, null);
        } else {
          setSortProductName("ascend");
          lazyLoadingProductSold(pageProductSold, pageSize, null, "ascend", null, null, null, null);
        }
        break;
      //Category
      case ColumnNameTableSoldProduct.CATEGORY:
        if (sortCategory === "ascend") {
          setSortCategory("descent");
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, "descent", null, null, null);
        } else if (sortCategory === "descent") {
          setSortCategory(null);
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, null, null, null);
        } else {
          setSortCategory("ascend");
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, "ascend", null, null, null);
        }
        break;
      //Quantity
      case ColumnNameTableSoldProduct.QUANTITY:
        if (sortQuantity === "ascend") {
          setSortQuantity("descent");
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, "descent", null, null);
        } else if (sortQuantity === "descent") {
          setSortQuantity(null);
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, null, null, null);
        } else {
          setSortQuantity("ascend");
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, "ascend", null, null);
        }
        break;
      //Amount
      case ColumnNameTableSoldProduct.AMOUNT:
        if (sortAmount === "ascend") {
          setSortAmount("descent");
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, null, "descent", null);
        } else if (sortAmount === "descent") {
          setSortAmount(null);
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, null, null, null);
        } else {
          setSortAmount("ascend");
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, null, "ascend", null);
        }
        break;
      //Cost
      case ColumnNameTableSoldProduct.COST:
        if (sortCost === "ascend") {
          setSortCost("descent");
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, null, null, "descent");
        } else if (sortCost === "descent") {
          setSortCost(null);
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, null, null, null);
        } else {
          setSortCost("ascend");
          lazyLoadingProductSold(pageProductSold, pageSize, null, null, null, null, null, "ascend");
        }
        break;
      default:
        break;
    }
  };

  const tableSoldSettings = {
    columns: [
      {
        title: pageData.no,
        dataIndex: "no",
        key: "no",
        align: "left",
        width: "10%",
        render: (_, record, index) => (
          <Row>
            <Col span={24}>{index + 1}</Col>
          </Row>
        ),
      },
      {
        title: (
          <>
            {pageData.product}
            <SwapLeftOutlined
              style={sortProductName === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
              onClick={() => handleSortTable(ColumnNameTableSoldProduct.PRODUCT)}
            />
            <SwapLeftOutlined
              style={sortProductName === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
              onClick={() => handleSortTable(ColumnNameTableSoldProduct.PRODUCT)}
            />
          </>
        ),
        dataIndex: "productName",
        key: "productName",
        align: "left",
        width: "30%",
        render: (value, record) => {
          return (
            <Row>
              <div className="table-selling-product-thumbnail">
                <Thumbnail src={record?.thumbnail} />
              </div>
              <Col span={15} className="table-selling-product-no">
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
            </Row>
          );
        },
        sortOrder: sortProductName,
        className: "table-header-click",
      },
      {
        title: (
          <>
            {pageData.category}
            <SwapLeftOutlined
              style={sortCategory === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
              onClick={() => handleSortTable(ColumnNameTableSoldProduct.CATEGORY)}
            />
            <SwapLeftOutlined
              style={sortCategory === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
              onClick={() => handleSortTable(ColumnNameTableSoldProduct.CATEGORY)}
            />
          </>
        ),
        dataIndex: "category",
        key: "category",
        align: "left",
        width: "15%",
        sortOrder: sortCategory,
        className: "table-header-click",
      },
      {
        title: (
          <>
            {pageData.quantity}
            <SwapLeftOutlined
              style={sortQuantity === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
              onClick={() => handleSortTable(ColumnNameTableSoldProduct.QUANTITY)}
            />
            <SwapLeftOutlined
              style={sortQuantity === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
              onClick={() => handleSortTable(ColumnNameTableSoldProduct.QUANTITY)}
            />
          </>
        ),
        dataIndex: "quantity",
        key: "quantity",
        align: "center",
        width: "15%",
        sortOrder: sortQuantity,
        className: "table-header-click",
      },
      {
        title: (
          <>
            {`${pageData.amount}(${getCurrency()})`}
            <SwapLeftOutlined
              style={sortAmount === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
              onClick={() => handleSortTable(ColumnNameTableSoldProduct.AMOUNT)}
            />
            <SwapLeftOutlined
              style={sortAmount === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
              onClick={() => handleSortTable(ColumnNameTableSoldProduct.AMOUNT)}
            />
          </>
        ),
        dataIndex: "totalCost",
        key: "totalCost",
        align: "right",
        width: "15%",
        sortOrder: sortAmount,
        className: "table-header-click",
      },
      {
        title: (
          <>
            {`${pageData.cost}(${getCurrency()})`}
            <SwapLeftOutlined
              style={sortCost === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
              onClick={() => handleSortTable(ColumnNameTableSoldProduct.COST)}
            />
            <SwapLeftOutlined
              style={sortCost === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
              onClick={() => handleSortTable(ColumnNameTableSoldProduct.COST)}
            />
          </>
        ),
        dataIndex: "totalProductCost",
        key: "totalProductCost",
        align: "right",
        width: "15%",
        sortOrder: sortCost,
        className: "table-header-click",
      },
    ],
  };

  const exportSoldProductsAsync = async () => {
    let languageCode = languageService.getLang();
    let startDate = moment(selectedDate?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(selectedDate?.endDate).format(DateFormat.MM_DD_YYYY);
    var timeZone = new Date().getTimezoneOffset() / 60;
    var param = {
      languageCode: languageCode,
      branchId: branchId,
      startDate: startDate,
      endDate: endDate,
      timeZone: timeZone,
    };
    try {
      var response = await reportDataService.exportSoldProductsAsync(param);
      handleDownloadFile(response);
    } catch (error) {
      const { statusText } = error;

      message.error(statusText);
    }
  };

  const renderProductSoldSummary = useCallback(() => {
    return (
      <Table.Summary fixed>
        <Table.Summary.Row className="product-summary-report">
          <Table.Summary.Cell index={0} colSpan={3}>
            {pageData.total.toUpperCase()}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">
            {formatNumber(totalQuantity)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2} align="right">
            {formatNumber(totalAmount)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3} align="right">
            {formatNumber(totalCost)}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  }, [languageCode, totalQuantity, totalAmount, totalCost]);

  return (
    <>
      <Col span={24}>
        <Row gutter={[24, 24]} align="middle" justify="center" className="top-dashboard">
          <Col xs={24} sm={24} md={24} lg={8}>
            <PageTitle className="mb-0 title-dashboard title-summary" content={pageData.summary} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={16} className="fnb-form-btn-popover">
            <Row className="fnb-row-top fnb-row-filter" gutter={[24, 24]} justify="end">
              <Popover
                placement="bottom"
                overlayClassName="dashboard-branch"
                content={listBranch}
                trigger="click"
                open={visible}
                onOpenChange={(isClick) => setVisible(isClick)}
                className="branch-popover"
              >
                <Button className="btn-branch">
                  <Row>
                    <Col span={22} className="div-branch-name">
                      <div className="icon-branch">
                        <BranchIcon />
                      </div>
                      <Text className="branch-name text-line-description-clamp-1">{branchName}</Text>
                    </Col>
                    <Col span={2} className="div-icon-down">
                      <DownIcon />
                    </Col>
                  </Row>
                </Button>
              </Popover>
              <FnbDatePicker
                selectedDate={selectedDate}
                setSelectedDate={(date, typeOptionDate) => onSelectedDatePickerAsync(date, typeOptionDate)}
                setConditionCompare={onConditionCompare}
              />
            </Row>
          </Col>
        </Row>
      </Col>
      <div className="mt-5 product-report-summary w-100">
        <ProductReportWidgetComponent
          data={{ ...productReportWidgetData }}
          description={productReportWidgetDescription(productTransactionReport?.orderProductReport)}
        />
        <Card className="w-100 revenue">
          <h2 className="product-revenue-title">{pageData.reportTitle}</h2>
          <div className="product-revenue-summary">{renderPieChart()}</div>
        </Card>
      </div>
      <div className="top-selling-product-transaction">
        <Row>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={12}
            style={
              isTabletOrMobile
                ? ""
                : topSellingProducts.length > 5
                ? { paddingRight: "16px", paddingBottom: "80px" }
                : { paddingRight: "16px", paddingBottom: "30px" }
            }
          >
            <TopSellingProductComponent
              dataSource={topSellingProducts}
              title={pageData.bestSellingProducts}
              hideSeeMore={true}
              onScroll={onScrollTopProductSpace}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={12}
            style={isTabletOrMobile ? { marginTop: "36px" } : { paddingLeft: "16px" }}
          >
            <TopSellingProductComponent
              dataSource={worstSellingProducts}
              title={pageData.worstSellingProducts}
              hideSeeMore={true}
              onScroll={onScrollTopProductSpace}
            />
          </Col>
        </Row>
      </div>

      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle className="mb-3 title-dashboard" content={pageData.soldProducts} />
        </Col>
        {hasPermission(PermissionKeys.EXPORT_SOLD_PRODUCT_REPORT) ? (
          <Col span={12}>
            <Button
              icon={<ExportIcon />}
              type="primary"
              className="fnb-add-new-button float-right"
              onClick={() => exportSoldProductsAsync()}
            >
              {pageData.btnExport}
            </Button>
          </Col>
        ) : null}
      </Row>
      <FnbTable
        onScroll={onScrollProductSoldSpace}
        scrollX={1350}
        scrollY={106 * numberDisplayItem}
        columns={tableSoldSettings.columns}
        dataSource={soldProducts}
        summary={renderProductSoldSummary}
      />
    </>
  );
}
