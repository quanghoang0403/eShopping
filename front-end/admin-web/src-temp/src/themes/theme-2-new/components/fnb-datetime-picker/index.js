import { DatePicker } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import React from "react";
import { useTranslation } from "react-i18next";
import { DateTimePickerIcon } from "../../assets/icons.constants";
import { DateFormat } from "../../constants/string.constant";
import "./index.scss";
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

export default function FnbDateTimePickerComponent({
  className,
  placeholder,
  showToday = false,
  showNowValue = false,
}) {
  const [t] = useTranslation();

  return (
    <DatePicker
      className={`fnb-date-time-picker ${className}`}
      placeholder={placeholder ?? t("form.dateTimePickerPlaceholder")}
      suffixIcon={<DateTimePickerIcon />}
      format={DateFormat.DD_MM_YYYY}
      dropdownClassName={"fnb-date-time-picker-dropdown"}
      showNow={showNowValue}
      showToday={showToday}
    />
  );
}
