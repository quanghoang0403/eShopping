import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import "../change-language/change-language.scss";
import { setLanguageSession } from "../../../modules/session/session.actions";
import i18n from "../../../utils/i18n";
import { listDefaultLanguage } from "./list-language";

function ChangeLanguageMobile(props) {
  const { onVisibleChange, visible } = props;
  const { t } = useTranslation();
  const [defaultLanguage, setDefaultLanguage] = useState(listDefaultLanguage[0]);
  const [languageList, setLanguageList] = useState([]);
  const dispatch = useDispatch();
  const languageSession = useSelector((state) => state.session?.languageSession);

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
    let language = listDefaultLanguage.find((lang) => lang.languageCode === defaultLanguage);
    setDefaultLanguage(language);
    dispatch(setLanguageSession({ default: language, list: listDefaultLanguage }));
  };

  const onChangeLang = (selectedLang) => {
    i18n.changeLanguage(selectedLang);

    let language = languageList?.find((lang) => lang.languageCode === selectedLang);
    setDefaultLanguage(language);
    dispatch(setLanguageSession({ default: language, list: languageList }));
    document.removeEventListener("touchmove", preventDefault, { passive: false });
    onVisibleChange(false);
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

  return (
    <>
      <div>{contentLanguage()}</div>
    </>
  );
}

export default ChangeLanguageMobile;
