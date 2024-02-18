import { useTranslation } from "react-i18next";
import { OrderDetailBackIcon } from "../../../../../../assets/icons.constants";
import "../ReserveTableDetail.style.scss";

function HeaderReserveTableComponent({ setVisibleReservationDetailPage }) {
  const [t] = useTranslation();
  const goBackToListReserveTable = () => {
    setVisibleReservationDetailPage(false);
  };
  return (
    <div onClick={() => goBackToListReserveTable()} className="back-component">
      <OrderDetailBackIcon className="back-icon" />
      <span>{t("reservation.myReservation")}</span>
    </div>
  );
}
export default HeaderReserveTableComponent;
