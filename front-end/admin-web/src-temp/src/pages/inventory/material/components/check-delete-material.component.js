import { Button, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import "./check-delete-material.component.scss";

export default function CheckDeleteMaterial(props) {
  const [t] = useTranslation();
  const { listObjectLockMaterial, isModalVisible, titleModal, handleCancel, onDelete } = props;
  const pageData = {
    buttonIGotIt: t("form.buttonIGotIt"),
    ignore: t("button.ignore"),
    delete: t("button.delete"),
    checkMaterialNotificationMessage: t("messages.checkMaterialNotificationMessage"),
    deleteMaterialMessage: t("messages.deleteMaterialMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
  };

  const onCancel = () => {
    handleCancel();
  };

  const renderRowByIndex = (material) => {
    let elements = [];
    for (var item = 0; item < material?.length; item += 1) {
      let element = (
        <div className="po-item">
          <span>{item + 1}.</span>
          {material[item]}
        </div>
      );
      elements.push(element);
    }
    return elements;
  };

  const formatNotificationMessage = (name, type) => {
    let mess = t(pageData.checkMaterialNotificationMessage, { name: name, type: type });
    return mess;
  };

  const formatDeleteMessage = (name) => {
    let mess = t(pageData.deleteMaterialMessage, { name });
    return mess;
  };

  return (
    <>
      <Modal
        width={600}
        className="delete-confirm-modal"
        title={titleModal}
        closeIcon
        visible={isModalVisible}
        footer={(null, null)}
      >
        <Row>
          <div
            className="text-content-notification"
            dangerouslySetInnerHTML={{
              __html: formatNotificationMessage(
                listObjectLockMaterial?.materialName,
                t(listObjectLockMaterial?.typeName)
              ),
            }}
          ></div>
          <div className="table-notification">{renderRowByIndex(listObjectLockMaterial?.listObjectUseMaterial)}</div>
        </Row>
        <Row className="btn-i-got-it">
          <Button type="primary" onClick={() => onCancel()}>
            {pageData.buttonIGotIt}
          </Button>
        </Row>
      </Modal>
    </>
  );
}
