import { Card } from "antd";
import { useTranslation } from "react-i18next";
import "./SelectLanguage.scss";
import { ArrowRightIcon } from "../../assets/icons.constants";

const SelectLanguage = (props) => {
  const { onClick, currentLang, isMobileMode, className } = props;
  const { t } = useTranslation();

  if (isMobileMode) {
    return (
      <Card onClick={onClick} className={`select-language ${className}`}>
        <span className="lang-flag">{currentLang?.flag}</span>
        <span className="lang-name">{t(currentLang?.name)}</span>
        <ArrowRightIcon className="change-icon"></ArrowRightIcon>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default SelectLanguage;
