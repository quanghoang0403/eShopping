import { message, Modal, Row, Tooltip } from "antd";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { tableSettings } from "constants/default.constants";
import { TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import menuManagementDataService from "data-services/menu-management/menu-management-data.service";
import multilevelMenuDataService from "data-services/multilevel-menu/multilevel-menu-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { hasPermission, StringWithLimitLength } from "utils/helpers";
import "../menu-management.page.scss";

export default function TableMenuManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [keySearch, setKeySearch] = useState("");
  const [showModalCanDelete, setShowModalCanDelete] = useState(false);
  const [contentModalCanDelete, setContentModalCanDelete] = useState("");
  const [showModalCanNotDelete, setShowModalCanNotDelete] = useState(false);
  const [contentModalCanNotDelete, setContentModalCanNotDelete] = useState();
  const [menuIdCanDelete, setMenuIdCanDelete] = useState();

  const pageData = {
    no: t("table.no"),
    menuName: t("onlineStore.menuName"),
    menuItem: t("onlineStore.menuItem"),
    action: t("onlineStore.action"),
    button: {
      btnIgnore: t("button.ignore"),
      btnStop: t("button.stop"),
      btnDelete: t("button.delete"),
      btnIgnoreDelete: t("marketing.qrCode.ignoreText"),
      iGotIt: t("button.iGotIt"),
    },
    confirmDeleteMessage: t("onlineStore.confirmDeleteMenuMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    deleteMenuSuccess: t("onlineStore.deleteMenuSuccess"),
    deleteMenuFail: t("onlineStore.deleteMenuFail"),
    confirmCannotDeleted: t("onlineStore.confirmCannotDeleted"),
    search: t("onlineStore.search"),
    menuBeingUseOnStoreWebsite: t("onlineStore.menuBeingUseOnStoreWebsite"),
    menuIsBeingLinked: t("onlineStore.menuIsBeingLinked"),
    pleaseUnlinkFirst: t("onlineStore.pleaseUnlinkFirst"),
  };

  const showConfirmDelete = async (id, name) => {
    const response = await menuManagementDataService.checkMenuManagementUseOnStore(id);
    const { isSubMenuBeingUsed, isUseOnStoreWeb, onlineStoreMenus } = response;

    if (isUseOnStoreWeb) {
      let messageContent = <span dangerouslySetInnerHTML={{ __html: pageData.menuBeingUseOnStoreWebsite }}></span>;
      setContentModalCanNotDelete(messageContent);
      setShowModalCanNotDelete(true);
    } else if (isSubMenuBeingUsed) {
      if (onlineStoreMenus.length === 1) {
        let messageHtml = (
          <>
            {pageData.menuIsBeingLinked}
            <br />
            <a
              style={{ color: "#F5832B" }}
              onClick={() => {
                moveToEditPage(onlineStoreMenus[0].id);
              }}
            >
              <span style={{wordBreak: "break-word"}}>{onlineStoreMenus[0].name}</span>
            </a>
            <br />
            {pageData.pleaseUnlinkFirst}
          </>
        );

        setContentModalCanNotDelete(messageHtml);
      } else {
        let listItems = (
          <div className="table-notification-confirm-delete">
            <ul>
              {onlineStoreMenus.map((item) => {
                return (
                  <li>
                    <a onClick={() => moveToEditPage(item.id)}>{item.name}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        );

        let contentMessage = (
          <>
            <span
              dangerouslySetInnerHTML={{ __html: `${pageData.menuIsBeingLinked} <br/> ${pageData.pleaseUnlinkFirst}` }}
            ></span>
            {listItems}
          </>
        );
        setContentModalCanNotDelete(contentMessage);
      }

      setShowModalCanNotDelete(true);
    } else {
      setMenuIdCanDelete(id);
      setContentModalCanDelete(t(pageData.confirmDeleteMessage, { name: name }));
      setShowModalCanDelete(true);
    }
  };

  const moveToEditPage = (id) => {
    history.push(`/menu-management/edit/${id}`);
  };

  const getColumns = () => {
    const columns = [
      {
        title: pageData.no.toUpperCase(),
        dataIndex: "no",
        key: "no",
        align: "left",
        width: "3%",
      },
      {
        title: pageData.menuName.toUpperCase(),
        dataIndex: "menuName",
        key: "menuName",
        align: "left",
        width: "25%",
        render: (value) => {
          const render = (
            <Tooltip placement="top" title={value} className="text-line-clamp-1">
              <span>{value}</span>
            </Tooltip>
          );
          return render;
        },
      },
      {
        title: pageData.menuItem.toUpperCase(),
        dataIndex: "menuItem",
        key: "menuItem",
        align: "left",
        render: (values) => {
          const render = (
            <Tooltip className="menu-items-text-line-clamp-1" placement="top" title={values}>
              <span className="text-column-menu-items">
                {values}
                </span>
            </Tooltip>
          );

          return render;
        },
      },
    ];

    if (
      hasPermission(PermissionKeys.EDIT_MENU_MANAGEMENT) ||
      hasPermission(PermissionKeys.DELETE_MENU_MANAGEMENT) ||
      hasPermission(PermissionKeys.CREATE_MENU_MANAGEMENT)
    ) {
      const actionColumn = {
        title: pageData.action.toUpperCase(),
        dataIndex: "action",
        key: "action",
        width: "10%",
        align: "center",
        render: (_, menuManagement) => {
          const { id, name } = menuManagement;

          return (
            <div className="menu-managemant-action-column">
              {hasPermission(PermissionKeys.EDIT_MENU_MANAGEMENT) && (
                <EditButtonComponent
                  onClick={() => {
                    history.push(`/menu-management/edit/${id}`);
                  }}
                />
              )}
              {hasPermission(PermissionKeys.DELETE_MENU_MANAGEMENT) && !menuManagement.isDefault && (
                <div className="fnb-table-action-icon" onClick={() => showConfirmDelete(id, name)}>
                  <Tooltip placement="top" title={pageData.button.btnDelete} color="#50429B">
                    <TrashFill />
                  </Tooltip>
                </div>
              )}
            </div>
          );
        },
      };
      columns.push(actionColumn);
    }
    return columns;
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await multilevelMenuDataService.getListMenuAsync(pageNumber, pageSize, keySearch);
    const data = response?.onlineStoreMenus.map((menu, index) => mappingRecordToColumns(menu, index));
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(pageNumber);
    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > response.total) {
      numberRecordCurrent = response.total;
    }
  };

  const mappingRecordToColumns = (menu, index) => {
    return {
      ...menu,
      no: index + 1,
      menuName: menu?.name,
      menuItem: menu?.onlineStoreMultiLevelNames?.join(", "),
    };
  };

  const handleSearchByName = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch);
        fetchDatableAsync(currentPageNumber, tableSettings.pageSize, keySearch);
      }, 500)
    );
  };

  const onChangePage = async (pageNumber, pageSize) => {
    fetchDatableAsync(pageNumber, pageSize, keySearch);
  };

  const onDeleteMenuManagement = async (id) => {
    await menuManagementDataService.deleteMenuManagementByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.deleteMenuSuccess);
      } else {
        message.error(pageData.deleteMenuFail);
      }
      setShowModalCanDelete(false);
      fetchDatableAsync(currentPageNumber, tableSettings.pageSize, keySearch);
    });
  };

  return (
    <Row className="form-staff mt-4">
      <FnbTable
        className="mt-4 table-striped-rows menu-management-table"
        columns={getColumns()}
        pageSize={tableSettings.pageSize}
        dataSource={dataSource}
        currentPageNumber={currentPageNumber}
        total={totalRecords}
        onChangePage={onChangePage}
        search={{
          placeholder: pageData.search,
          onChange: handleSearchByName,
        }}
      />

      <>
        <Modal
          className={`delete-confirm-modal`}
          title={pageData.confirmDelete}
          open={showModalCanNotDelete}
          okText={pageData.button.iGotIt}
          closable={false}
          onOk={() => setShowModalCanNotDelete(false)}
          onCancel={() => setShowModalCanNotDelete(false)}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <span>{contentModalCanNotDelete}</span>
        </Modal>

        <Modal
          className={`delete-confirm-modal`}
          title={pageData.confirmDelete}
          open={showModalCanDelete}
          okText={pageData.button.btnDelete}
          okType={"danger"}
          closable={false}
          cancelText={pageData.button.btnIgnore}
          onCancel={() => setShowModalCanDelete(false)}
          onOk={() => onDeleteMenuManagement(menuIdCanDelete)}
        >
          <span dangerouslySetInnerHTML={{ __html: `${contentModalCanDelete}` }}></span>
        </Modal>
      </>
    </Row>
  );
}
