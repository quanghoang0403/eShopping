import { Button, Card, Checkbox, Col, Row, Space, Typography, message } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { CancelButton } from "components/cancel-button";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { Hyperlink } from "constants/hyperlink.constants";
import {
  ListNotificationCampaignSendByEvent,
  ListNotificationCampaignSendingType,
  NotificationCampaignSendingType,
  NotificationCampaignStatus,
} from "constants/notification-campaign.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import notificationCampaignDataService from "data-services/notification-campaign/notification-campaign.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import { formatDate } from "utils/helpers";
import customerSegmentDataService from "../../../../data-services/customer-segment/customer-segment-data.service";
import "./view-notification-campaign.style.scss";

const { Text } = Typography;

export default function ViewNotificationCampaignPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const [notificationCampaignData, setNotificationCampaignData] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmStop, setShowConfirmStop] = useState(false);
  const [selectedCustomerSegments, setSelectedCustomerSegments] = useState({
    isShowCount: false,
    customerSegmentCount: 0,
    customerCount: 0,
  });

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
        setNotificationCampaignData(res.notificationCampaign);
        await initCustomerSegmentList(res?.notificationCampaign?.customerSegmentIds);
      }
    }
  };

  const pageData = {
    leaveForm: t("messages.leaveForm"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnEdit: t("button.edit"),
    btnDelete: t("button.delete", "Delete"),
    btnLeave: t("button.leave", "Leave"),
    btnStop: t("button.stop"),
    okText: t("button.ok"),
    guideline: {
      title: t("marketing.notificationCampaign.guideline.title"),
      content: t("marketing.notificationCampaign.guideline.content"),
    },
    generalInformation: {
      title: t("title.generalInformation"),
      campaignName: t("notificationCampaignDetail.generalInformation.campaignName"),
      sendingType: t("notificationCampaignDetail.generalInformation.sendingType"),
      event: t("notificationCampaignDetail.generalInformation.event"),
      date: t("notificationCampaignDetail.generalInformation.date"),
      sendNotificationIn: t("notificationCampaignDetail.generalInformation.sendNotificationIn"),
      hoursAfterEvent: t("notificationCampaignDetail.generalInformation.hoursAfterEvent"),
    },
    message: {
      messageTitle: t("notificationCampaignDetail.message.messageTitle"),
      title: t("notificationCampaignDetail.message.title"),
      messageContent: t("notificationCampaignDetail.message.messageContent"),
      hyperlink: t("notificationCampaignDetail.message.hyperlink"),
      image: t("notificationCampaignDetail.message.image"),
    },
    hyperlinkOption: {
      homePage: t("menuManagement.menuItem.hyperlink.homePage"),
      notificationList: t("menuManagement.menuItem.hyperlink.notificationList"),
    },
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    button: {
      addNew: t("button.addNew"),
      filter: t("button.filter"),
      btnDelete: t("button.delete"),
      btnIgnore: t("button.ignore"),
      btnStop: t("button.stop"),
    },
    stop: t("button.stop"),
    deleteNotificationCampaignMessage: t("marketing.notificationCampaign.deleteNotificationCampaignMessage"),
    confirmStopNotificationCampaign: t("marketing.notificationCampaign.confirmStopNotificationCampaign"),
    deleteNotificationCampaignSuccess: t("marketing.notificationCampaign.deleteNotificationCampaignSuccess"),
    deleteNotificationCampaignFail: t("marketing.notificationCampaign.deleteNotificationCampaignFail"),
    stopNotificationCampaignSuccess: t("marketing.notificationCampaign.stopNotificationCampaignSuccess"),
    stopNotificationCampaignFail: t("marketing.notificationCampaign.stopNotificationCampaignFail"),
    customer: {
      allCustomers: t("marketing.notificationCampaign.customer.allCustomers"),
    },
  };

  const initCustomerSegmentList = async (customerSegmentIds) => {
    const customerSegmentListResult = await customerSegmentDataService.getCustomerSegmentByStoreIdAsync();
    void onUpdateCustomerSegment(customerSegmentIds, customerSegmentListResult);
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
    const selectedCustomersSegment = initCustomerSegmentInSore?.filter((x) => values.indexOf(x.id) > -1);

    const distinctCustomers = [];
    selectedCustomersSegment?.forEach((x) => {
      if (x?.customers?.length > 0) {
        countDistinctObjectInArray(distinctCustomers, x.customers);
      }
    });

    setSelectedCustomerSegments({
      isShowCount: values?.length > 0,
      customerSegmentCount: values?.length ?? 0,
      customerCount: distinctCustomers?.length ?? 0,
    });
  };

  const goToEditPage = () => {
    history.push(`/marketing/notification-campaign/edit/${notificationCampaignData?.id}`);
  };

  const goBack = () => {
    history.push("/marketing/notification-campaign");
  };

  const onDeleteNotificationCampaign = async (id) => {
    const res = await notificationCampaignDataService.deleteNotificationCampaignByIdAsync(id);
    if (res) {
      message.success(pageData.deleteNotificationCampaignSuccess);
    } else {
      message.error(pageData.deleteNotificationCampaignFail);
    }
    goBack();
  };

  const onStopNotificationCampaign = async (id) => {
    const res = notificationCampaignDataService.stopNotificationCampaignByIdAsync(id);
    if (res) {
      message.success(pageData.stopNotificationCampaignSuccess);
    } else {
      message.error(pageData.stopNotificationCampaignFail);
    }
    goBack();
  };

  const getNotificationHyperlink = (option) => {
    let hyperlink = "";
    if (option) {
      switch (option) {
        case Hyperlink.HOME_PAGE:
          hyperlink = pageData.hyperlinkOption.homePage;
          break;
        case Hyperlink.MY_NOTIFICATION:
          hyperlink = pageData.hyperlinkOption.notificationList;
          break;
        default:
          break;
      }
    }
    return hyperlink;
  };

  const getActionButton = () => {
    let actionButton = [
      {
        action: (
          <Button className="button-edit-qr-code" type="primary" onClick={goToEditPage}>
            {pageData.btnEdit}
          </Button>
        ),
        permission: PermissionKeys.EDIT_NOTIFICATION_CAMPAIGN,
      },
      {
        action: <CancelButton buttonText={pageData.btnLeave} onOk={goBack} />,
      },
      {
        action: (
          <Button className="button-stop-qr-code" type="link" onClick={() => setShowConfirmStop(true)}>
            {pageData.btnStop}
          </Button>
        ),
        permission: PermissionKeys.STOP_NOTIFICATION_CAMPAIGN,
      },
      {
        action: (
          <Button
            className="button-stop-qr-code button-delete-qr-code"
            type="link"
            onClick={() => setShowConfirmDelete(true)}
          >
            {pageData.btnDelete}
          </Button>
        ),
        permission: PermissionKeys.DELETE_NOTIFICATION_CAMPAIGN,
      },
    ];

    switch (notificationCampaignData?.statusId) {
      case NotificationCampaignStatus.Active:
        if (notificationCampaignData?.sendingTypeId === NotificationCampaignSendingType.SendBySpecificTime) {
          actionButton = actionButton.filter((_, i) => i !== 0 && i !== 3);
        } else {
          actionButton = actionButton.filter((_, i) => i !== 3);
        }
        break;
      case NotificationCampaignStatus.Finished:
        actionButton = actionButton.filter((_, i) => i !== 0 && i !== 2 && i !== 3);
        break;
      case NotificationCampaignStatus.Scheduled:
        actionButton = actionButton.filter((_, i) => i !== 2);
        break;
      default:
        break;
    }

    return actionButton;
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <Space className="notification-guideline-page-title">
            <h1 className="fnb-title-header">{notificationCampaignData?.name}</h1>
            <FnbGuideline placement="rightTop" title={pageData.guideline.title} content={pageData.guideline.content} />
          </Space>
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup arrayButton={getActionButton()} />
        </Col>
      </Row>

      {/* General information */}
      <Card className="fnb-card card-notification-campaign-detail">
        <div className="title-session">
          <span>{pageData.generalInformation.title}</span>
        </div>
        <Row>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.generalInformation.campaignName}</p>
              <p className="text-detail">{notificationCampaignData?.name}</p>
            </div>
          </Col>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.generalInformation.sendingType}</p>
              <p className="text-detail">
                {ListNotificationCampaignSendingType?.map((item) => {
                  if (item.key === notificationCampaignData?.sendingTypeId) {
                    return t(item.name);
                  }
                })}
              </p>
            </div>
          </Col>

          {notificationCampaignData?.sendingTypeId === NotificationCampaignSendingType.SendByEvent && (
            <Col span={24}>
              <div className="text-container">
                <p className="text-label">{pageData.generalInformation.event}</p>
                <p className="text-detail">
                  {ListNotificationCampaignSendByEvent?.map((item) => {
                    if (item.key === notificationCampaignData?.event) {
                      return t(item.name);
                    }
                  })}
                </p>
              </div>
            </Col>
          )}

          {notificationCampaignData?.sendingTypeId === NotificationCampaignSendingType.SendBySpecificTime && (
            <Col span={24}>
              <div className="text-container">
                <p className="text-label">{pageData.generalInformation.date}</p>
                <p className="text-detail">
                  {formatDate(notificationCampaignData?.specificTime, DateFormat.DD_MM_YYYY_HH_MM)}
                </p>
              </div>
            </Col>
          )}
        </Row>

        {notificationCampaignData?.sendingTypeId === NotificationCampaignSendingType.SendByEvent ? null : (
          <Col span={24} className="mb-3">
            <div>
              <Checkbox checked={notificationCampaignData?.isAllCustomers} disabled className="all-customer-checkbox">
                <Text className="fnb-form-label material-view-lable-text-color all-customer-checkbox-text">
                  {pageData.customer.allCustomers}
                </Text>
              </Checkbox>
            </div>
            {!notificationCampaignData?.isAllCustomers && selectedCustomerSegments?.isShowCount && (
              <div
                className="selected-customer-segment-count"
                dangerouslySetInnerHTML={{
                  __html: `${t("marketing.notificationCampaign.customer.selectedXSegmentsYCustomers", {
                    totalSegment: selectedCustomerSegments?.customerSegmentCount,
                    totalCustomer: selectedCustomerSegments?.customerCount,
                  })}`,
                }}
              ></div>
            )}
          </Col>
        )}
      </Card>

      {/* Message */}
      <Card className="fnb-card card-notification-campaign-detail mt-3">
        <div className="title-session">
          <span>{pageData.message.messageTitle}</span>
        </div>
        <Row>
          <Col sm={24} lg={16}>
            <Row>
              <Col span={24}>
                <div className="text-container">
                  <p className="text-label">{pageData.message.title}</p>
                  <p className="text-detail">{notificationCampaignData?.title}</p>
                </div>
              </Col>
              <Col span={24}>
                <div className="text-container">
                  <p className="text-label">{pageData.message.messageContent}</p>
                  <p className="text-detail">{notificationCampaignData?.content}</p>
                </div>
              </Col>
              <Col span={24}>
                <div className="text-container">
                  <p className="text-label">{pageData.message.hyperlink}</p>
                  <p className="text-detail">{getNotificationHyperlink(notificationCampaignData?.hyperlinkOption)}</p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col sm={24} lg={8}>
            <div className="text-container">
              <p className="text-label">{pageData.message.image}</p>
              <Thumbnail src={notificationCampaignData?.thumbnail} width={160} height={160} />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Modal stop, delete */}
      <DeleteConfirmComponent
        icon
        title={pageData.confirmStop}
        content={t(pageData.confirmStopNotificationCampaign, { name: notificationCampaignData?.name })}
        okText={pageData.button.btnStop}
        cancelText={pageData.button.btnIgnore}
        permission={PermissionKeys.STOP_NOTIFICATION_CAMPAIGN}
        skipPermission={true}
        onOk={() => onStopNotificationCampaign(notificationCampaignData?.id)}
        tooltipTitle={pageData.stop}
        onCancel={() => setShowConfirmStop(false)}
        visible={showConfirmStop}
      />

      <DeleteConfirmComponent
        className={"delete-notification-confirm"}
        skipPermission={true}
        title={pageData.confirmDelete}
        content={t(pageData.deleteNotificationCampaignMessage, { name: notificationCampaignData?.name })}
        okText={pageData.button.btnDelete}
        cancelText={pageData.button.btnIgnore}
        permission={PermissionKeys.DELETE_NOTIFICATION_CAMPAIGN}
        onOk={() => onDeleteNotificationCampaign(notificationCampaignData?.id)}
        tooltipTitle={pageData.stop}
        onCancel={() => setShowConfirmDelete(false)}
        visible={showConfirmDelete}
      />
    </>
  );
}
