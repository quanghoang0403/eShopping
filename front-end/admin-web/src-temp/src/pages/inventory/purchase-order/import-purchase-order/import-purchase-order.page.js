import { message } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FileUploadDragDropComponent } from "components/file-upload-drag-drop/file-upload-drag-drop.component";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbImportResultTable } from "components/fnb-import-result-table/fnb-import-result-table.component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { DELAYED_TIME, MAXIMUM_FILE_SIZE } from "constants/default.constants";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom";
import languageService from "services/language/language.service";
import { handleDownloadFile } from "utils/helpers";
import "./import-purchase-order.page.scss";

function ImportPurchaseOrderPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [fileSelected, setFileSelected] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [isImportSuccess, setIsImportSuccess] = useState(null);
  const inputRef = React.useRef();
  const [blockNavigation, setBlockNavigation] = useState(false);

  const maximumFileSize = 20 * 1024 * 1024; // 20 MB => bytes
  const pageData = {
    btnCancel: t("button.cancel"),
    btnUpload: t("button.upload"),
    importPurchaseOrder: t("title.importPurchaseOrder"),
    generalInformation: t("title.generalInformation"),
    labelDownload: t("title.labelDownload"),
    here: t("title.here"),
    maximumFileSize: t("material.import.maximumFileSize", { fileSizeLimit: MAXIMUM_FILE_SIZE }),
    importSuccess: t("messages.importSuccess"),
    rowColumnTitle: t("table.rowColumnTitle"),
    cellColumnTitle: t("table.cellColumnTitle"),
    errorColumnTitle: t("table.errorColumnTitle"),
    sheet: t("table.sheet"),
  };

  const tableColumns = [
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
    },
  ];

  const validateFileSize = (file, maxSize) => {
    const fileSize = file.size;
    if (fileSize <= maxSize) {
      return true;
    } else {
      message.warn(pageData.maximumFileSize);
    }
    return false;
  };

  const handleSelectFile = (file) => {
    if (Boolean(file)) {
      const isValid = validateFileSize(file, maximumFileSize);
      if (isValid === true) {
        setFileSelected(file);
      }
    } else {
      setFileSelected("");
    }
  };

  const handleUploadFileAsync = async () => {
    setDataTable([]); // reset data table
    const formData = new FormData();
    formData.append("file", fileSelected);
    const response = await purchaseOrderDataService.importFileAsync(formData);
    const { success, messages } = response;
    setIsImportSuccess(success);
    setDataTable(messages);
    if (success === true) {
      message.success(t("messages.importPurchaseOrderSuccess"));

      // 👇️ reset input value
      if (inputRef && inputRef.current) {
        inputRef.current.reset();
      }
    }
  };

  const handleDownloadTemplateUrlAsync = async () => {
    const languageCode = languageService.getLang();
    try {
      const response = await purchaseOrderDataService.downloadImportTemplateAsync(languageCode);
      handleDownloadFile(response);
    } catch (error) {
      const { statusText } = error;
      message.error(statusText);
    }
  };

  useEffect(() => {
    if (Boolean(fileSelected)) {
      setBlockNavigation(true);
    } else {
      setBlockNavigation(false);
    }
  }, [fileSelected]);

  return (
    <>
      {/* Show leave confirm dialog */}
      <DeleteConfirmComponent
        title={t("leaveDialog.confirmation")}
        content={t("messages.leaveForm")}
        skipPermission={true}
        cancelText={t("button.discard")}
        okText={t("button.confirmLeave")}
        onOk={() => {
          setBlockNavigation(false);
          setTimeout(() => {
            return history.push("/inventory/purchase-orders");
          }, DELAYED_TIME);
        }}
        isChangeForm={blockNavigation}
      />

      <FnbPageHeader
        showBackLink
        onBack={history.goBack}
        actionDisabled={fileSelected ? false : true}
        title={pageData.importPurchaseOrder}
        cancelText={pageData.btnCancel}
        onCancel={history.goBack}
        actionText={<span className="text-first-capitalize">{pageData.btnUpload}</span>}
        onAction={handleUploadFileAsync}
      />

      <FnbCard className="fnb-card-full import-product-card">
        <div className="fnb-card-wrapper">
          <div className="mb-2">
            <h2 className="card-title">{pageData.generalInformation}</h2>
            <div className="description">
              <span className="download-description">{pageData.labelDownload}</span>
              <Link className="ml-2 download-link" onClick={handleDownloadTemplateUrlAsync}>
                {pageData.here}
              </Link>
            </div>
          </div>

          <FileUploadDragDropComponent ref={inputRef} onChange={handleSelectFile} />

          {dataTable && dataTable?.length > 0 && (
            <FnbImportResultTable
              tableName={t("title.purchaseOrder")?.toLowerCase()}
              columns={tableColumns}
              dataSource={dataTable}
              isSuccess={isImportSuccess}
            />
          )}
        </div>
      </FnbCard>
    </>
  );
}

export default ImportPurchaseOrderPage;
