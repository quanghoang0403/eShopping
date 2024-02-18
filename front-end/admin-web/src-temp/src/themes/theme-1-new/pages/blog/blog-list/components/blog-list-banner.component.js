import { Image } from "antd";
import "./blog-list-banner.component.scss";
import { theme1ElementCustomize } from "../../../../constants/store-web-page.constants";
import blogListHeaderImage from "../../../../assets/images/blog-list-header.png";
import { useMediaQuery } from "react-responsive";
export function BlogListBannerComponent(props) {
  const { clickToFocusCustomize, config, isCustomize } = props;
  const isDevicesMobile = useMediaQuery({ maxWidth: 575 });
  const colorGroup = props?.general.color?.colorGroups.find(
    (c) => c.id === props?.config?.header?.colorGroupId
  );
  return props?.config?.header?.backgroundType == 1 ? (
    <div
      className={isCustomize ? "blog-text-color-customize" : "blog-text-color"}
      style={{
        backgroundColor: props?.config?.header?.backgroundColor,
      }}
    >
      <span style={{ color: colorGroup?.titleColor }}>
        {props?.config?.header?.title}
      </span>
    </div>
  ) : (
    <div
      className={isCustomize ? "blog-top-banner-customize" : "blog-top-banner"}
      width={"100%"}
      onClick={() =>
        clickToFocusCustomize(theme1ElementCustomize.HeaderBlogList)
      }
    >
      <Image
        preview={!isCustomize && !isDevicesMobile}
        src={
          props?.config?.header?.backgroundImage
            ? props?.config?.header?.backgroundImage
            : blogListHeaderImage
        }
      ></Image>
      <span className="banner-text" style={{ color: colorGroup?.titleColor }}>
        {props?.config?.header?.title}
      </span>
    </div>
  );
}
