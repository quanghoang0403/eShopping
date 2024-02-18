import { Card, Col, Form, Row } from "antd";
import { FnbTable } from "components/fnb-table/fnb-table";
import { tableSettings } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import transferMaterialDataService from "data-services/transfer-material/transfer-material-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../index.scss";

import { DateFormat } from "constants/string.constants";
import { Link } from "react-router-dom";
import { formatDate } from "utils/helpers";

export const TableTransferMaterial = (props) => {
  const [t] = useTranslation();
  const pageViewDetailLink = "/inventory/transfer-material/view";
  const pageData = {
    id: t("transferMaterial.id", "Id"),
    title: t("transferMaterial.title"),
    code: t("transferMaterial.code"),
    notPermissionAdd: t("transferMaterial.notPermissionAdd"),
    from: t("transferMaterial.fromBranch"),
    to: t("transferMaterial.toBranch"),
    status: t("transferMaterial.status"),
    createdBy: t("transferMaterial.createdBy"),
    createdDate: t("transferMaterial.createdDate"),
    search: t("transferMaterial.search"),

    new: t("transferMaterial.statusTransfer.new"),
    delivering: t("transferMaterial.statusTransfer.delivering"),
    completed: t("transferMaterial.statusTransfer.completed"),
    canceled: t("transferMaterial.statusTransfer.canceled"),
    inprogress: t("transferMaterial.statusTransfer.inProgress"),
  };

  const [totalMaterial, setTotalMaterial] = useState(0);
  const [listMaterial, setListMaterial] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initDataTableMaterials(tableSettings.page, tableSettings.pageSize, keySearch);
  }, []);

  const initDataTableMaterials = (pageNumber, pageSize, keySearch) => {
    /// get list material
    setIsLoading(true);
    transferMaterialDataService
      .getTransferMaterialManagementsAsync(pageNumber, pageSize, keySearch)
      .then((res) => {
        let materials = mappingToDataTableMaterials(res.transferMaterials);
        setListMaterial(materials);
        setTotalMaterial(res.total);
        setCurrentPageNumber(pageNumber);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onChangePage = (page, pageSize) => {
    initDataTableMaterials(page, pageSize, "");
  };

  const mappingToDataTableMaterials = (materials) => {
    return materials?.map((i, index) => {
      return {
        ...i,
        id: i.id,
        from: i.from,
        to: i.to,
        status: i.status,
        createdDate: formatDate(i?.createdDate, DateFormat.DD_MM_YYYY),
        createdBy: i.createdBy,
      };
    });
  };
  const getColumns = () => {
    const columns = [
      {
        title: pageData.code,
        dataIndex: "code",
        width: "5%",
        render: (_, record) => {
          return <Link to={`${pageViewDetailLink}/${record?.id}`}>{_}</Link>;
        },
      },
      {
        title: pageData.from,
        dataIndex: "from",
        width: "22%",
        render: (value) => {
          const newValue = value.length > 40 ? value.substring(0, 40) + "..." : value;
          return (
            <div className="addressContainer">
              <span className="addressTransfer fromBranch">{newValue}</span>
              <div className="toolTipAddress">
                <span>{value}</span>
              </div>
            </div>
          );
        },
      },
      {
        title: pageData.to,
        dataIndex: "to",
        width: "22%",
        render: (value) => {
          const newValue = value.length > 40 ? value.substring(0, 40) + "..." : value;
          return (
            <div className="addressContainer">
              <span className="addressTransfer toBranch">{newValue}</span>
              <div className="toolTipAddress">
                <span>{value}</span>
              </div>
            </div>
          );
        },
      },
      {
        title: pageData.status,
        dataIndex: "status",
        width: "13%",
        render: (value) => {
          const statusClass = { 0: "Draft", 10: "Inprogress", 20: "Delivering", 30: "Completed", 40: "Canceled" };
          const statusLocal = {
            0: pageData.new,
            10: pageData.inprogress,
            20: pageData.delivering,
            30: pageData.completed,
            40: pageData.canceled,
          };
          return <span className={`statusTransfer statusTransfer-${statusClass[value]}`}>{statusLocal[value]}</span>;
        },
      },
      {
        title: pageData.createdBy,
        dataIndex: "createdBy",
        width: "14%",
        className: "colCreatedBy",
        render: (value) => {
          const newValue = value.length > 25 ? value.substring(0, 25) + "..." : value;
          return (
            <div className="addressContainer">
              <span className="createdBy">{newValue}</span>
              <div className="toolTipAddress">
                <span>{value}</span>
              </div>
            </div>
          );
        },
      },
      {
        title: pageData.createdDate,
        dataIndex: "createdDate",
        width: "14%",
        render: (value) => {
          return <span className="createdDate">{value}</span>;
        },
      },
    ];

    return columns;
  };

  const onSearch = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch);
        searchKeyAndFilterMaterials(tableSettings.page, tableSettings.pageSize, keySearch);
      }, 500)
    );
  };

  const searchKeyAndFilterMaterials = (pageNumber, pageSize, keySearch) => {
    transferMaterialDataService.getTransferMaterialManagementsAsync(pageNumber, pageSize, keySearch).then((res) => {
      let materials = mappingToDataTableMaterials(res.transferMaterials);
      setListMaterial(materials);
      setTotalMaterial(res.total);
      setCurrentPageNumber(pageNumber);
    });
  };
  return (
    <Form>
      <Card className="w-100 fnb-card-full boxTableTransferMaterial">
        <Row className="total-cost-amount-row">
          <Col span={24}>
            <FnbTable
              loading={isLoading}
              className="mt-4 tableTransferMaterial"
              columns={getColumns()}
              pageSize={tableSettings.pageSize}
              dataSource={listMaterial}
              currentPageNumber={currentPageNumber}
              total={totalMaterial}
              onChangePage={onChangePage}
              editPermission={PermissionKeys.EDIT_TRANSFER_MATERIAL}
              search={{
                placeholder: pageData.search,
                onChange: onSearch,
              }}
              footerMessage={pageData.tableShowingRecordMessage}
              rowKey={"id"}
            />
          </Col>
        </Row>
      </Card>
    </Form>
  );
};
