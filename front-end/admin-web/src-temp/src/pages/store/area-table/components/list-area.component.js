import { Card, Col, message, Row } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbTable } from "components/fnb-table/fnb-table";
import { tableSettings } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import areaDataService from "data-services/area/area-data.service";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AddNewArea from "./create-new-area.component";
import { EditAreaComponent } from "./edit-area.component";

import { FnbListBranches } from "components/fnb-list-branches/fnb-list-branches";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { images } from "constants/images.constants";
import { getThumbnailUrl, hasPermission } from "utils/helpers";
import "../area-table.page.scss";
import { ViewDetailComponent } from "./view-detail.component";

export default function AreaManagement(props) {
  const [t] = useTranslation();
  const { storeBranchId, setGetStoreBranchId } = props;

  const pageData = {
    no: t("table.no"),
    thumbnail: t("area.thumbnail"),
    name: t("table.name"),
    description: t("form.description"),
    status: t("table.status"),
    action: t("table.action"),
    addNew: t("button.addNew"),
    active: t("status.active"),
    inactive: t("status.inactive"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    areaDeleteSuccess: t("area.areaDeleteSuccess"),
    areaDeleteFail: t("area.areaDeleteFail"),
    title: t("area.title", "Area Management"),
    titleViewDetail: t("area.titleViewDetail"),
    notFoundData: t("messages.cannotFindAreaInfo"),
    titleViewDescription: t("area.titleViewDescription"),
  };

  const [listAreaManagement, setListAreaManagement] = useState([]);
  const [totalAreaManagement, setTotalAreaManagement] = useState(0);
  const [pageNumber, setPageNumber] = useState(tableSettings.page);
  const [showAddArea, setShowAddArea] = useState(false);
  const [showEditArea, setShowEditArea] = useState(false);
  const [showViewDetail, setShowViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);
  const editComponentRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      await initDataTableAreaManagement(storeBranchId, tableSettings.page);
    }
    props.tableFuncs.current = fetchData;
    fetchData();
  }, [storeBranchId]);

  const initDataTableAreaManagement = async (storeBranchId, pageNumber) => {
    setPageNumber(pageNumber);
    if (storeBranchId) {
      let res = await areaDataService.getAreaManagementByBranchIdAsync(
        storeBranchId,
        pageNumber,
        tableSettings.pageSize,
      );
      let areas = mappingToDataTableAreaManagements(res.areas);
      setListAreaManagement(areas);
      setTotalAreaManagement(res.total);
      setPageNumber(pageNumber);
    }
  };

  const mappingToDataTableAreaManagements = (areaManagements) => {
    return areaManagements?.map((i, index) => {
      return {
        id: i.id,
        no: index + 1,
        name: i.name,
        description: i?.description,
        isActive: i.isActive,
        thumbnail: i?.imageUrl,
      };
    });
  };

  const showArea = async (value) => {
    setShowAddArea(value);
  };

  const onEditItem = (record) => {
    const { id } = record;
    editComponentRef.current.initData(id);

    setShowEditArea(true);
  };

  const onChangePage = async (pageNumber) => {
    initDataTableAreaManagement(storeBranchId, pageNumber);
  };

  const onCancelAddNewArea = (storeBranchId) => {
    setShowAddArea(false);
    initDataTableAreaManagement(storeBranchId, pageNumber);
  };

  const onCancelEditItem = (storeBranchId) => {
    setShowEditArea(false);
    initDataTableAreaManagement(storeBranchId, pageNumber);
  };

  const onHandleDelete = async (id) => {
    setShowEditArea(false);
    const res = await areaDataService.deleteAreaByIdAsync(id);
    if (res) {
      message.success(pageData.areaDeleteSuccess);
      initDataTableAreaManagement(storeBranchId, pageNumber);
    } else {
      message.error(pageData.areaDeleteFail);
    }
  };

  const onHandleViewDetail = async (id) => {
    setDataViewDetail(null);
    let request = {
      id: id,
      storeBranchId: storeBranchId,
    };
    const res = await areaDataService.getAreaByIdAsync(request);
    if (res) {
      const { area } = res;
      const data = {
        title: pageData.titleViewDetail,
        name: area?.name,
        status: area?.isActive,
        statusName: area?.isActive ? pageData.active : pageData.inactive,
        imageUrl: area?.imageUrl,
        description: area?.description,
        parentName: "",
      };

      setShowViewDetail(true);
      setDataViewDetail(data);
    } else {
      message.error(pageData.notFoundData);
    }
  };

  const getColumnAreas = () => {
    const columnAreas = [
      {
        title: pageData.no,
        dataIndex: "no",
        key: "no",
        width: "10%",
        align: "center",
      },
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
        title: pageData.name,
        dataIndex: "name",
        key: "name",
        width: "20%",
        ellipsis: "true",
        render: (_, record) => {
          return (
            <Row align="middle">
              <Paragraph placement="top" ellipsis={{ tooltip: record?.name }} color="#50429B">
                {hasPermission(PermissionKeys.VIEW_AREA_TABLE) ? (
                  <span className="link-detail-area" onClick={() => onHandleViewDetail(record?.id)}>
                    {record.name}
                  </span>
                ) : (
                  <span>{record.name}</span>
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
        width: "35%",
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
        title: pageData.status,
        dataIndex: "status",
        key: "status",
        width: "15%",
        align: "left",
        render: (_, record) => {
          if (record.isActive) {
            return <div className="area-status active">{pageData.active}</div>;
          } else {
            return <div className="area-status in-active">{pageData.inactive}</div>;
          }
        },
      },
      {
        title: pageData.action,
        key: "action",
        width: "10%",
        align: "center",
        render: (_, record) => (
          <div className="action-column">
            <EditButtonComponent
              className="action-button-space"
              onClick={() => onEditItem(record)}
              permission={PermissionKeys.EDIT_AREA_TABLE}
            />
            <DeleteConfirmComponent
              title={pageData.confirmDelete}
              content={formatDeleteMessage(record?.name)}
              okText={pageData.btnDelete}
              cancelText={pageData.btnIgnore}
              permission={PermissionKeys.DELETE_AREA_TABLE}
              cancelButtonProps={{
                style: { border: "none", color: "#a5abde" },
              }}
              onOk={() => onHandleDelete(record?.id)}
            />
          </div>
        ),
        hidden: !hasPermission(PermissionKeys.EDIT_AREA_TABLE) && !hasPermission(PermissionKeys.DELETE_AREA_TABLE),
      },
    ].filter((item) => !item.hidden);

    return columnAreas;
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  return (
    <>
      <Card className="fnb-card-full tab-area-management">
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
                  onClick={() => showArea(true)}
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
              columns={getColumnAreas()}
              pageSize={tableSettings.pageSize}
              dataSource={listAreaManagement}
              pageNumber={pageNumber}
              currentPageNumber={pageNumber}
              total={totalAreaManagement}
              onChangePage={onChangePage}
              editPermission={PermissionKeys.EDIT_AREA_TABLE}
              deletePermission={PermissionKeys.DELETE_AREA_TABLE}
              className="area-management-list"
              cursorGrabbing="false"
            />
          </Col>
        </Row>
      </Card>
      <AddNewArea isModalVisible={showAddArea} handleCancel={onCancelAddNewArea} storeBranchId={storeBranchId} />
      <EditAreaComponent
        isModalVisible={showEditArea}
        handleCancel={onCancelEditItem}
        handleDelete={(id) => {
          onHandleDelete(id);
        }}
        storeBranchId={storeBranchId}
        ref={editComponentRef}
      />
      <ViewDetailComponent
        isModalVisible={showViewDetail}
        dataViewDetail={dataViewDetail}
        closeViewDetail={() => setShowViewDetail(false)}
        titleDescription={pageData.titleViewDescription}
      />
    </>
  );
}
