import { Row, Col, Image, Button } from "antd";
import "./blog-card-content.component.scss";
import { useTranslation } from "react-i18next";
import { MakkiArrowIcon, ViewEyesIcon } from "../../../../assets/icons.constants";
import { CalendarDateLinearIcon, UserLineDueToneIcon, TagLineDueToneIcon } from "../../../../assets/icons.constants";
import { useHistory } from "react-router";
import moment from "moment";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import defaultImageBlog from "../../../../assets/images/default-image-blog.png";
import { Link } from "react-router-dom";

export function BlogCardContentComponent(props) {
  const {
    key,
    bannerImageUrl,
    blogCategory,
    blogCategoryId,
    content,
    createdTime,
    createdUser,
    creator,
    id,
    lastSavedTime,
    title,
    totalView,
    isCustomize,
    code,
    urlEncode,
    description,
  } = props;
  const [t] = useTranslation();
  const history = useHistory();
  const pageData = {
    viewMore: t("button.viewMore", "Xem thêm"),
    by: t("blog.by", "Bởi"),
  };

  const handleClickViewMore = (urlEncode) => {
    if (isCustomize == false || isCustomize == null || isCustomize == undefined) {
      const urlParams = `blog/${urlEncode}`;
      history.replace("");
      history.push(urlParams);
    }
  };

  const languageSession = useSelector((state) => state.session?.languageSession);
  const [createdTimeFormat, setCreatedTimeFormat] = useState("");
  useEffect(() => {
    const inputDate = new Date(createdTime);
    if (languageSession?.default?.countryCode == "VN") {
      setCreatedTimeFormat(moment(inputDate).format("DD [tháng] MM, YYYY"));
    } else {
      setCreatedTimeFormat(moment(inputDate).format("MMMM D, YYYY"));
    }
  }, [languageSession]);

  return (
    <Col className={isCustomize ? "blog-card-content-customize" : "blog-card-content"}>
      <Link to={urlEncode && `/blog/${urlEncode}`}>
        <Row className="row-image">
          <Image width={"100%"} src={Boolean(bannerImageUrl) ? bannerImageUrl : defaultImageBlog} preview={false} />
        </Row>
      </Link>
      <div className="row-created-information">
        <div className="created-time">
          <CalendarDateLinearIcon />
          <span>{createdTimeFormat}</span>
        </div>
        <div className="tag">
          <ViewEyesIcon />
          <span>{totalView}</span>
        </div>
        <div className="created-by">
          <UserLineDueToneIcon />
          <span>{pageData.by + " " + creator}</span>
        </div>
      </div>
      <Link to={urlEncode && `/blog/${urlEncode}`}>
        <Row className="row-title">
          <span className="title">{title}</span>
        </Row>
      </Link>
      <Row className="row-content">
        <span className="content">{description}</span>
      </Row>
      <Row>
        <Button
          className="row-button"
          onClick={(e) => {
            handleClickViewMore(urlEncode);
          }}
        >
          <span>{pageData?.viewMore?.toUpperCase()}</span>
          <MakkiArrowIcon className="icon-arrow"></MakkiArrowIcon>
        </Button>
      </Row>
    </Col>
  );
}
