import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tableSettings } from "constants/default.constants";
import { FnbTable } from "components/fnb-table/fnb-table";
import { Typography } from "antd";
import { EnumTransferMaterialStatus } from "constants/transfer-material-history.constant";
import "./index.scss";
import { convertUtcToLocalTime, executeAfter } from "utils/helpers";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import { OptionDateTime } from "constants/option-date.constants";
import transferMaterialHistoryDataService from "data-services/transfer-material-history/transfer-material-history-data.service";
import { FilterPopover } from "pages/inventory/transfer-material-history/components/filter-popover.component";
import ModalTransferMaterialHistoryDetail from "./transfer-material-history-detail.modal";
const { Paragraph } = Typography;

export default function TableTransferMaterialHistory(props) {
  const [t] = useTranslation();

  const pageData = {
    transferMaterialHistory: t("transferMaterialHistory.title"),
    searchPlaceholder: t("transferMaterialHistory.searchPlaceholder"),
    showingRecordMessage: t("transferMaterialHistory.showingRecordMessage"),
    from: t("transferMaterialHistory.from"),
    destination: t("transferMaterialHistory.destination"),
    updatedBy: t("transferMaterialHistory.updatedBy"),
    status: t("transferMaterialHistory.status"),
    time: t("transferMaterialHistory.time"),
    lastUpdatedBy: t("transferMaterialHistory.lastUpdatedBy"),
    material: t("transferMaterialHistory.material"),
    transferId: t("transferMaterialHistory.transferId"),
    new: t("transferMaterialHistory.new"),
    inProgress: t("transferMaterialHistory.inProgress"),
    delivering: t("transferMaterialHistory.delivering"),
    completed: t("transferMaterialHistory.completed"),
    canceled: t("transferMaterialHistory.cancelled"),
    all: t("transferMaterialHistory.all"),
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
    today: t("optionDatetime.today"),
    yesterday: "dashboard.compareDate.yesterday",
    filter: t("button.filter"),
  };

  const filterPopoverRef = React.useRef();

  const [totalTransferMaterialHistory, setTotalTransferMaterialHistory] =
    useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [keySearch, setKeySearch] = useState("");
  const [showPopover, setShowPopover] = useState(true);
  const [countFilter, setCountFilter] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [
    showTransferMaterialHistoryDetailModal,
    setShowTransferMaterialHistoryDetailModal,
  ] = useState(false);
  const [fromWarehouseList, setFromWarehouseList] = useState([]);
  const [toWarehouseList, setToWarehouseList] = useState([]);
  const [updatedByList, setUpdatedByList] = useState([]);
  const [dataFilter, setDataFilter] = useState({});
  const [titleConditionCompare, setTitleConditionCompare] = useState(
    pageData.yesterday
  );
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString("en-US"),
    endDate: moment().toDate().toLocaleDateString("en-US"),
  });
  const [transferMaterialHistoryId, setTransferMaterialHistoryId] = useState("");

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const getColumnsTransferMaterialHistory = () => {
    const columnsTransferMaterialHistory = [
      {
        title: pageData.transferId,
        dataIndex: "transferId",
        key: "transferId",
        width: "10%",
        align: "left",
        className: "grid-column-transfer-id grid-column-nowrap-text",
        render: (_, record) => {
          let href = `/inventory/transfer-material/view/${record?.transferMaterialId}`;
          return (
            <Link className="text-id-transfer" to={href}>
              {record?.transferId}
            </Link>
          );
        },
      },
      {
        title: pageData.time,
        dataIndex: "time",
        key: "time",
        width: "15%",
        align: "center",
        className: "grid-text-column",
        render: (_, record) => {
          return (
            <Row>
              <Col span={24} className="text-time-transfer">
                {convertUtcToLocalTime(record?.createdTime).format(
                  DateFormat.HH_MM
                )}
              </Col>
              <Col span={24} className="text-date-transfer">
                {convertUtcToLocalTime(record?.createdTime).format(
                  DateFormat.DD_MM_YYYY
                )}
              </Col>
            </Row>
          );
        },
      },
      {
        title: pageData.from,
        dataIndex: "from",
        key: "from",
        width: "15%",
        align: "left",
        className: "grid-text-column",
        render: (_, record) => {
          return (
            <div className="text-overflow-content text-content-20">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.fromWarehouseName }}
                color="#50429B"
              >
                <span>{record?.fromWarehouseName}</span>
              </Paragraph>
            </div>
          );
        },
      },
      {
        title: pageData.destination,
        dataIndex: "destination",
        key: "destination",
        width: "15%",
        align: "left",
        className: "grid-text-column",
        render: (_, record) => {
          return (
            <div className="text-overflow-content text-content-20">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.toWarehouseName }}
                color="#50429B"
              >
                <span>{record?.toWarehouseName}</span>
              </Paragraph>
            </div>
          );
        },
      },
      {
        title: pageData.material,
        dataIndex: "material",
        key: "material",
        width: "15%",
        align: "center",
        className: "grid-text-column grid-column-nowrap-text",
        render: (_, record) => {
          return (
            <div className="text-overflow-content text-number-material">
              <span
                onClick={() =>
                  handleShowModalTransferMaterialHistoryDetail(record?.id)
                }
              >
                {record?.quantityMaterial}
              </span>
            </div>
          );
        },
      },
      {
        title: pageData.lastUpdatedBy,
        dataIndex: "lastUpdatedBy",
        key: "lastUpdatedBy",
        width: "15%",
        align: "left",
        className: "grid-text-column grid-column-nowrap-text",
        render: (_, record) => {
          return (
            <div className="text-overflow-content text-content-20">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.lastUpdatedName }}
                color="#50429B"
              >
                <span>{record?.lastUpdatedName}</span>
              </Paragraph>
            </div>
          );
        },
      },
      {
        title: pageData.status,
        dataIndex: "status",
        key: "status",
        width: "15%",
        align: "left",
        className: "grid-text-column",
        render: (_, record) => {
          return renderTransferMaterialStatus(record?.statusId);
        },
      },
    ];

    return columnsTransferMaterialHistory;
  };

  const renderTransferMaterialStatus = (statusId) => {
    switch (statusId) {
      case EnumTransferMaterialStatus.Draft:
        return <div className="text-status status-draft">{pageData.new}</div>;
      case EnumTransferMaterialStatus.Inprogress:
        return (
          <div className="text-status status-in-progress grid-column-nowrap-text">
            {pageData.inProgress}
          </div>
        );
      case EnumTransferMaterialStatus.Completed:
        return (
          <div className="text-status status-completed grid-column-nowrap-text">
            {pageData.completed}
          </div>
        );
      case EnumTransferMaterialStatus.Delivering:
        return (
          <div className="text-status status-delivering grid-column-nowrap-text">
            {pageData.delivering}
          </div>
        );
      default:
        return (
          <div className="text-status status-canceled grid-column-nowrap-text">{pageData.canceled}</div>
        );
    }
  };

  const fetchDatableAsync = async (
    pageNumber,
    pageSize,
    keySearch,
    fromWarehouseId,
    toWarehouseId,
    updatedId,
    statusId,
    startDate,
    endDate
  ) => {
    const response =
      await transferMaterialHistoryDataService.getAllTransferMaterialHistoryAsync(
        pageNumber,
        pageSize,
        keySearch,
        fromWarehouseId ?? "",
        toWarehouseId ?? "",
        updatedId ?? "",
        statusId ?? "",
        startDate ?? "",
        endDate ?? ""
      );
    const data = mappingToDataTableTransferMaterialHistory(
      response?.transferMaterialHistories
    );
    setTotalTransferMaterialHistory(response?.totalRecords);
    setCurrentPageNumber(pageNumber);
    setDataSource(data);
  };

  const mappingToDataTableTransferMaterialHistory = (data) => {
    return data?.map((item, index) => {
      return {
        id: item?.id,
        transferMaterialId: item?.transferMaterialId,
        transferId: item?.transferCode,
        createdTime: item?.createdTime,
        fromWarehouseId: item?.fromWarehouseId,
        fromWarehouseName: item?.fromWarehouseName,
        fromWarehouseType: item?.fromWarehouseType,
        toWarehouseId: item?.toWarehouseId,
        toWarehouseName: item?.toWarehouseName,
        toWarehouseType: item?.toWarehouseType,
        quantityMaterial: item?.quantityMaterial,
        lastUpdatedId: item?.lastUpdatedId,
        lastUpdatedName: item?.lastUpdatedName,
        statusId: item?.statusId,
      };
    });
  };

  const onChangePage = async (pageNumber, pageSize) => {
    fetchDatableAsync(
      pageNumber,
      pageSize,
      keySearch,
      dataFilter?.fromWarehouseId,
      dataFilter?.toWarehouseId,
      dataFilter?.updatedId,
      dataFilter?.statusId,
      selectedDate?.startDate,
      selectedDate?.endDate
    );
  };

  const onSearchTransferMaterialHistory = (keySearch) => {
    setKeySearch(keySearch);
    executeAfter(500, async () => {
      await fetchDatableAsync(
        1,
        tableSettings.pageSize,
        keySearch,
        dataFilter?.fromWarehouseId,
        dataFilter?.toWarehouseId,
        dataFilter?.updatedId,
        dataFilter?.statusId,
        selectedDate?.startDate,
        selectedDate?.endDate
      );
    });
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterPopover
          fetchDataTransferMaterialHistory={handleFilter}
          fromWarehouseList={fromWarehouseList}
          toWarehouseList={toWarehouseList}
          updatedByList={updatedByList}
          ref={filterPopoverRef}
        />
      )
    );
  };

  const onClearFilter = async (e) => {
    if (filterPopoverRef && filterPopoverRef.current) {
      filterPopoverRef.current.clear();
    }
    setCountFilter(0);
    await fetchDatableAsync(
      1,
      tableSettings.pageSize,
      keySearch,
      "",
      "",
      "",
      "",
      selectedDate?.startDate,
      selectedDate?.endDate
    );
    setShowPopover(false);
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
    }

    var resPlaceList =
      await transferMaterialHistoryDataService.getAllTransferMaterialPlaceAsync();
    if (resPlaceList) {
      const allFromOption = {
        id: "",
        name: pageData.all,
      };
      const placeIdList = [allFromOption, ...resPlaceList.placeList];
      setFromWarehouseList(placeIdList);
      setToWarehouseList(placeIdList);
    }

    var resUpdatedUserList =
      await transferMaterialHistoryDataService.getAllUpdatedUserTransferMaterial();
    if (resUpdatedUserList) {
      const allUpdatedByOption = {
        id: "",
        name: pageData.all,
      };
      const updatedIdList = [
        allUpdatedByOption,
        ...resUpdatedUserList.updatedIdList,
      ];
      setUpdatedByList(updatedIdList);
    }
  };

  const handleFilter = (data) => {
    setCountFilter(data?.count);
    setDataFilter(data);
    fetchDatableAsync(
      1,
      tableSettings.pageSize,
      keySearch,
      data?.fromWarehouseId,
      data?.toWarehouseId,
      data?.updatedId,
      data?.statusId,
      selectedDate?.startDate,
      selectedDate?.endDate
    );
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    fetchDatableAsync(
      1,
      tableSettings.pageSize,
      keySearch,
      dataFilter?.fromWarehouseId,
      dataFilter?.toWarehouseId,
      dataFilter?.updatedId,
      dataFilter?.statusId,
      date?.startDate,
      date?.endDate
    );
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

  const handleShowModalTransferMaterialHistoryDetail = (transferMaterialHistoryId) => {
    setTransferMaterialHistoryId(transferMaterialHistoryId);
    setShowTransferMaterialHistoryDetailModal(true);
  };

  const handleCancel = () => {
    setShowTransferMaterialHistoryDetailModal(false);
  };

  return (
    <>
      <Form className="form-staff">
        <Row className="row-table-transfer-material-history">
          <FnbTable
            className="mt-4 table-transfer-material-history"
            columns={getColumnsTransferMaterialHistory()}
            pageSize={tableSettings.pageSize}
            dataSource={dataSource}
            currentPageNumber={currentPageNumber}
            total={totalTransferMaterialHistory}
            onChangePage={onChangePage}
            search={{
              placeholder: pageData.searchPlaceholder,
              onChange: onSearchTransferMaterialHistory,
            }}
            filter={{
              onClickFilterButton: onClickFilterButton,
              totalFilterSelected: countFilter,
              onClearFilter: onClearFilter,
              buttonTitle: pageData.filter,
              component: filterComponent(),
            }}
            calendarComponent={{
              onSelectedDatePicker: onSelectedDatePicker,
              selectedDate: selectedDate,
              onConditionCompare: onConditionCompare,
            }}
            footerMessage={pageData.showingRecordMessage}
            rowKey={"id"}
          />
        </Row>
      </Form>
      <ModalTransferMaterialHistoryDetail
        showTransferMaterialHistoryDetailModal={
          showTransferMaterialHistoryDetailModal
        }
        transferMaterialHistoryId={transferMaterialHistoryId}
        handleCancel={handleCancel}
      />
    </>
  );
}
