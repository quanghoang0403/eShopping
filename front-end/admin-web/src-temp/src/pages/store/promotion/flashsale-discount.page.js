import { Tabs } from "antd";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { hasPermission } from "utils/helpers";
import DiscountCodeManagement from "./list-discount-code/list-discount-code.page";
import FlashSaleManagement from "./list-flashsale/list-flashsale.page";
import PromotionManagement from "./list-promotion/list-promotion.page";
import { IconButtonComponent } from "components/icon-button/icon-button";
import { useState, useEffect } from "react";
import { StoreGeneralConfigSettingIcon } from "constants/icons.constants";
import promotionConfigDataService from "data-services/promotion-config/promotion-config-data.service";
import PromotionConfig from "./components/PromotionConfig";
import { PromotionTabKey, PromotionTabLabel } from "constants/promotion.constants";

const { TabPane } = Tabs;

export default function FlashSaleDiscount(props) {
  const [t] = useTranslation();
  const [isVisiblePromotionConfigModal, setIsVisiblePromotionConfigModal] = useState(false);
  const [promotionConfig, setPromotionConfig] = useState(null);
  const pageData = {
    flashSaleTitle: t("promotion.flashSale.tabTitle"),
    discountTitle: t("promotion.discount.tabTitle"),
    discountCodeTitle: t("discountCode.title"),
    setting: t("topBar.setting"),
  };

  useEffect(() => {
    promotionConfigDataService.getPromotionConfigAsync().then((res) => {
      setPromotionConfig(res);
    });
  }, []);

  const handleVisiblePromotionConfig = (visible) => {
    setIsVisiblePromotionConfigModal(visible);
  };

  const getDefaultActiveKey = (activeKey) => {
    switch (activeKey?.toLowerCase()) {
      case PromotionTabLabel.FlashSale:
        return PromotionTabKey.FlashSale;
      case PromotionTabLabel.DiscountCode:
        return PromotionTabKey.DiscountCode;
      default:
        return PromotionTabKey.Discount;
    }
  };

  return (
    <>
      <Tabs
        defaultActiveKey={getDefaultActiveKey(props?.match?.params?.tabName)}
        className="transaction-report-tabs"
        tabBarExtraContent={
          <IconButtonComponent
            className="action-button-space mr-0"
            onClick={() => handleVisiblePromotionConfig(true)}
            permission={PermissionKeys.ADMIN}
            titleTooltip={pageData.setting}
            icon={<StoreGeneralConfigSettingIcon className="icon-svg-hover" />}
          />
        }
      >
        {hasPermission(PermissionKeys.VIEW_PROMOTION) && (
          <TabPane tab={pageData.discountTitle} key="1">
            <div className="clearfix"></div>
            <PromotionManagement />
          </TabPane>
        )}
        {hasPermission(PermissionKeys.VIEW_FLASH_SALE) && (
          <TabPane tab={pageData.flashSaleTitle} key="2">
            <div className="clearfix"></div>
            <FlashSaleManagement />
          </TabPane>
        )}
        {hasPermission(PermissionKeys.VIEW_DISCOUNT_CODE) && (
          <TabPane tab={pageData.discountCodeTitle} key="3">
            <div className="clearfix"></div>
            <DiscountCodeManagement />
          </TabPane>
        )}
      </Tabs>

      <PromotionConfig
        open={isVisiblePromotionConfigModal}
        config={promotionConfig}
        onCancel={() => handleVisiblePromotionConfig(false)}
      />
    </>
  );
}
