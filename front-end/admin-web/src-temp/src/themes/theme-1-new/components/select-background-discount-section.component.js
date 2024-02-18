import { Col, Form, Radio, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./select-background-discount-section.scss";
import SelectColorDiscountSection from "./select-color/select-color-discount-section.component";
import FnbUploadBackgroundImageDiscountSectionCustomizeComponent from "./fnb-upload-background-image-customize/fnb-upload-background-discount-section-image-customize";

const SelectBackgroundComponentDiscountSection = (props) => {
  const {
    defaultThemeColor = "rgba(255,255,255,1)",
    bestDisplay,
    pageConfig,
    formItemPreName,
    backgroundCustomize,
    maxSizeUploadMb,
    isRequired = true,
    defaultImage
  } = props;
  const BackgroundTypeDiscountSection = {
    COLOR: 1,
    IMAGE: 2,
  };
  const [t] = useTranslation();
  const translateData = {
    background: t("storeWebPage.header.componentBackground", "Component's background"),
    color: t("storeWebPage.header.color", "Color"),
    image: t("storeWebPage.header.image", "Image"),
    backgroundColor: t("storeWebPage.header.backgroundColor", "Background color"),
    backgroundImage: t("storeWebPage.header.backgroundImage", "Background image"),
    selectColorGroup: t("storeWebPage.header.selectColorGroup", "Select color group"),
    bestDisplayBackgroundImage: t("storeWebPage.header.bestDisplayBackgroundImage"),
    resetToDefaultColor: t("storeWebPage.header.resetToDefaultColor", "Reset to default color"),
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadBackgroundImage", "Please upload background image"),
    pleaseSelectColorGroup: t("storeWebPage.header.pleaseSelectColorGroup", "Please select color group"),
    pleaseSelectBackgroundColor: t("storeWebPage.header.pleaseSelectBackgroundColor", "Please select background color"),
  };
  const defaultBestDisplay = bestDisplay ? bestDisplay : "1556 x 411px";
  const maxSizeUploadDefault = maxSizeUploadMb ? maxSizeUploadMb : 20;
  const [currentBackgroundTypeDiscountSection, setCurrentBackgroundTypeDiscountSection] = useState(
    backgroundCustomize?.backgroundTypeDiscountSection ?? BackgroundTypeDiscountSection.IMAGE,
  );

  return (
    <Row align="middle" className="select-background-component">
      <Col span={8} className="select-background-item">
        <p>{translateData.background}</p>
      </Col>
      <Col span={16} align="end" className="select-background-item color-image-radio">
        <Form.Item name={[...formItemPreName, "backgroundTypeDiscountSection"]}>
          <Radio.Group
            onChange={(item) => setCurrentBackgroundTypeDiscountSection(item.target.value)}
            defaultValue={backgroundCustomize?.BackgroundTypeDiscountSection ?? BackgroundTypeDiscountSection.COLOR}
          >
            <Radio value={BackgroundTypeDiscountSection.COLOR}>
              <p>{translateData.color}</p>
            </Radio>
            <Radio value={BackgroundTypeDiscountSection.IMAGE}>
              <p>{translateData.image}</p>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      {currentBackgroundTypeDiscountSection === BackgroundTypeDiscountSection.IMAGE ? (
        <>
          <div className="d-none">
            <Col span={12}>{translateData.backgroundColor}</Col>
            <Col span={12}>
              <Form.Item name={[...formItemPreName, "backgroundColorDiscountSection"]}>
                <SelectColorDiscountSection
                  defaultColor={defaultThemeColor ?? backgroundCustomize?.backgroundColorDiscountSection}
                  classPopover="popover"
                />
              </Form.Item>
            </Col>
          </div>
          <>
            <Col span={24} className="mb-3">
              {translateData.backgroundImage}
            </Col>
            <Col span={24}>
              <Form.Item
                className="background-section-image"
                rules={[{ required: isRequired, message: translateData.pleaseUploadBackgroundImage }]}
                name={[...formItemPreName, "backgroundImageDiscountSection"]}
              >
                <FnbUploadBackgroundImageDiscountSectionCustomizeComponent
                  bestDisplay={defaultBestDisplay}
                  maxSizeUploadMb={maxSizeUploadDefault}
                  isRequired={isRequired}
                  defaultImage={defaultImage}
                />
              </Form.Item>
            </Col>
          </>
        </>
      ) : (
        <>
          <>
            <Col span={12}>{translateData.backgroundColor}</Col>
            <Col span={12} className="select-color-general">
              <Form.Item name={[...formItemPreName, "backgroundColorDiscountSection"]}>
                <SelectColorDiscountSection
                  defaultColor={defaultThemeColor ?? backgroundCustomize?.backgroundColorDiscountSection}
                  classPopover="popover"
                />
              </Form.Item>
            </Col>
          </>
          <div className="d-none">
            <Col span={24} className="mb-3">
              {translateData.backgroundImage}
            </Col>
            <Col span={24}>
              <Form.Item
                name={[...formItemPreName, "backgroundImageDiscountSection"]}
                rules={[
                  {
                    required: isRequired,
                    message: translateData.pleaseUploadBackgroundImage,
                  },
                ]}
              >
                <FnbUploadBackgroundImageDiscountSectionCustomizeComponent
                  bestDisplay={defaultBestDisplay}
                  maxSizeUploadMb={maxSizeUploadDefault}
                  isRequired={isRequired}
                  defaultImage={defaultImage}
                />
              </Form.Item>
            </Col>
          </div>
        </>
      )}
    </Row>
  );
};

export default SelectBackgroundComponentDiscountSection;
