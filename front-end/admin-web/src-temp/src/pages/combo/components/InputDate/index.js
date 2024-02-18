import { DatePicker } from "antd";
import { AllowClear, Container, PanelContainer } from "./styled";
import { useTranslation } from "react-i18next";
import { CalendarIcon, CloseFill } from "constants/icons.constants";
import moment from "moment";
import "moment/min/locales";
import "moment/locale/vi";
import "moment/locale/ja";
import localeEn from "antd/es/date-picker/locale/en_US";
import localeVi from "antd/es/date-picker/locale/vi_VN";
import localeJa from "antd/es/date-picker/locale/ja_JP";
import { useSelector } from "react-redux";
import { languageCodeSelector } from "store/modules/session/session.reducers";
import { LanguageCodeEnum } from "constants/string.constants";

const DEFAULT_FORMAT_DATE = "DD/MM/YYYY";
const DEFAULT_PLACEHOLDER_DATE = "dd/mm/yyyy";

const InputDate = (props) => {
  const { formatDate = DEFAULT_FORMAT_DATE, disabledDate, onChange, value, disabled } = props;
  const [t] = useTranslation();
  const languageCode = useSelector(languageCodeSelector);

  const pageData = {
    january: t("optionDatetime.january"),
    february: t("optionDatetime.february"),
    march: t("optionDatetime.march"),
    april: t("optionDatetime.april"),
    may: t("optionDatetime.may"),
    june: t("optionDatetime.june"),
    july: t("optionDatetime.july"),
    august: t("optionDatetime.august"),
    september: t("optionDatetime.september"),
    october: t("optionDatetime.october"),
    november: t("optionDatetime.november"),
    december: t("optionDatetime.december"),
  };

  const monthsShort = [
    pageData.january,
    pageData.february,
    pageData.march,
    pageData.april,
    pageData.may,
    pageData.june,
    pageData.july,
    pageData.august,
    pageData.september,
    pageData.october,
    pageData.november,
    pageData.december,
  ];

  const updateLocale = (lang) => {
    switch (lang) {
      case LanguageCodeEnum.En:
      case LanguageCodeEnum.Vi:
        moment.locale(lang, { monthsShort: monthsShort });
        break;
      default:
        break;
    }
  };

  const getLocale = (lang) => {
    updateLocale(lang);
    switch (lang) {
      case LanguageCodeEnum.Vi:
        return localeVi;
      case LanguageCodeEnum.Ja:
        return localeJa;
      default:
        return localeEn;
    }
  };

  const handleOnChange = (date, dateString) => {
    onChange && onChange(date, dateString);
  };

  const panelRender = (panelNode) => {
    return <PanelContainer>{panelNode}</PanelContainer>;
  };

  const getDateValue = (dateValue) => {
    return moment(dateValue, formatDate).isValid() ? moment(dateValue, formatDate) : undefined;
  };

  return (
    <Container>
      <DatePicker
        locale={getLocale(languageCode)}
        style={{ width: "100%" }}
        format={formatDate}
        placeholder={DEFAULT_PLACEHOLDER_DATE}
        clearIcon={
          <AllowClear>
            <CloseFill />
          </AllowClear>
        }
        suffixIcon={<CalendarIcon />}
        panelRender={panelRender}
        disabledDate={disabledDate}
        onChange={handleOnChange}
        value={getDateValue(value)}
        disabled={disabled}
      />
    </Container>
  );
};

export default InputDate;
