import { Col, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import CustomizationGroup from "../customization-group-component/customization-group.page";

export function LoginPageCustomize(props) {
  const { initialData } = props;
  const [t] = useTranslation();

  const renderLoginPage = () => {
    <Row>
      <Col span={24}>
        <Form.Item name={["general", "color", "colorGroups", index, "id"]} hidden></Form.Item>
      </Col>
    </Row>;
  };

  return (
    <CustomizationGroup
      title="General customization"
      isNormal={true}
      defaultActiveKey={1}
      content={renderLoginPage}
      //icon={group.icon}
    />
  );
}
