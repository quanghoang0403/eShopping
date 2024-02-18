import { useEffect, useState } from "react";
import styled from "styled-components";
import { theme2ElementRightId } from "../../constants/store-web-page.constants";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "../../assets/css/home-page.style.scss";
import "./banner.component.scss";

// import required modules
import { Autoplay, Pagination } from "swiper";
import { handleHyperlinkValue } from "../../../utils/helpers";
import BannerDefault from "../../assets/images/banner_top.png";
import { theme2ElementCustomize } from "../../constants/store-web-page.constants";
import { ThemeKey } from "../../constants/string.constant";

export default function BannerComponent(props) {
  const { config, clickToFocusCustomize } = props;
  const [bannerDataConfig, setBannerDataConfig] = useState([]);

  useEffect(() => {
    setBannerDataConfig(config?.banner);
  }, [props]);

  const StyledMain = styled.div`
    background: ${bannerDataConfig?.backgroundType === 1
      ? bannerDataConfig?.backgroundColor
      : "url(" +
        (bannerDataConfig?.backgroundImage
          ? bannerDataConfig?.backgroundImage
          : "/images/default-theme/theme2-banner-default.png") +
        ")"};
  `;

  const slides = bannerDataConfig?.bannerList?.map((item, index) => (
    <SwiperSlide key={index}>
      <div className="swiper-slide-banner-theme2">
        <a href={handleHyperlinkValue(item?.hyperlinkType, item?.hyperlinkValue)}>
          {item?.imageUrl ? (
            <img src={item?.imageUrl} className="banner-top-img" loading="lazy" alt="" />
          ) : (
            <img src={BannerDefault} className="banner-top-img" loading="lazy" alt="" />
          )}
        </a>
      </div>
    </SwiperSlide>
  ));

  return (
    <div
      id={theme2ElementRightId.Banner}
      onClick={(event) => {
        clickToFocusCustomize && clickToFocusCustomize(theme2ElementCustomize.Banner, null, ThemeKey);
      }}
    >
      <StyledMain
        className="banner-homepage-theme2"
        hidden={!bannerDataConfig?.visible}
        id={theme2ElementRightId.Banner}
      >
        <Swiper
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
        >
          {slides}
        </Swiper>
      </StyledMain>
    </div>
  );
}
