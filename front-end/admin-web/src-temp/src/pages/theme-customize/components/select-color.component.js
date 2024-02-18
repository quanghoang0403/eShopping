import { Col, Row, Tooltip } from "antd";
import { FnbColorPicker } from "components/fnb-color-picker/fnb-color-picker.component";
import { NoneColorIcon, ResetBackgroundColorIcon } from "constants/icons.constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./select-color.scss";

export default function SelectColor(props) {
  const { defaultColor = "rgba(255,255,255,1)", colorName, onChange, classPopover, value } = props;
  const [t] = useTranslation();
  const pageData = {
    resetToDefaultColor: t("storeWebPage.color.resetToDefaultColor"),
  };
  const [isVisibleNonColor, setIsVisibleNonColor] = useState(false);
  const [isVisibleSelectColor, setIsVisibleSelectColor] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      if (onChange) {
        onChange(value);
      }
      if (value === "transparent") {
        setIsVisibleNonColor(true);
      }
    }
  }, [value]);

  useEffect(() => {
    if (!isVisibleSelectColor && value === "transparent") {
      setIsVisibleNonColor(true);
    }
  }, [isVisibleSelectColor]);

  const onColorChange = (color) => {
    if (onChange) {
      onChange(color);
    }
  };

  const onResetColor = () => {
    if (onChange) {
      onChange(defaultColor);
    }
    if (isVisibleNonColor && value !== "transparent") {
      setIsVisibleNonColor(false);
    }
  };

  const tooltipContent = () => {
    return (
      <div className="tooltipBox">
        <div className="tooltipText">{pageData.resetToDefaultColor}</div>
      </div>
    );
  };

  const openSelectColor = () => {
    setIsVisibleNonColor(false);
    setIsVisibleSelectColor(true);
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
          {isVisibleNonColor ? (
            <>
              <NoneColorIcon
                onClick={() => {
                  openSelectColor();
                }}
                className="cursor-none-color"
              />
              {value !== defaultColor && (
                <div className="buttonResetColor">
                  <Tooltip placement="top" title={tooltipContent}>
                    <ResetBackgroundColorIcon className="resetBackgroundColorIcon" onClick={onResetColor} />
                  </Tooltip>
                </div>
              )}
            </>
          ) : (
            <>
              <FnbColorPicker
                value={value}
                className={"colorPickerBox"}
                classCustomize={"colorPicker"}
                onChange={onColorChange}
                boxColorStyle={styles}
                classPopover={classPopover}
                showColorPicker={isVisibleSelectColor}
                setIsVisibleSelectColor={setIsVisibleSelectColor}
              />
              {value !== defaultColor && (
                <div className="buttonResetColor">
                  <Tooltip placement="top" title={tooltipContent}>
                    <ResetBackgroundColorIcon className="resetBackgroundColorIcon" onClick={onResetColor} />
                  </Tooltip>
                </div>
              )}
            </>
          )}
        </div>
      </Col>
    </Row>
  );
}
