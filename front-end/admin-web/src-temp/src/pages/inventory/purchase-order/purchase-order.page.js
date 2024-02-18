import { Col, Row } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import TablePurchaseOrderComponent from "./components/table-purchase-order.component";
import "./index.scss";

export default function PurchaseOrderManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const { storeId } = props;
  const tablePurchaseOrderRef = React.useRef();
  const pageData = {
    addNew: t("purchaseOrder.addNew"),
    title: t("purchaseOrder.purchaseOrderManagement"),
    export: t("button.export"),
  };

  const onClickAddNew = () => {
    history.push(`/inventory/purchase-order/create-new`);
  };
  const handleExportPurchaseOrder = () => {
    if (tablePurchaseOrderRef && tablePurchaseOrderRef.current) {
      tablePurchaseOrderRef.current.exportFilter(storeId);
    }
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle content={pageData.title} />
        </Col>

        <Col xs={24} sm={24} xl={12} className="button-box product-filter-box page-action-group">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <FnbAddNewButton
                    className="float-right"
                    permission={PermissionKeys.CREATE_PURCHASE}
                    onClick={onClickAddNew}
                    text={pageData.addNew}
                  />
                ),
                permission: PermissionKeys.CREATE_PURCHASE,
              },
              {
                  action: (
                    <a href="javascript:void(0)" className="second-button" onClick={handleExportPurchaseOrder}>
                      {pageData.export}
                    </a>
                  ),
                  permission: PermissionKeys.VIEW_PURCHASE,
              },
              {
                action: (
                  <Link to={"/inventory/purchase-orders/import"} className="second-button">
                    {t("button.import")}
                  </Link>
                ),
                permission: PermissionKeys.CREATE_PURCHASE,
              },
            ]}
          />
        </Col>
      </Row>
      <TablePurchaseOrderComponent ref={tablePurchaseOrderRef} />
    </>
  );
}
