import React from "react";
import { Button } from "antd";
import { hasPermission } from "utils/helpers";

export default function PrivateButton(props) {
  const { onClick, icon, type, className, text, permission } = props;
  return (
    <>
      {hasPermission(permission) && (
        <Button className={className} type={type} icon={icon} onClick={onClick}>
          {text}
        </Button>
      )}
    </>
  );
}

