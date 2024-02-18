import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import reserveTableService from "../../../../../../data-services/reserve-table-data.service";
import { ArrowLeftIcon, ReservationNoData, ReservationAdd } from "../../../../../assets/icons.constants";
import { ReserveStatus, STATUS_ALL_RESERVE } from "../../../../../constants/reserve.constants";
import CardReservation from "./components/card-reservation.component";
import TitleFilterStatus from "./components/title-filter-status.component";
import "./list-reservations.style.scss";
import { localStorageKeys, getStorage } from "../../../../../../utils/localStorage.helpers";
import ReservationDetail from "../reservation-detail/reservation-detail.component";
import { Link } from "react-router-dom";
import { storeConfigSelector } from "../../../../../../modules/session/session.reducers";

function ListReservations(props) {
  const { handleClickTitle, colorGroup } = props;
  const isMaxWidth991 = useMediaQuery({ maxWidth: 991 });
  const [t] = useTranslation();
  const DEFAULT_PAGENUMBER = 1,
    DEFAULT_PAGESIZE = 20;

  const [statusSelected, setStatusSelected] = useState(STATUS_ALL_RESERVE);
  const [listReserveTables, setListReserveTables] = useState([]);
  const [totalReserveTables, setTotalReserveTables] = useState(0);
  const [requestDoneTotalStatus, setRequestDoneTotalStatus] = useState(false);
  const [totalAllStatusReserveTables, setTotalAllStatusReserveTables] = useState({
    cancelled: 0,
    waitToConfirm: 0,
    confirmed: 0,
    serving: 0,
    completed: 0,
    all: 0
  });

  const [pagination, setPagination] = useState({
    pageNumber: DEFAULT_PAGENUMBER,
    pageSize: DEFAULT_PAGESIZE,
    status: STATUS_ALL_RESERVE,
  });
  const [requestingLoadmore, setRequestingLoadmore] = useState(false);
  const [requestingInitial, setRequestingInitial] = useState(false);
  // idle, list, detail
  const PAGE_VIEW = {
    IDLE: "idle",
    LIST: "list",
    DETAIL: "detail",
  };
  const [pageView, setPageView] = useState(PAGE_VIEW.IDLE);
  const [reservationId, setReservationId] = useState("");

  const userInfo = useSelector((state) => state?.session?.userInfo);
  const isAllowReserveTable = useSelector(storeConfigSelector)?.isAllowReserveTable;

  const translatedData = {
    all: t("reserve.all"),
    serving: t("reserve.serving"),
    waitToConfirm: t("reserve.waitToConfirm"),
    confirmed: t("reserve.confirmed"),
    completed: t("reserve.completed"),
    cancelled: t("reserve.cancelled"),
    myReservations: t("reserve.myReservations"),
    emptyListNotify: t("reserve.emptyListNotify"),
    reserve: t("reserve.reserve"),
    noDataFound: t("reserve.noDataFound"),
  };

  const checkIsLoggedIn = () => {
    let isLoggedIn = false;
    if (userInfo?.customerId) isLoggedIn = true;
    return isLoggedIn;
  };

  const getListReserveTableCode = (isLoggedIn) => {
    let reserveTableCodes = "";
    if (!isLoggedIn) {
      const lstJsonReserveTableCodes = JSON.parse(getStorage(localStorageKeys.RESERVE));
      if (lstJsonReserveTableCodes?.listReserveTableCodes) {
        reserveTableCodes = lstJsonReserveTableCodes?.listReserveTableCodes?.join();
      }
    }
    return reserveTableCodes;
  }

  const getStoreId = () => {
    return userInfo?.storeId ?? JSON.parse(localStorage.getItem(localStorageKeys.STORE_CONFIG))?.storeId;
  }

  const getTotalStatus = async () => {
    const isLoggedIn = checkIsLoggedIn();
    const storeId = getStoreId();
    const reserveTableCodes = getListReserveTableCode(isLoggedIn);
    const resTotalStatus = await reserveTableService.getTotalStatusReserveTableAsync(
      storeId,
      reserveTableCodes,
      isLoggedIn,
    );
    if (resTotalStatus) {
      setTotalAllStatusReserveTables(resTotalStatus?.data);
    }
    setRequestDoneTotalStatus(true);
  };


  const getListReserveTable = async (pageNumber, pageSize, status, isLoggedIn = true) => {
    const reserveTableCodes = getListReserveTableCode(isLoggedIn);
    const storeId = getStoreId();

    let listStatus = `${status}`;
    if (status === ReserveStatus.Completed) {
      listStatus = `${ReserveStatus.Serving},${ReserveStatus.Completed}`;
    }

    const resReserve = await reserveTableService.getListReserveTableAsync(
      storeId,
      pageNumber,
      pageSize,
      listStatus,
      reserveTableCodes,
      isLoggedIn,
    );
    if (resReserve) return resReserve?.data;
    return [];
  };

  const synchronizeReserveTable = async (isLoggedIn) => {
    try {
      if (isLoggedIn) {
        const lstJsonReserveTableCodes = JSON.parse(getStorage(localStorageKeys.RESERVE));
        if (lstJsonReserveTableCodes?.listReserveTableCodes) {
          const resSynchronize = await reserveTableService.synchronizeReserveTableAsync({
            listReserveTableCodes: lstJsonReserveTableCodes?.listReserveTableCodes,
          });
          return resSynchronize;
        }
      }
    } catch {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (isAllowReserveTable) {
      const paths = window.location.pathname?.split("/");
      const reservationId = paths[3];
      const initilizeList = async () => {
        setRequestingInitial(true);
        const isLoggedIn = checkIsLoggedIn();
        let isSynchronizeSuccess = await synchronizeReserveTable(isLoggedIn);
        if (isSynchronizeSuccess) {
          const resReserve = await getListReserveTable(
            DEFAULT_PAGENUMBER,
            DEFAULT_PAGESIZE,
            STATUS_ALL_RESERVE,
            isLoggedIn,
          );
          setListReserveTables(resReserve?.reserveTables);
          setTotalReserveTables(resReserve?.total);
        }

        setRequestingInitial(false);
      };

      if (reservationId) {
        setPageView(PAGE_VIEW.DETAIL);
        setReservationId(reservationId);
      } else {
        initilizeList();
        getTotalStatus();
        setPageView(PAGE_VIEW.LIST);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeStatus = async (status) => {
    setStatusSelected(status);
    setRequestingInitial(true);
    const newPagination = {
      pageNumber: DEFAULT_PAGENUMBER,
      pageSize: DEFAULT_PAGESIZE,
      status: status,
    };

    const isLoggedIn = checkIsLoggedIn();
    const resReserveTables = await getListReserveTable(
      newPagination.pageNumber,
      newPagination.pageSize,
      newPagination.status,
      isLoggedIn,
    );
    setPagination(newPagination);
    if (resReserveTables) {
      setListReserveTables(resReserveTables?.reserveTables);
      setTotalReserveTables(resReserveTables?.total);
    }

    setRequestingInitial(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOnScrollReserveTables = async () => {
    if (!requestingLoadmore && listReserveTables?.length < totalReserveTables) {
      const listCardReservations = document.getElementsByClassName("card-reservation-theme1");
      if (listCardReservations?.length > 0) {
        const sumView = document.documentElement.scrollTop + window.innerHeight;
        const lastElement = listCardReservations[listCardReservations?.length - 1];
        const lastElementOffsetTop = lastElement.offsetTop;
        const heightLastElement = lastElement.offsetHeight;
        const isScrollToBottom = sumView - heightLastElement - 30 > lastElementOffsetTop;
        if (isScrollToBottom) {
          const newPagination = {
            ...pagination,
            pageNumber: pagination.pageNumber + 1,
          };
          setPagination(newPagination);
          setRequestingLoadmore(true);
          const resReserve = await getListReserveTable(
            newPagination.pageNumber,
            newPagination.pageSize,
            newPagination.status,
          );
          if (resReserve) {
            setListReserveTables([...listReserveTables, ...resReserve?.reserveTables]);
          }
          setRequestingLoadmore(false);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scrollend", handleOnScrollReserveTables, { passive: true });

    return () => {
      window.removeEventListener("scrollend", handleOnScrollReserveTables);
    };
  }, [handleOnScrollReserveTables]);

  const [leftButtonReserve, setLeftButtonReserve] = useState(0);
  const handleChangeSizeBrowser = () => {
    const elementSectionList = document.getElementById("id-list-reservations__section-list-theme1");
    const elementButtonAdd = document.getElementById("id-button-create-reserve");
    if (elementSectionList && elementButtonAdd) {
      const left = elementSectionList.offsetLeft + elementSectionList.offsetWidth - elementButtonAdd.offsetWidth;
      setLeftButtonReserve(left)
    }
  };

  useEffect(() => {
    handleChangeSizeBrowser();
  }, [listReserveTables]);
  useEffect(() => {
    window.addEventListener("resize", handleChangeSizeBrowser);
    return () => {
      window.removeEventListener("resize", handleChangeSizeBrowser);
    };
  }, []);

  const StyledMyReserveTitle = styled.div`
    .list-reservations {
      &__title {
        color: ${colorGroup?.titleColor};
      }
      @media (max-width: 991px) {
        &__title {
          color: #000;
        }
        &__icon-title {
          display: block;
        }
      }
    }
  `;

  const StyledIconButtonReserve = styled.div`
    display: flex;
    svg {
      path {
        fill: ${colorGroup?.buttonTextColor};
      }
    }
  `;

  const listFilerStatus = [
    {
      title: translatedData.all,
      value: STATUS_ALL_RESERVE,
    },
    {
      title: translatedData.waitToConfirm,
      value: ReserveStatus.WaitToConfirm,
    },
    {
      title: translatedData.confirmed,
      value: ReserveStatus.Confirmed,
    },
    {
      title: translatedData.completed,
      value: ReserveStatus.Completed,
    },
    {
      title: translatedData.cancelled,
      value: ReserveStatus.Cancelled,
    },
  ];

  const onClickTitle = () => {
    if (isMaxWidth991) {
      handleClickTitle();
    }
  };
  return (
    <>
      {isAllowReserveTable ? (
        <>
          {pageView === PAGE_VIEW.LIST ? (
            <div className="my-reservations-theme1">
              <StyledMyReserveTitle onClick={() => onClickTitle()} className="list-reservations__wrapper-title">
                <ArrowLeftIcon className="list-reservations__icon-title" />
                <span className="list-reservations__title">{translatedData.myReservations}</span>
              </StyledMyReserveTitle>
              <hr className="list-reservations__divide-header" />
              <div className="list-reservations__contain-filter-status">
                {requestDoneTotalStatus && (
                  <div className="filter-status-reservation" id="id-filter-status-reservation">
                    {listFilerStatus.map((item) => {
                      return (
                        <TitleFilterStatus
                          onClickStatus={onChangeStatus}
                          statusSelected={statusSelected}
                          title={item.title}
                          value={item.value}
                          totalAllStatus={totalAllStatusReserveTables}
                          requesting={requestingInitial}
                          titleColor={colorGroup?.titleColor}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div id="id-list-reservations__section-list-theme1" className="list-reservations__section-list">
                {listReserveTables?.length > 0 && !requestingInitial ? (
                  <>
                    {listReserveTables?.map((item) => {
                      return (
                        <CardReservation
                          id={item.id}
                          reservation={item}
                          setStatusSelected={setStatusSelected}
                          onChangeStatus={onChangeStatus}
                        />
                      );
                    })}
                  </>
                ) : (
                  <>
                    {requestingInitial ? (
                      <></>
                    ) : (
                      <div className="list-reservations_no-data">
                        {statusSelected === STATUS_ALL_RESERVE ? (
                          <>
                            <ReservationNoData className="list-reservations_no-data__img" />
                            <span className="list-reservations_no-data__title">{translatedData.emptyListNotify}</span>
                          </>
                        ) : (
                          <span className="list-reservations_no-data__title">{translatedData.noDataFound}</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              {!requestingInitial && (
                <div
                  style={
                    leftButtonReserve === 0
                      ? { visibility: "hidden" }
                      : { background: colorGroup?.buttonBackgroundColor, left: `${leftButtonReserve}px` }
                  }
                  id="id-button-create-reserve"
                  className="button-create-reserve"
                >
                  <Link to={"/reserve-table"}>
                    <StyledIconButtonReserve>
                      <ReservationAdd />
                    </StyledIconButtonReserve>
                    <span style={{ color: colorGroup?.buttonTextColor }} className="button-create-reserve__title">
                      {translatedData.reserve}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            pageView === PAGE_VIEW.DETAIL && <ReservationDetail reservationId={reservationId} />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default ListReservations;
