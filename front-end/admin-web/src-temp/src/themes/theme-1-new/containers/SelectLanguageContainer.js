import { useEffect } from "react";
import { useState } from "react";
import i18n from "../../utils/i18n";
import SelectLanguage from "../components/SelectLanguage/SelectLanguage";
import ListLanguage from "../components/ListLanguage/ListLanguage";
import { listDefaultLanguage } from "../components/change-language/list-language";
import { useDispatch } from "react-redux";
import { setLanguageSession } from "../../modules/session/session.actions";

const SelectLanguageContainer = (props) => {
  const { className = '' } = props;
  const [languageSelected, setLanguageSelected] = useState(i18n.language);
  const [isShowListLanguage, setIsShowListLanguage] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const lang = listDefaultLanguage.find((i) => i.languageCode === i18n.language) ?? listDefaultLanguage[0];
    setLanguageSelected(lang);
    dispatch(setLanguageSession({ default: lang, list: listDefaultLanguage }));
  }, []);

  function handleClickSelectLanguage() {
    setIsShowListLanguage(true);
  }

  function handleChooseLanguage(lang) {
    setLanguageSelected(lang);
    i18n.changeLanguage(lang.languageCode);
    setIsShowListLanguage(false);
    document.body.classList.remove("disable-scroll");
  }

  return (
    <>
      <SelectLanguage
        onClick={handleClickSelectLanguage}
        languages={listDefaultLanguage}
        currentLang={languageSelected}
        isMobileMode={true}
        className={className}
      />
      {isShowListLanguage && (
        <ListLanguage
          languages={listDefaultLanguage}
          onClick={handleChooseLanguage}
          onCancel={() => setIsShowListLanguage(false)}
        />
      )}
    </>
  );
};

export default SelectLanguageContainer;
