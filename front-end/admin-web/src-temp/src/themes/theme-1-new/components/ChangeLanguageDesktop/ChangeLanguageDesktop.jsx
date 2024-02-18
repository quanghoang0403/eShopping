import ChangeLanguage from "../change-language/change-language.component";
import "./ChangeLanguageDesktop.scss";

const ChangeLanguageDesktop = () => {
  return (
    <div className="change-language-desktop">
      <div className="header-language">
        <span className="header-rectangle"></span>
        <ChangeLanguage />
      </div>
    </div>
  );
};

export default ChangeLanguageDesktop;
