import { Editor } from "@tinymce/tinymce-react";
import { Col, Form, message, Modal, Row } from "antd";
import { CancelButton } from "components/cancel-button";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { TINY_MCE_API_KEY } from "constants/application.constants";
import { DELAYED_TIME } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import menuManagementDataService from "data-services/menu-management/menu-management-data.service";
import pageDataService from "data-services/page/page-data.service";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { convertUtcToLocalTime } from "utils/helpers";
import "./edit-page-management.page.scss";

export default function EditPageManagement(props) {
  const { t } = useTranslation();
  const editorRef = useRef(null);
  const { history } = props;
  const [initData, setInitData] = useState("");
  const lastSavedTimeDefault = convertUtcToLocalTime(new Date()).format(DateFormat.DD_MM_YYYY);
  const state = useSelector((state) => state);
  const userFullName = state?.session?.currentUser?.fullName;
  const [isShowDeleteConfirmPopup, setIsShowDeleteConfirmPopup] = useState(false);
  const [messageDeleteConfirmPopup, setMessageDeleteConfirmPopup] = useState(null);
  const [textBtnOkDeleteConfirmPopup, setTextBtnOkDeleteConfirmPopup] = useState(null);
  const [isShowBtnCancelDeleteConfirmPopup, setIsShowBtnCancelDeleteConfirmPopup] = useState(false);
  const [titlePopupDeletePage, setTitlePopupDeletePage] = useState();
  const [pageIdValue, setPageIdValue] = useState();
  const [menuList, setMenuList] = useState([]);

  const pageData = {
    btnCancel: t("button.cancel"),
    btnUpdate: t("button.update"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),

    editPage: t("onlineStore.pageManagement.editPage"),
    pageName: t("onlineStore.pageManagement.pageName"),
    createPageInfo: t("onlineStore.pageManagement.createPageInfo"),
    pageNamePlaceholder: t("onlineStore.pageManagement.pageNamePlaceholder"),
    pageNameValidation: t("onlineStore.pageManagement.pageNameValidation"),
    pageContent: t("onlineStore.pageManagement.pageContent"),
    pageContentValidation: t("onlineStore.pageManagement.pageContentValidation"),
    updatePageSuccess: t("onlineStore.pageManagement.updatePageSuccess"),
    updatePageFailed: t("onlineStore.pageManagement.updatePageFailed"),
    createdBy: t("onlineStore.pageManagement.createdBy"),
    createdTime: t("onlineStore.pageManagement.createdTime"),
    updatedTime: t("onlineStore.pageManagement.updatedTime"),
    generalInformation: t("title.generalInformation"),
    cancelText: t("button.ignore"),
    okText: t("button.confirmLeave"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    titleDeleteConfirmPopup: t("messages.pageConfirmationDeleteTitle"),
    titleWarningPopup: t("messages.warning"),
    btnOkDeleteConfirmPopup: t("button.delete"),
    btnIgnoreDeleteConfirmPopup: t("button.deletePageIgnore"),
    btnIGotItDeleteConfirmPopup: t("button.iGotIt"),
    pageLinkedToMultipleMenuItem: t("messages.pageLinkedToMultipleMenuItem"),
    pageDeletedSuccessfully: t("messages.pageDeletedSuccessfully"),
    pageDeletedNotSuccessfully: t("messages.pageDeletedNotSuccessfully"),
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [pageContentEditor, setPageContentEditor] = useState("");

  useEffect(() => {
    getInitDataAsync();
  }, []);

  const getInitDataAsync = async () => {
    const { id } = props?.match?.params;
    let promises = await pageDataService.getPageByIdAsync(id);
    form.setFieldsValue(promises.page);

    setInitData(promises.page);
    setPageContentEditor(promises?.page?.pageContent);
  };

  const onChangePageContentEditor = () => {
    const content = editorRef.current.getContent();
    if (pageContentEditor !== content) {
      setIsChangeForm(true);
    }
    setPageContentEditor(content);
    form.setFieldValue("pageContent", content);
  };

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      let request = {
        page: {
          ...values,
          pageContent: pageContentEditor,
        },
      };
      let res = await pageDataService.updatePageAsync(request);
      if (res) {
        message.success(pageData.updatePageSuccess);
        redirectToPageManagement();
      } else {
        message.error(pageData.updatePageFailed);
      }
    });
  };

  const onDeletePage = async () => {
    const menuItemList = await menuManagementDataService.getMenuItemReferenceToPageByPageIdAsync(initData?.id);
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
      messageDeleteConfirm = t(`messages.pageConfirmDeleteMessage`, {
        pageName: initData?.pageName,
        pageUrl: menuItemUrl,
      });
      setTitlePopupDeletePage(pageData.titleDeleteConfirmPopup);
      setTextBtnOkDeleteConfirmPopup(pageData.btnOkDeleteConfirmPopup);
      setIsShowBtnCancelDeleteConfirmPopup(true);
    }

    setMenuList(menuItemList);
    setMessageDeleteConfirmPopup(messageDeleteConfirm);
    setPageIdValue(initData?.pageId);
    setIsShowDeleteConfirmPopup(true);
  };

  const onCancelDeletePage = () => {
    setIsShowDeleteConfirmPopup(false);
  };

  const onOkDeletePage = async () => {
    const pageDeleteResult = await pageDataService.deletePageByIdAsync(initData?.id);
    if (pageDeleteResult?.isSuccess) {
      redirectToPageManagement();
      message.success(pageData.pageDeletedSuccessfully);
    } else {
      setIsShowDeleteConfirmPopup(false);
      if (pageDeleteResult?.message?.length > 0) {
        message.error(t(pageDeleteResult?.message));
      } else {
        message.error(pageData.pageDeletedNotSuccessfully);
      }
      message.error(t(pageDeleteResult?.message));
    }
  };

  const redirectToPageManagement = () => {
    setIsShowDeleteConfirmPopup(false);
    setIsChangeForm(false);
    setTimeout(() => {
      history.push("/online-store/page-management");
    }, DELAYED_TIME);
  };

  return (
    <>
      <FnbPageHeader
        actionDisabled={isChangeForm ? false : true}
        title={pageData.editPage}
        actionButtons={[
          {
            action: <FnbAddNewButton onClick={onFinish} text={pageData.btnUpdate} />,
            permission: PermissionKeys.EDIT_PAGE,
          },
          {
            action: <CancelButton showWarning={isChangeForm} onOk={redirectToPageManagement} />,
          },
          {
            action: (
              <a onClick={onDeletePage} className="action-delete">
                {pageData.btnDelete}
              </a>
            ),
            permission: PermissionKeys.DELETE_PAGE,
          },
        ]}
      />
      <Form form={form} layout="vertical" autoComplete="off" onFieldsChange={() => setIsChangeForm(true)}>
        <Row gutter={[24, 24]}>
          <Col span={16}>
            <FnbCard title={pageData.generalInformation} className="p-3">
              <Row gutter={[16, 16]}>
                <Col sm={24} lg={24} className="w-100">
                  <Form.Item
                    name="pageName"
                    label={pageData.pageName}
                    rules={[{ required: true, message: pageData.pageNameValidation }]}
                  >
                    <FnbInput showCount placeholder={pageData.pageNamePlaceholder} maxLength={100} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col sm={24} lg={24} className="w-100">
                  <Form.Item
                    name="pageContent"
                    label={pageData.pageContent}
                    value={pageContentEditor}
                    rules={[{ required: true, message: pageData.pageContentValidation }]}
                  >
                    {/* Content */}
                    <div className="footer__content">
                      <div className="footer__content_editor">
                        <Editor
                          apiKey={TINY_MCE_API_KEY}
                          onInit={(evt, editor) => (editorRef.current = editor)}
                          value={pageContentEditor}
                          onEditorChange={() => onChangePageContentEditor()}
                          init={{
                            height: 300,
                            menubar: false,
                            formats: {
                              underline: {
                                inline: "span",
                                styles: { "text-decoration": "underline" },
                                exact: true,
                              },
                            },
                            plugins: [
                              "advlist",
                              "autolink",
                              "lists",
                              "link",
                              "image",
                              "charmap",
                              "preview",
                              "anchor",
                              "searchreplace",
                              "visualblocks",
                              "fullscreen",
                              "insertdatetime",
                              "media",
                              "table",
                              "help",
                              "wordcount",
                            ],
                            toolbar:
                              "undo redo | casechange blocks | alignleft aligncenter alignright alignjustify | " +
                              "bold italic underline | " +
                              "image link",
                            block_formats: "Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;",
                            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                          }}
                        />
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </FnbCard>
          </Col>
          <Col span={8}>
            <FnbCard title={pageData.createPageInfo} className="p-3">
              <Row gutter={[24, 24]}>
                <Col sm={24} lg={24} className="w-100">
                  <Row className="mb-1">
                    <Col span={24}>
                      <div className="left-column">{pageData.createdBy}</div>
                      <div className="right-column">
                        <div className="fnb-form-label-right">{userFullName ? userFullName : "-"}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col span={24}>
                      <div className="left-column">{pageData.createdTime}</div>
                      <div className="right-column">
                        <div className="fnb-form-label-right">
                          {initData?.createdTime
                            ? convertUtcToLocalTime(initData?.createdTime).format(DateFormat.DD_MM_YYYY)
                            : "-"}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div className="left-column">{pageData.updatedTime}</div>
                      <div className="right-column">
                        <div className="fnb-form-label-right">{lastSavedTimeDefault ? lastSavedTimeDefault : "-"}</div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </FnbCard>
          </Col>
        </Row>
        <Form.Item name={"id"} hidden="true"></Form.Item>
      </Form>

      <Modal
        className={`delete-confirm-modal delete-page-confirm-popup`}
        title={titlePopupDeletePage}
        open={isShowDeleteConfirmPopup}
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
