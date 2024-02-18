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
} from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { FnbSelectHyperlink } from "components/fnb-select-hyperlink/fnb-select-hyperlink";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import { DELAYED_TIME } from "constants/default.constants";
import { FnbUploadNoticationCampaignConstants } from "constants/ftn-upload-img-notification-campaign";
import { HYPERLINK_SELECT_OPTION } from "constants/hyperlink.constants";
import {
  ArrowDown,
  CalendarNewIconBold,
  CheckboxCheckedIcon,
  HyperlinkNotificationListIcon,
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
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";
import { convertUtcToLocalTime } from "utils/helpers";
import { Hyperlink } from "../../../../constants/hyperlink.constants";
import customerSegmentDataService from "../../../../data-services/customer-segment/customer-segment-data.service";
import "./edit-notification-campaign.page.scss";

export default function EditNotificationCampaign(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const reduxState = useSelector((state) => state);
  const fnbImageSelectRef = React.useRef();
  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sendingTypeSelected, setSendingTypeSelected] = useState(ListNotificationCampaignSendingType[0]?.key);
  const [isChangeFormGotIt, setIsChangeFormGotIt] = useState(false);
  const [hyperlinkSelectOptions, setHyperlinkSelectOptions] = useState([
    HYPERLINK_SELECT_OPTION[0],
    {
      id: Hyperlink.MY_NOTIFICATION,
      name: "menuManagement.menuItem.hyperlink.notificationList",
      icon: <HyperlinkNotificationListIcon />,
    },
  ]);
  const [hyperlink, setHyperlink] = useState(HYPERLINK_SELECT_OPTION[0]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [customerSegmentInSore, setCustomerSegmentInStore] = useState([]);
  const [isAllCustomersChecked, setIsAllCustomersChecked] = useState(true);
  const [selectedCustomerSegments, setSelectedCustomerSegments] = useState({
    isShowCount: false,
    customerSegmentCount: 0,
    customerCount: 0,
  });
  const [searchValue, setSearchValue] = useState("");

  //Galaxy Fold2: 884, Galaxy Tab S7: 800, IpadPro 11: 834, IpadAir 4: 820
  const isTabletOrMobile = useMediaQuery({ maxWidth: 884 });

  const pageData = {
    btnCancel: t("button.cancel"),
    btnAddNew: t("button.create"),
    btnSave: t("button.save"),

    title: t("marketing.notificationCampaign.titleMessage"),
    titleEdit: t("marketing.notificationCampaign.titleEdit"),
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
    selectDate: t("marketing.notificationCampaign.selectDate"),
    selectTime: t("marketing.notificationCampaign.selectTime"),
    pleaseSelectDate: t("marketing.notificationCampaign.pleaseSelectDate"),
    pleaseSelectStartTime: t("marketing.notificationCampaign.pleaseSelectStartTime"),
    updateSuccessfullyMessage: t("marketing.notificationCampaign.updateSuccessfullyMessage"),
    updateIsNotSuccessfullyMessage: t("marketing.notificationCampaign.updateIsNotSuccessfullyMessage"),
    pleaseInputFirebaseCredential: t("marketing.notificationCampaign.pleaseInputFirebaseCredential"),
    pleaseSelectTimeFrameHasBecomePast: t("discountCode.formCreate.pleaseSelectTimeframeHasBecomePast"),
    media: {
      title: t("media.title"),
      textNonImage: t("media.textNonImage"),
    },
    upload: {
      addFromUrl: t("upload.addFromUrl"),
      addFile: t("upload.addFile"),
    },
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    notyetConfigNotification: t("marketing.notificationCampaign.systemNotyetConfig"),
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
    async function fetchData() {
      await getInitDataAsync();
    }
    fetchData();
  }, []);

  const getInitDataAsync = async () => {
    const { notificationCampaignId } = match?.params;
    if (notificationCampaignId) {
      const res = await notificationCampaignDataService.getNotificationCampaignByIdAsync(notificationCampaignId);
      if (res) {
        initData(res.notificationCampaign);
      }
    }
  };

  const initData = (value) => {
    let selectedDateToLocal = null;
    if (fnbImageSelectRef && fnbImageSelectRef.current) {
      fnbImageSelectRef.current.setImageUrl(value?.thumbnail);
      setSelectedImage(value?.thumbnail);
    }
    setSendingTypeSelected(value?.sendingTypeId);
    if (value?.specificTime) {
      selectedDateToLocal = convertUtcToLocalTime(value?.specificTime);
    }
    setHyperlink(value?.hyperlinkOption);
    form.setFieldsValue({
      name: value?.name,
      sendNotificationTime: value?.sendNotificationTime,
      specificTime: value?.specificTime,
      title: value?.title,
      content: value?.content,
      thumbnail: value?.thumbnail,
      hyperlinkOption: value?.hyperlinkOption,
      url: value?.url,
      statusId: value?.statusId,
      sendingTypeId: value?.sendingTypeId,
      event: value?.event,
      selectDate: selectedDateToLocal,
      selectTime: selectedDateToLocal,
      isAllCustomers: value?.isAllCustomers,
      customerSegmentIds: value?.customerSegmentIds,
    });
    setIsAllCustomersChecked(value?.isAllCustomers);
    void initCustomerSegmentList(value?.customerSegmentIds);
  };

  const initCustomerSegmentList = async (customerSegmentIds) => {
    const customerSegmentListResult = await customerSegmentDataService.getCustomerSegmentByStoreIdAsync();
    void onUpdateCustomerSegment(customerSegmentIds, customerSegmentListResult);
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

  const onUpdateCustomerSegment = (values, initCustomerSegmentInSore = []) => {
    let selectedCustomersSegment = customerSegmentInSore?.filter((x) => values.indexOf(x.id) > -1);
    if (!selectedCustomersSegment || selectedCustomersSegment?.length <= 0) {
      selectedCustomersSegment = initCustomerSegmentInSore?.filter((x) => values.indexOf(x.id) > -1);
    }

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
    form.validateFields().then(async (values) => {
      var selectDateTime = null;
      let currentDateTime = new Date();
      var imageUrl = "";
      if (fnbImageSelectRef && fnbImageSelectRef.current) {
        imageUrl = fnbImageSelectRef.current.getImageUrl();
      }
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
          return;
        }
      }

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
        notificationCampaign: {
          ...values,
          hyperlinkOption: hyperlink,
          sendingTypeId: sendingTypeSelected,
          thumbnail: imageUrl,
          specificTime: selectDateTime,
          id: match?.params?.notificationCampaignId,
          isAllCustomers: isAllCustomers,
        },
      };
      let res = await notificationCampaignDataService.updateNotificationCampaignAsync(request);
      if (res === EnumResultCreateOrUpdate.Success) {
        message.success(pageData.updateSuccessfullyMessage);
        redirectToNotificationCampaign();
      } else if (res === EnumResultCreateOrUpdate.NotFirebaseCredential) {
        redirectToNotificationCampaignGotIt();
      } else {
        message.error(pageData.updateIsNotSuccessfullyMessage);
      }
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

  const setTime = (value) => {
    form.setFieldValue("selectTime", value);
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
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

  const handleChangeSendType = (value) => {
    setSendingTypeSelected(value);
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
          {pageData.date} <span className="text-danger">*</span>
        </h4>
        <Row className="w-100">
          <Col xs={24} sm={13} lg={7}>
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
          <Col xs={24} sm={10} lg={4} className="margin-time">
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
                className="fnb-date-picker w-100"
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

  const renderSendingTypeMobile = (index) => {
    if (sendingTypeSelected === index) {
      switch (sendingTypeSelected) {
        case NotificationCampaignSendingType.SendByEvent:
          return renderSendByEvent();
        case NotificationCampaignSendingType.SendBySpecificTime:
          return renderSendBySpecificTime();
        default:
          return <></>;
      }
    }
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

  return (
    <>
      <Form
        onFinish={onClickCreatePage}
        form={form}
        onFieldsChange={() => setIsChangeForm(true)}
        layout="vertical"
        autoComplete="off"
        className="create-notification-campaign"
      >
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <Space className="notification-guideline-page-title">
              <h1 className="fnb-title-header">{pageData.titleEdit}</h1>
              <FnbGuideline
                placement="rightTop"
                title={pageData.guideline.title}
                content={pageData.guideline.content}
              />
            </Space>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button type="primary" htmlType="submit">
                      {pageData.btnSave}
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
              <h3 className="label-information">{pageData.generalInformation}</h3>
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
            <Row className="mt-3">
              <Row className="w-100">
                <h4 className="fnb-form-label">{pageData.titleSendingType}</h4>
              </Row>
              <Row className="w-100">
                <Col className="w-100" sm={24} lg={24}>
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
                            {isTabletOrMobile && <Row>{renderSendingTypeMobile(index)}</Row>}
                          </>
                        );
                      })}
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Row>
            {!isTabletOrMobile && <Row>{renderSendingType()}</Row>}
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
              <h3 className="label-information">{pageData.message}</h3>
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
                <Row className="mt-3">
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
                <Row className="w-100 mt-3">
                  <h4 className="fnb-form-label">
                    {pageData.hyperlink}
                    <span className="text-danger">*</span>
                  </h4>

                  <Col sm={24} xs={24} lg={24}>
                    <Form.Item name={"hyperlinkOption"}>
                      <FnbSelectHyperlink
                        showSearch
                        fixed
                        defaultValue={HYPERLINK_SELECT_OPTION[0]?.id}
                        onChange={onChangeHyperlink}
                        option={hyperlinkSelectOptions}
                      ></FnbSelectHyperlink>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col sm={24} lg={8} className="margin-image">
                <h4 className="fnb-form-label">{pageData.image}</h4>
                <FnbImageSelectComponent
                  ref={fnbImageSelectRef}
                  maxFileSize={1048576}
                  messageTooBigSize={pageData.imageSizeTooBig}
                  isShowBestDisplay={false}
                  messageErrorFormat={pageData.messageErrorFormat}
                  acceptType={FnbUploadNoticationCampaignConstants.ACCEPT_TYPES}
                />
              </Col>
            </Row>
          </Card>
        </Row>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={redirectToNotificationCampaign}
        isChangeForm={isChangeForm}
      />
      <DeleteConfirmComponent
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
