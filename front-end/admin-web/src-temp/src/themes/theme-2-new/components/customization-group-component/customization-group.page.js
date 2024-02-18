import { Col, Collapse, Row, Tooltip } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetterEachWord, capitalizeUpperCaseWord } from "../../../utils/helpers";
import { DownCircleOutlinedIcon, RightCircleOutlinedIcon } from "../../assets/icons.constants";
import "./customization-group.page.scss";

const { Panel } = Collapse;

export default function CustomizationGroup({
  title,
  className,
  content,
  isNormal,
  onChangeCollapse,
  defaultActiveKey,
  isShowKey,
  icon,
  isShowRightIconWhenHoverMouse = false,
  onClickIconRight,
  titleIconRight = "button.delete",
  isShowTooltip = false,
  onScrollTo,
  clickToScroll,
  customizeKey,
}) {
  const [t] = useTranslation();
  const [isChangeCollapse, setIsChangeCollapse] = useState(isShowKey);
  const [randomId, setRandomId] = useState(Math.random());
  /**
   * return a string with option
   * case true: a string format normal (ex: today -> today)
   * case false: a string format uppercase (ex: today -> TODAY)
   * default: a string format Today (ex: today -> Today)
   */
  const renderTitle = () => {
    switch (isNormal) {
      case true:
        return title;
      case false:
        return capitalizeUpperCaseWord(title);
      default:
        return capitalizeFirstLetterEachWord(title);
    }
  };
  const handleChangeCollapse = (value) => {
    if (isShowKey?.length > 0) {
      value = isShowKey === true ? defaultActiveKey : value;
      onChangeCollapse(value);
      setIsChangeCollapse(isShowKey);
    } else {
      setIsChangeCollapse(!isChangeCollapse);
    }
  };

  const onHoverCollapseGroup = (event) => {
    if (isShowRightIconWhenHoverMouse === true) {
      let trashControl = document.getElementById(`trash-icon-${randomId}`);
      trashControl.setAttribute("style", "display: block !important");
    }
  };

  const onLeaveCollapseGroup = (event) => {
    if (isShowRightIconWhenHoverMouse === true) {
      let trashControl = document.getElementById(`trash-icon-${randomId}`);
      trashControl.setAttribute("style", "display: none !important");
    }
  };

  const removeOldFocusElement = () => {
    // Remove old focus
    let oldElementId = window.oldElements;
    const oldElement = document.querySelector(oldElementId);
    if (oldElement) {
      oldElement.setAttribute("style", "border: none;");
    }
  };

  const setFocusElement = (elementId) => {
    try {
      const element = document.querySelector(elementId);
      if (element) {
        // set border element on focused
        element.setAttribute("style", "border: 5px solid #50429b !important;");
        element.scrollIntoView({ behavior: "smooth" });
        window.oldElements = elementId;
      }
    } catch {}
  };

  return (
    <>
      <Collapse
        defaultActiveKey={defaultActiveKey}
        className={`fnb-collapse sub-collapse-customize ${className}`}
        onChange={(value) => handleChangeCollapse(value)}
        expandIcon={({ isActive }) => (isActive ? <DownCircleOutlinedIcon /> : <RightCircleOutlinedIcon />)}
      >
        <Panel
          forceRender={true}
          className="fnb-collapse collapse-sub"
          key={defaultActiveKey}
          header={
            <Row gutter={[24, 24]} onMouseOver={onHoverCollapseGroup} onMouseLeave={onLeaveCollapseGroup}>
              <Col sm={2} lg={2} className="col-icon-right">
                <span
                  id={`trash-icon-${randomId}`}
                  className={isShowRightIconWhenHoverMouse && "display-none-icon"}
                  onClick={onClickIconRight}
                >
                  {isShowTooltip ? (
                    <Tooltip placement="top" title={t(titleIconRight)} color="#50429B" className="icon-right-svg-hover">
                      {icon}
                    </Tooltip>
                  ) : (
                    <span>{icon}</span>
                  )}
                </span>
              </Col>
              <Col sm={20} lg={20} className={`w-100 ${customizeKey}`}>
                <div className="sub-title">{renderTitle()}</div>
              </Col>
            </Row>
          }
          onClick={() => {
            removeOldFocusElement();
            setFocusElement(clickToScroll);
          }}
        >
          <div className="sub-content">{content}</div>
        </Panel>
      </Collapse>
    </>
  );
}
