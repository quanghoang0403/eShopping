import { Image, Modal } from "antd";
import parse from "html-react-parser";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "../../../../../assets/icons.constants";
import DefaultAreaTable from "../../../../../assets/images/default-area-table.png";
import "./ReserveAreaTableModal.scss";
import styled from "styled-components";

const ReserveAreaTableModal = (props) => {
  const { open, onCancel, data } = props;
  const [t] = useTranslation();

  const pageData = {
    detailDescription: t("reserveTable.detailDescription"),
    seats: t("reserveTable.seats"),
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
      wrapClassName="reserve-popover-class-name-overwrite"
      className="reserve-modal-table"
    >
      <div className="reserve-area-table-body">
        <Image className="image" preview={false} src={data?.imageUrl || DefaultAreaTable} alt={data?.name || ""} />
        <div className="information">
          <span className="detail">{pageData.detailDescription}</span>
          <span className="seats">
            {pageData.seats}: {data?.numberOfSeat}
          </span>
        </div>
        <StyledDescription>
          {renderDescription}
        </StyledDescription>
      </div>
    </Modal>
  );
};

export default ReserveAreaTableModal;
