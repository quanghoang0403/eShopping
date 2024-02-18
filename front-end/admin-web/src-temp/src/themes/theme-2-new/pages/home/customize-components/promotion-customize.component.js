import { useTranslation } from "react-i18next";
import { BucketGeneralCustomizeIcon } from "../../../assets/icons.constants";
import PageType from "../../../constants/page-type.constants";
import defaultConfig from "../../../default-store.config";
import CustomizationCollapseBlock from "../../../components/customization-block-component/customization-block.page";
import SelectBackgroundComponent from "../../../components/select-background/select-background.component";
import SelectColorGroupComponent from "../../../components/select-color-group/select-color-group.component";
import { useEffect } from "react";
export default function PromotionCustomizeComponent(props) {
  const { form, clickToScroll } = props;
  const { getFieldsValue } = form;
  const [t] = useTranslation();
  const translateData = {
    generalCustomization: t("onlineStore.introductionConfiguration.generalCustomization", "General customization"),
    title: t("storeWebPage.checkoutPage"),
    header: t("theme.checkoutCustomize.header.title"),
    placeHolder: t("theme.checkoutCustomize.header.placeHolder"),
    checkout: t("theme.checkoutCustomize.checkout.title"),
    titleHeader: t("theme.checkoutCustomize.title"),
    maxSizeUploadMb: 5,
    maxSizeUploadBackgroundImage: 20,
    titleTextComponent: t("onlineStore.introductionConfiguration.promotionElementCustomization"),
    border: {
      header: "#checkoutHeader",
      checkout: "#checkoutCheckout",
    },
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
  const bestDisplay = "1920 x 569 px";
  const renderGeneralCustomization = () => {
    return (
      <>
        <SelectBackgroundComponent
          {...props}
          bestDisplay={bestDisplay}
          defaultColorPath="config.promotionSection.generalCustomization.backgroundColor"
          defaultConfig={defaultConfig}
          formItemPreName={["config", "promotionSection", "generalCustomization"]}
          backgroundCustomize={getFieldsValue()?.config?.promotionSection?.generalCustomization}
          defaultThemeColor={defaultThemePageConfig?.config?.promotionSection?.generalCustomization?.backgroundColor}
        />
        <SelectColorGroupComponent
          {...props}
          formItemPreName={["config", "promotionSection", "generalCustomization"]}
        />
      </>
    );
  };
  const renderComponentBackground = () => {
    return (
      <>
        <SelectBackgroundComponent
          {...props}
          formItemPreName={["config", "promotionSection", "generalComponentCustomization"]}
          backgroundCustomize={getFieldsValue()?.config?.promotionSection?.generalComponentCustomization}
          bestDisplay={bestDisplay}
          maxSizeUploadMb={translateData.maxSizeUploadBackgroundImage}
          defaultThemeColor={
            defaultThemePageConfig?.config?.promotionSection?.generalComponentCustomization?.backgroundColor
          }
        />
      </>
    );
  };
  return (
    <div>
      <CustomizationCollapseBlock
        title={translateData.generalCustomization}
        isNormal={true}
        content={renderGeneralCustomization()}
        defaultActiveKey={1}
        isShowKey={true}
        icon={<BucketGeneralCustomizeIcon />}
        clickToScroll={clickToScroll}
      />
      <CustomizationCollapseBlock
        title={translateData.titleTextComponent}
        isNormal={true}
        content={renderComponentBackground()}
        defaultActiveKey={1}
        isShowKey={true}
        icon={<BucketGeneralCustomizeIcon />}
        clickToScroll={clickToScroll}
      />
    </div>
  );
}
