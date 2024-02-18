import { Col, Collapse, Row, Tooltip, Typography } from "antd";
import { DownCircleOutlinedIcon, RightCircleOutlinedIcon } from "constants/icons.constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetterEachWord, capitalizeUpperCaseWord } from "utils/helpers";
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
  visible = true,
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
        defaultActiveKey={[defaultActiveKey]}
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
              <Col sm={20} lg={20} className="w-100">
                <Typography.Paragraph ellipsis={{ tooltip: renderTitle() }} className="sub-title">
                  {renderTitle()}
                </Typography.Paragraph>
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
