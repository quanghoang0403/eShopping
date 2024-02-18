import { CloseOutlined } from "constants/icons.constants";
import { Popover, PopoverHeader, Title } from "./styled";

const PromotionPopover = (props) => {
  const { open, title, children, onCancel } = props;

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <Popover
      open={open}
      title={
        <PopoverHeader>
          <Title>{title}</Title>
          <CloseOutlined onClick={handleCancel} />
        </PopoverHeader>
      }
      onCancel={handleCancel}
      footer={null}
      closable={false}
    >
      {children}
    </Popover>
  );
};

export default PromotionPopover;
