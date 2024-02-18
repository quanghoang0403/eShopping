import { Tooltip } from "antd";
import { useHistory } from "react-router";
import { BlogIconArrowRight, BlogIconHome } from "../../../../assets/icons.constants";
import "./blog-hyperlink-container.component.scss";

export function BlogHyperlinkContainerComponent(props) {
    const { blogDetail, isCustomize, t, colorGroupArticle, fontFamily } = props;
  const history = useHistory();
  const translatedData = {
    home: t("blogDetail.home", "Trang chủ"),
    blog: t("blogDetail.blog", "Bài viết"),
  };

  const hyperlinkTypeConstant = {
    HOME: 1,
    BLOG: 2,
  };

  const handleRedirectHyperlink = (hyperlink) => {
    switch (hyperlink) {
      case hyperlinkTypeConstant.HOME:
        history.push(`/`);
        break;
      case hyperlinkTypeConstant.BLOG:
        history.push(`/blog`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="hyperlink-container">
      <BlogIconHome />
      <span className="ml-8 cursor-pointer" onClick={() => handleRedirectHyperlink(hyperlinkTypeConstant.HOME)}>
        {translatedData.home}
      </span>
      <BlogIconArrowRight className="ml-8" />
      <span className="ml-8 cursor-pointer" onClick={() => handleRedirectHyperlink(hyperlinkTypeConstant.BLOG)}>
        {translatedData.blog}
      </span>
      <BlogIconArrowRight className="ml-8" />
      <Tooltip
        placement="topRight"
        title={<span style={{ fontFamily: fontFamily }}>{isCustomize ? "Lorem Ipsum" : blogDetail?.title}</span>}
      >
        <span className="ml-8 title-text" style={{ color: colorGroupArticle?.titleColor }}>{isCustomize ? "Lorem Ipsum" : blogDetail?.title}</span>
      </Tooltip>
    </div>
  );
}
