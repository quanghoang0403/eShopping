import { Button, Col, Modal, Row, Select } from "antd";
import "moment/locale/vi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { DropDownIcon } from "../../assets/icons.constants";
import { enumOrderType } from "../../constants/enums";
import "./select-delivery-time.scss";
import { defaultCookingTime } from "../../constants/number.constants";
import { DateFormat, intervalTime } from "../../constants/string.constants";

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
    setDayText,
    estimateTime = defaultCookingTime,
  } = props;
  const [t] = useTranslation();
  const translateData = {
    dayOfWeek: {
      sunday: t("deliveryTime.dayOfWeek.sunday"),
      monday: t("deliveryTime.dayOfWeek.monday"),
      tuesday: t("deliveryTime.dayOfWeek.tuesday"),
      wednesday: t("deliveryTime.dayOfWeek.wednesday"),
      thursday: t("deliveryTime.dayOfWeek.thursday"),
      friday: t("deliveryTime.dayOfWeek.friday"),
      saturday: t("deliveryTime.dayOfWeek.saturday"),
      today: t("deliveryTime.today"),
      tomorrow: t("deliveryTime.tomorrow"),
      theDayAfterTomorrow: t("deliveryTime.theDayAfterTomorrow"),
    },
    now: t("deliveryTime.now"),
    time: t("deliveryTime.time"),
    deliveryDateTrans: t("deliveryTime.deliveryDateTrans"),
    deliveryTimeTrans: t("deliveryTime.deliveryTimeTrans"),
    cancel: t("deliveryTime.cancel"),
    confirm: t("deliveryTime.confirm"),
  };

  function generateTimeSlots() {
    const timeSlots = [];
    const now = moment().add(estimateTime, "minutes");
    const nowTemp = moment().add(estimateTime, "minutes");
    let dayAdd = 0;
    for (let i = 0; i <= workingHour.length; i++) {
      const currentDay = moment(workingHour[i]?.date);
      const dayOfWeek = workingHour[i]?.date;
      const dayOpeningHours = workingHour[i];

      if (dayOpeningHours) {
        dayOpeningHours?.workingHours?.forEach((openingHour) => {
          const openTime = openingHour?.openTime;
          const closeTime = openingHour?.closeTime;

          const openDateTime = currentDay.clone().set({ hour: openTime.split(":")[0], minute: openTime.split(":")[1] });
          const closeDateTime = currentDay
            .clone()
            .set({ hour: closeTime.split(":")[0], minute: closeTime.split(":")[1] });

          if (openDateTime < now && openDateTime <= closeDateTime && now < closeDateTime) {
            timeSlots.push({
              dayofweek: dayOfWeek,
              time: now.format(DateFormat.HH_MM),
            });
            while (openDateTime < closeDateTime) {
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

  function getNext7DaysWithCodes() {
    const days = [];
    let dayAdd = 0;
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
        const dayOfWeek = next7DaysWithCodes[0]?.fullDate;
        filteredItems = timeSlots?.filter((item) => item.dayofweek === dayOfWeek);
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
    setDayText(next7DaysWithCodes?.filter((item) => item.fullDate == deliveryDateT)[0]?.name);
    setDeliveryDate(deliveryDateT);
    setTimeSlot(timeSlotT);
    handleCancel();
  }

  function renderDeliveryDateSelect({ value, onChange, data }) {
    return (
      <Select
        suffixIcon={<DropDownIcon />}
        className="select-component"
        value={value}
        onChange={onChange}
        popupClassName="custom-dropdown-class"
      >
        {data?.map((day) => (
          <Option key={day.fullDate} value={day.fullDate.toString()}>
            {dayNames.includes(day.name) ? `${day.name}, ${day.date}` : day.name}
          </Option>
        ))}
      </Select>
    );
  }

  return (
    <Modal
      title={
        <div
          style={{ background: colorConfig?.buttonBackgroundColor, color: colorConfig?.buttonTextColor }}
          className="modal-title-time"
        >
          {translateData.time}
        </div>
      }
      width={"366px"}
      open={isOpenDeliveryTime}
      onCancel={handleCancel}
      onOk={handelOK}
      closable={false}
      bodyStyle={{ paddingBottom: "20px" }}
      wrapClassName="select-delivery-time-modal"
      footer={null}
      centered={true}
    >
      <div className="select-delivery-time-content">
        <Row className="row-delivery-time">
          <Col span={9}>
            <span>{translateData.deliveryDateTrans}</span>
          </Col>
          <Col span={15}>
            {renderDeliveryDateSelect({
              value: deliveryDateT,
              onChange: handleChangeDeliveryDate,
              data: next7DaysWithCodes,
            })}
          </Col>
        </Row>
        <Row className="row-delivery-time">
          <Col span={9}>
            <span>{translateData.deliveryTimeTrans} </span>
          </Col>
          <Col span={15}>
            <Select
              suffixIcon={<DropDownIcon />}
              className="select-component"
              value={timeSlotT}
              onChange={handleChangeTimeSlot}
              popupClassName="custom-dropdown-class"
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
          <div className="modal-footer">
            <Row>
              <Button className="cancel-buttom" onClick={handleCancel}>
                {translateData.cancel}
              </Button>
              <Button
                className="confirm-buttom"
                onClick={handelOK}
                style={{
                  color: colorConfig?.buttonTextColor,
                  background: colorConfig?.buttonBackgroundColor,
                  border: "1px solid " + colorConfig?.buttonBorderColor,
                }}
              >
                {translateData.confirm}
              </Button>
            </Row>
          </div>
        </Row>
      </div>
    </Modal>
  );
}
