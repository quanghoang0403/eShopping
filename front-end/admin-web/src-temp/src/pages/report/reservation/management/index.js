import { useTranslation } from "react-i18next";
import { Container, ArrivalTime, Branch, Id, Title, Status, Text, WrapperTable } from "./styled";
import moment from "moment";
import { useHistory } from "react-router";
import { formatDate } from "utils/helpers";
import { DateFormat } from "constants/string.constants";
import { ArrivalTimeCalendarOutline } from "constants/icons.constants";
import { ReservationStatus } from "constants/reservation-constant";
import { useRef, useState, useEffect } from "react";
import { FnbTable } from "components/fnb-table/fnb-table";
import { PopoverFilter } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { getReserveTables, reserveTableActions, reserveTableSelector } from "store/modules/reservation/reservation.reducers";
import { Tooltip } from "antd";
import { tableSettings } from "constants/default.constants";

const DEFAULT_PAGE_SIZE = 20;
const KEY_PARAMS = ['branchIds', 'areaIds', 'areaTableIds', 'statusIds']

const ReservationManagement = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { reserveTableParams, reserveTables, reserveTableCurrentPage, reserveTableTotal } = useSelector(reserveTableSelector);
  const [totalFilterSelected, setTotalFilterSelected] = useState(0);
  const popoverRef = useRef()
  const timeOutSearch = useRef(null)
  const timeOutFilter = useRef(null)

  const pageData = {
    mangementList: t("reservation.mangementList"),
    placeholderSearch: t("reservation.placeholderSearch"),
    name: t("reservation.name"),
    phone: t("reservation.phone"),
    branch: t("reservation.branch"),
    guests: t("reservation.guests"),
    arrivalTime: t("reservation.arrivalTime"),
    status: t("reservation.status"),
    waitToConfirm: t("reservation.waitToConfirm"),
    serving: t("reservation.serving"),
    completed: t("reservation.completed"),
    cancelled: t("reservation.cancelled"),
    confirmed: t("reservation.confirmed"),
    filter: t("reservation.filter"),
  };

  useEffect(() => {
    return () => {
      dispatch(reserveTableActions.resetReserveTableParams());
    }
  }, []);

  useEffect(() => {
    dispatch(getReserveTables(reserveTableParams));
  }, [reserveTableParams]);

  const mappingReservationStatus = (statusId) => {
    switch (statusId) {
      case ReservationStatus.WaitToConfirm:
        return pageData.waitToConfirm;
      case ReservationStatus.Serving:
        return pageData.serving;
      case ReservationStatus.Completed:
        return pageData.completed;
      case ReservationStatus.Cancelled:
        return pageData.cancelled;
      case ReservationStatus.Confirmed:
        return pageData.confirmed;
      default:
        return '';
    }
  };

  const onChangePage = (pageNumber, pageSize) => {
    dispatch(reserveTableActions.setReserveTableParams({
      ...reserveTableParams,
      pageNumber,
      pageSize
    }));
  };

  const onSearch = (keysearch) => {
    if (timeOutSearch.current) {
      clearTimeout(timeOutSearch.current);
    }
    timeOutSearch.current = setTimeout(() => {
      handleSearch(keysearch);
    }, 300)
  }

  const handleSearch = (keySearch) => {
    dispatch(reserveTableActions.setReserveTableParams({
      ...reserveTableParams,
      pageNumber: tableSettings.page,
      keySearch
    }));
  }

  const onSelectedDatePicker = ({startDate, endDate}, businessSummaryWidgetFilter) => {
    dispatch(reserveTableActions.setReserveTableParams({
      ...reserveTableParams,
      pageNumber: tableSettings.page,
      startDate,
      endDate,
      businessSummaryWidgetFilter
    }));
  };

  const handleOnChange = (newParams) => {
    const totalSelected = Object.keys(newParams)?.filter(key => KEY_PARAMS?.includes(key) && newParams[key]?.length > 0)?.length;
    setTotalFilterSelected(totalSelected || 0);

    if (timeOutFilter.current) {
      clearTimeout(timeOutFilter.current);
    }
    timeOutFilter.current = setTimeout(() => {
      dispatch(reserveTableActions.setReserveTableParams(newParams));
    }, 500)
  }

  const handleRedirectView = (id) => {
    history.push(`/report/reservation-detail/${id}`);
  };

  const onClickFilterButton = () => { };

  const onClearFilter = () => {
    popoverRef.current.resetFilter();
  };

  const tableConfigs = {
    pageSize: DEFAULT_PAGE_SIZE,
    columns: [
      {
        title: "ID",
        dataIndex: "stringCode",
        width: "9%",
        align: "center",
        sorter: (pre, current) => pre?.stringCode.localeCompare(current?.stringCode),
        render: (value, record) => <Id onClick={() => handleRedirectView(record?.id)}>{value}</Id>,
      },
      {
        title: pageData.name,
        dataIndex: "customerName",
        width: "22%",
        render: (value) => (
          <Tooltip placement="top" title={value} color="#50429B">
            <Text>{value}</Text>
          </Tooltip>
        ),
      },
      {
        title: pageData.phone,
        dataIndex: "customerPhone",
        width: "10%",
        render: (value) => <Text>{value}</Text>,
      },
      {
        title: pageData.branch,
        dataIndex: "storeBranchName",
        width: "26%",
        render: (value) => (
          <Tooltip placement="top" title={value} color="#50429B">
            <Branch>{value}</Branch>
          </Tooltip>
        ),
      },
      {
        title: pageData.guests,
        dataIndex: "numberOfSeats",
        width: "8%",
        sorter: (pre, current) => pre?.numberOfSeats - current?.numberOfSeats,
        render: (value) => <Text>{value}</Text>,
      },
      {
        title: pageData.arrivalTime,
        dataIndex: "arrivalTime",
        width: "13%",
        align: "center",
        sorter: (pre, current) => moment(pre?.arrivalTime).unix() - moment(current?.arrivalTime).unix(),
        render: (value) => (
          <ArrivalTime>
            <span>{formatDate(value, DateFormat.HH_MM)}</span>
            <div>
              <ArrivalTimeCalendarOutline />
              {formatDate(value, DateFormat.DD_MM_YYYY)}
            </div>
          </ArrivalTime>
        ),
      },
      {
        title: pageData.status,
        dataIndex: "status",
        width: "12%",
        render: (value) => <Status statusId={value}>{mappingReservationStatus(value)}</Status>,
      },
    ],
    onSearch,
    onChangePage,
  };

  return (
    <Container>
      <Title>{pageData.mangementList}</Title>
      <WrapperTable>
        <FnbTable
          columns={tableConfigs.columns}
          pageSize={tableConfigs.pageSize}
          dataSource={reserveTables || []}
          currentPageNumber={reserveTableCurrentPage || 1}
          total={reserveTableTotal || 0}
          onChangePage={tableConfigs.onChangePage}
          search={{
            placeholder: pageData.placeholderSearch,
            onChange: tableConfigs.onSearch,
          }}
          calendarComponent={{
            onSelectedDatePicker: onSelectedDatePicker,
            selectedDate: {
              startDate: reserveTableParams?.startDate,
              endDate: reserveTableParams?.endDate
            },
          }}
          filter={{
            buttonTitle: pageData.filter,
            onClickFilterButton: onClickFilterButton,
            onClearFilter: onClearFilter,
            totalFilterSelected: totalFilterSelected,
            component: <PopoverFilter
              ref={popoverRef}
              totalFilterSelected={totalFilterSelected}
              onChange={handleOnChange}
            />,
          }}
        />
      </WrapperTable>
    </Container>
  );
};

export default ReservationManagement;
