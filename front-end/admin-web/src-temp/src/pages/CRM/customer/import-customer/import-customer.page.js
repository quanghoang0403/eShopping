import { Button, Card, Col, message, Row, Space, Typography } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { MAXIMUM_FILE_SIZE } from "constants/default.constants";
import { CouldUploadIcon, CvsFileIcon, TemplateExcelIcon, WarningIcon } from "constants/icons.constants";
import customerDataService from "data-services/customer/customer-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Prompt } from "react-router";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import languageService from "services/language/language.service";
import { handleDownloadFile } from "utils/helpers";
import "./import-customer.page.scss";

const { Text } = Typography;

export default function ImportCustomer(props) {
  const storeId = useSelector((state) => state?.session?.currentUser?.storeId);
  const [t] = useTranslation();
  const history = useHistory();
  const inputRef = React.useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [dataImport, setDataImport] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [linkImportFile, setLinkImportFile] = useState(null);
  const [isImportSuccess, setIsImportSuccess] = useState(false);
  const [blockNavigation, setBlockNavigation] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 576 });
  const [dataTable, setDataTable] = useState([]);
  const [importCustomerErrs, setImportCustomerErrs] = useState([]);
  const [language, setLanguage] = useState("");
  const { i18n } = useTranslation();

  const pageData = {
    backTitle: t("material.import.backTitle"),
    btnUpLoad: t("button.upload"),
    labelDownload: t("material.import.labelDownload"),
    here: t("material.import.here"),
    dragAndDropOrSelectFile: t("material.import.dragAndDropOrSelectFile"),
    leaveWarningMessage: t("messages.leaveWarningMessage"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    confirmation: t("leaveDialog.confirmation"),
    cancelText: t("button.cancel"),
    okText: t("button.confirmLeave"),
    importSuccess: t("messages.importMaterialSuccessfully"),
    noRecord: "There are no valid lines to import on material",
    file: t("material.import.file"),
    maximumFileSize: t("material.import.maximumFileSize", { fileSizeLimit: MAXIMUM_FILE_SIZE }),
    generalInformation: t("material.import.generalInformation"),
    importCustomer: t("customer.importCustomer"),
    rowColumnTitle: t("table.rowColumnTitle"),
    cellColumnTitle: t("table.cellColumnTitle"),
    errorColumnTitle: t("table.errorColumnTitle"),
    labelDownloadFileErr: t("customer.labelDownloadFileErr"),
    importErrorMessage: t("messages.importErrorMessage"),
  };

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  /**
   * This function is used to close the confirmation modal.
   */
  const onCancel = () => {
    setShowConfirm(false);
  };

  /**
   * This function is used to navigate to the Material Management page.
   */
  const onCompleted = () => {
    setTimeout(() => {
      history.push("/customer/management");
    }, 100);
  };

  const handleImportMaterial = async () => {
    setDataTable([]); // reset data table
    let res = await customerDataService.importCustomerAsync(dataImport);
    const { success, messages, importCustomerErrs } = res;
    setImportCustomerErrs(importCustomerErrs);
    setIsImportSuccess(success);
    setDataTable(messages);
    if (success === true) {
      message.success(t("messages.importSuccess"));
    }
  };

  const onSelectFile = (e) => {
    let file = e.target.files[0];
    setFileName(file?.name);

    // Get file info.
    let sizeInfo = getFileSizeInfo(file?.size);

    if (sizeInfo.valid) {
      setFileSize(sizeInfo.text);
      let formData = new FormData();
      formData.append("file", file);
      setDataImport(formData);
      setIsImportSuccess(false);
      setLinkImportFile(e.target.value);
    } else {
      message.warn(pageData.maximumFileSize);
    }
  };

  /** This function is used to handle drag events when the user drags the file into the box.
   * @param  {event} e The react event.
   */
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
  };

  /** This function is used to handle the file when the file is dropped into the box.
   * @param  {event} e The react event.
   */
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSelectFile({
        target: {
          files: e.dataTransfer.files,
        },
      });
    }
  };

  /** This function is used to open the File Dialog when the box is clicked.
   */
  const openFileDialog = () => {
    inputRef?.current?.click();
  };

  /** This function is used to calculate the file size.
   * @param  {long} size The file size.
   */
  const getFileSizeInfo = (size) => {
    var fileSize = { text: "", valid: true, sizeInMb: 0 };
    if (size < 1000000) {
      fileSize.sizeInMb = Math.floor(size / 1000);
      fileSize.text = fileSize.sizeInMb + "KB";
      fileSize.valid = true;
    } else {
      fileSize.sizeInMb = Math.floor(size / 1000000);
      fileSize.text = fileSize.sizeInMb + "MB";

      if (fileSize.sizeInMb > 20) {
        fileSize.valid = false;
      } else {
        fileSize.valid = true;
      }
    }
    return fileSize;
  };

  const downloadImportProductTemplateUrlAsync = async () => {
    let languageCode = languageService.getLang();

    try {
      var response = await customerDataService.downloadImportCustomerTemplateAsync(languageCode);
      handleDownloadFile(response);
    } catch (error) {
      const { statusText } = error;

      message.error(statusText);
    }
  };

  const getTableColumn = () => {
    const columns = [
      {
        title: pageData.rowColumnTitle,
        dataIndex: "row",
        key: "row",
        align: "left",
        width: "10%",
      },
      {
        title: pageData.cellColumnTitle,
        dataIndex: "cell",
        key: "cell",
        align: "left",
        width: "10%",
      },
      {
        title: pageData.errorColumnTitle,
        dataIndex: "message",
        key: "message",
        width: "70%",
        render: (_, record) => {
          let messsageArr = record?.message.split(";");
          return language === "vi" ? messsageArr[0] : messsageArr[1];
        },
      },
    ];

    return columns;
  };

  const downloadFileErrAsync = async () => {
    let languageCode = languageService.getLang();

    try {
      var response = await customerDataService.downloadFileErrAsync({ languageCode, importCustomerErrs });

      const _getFileName = (response) => {
        const { headers } = response;
        var filename = "";
        var disposition = headers["content-disposition"];
        if (disposition && disposition.indexOf("attachment") !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, "");
          }
        }
        return filename;
      };

      const { data } = response;
      const file = {
        fileName: _getFileName(response),
        data: data,
      };

      handleDownloadFile(file);
    } catch (error) {
      const { statusText } = error;

      message.error(statusText);
    }
  };

  return (
    <>
      <Prompt when={blockNavigation} message={pageData.leaveWarningMessage} />
      <DeleteConfirmComponent
        title={pageData.confirmation}
        content={pageData.leaveWarningMessage}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onCancel}
        onOk={onCompleted}
      />
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle content={pageData.importCustomer} />
        </Col>

        <Col xs={24} sm={24} lg={12}>
          <Space className="float-right">
            <button className="second-button" onClick={() => setShowConfirm(true)}>
              {pageData.cancelText}
            </button>

            <Button type="primary" className="btn-upload-customer" onClick={handleImportMaterial}>
              {pageData.btnUpLoad.replace(/\w+/g, function (w) {
                return w[0].toUpperCase() + w.slice(1).toLowerCase();
              })}
            </Button>
          </Space>
        </Col>
      </Row>

      <Card className="w-100 fnb-card-full general-information-box">
        <Row className="">
          <Col span={24}>
            <div className="general-information-text general-information-customer-text">
              {pageData.generalInformation}
            </div>
            <div className="link-download-box link-download-box-customer">
              <TemplateExcelIcon width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} />
              <span> {pageData.labelDownload}</span>
              <a onClick={downloadImportProductTemplateUrlAsync}>
                <span className="link-url-template-customer">{pageData.here}</span>
              </a>
            </div>
          </Col>
        </Row>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className="drag-drop-box drag-drop-box-customer"
        >
          <input
            ref={inputRef}
            id="file-upload"
            type="file"
            accept=".xlsx"
            value={linkImportFile}
            onChange={(e) => onSelectFile(e)}
          />
          <div className="icon-box">
            {fileName && fileName?.length > 0 ? <CvsFileIcon /> : <CouldUploadIcon className="cloud-icon" />}
          </div>
          {fileName && fileName?.length > 0 ? (
            <>
              <div className="second-text">
                {pageData.file} {fileName}
              </div>
              <div className="third-text">{fileSize}</div>
            </>
          ) : (
            <>
              <div className="second-text">{pageData.dragAndDropOrSelectFile}</div>
              <div className="third-text">{pageData.maximumFileSize}</div>
            </>
          )}
        </div>
        {dataTable && dataTable?.length > 0 && (
          <>
            <div className="fnb-import-result-table">
              <div className="message-box-header">
                {isImportSuccess === false && (
                  <>
                    <WarningIcon className="message-box-header-warning-icon" />
                    <Text type="danger">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: t(pageData.importErrorMessage, {
                            name: t("menu.crmManagement.customer")?.toLowerCase(),
                          }),
                        }}
                      ></span>
                    </Text>
                  </>
                )}
                {isImportSuccess === true && <Text type="success">{pageData.importSuccess}</Text>}
              </div>
              {isImportSuccess === false && (
                <div className="link-download-box link-download-box-customer mt-4">
                  <TemplateExcelIcon width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} />
                  <span> {pageData.labelDownloadFileErr}</span>
                  <a onClick={() => downloadFileErrAsync()}>
                    <span className="link-url-template-customer">{pageData.here}</span>
                  </a>
                </div>
              )}
              {(isImportSuccess === false || isImportSuccess === true) && (
                <Row>
                  <FnbTable columns={getTableColumn()} dataSource={dataTable} className="w-100" />
                </Row>
              )}
            </div>
          </>
        )}
      </Card>
    </>
  );
}
