import { Switch } from "antd";
import "./SwitchButton.scss";

export default function SwitchButton(props) {
  const { onClick, isActiveAvailablePoint, isLoadingSwitchExchangePoint } = props;

  return (
    <>
      <Switch
        loading={isLoadingSwitchExchangePoint}
        className="switch-button"
        checked={isActiveAvailablePoint}
        onClick={onClick}
      />
    </>
  );
}
