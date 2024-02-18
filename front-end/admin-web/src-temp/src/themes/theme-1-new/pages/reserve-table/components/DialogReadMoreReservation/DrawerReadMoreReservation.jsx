import { useTranslation } from "react-i18next";
import "./DialogReadMoreReservation.style.scss";
import { Image, Row, Typography } from "antd";
import BoxDrawer from "../../../order/components/BoxDrawer";
import {
    CloseIcon
  } from "../../../../assets/icons.constants";
export default function DrawerReadMoreReservation(props) {
  const { 
    visible, 
    onClose = () => {}, 
    title, 
    description, 
    avatar, 
    numberOfSeat, 
} = props;
  const { Title } = Typography;
  const { t } = useTranslation();
  const pageData = {
    descriptionDetail: t("reserve.descriptionDetail", "Description Detail"),
    seat: t("reserve.seat", "Seat"),
    people: t("reserve.people", "people"),
  };

  const titleContent = (
    <div className="content-center">
      <Title level={4} className="title">
        {title}:
      </Title>
    </div>
  );

  const divContent = (
    <>
          <Row justify={"center"}>
            {avatar && (<Image className="readmore-image" src={avatar}></Image>)}
          </Row>
          <Row>
            <Title level={4} className="title-detail-description">
              {t(pageData.descriptionDetail)}:
            </Title>
          </Row>
          <Row>
            {numberOfSeat && (
              <Title level={5} className="title-seats">
                {`${t(pageData.seat)}: ${numberOfSeat} ${t(
                  pageData.people.toLocaleLowerCase(),
                )}`}
              </Title>
            )}
          </Row>
          <div className="readmore-content" dangerouslySetInnerHTML={{ __html: description }}></div>
        </>
  );
  return (
    <BoxDrawer
      closeIcon={<CloseIcon />}
      closable={true}
      className="box-drawer-readmore"
      title={titleContent}
      open={visible}
      height={"85vh"}
      onClose={onClose}
      forceRender={true}
      destroyOnClose={true}
      body={divContent}
      maskStyle={{
        background: 'rgba(0, 0, 0, 0.80)'
      }}
    />
  );
}
