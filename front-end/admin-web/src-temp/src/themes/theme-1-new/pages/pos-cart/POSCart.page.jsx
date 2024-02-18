import { Button, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { EnumQRCodeStatus, EnumTargetQRCode } from "../../../constants/enums";
import { Platform } from "../../../constants/platform.constants";
import { ToastMessageType } from "../../../constants/toast-message.constants";
import { store } from "../../../modules";
import { posDiscountCodesSelector, qrOrderSelector } from "../../../modules/order/order.reducers";
import { setPackageExpiredInfo, setToastMessage } from "../../../modules/session/session.actions";
import { posCartItemsSelector, toastMessageSelector } from "../../../modules/session/session.reducers";
import { useAppCtx } from "../../../providers/app.provider";
import orderService from "../../../services/orders/order-service";
import posCartService from "../../../services/pos/pos-cart.services";
import reduxService from "../../../services/redux.services";
import PackageExpiredDialog from "../../../shared/components/package-expired-dialog/package-expired-dialog.component";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CheckoutCompleteIcon,
  CloseIcon,
  NoteIcon,
  WarningTriangle,
} from "../../assets/icons.constants";
import { BackIcon } from "../../assets/icons/BackIcon";
import MinHeader from "../../components/min-header/MinHeader";
import OverlayLoadingFullScreenComponent from "../../components/overlay-loading-full-screen/OverlayLoadingFullScreenComponent";
import DialogCloseBranchContainer from "../../containers/close-branch/dialog-close-branch.container";
import { useSearchParams } from "../../hooks";
import { EditOrderProductDialogComponent } from "../checkout/components/edit-order-product-dialog.component";
import BoxDrawer from "../order/components/BoxDrawer";
import DiscountCodeButton from "../pos-checkout/components/DiscountCodeButton/DiscountCodeButton";
import DiscountCodeDialog from "../pos-checkout/components/DiscountCodeDialog/DiscountCodeDialog";
import SummaryComponent from "../pos-checkout/components/Summary/SummaryComponent";
import "./POSCart.style.scss";
import CartItemComponent from "./components/CartItem/CartItemComponent";

function POSCartPage(props) {
  const { isCheckout = false, title = undefined, fontFamily } = props;
  const posCartItems = useSelector(posCartItemsSelector);
  const reduxQROrder = useSelector(qrOrderSelector);
  const posDiscountCodes = useSelector(posDiscountCodesSelector);
  const isShowToastMessageDiscountCodes = useSelector(toastMessageSelector);
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const query = useSearchParams();
  const qrCodeId = query.get("qrCodeId");
  const paramIsLoadData = "isLoadData";
  const isLoadQRCodeData = query.get(paramIsLoadData);
  const { Toast, NotificationDialog } = useAppCtx();
  const history = useHistory();
  const editCartItemRef = useRef();
  const TIME_DELAY = 200;
  const pageData = {
    cart: t("posCart.title", "Giỏ hàng"),
    shoppingCart: t("posCart.shoppingCart", "Giỏ hàng"),
    products: t("posCart.products", "Sản phẩm"),
    createOrder: t("posCart.createOrder", "Tạo đơn hàng"),
    backToTheActionPage: t("titles.backToTheActionPage", "Về trang Tác Vụ"),
    returnToHomepage: t("titles.returnToHomepage", "Về trang chủ"),
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleDiscountCodeDialog, setIsVisibleDiscountCodeDialog] = useState(false);
  const [isShowNotifyDialogCloseBranch, setIsShowNotifyDialogCloseBranch] = useState(false);
  const [isVisibleBoxDrawerEditCartItem, setIsVisibleBoxDrawerEditCartItem] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  useEffect(() => {
    if (isShowToastMessageDiscountCodes?.isShow) {
      setTimeout(function () {
        const toastMessageEmpty = {
          isShow: false,
          message: "",
          type: "",
          duration: 3000,
        };
        dispatch(setToastMessage(toastMessageEmpty));
      }, isShowToastMessageDiscountCodes?.duration ?? 3000);

      Toast.show({
        messageType: isShowToastMessageDiscountCodes?.type,
        message: t(isShowToastMessageDiscountCodes?.message),
        icon:
          isShowToastMessageDiscountCodes?.type === ToastMessageType.WARNING ? (
            <WarningTriangle />
          ) : (
            <CheckCircleIcon />
          ),
        placement: "bottom",
        duration: 3,
      });
    }
  }, [isShowToastMessageDiscountCodes]);

  useEffect(() => {
    let _qrCodeId = qrCodeId;
    if (!_qrCodeId) {
      _qrCodeId = reduxQROrder?.qrCodeId;
    }
    if (_qrCodeId) {
      fetchQRCodeData(_qrCodeId, true).then((isSuccess) => {
        if (!isSuccess) {
          goToHomePage();
        }
      });
    } else {
      goToHomePage();
    }
  }, []);

  useEffect(() => {
    store?.dispatch(setPackageExpiredInfo(null));
    if (reduxQROrder?.qrCodeId) {
      //QR Code Is Expired
      if (reduxQROrder?.qrCodeStatus === EnumQRCodeStatus.Finished && !reduxQROrder?.isStopped) {
        goToHomePage(true);
      } else if (reduxQROrder?.isStopped || reduxQROrder?.qrCodeStatus !== EnumQRCodeStatus.Active) {
        goToHomePage();
      } else if (isLoadQRCodeData === "true" && reduxQROrder?.qrCodeId === qrCodeId) {
        query.delete(paramIsLoadData);
        history.replace({
          search: query.toString(),
        });
        if (reduxQROrder?.targetId === EnumTargetQRCode.AddProductToCart) {
          posCartService.addQRCodeProductsToCart();
        }
        handleShowToastSuccess();
      }
    }

    const userLoginInfo = reduxService.getUserLoginInfo();
    if (isCheckout && !(userLoginInfo && userLoginInfo?.customerId)) {
      NotificationDialog.show({
        contentNotificationDialog: (
          <>{t("checkOutPage.loginMessage", "You have not logged in yet, please Login to continue create the order")}</>
        ),
        onOk: goToLoginPage,
        onCancel: goToLoginPage,
        footer: (
          <>
            <Button onClick={goToLoginPage}>{t("checkOutPage.login", "Login")}</Button>
          </>
        ),
      });
    }
  }, [reduxQROrder]);

  useEffect(() => {
    posCartService.verifyAndUpdateCart();
  }, [posDiscountCodes]);

  function goToHomePage(isShowExpiredToast = false) {
    posCartService.cleanPOSCartAsync(history.push("/"));
    const _message = isShowExpiredToast ? t("messages.qrCodeIsExpired") : t("messages.qrCodeIsNotAvailable");
    Toast.show({
      messageType: "warning",
      message: _message,
      icon: <WarningTriangle />,
      placement: "bottom",
      duration: 3,
    });
  }

  function goToLoginPage() {
    NotificationDialog.hide();
    history.push({ pathname: "/login", state: { redirectToAfterLogin: "/pos-checkout" } });
  }

  function handleShowToastSuccess() {
    Toast.show({
      messageType: "success",
      message: t("messages.scanQRCodeSuccessfully"),
      icon: <CheckCircleIcon />,
      placement: "bottom",
      duration: 3,
    });
  }

  function closePage() {
    posCartService.cleanPOSCartAsync(history.push("/"));
  }

  function handleBackToTheActionPage() {
    NotificationDialog.hide();
    history.push("/action-page");
  }

  function handleReturnToHomepage() {
    NotificationDialog.hide();
    posCartService.cleanPOSCartAsync(history.push("/"));
  }

  const handleCallback = () => {
    setIsShowNotifyDialogCloseBranch(false);
    handleClickButtonSubmit();
  };

  async function handleClickButtonSubmit() {
    if (isCheckout) {
      setIsLoading(true);
      const request = {
        notes: orderNotes,
      };
      var response = await posCartService.createOrderAsync(request);
      setIsLoading(false);
      if (response?.isSuccess) {
        Toast.show({
          messageType: "success",
          message: response?.message ?? "Thành công", //Todo
          icon: <CheckCircleIcon />,
          placement: "top",
          duration: 3,
        });

        closePage();
      } else {
        const extraData = {
          areaTableName: reduxQROrder?.areaName,
        };
        NotificationDialog.show({
          contentNotificationDialog: (
            <span
              dangerouslySetInnerHTML={{
                __html: t(response?.message, extraData) ?? "",
              }}
            ></span>
          ),
          footer: (
            <>
              <Button onClick={handleBackToTheActionPage}>{pageData.backToTheActionPage}</Button>
              <Button onClick={handleReturnToHomepage}>{pageData.returnToHomepage}</Button>
            </>
          ),
        });
      }
    } else {
      history.push("/pos-checkout");
    }
  }

  async function fetchQRCodeData(qrCodeId, forceReduxToChange) {
    if (qrCodeId) {
      const response = await orderService.getQrCodeOrderAsync(qrCodeId, forceReduxToChange);
      return response;
    }
  }

  function handleOnEditOrderItem(cartItemId, index) {
    setIsVisibleBoxDrawerEditCartItem(true);
    const posCart = { ...posCartItems[index], branchId: reduxQROrder?.branchId };
    setTimeout(() => {
      editCartItemRef?.current?.setProductData(posCart, index);
    }, TIME_DELAY);
  }

  function handleCancelEditOrderItem() {
    setIsVisibleBoxDrawerEditCartItem(false);
  }

  //#region checkout
  function onShowDiscountCodeDialog() {
    setIsVisibleDiscountCodeDialog(true);
  }

  function onHideDiscountCodeDialog() {
    setIsVisibleDiscountCodeDialog(false);
  }

  function renderCheckoutContent() {
    return (
      <>
        <DiscountCodeButton onClick={onShowDiscountCodeDialog} />
        <div className="cart-note">
          <Input
            className="cart-note-input"
            prefix={<NoteIcon />}
            placeholder={pageData.notePlaceHolder}
            onChange={(e) => setOrderNotes(e.target.value)}
            maxLength={255}
          />
        </div>
        <SummaryComponent />
        <DiscountCodeDialog
          isVisible={isVisibleDiscountCodeDialog}
          onCancel={onHideDiscountCodeDialog}
          posDiscountCodes={posDiscountCodes}
        />
      </>
    );
  }

  //#endregion checkout

  // In the mobile interface: when hiding/showing the toolbar
  // The height must be reassigned so that the interface does not break
  const windowHeight = () => {
    const element = document.documentElement;
    element.style.setProperty("--window-height", `${window.innerHeight}px`);
  };
  window.addEventListener("resize", windowHeight);
  windowHeight();

  return (
    <div style={{ fontFamily: fontFamily }}>
      <div className="pos-cart-layout">
        <div className="pos-cart-page">
          <MinHeader
            className={"pos-cart-header"}
            addonBefore={
              <a href={qrCodeId ? `/pos?qrCodeId=${qrCodeId}` : "/pos"}>
                <ArrowLeftIcon className="arrow-left-icon" />
              </a>
            }
            addonBetween={<div className="title">{title ?? pageData.cart}</div>}
            addonAfter={<CloseIcon className="close-icon cursor-pointer" onClick={closePage} />}
          />
          <div className="pos-cart-summary">
            <span className="title">{pageData.shoppingCart}</span>{" "}
            <span className="quantity">
              ({posCartItems && posCartItems?.reduce((a, v) => (a = a + v?.quantity ?? 0), 0)} {pageData.products})
            </span>
          </div>
          <div className="pos-cart-body">
            <div className="cart-items">
              {posCartItems?.map((cart, index) => {
                return (
                  <CartItemComponent
                    index={index}
                    cartItem={cart}
                    key={cart.id + index}
                    onUpdateCartQuantity={posCartService.handleUpdateCartQuantity}
                    onDeleteProduct={posCartService.handleDeleteCartItem}
                    onEdit={handleOnEditOrderItem}
                  />
                );
              })}
            </div>
            {isCheckout && renderCheckoutContent()}
          </div>
          <div className="pos-cart-footer">
            <div className="button" onClick={() => setIsShowNotifyDialogCloseBranch(true)}>
              {pageData.createOrder}
              <CheckoutCompleteIcon className="icon" />
            </div>
          </div>
        </div>
        {isLoading && <OverlayLoadingFullScreenComponent />}
        {isShowNotifyDialogCloseBranch && (
          <DialogCloseBranchContainer
            callback={handleCallback}
            open={isShowNotifyDialogCloseBranch}
            onClose={setIsShowNotifyDialogCloseBranch}
          />
        )}
        <BoxDrawer
          closeIcon={<BackIcon />}
          closable={true}
          className="edit-cart-item-box-drawer"
          title={<div className="content-center history-label">{t("titles.update", "Cập nhật")}</div>}
          height={"100%"}
          open={isVisibleBoxDrawerEditCartItem}
          onClose={handleCancelEditOrderItem}
          destroyOnClose={true}
          body={
            <EditOrderProductDialogComponent
              ref={editCartItemRef}
              onCancel={handleCancelEditOrderItem}
              setCurrentCartItems={() => {}}
              isPOS={true}
              branchIdPos={reduxQROrder?.branchId}
              platformId={Platform.POS}
              fontFamily={fontFamily}
            />
          }
        />
      </div>
      <PackageExpiredDialog />
    </div>
  );
}

export default POSCartPage;
