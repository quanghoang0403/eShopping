import { Card, Col, Row, Space } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import TableNotificationCampaign from "./components/table-notification-campaign.component";
import "./notification-campaign.page.scss";
export function NotificationCampaign(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const notificationCampaignCreateLink = "/marketing/notification-campaign/create-notification-campaign";

  const pageData = {
    title: t("marketing.notificationCampaign.title"),
    addNew: t("button.addNew"),
    guideline: {
      title: t("marketing.notificationCampaign.guideline.title"),
      content: t("marketing.notificationCampaign.guideline.content"),
    },
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} xl={12}>
          <Space className="page-title">
            <h1 className="fnb-title-header">{pageData.title}</h1>
            <FnbGuideline placement="rightTop" title={pageData.guideline.title} content={pageData.guideline.content} />
          </Space>
        </Col>
        <Col xs={24} sm={24} xl={12} className="button-box product-filter-box page-action-group">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <FnbAddNewButton
                    permission={PermissionKeys.CREATE_NOTIFICATION_CAMPAIGN}
                    onClick={() => history.push(notificationCampaignCreateLink)}
                    text={pageData.addNew}
                  />
                ),
                permission: PermissionKeys.CREATE_NOTIFICATION_CAMPAIGN,
              },
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Card className="fnb-card cart-with-no-border">
        <TableNotificationCampaign />
      </Card>
    </>
  );
}
