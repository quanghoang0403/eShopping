import { Button, Image, Radio } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import branchDataService from "../../../../../data-services/branch-data.services";
import customerDataService from "../../../../../data-services/customer-data.service";
import { store } from "../../../../../modules";
import { setCartItems } from "../../../../../modules/session/session.actions";
import orderService from "../../../../../services/orders/order-service";
import { LockMultipleCalls } from "../../../../../services/promotion.services";
import reduxService from "../../../../../services/redux.services";
import { getLabelPromotion, roundNumber, formatTextCurrency } from "../../../../../utils/helpers";
import { localStorageKeys } from "../../../../../utils/localStorage.helpers";
import {
  ArrowLeftIcon,
  CanceledOrderStatus,
  CompletedOrderStatus,
  DeliveringOrderStatusIcon,
  DraftOrderStatusIcon,
  ProcessingOrderStatus,
  ToConfirmOrderStatusIcon,
} from "../../../../assets/icons.constants";
import productDefaultImage from "../../../../assets/images/product-default.png";
import CancelOrderButton from "../../../../components/cancel-order-button/cancel-order-button.component";
import ConfirmationDialog from "../../../../components/confirmation-dialog/confirmation-dialog.component";
import { FnbLoadingSpinner } from "../../../../components/fnb-loading-spinner/fnb-loading-spinner.component";
import { EnumDayOfWeek, EnumNextTimeOpenType, EnumOrderStatusStoreWeb } from "../../../../constants/enums";
import { ProductPlatform } from "../../../../constants/product-platform.constants";
import { DateFormat, tableSettings } from "../../../../constants/string.constants";
import MyOrderDetail from "./my-order-detail.component";
import "./my-order.component.scss";

function MyOrdersTheme1(props) {
  const { handleClickTitle } = props;
  const history = useHistory();
  const reduxState = store.getState();
  const branchAddress = reduxState?.session?.deliveryAddress?.branchAddress;
  const [t] = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 740 });
  const translateData = {
    all: t("myProfile.myOrders.all", "Tất cả"),
    btnCancel: t("myProfile.myOrders.btnCancel", "Huỷ đơn"),
    canceled: t("myProfile.myOrders.canceled", "Đã hủy"),
    toConfirm: t("myProfile.myOrders.toConfirm", "Chờ xác nhận"),
    processing: t("myProfile.myOrders.processing", "Đang thực hiện"),
    delivering: t("myProfile.myOrders.delivering", "Đang giao"),
    completed: t("myProfile.myOrders.completed", "Hoàn thành"),
    draft: t("myProfile.myOrders.draft", "Nháp"),
    orderList: t("myProfile.myOrders.orderList", "Danh sách đơn hàng"),
    youDontHaveAnyOrdersYet: t("myProfile.myOrders.youDontHaveAnyOrdersYet", "Bạn chưa có đơn hàng nào"),
    orderNow: t("myProfile.myOrders.orderNow", "Đặt hàng ngay bây giờ"),
    confirm: t("myProfile.myOrders.confirm", "Xác nhận"),
    ignore: t("myProfile.myOrders.ignore", "Bỏ qua"),
    reOrderConfirmText: t(
      "myProfile.myOrders.reOrderConfirmText",
      "Bạn có vài sản phẩm trong Giỏ Hàng,</br> bạn có muốn xóa tất cả và thay thế bằng các sản phẩm </br>trong đơn hàng này?",
    ),
    confirmation: t("myProfile.myOrders.confirmation", "Xác nhận"),
    reOrder: t("myProfile.myOrders.reOrder", "Đặt lại đơn hàng"),
    notification: t("storeWebPage.generalUse.notification"),
    soSorryNotificationWorkingHour: t(
      "storeBranch.soSorryNotificationWorkingHour",
      "Rất xin lỗi! Hiện tại không phải thời gian làm việc của cửa hàng. Vui lòng quay lại vào lúc <strong>{{timeWorkingHour}} {{dayOfWeek}}</strong>",
    ),
    iGotIt: t("loginPage.iGotIt", "I got it"),
    orderDetail: t("myProfile.myOrders.orderDetail", "Order detail"),
  };

  let orderTabsStatus = [
    {
      key: EnumOrderStatusStoreWeb.ToConfirm,
      name: translateData.toConfirm,
    },
    {
      key: EnumOrderStatusStoreWeb.Processing,
      name: translateData.processing,
    },
    {
      key: EnumOrderStatusStoreWeb.Delivering,
      name: translateData.delivering,
    },
    {
      key: EnumOrderStatusStoreWeb.Completed,
      name: translateData.completed,
    },
    {
      key: EnumOrderStatusStoreWeb.Canceled,
      name: translateData.canceled,
    },
    {
      key: EnumOrderStatusStoreWeb.Draft,
      name: translateData.draft,
    },
  ];

  const [orderList, setOrderList] = useState();
  const [activeStatus, setActiveStatus] = useState("");
  const [page, setPage] = useState(tableSettings.page);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderDetail, setIsOrderDetail] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [isShowReOrderDialog, setIsShowReOrderDialog] = useState(false);
  const [reOrderCartItem, setReOrderCartItem] = useState();
  const [isShowCloseStoreDialog, setIsShowCloseStoreDialog] = useState(false);
  const [timeWorkingHour, setTimeWorkingHour] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);

  const onScrollSpace = async (event) => {
    let target = event.target;
    let top = target.scrollTop;
    let offsetHeight = target.offsetHeight;
    let max = target.scrollHeight;
    let current = top + offsetHeight;

    if (current >= max) {
      await lazyLoading();
    }
  };

  const lazyLoading = async () => {
    if (!isLoading) return;
    var res = await customerDataService.getMyOrders(page, tableSettings.pageSize, activeStatus);
    if (res) {
      setOrderList([...orderList, ...res?.data?.orders]);
    }
    setIsLoading(res?.data?.orders.length === tableSettings.pageSize);
    setPage(page + 1);
  };

  useEffect(() => {
    LockMultipleCalls(() => getInitData(""), "MyOrdersTheme1");
  }, []);

  useEffect(() => {
    const tbody = document.querySelector(".my-orders-list-theme-1");
    if (onScrollSpace && tbody) {
      tbody.addEventListener("scroll", onScrollSpace);
    }

    return () => {
      if (tbody) {
        tbody.removeEventListener("scroll", onScrollSpace);
      }
    };
  }, [onScrollSpace]);

  const getInitData = async (statusId) => {
    let arrParam = window.location.pathname.split("/");
    if (arrParam.length >= 4) {
      setOrderId(arrParam[3]);
      setIsOrderDetail(true);
    }

    setLoadingSpinner(true);
    var res = await customerDataService.getMyOrders(tableSettings.page, tableSettings.pageSize, statusId);
    if (res) {
      setLoadingSpinner(false);
      setOrderList(res?.data?.orders);
      setPage(tableSettings.page + 1);
    }
  };

  const handleChangeStatus = (e) => {
    setPage(tableSettings.page + 1);
    setActiveStatus(e.target.value);
    getInitData(e.target.value);
  };

  const handleOrderDetail = (orderDetailId) => {
    setOrderId(orderDetailId);
    setIsOrderDetail(true);
    history.push(`/my-profile/2/${orderDetailId}`);
  };

  const renderOrderStatus = (orderCode, enumStatus, orderId) => {
    const orderStatusIcon = {
      2: <CanceledOrderStatus />,
      3: <ToConfirmOrderStatusIcon />,
      4: <ProcessingOrderStatus />,
      5: <DeliveringOrderStatusIcon />,
      6: <CompletedOrderStatus />,
      7: <DraftOrderStatusIcon />,
    };
    const orderStatusColor = {
      2: "canceled-color",
      3: "to-confirm-color",
      4: "processing-color",
      5: "delivering-color",
      6: "completed-color",
      7: "draft-color",
    };
    const orderStatusName = {
      2: translateData.canceled,
      3: translateData.toConfirm,
      4: translateData.processing,
      5: translateData.delivering,
      6: translateData.completed,
      7: translateData.draft,
    };
    return (
      <>
        {orderStatusIcon[enumStatus]}
        <div className="order-code-status">
          <span onClick={() => handleOrderDetail(orderId)}>#{orderCode}</span>
          <span className={`order-name ${orderStatusColor[enumStatus]}`}>{orderStatusName[enumStatus]}</span>
        </div>
      </>
    );
  };

  const renderNoDataOrders = () => {
    return (
      <div className="no-order">
        <div className="order-description">
          {translateData.youDontHaveAnyOrdersYet}
          <a href="/product-list" role={"button"} className="order-btn">
            {translateData.orderNow}
          </a>
        </div>
        <Image preview={false} src="/images/default-theme/no-order.png" />
      </div>
    );
  };

  const replaceURL = () => {
    // Replace the URL with the new URL
    setIsOrderDetail(false);
    history.push("/my-profile/2");
  };

  const confirmReOrder = () => {
    reduxService.dispatch(setCartItems(reOrderCartItem.newCartItems));
    localStorage.setItem(localStorageKeys.STORE_CART, JSON.stringify(reOrderCartItem.newCartItems));
    const paramsState = {
      paymentMethodId: reOrderCartItem?.paymentMethodId,
      deliveryMethodId: reOrderCartItem?.deliveryMethodId,
      orderTypeId: reOrderCartItem?.orderTypeId,
    };
    history.push({
      pathname: "/checkout",
      state: paramsState,
    });
  };

  const reOrder = async (item) => {
    ///Handle check working hours
    const isBranchClosed = await checkIfBranchIsClosed();
    if (isBranchClosed === true) return;

    var res = await orderService.cloneItemFromOrderToCart(item);
    if (res) {
      let currentShoppingCart = JSON.parse(localStorage.getItem(localStorageKeys.STORE_CART));
      if (currentShoppingCart?.length > 0) {
        setReOrderCartItem(res);
        setIsShowReOrderDialog(true);
      } else {
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
      }
    }
  };

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

  const renderOrderItem = (orderListItem) => {
    return orderListItem?.map((item, index) => {
      return (
        <div key={index} className="order-item-container">
          <div className="order-item-header">
            <div className="item-status">{renderOrderStatus(item?.stringCode, item?.statusId, item?.id)}</div>
            <div className="item-flatform">
              <span>{item?.platform}</span>
              <span className="time">
                {moment.utc(item?.createdTime).local().locale("vi").format(DateFormat.HH_MM)} -{" "}
                {moment(item?.createdTime).format(DateFormat.DD_MM_YYYY)}
              </span>
            </div>
          </div>
          <div className="order-item-content">
            <img
              src={
                item?.orderItems[0]?.thumbnail && item?.orderItems[0]?.thumbnail !== ""
                  ? item?.orderItems[0]?.thumbnail
                  : productDefaultImage
              }
            />
            <div className="content-description">
              <div className="content-name">
                <span className="name text-line-clamp-2">{item?.orderItems[0]?.name}</span>
              </div>
              <div className="content-header">
                <div className="content">
                  {item?.orderItems[0]?.isCombo ? (
                    item?.orderItems[0]?.orderComboItem?.orderComboProductPriceItems?.map((itemCombo) => {
                      return (
                        <>
                          <span className="combo-item-name text-line-clamp-1">{itemCombo?.fullName}</span>
                          <span className="combo-item-option">
                            {itemCombo?.orderItemOptions?.map((itemComboOption) => {
                              return (
                                <>
                                  {itemComboOption?.optionName} : {itemComboOption?.optionLevelName}
                                  <br />
                                </>
                              );
                            })}
                          </span>
                          <span className="combo-item-topping">
                            {itemCombo?.orderItemToppings?.map((itemComboTopping) => {
                              return (
                                itemComboTopping?.quantity > 0 && (
                                  <>
                                    {itemComboTopping?.quantity} x {itemComboTopping?.toppingName}
                                    <br />
                                  </>
                                )
                              );
                            })}
                          </span>
                        </>
                      );
                    })
                  ) : (
                    <>
                      <span className="option">
                        {item?.orderItems[0]?.orderItemOptions?.map((itemOption) => {
                          return (
                            <>
                              {itemOption?.isDefault || `${itemOption?.optionName} (${itemOption?.optionLevelName})`}
                              {itemOption?.isDefault || <br />}
                            </>
                          );
                        })}
                      </span>
                      <span className="topping">
                        {item?.orderItems[0]?.orderItemToppings?.map((itemTopping) => {
                          return (
                            itemTopping?.quantity > 0 && (
                              <>
                                {itemTopping?.quantity} x {itemTopping?.toppingName}
                                <br />
                              </>
                            )
                          );
                        })}
                      </span>
                    </>
                  )}
                  <span className="price-after-discount-promotion">
                    {formatTextCurrency(item?.orderItems[0]?.priceAfterDiscount)}
                    <span className="price">
                      {item?.orderItems[0]?.originalPrice !== item?.orderItems[0]?.priceAfterDiscount && (
                        <>{formatTextCurrency(item?.orderItems[0]?.originalPrice)}</>
                      )}
                    </span>
                  </span>
                  {item?.orderItems.length > 1 && (
                    <span className="number-other-product">
                      Còn <span>{item?.orderItems.length - 1}</span> sản phẩm khác
                    </span>
                  )}
                </div>
                <div className="content-quantity">
                  SL: <span>{item?.orderItems[0]?.quantity}</span>
                </div>
              </div>
              <div className="content-footer">
                <div className="footer-price">
                  Total: <span>{formatTextCurrency(roundNumber(item?.totalPrices))}</span>
                </div>
                {item?.orderTypeId == 0 &&
                (item?.platformId?.toLowerCase() === ProductPlatform.StoreWebsite.toLowerCase() ||
                  item?.platformId?.toLowerCase() === ProductPlatform.StoreMobileApp.toLowerCase()) ? (
                  ""
                ) : (
                  <>
                    <div className="cancel-re-order-btn">
                      {item?.statusId === EnumOrderStatusStoreWeb.ToConfirm && (
                        <CancelOrderButton
                          callBack={() => getInitData(activeStatus)}
                          orderId={item?.id}
                          className="cancel-re-order-btn order-btn cancel"
                          buttonText={translateData.btnCancel}
                        />
                      )}
                      {(item?.statusId === EnumOrderStatusStoreWeb.Completed ||
                        item?.statusId === EnumOrderStatusStoreWeb.Canceled) && (
                        <a
                          onClick={() => {
                            reOrder(item);
                          }}
                          className="order-btn re-order"
                        >
                          {translateData.reOrder}
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };
  return (
    <div className="my-orders-theme1">
      {isMobile ? (
        isOrderDetail ? (
          <a onClick={() => setIsOrderDetail(false)} className="arrow-left-title">
            <ArrowLeftIcon /> {translateData.orderDetail}
          </a>
        ) : (
          <a onClick={() => handleClickTitle()} className="arrow-left-title">
            <ArrowLeftIcon /> {translateData.orderList}
          </a>
        )
      ) : isOrderDetail ? (
        <h2 className="my-orders-title">
          <div className="my-detail-orders-title">
            <ArrowLeftIcon onClick={() => replaceURL()} /> {translateData.orderDetail}
          </div>
        </h2>
      ) : (
        <h2 className="my-orders-title">{translateData.orderList}</h2>
      )}

      {isOrderDetail ? (
        <div className="order-detail">
          <MyOrderDetail orderId={orderId}></MyOrderDetail>
        </div>
      ) : (
        <>
          <div className="my-orders-status-list">
            <div className="radio-group-container">
              <Radio.Group
                value={activeStatus}
                onChange={(e) => handleChangeStatus(e)}
                className="my-order-status-list-rd"
              >
                <Radio.Button value={""} className="my-order-status-rd">
                  <span className="my-order-status-title">{translateData.all}</span>
                </Radio.Button>
                {orderTabsStatus?.map((item, index) => {
                  return (
                    <Radio.Button key={index} value={item?.key} className="my-order-status-rd">
                      <span className="my-order-status-title">{item?.name}</span>
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </div>
          </div>

          <div className="my-orders-list-theme-1">
            {loadingSpinner ? (
              <FnbLoadingSpinner />
            ) : orderList?.length > 0 ? (
              renderOrderItem(orderList)
            ) : (
              renderNoDataOrders()
            )}
          </div>
        </>
      )}

      <ConfirmationDialog
        open={isShowReOrderDialog}
        onCancel={() => setIsShowReOrderDialog(false)}
        onConfirm={() => confirmReOrder}
        confirmLoading={false}
        className="modal_login_theme1"
        closable={true}
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: t(translateData.reOrderConfirmText),
            }}
          ></span>
        }
        title={translateData.confirmation}
        footer={[
          <Button onClick={() => setIsShowReOrderDialog(false)}>{translateData.ignore}</Button>,
          <Button onClick={() => confirmReOrder()}>{translateData.confirm}</Button>,
        ]}
      />

      {/* Working hour notification */}
      <ConfirmationDialog
        open={isShowCloseStoreDialog}
        title={translateData.notification}
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
          <Button className="btn-got-it" onClick={() => setIsShowCloseStoreDialog(false)}>
            {translateData.iGotIt}
          </Button>,
        ]}
        className="notification-time-out-working-hours"
        closable={false}
        maskClosable={true}
      />
    </div>
  );
}

export default MyOrdersTheme1;
