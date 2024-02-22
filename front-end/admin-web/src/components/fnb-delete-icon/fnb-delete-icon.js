import React from "react";
import { Tooltip } from "antd";
import { TrashIcon } from "constants/icons.constants";

export function FnbDeleteIcon(props) {
  return (
    <Tooltip placement="top" title="Xóa">
      <TrashIcon />
    </Tooltip>
  );
}
