import { Col, Form, Radio, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FnbUploadBackgroundImageCustomizeComponent from "./fnb-upload-background-image-customize/fnb-upload-background-image-customize";
import "./select-background.component.scss";
import SelectColor from "./select-color/select-color.component";

const SelectBackgroundComponent = (props) => {
  const {
    defaultThemeColor = "rgba(255,255,255,1)",
    bestDisplay,
    pageConfig,
    formItemPreName,
    nameComponents = null,
    backgroundCustomize,
    maxSizeUploadMb,
    isImageSelectedDefault = false,
    isRequired,
    defaultImage,
  } = props;
  const BackgroundType = {
    COLOR: 1,
    IMAGE: 2,
  };
  const [t] = useTranslation();
  const translateData = {
    background: t("storeWebPage.header.background", "Background"),
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
  const defaultBestDisplay = bestDisplay ? bestDisplay : "1920 x 1024px";
  const maxSizeUploadDefault = maxSizeUploadMb ? maxSizeUploadMb : 20;
  const [currentBackgroundType, setCurrentBackgroundType] = useState(
    backgroundCustomize?.backgroundType ?? (isImageSelectedDefault ? BackgroundType.IMAGE : BackgroundType.COLOR),
  );

  return (
    <Row align="middle" className="select-background-component">
      <Col span={8} className="select-background-item">
        <p>{translateData.background}</p>
      </Col>
      <Col span={16} align="end" className="select-background-item color-image-radio">
        <Form.Item name={[...formItemPreName, "backgroundType"]}>
          <Radio.Group
            onChange={(item) => setCurrentBackgroundType(item.target.value)}
            defaultValue={
              backgroundCustomize?.backgroundType ??
              (isImageSelectedDefault ? BackgroundType.IMAGE : BackgroundType.COLOR)
            }
          >
            <Radio value={BackgroundType.COLOR}>
              <p>{translateData.color}</p>
            </Radio>
            <Radio value={BackgroundType.IMAGE}>
              <p>{translateData.image}</p>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      {currentBackgroundType === BackgroundType.IMAGE ? (
        <>
          <div className="d-none">
            <Col span={12}>{translateData.backgroundColor}</Col>
            <Col span={12}>
              <Form.Item name={[...formItemPreName, "backgroundColor"]}>
                <SelectColor
                  defaultColor={defaultThemeColor ?? backgroundCustomize?.backgroundColor}
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
                rules={[
                  {
                    required: isRequired,
                    message: translateData.pleaseUploadBackgroundImage,
                  },
                ]}
                name={[...formItemPreName, "backgroundImage"]}
              >
                <FnbUploadBackgroundImageCustomizeComponent
                  bestDisplay={defaultBestDisplay}
                  maxSizeUploadMb={maxSizeUploadDefault}
                  isRequired={isRequired}
                  nameComponents={nameComponents}
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
              <Form.Item name={[...formItemPreName, "backgroundColor"]}>
                <SelectColor
                  defaultColor={defaultThemeColor ?? backgroundCustomize?.backgroundColor}
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
              <Form.Item name={[...formItemPreName, "backgroundImage"]}>
                <FnbUploadBackgroundImageCustomizeComponent
                  bestDisplay={defaultBestDisplay}
                  maxSizeUploadMb={maxSizeUploadDefault}
                  isRequired={isRequired}
                  nameComponents={nameComponents}
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

export default SelectBackgroundComponent;
