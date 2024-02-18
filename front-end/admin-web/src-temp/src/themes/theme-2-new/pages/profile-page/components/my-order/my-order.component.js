import { Col, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import customerDataService from "../../../../../data-services/customer-data.service";
import { formatTextNumber } from "../../../../../utils/helpers";
import loadingOrangeGif from "../../../../assets/icons/loading.gif";
import { EnumOrderStatusStoreWeb } from "../../../../constants/enum";
import "./my-order.component.scss";
import OrderCardComponent from "./order-card.component";
import { HttpStatusCode } from "../../../../../utils/http-common";

export default function MyOrdersTheme2(props) {
  const [t] = useTranslation();
  const { navigateToOrderDetail, isCustomize } = props;
  const translateData = {
    all: t("orderStatus.all", "All"),
    toConfirm: t("orderStatus.toConfirm", "To Confirm"),
    processing: t("orderStatus.processing", "Processing"),
    delivering: t("orderStatus.delivering", "Delivering"),
    completed: t("orderStatus.completed", "Completed"),
    canceled: t("orderStatus.canceled", "Canceled"),
    draft: t("orderStatus.draft", "Draft"),
    orders: t("order.orders", "Orders"),
    startOrdering: t("order.startOrdering", "Start ordering"),
    notOrder: t("orderDetail.notOrder", "Bạn chưa có đơn hàng nào"),
  };
  const tableSettings = {
    page: 1,
    pageSize: 20,
  };
  let orderTabsStatus = [
    {
      key: EnumOrderStatusStoreWeb.All,
      name: translateData.all,
    },
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
  const keyValueAll = orderTabsStatus[0].key;
  const nameValueAll = orderTabsStatus[0].name;
  const loadingFromBottomHeight = 10;
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [currentTab, setCurrentTab] = useState(keyValueAll);
  const [currentTabName, setCurrentTabName] = useState(nameValueAll);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const getMyOrders = async (statusId) => {
    setLoading(true);
    const orderStatusId = statusId === keyValueAll ? "" : statusId;
    const response = await customerDataService.getMyOrders(tableSettings.page, tableSettings.pageSize, orderStatusId);
    if (response?.status === HttpStatusCode.Ok) {
      setOrderList(response?.data?.orders);
      setNumberOfOrders(response?.data?.totalOrders);
      setPageNumber(tableSettings.page + 1);
    }
    setHasMore(response?.data?.orders?.length === tableSettings.pageSize);
    setLoading(false);
  };

  useEffect(() => {
    if (isCustomize) {
      setLoading(false);
    } else {
      getMyOrders("");
    }
  }, []);

  useEffect(() => {
    setCurrentTabName(orderTabsStatus?.find((tab) => tab.key === currentTab)?.name ?? "");
  }, [currentTab]);

  const onChangeTab = (e) => {
    const element = document.getElementById("my-orders-list");
    element?.scrollTo(0, 0);
    setPageNumber(tableSettings.page);
    setCurrentTab(e?.target?.value);
    getMyOrders(e?.target?.value);
  };

  const onRefesh = () => {
    getMyOrders(currentTab);
  };

  // lazy load
  const loadMoreData = async () => {
    if (!hasMore) {
      return;
    }
    setLoading(true);
    const orderStatusId = currentTab === keyValueAll ? "" : currentTab;
    const response = await customerDataService.getMyOrders(pageNumber, tableSettings.pageSize, orderStatusId);
    if (response?.status === HttpStatusCode.Ok) {
      setOrderList([...orderList, ...response?.data?.orders]);
      setNumberOfOrders(response?.data?.totalOrders);
    }
    setHasMore(response?.data?.orders?.length === tableSettings.pageSize);
    setPageNumber(pageNumber + 1);
    setLoading(false);
  };

  const handleScroll = async (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - loadingFromBottomHeight && !loading) {
      await loadMoreData();
    }
  };

  useEffect(() => {
    const element = document.getElementById("my-orders-list");
    if (handleScroll && element) {
      element.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (handleScroll && element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore, handleScroll]);
  //----

  return (
    <div className="my-orders-theme2">
      <div className="my-orders-nav">
        <div className="my-orders-status-list">
          <Radio.Group className="my-order-status-list-rd" value={currentTab} onChange={(e) => onChangeTab(e)}>
            {orderTabsStatus?.map((item, index) => {
              return (
                <Radio.Button key={index} value={item?.key} className="my-order-status-rd">
                  {item?.name}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
      </div>
      {numberOfOrders > 0 && (
        <Row className="my-order-title">
          <Col xs={12} className="order-status-name">
            {currentTabName}
          </Col>
          <Col xs={12} className="total-orders">
            {formatTextNumber(numberOfOrders)} {translateData.orders}
          </Col>
        </Row>
      )}
      <div
        id="my-orders-list"
        className="my-orders-list"
        style={{ maxHeight: numberOfOrders > 0 ? "400px" : "max-content" }}
      >
        {orderList?.length > 0 ? (
          <>
            {orderList?.map((order) => {
              return (
                <OrderCardComponent data={order} navigateToOrderDetail={navigateToOrderDetail} onRefesh={onRefesh} />
              );
            })}
            {loading && (
              <div className="loading-orders">
                <img src={loadingOrangeGif} />
              </div>
            )}
          </>
        ) : !loading ? (
          <div className="no-order">
            <div className="order-description">
              <span className="not-order-yet">{translateData.notOrder}</span>
              <Link to="/product-list" className="order-btn">
                {translateData.startOrdering}
              </Link>
            </div>
          </div>
        ) : (
          <div className="loading-orders">
            <img src={loadingOrangeGif} />
          </div>
        )}
      </div>
    </div>
  );
}
