import { Checkbox, Col, Collapse, Form, Row } from "antd";
import { capitalizeFirstLetterEachWord, capitalizeUpperCaseWord } from "../../../utils/helpers";
import "./customization-block.page.scss";

const { Panel } = Collapse;

export default function CustomizationCollapseBlock({
  icon,
  title,
  className,
  content,
  isNormal,
  onChangeCollapse,
  defaultActiveKey,
  iconRight,
  name,
  onClickEyeIcon,
  clickToScroll,
}) {
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

  return (
    <>
      <Collapse
        defaultActiveKey={defaultActiveKey}
        className={`fnb-collapse collapse-customize ${className}`}
        onChangeCollapse={onChangeCollapse}
        expandIcon={() => icon}
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
          header={
            <Row gutter={[0, 0]}>
              <Col sm={2} lg={2} className="color-icon">
                {name && (
                  <>
                    <Form.Item name={[name, "visible"]} valuePropName="checked">
                      <Checkbox className="visible-component">{iconRight}</Checkbox>
                    </Form.Item>
                  </>
                )}
              </Col>
              <Col sm={22} lg={22} className="w-100">
                <div className="header-collapse">{renderTitle()}</div>
              </Col>
            </Row>
          }
        >
          {content}
        </Panel>
      </Collapse>
    </>
  );
}
