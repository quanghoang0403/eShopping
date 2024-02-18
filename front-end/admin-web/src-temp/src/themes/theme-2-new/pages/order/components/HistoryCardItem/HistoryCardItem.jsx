import { Col, Row } from "antd";
import moment from "moment";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LocationOutlineIcon } from "../../../../assets/icons.constants";
import { DateFormat } from "../../../../constants/string.constant";
import { actionType } from "../ActionButtons/ActionButton";
import "./HistoryCardItem.style.scss";

function HistoryCardItem({ data, scrollHistoryNew, ...props }) {
  const { t } = useTranslation();
  const historyInfo = {
    ...data,
  };

  const myRef = useRef(null);

  useEffect(() => {
    if (scrollHistoryNew?.refHistory) scrollToHistoryNew();
  }, [scrollHistoryNew]);

  const scrollToHistoryNew = () => {
    if (myRef.current && scrollHistoryNew?.refHistory) {
      myRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  function handleFormatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const isSame = moment().isSame(dateTime, "date");
    if (isSame) {
      return moment(dateTimeString).format(DateFormat.HH_MM);
    }

    return moment(dateTimeString).format(DateFormat.DD_MM_YYYY_HH_MM_2);
  }

  function OrderInfo({ data }) {
    if (data && data.length > 0) {
      let totalItems = 0;
      const elements = data?.map((i) => {
        totalItems += i.quantity;
        if (i.isCombo) {
          return (
            <Col span={24}>
              <Row className="space-between">
                <Col className="item-name">{i.itemName}</Col>
                <Col className="item-name">x{i.quantity}</Col>
              </Row>
              <Row className="pl-24 pt-8">
                {i?.orderItems?.map((oi) => {
                  return (
                    <Col span={24}>
                      <div className="item-name">{oi.itemName}</div>
                      <div className="pl-24 pt-8">{oi.options}</div>
                      <div className="pl-24">
                        {oi?.toppings?.map((t) => {
                          return (
                            <div className="pt-8">
                              <span>{t.quantity}x</span>
                              <span>{t.itemName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          );
        } else {
          return (
            <Col span={24}>
              <Row>
                {i?.orderItems?.map((oi) => {
                  return (
                    <Col span={24}>
                      <Row className="space-between">
                        <Col className="item-name">{oi.itemName}</Col>
                        <Col className="item-name">x{oi.quantity}</Col>
                      </Row>
                      <div className="pl-24 pt-8">{oi.options}</div>
                      <div className="pl-24">
                        {oi?.toppings?.map((t) => {
                          return (
                            <div className="pt-8">
                              <span>{t.quantity}x</span>
                              <span>{t.itemName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          );
        }
      });

      return (
        <Row gutter={[10, 10]}>
          {elements}
          <Col span={24} className="space-between pt-14">
            <div className="total-item">{t("order.totalItems")}</div>
            <div className="total-item uppercase">{totalItems}</div>
          </Col>
        </Row>
      );
    }
    return <></>;
  }

  return (
    <div className="history-item" style={{ backgroundColor: historyInfo.background }} ref={myRef}>
      <Row className="history-item-card space-between" gutter={[16, 16]}>
        <Col>
          <div className="history-icon-wrapper">{historyInfo.icon}</div>
        </Col>
        <Col className="history-content-wrapper" style={{ paddingLeft: "16px" }}>
          <div className="space-between">
            <div>
              <div className="action-name">{t(historyInfo.actionName)}</div>
              <div className="area-name">
                <LocationOutlineIcon /> <span>{historyInfo.areaName}</span>
              </div>
            </div>
            <div className="date-time">
              <span>{handleFormatDateTime(historyInfo.time)}</span>
            </div>
          </div>
          <div className="content">
            <Col span={24}>
              {historyInfo.action !== actionType.ORDER ? (
                <div>{t(historyInfo.message)}</div>
              ) : (
                <div className="order-detail">
                  <OrderInfo data={historyInfo.orderInfo} />
                </div>
              )}
            </Col>
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default HistoryCardItem;
