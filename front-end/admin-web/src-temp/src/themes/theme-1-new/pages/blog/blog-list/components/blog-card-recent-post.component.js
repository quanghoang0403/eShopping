import { Row, Col, Image } from "antd";
import "./blog-card-recent-post.component.scss";
import { useTranslation } from "react-i18next";
import { CalendarDateLinearIcon } from "../../../../assets/icons.constants";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import moment from "moment";
import { useState } from "react";
import defaultImageBlog from "../../../../assets/images/default-image-blog.png";
import {useMediaQuery} from "react-responsive";

export function BlogCardRecentPostComponent(props) {
  const { blogRecentPost, isCustomize, colorGroupArticle } = props;
  const [t] = useTranslation();
  const history = useHistory();
  const pageData = {
    viewMore: t("button.viewMore", "Xem thêm"),
    recentPost: t("blogList.recentPost", "Bài Viết Gần Đây"),
  };
  const hanldeClickOnRecentPost = (urlEncode) => {
    if (isCustomize == false || isCustomize == null || isCustomize == undefined) {
      const urlParams = `blog/${urlEncode}`;
      history.replace("");
      history.push(urlParams);
    };
  };

  const languageSession = useSelector(
    (state) => state.session?.languageSession
  );
  const [language, setLanguage] = useState("");
  const isMaxWidth576 = useMediaQuery({ maxWidth: 576 });
  useEffect(() => {
    if (languageSession?.default?.countryCode == "VN") {
      setLanguage("VN");
    } else {
      setLanguage("EN");
    }
  }, [languageSession]);

  const formatTimeVN = (inputDate) => {
    return moment(inputDate).format("DD [tháng] MM, YYYY");
  };
  const formatTimeEN = (inputDate) => {
    return moment(inputDate).format("MMMM DD, YYYY");
  };
  return (
    <div
      className={
        isCustomize
          ? "blog-card-recent-post-customize"
          : "blog-card-recent-post"
      }
    >
      <div className="recent-post">
        <span className="title-recent-post">{pageData.recentPost}</span>
        {blogRecentPost.map((post, index) => (
          <div className="post-component">
            <div className="post-image">
              <Image src={post?.bannerImageUrl ?? defaultImageBlog} preview={!isMaxWidth576} />
            </div>
            <div className="post-content">
              <span
                className="post-title"
                onClick={(e) => {
                  hanldeClickOnRecentPost(post?.urlEncode);
                }}
                style={{ color: colorGroupArticle?.titleColor }}
              >
                {post?.title}
              </span>
              <div className="post-created-time">
                <CalendarDateLinearIcon />
                <span>
                  {language == "VN"
                    ? formatTimeVN(post?.createdTime)
                    : formatTimeEN(post?.createdTime)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
