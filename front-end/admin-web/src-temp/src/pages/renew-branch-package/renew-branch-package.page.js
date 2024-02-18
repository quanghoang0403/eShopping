import { Card, Col, Row } from "antd";
import { FnbTabs } from "components/fnb-tabs/fnb-tabs";
import { ReceiptIcon } from "constants/icons.constants";
import { BranchPurchasePackage } from "pages/branch-management/branch-purchase/branch-purchase-package";
import React from "react";
import { useTranslation } from "react-i18next";

export function BranchPurchaseLoginPage(props) {
  const [t] = useTranslation();

  const screens = {
    branchSubscription: 1,
  };
  const initTabs = [
    {
      key: screens.branchSubscription,
      title: t("store.branchSubscription"),
      icon: <ReceiptIcon />,
      component: (
        <Card>
          <BranchPurchasePackage />
        </Card>
      ),
    },
  ];
  const [activeScreen, setActiveScreen] = React.useState(
    screens.branchSubscription
  );

  return (
    <>
      <Row className="w-100" style={{ justifyContent: "center" }}>
        <Row className="w-100">
          <Col span={24}>
            <FnbTabs
              defaultActiveKey={activeScreen}
              panes={initTabs}
              hiddenTabPane={true}
            />
          </Col>
        </Row>
      </Row>
    </>
  );
}
