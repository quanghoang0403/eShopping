import { StopOutlined } from "@ant-design/icons";
import { Card, Col, message, Row, Tooltip } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { StopFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { ListPromotionType, PromotionStatus } from "constants/promotion.constants";
import { DateFormat, Percent } from "constants/string.constants";
import branchDataService from "data-services/branch/branch-data.service";
import discountCodeDataService from "data-services/discount-code/discount-code-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { executeAfter, formatCurrency, formatDate, hasPermission } from "utils/helpers";
import FilterDiscountCode from "./filter-discount-code.component";
import "./list-discount-code.component.scss";

export default function DiscountCodeManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();

  const pageData = {
    title: t("discountCode.titleList"),
    search: t("promotion.search"),
    linkAddNew: "/store/discountCode/create-new",
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    confirmStopDiscountCode: t("discountCode.confirmStopDiscountCode"),
    stopDiscountCodeSuccess: t("discountCode.stopDiscountCodeSuccess"),
    stopDiscountCodeFail: t("discountCode.stopDiscountCodeFail"),
    notificationTitle: t("form.notificationTitle"),
    stop: t("button.stop"),
    btnNewDiscountCodeTitle: t("discountCode.btnNewDiscountCodeTitle"),
    button: {
      addNew: t("button.addNew"),
      filter: t("button.filter"),
      btnDelete: t("button.delete"),
      btnIgnore: t("button.ignore"),
      btnStop: t("button.stop"),
    },
    amount: t("discountCode.form.amount"),
    maximum: t("discountCode.form.maximum"),
    start: t("discountCode.form.start"),
    end: t("discountCode.form.end"),
    table: {
      no: t("discountCode.table.no"),
      name: t("discountCode.table.name"),
      time: t("discountCode.table.time"),
      discount: t("discountCode.table.discount"),
      status: t("discountCode.table.status"),
      action: t("discountCode.table.action"),
    },
    guideline: {
      title: t("discountCode.guideline.title"),
      content: t("discountCode.guideline.content"),
    },
    searchPlaceHolder: t("discountCode.searchPlaceHolder"),
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
    deleteDiscountCodeMessage: t("discountCode.deleteDiscountCodeMessage"),
    deleteDiscountCodeSuccess: t("discountCode.deleteDiscountCodeSuccess"),
    deleteDiscountCodeFail: t("discountCode.deleteDiscountCodeFail"),
  };

  const MAX_LENGTH_SEARCH = 100;
  const tableWidthResponsive = 1536;

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [showPopover, setShowPopover] = useState(true);
  const [countFilter, setCountFilter] = useState(0);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString("en-US"),
    endDate: moment().toDate().toLocaleDateString("en-US"),
  });
  const [dataFilter, setDataFilter] = useState({});
  const [keySearchFilter, setKeySearchFilter] = useState("");
  const filterPopoverRef = React.useRef();
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.yesterday);
  const clearFilterFunc = React.useRef(null);
  const [branches, setBranches] = useState([]);
  const [promotionTypeOptions, setPromotionTypeOptions] = useState([]);

  const getColumns = () => {
    const columns = [
      {
        title: pageData.table.no,
        dataIndex: "no",
        className: "grid-no-column",
        width: "124px",
      },
      {
        title: pageData.table.name,
        dataIndex: "name",
        className: "grid-name-column",
        width: "423px",
        render: (_, record) => {
          return (
            <div className="text-line-clamp-1">
              <Tooltip title={record.name}>
                <Link to={`/store/discountCode/view/${record?.id}`}>{record.name}</Link>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: pageData.table.discount,
        dataIndex: "discount",
        className: "grid-discount-column",
        width: "343px",
        render: (_, record) => {
          return (
            <>
              {record.isPercentDiscount ? (
                <>
                  <Row>
                    <Col span={12}>
                      <p className="discount-text">{pageData.amount}: </p>
                    </Col>
                    <Col span={12}>
                      <p className="discount-percent">{`${record.percentNumber} ${Percent}`}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <p className="discount-max">{pageData.maximum}: </p>
                    </Col>
                    <Col span={12}>
                      <p className="discount-amount">
                        {record?.maximumDiscountAmount ? formatCurrency(record.maximumDiscountAmount) : "-"}
                      </p>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    <Col span={12}>
                      <p className="discount-text">{pageData.amount}: </p>
                    </Col>
                    <Col span={12}>
                      <p className="discount-percent">
                        {record?.maximumDiscountAmount ? formatCurrency(record.maximumDiscountAmount) : "-"}
                      </p>
                    </Col>
                  </Row>
                </>
              )}
            </>
          );
        },
      },
      {
        title: pageData.table.time,
        dataIndex: "time",
        className: "grid-time-column",
        width: "295px",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={6}>
                  <p className="start-text">{pageData.start}: </p>
                </Col>
                <Col span={18}>
                  <p className="start-date">{formatDate(record.startDate, DateFormat.DD_MM_YYYY_HH_MM_NO_COMMA)}</p>
                </Col>
              </Row>
              {record.endDate && (
                <Row>
                  <Col span={6}>
                    <p className="end-text"> {pageData.end}: </p>
                  </Col>
                  <Col span={18}>
                    <p className="end-date">{formatDate(record.endDate, DateFormat.DD_MM_YYYY_HH_MM_NO_COMMA)}</p>
                  </Col>
                </Row>
              )}
            </>
          );
        },
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
              return <div className="status-active">{t("promotion.status.active")}</div>;
            default:
              return <div className="status-finished">{t("promotion.status.finished")}</div>;
          }
        },
      },
    ];

    if (
      hasPermission(PermissionKeys.EDIT_DISCOUNT_CODE) ||
      hasPermission(PermissionKeys.DELETE_DISCOUNT_CODE) ||
      hasPermission(PermissionKeys.STOP_DISCOUNT_CODE)
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
              {hasPermission(PermissionKeys.EDIT_DISCOUNT_CODE) && record.statusId === PromotionStatus.Schedule && (
                <a>
                  <EditButtonComponent
                    className={hasPermission(PermissionKeys.DELETE_DISCOUNT_CODE) && "action-button-space"}
                    onClick={() => onEditItem(record?.id)}
                    permission={PermissionKeys.EDIT_DISCOUNT_CODE}
                  />
                </a>
              )}

              {hasPermission(PermissionKeys.DELETE_DISCOUNT_CODE) && record.statusId === PromotionStatus.Schedule && (
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={formatDeleteMessage(record?.name)}
                  okText={pageData.button.btnDelete}
                  cancelText={pageData.button.btnIgnore}
                  permission={PermissionKeys.DELETE_DISCOUNT_CODE}
                  onOk={() => onDeleteDiscountCode(record?.id)}
                />
              )}

              {hasPermission(PermissionKeys.STOP_DISCOUNT_CODE) && record.statusId === PromotionStatus.Active && (
                <DeleteConfirmComponent
                  icon={<StopOutlined />}
                  buttonIcon={<StopFill className="icon-del icon-svg-hover" />}
                  title={pageData.notificationTitle}
                  content={t(pageData.confirmStopDiscountCode, { name: record?.name })}
                  okText={pageData.button.btnStop}
                  okButtonProps={{ style: { backgroundColor: "#FF8C21", height: "60px", minWidth: "114px" } }}
                  cancelText={pageData.button.btnIgnore}
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
                  onOk={() => onStopDiscountCode(record?.id)}
                  tooltipTitle={pageData.stop}
                  modalContainerStyle="confirm-stop-modal-sizing"
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

  const onEditItem = (id) => {
    history.push(`/store/discountCode/edit/${id}`);
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

    const response = await discountCodeDataService.getDiscountCodeAsync(
      pageNumber,
      pageSize,
      keySearch,
      dataFilter?.branchId ?? "",
      dataFilter?.statusId ?? "",
      dataFilter?.valueType ?? "",
      checkStartDate ? moment.utc(dataFilter?.startDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2) : "",
      checkEndDate ? moment.utc(dataFilter?.endDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2) : "",
      dataFilter?.minMinimumPurchaseOnBill ?? "",
      dataFilter?.maxMinimumPurchaseOnBill ?? "",
      dataFilter?.applicableType ?? "",
      dataFilter?.includeTopping ?? "",
      dataFilter?.platformId ?? "",
      dataFilter?.codeType ?? "",
      timeZone,
    );
    const data = response?.discountCodes.map((s) => mappingRecordToColumns(s));
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
      startDate: item?.startDate,
      endDate: item?.endDate,
      statusId: item?.statusId,
      isStopped: item?.isStopped,
      isPercentDiscount: item?.isPercentDiscount,
      maximumDiscountAmount: item?.maximumDiscountAmount,
      percentNumber: item?.percentNumber,
    };
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterDiscountCode
          fetchDataDiscountCode={fetchDatableAsync}
          branches={branches}
          tableFuncs={clearFilterFunc}
          promotionTypeOptions={promotionTypeOptions}
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

    let allPromotionType = {
      id: "",
      name: t("promotion.allType"),
    };
    let listPromotionType = ListPromotionType?.map((item) => ({
      id: item.key,
      name: t(item.name),
    }));
    let promotionTypeOptions = [allPromotionType, ...listPromotionType];
    setPromotionTypeOptions(promotionTypeOptions);
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

  const formatDeleteMessage = (name) => {
    let mess = t(pageData.deleteDiscountCodeMessage, { name: name });
    return mess;
  };

  const onDeleteDiscountCode = async (id) => {
    await discountCodeDataService.deleteDiscountCodeByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.deleteDiscountCodeSuccess);
      } else {
        message.error(pageData.deleteDiscountCodeFail);
      }
      fetchDatableAsync(1, tableSettings.pageSize, keySearchFilter, dataFilter);
    });
  };

  const onStopDiscountCode = async (id) => {
    await discountCodeDataService.stopDiscountCodeByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.stopDiscountCodeSuccess);
      } else {
        message.error(pageData.stopDiscountCodeFail);
      }
      fetchDatableAsync(1, tableSettings.pageSize, keySearchFilter, dataFilter);
    });
  };

  return (
    <>
      <Row className="list-discount-code fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle className="promotion-guideline-page-title" content={pageData.title} />
          <FnbGuideline placement="rightTop" title={pageData.guideline.title} content={pageData.guideline.content} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <FnbAddNewButton
            className="float-right"
            permission={PermissionKeys.CREATE_DISCOUNT_CODE}
            onClick={() => history.push(pageData.linkAddNew)}
            text={pageData.btnNewDiscountCodeTitle}
          />
        </Col>
      </Row>
      <Row>
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
            scrollX={tableWidthResponsive}
          />
        </Card>
      </Row>
    </>
  );
}
