import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import Slider from "react-slick";
import styled from "styled-components";
import { getThumbnailUrl, handleHyperlinkValue } from "../../utils/helpers";
import { backgroundTypeEnum, theme1ElementCustomize } from "../constants/store-web-page.constants";
import "./gofnb-carousel.component.scss";

export function GoFnBCarousel(props) {
  const { slideBannerImgs, config, clickToFocusCustomize } = props;
  const isMaxWidth640 = useMediaQuery({ maxWidth: 640 });
  const sliderSettings = useMemo(() => {
    return {
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 5000,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      cssEase: "ease-out",
      speed: 700,
    };
  }, []);
  const StyledSlideBanner = styled.div`
    background-color: ${props?.config?.banner?.backgroundType === backgroundTypeEnum.Color
      ? props?.config?.banner?.backgroundColor
      : ""};
    background-image: url(${props?.config?.banner?.backgroundType === backgroundTypeEnum.Image
      ? props?.config?.banner?.backgroundImage
      : ""});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    .not-show {
      display: none !important;
    }
  `;

  return (
    <StyledSlideBanner>
      <div id="themeBanner">
        <div className="slide-original-theme" hidden={!config?.banner?.visible}>
          <Slider {...sliderSettings}>
            {config?.banner?.bannerList.map((item, index) => {
              return (
                <a
                  href={handleHyperlinkValue(item?.hyperlinkType, item?.hyperlinkValue)}
                  rel="noreferrer"
                  onClick={() => {
                    if (clickToFocusCustomize) {
                      clickToFocusCustomize(theme1ElementCustomize.Banner, index);
                    }
                  }}
                >
                  {item?.imageUrl && (
                    <img
                      src={getThumbnailUrl(item?.imageUrl, isMaxWidth640 ? "mobile" : "web")}
                      className="slide-image"
                      loading="lazy"
                      alt=""
                    />
                  )}
                </a>
              );
            })}
          </Slider>
        </div>
      </div>
    </StyledSlideBanner>
  );
}
