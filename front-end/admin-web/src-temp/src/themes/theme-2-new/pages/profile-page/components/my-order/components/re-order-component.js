import { localStorageKeys } from "../../../../../../utils/localStorage.helpers";
import orderService from "../../../../../../services/orders/order-service";
import reduxService from "../../../../../../services/redux.services";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { setCartItems, setDeliveryMethods, setPaymentMethods } from "../../../../../../modules/session/session.actions";
import ConfirmationDialog from "../../../../../components/confirmation-dialog/confirmation-dialog.component";
import { useTranslation } from "react-i18next";
import branchDataService from "../../../../../../data-services/branch-data.services";
import { store } from "../../../../../../modules";
import { EnumDayOfWeek, EnumNextTimeOpenType } from "../../../../../constants/enums";
import NotificationDialog from "../../../../../components/notification-dialog/notification-dialog.component";
import { Button } from "antd";
export default function ReOrderComponent(props) {
  const { orderDetailData, onClosed } = props;
  const history = useHistory();
  const [t] = useTranslation();
  const reduxState = store.getState();
  const branchAddress = reduxState?.session?.deliveryAddress?.branchAddress;
  const [showConfirmReOrder, setShowConfirmReOrder] = useState(false);
  const [isLoadingReOrder, setIsLoadingReOrder] = useState(false);
  const [isShowCloseStoreDialog, setIsShowCloseStoreDialog] = useState(false);
  const [timeWorkingHour, setTimeWorkingHour] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);

  const translateData = {
    confirmModal: {
      title: t("orderDetail.confirmation", "Xác nhận"),
      content: t(
        "orderDetail.reOrderConfirmText",
        "Bạn có vài sản phẩm trong Giỏ Hàng, bạn có muốn xóa tất cả và thay thế bằng các sản phẩm trong đơn hàng này?",
      ),
      btnConfirm: t("orderDetail.confirm", "Xác nhận"),
      btnCancel: t("orderDetail.ignore", "Bỏ qua"),
      messageNotification: t("storeWebPage.generalUse.notification", "Thông báo"),
    },
    notification: t("storeWebPage.generalUse.notification"),
    soSorryNotificationWorkingHour: t(
      "storeBranch.soSorryNotificationWorkingHour",
      "Rất xin lỗi! Hiện tại không phải thời gian làm việc của cửa hàng. Vui lòng quay lại vào lúc <strong>{{timeWorkingHour}} {{dayOfWeek}}</strong>",
    ),
    iGotIt: t("loginPage.iGotIt", "I got it"),
  };

  useEffect(() => {
    async function fetchData() {
      await handleReOrder();
    }
    fetchData();
  }, []);

  const checkIfBranchIsClosed = async () => {
    let isClosed = false;
    const workingHour = await branchDataService.getWorkingHourByBranchIdAsync(branchAddress?.id ?? null);
    const workingHourResult = workingHour?.data;
    if (workingHourResult?.isClosed === true) {
      setIsShowCloseStoreDialog(true);
      setTimeWorkingHour(workingHourResult?.workingHour?.openTime);
      if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[1].key) {
        setDayOfWeek(EnumNextTimeOpenType[workingHourResult?.workingHour?.nextTimeOpen - 1].name);
      } else if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[2].key) {
        setDayOfWeek(EnumDayOfWeek[workingHourResult?.workingHour?.dayOfWeek].name);
      }
      isClosed = true;
    }
    return isClosed;
  };

  const handleReOrder = async () => {
    ///Handle check working hours
    const isBranchClosed = await checkIfBranchIsClosed();
    if (isBranchClosed === true) return;

    let currentShoppingCart = JSON.parse(localStorage.getItem(localStorageKeys.STORE_CART));
    if (currentShoppingCart.length > 0) {
      setShowConfirmReOrder(true);
    } else {
      await onReOrder();
    }
  };
  const handleCancelReOrder = () => {
    setShowConfirmReOrder(false);
    onClosed();
  };
  const onReOrder = async () => {
    setIsLoadingReOrder(true);
    localStorage.setItem(localStorageKeys.STORE_CART, JSON.stringify([]));
    var res = await orderService.cloneItemFromOrderToCart(orderDetailData);
    reduxService.dispatch(setCartItems(res.newCartItems));
    localStorage.setItem(localStorageKeys.STORE_CART, JSON.stringify(res.newCartItems));
    const paramsState = {
      paymentMethodId: res?.paymentMethodId,
      deliveryMethodId: res?.deliveryMethodId,
      orderTypeId: res?.orderTypeId,
    };
    history.push({
      pathname: "/checkout",
      state: paramsState,
    });
    setIsLoadingReOrder(false);
    onClosed();
  };

  return (
    <div>
      <ConfirmationDialog
        className={"confirm-modal-config"}
        confirmLoading={isLoadingReOrder}
        title={translateData.confirmModal.title}
        content={translateData.confirmModal.content}
        open={showConfirmReOrder}
        okText={translateData.confirmModal.btnConfirm}
        cancelText={translateData.confirmModal.btnCancel}
        onCancel={() => handleCancelReOrder()}
        onConfirm={() => onReOrder()}
      />

      {/* Working hour notification */}
      <NotificationDialog
        open={isShowCloseStoreDialog}
        title={translateData.notification}
        confirmLoading={false}
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: t(translateData.soSorryNotificationWorkingHour, {
                timeWorkingHour: timeWorkingHour,
                dayOfWeek: t(dayOfWeek),
              }),
            }}
          ></span>
        }
        footer={[
          <Button
            onClick={() => {
              setIsShowCloseStoreDialog(false);
              handleCancelReOrder();
            }}
          >
            {translateData.iGotIt}
          </Button>,
        ]}
        closable={true}
      />
    </div>
  );
}
