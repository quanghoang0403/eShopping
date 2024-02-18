import { Col, Space, Tabs } from "antd";
import branchDataService from "data-services/branch/branch-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AreaManagement from "./components/list-area.component";
import TableManagement from "./components/list-table.component";

import { PermissionKeys } from "constants/permission-key.constants";
import { hasPermission } from "utils/helpers";
import "./area-table.page.scss";

const { TabPane } = Tabs;

export default function AreaTableManagement(props) {
  const [t] = useTranslation();
  const tableAreaFunc = React.useRef(null);
  const tableAreaTableFunc = React.useRef(null);

  const pageData = {
    area: t("area.area"),
    areaManagement: t("area.title"),
    selectBranch: t("material.inventory.branchSelectPlaceholder"),
    areaTable: t("areaTable.table"),
    areaTableManagement: t("areaTable.title"),
    areaTableNoBranch: t("area.areaTableNoBranch"),
  };

  const [listBranch, setListBranch] = useState([]);
  const [getStoreBranchId, setGetStoreBranchId] = useState(null);

  useEffect(() => {
    getInitDataAsync();
  }, []);

  const getInitDataAsync = async () => {
    await branchDataService.getAllBranchsAsync().then((res) => {
      if (res.branchs.length > 0) {
        setListBranch(res.branchs);
        setGetStoreBranchId(res?.branchs[0]?.id);
      }
    });
  };

  const changeTab = (activeKey) => {
    if (activeKey == 1 && tableAreaFunc.current) {
      tableAreaFunc.current();
    } else if (tableAreaTableFunc.current) {
      tableAreaTableFunc.current();
    }
  };

  return (
    <>
      <Col xs={24} sm={24} xl={24}>
        <Space className="page-title-area-table">
          <h1 className="fnb-title-header">{`${pageData.area} - ${pageData.areaTable}`}</h1>
        </Space>
      </Col>
      <Tabs defaultActiveKey={1} className="area-table-tabs" onChange={changeTab}>
        {hasPermission(PermissionKeys.VIEW_AREA_TABLE) && (
          <>
            <TabPane tab={pageData.area} key="1">
              <div className="clearfix"></div>
              <AreaManagement
                storeBranchId={getStoreBranchId}
                listBranch={listBranch}
                setGetStoreBranchId={setGetStoreBranchId}
                tableFuncs={tableAreaFunc}
              />
            </TabPane>
            <TabPane tab={pageData.areaTable} key="2">
              <div className="clearfix"></div>
              <TableManagement
                storeBranchId={getStoreBranchId}
                listBranch={listBranch}
                setGetStoreBranchId={setGetStoreBranchId}
                tableFuncs={tableAreaTableFunc}
              />
            </TabPane>
          </>
        )}
      </Tabs>
    </>
  );
}
