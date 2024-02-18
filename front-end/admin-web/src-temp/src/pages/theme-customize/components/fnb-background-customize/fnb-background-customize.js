import { Col, Form, Radio, Row } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbUploadImageCustomizeComponent } from "components/fnb-upload-image-customize/fnb-upload-image-customize";
import { backgroundTypeEnum } from "constants/store-web-page.constants";
import SelectColor from "pages/store-web/components/select-color.component";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./fnb-background-customize.scss";

export function FnbBackgroundCustomizeComponent({
  form,
  prevName,
  storeThemeData,
  primaryColorDefault = "#DB4D29",
  maxSizeUploadMb = 1,
  changeValueOfKey,
  defaultOption,
  bestDisplay,
  parentBlockCustom,
  dataFromCustomize,
}) {
  const [t] = useTranslation();
  const pageData = {
    background: t("storeWebPage.header.background"),
    color: t("storeWebPage.header.color"),
    image: t("storeWebPage.header.image"),
    backgroundColor: t("storeWebPage.header.backgroundColor"),
    backgroundImage: t("storeWebPage.header.backgroundImage"),
    selectColorGroup: t("storeWebPage.header.selectColorGroup"),
    bestDisplayBackgroundImage: t("storeWebPage.header.bestDisplayBackgroundImage"),
    resetToDefaultColor: t("storeWebPage.header.resetToDefaultColor"),
    maxSizeUploadMb: maxSizeUploadMb,
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadBackgroundImage"),
    pleaseSelectColorGroup: t("storeWebPage.header.pleaseSelectColorGroup"),
    pleaseSelectBackgroundColor: t("storeWebPage.header.pleaseSelectBackgroundColor"),
  };
  const defaultValueOption = defaultOption ? defaultOption : backgroundTypeEnum.Color;
  const defaultBestDisplay = bestDisplay ? bestDisplay : "1920 x 84 px";
  const [backgroundType, setBackgroundType] = useState(defaultValueOption);
  const templateObjective = {
    primaryColor: primaryColorDefault,
  };
  const [data, setData] = useState(templateObjective);
  const [colorGroup, setColorGroup] = useState([]);
  const [defaultBackgroundColorHex, setDefaultBackgroundColorHex] = useState(primaryColorDefault);
  const [backgroundImage, setBackgroundImage] = useState([]);

  useEffect(() => {
    if (storeThemeData) {
      const { color } = storeThemeData.storeThemeConfiguration.general;
      if (color) {
        setColorGroup(color.colorGroups);
      }

      if (parentBlockCustom) {
        let objGeneral = storeThemeData?.storeThemeConfiguration[parentBlockCustom];
        let arrName = getFormName();
        if (arrName && objGeneral) {
          arrName.forEach((background) => {
            objGeneral = objGeneral[background];
          });
          setBackgroundType(objGeneral?.backgroundType ?? backgroundType);
          setBackgroundImage(objGeneral?.backgroundImageUrl);
          setDefaultBackgroundColorHex(objGeneral?.backgroundColorHex ?? primaryColorDefault);
        }
      }
    }
  }, [storeThemeData]);

  const onchangeBackgroundType = (value) => {
    setBackgroundType(value);
    changeValueOfKey("backgroundType", value);
  };

  const onchangeColor = (color) => {
    var colorSelect = color ?? primaryColorDefault;
    changeValueOfKey("backgroundColorHex", colorSelect);
    form.setFields([
      {
        name: getFormName("backgroundColorHex"),
        value: color.hex,
      },
    ]);
  };

  const getFormName = (name) => {
    let groupName = [];
    let names = prevName?.split(",");
    if (names) {
      groupName.push(...names);
    }
    if (name) {
      groupName.push(name);
    }
    return groupName;
  };

  const groupFormName = {
    backgroundType: getFormName("backgroundType"),
    colorHex: getFormName("backgroundColorHex"),
    colorGroupId: getFormName("colorGroupId"),
    backgroundImageUrl: getFormName("backgroundImageUrl"),
  };

  const changeImageBackground = (img) => {
    changeValueOfKey("backgroundImageUrl", img);

    form.setFields([
      {
        name: groupFormName.backgroundImageUrl,
        value: img,
      },
    ]);
  }

  return (
    <Row gutter={[8, 16]} align="middle">
      <Col span={4}>{pageData.background}</Col>
      <Col span={20} align="end" className="backgroundType">
        <Form.Item name={groupFormName.backgroundType}>
          <Radio.Group onChange={(item) => onchangeBackgroundType(item.target.value)}>
            <Radio value={backgroundTypeEnum.Color}>{pageData.color}</Radio>
            <Radio value={backgroundTypeEnum.Image} className="radioBackgroundType">
              {pageData.image}
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      {backgroundType === backgroundTypeEnum.Color ? (
        <>
          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: pageData.pleaseSelectBackgroundColor }]}
              name={groupFormName.backgroundColorHex}
            >
              <SelectColor
                defaultColor={defaultBackgroundColorHex}
                colorName={pageData.backgroundColor}
                onChange={onchangeColor}
                classPopover={"popover"}
              ></SelectColor>
            </Form.Item>
          </Col>
        </>
      ) : (
        <>
          <Col span={24}>{pageData.backgroundImage}</Col>
          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: pageData.pleaseUploadBackgroundImage }]}
              name={groupFormName.backgroundImageUrl}
            >
              <FnbUploadImageCustomizeComponent
                bestDisplay={defaultBestDisplay}
                maxSizeUploadMb={pageData.maxSizeUploadMb}
                onChangeImageFinish={(img) => changeImageBackground(img?.url)}
                defaultImage={backgroundImage}
              />
            </Form.Item>
          </Col>
        </>
      )}
      <Col span={24}>{pageData.selectColorGroup}</Col>
      <Col span={24}>
        <Form.Item
          rules={[{ required: true, message: pageData.pleaseSelectColorGroup }]}
          name={groupFormName.colorGroupId}
        >
          <FnbSelectSingle
            placeholder={pageData.pleaseSelectColorGroup}
            showSearch
            onChange={(value) => {
              changeValueOfKey("colorGroupId", value);
            }}
            option={colorGroup?.map((b) => ({
              id: b.id,
              name: b?.name,
            }))}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
