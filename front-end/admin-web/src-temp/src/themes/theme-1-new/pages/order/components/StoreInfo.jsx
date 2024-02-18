import { Col, Row } from "antd";

function StoreInfo(props) {
  const { branchName, branchAddress } = props;
  return (
    <div className="store-info w-100">
      <Row gutter={[10, 10]} justify="center">
        <Col span={20} className="content-center">
          <h2>{branchName ?? ""}</h2>
        </Col>
        <Col span={20} className="content-center">
          <p className="store-address">{branchAddress ?? ""}</p>
        </Col>
      </Row>
    </div>
  );
}

export default StoreInfo;
