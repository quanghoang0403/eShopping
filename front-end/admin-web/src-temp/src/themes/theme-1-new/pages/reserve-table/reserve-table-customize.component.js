import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BucketGeneralCustomizeIcon } from "../../assets/icons.constants";
import CustomizationCollapseBlock from "../../components/customization-block-component/customization-block.page";
import SelectBackgroundComponent from "../../components/select-background.component";
import SelectColorGroupComponent from "../../components/select-color-group.component";
import PageType from "../../constants/page-type.constants";
import defaultConfig from "../../default-store.config";

export default function ReserveTableCustomizeComponent(props) {
  const { form, clickToScroll, pageConfig } = props;
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
          defaultColorPath="config.reservation.generalCustomization.backgroundColor"
          defaultConfig={defaultConfig}
          formItemPreName={["config", "reservation", "generalCustomization"]}
          backgroundCustomize={pageConfig?.config?.reservation?.generalCustomization}
          defaultThemeColor={defaultThemePageConfig?.config?.reservation?.generalCustomization?.backgroundColor}
        />
        <SelectColorGroupComponent {...props} formItemPreName={["config", "reservation", "generalCustomization"]} />
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
      className="customization-block-reserve-table"
      clickToScroll={clickToScroll}
    />
  );
}
