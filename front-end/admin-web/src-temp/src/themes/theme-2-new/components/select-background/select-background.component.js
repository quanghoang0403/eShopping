import { Col, Form, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FnbUploadBackgroundImageCustomizeComponent from "../fnb-upload-background-image-customize/fnb-upload-background-image-customize";

import SelectColor from "../select-color/select-color.component";
import "./select-background.component.scss";

const SelectBackgroundComponent = (props) => {
  const {
    defaultThemeColor = "rgba(255,255,255,1)",
    bestDisplay,
    pageConfig,
    formItemPreName,
    backgroundCustomize,
    onChangeBackgroundType,
    maxSizeUploadMb,
    defaultImage,
    titleText,
    isImageSelectedDefault = false,
  } = props;
  const BackgroundType = {
    COLOR: 1,
    IMAGE: 2,
  };

  const [t] = useTranslation();
  const translateData = {
    background: titleText == null || titleText == undefined ? t("storeWebPage.header.background") : titleText,
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
  const defaultMaxSizeUploadMb = maxSizeUploadMb ? maxSizeUploadMb : 20;
  const [currentBackgroundType, setCurrentBackgroundType] = useState(
    backgroundCustomize?.backgroundType ?? (isImageSelectedDefault ? BackgroundType.IMAGE : BackgroundType.COLOR),
  );
  const [isErrorShowed, setIsErrorShowed] = useState(false);
  const updateErrorMessage = (msg) => {
    const msgElement = document.getElementById("config_backgroundImage_help");
    if (msgElement && msgElement.firstChild) {
      setIsErrorShowed(true);
      msgElement.firstChild.innerHTML = msg;
    }
  };

  return (
    <Row gutter={[8, 16]} align="middle" className="select-background-component">
      <Col span={4}>
        <p>{translateData.background}</p>
      </Col>
      <Col span={20} align="end">
        <Form.Item name={[...formItemPreName, "backgroundType"]}>
          <Radio.Group
            onChange={(item) => {
              setCurrentBackgroundType(item.target.value);
              if (item.target.value == 1) window.isNotSelectAdvertisementBackground = false;
              if (!onChangeBackgroundType) onChangeBackgroundType(item.target.value);
            }}
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
              <Form.Item name={[...formItemPreName, "backgroundImage"]}>
                <FnbUploadBackgroundImageCustomizeComponent
                  bestDisplay={defaultBestDisplay}
                  maxSizeUploadMb={defaultMaxSizeUploadMb}
                  defaultImage={defaultImage}
                  isErrorShowed={isErrorShowed}
                  isRequired={true}
                  updateErrorMessage={updateErrorMessage}
                  setIsErrorShowed={setIsErrorShowed}
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
              <Form.Item
                rules={[{ required: true, message: translateData.pleaseUploadBackgroundImage }]}
                name={[...formItemPreName, "backgroundImage"]}
              >
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
  );
};

export default SelectBackgroundComponent;
