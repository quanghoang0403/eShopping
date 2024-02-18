import { ConfigProvider, Table } from "antd";
import { useTranslation } from "react-i18next";
import { formatTextNumber, formatTimeStringToLocal, roundNumber } from "../../../../../../../utils/helpers";
import { CoinIcon } from "../../../../../../assets/icons.constants";
import { DateFormat } from "../../../../../../constants/string.constant";
import "./PointHistoryList.scss";

function PointHistoryList(props) {
  const { pointHistoryList = [], navigateToOrderDetail } = props;
  const [t] = useTranslation();

  const pageData = {
    noScore: t("loyaltyPoint.noScore"),
    point: t("loyaltyPoint.point"),
    time: t("loyaltyPoint.time"),
    totalAmount: t("loyaltyPoint.totalAmount"),
    branchName: t("loyaltyPoint.branchName"),
  };

  const columns = [
    {
      title: "OrderId",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (orderCode, order) => (
        <span className="order-id-theme2" onClick={() => navigateToOrderDetail(order?.orderId)}>
          {orderCode}
        </span>
      ),
    },
    {
      title: pageData.branchName,
      dataIndex: "branchName",
      key: "branchName",
      render: (branchName) => <span className="branch-name-theme2">{branchName}</span>,
    },
    {
      title: "Platform",
      dataIndex: "platformName",
      key: "platformName",
      render: (platformName) => <div className="platform-theme2">{platformName}</div>,
    },
    {
      title: pageData.totalAmount,
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => (
        <span className="total-amount-theme2">{formatTextNumber(roundNumber(totalAmount))}đ</span>
      ),
    },
    {
      title: pageData.time,
      dataIndex: "time",
      key: "time",
      render: (time) => (
        <span className="time-theme2">{formatTimeStringToLocal(time, DateFormat.HH_MM_DD_MM_YYYY_)}</span>
      ),
    },

    {
      title: pageData.point,
      dataIndex: "change",
      key: "change",
      render: (change, record) =>
        !!record?.isEarning ? (
          <span className="point-theme2-positive">+{formatTextNumber(change)}pt</span>
        ) : (
          <span className="point-theme2-minus">-{formatTextNumber(change)}pt</span>
        ),
    },
  ];

  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <CoinIcon />
      <p>{pageData.noScore}</p>
    </div>
  );

  return (
    <ConfigProvider renderEmpty={pointHistoryList?.length < 1 ? customizeRenderEmpty : undefined}>
      <Table
        dataSource={pointHistoryList}
        columns={columns}
        pagination={{ defaultPageSize: 20 }}
        className="table-customize-loyalty-point-theme2"
        scroll={{ x: "fit-content" }}
      />
    </ConfigProvider>
  );
}

export default PointHistoryList;
