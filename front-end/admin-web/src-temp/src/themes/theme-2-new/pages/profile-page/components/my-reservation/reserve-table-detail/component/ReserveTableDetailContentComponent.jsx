import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { formatDate } from "../../../../../../../utils/helpers";
import { DateFormat } from "../../../../../../constants/string.constant";
import "../ReserveTableDetail.style.scss";

function ReserveTableDetailContent({ reserveTableDetailData }) {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 575px)" });
  const numCol = !isSmallScreen ? 8 : 24;
  const [t] = useTranslation();
  const pageData = {
    name: t("reservation.reserveTableDetail.name", "Name"),
    phone: t("reservation.reserveTableDetail.phone", "Phone"),
    email: t("reservation.reserveTableDetail.email", "Email"),
    numberOfGuests: t("reservation.reserveTableDetail.numberOfGuests", "Number Of Guests"),
    guestArrivalTime: t("reservation.reserveTableDetail.guestArrivalTime", "Guest Arrival Time"),
    createdOrderTime: t("reservation.reserveTableDetail.createdOrderTime", "Created Order Time"),
    branch: t("reservation.reserveTableDetail.branch", "Branch"),
    hotlineBranch: t("reservation.reserveTableDetail.hotlineBranch", "Hotline Branch"),
    assignedTable: t("reservation.reserveTableDetail.assignedTable", "Assigned Table(s)"),
    notes: t("reservation.reserveTableDetail.notes", "Notes"),
    area: t("reservation.reserveTableDetail.area", "Area"),
    table: t("reservation.reserveTableDetail.table", "Table"),
  };

  return (
    <div className="reserve-table-detail-content">
      <Row gutter={[24, 24]}>
        <Col span={numCol} className="name-customer-reserve-table">
          <Row className="title-text-reserve-table-detail-content">{pageData.name}</Row>
          <Row className="name-customer name-text-reserve-table-detail-content">
            {reserveTableDetailData?.customerName}
          </Row>
        </Col>
        <Col span={numCol} className="phone-customer-reserve-table">
          <Row className="title-text-reserve-table-detail-content">{pageData.phone}</Row>
          <Row className="name-text-reserve-table-detail-content">{reserveTableDetailData?.customerPhone}</Row>
        </Col>
        <Col span={numCol} className="email-customer-reserve-table">
          <Row className="title-text-reserve-table-detail-content">{pageData.email}</Row>
          <Row className="name-text-reserve-table-detail-content">
            {Boolean(reserveTableDetailData?.customerEmail) ? reserveTableDetailData?.customerEmail : "-"}
          </Row>
        </Col>
        <Col span={numCol} className="count-customer-reserve-table">
          <Row className="title-text-reserve-table-detail-content">{pageData.numberOfGuests}</Row>
          <Row className="name-text-reserve-table-detail-content">{reserveTableDetailData?.numberOfGuests}</Row>
        </Col>
        <Col span={numCol} className="arrival-time-reserve-table">
          <Row className="title-arrival-time title-text-reserve-table-detail-content">{pageData.guestArrivalTime}</Row>
          <Row className="arrival-time mt">
            {formatDate(reserveTableDetailData?.guestArrivalTime, DateFormat.HH_MM_DD_MM_YYYY_)}
          </Row>
        </Col>
        <Col span={24} className="book-arrival-info">
          <Row className="title-book-arrival-info title-text-reserve-table-detail-content">{pageData.branch}</Row>
          <Row className="branch-book-arrival-info name-text-reserve-table-detail-content mt">
            {reserveTableDetailData?.branchName}
          </Row>
          <Row className="address-book-arrival-info mt">{reserveTableDetailData?.branchAddress}</Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={12}>
              <Row className="title-area title-text-reserve-table-detail-content">{pageData.area}</Row>
            </Col>
            <Col span={12}>
              <Row className="title-area title-text-reserve-table-detail-content">{pageData.table}</Row>
            </Col>
          </Row>
          {reserveTableDetailData?.listAssignedTables?.length > 0 &&
            reserveTableDetailData?.listAssignedTables?.map((item, index) => (
              <Row key={index} className="area-table">
                <Col span={12} className="name-area">
                  {item?.areaName}
                </Col>
                <Col span={12} className="name-area">
                  {item?.tableName}
                </Col>
              </Row>
            ))}
        </Col>

        <Col span={24} className="book-arrival-info">
          <Row className="title-book-arrival-info title-text-reserve-table-detail-content">
            {pageData.hotlineBranch}
          </Row>
          <Row className="branch-book-arrival-info name-text-reserve-table-detail-content mt">
            {reserveTableDetailData?.branchPhone}
          </Row>
        </Col>
        <Col span={24}>
          <Row className="title-note title-text-reserve-table-detail-content">{pageData.notes}</Row>
          <Row className="note name-text-reserve-table-detail-content mt">{reserveTableDetailData?.notes}</Row>
        </Col>
      </Row>
    </div>
  );
}

export default ReserveTableDetailContent;
