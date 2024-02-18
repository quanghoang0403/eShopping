import { Col, Collapse, Row, Tooltip } from "antd";
import { DownCircleOutlinedIcon, RightCircleOutlinedIcon } from "../../assets/icons.constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetterEachWord, capitalizeUpperCaseWord, randomGuid } from "../../../utils/helpers";
import "./customization-group.component.scss";

const { Panel } = Collapse;

export function CustomizationGroup({
  title,
  className,
  content,
  isNormal,
  onChangeCollapse,
  isShowKey,
  icon,
  isShowRightIconWhenHoverMouse = false,
  onClickIconRight,
  titleIconRight = "button.delete",
  isShowTooltip = false,
  onScrollTo,
  key,
}) {
  const [t] = useTranslation();
  const [isChangeCollapse, setIsChangeCollapse] = useState(isShowKey);
  const [randomId, setRandomId] = useState(Math.random());
  const defaultActiveKey = randomGuid();

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

  return (
    <>
      <Collapse
        key={key}
        defaultActiveKey={defaultActiveKey ? [defaultActiveKey] : ""}
        className={`fnb-collapse sub-collapse-customize ${className}`}
        onChange={(value) => handleChangeCollapse(value)}
        expandIcon={({ isActive }) => (isActive ? <DownCircleOutlinedIcon /> : <RightCircleOutlinedIcon />)}
        activeKey={isChangeCollapse && defaultActiveKey}
      >
        <Panel
          forceRender={true}
          className="fnb-collapse collapse-sub"
          key={defaultActiveKey}
          header={
            <Row gutter={[24, 24]} onMouseOver={onHoverCollapseGroup} onMouseLeave={onLeaveCollapseGroup}>
              <Col sm={4} lg={4} className="col-icon-right w-100">
                <div
                  id={`trash-icon-${randomId}`}
                  className={isShowRightIconWhenHoverMouse ? "display-none-icon text-center" : "text-center"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onClickIconRight) onClickIconRight();
                  }}
                >
                  {isShowTooltip ? (
                    <Tooltip placement="top" title={t(titleIconRight)} color="#50429B" className="icon-right-svg-hover">
                      {icon}
                    </Tooltip>
                  ) : (
                    <span>{icon}</span>
                  )}
                </div>
              </Col>
              <Col sm={18} lg={18} className="w-100">
                <div className="sub-title">{renderTitle()}</div>
              </Col>
            </Row>
          }
        >
          <div className="sub-content">{content}</div>
        </Panel>
      </Collapse>
    </>
  );
}
