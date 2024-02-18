import { Col, Form, Row } from "antd";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbTrashFillIcon } from "components/fnb-trash-fill-icon/fnb-trash-fill-icon";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./color-group.scss";
import CustomizationGroup from "./customization-group-component/customization-group.page";
import SelectColor from "./select-color.component";

export default function ColorGroup(props) {
  const { initialData, onDelete, onChange, index, colorGroupDefault } = props;
  const [t] = useTranslation();
  const pageData = {
    titleColor: t("storeWebPage.color.titleColor"),
    textColor: t("storeWebPage.color.textColor"),
    buttonBackgroundColor: t("storeWebPage.color.buttonBackgroundColor"),
    buttonTextColor: t("storeWebPage.color.buttonTextColor"),
    buttonBorderColor: t("storeWebPage.color.buttonBorderColor"),
    placeholderTitle: t("storeWebPage.color.placeholderTitle"),
    requireTitleMessage: t("storeWebPage.color.requireTitleMessage"),
    colorGroupTitle: t("storeWebPage.color.colorGroupTitle"),
    colorGroupDefaultTitle: t("storeWebPage.color.colorGroupDefaultTitle"),
  };
  const titleDefault =
    initialData?.color?.colorGroups[index]?.name ?? `${pageData.colorGroupTitle} ${index > 0 ? index + 1 : ""}`;
  const [colorGroups, setColorGroups] = useState([]);
  const [titleColor, setTitleColor] = useState(titleDefault);

  useEffect(() => {
    setColorGroups(initialData?.color?.colorGroups);
  }, [initialData]);

  const onChangeTitleColor = (val) => {
    val === "" || val === null ? setTitleColor(titleDefault) : setTitleColor(val);
  };

  return (
    <CustomizationGroup
      defaultActiveKey={1.0}
      title={titleColor}
      icon={index > 0 && <FnbTrashFillIcon />}
      onClickIconRight={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(index);
      }}
      isShowRightIconWhenHoverMouse={true}
      content={
        <>
          <Row className="mb-4">
            <Col span={24}>
              <Form.Item name={[index, "id"]} hidden>
                <FnbInput />
              </Form.Item>
              <Form.Item name={[index, "name"]} rules={[{ required: true, message: pageData.requireTitleMessage }]}>
                <FnbInput
                  placeholder={pageData.placeholderTitle}
                  showCount
                  maxLength={100}
                  onChange={(val) => onChangeTitleColor(val.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name={[index, "titleColor"]} rules={[{ required: true }]}>
            <SelectColor
              value={colorGroups && colorGroups[index]?.titleColor}
              colorName={pageData.titleColor}
              classPopover="select-color-popover"
              defaultColor={colorGroupDefault?.titleColor}
            />
          </Form.Item>

          <Form.Item name={[index, "textColor"]} rules={[{ required: true }]}>
            <SelectColor
              value={colorGroups && colorGroups[index]?.textColor}
              colorName={pageData.textColor}
              classPopover="select-color-popover"
              defaultColor={colorGroupDefault?.textColor}
            />
          </Form.Item>

          <Form.Item name={[index, "buttonBackgroundColor"]} rules={[{ required: true }]}>
            <SelectColor
              value={colorGroups && colorGroups[index]?.buttonBackgroundColor}
              colorName={pageData.buttonBackgroundColor}
              classPopover="select-color-popover"
              defaultColor={colorGroupDefault?.buttonBackgroundColor}
            />
          </Form.Item>

          <Form.Item name={[index, "buttonTextColor"]} rules={[{ required: true }]}>
            <SelectColor
              value={colorGroups && colorGroups[index]?.buttonTextColor}
              colorName={pageData.buttonTextColor}
              classPopover="select-color-popover"
              defaultColor={colorGroupDefault?.buttonTextColor}
            />
          </Form.Item>

          <Form.Item name={[index, "buttonBorderColor"]} rules={[{ required: true }]}>
            <SelectColor
              value={colorGroups && colorGroups[index]?.buttonBorderColor}
              colorName={pageData.buttonBorderColor}
              classPopover="select-color-popover"
              defaultColor={colorGroupDefault?.buttonBorderColor}
            />
          </Form.Item>
        </>
      }
    />
  );
}
