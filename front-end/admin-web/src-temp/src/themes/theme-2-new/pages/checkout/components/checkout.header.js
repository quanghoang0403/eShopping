import { theme2ElementCustomize } from "../../../constants/store-web-page.constants";
import "./checkout.header.scss";
export default function CheckOutHeader(props) {
  const { configuration, colorGroups, clickToFocusCustomize } = props;
  const title = configuration?.title ?? "Checkout Order";
  const backgroundImage = configuration?.backgroundImage;
  const backgroundColor = configuration?.backgroundColor;
  const backgroundType = configuration?.backgroundType;
  const colorGroup = colorGroups?.find((c) => c.id === configuration?.colorGroupId);
  const headerStyle =
    backgroundType === 1
      ? {
          background: backgroundColor,
          display: !configuration?.visible && "none",
        }
      : {
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          display: !configuration?.visible && "none",
        };

  return (
    <>
      <div
        id="themeHeaderCheckout"
        onClick={() => {
          if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.HeaderCheckout);
        }}
      >
        <div className="check_out_header_theme2" style={headerStyle}>
          <div className="header_title" style={{ color: colorGroup?.titleColor }}>
            {title}
          </div>
        </div>
      </div>
    </>
  );
}
