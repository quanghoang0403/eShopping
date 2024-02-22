import { Button, Col, Modal, Row } from "antd";
import "./delete-product.component.scss";

export default function DeleteProductComponent(props) {
  const {
    preventDeleteProduct,
    isModalVisible,
    titleModal,
    handleCancel,
    onDelete,
  } = props;

  const pageData = {
    buttonIGotIt: "Tôi đã hiểu!",
    ignore:  "Bỏ qua",
    delete: "Xóa",
    confirmDelete: "Xác nhận xóa",
  };

  const formatDeleteMessage = (name) => {
    return `Bạn có thực sự muốn xóa sản phẩm <span class='style-text-confirm-delete'>${name}</span>.<br/>Thao tác này không thể khôi phục!`;
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
          <Col span={24}>
            <p
              dangerouslySetInnerHTML={{
                __html: formatDeleteMessage(preventDeleteProduct?.productName),
              }}
            ></p>
          </Col>
        </Row>
        {preventDeleteProduct?.isPreventDelete === true ? (
          <Row className="btn-i-got-it">
            <Button type="primary" onClick={() => handleCancel()}>
              {pageData.buttonIGotIt}
            </Button>
          </Row>
        ) : (
          <Row className="modal-footer">
            <Button className="mr-2" onClick={() => handleCancel()}>
              {pageData.ignore}
            </Button>
            <Button danger onClick={() => onDelete(preventDeleteProduct?.productId)}>
              {pageData.delete}
            </Button>
          </Row>
        )}
      </Modal>
    </>
  );
}
