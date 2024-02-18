import { Col, Row } from "antd";
import PageTitle from "components/page-title";
import { useTranslation } from "react-i18next";
import TableInventoryHistoryComponent from "./components/table-inventory-history.component";

export default function InventoryHistoryPage(props) {
  const [t] = useTranslation();

  const pageData = {
    title: t("inventoryHistory.title"),
    btnExport: t("button.export"),
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle content={pageData.title} />
        </Col>
      </Row>
      <TableInventoryHistoryComponent />
    </>
  );
}
