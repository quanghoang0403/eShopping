import { DatePicker } from "antd";
import { DateTimePickerIcon } from "constants/icons.constants";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";

export default function FnbDateTimePickerComponent({
  onChangeDateTime,
  onOk,
  className,
  placeholder,
  showSecond,
  showToday = false,
  showNowValue = false,
  defaultDateTimeValue = moment(),
  disabledPastTime = false,
  isCurrent = false,
}) {
  const [t] = useTranslation();
  const [dateTimeChangeValue, setDateTimeValueChange] = useState();

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment();
  };

  const disabledDateCurrent = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf("day");
  };

  const disabledTime = (choose) => {
    var current = new Date();
    let currentHour = current.getHours();
    let currentMinute = 0;
    var hourChoose = choose.hour();
    if (hourChoose === currentHour)
      currentMinute = current.getMinutes() + 1;
    return ({
      disabledHours: () => range(0, 24).splice(0, currentHour),
      disabledMinutes: () => range(0, 60).splice(0, currentMinute)
    })
  };

  const onSelect = (values) => {
    setDateTimeValueChange(values);
    if (onChangeDateTime) {
      onChangeDateTime(values);
    }
  };

  const getDisabledHoursStartTime = () => {
    if (!disabledPastTime) return;
    var hours = [];
    var selectedTime = new Date(
      moment(dateTimeChangeValue).year(),
      moment(dateTimeChangeValue).month(),
      moment(dateTimeChangeValue).date()
    );
    var currentDate = new Date(moment().year(), moment().month(), moment().date());
    if (selectedTime.toDateString() === currentDate.toDateString()) {
      for (var i = 0; i < moment().hour(); i++) {
        hours.push(i);
      }
    }
    return hours;
  };

  const getDisabledMinutesStartTime = (selectedHour) => {
    if (!disabledPastTime) return;
    var minutes = [];
    var selectedTime = new Date(
      moment(dateTimeChangeValue).year(),
      moment(dateTimeChangeValue).month(),
      moment(dateTimeChangeValue).date()
    );
    var currentDate = new Date(moment().year(), moment().month(), moment().date());
    if (selectedTime.toDateString() === currentDate.toDateString()) {
      if (selectedHour === moment().hour()) {
        for (var i = 0; i < moment().minute(); i++) {
          minutes.push(i);
        }
      }
    }
    return minutes;
  };

  return (
    <DatePicker
      showTime
      className={`fnb-date-time-picker ${className}`}
      placeholder={placeholder ?? t("form.dateTimePickerPlaceholder")}
      suffixIcon={<DateTimePickerIcon />}
      onChange={onChangeDateTime}
      onOk={onOk}
      showSecond={showSecond}
      disabledHours={getDisabledHoursStartTime}
      disabledMinutes={getDisabledMinutesStartTime}
      format={DateFormat.HH_MM____DD_MM_YYYY_}
      dropdownClassName={"fnb-date-time-picker-dropdown"}
      disabledDate={isCurrent ? disabledDateCurrent : disabledDate}
      disabledTime={isCurrent ? disabledTime : false}
      showNow={showNowValue}
      showToday={showToday}
      value={dateTimeChangeValue ?? defaultDateTimeValue}
      onSelect={onSelect}
      allowClear={false}
    />
  );
}
