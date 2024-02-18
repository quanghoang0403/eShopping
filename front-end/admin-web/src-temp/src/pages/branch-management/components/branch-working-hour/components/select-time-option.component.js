import { Card, Col, Form, Row, TimePicker, Tooltip } from "antd";
import { ArrowLeftBackIcon, ButtonPlusIcon, TrashFill } from "constants/icons.constants";
import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import "../branch-working-hour.scss";
import { DayOfWeekConstants, DayOfWeekGetNameConstants } from "constants/day-of-week.constants";
import { useDispatch, useSelector } from "react-redux";
import { setBranchWorkingHoursData } from "store/modules/branch/branch.actions";
import moment from "moment";
import { useMediaQuery } from "react-responsive";
import { DateFormat } from "constants/string.constants";

export const SelectTimeOptionComponent = forwardRef((props, ref) => {
  const { t, formatData, listDayOfWeek, setActiveSpecificDayOnMobile, formSelectTimeOption } = props;
  const isMaxWidth576 = useMediaQuery({ maxWidth: 576 });
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [objectName, setObjectName] = useState("");
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState(null);
  const branchWorkingHours = useSelector((state) => state?.branch?.branchWorkingHours);
  const [dayOfWeekSelected, setDayOfWeekSelected] = useState(listDayOfWeek);

  const pageData = {
    openTime: t("branchWorkingHour.openTime"),
    closeTime: t("branchWorkingHour.closeTime"),
    selectTimePlaceholder: t("branchWorkingHour.selectTimePlaceholder"),
    pleaseSelectOpenTime: t("branchWorkingHour.pleaseSelectOpenTime"),
    pleaseSelectCloseTime: t("branchWorkingHour.pleaseSelectCloseTime"),
    validateStartTime: t("branchWorkingHour.validateStartTime"),
    validateCloseTime: t("branchWorkingHour.validateCloseTime"),
    delete: t("button.delete"),
  };

  const dateType = {
    OPEN_TIME: "openTime",
    CLOSE_TIME: "closeTime",
  };

  useImperativeHandle(ref, () => ({
    getDayOfWeek(day) {
      getInfo(day);
    },
    getDayOfWeekActive(dayOfWeekSelected) {
      setDayOfWeekSelected(dayOfWeekSelected);
    },
  }));

  const getInfo = (day) => {
    const dayOfWeekInfo = DayOfWeekGetNameConstants?.find((item) => item.id === day);
    if (dayOfWeekInfo) {
      const { id, text, objectName } = dayOfWeekInfo;
      setCurrentDayOfWeek(id);
      setTitle(t(text));
      setObjectName(objectName);
      initialFormValue(id, objectName);
    }
  };

  useEffect(() => {
    if (branchWorkingHours) {
      if (formatData) {
        formatData(branchWorkingHours);
      }
    }
  }, [branchWorkingHours]);

  const onSaveToReduxWhenAddOrRemoveOption = () => {
    const formValues = formSelectTimeOption.getFieldsValue();
    const filterObjWithoutTime = formValues[objectName]?.filter((item) => item.openTime && item.closeTime);
    const reduxData = {
      ...branchWorkingHours,
      [objectName]: filterObjWithoutTime,
    };
    dispatch(setBranchWorkingHoursData(reduxData));
  };

  const initialFormValue = (day, objectName) => {
    const defaultObj = {
      [objectName]: [
        {
          id: null,
          openTime: moment().set("hour", 0).set("minute", 0).set("second", 0),
          closeTime: moment().set("hour", 23).set("minute", 59).set("second", 0),
          dayOfWeek: day,
        },
      ],
    };

    if (!branchWorkingHours || (branchWorkingHours && !branchWorkingHours[objectName])) {
      const reduxData = {
        ...branchWorkingHours,
        ...defaultObj,
      };
      dispatch(setBranchWorkingHoursData(reduxData));
      formSelectTimeOption.setFieldsValue(defaultObj);
    }
  };

  const onSelectTime = (time, index, type) => {
    let formValues = formSelectTimeOption.getFieldsValue();
    formValues[objectName][index][type] = time;
    onValuesFormChange(formValues);
  };

  const onValuesFormChange = (formValues) => {
    const currentObj = formValues[objectName];
    if (currentObj) {
      const values = currentObj?.map((item) => {
        return {
          id: item?.id,
          openTime: item.openTime,
          closeTime: item.closeTime,
          dayOfWeek: currentDayOfWeek,
        };
      });

      const reduxData = {
        ...branchWorkingHours,
        [objectName]: [...values],
      };
      dispatch(setBranchWorkingHoursData(reduxData));
      formSelectTimeOption.setFieldsValue(formValues);
    }
  };

  /**
   * Disable Hour Minute From End Time
   */
  const getDisabledHoursStartTime = (index) => {
    var hours = [];
    let formValues = formSelectTimeOption.getFieldsValue();
    if (index > 0) {
      let closeTime = formValues[objectName][index - 1].closeTime;
      if (closeTime) {
        for (var i = 0; i < moment(closeTime).hour(); i++) {
          hours.push(i);
        }
      }
    }
    return hours;
  };

  /**
   * Disable Hour Minute From End Time
   * @param {*} selectedHour
   */
  const getDisabledMinutesStartTime = (selectedHour, index) => {
    var minutes = [];
    let formValues = formSelectTimeOption.getFieldsValue();
    if (index > 0) {
      let closeTime = formValues[objectName][index - 1].closeTime;
      if (selectedHour === moment(closeTime).hour()) {
        for (var i = 0; i < moment(closeTime).minute(); i++) {
          minutes.push(i);
        }
      }
    }
    return minutes;
  };

  /**
   * Disable Hour Minute From End Time
   */
  const getDisabledHoursEndTime = (index) => {
    var hours = [];
    let formValues = formSelectTimeOption.getFieldsValue();
    let openTime = formValues[objectName][index].openTime;
    if (openTime) {
      for (var i = 0; i < moment(openTime).hour(); i++) {
        hours.push(i);
      }
    }
    return hours;
  };

  /**
   * Disable Hour Minute From End Time
   * @param {*} selectedHour
   */
  const getDisabledMinutesEndTime = (selectedHour, index) => {
    var minutes = [];
    let formValues = formSelectTimeOption.getFieldsValue();
    let openTime = formValues[objectName][index].openTime;
    if (selectedHour === moment(openTime).hour()) {
      for (var i = 0; i <= moment(openTime).minute(); i++) {
        minutes.push(i);
      }
    }
    return minutes;
  };

  const validateOpenTime = (currentOpenTime, callback, index) => {
    if (currentOpenTime) {
      const formValues = formSelectTimeOption.getFieldsValue();
      if (index > 0) {
        const previousCloseTime = formValues[objectName][index - 1].closeTime;
        if (previousCloseTime && moment(currentOpenTime).isBefore(previousCloseTime, "minute")) {
          const validateMessage = pageData.validateStartTime + moment(previousCloseTime)?.format(DateFormat.HH_MM);
          callback(validateMessage);
        }
      }
    }
    callback();
  };

  const validateCloseTime = (currentCloseTime, callback, index) => {
    if (currentCloseTime) {
      const formValues = formSelectTimeOption.getFieldsValue();
      const currentOpenTime = formValues[objectName][index].openTime;
      if (currentOpenTime && moment(currentCloseTime).isSameOrBefore(currentOpenTime, "minute")) {
        const validateMessage = pageData.validateCloseTime + moment(currentOpenTime)?.format(DateFormat.HH_MM);
        callback(validateMessage);
      }
    }
    callback();
  };

  return (
    <Card className="fnb-card card-select-time-option">
      <Form form={formSelectTimeOption} autoComplete="off">
        <Form.List name={objectName}>
          {(fields, { add, remove }) => (
            <>
              <div className="d-flex-align-center">
                <h3 className="card-title d-flex" onClick={() => setActiveSpecificDayOnMobile(false)}>
                  {isMaxWidth576 && (
                    <span className="mr-10">
                      <ArrowLeftBackIcon />
                    </span>
                  )}
                  <span>{title}</span>
                </h3>
                <div
                  className={`ml-auto ${currentDayOfWeek === DayOfWeekConstants.ALL_DAYS ||
                    dayOfWeekSelected?.find((i) => i === currentDayOfWeek)
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-disabled"
                    }`}
                  onClick={async () => {
                    if (
                      currentDayOfWeek === DayOfWeekConstants.ALL_DAYS ||
                      dayOfWeekSelected?.find((i) => i === currentDayOfWeek)
                    ) {
                      await formSelectTimeOption.validateFields();
                      onSaveToReduxWhenAddOrRemoveOption();
                      add();
                    }
                  }}
                >
                  <ButtonPlusIcon />
                </div>
              </div>
              <div className="mt-16">
                {fields.map(({ key, name }) => {
                  return (
                    <Row gutter={isMaxWidth576 ? [12, 12] : [24, 24]} key={key} className="select-time-option-row">
                      <Col span={11}>
                        <h4 className="fnb-form-label">{pageData.openTime}</h4>
                        <Form.Item
                          name={[name, "openTime"]}
                          rules={[
                            {
                              required: true,
                              message: pageData.pleaseSelectOpenTime,
                            },
                            {
                              validator: (_, value, callback) => validateOpenTime(value, callback, name),
                            },
                          ]}
                        >
                          <TimePicker
                            autoComplete="off"
                            className="fnb-date-picker working-hour-time-picker w-100"
                            popupClassName="fnb-date-time-picker-dropdown fnb-date-time-picker-dropdown-style"
                            format={"HH:mm"}
                            onSelect={(time) => {
                              onSelectTime(time, name, dateType.OPEN_TIME);
                            }}
                            onChange={(time) => {
                              onSelectTime(time, name, dateType.OPEN_TIME);
                            }}
                            placeholder={pageData.selectTimePlaceholder}
                            showNow={false}
                            showConfirm={false}
                            allowClear={false}
                            disabledTime={() => {
                              return {
                                disabledHours: () => getDisabledHoursStartTime(name),
                                disabledMinutes: (selectedHour) => getDisabledMinutesStartTime(selectedHour, name),
                              };
                            }}
                            disabled={
                              currentDayOfWeek === DayOfWeekConstants.ALL_DAYS
                                ? false
                                : !dayOfWeekSelected?.find((i) => i === currentDayOfWeek)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={11}>
                        <h4 className="fnb-form-label">{pageData.closeTime}</h4>
                        <Form.Item
                          name={[name, "closeTime"]}
                          rules={[
                            {
                              required: true,
                              message: pageData.pleaseSelectCloseTime,
                            },
                            {
                              validator: (_, value, callback) => validateCloseTime(value, callback, name),
                            },
                          ]}
                        >
                          <TimePicker
                            autoComplete="off"
                            className="fnb-date-picker working-hour-time-picker w-100"
                            popupClassName="fnb-date-time-picker-dropdown fnb-date-time-picker-dropdown-style"
                            format={"HH:mm"}
                            onSelect={(time) => {
                              onSelectTime(time, name, dateType.CLOSE_TIME);
                            }}
                            onChange={(time) => {
                              onSelectTime(time, name, dateType.CLOSE_TIME);
                            }}
                            placeholder={pageData.selectTimePlaceholder}
                            showNow={false}
                            showConfirm={false}
                            allowClear={false}
                            disabledTime={() => {
                              return {
                                disabledHours: () => getDisabledHoursEndTime(name),
                                disabledMinutes: (selectedHour) => getDisabledMinutesEndTime(selectedHour, name),
                              };
                            }}
                            disabled={
                              currentDayOfWeek === DayOfWeekConstants.ALL_DAYS
                                ? false
                                : !dayOfWeekSelected?.find((i) => i === currentDayOfWeek)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item name={[name, "dayOfWeek"]} initialValue={currentDayOfWeek} hidden />
                        <Form.Item name={[name, "id"]} hidden />
                        {name !== 0 &&
                          (currentDayOfWeek === DayOfWeekConstants.ALL_DAYS ||
                            dayOfWeekSelected?.find((i) => i === currentDayOfWeek)) && (
                            <div
                              className="icon-box"
                              onClick={() => {
                                remove(name);
                                onSaveToReduxWhenAddOrRemoveOption();
                              }}
                            >
                              <span className="icon">
                                <Tooltip placement="top" title={pageData.delete}>
                                  <TrashFill />
                                </Tooltip>
                              </span>
                            </div>
                          )}
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </>
          )}
        </Form.List>
      </Form>
    </Card>
  );
});
