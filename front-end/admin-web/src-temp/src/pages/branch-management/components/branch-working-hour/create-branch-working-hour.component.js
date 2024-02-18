import { Card, Col, Radio, Row, Tooltip } from "antd";
import "./branch-working-hour.scss";
import { useState } from "react";
import { StoreGeneralConfigInfoCircleIcon } from "constants/icons.constants";
import { SelectTimeOptionComponent } from "./components/select-time-option.component";
import { useRef } from "react";
import DayOfWeekSelectorComponent from "./components/day-of-week-selector.component";
import { DayOfWeekConstants, DayOfWeekGetNameConstants, ListDayOfWeek } from "constants/day-of-week.constants";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";

export default function CreateBranchWorkingHourComponent(props) {
  const { t, setCurrentWorkingHoursData, setIsCheckedFullTime, setIsSelectedAllDays, formSelectTimeOption } = props;
  const selectTimeOptionRef = useRef();
  const isMaxWidth576 = useMediaQuery({ maxWidth: 576 });
  const listDayOfWeek = ListDayOfWeek.filter((d) => d !== DayOfWeekConstants.ALL_DAYS);
  const [isFullTime, setIsFullTime] = useState(true);
  const [isAllDay, setIsAllDay] = useState(true);
  const [dayOfWeekSelected, setDayOfWeekSelected] = useState(listDayOfWeek);
  const [currentWorkingHours, setCurrentWorkingHours] = useState([]);
  const [activeSpecificDayOnMobile, setActiveSpecificDayOnMobile] = useState(false);
  const branchWorkingHours = useSelector((state) => state?.branch?.branchWorkingHours);

  const pageData = {
    workingHours: t("branchWorkingHour.workingHours"),
    fullTime: t("branchWorkingHour.fullTime"),
    specificTime: t("branchWorkingHour.specificTime"),
    fullTimeTooltip: t("branchWorkingHour.fullTimeTooltip"),
    specificTimeTooltip: t("branchWorkingHour.specificTimeTooltip"),
    allDaysInWeek: t("branchWorkingHour.allDaysInWeek"),
    specificDay: t("branchWorkingHour.specificDay"),
    workingType: t("branchWorkingHour.workingType"),
    openTime: t("branchWorkingHour.openTime"),
    closeTime: t("branchWorkingHour.closeTime"),
  };

  const onChangeWorkingType = (e) => {
    const isFullTime = e.target.value;
    setIsFullTime(isFullTime);
    setIsCheckedFullTime(isFullTime);

    if (!isFullTime) {
      selectTimeOptionRef?.current?.getDayOfWeek(DayOfWeekConstants.ALL_DAYS);
      onChangeSpecificTimeOption(null, isAllDay);
    }
  };

  const onChangeSpecificTimeOption = (e, initIsAllDay) => {
    const isAllDay = initIsAllDay ?? e.target.value;
    setIsAllDay(isAllDay);
    setIsSelectedAllDays(isAllDay);

    if (isAllDay === true) {
      selectTimeOptionRef?.current?.getDayOfWeek(DayOfWeekConstants.ALL_DAYS);
    } else {
      onClickDayOfWeek(DayOfWeekConstants.MONDAY);
    }

    formatWorkingHoursDataBeforeSave(branchWorkingHours, isAllDay);
  };

  const onClickDayOfWeek = (index) => {
    const element = document.getElementById(`day-of-week-${index}`);
    element.classList.add("active");
    selectTimeOptionRef?.current?.getDayOfWeek(index);

    ///Remove class if not open
    const arrFilter = listDayOfWeek?.filter((i) => i !== index);
    arrFilter?.forEach((i) => {
      const element = document.getElementById(`day-of-week-${i}`);
      element?.classList?.remove("active");
    });
  };

  const getTitleName = (day) => {
    const title = DayOfWeekGetNameConstants?.find((item) => item.id === day)?.text;
    return t(title) ?? "";
  };

  const onCheckDayOfWeek = (e, item) => {
    const checked = e.target.checked;
    let currentDayOfWeekSelected = [...new Set(dayOfWeekSelected)];
    if (checked) {
      if (!currentDayOfWeekSelected.includes(item)) {
        currentDayOfWeekSelected.push(item);
      }
    } else {
      currentDayOfWeekSelected = currentDayOfWeekSelected.filter((i) => i !== item);
    }
    setDayOfWeekSelected(currentDayOfWeekSelected);
    selectTimeOptionRef?.current?.getDayOfWeekActive(currentDayOfWeekSelected);

    ///Set active day of week
    if (!isAllDay) {
      const newWorkingHours = currentWorkingHours?.map((item) => ({
        ...item,
        isActive: currentDayOfWeekSelected?.find((d) => d === item.dayOfWeek) ? true : false,
      }));
      setCurrentWorkingHours(newWorkingHours);
      setCurrentWorkingHoursData(newWorkingHours);
    }
  };

  const formatWorkingHoursDataBeforeSave = (branchWorkingHoursData, initIsAllDay) => {
    const currentCheckIsAllDay = initIsAllDay ?? isAllDay;
    let workingHours = [];
    if (currentCheckIsAllDay) {
      ///Save same 7 days obj if select all days
      const allDaysData = branchWorkingHoursData?.allDays;
      if (allDaysData?.length > 0) {
        allDaysData?.forEach((data) => {
          listDayOfWeek?.forEach((day) => {
            const workingHour = {
              openTime: moment(data?.openTime)?.format(DateFormat.HH_MM),
              closeTime: moment(data?.closeTime)?.format(DateFormat.HH_MM),
              dayOfWeek: day,
              isActive: true,
            };
            workingHours.push(workingHour);
          });
        });
      }
    } else {
      ///Selected day, if form values don't have day data, set default data
      workingHours = [
        ...mappingDataWorkingHours(branchWorkingHoursData?.monday, DayOfWeekConstants.MONDAY),
        ...mappingDataWorkingHours(branchWorkingHoursData?.tuesday, DayOfWeekConstants.TUESDAY),
        ...mappingDataWorkingHours(branchWorkingHoursData?.wednesday, DayOfWeekConstants.WEDNESDAY),
        ...mappingDataWorkingHours(branchWorkingHoursData?.thursday, DayOfWeekConstants.THURSDAY),
        ...mappingDataWorkingHours(branchWorkingHoursData?.friday, DayOfWeekConstants.FRIDAY),
        ...mappingDataWorkingHours(branchWorkingHoursData?.saturday, DayOfWeekConstants.SATURDAY),
        ...mappingDataWorkingHours(branchWorkingHoursData?.sunday, DayOfWeekConstants.SUNDAY),
      ];
    }

    const newWorkingHours = workingHours?.filter((item) => item.openTime !== item.closeTime);
    setCurrentWorkingHours(newWorkingHours);
    setCurrentWorkingHoursData(newWorkingHours);
  };

  const mappingDataWorkingHours = (workingHours, day) => {
    const isActive = dayOfWeekSelected?.find((i) => i === day) ? true : false;
    if (workingHours) {
      const newWorkingHours = workingHours?.map((item) => ({
        openTime: moment(item?.openTime)?.format(DateFormat.HH_MM),
        closeTime: moment(item?.closeTime)?.format(DateFormat.HH_MM),
        dayOfWeek: day,
        isActive: isActive,
      }));
      return newWorkingHours;
    } else {
      const defaultWorkingHours = [
        {
          openTime: moment().set("hour", 0).set("minute", 0).set("second", 0)?.format(DateFormat.HH_MM),
          closeTime: moment().set("hour", 23).set("minute", 59).set("second", 0)?.format(DateFormat.HH_MM),
          dayOfWeek: day,
          isActive: isActive,
        },
      ];
      return defaultWorkingHours;
    }
  };

  const renderDayOfWeekOption = () => {
    let options = [];
    listDayOfWeek?.forEach((item) => {
      const option = (
        <DayOfWeekSelectorComponent
          index={item}
          title={getTitleName(item)}
          onCheck={(e) => onCheckDayOfWeek(e, item)}
          checked={dayOfWeekSelected?.find((i) => i === item) ? true : false}
          onOpenCustomOption={() => {
            onClickDayOfWeek(item);
            setActiveSpecificDayOnMobile(true);
          }}
        />
      );
      options.push(option);
    });

    return options?.map((option) => option);
  };

  return (
    <Card className="fnb-card mt-24 w-100 card-working-hour">
      <h3 className={`card-title ${isMaxWidth576 && activeSpecificDayOnMobile ? "d-none" : "d-block"}`}>
        {pageData.workingHours}
      </h3>
      <Row className="my-24" gutter={[24, 24]}>
        <Col span={24} className={isMaxWidth576 && activeSpecificDayOnMobile ? "d-none" : "d-block"}>
          <h4 className="fnb-form-label mb-0">{pageData.workingType}</h4>
          <Radio.Group className="mt-16" onChange={onChangeWorkingType} value={isFullTime}>
            <Radio value={true} className="mr-10">
              <div className="d-flex-align-center">
                <span className="text-label">{pageData.fullTime}</span>
                <span className="d-flex-align-center">
                  <Tooltip placement="top" title={<span>{pageData.fullTimeTooltip}</span>}>
                    <StoreGeneralConfigInfoCircleIcon className="ml-1" />
                  </Tooltip>
                </span>
              </div>
            </Radio>
            <Radio value={false}>
              <div className="d-flex-align-center">
                <span className="text-label">{pageData.specificTime}</span>
                <span className="d-flex-align-center">
                  <Tooltip placement="top" title={<span>{pageData.specificTimeTooltip}</span>}>
                    <StoreGeneralConfigInfoCircleIcon className="ml-1" />
                  </Tooltip>
                </span>
              </div>
            </Radio>
          </Radio.Group>
        </Col>

        {/* Specific time */}
        <Col
          span={24}
          className={`mt-24 ${isFullTime ? "d-none" : "d-block"} ${
            isMaxWidth576 && activeSpecificDayOnMobile ? "d-none" : "d-block"
          }`}
        >
          <div className="specific-time-container">
            <Row gutter={[24, 24]}>
              <Col xs={24} xl={6}>
                <Radio.Group className="w-100" onChange={onChangeSpecificTimeOption} value={isAllDay}>
                  <div
                    className={`option-tab ${!isAllDay && "inactive"}`}
                    onClick={() => {
                      if (isMaxWidth576) {
                        selectTimeOptionRef?.current?.getDayOfWeek(DayOfWeekConstants.ALL_DAYS);
                        setActiveSpecificDayOnMobile(true);
                      }
                    }}
                  >
                    <Radio value={true}>
                      <span className="text-title">{pageData.allDaysInWeek}</span>
                    </Radio>
                  </div>
                  <div className={`option-tab ${isAllDay && "inactive"}`}>
                    <Radio value={false}>
                      <span className="text-title">{pageData.specificDay}</span>
                    </Radio>
                  </div>
                </Radio.Group>

                {/* Day of week option */}
                <div className={`specific-day-option-box ${isAllDay ? "d-none" : "d-block"}`}>
                  {renderDayOfWeekOption()}
                </div>
              </Col>
              <Col xs={0} xl={18}>
                {!isMaxWidth576 && (
                  <SelectTimeOptionComponent
                    t={t}
                    ref={selectTimeOptionRef}
                    formatData={formatWorkingHoursDataBeforeSave}
                    listDayOfWeek={listDayOfWeek}
                    setActiveSpecificDayOnMobile={setActiveSpecificDayOnMobile}
                    formSelectTimeOption={formSelectTimeOption}
                  />
                )}
              </Col>
            </Row>
          </div>
        </Col>

        {/* Active screen on mobile  */}
        {isMaxWidth576 && (
          <Col span={24} className={activeSpecificDayOnMobile ? "d-block" : "d-none"}>
            <SelectTimeOptionComponent
              t={t}
              ref={selectTimeOptionRef}
              formatData={formatWorkingHoursDataBeforeSave}
              listDayOfWeek={listDayOfWeek}
              setActiveSpecificDayOnMobile={setActiveSpecificDayOnMobile}
              formSelectTimeOption={formSelectTimeOption}
            />
          </Col>
        )}
      </Row>
    </Card>
  );
}
