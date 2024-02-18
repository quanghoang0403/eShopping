import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import "./ListLanguage.scss";
import { ArrowRightLanguageIcon } from "../../assets/icons.constants";
import i18n from "../../../utils/i18n";

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
        <ArrowRightLanguageIcon className="list-language-title-icon" />
        <span className="list-language-title-text">{translateData.language}</span>
      </div>
      <ul>
        {languages.map((lang, index) => (
          <li key={index} onClick={() => onClick && onClick(lang)}>
            <span className="lang-flag">{lang?.flag}</span>
            <span style={languageSelected == lang.languageCode ? { color: "#026F30" } : {}} className="lang-name">
              {lang?.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListLanguage;
