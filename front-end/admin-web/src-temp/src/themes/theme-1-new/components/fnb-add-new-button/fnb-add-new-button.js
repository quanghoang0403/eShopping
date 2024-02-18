import { Button, Spin } from "antd";
import { capitalizeFirstLetterEachWord } from "../../../utils/helpers";
import { PlusIcon } from "../../assets/icons.constants";
import "./fnb-add-new-button.scss";
export function FnbAddNewButton({
  className,
  onClick,
  text,
  htmlType,
  disabled,
  hideIcon,
  isNormal = false,
  idControl = "btn-add-new",
  loading = false,
}) {
  const renderButton = () => {
    const titleFormatted = !isNormal ? capitalizeFirstLetterEachWord(text) : text;
    return hideIcon ? (
      <>
        <Button
          className={`fnb-add-new-button ${className ?? ""}`}
          type=""
          onClick={onClick}
          htmlType={htmlType}
          disabled={disabled || loading}
          id={idControl}
        >
         <span>{titleFormatted}</span>
        </Button>
      </>
    ) : (
      <Button
        icon={<PlusIcon />}
        className={`fnb-add-new-button ${className ?? ""}`}
        type=""
        onClick={onClick}
        htmlType={htmlType}
        disabled={disabled || loading}
        id={idControl}
      >
        <span>{titleFormatted}</span>
      </Button>
    );
  };
  return <>{renderButton()}</>;
}
