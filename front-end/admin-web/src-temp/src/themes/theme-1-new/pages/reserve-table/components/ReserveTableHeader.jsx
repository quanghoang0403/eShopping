import { theme1ElementCustomize } from "../../../constants/store-web-page.constants";
import { ReserveTableBanner } from "./ReserveTableBanner";
export default function ReserveTableHeader(props) {
  const { clickToFocusCustomize } = props;
  return (
    <div
      id="themeHeaderReservation"
      onClick={() => {
        if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.HeaderReservation);
      }}
    >
      <ReserveTableBanner {...props} />
    </div>
  );
}
