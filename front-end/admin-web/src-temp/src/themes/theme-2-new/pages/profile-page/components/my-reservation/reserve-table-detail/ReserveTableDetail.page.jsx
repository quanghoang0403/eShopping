import { useEffect, useState } from "react";
import reserveTableDataService from "../../../../../../data-services/reserve-table-data.service";
import "./ReserveTableDetail.style.scss";
import { ReserveTableDetailStyled } from "./ReserveTableDetailStyled";
import BackReserveTableComponent from "./component/BackReserveTableComponent";
import ReserveTableDetailContentComponent from "./component/ReserveTableDetailContentComponent";
import ReserveTableDetailInfoComponent from "./component/ReserveTableDetailInfoComponent";

function ReserveTableDetailPage(props) {
  const { colorGroup, reservationId, setVisibleReservationDetailPage, navigateToOrderDetail } = props;
  const [reserveTableDetailData, setReserveTableDetailData] = useState();
  useEffect(() => {
    getReserveTableDetailData(reservationId);
  }, [reservationId]);

  const getReserveTableDetailData = async (reserveTableId) => {
    const orderDetailResult = await reserveTableDataService.getReserveTableDetailAsync(reserveTableId);
    setReserveTableDetailData(orderDetailResult?.data);
  };

  return (
    <ReserveTableDetailStyled colorGroup={colorGroup}>
      <div className="reserve-table-detail-container">
        <BackReserveTableComponent setVisibleReservationDetailPage={setVisibleReservationDetailPage} />
        <div className="reserve-table-detail-main">
          <ReserveTableDetailInfoComponent
            reserveTableDetailData={reserveTableDetailData}
            navigateToOrderDetail={navigateToOrderDetail}
          />
          <ReserveTableDetailContentComponent reserveTableDetailData={reserveTableDetailData} />
        </div>
      </div>
    </ReserveTableDetailStyled>
  );
}

export default ReserveTableDetailPage;
