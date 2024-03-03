import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import OrderManagement from "pages/report/order/order.page";
import ReportProductTransaction from "./components/product-report/product-report.component";
import { TRANSACTION_TABPANE_KEY } from "constants/report.constants";
import "./report-transaction.page.scss";
import { hasPermission } from "../../utils/helpers";
import { PermissionKeys } from "../../constants/permission-key.constants";

const { TabPane } = Tabs;

export default function OrderPage(props) {
  const [t] = useTranslation();
  const pageData = {
    orderTitle: t("home:menuOrder"),
    productTitle: t("home:menuProduct"),
  };

  return (
    <>
      <Tabs defaultActiveKey={props?.match?.params?.tabId ?? TRANSACTION_TABPANE_KEY.ORDER} className="transaction-report-tabs">
        {hasPermission(PermissionKeys.VIEW_ORDER_REPORT) ? (
          <TabPane tab={pageData.orderTitle} key="1">
            <div className="clearfix"></div>
            <OrderManagement />
          </TabPane>
        ) : null}
        {hasPermission(PermissionKeys.VIEW_PRODUCT) ? (
          <TabPane tab={pageData.productTitle} key="4">
            <ReportProductTransaction />
          </TabPane>
        ) : null}
      </Tabs>
    </>
  );
}
