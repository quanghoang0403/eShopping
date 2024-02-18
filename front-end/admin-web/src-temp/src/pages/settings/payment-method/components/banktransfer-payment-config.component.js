import { Image, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import BankTransferConfigImage from "../../../../assets/images/BankTransferConfig.png";

export function BankTransferPaymentConfigComponent(props) {
  const { initData } = props;
  const { t } = useTranslation();
  return (
    <Col span={24} className="BankTransferPayment">
      <h1 className="title">{t(initData?.name)}</h1>
      <Row className="component-body">
        <Image src={BankTransferConfigImage} preview={false}></Image>
      </Row>
    </Col>
  );
}
