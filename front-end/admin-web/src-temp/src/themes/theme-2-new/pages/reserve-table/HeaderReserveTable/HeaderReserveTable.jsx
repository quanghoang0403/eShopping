import { memo } from "react";
import { useTranslation } from "react-i18next";
import backgroundReserveTable from "../../../assets/images/reserve-table-header-theme2.png";
import "./HeaderReserveTable.scss";

const HeaderReserveTable = (props) => {
  const [t] = useTranslation();
  const translateData = {
    reserveTable: t("reserveTable.reserveTable", "Đặt bàn"),
  };

  const style = {
    background: `url(${backgroundReserveTable}) no-repeat center center`,
  };

  return (
    <div className={`reserve-table-wrapper reserve-table-header-customize-theme-2`}>
      <div className="reserve-table-section container-fluid reserve-table-header" style={style}>
        <h1 className="reserve-table-header-text">
          {props?.config?.header?.title ? props?.config?.header?.title : translateData.reserveTable}
        </h1>
      </div>
    </div>
  );
};

export default memo(HeaderReserveTable);
