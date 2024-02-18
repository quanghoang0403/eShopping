import { Col, Collapse, Row, Tooltip } from "antd";
import { SectionCollapseArrowDownIcon, SectionCollapseArrowRightIcon } from "../../../assets/icons.constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetterEachWord, capitalizeUpperCaseWord } from "../../../../utils/helpers";
import "./section-collapse.scss";

const { Panel } = Collapse;

export default function SectionCollapse({
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

  return (
    <>
      <Collapse
        defaultActiveKey={defaultActiveKey}
        className={`fnb-collapse section-collapse-customize ${className}`}
        onChange={(value) => handleChangeCollapse(value)}
        expandIcon={({ isActive }) => (isActive ? <SectionCollapseArrowDownIcon /> : <SectionCollapseArrowRightIcon />)}
      >
        <Panel
          className="fnb-collapse collapse-sub"
          key={defaultActiveKey}
          forceRender={true}
          header={
            <Row gutter={[24, 24]} onMouseOver={onHoverCollapseGroup} onMouseLeave={onLeaveCollapseGroup}>
              <Col sm={2} lg={2} className="col-icon-right">
                <span
                  id={`trash-icon-${randomId}`}
                  className={isShowRightIconWhenHoverMouse && "display-none-icon"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClickIconRight();
                  }}
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
              <Col sm={20} lg={20} className="w-100">
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
