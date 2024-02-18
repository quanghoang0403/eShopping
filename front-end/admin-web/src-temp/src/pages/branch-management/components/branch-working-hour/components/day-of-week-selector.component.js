import { Checkbox, Col, Row } from "antd";
import "../branch-working-hour.scss";
import { CaretDownIcon } from "constants/icons.constants";

export default function DayOfWeekSelectorComponent(props) {
  const { index, title, onCheck, onOpenCustomOption, checked } = props;
  return (
    <div className="day-of-week-box" id={`day-of-week-${index}`}>
      <Row className="w-100">
        <Col span={2}>
          <Checkbox onChange={onCheck} valuePropName="checked" checked={checked}>
            <span>{title}</span>
          </Checkbox>
        </Col>
        <Col span={22} className="icon-box" onClick={onOpenCustomOption}>
          <span class="icon">
            <CaretDownIcon />
          </span>
        </Col>
      </Row>
    </div>
  );
}
