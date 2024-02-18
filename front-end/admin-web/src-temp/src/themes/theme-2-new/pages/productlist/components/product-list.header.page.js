import { Row } from "antd";
import { theme2ElementCustomize } from "../../../constants/store-web-page.constants";
import "./product-list.header.page.scss";
export default function ProductListPageHeader(props) {
  const { colorGroups, configuration, clickToFocusCustomize } = props;
  const title = configuration?.title;
  const backgroundImage = configuration?.backgroundImage;
  const backgroundColor = configuration?.backgroundColor;
  const backgroundType = configuration?.backgroundType;
  const colorGroup = colorGroups?.find((c) => c.id === configuration?.colorGroupId);
  const headerStyle =
    backgroundType === 1
      ? {
          background: backgroundColor,
        }
      : {
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };

  if (clickToFocusCustomize)
    return (
      <Row id="themeHeaderProductList" onClick={() => clickToFocusCustomize(theme2ElementCustomize.HeaderProductList)}>
        <div className="product-list-header-theme2-customize" style={headerStyle}>
          <div style={{ color: colorGroup?.titleColor }} className="title">
            <span>{title}</span>
          </div>
        </div>
      </Row>
    );

  return (
    <Row id="themeHeaderProductList">
      <div className="product-list-header-theme2" style={headerStyle}>
        <div style={{ color: colorGroup?.titleColor }} className="title">
          <span>{title}</span>
        </div>
      </div>
    </Row>
  );
}
