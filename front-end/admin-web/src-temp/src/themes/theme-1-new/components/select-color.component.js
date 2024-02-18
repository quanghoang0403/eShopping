import { Col, Row, Tooltip } from "antd";
import { FnbColorPicker } from "components/fnb-color-picker/fnb-color-picker.component";
import { ResetBackgroundColorIcon } from "constants/icons.constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./select-color.scss";

export default function SelectColor(props) {
  const { defaultColor, colorName, onChange, classPopover, value } = props;
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [t] = useTranslation();
  const pageData = {
    resetToDefaultColor: t("storeWebPage.color.resetToDefaultColor"),
  };
  useEffect(() => {
    setSelectedColor(value);
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedColor(value);
      onChange(value);
    }
  }, [value]);

  useEffect(() => {
    setSelectedColor(defaultColor);
  }, [defaultColor]);

  const onColorChange = (color) => {
    setSelectedColor(color);
    onChange(color);
  };

  const onResetColor = () => {
    setSelectedColor(defaultColor);
    onChange(defaultColor);
  };

  const tooltipContent = () => {
    return (
      <div className="tooltipBox">
        <div className="tooltipText">{pageData.resetToDefaultColor}</div>
      </div>
    );
  };

  const styles = {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
  };

  return (
    <Row align="middle">
      <Col span={16} className="colorName">
        {colorName}
      </Col>
      <Col span={8}>
        <div className="backgroundBox">
          <FnbColorPicker
            value={selectedColor}
            className={"colorPickerBox"}
            classCustomize={"colorPicker"}
            onChange={onColorChange}
            boxColorStyle={styles}
            classPopover={classPopover}
          />

          {selectedColor !== defaultColor && (
            <div className="buttonResetColor">
              <Tooltip placement="top" title={tooltipContent}>
                <ResetBackgroundColorIcon className="resetBackgroundColorIcon" onClick={onResetColor} />
              </Tooltip>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
}
