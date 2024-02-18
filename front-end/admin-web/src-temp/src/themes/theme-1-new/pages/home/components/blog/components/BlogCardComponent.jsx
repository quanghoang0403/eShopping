import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { formatDateBlogs } from "../../../../../../utils/helpers";
import { EyeBlogIcon, ProfileBlogIcon } from "../../../../../assets/icons.constants";
import BlogDefault from "../../../../../assets/images/blog-default.png";
import { languages } from "../../../../../constants/enums";
import "../BlogComponent.scss";
import {useHistory} from "react-router-dom";
import { Button } from "antd";

const BlogCardComponent = (props) => {
  const { blogInfo, isCustomize } = props;

  const { t } = useTranslation();
  const [date, setDate] = useState();
  const [month, setMonth] = useState();
  const languageSession = useSelector((state) => state.session?.languageSession);
  const history = useHistory();
  const pageData = {
    btnSeeMore: t("blogs.btnSeeMore", "Đọc thêm"),
    month: t("blogs.month", "tháng"),
    by: t("blogs.by", "bởi"),
  };

  useEffect(() => {
    handleDate(blogInfo?.createdTime);
  }, [languageSession]);

  const handleDate = (date) => {
    let language = isCustomize ? languages.VIETNAMESE : languageSession?.default?.languageCode ?? languages.VIETNAMESE;

    let createDate = formatDateBlogs(date, pageData.month, language);

    var createDateArr = createDate.split(" ");
    switch (language) {
      case languages.ENGLISH:
        setDate(createDateArr[0]);
        setMonth(createDateArr[1].split(",")[0]);
        break;
      case languages.VIETNAMESE:
        setDate(createDateArr[0]);
        setMonth(createDateArr[1] + " " + createDateArr[2].split(",")[0]);
        break;
    }
  };

  const isViewOnStoreApp = window?.isStoreAppWebView ?? false;

  return (
    <div>
      <a onClick={() => history.push(`/blog/${blogInfo?.urlEncode}`)}>
        <div className="image-card">
          <div className="post-blog-date">
            <div className="date">{date}</div>
            <div className="month">{month}</div>
          </div>
          <div className="card">
            <div className="title text-btn text-line-clamp-1">{blogInfo?.title}</div>
            <div className="body">
              <div className="view-author">
                <div className="view">
                  <EyeBlogIcon />
                  <span>{blogInfo?.totalView}</span>
                </div>
                <hr />
                <div className="author">
                  <ProfileBlogIcon />
                  <span className="text-btn text-line-clamp-1">{pageData.by + " " + blogInfo?.creator}</span>
                </div>
              </div>
              <div className="description text-btn text-line-clamp-2">{blogInfo?.description}</div>
            </div>
            {isViewOnStoreApp === false && <Button className="button-see-more">{pageData.btnSeeMore}</Button>}
          </div>
          <div className="thumbnail">
            <img className="imageBlog" src={blogInfo.bannerImageUrl ?? BlogDefault} alt="Image" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default BlogCardComponent;
