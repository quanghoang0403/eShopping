import { Popover } from "antd";
import Flags from "country-flag-icons/react/1x1";
import languageDataService from "data-services/language/language-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import languageService from "services/language/language.service";
import i18n from "utils/i18n";
import { setLanguageSession } from "./../../store/modules/session/session.actions";
import { CaretDownIcon } from "constants/icons.constants";
import "./change-language.scss";

function ChangeLanguage(props) {
  const { t } = useTranslation();
  const [defaultLanguage, setDefaultLanguage] = useState(null);
  const [languageList, setLanguageList] = useState([]);
  const dispatch = useDispatch();
  const languageSession = useSelector((state) => state.session?.languageSession);

  useEffect(() => {
    if (!languageSession) {
      loadLanguage();
      window.reloadLang = loadLanguage;
    } else {
      setDefaultLanguage(languageSession.default);
      setLanguageList(languageSession.list);
    }
  }, []);

  const loadLanguage = () => {
    languageDataService.getListLanguageByStoreIdAndIsPublishAsync().then((jsonObject) => {
      setLanguageList(jsonObject.languages);

      let defaultLanguageCode = languageService.getLang();
      let language = jsonObject.languages.find((lang) => lang.languageCode === defaultLanguageCode);
      setDefaultLanguage(language);
      dispatch(setLanguageSession({ default: language, list: jsonObject.languages }));
    });
  };

  const onChangeLang = (selectedLang) => {
    languageService.setLang(selectedLang);
    i18n.changeLanguage(selectedLang);

    let language = languageList?.find((lang) => lang.languageCode === selectedLang);
    setDefaultLanguage(language);
    dispatch(setLanguageSession({ default: language, list: languageList }));
    props.showAndHideLanguageBox(false);
  };

  const contentLanguage = () => {
    return (
      <>
        {languageList?.map((item, index) => (
          <div key={index} className="change-language-option" onClick={() => onChangeLang(item.languageCode)}>
            {getFlag(item.emoji, item.name)}
            <span>{t(item.name)}</span>
          </div>
        ))}
      </>
    );
  };

  const getFlag = (languageCode, title) => {
    var Flag = Flags[languageCode];
    return <Flag title={t(title)} className="country-flag" />;
  };

  const getDefaultFlag = (languageCode, title) => {
    var Flag = Flags[languageCode];
    return (
      <>
        <Flag title={t(title)} className="country-flag" />
        <span>{t(title)}</span>
        <CaretDownIcon className="arrow-down" />
      </>
    );
  };

  return (
    <Popover
      trigger="hover"
      placement="bottom"
      overlayClassName="change-language-popover"
      content={contentLanguage}
      visible={props.visible}
      onVisibleChange={props.showAndHideLanguageBox}
    >
      <div className="admin-link-language">
        {defaultLanguage && getDefaultFlag(defaultLanguage.emoji, defaultLanguage.name)}
      </div>
    </Popover>
  );
}

export default ChangeLanguage;
