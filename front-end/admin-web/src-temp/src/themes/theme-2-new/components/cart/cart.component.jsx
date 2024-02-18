import { Badge, Popover } from "antd";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { CartIconUrl } from "../../assets/icons.constants";

function CartComponent(props) {
  const { className, content: Content, groupColorConfig } = props;
  const cartItems = useSelector((state) => state.session.cartItems);
  const [open, setOpen] = useState(false);

  const StyledIconFill = styled.div`
    .icon-fill-color {
      path {
        fill: ${groupColorConfig?.titleColor};
      }
    }
  `;

  const totalItems = useMemo(() => {
    let countItem = 0;
    Array.isArray(cartItems) &&
      cartItems?.forEach((e) => {
        countItem = countItem + e.quantity;
      });

    return countItem;
  }, [cartItems]);

  function handleOpenPopover(open) {
    setOpen(open);
  }

  return (
    <Popover
      overlayClassName={className}
      placement="bottomRight"
      showArrow={false}
      trigger="click"
      onOpenChange={handleOpenPopover}
      content={() => {
        return <Content open={open} />;
      }}
      getPopupContainer={(trigger) => trigger.parentElement}
    >
      <a className="pointer" role="button" href>
        <Badge count={totalItems} color="#ffffff" style={{ color: "#000000" }}>
          <StyledIconFill>
            <span className="icon-fill-color">
              <CartIconUrl alt="cart-icon"></CartIconUrl>
            </span>
          </StyledIconFill>
        </Badge>
      </a>
    </Popover>
  );
}

export default CartComponent;
