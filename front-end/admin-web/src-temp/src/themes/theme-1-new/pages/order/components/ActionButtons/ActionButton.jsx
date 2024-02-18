import { Grid, Row } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { isMobileBreakPoint } from "../../../../../utils/antdBreakPoint.helpers";
import "./ActionButton.style.scss";
import BellIcon from "./BellIcon";
import BookOrderIcon from "./BookOrderIcon";
import CashIcon from "./CashIcon";

export const actionType = {
  ORDER: "ORDER",
  CALL_WAITER: "CALL_WAITER",
  CALL_PAYMENT: "CALL_PAYMENT",
};

export const actionName = (type) => {
  if (type === actionType.ORDER) {
    return "order.bookOrder";
  }
  if (type === actionType.CALL_WAITER) {
    return "order.callWaiter";
  }
  if (type === actionType.CALL_PAYMENT) {
    return "order.callPayment";
  }
};

export const actionIcon = (type, width) => {
  if (type === actionType.ORDER) {
    return <BookOrderIcon width={width} />;
  }
  if (type === actionType.CALL_WAITER) {
    return <BellIcon width={width} />;
  }
  if (type === actionType.CALL_PAYMENT) {
    return <CashIcon width={width} />;
  }

  return <BookOrderIcon />;
};

export const actionBgColor = (type) => {
  if (type === actionType.ORDER) {
    return "#F7F5FF";
  }
  if (type === actionType.CALL_WAITER) {
    return "#F4FFEF";
  }
  if (type === actionType.CALL_PAYMENT) {
    return "#FFF8F1";
  }
};

const { useBreakpoint } = Grid;

function ActionButton(props) {
  const { action, className, onClick, isLoading = false } = props;
  const screens = useBreakpoint();
  const isMobile = isMobileBreakPoint(screens);
  const { t } = useTranslation();
  const bgColor = useMemo(() => {
    let value = "#e2ddff";
    if (action === actionType.CALL_WAITER) {
      value = "#d4f3c5";
    }
    if (action === actionType.CALL_PAYMENT) {
      value = "#ffdfc1";
    }
    return value;
  }, [action]);

  const isSmallButton = useMemo(() => {
    return action === actionType.CALL_WAITER || action === actionType.CALL_PAYMENT;
  }, [action]);

  const ActionButtonStyled = styled.div`
    cursor: pointer;
    background-color: ${bgColor};
    svg {
      position: relative;
    }
    &:hover {
      opacity: 0.8;
    }
  `;

  const icon = useMemo(() => {
    const size = isMobile ? "50px" : "75px";
    return actionIcon(action);
  }, [action]);

  const label = useMemo(() => {
    let buttonLabel = t("order.bookOrder");
    if (action === actionType.CALL_WAITER) {
      buttonLabel = t("order.callWaiter");
    }
    if (action === actionType.CALL_PAYMENT) {
      buttonLabel = t("order.callPayment");
    }
    return buttonLabel;
  }, [action, t]);

  return (
    <ActionButtonStyled
      className={`action-button ${isSmallButton ? "btn-small" : "btn-large"} ${className ?? ""}`}
      onClick={onClick && isLoading === false && onClick}
    >
      <Row>
        <div className="icon content-center">{icon}</div>
      </Row>
      <Row className={`content-center`}>
        <div className="text-wrapper">{label}</div>
      </Row>
    </ActionButtonStyled>
  );
}

export default ActionButton;
