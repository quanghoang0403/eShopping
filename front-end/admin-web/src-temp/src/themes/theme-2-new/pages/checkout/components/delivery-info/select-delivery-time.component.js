import { Button, Col, Modal, Row, Select } from "antd";
import "moment/locale/vi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AddScheduleDate, AddScheduleTime, DropDownSchedule } from "../../../../assets/icons.constants";
import { enumOrderType } from "../../../../constants/enum";
import { defaultCookingTime } from "../../../../constants/number.constants";
import { DateFormat, intervalTime } from "../../../../constants/string.constant";
import "./select-delivery-time.scss";

const { Option } = Select;

export function SelectDeliveryTimeComponent(props) {
  const moment = require("moment");
  const {
    colorConfig,
    isOpenDeliveryTime,
    handleCancel,
    workingHour,
    deliveryDate = moment().format("yyyy/MM/DD"),
    setDeliveryDate,
    timeSlot,
    setTimeSlot,
    configuration,
    estimateTime = defaultCookingTime,
  } = props;
  const [t] = useTranslation();

  const translateData = {
    dayOfWeek: {
      sunday: t("deliveryTime.dayOfWeek.sunday", "Điều kiện áp dụng"),
      monday: t("deliveryTime.dayOfWeek.monday", "Điều kiện áp dụng"),
      tuesday: t("deliveryTime.dayOfWeek.tuesday", "Điều kiện áp dụng"),
      wednesday: t("deliveryTime.dayOfWeek.wednesday", "Điều kiện áp dụng"),
      thursday: t("deliveryTime.dayOfWeek.thursday", "Điều kiện áp dụng"),
      friday: t("deliveryTime.dayOfWeek.friday", "Điều kiện áp dụng"),
      saturday: t("deliveryTime.dayOfWeek.saturday", "Điều kiện áp dụng"),
      today: t("deliveryTime.today", "Điều kiện áp dụng"),
      tomorrow: t("deliveryTime.tomorrow", "Điều kiện áp dụng"),
      theDayAfterTomorrow: t("deliveryTime.theDayAfterTomorrow", "Điều kiện áp dụng"),
    },
    now: t("deliveryTime.now", "Điều kiện áp dụng"),
    time: t("deliveryTime.time", "Điều kiện áp dụng"),
    deliveryDateTrans: t("deliveryTime.deliveryDateTrans", "Điều kiện áp dụng"),
    deliveryTimeTrans: t("deliveryTime.deliveryTimeTrans", "Điều kiện áp dụng"),
    cancel: t("deliveryTime.cancel", "Điều kiện áp dụng"),
    confirm: t("deliveryTime.confirm", "Điều kiện áp dụng"),
    deliveryTimeFullText: t("deliveryTime.deliveryTimeFullText", "Thời gian giao"),
    pickupTime: t("deliveryTime.pickupTime", "Thời gian lấy hàng"),
  };

  const colorGroup = colorConfig?.find((c) => c.id === configuration?.colorGroupId);
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress ?? null);

  function generateTimeSlots() {
    const timeSlots = [];
    const now = moment().add(estimateTime, "minutes");
    const nowTemp = moment().add(estimateTime, "minutes");

    let dayAdd = 0;
    // Lặp qua từng ngày trong khoảng từ hôm nay đến 7 ngày sau
    for (let i = 0; i <= workingHour.length; i++) {
      const currentDay = moment(workingHour[i]?.date);
      const dayOfWeek = workingHour[i]?.date;
      const dayOpeningHours = workingHour[i];

      // Nếu có thời gian mở cửa cho ngày đó
      if (dayOpeningHours) {
        // Lặp qua từng mốc thời gian trong ngày
        dayOpeningHours?.workingHours?.forEach((openingHour) => {
          const openTime = openingHour?.openTime;
          const closeTime = openingHour?.closeTime;

          // Chuyển thời gian mở cửa và đóng cửa thành đối tượng Date
          const openDateTime = currentDay.clone().set({ hour: openTime.split(":")[0], minute: openTime.split(":")[1] });
          const closeDateTime = currentDay
            .clone()
            .set({ hour: closeTime.split(":")[0], minute: closeTime.split(":")[1] });

          // Kiểm tra xem mốc thời gian này nằm trong khoảng openTime đến closeTime và lớn hơn giờ hiện tại
          if (openDateTime < now && openDateTime <= closeDateTime && now < closeDateTime) {
            timeSlots.push({
              dayofweek: dayOfWeek,
              time: now.format(DateFormat.HH_MM),
            });
            // Tạo các mốc thời gian cách nhau 15 phút
            while (openDateTime < closeDateTime) {
              // Kiểm tra xem thời gian hiện tại đã qua mốc thời gian này chưa
              nowTemp.add(intervalTime, "minutes");
              if (nowTemp < closeDateTime) {
                timeSlots.push({
                  dayofweek: dayOfWeek,
                  time: nowTemp.format(DateFormat.HH_MM),
                });
              }
              openDateTime.add(intervalTime, "minutes");
            }
          } else if (i > 0 || (now < openDateTime && now < closeDateTime)) {
            while (openDateTime < closeDateTime) {
              // Kiểm tra xem thời gian hiện tại đã qua mốc thời gian này chưa
              if (openDateTime > now) {
                timeSlots.push({
                  dayofweek: dayOfWeek,
                  time: openDateTime.format(DateFormat.HH_MM),
                });
              }
              openDateTime.add(intervalTime, "minutes");
            }
          }
        });
      } else {
        dayAdd += 1;
      }
    }
    return timeSlots;
  }

  const dayNames = [
    translateData.dayOfWeek.sunday,
    translateData.dayOfWeek.monday,
    translateData.dayOfWeek.tuesday,
    translateData.dayOfWeek.wednesday,
    translateData.dayOfWeek.thursday,
    translateData.dayOfWeek.friday,
    translateData.dayOfWeek.saturday,
  ];

  function getNext7DaysWithCodes() {
    const days = [];
    let dayAdd = 0;
    // Lấy ngày hôm nay
    const today = moment();

    const checkToDay = workingHour?.some((item) => item.date == moment(today).format("yyyy/MM/DD"));

    if (checkToDay) {
      days.push({
        code: today.day(),
        fullDate: moment(today).format("yyyy/MM/DD"),
        name: translateData.dayOfWeek.today,
        date: today.format("DD/MM"),
      });
      dayAdd++;
    }

    // Thêm Ngày mai vào danh sách
    const tomorrow = today.clone().add(1, "day");
    const checkTomorrow = workingHour?.some((item) => item.date == moment(tomorrow).format("yyyy/MM/DD"));
    if (checkTomorrow) {
      days.push({
        code: tomorrow.day(),
        fullDate: moment(tomorrow).format("yyyy/MM/DD"),
        name: translateData.dayOfWeek.tomorrow,
        date: tomorrow.format("DD/MM"),
      });
      dayAdd++;
    }

    // Thêm Ngày kia vào danh sách
    const nextTomorrow = today.clone().add(2, "day");
    const checkNexTomorrow = workingHour?.some((item) => item.date == moment(nextTomorrow).format("yyyy/MM/DD"));
    if (checkNexTomorrow) {
      days.push({
        code: nextTomorrow.day(),
        fullDate: moment(nextTomorrow).format("yyyy/MM/DD"),
        name: translateData.dayOfWeek.theDayAfterTomorrow,
        date: nextTomorrow.format("DD/MM"),
      });
      dayAdd++;
    }

    for (let i = dayAdd; i < workingHour?.length; i++) {
      days.push({
        code: workingHour[i]?.dayOfWeek,
        fullDate: moment(workingHour[i]?.date).format("yyyy/MM/DD"),
        name: dayNames[workingHour[i]?.dayOfWeek],
        date: moment(workingHour[i]?.date).format("DD/MM"),
      });
    }

    return days;
  }

  function getTodayWithCodes() {
    let days = [];
    const today = moment();
    days.push({
      code: today.day(),
      fullDate: moment(today).format("yyyy/MM/DD"),
      name: translateData.dayOfWeek.today,
      date: today.format("DD/MM"),
    });
    return days;
  }

  const [selectTimeByDeliveryDay, setSelectTimeByDeliveryDay] = useState(null);
  const [next7DaysWithCodes, setNext7DaysWithCodes] = useState(null);
  const [timeSlots, setTimeSlots] = useState(null);

  const [deliveryDateT, setDeliveryDateT] = useState(null);
  const [timeSlotT, setTimeSlotT] = useState(null);
  const [currentOrderType, setCurrentOrderType] = useState(null);

  useEffect(() => {
    if (workingHour) {
      setTimeSlots(generateTimeSlots());
      if (currentOrderType === enumOrderType.PICK_UP) {
        setNext7DaysWithCodes(getTodayWithCodes());
      } else {
        setNext7DaysWithCodes(getNext7DaysWithCodes());
      }
    }
  }, [workingHour, currentOrderType, estimateTime]);

  const orderType = useSelector((state) => state?.session?.deliveryAddress?.orderType);

  useEffect(() => {
    if (orderType) {
      if (currentOrderType !== orderType) {
        setCurrentOrderType(orderType);
      }
    }
  }, [orderType]);

  useEffect(() => {
    if (next7DaysWithCodes) {
      let filteredItems = [];
      if (deliveryDate) {
        setDeliveryDateT(deliveryDate);
        const dayOfWeek = moment(deliveryDate).format("yyyy/MM/DD");
        filteredItems = timeSlots?.filter((item) => item.dayofweek === dayOfWeek);
        if (filteredItems?.length === 0) {
          setDeliveryDateT(next7DaysWithCodes[1]?.fullDate);
          filteredItems = timeSlots?.filter((item) => item.dayofweek === next7DaysWithCodes[1]?.fullDate);
        }
      } else {
        setDeliveryDateT(next7DaysWithCodes[0]?.fullDate);
        filteredItems = timeSlots?.filter((item) => item.dayofweek === next7DaysWithCodes[0]?.fullDate);
      }
      setDeliveryDate(filteredItems[0]?.dayofweek);
      setTimeSlot(filteredItems[0]?.time);
      setSelectTimeByDeliveryDay(filteredItems);
    }
  }, [next7DaysWithCodes]);

  useEffect(() => {
    if (selectTimeByDeliveryDay) {
      const isTimeSlotExists = selectTimeByDeliveryDay.some((item) => item.time === timeSlot);
      if (isTimeSlotExists) {
        setTimeSlotT(timeSlot);
      } else {
        setTimeSlotT(selectTimeByDeliveryDay[0]?.time);
      }
    }
  }, [selectTimeByDeliveryDay]);

  function handleChangeDeliveryDate(value) {
    const filteredItems = timeSlots?.filter((item) => item.dayofweek == value);
    setSelectTimeByDeliveryDay(filteredItems);
    setDeliveryDateT(value);
  }

  function handleChangeTimeSlot(value) {
    setTimeSlotT(value);
  }

  function handelOK() {
    setDeliveryDate(deliveryDateT);
    setTimeSlot(timeSlotT);
    handleCancel();
  }

  function CustomFooter() {
    return (
      <div className="modal-footer">
        <Row>
          <Button className="cancel-buttom" onClick={handleCancel}>
            {translateData.cancel}
          </Button>
          <Button
            className="confirm-buttom"
            style={{ background: colorGroup?.buttonBackgroundColor, color: colorGroup?.buttonTextColor }}
            onClick={handelOK}
          >
            {translateData.confirm}
          </Button>
        </Row>
      </div>
    );
  }

  function renderDeliveryDateSelect({ value, onChange, data, onSelectDay }) {
    return (
      <Select
        suffixIcon={<DropDownSchedule />}
        className="select-component"
        value={value}
        onChange={onChange}
        popupClassName="custom-dropdown-class"
        getPopupContainer={(trigger) => trigger.parentNode}
      >
        {data?.map((day) => (
          <Option key={day.fullDate} value={day.fullDate.toString()} onClick={() => onSelectDay(day)}>
            {dayNames.includes(day.name) ? `${day.name} - ${day.date}` : day.name}
          </Option>
        ))}
      </Select>
    );
  }

  return (
    <Modal
      title={
        <div
          style={{ background: colorGroup?.buttonBackgroundColor, color: colorGroup?.buttonTextColor }}
          className="modal-title-time"
        >
          {deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY && translateData.deliveryTimeFullText}
          {deliveryAddress?.orderType === enumOrderType.PICK_UP && translateData.pickupTime}
        </div>
      }
      width={"424px"}
      open={isOpenDeliveryTime}
      onCancel={handleCancel}
      onOk={handelOK}
      closable={false}
      bodyStyle={{ paddingBottom: "20px" }}
      wrapClassName="select-delivery-time-modal"
      footer={null}

      //closeIcon={<IconButtonClose color={colorConfig?.buttonTextColor} />}
    >
      <div className="select-delivery-time-content">
        <div className="title-schedule">{translateData.deliveryDateTrans}</div>
        <Row className="row-delivery-time">
          <Col span={2}>
            <AddScheduleDate />
          </Col>
          <Col span={22}>
            {renderDeliveryDateSelect({
              value: deliveryDateT,
              onChange: handleChangeDeliveryDate,
              data: next7DaysWithCodes,
            })}
          </Col>
        </Row>
        <div className="title-schedule">{translateData.deliveryTimeTrans}</div>
        <Row className="row-delivery-time">
          <Col span={2}>
            <AddScheduleTime />
          </Col>
          <Col span={22}>
            <Select
              suffixIcon={<DropDownSchedule />}
              className="select-component"
              value={timeSlotT}
              onChange={handleChangeTimeSlot}
              popupClassName="custom-dropdown-class"
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              {selectTimeByDeliveryDay?.map((item, index) => (
                <Option key={item.time} value={item.time}>
                  {item.time}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <CustomFooter />
        </Row>
      </div>
    </Modal>
  );
}
