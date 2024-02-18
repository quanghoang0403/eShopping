import { Col, Row, Table } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { formatTextNumber, formatTimeStringToLocal, roundNumber } from "../../../../../../../utils/helpers";
import "./PointHistoryList.scss";
import { DateFormat } from "../../../../../../constants/string.constants";


function PointHistoryList(props) {
  const { pointHistoryList = [] } = props;
  const isMobileDevice = useMediaQuery({ maxWidth: 576 });

  const [t] = useTranslation();
  const translateData = {
    order: t("loyaltyPoint.order"),
    pt: t("loyaltyPoint.pt"),
  };

  const getPlatform = (platform) => {
    if (platform?.toLowerCase()?.includes("pos")) return "pos";
    if (platform?.toLowerCase()?.includes("app")) return "app";
    return "web";
  };

  const columns = [
    {
      title: "OrderId",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (orderCode, order) => (
        <Link to={`/my-profile/2/${order?.orderId}`}>
          <span className="order-id-theme1">{orderCode}</span>
        </Link>
      ),
    },
    {
      title: "BranchName",
      dataIndex: "branchName",
      key: "branchName",
      render: (branchName) => (
        <span className="branch-name-theme1">{branchName}</span>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => (
        <span className="total-amount-theme1">
          {formatTextNumber(roundNumber(totalAmount))}đ
        </span>
      ),
    },
    {
      title: "Point",
      dataIndex: "change",
      key: "change",
      render: (point, record) =>
        !!record?.isEarning ? (
          <span className="point-theme1-positive">
            +{formatTextNumber(point)}
            {translateData.pt}
          </span>
        ) : (
          <span className="point-theme1-minus">
            -{formatTextNumber(point)}
            {translateData.pt}
          </span>
        ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => <span className="time-theme1">{formatTimeStringToLocal(time, DateFormat.HH_MM_DD_MM_YYYY_)}</span>,
    },
    {
      title: "Platform",
      dataIndex: "platformName",
      key: "platformName",
      render: (platform) => (
        <div
          className={`platform-${getPlatform(platform)}-theme1 platform-theme1`}
        >
          {getPlatform(platform)}
        </div>
      ),
    },
  ];

  return (
    <>
      {isMobileDevice ? (
        <>
          {pointHistoryList?.map((item) => (
            <Row className="customize-loyalty-point-mobile-devices-theme1">
              <Col className="col-name">
                <div className="branch-name">{item?.branchName}</div>
                <div className="order-code">
                  {translateData.order}
                  <Link to={`/my-profile/2/${item?.orderId}`}>
                    <span className="order-code-id" style={{ marginLeft: 8 }}>
                      {item?.orderCode}
                    </span>
                  </Link>
                </div>
                <div className="total-amount">
                  {formatTextNumber(roundNumber(item?.totalAmount))}đ
                </div>
              </Col>
              <Col className="col-point">
                <div className="time">{formatTimeStringToLocal(item?.time, DateFormat.HH_MM_DD_MM_YYYY_)}</div>
                <div className="point-platform">
                  {!!item?.isEarning ? (
                    <>
                      <div className="point-theme1-positive">
                        +{formatTextNumber(item?.change)}pt
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="point-theme1-minus">
                        -{formatTextNumber(item?.change)}pt
                      </div>
                    </>
                  )}
                  <div
                    className={`platform-${getPlatform(
                      item?.platformName
                    )}-theme1 platform-name`}
                  >
                    {getPlatform(item?.platformName)}
                  </div>
                </div>
              </Col>
            </Row>
          ))}
        </>
      ) : (
        <>
          <Table
            dataSource={pointHistoryList}
            columns={columns}
            showHeader={false}
            pagination={{ defaultPageSize: 20 }}
            className="table-customize-loyalty-point-theme1"
          />
        </>
      )}
    </>
  );
}

export default PointHistoryList;
