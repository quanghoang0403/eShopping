import { Button } from "antd";
import { useTranslation } from "react-i18next";

function ChangeLoginModeButton({ isLoginWithPassword, onClick }) {
  const { t } = useTranslation();

  const displayText = !isLoginWithPassword ? t("loginByPassword") : t("loginByOTP");
  return (
    <Button type="link" className="pointer" onClick={onClick}>
      {displayText}
    </Button>
  );
}

export default ChangeLoginModeButton;
