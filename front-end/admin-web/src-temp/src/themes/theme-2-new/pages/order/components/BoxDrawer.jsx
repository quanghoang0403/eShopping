import { Drawer } from "antd";
import { useEffect, useState } from "react";

function BoxDrawer({
  placement = "bottom",
  width = 500,
  title = "",
  onClose,
  open,
  extra,
  body,
  closeIcon = false,
  closable = false,
  className,
  height = 500,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    if (open !== isOpen) {
      setIsOpen(open);
    }
  }, [isOpen, open]);

  return (
    <Drawer
      height={height}
      className={className}
      closable={closable}
      closeIcon={closeIcon}
      title={title}
      placement={placement}
      width={width}
      onClose={onClose && onClose}
      open={isOpen}
      extra={extra}
    >
      {body}
    </Drawer>
  );
}

export default BoxDrawer;
