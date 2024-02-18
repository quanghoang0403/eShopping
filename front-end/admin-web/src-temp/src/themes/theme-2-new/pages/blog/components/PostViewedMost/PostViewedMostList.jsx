import { Col, Row } from "antd";
import React from "react";
import PostViewed from "./PostViewed";
import "./styles.scss";
import { mockupPostViewedMost } from "../MockupData/MockupData";
import { useTranslation } from "react-i18next";

const PostViewedMostList = (props) => {
  const { isCustomize, data, colorGroupBlogHeader } = props;
  const [t] = useTranslation();
  const translateData = {
    noPost: t("blog.noPost", "Chưa có bài viết nào"),
    mostRecentPost: t("blog.mostRecentPost", "BÀI VIẾT GẦN ĐÂY"),
    noRecentPost: t("blog.noRecentPost", "Chưa có bài viết"),
  };
  return (
    <Row
      className="post-viewed-most-theme2"
      style={{
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: "10px 24px",
      }}
    >
      <Col
        className="title"
        style={{ color: colorGroupBlogHeader?.titleColor }}
      >
        {translateData.mostRecentPost}
      </Col>
      <Col>
        {isCustomize ? (
          mockupPostViewedMost?.map((post) => {
            return (
              <PostViewed
                data={post}
                key={post?.id}
                isCustomize={isCustomize}
                colorGroupBlogHeader={colorGroupBlogHeader}
              />
            );
          })
        ) : data?.length > 0 ? (
          data?.map((post) => {
            return (
              <PostViewed
                data={post}
                key={post?.id}
                isCustomize={isCustomize}
                colorGroupBlogHeader={colorGroupBlogHeader}
              />
            );
          })
        ) : (
          <>{translateData.noRecentPost}</>
        )}
      </Col>
    </Row>
  );
};

export default PostViewedMostList;
