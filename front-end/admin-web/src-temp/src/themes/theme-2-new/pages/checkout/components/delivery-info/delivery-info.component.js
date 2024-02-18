import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CheckoutInfoCard from "../../../../components/checkout-info-cart/checkout-info-cart.component";
import "./delivery-info.style.scss";
import { ReactComponent as GpsIcon } from "./gps-icon.svg";
import { ReactComponent as PhoneIcon } from "./phone-icon.svg";
import { ReactComponent as UserIcon } from "./user-icon.svg";
import { IconPickupCustomize } from "../../../../assets/icons/PickupDeliveryIcon";
import {
  AllowClearIcon,
  ClockDeliveryIcon,
  DiscountCodeSuffixIcon,
  EditDeliveryIcon,
} from "../../../../assets/icons.constants";
import { enumOrderType } from "../../../../constants/enum";
import { IconAddressDeliveryCustomize } from "../../../../assets/icons/AddressDeliveryIcon";
import { SelectDeliveryTimeComponent } from "./select-delivery-time.component";
import workingHoursDataService from "../../../../../data-services/working-hour-data.service";
import moment from "moment";
import { Form, Input } from "antd";
import { PHONE_NUMBER_REGEX } from "../../../../constants/string.constant";

export const CheckoutDeliveryInfo = forwardRef((props, ref) => {
  const {
    configuration,
    colorGroups,
    deliveryDate,
    timeSlot,
    setDeliveryDate,
    setTimeSlot,
    isEditReceiver,
    setIsEditReceiver,
    onValuesChange,
    isCustomize,
    currentDeliveryMethodSelected
  } = props;

  const [t] = useTranslation();
  const [form] = Form.useForm();
  const deliveryInfo = useSelector((state) => state?.session?.orderInfo?.deliveryInfo);
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress ?? null);
  const branchAddress = useSelector((state) => state?.session?.deliveryAddress?.branchAddress);

  useEffect(() => {
    setDeliveryDate(deliveryDate);
    setTimeSlot(timeSlot);
  }, []);

  const translatedData = {
    title: t("checkOutPage.shippingMethod", "Shipping method"),
    phoneNumber: t("orderDetail.phoneNumber", "Phone"),
    receiverAddress: t("orderDetail.receiverAddress", "Receiver Address"),
    changeAddress: t("checkOutPage.changeAddress", "Change another address"),
    receiverName: t("checkOutPage.receiver", "Receiver"),
    toPickup: t("checkOutPage.toPickup", "Tự lấy hàng"),
    delivery: t("checkOutPage.delivery", "Giao hàng"),
    change: t("checkOutPage.change", "Thay đổi"),
    scheduleTime: t("checkOutPage.scheduleTime", "Thời gian giao"),
    now: t("deliveryTime.now", "Sớm nhất"),
    deliveryDateTrans: t("deliveryTime.deliveryDateTrans", "Điều kiện áp dụng"),
    deliveryTimeTrans: t("deliveryTime.deliveryTimeTrans", "Điều kiện áp dụng"),
    cancel: t("deliveryTime.cancel", "Điều kiện áp dụng"),
    confirm: t("deliveryTime.confirm", "Điều kiện áp dụng"),
    time: t("deliveryTime.time", "Điều kiện áp dụng"),
    receivingTime: t("deliveryTime.receivingTime", "Thời gian giao"),
    placeHolderName: t("checkOutPage.placeHolderName"),
    missingCustomerNameMessage: t("checkOutPage.missingCustomerNameMessage"),
    placeHolderPhone: t("checkOutPage.placeHolderPhone"),
    missingPhoneMessage: t("checkOutPage.missingPhoneMessage"),
    invalidPhoneNumber: t("checkOutPage.invalidPhoneNumber"),
    deliveryTimeFullText: t("deliveryTime.deliveryTimeFullText", "Thời gian giao"),
    pickupTime: t("deliveryTime.pickupTime", "Thời gian lấy hàng"),
    deliveryAddress: t("deliveryTime.deliveryAddress", "Địa chỉ giao hàng"),
    pickupAddress: t("deliveryTime.pickupAddress", "Địa chỉ lấy hàng"),
    emptyDeliveryMessage: t(
      "deliveryTime.emptyDeliveryMessage",
      "Bạn chưa cấu hình địa chỉ nhận hàng. Vui lòng cấu hình địa chỉ nhận hàng.",
    ),
  };

  async function getWorkingHour() {
    const res = await workingHoursDataService.getWorkingHourByStoreBranchIdAsync(
      deliveryAddress?.branchAddress?.id ?? null,
    );
    if (res?.data?.storeBranchWorkingHours) {
      setWorkingHour(res?.data?.storeBranchWorkingHours);
    }
  }

  useEffect(() => {
    getWorkingHour();
  }, []);

  useEffect(() => {
    setDeliveryDate(null);
    setTimeSlot(null);
    getWorkingHour();
  }, [branchAddress]);

  useEffect(() => {
    setDeliveryDate(null);
    setTimeSlot(null);
  }, [deliveryAddress?.orderType]);

  useImperativeHandle(ref, () => ({}));

  const [isOpenDeliveryTime, setIsOpenDeliveryTime] = useState(false);
  const [workingHour, setWorkingHour] = useState(null);

  async function handleOpenSelectDeliveryTime() {
    if (!isCustomize) {
      setIsOpenDeliveryTime(true);
    }
  }

  function handleCloseSelectDeliveryTime() {
    setIsOpenDeliveryTime(false);
  }

  function changeDeliveryMethod() {
    if (deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY) {
      const chooseAddressModal = document.getElementsByClassName("receiver-address-select-button")[0];
      chooseAddressModal?.click();
    } else {
      const chooseAddressModal = document.getElementsByClassName("select-branch-dialog-class")[0];
      chooseAddressModal?.click();
    }
  }

  const handleEditReceiver = () => {
    setIsEditReceiver(true);
    onValuesChange({
      receiverName: deliveryInfo?.receiverName,
      receiverPhone: deliveryInfo?.phoneNumber,
    });
    form.setFieldsValue({
      receiverName: deliveryInfo?.receiverName,
      receiverPhone: deliveryInfo?.phoneNumber,
    });
  };

  return (
    <CheckoutInfoCard className="card-delivery-info" configuration={configuration} colorGroups={colorGroups}>
      <div className="delivery-info">
        <div className="title-delivery-method" style={{ cursor: "pointer" }} onClick={changeDeliveryMethod}>
          <div className="title-delivery-method-icon">
            <div className="title-delivery-method-icon-child">
              {deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY ||
              deliveryAddress?.orderType == undefined ? (
                <IconAddressDeliveryCustomize />
              ) : (
                <IconPickupCustomize />
              )}
              <span className="title-text">
                {deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY || deliveryAddress?.orderType == undefined
                  ? translatedData.delivery
                  : translatedData.toPickup}
              </span>
            </div>
            <div className="title-delivery-method-button">
              <span className="title-text-change">{translatedData.change}</span>
              <DiscountCodeSuffixIcon />
            </div>
          </div>
        </div>
        <div className="content-delivery-method">
          <Form
            form={form}
            autoComplete="off"
            className="form-edit-receiver"
            onValuesChange={(_, values) => onValuesChange(values)}
          >
            {/* User info */}
            <div className="edit-receiver">
              <div className="left-content-delivery">
                <UserIcon />
              </div>
              {isEditReceiver ? (
                <div className="right-content-delivery">
                  <div className="title-text">{translatedData.receiverName}</div>
                  <div className="detail-text">
                    <Form.Item
                      name="receiverName"
                      rules={[
                        {
                          required: true,
                          message: translatedData.missingCustomerNameMessage,
                        },
                      ]}
                    >
                      <Input
                        autoFocus
                        allowClear={{ clearIcon: <AllowClearIcon /> }}
                        maxLength={200}
                        placeholder={translatedData.placeHolderName}
                      />
                    </Form.Item>
                  </div>
                </div>
              ) : (
                <div className="right-content-delivery" style={{ justifyContent: "space-between", display: "flex" }}>
                  <div>
                    <div className="title-text">{translatedData.receiverName}</div>
                    <div className="detail-text">
                      <div className="detail-receiver">{deliveryInfo?.receiverName}</div>
                    </div>
                  </div>
                  <div className="link-text icon-edit" onClick={handleEditReceiver}>
                    <EditDeliveryIcon />
                  </div>
                </div>
              )}
            </div>
            {/* Phone info */}
            <div className="edit-receiver">
              <div className="left-content-delivery">
                <PhoneIcon />
              </div>
              <div className="right-content-delivery">
                <div className="title-text">{translatedData.phoneNumber}</div>
                {isEditReceiver ? (
                  <div className="detail-text">
                    <Form.Item
                      name="receiverPhone"
                      rules={[
                        {
                          required: true,
                          message: translatedData.missingPhoneMessage,
                        },
                        {
                          pattern: PHONE_NUMBER_REGEX,
                          message: translatedData.invalidPhoneNumber,
                        },
                      ]}
                    >
                      <Input
                        allowClear={{ clearIcon: <AllowClearIcon /> }}
                        maxLength={15}
                        placeholder={translatedData.placeHolderPhone}
                        onKeyPress={(event) => {
                          const regex = /^[0-9\b]+$/;
                          if (!regex.test(event.key)) event.preventDefault();
                        }}
                      />
                    </Form.Item>
                  </div>
                ) : (
                  <div className="detail-text">
                    <div className="detail-receiver">{deliveryInfo?.phoneNumber}</div>
                  </div>
                )}
              </div>
            </div>
          </Form>

          {/* Schedule time info */}
          <div className="address-info">
            <div className="left-content-delivery">
              <ClockDeliveryIcon />
            </div>
            <div className="right-content-delivery" style={{ justifyContent: "space-between", display: "flex" }}>
              <div>
                <div className="title-text">
                  <span>
                    {(deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY ||
                      deliveryAddress?.orderType == undefined) &&
                      translatedData.deliveryTimeFullText}
                    {deliveryAddress?.orderType === enumOrderType.PICK_UP && translatedData.pickupTime}
                  </span>
                </div>
                <div className="detail-text">
                  <span className="detail-text-color" style={{background: timeSlot == null ? "unset" : (deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY || deliveryAddress?.orderType == undefined) ? "#1CA362": "#FF8C21"}}>
                    {deliveryDate == null && timeSlot == null ? (
                      ""
                    ) : deliveryDate == moment().format("YYYY/MM/DD") ? (
                      `${timeSlot}`
                    ) : (
                      `${moment(deliveryDate).format("DD/MM/YYYY")} ${timeSlot}`
                    )}
                  </span>
                </div>
              </div>
              <div className="link-text icon-edit">
                <span onClick={handleOpenSelectDeliveryTime}>
                  <EditDeliveryIcon />
                </span>
                <SelectDeliveryTimeComponent
                  workingHour={workingHour}
                  isOpenDeliveryTime={isOpenDeliveryTime}
                  handleCancel={handleCloseSelectDeliveryTime}
                  colorConfig={colorGroups}
                  deliveryDate={deliveryDate}
                  setDeliveryDate={setDeliveryDate}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                  configuration={configuration}
                  estimateTime={currentDeliveryMethodSelected?.estimateTime}
                />
              </div>
            </div>
          </div>

          {/* Address info */}
          <div className="address-info">
            <div className="left-content-delivery">
              <GpsIcon />
            </div>
            <div className="right-content-delivery" style={{ justifyContent: "space-between", display: "flex" }}>
              <div>
                <div className="title-text">
                  <span>
                    {(deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY ||
                      deliveryAddress?.orderType == undefined) &&
                      translatedData.deliveryAddress}
                    {deliveryAddress?.orderType === enumOrderType.PICK_UP && translatedData.pickupAddress}
                  </span>
                </div>
                <div className="detail-text">
                  <span>
                    {deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY
                      ? deliveryAddress?.receiverAddress?.address ?? translatedData.emptyDeliveryMessage
                      : deliveryAddress?.branchAddress?.addressDetail ?? translatedData.emptyDeliveryMessage}
                  </span>
                </div>
              </div>
              <div className="link-text icon-edit" onClick={changeDeliveryMethod}>
                <EditDeliveryIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CheckoutInfoCard>
  );
});
