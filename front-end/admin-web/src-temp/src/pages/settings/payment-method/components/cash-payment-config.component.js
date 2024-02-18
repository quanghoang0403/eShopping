import { Image, Row, Col } from "antd";
import CashConfigImage from "../../../../assets/images/CashConfig.png";
import { useTranslation } from "react-i18next";

export function CashPaymentConfigComponent(props) {
  const { initData } = props;
  const { t } = useTranslation();

  return (
    <Col span={24} className="CashPayment">
      <h1 className="title">{t(initData?.name)}</h1>
      <Row className="component-body">
        <Image src={CashConfigImage} preview={false}></Image>
      </Row>
    </Col>
  );
}
