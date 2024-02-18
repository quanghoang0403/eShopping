import { Col, Collapse, Form, Radio, Row, Tabs } from "antd";
import { useState } from "react";

import "moment/locale/vi";
import { useTranslation } from "react-i18next";
import "./point-configuration.page.scss";
import LoyaltyPointConfiguration from "../loyalty-point/loyalty-point-configuration.page";
import ReferralPointConfiguration from "../referral-point/referral-point-configuration.page";
import { Content } from "antd/lib/layout/layout";
import TabPane from "antd/lib/tabs/TabPane";
import { EnumPointConfigurationType } from "themes/theme-2-new/constants/enum";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";

export default function PointConfiguration(props) {
  const [t] = useTranslation();
  const { screenKey } = props;
  const [isReferralDataNotSave, setIsReferralDataNotSave] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nextTab, setNextTab] = useState();
  const pageData = {
    loyaltyTitle: t("loyaltyPoint.title"),
    referralTitle: t("referralPoint.title"),
  };


  const [activeScreen, setActiveScreen] = useState(screenKey ?? EnumPointConfigurationType.LOYALTY.toString());
  const screens = [
    {
      name: pageData.loyaltyTitle,
      key: EnumPointConfigurationType.LOYALTY
    },
    {
      name: pageData.referralTitle,
      key: EnumPointConfigurationType.REFERRAL,
    },
  ];
  const onOk = () => {
    setShowConfirm(false);
    setActiveScreen(nextTab);
    setNextTab();
  }
  const onTabClick = (key, event) => {
    if (activeScreen === EnumPointConfigurationType.REFERRAL.toString() && !isReferralDataNotSave) {
      setShowConfirm(true);
      setNextTab(key);
      event.stopPropagation();
    }
    else {
      setNextTab();
      setActiveScreen(key);
    }
  };
  const onDiscard = () => {
    setShowConfirm(false);
  };
  const renderTagName = (screen) => {
    return (
      <>
        {screen?.name}
      </>
    );
  };
  const renderPointConfig = () => {
    let PointConfigurationComponent = <></>;
    switch (activeScreen) {
      case EnumPointConfigurationType.LOYALTY.toString():
        // eslint-disable-next-line no-const-assign
        PointConfigurationComponent = (<LoyaltyPointConfiguration />);
        break;
      case EnumPointConfigurationType.REFERRAL.toString():
        // eslint-disable-next-line no-const-assign
        PointConfigurationComponent = (<ReferralPointConfiguration setIsDataSave={(isDataSave) => setIsReferralDataNotSave(isDataSave)} />);
        break;
      default:
        break;
    }
    return PointConfigurationComponent;
  };
  return (
    <div className="point-configuration">
      <Tabs renderTabBar={(props, TabNavList) => (
        <TabNavList {...props} mobile={false} />
      )} activeKey={activeScreen} className="transaction-report-tabs" onTabClick={onTabClick} tabPosition={'bottom'}>
        {screens?.map((screen) => {
          return <TabPane tab={renderTagName(screen)} key={screen.key}></TabPane>;
        })}
      </Tabs>
      {renderPointConfig()}
      <DeleteConfirmComponent
        className={"point-configuration-confirm-dialog"}
        visible={showConfirm}
        title={t("leaveDialog.confirmation")}
        content={t("messages.leaveForm")}
        skipPermission={true}
        cancelText={t("button.discard")}
        okText={t("button.confirmLeave")}
        onCancel={onDiscard}
        onOk={onOk}
      />
    </div>
  );
}
