import { Image, Modal } from "antd";
import parse from "html-react-parser";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "../../../../../assets/icons.constants";
import DefaultArea from "../../../../../assets/images/default-area.png";
import "./ReserveAreaModal.scss";
import styled from "styled-components";

const ReserveAreaModal = (props) => {
  const { open, onCancel, data } = props;
  const [t] = useTranslation();

  const pageData = {
    description: t("reserveTable.description"),
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const renderDescription = useMemo(() => {
    if (data?.description) {
      return parse(data?.description);
    }
  }, [data?.description]);


  const StyledDescription = styled.div`
    span {
      font-family: unset !important;
    }
    li {
      font-family: unset !important;
    }
  `;

  return (
    <Modal
      open={open}
      title={
        <div className="reserve-modal-table">
          <span className="title">{data?.name}</span>
          <div className="button" onClick={handleCancel}>
            <CloseIcon />
          </div>
        </div>
      }
      onCancel={handleCancel}
      footer={null}
      closable={false}
      transitionName={null}
      wrapClassName="reserve-area-popover-class-name-overwrite"
      className="reserve-modal-table"
    >
      <div className="reserve-area-table-body">
        <Image className="image" preview={false} src={data?.imageUrl || DefaultArea} alt={data?.name || ""} />
        <div className="information">
          <span className="detail">{pageData.description}</span>
        </div>
        <StyledDescription>
          {renderDescription}
        </StyledDescription>
      </div>
    </Modal>
  );
};

export default ReserveAreaModal;
