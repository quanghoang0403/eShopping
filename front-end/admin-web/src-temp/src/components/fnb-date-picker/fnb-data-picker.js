import { Button, Popover, Radio, Row, Tooltip } from "antd";
import { CalendarIcon, DownIcon } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import { useEffect, useState } from "react";
import * as locales from "react-date-range/dist/locale";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useTranslation } from "react-i18next";
import languageService from "services/language/language.service";
import { DateRange } from "../fnb-date-range-picker";
import "./fnb-data-picker.scss";

export function FnbDatePicker(props) {
  const [t] = useTranslation();
  const pageData = {
    optionDatetime: {
      today: t("optionDatetime.today"),
      yesterday: t("optionDatetime.yesterday"),
      thisWeek: t("optionDatetime.thisWeek"),
      lastWeek: t("optionDatetime.lastWeek"),
      thisMonth: t("optionDatetime.thisMonth"),
      lastMonth: t("optionDatetime.lastMonth"),
      thisYear: t("optionDatetime.thisYear"),
      customize: t("optionDatetime.customize"),
      allTime: t("optionDatetime.allTime"),
      to: t("optionDatetime.to"),
    },
    cancel: t("button.cancel"),
    apply: t("button.apply"),
  };
  const {
    selectedDate,
    setSelectedDate,
    setConditionCompare,
    orderTypeFilterTime,
    blurEffect = false,
    containAllTime = false,
    className,
    popoverPlacement,
    isShowTime = true,
  } = props;
  const [visible, setVisible] = useState(false);
  const [isOpenTooltip, setIsOpenTooltip] = useState(false);
  const [activeOptionDate, setActiveOptionDate] = useState(orderTypeFilterTime ?? 0);
  const [localeDateString, setLocaleDateString] = useState("en-US");
  const [allTime, setAllTime] = useState(false);
  const [selectedDateText, setSelectedDateText] = useState([]);
  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    setSelectedDateText(selectedDate);
    if (orderTypeFilterTime !== OptionDateTime.allTime) {
      let selectedDateInit = {
        startDate: new Date(selectedDate?.startDate),
        endDate: new Date(selectedDate?.endDate),
        key: "selection",
      };
      setSelectionRange([selectedDateInit]);
      return;
    }
    let selectedDateInit = {
      startDate: "",
      endDate: "",
      key: "selection",
    };
    setAllTime(true);
    setActiveOptionDate(OptionDateTime.allTime);
    setSelectionRange([selectedDateInit]);
    onSetDatetime([selectedDateInit], OptionDateTime.allTime);
  }, [orderTypeFilterTime]);

  const radioOptionDate = () => {
    let startToday = moment().startOf("date").toDate();
    let endToday = moment().endOf("date").toDate();

    let startYesterday = moment().startOf("date").toDate();
    startYesterday.setDate(startYesterday.getDate() - 1);
    let endYesterday = moment().endOf("date").toDate();
    endYesterday.setDate(endYesterday.getDate() - 1);

    let startThisWeek = moment().locale("vi").startOf("week").toDate();
    startThisWeek.setDate(startThisWeek.getDate());
    let endThisWeek = moment().locale("vi").endOf("week").toDate();
    endThisWeek.setDate(endThisWeek.getDate());

    let startLastWeek = moment().locale("vi").startOf("week").toDate();
    startLastWeek.setDate(startLastWeek.getDate() - 7);
    let endLastWeek = moment().locale("vi").endOf("week").toDate();
    endLastWeek.setDate(endLastWeek.getDate() - 7);

    let startThisMonth = moment().startOf("month").toDate();
    let endThisMonth = moment().endOf("month").toDate();

    let startLastMonth = moment().startOf("month").subtract(1, "month").toDate();
    let endLastMonth = moment().subtract(1, "month").endOf("month").toDate();

    let startThisYear = moment().startOf("year").toDate();
    let endThisYear = moment().endOf("year").toDate();

    const listOptionDateTime = [
      {
        key: 0,
        name: pageData.optionDatetime.today,
        disabled: false,
        startDate: startToday,
        endDate: endToday,
      },
      {
        key: 1,
        name: pageData.optionDatetime.yesterday,
        disabled: false,
        startDate: startYesterday,
        endDate: endYesterday,
      },
      {
        key: 2,
        name: pageData.optionDatetime.thisWeek,
        disabled: false,
        startDate: startThisWeek,
        endDate: endThisWeek,
      },
      {
        key: 3,
        name: pageData.optionDatetime.lastWeek,
        disabled: false,
        startDate: startLastWeek,
        endDate: endLastWeek,
      },
      {
        key: 4,
        name: pageData.optionDatetime.thisMonth,
        disabled: false,
        startDate: startThisMonth,
        endDate: endThisMonth,
      },
      {
        key: 5,
        name: pageData.optionDatetime.lastMonth,
        disabled: false,
        startDate: startLastMonth,
        endDate: endLastMonth,
      },
      {
        key: 6,
        name: pageData.optionDatetime.thisYear,
        disabled: false,
        startDate: startThisYear,
        endDate: endThisYear,
      },
      {
        key: 7,
        name: pageData.optionDatetime.customize,
        disabled: true,
        startDate: startToday,
        endDate: endToday,
      },
    ];

    const allTime = {
      key: 8,
      name: pageData.optionDatetime.allTime,
      startDate: "",
      endDate: "",
    };

    if (containAllTime) {
      listOptionDateTime.push(allTime);
    }

    return listOptionDateTime;
  };

  const onClickToday = (e) => {
    const optionChecked = e.target.value;
    const optionDate = radioOptionDate();
    const selectedOption = optionDate.find((item) => item.key === optionChecked);

    let selectedDate = {
      startDate: selectedOption.startDate,
      endDate: selectedOption.endDate,
      key: "selection",
    };

    const typeOptionDate = selectedOption.key;
    typeOptionDate === OptionDateTime.allTime ? setAllTime(true) : setAllTime(false);
    setActiveOptionDate(typeOptionDate);
    if (setConditionCompare !== undefined) {
      setConditionCompare(optionChecked);
    }
    setSelectionRange([selectedDate]);
    onSetDatetime([selectedDate], typeOptionDate);
  };

  const onChangeDateRange = (item) => {
    setSelectionRange([item.selection]);

    const selectedDate = {
      startDate: item.selection.startDate,
      endDate: item.selection.endDate,
    };

    setSelectedDateText(selectedDate);
    const optionDate = radioOptionDate();
    let selectedOption = optionDate.find(
      (item) =>
        item?.key !== OptionDateTime.allTime &&
        item?.startDate?.toLocaleDateString(localeDateString) ===
          selectedDate?.startDate?.toLocaleDateString(localeDateString) &&
        item?.endDate?.toLocaleDateString(localeDateString) ===
          selectedDate?.endDate?.toLocaleDateString(localeDateString),
    );

    let optionKey = OptionDateTime.customize;

    if (selectedOption) {
      optionKey = selectedOption.key;
    }

    switch (optionKey) {
      case OptionDateTime.today:
        setActiveOptionDate(OptionDateTime.today);
        break;
      case OptionDateTime.yesterday:
        setActiveOptionDate(OptionDateTime.yesterday);
        break;
      case OptionDateTime.thisWeek:
        setActiveOptionDate(OptionDateTime.thisWeek);
        break;
      case OptionDateTime.lastWeek:
        setActiveOptionDate(OptionDateTime.lastWeek);
        break;
      case OptionDateTime.thisMonth:
        setActiveOptionDate(OptionDateTime.thisMonth);
        break;
      case OptionDateTime.lastMonth:
        setActiveOptionDate(OptionDateTime.lastMonth);
        break;
      case OptionDateTime.thisYear:
        setActiveOptionDate(OptionDateTime.thisYear);
        break;
      case OptionDateTime.allTime:
        setActiveOptionDate(OptionDateTime.allTime);
        break;
      default:
        setActiveOptionDate(OptionDateTime.customize);
        setAllTime(false);
        break;
    }
  };

  const onSetDatetime = (startEndDate, typeOptionDate) => {
    let startDate = startEndDate[0]?.startDate?.toLocaleString(localeDateString);
    let endDate = startEndDate[0]?.endDate?.toLocaleString(localeDateString);
    let date = {
      startDate: startDate,
      endDate: endDate,
    };
    setSelectedDate(date, typeOptionDate);
    setVisible(false);
  };

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const getDatetime = () => {
    switch (activeOptionDate) {
      case OptionDateTime.today:
        return pageData.optionDatetime.today;
      case OptionDateTime.yesterday:
        return pageData.optionDatetime.yesterday;
      case OptionDateTime.thisWeek:
        return pageData.optionDatetime.thisWeek;
      case OptionDateTime.lastWeek:
        return pageData.optionDatetime.lastWeek;
      case OptionDateTime.thisMonth:
        return pageData.optionDatetime.thisMonth;
      case OptionDateTime.lastMonth:
        return pageData.optionDatetime.lastMonth;
      case OptionDateTime.thisYear:
        return pageData.optionDatetime.thisYear;
      case OptionDateTime.allTime:
        return pageData.optionDatetime.allTime;
      default:
        var formatDate = isShowTime ? DateFormat.DD_MM_YYYY_HH_MM_SS_ : DateFormat.DD_MM_YYYY;
        var startDateFormat = moment(selectedDateText?.startDate)?.format(formatDate);
        var endDateFormat = moment(selectedDateText?.endDate)?.add(1, "d")?.seconds(-1)?.format(formatDate);
        return `${startDateFormat} - ${endDateFormat}`;
    }
  };

  /// The date picker locale support list
  ///af, arDZ, arSA, be, bg, bn, ca, cs, cy, da, de, el, enAU, enCA, enGB, enUS, eo, es, et, faIR, fi, fr, frCA, gl, gu, he, hi, hr, hu, hy, id, is, it, ja, ka, kk, ko, lt, lv, ms, nb, nl, nn, pl, pt, ptBR, ro, ru, sk, sl, sr, srLatn, sv, ta, te, th, tr, ug, uk, vi, zhCN, zhTW
  const getDatePickerLocale = () => {
    var lang = languageService.getLang();
    switch (lang) {
      case "vi":
        setLocaleDateString("en-US");
        return "vi";
      case "en":
      default:
        setLocaleDateString("en-US");
        return "enUS";
    }
  };

  const displayTooltipTitle = () => {
    const { startDate, endDate } = selectionRange?.[0];
    if (startDate && endDate) {
      const fromDate = moment(startDate).format("DD/MM/YYYY");
      const toDate = moment(endDate).format("DD/MM/YYYY");
      return (
        <>
          {fromDate} ~ {toDate}
        </>
      );
    }
    return <></>;
  };

  const getLocales = () => {
    const localesData = locales[getDatePickerLocale()];
    return localesData.code ? localesData : localesData[getDatePickerLocale()];
  };

  const content = () => {
    return (
      <div>
        <div className="fnb-form-picker">
          <Row className="fnb-form-option-date">
            <Radio.Group value={activeOptionDate} onChange={onClickToday}>
              {radioOptionDate().map((item) => {
                return (
                  <Radio.Button
                    disabled={item?.disabled}
                    value={item.key}
                    className={`fnb-btn-date ${item?.disabled && "fnb-btn-date-disable"}`}
                  >
                    {item.name}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </Row>
          <Row className="fnb-form-picker">
            <Row>
              <DateRange
                moveRangeOnFirstSelection={false}
                ranges={selectionRange}
                onChange={(item) => onChangeDateRange(item)}
                months={2}
                locale={getLocales()}
                direction="horizontal"
                showMonthAndYearPickers={true}
              />
            </Row>
          </Row>
        </div>
        <Row className="fnb-footer">
          <div className="fnb-footer-div">
            {!allTime && (
              <>
                {selectionRange[0]?.startDate?.toLocaleDateString(localeDateString) ===
                selectionRange[0]?.endDate?.toLocaleDateString(localeDateString) ? (
                  <p className="fnb-text-date">{moment(selectionRange[0]?.startDate)?.format(DateFormat.DD_MM_YYYY)}</p>
                ) : (
                  <Row className="fnb-date-to-date-wrapper">
                    <span className="fnb-text-start-date">
                      {moment(selectionRange[0]?.startDate)?.format(DateFormat.DD_MM_YYYY)}
                    </span>
                    <span className="fnb-text-to-date">{pageData.optionDatetime.to}</span>
                    <span className="fnb-text-end-date">
                      {moment(selectionRange[0]?.endDate)?.format(DateFormat.DD_MM_YYYY)}
                    </span>
                  </Row>
                )}
              </>
            )}
          </div>
          <div className="fnb-form-btn">
            <Button className="fnb-btn-cancel" onClick={() => onClickCancel()}>
              {pageData.cancel}
            </Button>
            <Button className="fnb-btn-apply" onClick={() => onSetDatetime(selectionRange, activeOptionDate)}>
              {pageData.apply}
            </Button>
          </div>
        </Row>
      </div>
    );
  };

  const onClickCancel = () => {
    switch (activeOptionDate) {
      case OptionDateTime.customize:
        const optionDate = radioOptionDate();
        const selectedOption = optionDate.find((item) => item.key === OptionDateTime.today);

        let selectedDate = {
          startDate: selectedOption.startDate,
          endDate: selectedOption.endDate,
          key: "selection",
        };

        const typeOptionDate = selectedOption.key;
        setActiveOptionDate(typeOptionDate);
        if (setConditionCompare !== undefined) {
          setConditionCompare(OptionDateTime.today);
        }
        setSelectionRange([selectedDate]);
        onSetDatetime([selectedDate], typeOptionDate);
        break;
      default:
        break;
    }
    setVisible(false);
  };

  const onMouseEnter = () => {
    if (getDatetime() === pageData.optionDatetime.allTime) {
      setIsOpenTooltip(false);
    } else {
      setIsOpenTooltip(true);
    }
  };

  return (
    <Popover
      placement={popoverPlacement ?? "bottom"}
      open={visible}
      overlayClassName="fnb-popver-picker"
      onOpenChange={handleVisibleChange}
      content={content}
      trigger="click"
    >
      <Tooltip open={!visible && isOpenTooltip} placement="bottomRight" title={displayTooltipTitle}>
        <Button
          className={`btn-date-picker ${className} ${blurEffect && "input-blur-effect"}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={() => setIsOpenTooltip(false)}
        >
          <div className="fnb-btn-div-icon-calendar">
            <CalendarIcon />
          </div>
          <div className="fnb-div-text-date-time">
            <p className="fnb-text-date-time">{getDatetime()}</p>
          </div>
          <div className="fnb-div-down">
            <DownIcon className="fnb-icon-down" />
          </div>
        </Button>
      </Tooltip>
    </Popover>
  );
}
