import { Col, Form, Radio, Row } from "antd";
import SelectColor from "pages/theme-customize/components/select-color.component";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FnbUploadBackgroundImageCustomizeComponent from "themes/theme-1-new/components/fnb-upload-background-image-customize/fnb-upload-background-image-customize";

import "./select-background.component.scss";
import SelectFontFamily from "../SelectFontFamily";

const SelectBackgroundComponent = (props) => {
  const { bestDisplay, initialData, hasSelectFont = false } = props;
  const BackgroundType = {
    COLOR: 1,
    IMAGE: 2,
  };
  const [t] = useTranslation();
  const translateData = {
    background: t("storeWebPage.header.background"),
    color: t("storeWebPage.header.color"),
    image: t("storeWebPage.header.image"),
    backgroundColor: t("storeWebPage.header.backgroundColor"),
    backgroundImage: t("storeWebPage.header.backgroundImage"),
    selectColorGroup: t("storeWebPage.header.selectColorGroup"),
    bestDisplayBackgroundImage: t("storeWebPage.header.bestDisplayBackgroundImage"),
    resetToDefaultColor: t("storeWebPage.header.resetToDefaultColor"),
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadBackgroundImage"),
    pleaseSelectColorGroup: t("storeWebPage.header.pleaseSelectColorGroup"),
    pleaseSelectBackgroundColor: t("storeWebPage.header.pleaseSelectBackgroundColor"),
  };

  const defaultBestDisplay = bestDisplay ? bestDisplay : "1920 x 1024px";
  const maxSizeUploadMb = 20;
  const [currentBackgroundType, setCurrentBackgroundType] = useState(
    initialData?.generalBackground?.backgroundType ?? BackgroundType.IMAGE,
  );

  return (
    <>
      <Row align="middle" className="select-background-general-component">
        <Col span={8} className="select-background-item">
          {translateData.background}
        </Col>
        <Col span={16} align="end" className="select-background-item color-image-radio">
          <Form.Item name={["general", "generalBackground", "backgroundType"]}>
            <Radio.Group
              onChange={(item) => setCurrentBackgroundType(item.target.value)}
              defaultValue={initialData?.generalBackground?.backgroundType}
            >
              <Radio value={BackgroundType.COLOR}>{translateData.color}</Radio>
              <Radio value={BackgroundType.IMAGE}>{translateData.image}</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {currentBackgroundType === BackgroundType.IMAGE ? (
          <>
            <div className="d-none">
              <Col span={12}>{translateData.backgroundColor}</Col>
              <Col span={12}>
                <Form.Item name={["general", "generalBackground", "backgroundColor"]}>
                  <SelectColor
                    defaultColor={initialData?.generalBackground?.backgroundColor || "rgba(255,255,255,1)"}
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
                  rules={[{ required: true, message: translateData.pleaseUploadBackgroundImage }]}
                  name={["general", "generalBackground", "backgroundImage"]}
                >
                  <FnbUploadBackgroundImageCustomizeComponent
                    bestDisplay={defaultBestDisplay}
                    maxSizeUploadMb={maxSizeUploadMb}
                  />
                </Form.Item>
              </Col>
            </>
          </>
        ) : (
          <>
            <>
              <Col span={12}>{translateData.backgroundColor}</Col>
              <Col span={12}>
                <Form.Item name={["general", "generalBackground", "backgroundColor"]}>
                  <SelectColor
                    defaultColor={initialData?.generalBackground?.backgroundColor || "rgba(255,255,255,1)"}
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
                <Form.Item name={["general", "generalBackground", "backgroundImage"]}>
                  <FnbUploadBackgroundImageCustomizeComponent
                    bestDisplay={defaultBestDisplay}
                    maxSizeUploadMb={maxSizeUploadMb}
                  />
                </Form.Item>
              </Col>
            </div>
          </>
        )}
      </Row>
      {hasSelectFont && (
        <Row className="select-background-general-component">
          <Col span={24} className="mb-3">
            {t("text.selectFont")}
          </Col>
          <Col span={24}>
            <Form.Item name={["general", "font", "path"]}>
              <SelectFontFamily />
            </Form.Item>
          </Col>
        </Row>
      )}
    </>
  );
};

export default SelectBackgroundComponent;
