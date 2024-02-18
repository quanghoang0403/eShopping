import "./BlogComponent.scss";
import BlogCardComponent from "./components/BlogCardComponent";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from "react-responsive";
import { FreeMode, Navigation } from "swiper";
import { ArrowBlogIcon } from "../../../../assets/icons.constants";
import { useEffect, useRef, useState } from "react";
import { blogDefault } from "../../default-data";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  backgroundTypeEnum,
  theme1ElementCustomize,
  theme1ElementRightId,
} from "../../../../constants/store-web-page.constants";
import { ThemeKey } from "../../../../constants/string.constants";
import { getStoreConfig } from "../../../../../utils/helpers";
import blogsDataService from "../../../../../data-services/blog-data.service";
import defaultConfig from "../../../../default-store.config";
import PageType from "../../../../constants/page-type.constants";

export default function BlogComponent(props) {
  const { clickToFocusCustomize, isCustomize, config, general } = props;
  const blogs = config?.blogs;
  const generalCustomization = blogs?.generalCustomization;
  const swiperRef = useRef(null);
  const isMaxWidth740 = useMediaQuery({ maxWidth: 740 });
  const isMaxWidth1024 = useMediaQuery({ maxWidth: 1024 });
  const [blogList, setBlogList] = useState([]);
  const { t } = useTranslation();
  const colorConfig = general?.color?.colorGroups?.find((c) => c?.id === generalCustomization?.colorGroupId) ?? null;
  const [settings, setSettings] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const defaultBlogImage = defaultConfig?.pages?.find((page) => page.id === PageType.HOME_PAGE)?.config?.blogs.generalCustomization?.backgroundImage;

  const getSettingSwiper = () => {
    if (isMaxWidth740) {
      setSettings({
        spaceBetween: 8,
        slidesPerView: 1,
      });
    } else if (isMaxWidth1024) {
      setSettings({
        spaceBetween: 12,
        slidesPerView: 1,
      });
    } else {
      setSettings({
        spaceBetween: 24,
        slidesPerView: getSlidesPerView(),
      });
    }
  };

  const getSlidesPerView = () => {
    const widthImage = 924;
    const paddingLeft = 182;
    let slidesPerView = parseFloat(
      ((document.querySelector(".blog-body")?.offsetWidth - paddingLeft) / widthImage).toFixed(2),
    );
    if (slidesPerView > blogList.length) {
      slidesPerView = blogList.length;
    }
    return slidesPerView;
  };

  const tableSettings = {
    pageSize: 5,
  };

  let styleBackground = {};
  if (!generalCustomization?.backgroundType || generalCustomization?.backgroundType === backgroundTypeEnum.Color) {
    styleBackground = {
      backgroundColor: generalCustomization?.backgroundColor,
    };
  } else if (generalCustomization?.backgroundType === backgroundTypeEnum.Image) {
    styleBackground = {
      backgroundImage: `url(${generalCustomization?.backgroundImage ?? defaultBlogImage})`,
      backgroundAttachment: "initial",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  useEffect(() => {
    handleLoadBlogsData();
  }, []);

  useEffect(() => {
    getSettingSwiper();
    window.addEventListener("resize", getSettingSwiper);
    return () => {
      window.removeEventListener("resize", getSettingSwiper);
    };
  }, [blogList.length]);

  const handleLoadBlogsData = async () => {
    const storeConfig = getStoreConfig();
    if (isCustomize) {
      setBlogList(blogDefault);
    } else {
      const blogsData = await blogsDataService.getBlogsDataAsync(
        pageNumber,
        tableSettings.pageSize,
        storeConfig?.storeId,
        true,
      );
      if (blogsData?.data?.blogs.length < tableSettings.pageSize) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
      if (blogsData.data?.blogs?.length > 0) {
        let newBlogList = [...blogList, ...blogsData?.data?.blogs];
        setBlogList(newBlogList);
        setPageNumber(pageNumber + 1);
      }
    }
  };

  const StyledBlogComponent = styled.div`
    .blog-title span {
      color: ${colorConfig?.titleColor};
    }
    .blog-body .card .title {
      color: ${colorConfig?.titleColor};
    }
    .blog-body .card .button-see-more {
      background: ${colorConfig?.buttonBackgroundColor};
      color: ${colorConfig?.buttonTextColor};
    }
    .blog-body .card .body .view-author .view {
      color: ${colorConfig?.textColor};
    }
    .blog-body .card .body .view-author .author span {
      color: ${colorConfig?.textColor};
    }
    .blog-body .card .body .description {
      color: ${colorConfig?.textColor};
    }
  `;

  return (
    <div
      id={theme1ElementRightId.Blogs}
      onClick={() => {
        if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.Blogs, null, ThemeKey);
      }}
      style={styleBackground}
      hidden={!blogs?.visible}
    >
      <StyledBlogComponent className="blog-container" style={{ height: isCustomize ? 902 : 940 }}>
        <div className="blog-title">
          <span>{t("blogs.title", "BÀI VIẾT")}</span>
        </div>
        <div className="blog-footer">
          <ArrowBlogIcon className="pre-arrow" onClick={() => swiperRef.current.swiper.slidePrev()} />
          <ArrowBlogIcon className="next-arrow" onClick={() => swiperRef.current.swiper.slideNext()} />
        </div>
        <div className="blog-body">
          <Swiper
            {...settings}
            modules={[FreeMode, Navigation]}
            ref={swiperRef}
            onReachEnd={() => {
              if (isLoading && !isCustomize) {
                handleLoadBlogsData();
              }
            }}
            lazy={true}
          >
            {blogList &&
              blogList?.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <BlogCardComponent isCustomize={isCustomize} blogInfo={item} />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </StyledBlogComponent>
    </div>
  );
}
