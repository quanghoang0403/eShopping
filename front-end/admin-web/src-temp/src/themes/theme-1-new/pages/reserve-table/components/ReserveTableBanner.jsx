import { Image } from "antd";
import reserveTableHeaderImage from "../../../assets/images/reserve-table-background-default.png";
import { theme1ElementCustomize } from "../../../constants/store-web-page.constants";
import "../ReserveTablePage.style.scss";
import { useSelector } from "react-redux";
import PageType from "../../../constants/page-type.constants";

export function ReserveTableBanner(props) {
  const { clickToFocusCustomize, isCustomize, general, config } = props;
  const colorGroup = general?.color?.colorGroups.find((c) => c.id === config?.header?.colorGroupId);
  const initialConfig = useSelector((state) => state?.themeConfig?.data?.pages)?.find((page) => page?.id === PageType.RESERVE_TABLE_PAGE);
  return config?.header?.backgroundType === 1 ? (
    <div
      className={isCustomize ? "reserve-table-text-color-customize" : "reserve-table-text-color"}
      style={{
        backgroundColor: config?.header?.backgroundColor,
      }}
    >
      <span style={{ color: colorGroup?.titleColor }}>{config?.header?.title}</span>
    </div>
  ) : (
    <div
      className={isCustomize ? "reserve-table-banner-customize" : "reserve-table-banner"}
      width={"100%"}
      onClick={() => clickToFocusCustomize(theme1ElementCustomize.HeaderReservation)}
    >
      <Image
        preview={false}
        src={config?.header?.backgroundImage ? config?.header?.backgroundImage : reserveTableHeaderImage}
      ></Image>
      <span className="banner-text" style={{ color: colorGroup?.titleColor }}>
        {config?.header?.title ?? initialConfig?.config?.header?.title}
      </span>
    </div>
  );
}
