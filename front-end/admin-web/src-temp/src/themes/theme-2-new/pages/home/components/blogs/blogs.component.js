import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FreeMode, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import blogsDataService from "../../../../../data-services/blog-data.service";
import { formatDateBlogs, getStoreConfig } from "../../../../../utils/helpers";
import { CalendarBlogsIcon, TotalViewBlogIcon } from "../../../../assets/icons.constants";
import { IconReadMoreColor } from "../../../../assets/icons/ButtonReadMore";
import SwiperLeftIconCustomize from "../../../../assets/icons/SwiperLeftIcon";
import SwiperRightIconCustomize from "../../../../assets/icons/SwiperRightIcon";
import defaultImageBlog from "../../../../assets/images/default-image-blog.png";
import ImageWithFallback from "../../../../components/fnb-image-with-fallback/fnb-image-with-fallback.component";
import {
  backgroundTypeEnum,
  theme2ElementCustomize,
  theme2ElementRightId,
} from "../../../../constants/store-web-page.constants";
import { ThemeKey } from "../../../../constants/string.constant";
import { WebViewMessageEventKeys } from "../../../../constants/webview-message-event.constants";
import "./blogs.style.scss";
import { blogDefault } from "./default-data";

export default function Blogs(props) {
  const { clickToFocusCustomize, general, isCustomize } = props;
  const blogs = props?.config?.blogs;
  const generalCustomization = blogs?.generalCustomization;
  const colorGeneral = general?.color?.colorGroups?.find((c) => c.id === generalCustomization?.colorGroupId);
  const isFromStoreApp = window.isStoreAppWebView;

  const [blogsData, setBlogsData] = useState([]);
  const isMobileDevice = useMediaQuery({ maxWidth: 576 });
  const isTabletDevice = useMediaQuery({ maxWidth: 992 });
  const swiperRef = useRef(null);
  const languageSession = useSelector((state) => state.session?.languageSession);
  const languageCode = languageSession?.default?.languageCode ?? "vi";
  const [isActiveColorSwipperRight, setIsActiveColorSwipperRight] = useState(true);
  const [isActiveColorSwipperLeft, setIsActiveColorSwipperLeft] = useState(false);
  const history = useHistory();

  const [t] = useTranslation();
  const translatedData = {
    by: t("blog.blogDetail.by", "Bởi"),
    month: t("blog.blogDetail.month", "Tháng"),
    view: t("blog.blogDetail.view", "Lượt xem"),
    readMore: t("blog.blogDetail.readMore", "Xem thêm"),
  };

  let styleBackground = {};
  if (generalCustomization?.backgroundType === backgroundTypeEnum.Color) {
    styleBackground = {
      backgroundColor: generalCustomization?.backgroundColor,
    };
  } else if (generalCustomization?.backgroundType === backgroundTypeEnum.Image) {
    styleBackground = {
      backgroundImage:
        generalCustomization?.backgroundImage != undefined
          ? `url(${generalCustomization?.backgroundImage})`
          : `url("/images/default-theme/background-default-blog-theme-2.png")`,
      backgroundAttachment: "initial",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  let settings = { spaceBetween: 8, slidesPerView: 1 };
  const tableSettings = {
    pageNumber: 1,
    pageSize: 5,
  };

  useEffect(() => {
    handleLoadBlogsData();
  }, []);

  const handleLoadBlogsData = async () => {
    if (isCustomize) {
      setBlogsData(blogDefault);
    } else {
      const storeConfig = getStoreConfig();
      const blogsData = await blogsDataService.getBlogsDataAsync(
        tableSettings.pageNumber,
        tableSettings.pageSize,
        storeConfig?.storeId,
        true,
      );
      setBlogsData(blogsData?.data?.blogs);
    }
  };

  const handleLeftArrow = () => {
    if (swiperRef?.current?.swiper?.activeIndex > 1) {
      setIsActiveColorSwipperLeft(true);
      setIsActiveColorSwipperRight(true);
    } else {
      setIsActiveColorSwipperLeft(false);
    }
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };
  const handleRightArrow = () => {
    if (swiperRef?.current?.swiper?.activeIndex + 2 < blogsData?.length) {
      setIsActiveColorSwipperRight(true);
      setIsActiveColorSwipperLeft(true);
    } else {
      setIsActiveColorSwipperRight(false);
    }
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const renderBlogsItemLeft = (blogsData, index) => {
    const styleBlogsItem = {
      objectFit: "cover",
      objectPosition: "center",
      width: "100%",
      height: "100%",
      borderRadius: "20px",
    };
    return (
      <a className="blog-content-item-card" onClick={() => history.push(`/blog/${blogsData?.urlEncode}`)}>
        <div className="blog-content-item-img">
          <ImageWithFallback
            src={blogsData?.bannerImageUrl ?? defaultImageBlog}
            alt="img"
            // fallbackSrc={advertisementUrl[index]}
            style={styleBlogsItem}
            className="blog-content-item-img-style"
          />
          <div className="blog-content-item-child">
            <div className="blog-content-item-channel" style={{ color: colorGeneral?.titleColor }}>
              {blogsData?.blogCategory}
            </div>
            <div className="blog-content-item-title">{blogsData?.title}</div>
            <div className="blog-content-item-info">
              <div className="blog-content-item-info-item">
                <TotalViewBlogIcon />
                <span className="blog-content-item-info-item-view">
                  {blogsData?.totalView} {translatedData.view}
                </span>
                <CalendarBlogsIcon />
                <span className="blog-content-item-info-item-date">
                  {formatDateBlogs(blogsData?.createdTime, translatedData.month, languageCode)}
                </span>
                <div className="blog-content-item-info-item-by">
                  <span className="blog-content-item-info-item-by-text">{translatedData.by}</span>
                  <span className="blog-content-item-info-item-by-name" style={{ color: colorGeneral?.textColor }}>
                    {blogsData?.creator}
                  </span>
                </div>
              </div>
              <div className="blog-content-item-info-created-user"></div>
            </div>
            <div className="blog-content-item-description" style={{ color: colorGeneral?.textColor }}>
              {blogsData?.description}
            </div>
          </div>
        </div>
      </a>
    );
  };

  const renderBlogsItemRight = (blogsData, index) => {
    const styleBlogsItem = {
      objectFit: "cover",
      objectPosition: "center",
      height: "100%",
      width: "42%",
      borderRadius: "20px",
      minHeight: isCustomize ? "255px" : "220px",
    };
    return (
      <a key={index} href={`/blog/${blogsData?.urlEncode}`} className="blog-content-item-card">
        <div className="blog-content-item-img">
          <ImageWithFallback
            src={blogsData?.bannerImageUrl ?? defaultImageBlog}
            alt="img"
            // fallbackSrc={advertisementUrl[index]}
            style={styleBlogsItem}
            className="blog-content-item-img-style"
          />
          <div className="blog-content-item-child">
            <div className="blog-content-item-channel" style={{ color: colorGeneral?.titleColor }}>
              {blogsData?.blogCategory}
            </div>
            <div className="blog-content-item-title">{blogsData?.title}</div>
            <div className="blog-content-item-info">
              <div className="blog-content-item-info-item">
                <TotalViewBlogIcon />
                <span className="blog-content-item-info-item-view">
                  {blogsData?.totalView} {translatedData.view}
                </span>
                <CalendarBlogsIcon />
                <span className="blog-content-item-info-item-date">
                  {formatDateBlogs(blogsData?.createdTime, translatedData.month, languageCode)}
                </span>
                {isTabletDevice && (
                  <div
                    className="blog-content-item-info-item-by"
                    style={{ marginLeft: isTabletDevice == true ? 12 : "" }}
                  >
                    <span className="blog-content-item-info-item-by-text">{translatedData.by}</span>
                    <span className="blog-content-item-info-item-by-name" style={{ color: colorGeneral?.textColor }}>
                      {blogsData?.creator}
                    </span>
                  </div>
                )}
              </div>
              {!isTabletDevice && (
                <div className="blog-content-item-info-item-by">
                  <span className="blog-content-item-info-item-by-text">{translatedData.by}</span>
                  <span className="blog-content-item-info-item-by-name" style={{ color: colorGeneral?.textColor }}>
                    {blogsData?.creator}
                  </span>
                </div>
              )}

              <div className="blog-content-item-info-created-user"></div>
            </div>
            <div className="blog-content-item-description" style={{ color: colorGeneral?.textColor }}>
              {blogsData?.description}
            </div>
          </div>
        </div>
      </a>
    );
  };

  const handleReadMoreBlog = () => {
    const isStoreAppWebView = window.isStoreAppWebView;
    if (isStoreAppWebView) {
      const payload = {
        key: WebViewMessageEventKeys.viewBlog,
        isViewBlog: true,
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    }
    history.push("/blog");
  };

  return (
    <>
      {blogsData?.length > 0 && (
        <div id={theme2ElementRightId.Blogs} hidden={!blogs?.visible}>
          <div
            className="w-100 blog-home-page-theme2"
            onClick={() => {
              if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.Blogs, null, ThemeKey);
            }}
            style={styleBackground}
          >
            <div className="page-container">
              {!isMobileDevice && (
                <section className="blog-custom-container">
                  <div className="blog-header-text" style={{ color: colorGeneral?.textColor }}>
                    {blogs?.headerText}
                  </div>
                  <div className="blog-title">
                    <div style={{ color: colorGeneral?.titleColor }}>{blogs?.titleText}</div>
                  </div>
                  <div className="blog-custom-content">
                    <div className="blog-content-item-left">{renderBlogsItemLeft(blogsData[0])}</div>
                    <div className="blog-content-item-right">
                      {blogsData.slice(1, 3).map((blogsData, index) => {
                        return renderBlogsItemRight(blogsData, index);
                      })}
                    </div>
                  </div>
                  {blogsData?.length > 3 && (
                    <div onClick={() => history.push("/blog")} className="blog-read-more">
                      <IconReadMoreColor className="blog-read-more-icon" color={colorGeneral?.buttonBackgroundColor} />
                      <span className="blog-read-more-text" style={{ color: colorGeneral?.buttonTextColor }}>
                        {translatedData?.readMore}
                      </span>
                    </div>
                  )}
                </section>
              )}
              {isMobileDevice && (
                <section className="blog-custom-container">
                  <div className="blog-header-text" style={{ color: colorGeneral?.textColor }}>
                    {blogs?.headerText}
                  </div>
                  <div className="blog-title">
                    <div style={{ color: colorGeneral?.titleColor }}>{blogs?.titleText}</div>
                  </div>
                  <div className="button-arrow-blog">
                    <div className="button-left-arrow" onClick={handleLeftArrow}>
                      <SwiperLeftIconCustomize color={isActiveColorSwipperLeft} />
                    </div>
                    <div className="button-right-arrow" onClick={handleRightArrow}>
                      <SwiperRightIconCustomize color={isActiveColorSwipperRight} />
                    </div>
                  </div>

                  <Swiper {...settings} freeMode={true} modules={[FreeMode, Navigation]} ref={swiperRef}>
                    {blogsData.map((blogsData, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <a
                            className="blog-content-item-card"
                            onClick={() => history.push(`/blog/${blogsData?.urlEncode}`)}
                          >
                            <ImageWithFallback
                              src={blogsData?.bannerImageUrl ?? defaultImageBlog}
                              alt="img"
                              // style={styleBlogsItem}
                              className="blog-content-item-img-style"
                            />
                            <div className="blog-content-item-child">
                              <div className="blog-content-item-channel" style={{ color: colorGeneral?.titleColor }}>
                                {blogsData?.blogCategory}
                              </div>
                              <div className="blog-content-item-title">
                                <span className="blog-content-item-title-text">{blogsData?.title}</span>
                              </div>
                              <div className="blog-content-item-info">
                                <div className="blog-content-item-info-item">
                                  <TotalViewBlogIcon />
                                  <span className="blog-content-item-info-item-view">
                                    {blogsData?.totalView} {translatedData.view}
                                  </span>
                                  <CalendarBlogsIcon />
                                  <span className="blog-content-item-info-item-date">
                                    {formatDateBlogs(blogsData?.createdTime, translatedData.month, languageCode)}
                                  </span>
                                </div>
                                <div className="blog-content-item-info-item">
                                  <div className="blog-content-item-info-item-by">
                                    <span className="blog-content-item-info-item-by-text">{translatedData.by}</span>
                                    <span
                                      className="blog-content-item-info-item-by-name"
                                      style={{ color: colorGeneral?.textColor }}
                                    >
                                      {blogsData?.creator}
                                    </span>
                                  </div>
                                </div>
                                <div className="blog-content-item-info-created-user"></div>
                              </div>
                              <div className="blog-content-item-description" style={{ color: colorGeneral?.textColor }}>
                                {blogsData?.description}
                              </div>
                            </div>
                          </a>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                  {blogsData?.length > 3 && (
                    <div
                      onClick={handleReadMoreBlog}
                      className={`blog-read-more ${
                        Boolean(isFromStoreApp) ? "blog-custom-container-padding-bottom" : ""
                      }`}
                    >
                      <IconReadMoreColor className="blog-read-more-icon" color={colorGeneral?.buttonBackgroundColor} />
                      <span className="blog-read-more-text" style={{ color: colorGeneral?.buttonTextColor }}>
                        {translatedData?.readMore}
                      </span>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
