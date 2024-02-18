import { Popover } from "antd";
import React, { useEffect, useState } from "react";
import {
  DeliveryAddressBranchLocationIcon,
  DeliveryAddressPopoverArrowRightIcon,
  DeliveryHeaderArrowDownIcon,
  DeliveryHeaderIcon,
} from "../../../assets/icons.constants";
import { useTranslation } from "react-i18next";

function DeliveryAddessDetail(props) {
  const [t] = useTranslation();
  const {
    onClick,
    onClose,
    onClickDropDown,
    selectedAddress,
    openDialogSelectReceiverAddress,
    openDialogSelectStoreBranchAddress,
    openDialogSelectTypeAndBranch,
    branchSelected,
  } = props;

  useEffect(() => {
    setOpenDeliveryAddessDetail(onClick);
  }, [onClick]);

  const translatedData = {
    deliveryTo: t("checkOutPage.deliveryTo", "Giao hàng tới"),
    branch: t("orderDetail.branch", "Chi nhánh"),
    chooseBranch: t("orderDetail.chooseBranch", "Chọn chi nhánh"),
    chooseAddress: t("orderDetail.chooseAddress", "Chọn địa chỉ"),
  };

  const [openDeliveryAddessDetail, setOpenDeliveryAddessDetail] = useState(false);

  const closeDeliveryAddessDetail = () => {
    setOpenDeliveryAddessDetail(false);
    if (onClose) {
      onClose();
    }
  };

  const ReceiverAddressDetail = () => {
    return (
      <div
        className="top-content address-detail"
        onClick={() => {
          if (openDialogSelectReceiverAddress) {
            openDialogSelectReceiverAddress();
          }
          closeDeliveryAddessDetail();
        }}
      >
        <div className="detail-left-box">
          <div className="img-box">
            <DeliveryHeaderIcon />
          </div>
        </div>
        <div className="detail-middle-box">
          <span className="text-delivery-to">{translatedData.deliveryTo}</span>
          <div className="text-delivery-address">
            <span>{selectedAddress ? selectedAddress.address : t(translatedData.chooseAddress)}</span>
          </div>
        </div>
        <div className="detail-right-box">
          <span className="icon">
            <DeliveryAddressPopoverArrowRightIcon />
          </span>
        </div>
      </div>
    );
  };

  const StoreBranchAddressDetail = () => {
    return (
      <div
        className="bottom-content address-detail"
        onClick={() => {
          openDialogSelectStoreBranchAddress();
          closeDeliveryAddessDetail();
        }}
      >
        <div className="detail-left-box">
          <div className="img-box">
            <DeliveryAddressBranchLocationIcon />
          </div>
        </div>
        <div className="detail-middle-box">
          <span className="text-delivery-to">{translatedData.branch}</span>
          <div className="text-delivery-address">
            <span>{branchSelected?.addressDetail ?? translatedData.chooseBranch}</span>
          </div>
        </div>
        <div className="detail-right-box">
          <span className="icon">
            <DeliveryAddressPopoverArrowRightIcon />
          </span>
        </div>
      </div>
    );
  };

  const PopoverAddressDetailContent = () => {
    return (
      <div className="address-detail-popover-content">
        <ReceiverAddressDetail />
        <StoreBranchAddressDetail />
      </div>
    );
  };

  return (
    <>
      <div className="right-box" onClick={onClickDropDown}>
        <Popover
          getPopupContainer={(trigger) => trigger.parentElement}
          open={openDeliveryAddessDetail}
          placement="bottomRight"
          showArrow={false}
          trigger="click"
          content={<PopoverAddressDetailContent />}
          overlayClassName="popover-delivery-address-detail-theme2"
        >
          <DeliveryHeaderArrowDownIcon />
        </Popover>
      </div>

      {/* Hidden function, use for other page */}
      <div
        hidden
        className="store-branch-address-selector-checkout d-none"
        onClick={() => {
          if (openDialogSelectTypeAndBranch) openDialogSelectTypeAndBranch();
          closeDeliveryAddessDetail();
        }}
      ></div>
    </>
  );
}

export default DeliveryAddessDetail;
