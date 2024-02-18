import { Button } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import orderDataService from "../../../data-services/order-data.service";
import ConfirmationDialog from "../confirmation-dialog/confirmation-dialog.component";
import { useDispatch, useSelector } from "react-redux";
import { setToastMessageCancelOrder } from "../../../modules/toast-message/toast-message.actions";
import { ToastMessageAddUpdateToCartIcon } from "../../assets/icons.constants";

const CancelOrderButton = (props) => {
  const [t] = useTranslation();
  const { orderId, buttonText, callBack, className } = props;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const translateData = {
    cancelOrder: t("toastMessageCancelOrder", "Hủy đơn hàng thành công"),
    cancelOrderDialog: t("order.cancelOrderDialog", "Bạn có thực sự muốn hủy đơn hàng này?"),
    confirmation: t("order.confirmation", "Xác nhận"),
    cancelConfirm: t("order.cancelConfirm", "Xác nhận hủy"),
    okCancel: t("order.okCancel", "Từ chối"),
  };

  const onCancelOrder = async () => {
    // Call api cancel order
    setIsLoading(true);
    const dataRequest = {
      orderId: orderId,
    };
    const response = await orderDataService.cancelOrderAsync(dataRequest);
    // if response success -> callback
    if (response) {
      if (callBack) {
        callBack();
      }

      onShowToastMessage();
      setOpen(false);
    }

    setIsLoading(false);
  };

  const onShowToastMessage = () => {
    dispatch(setToastMessageCancelOrder(true));
    setTimeout(() => {
      dispatch(setToastMessageCancelOrder(false));
    }, 3000);
  };

  const isShowToastMessageCancelOrder = useSelector((state) => state?.toastMessage?.isShowToastMessageCancelOrder);

  const renderToastMessage = () => {
    return (
      <div className="toast-message-add-update-to-cart">
        <ToastMessageAddUpdateToCartIcon viewBox="0 2 30 19" className="toast-message-add-update-to-cart-check" />
        <span>{translateData.cancelOrder}</span>
      </div>
    );
  };

  return (
    <>
      {isShowToastMessageCancelOrder === true && renderToastMessage()}
      <Button
        className={className}
        onClick={() => {
          setOpen(true);
          setIsLoading(false);
        }}
      >
        {buttonText ?? "Cancel order"}
      </Button>
      <ConfirmationDialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={onCancelOrder}
        confirmLoading={isLoading}
        title={translateData.confirmation}
        content={translateData.cancelOrderDialog}
        okText={translateData.cancelConfirm}
        cancelText={translateData.okCancel}
      />
    </>
  );
};

export default CancelOrderButton;
