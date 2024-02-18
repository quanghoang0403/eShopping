import Modal from "antd/es/modal/Modal";
import React from "react";
import "./delete-address-modal.component.scss";

export default function DeleteAddressModal(props) {
  const { onOk, okText, onCancel, cancelText, open, title, content } = props;
  return (
    <Modal
      className="my-profile-delete-address-modal"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      title={title}
      okText={okText}
      cancelText={cancelText}
    >
      <div className="delete-container">
        <p className="content">{content}</p>
      </div>
    </Modal>
  );
}
