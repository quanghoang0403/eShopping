import { Col, Row } from "antd";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploading from "react-images-uploading";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatCreatedTime } from "../../../../../utils/helpers";
import { DateTimePickerBlogIcon, TotalViewBlogIcon } from "../../../../assets/icons.constants";
import defaultImageBlog from "../../../../assets/images/default-image-blog.png";
import { EnumBlogName } from "../../../../constants/enum";
import "./styles.scss";
import { BlogHyperlinkContainerComponent } from "../PostHyperlink/PostHyperlink";
import { WebViewMessageEventKeys } from "../../../../constants/webview-message-event.constants";

const PostContent = (props) => {
  const [t] = useTranslation();
  const translateData = {
    by: t("blog.blogDetail.by", "Bởi"),
    postBefore: t("blog.blogDetail.postBefore", "Bài sau"),
    postNext: t("blog.blogDetail.postNext", "Bài trước"),
    view: t("blog.blogDetail.view", "Lượt xem"),
  };

  const { data, isCustomize, type, colorGroupBlogHeader, fontFamily } = props;
  const languageSession = useSelector((state) => state.session?.languageSession);
  const [createdTimeFormat, setCreatedTimeFormat] = useState("");

  useEffect(() => {
    const inputDate = new Date(data?.createdTime);
    setCreatedTimeFormat(formatCreatedTime(inputDate, languageSession));
  }, [languageSession, data]);

  const isCustomizeBlogListPage = isCustomize && type === EnumBlogName.BLOG_PAGE;
  const isNotCustomizeBlogListPage = !isCustomize && type === EnumBlogName.BLOG_PAGE;
  const isDetailBlog = type === EnumBlogName.DETAIL_PAGE;

  useEffect(() => {
    const isStoreAppWebView = window.isStoreAppWebView;
    if (isStoreAppWebView && data != null) {
      const payload = {
        key: WebViewMessageEventKeys.viewBlog,
        isViewBlog: true,
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    }
  }, [data]);

  return (
    <Row
      className={`post-content-theme2 ${isDetailBlog ? "post-content-detail-theme2" : "post-content-blog-list-theme2"}`}
    >
      {isDetailBlog && (
        <BlogHyperlinkContainerComponent
          isCustomize={isCustomize}
          t={t}
          blogDetail={data}
          colorGroupBlogHeader={colorGroupBlogHeader}
          fontFamily={fontFamily}
        />
      )}
      <Row className="post-content">
        {isDetailBlog ? (
          <div className="post-content-detail-theme2">
          
          {!isCustomize && (
              <Row className="thumbnail">
                <Col>
                  {!data?.bannerImageUrl ? (
                    <Link to={`/blog/${data?.urlEncode}`}  onClick={(e) => (isCustomize || isDetailBlog) && e?.preventDefault()}>
                      <img src={defaultImageBlog} alt="Image" className="thumbnail-url" />
                    </Link>
                  ) : (
                    <img className="thumbnail-url" src={data?.bannerImageUrl} alt="profile" />
                  )}
                </Col>
              </Row>
            )}
            
            <Row className="title">
              <Col style={{ color: colorGroupBlogHeader?.titleColor }}>
                {data?.blogCategoryName ?? data?.blogCategory}
              </Col>
            </Row>

            <Row className="label">
              <Col className="label-text-details" style={{ color: colorGroupBlogHeader?.textColor }}>
                {data?.title}
              </Col>
            </Row>

            <Row className="date-and-author">
              <Col className="viewer">
                <span className="icon-view">
                  <TotalViewBlogIcon />
                </span>
                <span className="text-view">
                  {data?.totalView ?? "0"} {translateData.view}
                </span>
              </Col>
              <Col className="date">
                <span style={{ display: "flex", marginRight: 8 }}>
                  <DateTimePickerBlogIcon />
                </span>
                {createdTimeFormat}
              </Col>
              <Col className="author">
                <span className="text-by">{translateData.by}</span>
                <span className="author-by" style={{ color: colorGroupBlogHeader?.textColor }}>
                  {data?.createdBy ? data?.createdBy : data?.creator}
                </span>
              </Col>
            </Row>
          </div>
        ) : (
          <>
            <Row className="thumbnail">
              <Col>
                {isCustomize || !data?.bannerImageUrl ? (
                  <Link to={`/blog/${data?.urlEncode}`} onClick={(e) => (isCustomize || isDetailBlog) && e?.preventDefault()}>
                    <img src={defaultImageBlog} alt="Image" className="thumbnail-url" />
                  </Link>
                ) : (
                  <ImageUploading dataURLKey="data_url">
                    {() => {
                      return (
                        <Link to={`/blog/${data?.urlEncode}`} onClick={(e) => (isCustomize || isDetailBlog) && e?.preventDefault()}>
                          <img className="thumbnail-url" src={data?.bannerImageUrl} alt="profile" />
                        </Link>
                      );
                    }}
                  </ImageUploading>
                )}
              </Col>
            </Row>

            <Row className="title">
              <Col style={{ color: colorGroupBlogHeader?.titleColor }}>
                {data?.blogCategoryName ?? data?.blogCategory}
              </Col>
            </Row>

            <Row className="label">
              <Link to={`/blog/${data?.urlEncode}`}>
                <Col className="label-text" style={{ color: colorGroupBlogHeader?.textColor }}>
                  {data?.title}
                </Col>
              </Link>
            </Row>

            <Row className="date-and-author">
              <Col className="viewer">
                <span className="icon-view">
                  <TotalViewBlogIcon />
                </span>
                <span className="text-view">
                  {data?.totalView ?? "0"} {translateData.view}
                </span>
              </Col>
              <Col className="date">
                <span style={{ display: "flex", marginRight: 8 }}>
                  <DateTimePickerBlogIcon />
                </span>
                {createdTimeFormat}
              </Col>
              <Col className="author">
                <span className="text-by">{translateData.by}</span>
                <span className="author-by" style={{ color: colorGroupBlogHeader?.textColor }}>
                  {data?.createdBy ? data?.createdBy : data?.creator}
                </span>
              </Col>
            </Row>
          </>
        )}

        <Row className={`description ${isDetailBlog ? "description-blog-detail" : "description-blog-list"}`}>
          {isCustomizeBlogListPage ? (
            <Col>{data?.description}</Col>
          ) : (
            <Col
              className={`${isNotCustomizeBlogListPage ? "blog-list-page-content" : ""}`}
              dangerouslySetInnerHTML={{
                __html: isDetailBlog ? data?.content : data?.description,
              }}
              style={{ color: colorGroupBlogHeader?.textColor }}
            ></Col>
          )}
        </Row>
      </Row>
    </Row>
  );
};

export default memo(PostContent);
