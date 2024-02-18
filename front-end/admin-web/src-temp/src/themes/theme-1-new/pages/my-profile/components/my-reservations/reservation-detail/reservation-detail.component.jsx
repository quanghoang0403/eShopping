import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import reserveTableService from "../../../../../../data-services/reserve-table-data.service";
import { formatDate } from "../../../../../../utils/helpers";
import { ArrowLeftIcon } from "../../../../../assets/icons.constants";
import { EnumDayOfWeek } from "../../../../../constants/enums";
import { profileTabTheme1 } from "../../../../../constants/string.constants";
import { ReserveStatus } from "../../../../../constants/reserve.constants";
import "./reservation-detail.style.scss";
import ReserveTableDefault from "../../../../../assets/images/reserse-table-default.png";
import { useMediaQuery } from "react-responsive";
import CancelReservationComponent from "../../../../../components/cancel-reservation/cancel-reservation.component";
import moment from "moment";
import { getColorByStatus, getIconByStatus, getTitleByStatus } from "../data/UIReservation";
import { getStorage, localStorageKeys } from "../../../../../../utils/localStorage.helpers";
import { useHistory } from "react-router-dom";

function ReservationDetail(props) {
  const { reservationId } = props;
  const history = useHistory();
  const [reservation, setReservation] = useState(null);
  const [t] = useTranslation();
  const isDesktop = useMediaQuery({ minWidth: 1201 });
  const color = getColorByStatus(reservation?.status);
  const [isLogin, setIsLogin] = useState(false);

  const translatedData = {
    viewReservationDetail: t("reserve.viewReservationDetail"),
    name: t("myProfile.accountInfo.name"),
    phone: t("reserve.phone"),
    email: t("myProfile.accountInfo.email"),
    numberOfGuests: t("reserve.numberOfGuestsDetail"),
    arrivalTime: t("reserve.arrivalTime"),
    guestArrivalTime: t("reserve.guestArrivalTime"),
    branch: t("reserve.branch"),
    branchHotline: t("reserve.branchHotline"),
    assignedTables: t("reserve.assignedTables"),
    notes: t("reserve.notes"),
    cancel: t("reserve.cancelDetail"),
  };

  const MY_PROFILE = "my-profile";
  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    setIsLogin(getStorage(localStorageKeys.LOGIN) ? true : false);
    const getDetailAsync = async () => {
      const resReservation = await reserveTableService.getReserveTableDetailAsync(reservationId);
      if (resReservation) {
        setReservation(resReservation?.data);
      }
    };
    getDetailAsync();
  }, [reservationId]);

  const generateArrivalTime = (arrivalTime) => {
    try {
      const dayOfWeek = EnumDayOfWeek.find((item) => {
        return item.key === moment.utc(arrivalTime).local().day();
      }).name;

      return `${formatDate(arrivalTime, 'HH:mm')}, ${t(dayOfWeek)}, ${formatDate(arrivalTime)}`;
    } catch {
      return "";
    }
  };

  const onClickOrderId = () => {
    if (isLogin) {
      history.push(`/${MY_PROFILE}/${profileTabTheme1.orders}/${reservation?.orderId}`);
    } else {
      history.push({
        pathname: "/login",
        state: { redirectToAfterLogin: `/${MY_PROFILE}/${profileTabTheme1.orders}/${reservation?.orderId}` },
      });
    }
  };

  const StyledReservationDetail = styled.div`
    .reservation-detail-card {
      .reservation-detail-header {
        background: ${color.backgroundColor};
        &__status {
          color: ${color.color};
        }
      }
    }
  `;

  return (
    <StyledReservationDetail className="my-reservation-detail-theme1 reservation-detail">
      <div className="reservation-detail__wrapper-title">
        <Link to={`/${MY_PROFILE}/${profileTabTheme1.myReservations}`}>
          <ArrowLeftIcon />
        </Link>
        <span>{translatedData.viewReservationDetail}</span>
      </div>
      <hr className="reservation-detail__divide-header" />
      {reservation ? (
        <div className="reservation-detail-card">
          <div className="reservation-detail-header">
            <div className="reservation-detail-header__left-container">
              <img
                src={reservation?.thumbnail ? reservation?.thumbnail : ReserveTableDefault}
                className="reservation-detail-header__img"
                alt=""
              />
              <div className="reservation-detail-header__info">
                <div className="reservation-detail-header__reserve-info">
                  {getIconByStatus(reservation?.status)}
                  <span className="reservation-detail-header__reserve-id">{reservation?.stringCode}</span>
                </div>
                {(reservation?.status === ReserveStatus.Serving || reservation?.status === ReserveStatus.Completed) && (
                  <div className="reservation-detail-header__order-info" onClick={() => onClickOrderId()}>
                    <span className="reservation-detail-header__order-title">{`Order: `}</span>
                    <span className="reservation-detail-header__order-id">{reservation?.orderCode} </span>
                  </div>
                )}
              </div>
            </div>
            <span className="reservation-detail-header__status">{t(getTitleByStatus(reservation?.status))}</span>
          </div>
          <div className="reservation-detail-card__contents">
            <div className="reservation-content-item">
              <div className="reservation-content-item-title">{translatedData.name}</div>
              <div className="reservation-content-item-value ">{reservation?.customerName}</div>
            </div>
            <div className="reservation-content-item">
              <div className="reservation-content-item-title">{translatedData.phone}</div>
              <div className="reservation-content-item-value ">{reservation?.customerPhone}</div>
            </div>
            <div className="reservation-content-item">
              <div className="reservation-content-item-title">{translatedData.email}</div>
              <div className="reservation-content-item-value ">
                {reservation?.customerEmail ? reservation?.customerEmail : "-"}
              </div>
            </div>
            <div className="reservation-content-item">
              <div className="reservation-content-item-title">{translatedData.numberOfGuests}</div>
              <div className="reservation-content-item-value ">{reservation?.numberOfGuests} </div>
            </div>
            <div className="reservation-content-item">
              <div className="reservation-content-item-title">{translatedData.guestArrivalTime}</div>
              <div className="reservation-content-item-value reservation-content-item-value--arrival-time">
                {generateArrivalTime(reservation?.guestArrivalTime)}
              </div>
            </div>
            <div className="reservation-content-item">
              <div className="reservation-content-item-title">{translatedData.branch}</div>
              <div className="reservation-content-item-value reservation-content-item-value--branch">
                <span> {reservation?.branchName}</span>
                <span> {reservation?.branchAddress}</span>
              </div>
            </div>
            <div className="reservation-content-item">
              <div className="reservation-content-item-title">{translatedData.branchHotline}</div>
              <div className="reservation-content-item-value reservation-content-item-value--branch-hotline">
                {isDesktop ? (
                  <>{reservation?.branchPhone ? reservation?.branchPhone : "-"}</>
                ) : (
                  <>
                    {reservation?.branchPhone ? (
                      <a href={`tel:${reservation?.branchPhone}`}>{reservation?.branchPhone} </a>
                    ) : (
                      "-"
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="reservation-content-item">
              <div className="reservation-content-item-title">{translatedData.assignedTables}</div>
              <div className="reservation-content-item-value reservation-content-item-value--asigned-tables ">
                {reservation?.listAssignedTables?.length > 0 ? (
                  <span className="item-assign-table">
                    {`${reservation?.listAssignedTables[0]?.areaName} -${reservation?.listAssignedTables?.map(
                      (table) => {
                        return ` ${table?.tableName}`;
                      },
                    )}`}
                  </span>
                ) : (
                  <span className="item-assign-table">-</span>
                )}
              </div>
            </div>
            <div className="reservation-content-item">
              <div className="reservation-content-item-title">{translatedData.notes}</div>
              <div className="reservation-content-item-value ">{reservation?.notes ? reservation?.notes : "-"}</div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {reservation?.status === ReserveStatus.WaitToConfirm && (
        <CancelReservationComponent reservationId={reservation?.id} />
      )}
    </StyledReservationDetail>
  );
}

export default ReservationDetail;
