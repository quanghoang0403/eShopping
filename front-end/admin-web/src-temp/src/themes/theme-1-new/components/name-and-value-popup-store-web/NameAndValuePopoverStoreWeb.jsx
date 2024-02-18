import { Popover } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { ArrowBoldDownIcon, PriceTagPromotion } from "../../assets/icons.constants";
import "./NameAndValuePopoverStoreWeb.scss";

function NameAndValuePopoverStoreWeb(props) {
  const [t] = useTranslation();
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });
  const [isVisible, setIsVisible] = useState(false);
  const btnRef = useRef(null);
  const translatedData = {
    promotion: t("storeWebPage.productDetailPage.promotions", "Khuyến mãi"),
  };

  const btnPromotion = (
    <div className="btn-promotions-product" ref={btnRef}>
      <div className="promotion-icon">
        <PriceTagPromotion />
      </div>
      <div className="promotion">{translatedData.promotion}</div>
      <div className="promotion-down-icon">
        <ArrowBoldDownIcon />
      </div>
    </div>
  );

  const { className = "", placement = "bottomLeft", data = [], button = btnPromotion, trigger = "hover" } = props;

  useEffect(() => {
    if (!btnRef.current) return;
    const arrowElement = document.querySelector(".popover-promotion-product-detail-theme1 .ant-popover-arrow");
    if (!arrowElement) return;
    const buttonWidth = btnRef?.current?.offsetWidth ?? 0;
    arrowElement.style.right = `calc(100% - ${buttonWidth}px)`;
  }, [isVisible]);

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
      showArrow={true}
      trigger={isMaxWidth575 ? "click" : trigger}
      content={content}
      getPopupContainer={(trigger) => trigger.parentElement}
      onOpenChange={(visible) => setIsVisible(visible)}
      afterOpenChange={() => setIsVisible(true)}
    >
      {button}
    </Popover>
  );
}

export default NameAndValuePopoverStoreWeb;
