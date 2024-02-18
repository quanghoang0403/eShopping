import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ReservationRightCorner } from "../../../../../../assets/icons.constants";
import { ReserveStatus } from "../../../../../../constants/reserve.constants";
import { profileTabTheme1 } from "../../../../../../constants/string.constants";
import "./card-reservation.style.scss";
import CancelReservationComponent from "../../../../../../components/cancel-reservation/cancel-reservation.component";
import { formatDate } from "../../../../../../../utils/helpers";
import { getColorByStatus, getIconByStatus, getTitleByStatus } from "../../data/UIReservation";
import { OrderTypeSymbol } from "../../../../../../constants/order.constants";
import { getStorage, localStorageKeys } from "../../../../../../../utils/localStorage.helpers";

function CardReservation(props) {
  const { reservation } = props;
  const history = useHistory();
  const [t] = useTranslation();
  const MY_PROFILE = "my-profile";
  const translatedData = {
    cancel: t("reserve.cancel"),
    branch: t("storeBranch.title"),
    numberOfGuests: t("reserve.numberOfGuests"),
    arrivalTime: t("reserve.arrivalTime"),
  };

  const color = getColorByStatus(reservation?.status);
  const StyledCardReservation = styled.div`
    display: ${reservation?.status !== ReserveStatus.WaitToConfirm ? "block" : "flex"};
    .card-reservation-theme1 {
      &__content {
        margin-top: ${reservation?.status !== ReserveStatus.WaitToConfirm ? "28px" : "unset"};
      }
      &__status {
        background: ${color.backgroundColor};
        .status-reservation {
          &__title {
            color: ${color.color};
          }
        }
      }
    }

    @media (max-width: 1280px) and (min-width: 575px) {
      .card-reservation-theme1 {
        &__content {
          margin-top: ${reservation?.status !== ReserveStatus.WaitToConfirm ? "24px" : "unset"};
        }
      }
    }
  `;

  const onClickCardReservation = () => {
    history.push(`/${MY_PROFILE}/${profileTabTheme1.myReservations}/${reservation?.id}`);
  };

  const onClickOrder = (event) => {
    event.stopPropagation();
    const isLogin = getStorage(localStorageKeys.LOGIN);
    if (isLogin) {
      history.push(`/${MY_PROFILE}/${profileTabTheme1.orders}/${reservation?.orderId}`);
    } else {
      history.push({
        pathname: "/login",
        state: { redirectToAfterLogin: `/${MY_PROFILE}/${profileTabTheme1.orders}/${reservation?.orderId}` },
      });
    }
  };

  return (
    <StyledCardReservation
      className={`card-reservation-theme1 ${
        reservation?.status === ReserveStatus.WaitToConfirm ? "card-reservation-theme1--wait-to-confirm" : ""
      }`}
      onClick={() => onClickCardReservation()}
    >
      <div className="card-reservation-theme1__status">
        <div className="status-reservation__id">
          {getIconByStatus(reservation?.status)}
          <span>{reservation?.stringCode}</span>
        </div>
        <div className="status-reservation__title">{t(getTitleByStatus(reservation?.status))}</div>
      </div>

      {(reservation?.status === ReserveStatus.Serving || reservation?.status === ReserveStatus.Completed) && (
        <div
          className="reservation-order-id-info"
          onClick={(e) => {
            onClickOrder(e);
          }}
        >
          <span className="reservation-order-id-info__title">{"Order: "}</span>
          <span className="reservation-order-id-info__id">{`${OrderTypeSymbol.INSTORE}${reservation?.orderCode}`}</span>
        </div>
      )}
      <div className="card-reservation-theme1__content">
        {/* Branch */}
        <div className="info-item-reservation">
          <span className="info-item-reservation__title">{`${translatedData.branch}: `}</span>
          <span className="info-item-reservation__value">{reservation.storeBranchName}</span>
        </div>
        {/* Number of Guest */}
        <div className="info-item-reservation">
          <span className="info-item-reservation__title">{`${translatedData.numberOfGuests}: `}</span>
          <span className="info-item-reservation__value">{reservation.numberOfSeats}</span>
        </div>
        {/* Arrival Time */}
        <div className="info-item-reservation">
          <span className="info-item-reservation__title">{`${translatedData.arrivalTime}: `}</span>
          <span className="info-item-reservation__value">
            {formatDate(reservation?.arrivalTime, "HH:mm DD/MM/YYYY")}
          </span>
        </div>
      </div>
      {reservation?.status === ReserveStatus.WaitToConfirm && (
        <CancelReservationComponent reservationId={reservation?.id} isReservationList={true} />
      )}
      <ReservationRightCorner className="card-reservation-theme1__icon-right-corner" />
    </StyledCardReservation>
  );
}

export default CardReservation;
