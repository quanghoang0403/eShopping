/* eslint-disable jsx-a11y/anchor-is-valid */
import { Popover } from "antd";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { setLanguageSession } from "../../../modules/session/session.actions";
import i18n from "../../../utils/i18n";
import { ArrowRightIcon, LanguageDropdownIcon } from "../../assets/icons.constants";
import "../change-language/change-language.scss";
import { listDefaultLanguage } from "./list-language";

function ChangeLanguage(props) {
  const { onVisibleChange, visible, className } = props;
  const { t } = useTranslation();
  const [defaultLanguage, setDefaultLanguage] = useState(listDefaultLanguage[0]);
  const [languageList, setLanguageList] = useState([]);
  const dispatch = useDispatch();
  const languageSession = useSelector((state) => state.session?.languageSession);
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });

  useLayoutEffect(() => {
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
    let language = listDefaultLanguage.find((lang) => lang.languageCode === defaultLanguage);
    setDefaultLanguage(language);
    dispatch(setLanguageSession({ default: language, list: listDefaultLanguage }));
  };

  const onChangeLang = (selectedLang) => {
    i18n.changeLanguage(selectedLang);

    let language = languageList?.find((lang) => lang.languageCode === selectedLang);
    setDefaultLanguage(language);
    dispatch(setLanguageSession({ default: language, list: languageList }));

    onVisibleChange && onVisibleChange(false);
  };

  const jsUcfirst = (string) => {
    string?.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const contentLanguage = () => {
    return (
      <>
        {languageList?.map((item, index) => (
          <div key={index} onClick={() => onChangeLang(item.languageCode)} className="pointer">
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
        <span className="Flag-Default-Title">{t(title)}</span>
        {!isMaxWidth575 && <LanguageDropdownIcon />}
        {isMaxWidth575 && <ArrowRightIcon className="icon-arrow-mobile" />}
      </>
    );
  };

  return (
    <Popover
      className={className}
      placement="bottom"
      overlayClassName="language-top-bar"
      content={contentLanguage}
      trigger="click"
      open={visible}
      onOpenChange={onVisibleChange && onVisibleChange}
    >
      <a className="link-language">
        {defaultLanguage && getDefaultFlag(defaultLanguage.languageCode, jsUcfirst(defaultLanguage.languageCode))}
      </a>
    </Popover>
  );
}

export default ChangeLanguage;
