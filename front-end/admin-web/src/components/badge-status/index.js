import React from "react";
import "./index.scss";

/**
 * Badge Status
 * @param {bool} status - Status of the badge
 * @returns Active or Inactive label
 */
export function BadgeStatus(props) {
  const { isActive } = props;

  const pageData = {
    active: "Đang hoạt động",
    inactive: "Không hoạt động",
  };

  const renderStatus = () => {
    if (isActive) {
      return (
        <span className="badge-status active">
          <span> {pageData.active}</span>
        </span>
      );
    }

    return (
      <span className="badge-status default">
        <span> {pageData.inactive}</span>
      </span>
    );
  };

  return <>{renderStatus()}</>;
}
