import { Button, Col, Form, Modal, Row, message } from "antd";
import DialogTitle from "components/dialog-title";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./edit-status-detail-order.component.scss";
import orderDataService from "data-services/order/order-data.service";
import { OrderStatus, OrderStatusColor } from "constants/order-status.constants";

export default function EditStatusDetailOrder(props) {
  const { isModalVisible, handleCancel, handleSusscess, propOrderId, propOrderCode, propOrderStatusId } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const [orderStatusId, setOrderStatusId] = useState(null);

  const pageData = {
    ignore: t("button:ignore"),
    confirmEdit: t("button:confirmEdit"),
    updateOrderStatus: t("order.updateOrderStatus"),
    orderId: t("order.orderId"),
    orderStatus: t("order.orderStatus"),
    status: t("order.status"),
    selectNewStatusForOrder: t("order.selectNewStatusForOrder"),
    pleaseSelectNewStatusForOrder: t("order.pleaseSelectNewStatusForOrder"),
    cancel: t("status.cancel"),
    complete: t("status.complete"),
    processing: t("status.processing"),
    toConfirm: t("status.toConfirm"),
    delivering: t("status.delivering"),
    draft: t("status.draft"),
  };

  const orderStatusName = {
    2: pageData.cancel,
    3: pageData.toConfirm,
    4: pageData.processing,
    5: pageData.delivering,
    6: pageData.complete,
    7: pageData.draft,
  };

  const listOrderStatus = [{
    id: OrderStatus.Completed,
    name: orderStatusName[OrderStatus.Completed]
  }, {
    id: OrderStatus.Canceled,
    name: orderStatusName[OrderStatus.Canceled]
  },
  ];

  const onFinish = async () => {
    const data = {
      orderId: propOrderId,
      status: orderStatusId
    }
    await orderDataService
      .updateOrderStatusAsync(data)
      .then((res) => {
        if (res) {
          form.resetFields();
          handleSusscess();
          const messageSuccess = t("order.orderHasBeenChangedToNewStatus", { new_status: orderStatusName[orderStatusId] });
          message.success(messageSuccess);
        }
      })
      .catch((errs) => {
        message.error(errs);
      });
  };

  const onCancel = () => {
    setOrderStatusId(null);
    form.resetFields();
    handleCancel();
  };

  const onSelectStatus = (value) => {
    setOrderStatusId(value)
  };

  return (
    <Modal
      className="modal-edit-status-order"
      title={<DialogTitle content={pageData.updateOrderStatus} />}
      closeIcon
      open={isModalVisible}
      footer={(null, null)}
      width={"500px"}
      destroyOnClose={true}
      onCancel={handleCancel}
    >
      <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
        <Row className="row-order-status">
          <Col span={16}>
            <h4 className="label-left" style={{ color: "#858585" }}>
              {pageData.orderId}
            </h4>
          </Col>
          <Col span={8} className="label-right">
            <span>
              {propOrderCode}
            </span>
          </Col>
        </Row>
        <Row className="row-order-status">
          <Col span={16}>
            <h4 className="label-left" style={{ color: "#858585" }}>
              {pageData.orderStatus}
            </h4>
          </Col>
          <Col span={8} className="label-right">
            <span className={`order-status ${OrderStatusColor[propOrderStatusId]}`}>
              {orderStatusName[propOrderStatusId]}
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <h4 className="label-status" style={{ color: "#282828" }}>
              {pageData.status} <a style={{ color: "#DB1B1B" }}>*</a>
            </h4>

            <Form.Item name="orderStatusId" rules={[{ required: true, message: pageData.pleaseSelectNewStatusForOrder }]}>
              <FnbSelectSingle
                showSearch
                allowClear
                placeholder={pageData.selectNewStatusForOrder}
                onChange={(value) => onSelectStatus(value)}
                size="large"
                option={listOrderStatus?.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
              />

            </Form.Item>
          </Col>
        </Row>
        <Row className="float-center confirm-edit-action-btn">
          <Button className="btn-cancel" key="back" onClick={() => onCancel()}>
            {pageData.ignore}
          </Button>
          <Button type="primary" className="btn-confirm-edit" htmlType="submit">
            {pageData.confirmEdit}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
}
