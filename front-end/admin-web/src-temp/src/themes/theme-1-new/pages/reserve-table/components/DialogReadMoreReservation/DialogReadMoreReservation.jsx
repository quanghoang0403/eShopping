import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import "./DialogReadMoreReservation.style.scss";
import { Image, Row, Typography } from "antd";

export default function DialogReadMoreReservation(props) {
  const { visible, onCancel, title, description, avatar, numberOfSeat } = props;
  const { Title } = Typography;

  const { t } = useTranslation();
  const pageData = {
    descriptionDetail: t("reserve.descriptionDetail", "Description Detail"),
    seat: t("reserve.seat", "Seat"),
    people: t("reserve.people", "people"),
  };

  const titleContent = (
    <Title level={4} className="title">
      {title}:
    </Title>
  );

  const divContent = (
    <div className="reservation-readmore">
      <Row justify={"center"}>
        <Image
          className="readmore-image"
          src={avatar}
        ></Image>
      </Row>
      <Row>
        <Title level={4} className="title-detail-description">
          {t(pageData.descriptionDetail)}:
        </Title>
      </Row>
      <Row>
        {numberOfSeat && (
          <Title level={5} className="title-seats">
            {`${t(pageData.seat)}: ${numberOfSeat} ${t(pageData.people.toLocaleLowerCase())}`}
          </Title>
        )}
      </Row>
      <div className="readmore-content" dangerouslySetInnerHTML={{ __html: description }}></div>
    </div>
  );

  return (
      <Modal
        closable={true}
        className="readmore-dialog-body"
        open={visible}
        onCancel={onCancel}
        footer={(null, null)}
        title={titleContent}
        style={{ borderRadius: 16 }}
        wrapClassName="readmore-dialog"
        maskStyle={{
          background: 'rgba(0, 0, 0, 0.80)'
        }}
      >
        {divContent}
      </Modal>
  );
}
