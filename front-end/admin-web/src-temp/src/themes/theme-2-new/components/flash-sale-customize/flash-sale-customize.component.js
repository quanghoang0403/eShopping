import { useTranslation } from "react-i18next";
import { BucketGeneralCustomizeIcon } from "../../assets/icons.constants";
import PageType from "../../constants/page-type.constants";
import defaultConfig from "../../default-store.config";
import CustomizationCollapseBlock from "../customization-block-component/customization-block.page";
import SelectBackgroundComponent from "../select-background/select-background.component";
import SelectColorGroupComponent from "../select-color-group/select-color-group.component";
import { useEffect } from "react";
import defaultImage from "../../assets/images/background-default-blog-theme-2.png"

export default function FlashSaleCustomizeComponent(props) {
  const { form, clickToScroll } = props;
  const { getFieldsValue } = form;
  const [t] = useTranslation();
  const translateData = {
    generalCustomization: t("onlineStore.introductionConfiguration.generalCustomization", "General customization"),
  };

  const defaultThemePageConfig = defaultConfig?.pages?.find((p) => p.id === PageType.HOME_PAGE);

  useEffect(() => {
    setTimeout(() => {
      setFocusElement(clickToScroll);
    }, 100);
  }, []);

  const setFocusElement = (elementId) => {
    try {
      const element = document.querySelector(elementId);
      if (element) {
        // set border element on focused
        element.className = "tc-on-focus";
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        window.oldElements = elementId;
      }
    } catch {}
  };

  const renderGeneralCustomization = () => {
    return (
      <>
        <SelectBackgroundComponent
          {...props}
          defaultColorPath="config.flashSale.generalCustomization.backgroundColor"
          defaultConfig={defaultConfig}
          formItemPreName={["config", "flashSale", "generalCustomization"]}
          backgroundCustomize={getFieldsValue()?.config?.flashSale?.generalCustomization}
          defaultThemeColor={defaultThemePageConfig?.config?.flashSale?.generalCustomization?.backgroundColor}
          defaultImage={defaultImage}
        />
        <SelectColorGroupComponent {...props} formItemPreName={["config", "flashSale", "generalCustomization"]} />
      </>
    );
  };

  return (
    <CustomizationCollapseBlock
      title={translateData.generalCustomization}
      isNormal={true}
      content={renderGeneralCustomization()}
      defaultActiveKey={1}
      isShowKey={true}
      icon={<BucketGeneralCustomizeIcon />}
      className="customization-block-flash-sale"
      clickToScroll={clickToScroll}
    />
  );
}
