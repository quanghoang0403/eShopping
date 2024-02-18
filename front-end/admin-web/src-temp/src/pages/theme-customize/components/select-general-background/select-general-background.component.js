import { Col, Form, Radio, Row } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FnbUploadBackgroundImageCustomizeComponent from "themes/theme-1-new/components/fnb-upload-background-image-customize/fnb-upload-background-image-customize";

import SelectColor from "../select-color.component";
import "./select-general-background.component.scss";

const SelectGeneralBackgroundComponent = (props) => {
  const {
    isRequired = false,
    initialData,
    bestDisplay,
    pageConfig,
    formItemPreName,
    backgroundCustomize,
    messRequire,
    colorGroups,
    setValueDefault,
    defaultImage,
    maxSizeUploadMb,
    imgFallbackDefault,
  } = props;
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
    messRequireUploadBackgroundImage: messRequire ?? t("storeWebPage.header.pleaseUploadBackgroundImage"),
  };

  const defaultBestDisplay = bestDisplay ? bestDisplay : "1920 x 1024px";
  const defaultMaxSizeUploadMb = maxSizeUploadMb ? maxSizeUploadMb : 20;
  const [currentBackgroundType, setCurrentBackgroundType] = useState(
    backgroundCustomize?.backgroundType ?? BackgroundType.COLOR
  );
  // update color groups to state from parent
  useEffect(() => {
    if (initialData) {
      setCurrentBackgroundType(backgroundCustomize?.backgroundType);
    }
  }, [initialData]);

  const onChangeImage = (url) => {
    if (!url && defaultImage && setValueDefault) {
      setValueDefault([...formItemPreName, "backgroundImage"], defaultImage);
    }
  };

  return (
    <Row gutter={[8, 16]} align="middle" className="select-background-component">
      <Col span={8}>
        <p>{translateData.background}</p>
      </Col>
      <Col span={16} align="end">
        <Form.Item name={[...formItemPreName, "backgroundType"]}>
          <Radio.Group
            onChange={(item) => setCurrentBackgroundType(item.target.value)}
            defaultValue={backgroundCustomize?.backgroundType}
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
                <SelectColor defaultColor={backgroundCustomize?.backgroundColor} classPopover="popover" />
              </Form.Item>
            </Col>
          </div>
          <>
            <Col span={24}>{translateData.backgroundImage}</Col>
            <Col span={24}>
              <Form.Item
                rules={[{ required: isRequired, message: translateData.messRequireUploadBackgroundImage }]}
                name={[...formItemPreName, "backgroundImage"]}
              >
                <FnbUploadBackgroundImageCustomizeComponent
                  bestDisplay={defaultBestDisplay}
                  maxSizeUploadMb={defaultMaxSizeUploadMb}
                  isRequired={isRequired}
                  onChange={onChangeImage}
                  imgFallbackDefault={imgFallbackDefault}
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
            <Col span={12}>
              <Form.Item name={[...formItemPreName, "backgroundColor"]}>
                <SelectColor defaultColor={backgroundCustomize?.backgroundColor} classPopover="popover" />
              </Form.Item>
            </Col>
          </>
          <div className="d-none">
            <Col span={24}>{translateData.backgroundImage}</Col>
            <Col span={24}>
              <Form.Item
                rules={[{ required: isRequired, message: translateData.messRequireUploadBackgroundImage }]}
                name={[...formItemPreName, "backgroundImage"]}
              >
                <FnbUploadBackgroundImageCustomizeComponent
                  bestDisplay={defaultBestDisplay}
                  maxSizeUploadMb={maxSizeUploadMb}
                  isRequired={isRequired}
                />
              </Form.Item>
            </Col>
          </div>
        </>
      )}
      <Col span={24}>{translateData.selectColorGroup}</Col>
      <Col span={24}>
        <Form.Item
          rules={[{ required: true, message: translateData.pleaseSelectColorGroup }]}
          name={[...formItemPreName, "colorGroupId"]}
        >
          <FnbSelectSingle
            placeholder={translateData.pleaseSelectColorGroup}
            showSearch
            option={colorGroups?.map((b) => ({
              id: b.id,
              name: b?.name,
            }))}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default SelectGeneralBackgroundComponent;
