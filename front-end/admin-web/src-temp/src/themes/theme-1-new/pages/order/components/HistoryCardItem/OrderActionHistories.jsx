import { useEffect, useState } from "react";
import orderService from "../../../../../services/orders/order-service";
import { actionBgColor, actionIcon, actionName, actionType } from "../ActionButtons/ActionButton";
import HistoriesNotFound from "./HistoriesNotFound";
import HistoryCardItem from "./HistoryCardItem";
import "./HistoryCardItem.style.scss";

function OrderActionHistories(props) {
  const { open, fontFamily } = props;
  const [histories, setHistories] = useState([]);
  useEffect(() => {
    if (open) {
      const orderActionHistories = orderService.getOrderActionToHistories();
      const _histories = orderActionHistories?.map((i) => dataMapper(i));
      setHistories(_histories);
    }
  }, [open, histories.length]);

  const dataMapper = (data) => {
    const _actionName = actionName(data.action);
    const _icon = actionIcon(data.action);
    const _background = actionBgColor(data.action);
    const _time = data.time;
    const _message = data.action === actionType.ORDER ? "" : data.content;
    const _orderInfo = data.action === actionType.ORDER ? data.content : [];
    return {
      ...data,
      actionName: _actionName,
      icon: _icon,
      background: _background,
      time: _time,
      orderInfo: _orderInfo,
      message: _message,
    };
  };

  return (
    <div className="history-content" style={{ fontFamily: fontFamily }}>
      {(!histories || histories?.length === 0) && <HistoriesNotFound />}
      {histories?.map((data, index) => {
        const countHistory = histories?.length;
        const refHistory = countHistory - 1 === index;
        return <HistoryCardItem data={data} scrollHistoryNew={{ refHistory, open: open }} />;
      })}
    </div>
  );
}
export default OrderActionHistories;
