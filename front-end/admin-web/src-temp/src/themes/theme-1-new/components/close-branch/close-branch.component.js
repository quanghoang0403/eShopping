import { useTranslation } from "react-i18next";
import { CloseBranchIcon } from "../../assets/icons.constants";

import "./close-branch.component.scss";

export function CloseBranchComponent(props) {
  const { openTime, dayOfWeek } = props;
  const [t] = useTranslation();

  const translateData = {
    closed: t("storeBranch.closed", "Cửa hàng đã đóng cửa."),
    pleaseComeBackOn: t("storeBranch.pleaseComeBackOn", " Vui lòng quay lại vào lúc "),
  };

  return (
    <div className="close-branch-theme-1">
      <CloseBranchIcon />
      <p>
        <span className="closed">{translateData.closed}</span>
        <span>
          {translateData.pleaseComeBackOn}
          <span className="time">
            {openTime} {t(dayOfWeek)}
          </span>
        </span>
      </p>
    </div>
  );
}
