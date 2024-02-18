import { StopOutlined } from "@ant-design/icons";
import { message, Row, Tooltip } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { tableSettings } from "constants/default.constants";
import { StopFill } from "constants/icons.constants";
import {
  NotificationCampaignEvent,
  NotificationCampaignSendingType,
  NotificationCampaignStatus,
} from "constants/notification-campaign.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import notificationCampaignDataService from "data-services/notification-campaign/notification-campaign.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { convertUtcToLocalTime, executeAfter, hasPermission, stringDate } from "utils/helpers";
import { FilterPopover } from "./filter-popover.component";
import "./table-notification-campaign.component.styles.scss"

export default function TableNotificationCampaign(props) {
  const [t] = useTranslation();
  const MAX_LENGTH_SEARCH = 100;
  const history = useHistory();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [showPopover, setShowPopover] = useState(true);
  const [keySearch, setKeySearch] = useState("");
  const [dataFilter, setDataFilter] = useState({});
  const [selectedDate, setSelectedDate] = useState({
    startDate: stringDate("en-US"),
    endDate: stringDate("en-US"),
  });

  const pageData = {
    no: t("table.no", "No"),
    campaignName: t("marketing.notificationCampaign.campaignName", "Campaign Name"),
    time: t("promotion.table.time", "Time"),
    status: t("promotion.table.status", "Status"),
    action: t("promotion.table.action", "Action"),
    search: t("marketing.notificationCampaign.search"),
    type: t("marketing.notificationCampaign.type"),
    notificationCampaignInstallEvent: t("marketing.notificationCampaign.notificationCampaignInstallEvent"),
    scheduled: t("marketing.notificationCampaign.status.scheduled"),
    active: t("marketing.notificationCampaign.status.active"),
    finished: t("marketing.notificationCampaign.status.finished"),
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
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    button: {
      addNew: t("button.addNew"),
      filter: t("button.filter"),
      btnDelete: t("button.delete"),
      btnIgnore: t("button.ignore"),
      btnStop: t("button.stop"),
      btnConfirm: t("button.confirm"),
    },
    stop: t("button.stop"),
    deleteNotificationCampaignMessage: t("marketing.notificationCampaign.deleteNotificationCampaignMessage"),
    confirmStopNotificationCampaign: t("marketing.notificationCampaign.confirmStopNotificationCampaign"),
    deleteNotificationCampaignSuccess: t("marketing.notificationCampaign.deleteNotificationCampaignSuccess"),
    deleteNotificationCampaignFail: t("marketing.notificationCampaign.deleteNotificationCampaignFail"),
    stopNotificationCampaignSuccess: t("marketing.notificationCampaign.stopNotificationCampaignSuccess"),
    stopNotificationCampaignFail: t("marketing.notificationCampaign.stopNotificationCampaignFail"),
  };

  const filterPopoverRef = React.useRef();
  const [countFilter, setCountFilter] = useState(0);
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.yesterday);

  const getColumns = () => {
    const columns = [
      {
        title: pageData.no.toUpperCase(),
        dataIndex: "no",
        key: "no",
        align: "left",
        width: "5%",
      },
      {
        title: pageData.campaignName.toUpperCase(),
        dataIndex: "campaignName",
        key: "campaignName",
        align: "left",
        width: "35%",
        render: (_, record) => {
          return (
            <div className="text-line-clamp-2">
              <Tooltip title={record?.campaignName}>
                <Link to={`/marketing/notification-campaign/view/${record?.id}`}>{record.campaignName}</Link>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: pageData.type.toUpperCase(),
        dataIndex: "type",
        key: "type",
        align: "left",
        width: "15%",
        render: (_, record) => {
          switch (record?.type) {
            case NotificationCampaignSendingType.SendByEvent:
              return <div>{t("marketing.notificationCampaign.types.sendByEvent")}</div>;
            case NotificationCampaignSendingType.SendBySpecificTime:
              return <div>{t("marketing.notificationCampaign.types.sendBySpecificTime")}</div>;
            default:
              return <div>{t("marketing.notificationCampaign.types.sendNow")}</div>;
          }
        },
      },
      {
        title: pageData.time.toUpperCase(),
        dataIndex: "sendingTime",
        key: "sendingTime",
        className: "grid-time-column",
        width: "20%",
        render: (_, record) => {
          switch (record?.type) {
            case NotificationCampaignSendingType.SendByEvent:
              if (record?.event == NotificationCampaignEvent.InstallTheAppEvent) {
                return "-";
              } else {
                return "";
              }
            case NotificationCampaignSendingType.SendBySpecificTime:
              return (
                <div>
                  {convertUtcToLocalTime(record?.specificTime).format(DateFormat.DD_MM_YYYY)} {" "}
                  <span>{convertUtcToLocalTime(record?.specificTime).format(DateFormat.HH_MM)}</span>
                </div>
              );
            default:
              return <div> - </div>;
          }
        },
      },
      {
        title: pageData.status.toUpperCase(),
        dataIndex: "status",
        key: "status",
        className: "grid-status-column",
        width: "15%",
        render: (_, record) => {
          switch (record?.statusId) {
            case NotificationCampaignStatus.Scheduled:
              return <div className="status-scheduled">{pageData.scheduled}</div>;
            case NotificationCampaignStatus.Active:
              return <div className="status-active">{pageData.active}</div>;
            default:
              return <div className="status-finished">{pageData.finished}</div>;
          }
        },
      },
    ];
    if (
      hasPermission(PermissionKeys.EDIT_NOTIFICATION_CAMPAIGN) ||
      hasPermission(PermissionKeys.DELETE_NOTIFICATION_CAMPAIGN)
    ) {
      const actionColumn = {
        title: pageData.action,
        dataIndex: "action",
        width: "95px",
        align: "center",
        render: (_, record) => {
          if (record?.statusId === NotificationCampaignStatus.Finished) {
            return <></>;
          }
          return (
            <div className="action-column">
              {hasPermission(PermissionKeys.EDIT_NOTIFICATION_CAMPAIGN) &&
                (record?.statusId === NotificationCampaignStatus.Scheduled ||
                  record?.sendingTypeId === NotificationCampaignSendingType.SendByEvent) && (
                  <a>
                    <EditButtonComponent
                      className="action-button-space"
                      onClick={() => onEditItem(record?.id)}
                      permission={PermissionKeys.EDIT_NOTIFICATION_CAMPAIGN}
                    />
                  </a>
                )}

              {hasPermission(PermissionKeys.DELETE_NOTIFICATION_CAMPAIGN) &&
                record?.statusId === NotificationCampaignStatus.Scheduled && (
                  <DeleteConfirmComponent
                    className={'delete-notification-confirm'}
                    title={pageData.confirmDelete}
                    content={t(pageData.deleteNotificationCampaignMessage, { name: record?.campaignName })}
                    okText={pageData.button.btnConfirm}
                    cancelText={pageData.button.btnIgnore}
                    permission={PermissionKeys.DELETE_NOTIFICATION_CAMPAIGN}
                    onOk={() => onDeleteNotificationCampaign(record?.id)}
                  />
                )}

              {hasPermission(PermissionKeys.STOP_NOTIFICATION_CAMPAIGN) &&
                record?.statusId === NotificationCampaignStatus.Active && (
                  <DeleteConfirmComponent
                    icon={<StopOutlined />}
                    buttonIcon={<StopFill className="icon-del" />}
                    title={pageData.confirmStop}
                    content={t(pageData.confirmStopNotificationCampaign, { name: record?.campaignName })}
                    okText={pageData.button.btnStop}
                    cancelText={pageData.button.btnIgnore}
                    permission={PermissionKeys.STOP_FLASH_SALE}
                    onOk={() => onStopNotificationCampaign(record?.id)}
                    tooltipTitle={pageData.stop}
                    okButtonProps={{ style: { backgroundColor: "#FF8C21" } }}
                    cancelButtonProps={{ style: { border: "0px", backgroundColor: "transparent", boxShadow: "none" } }}
                    className={"transparent-title"}
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
    history.push(`/marketing/notification-campaign/edit/${id}`);
  };

  const onChangePage = async (page, pageSize) => {
    await fetchDatableAsync(
      page,
      pageSize,
      keySearch,
      dataFilter?.status,
      selectedDate?.startDate,
      selectedDate?.endDate
    );
  };

  const onSearch = (keySearch) => {
    setKeySearch(keySearch);
    executeAfter(500, async () => {
      await fetchDatableAsync(
        1,
        tableSettings.pageSize,
        keySearch,
        dataFilter?.status,
        selectedDate?.startDate,
        selectedDate?.endDate
      );
    });
  };

  const filterComponent = () => {
    return showPopover && <FilterPopover fetchData={handleFilter} ref={filterPopoverRef} />;
  };

  const onClearFilter = (e) => {
    if (filterPopoverRef && filterPopoverRef.current) {
      filterPopoverRef.current.clear();
    }
    setDataFilter();
    setCountFilter(0);
    setShowPopover(false);
    fetchDatableAsync(1, tableSettings.pageSize, keySearch, "", selectedDate?.startDate, selectedDate?.endDate);
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
    }
  };

  const handleFilter = (data) => {
    setCountFilter(data?.count);
    setDataFilter(data);
    fetchDatableAsync(
      1,
      tableSettings.pageSize,
      keySearch,
      data?.status,
      selectedDate?.startDate,
      selectedDate?.endDate
    );
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    fetchDatableAsync(1, tableSettings.pageSize, keySearch, dataFilter?.status, date?.startDate, date?.endDate);
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

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch, status, startDate, endDate) => {
    const response = await notificationCampaignDataService.getAllNotificationCampaignAsync(
      pageNumber,
      pageSize,
      keySearch,
      status ?? "",
      startDate ?? "",
      endDate ?? ""
    );
    const data = response?.notificationCampaigns.map((s, index) => mappingRecordToColumns(s, index));
    setTotalRecords(response.total);
    setCurrentPageNumber(pageNumber);
    setDataSource(data);
  };

  const mappingRecordToColumns = (item, index) => {
    return {
      id: item?.id,
      event: item?.event,
      campaignName: item?.name,
      type: item?.sendingTypeId,
      sendingTypeId: item?.sendingTypeId,
      statusId: item?.statusId,
      specificTime: item?.specificTime,
      no: index + 1,
      sendNotificationTime: item?.sendNotificationTime,
    };
  };

  const onDeleteNotificationCampaign = async (id) => {
    let reloadPage = false;
    await notificationCampaignDataService.deleteNotificationCampaignByIdAsync(id).then((res) => {
      if (res) {
        reloadPage = true;
        message.success(pageData.deleteNotificationCampaignSuccess);
      } else {
        message.error(pageData.deleteNotificationCampaignFail);
      }
    });

    if (reloadPage) {
      await fetchDatableAsync(
        1,
        tableSettings.pageSize,
        keySearch,
        dataFilter?.status,
        selectedDate?.startDate,
        selectedDate?.endDate
      );
    }
  };

  const onStopNotificationCampaign = async (id) => {
    let reloadPage = false;
    await notificationCampaignDataService.stopNotificationCampaignByIdAsync(id).then((res) => {
      if (res) {
        reloadPage = true;
        message.success(pageData.stopNotificationCampaignSuccess);
      } else {
        message.error(pageData.stopNotificationCampaignFail);
      }
    });
    if (reloadPage) {
      await fetchDatableAsync(
        1,
        tableSettings.pageSize,
        keySearch,
        dataFilter?.status,
        selectedDate?.startDate,
        selectedDate?.endDate
      );
    }
  };

  return (
    <Row className="form-staff mt-4">
      <FnbTable
        className="mt-4 table-striped-rows qr-code-table"
        columns={getColumns()}
        pageSize={tableSettings.pageSize}
        dataSource={dataSource}
        currentPageNumber={currentPageNumber}
        total={totalRecords}
        onChangePage={onChangePage}
        editPermission={PermissionKeys.EDIT_NOTIFICATION_CAMPAIGN}
        deletePermission={PermissionKeys.DELETE_NOTIFICATION_CAMPAIGN}
        search={{
          maxLength: MAX_LENGTH_SEARCH,
          placeholder: pageData.search,
          onChange: onSearch,
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
      />
    </Row>
  );
}
