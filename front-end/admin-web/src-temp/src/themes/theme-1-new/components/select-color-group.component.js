import { Col, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import { FnbSelectSingle } from "./fnb-select-single/fnb-select-single";

import "./select-color-group.component.scss";

const SelectColorGroupComponent = (props) => {
  const { pageConfig, pageId, visible, formItemPreName, defaultValue } = props;
  const colorGroups = pageConfig?.general?.color?.colorGroups ?? [];
  const [t] = useTranslation();
  const translateData = {
    selectColorGroup: t("storeWebPage.header.selectColorGroup"),
  };
  return (
    <>
      <Row className="select-color-group-component">
        <Col span={24}>
          <p>{translateData.selectColorGroup}</p>
        </Col>
        <Col span={24}>
          <Form.Item rules={[{ required: true }]} name={[...formItemPreName, "colorGroupId"]}>
            <FnbSelectSingle
              defaultValue={colorGroups[0]?.id}
              showSearch
              option={colorGroups?.map((b) => ({
                id: b.id,
                name: b?.name,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default SelectColorGroupComponent;
