import { Button, Col, Form, Input, Layout, Row } from "antd";
import { Header } from "antd/lib/layout/layout";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { orderInfoSelector } from "../../../modules/order/order.reducers";
import { useAppCtx } from "../../../providers/app.provider";
import orderService from "../../../services/orders/order-service";
import posCartService from "../../../services/pos/pos-cart.services";
import { BackIcon } from "../../assets/icons/BackIcon";
import { useSearchParams } from "../../hooks";
import ActionButton, { actionType } from "./components/ActionButtons/ActionButton";
import BellIcon from "./components/ActionButtons/BellIcon";
import CashIcon from "./components/ActionButtons/CashIcon";
import HistoryButton from "./components/ActionButtons/HistoryButton";
import BackButton from "./components/BackButton";
import TopBackground from "./components/Background/TopBackground";
import BoxDrawer from "./components/BoxDrawer";
import CloseButton from "./components/CloseButton";
import OrderActionHistories from "./components/HistoryCardItem/OrderActionHistories";
import Logo from "./components/Logo";
import OrderAreaInfo from "./components/OrderAreaInfo";
import StoreInfo from "./components/StoreInfo";
import "./order.style.scss";

const { TextArea } = Input;
function OrderPage(props) {
  const { fontFamily } = props;
  const messageBoxRef = useRef(null);
  const { Toast } = useAppCtx();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenMessageBox, setIsOpenMessageBox] = useState(false);
  const [isOpenHistoryBox, setIsOpenHistoryBox] = useState(false);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const query = useSearchParams();
  const qrCodeId = query.get("qrCodeId");
  const reduxStoreInfo = useSelector(orderInfoSelector);
  const [qrCodeOrder, setQrCodeOrder] = useState();

  async function fetchData(qrCodeId) {
    if (qrCodeId) {
      await orderService.getQrCodeOrderAsync(qrCodeId);
    }
  }

  //http://localhost:3000/action-page?qrCodeId=69fb7d32-93c6-4b66-8a39-0df5713d469c
  useEffect(() => {
    // TODO: Fetch store info and init data from router parameters
    // branchName, branchAddress, storeLogo, area-table
    fetchData(qrCodeId);
  }, [qrCodeId]);

  useEffect(() => {
    if (reduxStoreInfo) {
      setQrCodeOrder(reduxStoreInfo);
    }
  }, [reduxStoreInfo]);

  useEffect(() => {
    if (isLoading === true) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // deboune 1 second
    }
  }, [isLoading]);

  function focusMessageBox() {
    if (messageBoxRef && messageBoxRef.current) {
      setTimeout(() => {
        messageBoxRef.current.focus({
          cursor: "start",
        });
      }, 100);
    } else {
      setTimeout(() => {
        focusMessageBox();
      }, 100);
    }
  }

  // Open message box and auto focus text area
  useEffect(() => {
    if (isOpenMessageBox) {
      focusMessageBox();
      if (form) {
        form.setFieldsValue({ message: "" }); // clear old message
      }
    }
  }, [isOpenMessageBox, messageBoxRef]);

  function handleBack() {
    history.goBack(); // back to previous page
  }

  function handleClose() {
    posCartService.cleanPOSCartAsync(history.push("/")); // back to home page
  }

  function openFormCallWaiter() {
    setIsOpenMessageBox(!isOpenMessageBox);
  }

  function handleOpenOrderList() {
    setIsLoading(true);
    history.push("/pos?" + query.toString()); // redirect to product list
  }

  async function handleSubmitCallWaiter(formValues) {
    setIsLoading(true);
    const { message } = formValues;
    setIsOpenMessageBox(false);
    await orderService.sendNotify2CallWaiterAsync(qrCodeOrder, message, (success) => {
      if (success) {
        Toast.success({
          message: t("order.theMessageHasBeenSentSuccessfully"),
          icon: <BellIcon width={"40px"} hideBg={true} style={{ marginTop: "-8px", marginRight: "10px" }} />,
        });

        // Save history
        const history = {
          action: actionType.CALL_WAITER,
          areaName: qrCodeOrder?.areaName,
          content: message,
        };
        orderService.saveOrderActionToHistory(history);
      }
    });
  }

  async function handleCallPayment() {
    setIsLoading(true);
    await orderService.sendNotify2CallPaymentAsync(qrCodeOrder, (success) => {
      if (success) {
        Toast.success({
          message: t("order.calledPaymentSuccessfully"),
          icon: <CashIcon width={"45px"} hideBg={true} style={{ marginTop: "-10px", marginRight: "5px" }} />,
        });

        // Save history
        const history = {
          action: actionType.CALL_PAYMENT,
          areaName: qrCodeOrder?.areaName,
          content: "order.calledPaymentSuccessfully",
        };
        orderService.saveOrderActionToHistory(history);
      }
    });
  }

  function handleOpenHistory() {
    setIsOpenHistoryBox(!isOpenHistoryBox);
  }
  return (
    <Layout className="order" style={{ fontFamily: fontFamily }}>
      <Row justify="center">
        <Col span={24} className="order-main">
          <Header>
            <div>
              <Row justify="center">
                <Col className="content-center pointer" lg={2} md={4} span={4} onClick={handleBack}>
                  <BackButton />
                </Col>
                <Col className="content-center pointer" lg={18} md={16} span={16}>
                  <Logo src={qrCodeOrder?.storeLogo} />
                </Col>
                <Col className="content-center pointer" lg={2} md={4} span={4} onClick={handleClose}>
                  <CloseButton />
                </Col>
              </Row>
            </div>
          </Header>
          <StoreInfo {...qrCodeOrder} />
          <TopBackground className="top-bg" />
          <div className="pb-10 action-button-group">
            <Row className="content-center area-info">
              <OrderAreaInfo {...qrCodeOrder} />
            </Row>
            <Row className="content-center" gutter={[25]}>
              <Col xxl={5} xl={6} lg={8} md={10} sm={8} span={12}>
                <ActionButton height={"100%"} onClick={handleOpenOrderList} isLoading={isLoading} />
              </Col>
              <Col className="order-call-actions padding-left-5px" xxl={5} xl={6} lg={8} md={10} sm={8} span={12}>
                <ActionButton action={actionType.CALL_WAITER} onClick={openFormCallWaiter} isLoading={isLoading} />
                <ActionButton action={actionType.CALL_PAYMENT} onClick={handleCallPayment} isLoading={isLoading} />
              </Col>
            </Row>
          </div>
          <Row className="content-center">
            <HistoryButton {...props} onClick={handleOpenHistory} />
          </Row>
        </Col>
      </Row>

      <BoxDrawer
        className="message-box"
        title={
          <div style={{ fontFamily: fontFamily }} className="content-center">
            {t("order.callWaiter")}
          </div>
        }
        height={"auto"}
        open={isOpenMessageBox}
        onClose={() => setIsOpenMessageBox(false)}
        body={
          <Form form={form} onFinish={handleSubmitCallWaiter} style={{ fontFamily: fontFamily }}>
            <Row gutter={[15, 15]}>
              <Col span={24} className="content-center">
                <span>{t("order.messageToWaiter")}</span>
              </Col>
              <Col span={24}>
                <Form.Item name={"message"}>
                  <TextArea
                    ref={messageBoxRef}
                    showCount
                    autoFocus
                    maxLength={100}
                    style={{ height: 160, resize: "none", fontFamily: fontFamily }}
                    placeholder={t("order.messageExample")}
                  />
                </Form.Item>
              </Col>
              <Col span={24} className="content-center">
                <Button className="btn-send-message" type="primary" htmlType="submit">
                  {t("order.send")}
                </Button>
              </Col>
            </Row>
          </Form>
        }
      />

      <BoxDrawer
        closeIcon={<BackIcon />}
        closable={true}
        className="history-box"
        title={
          <div style={{ fontFamily: fontFamily }} className="content-center history-label">
            {t("order.history")}
          </div>
        }
        height={"100%"}
        open={isOpenHistoryBox}
        onClose={() => setIsOpenHistoryBox(false)}
        body={<OrderActionHistories {...props} open={isOpenHistoryBox} />}
      />
    </Layout>
  );
}

export default OrderPage;
