import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {
  BlogFacebook,
  BlogInstagram,
  BlogLinkedin,
  BlogTwitter,
  CalendarDateLinearIcon,
  ViewEyesIcon,
} from "../../../../assets/icons.constants";
import defaultImg from "../../../../assets/images/default-image-blog.png";
import ImageWithFallback from "../../../../components/fnb-image-with-fallback/fnb-image-with-fallback.component";
import { renderBlogContentMockup } from "../MockupData/BlogContentMockup";
import "./blog-card-detail-content.component.scss";
import BlogDetailCreated from "./blog-title-created.component";

export function BlogCardDetailContentComponent(props) {
  const isMaxWith575 = useMediaQuery({ maxWidth: 575 });

  const { isCustomize, tags, blogDetail, t } = props;
  const translatedData = {
    by: t("blogDetail.by", "Bởi"),
  };
  const socialMediaMockup = [
    {
      id: 1,
      icon: <BlogFacebook />,
    },
    {
      id: 2,
      icon: <BlogTwitter />,
    },
    {
      id: 3,
      icon: <BlogInstagram />,
    },
    {
      id: 4,
      icon: <BlogLinkedin />,
    },
  ];

  const languageSession = useSelector((state) => state.session?.languageSession);
  const [language, setLanguage] = useState("");
  useEffect(() => {
    if (languageSession?.default?.countryCode == "VN") {
      setLanguage("VN");
    } else {
      setLanguage("EN");
    }
  }, [languageSession]);

  const formatTimeVN = (inputDate) => {
    return moment.utc(inputDate).local().format("DD [tháng] MM, YYYY");
  };
  const formatTimeEN = (inputDate) => {
    return moment.utc(inputDate).local().format("MMMM DD, YYYY");
  };

  const dataBlogDetailMockUp = {
    title: "Assertively recaptiualize interdependent ",
    totalView: "499",
    createdBy: "Di Di",
  };

  //For customize only
  const renderTopImageInfoMockup = () => {
    return (
      <>
        <div className="top-image">
          <ImageWithFallback
            src={isCustomize ? defaultImg : blogDetail?.bannerImageUrl}
            alt="icon"
            fallbackSrc={defaultImg}
          />
        </div>

        <div className="blog-detail-title">{isCustomize ? dataBlogDetailMockUp.title : blogDetail?.title}</div>
        <div className="blog-info">
          <div className="blog-date">
            <CalendarDateLinearIcon />
            <span className="ml-8">
              {isCustomize || language === "VN"
                ? formatTimeVN(blogDetail?.createdTime)
                : formatTimeEN(blogDetail?.createdTime)}
            </span>
          </div>
          <div className="seperator"></div>
          <div className="blog-total-view">
            <ViewEyesIcon />
            <span className="ml-8">{isCustomize ? dataBlogDetailMockUp.totalView : blogDetail?.totalView + 1}</span>
          </div>
          <div className="seperator"></div>
          <div className="blog-creator">
            <BlogDetailCreated
              isCustomize={isCustomize}
              dataBlogDetailMockUp={dataBlogDetailMockUp}
              blogDetail={blogDetail}
              translatedData={translatedData}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={`blog-card-detail-container ${isCustomize && "is-customize"}`}>
      <>{renderTopImageInfoMockup()}</>
      <div className="blog-content">
        {isCustomize ? (
          <>{renderBlogContentMockup()}</>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: `${blogDetail?.content}` }}></div>
        )}

        <div className="separate-line"></div>
        <div className="blog-bottom-content">
          <div className="blog-left-content">
            <span className="tag-title">Tag:</span>
            {tags?.map((item) => {
              return <span className="tag-name">{item.name}</span>;
            })}
          </div>
          <div className="blog-right-content">
            {!isMaxWith575 && <span className="share-title mr-24">Share:</span>}
            {socialMediaMockup?.map((item) => {
              return <span className="icon">{item.icon}</span>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
