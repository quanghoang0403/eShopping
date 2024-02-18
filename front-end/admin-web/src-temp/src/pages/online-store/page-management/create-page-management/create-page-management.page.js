import { Editor } from "@tinymce/tinymce-react";
import { Col, Form, message, Row } from "antd";
import { CancelButton } from "components/cancel-button";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { TINY_MCE_API_KEY } from "constants/application.constants";
import { DELAYED_TIME } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import pageDataService from "data-services/page/page-data.service";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { convertUtcToLocalTime } from "utils/helpers";
import "./create-page-management.page.scss";

export default function CreatePageManagement() {
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const [pageContentEditor, setPageContentEditor] = useState("");
  const [isChangeForm, setIsChangeForm] = useState(false);
  const createdTimeDefault = convertUtcToLocalTime(new Date()).format(DateFormat.DD_MM_YYYY);
  const state = useSelector((state) => state);
  const userFullName = state?.session?.currentUser?.fullName;

  const pageData = {
    btnCancel: t("button.cancel"),
    btnAddNew: t("button.create"),

    createPage: t("onlineStore.pageManagement.createPage"),
    pageName: t("onlineStore.pageManagement.pageName"),
    createPageInfo: t("onlineStore.pageManagement.createPageInfo"),
    pageNamePlaceholder: t("onlineStore.pageManagement.pageNamePlaceholder"),
    pageNameValidation: t("onlineStore.pageManagement.pageNameValidation"),
    pageContent: t("onlineStore.pageManagement.pageContent"),
    pageContentValidation: t("onlineStore.pageManagement.pageContentValidation"),
    createPageSuccess: t("onlineStore.pageManagement.createPageSuccess"),
    createPageFailed: t("onlineStore.pageManagement.createPageFailed"),
    createdBy: t("onlineStore.pageManagement.createdBy"),
    createdTime: t("onlineStore.pageManagement.createdTime"),
    updatedTime: t("onlineStore.pageManagement.updatedTime"),
    generalInformation: t("title.generalInformation"),
  };

  const onChangePageContentEditor = () => {
    const content = editorRef.current.getContent();
    setPageContentEditor(content);
    form.setFieldValue("pageContent", content);
  };

  const onClickCreatePage = async () => {
    form.validateFields().then(async (values) => {
      let request = {
        page: {
          ...values,
          pageContent: pageContentEditor,
        },
      };
      let res = await pageDataService.createPageAsync(request);
      if (res) {
        message.success(pageData.createPageSuccess);
        redirectToPageManagement();
      } else {
        message.error(pageData.createPageFailed);
      }
    });
  };

  const redirectToPageManagement = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      history.push("/online-store/page-management");
    }, DELAYED_TIME);
  };

  return (
    <>
      <FnbPageHeader
        actionDisabled={isChangeForm ? false : true}
        title={pageData.createPage}
        actionButtons={[
          {
            action: <FnbAddNewButton onClick={onClickCreatePage} text={pageData.btnAddNew} />,
            permission: PermissionKeys.CREATE_PAGE,
          },
          {
            action: <CancelButton showWarning={isChangeForm} onOk={redirectToPageManagement} />,
          },
        ]}
      />
      <Form
        className="create-qr-code"
        form={form}
        layout="vertical"
        autoComplete="off"
        onFieldsChange={() => setIsChangeForm(true)}
      >
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
                            height: 395,
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
                        <div className="fnb-form-label-right">{createdTimeDefault ? createdTimeDefault : "-"}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div className="left-column">{pageData.updatedTime}</div>
                      <div className="right-column">
                        <div className="fnb-form-label-right">-</div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </FnbCard>
          </Col>
        </Row>
      </Form>
    </>
  );
}
