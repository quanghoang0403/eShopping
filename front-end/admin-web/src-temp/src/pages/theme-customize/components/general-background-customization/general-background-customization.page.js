import { useTranslation } from "react-i18next";
import SelectBackgroundComponent from "../select-background-component/select-background.component";

import "./general-background-customization.page.scss";

export default function GeneralBackgroundCustomization(props) {
  const { initialData } = props;

  const [t] = useTranslation();
  const translateData = {
    general: t("", "General"),
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadBackgroundImage", "Please upload logo app"),
    background: t("storeWebPage.header.background"),
    color: t("storeWebPage.header.color"),
    image: t("storeWebPage.header.image"),
    backgroundColor: t("storeWebPage.header.backgroundColor"),
    backgroundImage: t("storeWebPage.header.backgroundImage"),
    bestDisplayBackgroundImage: t("storeWebPage.header.bestDisplayBackgroundImage"),
    resetToDefaultColor: t("storeWebPage.header.resetToDefaultColor"),
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadBackgroundImage"),
    pleaseSelectBackgroundColor: t("storeWebPage.header.pleaseSelectBackgroundColor"),
  };

  return (
    <div className="general-background-customization">
      <SelectBackgroundComponent {...props} />
    </div>
  );
}
