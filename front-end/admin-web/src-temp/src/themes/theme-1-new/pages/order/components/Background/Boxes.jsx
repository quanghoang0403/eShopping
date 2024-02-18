import { Col, Row } from "antd";
import { useMemo } from "react";
import BottomBox from "./BottomBox";
import TopBox from "./TopBox";

function Boxes(props) {
  const { total = 5 } = props;
  const isSmallSize = total < 4;
  const topBoxes = useMemo(() => {
    if (!total) {
      return <></>;
    }
    let elements = [];
    for (let i = 0; i < total; i++) {
      elements.push(TopBox);
    }
    return (
      <>
        {elements?.map((Element, index) => (
          <Col key={index} span={isSmallSize ? 8 : 4}>
            <Element />
          </Col>
        ))}
      </>
    );
  }, [isSmallSize, total]);

  const bottomBoxes = useMemo(() => {
    if (!total) {
      return <></>;
    }
    let elements = [];
    for (let i = 0; i < total; i++) {
      elements.push(BottomBox);
    }
    return (
      <>
        {elements?.map((Element, index) => (
          <Col key={index} span={isSmallSize ? 8 : 4}>
            <Element />
          </Col>
        ))}
      </>
    );
  }, [isSmallSize, total]);

  const gap = isSmallSize ? 5 : 10;

  return (
    <div>
      <Row className="content-center" gutter={[gap]} style={{ marginBottom: `${gap}px` }}>
        {topBoxes}
      </Row>
      <Row className="content-center" gutter={[gap]}>
        {bottomBoxes}
      </Row>
    </div>
  );
}

export default Boxes;
