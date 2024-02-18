import { Button, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import "./check-permission-add-transfer.scss";

export default function CheckPermissionAddMaterial(props) {
  const [t] = useTranslation();
  const {  isModalVisible, handleCancel } = props;
  const pageData = {
    notPermissionAdd: t("transferMaterial.notPermissionAdd"),
  };
  return (
    <>
      <Modal
        width={600}
        className="permission-modal"
        title={'Notification'}
        closeIcon
        visible={isModalVisible}
        footer={(null, null)}
      >
        <Row>
          <div className="notify-permission">
            <p>{pageData.notPermissionAdd}</p>
          </div>
        </Row>
        <Row className="btn-i-got-it">
          <Button type="primary btn-Close" onClick={() => handleCancel()}>
            Okey
          </Button>
        </Row>
      </Modal>
    </>
  );
}
