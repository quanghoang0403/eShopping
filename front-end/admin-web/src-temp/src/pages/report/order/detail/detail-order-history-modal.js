import { Col, Row, Typography } from "antd";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { FlashSaleCalendarIcon } from "constants/icons.constants";
import { DateFormat } from "constants/string.constants";
import orderDataService from "data-services/order/order-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { convertUtcToLocalTime } from "utils/helpers";
import "./detail-order.scss";
import { EnumOrderActionType } from "constants/order-status.constants";
const { Paragraph } = Typography;

export default function OrderDetailHistoryModal(props) {
  const { orderId, isShow, handleCancel } = props;
  const [t] = useTranslation();
  const pageData = {
    no: t("table.no"),
    orderHistory: t("order.orderHistory"),
    time: t("order.time"),
    action: t("order.action"),
    performedBy: t("order.performedBy"),
    itemNote: t("order.itemNote"),
  };

  const [dataSource, setDataSource] = useState([]);
  const isMobileMode = useMediaQuery({ maxWidth: 428 });

  useEffect(() => {
    if (isShow && orderId) {
      loadingList();
    }
  }, [isShow, orderId]);

  const loadingList = async () => {
    var response = await orderDataService.getOrderHistoryByOrderId(orderId);
    if (response) {
      const data = mappingToDataTable(response?.detailList);
      setDataSource(data);
    }
  };

  const mappingToDataTable = (data) => {
    return data?.map((item, index) => {
      return {
        no: index + 1,
        id: item?.id,
        actionName: item?.actionName,
        actionType: item?.actionType,
        createdTime: item?.createdTime,
        orderId: item?.orderId,
        performedBy: item?.performedBy,
        note: item?.note,
      };
    });
  };

  const getColumnsDetail = () => {
    const columns = [
      {
        title: pageData.no,
        dataIndex: "no",
        key: "no",
        width: "9%",
        align: "left",
        render: (_, record) => {
          return <div className="text-content-20">{record?.no}</div>;
        },
      },
      {
        title: pageData.time,
        dataIndex: "createdTime",
        key: "createdTime",
        width: isMobileMode ? "81px" : "17%",
        align: "center",
        render: (_, record) => {
          return (
            <Row className="modal-order-detail-time">
              <Row className="modal-order-detail-time-minute">
                {convertUtcToLocalTime(record?.createdTime).format(DateFormat.HH_MM)}
              </Row>
              <Row className="flash-sale-list-date">
                <Col span={6}>
                  <FlashSaleCalendarIcon />
                </Col>
                <Col span={18}>
                  <span>{convertUtcToLocalTime(record?.createdTime).format(DateFormat.DD_MM_YYYY)}</span>
                </Col>
              </Row>
            </Row>
          );
        },
      },
      {
        title: pageData.action,
        dataIndex: "actionName",
        key: "actionName",
        width: "20%",
        align: "left",
        render: (_, record) => {
          return <div className="text-overflow-content text-content-20">{t(record?.actionName)}</div>;
        },
      },
      {
        title: pageData.performedBy,
        dataIndex: "performedBy",
        key: "performedBy",
        width: "20%",
        align: "left",
        render: (_, record) => {
          return <div className="text-overflow-content text-content-20">{record?.performedBy}</div>;
        },
      },
      {
        title: pageData.itemNote,
        dataIndex: "note",
        key: "note",
        width: "20%",
        align: "left",
        render: (_, record) => {
          return (
            <div className="text-overflow-content text-content-20">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.note }}
                color="#50429B"
              >
                <span>
                  {record?.note
                    ? record?.actionType !== EnumOrderActionType.PAID_SUCCESSFULLY &&
                      record?.actionType !== EnumOrderActionType.PAID_FAILED
                      ? record?.note
                      : t(record?.note)
                    : "-"}
                </span>
              </Paragraph>
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const handleSetScrollToDefault = () => {
    const elementParent = document.querySelector(".modal-order-detail-history");
    const element = elementParent?.querySelector(".ant-table-body");
    element?.scrollTo(0, 0);
  };

  const handleCancelModal = () => {
    handleSetScrollToDefault();
    handleCancel();
  };

  const renderContentModal = () => {
    return (
      <FnbTable
        scrollX={1200}
        scrollY={96 * 5}
        columns={getColumnsDetail()}
        dataSource={dataSource}
        className="mt-4 modal-order-detail-history-modal"
        rowKey={"id"}
      />
    );
  };

  return (
    <FnbModal
      className="modal-order-detail-history"
      width={983}
      title={pageData.orderHistory}
      visible={isShow}
      handleCancel={() => handleCancelModal()}
      footer={null}
      content={renderContentModal()}
    />
  );
}
