import { Button } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HeaderOrderDetailIcon } from "../../../../../../assets/icons.constants";
import reserveTableDetailIcon from "../../../../../../assets/icons/reserve-table-detail-icon.svg";
import { enumReserveTable } from "../../../../../../constants/enums.js";
import "../ReserveTableDetail.style.scss";

function ReserveTableDetailInfoComponent({ reserveTableDetailData, navigateToOrderDetail }) {
  const [t] = useTranslation();
  const pageData = {
    cancelled: t("reservation.reserveTableStatus.cancelled"),
    waitToConfirm: t("reservation.reserveTableStatus.waitToConfirm"),
    confirmed: t("reservation.reserveTableStatus.confirmed"),
    serving: t("reservation.reserveTableStatus.serving"),
    completed: t("reservation.reserveTableStatus.completed"),
    reserveTable: t("reservation.reserveTableDetail.reserveTable"),
    orderNo: t("reservation.reserveTableDetail.order"),
    cancel: t("reservation.reserveTableDetail.cancel"),
  };
  const getColorStatus = (statusId) => {
    let data = { textStatus: "", colorStatus: "", colorBackground: "" };
    switch (statusId) {
      case enumReserveTable.Cancelled:
        data.colorStatus = "#FC0D1B";
        data.colorBackground = "#FDE7E7";
        data.textStatus = pageData.cancelled;
        break;
      case enumReserveTable.WaitToConfirm:
        data.colorStatus = "#428BC1";
        data.colorBackground = "#E4EFF6";
        data.textStatus = pageData.waitToConfirm;
        break;
      case enumReserveTable.Confirmed:
        data.colorStatus = "#2B2162";
        data.colorBackground = "#DBD6FF";
        data.textStatus = pageData.confirmed;
        break;
      case enumReserveTable.Serving:
        data.colorStatus = "#FF8C21";
        data.colorBackground = "#FFE8D2";
        data.textStatus = pageData.serving;
        break;
      case enumReserveTable.Completed:
        data.colorStatus = "#33B530";
        data.colorBackground = "#E7F9E7";
        data.textStatus = pageData.completed;
        break;
      default:
        break;
    }

    return data;
  };
  const status = useMemo(() => reserveTableDetailData?.status, [reserveTableDetailData]);
  const orderId = useMemo(() => reserveTableDetailData?.orderId, [reserveTableDetailData]);
  const getStatus = getColorStatus(status);

  const cancelReserveTable = (reserveTableId) => {
    // Todo
  };

  return (
    <div className="reserve-table-detail-info">
      <div className="reserve-table-detail-info-left">
        <div className="title-name-reserve-table">
          <div className="reserve-table-detail-icon">
            <img src={reserveTableDetailIcon} alt=""></img>
          </div>
          <div className="title-name">
            <span className="title-reserve-table">{pageData.reserveTable}</span>
            <span className="name-reserve-table">#{reserveTableDetailData?.stringCode}</span>
          </div>
        </div>
        <div className="status-reserve-table">
          <span
            className="title-status"
            style={{
              color: `${getStatus.colorStatus}`,
              background: `${getStatus.colorBackground}`,
            }}
          >
            {getStatus.textStatus}
          </span>
        </div>
        {orderId && (status === enumReserveTable.Serving || status === enumReserveTable.Completed) && (
          <div className="order-reserve-table">
            <span className="title-order-reserve-table">{pageData.orderNo}:</span>
            <span
              className="name-order-reserve-table"
              onClick={() => navigateToOrderDetail && navigateToOrderDetail(orderId)}
            >
              #{reserveTableDetailData?.orderCode}
            </span>
          </div>
        )}
        {status === enumReserveTable.WaitToConfirm && (
          <Button className="btn-cancel-reserve-table" onClick={() => cancelReserveTable()}>
            <span>{pageData.cancel}</span>
          </Button>
        )}
      </div>
      <div className="reserve-table-detail-info-right">
        <HeaderOrderDetailIcon />
      </div>
    </div>
  );
}

export default ReserveTableDetailInfoComponent;
