import { Card, Row } from "antd";
import { EmailIcon, GlobalIcon, PhoneNumberIcon } from "constants/icons.constants";
import deliveryConfigService from "data-services/delivery-config/delivery-config.service";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../index.scss";

export default function GrabExpressConfiguration(props) {
  const { grabDelivery } = props;
  const [t] = useTranslation();
  const pageData = {
    grabConfigText: t("deliveryMethod.grabConfigText"),
    linkWebsite:
      "https://help.grab.com/passenger/vi-vn/4403551977369-Bao-cao-chuyen-xe-giao-hang-GrabExpress-su-dung-thiet-bi-POS-can-ho-tro",
    website: "https://www.help.grab.com/",
    email: "express.vn.support@grabtaxi.com",
    hotline: "090 2341 795",
  };

  useEffect(() => {
    const getInitData = async () => {
      if (grabDelivery && !grabDelivery.deliveryConfig) {
        const requestData = {
          grabConfig: {
            deliveryMethodId: grabDelivery?.id,
          },
        };
        await deliveryConfigService.updateGrabConfigAsync(requestData);
      }
    };
    getInitData();
  }, [grabDelivery]);

  return (
    <Card className="grab-card">
      <Row className="w-100">
        <div className="grab-config-text" dangerouslySetInnerHTML={{ __html: pageData.grabConfigText }}></div>
      </Row>
      <Row className="w-100 grab-info">
        <div className="item-info-grab item-info-grab__phone">
          <PhoneNumberIcon className="icon-bottom" />
          <a href={`tel:${pageData.hotline}`}>{pageData.hotline}</a>
        </div>
        <div className="item-info-grab item-info-grab__email">
          <EmailIcon className="icon-bottom" />
          <a href={`mailto:${pageData.email}`}>{pageData.email}</a>
        </div>
        <div className="item-info-grab item-info-grab__website">
          <GlobalIcon className="icon-bottom" />
          {
            // eslint-disable-next-line react/jsx-no-target-blank
            <a href={pageData.linkWebsite} target="_blank">
              {pageData.website}
            </a>
          }
        </div>
      </Row>
    </Card>
  );
}
