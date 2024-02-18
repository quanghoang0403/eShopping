import { Col, Form, Input, Popover, Row } from "antd";
import i18next, { t } from "i18next";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import storeBranchWorkingHourDataService from "../../../data-services/store-branch-working-hour.service";
//import { LeftArrowIcon, RightArrowIcon } from "../../assets/icons.constants";
import { CheckOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { formatDate } from "../../../utils/helpers";
import { ArrowIcon, ArrowUpIcon, CalendarIcon } from "../../assets/icons.constants";
import { DateFormat } from "../../constants/string.constant";
import "./DateTimePickerReserve.component.scss";

export default function DateTimePickerReserveComponent(props) {
  const { reserveTime, setReserveTime, reserveDate, setReserveDate, branchAddressId, fontFamily } = props;

  const translateData = {
    now: t("deliveryTime.now"),
    time: t("deliveryTime.time", "Thời gian"),
    deliveryDateTrans: t("deliveryTime.deliveryDateTrans"),
    deliveryTimeTrans: t("deliveryTime.deliveryTimeTrans"),
    cancel: t("deliveryTime.cancel"),
    confirm: t("deliveryTime.confirm"),
    pickDate: t("reserve.pickDate"),
    pickTime: t("reserve.pickTime"),
    enterYourArrivalTime: t("reserveTable.time", "Thời gian đến"),
  };

  const currentLanguage = i18next.language;
  const moment = require("moment");
  moment.locale(currentLanguage);
  const [workingHour, setWorkingHour] = useState(null);
  const [isTimePopoverVisible, setTimePopoverVisible] = useState(false);
  const [isDatePopoverVisible, setDatePopoverVisible] = useState(false);
  const [selectTimeByDeliveryDay, setSelectTimeByDeliveryDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState(null);

  async function getWorkingHour() {
    const workingHour = await storeBranchWorkingHourDataService.getStoreBranchWorkingHourForReserveTable(
      branchAddressId ?? null,
    );
    if (workingHour) {
      setWorkingHour(workingHour?.data?.storeBranchWorkingHours);
    }
  }

  useEffect(() => {
    getWorkingHour();
  }, [branchAddressId]);

  function generateTimeSlots() {
    const timeSlots = [];
    const now = moment().add(15, "minutes");
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
            while (openDateTime < closeDateTime) {
              if (openDateTime > now) {
                timeSlots.push({
                  dayofweek: dayOfWeek,
                  time: openDateTime.format(DateFormat.HH_MM),
                });
              }
              openDateTime.add(30, "minutes");
            }
          } else if (i > 0 || (now < openDateTime && now < closeDateTime)) {
            while (openDateTime < closeDateTime) {
              if (openDateTime > now) {
                timeSlots.push({
                  dayofweek: dayOfWeek,
                  time: openDateTime.format(DateFormat.HH_MM),
                });
              }
              openDateTime.add(30, "minutes");
            }
          }
        });
      }
    }
    return timeSlots;
  }

  const isDateDisabled = (date) => {
    const currentDate = new Date();
    const isDateInWorkingHours = workingHour?.some((item) => item?.date === moment(date).format(DateFormat.YYYY_MM_DD));
    return (date < currentDate && !isSameDay(date, currentDate)) || !isDateInWorkingHours;
  };

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  useEffect(() => {
    if (workingHour && reserveDate && timeSlots) {
      const filteredItems = timeSlots?.filter(
        (item) => item.dayofweek == moment(reserveDate).format(DateFormat.YYYY_MM_DD),
      );
      setSelectTimeByDeliveryDay(filteredItems);
      if (filteredItems?.length > 0) {
        setReserveTime(filteredItems[0]?.time);
      } else {
        setReserveTime(null);
      }
    }
  }, [reserveDate, workingHour, timeSlots]);

  useEffect(() => {
    if (workingHour) {
      setTimeSlots(generateTimeSlots());
    }
  }, [workingHour]);

  const onChange = (value) => {
    setReserveDate(value);
    const filteredItems = timeSlots?.filter((item) => item.dayofweek == moment(value).format(DateFormat.YYYY_MM_DD));
    setSelectTimeByDeliveryDay(filteredItems);
    setReserveTime(filteredItems[0]?.time);
  };

  const datePopoverContent = (
    <Calendar
      onChange={onChange}
      prevLabel={<ArrowIcon className="left-icon" />}
      prev2Label={
        <>
          <ArrowIcon className="left-icon" />
          <ArrowIcon className="left-icon" />
        </>
      }
      nextLabel={<ArrowIcon className="right-icon" />}
      next2Label={
        <>
          <ArrowIcon className="right-icon" />
          <ArrowIcon className="right-icon" />
        </>
      }
      //nextLabel={<RightArrowIcon className="left-right-icon" />}
      tileDisabled={({ date }) => isDateDisabled(date)}
      value={reserveDate}
      defaultValue={reserveDate}
      locale={currentLanguage}
      formatMonthYear={(locale, date) => formatDate(date, DateFormat.MMMM_YYYY)}
      formatShortWeekday={(locale, date) => {
        if (currentLanguage === "vi") {
          const dayOfWeek = date.getDay();
          const abbreviatedWeekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
          return abbreviatedWeekdays[dayOfWeek];
        } else {
          return formatDate(date, "dd");
        }
      }}
    />
  );
  const timePopoverContent = (
    <>
      <Col span={24} className="time-picker-col">
        {selectTimeByDeliveryDay?.map((item, index) => {
          return (
            <div
              className={`time-picker-custom ${reserveTime == item.time ? "select" : ""}`}
              onClick={() => setReserveTime(item.time)}
            >
              <span className="hours">{item.time}</span>
              <CheckOutlined className={`${reserveTime == item.time ? "show-icon" : "unshow-icon"}`} />
            </div>
          );
        })}
      </Col>
    </>
  );

  const handleTimePopoverVisibleChange = (visible) => {
    if (!isTimePopoverVisible) {
      setTimePopoverVisible(visible);
    } else {
      setTimePopoverVisible(false);
    }
  };

  const handleDatePopoverVisibleChange = (visible) => {
    if (!isDatePopoverVisible) {
      setDatePopoverVisible(visible);
    } else {
      setDatePopoverVisible(false);
    }
  };

  return (
    <div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={14} xs={14} sm={14} md={14} lg={12} xl={12} xxl={12}>
          <Form.Item
            className="form-item empty-label cursor-pointer"
            label={translateData.time}
            onClick={handleDatePopoverVisibleChange}
          >
            <Popover
              placement="bottomRight"
              content={<div style={{ fontFamily: fontFamily }}>{datePopoverContent}</div>}
              overlayClassName="popover-date-time-picker"
              trigger="click"
              open={isDatePopoverVisible}
              onVisibleChange={handleDatePopoverVisibleChange}
              style={{ fontFamily: fontFamily }}
            >
              <Input
                placeholder={translateData.enterYourArrivalTime}
                className="input-date-time-picker-custom-theme-2"
                suffix={
                  <span>
                    <ArrowUpIcon />
                  </span>
                }
                prefix={<CalendarIcon className="icon-prefix" />}
                value={reserveDate ? moment(reserveDate).format(DateFormat.DD_MM_YYYY) : ""}
                style={{ fontFamily: fontFamily }}
                required
              />
            </Popover>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={10} xs={10} sm={10} md={10} lg={12} xl={12} xxl={12}>
          <Form.Item className="form-item cursor-pointer" label={" "} onClick={handleTimePopoverVisibleChange}>
            <Popover
              placement="bottomRight"
              content={timePopoverContent}
              overlayClassName="popover-date-time-picker popover-time-picker"
              trigger="click"
              open={isTimePopoverVisible}
              onVisibleChange={handleTimePopoverVisibleChange}
              style={{ fontFamily: fontFamily }}
            >
              <Input
                placeholder={translateData.enterYourArrivalTime}
                className="input-date-time-picker-custom-theme-2"
                suffix={
                  <span>
                    <ArrowUpIcon />
                  </span>
                }
                prefix={<ClockCircleOutlined className="icon-prefix" />}
                value={reserveTime ? reserveTime : ""}
                style={{ fontFamily: fontFamily }}
                required
              />
            </Popover>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
