import { Button } from "antd";
import { PlusIcon } from "../../assets/icons.constants";
import { capitalizeFirstLetterEachWord } from "../../../utils/helpers";
import "./fnb-add-new-button.scss";

export function FnbAddNewButton({ className, onClick, text, htmlType, disabled, hideIcon, idControl = "btn-add-new" }) {
  const renderButton = () => {
    const titleFormatted = capitalizeFirstLetterEachWord(text);
    return (
      <Button
        icon={hideIcon ? <></> : <PlusIcon />}
        className={`fnb-add-new-button ${className ?? ""}`}
        type="primary"
        onClick={onClick}
        htmlType={htmlType}
        disabled={disabled}
        id={idControl}
      >
        <span>{titleFormatted}</span>
      </Button>
    );
  };
  return <>{renderButton()}</>;
}
