import { Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomizationGroup from "../../../components/customization-group-component/customization-group.page";
import PageType from "../../../constants/page-type.constants";
import { theme1ElementCustomize, theme1IdScrollView } from "../../../constants/store-web-page.constants";
import defaultConfig from "../../../default-store.config";
import SelectColorGroupComponent from "../../../components/select-color-group.component";
import SelectBackgroundComponent from "../../../components/select-background.component";
import { BlogDetailWhiteIcon } from "../../../assets/icons.constants";

function BlogDetailCustomizeComponent(props) {
  const { defaultActiveKey } = props;
  const [t] = useTranslation();
  const [showHeader, setShowHeader] = useState(true);
  const [showArticle, setShowArticle] = useState(true);
  const translateData = {
    blog: t("blog.customize.blog", "Bài viết"),
    articleDetail: t("blog.customize.articleDetail", "Nội dung bài viết"),
    header: t("blog.customize.header", "Đầu trang"),
    border: {
      header: "#blogDetailHeader",
      article: "#blogDetailArticle",
    },
  };

  const bestDisplay = "1920 x 323 px";
  const defaultMaxSizeUpload = 20;
  const defaultThemePageConfig = defaultConfig?.pages?.find((p) => p.id === PageType.BLOG_DETAIL_PAGE);

  const onChangeCollapse = (key, tag) => {
    switch (tag) {
      case translateData.border.header:
        key.length <= 0 ? setShowHeader(false) : setShowHeader(true);
        break;
      case translateData.border.article:
        key.length <= 0 ? setShowArticle(false) : setShowArticle(true);
        break;

      default:
        break;
    }
  };

  const renderArticle = () => {
    return (
      <>
        <Row id={`_${translateData.border.article}`} className="mt-2">
          <SelectBackgroundComponent
            {...props}
            formItemPreName={["config", "article"]}
            backgroundCustomize={props?.pageConfig?.config?.article}
            bestDisplay={bestDisplay}
            maxSizeUploadMb={defaultMaxSizeUpload}
            defaultThemeColor={defaultThemePageConfig?.config?.article?.backgroundColor}
            defaultImage={defaultThemePageConfig?.config?.article?.backgroundImage}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config", "article"]} />
        </Row>
      </>
    );
  };

  const groupCollapse = [
    {
      title: translateData.articleDetail,
      isShowRightIconWhenHoverMouse: true,
      icon: <></>,
      content: renderArticle(),
      onChangeEye: translateData.border.article,
      isShowKey: showArticle,
      clickToScroll: theme1IdScrollView.ArticleBlogDetail,
      customizeKey: theme1ElementCustomize.ArticleBlogDetail,
      isShowTooltip: false,
      titleIconRight: null,
    },
  ];
  return (
    <>
      {groupCollapse?.map((group, index) => {
        return (
          <CustomizationGroup
            title={group.title}
            isNormal={true}
            defaultActiveKey={defaultActiveKey + "." + ++index}
            content={group.content}
            icon={group.icon}
            isShowKey={group.isShowKey}
            onChangeCollapse={(value) => onChangeCollapse(value, group.onChangeEye)}
            clickToScroll={group.clickToScroll}
            customizeKey={group.customizeKey}
            isShowRightIconWhenHoverMouse={group.isShowRightIconWhenHoverMouse}
            isShowTooltip={group.isShowTooltip}
            titleIconRight={group.titleIconRight}
          ></CustomizationGroup>
        );
      })}
    </>
  );
}
export const BlogDetailCustomizes = [
  {
    icon: <BlogDetailWhiteIcon />,
    title: "blog.customize.blogDetail",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: false,
    content: (props) => {
      return (
        <>
          <BlogDetailCustomizeComponent {...props} />
        </>
      );
    },
  },
];
