import { Card, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import OrderManagement from "pages/report/order/order.page";
import TableShift from "pages/report/shift/shift-management/components/table-shift.component";
import ReportProductTransaction from "../components/product-report/product-report.component";
import ReservationManagement from "../reservation/management";
import { TRANSACTION_TABPANE_KEY } from "constants/report.constants";
import "./report-transaction.page.scss";
import { hasPermission } from "../../../utils/helpers";
import { PermissionKeys } from "../../../constants/permission-key.constants";

const { TabPane } = Tabs;

export default function ReportTransaction(props) {
  const [t] = useTranslation();
  const pageData = {
    orderTitle: t("dashboard.order"),
    reservationTitle: t("reservation.title"),
    shiftTitle: t("report.shift.title"),
    productTitle: t("menu.product"),
    comboTitle: "Combo",
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
        {hasPermission(PermissionKeys.VIEW_RESERVATION_REPORT) ? (
          <TabPane tab={pageData.reservationTitle} key="2">
            <div className="clearfix"></div>
            <ReservationManagement />
          </TabPane>
        ) : null}
        {hasPermission(PermissionKeys.VIEW_SHIFT_REPORT) ? (
          <TabPane tab={pageData.shiftTitle} key="3">
            <div className="clearfix"></div>
            <Card className="mt-3 fnb-card">
              <TableShift />
            </Card>
          </TabPane>
        ) : null}
        {hasPermission(PermissionKeys.VIEW_SOLD_PRODUCT_REPORT) ? (
          <TabPane tab={pageData.productTitle} key="4">
            <ReportProductTransaction />
          </TabPane>
        ) : null}
        {hasPermission(PermissionKeys.VIEW_SOLD_PRODUCT_REPORT) ? (
          <TabPane tab={pageData.comboTitle} key="5">
            <div className="clearfix"></div>
            <>Combo component here</>
          </TabPane>
        ) : null}
      </Tabs>
    </>
  );
}
