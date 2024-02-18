import { InfoCircleOutlined } from "@ant-design/icons";
import { Card, Col, Collapse, Image, Row, Tag, Tooltip } from "antd";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { EnumDeliveryMethod } from "constants/delivery-method.constants";
import { AhaMoveIcon, EditIcon, GrabExpress, OrderHistoryIcon, ShipperIcon } from "constants/icons.constants";
import { OrderStatus, OrderStatusColor } from "constants/order-status.constants";
import { OrderTypeConstants } from "constants/order-type-status.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import reportDataService from "data-services/report/report-data.service";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { capitalize, formatCurrency, formatDate, hasPermission } from "utils/helpers";
import EditStatusDetailOrder from "./components/edit-status-detail-order.component";
import OrderDetailHistoryModal from "./detail-order-history-modal";
import { paymentMethod } from "constants/payment-method.constants";
import "./detail-order.scss";

const { Panel } = Collapse;

export default function OrderDetail(props) {
  const { t, history, match } = props;
  const orderDetailLink = "/report/order";
  const customerDetailLink = "/customer/detail/";
  const staffDetailLink = "/staff/edit/";
  const pageData = {
    backTo: t("button.backTo"),
    orderManagement: t("order.orderManagement"),
    general: t("material.generalInformation"),
    customer: t("table.customer"),
    information: t("order.information"),
    orderStatus: t("order.orderStatus"),
    reason: t("order.reason"),
    type: t("table.type"),
    paymentMethod: t("payment.paymentMethod"),
    deliveryMethod: t("deliveryMethod.title"),
    time: t("order.time"),
    branch: t("material.filter.branch.title"),
    staff: t("report.shift.staff"),
    note: t("form.note"),
    customerName: t("order.customerName"),
    shippingAddress: t("order.shippingAddress"),
    phone: t("form.phone"),
    accumulatedPoint: t("membership.accumulatedPoint"),
    points: t("order.points"),
    no: t("customer.no"),
    item: t("order.items"),
    option: t("option.title"),
    topping: t("productManagement.topping"),
    detail: t("table.detail"),
    price: t("combo.price.title"),
    discount: t("report.shift.discount"),
    orderItems: t("order.orderItems"),
    grossTotal: t("table.grossTotal"),
    shippingFee: t("order.shippingFee"),
    feeAndTax: t("order.feeAndTax"),
    revenue: t("order.revenue"),
    total: t("table.total"),
    tax: t("order.tax"),
    cost: t("order.cost"),
    orderDelivery: t("order.orderDelivery"),
    receiverName: t("order.receiver.name"),
    receiverAddress: t("order.receiver.address"),
    receiverPhone: t("order.receiver.phone"),
    subtotal: t("order.subtotal"),
    profit: t("order.profit"),
    orderNote: t("order.orderNote"),
    itemNote: t("order.itemNote"),
    canceled: t("status.canceled"),
    completed: t("status.completed"),
    processing: t("status.processing"),
    toConfirm: t("status.toConfirm"),
    delivering: t("status.delivering"),
    draft: t("status.draft"),
    createTime: t("order.createTime"),
    scheduledTime: t("order.scheduledTime"),
    pickupTime: t("order.pickupTime"),
    branchAddress: t("store.branchAddress"),
    platform: t("order.platform"),
    storeDiscount: t("order.storeDiscount"),
    partnerDiscount: t("order.partnerDiscount"),
    partnerCommission: t("order.partnerCommission"),
    shipperInformation: t("order.receiver.shipperInformation"),
    orderHistory: t("order.orderHistory"),
  };
  const isMobile = useMediaQuery({ maxWidth: 576 });

  const orderStatusName = {
    2: pageData.canceled,
    3: pageData.toConfirm,
    4: pageData.processing,
    5: pageData.delivering,
    6: pageData.completed,
    7: pageData.draft,
  };

  const [initDataOrder, setInitDataOrder] = useState(null);
  const [initDataStaffOrder, setInitDataStaffOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [orderReason, setOrderReason] = useState(null);
  const [isShowEditStatusDetailOrder, SetIsShowEditStatusDetailOrder] = useState(false);
  const [isShowEditIcon, setIsShowEditIcon] = useState(false);
  const [showOrderDetailHistoryModal, setShowOrderDetailHistoryModal] = useState(false);

  useEffect(() => {
    getInitDataAsync();
  }, []);

  const getInitDataAsync = () => {
    const data = { orderID: match?.params?.id, type: 1 };
    reportDataService.getOrderDetailTransactionReportAsync(data).then((res) => {
      if (res?.order) {
        const orderID = res?.order.id;
        const customerID = res?.order.customerId;

        if (
          hasPermission(PermissionKeys.EDIT_ORDER) &&
          res?.order?.statusId !== OrderStatus.Completed &&
          res?.order?.statusId !== OrderStatus.Canceled
        ) {
          setIsShowEditIcon(true);
        } else {
          setIsShowEditIcon(false);
        }
        setInitDataOrder(res?.order);
        setInitDataStaffOrder(res?.staff);
        if (res?.order?.statusId === OrderStatus.Canceled) loadOrderReason(orderID);
        loadCustomer(orderID, customerID);
      } else {
        history.push(`${orderDetailLink}`);
      }
    });
  };

  const loadCustomer = (orderID, customerID) => {
    if (customerID) {
      const data = { orderID: orderID, customerID: customerID, type: 2 };
      reportDataService.getOrderDetailTransactionReportAsync(data).then((res) => {
        setCustomer(res?.customer);
        loadOrderItems(orderID);
      });
    } else loadOrderItems(orderID);
  };
  const loadOrderItems = (orderID) => {
    const data = { orderID: orderID, type: 3 };
    reportDataService.getOrderDetailTransactionReportAsync(data).then((res) => {
      setOrderItems(mappingToDataTable(res?.orderItems));
    });
  };
  const loadOrderReason = (orderID) => {
    const data = { orderID: orderID, type: 4 };
    reportDataService.getOrderDetailTransactionReportAsync(data).then((res) => {
      setOrderReason(res?.orderReason);
    });
  };

  const mappingToDataTable = (orderItems) => {
    let gross_Total = 0;
    return orderItems?.map((item, index) => {
      return {
        no: (index += 1),
        productName: item?.productPrice?.product?.name,
        productPriceName: item?.productPrice?.priceName,
        price: item?.productPrice?.priceValue,
        amount: item?.quantity,
        orderItemOptions: item?.orderItemOptions,
        orderItemToppings: item?.orderItemToppings,
        orderComboItem: item?.orderComboItem,
        discount: item?.promotionDiscountValue,
        cost: item?.cost,
        grossTotal: (gross_Total += item?.quantity * item?.productPrice?.priceValue),
        taxName: item?.tax?.name,
        taxValue: item?.tax?.value,
        taxAmount: item?.taxValue,
        isCombo: item.isCombo,
        originalPrice: item?.originalPrice,
        discountPrice: item?.originalPrice - item?.priceAfterDiscount,
        tax: item?.tax,
        notes: item?.notes,
        comboName: item?.productPriceName,
      };
    });
  };

  const onEditStatus = () => {
    SetIsShowEditStatusDetailOrder(true);
  };

  const onCancel = () => {
    SetIsShowEditStatusDetailOrder(false);
  };

  const onSusscess = () => {
    SetIsShowEditStatusDetailOrder(false);
    getInitDataAsync();
  };

  const getColumnOrderItems = [
    {
      title: pageData.no,
      dataIndex: "no",
      key: "no",
      width: "5%",
    },
    {
      title: pageData.item.toUpperCase(),
      dataIndex: "item",
      key: "item",
      width: "25%",
      render: (_, record) => (
        <>
          {record?.isCombo ? (
            <>
              <Row className="mb-2">
                <Col span={24}>
                  <p className="item-name">{record?.comboName}</p>
                </Col>
              </Row>
              {record?.orderComboItem?.orderComboProductPriceItems?.map((item, index) => {
                return (
                  <>
                    {index != 0 && <hr className="hr-dashed mb-2" />}
                    <Row>
                      <Col span={12}>
                        <p className="item-name">{item?.productPrice?.product?.name}</p>
                        {item?.productPrice?.priceName && (
                          <>
                            <p className="item-price-name">({item?.productPrice?.priceName})</p>
                          </>
                        )}
                      </Col>
                      <Col span={12} className="text-right">
                        <b>x{record?.amount}</b>
                      </Col>
                    </Row>
                  </>
                );
              })}
            </>
          ) : (
            <Row>
              <Col span={12}>
                <p className="item-name">{record?.productName}</p>
                {record?.productPriceName && (
                  <>
                    <p className="item-price-name">({record?.productPriceName})</p>
                  </>
                )}
              </Col>
              <Col span={12} className="text-right">
                <b>x{record?.amount}</b>
              </Col>
            </Row>
          )}
        </>
      ),
    },
    {
      title: pageData.option.toUpperCase(),
      dataIndex: "orderItemOptions",
      key: "orderItemOptions",
      width: "15%",
      render: (_, record) => (
        <>
          {record?.isCombo ? (
            <>
              {record?.orderComboItem?.orderComboProductPriceItems?.map((item, index) => (
                <>
                  {index != 0 && <hr className="hr-dashed mb-2" />}
                  {item?.orderItemOptions?.length != 0 ? (
                    item?.orderItemOptions?.map((itemOption) => (
                      <Row className="mt-2 mb-2">
                        <Col span={12}>{itemOption?.optionName}:</Col>
                        <Col span={12} className="text-right">
                          <b>{itemOption?.optionLevelName}</b>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Row className="mt-2 mb-2">-</Row>
                  )}
                </>
              ))}
            </>
          ) : (
            <>
              {record?.orderItemOptions?.length != 0 ? (
                record?.orderItemOptions?.map((item) => (
                  <Row className="mt-2 mb-2">
                    <Col span={12}>{item?.optionName}:</Col>
                    <Col span={12} className="text-right">
                      <b>{item?.optionLevelName}</b>
                    </Col>
                  </Row>
                ))
              ) : (
                <Row className="mt-2 mb-2">-</Row>
              )}
            </>
          )}
        </>
      ),
    },
    {
      title: pageData.topping.toUpperCase(),
      dataIndex: "orderItemToppings",
      key: "orderItemToppings",
      width: "15%",
      render: (_, record) => (
        <>
          {record?.isCombo ? (
            <>
              {record?.orderComboItem?.orderComboProductPriceItems?.map((item, index) => (
                <>
                  {index != 0 && <hr className="hr-dashed mb-2" />}
                  {item?.orderItemToppings?.length != 0 ? (
                    item?.orderItemToppings?.map((itemTopping) => (
                      <Row className="mt-2 mb-2">
                        <Col span={12}>{itemTopping?.toppingName}:</Col>
                        <Col span={12} className="text-right">
                          <b>x{itemTopping?.quantity}</b>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Row className="mt-2 mb-2">-</Row>
                  )}
                </>
              ))}
            </>
          ) : (
            <>
              {record?.orderItemToppings?.length > 0 ? (
                record?.orderItemToppings?.map((item) => (
                  <Row className="mt-2 mb-2">
                    <Col span={12}>{item?.toppingName}:</Col>
                    <Col span={12} className="text-right">
                      <b>x{item?.quantity}</b>
                    </Col>
                  </Row>
                ))
              ) : (
                <Row className="mt-2 mb-2">-</Row>
              )}
            </>
          )}
        </>
      ),
    },
    {
      title: pageData.detail.toUpperCase(),
      dataIndex: "detail",
      key: "detail",
      width: "20%",
      render: (_, record) => (
        <>
          <Row className="mt-2 mb-2">
            <Col span={12} className="detail-price">
              {pageData.price}:
            </Col>
            <Col span={12} className="text-right detail-price">
              {formatCurrency(record?.originalPrice)}
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col span={12}>{pageData.tax}:</Col>
            <Col span={12} className="text-right">
              {record?.tax !== null ? formatCurrency(record?.tax) : "-"}
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col span={12}>{pageData.discount}:</Col>
            <Col span={12} className="text-right">
              -{formatCurrency(record?.discountPrice)}
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col span={12}>{pageData.cost}:</Col>
            <Col span={12} className="text-right">
              {record?.cost !== null ? formatCurrency(record?.cost) : "-"}
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: pageData.itemNote.toUpperCase(),
      dataIndex: "note",
      key: "note",
      width: "20%",
      render: (_, record) => (
        <>
          <Row className="mt-2 mb-2">
            <p className="item-note">{record?.notes ? record?.notes : "-"}</p>
          </Row>
        </>
      ),
    },
  ];
  const renderDeliveryIcon = (enumId) => {
    switch (enumId) {
      case EnumDeliveryMethod.AhaMove:
        return <AhaMoveIcon width={24} height={24} />
      case EnumDeliveryMethod.GrabExpress:
        return <GrabExpress />
      default:
        return <></>
    }

  }
  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={24}>
          <p className="card-header">
            <PageTitle content={`#${initDataOrder?.stringCode}`} isNormal />
          </p>
          <Tag
            onClick={() => setShowOrderDetailHistoryModal(true)}
            className="site-tag-plus-text blog-tag-plus-text order-history-btn"
          >
            <OrderHistoryIcon className="icon-add-new-import-unit" />
            <span>{pageData.orderHistory}</span>
          </Tag>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="order-detail-basic">
        <Col xs={24} sm={24} md={24} lg={12} className="order-detail-element">
          <Card className="w-100 fnb-card h-100 detail-general-card">
            <h4 className="order-detail-card-title">{pageData.general.toUpperCase()}</h4>
            <div className="h-100">
              <Row className="row-order-status">
                <Col xs={24} sm={12} lg={12} className="label-left">
                  <h3>{pageData.orderStatus}:</h3>
                </Col>
                <Col xs={24} sm={12} lg={12}>
                  <Row>
                    <Col span={!isShowEditIcon ? 24 : 20} className="label-right">
                      <span className={`order-status ${OrderStatusColor[initDataOrder?.statusId]}`}>
                        {orderStatusName[initDataOrder?.statusId]}
                      </span>
                    </Col>
                    {isShowEditIcon && (
                      <Col span={4} className="label-right">
                        <a onClick={() => onEditStatus()}>
                          <EditIcon />
                        </a>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
              {initDataOrder?.statusId === OrderStatus.Canceled && (
                <Row className="row-order-status">
                  <Col span={6} className="label-left">
                    <h3>{pageData.reason}:</h3>
                  </Col>
                  <Col span={18} className="label-right">
                    <p>{orderReason}</p>
                  </Col>
                </Row>
              )}
              <Row className="mt-1 mb-1">
                <Col xs={24} sm={12} lg={12} className="label-left">
                  <h3>{pageData.type}:</h3>
                </Col>
                <Col xs={24} sm={12} lg={12} className="label-right">
                  <p>
                    {initDataOrder?.orderTypeId === OrderTypeConstants.PickUp
                      ? capitalize(initDataOrder?.orderTypeName)
                      : initDataOrder?.orderTypeName}
                  </p>
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col xs={24} sm={12} lg={12} className="label-left">
                  <h3>{pageData.platform}:</h3>
                </Col>
                <Col xs={24} sm={12} lg={12} className="label-right">
                  <Col className="content-platform">
                    {initDataOrder?.storeFoodyPlatformId ? (
                      <>
                        <Image
                          preview={false}
                          width={35}
                          height={35}
                          src={initDataOrder?.otherFoodyPlatformLogo ?? "error"}
                        //fallback={defaultImage}
                        />
                        <div className="ml-2">{initDataOrder?.otherFoodyPlatformName || "-"}</div>
                      </>
                    ) : (
                      <div className="ml-2">{initDataOrder?.platformName || "-"}</div>
                    )}
                  </Col>
                </Col>
              </Row>
              <Row className="mt-1 mb-2">
                <Col xs={24} sm={12} lg={12} className="label-left">
                  <h3>{capitalize(pageData.paymentMethod)}:</h3>
                </Col>
                <Col xs={24} sm={12} lg={12} className="label-right text-long">
                  <p>{initDataOrder?.paymentMethodId === paymentMethod.Personal ? initDataOrder?.personalPaymentMethodName : initDataOrder?.paymentMethodName}</p>
                </Col>
              </Row>
              {initDataOrder?.orderTypeId === OrderTypeConstants.Online ||
                initDataOrder?.orderTypeId === OrderTypeConstants.PickUp ? (
                <>
                  <Row className="mt-1 mb-1">
                    <Col xs={24} sm={12} lg={12} className="label-left">
                      <h3>{pageData.createTime}:</h3>
                    </Col>
                    <Col xs={24} sm={12} lg={12} className="label-right">
                      <p>{formatDate(initDataOrder?.createdTime, DateFormat.DD_MM_YYYY_HH_MM_SS_)}</p>
                    </Col>
                  </Row>
                  <Row className="mt-1 mb-1">
                    <Col xs={24} sm={12} lg={12} className="label-left">
                      <h3>
                        {initDataOrder?.orderTypeId === OrderTypeConstants.Online
                          ? pageData.scheduledTime
                          : pageData.pickupTime}
                        :
                      </h3>
                    </Col>
                    <Col xs={24} sm={12} lg={12} className="label-right">
                      <p>
                        {initDataOrder?.scheduledTime
                          ? formatDate(initDataOrder?.scheduledTime, DateFormat.DD_MM_YYYY_HH_MM)
                          : formatDate(initDataOrder?.createdTime, DateFormat.DD_MM_YYYY_HH_MM)}
                      </p>
                    </Col>
                  </Row>
                </>
              ) : (
                <Row className="mt-1 mb-1">
                  <Col xs={24} sm={12} lg={12} className="label-left">
                    <h3>{pageData.time}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    <p>{formatDate(initDataOrder?.createdTime, DateFormat.DD_MM_YYYY_HH_MM_SS_)}</p>
                  </Col>
                </Row>
              )}
              <Row className="mt-1 mb-1">
                <Col xs={24} sm={12} lg={12} className="label-left">
                  <h3>{pageData.branch}:</h3>
                </Col>
                <Col xs={24} sm={12} lg={12} className="label-right">
                  <p>{initDataOrder?.branchName}</p>
                </Col>
              </Row>
              {initDataOrder?.orderTypeId === OrderTypeConstants.PickUp && (
                <Row className="mt-1 mb-1">
                  <Col xs={24} sm={12} lg={12} className="label-left">
                    <h3>{pageData.branchAddress}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    <p>{initDataOrder?.branchAddress}</p>
                  </Col>
                </Row>
              )}
              <Row className="mt-1 mb-1">
                <Col xs={24} sm={12} lg={12} className="label-left">
                  <h3>{pageData.staff}:</h3>
                </Col>
                <Col xs={24} sm={12} lg={12} className="label-right">
                  <p>{initDataStaffOrder?.fullName}</p>
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col xs={24} sm={12} lg={12} className="label-left">
                  <h3>{pageData.itemNote}:</h3>
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <p className="order-note">{initDataOrder?.note ? initDataOrder?.note : "-"}</p>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} className="order-detail-element p-0">
          <Col span={24} className={`${initDataOrder?.orderDelivery == null && "h-100"}`}>
            <Card className="w-100 h-100 fnb-card">
              <h4 className="order-detail-card-title">{pageData.customer.toUpperCase()}</h4>
              <div>
                <Row className="mt-4">
                  <Col xs={24} sm={12} lg={12} className="label-left">
                    <h3>{pageData.customerName}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    <p>
                      {customer?.fullName ? (
                        <Link to={`${customerDetailLink}${customer?.id}`} className="link-customer-detail">
                          {customer?.fullName}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </p>
                  </Col>
                </Row>
                <Row className="row-customer-rank">
                  <Col xs={24} sm={12} lg={12} className="label-left">
                    <h3>Rank:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    {customer?.rank ? (
                      <div className="order-report-customer-rank-wrapper">
                        <span className="order-report-customer-rank">{customer?.rank}</span>
                      </div>
                    ) : (
                      <p>-</p>
                    )}
                  </Col>
                </Row>
                <Row className="mt-1 mb-1">
                  <Col xs={24} sm={12} lg={12} className="label-left">
                    <h3>{pageData.shippingAddress}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    {customer?.address ? (
                      <p>
                        {customer?.address?.address1},&nbsp;
                        {customer?.address?.ward?.prefix}&nbsp;
                        {customer?.address?.ward?.name},&nbsp;
                        {customer?.address?.district?.prefix}&nbsp;
                        {customer?.address?.district?.name},&nbsp;
                        {customer?.address?.city?.name}
                      </p>
                    ) : (
                      <p>-</p>
                    )}
                  </Col>
                </Row>
                <Row className="mt-1 mb-1">
                  <Col xs={24} sm={12} lg={12} className="label-left">
                    <h3>{pageData.phone}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    {customer?.phoneNumber ? <p>{customer?.phoneNumber}</p> : <p>-</p>}
                  </Col>
                </Row>
                <Row className="mt-1 mb-1">
                  <Col xs={24} sm={12} lg={12} className="label-left accumulatedPoint">
                    <h3>{pageData.accumulatedPoint}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    {customer?.accumulatedPoint ? (
                      <p className="accumulatedPoint">
                        {customer?.accumulatedPoint} {pageData.points}
                      </p>
                    ) : (
                      <p>-</p>
                    )}
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span={24} className="mb-10 mt-10 boxDeliveryOrder">
            {initDataOrder?.orderDelivery && (
              <Card
                className={`w-100 fnb-card h-auto ${initDataOrder?.orderTypeId === OrderTypeConstants.PickUp && ` my-33`
                  }`}
              >
                <h4 className="order-detail-card-title">{pageData.orderDelivery}</h4>
                <Row className="mt-1 mb-1">
                  <Col xs={24} sm={12} lg={12} className="label-left">
                    <h3>{pageData.receiverName}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    <p>{initDataOrder?.orderDelivery?.receiverName}</p>
                  </Col>
                </Row>
                <Row className="mt-1 mb-1">
                  <Col xs={24} sm={12} lg={12} className="label-left">
                    <h3>{pageData.receiverAddress}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    <p>{initDataOrder?.orderDelivery?.receiverAddress}</p>
                  </Col>
                </Row>
                <Row className="mt-1 mb-1">
                  <Col xs={24} sm={12} lg={12} className="label-left">
                    <h3>{pageData.receiverPhone}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    <p>{initDataOrder?.orderDelivery?.receiverPhone}</p>
                  </Col>
                </Row>
                <Row className="w-100 border-dashed"></Row>

                <Row className="mt-20">
                  <Col xs={24} sm={12} lg={12} className="label-left flex-start">
                    <h3>{capitalize(pageData.deliveryMethod)}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    <Row className="row-right">
                      <div className="boxDeliveryMethod">
                        <p className="textDeliveryMethod">{initDataOrder?.deliveryMethod?.name?.toUpperCase()}</p>
                      </div>
                      <div>{renderDeliveryIcon(initDataOrder?.deliveryMethod?.enumId)}</div>
                    </Row>
                    <Row className="row-right">
                      <p className="deliveryOrderId">{initDataOrder.deliveryOrderId}</p>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col xs={24} sm={12} lg={12} className="label-left flex-start">
                    <h3>{pageData.shipperInformation}:</h3>
                  </Col>
                  <Col xs={24} sm={12} lg={12} className="label-right">
                    <Row className="row-right">
                      {(isMobile && initDataOrder?.orderDelivery?.shipperName) && (
                        <div className="mr-12">
                          <ShipperIcon />
                        </div>
                      )}
                      <div className="boxShipperName">
                        <p className="textShipperName">{initDataOrder?.orderDelivery?.shipperName || "-"}</p>
                      </div>
                      {!isMobile && initDataOrder?.orderDelivery?.shipperName && (
                        <div className="ml-12">
                          <ShipperIcon />
                        </div>
                      )}
                    </Row>
                    <Row className="row-right">
                      <p className="textShipperName">{initDataOrder?.orderDelivery?.shipperPhone || "-"}</p>
                    </Row>
                  </Col>
                </Row>
              </Card>
            )}
          </Col>
        </Col>
      </Row>
      <Row className="order-detail-items">
        <Card className="w-100 fnb-card h-auto mt-3">
          <h4 className="order-detail-card-title">{pageData.orderItems.toUpperCase()}</h4>
          <FnbTable
            className="order-items-list"
            dataSource={orderItems}
            columns={getColumnOrderItems}
            pagination={false}
          />
          <Row className="w-100 sub-total mt-3">
            <Col xs={24} sm={24} md={24} lg={16} className="sub-total-element"></Col>
            <Col xs={24} sm={24} md={24} lg={8} className="sub-total-element">
              <Row>
                <Col span={12}>
                  <p className="gross-total-label">{pageData.subtotal}:</p>
                </Col>
                <Col span={12} className="text-right gross-total-data">
                  <p>{formatCurrency(initDataOrder?.originalPrice)}</p>
                </Col>
              </Row>
              {initDataOrder?.storeFoodyPlatformId && (
                <>
                  <Row>
                    <Col span={12}>
                      {pageData.partnerCommission}
                      <span className="partner-commission">{`(${initDataOrder?.partnerCommission ?? "0"}%)`}</span>
                    </Col>
                    <Col span={12} className="text-right">
                      {formatCurrency(
                        (initDataOrder?.totalAmount * (initDataOrder?.partnerCommission || 0)) / 100,
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>{pageData.storeDiscount}:</Col>
                    <Col span={12} className="text-right">
                      {formatCurrency(initDataOrder?.storeDiscount || 0)}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>{pageData.partnerDiscount}:</Col>
                    <Col span={12} className="text-right">
                      {formatCurrency(initDataOrder?.partnerDiscount || 0)}
                    </Col>
                  </Row>
                </>
              )}
              <Row>
                <Col span={12}>{pageData.discount}:</Col>
                <Col span={12} className="text-right">
                  {initDataOrder?.totalDiscountAmount > 0 ? (
                    <>-{formatCurrency(initDataOrder?.totalDiscountAmount)}</>
                  ) : (
                    <>{formatCurrency(initDataOrder?.totalDiscountAmount)}</>
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Collapse ghost>
                    <Panel
                      header={pageData.feeAndTax}
                      className="shipping-panel"
                      extra={<>{formatCurrency(initDataOrder?.totalFee + initDataOrder?.totalTax ?? 0)}</>}
                    >
                      <Row>
                        <Col span={16} className="shipping-fee">
                          {pageData.shippingFee}
                        </Col>
                        <Col span={8} className="text-right shipping-fee">
                          {formatCurrency(initDataOrder?.deliveryFee)}
                        </Col>
                      </Row>
                      {initDataOrder?.orderFees?.map((feeItem) => {
                        const { isPercentage, feeValue, feeName } = feeItem;
                        const originalOrderAmount = initDataOrder?.originalPrice;
                        const value = isPercentage ? originalOrderAmount * (feeValue / 100) : feeValue; // calculate fee value if the fee is percentage
                        return (
                          <Row className="mt-2">
                            <Col span={16} className="shipping-fee">
                              {isPercentage ? (
                                <span>
                                  {feeName}({feeValue}%)
                                </span>
                              ) : (
                                <span>{feeName}</span>
                              )}
                            </Col>
                            <Col span={8} className="text-right shipping-fee">
                              {formatCurrency(value)}
                            </Col>
                          </Row>
                        );
                      })}

                      <Row>
                        <Col span={16} className="shipping-fee">
                          {pageData.tax}
                        </Col>
                        <Col span={8} className="text-right shipping-fee">
                          {formatCurrency(initDataOrder?.totalTax)}
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
              <hr className="hr-dashed" />
              <Row className="mt-2 mb-2">
                <Col span={12} className="total-amount">
                  <b>{pageData.total}:</b>
                </Col>
                <Col span={12} className="text-right total-amount">
                  <b>{formatCurrency(initDataOrder?.totalAmount)}</b>
                </Col>
              </Row>
              <Row className="mt-3 mb-3">
                <Col span={12}>{pageData.cost}:</Col>
                <Col span={12} className="text-right">
                  {formatCurrency(initDataOrder?.totalCost)}
                </Col>
              </Row>
              <hr className="hr-dashed" />
              <Row className="mt-2">
                <Col span={12}>
                  <b className="profit-amount">{pageData.profit}:</b>
                  <Tooltip placement="topLeft" title="Profit = Subtotal - Discount - Cost">
                    <span className="ml-2 pointer">
                      <InfoCircleOutlined className="tooltip-info" />
                    </span>
                  </Tooltip>
                </Col>
                <Col span={12} className="text-right profit-amount">
                  <b>{formatCurrency(initDataOrder?.profit > 0 ? initDataOrder?.profit : 0)}</b>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Row>
      <EditStatusDetailOrder
        isModalVisible={isShowEditStatusDetailOrder}
        handleCancel={() => onCancel()}
        handleSusscess={() => onSusscess()}
        propOrderId={initDataOrder?.id}
        propOrderCode={initDataOrder?.stringCode}
        propOrderStatusId={initDataOrder?.statusId}
      />
      <OrderDetailHistoryModal
        isShow={showOrderDetailHistoryModal}
        orderId={initDataOrder?.id}
        handleCancel={() => setShowOrderDetailHistoryModal(false)}
      />
    </>
  );
}
