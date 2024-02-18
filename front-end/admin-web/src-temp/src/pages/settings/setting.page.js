import { Row, Space, Tabs } from "antd";
import { Content } from "antd/lib/layout/layout";
import PageTitle from "components/page-title";
import { useState, useRef } from "react";
import "./index.scss";

import barcodeDataService from "data-services/barcode/barcode-data.service";
import billDataService from "data-services/bill-configuration/bill-data.service";
import stampDataService from "data-services/stamp/stamp-data.service";
import storeDataService from "data-services/store/store-data.service";
import orderSlipDataService from "data-services/order-slip-configuration/order-slip-data.service";
import BarcodeConfig from "./barcode";
import DeliveryProvider from "./delivery-provider/deliver-provider.component";
import General from "./general/general.component";
import Localization from "./localization";
import PaymentMethodPage from "./payment-method";
import OtherFoodyPlatformPage from "./other-foody-platform";
import ReceiptPage from "./receipt";
import OrderSlipPage from "./order-slip";
import StampConfig from "./stamp";
import GoogleConfig from "./google-config/google-config.component";
import SmsZaloZnsPage from "./sms-zalo-zns";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";

const { TabPane } = Tabs;

const DEFAULT_SCREEN = "1";

export default function Settings(props) {
  const { t, storeId } = props;
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [activeScreen, setActiveScreen] = useState(DEFAULT_SCREEN);
  const refTab = useRef(DEFAULT_SCREEN);

  const pageData = {
    settings: t("settings.settingsTitle"),
    general: t("store.general"),
    otherFoodyPlatform: t("store.otherFoodyPlatform"),
    deliveryProvider: t("store.deliveryProvider"),
    paymentMethod: t("store.paymentMethod"),
    receipt: t("store.receipt"),
    orderSlip: t("store.orderSlip"),
    stamp: t("stamp.stamp"),
    barcode: t("barcode.barcode"),
    googleConfig: t("googleConfig.title"),
    localization: t("settings.localization"),
    smsZaloZnS: t("settings.smsZaloZnS", "SMS | Zalo ZNS"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
      discardBtn: t("leaveDialog.discard"),
      btnConfirmLeave: t("leaveDialog.confirmLeave"),
    },
  };

  const onChangeForm = (value) => {
    setIsChangeForm(value);
  };

  const handleChangeScreen = (activeKey) => {
    if (isChangeForm) {
      setShowConfirm(true);
      refTab.current = activeKey;
    } else {
      setShowConfirm(false);
      setActiveScreen(activeKey);
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onOk = () => {
    setShowConfirm(false);
    setIsChangeForm(false);
    setActiveScreen(refTab.current);
  };

  const screens = [
    {
      name: pageData.general,
      key: "1",
      component: <General t={t} storeDataService={storeDataService} storeId={storeId} />,
    },
    {
      name: pageData.otherFoodyPlatform,
      key: "2",
      component: <OtherFoodyPlatformPage />,
    },
    {
      name: pageData.deliveryProvider,
      key: "3",
      component: <DeliveryProvider />,
    },
    {
      name: pageData.paymentMethod,
      key: "4",
      component: <PaymentMethodPage />,
    },
    {
      name: pageData.receipt,
      key: "5",
      component: <ReceiptPage t={t} billDataService={billDataService} storeDataService={storeDataService} />,
    },
    {
        name: pageData.orderSlip,
      key: "6",
        component: <OrderSlipPage t={t} orderSlipDataService={orderSlipDataService} />,
    },
    {
      name: pageData.stamp,
      key: "7",
      component: <StampConfig t={t} stampDataService={stampDataService} onChangeForm={onChangeForm} />,
    },
    {
      name: pageData.barcode,
      key: "8",
      component: <BarcodeConfig t={t} barcodeDataService={barcodeDataService} onChangeForm={onChangeForm} />,
    },
    {
      name: pageData.googleConfig,
      key: "9",
      component: <GoogleConfig t={t} storeDataService={storeDataService} />,
    },
    {
      name: pageData.smsZaloZnS,
      key: "10",
      component: <SmsZaloZnsPage />,
    },
    {
      name: pageData.localization,
      key: "11",
      component: <Localization />,
    },
  ];

  const renderScreenContent = () => {
    const screenActive = screens.find((item) => item.key === activeScreen);
    if (screenActive !== null) {
      return screenActive.component;
    }
    return DEFAULT_SCREEN;
  };

  return (
    <div>
      <Content style={{ overflow: "initial" }}>
        <Row className="fnb-row-page-header">
          <Space className="page-title">
            <PageTitle content={pageData.settings} />
          </Space>
          <Space className="page-action-group"></Space>
        </Row>

        <Tabs
          defaultActiveKey={DEFAULT_SCREEN}
          activeKey={activeScreen}
          className="transaction-report-tabs"
          onChange={handleChangeScreen}
        >
          {screens?.map((screen) => {
            return <TabPane tab={screen.name} key={screen.key}></TabPane>;
          })}
        </Tabs>
        <div>{renderScreenContent()}</div>
      </Content>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.leaveDialog.discardBtn}
        okText={pageData.leaveDialog.btnConfirmLeave}
        onCancel={onDiscard}
        onOk={onOk}
        isChangeForm={isChangeForm}
      />
    </div>
  );
}