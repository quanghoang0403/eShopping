import React from "react";
import { Space, Tooltip } from "antd";
import { CloneIcon } from "constants/icons.constants";
import { hasPermission } from "utils/helpers";
import { useTranslation } from "react-i18next";

export function CloneButtonComponent(props) {
  const { className, onClick, permission } = props;
  const [t] = useTranslation();

  return (
    <>
      {(!permission || hasPermission(permission)) && (
        <Space wrap className={className}>
          <a onClick={() => onClick()}>
            <div className="fnb-table-action-icon">
              <Tooltip placement="top" title={t("button.clone")} color="#50429B">
                <CloneIcon className="icon-svg-hover pointer" />
              </Tooltip>
            </div>
          </a>
        </Space>
      )}
    </>
  );
}
