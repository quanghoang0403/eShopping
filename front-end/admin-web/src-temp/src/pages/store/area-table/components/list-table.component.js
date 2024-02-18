import { Card, Col, message, Row } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbTable } from "components/fnb-table/fnb-table";
import { tableSettings } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import areaTableDataService from "data-services/area-table/area-table-data.service";
import areaDataService from "data-services/area/area-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatNumber, getThumbnailUrl, hasPermission } from "utils/helpers";
import AddNewAreaTable from "./create-new-table.component";
import EditAreaTable from "./edit-table.component";

import { FnbListBranches } from "components/fnb-list-branches/fnb-list-branches";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { images } from "constants/images.constants";
import "../area-table.page.scss";
import { ViewDetailComponent } from "./view-detail.component";

export default function TableManagement(props) {
  const [t] = useTranslation();
  const { storeBranchId, setGetStoreBranchId } = props;
  const [listAreaTableManagement, setListAreaTableManagement] = useState([]);
  const [showAddAreaTable, setShowAddAreaTable] = useState(false);
  const [showUpdateAreaTable, setShowUpdateAreaTable] = useState(false);
  const [listArea, setListArea] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalTableManagement, setTotalTableManagement] = useState(0);
  const [selectedAreaTable, setSelectedAreaTable] = useState(null);
  const [showViewDetail, setShowViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  const pageData = {
    no: t("table.no"),
    thumbnail: t("area.thumbnail"),
    areaName: t("areaTable.areaName"),
    tableName: t("areaTable.tableName"),
    description: t("form.description"),
    seat: t("areaTable.seat"),
    status: t("areaTable.status"),
    action: t("table.action"),
    addNew: t("button.addNew"),
    active: t("areaTable.active"),
    inactive: t("areaTable.inactive"),
    btnFilter: t("button.filter"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    areaTableDeleteSuccess: t("areaTable.areaTableDeleteSuccess"),
    areaTableDeleteFail: t("areaTable.areaTableDeleteFail"),
    title: t("areaTable.title"),
    titleViewDetail: t("areaTable.titleViewDetail"),
    notFoundData: t("messages.cannotFindAreaTableInfo"),
    titleViewDescription: t("areaTable.titleViewDescription"),
  };

  useEffect(() => {
    async function fetchData() {
      await initDataTableAreaTableManagement(tableSettings.page, tableSettings.pageSize, storeBranchId);
    }
    props.tableFuncs.current = fetchData;
    fetchData();
  }, [storeBranchId]);

  const initDataTableAreaTableManagement = async (pageNumber, pageSize, storeBranchId) => {
    setPageNumber(pageNumber);
    if (storeBranchId) {
      let res = await areaTableDataService.getAreaTableByBranchAsync(pageNumber, pageSize, storeBranchId, "");
      let areaTableManagements = mappingToDataTableAreaTableManagements(res.areaTables);

      setListAreaTableManagement(areaTableManagements);
      setTotalTableManagement(res.total);
    }
  };

  const mappingToDataTableAreaTableManagements = (areaTableManagements) => {
    return areaTableManagements?.map((item) => {
      return {
        id: item.id,
        areaName: item?.areaName,
        tableName: item?.name,
        seat: item?.numberOfSeat,
        status: item?.isActive,
        description: item?.description,
        thumbnail: item?.imageUrl,
      };
    });
  };

  const onEditItem = (id) => {
    areaDataService.getAreasByBranchIdAsync(storeBranchId).then((res) => {
      setListArea(res.areas);
    });

    let request = {
      id: id,
      storeBranchId: storeBranchId,
    };

    areaTableDataService.getAreaTableByIdAsync(request).then((response) => {
      if (response) {
        const { areaTable } = response;
        setSelectedAreaTable(areaTable);
        setShowUpdateAreaTable(true);
      }
    });
  };

  const onHandleViewDetail = async (id) => {
    setDataViewDetail(null);
    let request = {
      id: id,
      storeBranchId: storeBranchId,
    };
    const res = await areaTableDataService.getAreaTableByIdAsync(request);
    if (res) {
      const { areaTable } = res;
      const data = {
        title: pageData.titleViewDetail,
        name: areaTable?.name,
        numberOfSeat: areaTable?.numberOfSeat,
        status: areaTable?.isActive,
        statusName: areaTable?.isActive ? pageData.active : pageData.inactive,
        imageUrl: areaTable?.imageUrl,
        description: areaTable?.description,
        parentName: areaTable?.areaName,
      };

      setShowViewDetail(true);
      setDataViewDetail(data);
    } else {
      message.error(pageData.notFoundData);
    }
  };

  const getColumnAreaTables = () => {
    const columns = [
      {
        title: pageData.thumbnail,
        dataIndex: "thumbnail",
        key: "thumbnail",
        width: "10%",
        ellipsis: "true",
        render: (_, record) => {
          return (
            <Row align="middle">
              <Thumbnail
                src={getThumbnailUrl(record?.thumbnail, "mobile")}
                imageDefault={images.thumbnailDefault}
                height={72}
                width={72}
              />
            </Row>
          );
        },
      },
      {
        title: pageData.areaName,
        dataIndex: "areaName",
        key: "areaName",
        width: "15%",
        ellipsis: "true",
        render: (_, record) => {
          return (
            <Row align="middle">
              <Paragraph placement="top" ellipsis={{ tooltip: record?.areaName }} color="#50429B">
                <span>{record.areaName}</span>
              </Paragraph>
            </Row>
          );
        },
      },
      {
        title: pageData.tableName,
        dataIndex: "tableName",
        key: "tableName",
        width: "15%",
        ellipsis: "true",
        render: (_, record) => {
          return (
            <Row align="middle">
              <Paragraph placement="top" ellipsis={{ tooltip: record?.tableName }} color="#50429B">
                {hasPermission(PermissionKeys.VIEW_AREA_TABLE) ? (
                  <span className="link-detail-area" onClick={() => onHandleViewDetail(record?.id)}>
                    {record.tableName}
                  </span>
                ) : (
                  <span>{record.tableName}</span>
                )}
              </Paragraph>
            </Row>
          );
        },
      },
      {
        title: pageData.description,
        dataIndex: "description",
        key: "description",
        width: "25%",
        ellipsis: "true",
        render: (_, record) => {
          record.description = record?.description || "-";
          return (
            <Row align="middle">
              <Paragraph placement="top" ellipsis={{ tooltip: record?.description, rows: 2 }} color="#50429B">
                <div
                  className="text-line-description-clamp-2"
                  dangerouslySetInnerHTML={{ __html: record?.description }}
                ></div>
              </Paragraph>
            </Row>
          );
        },
      },
      {
        title: pageData.seat,
        dataIndex: "seat",
        key: "seat",
        width: "10%",
        render: (_, record) => {
          return (
            <Row align="middle">
              <span>{formatNumber(record.seat)}</span>
            </Row>
          );
        },
      },
      {
        title: pageData.status,
        dataIndex: "status",
        key: "status",
        width: "15%",
        align: "left",
        render: (_, record) => (
          <>
            {record?.status ? (
              <div className="table-status active">{pageData.active}</div>
            ) : (
              <div className="table-status in-active">{pageData.inactive}</div>
            )}
          </>
        ),
      },
      {
        title: pageData.action,
        align: "center",
        render: (_, record) => (
          <div className="action-column">
            <EditButtonComponent
              className="action-button-space"
              onClick={() => onEditItem(record?.id)}
              permission={PermissionKeys.EDIT_AREA_TABLE}
            />
            <DeleteConfirmComponent
              title={pageData.confirmDelete}
              content={formatDeleteMessage(record?.tableName)}
              okText={pageData.btnDelete}
              cancelText={pageData.btnIgnore}
              permission={PermissionKeys.DELETE_AREA_TABLE}
              onOk={() => handleDeleteItem(record.id)}
              cancelButtonProps={{ style: { border: "none", color: "#a5abde" } }}
            />
          </div>
        ),
        hidden: !hasPermission(PermissionKeys.EDIT_AREA_TABLE) && !hasPermission(PermissionKeys.DELETE_AREA_TABLE),
      },
    ].filter((item) => !item.hidden);

    return columns;
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const showAddAreaTableForm = async () => {
    await areaDataService.getAreasByBranchIdAsync(storeBranchId).then((res) => {
      setListArea(res.areas);
      setShowAddAreaTable(true);
    });
  };

  const onChangePage = async (pageNumber) => {
    initDataTableAreaTableManagement(pageNumber, tableSettings.pageSize, storeBranchId);
  };

  const onCancel = () => {
    initDataTableAreaTableManagement(tableSettings.page, tableSettings.pageSize, storeBranchId);
    setShowAddAreaTable(false);
  };

  const onCancelUpdateForm = () => {
    initDataTableAreaTableManagement(tableSettings.page, tableSettings.pageSize, storeBranchId);
    setShowUpdateAreaTable(false);
  };

  const handleDeleteItem = async (id) => {
    var res = await areaTableDataService.deleteAreaTableByIdAsync(id);
    if (res) {
      message.success(pageData.areaTableDeleteSuccess);
    } else {
      message.error(pageData.areaTableDeleteFail);
    }
    await initDataTableAreaTableManagement(tableSettings.page, tableSettings.pageSize, storeBranchId);
  };

  const onHandleDelete = async (id) => {
    setShowUpdateAreaTable(false);
    var res = await areaTableDataService.deleteAreaTableByIdAsync(id);
    if (res) {
      message.success(pageData.areaTableDeleteSuccess);
    } else {
      message.error(pageData.areaTableDeleteFail);
    }
    await initDataTableAreaTableManagement(tableSettings.page, tableSettings.pageSize, storeBranchId);
  };

  return (
    <>
      <Card className="fnb-card-full tab-table-management">
        <div className="clearfix"></div>
        <Col span={24}>
          <Row gutter={[24, 24]} align="middle" justify="center" className="top-dashboard">
            <Col xs={24} sm={24} md={24} lg={24} className="fnb-form-btn-popover">
              <Row className="fnb-row-top" gutter={[24, 24]} justify="end">
                <FnbListBranches
                  onChangeEvent={setGetStoreBranchId}
                  showAllBranch={false}
                  initSelectedBranchId={storeBranchId}
                />
                <FnbAddNewButton
                  permission={PermissionKeys.CREATE_AREA_TABLE}
                  onClick={() => showAddAreaTableForm()}
                  text={pageData.addNew}
                />
              </Row>
            </Col>
          </Row>
        </Col>
        <div className="clearfix"></div>
        <Row>
          <Col span={24}>
            <FnbTable
              className="table-management-list"
              columns={getColumnAreaTables()}
              pageSize={tableSettings.pageSize}
              dataSource={listAreaTableManagement}
              pageNumber={pageNumber}
              currentPageNumber={pageNumber}
              total={totalTableManagement}
              onChangePage={onChangePage}
              editPermission={PermissionKeys.EDIT_PRODUCT}
              deletePermission={PermissionKeys.DELETE_PRODUCT}
              cursorGrabbing="false"
            />
          </Col>
        </Row>
      </Card>
      <AddNewAreaTable
        areaTableDataService={areaTableDataService}
        isModalVisible={showAddAreaTable}
        listArea={listArea}
        onCancel={onCancel}
      />
      <EditAreaTable
        areaTableDataService={areaTableDataService}
        isModalVisible={showUpdateAreaTable}
        selectedAreaTable={selectedAreaTable}
        listArea={listArea}
        storeBranchId={storeBranchId}
        onCancel={onCancelUpdateForm}
        handleDelete={(id) => {
          onHandleDelete(id);
        }}
      ></EditAreaTable>
      <ViewDetailComponent
        isModalVisible={showViewDetail}
        dataViewDetail={dataViewDetail}
        closeViewDetail={() => setShowViewDetail(false)}
        titleDescription={pageData.titleViewDescription}
      />
    </>
  );
}
