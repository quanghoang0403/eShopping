import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Popover } from "antd";
import { useTranslation } from "react-i18next";
import "../change-language/change-language.scss";
import { setLanguageSession } from "../../../modules/session/session.actions";
import i18n from "../../../utils/i18n";
import { listDefaultLanguage } from "./list-language";
import { ArrowRightIcon, LanguageDropdownIcon } from "../../assets/icons.constants";
import { useMediaQuery } from "react-responsive";

function ChangeLanguage(props) {
  const { onVisibleChange, visible, className, overlayClassName, fontFamily } = props;
  const { t } = useTranslation();
  const [defaultLanguage, setDefaultLanguage] = useState(listDefaultLanguage[0]);
  const [languageList, setLanguageList] = useState([]);
  const dispatch = useDispatch();
  const languageSession = useSelector((state) => state.session?.languageSession);
  const isMaxWidth640 = useMediaQuery({ maxWidth: 640 });

  useEffect(() => {
    if (!languageSession) {
      loadLanguage();
      window.reloadLang = loadLanguage;
    } else {
      setDefaultLanguage(languageSession.default ?? listDefaultLanguage[0]);
      setLanguageList(languageSession.list);
    }
  }, []);

  const loadLanguage = () => {
    setLanguageList(listDefaultLanguage);
    let language = listDefaultLanguage.find((lang) => lang.languageCode === defaultLanguage?.languageCode);
    setDefaultLanguage(language);
    dispatch(setLanguageSession({ default: language, list: listDefaultLanguage }));
  };

  const onChangeLang = (selectedLang) => {
    i18n.changeLanguage(selectedLang);

    let language = languageList?.find((lang) => lang.languageCode === selectedLang);
    setDefaultLanguage(language);
    dispatch(setLanguageSession({ default: language, list: languageList }));
  };

  const jsUcfirst = (string) => {
    return string?.toUpperCase();
  };

  const contentLanguage = () => {
    return (
      <>
        {languageList?.map((item, index) => (
          <div key={index} onClick={() => onChangeLang(item.languageCode)} className="pointer" style= {{fontFamily: fontFamily}}>
            {getFlag(item.languageCode, item.name)}
            <a>{t(item.name)}</a>
          </div>
        ))}
      </>
    );
  };

  const getFlag = (languageCode) => {
    var Flag = listDefaultLanguage?.find((lang) => lang.languageCode === languageCode);
    return <>{Flag?.flag}</>;
  };

  const getDefaultFlag = (languageCode, title) => {
    var Flag = listDefaultLanguage?.find((lang) => lang.languageCode === languageCode);
    return (
      <>
        <div className="Flag-Default">{Flag?.flag}</div>
        <span className="language-text" style={{minWidth: 30, textAlign: 'end'}}>{t(title)}</span> 
        {!isMaxWidth640 && <LanguageDropdownIcon className="link-language-icon-desktop"/>}
        {isMaxWidth640 && <ArrowRightIcon className="link-language-icon-mobile" />}
      </>
    );
  };

  return (
    <Popover
      className={className}
      placement="bottom"
      overlayClassName={`language-top-bar ${overlayClassName}`}
      content={contentLanguage}
      trigger="click"
      open={visible}
      onOpenChange={onVisibleChange}
    >
      <a className="link-language">
        {defaultLanguage && getDefaultFlag(defaultLanguage.languageCode, jsUcfirst(defaultLanguage.languageCode))}
      </a>
    </Popover>
  );
}

export default ChangeLanguage;
