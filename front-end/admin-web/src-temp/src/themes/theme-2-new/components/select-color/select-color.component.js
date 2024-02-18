import { Col, Row, Tooltip } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CompareColor } from "../../../utils/helpers";
import { ResetBackgroundColorIcon } from "../../assets/icons.constants";
import { FnbColorPicker } from "../fnb-color-picker/fnb-color-picker.component";
// import "./select-color.scss";

export default function SelectColor(props) {
  const { defaultColor = "rgba(255,255,255,1)", colorName, onChange, classPopover, value } = props;
  const [t] = useTranslation();
  const pageData = {
    resetToDefaultColor: t("storeWebPage.color.resetToDefaultColor"),
  };

  useEffect(() => {
    if (value !== undefined) {
      if (onChange) {
        onChange(value);
      }
    }
  }, [value]);

  const onColorChange = (color) => {
    if (onChange) {
      onChange(color);
    }
  };

  const onResetColor = () => {
    if (onChange) {
      onChange(defaultColor);
    }
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
            value={value}
            className={"colorPickerBox"}
            classCustomize={"colorPicker"}
            onChange={onColorChange}
            boxColorStyle={styles}
            classPopover={classPopover}
          />

          {!CompareColor(value, defaultColor) && (
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
