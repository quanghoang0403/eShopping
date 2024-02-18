import { Col, Row, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { CompareColor } from "../../../utils/helpers";
import { FnbColorPicker } from "../../components/fnb-color-picker/fnb-color-picker.component";
import { ResetBackgroundColorIcon } from "./../../assets/icons.constants";
import "./select-color.scss";

export default function SelectColorDiscountSection(props) {
  const { defaultColor = "rgba(255,255,255,1)", colorName, classPopover, onChange, value } = props;
  const [t] = useTranslation();
  const pageData = {
    resetToDefaultColor: t("storeWebPage.color.resetToDefaultColor"),
  };

  const onResetColor = () => {
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
    <Row align="middle" className="mb-3">
      <Col span={16} className="colorName">
        {colorName}
      </Col>
      <Col span={8}>
        <div className="backgroundBoxDiscountSection">
          <FnbColorPicker
            value={value}
            className={"colorPickerBoxDiscountSection"}
            classCustomize={"colorPickerDiscountSection"}
            onChange={onChange}
            boxColorStyle={styles}
            classPopover={classPopover}
          />

          {value && !CompareColor(value, defaultColor) && (
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
