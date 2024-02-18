import { Button, Col, Input, Popover } from "antd";
import i18next, { t } from "i18next";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import storeBranchWorkingHourDataService from "../../../data-services/store-branch-working-hour.service";
import { CalendarDateLinearIcon, LeftArrowIcon, RightArrowIcon } from "../../assets/icons.constants";
import { DateView } from "../../constants/string.constants";
import { StyledDateTimePicker } from "../../pages/reserve-table/components/StyledDateTimePickerReserveTable";
import "./date-time-picker-reserve.component.scss";

export default function DateTimePickerReserveComponent(props) {
  const {
    reserveTime,
    setReserveTime,
    reserveDate,
    setReserveDate,
    branchAddressId,
    colorGroup,
    selectTimeByDeliveryDay,
    setSelectTimeByDeliveryDay,
  } = props;

  const translateData = {
    now: t("deliveryTime.now"),
    time: t("deliveryTime.time"),
    deliveryDateTrans: t("deliveryTime.deliveryDateTrans"),
    deliveryTimeTrans: t("deliveryTime.deliveryTimeTrans"),
    cancel: t("deliveryTime.cancel"),
    confirm: t("deliveryTime.confirm"),
    pickDate: t("reserve.pickDate"),
    pickTime: t("reserve.pickTime"),
    enterYourArrivalTime: t("reserve.enterYourArrivalTime"),
  };

  const currentLanguage = i18next.language;
  const moment = require("moment");
  moment.locale(currentLanguage);
  const [workingHour, setWorkingHour] = useState(null);
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [timeSlots, setTimeSlots] = useState(null);
  const [mode, setMode] = useState("date");

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
    for (let i = 0; i < workingHour?.length; i++) {
      const currentDay = moment(workingHour[i]?.date);
      const dayOfWeek = workingHour[i]?.date;
      const dayOpeningHours = workingHour[i];

      if (dayOpeningHours) {
        dayOpeningHours?.workingHours?.forEach((openingHour) => {
          generateTimeSlotsForHour(currentDay, dayOfWeek, openingHour, timeSlots);
        });
      }
    }
    return timeSlots;
  }

  function generateTimeSlotsForHour(currentDay, dayOfWeek, openingHour, timeSlots) {
    const now = moment().add(30, "minutes");
    const openTime = openingHour?.openTime;
    const closeTime = openingHour?.closeTime;

    let openDateTime = currentDay.clone().set({ hour: openTime.split(":")[0], minute: openTime.split(":")[1] });
    const closeDateTime = currentDay.clone().set({ hour: closeTime.split(":")[0], minute: closeTime.split(":")[1] });

    while (openDateTime < closeDateTime) {
      const roundedMinutes = Math.ceil(openDateTime.minute() / 30) * 30;
      openDateTime = openDateTime.clone().set({ minute: roundedMinutes });

      if (openDateTime > now && openDateTime < closeDateTime) {
        timeSlots.push({
          dayofweek: dayOfWeek,
          time: openDateTime.format("HH:mm"),
        });
      }

      openDateTime.add(30, "minutes");
    }
  }

  const isDateDisabled = (activeStartDate, date, view) => {
    const currentDate = new Date();
    const isDateInWorkingHours = workingHour?.some((item) => item?.date === moment(date).format("YYYY/MM/DD"));
    if (view == DateView.YEAR || view == DateView.DECADE) {
      return false;
    }
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
      const filteredItems = timeSlots?.filter((item) => item.dayofweek == moment(reserveDate).format("YYYY/MM/DD"));
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
    const filteredItems = timeSlots?.filter((item) => item.dayofweek == moment(value).format("YYYY/MM/DD"));
    setSelectTimeByDeliveryDay(filteredItems);
    setReserveTime(filteredItems[0]?.time);
  };

  const popoverTitle = (
    <>
      <StyledDateTimePicker colorGroup={colorGroup}>
        <div className="group-button-date-time-picker" style={{ display: "flex", marginBottom: 10 }}>
          <Button
            className="button-date-time"
            type={mode === "date" ? "primary" : "default"}
            onClick={() => setMode("date")}
            style={{ marginRight: "4px" }}
          >
            {translateData.pickDate}
          </Button>
          <Button
            className="button-date-time"
            type={mode === "time" ? "primary" : "default"}
            onClick={() => setMode("time")}
          >
            {translateData.pickTime}
          </Button>
        </div>
      </StyledDateTimePicker>
    </>
  );

  const popoverContent = (
    <>
      <StyledDateTimePicker colorGroup={colorGroup}>
        {mode === "date" ? (
          <Calendar
            onChange={onChange}
            prev2Label={null}
            next2Label={null}
            prevLabel={<LeftArrowIcon className="left-right-icon" />}
            nextLabel={<RightArrowIcon className="left-right-icon" />}
            tileDisabled={({ activeStartDate, date, view }) => isDateDisabled(activeStartDate, date, view)}
            value={reserveDate}
            defaultValue={reserveDate}
            locale={currentLanguage}
            className="calendar-theme1"
          />
        ) : (
          <Col span={24} className="time-picker-col">
            {selectTimeByDeliveryDay?.map((item, index) => {
              return (
                <div
                  className={`time-picker-custom ${reserveTime == item.time ? "select" : ""}`}
                  onClick={() => setReserveTime(item.time)}
                >
                  <span className="hours">{item.time}</span>
                </div>
              );
            })}
          </Col>
        )}
      </StyledDateTimePicker>
    </>
  );

  const handlePopoverVisibleChange = (visible) => {
    setPopoverVisible(visible);
  };

  return (
    <div>
      <Popover
        placement="bottom"
        title={popoverTitle}
        content={popoverContent}
        overlayClassName="popover-date-time-picker-theme1"
        trigger="click"
        visible={isPopoverVisible}
        onVisibleChange={handlePopoverVisibleChange} // Xử lý sự kiện khi visible thay đổi
      >
        <Input
          placeholder={translateData.enterYourArrivalTime}
          className="input-date-time-picker-custom"
          suffix={
            <CalendarDateLinearIcon onClick={() => setPopoverVisible(true)} style={{ color: "rgba(0,0,0,.45)" }} />
          }
          inputMode="none"
          value={reserveTime ? reserveTime + " - " + moment(reserveDate).format("DD MMM YYYY") : ""}
        />
      </Popover>
    </div>
  );
}
