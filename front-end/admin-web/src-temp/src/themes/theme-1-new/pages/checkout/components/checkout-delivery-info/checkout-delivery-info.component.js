import { Form, Input } from "antd";
import locationIcon from "../../../../assets/icons/location.svg";
import userIcon from "../../../../assets/icons/user.svg";
import userPhoneIcon from "../../../../assets/icons/user_phone.svg";
import checkoutTimeIcon from "../../../../assets/icons/checkout-time.svg";
import {
  ArrowRightWhite,
  CheckoutArrowRightBlackIcon,
  CheckoutDeliveryIcon,
  CheckoutPickupIcon,
  CheckoutTimeIcon,
} from "../../../../assets/icons.constants";
import { useState } from "react";
import { enumOrderType } from "../../../../constants/enums";
import { SelectDeliveryTimeComponent } from "../../../../components/select-delivery-time/select-delivery-time.component";
import { useTranslation } from "react-i18next";
import { DateFormat, PHONE_NUMBER_REGEX } from "../../../../constants/string.constants";
export default function CheckoutDeliveryInfo(props) {
  const {
    deliveryDate,
    setDeliveryDate,
    timeSlot,
    setTimeSlot,
    workingHour,
    colorGroup,
    pageData,
    isHasAddress,
    deliveryAddress,
    openShippingAddressModal,
    onChangeCustomerName,
    defaultCustomerName,
    isHasCustomerName,
    isEditName,
    onChangePhone,
    readPhoneFromStorage,
    checkOnKeyPressValidation,
    isHasPhone,
    isEditPhone,
    estimateTime,
  } = props;
  const [t] = useTranslation();
  const translateData = {
    now: t("deliveryTime.now"),
    today: t("deliveryTime.today"),
    tomorrow: t("deliveryTime.tomorrow"),
    theDayAfterTomorrow: t("deliveryTime.theDayAfterTomorrow"),
    time: t("deliveryTime.time"),
    deliveryDateTrans: t("deliveryTime.deliveryDateTrans"),
    deliveryTimeTrans: t("deliveryTime.deliveryTimeTrans"),
    cancel: t("deliveryTime.cancel"),
    confirm: t("deliveryTime.confirm"),
    deliveryTo: t("addUserLocation.deliveryTo", "Giao đến"),
    pickUp: t("addUserLocation.pickUp", "Tự lấy hàng"),
    errorNotChoosePickupBranch: t("addUserLocation.errorNotChoosePickupBranch", "Bạn chưa chọn chi nhánh lấy hàng"),
    change: t("addUserLocation.change", "Thay đổi"),
  };
  const [isOpenDeliveryTime, setIsOpenDeliveryTime] = useState(false);
  const [dayText, setDayText] = useState(null);
  const moment = require("moment");
  function handleOpenSelectDeliveryTime() {
    if (workingHour) {
      setIsOpenDeliveryTime(true);
    }
  }

  function openBranchAddressModal() {
    const chooseAddressModal = document.getElementsByClassName("store-branch-address-select-button")[0];
    chooseAddressModal?.click();
  }

  function handleCloseSelectDeliveryTime() {
    setIsOpenDeliveryTime(false);
  }

  function getDayTimeText() {
    let text = `${translateData.today}`;
    ///Unselect
    if (!deliveryDate && !timeSlot) {
      text = `${translateData.today}`;
    }
    ///Today
    else if (deliveryDate === moment().format(DateFormat.YYYY_MM_DD)) {
      text = `${translateData.today} - ${timeSlot}`;
    }
    ///Tomorrow
    else if (deliveryDate === moment().add(1, "days").format(DateFormat.YYYY_MM_DD)) {
      text = `${translateData.tomorrow} - ${timeSlot}`;
    }
    ///Day after Tomorrow
    else if (deliveryDate === moment().add(2, "days").format(DateFormat.YYYY_MM_DD)) {
      text = `${translateData.theDayAfterTomorrow} - ${timeSlot}`;
    } else {
      text = `${dayText}, ${moment(deliveryDate).format(DateFormat.DD_MM_YYYY)} - ${timeSlot}`;
    }

    return text;
  }

  return (
    <div
      className="box_delivery card-wrapper card-pacing-bottom"
      style={{
        border: deliveryAddress?.orderType === enumOrderType.PICK_UP ? "1px solid #FF8C21" : "1px solid #1CA362",
      }}
    >
      <div
        className="delivery card-header"
        style={{
          backgroundColor: deliveryAddress?.orderType === enumOrderType.PICK_UP ? "#FF8C21" : "#1CA362",
        }}
      >
        <span className="header-icon">
          {deliveryAddress?.orderType === enumOrderType.PICK_UP ? <CheckoutPickupIcon /> : <CheckoutDeliveryIcon />}
        </span>
        <span className="header-text">
          {deliveryAddress?.orderType === enumOrderType.PICK_UP ? translateData.pickUp : translateData.deliveryTo}
        </span>
        <div
          className="header-button cursor-pointer"
          onClick={() => {
            if (deliveryAddress?.orderType === enumOrderType.PICK_UP) {
              openBranchAddressModal();
            } else {
              openShippingAddressModal();
            }
          }}
          style={{ backgroundColor: deliveryAddress?.orderType === enumOrderType.PICK_UP ? "#f27400" : "#026F30" }}
        >
          <span className="header-button-text">{translateData.change}</span>
          <ArrowRightWhite className="header-button-icon" />
        </div>
      </div>
      <div
        className="shipping_location_info cursor-pointer"
        onClick={() => {
          if (deliveryAddress?.orderType === enumOrderType.PICK_UP) {
            openBranchAddressModal();
          } else {
            openShippingAddressModal();
          }
        }}
      >
        <img className="shipping_location_icon" src={locationIcon} alt="" />
        <div className="shipping_location_detail">
          <div className="shipping_name">
            {deliveryAddress?.orderType === enumOrderType.PICK_UP
              ? deliveryAddress?.branchAddress?.title ?? translateData.errorNotChoosePickupBranch
              : deliveryAddress?.receiverAddress?.name?.split(",")[0]}
          </div>
          <div className="shipping_address">
            {deliveryAddress?.orderType === enumOrderType.PICK_UP
              ? deliveryAddress?.branchAddress?.addressDetail
              : !isHasAddress()
              ? pageData.noAddressMessage
              : deliveryAddress?.receiverAddress?.address}
          </div>
        </div>
        <div
          className={`address_icon ${
            !isHasAddress() && deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY && "address_icon_no_address"
          }`}
        >
          <CheckoutArrowRightBlackIcon />
        </div>
      </div>
      <div className="shipping_location_info cursor-pointer" onClick={handleOpenSelectDeliveryTime}>
        <img className="shipping_location_icon" src={checkoutTimeIcon} alt="" />
        <div className="shipping_location_detail">
          <div className="shipping_name">{translateData.deliveryTimeTrans}</div>
          <div className="shipping_address">
            <span>{getDayTimeText()}</span>
          </div>
        </div>
        <div className="address_icon_time">
          <CheckoutArrowRightBlackIcon />
        </div>
      </div>
      <Form autoComplete="off" className="shipping_info_box">
        <div className="shipping_info_name">
          <img className="check_out_name_icon" src={userIcon} alt="" />
          <Form.Item
            name="receiverName"
            rules={[
              {
                required: true,
                message: pageData.missingCustomerNameMessage,
              },
            ]}
          >
            <Input
              id="txtName"
              className="check_out_name"
              maxLength={200}
              autoFocus={true}
              allowClear={false}
              placeholder={pageData.placeHolderName}
              onChange={onChangeCustomerName}
              defaultValue={defaultCustomerName()}
            />
          </Form.Item>
        </div>
        <div className="shipping_info_phone">
          <img className="check_out_phone_icon" src={userPhoneIcon} alt="" />
          <Form.Item
            name="receiverPhone"
            rules={[
              {
                required: true,
                message: pageData.missingPhoneMessage,
              },
              {
                pattern: PHONE_NUMBER_REGEX,
                message: pageData.invalidPhoneNumber,
              },
            ]}
          >
            <Input
              id="txtPhone"
              className="check_out_phone"
              maxLength={15}
              allowClear={false}
              placeholder={pageData.placeHolderPhone}
              onChange={onChangePhone}
              defaultValue={readPhoneFromStorage()}
              onKeyPress={(event) => {
                const checkValidKey = checkOnKeyPressValidation(event, "txtPhone", 0, 999999999, 0);
                if (!checkValidKey) event.preventDefault();
              }}
            />
          </Form.Item>
        </div>
      </Form>
      <SelectDeliveryTimeComponent
        workingHour={workingHour}
        isOpenDeliveryTime={isOpenDeliveryTime}
        handleCancel={handleCloseSelectDeliveryTime}
        colorConfig={colorGroup}
        deliveryDate={deliveryDate}
        setDeliveryDate={setDeliveryDate}
        timeSlot={timeSlot}
        setTimeSlot={setTimeSlot}
        setDayText={setDayText}
        estimateTime={estimateTime}
      />
    </div>
  );
}
