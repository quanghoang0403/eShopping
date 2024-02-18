import { SwapLeftOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { sortConstant, tableSettings } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { ClassicMember, EnDash } from "constants/string.constants";
import reportDataService from "data-services/report/report-data.service";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { executeAfter, formatNumber, formatTextNumber, getCurrency, hasPermission, roundNumber } from "utils/helpers";
import "./top-customer-report.component.scss";

const { forwardRef, useImperativeHandle } = React;

export const TopCustomerListReportComponent = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const numberDisplayItem = 5;
  const pageSize = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [topCustomers, setTopCustomers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortCustomerName, setSortCustomerName] = useState(null);
  const [sortOrderNumber, setSortOrderNumber] = useState(null);
  const [sortAmount, setSortAmount] = useState(null);
  const [page, setPage] = useState(tableSettings.page);
  const [totalTopCustomerRecord, setTotalTopCustomerRecord] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrderNumber, setTotalOrderNumber] = useState(0);
  const [branchId, setBranchId] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().startOf("date").toDate(),
    endDate: moment().endOf("date").toDate(),
  });

  useImperativeHandle(ref, () => ({
    getDataFilter(data) {
      if (data) {
        const { branchId, fromDate, toDate } = data;
        getTopCustomerByFilterAsync(branchId, fromDate, toDate);
        setSelectedDate({
          startDate: fromDate,
          endDate: toDate,
        });
        setBranchId(branchId);
        resetSort();
      }
    },
  }));

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

  const pageData = {
    title: t("report.topCustomer.title", "Top customer"),
    no: t("table.no", "No"),
    name: t("report.topCustomer.name", "Customer name"),
    phone: t("report.topCustomer.phone", "Phone"),
    rank: t("report.topCustomer.rank", "Rank"),
    point: t("report.topCustomer.point", "Point"),
    orderNumber: t("report.topCustomer.orderNumber", "Order number"),
    totalAmount: t("report.topCustomer.totalAmount", "Total amount"),
    searchPlaceholder: t("report.topCustomer.searchPlaceholder", "Search by customer name or phone"),
    total: t("table.total", "Total"),
  };

  const getTopCustomerByFilterAsync = async (branchId, fromDate, toDate) => {
    let request = {
      branchId: branchId ?? "",
      startDate: fromDate,
      endDate: toDate,
      keySearch: "",
      pageNumber: tableSettings.page,
      pageSize: pageSize,
      sortCustomerName: "",
      sortOrderNumber: "",
      sortTotalAmount: "",
    };

    var topCustomerListResponse = await reportDataService.getTopCustomerReportAsync(request);
    const { topCustomerList, totalAmount, totalCustomer, totalOrder } = topCustomerListResponse;
    setTotalTopCustomerRecord(totalCustomer);
    setTotalAmount(totalAmount);
    setTotalOrderNumber(totalOrder);

    var data = topCustomerList?.map((s) => mappingRecordToColumns(s));
    setTopCustomers(data);
    setPage(tableSettings.page + 1);
  };

  const resetSort = () => {
    setSortCustomerName(null);
    setSortOrderNumber(null);
    setSortAmount(null);
  };

  const tableTopCustomerSettings = {
    columns: [
      {
        title: pageData.no,
        width: "120px",
        render: (_, record, index) => (
          <Row className="ml-10">
            <Col span={24}>{index + 1}</Col>
          </Row>
        ),
      },
      {
        title: (
          <>
            {pageData.name}
            <SwapLeftOutlined
              style={
                sortCustomerName === sortConstant.DESC ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }
              }
              rotate={270}
            />
            <SwapLeftOutlined
              style={
                sortCustomerName === sortConstant.ASC
                  ? { marginLeft: "-10px" }
                  : { marginLeft: "-10px", color: "#AA9AFF" }
              }
              rotate={90}
            />
          </>
        ),
        dataIndex: "fullName",
        key: "fullName",
        align: "left",
        width: "250px",
        render: (_, record) => {
          return (
            <div className="text-name-overflow">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.fullName }}
                color="#50429B"
              >
                {hasPermission(PermissionKeys.VIEW_CUSTOMER) ? (
                  <Link to={`/customer/detail/${record?.id}`}>
                    <span className="text-name">{record?.fullName}</span>
                  </Link>
                ) : (
                  <span>{record?.fullName}</span>
                )}
              </Paragraph>
            </div>
          );
        },
        sortOrder: sortCustomerName,
        className: "cursor-pointer",
        onHeaderCell: () => {
          return {
            onClick: () => {
              resetSort();
              if (sortCustomerName === sortConstant.ASC) {
                setSortCustomerName(sortConstant.DESC);
                lazyLoading(tableSettings.page, pageSize, searchText, sortConstant.DESC, null, null);
              } else if (sortCustomerName === sortConstant.DESC) {
                setSortCustomerName(null);
                lazyLoading(tableSettings.page, pageSize, searchText, null, null, null);
              } else {
                setSortCustomerName(sortConstant.ASC);
                lazyLoading(tableSettings.page, pageSize, searchText, sortConstant.ASC, null, null);
              }
            },
          };
        },
      },
      {
        title: pageData.phone,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: "180px",
      },
      {
        title: pageData.rank,
        dataIndex: "rank",
        key: "rank",
        width: "300px",
        render: (_, record) => {
          if (!record?.rank && record?.point === EnDash) {
            return (
              <>
                <Row>
                  <Col span={24}>{EnDash}</Col>
                </Row>
              </>
            );
          } else {
            return (
              <>
                <Row className="membership-rank-margin">
                  <Col span={8}>
                    <span className="float-left membership-rank-title-margin">{pageData.rank}:</span>
                  </Col>
                  <Col span={16}>
                    <Paragraph
                      style={
                        record?.color && record?.color !== ""
                          ? { background: record?.color }
                          : { background: "#efbb00" }
                      }
                      placement="top"
                      ellipsis={{ tooltip: record?.rank ?? ClassicMember }}
                      className="float-right membership-rank"
                    >
                      <span>{record?.rank ?? ClassicMember}</span>
                    </Paragraph>
                  </Col>
                </Row>
                <Row className="membership-point">
                  <Col span={8}>
                    <span className="float-left">{pageData.point}:</span>
                  </Col>
                  <Col span={16}>
                    <span className="float-right point-text">{record?.point}</span>
                  </Col>
                </Row>
              </>
            );
          }
        },
      },
      {
        title: (
          <>
            {pageData.orderNumber}
            <SwapLeftOutlined
              style={
                sortOrderNumber === sortConstant.DESC ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }
              }
              rotate={270}
            />
            <SwapLeftOutlined
              style={
                sortOrderNumber === sortConstant.ASC
                  ? { marginLeft: "-10px" }
                  : { marginLeft: "-10px", color: "#AA9AFF" }
              }
              rotate={90}
            />
          </>
        ),
        dataIndex: "orderNumber",
        key: "orderNumber",
        align: "center",
        width: "238px",
        render: (_, record) => {
          return <span>{record?.orderNumber}</span>;
        },
        sortOrder: sortOrderNumber,
        className: "cursor-pointer",
        onHeaderCell: () => {
          return {
            onClick: () => {
              resetSort();
              if (sortOrderNumber === sortConstant.ASC) {
                setSortOrderNumber(sortConstant.DESC);
                lazyLoading(tableSettings.page, pageSize, searchText, null, sortConstant.DESC, null);
              } else if (sortOrderNumber === sortConstant.DESC) {
                setSortOrderNumber(null);
                lazyLoading(tableSettings.page, pageSize, searchText, null, null, null);
              } else {
                setSortOrderNumber(sortConstant.ASC);
                lazyLoading(tableSettings.page, pageSize, searchText, null, sortConstant.ASC, null);
              }
            },
          };
        },
      },
      {
        title: (
          <>
            {pageData.totalAmount} {`(${getCurrency()})`}
            <SwapLeftOutlined
              style={sortAmount === sortConstant.DESC ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
            />
            <SwapLeftOutlined
              style={
                sortAmount === sortConstant.ASC ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }
              }
              rotate={90}
            />
          </>
        ),
        dataIndex: "totalAmount",
        key: "totalAmount",
        align: "right",
        width: "260px",
        render: (_, record) => {
          return <span className="total-amount-text">{record?.totalAmount}</span>;
        },
        sortOrder: sortAmount,
        className: "cursor-pointer",
        onHeaderCell: () => {
          return {
            onClick: () => {
              resetSort();
              if (sortAmount === sortConstant.ASC) {
                setSortAmount(sortConstant.DESC);
                lazyLoading(tableSettings.page, pageSize, searchText, null, null, sortConstant.DESC);
              } else if (sortAmount === sortConstant.DESC) {
                setSortAmount(null);
                lazyLoading(tableSettings.page, pageSize, searchText, null, null, null);
              } else {
                setSortAmount(sortConstant.ASC);
                lazyLoading(tableSettings.page, pageSize, searchText, null, null, sortConstant.ASC);
              }
            },
          };
        },
      },
    ],
    onSearch: async (keySearch) => {
      setSearchText(keySearch);
      executeAfter(500, async () => {
        await lazyLoading(tableSettings.page, pageSize, keySearch, sortCustomerName, sortOrderNumber, sortAmount, false, true);
      });
    },
  };

  const onScrollSpace = async (event) => {
    let target = event.target;
    let top = target.scrollTop;
    let offsetHeight = target.offsetHeight;
    let max = target.scrollHeight;
    let current = top + offsetHeight;
    const range = 100;

    const currentTotalDataTable = topCustomers?.length;
    if (current + range >= max && isLoading === false && currentTotalDataTable < totalTopCustomerRecord) {
      setIsLoading(true);
      await lazyLoading(page, pageSize, searchText, sortCustomerName, sortOrderNumber, sortAmount, true);
    }
  };

  const lazyLoading = async (page, size, keySearch, sortCustomerName, sortOrderNumber, sortTotalAmount, isScroll, isChangeKeySearch) => {
    let request = {
      branchId: branchId ?? "",
      startDate: selectedDate?.startDate,
      endDate: selectedDate?.endDate,
      pageNumber: page,
      pageSize: size,
      sortCustomerName: sortCustomerName ?? "",
      sortOrderNumber: sortOrderNumber ?? "",
      sortTotalAmount: sortTotalAmount ?? "",
      keySearch: keySearch,
    };

    var topCustomerListResponse = await reportDataService.getTopCustomerReportAsync(request);
    const { topCustomerList, totalAmount, totalCustomer, totalOrder } = topCustomerListResponse;
      setTotalTopCustomerRecord(totalCustomer);
      setTotalAmount(totalAmount);
      setTotalOrderNumber(totalOrder);

    var data = topCustomerList?.map((s) => mappingRecordToColumns(s));
    if (totalCustomer && data && data.length > 0) {
      if(isScroll){
        setTopCustomers(topCustomers.concat(data));
      }
      else if(isChangeKeySearch) {
        setTopCustomers(data);
      }      
      setPage(page + 1);
    } else {
      setTopCustomers([]);
      setPage(page);
    }

    setIsLoading(false);
  };

  const mappingRecordToColumns = (item) => {
    return {
      no: item?.no,
      id: item?.id,
      fullName: item?.fullName,
      phoneNumber: item?.phoneNumber,
      rank: item?.rank,
      point: formatNumber(item?.point),
      orderNumber: formatNumber(item?.orderNumber),
      totalAmount: formatTextNumber(roundNumber(item?.totalAmount)),
      accumulatedPoint: formatNumber(item?.accumulatedPoint),
      color: item?.color,
    };
  };

  return (
    <div className="top-customer-report">
      <PageTitle className="title-dashboard" content={pageData.title} />
      <div className="table-top-customer-wrapper">
        <div className="table-top-customer-container">
          <FnbTable
            onScroll={onScrollSpace}
            scrollX={1400}
            scrollY={106 * numberDisplayItem}
            className="table-top-customer"
            columns={tableTopCustomerSettings.columns}
            dataSource={topCustomers}
            search={{
              placeholder: pageData.searchPlaceholder,
              onChange: tableTopCustomerSettings.onSearch,
            }}
          />
        </div>
        <Row className="top-customer-report-total">
          <Col span={isTabletOrMobile ? 8 : 16}>
            <span className="total-text">{pageData.total?.toUpperCase()}</span>
          </Col>
          <Col span={isTabletOrMobile ? 8 : 4}>
            <Row className="justify-content-center">
              <span>{formatNumber(totalOrderNumber)}</span>
            </Row>
          </Col>
          <Col span={isTabletOrMobile ? 8 : 4}>
            <span className={`total-amount-text ${isTabletOrMobile ? "pr-3" : ""}`}>
              {formatTextNumber(roundNumber(totalAmount))}
            </span>
          </Col>
        </Row>
      </div>
    </div>
  );
});
