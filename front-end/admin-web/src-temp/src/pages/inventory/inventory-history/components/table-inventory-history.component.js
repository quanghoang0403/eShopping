import { Tabs } from "antd";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { hasPermission } from "utils/helpers";
import "./index.scss";
import TableInventoryHistoryByMaterialComponent from "./table-inventory-history-by-material.component";
import TableInventoryHistoryDefaultComponent from "./table-inventory-history-default.component";
import "./table-inventory-history.component.scss";

const { TabPane } = Tabs;
const TableInventoryHistoryComponent = (props) => {
  const [t] = useTranslation();
  const pageData = {
    viewByTransaction: t("inventoryHistory.viewByTransaction"),
    viewByMaterial: t("inventoryHistory.viewByMaterial"),
  };

  return (
    <>
      <Tabs defaultActiveKey={1} className="inventory-history-setting-tabs">
        {hasPermission(PermissionKeys.VIEW_INVENTORY_HISTORY) && (
          <>
            <TabPane tab={pageData.viewByTransaction} key="1">
              <div className="clearfix"></div>
              <TableInventoryHistoryDefaultComponent />
            </TabPane>
            <TabPane tab={pageData.viewByMaterial} key="2">
              <div className="clearfix"></div>
              <TableInventoryHistoryByMaterialComponent />
            </TabPane>
          </>
        )}
      </Tabs>
    </>
  );
};

export default TableInventoryHistoryComponent;
