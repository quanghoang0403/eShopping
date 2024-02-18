import { Button } from "antd";
import { useState } from "react";
import orderDataService from "../../../data-services/order-data.service";
import ConfirmationDialog from "../confirmation-dialog/confirmation-dialog.component";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setToastMessageAddUpdateProductToCart } from "../../../modules/toast-message/toast-message.actions";

const CancelOrderButton = (props) => {
  const { orderId, buttonText, callBack, className } = props;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const translateData = {
    confirmCancel: t("confirmCancel", "Xác nhận hủy"),
    ignore: t("ignore", "Từ chối"),
    contentCancelOrder: t("contentCancelOrder", "Bạn có thực sự muốn hủy đơn hàng này?"),
    notification: t("loginPage.notification", "Thông báo"),
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
      dispatch(
        setToastMessageAddUpdateProductToCart({
          icon: null,
          message: t("toastMessageCancelOrder", "Hủy đơn hàng thành công"),
        }),
      );
      setOpen(false);
    }

    setIsLoading(false);
  };

  return (
    <>
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
        okText={translateData.confirmCancel ?? "Confirm cancel"}
        cancelText={translateData.ignore ?? "Ignore"}
        content={translateData.contentCancelOrder}
        title={translateData.notification}
      />
    </>
  );
};

export default CancelOrderButton;
