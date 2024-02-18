import { useTranslation } from "react-i18next";
import { BucketGeneralCustomizeIcon, StoreWebBannerGeneralCustomizationIcon } from "../../../assets/icons.constants";
import PageType from "../../../constants/page-type.constants";
import defaultConfig from "../../../default-store.config";
import CustomizationCollapseBlock from "../../../components/customization-block-component/customization-block.page";
import SelectBackgroundComponent from "../../../components/select-background.component";
import SelectColorGroupComponent from "../../../components/select-color-group.component";
import { useEffect } from "react";
import SelectBackgroundComponentDiscountSection from "../../../components/select-background-discount-section.component";
import backgroundDiscountDefaultImage from "../../../assets/images/background-discount-logo.png";

export default function PromotionCustomizeComponent(props) {
  const { form, clickToScroll } = props;
  const { getFieldsValue } = form;
  const [t] = useTranslation();
  const translateData = {
    generalCustomization: t("onlineStore.introductionConfiguration.generalCustomization", "General customization"),
    promotionElementCustomization: t(
      "onlineStore.introductionConfiguration.promotionElementCustomization",
      "Promotion element customization",
    ),
  };
  const displayBackgroundComponent = "1920 x 459 px";
  const displayBackgroundComponentElement = "1556 x 411 px";

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

  const renderGeneralCustomizationDiscountSection = () => {
    return (
      <>
        <SelectBackgroundComponentDiscountSection
          {...props}
          defaultColorPath="config.promotionSection.generalCustomization.backgroundColorDiscountSection"
          defaultConfig={defaultConfig}
          formItemPreName={["config", "promotionSection", "generalCustomization"]}
          backgroundCustomize={getFieldsValue()?.config?.promotionSection?.generalCustomization}
          defaultThemeColor={defaultThemePageConfig?.config?.promotionSection?.generalCustomization?.backgroundColor}
          bestDisplay={displayBackgroundComponentElement}
          defaultImage={backgroundDiscountDefaultImage}
        />
      </>
    );
  };

  const renderGeneralCustomization = () => {
    return (
      <>
        <SelectBackgroundComponent
          {...props}
          defaultColorPath="config.promotionSection.generalCustomization.backgroundColor"
          defaultConfig={defaultConfig}
          formItemPreName={["config", "promotionSection", "generalCustomization"]}
          backgroundCustomize={getFieldsValue()?.config?.promotionSection?.generalCustomization}
          defaultThemeColor={defaultThemePageConfig?.config?.promotionSection?.generalCustomization?.backgroundColor}
          bestDisplay={displayBackgroundComponent}
          isRequired={true}
        />
        <SelectColorGroupComponent
          {...props}
          formItemPreName={["config", "promotionSection", "generalCustomization"]}
        />
      </>
    );
  };

  return (
    <>
      <CustomizationCollapseBlock
        title={translateData.generalCustomization}
        isNormal={true}
        content={renderGeneralCustomization()}
        defaultActiveKey={1}
        isShowKey={true}
        icon={<BucketGeneralCustomizeIcon />}
        className="customization-block-promotion-section"
        clickToScroll={clickToScroll}
      />
      <CustomizationCollapseBlock
        title={translateData.promotionElementCustomization}
        isNormal={true}
        content={renderGeneralCustomizationDiscountSection()}
        defaultActiveKey={1}
        isShowKey={true}
        icon={<BucketGeneralCustomizeIcon />}
        className="customization-block-promotion-section"
        clickToScroll={clickToScroll}
      />
    </>
  );
}
