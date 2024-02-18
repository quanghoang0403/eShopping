import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "antd";
import PageTitle from "components/page-title";
import { useTranslation } from "react-i18next";
import TableTransferMaterialHistory from "./components/table-transfer-material-history.component";

export default function TransferMaterialHistory(props) {
  const [t] = useTranslation();

  const pageData = {
    transferMaterialHistory: t("transferMaterialHistory.title"),
  };  

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col span={24}>
          <PageTitle content={pageData.transferMaterialHistory} />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Card className="fnb-card-full">
        <TableTransferMaterialHistory />
      </Card>
    </>
  );
}
