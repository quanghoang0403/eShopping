import ChangeLanguage from "../change-language/change-language.component";
import "./ChangeLanguageDesktop.scss";

const ChangeLanguageDesktop = (props) => {
  const { overlayClassName } = props;
  return (
    <div className="change-language-desktop">
      <div className="header-language">
        <ChangeLanguage {...props} overlayClassName={overlayClassName} />
      </div>
    </div>
  );
};

export default ChangeLanguageDesktop;
