import "./blog-top-banner.component.scss";
import blogTopBannerDefault from "../../../../assets/images/blog-top-banner-default.png";
import { backgroundTypeEnum, theme1ElementCustomize } from "../../../../constants/store-web-page.constants";
import { ThemeKey } from "../../../../constants/string.constants";

export function BlogTopBannerComponent(props) {
  const { clickToFocusCustomize, general, isCustomize, config, blogDetail } = props;
  const bannerImage =
    (config?.header?.backgroundType === backgroundTypeEnum.Image && config?.header?.backgroundImage) ??
    blogTopBannerDefault;

  return (
    <div
      id={"themeHeaderBlogDetail"}
      onClick={() => {
        if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.HeaderBlogDetail);
      }}
    >
      <div
        className={`blog-detail-top-banner ${isCustomize && "is-customize"}`}
        style={{
          background:
            config?.header?.backgroundType === backgroundTypeEnum.Color
              ? config?.header?.backgroundColor
              : "url(" + bannerImage + ")",
          backgroundSize: "cover",
        }}
      >
        <span className="banner-text">{isCustomize ? "Lorem Ipsum" : blogDetail?.title}</span>
      </div>
    </div>
  );
}
