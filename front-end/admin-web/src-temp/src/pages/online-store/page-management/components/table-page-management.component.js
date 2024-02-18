import { Col, message, Modal, Row, Space, Tooltip } from "antd";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { tableSettings } from "constants/default.constants";
import { TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import menuManagementDataService from "data-services/menu-management/menu-management-data.service";
import pageDataService from "data-services/page/page-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { formatDate, hasPermission } from "utils/helpers";
import "../page-management.page.scss";

export default function TablePageManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const pageDetailLink = "/online-store/page-management/detail-page-management";
  const pageEditLink = "/online-store/page-management/edit-page-management";
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [keySearch, setKeySearch] = useState("");
  const [isShowDeleteConfirmPopup, setIsShowDeleteConfirmPopup] = useState(false);
  const [messageDeleteConfirmPopup, setMessageDeleteConfirmPopup] = useState(null);
  const [textBtnOkDeleteConfirmPopup, setTextBtnOkDeleteConfirmPopup] = useState(null);
  const [isShowBtnCancelDeleteConfirmPopup, setIsShowBtnCancelDeleteConfirmPopup] = useState(false);
  const [titlePopupDeletePage, setTitlePopupDeletePage] = useState();
  const [pageIdValue, setPageIdValue] = useState();
  const [menuList, setMenuList] = useState([]);

  const pageData = {
    search: t("form.searchName"),
    no: t("table.no"),
    action: t("onlineStore.pageManagement.action"),
    pageName: t("onlineStore.pageManagement.pageName"),
    createdBy: t("onlineStore.pageManagement.createdBy"),
    createdTime: t("onlineStore.pageManagement.createdTime"),
    button: {
      btnDelete: t("button.delete"),
      btnIgnoreDelete: t("marketing.qrCode.ignoreText"),
    },
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    deleteQrCodeSuccess: t("onlineStore.pageManagement.deletePageSuccess"),
    deleteDeleteFail: t("onlineStore.pageManagement.deletePageFail"),
    titleDeleteConfirmPopup: t("messages.pageConfirmationDeleteTitle"),
    titleWarningPopup: t("messages.warning"),
    btnOkDeleteConfirmPopup: t("button.delete"),
    btnIgnoreDeleteConfirmPopup: t("button.deletePageIgnore"),
    btnIGotItDeleteConfirmPopup: t("button.iGotIt"),
    pageLinkedToMultipleMenuItem: t("messages.pageLinkedToMultipleMenuItem"),
    pageDeletedSuccessfully: t("messages.pageDeletedSuccessfully"),
    pageDeletedNotSuccessfully: t("messages.pageDeletedNotSuccessfully"),
  };

  const getColumns = () => {
    const columnsPage = [
      {
        title: pageData.no.toUpperCase(),
        dataIndex: "no",
        key: "no",
        align: "left",
        width: "3%",
      },
      {
        title: pageData.pageName,
        dataIndex: "pageName",
        key: "pageName",
        width: "47%",
        align: "left",
        className: "grid-text-column",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={24}>
                  <div className="text-line-clamp-1">
                    <Tooltip title={record.pageName}>
                      <Link to={`${pageDetailLink}/${record?.id}`}>{record.pageName}</Link>
                    </Tooltip>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className="text-line-clamp-2" dangerouslySetInnerHTML={{ __html: record.pageContent }}></div>
                </Col>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.createdBy,
        dataIndex: "createdBy",
        key: "createdBy",
        width: "20%",
        align: "left",
        className: "grid-text-column",
      },
      {
        title: pageData.createdTime.toUpperCase(),
        dataIndex: "createdTime",
        key: "createdTime",
        className: "grid-time-column",
        width: "20%",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={14}>
                  <p className="end-date">
                    {record?.createdTime ? <p className="end-date">{formatDate(record?.createdTime)}</p> : "-"}
                  </p>
                </Col>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.action.toUpperCase(),
        key: "action",
        align: "left",
        width: "10%",
        render: (_, record) => (
          <>
            <div className="action-column">
              <EditButtonComponent
                className="action-button-space"
                onClick={() => onEditItem(record?.id)}
                permission={PermissionKeys.EDIT_PAGE}
              />

              {hasPermission(PermissionKeys.DELETE_PAGE) && (
                <Space wrap>
                  <div
                    className="fnb-table-action-icon pointer"
                    onClick={() => onDeleteItem(record?.id, record?.pageName)}
                  >
                    <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                      <TrashFill className="icon-svg-hover" />
                    </Tooltip>
                  </div>
                </Space>
              )}
            </div>
          </>
        ),
      },
    ];

    return columnsPage;
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await pageDataService.getAllPageAsync(pageNumber, pageSize, keySearch);
    const data = response?.pages.map((page, index) => ({
      no: index + 1,
      ...page,
    }));
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > response.total) {
      numberRecordCurrent = response.total;
    }
  };

  const handleSearchByName = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch);
        fetchDatableAsync(1, tableSettings.pageSize, keySearch);
      }, 500)
    );
  };

  const onChangePage = async (pageNumber, pageSize) => {
    fetchDatableAsync(pageNumber, pageSize, keySearch);
  };

  const onEditItem = (id) => {
    return history.push(`${pageEditLink}/${id}`);
  };

  const onDeleteItem = async (pageId, pageName) => {
    const menuItemList = await menuManagementDataService.getMenuItemReferenceToPageByPageIdAsync(pageId);
    let messageDeleteConfirm = <></>;
    let menuItemUrl = "";
    if (menuItemList?.length > 0 && menuItemList?.length <= 1) {
      menuItemUrl = `/menu-management/edit/${menuItemList[0]?.menuId}`;
      messageDeleteConfirm = t("messages.pageLinkedToMenuItem", {
        menuItemName: menuItemList[0]?.menuItemName,
        menuItemUrl: menuItemUrl,
      });
      setTitlePopupDeletePage(pageData.titleWarningPopup);
      setTextBtnOkDeleteConfirmPopup(pageData.btnIGotItDeleteConfirmPopup);
      setIsShowBtnCancelDeleteConfirmPopup(false);
    } else if (menuItemList?.length > 1) {
      messageDeleteConfirm = (
        <>
          <span>{pageData.pageLinkedToMultipleMenuItem}</span>
          <div className="message-confirm-group-menu-item">
            {menuItemList?.map((menuItem) => {
              menuItemUrl = `/menu-management/edit/${menuItem?.menuId}`;
              return (
                <div className="message-confirm-sub">
                  <span className="linked-menu-item-name-dot"></span>
                  <a href={menuItemUrl} className="linked-menu-item-name" target="_blank" rel="noreferrer">
                    {menuItem?.menuItemName}
                  </a>
                </div>
              );
            })}
          </div>
        </>
      );
      setTitlePopupDeletePage(pageData.titleWarningPopup);
      setTextBtnOkDeleteConfirmPopup(pageData.btnIGotItDeleteConfirmPopup);
      setIsShowBtnCancelDeleteConfirmPopup(false);
    } else if (menuItemList?.length <= 0) {
      messageDeleteConfirm = t(`messages.pageConfirmDeleteMessage`, { pageName: pageName });
      setTitlePopupDeletePage(pageData.titleDeleteConfirmPopup);
      setTextBtnOkDeleteConfirmPopup(pageData.btnOkDeleteConfirmPopup);
      setIsShowBtnCancelDeleteConfirmPopup(true);
    }

    setMenuList(menuItemList);
    setMessageDeleteConfirmPopup(messageDeleteConfirm);
    setPageIdValue(pageId);
    setIsShowDeleteConfirmPopup(true);
  };

  const onCancelDeletePage = () => {
    setIsShowDeleteConfirmPopup(false);
  };

  const onOkDeletePage = async () => {
    const pageDeleteResult = await pageDataService.deletePageByIdAsync(pageIdValue);
    if (pageDeleteResult?.isSuccess) {
      fetchDatableAsync(currentPageNumber, tableSettings.pageSize, keySearch);
      setIsShowDeleteConfirmPopup(false);
      message.success(pageData.pageDeletedSuccessfully);
    } else {
      setIsShowDeleteConfirmPopup(false);
      if (pageDeleteResult?.message?.length > 0) {
        message.error(t(pageDeleteResult?.message));
      } else {
        message.error(pageData.pageDeletedNotSuccessfully);
      }
    }
  };

  return (
    <>
      <Row className="form-staff mt-4">
        <FnbTable
          className="mt-4"
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
      </Row>

      <Modal
        className={`delete-confirm-modal delete-page-confirm-popup`}
        title={titlePopupDeletePage}
        visible={isShowDeleteConfirmPopup}
        skipPermission={true}
        cancelText={pageData.btnIgnoreDeleteConfirmPopup}
        okText={textBtnOkDeleteConfirmPopup}
        onCancel={onCancelDeletePage}
        onOk={isShowBtnCancelDeleteConfirmPopup === true ? onOkDeletePage : onCancelDeletePage}
        okButtonProps={isShowBtnCancelDeleteConfirmPopup && { style: { background: "#FC0D1B" } }}
        centered={true}
        closable={false}
        cancelButtonProps={isShowBtnCancelDeleteConfirmPopup === false ? { style: { display: "none" } } : ""}
      >
        {menuList?.length <= 1 ? (
          <div
            className="content-delete-page-popup"
            dangerouslySetInnerHTML={{ __html: `${messageDeleteConfirmPopup}` }}
          ></div>
        ) : (
          <div className="content-delete-page-popup">{messageDeleteConfirmPopup}</div>
        )}
      </Modal>
    </>
  );
}
