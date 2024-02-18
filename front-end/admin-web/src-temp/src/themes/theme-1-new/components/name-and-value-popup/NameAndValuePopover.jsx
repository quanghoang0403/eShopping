import { Popover } from "antd";
import React from "react";
import { ArrowBoldDownIcon } from "../../assets/icons.constants";
import "./NameAndValuePopover.scss";

function NameAndValuePopover(props) {
  const { className = "", placement = "bottomRight", data = [], button = <ArrowBoldDownIcon /> } = props;

  const content = data?.map((item) => {
    return (
      <div>
        <div className="discount-title discount-item">
          <div className="name weight-700">{item?.name}</div>
          <div className="value weight-700">{item?.value}</div>
        </div>
        {item?.details?.map((itemDetail, index) => {
          return (
            <div className="discount-item" key={itemDetail?.name + index}>
              <div className="name">{itemDetail?.name}</div>
              <div className="value">{itemDetail?.value}</div>
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <Popover
      overlayClassName={`name-and-value-popover ${className}`}
      placement={placement}
      showArrow={false}
      trigger="click"
      content={content}
      getPopupContainer={(trigger) => trigger.parentElement}
    >
      {button}
    </Popover>
  );
}

export default NameAndValuePopover;
