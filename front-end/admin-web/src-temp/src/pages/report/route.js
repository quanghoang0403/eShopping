import { ReportFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import OrderManagement from "pages/report/order/order.page";
import ReportTransaction from "pages/report/report-transaction/report-transaction.page";
import Revenue from "pages/report/revenue/revenue.page";
import ShiftDetail from "pages/report/shift/detail-shift";
import ShiftManagement from "pages/report/shift/shift-management";
import i18n from "utils/i18n";
import CustomerReport from "./customer/customer.page";
import OrderDetail from "./order/detail";
import ReservationDetail from "./reservation/view";
const { t } = i18n;

const route = {
  key: "app.report",
  position: 5,
  path: "#",
  icon: <ReportFill />,
  name: t("menu.report"),
  isMenu: true,
  exact: true,
  auth: true,
  child: [
    {
      key: "app.report.revenue",
      position: 5,
      path: "/report/revenue",
      name: t("menu.reportManagement.revenue"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_REVENUE_REPORT,
      component: Revenue,
      child: [],
    },
    {
      key: "app.report.transaction",
      position: 5,
      path: "/report/transaction",
      name: t("menu.reportManagement.transaction"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: [
        PermissionKeys.VIEW_SHIFT_REPORT,
        PermissionKeys.VIEW_ORDER_REPORT,
        PermissionKeys.VIEW_SOLD_PRODUCT_REPORT,
        PermissionKeys.VIEW_RESERVATION_REPORT,
      ],
      component: ReportTransaction,
      child: [],
    },
    {
      key: "app.report.transaction.detail",
      position: 5,
      path: "/report/transaction/:tabId?",
      name: t("menu.reportManagement.transaction"),
      isMenu: false,
      exact: true,
      auth: true,
      permission: [
        PermissionKeys.VIEW_SHIFT_REPORT,
        PermissionKeys.VIEW_ORDER_REPORT,
        PermissionKeys.VIEW_SOLD_PRODUCT_REPORT,
        PermissionKeys.VIEW_RESERVATION_REPORT,
      ],
      component: ReportTransaction,
      child: [],
    },
    {
      key: "app.report.shift",
      position: 5,
      path: "/shift/management",
      name: "Shift",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_SHIFT_REPORT,
      component: ShiftManagement,
      child: [],
    },
    {
      key: "app.report.shiftDetail",
      position: 5,
      path: "/shift/detail/:shiftId",
      name: "ShiftDetail",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_SHIFT_REPORT,
      component: ShiftDetail,
      child: [],
    },
    {
      key: "app.report.order",
      position: 5,
      path: "/report/order",
      name: "Order",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_ORDER_REPORT,
      component: OrderManagement,
      child: [],
    },
    {
      key: "app.report.order",
      position: 5,
      path: "/report/order/detail/:id",
      name: "OrderDetail",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_ORDER_REPORT,
      component: OrderDetail,
      child: [],
    },
    {
      key: "app.report.customer",
      position: 5,
      path: "/report/customer",
      name: t("menu.reportManagement.customer"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_CUSTOMER_REPORT,
      component: CustomerReport,
      child: [],
    },
    {
      key: "app.report.reservationdetail",
      position: 2,
      path: "/report/reservation-detail/:id",
      name: "ReservationDetail",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_RESERVATION_REPORT,
      component: ReservationDetail,
      child: [],
    },
  ],
};

export default route;
