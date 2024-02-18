import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as CheckedIcon } from "./checked.svg";
import "./create-order-status-dialog.style.scss";

function CreateOrderStatusDialog(props) {
  const { open, onCancel, orderInfo, onCompleted } = props;
  const history = useHistory();
  const { t } = useTranslation();
  const translateData = {
    congratulation: t("order.congratulation", "Congratulation!"),
    orderIsCreated: t("order.orderIsCreated", "Your order is created successful"),
    viewOrder: t("order.viewOrder", "View order detail"),
    newOrder: t("order.newOrder", "Create new order"),
  };

  const gotoProductList = () => {
    history.push("/product-list");
    if (onCompleted) {
      onCompleted();
    }
  };

  return (
    <>
      <Modal closable={false} className="create-order-status-dialog" open={open} footer={(null, null)}>
        <div className="icon">
          <CheckedIcon />
        </div>
        <div className="content">
          <h1>{translateData.congratulation}</h1>
          <p>{translateData.orderIsCreated}</p>
        </div>
        <div className="button-action">
          <div className="center">
            <Button onClick={gotoProductList}>{translateData.newOrder}</Button>
            <Link
              to={{
                pathname: `/my-profile/3`,
                state: {
                  orderId: orderInfo?.orderId,
                },
              }}
            >
              <Button type="button">{translateData.viewOrder}</Button>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateOrderStatusDialog;
