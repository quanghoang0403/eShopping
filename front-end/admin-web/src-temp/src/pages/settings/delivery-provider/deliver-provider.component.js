import { Card, Col, Image, Radio, Row, Switch, Typography } from "antd";
import { EnumDeliveryMethod } from "constants/delivery-method.constants";
import { AhaMoveIcon, Delivery, GrabExpress, ShopDelivery } from "constants/icons.constants";
import deliveryMethodService from "data-services/delivery-method/delivery-method.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AhaMoveConfiguration from "./component/ahamove-config.component";
import GrabExpressConfiguration from "./component/grab-express-config.component";
import SelfDeliveryConfigComponent from "./component/self-delivery-config.component";
import "./index.scss";
const { Text } = Typography;

export default function DeliveryProvider(props) {
  const [t] = useTranslation();
  const pageData = {
    title: t("deliveryMethod.title"),
    titleLowerCase: t("deliveryMethod.titleLowerCase"),
    textSelfDelivery: t("deliveryMethod.titleSelfDelivery"),
    textAhaMove: t("deliveryMethod.titleAhaMove"),
    textGrabExpress: t("deliveryMethod.titleGrabExpress"),
  };
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [selfDelivery, setSelfDelivery] = useState(null);
  const [ahaMoveDelivery, setAhaMoveDelivery] = useState(null);
  const [grabDelivery, setGrabDelivery] = useState(null);
  const [isCheckedSelfDelivery, setIsCheckedSelfDelivery] = useState(false);
  const [keyDeliveryMethod, setKeyDeliveryMethod] = useState(null);

  useEffect(() => {
    getInitFormData(EnumDeliveryMethod.SelfDelivery);
  }, []);

  const getInitFormData = async (keyDelivery) => {
    let res = await deliveryMethodService.getDeliveryMethodsAsync();
    if (res && res?.deliveryMethods.length > 0) {
      let selfDelivery = res?.deliveryMethods.find((item) => item.enumId === EnumDeliveryMethod.SelfDelivery);
      let ahaMoveDelivery = res.deliveryMethods.find((item) => item.enumId === EnumDeliveryMethod.AhaMove);
      let grabDelivery = res.deliveryMethods.find((item) => item.enumId === EnumDeliveryMethod.GrabExpress);
      setSelfDelivery(selfDelivery);
      setAhaMoveDelivery(ahaMoveDelivery);
      setGrabDelivery(grabDelivery);
      const deliveryMethodList = [
        {
          key: EnumDeliveryMethod.SelfDelivery,
          checked: selfDelivery?.deliveryConfig != null ? selfDelivery?.deliveryConfig?.isActivated : false,
        },
        {
          key: EnumDeliveryMethod.AhaMove,
          checked: ahaMoveDelivery?.deliveryConfig != null ? ahaMoveDelivery?.deliveryConfig?.isActivated : false,
        },
        {
          key: EnumDeliveryMethod.GrabExpress,
          checked: grabDelivery?.deliveryConfig != null ? grabDelivery?.deliveryConfig?.isActivated : false,
        },
      ];
      setIsCheckedSelfDelivery(deliveryMethodList[0]?.checked);
      setDeliveryMethods(deliveryMethodList);
      setKeyDeliveryMethod(keyDelivery);
    }
  };

  const onChangeStatusDeliveryMethod = async (checked, key) => {
    let req = {
      id: key,
      isActivated: checked,
    };
    let res = await deliveryMethodService.updateStatusDeliveryMethodByIdAsync(req);
    if (res && key === EnumDeliveryMethod.SelfDelivery) {
      setIsCheckedSelfDelivery(checked);
    }
  };

  const renderIconDelivery = (dvm) => {
    switch (dvm?.key) {
      case EnumDeliveryMethod.SelfDelivery:
        return <ShopDelivery />;
      case EnumDeliveryMethod.AhaMove:
        return <AhaMoveIcon />;
      case EnumDeliveryMethod.GrabExpress:
        return <GrabExpress width="88" height="88" />;
      default:
        return <></>;
    }
  };

  const renderDeliveryMethod = () => {
    return (
      <>
        <Card className="mobile-delivery-method-name-config">{pageData.titleLowerCase}</Card>
        <Radio.Group
          defaultValue={EnumDeliveryMethod.SelfDelivery}
          onChange={(e) => setKeyDeliveryMethod(e?.target?.value)}
          buttonStyle="solid"
          style={{ display: "inline-grid", width: "100%" }}
        >
          {deliveryMethods?.map((dvm) => {
            return (
              <>
                <Radio.Button value={dvm.key} className="mt-3 pt-4 item-method">
                  <Row>
                    <Col xl={20} lg={21} md={21} sm={21} xs={21}>
                      <div className="delivery-method-icon">{renderIconDelivery(dvm)}</div>
                      <Text className="delivery-method-text">
                        {dvm.key == EnumDeliveryMethod.SelfDelivery
                          ? pageData.textSelfDelivery
                          : dvm.key == EnumDeliveryMethod.AhaMove
                          ? pageData.textAhaMove
                          : pageData.textGrabExpress}
                      </Text>
                    </Col>
                    <Col xl={4} lg={3} md={3} sm={3} xs={2} className="col-switch">
                      <Switch
                        defaultChecked={dvm?.checked}
                        size="default"
                        className="float-right mr-3"
                        onChange={(checked) => onChangeStatusDeliveryMethod(checked, dvm?.key)}
                      />
                    </Col>
                  </Row>
                </Radio.Button>
                {renderDeliveryMethodConfig(keyDeliveryMethod, dvm.key)}
              </>
            );
          })}
        </Radio.Group>
      </>
    );
  };

  const renderDeliveryMethodConfig = (keyMethod, dvmKey) => {
    return (
      <Col xl={0} lg={24} md={24} className="mobile-card-config">
        <span>
          {keyMethod === dvmKey && keyMethod === EnumDeliveryMethod.SelfDelivery ? (
            <Card className="mobile-card-config-delivery">
              <SelfDeliveryConfigComponent
                isCheckedSelfDelivery={isCheckedSelfDelivery}
                selfDelivery={selfDelivery}
                reLoadFormData={getInitFormData}
              />
            </Card>
          ) : keyMethod === dvmKey && keyMethod === EnumDeliveryMethod.AhaMove ? (
            <Card className="mobile-card-config-delivery">
              <AhaMoveConfiguration ahaMoveDelivery={ahaMoveDelivery} reLoadFormData={getInitFormData} />
            </Card>
          ) : keyMethod === dvmKey && keyMethod === EnumDeliveryMethod.GrabExpress ? (
            <Card className="mobile-card-config-delivery">
              <GrabExpressConfiguration grabDelivery={grabDelivery}></GrabExpressConfiguration>
            </Card>
          ) : (
            <></>
          )}
        </span>
      </Col>
    );
  };

  return (
    <Row gutter={[0, { xs: 8, sm: 24, md: 24, lg: 32 }]}>
      <Col xl={8} lg={24} md={24} style={{ width: "100%" }}>
        <Card className="delivery-method">
          <Row className="delivery-method-title">
            <Col span={3} className="delivery-method-title-icon">
              <Delivery />
            </Col>
            <Col className="delivery-method-title-name" span={21}>
              {pageData.titleLowerCase}
            </Col>
          </Row>
          {renderDeliveryMethod()}
        </Card>
      </Col>
      <Col xl={16} lg={24} md={24} className="desktop-card-config">
        <Card className="delivery-method-name-config">{pageData.titleLowerCase}</Card>
        {keyDeliveryMethod === EnumDeliveryMethod.SelfDelivery ? (
          <SelfDeliveryConfigComponent
            isCheckedSelfDelivery={isCheckedSelfDelivery}
            selfDelivery={selfDelivery}
            reLoadFormData={getInitFormData}
          />
        ) : keyDeliveryMethod === EnumDeliveryMethod.AhaMove ? (
          <AhaMoveConfiguration ahaMoveDelivery={ahaMoveDelivery} reLoadFormData={getInitFormData} />
        ) : (
          <GrabExpressConfiguration grabDelivery={grabDelivery}></GrabExpressConfiguration>
        )}
      </Col>
    </Row>
  );
}
