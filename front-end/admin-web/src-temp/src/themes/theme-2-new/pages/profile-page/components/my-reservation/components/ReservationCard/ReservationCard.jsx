import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { formatDate } from "../../../../../../../utils/helpers";
import { localStorageKeys, removeStorage, setStorage } from "../../../../../../../utils/localStorage.helpers";
import { ReserveTableIcon } from "../../../../../../assets/icons.constants";
import { EnumReservationStatusStoreWeb } from "../../../../../../constants/enum";
import { DateFormat, profileTab } from "../../../../../../constants/string.constant";
import ReservationStatus from "../ReservationStatus/ReservationStatus";
import "./ReservationCard.scss";

const ReservationCard = (props) => {
  const { data, navigateToOrderDetail, navigateToReservationDetail, isLoggedIn } = props;
  const [t] = useTranslation();
  const history = useHistory();
  const translateData = {
    delivery: t("checkOutPage.delivery", "Giao hàng"),
    orderId: t("reservation.orderId", "Mã đơn hàng"),
    branch: t("reservation.branch", "Chi nhánh"),
    numberOfGuest: t("reservation.numberOfGuest", "Số khách"),
    arrivalTime: t("reservation.arrivalTime", "Thời gian đến"),
    reserveTable: t("reservation.reserveTable", "Đặt bàn"),
    cancelReservation: t("reservation.cancelReservation", "Huỷ đặt bàn"),
  };

  const isWaitToConfirmedStatus = data?.status === EnumReservationStatusStoreWeb.WaitToConfirm;
  const isServingOrCompletedStatus =
    data?.status === EnumReservationStatusStoreWeb.Serving || data?.status === EnumReservationStatusStoreWeb.Completed;

  const goToReservationDetail = (id) => {
    navigateToReservationDetail(id);
  };

  function handleClickOrder() {
    if (isLoggedIn) {
      navigateToOrderDetail && navigateToOrderDetail(data?.orderId);
    } else {
      const myAccountState = {
        currentTab: profileTab.myReservation,
        navigate: true,
        orderId: data?.orderId
      };
      removeStorage(localStorageKeys.MY_ACCOUNT_STATE);
      setStorage(localStorageKeys.MY_ACCOUNT_STATE, JSON.stringify(myAccountState));
      history.push("/login");
    }
  };

  return (
    <div className="reservation-card">
      <Row className="reservation-card-header">
        <Col className="reservation-card-header-left">
          <div className="icon">
            <ReserveTableIcon />
          </div>
          <div className="reservation-info">
            <div>
              <span className="my-reservation-delivery-name" onClick={() => goToReservationDetail(data?.id)}>
                {translateData.reserveTable}
              </span>
              <span className="my-reservation-code" onClick={() => goToReservationDetail(data?.id)}>
                #{data?.stringCode}
              </span>
            </div>
            <span className="my-reservation-status">
              <ReservationStatus status={data?.status} />
            </span>
          </div>
        </Col>
      </Row>
      <div className="reservation-card-content">
        <div className="reservation-item-content">
          <Row
            className={`reservation-item-info ${
              isWaitToConfirmedStatus ? "reservation-item-info-wait-to-confirm" : ""
            }`}
          >
            {isServingOrCompletedStatus && (
              <Col span={6} className="reservation-item">
                <Row className="reservation-item-title">{translateData.orderId}</Row>
                <Row className="reservation-item-order-id" onClick={handleClickOrder}>
                  <Link>#{data?.orderCode}</Link>
                </Row>
              </Col>
            )}

            <Col span={isServingOrCompletedStatus ? 6 : 12} className="reservation-item">
              <Row className="reservation-item-title">{translateData.branch}</Row>
              <Row className="text-content text-content-branch">
                <Typography.Text ellipsis={{ rows: 1}}>
                    {data?.storeBranchName}
                </Typography.Text>
              </Row>
            </Col>

            <Col span={6} className={`reservation-item ${isServingOrCompletedStatus ? "reservation-item-number-of-guest" : ""}`}>
              <Row className="reservation-item-title">{translateData.numberOfGuest}</Row>
              <Row className="text-content">{data?.numberOfSeats}</Row>
            </Col>

            <Col span={6} className="reservation-item reservation-item-arrival-time">
              <Row className="reservation-item-title">{translateData.arrivalTime}</Row>
              <Row className="arrival-time">{formatDate(data?.arrivalTime, DateFormat.HH_MM_DD_MM_YYYY_)}</Row>
            </Col>
          </Row>
        </div>

        {isWaitToConfirmedStatus && (
          <div className="reservation-button-cancel">
            <button>{translateData.cancelReservation}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
