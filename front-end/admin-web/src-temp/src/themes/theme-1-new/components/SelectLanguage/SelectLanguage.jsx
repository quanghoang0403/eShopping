import { Card } from "antd";
import { useTranslation } from "react-i18next";
import "./SelectLanguage.scss";
import { ArrowRightIcon } from "../../assets/icons.constants";

const SelectLanguage = (props) => {
  const { onClick, languages, currentLang, isMobileMode, className } = props;
  const { t } = useTranslation();

  const upperCaseString = (string) => {
    string?.toLowerCase();
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  };

  if (isMobileMode) {
    return (
      <Card onClick={onClick} className={`select-language ${className}`}>
        <span className="lang-flag">{currentLang?.flag}</span>
        <span className="lang-name">{upperCaseString(currentLang?.languageCode)}</span>
        <span className="change-icon">
          <ArrowRightIcon />
        </span>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default SelectLanguage;
