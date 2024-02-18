import { Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import reserveTableService from "../../../../../data-services/reserve-table-data.service";
import { formatTextNumber, getStoreConfig } from "../../../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../../../utils/localStorage.helpers";
import loadingOrangeGif from "../../../../assets/icons/loading.gif";
import { EnumReservationStatusStoreWeb } from "../../../../constants/enum";
import "./MyReservation.scss";
import { MyReservationStyled } from "./MyReservationStyled";
import ReservationCard from "./components/ReservationCard/ReservationCard";
import ReservationTabs from "./components/ReservationTabs/ReservationTabs";

function MyReservation(props) {
  const [t] = useTranslation();
  const { isCustomize, colorGroup, navigateToOrderDetail, navigateToReservationDetail } = props;

  const translateData = {
    all: t("reservation.all", "All"),
    waitToConfirm: t("reservation.waitToConfirm", "To Confirm"),
    completed: t("reservation.completed", "Completed"),
    cancelled: t("reservation.cancelled", "Cancelled"),
    confirmed: t("reservation.confirmed", "Confirmed"),
    orders: t("order.orders", "Orders"),
    createNewOne: t("reservation.createNewOne", "You don't have any reservations yet. Let's create a new one!"),
    reserveTable: t("reservation.reserveTable", "Reserve table"),
    noDataFound: t("reservation.noDataFound", "noDataFound"),
    reserveTableNow: t("reservation.reserveTableNow", "Reserve table"),
  };

  const tableSettings = {
    page: 1,
    pageSize: 20,
    statusAllReserve: -1,
  };

  const userInfo = useSelector((state) => state?.session?.userInfo);
  const checkIsLoggedIn = () => {
    let isLoggedIn = false;
    if (userInfo?.customerId) isLoggedIn = true;
    return isLoggedIn;
  };

  const getListReserveTable = async (pageNumber, pageSize, status, isLoggedIn = true) => {
    let reserveTableCodes = "";
    const storeConfig = getStoreConfig();
    let storeId = storeConfig?.storeId;

    if (!isLoggedIn) {
      const lstJsonReserveTableCodes = JSON.parse(getStorage(localStorageKeys.RESERVE));
      if (lstJsonReserveTableCodes?.listReserveTableCodes) {
        reserveTableCodes = lstJsonReserveTableCodes?.listReserveTableCodes?.join();
      }
    }

    let listStatus = `${status}`;
    if (status === EnumReservationStatusStoreWeb.Completed) {
      listStatus = `${EnumReservationStatusStoreWeb.Serving},${EnumReservationStatusStoreWeb.Completed}`;
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

  const reservationTabsStatus = [
    {
      key: EnumReservationStatusStoreWeb.All,
      name: translateData.all,
    },
    {
      key: EnumReservationStatusStoreWeb.WaitToConfirm,
      name: translateData.waitToConfirm,
    },
    {
      key: EnumReservationStatusStoreWeb.Confirmed,
      name: translateData.confirmed,
    },
    {
      key: EnumReservationStatusStoreWeb.Completed,
      name: translateData.completed,
    },
    {
      key: EnumReservationStatusStoreWeb.Cancelled,
      name: translateData.cancelled,
    },
  ];

  const keyValueAll = reservationTabsStatus[0].key;
  const nameValueAll = reservationTabsStatus[0].name;
  const loadingFromBottomHeight = 10;
  const [pageNumber, setPageNumber] = useState(1);
  const [currentTab, setCurrentTab] = useState(keyValueAll);
  const [currentTabName, setCurrentTabName] = useState(nameValueAll);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [listReserveTables, setListReserveTables] = useState([]);

  const getMyReservations = async (statusId) => {
    setLoading(true);
    const isLoggedIn = checkIsLoggedIn();
    const reservationStatusId = statusId === keyValueAll ? `${tableSettings.statusAllReserve}` : statusId;
    const isSynchronizeSuccess = await synchronizeReserveTable(isLoggedIn);
    if (isSynchronizeSuccess) {
      const response = await getListReserveTable(
        tableSettings.page,
        tableSettings.pageSize,
        reservationStatusId,
        isLoggedIn,
      );
      setListReserveTables(response?.reserveTables);
      setPageNumber(tableSettings.page + 1);
      setHasMore(response?.reserveTables?.length === tableSettings.pageSize);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isCustomize) {
      setLoading(false);
    } else {
      getMyReservations(tableSettings.statusAllReserve);
    }
  }, []);

  useEffect(() => {
    setCurrentTabName(reservationTabsStatus?.find((tab) => tab.key === currentTab)?.name ?? "");
  }, [currentTab]);

  const handleOnChangeTab = (e) => {
    const element = document.getElementById("my-reservation-list");
    if (!element) return;
    element?.scrollTo(0, 0);
    setPageNumber(tableSettings.page);
    setCurrentTab(e?.target?.value);
    getMyReservations(e?.target?.value);
  };

  // Lazy load
  const loadMoreData = async () => {
    if (!hasMore) {
      return;
    }
    setLoading(true);
    const reservationStatusId = currentTab === keyValueAll ? tableSettings.statusAllReserve : currentTab;
    const isLoggedIn = checkIsLoggedIn();
    const isSynchronizeSuccess = await synchronizeReserveTable(isLoggedIn);
    if (isSynchronizeSuccess) {
      const response = await getListReserveTable(
        pageNumber,
        tableSettings.pageSize,
        reservationStatusId,
        isLoggedIn,
      );
      setListReserveTables([...listReserveTables, ...response?.reserveTables]);
      setPageNumber(preState => preState + 1);
      setHasMore(response?.reserveTables?.length === tableSettings.pageSize);
    }
    setLoading(false);
  };

  useEffect(() => {
    const element = document.getElementById("my-reservation-list");
    if (!element) return;
    const handleScroll = async (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      if (scrollTop + clientHeight >= scrollHeight - loadingFromBottomHeight && !loading) {
        await loadMoreData();
      }
    };
    if (handleScroll && element) {
      element.addEventListener("scroll", handleScroll);
    }

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <MyReservationStyled colorGroup={colorGroup}>
      <div className="my-reservation-theme2">
        <div className="my-reservation-nav">
          <div className="my-reservation-status-list">
            <ReservationTabs
              reservationTabsStatus={reservationTabsStatus}
              currentTab={currentTab}
              onChangeTab={handleOnChangeTab}
            />
          </div>
        </div>

        <Row className="my-reservation-title">
          {listReserveTables?.length > 0 ? (
            <>
              <Col xs={12} className="reservation-status-name">
                {currentTabName}
              </Col>
              <Col xs={12} className="reverse-table-now">
                <Link
                  to="/reserve-table"
                  className="reservation-btn"
                  style={{ backgroundColor: colorGroup?.buttonBackgroundColor, color: colorGroup?.buttonTextColor }}
                >
                  {translateData.reserveTableNow}
                </Link>
              </Col>
            </>
          ) : (
            <Col xs={24} className="reservation-status-name">
              {currentTabName}
            </Col>
          )}
        </Row>
        <div className="my-reservation-list" id="my-reservation-list">
          {listReserveTables?.length > 0 ? (
            <>
              {listReserveTables?.map((reservation) => {
                return (
                  <ReservationCard
                    data={reservation}
                    navigateToOrderDetail={navigateToOrderDetail}
                    navigateToReservationDetail={navigateToReservationDetail}
                    isLoggedIn={checkIsLoggedIn()}
                  />
                );
              })}
              {loading && (
                <div className="loading-reservation">
                  <img src={loadingOrangeGif} alt="loading" />
                </div>
              )}
            </>
          ) : !loading ? (
            <div className="no-reservation">
              <div className="reservation-description">
                <span>
                  {currentTab !== EnumReservationStatusStoreWeb.All
                    ? translateData.noDataFound
                    : translateData.createNewOne}
                </span>
                <Link
                  to="/reserve-table"
                  className="reservation-btn"
                  style={{ backgroundColor: colorGroup?.buttonBackgroundColor, color: colorGroup?.buttonTextColor }}
                >
                  {translateData.reserveTableNow}
                </Link>
              </div>
            </div>
          ) : (
            <div className="loading-reservation">
              <img src={loadingOrangeGif} alt="loading" />
            </div>
          )}
        </div>
      </div>
    </MyReservationStyled>
  );
}

export default MyReservation;
