import { Col, Row } from "antd";
import React from "react";
import ImageUploading from "react-images-uploading";
import { formatDate } from "../../../../../utils/helpers";
import { Link } from "react-router-dom";
import { DateFormat } from "../../../../constants/string.constant";
import { BlogImageDefault } from "../../../../assets/icons.constants";
import defaultImageBlog from "../../../../assets/images/default-image-blog.png";

const PostViewed = ({ isCustomize, data, colorGroupBlogHeader }) => {
  return (
    <Row className="post-viewed-theme2">
      <Col className="thumbnail">
        {!data?.bannerImageUrl ? (
          <ImageUploading dataURLKey="data_url">
            {() => {
              return (
                <Link to={`/blog/${data?.urlEncode}`} className="thumbnail-url">
                  <img
                    src={defaultImageBlog}
                    alt="Image"
                    style={{ width: 120, height: 80 }}
                    className="tag-image"
                  />
                </Link>
              );
            }}
          </ImageUploading>
        ) : (
          <Link to={`/blog/${data?.urlEncode}`}>
            <img
              src={data?.bannerImageUrl}
              alt="Image"
              style={{ width: 120, height: 80 }}
              className="tag-image"
            />
          </Link>
        )}
      </Col>
      <Col className="date-and-title">
        {isCustomize ? (
          <>
            <Row
              className="post-viewed-name"
              style={{
                cursor: "pointer",
                color: colorGroupBlogHeader?.textColor,
              }}
            >
              {data?.title}
            </Row>
            <Row className="date">
              {formatDate(data?.lastSavedTime, DateFormat.DD_MONTH_MM_YYYY)}
            </Row>
          </>
        ) : (
          <>
            <Link to={`/blog/${data?.urlEncode}`}>
              <Row
                className="post-viewed-name"
                style={{
                  cursor: "pointer",
                  color: colorGroupBlogHeader?.textColor,
                }}
              >
                {data?.title}
              </Row>
            </Link>
            <Row className="date">
              {formatDate(data?.lastSavedTime, DateFormat.DD_MONTH_MM_YYYY)}
            </Row>
          </>
        )}
      </Col>
    </Row>
  );
};

export default PostViewed;
