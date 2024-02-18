import React from "react";
import "./styles.scss";
import {
  backgroundTypeEnum,
  theme2ElementCustomize,
} from "../../../constants/store-web-page.constants";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const HeaderBlog = ({
  header,
  colorGroupBlogHeader,
  isCustomize,
  clickToFocusCustomize,
  isBlogDetail,
}) => {
  let style = {};
  if (isCustomize && isBlogDetail && !header.title) {
    header.title = "Blog"
  }
  const [t] = useTranslation();
  const translateData = {
    blog: t("blog.blog", "Blog"),
  };

  const IMAGE_BG_DEFAULT =
    "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/07082023141810.png";
  if (header?.backgroundType === backgroundTypeEnum.Color) {
    style = {
      backgroundColor: header?.backgroundColor,
    };
  } else {
    style = {
      background: `url(${
        header?.backgroundImage ? header?.backgroundImage : IMAGE_BG_DEFAULT
      }) no-repeat center center`,
    };
  }
  return (
    <div
      className={`blog-wrapper ${
        isCustomize ? "blog-header-customize-theme2" : "blog-header-theme2"
      }`}
      onClick={() =>
        clickToFocusCustomize &&
        clickToFocusCustomize(theme2ElementCustomize.Blogs)
      }
    >
      <div className="blog-section container-fluid blog-header" style={style}>
        <h1 style={{ color: colorGroupBlogHeader?.titleColor }}>
          {}
          {!header?.title && !isBlogDetail ? translateData.blog : header.title}
        </h1>
      </div>
    </div>
  );
};

export default memo(HeaderBlog);
