import { useTranslation } from "react-i18next";
import {
  ComputerIcon,
  ContentMarketingIcon,
} from "../../../assets/icons.constants";
import SelectBackgroundComponent from "../../../components/select-background.component";
import SelectColorGroupComponent from "../../../components/select-color-group.component";
import PageType from "../../../constants/page-type.constants";
import defaultConfig from "../../../default-store.config";
import { Checkbox, Col, Form, Row } from "antd";
import { useState } from "react";
import CustomizationGroup from "../../../components/customization-group-component/customization-group.page";
import { FnbInput } from "../../../components/fnb-input/fnb-input.component";
import {
  theme1ElementCustomize,
  theme1IdScrollView,
} from "../../../constants/store-web-page.constants";
import { useEffect } from "react";
import blogListHeaderImage from "../../../assets/images/blog-list-header.png";
import blogDetailDefaultImage from "../../../assets/images/blog-detail-default-img-top.png";

function BlogListCustomize(props) {
  const { defaultActiveKey, clickToScroll } = props;
  const [t] = useTranslation();
  const [showHeader, setShowHeader] = useState(true);
  const [showBlog, setShowBlog] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFocusElement(clickToScroll);
    }, 100);
  }, []);
  const setFocusElement = (elementId) => {
    try {
      const element = document.querySelector(elementId);
      if (element) {
        // set border element on focused
        element.className = "tc-on-focus";
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        window.oldElements = elementId;
      }
    } catch {}
  };

  const pageData = {
    title: t("toreWebPage.footerThemeConfiguration.title"),
    header: t("storeWebPage.header.title"),
    placeHolder: t("menuManagement.menuItem.hyperlink.dynamic.blog.title"),
    blogTitle: t("menuManagement.menuItem.hyperlink.dynamic.blog.title"),
    titleHeader: t("storeWebPage.footerThemeConfiguration.title"),
    maxSizeUploadMb: 5,
    maxSizeUploadBackgroundImage: 20,
    border: {
      header: "#blogListHeader",
      blog: "#blogListBlog",
    },
  };

  const bestDisplay = "1920 x 569 px";
  const defaultThemePageConfig = defaultConfig?.pages?.find(
    (p) => p.id === PageType.BLOG_LIST_PAGE
  );

  const onChangeCollapse = (key, tag) => {
    switch (tag) {
      case pageData.border.header:
        key.length <= 0 ? setShowHeader(false) : setShowHeader(true);
        break;
      case pageData.border.blogTitle:
        key.length <= 0 ? setShowBlog(false) : setShowBlog(true);
        break;
      default:
        break;
    }
  };

  const renderHeader = () => {
    return (
      <Row
        id={`_${pageData.border.header}`}
        className="mt-2"
        clickToScroll={clickToScroll}
      >
        <SelectBackgroundComponent
          {...props}
          formItemPreName={["config", "header"]}
          backgroundCustomize={props?.pageConfig?.config?.header}
          bestDisplay={bestDisplay}
          maxSizeUploadMb={pageData.maxSizeUploadBackgroundImage}
          defaultThemeColor={
            defaultThemePageConfig?.config?.header?.backgroundColor
          }
          isRequired={false}
          nameComponents="BlogListHeader"
          defaultImage={blogListHeaderImage}
        />
        <SelectColorGroupComponent
          {...props}
          formItemPreName={["config", "header"]}
        />
        <Row gutter={[8, 16]} align="middle" className="row-header">
          <Col span={24}>{pageData.titleHeader}</Col>
          <Col span={24}>
            <Form.Item
              name={["config", "header", "title"]}
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <FnbInput
                className="fnb-input-with-count"
                placeholder={pageData.placeHolder}
                maxLength={100}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </Row>
    );
  };

  const renderBlog = () => {
    return (
      <>
        <Row id={`_${pageData.border.blogTitle}`} className="mt-2">
          <SelectBackgroundComponent
            {...props}
            formItemPreName={["config", "blogList"]}
            bestDisplay={bestDisplay}
            backgroundCustomize={props?.pageConfig?.config?.blogList}
            defaultThemeColor={
              defaultThemePageConfig?.config?.blogList?.backgroundColor
            }
            isRequired={false}
            nameComponents="BlogListBlog"
            defaultImage={blogDetailDefaultImage}
          />
          <SelectColorGroupComponent
            {...props}
            formItemPreName={["config", "blogList"]}
          />
        </Row>
      </>
    );
  };

  const groupCollapse = [
    {
      title: pageData.header,
      content: renderHeader(),
      onChangeEye: pageData.border.header,
      icon: null,
      isShowKey: showHeader,
      clickToScroll: theme1IdScrollView.HeaderBlogList,
      customizeKey: theme1ElementCustomize.HeaderBlogList,
      isShowRightIconWhenHoverMouse: true,
      isShowTooltip: false,
      titleIconRight: null,
    },
    {
      title: pageData.blogTitle,
      content: renderBlog(),
      onChangeEye: pageData.border.blog,
      icon: null,
      isShowKey: showBlog,
      clickToScroll: theme1IdScrollView.BlogListBlog,
      customizeKey: theme1ElementCustomize.BlogListBlog,
      isShowRightIconWhenHoverMouse: true,
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
            className={"size-group"}
            isShowKey={group.isShowKey}
            onChangeCollapse={(value) =>
              onChangeCollapse(value, group.onChangeEye)
            }
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
export const BlogListCustomizes = [
  {
    icon: <ContentMarketingIcon />,
    title: "menuManagement.menuItem.hyperlink.dynamic.blog.title",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: false,
    isShowRightIconWhenHoverMouse: true,
    // name:
    content: (props) => {
      return (
        <>
          <BlogListCustomize {...props} />;
        </>
      );
    },
  },
];
