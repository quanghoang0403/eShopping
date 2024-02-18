import { useTranslation } from "react-i18next";
import React from "react";
import "./ListLanguage.scss";
import { ArrowLeftIcon, CheckLanguage } from "../../assets/icons.constants";
import i18n from "../../../utils/i18n";
import { useState } from "react";

function ListLanguage(props) {
  const { languages, onClick, onCancel } = props;
  const [languageSelected] = useState(i18n.language);
  const { t } = useTranslation();

  const translateData = {
    language: t("language.title", "Ngôn ngữ"),
  };

  return (
    <div className="list-language">
      <div className="list-language-title" onClick={onCancel}>
        <ArrowLeftIcon />
        <span className="list-language-title-text">{translateData.language}</span>
      </div>
      <ul>
        {languages.map((lang, index) => (
          <li key={index} onClick={() => onClick && onClick(lang)}>
            <span className="lang-flag">{lang?.flag}</span>
            <span className="lang-name">{t(lang?.name)}</span>
            {languageSelected === lang.languageCode && <CheckLanguage className="check-language"></CheckLanguage>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListLanguage;
