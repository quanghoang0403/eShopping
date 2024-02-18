import { Button, Col, DatePicker, Form, Input, InputNumber, message, Radio, Row, Select, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import PageTitle from "components/page-title";
import {
  ageConditionOptions,
  customerDataOptions,
  genderConditionOptions,
  monthsInYearOptions,
  objectiveOptions,
  orderConditionOptions,
  orderDataOptions,
  registrationDateConditionOptions,
} from "constants/customer-segment-condition-option.constants";
import {
  ageDataEnum,
  customerDataEnum,
  genderEnum,
  objectiveEnum,
  orderConditionEnum,
  orderDataEnum,
  registrationDateConditionEnum,
} from "constants/customer-segment-condition.constants";
import {
  DELAYED_TIME,
  inputNumberRange0To100,
  inputNumberRange0To10000,
  inputNumberRange0To999999999,
  inputNumberRange0To999999999DotAllow,
} from "constants/default.constants";
import { TrashFill } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { currency, DateFormat } from "constants/string.constants";
import customerDataService from "data-services/customer/customer-data.service";
import storeDataService from "data-services/store/store-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { getCurrency, getValidationMessages } from "utils/helpers";
import "./create-customer-segment.page.scss";
const { Option } = Select;

export default function CreateCustomerSegment(props) {
  const { t, history, customerSegmentDataService } = props;
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: "",
    isAllMatch: false,
    conditions: [],
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const isMobileMode = useMediaQuery({ maxWidth: 575 });
  const [listPlatforms, setListPlatforms] = useState([]);
  const [listCustomerTag, setListCustomerTag] = useState([]);

  const pageData = {
    title: t("customerSegment.createCustomerSegment"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAddNew: t("button.addNew"),
    name: {
      label: t("customerSegment.name"),
      placeholder: t("customerSegment.namePlaceholder"),
      required: true,
      maxLength: 100,
      validateMessage: t("customerSegment.nameValidateMessage"),
    },
    namePlaceholder: t("customerSegment.namePlaceholder"),
    condition: {
      title: t("customerSegment.condition.title"),
      objective: t("customerSegment.condition.objective"),
      condition: t("customerSegment.condition.condition"),
      customerData: t("customerSegment.condition.customerData"),
      orderData: t("customerSegment.condition.orderData"),
      registrationDate: t("customerSegment.condition.registrationDate"),
      birthday: {
        label: t("customerSegment.condition.birthday"),
        placeholder: t("customerSegment.condition.birthdayPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.birthdayValidateMessage"),
      },
      gender: t("customerSegment.condition.gender"),
      tag: t("customerSegment.condition.tag"),
      tags: {
        label: t("customerSegment.condition.tags"),
        placeholder: t("customerSegment.condition.tagsPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.tagsValidateMessage"),
      },
      on: t("customerSegment.condition.on"),
      before: t("customerSegment.condition.before"),
      after: t("customerSegment.condition.after"),
      time: {
        label: t("customerSegment.condition.time"),
        placeholder: t("customerSegment.condition.timePlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.timeValidateMessage"),
      },
      male: t("customerSegment.condition.male"),
      is: t("customerSegment.condition.is"),
      are: t("customerSegment.condition.are"),
      totalOrders: t("customerSegment.condition.totalOrders"),
      totalPurchaseAmount: {
        label: t("customerSegment.condition.totalPurchaseAmount"),
        placeholder: t("customerSegment.condition.totalPurchaseAmountPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.totalPurchaseAmountValidateMessage"),
        max: 999999999,
        min: 0,
        format: "^[0-9]*$",
      },
      isEqual: t("customerSegment.condition.isEqual"),
      isLargerThan: t("customerSegment.condition.isLargerThan"),
      isLessThan: t("customerSegment.condition.isLessThan"),
      orderNumber: {
        label: t("customerSegment.condition.orderNumber"),
        placeholder: t("customerSegment.condition.orderNumberPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.orderNumberValidateMessage"),
      },
      allTime: t("customerSegment.condition.allTime"),
      thisWeek: t("customerSegment.condition.thisWeek"),
      thisMonth: t("customerSegment.condition.thisMonth"),
      thisYear: t("customerSegment.condition.thisYear"),
      amount: t("customerSegment.condition.amount"),
      add: t("customerSegment.condition.addCondition"),
      ifAnyMatch: t("customerSegment.condition.ifAnyMatch"),
      allMatch: t("customerSegment.condition.allMatch"),
      age: t("customerSegment.condition.age"),
      platformValidateMessage: t("customerSegment.condition.platformValidateMessage"),
      tagValidateMessage: t("customerSegment.condition.tagValidateMessage"),
      ageValidateMessage: t("customerSegment.condition.ageValidateMessage"),
      platformPlaceholder: t("customerSegment.condition.platformPlaceholder"),
      tagPlaceholder: t("customerSegment.condition.tagPlaceholder"),
      agePlaceholder: t("customerSegment.condition.agePlaceholder"),
      ageRankValidateMessage: t("customerSegment.condition.ageRankValidateMessage"),
    },
    cancelText: t("button.ignore"),
    okText: t("button.confirmLeave"),
    leaveWarningMessage: t("messages.leaveWarningMessage"),
    customerSegmentAddSuccess: t("customerSegment.customerSegmentAddSuccess"),
    discardBtn: t("button.discard"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    generalInformation: t("customer.generalInformation"),
    valueShouldBeFrom0to999999999: t("customerSegment.condition.valueShouldBeFrom0to999999999"),
    valueShouldBeFrom0to10000: t("customerSegment.condition.valueShouldBeFrom0to10000"),
  };

  useEffect(() => {
    setInitData();
  }, []);
  const initConditionData = {
    objectiveId: objectiveEnum.customerData,
    customerDataId: customerDataEnum.registrationDate,
    registrationDateConditionId: registrationDateConditionEnum.on,
    orderDataId: orderDataEnum.totalCompletedOrders,
    orderConditionId: orderConditionEnum.isEqual,
    days: 0,
    orderStartTime: moment(),
    orderEndTime: moment(),
    orderTypeFilterTime: OptionDateTime.allTime,
    orderNumber: 0,
  };
  const setInitData = async () => {
    let resPlatform = await storeDataService.getAllPlatformActivatedAsync();
    if (resPlatform) {
      setListPlatforms(resPlatform.platforms);
    }

    let resCustomerTag = await customerDataService.getCustomerTagAsync();
    if (resCustomerTag) {
      setListCustomerTag(resCustomerTag.tags);
    }

    let initFormData = {
      ...formData,
      conditions: [initConditionData],
    };

    form.setFieldsValue(initFormData);
    setFormData(initFormData);
  };

  /// update form data
  const updateFormData = (formData) => {
    const formValues = form.getFieldsValue();
    const { name, isAllMatch } = formValues;

    let initFormData = {
      name: name,
      isAllMatch: isAllMatch,
      conditions: formData.conditions,
    };

    form.setFieldsValue(initFormData);
    setFormData(initFormData);
  };

  /// Submit form
  const onSubmitForm = () => {
    form.validateFields().then(async (values) => {
      customerSegmentDataService
        .createCustomerSegmentAsync(values)
        .then((res) => {
          if (res) {
            message.success(pageData.customerSegmentAddSuccess);
            onCompleted();
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessages(errs));
        });
    });
  };

  /// Add condition
  const onAddCondition = () => {
    const formValues = form.getFieldsValue();
    const { name, isAllMatch } = formValues;

    let initFormData = {
      name: name,
      isAllMatch: isAllMatch,
      conditions: [...formData.conditions, initConditionData],
    };

    form.setFieldsValue({ ...formValues, ...initFormData });
    setFormData(initFormData);
  };

  /// Delete condition
  const deleteCondition = (index) => {
    const { name, isAllMatch, conditions } = formData;
    const newConditions = conditions.filter((_, i) => i !== index);
    let initFormData = {
      name: name,
      isAllMatch: isAllMatch,
      conditions: newConditions,
    };
    updateFormData(initFormData);
  };
  /// Change objectiveId
  const onChangeObjective = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].objectiveId = value;
    }
    updateFormData(formData);
  };

  /// Change customerDataId
  const onChangeCustomerData = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].customerDataId = value;
      if (value === customerDataEnum.gender) {
        conditions[index].gender = genderEnum.female;
      }
      if (value === customerDataEnum.age) {
        conditions[index].age = 25;
        conditions[index].ageConditionId = ageDataEnum.isEqual;
      }
    }
    updateFormData(formData);
  };

  /// Change registrationDateConditionId
  const onChangeRegistrationDateCondition = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].registrationDateConditionId = value;
    }
    updateFormData(formData);
  };
  /// Change orderDataId
  const onChangeOrderData = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].orderDataId = value;
      conditions[index].orderConditionId = orderConditionEnum.isEqual;
      conditions[index].orderTypeFilterTime = OptionDateTime.allTime;
      conditions[index].orderNumber = 0;
      conditions[index].days = 0;
      conditions[index].purchasedAmount = 0;
      conditions[index].orderStartTime = "";
      conditions[index].orderEndTime = "";
      conditions[index].orderTime = {
        startDate: "",
        endDate: "",
      };
    }
    updateFormData(formData);
  };

  const onChangeOrderCondition = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].orderConditionId = value;
    }
    updateFormData(formData);
  };

  const onChangeOrderNumber = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].orderNumber = value;
    }
    updateFormData(formData);
  };

  const onChangePurchasedAmount = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].purchasedAmount = value;
    }
    updateFormData(formData);
  };

  const onChangeDays = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].days = value;
    }
    updateFormData(formData);
  };

  /// Change registrationTime
  const onChangeRegistrationTime = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].registrationTime = value;
    }
    updateFormData(formData);
  };

  /// Change birthdayTime
  const onChangeBirthday = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].birthday = value;
    }
    updateFormData(formData);
  };

  /// Change gender
  const onChangeGender = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].gender = value;
    }
    updateFormData(formData);
  };

  /// Change ageCondition
  const onChangeAgeCondition = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].ageConditionId = value;
    }
    updateFormData(formData);
  };

  /// Change ageCondition
  const onChangeAge = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].age = value;
    }
    updateFormData(formData);
  };

  /// Change Platform
  const onChangePlatform = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].platformId = value;
    }
    updateFormData(formData);
  };

  /// Change Tag
  const onChangeTag = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].tagId = value;
    }
    updateFormData(formData);
  };

  /// render multiple conditions
  const renderConditions = () => {
    const { conditions } = formData;
    return conditions?.map((condition, index) => {
      return renderCondition(condition, index);
    });
  };

  const onSelectedDatePicker = (date, typeOptionDate, index) => {
    let { conditions } = formData;

    if (conditions) {
      conditions[index].orderStartTime = date.startDate;
      conditions[index].orderEndTime = date.endDate;
      conditions[index].orderTime = date;
      conditions[index].orderTypeFilterTime = typeOptionDate;
    }

    updateFormData(formData);
  };

  /// Render single condition
  const renderCondition = (condition, index) => {
    const deleteIcon = formData.conditions?.length > 1 ? <TrashFill className="icon-del" /> : <></>;
    return (
      <>
        <Row key={index}>
          <Col
            sm={24}
            xs={24}
            lg={5}
            style={
              isMobileMode
                ? { maxWidth: "266px", marginLeft: "40px", marginTop: "24px" }
                : { paddingRight: "16px", marginLeft: "40px" }
            }
          >
            {index !== 0 && isMobileMode && (
              <hr style={{ border: "1px solid #F1EEFF", width: "100%", margin: "24px 0" }} />
            )}
            <h4 className="fnb-form-label">{pageData.condition.objective}</h4>
            <Form.Item name={["conditions", index, "objectiveId"]}>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                defaultValue={objectiveEnum.customerData}
                className="fnb-select-single"
                popupClassName="fnb-select-single-dropdown"
                onChange={(value) => onChangeObjective(value, index)}
              >
                {objectiveOptions.map((item, index) => {
                  return (
                    <Option key={index} value={item.id}>
                      {t(item.name)}
                    </Option>
                  );
                })}
              </Select>
              {isMobileMode && index !== 0 && (
                <a className="customer-segment-trash-icon" onClick={() => deleteCondition(index)}>
                  {deleteIcon}
                </a>
              )}
            </Form.Item>
          </Col>
          <Col sm={24} xs={24} lg={15} className="customer-segment-data">
            {condition?.objectiveId === objectiveEnum.customerData && renderOptionCustomerData(condition, index)}
            {condition?.objectiveId === objectiveEnum.orderData && renderOptionOrderData(condition, index)}
          </Col>
          <Col sm={24} xs={24} lg={2}>
            <div
              style={
                isMobileMode ? { marginTop: "-20px", marginLeft: "40px", marginBottom: "20px" } : { marginTop: "20px" }
              }
            >
              <h4>&nbsp;</h4>
              {!isMobileMode && index !== 0 && <a onClick={() => deleteCondition(index)}>{deleteIcon}</a>}
            </div>
          </Col>
        </Row>
      </>
    );
  };

  /// Render Customer data
  const renderOptionCustomerData = (condition, index) => {
    return (
      <>
        <Row key={index}>
          <Col
            sm={24}
            xs={24}
            lg={8}
            style={
              isMobileMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "0px" }
            }
          >
            <div className={`${!isMobileMode && "ml-2"}`}>
              <h4 className="fnb-form-label">{pageData.condition.customerData}</h4>
              <Form.Item name={["conditions", index, "customerDataId"]}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  defaultValue={customerDataEnum.registrationDate}
                  onChange={(value) => onChangeCustomerData(value, index)}
                  className="fnb-select-single"
                  popupClassName="fnb-select-single-dropdown"
                >
                  {customerDataOptions.map((item, index) => {
                    return (
                      <Option key={index} value={item.id}>
                        {t(item.name)}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col sm={24} xs={24} lg={16}>
            {condition?.customerDataId === customerDataEnum.registrationDate && (
              <Row>
                <Col
                  sm={24}
                  xs={24}
                  lg={12}
                  style={
                    isMobileMode
                      ? { maxWidth: "266px", marginLeft: "40px" }
                      : { paddingRight: "16px", marginLeft: "0px" }
                  }
                >
                  <div className={`${!isMobileMode && "ml-2"}`}>
                    <h4 className="fnb-form-label">{pageData.condition.condition}</h4>
                    <Form.Item name={["conditions", index, "registrationDateConditionId"]}>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        defaultValue={registrationDateConditionEnum.on}
                        className="fnb-select-single"
                        popupClassName="fnb-select-single-dropdown"
                        onChange={(value) => onChangeRegistrationDateCondition(value, index)}
                      >
                        {registrationDateConditionOptions.map((item, index) => {
                          return (
                            <Option key={index} value={item.id}>
                              {t(item.name)}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col
                  sm={24}
                  xs={24}
                  lg={12}
                  style={
                    isMobileMode
                      ? { maxWidth: "266px", marginLeft: "40px" }
                      : { paddingRight: "16px", marginLeft: "0px" }
                  }
                >
                  <div className={`${!isMobileMode && "ml-2"}`}>
                    <h4 className="fnb-form-label">{pageData.condition.time.label}</h4>
                    <Form.Item
                      name={["conditions", index, "registrationTime"]}
                      rules={[
                        {
                          required: pageData.condition.time.required,
                          message: pageData.condition.time.validateMessage,
                        },
                      ]}
                    >
                      <DatePicker
                        className="fnb-date-picker w-100"
                        format={DateFormat.DD_MM_YYYY}
                        placeholder={pageData.condition.time.placeholder}
                        onChange={(value) => onChangeRegistrationTime(value, index)}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            )}
            {condition?.customerDataId === customerDataEnum.birthday && (
              <Row>
                <Col
                  sm={24}
                  xs={24}
                  lg={12}
                  style={
                    isMobileMode
                      ? { maxWidth: "266px", marginLeft: "40px", paddingBottom: "10px" }
                      : { textAlign: "center", paddingTop: "48px" }
                  }
                >
                  <h4 className="fnb-form-label">{pageData.condition.on}</h4>
                </Col>
                <Col
                  sm={24}
                  xs={24}
                  lg={12}
                  style={isMobileMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px" }}
                >
                  <h4 className="fnb-form-label">{pageData.condition.time.label}</h4>
                  <Form.Item
                    name={["conditions", index, "birthday"]}
                    rules={[
                      {
                        required: pageData.condition.birthday.required,
                        message: pageData.condition.birthday.validateMessage,
                      },
                    ]}
                  >
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placeholder={pageData.condition.birthday.placeholder}
                      className="fnb-select-single"
                      popupClassName="fnb-select-single-dropdown"
                      onChange={(value) => onChangeBirthday(value, index)}
                    >
                      {monthsInYearOptions.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {t(item.name)}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
            {condition?.customerDataId === customerDataEnum.gender && (
              <>
                <Row>
                  <Col
                    sm={24}
                    xs={24}
                    lg={12}
                    style={
                      isMobileMode
                        ? { maxWidth: "266px", marginLeft: "40px", paddingBottom: "10px" }
                        : { textAlign: "center", paddingTop: "48px" }
                    }
                  >
                    <h4 className="fnb-form-label">{pageData.condition.is}</h4>
                  </Col>
                  <Col
                    sm={24}
                    xs={24}
                    lg={12}
                    style={
                      isMobileMode
                        ? { maxWidth: "266px", marginLeft: "40px", paddingBottom: "-20px", marginTop: "0px" }
                        : { paddingTop: "8px", marginTop: "32px" }
                    }
                  >
                    <Form.Item name={["conditions", index, "gender"]}>
                      <Radio.Group onChange={(e) => onChangeGender(e.target.value, index)}>
                        {genderConditionOptions.map((item, index) => {
                          return <Radio value={item.id}>{t(item.name)}</Radio>;
                        })}
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            {condition?.customerDataId === customerDataEnum.tag && (
              <>
                <Row>
                  <Col
                    sm={24}
                    xs={24}
                    lg={12}
                    style={
                      isMobileMode
                        ? { maxWidth: "266px", marginLeft: "40px", paddingBottom: "10px" }
                        : { textAlign: "center", paddingTop: "48px" }
                    }
                  >
                    <h4 className="fnb-form-label">{pageData.condition.is}</h4>
                  </Col>
                  <Col
                    sm={24}
                    xs={24}
                    lg={12}
                    style={
                      isMobileMode
                        ? { maxWidth: "266px", marginLeft: "40px" }
                        : { paddingRight: "16px", marginLeft: "0px" }
                    }
                  >
                    <h4 className="fnb-form-label">{pageData.condition.tags.label}</h4>
                    <Form.Item
                      name={["conditions", index, "tagId"]}
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (!value) {
                              return Promise.reject(pageData.condition.tagValidateMessage);
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        className="fnb-select-single"
                        popupClassName="fnb-select-single-dropdown"
                        onChange={(value) => onChangeTag(value, index)}
                        placeholder={pageData.condition.tagPlaceholder}
                        showSearch
                        allowClear
                        filterOption={(input, option) => (option?.children ?? "").includes(input)}
                      >
                        {listCustomerTag.map((item, i) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            {condition?.customerDataId === customerDataEnum.age && (
              <Row>
                <Col
                  sm={24}
                  xs={24}
                  lg={12}
                  style={
                    isMobileMode
                      ? { maxWidth: "266px", marginLeft: "40px" }
                      : { paddingRight: "16px", marginLeft: "0px" }
                  }
                >
                  <div className={`${!isMobileMode && "ml-2"}`}>
                    <h4 className="fnb-form-label">{pageData.condition.condition}</h4>
                    <Form.Item name={["conditions", index, "ageConditionId"]}>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        className="fnb-select-single"
                        popupClassName="fnb-select-single-dropdown"
                        onChange={(value) => onChangeAgeCondition(value, index)}
                      >
                        {ageConditionOptions.map((item, index) => {
                          return (
                            <Option key={index} value={item.id}>
                              {t(item.name)}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col
                  sm={24}
                  xs={24}
                  lg={12}
                  style={
                    isMobileMode
                      ? { maxWidth: "266px", marginLeft: "40px" }
                      : { paddingRight: "16px", marginLeft: "0px" }
                  }
                >
                  <div className={`${!isMobileMode && "ml-2"}`}>
                    <h4 className="fnb-form-label">{pageData.condition.age}</h4>
                    <Form.Item
                      name={["conditions", index, "age"]}
                      rules={[
                        {
                          pattern: new RegExp(inputNumberRange0To100.range),
                          message: pageData.condition.ageRankValidateMessage,
                        },
                        {
                          required: pageData.condition.age,
                          message: pageData.condition.ageValidateMessage,
                        },
                      ]}
                    >
                      <Input
                        className="fnb-input"
                        maxLength={pageData.name.maxLength}
                        size="large"
                        placeholder={pageData.condition.agePlaceholder}
                        onChange={(e) => onChangeAge(e.target.value, index)}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            )}
            {condition?.customerDataId === customerDataEnum.platform && (
              <>
                <Row>
                  <Col
                    sm={24}
                    xs={24}
                    lg={12}
                    style={
                      isMobileMode
                        ? { maxWidth: "266px", marginLeft: "40px", paddingBottom: "10px" }
                        : { textAlign: "center", paddingTop: "48px" }
                    }
                  >
                    <h4 className="fnb-form-label">{pageData.condition.are}</h4>
                  </Col>
                  <Col
                    sm={24}
                    xs={24}
                    lg={12}
                    style={
                      isMobileMode
                        ? { maxWidth: "266px", marginLeft: "40px" }
                        : { paddingRight: "16px", marginLeft: "0px" }
                    }
                  >
                    <h4 className="fnb-form-label">{t("platform.title")}</h4>
                    <Form.Item
                      name={["conditions", index, "platformId"]}
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (!value) {
                              return Promise.reject(pageData.condition.platformValidateMessage);
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        className="fnb-select-single"
                        popupClassName="fnb-select-single-dropdown"
                        onChange={(value) => onChangePlatform(value, index)}
                        placeholder={pageData.condition.platformPlaceholder}
                      >
                        {listPlatforms.map((item, i) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </>
    );
  };

  /// Render Order data
  const renderOptionOrderData = (condition, index) => {
    return (
      <>
        <Row key={index}>
          <Col
            sm={24}
            xs={24}
            lg={6}
            style={
              isMobileMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "0px" }
            }
          >
            <div className={`${!isMobileMode && "ml-2"}`}>
              <h4 className="fnb-form-label">{pageData.condition.orderData}</h4>
              <Form.Item name={["conditions", index, "orderDataId"]}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  defaultValue={orderDataEnum.totalCompletedOrders}
                  onChange={(value) => onChangeOrderData(value, index)}
                  className="fnb-select-single"
                  popupClassName="fnb-select-single-dropdown"
                >
                  {orderDataOptions.map((item, index) => {
                    return (
                      <Option key={index} value={item.id}>
                        {t(item.name)}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col sm={24} xs={24} lg={15}>
            <Row>
              <Col
                sm={24}
                xs={24}
                lg={8}
                style={
                  isMobileMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "0px" }
                }
              >
                <div className={`${!isMobileMode && "ml-2"}`}>
                  <h4 className="fnb-form-label">{pageData.condition.condition}</h4>
                  <Form.Item name={["conditions", index, "orderConditionId"]}>
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      defaultValue={orderConditionEnum.isEqual}
                      onChange={(value) => onChangeOrderCondition(value, index)}
                      className="fnb-select-single"
                      popupClassName="fnb-select-single-dropdown"
                    >
                      {orderConditionOptions.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {t(item.name)}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col
                sm={24}
                xs={24}
                lg={8}
                style={
                  isMobileMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "0px" }
                }
              >
                {condition?.orderDataId === orderDataEnum.totalCompletedOrders && (
                  <div className={`${!isMobileMode && "ml-2"}`}>
                    <h4 className="fnb-form-label">Order number</h4>
                    <Form.Item
                      name={["conditions", index, "orderNumber"]}
                      rules={[
                        {
                          pattern: new RegExp(inputNumberRange0To999999999.range),
                          message: pageData.valueShouldBeFrom0to999999999,
                        },
                        {
                          required: true,
                          message: pageData.valueShouldBeFrom0to999999999,
                        },
                      ]}
                    >
                      <InputNumber
                        className="w-100 fnb-input-number"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        onChange={(value) => {
                          onChangeOrderNumber(value, index);
                        }}
                        defaultValue={0}
                      />
                    </Form.Item>
                  </div>
                )}
                {condition?.orderDataId === orderDataEnum.totalPurchasedAmount && (
                  <div className={`${!isMobileMode && "ml-2"}`}>
                    <h4 className="fnb-form-label">Amount</h4>
                    <Form.Item
                      name={["conditions", index, "purchasedAmount"]}
                      rules={[
                        {
                          pattern: new RegExp(
                            getCurrency() === currency.vnd
                              ? inputNumberRange0To999999999.range
                              : inputNumberRange0To999999999DotAllow.range,
                          ),
                          message: pageData.valueShouldBeFrom0to999999999,
                        },
                        {
                          required: true,
                          message: pageData.valueShouldBeFrom0to999999999,
                        },
                      ]}
                    >
                      <InputNumber
                        className="w-100 fnb-input-number"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        onChange={(value) => {
                          onChangePurchasedAmount(value, index);
                        }}
                        defaultValue={0}
                        precision={getCurrency() === currency.vnd ? 0 : 2}
                      />
                    </Form.Item>
                  </div>
                )}
                {condition?.orderDataId === orderDataEnum.days && (
                  <div className={`${!isMobileMode && "ml-2"}`}>
                    <h4 className="fnb-form-label">Days</h4>
                    <Form.Item
                      name={["conditions", index, "days"]}
                      rules={[
                        {
                          pattern: new RegExp(inputNumberRange0To10000.range),
                          message: pageData.valueShouldBeFrom0to10000,
                        },
                      ]}
                    >
                      <InputNumber
                        className="w-100 fnb-input-number"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        onChange={(value) => {
                          onChangeDays(value, index);
                        }}
                        defaultValue={0}
                      />
                    </Form.Item>
                  </div>
                )}
              </Col>
              <Col
                sm={24}
                xs={24}
                lg={8}
                style={
                  isMobileMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "0px" }
                }
              >
                {condition?.orderDataId !== orderDataEnum.days ? (
                  <div className={`${!isMobileMode && "ml-2"}`}>
                    <h4 className="fnb-form-label">{pageData.condition.time.label}</h4>
                    <Form.Item name={["conditions", index, "orderStartTime"]} className="d-none"></Form.Item>
                    <Form.Item name={["conditions", index, "orderEndTime"]} className="d-none"></Form.Item>
                    <Form.Item name={["conditions", index, "orderTypeFilterTime"]} className="d-none"></Form.Item>
                    <FnbDatePicker
                      blurEffect={true}
                      selectedDate={formData.conditions[index].orderTime}
                      setSelectedDate={(date, typeOptionDate) => onSelectedDatePicker(date, typeOptionDate, index)}
                      orderTypeFilterTime={formData.conditions[index].orderTypeFilterTime}
                      containAllTime={true}
                      className={"date-picker-customer-segment"}
                      popoverPlacement={"bottomLeft"}
                      isShowTime={false}
                    />
                  </div>
                ) : (
                  <div className="ml-2 day-box">
                    <h4>&nbsp;</h4>
                    <p className="day-text">day(s) till now</p>
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  const onCompleted = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/customer/segment");
    }, DELAYED_TIME);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCompleted();
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={pageData.title} />
          </p>
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <FnbAddNewButton
                    onClick={() => onSubmitForm()}
                    className="float-right"
                    type="primary"
                    text={pageData.btnSave}
                  />
                ),
                permission: PermissionKeys.CREATE_SEGMENT,
              },
              {
                action: (
                  <a onClick={() => onCancel()} className="action-cancel">
                    {pageData.btnCancel}
                  </a>
                ),
                permission: null,
              },
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Form form={form} layout="vertical" autoComplete="off" onFieldsChange={(e) => changeForm(e)}>
        <Content>
          <FnbCard title={pageData.generalInformation} className="pt-4 mt-4">
            <Row className="mb-2">
              <Col span={24}>
                <h4 className="fnb-form-label mt-4">{pageData.name.label}</h4>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: pageData.name.required,
                      message: pageData.name.validateMessage,
                    },
                  ]}
                >
                  <Input
                    className="fnb-input"
                    maxLength={pageData.name.maxLength}
                    size="large"
                    placeholder={pageData.name.placeholder}
                  />
                </Form.Item>
              </Col>
            </Row>
          </FnbCard>
        </Content>
        <div className="clearfix"></div>

        <Content>
          <FnbCard title={pageData.condition.condition} className="pt-4 mt-4">
            {!isMobileMode ? (
              <Space className="float-right condition-customer-segment" style={{ marginTop: "-36px" }}>
                <Button onClick={() => onAddCondition()}>{pageData.condition.add}</Button>
              </Space>
            ) : (
              <Row className="float-left condition-customer-segment" style={{ margin: "10px 0px 10px 0px" }}>
                <Button onClick={() => onAddCondition()}>{pageData.condition.add}</Button>
              </Row>
            )}
            <Row className="mt-4 mb-2" style={isMobileMode ? { width: "100%" } : { width: "115%" }}>
              <Col span={24}>
                <Form.Item name="isAllMatch">
                  <Radio.Group>
                    <Radio value={false}>{pageData.condition.ifAnyMatch}</Radio>
                    <Radio value={true}>{pageData.condition.allMatch}</Radio>
                  </Radio.Group>
                </Form.Item>
                {renderConditions()}
              </Col>
            </Row>
          </FnbCard>
        </Content>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.okText}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
