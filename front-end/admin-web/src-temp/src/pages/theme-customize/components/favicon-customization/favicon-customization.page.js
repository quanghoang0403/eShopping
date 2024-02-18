import { Form } from "antd";
import { useTranslation } from "react-i18next";
import FnbUploadBackgroundImageCustomizeComponent from "themes/theme-1-new/components/fnb-upload-background-image-customize/fnb-upload-background-image-customize";

import "./favicon-customization.page.scss";

export default function FaviconCustomization(props) {
  const { bestDisplay, maxSizeUploadMb = 5 } = props;

  const [t] = useTranslation();
  const defaultBestDisplay = bestDisplay ? bestDisplay : "16 x 16px";

  const translateData = {
    favicon: t("media.favicon", "Favicon"),
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadFaviconImage", "Please upload favicon image"),
    maxSizeUploadMb: maxSizeUploadMb,
  };

  return (
    <div className="app-logo-general-customization">
      <Form.Item
        rules={[{ required: true, message: translateData.pleaseUploadBackgroundImage }]}
        name={["general", "favicon"]}
      >
        <FnbUploadBackgroundImageCustomizeComponent
          bestDisplay={defaultBestDisplay}
          maxSizeUploadMb={maxSizeUploadMb}
          acceptType={["ico"]}
          defaultImage={"/images/default-theme/favicon-default.ico"}
          imgFallbackDefault={"/images/default-theme/favicon-default.ico"}
        />
      </Form.Item>
    </div>
  );
}
