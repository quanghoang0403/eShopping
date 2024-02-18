import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { BadgeReservationStatus } from "./components/badge/BadgeReservationStatus";
import PageTitle from "components/page-title";
import { DateFormat } from "constants/string.constants";
import reserveTableDataService from 'data-services/reserveTable/reserve-table-data.service';
import { useParams } from "react-router-dom";
import { enumReservation } from "../../../../constants/reservation-status.constrants";
import { Id } from "../management/styled";
import { useHistory } from "react-router";
import { formatDate } from "utils/helpers";
import {
  ArrowLeftReservationDetail,
} from "constants/icons.constants";
import { Button } from 'antd';
import { TRANSACTION_TABPANE_KEY } from "../../../../constants/report.constants";

export default function ReservationDetail(props) {
  const { t } = useTranslation();
  const param = useParams();
  const [data, setData] = useState({});
  const history = useHistory();
  const pageData = {
    reservationDetail: t("reservation.reservationDetail", "Reservation detail"),
    guestInformation: t("reservation.guestInformation", "Guest information"),
    numberOfGuests: t("reservation.numberOfGuests", "Number of Guests"),
    guestArrivalTime: t("reservation.guestArrivalTime", "Guest arrival time"),
    tableInformation: t("reservation.tableInformation", "Table information"),
    assignedTables: t("reservation.assignedTables", "Assigned Table(s)"),
    name: t("reserve.name", "Name"),
    phoneNumber: t("reservation.phone", "Phone Number"),
    email: t("form.email", "Email"),
    note: t("form.note", "Note"),
    branch: t("reservation.branch", "Branch"),
    orderId: t("order.order","Order Id")
  };

  const initData = async () => {
    const { id } = param;
    await reserveTableDataService.getReserveTableAsync(id).then((result) => {
      setData(result)
    })
    ;
  };

  useEffect(() => {
    initData();
  }, []);

  const handleViewOrderDetail = (id) => {
    history.push(`/report/order/detail/${id}`);
  }

  const handleBackButton = () => {
    history.push(`/report/transaction/${TRANSACTION_TABPANE_KEY.RESERVATION}`); 
  }

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col className="mr-3">
          <Button icon={<ArrowLeftReservationDetail />} className="btn-back"  onClick={handleBackButton} />
        </Col>
        <Col className="mr-3">
          <PageTitle content={data?.stringCode} />
        </Col>
        <Col>
          <BadgeReservationStatus status={data?.status} />
        </Col>
      </Row>
      <div className="clearfix"></div>

      <div className="reservation-detail-card">
        <div className="guest-infomation">
          <div className="title-session">
            <span>{pageData.guestInformation}</span>
          </div>
          <Row>
            <Col span={24} sm={12}>
              <Row>
                {(data?.status === enumReservation.Serving ||
                  data?.status === enumReservation.Completed) && (
                    <Col span={24}>
                      <div className="text-container order-id">
                        <p className="text-label">{pageData.orderId}</p>
                        <Id className="text-detail" onClick={() => handleViewOrderDetail(data?.orderId)}>{data?.orderCode || "-"}</Id>
                      </div>
                    </Col>
                  )}

                <Col span={24}>
                  <div className="text-container">
                    <p className="text-label">{pageData.name}</p>
                    <p className="text-detail">{data?.customerName || "-"}</p>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="text-container">
                    <p className="text-label">{pageData.phoneNumber}</p>
                    <p className="text-detail">{data?.customerPhone || "-"}</p>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="text-container">
                    <p className="text-label">{pageData.email}</p>
                    <p className="text-detail">{data?.customerEmail || "-"}</p>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24} sm={12}>
              <Row>
                <Col span={24}>
                  <div className="text-container">
                    <p className="text-label">{pageData.numberOfGuests}</p>
                    <p className="text-detail">{data?.numberOfGuests || "-"}</p>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="text-container">
                    <p className="text-label">{pageData.guestArrivalTime}</p>
                    <p className="text-detail guest-arrival-time">
                      <BadgeReservationStatus
                        colorBackground={"#F7F5FF"}
                        colorText={"#282828"}
                        text={formatDate(data?.guestArrivalTime, DateFormat.HH_MM_dash_DD_MM_YYYY)}
                      />
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      <div className="reservation-detail-card">
        <div className="table-infomation">
          <div className="title-session">
            <span>{pageData.tableInformation}</span>
          </div>
          <Row>
            <Col span={24} sm={12}>
              <Row>
                <Col span={24}>
                  <div className="text-container">
                    <p className="text-label">{pageData.branch}</p>
                    <p className="text-detail">{data?.branchAddress || "-"}</p>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="text-container assign-tables">
                    <p className="text-label">{pageData.assignedTables}</p>
                    {data?.assignedTables?.map((assignTable) => {
                      const assignedTableSplit = assignTable.split("-");
                      const areaAsString = assignedTableSplit[0];
                      const tableAsString = assignedTableSplit[1];
                      return (
                        <>
                          <Row>
                            <Col span={11} sm={8}>
                              <p className="text-detail">{areaAsString}</p>
                            </Col>
                            <Col span={2} sm={2}>
                              <p className="text-detail text-center"> - </p>
                            </Col>
                            <Col span={11} sm={14}>
                              <p className="text-detail">{tableAsString}</p>
                            </Col>
                          </Row>
                        </>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24} sm={12}>
              <Row>
                <Col span={24}>
                  <div className="text-container">
                    <p className="text-label">{pageData.note}</p>
                    <p className="text-detail">{data?.notes || "-"}</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
