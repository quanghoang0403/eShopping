import { StopOutlined } from "@ant-design/icons";
import { Card, Col, message, Row, Tooltip } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import { FnbNotifyDialog } from "components/fnb-notify-dialog/fnb-notify-dialog.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { FlashSaleCalendarIcon, StopFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { PromotionStatus } from "constants/promotion.constants";
import { DateFormat } from "constants/string.constants";
import branchDataService from "data-services/branch/branch-data.service";
import flashSaleDataService from "data-services/flash-sale/flash-sale-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { executeAfter, formatDate, hasPermission } from "utils/helpers";
import FilterFlashSale from "./filter-flash-sale.component";

export default function FlashSaleManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();

  const pageData = {
    title: t("promotion.flashSale.title"),
    search: t("promotion.search"),
    linkAddNew: "/store/flashSale/create-new",
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    button: {
      ok: t("button.ok"),
      addNew: t("button.addNew"),
      filter: t("button.filter"),
      btnDelete: t("button.delete"),
      btnIgnore: t("button.ignore"),
      btnStop: t("button.stop"),
    },
    amount: t("promotion.form.amount"),
    maximum: t("promotion.form.maximum"),
    start: t("promotion.form.start"),
    end: t("promotion.form.end"),
    stop: t("button.stop"),
    guideline: {
      title: t("promotion.flashSale.guideline.title"),
      content: t("promotion.flashSale.guideline.content"),
    },
    searchPlaceHolder: t("promotion.flashSale.searchPlaceHolder"),
    newCampaign: t("promotion.flashSale.newCampaign"),
    deleteFlashSaleMessage: t("promotion.flashSale.deleteFlashSaleMessage"),
    deleteFlashSaleSuccess: t("promotion.flashSale.deleteFlashSaleSuccess"),
    deleteFlashSaleFail: t("promotion.flashSale.deleteFlashSaleFail"),
    confirmStopFlashSale: t("promotion.flashSale.confirmStopFlashSale"),
    stopFlashSaleSuccess: t("promotion.flashSale.stopFlashSaleSuccess"),
    stopFlashSaleFail: t("promotion.flashSale.stopFlashSaleFail"),
    btnFilter: t("button.filter"),
    table: {
      searchPlaceholder: t("inventoryHistory.searchPlaceHolder"),
      no: t("promotion.table.no"),
      name: t("table.name"),
      time: t("promotion.table.time"),
      product: t("promotion.form.product"),
      status: t("promotion.table.status"),
      action: t("promotion.table.action"),
    },
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
    flashSale: {
      messCreatePermission: t("promotion.flashSale.warningPermission.messCreatePermission"),
    },
    form: {
      notificationTitle: t("form.notificationTitle"),
    },
  };

  const MAX_LENGTH_SEARCH = 100;

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [showPopover, setShowPopover] = useState(true);
  const [countFilter, setCountFilter] = useState(0);
  const [dataFilter, setDataFilter] = useState({});
  const [keySearchFilter, setKeySearchFilter] = useState("");
  const filterPopoverRef = React.useRef();
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.yesterday);
  const clearFilterFunc = React.useRef(null);
  const [branches, setBranches] = useState([]);
  const [isModalNotificationVisible, setIsModalNotificationVisible] = useState(false);

  const getColumns = () => {
    const columns = [
      {
        title: pageData.table.no,
        dataIndex: "no",
        align: "left",
        width: "10%",
      },
      {
        title: pageData.table.name,
        dataIndex: "name",
        className: "table-flash-sale-name-overflow",
        render: (_, record) => {
          return (
            <div className="text-line-clamp-2">
              <Tooltip title={record.name}>
                <Link to={`/store/flashSale/view/${record?.id}`}>{record.name}</Link>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: pageData.table.time,
        dataIndex: "date",
        className: "table-flash-sale-text-time",
        render: (_, record) => {
          return (
            <>
              <Row className="flash-sale-list-date">
                <Col span={6}>
                  <FlashSaleCalendarIcon />
                </Col>
                <Col span={18}>
                  {/* <FlashSaleCalendarIcon /> */}
                  <span>{formatDate(record?.date, DateFormat.DD_MM_YYYY)}</span>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col span={12}>
                  <span className="flash-sale-list-date-title">{pageData.start}:</span>
                </Col>
                <Col span={12}>
                  <span className="flash-sale-list-date-value">{formatDate(record?.startTime, DateFormat.HH_MM)}</span>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col span={12}>
                  <span className="flash-sale-list-date-title">{pageData.end}:</span>
                </Col>
                <Col span={12}>
                  <span className="flash-sale-list-date-value">{formatDate(record?.endTime, DateFormat.HH_MM)}</span>
                </Col>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.table.product,
        dataIndex: "productQuantity",
        width: "20%",
        align: "center",
      },
      {
        title: pageData.table.status,
        dataIndex: "status",
        className: "grid-status-column",
        width: "183px",
        render: (_, record) => {
          switch (record?.statusId) {
            case PromotionStatus.Schedule:
              return <div className="status-scheduled">{t("promotion.status.scheduled")}</div>;
            case PromotionStatus.Active:
              return (
                <div className="status-active">
                  <p className="text-status-active">{t("promotion.status.active")}</p>
                </div>
              );
            default:
              return (
                <div className="status-finished">
                  <p className="text-status-finished">{t("promotion.status.finished")}</p>
                </div>
              );
          }
        },
      },
    ];
    if (
      hasPermission(PermissionKeys.EDIT_FLASH_SALE) ||
      hasPermission(PermissionKeys.DELETE_FLASH_SALE) ||
      hasPermission(PermissionKeys.STOP_FLASH_SALE)
    ) {
      const actionColumn = {
        title: pageData.table.action,
        dataIndex: "action",
        width: "95px",
        align: "center",
        render: (_, record) => {
          if (record.isStopped) {
            return <></>;
          }
          return (
            <div className="action-column">
              {hasPermission(PermissionKeys.EDIT_FLASH_SALE) && record.statusId === PromotionStatus.Schedule && (
                <a>
                  <EditButtonComponent
                    className="action-button-space"
                    onClick={() => onEditItem(record?.id)}
                    permission={PermissionKeys.EDIT_FLASH_SALE}
                  />
                </a>
              )}

              {hasPermission(PermissionKeys.DELETE_FLASH_SALE) && record.statusId === PromotionStatus.Schedule && (
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={formatDeleteMessage(record?.name)}
                  okText={pageData.button.btnDelete}
                  cancelText={pageData.button.btnIgnore}
                  permission={PermissionKeys.DELETE_FLASH_SALE}
                  onOk={() => onDeleteFlashSale(record?.id)}
                />
              )}

              {hasPermission(PermissionKeys.STOP_FLASH_SALE) && record.statusId === PromotionStatus.Active && (
                <DeleteConfirmComponent
                  icon={<StopOutlined />}
                  buttonIcon={<StopFill className="icon-del" />}
                  title={pageData.confirmStop}
                  content={t(pageData.confirmStopFlashSale, {
                    name: record?.name,
                  })}
                  okText={pageData.button.btnStop}
                  cancelText={pageData.button.btnIgnore}
                  permission={PermissionKeys.STOP_FLASH_SALE}
                  onOk={() => onStopFlashSale(record?.id)}
                  tooltipTitle={pageData.stop}
                />
              )}
            </div>
          );
        },
      };
      columns.push(actionColumn);
    }

    return columns;
  };
  const tableSettings = {
    pageSize: 20,

    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize, keySearchFilter, dataFilter);
    },
    onSearch: async (keySearch) => {
      setKeySearchFilter(keySearch);
      executeAfter(500, async () => {
        await fetchDatableAsync(1, tableSettings.pageSize, keySearch, dataFilter);
      });
    },
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch, dataFilter) => {
    var checkStartDate = moment(dataFilter?.startDate, "YYYY-MM-DD").isValid();
    var checkEndDate = moment(dataFilter?.endDate, "YYYY-MM-DD").isValid();
    var timeZone = new Date().getTimezoneOffset() / 60;
    const response = await flashSaleDataService.getFlashSalesAsync(
      pageNumber,
      pageSize,
      keySearch,
      dataFilter?.branchId ?? "",
      dataFilter?.statusId ?? "",
      checkStartDate ? moment.utc(dataFilter?.startDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2) : "",
      checkEndDate ? moment.utc(dataFilter?.endDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2) : "",
      dataFilter?.includeTopping ?? "",
      dataFilter?.minMinimumPurchaseOnBill ?? "",
      dataFilter?.maxMinimumPurchaseOnBill ?? "",
      timeZone,
    );
    const data = response?.flashSales.map((s) => mappingRecordToColumns(s));
    setTotalRecords(response.total);
    setCurrentPageNumber(pageNumber);
    setDataSource(data);
    setCountFilter(dataFilter?.count);
  };

  const mappingRecordToColumns = (item) => {
    return {
      id: item?.id,
      no: item?.no,
      name: item?.name,
      productQuantity: item?.productQuantity,
      startTime: item?.startTime,
      endTime: item?.endTime,
      date: item?.date,
      statusId: item?.statusId,
    };
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterFlashSale
          fetchDataFlashSale={fetchDatableAsync}
          branches={branches}
          tableFuncs={clearFilterFunc}
          pageSize={tableSettings.pageSize}
          keySearch={keySearchFilter}
          setDataFilter={setDataFilter}
        />
      )
    );
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
    }
    var resBranch = await branchDataService.getAllBranchsAsync();
    if (resBranch) {
      const allBranchOption = {
        id: "",
        name: t("productManagement.filter.branch.all"),
      };
      const branchOptions = [allBranchOption, ...resBranch.branchs];
      setBranches(branchOptions);
    }
  };

  const onClearFilter = (e) => {
    if (clearFilterFunc.current) {
      clearFilterFunc.current();
      setShowPopover(false);
    } else {
      setCountFilter(0);
      setShowPopover(false);
      setDataFilter(null);
    }
  };

  const onEditItem = (id) => {
    history.push(`/store/flashSale/edit/${id}`);
  };

  const formatDeleteMessage = (name) => {
    let mess = t(pageData.deleteFlashSaleMessage, { name: name });
    return mess;
  };

  const onDeleteFlashSale = async (id) => {
    await flashSaleDataService.deleteFlashSaleByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.deleteFlashSaleSuccess);
      } else {
        message.error(pageData.deleteFlashSaleFail);
      }
      fetchDatableAsync(1, tableSettings.pageSize, keySearchFilter, dataFilter);
    });
  };

  const onStopFlashSale = async (id) => {
    await flashSaleDataService.stopFlashSaleByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.stopFlashSaleSuccess);
      } else {
        message.error(pageData.stopFlashSaleFail);
      }
      fetchDatableAsync(1, tableSettings.pageSize, keySearchFilter, dataFilter);
    });
  };

  const newFlashSale = () => {
    if (hasPermission(PermissionKeys.CREATE_FLASH_SALE)) {
      history.push(pageData.linkAddNew);
    } else {
      setIsModalNotificationVisible(true);
    }
  };

  return (
    <>
      <Row className="fnb-row-page-header fnb-row-page-header-flash-sale">
        <Col span={12} className="fnb-col fnb-text-flash-sale">
          <PageTitle className="promotion-guideline-page-title" content={pageData.title} />
          <FnbGuideline placement="rightTop" title={pageData.guideline.title} content={pageData.guideline.content} />
        </Col>
        <Col span={12} className="fnb-col">
          <FnbAddNewButton className="float-right" onClick={newFlashSale} text={pageData.newCampaign} />
        </Col>
      </Row>
      <Row className="fnb-flash-sale-filter">
        <Card className="w-100 fnb-card-full">
          <FnbTable
            className="mt-4 table-striped-rows"
            dataSource={dataSource}
            columns={getColumns()}
            pageSize={tableSettings.pageSize}
            currentPageNumber={currentPageNumber}
            total={totalRecords}
            onChangePage={tableSettings.onChangePage}
            numberRecordCurrent={numberRecordCurrent}
            search={{
              maxLength: MAX_LENGTH_SEARCH,
              placeholder: pageData.searchPlaceHolder,
              onChange: tableSettings.onSearch,
            }}
            filter={{
              onClickFilterButton: onClickFilterButton,
              totalFilterSelected: countFilter,
              onClearFilter: onClearFilter,
              buttonTitle: pageData.filter,
              component: filterComponent(),
              filterClassName: "filter-discount-code-management",
            }}
          />
        </Card>
      </Row>
      <FnbNotifyDialog
        title={pageData.form.notificationTitle}
        open={isModalNotificationVisible}
        hideCancelButton={true}
        okText={pageData.button.ok}
        onOk={() => {
          setIsModalNotificationVisible(false);
        }}
        onCancel={() => {
          setIsModalNotificationVisible(false);
        }}
        content={() => {
          return <p>{pageData.flashSale.messCreatePermission}</p>;
        }}
      />
    </>
  );
}
