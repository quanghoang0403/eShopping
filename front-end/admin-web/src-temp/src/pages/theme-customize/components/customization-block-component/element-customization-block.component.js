import { Checkbox, Col, Collapse, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { capitalizeFirstLetterEachWord, capitalizeUpperCaseWord } from "utils/helpers";
import "./customization-block.page.scss";

const { Panel } = Collapse;

export default function ElementCustomizationCollapseBlock({
  icon,
  title,
  className,
  content: Component,
  isNormal,
  onChangeCollapse,
  defaultActiveKey,
  iconRight,
  name,
  clickToScroll,
  onClickHeader,
  collapsible, // options: header | icon | disabled
  props,
  customizeKey,
  pageConfigName,
  isShowRightIconWhenHoverMouse = false,
}) {
  const [randomId, setRandomId] = useState(Math.random());
  /**
   * return a string with option
   * case true: a string format normal (ex: today -> today)
   * case false: a string format uppercase (ex: today -> TODAY)
   * default: a string format Today (ex: today -> Today)
   */

  useEffect(() => {
    if (pageConfigName && pageConfigName !== "") {
      const config = props?.pageConfig?.config;
      if (config) {
        const visible = config[pageConfigName]?.visible;
        onChangeIconRight(visible, true);
      }
    }
  }, []);

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
  const removeOldFocusElement = () => {
    // Remove old focus
    let oldElementId = window.oldElements;
    const oldElement = document.querySelector(oldElementId);
    if (oldElement) {
      oldElement.className = "";
    }
  };

  const setFocusElement = (elementId) => {
    try {
      const element = document.querySelector(elementId);
      if (element) {
        // set border element on focused
        element.className = "tc-on-focus";
        element.scrollIntoView({ behavior: "smooth" });
        window.oldElements = elementId;
      }
    } catch {}
  };

  const onHoverCollapseGroup = (event) => {
    if (isShowRightIconWhenHoverMouse === true) {
      let trashControl = document.getElementById(`eye-icon-${randomId}`);
      trashControl.setAttribute("style", "display: block !important");
    }
  };

  const onLeaveCollapseGroup = (event) => {
    if (isShowRightIconWhenHoverMouse === true) {
      let trashControl = document.getElementById(`eye-icon-${randomId}`);
      trashControl.setAttribute("style", "display: none !important");
    }
  };

  const onChangeIconRight = (event, isCheckFirstTime) => {
    if (customizeKey) {
      const isShowComponent = isCheckFirstTime === true ? event : event.target.checked;
      const panel = document.getElementById(`collapse-panel-${customizeKey}`)?.childNodes[0];
      if (panel) {
        let icon = panel.childNodes[0];
        let text = panel.childNodes[1];
        if (isShowComponent) {
          icon.setAttribute("style", "opacity: 1 !important");
          text.setAttribute("style", "opacity: 1 !important");
        } else {
          icon.setAttribute("style", "opacity: 0.5 !important");
          text.setAttribute("style", "opacity: 0.5 !important");
        }
      }
    }
  };

  return (
    <>
      <Collapse
        defaultActiveKey={defaultActiveKey}
        className={`fnb-collapse collapse-customize ${className}`}
        onChangeCollapse={onChangeCollapse}
        expandIcon={() => icon}
        collapsible={collapsible}
        accordion
      >
        <Panel
          onClick={() => {
            removeOldFocusElement();
            setFocusElement(clickToScroll);
          }}
          className="fnb-collapse collapse-sub"
          forceRender={true}
          key={defaultActiveKey}
          collapsible={collapsible}
          id={customizeKey && `collapse-panel-${customizeKey}`}
          header={
            <Row gutter={[24, 24]} onMouseOver={onHoverCollapseGroup} onMouseLeave={onLeaveCollapseGroup}>
              <Col sm={2} lg={2} className="color-icon">
                {name && (
                  <span id={`eye-icon-${randomId}`} className={isShowRightIconWhenHoverMouse && "d-none"}>
                    <Form.Item name={[...name, "visible"]} valuePropName="checked">
                      <Checkbox className="visible-component" onChange={(e) => onChangeIconRight(e, false)}>
                        {iconRight}
                      </Checkbox>
                    </Form.Item>
                  </span>
                )}
              </Col>
              <Col sm={20} lg={20} className="w-100">
                <div className={`header-collapse ${customizeKey}`} onClick={onClickHeader}>
                  {renderTitle()}
                </div>
              </Col>
            </Row>
          }
        >
          <Component {...props} />
        </Panel>
      </Collapse>
    </>
  );
}
