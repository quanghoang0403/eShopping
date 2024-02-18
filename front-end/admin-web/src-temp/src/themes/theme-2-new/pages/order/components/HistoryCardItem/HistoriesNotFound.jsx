import { useTranslation } from "react-i18next";
import historyIcon from "../../../../assets/icons/history-icon.svg";
import "./HistoryCardItem.style.scss";

function HistoriesNotFound(props) {
  const { t } = useTranslation();
  return (
    <div className="history-content-not-found">
      <div className="content-center img-not-found">
        <img src={historyIcon} alt="" />
      </div>

      <div className="content-center text-not-found">{t("order.historyNotFound")}</div>
    </div>
  );
}
export default HistoriesNotFound;
