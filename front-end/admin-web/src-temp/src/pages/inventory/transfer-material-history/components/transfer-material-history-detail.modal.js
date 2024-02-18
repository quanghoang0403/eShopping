import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "antd";
import { FnbTable } from "components/fnb-table/fnb-table";
import transferMaterialHistoryDetailDataService from "data-services/transfer-material-history-detail/transfer-material-history-detail-data.service";
import "./index.scss";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
const { Paragraph } = Typography;

export default function ModalTransferMaterialHistoryDetail(props) {
  const [t] = useTranslation();

  const {
    transferMaterialHistoryId = "",
    showTransferMaterialHistoryDetailModal,
    handleCancel,
  } = props;

  const pageData = {
    no: t("table.no"),
    material: t("transferMaterialHistory.material"),
    quantity: t("transferMaterialHistory.quantity"),
    materialName: t("transferMaterialHistory.materialName"),
    unit: t("transferMaterialHistory.unit"),
  };

  const pageSize = 20;
  const numberDisplayItem = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  useEffect(() => {
    if(showTransferMaterialHistoryDetailModal) {
      lazyLoadingTransferMaterialHistoryDetail(currentPageNumber, pageSize);
    }
  }, [showTransferMaterialHistoryDetailModal]);

  const onScrollTransferMaterialHistoryDetail = async (event) => {
    let target = event.target;
    let top = target.scrollTop;
    let offsetHeight = target.offsetHeight;
    let max = target.scrollHeight;
    let current = top + offsetHeight;
    const range = 100;

    const currentTotalDataTable = dataSource?.length;
    if (
      current + range >= max &&
      isLoading === false &&
      currentTotalDataTable < totalRecords
    ) {
      setIsLoading(true);
      await lazyLoadingTransferMaterialHistoryDetail(
        currentPageNumber + 1,
        pageSize
      );
    }
  };

  const lazyLoadingTransferMaterialHistoryDetail = async (page, size) => {
    var response =
      await transferMaterialHistoryDetailDataService.getTransferMaterialHistoryDetailById(
        transferMaterialHistoryId,
        page,
        size
      );
    const data = mappingToDataTableTransferMaterialHistoryDetail(
      response?.detailList
    );

    setDataSource(data);
    setIsLoading(false);
    setTotalRecords(response?.totalRecords);
    setCurrentPageNumber(page);
  };

  const mappingToDataTableTransferMaterialHistoryDetail = (data) => {
    return data?.map((item, index) => {
      return {
        no: index + 1,
        id: item?.id,
        unitId: item?.unitId,
        unitName: item?.unitName,
        materialId: item?.materialId,
        materialName: item?.materialName,
        quantity: item?.quantity,
      };
    });
  };

  const getColumnsTransferMaterialHistoryDetail = () => {
    const columnsTransferMaterialHistory = [
      {
        title: pageData.no,
        dataIndex: "no",
        key: "no",
        width: "10%",
        align: "left",
        className: "grid-column-transfer-id",
        render: (_, record) => {
          return <div className="text-content-20">{record?.no}</div>;
        },
      },
      {
        title: pageData.materialName,
        dataIndex: "materialName",
        key: "materialName",
        width: "40%",
        align: "left",
        className: "grid-text-column",
        render: (_, record) => {
          return (
            <div className="text-overflow-content text-content-20">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.materialName }}
                color="#50429B"
              >
                <span>{record?.materialName}</span>
              </Paragraph>
            </div>
          );
        },
      },
      {
        title: pageData.quantity,
        dataIndex: "quantity",
        key: "quantity",
        width: "20%",
        align: "center",
        className: "grid-text-column",
        render: (_, record) => {
          return (
            <div className="text-overflow-content text-content-20">
              {record?.quantity}
            </div>
          );
        },
      },
      {
        title: pageData.unit,
        dataIndex: "importUnit",
        key: "importUnit",
        width: "30%",
        align: "left",
        className: "grid-text-column",
        render: (_, record) => {
          return (
            <div className="text-overflow-content text-content-20">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.unitName }}
                color="#50429B"
              >
                <span>{record?.unitName}</span>
              </Paragraph>
            </div>
          );
        },
      },
    ];

    return columnsTransferMaterialHistory;
  };

  const handleSetScrollToDefault = () => {
    const elementParent = document.querySelector(".table-transfer-material-history-detail-modal");
    const element = elementParent?.querySelector(".ant-table-body");
    element?.scrollTo(0, 0);
  }

  const handleCancelModal = () => {
    setCurrentPageNumber(1);
    handleSetScrollToDefault();
    handleCancel();
  }

  const renderContentModal = () => {
    return (
      <FnbTable
        onScroll={onScrollTransferMaterialHistoryDetail}
        scrollX={1200}
        scrollY={106 * numberDisplayItem}
        columns={getColumnsTransferMaterialHistoryDetail()}
        dataSource={dataSource}
        className="mt-4 table-transfer-material-history-detail-modal"
        rowKey={"id"}
      />
    );
  };

  return (
    <FnbModal
      className="modal-transfer-history-detail"
      width={1366}
      title={pageData.material}
      visible={showTransferMaterialHistoryDetailModal}
      handleCancel={() => handleCancelModal()}
      footer={null}
      content={renderContentModal()}
    />
  );
}
