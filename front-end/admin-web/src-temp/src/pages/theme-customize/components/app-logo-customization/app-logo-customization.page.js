import { Form } from "antd";
import { useTranslation } from "react-i18next";
import FnbUploadBackgroundImageCustomizeComponent from "themes/theme-1-new/components/fnb-upload-background-image-customize/fnb-upload-background-image-customize";

import "./app-logo-customization.page.scss";

export default function AppLogoCustomization(props) {
  const { bestDisplay, maxSizeUploadMb = 5 } = props;

  const [t] = useTranslation();
  const defaultBestDisplay = bestDisplay ? bestDisplay : "96 x 96px";

  const translateData = {
    appLogo: t("", "AppLogo"),
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadBackgroundImage", "Please upload logo app"),
    maxSizeUploadMb: maxSizeUploadMb,
  };

  return (
    <div className="app-logo-general-customization">
      <Form.Item
        rules={[{ required: true, message: translateData.pleaseUploadBackgroundImage }]}
        name={["general", "appLogo"]}
      >
        <FnbUploadBackgroundImageCustomizeComponent
          bestDisplay={defaultBestDisplay}
          maxSizeUploadMb={maxSizeUploadMb}
        />
      </Form.Item>
    </div>
  );
}
