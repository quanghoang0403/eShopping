import { Card, Col, Row, Space } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PrintBarcodeDialogComponent from "./components/print-barcode-dialog.component";
import TableProduct from "./components/table-product.component";
import "./product.scss";

/**
 * Page Product Management
 * description: page manage product primary template
 */
export default function ProductManagementPage(props) {
  const [t] = useTranslation();
  const [isShowPrintBarcodeDialog, setIsShowPrintBarcodeDialog] = useState(false);

  const pageData = {
    title: t("productManagement.title"),
    button: {
      addNew: t("button.addNew"),
      export: t("button.export"),
      import: t("button.import"),
      printBarcode: t("button.printBarcode", "Print barcode"),
    },
  };

  const handleCancelPrintBarcode = (data) => {
    setIsShowPrintBarcodeDialog(data?.visible ?? false);
  };

  return (
    <div>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} xl={12}>
          <Space className="page-title">
            <PageTitle content={pageData.title} />
          </Space>
        </Col>
        <Col xs={24} sm={24} xl={12} className="button-box product-filter-box page-action-group">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <FnbAddNewButton
                    permission={PermissionKeys.CREATE_PRODUCT}
                    onClick={() => props.history.push("/product/create-new")}
                    text={pageData.button.addNew}
                  />
                ),
                permission: PermissionKeys.CREATE_PRODUCT,
              },
              {
                action: (
                  <Link to={"/product/import"} className="second-button">
                    {pageData.button.import}
                  </Link>
                ),
                permission: PermissionKeys.IMPORT_PRODUCT,
              },
              {
                action: (
                  <div className="second-button btn-print-barcode" onClick={() => setIsShowPrintBarcodeDialog(true)}>
                    {pageData.button.printBarcode}
                  </div>
                ),
              },
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Card className="fnb-card cart-with-no-border">
        <TableProduct />
      </Card>
      <PrintBarcodeDialogComponent visible={isShowPrintBarcodeDialog} onCancel={handleCancelPrintBarcode} />
    </div>
  );
}
