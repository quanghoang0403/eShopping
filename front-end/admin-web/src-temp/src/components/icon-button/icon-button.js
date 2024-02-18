import React from "react";
import { Space, Tooltip } from "antd";
import { hasPermission } from "utils/helpers";
import "./icon-button.scss";

export function IconButtonComponent(props) {
  const { className, onClick, permission, icon, titleTooltip } = props;
  return (
    <>
      {permission && hasPermission(permission) ? (
        <Space wrap className={className}>
          <a onClick={() => onClick()}>
            <div className="fnb-table-action-icon">
              <Tooltip placement="top" title={titleTooltip} color="#50429B">
                {icon}
              </Tooltip>
            </div>
          </a>
        </Space>
      ) : (
        <></>
      )}
    </>
  );
}
