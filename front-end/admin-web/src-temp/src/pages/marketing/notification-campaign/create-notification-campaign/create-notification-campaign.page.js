import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Space,
  TimePicker,
  Typography,
} from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import { FnbSelectHyperlink } from "components/fnb-select-hyperlink/fnb-select-hyperlink";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import NotificationDialogComponent from "components/notification-dialog/notification-dialog.component";

import { DELAYED_TIME } from "constants/default.constants";
import { FnbUploadNoticationCampaignConstants } from "constants/ftn-upload-img-notification-campaign";
import { HYPERLINK_SELECT_OPTION } from "constants/hyperlink.constants";
import {
  ArrowDown,
  CalendarNewIconBold,
  CheckboxCheckedIcon,
  HyperlinkNotificationListIcon,
  PlusIcon,
} from "constants/icons.constants";

import {
  EnumResultCreateOrUpdate,
  ListNotificationCampaignSendByEvent,
  ListNotificationCampaignSendingType,
  NotificationCampaignSendingType,
} from "constants/notification-campaign.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { enumSendingType } from "constants/sending-type-notification-campaign";
import { DateFormat } from "constants/string.constants";
import notificationCampaignDataService from "data-services/notification-campaign/notification-campaign.service";
import debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import { getValidationMessages } from "utils/helpers";
import { Hyperlink } from "../../../../constants/hyperlink.constants";
import customerSegmentDataService from "../../../../data-services/customer-segment/customer-segment-data.service";
import "./create-notification-campaign.page.scss";

export default function CreateNotificationCampaign() {
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const reduxState = useSelector((state) => state);
  const { Text } = Typography;
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [isChangeFormGotIt, setIsChangeFormGotIt] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sendingTypeSelected, setSendingTypeSelected] = useState(ListNotificationCampaignSendingType[0]?.key);
  const [image, setImage] = useState(null);
  const [hyperlink, setHyperlink] = useState(HYPERLINK_SELECT_OPTION[0]?.id);
  const [hyperlinkSelectOptions, setHyperlinkSelectOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerSegmentInSore, setCustomerSegmentInStore] = useState([]);
  const [isAllCustomersChecked, setIsAllCustomersChecked] = useState(true);
  const [selectedCustomerSegments, setSelectedCustomerSegments] = useState({
    isShowCount: false,
    customerSegmentCount: 0,
    customerCount: 0,
  });
  const isMobile = useMediaQuery({ maxWidth: 576 });
  const [searchValue, setSearchValue] = useState("");

  const pageData = {
    btnCancel: t("button.cancel"),
    btnAddNew: t("button.create"),

    title: t("marketing.notificationCampaign.titleMessage"),
    titleCreate: t("marketing.notificationCampaign.titleCreate"),
    campaignName: t("marketing.notificationCampaign.campaignName"),
    enterCampaignName: t("marketing.notificationCampaign.enterCampaignName"),
    pleaseEnterCampaignName: t("marketing.notificationCampaign.pleaseEnterCampaignName"),
    titleEventType: t("marketing.notificationCampaign.eventType.title"),
    installTheAppEvent: t("marketing.notificationCampaign.eventType.installTheAppEvent"),
    titleSendingType: t("marketing.notificationCampaign.sendingType.title"),
    sendByEvent: t("marketing.notificationCampaign.sendingType.sendByEvent"),
    sendBySpecificTime: t("marketing.notificationCampaign.sendingType.sendBySpecificTime"),
    sendNow: t("marketing.notificationCampaign.sendingType.sendNow"),
    sendNotificationIn: t("marketing.notificationCampaign.sendNotificationIn"),
    hoursAfterTheEvent: t("marketing.notificationCampaign.hoursAfterTheEvent"),
    pleaseEnterHour: t("marketing.notificationCampaign.pleaseEnterHour"),
    message: t("marketing.notificationCampaign.message"),
    enterTitle: t("marketing.notificationCampaign.enterTitle"),
    pleaseEnterTitle: t("marketing.notificationCampaign.pleaseEnterTitle"),
    messageContent: t("marketing.notificationCampaign.messageContent"),
    enterMessageContent: t("marketing.notificationCampaign.enterMessageContent"),
    pleaseEnterContent: t("marketing.notificationCampaign.pleaseEnterContent"),
    image: t("marketing.notificationCampaign.image"),
    hyperlink: t("marketing.notificationCampaign.hyperlink"),
    pleaseSelectHyperlink: t("marketing.notificationCampaign.pleaseSelectHyperlink"),
    generalInformation: t("title.generalInformation"),
    guideline: {
      title: t("marketing.notificationCampaign.guideline.title"),
      content: t("marketing.notificationCampaign.guideline.content"),
    },
    imageSizeTooBig: "marketing.notificationCampaign.imageSizeTooBig",
    messageErrorFormat: "marketing.notificationCampaign.acceptFileImageTypes",
    date: t("marketing.notificationCampaign.date"),
    sendingTime: t("marketing.notificationCampaign.sendingTime"),
    selectDate: t("marketing.notificationCampaign.selectDate"),
    selectTime: t("marketing.notificationCampaign.selectTime"),
    pleaseSelectDate: t("marketing.notificationCampaign.pleaseSelectDate"),
    pleaseSelectStartTime: t("marketing.notificationCampaign.pleaseSelectStartTime"),
    createSuccessfullyMessage: t("marketing.notificationCampaign.createSuccessfullyMessage"),
    createIsNotSuccessfullyMessage: t("marketing.notificationCampaign.createIsNotSuccessfullyMessage"),
    pleaseInputFirebaseCredential: t("marketing.notificationCampaign.pleaseInputFirebaseCredential"),
    notyetConfigNotification: t("marketing.notificationCampaign.systemNotyetConfig"),
    pleaseSelectTimeFrameHasBecomePast: t("discountCode.formCreate.pleaseSelectTimeframeHasBecomePast"),
    media: {
      title: t("media.title"),
      textNonImage: t("media.textNonImage"),
    },
    upload: {
      addFromUrl: t("upload.addFromUrl"),
      addFile: t("upload.addFile"),
    },
    bestDisplayImage: t("messages.imageBestDisplay"),
    discardBtn: t("button.discard"),
    ignoreBtn: t("button.ignore"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("form.notificationTitle"),
      content: t("marketing.notificationCampaign.leaveForm"),
    },
    buttonIGotIt: t("form.buttonIGotIt"),
    customer: {
      allCustomers: t("marketing.notificationCampaign.customer.allCustomers"),
      selectCustomerGroups: t("marketing.notificationCampaign.customer.selectCustomerGroups"),
      selectCustomerGroupsRequiredMessage: t(
        "marketing.notificationCampaign.customer.selectCustomerGroupsRequiredMessage",
      ),
    },
  };

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    form.setFieldsValue({
      name: "",
      sendNotificationTime: 1,
      specificTime: null,
      title: "",
      content: "",
      thumbnail: "",
      hyperlinkOption: HYPERLINK_SELECT_OPTION[0]?.id,
      url: "",
      statusId: null,
      sendingTypeId: ListNotificationCampaignSendingType[0]?.key,
      event: ListNotificationCampaignSendByEvent[0]?.key,
      isAllCustomers: isAllCustomersChecked,
      customerSegmentIds: [],
    });

    setHyperlinkSelectOptions([
      HYPERLINK_SELECT_OPTION[0],
      {
        id: Hyperlink.MY_NOTIFICATION,
        name: "menuManagement.menuItem.hyperlink.notificationList",
        icon: <HyperlinkNotificationListIcon />,
      },
    ]);

    void initCustomerSegmentList();
  };

  const initCustomerSegmentList = async () => {
    const customerSegmentListResult = await customerSegmentDataService.getCustomerSegmentByStoreIdAsync();
    setCustomerSegmentInStore(customerSegmentListResult);
  };

  const countDistinctObjectInArray = (arrayDistinct, array) => {
    array?.forEach((y) => {
      if (!arrayDistinct.includes(y)) {
        arrayDistinct.push(y);
      }
    });
    return arrayDistinct;
  };

  const onUpdateCustomerSegment = (values) => {
    const selectedCustomersSegment = customerSegmentInSore?.filter((x) => values.indexOf(x.id) > -1);

    const distinctCustomers = [];
    selectedCustomersSegment?.forEach((x) => {
      if (x?.customers?.length > 0) {
        countDistinctObjectInArray(distinctCustomers, x.customers);
      }
    });

    const formGeneralTabFieldsValue = { ...form.getFieldsValue() };
    const formGeneralTabFieldsValueEdit = { ...formGeneralTabFieldsValue, customerSegmentIds: values };
    form.setFieldsValue({ formGeneralTabFieldsValueEdit });

    setSelectedCustomerSegments({
      isShowCount: values?.length > 0,
      customerSegmentCount: values?.length ?? 0,
      customerCount: distinctCustomers?.length ?? 0,
    });
  };

  const onChangeAllCustomersCheckBox = useCallback((e) => {
    setIsAllCustomersChecked(e.target.checked);
    form?.validateFields(["customerSegmentIds"])?.then()?.catch();
  }, []);

  const isAllCustomersCheckboxDisabled = useMemo(() => {
    let formValue = form?.getFieldsValue();
    let { sendingTypeId, event } = formValue;
    return (
      (sendingTypeId === 0 && event === 0) ||
      (sendingTypeId === 0 && !event) ||
      (sendingTypeSelected === 0 && event === 0) ||
      (sendingTypeSelected === 0 && !event)
    );
  }, [form?.getFieldsValue(), sendingTypeSelected]);

  const onClickCreatePage = async () => {
    setIsLoading(true);
    form
      .validateFields()
      .then(async (values) => {
        var selectDateTime = null;
        let currentDateTime = new Date();
        if (values?.sendingTypeId === enumSendingType.SendBySpecificTime) {
          selectDateTime = new Date(
            moment(values?.selectDate).year(),
            moment(values?.selectDate).month(),
            moment(values?.selectDate).date(),
            moment(values?.selectTime).hours(),
            moment(values?.selectTime).minutes(),
            moment(values?.selectTime).seconds(),
          );

          if (selectDateTime < currentDateTime) {
            message.error(pageData.pleaseSelectTimeFrameHasBecomePast);
            setIsLoading(false);
            return;
          }
        }

        let imageUrl = image?.url;
        if (!Boolean(imageUrl)) {
          imageUrl = reduxState?.session?.storeLogo;
        }

        let isAllCustomers = values?.isAllCustomers;
        if (
          (values?.sendingTypeId === ListNotificationCampaignSendingType[0]?.key &&
            values?.event === ListNotificationCampaignSendByEvent[0]?.key) ||
          (values?.sendingTypeId === ListNotificationCampaignSendingType[0]?.key && !values?.event)
        ) {
          isAllCustomers = true;
        }

        let request = {
          ...values,
          hyperlinkOption: hyperlink,
          sendingTypeId: sendingTypeSelected,
          thumbnail: imageUrl,
          specificTime: selectDateTime,
          isAllCustomers: isAllCustomers,
        };

        try {
          let res = await notificationCampaignDataService.createNotificationCampaignAsync(request);

          if (res === EnumResultCreateOrUpdate.Success) {
            message.success(pageData.createSuccessfullyMessage);
            redirectToNotificationCampaign();
          } else if (res === EnumResultCreateOrUpdate.NotFirebaseCredential) {
            redirectToNotificationCampaignGotIt();
          } else {
            message.error(pageData.createIsNotSuccessfullyMessage);
          }
          setIsLoading(false);
        } catch (errs) {
          form.setFields(getValidationMessages(errs));
          setIsLoading(false);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };
  const onDiscardGotIt = () => {
    setIsChangeFormGotIt(false);
  };

  const clickCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      redirectToNotificationCampaign();
    }
  };

  const redirectToNotificationCampaign = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      history.push("/marketing/notification-campaign");
    }, DELAYED_TIME);
  };

  const redirectToNotificationCampaignGotIt = () => {
    setIsChangeFormGotIt(true);
    setTimeout(() => {
      history.push("/marketing/notification-campaign");
    }, DELAYED_TIME);
  };

  const onChangeHyperlink = (id) => {
    setHyperlink(id);
    let formValue = form.getFieldsValue();
    formValue.url = null;
    form.setFieldsValue(formValue);
  };

  const setTime = (value) => {
    form.setFieldValue("selectTime", value);
    form.setFields([
      {
        name: "selectTime",
        errors: [],
      },
    ]);
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  /**
   * Disable Hour From Start Time
   */

  const getListPreviousHourNumberFromNow = () => {
    var hours = [];
    let formValue = form.getFieldsValue();

    let { selectDate } = formValue;
    var selectDateForUser = new Date(moment(selectDate).year(), moment(selectDate).month(), moment(selectDate).date());
    var currentDate = new Date(moment().year(), moment().month(), moment().date());
    if (selectDateForUser.toDateString() === currentDate.toDateString()) {
      for (var i = 0; i < moment().hour(); i++) {
        hours.push(i);
      }
    }
    return hours;
  };

  /**
   * Disable Hour Minute From Start Time
   * @param {*} selectedHour
   */

  const getListPreviousMinutesNumberFromNow = (selectedHour) => {
    var minutes = [];
    let formValue = form.getFieldsValue();
    let { selectDate } = formValue;
    var selectDateForUser = new Date(moment(selectDate).year(), moment(selectDate).month(), moment(selectDate).date());
    var currentDate = new Date(moment().year(), moment().month(), moment().date());
    if (selectDateForUser.toDateString() === currentDate.toDateString()) {
      if (selectedHour === moment().hour()) {
        for (var i = 0; i < moment().minute(); i++) {
          minutes.push(i);
        }
      }
    }
    return minutes;
  };

  const handleChangeSendType = (value) => {
    setSendingTypeSelected(value);
  };

  const onChangeImage = (file) => {
    setImage(file);
  };

  const renderSendByEvent = () => {
    return (
      <Row className="w-100">
        <Col sm={24} xs={24} lg={12}>
          <Form.Item
            name={"event"}
            label={pageData.titleEventType}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <FnbSelectSingle
              option={ListNotificationCampaignSendByEvent?.map((item) => ({
                id: item.key,
                name: t(item.name),
              }))}
              showSearch
            />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const renderSendBySpecificTime = () => {
    return (
      <Row className="w-100">
        <h4 className="fnb-form-label">
          {pageData.sendingTime} <span className="text-danger">*</span>
        </h4>
        <Row className="w-100">
          <Col xs={14} lg={8}>
            <Form.Item
              name={"selectDate"}
              rules={[
                {
                  required: true,
                  message: pageData.pleaseSelectDate,
                },
              ]}
            >
              <DatePicker
                suffixIcon={<CalendarNewIconBold />}
                placeholder={pageData.selectDate}
                className="fnb-date-picker w-100"
                format={DateFormat.DD_MM_YYYY}
                disabledDate={disabledDate}
              />
            </Form.Item>
          </Col>
          <Col xs={8} lg={3} className="margin-time">
            <Form.Item
              name={"selectTime"}
              rules={[
                {
                  required: true,
                  message: pageData.pleaseSelectStartTime,
                },
              ]}
            >
              <TimePicker
                className="fnb-date-picker w-100 time-clock-picker"
                dropdownClassName="fnb-date-time-picker-dropdown fnb-date-time-picker-dropdown-style"
                format={"HH:mm"}
                placeholder={pageData.selectTime}
                onSelect={(time) => {
                  setTime(moment(time, "HH:mm"));
                }}
                disabledHours={getListPreviousHourNumberFromNow}
                disabledMinutes={getListPreviousMinutesNumberFromNow}
              />
            </Form.Item>
          </Col>
        </Row>
      </Row>
    );
  };

  const renderSendingType = () => {
    switch (sendingTypeSelected) {
      case NotificationCampaignSendingType.SendByEvent:
        return renderSendByEvent();
      case NotificationCampaignSendingType.SendBySpecificTime:
        return renderSendBySpecificTime();
      default:
        return <></>;
    }
  };

  return (
    <>
      <Form
        onFinish={debounce(async () => {
          await onClickCreatePage();
        }, 1000)}
        form={form}
        onFieldsChange={() => setIsChangeForm(true)}
        layout="vertical"
        autoComplete="off"
        className="create-notification-campaign"
      >
        <Row className="fnb-row-page-header margin-bottom-title">
          <Col xs={24} sm={24} lg={14}>
            <Space className="notification-guideline-page-title">
              <h1 className="fnb-title-header">{pageData.titleCreate}</h1>
              <FnbGuideline
                placement="rightTop"
                title={pageData.guideline.title}
                content={pageData.guideline.content}
              />
            </Space>
          </Col>
          <Col xs={24} sm={24} lg={10}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!isChangeForm}
                      icon={<PlusIcon />}
                      className="fnb-add-new-button"
                      loading={isLoading}
                    >
                      {pageData.btnAddNew}
                    </Button>
                  ),
                  permission: PermissionKeys.CREATE_NOTIFICATION_CAMPAIGN,
                },
                {
                  action: (
                    <p className="fnb-text-action-group mr-3 action-cancel" onClick={clickCancel}>
                      {pageData.btnCancel}
                    </p>
                  ),
                  permission: null,
                },
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Card className="fnb-card w-100">
            <Row>
              <h3 className="label-information color-title">{pageData.generalInformation}</h3>
            </Row>
            <Row className="margin-title">
              <h4 className="fnb-form-label">
                {pageData.campaignName}
                <span className="text-danger">*</span>
              </h4>
              <Form.Item
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: pageData.pleaseEnterCampaignName,
                  },
                  {
                    type: "string",
                    max: 100,
                  },
                ]}
                className="w-100"
              >
                <Input
                  className="fnb-input-with-count"
                  showCount
                  maxLength={100}
                  placeholder={pageData.enterCampaignName}
                />
              </Form.Item>
            </Row>
            <Row>
              <Row className="w-100">
                <h4 className="fnb-form-label">{pageData.titleSendingType}</h4>
              </Row>
              <Row className="w-100">
                <Col sm={24} lg={24}>
                  <Form.Item name={"sendingTypeId"}>
                    <Radio.Group
                      onChange={(e) => handleChangeSendType(e.target.value)}
                      defaultValue={sendingTypeSelected}
                    >
                      {ListNotificationCampaignSendingType?.map((item, index) => {
                        let name = t(item?.name);
                        return (
                          <>
                            <Radio key={item?.key} value={item?.key}>
                              {name}
                            </Radio>
                            {isMobile &&
                              item?.key === NotificationCampaignSendingType.SendByEvent &&
                              sendingTypeSelected === NotificationCampaignSendingType.SendByEvent &&
                              renderSendByEvent()}
                            {isMobile &&
                              item?.key === NotificationCampaignSendingType.SendBySpecificTime &&
                              sendingTypeSelected === NotificationCampaignSendingType.SendBySpecificTime &&
                              renderSendBySpecificTime()}
                          </>
                        );
                      })}
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Row>
            <Row>{!isMobile && renderSendingType()}</Row>
            {!isAllCustomersCheckboxDisabled && (
              <>
                <Row className="w-100">
                  <Form.Item
                    name={"isAllCustomers"}
                    valuePropName="checked"
                    className="create-notification-campaign-all-customer-checkbox"
                  >
                    <Checkbox onChange={onChangeAllCustomersCheckBox} className="all-customer-checkbox">
                      {pageData.customer.allCustomers}
                    </Checkbox>
                  </Form.Item>
                </Row>
                <Row className="w-100">
                  <Col span={24} className="create-notification-campaign-section">
                    <Form.Item
                      className="select-control create-notification-campaign-multiple-selection"
                      name="customerSegmentIds"
                      validateStatus={isAllCustomersChecked ? "success" : "validating"}
                      rules={[
                        {
                          required: !isAllCustomersChecked,
                          message: pageData.customer.selectCustomerGroupsRequiredMessage,
                        },
                        {
                          validator: async () => {
                            if (!isAllCustomersChecked) {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                    >
                      <Select
                        disabled={isAllCustomersChecked}
                        getPopupContainer={(trigger) => trigger?.parentNode}
                        mode="multiple"
                        onChange={(e) => onUpdateCustomerSegment(e)}
                        className={`create-notification-campaign-select-multiple-segment dont-show-item`}
                        popupClassName="create-notification-campaign-select-multiple-dropdown"
                        suffixIcon={<ArrowDown />}
                        menuItemSelectedIcon={<CheckboxCheckedIcon />}
                        placeholder={pageData.customer.selectCustomerGroups}
                        optionFilterProp="children"
                        showArrow
                        showSearch={true}
                        allowClear={true}
                        searchValue={searchValue}
                        onSearch={(value) => {
                          setSearchValue(value);
                        }}
                        autoClearSearchValue={false}
                        onBlur={() => setSearchValue("")}
                        onInputKeyDown={(event) => {
                          if (event.key === "Backspace") {
                            return event.stopPropagation();
                          }
                        }}
                        filterOption={(input, option) =>
                          option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                        }
                        id="create-notification-campaign-select-multiple-segment"
                        maxTagCount={1}
                        tagRender={() => {
                          if (selectedCustomerSegments?.isShowCount && (!searchValue || searchValue?.length <= 0)) {
                            return (
                              <div
                                className="selected-customer-segment-count"
                                dangerouslySetInnerHTML={{
                                  __html: `${t("marketing.notificationCampaign.customer.selectedXSegmentsYCustomers", {
                                    totalSegment: selectedCustomerSegments?.customerSegmentCount,
                                    totalCustomer: selectedCustomerSegments?.customerCount,
                                  })}`,
                                }}
                              ></div>
                            );
                          }
                        }}
                      >
                        {customerSegmentInSore?.map((item) => (
                          <Select.Option key={item?.id} value={item?.id}>
                            {item?.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </Row>
        <Row className="mt-3">
          <Card className="fnb-card w-100">
            <Row>
              <h3 className="label-information color-title">{pageData.message}</h3>
            </Row>
            <Row gutter={[32, 16]} className="margin-title">
              <Col sm={24} lg={16}>
                <Row>
                  <h4 className="fnb-form-label">
                    {pageData.title}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={"title"}
                    rules={[
                      {
                        required: true,
                        message: pageData.pleaseEnterTitle,
                      },
                      {
                        type: "string",
                        max: 50,
                      },
                    ]}
                    className="w-100"
                  >
                    <Input
                      className="fnb-input-with-count"
                      showCount
                      maxLength={50}
                      placeholder={pageData.enterTitle}
                    />
                  </Form.Item>
                </Row>
                <Row>
                  <h4 className="fnb-form-label">
                    {pageData.messageContent}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={"content"}
                    className="w-100"
                    rules={[
                      {
                        required: true,
                        message: pageData.pleaseEnterContent,
                      },
                      {
                        type: "string",
                        max: 255,
                      },
                    ]}
                  >
                    <FnbTextArea
                      placeholder={pageData.enterMessageContent}
                      showCount
                      maxLength={255}
                      rows={4}
                    ></FnbTextArea>
                  </Form.Item>
                </Row>
                <Row className="w-100 select-hyperlink">
                  <h4 className="fnb-form-label">
                    {pageData.hyperlink}
                    <span className="text-danger">*</span>
                  </h4>

                  <Col sm={24} xs={24} lg={24}>
                    <Form.Item name={"hyperlinkOption"}>
                      <FnbSelectHyperlink
                        showSearch
                        fixed
                        defaultValue={hyperlink}
                        onChange={onChangeHyperlink}
                        option={hyperlinkSelectOptions}
                        className="create-notification"
                        showIcon={false}
                      ></FnbSelectHyperlink>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col sm={24} lg={8} className="margin-image">
                <h4 className="fnb-form-label">{pageData.image}</h4>
                <Row className={`non-image ${image !== null ? "have-image" : ""}`}>
                  <Col span={24} className={`image-product ${image !== null ? "justify-left" : ""}`}>
                    <div style={{ display: "flex" }}>
                      <FnbUploadImageComponent
                        buttonText={pageData.upload.addFile}
                        onChange={onChangeImage}
                        maxFileSize={1048576}
                        messageTooBigSize={pageData.imageSizeTooBig}
                        messageErrorFormat={pageData.messageErrorFormat}
                        acceptType={FnbUploadNoticationCampaignConstants.ACCEPT_TYPES}
                      />
                      <a className="upload-image-url" hidden={image !== null ? true : false}>
                        {pageData.upload.addFromUrl}
                      </a>
                    </div>
                  </Col>
                  <Col span={24} className="text-non-image" hidden={image !== null ? true : false}>
                    <Text disabled>{pageData.media.textNonImage}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Row>
      </Form>
      <NotificationDialogComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.ignoreBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={redirectToNotificationCampaign}
        isChangeForm={isChangeForm}
      />
      <NotificationDialogComponent
        className={"notification-dialog"}
        title={pageData.leaveDialog.confirmation}
        content={pageData.notyetConfigNotification}
        visible={isChangeFormGotIt}
        skipPermission={true}
        cancelText={pageData.buttonIGotIt}
        onCancel={onDiscardGotIt}
        isChangeForm={isChangeFormGotIt}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ className: "cancelButton" }}
      />
    </>
  );
}
