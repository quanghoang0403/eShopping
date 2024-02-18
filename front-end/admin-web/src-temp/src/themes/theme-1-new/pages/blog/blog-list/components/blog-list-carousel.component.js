import { useMediaQuery } from "react-responsive";
import Slider from "react-slick";
import styled from "styled-components";
import { getThumbnailUrl, handleHyperlinkValue } from "../../../../../utils/helpers";
import { backgroundTypeEnum, theme1ElementCustomize } from "../../../../constants/store-web-page.constants";
import "./blog-list-carousel.component.scss";

export function BlogListCarouselComponent(props) {
  const { slideBannerImgs, config, clickToFocusCustomize } = props;
  const isMaxWidth640 = useMediaQuery({ maxWidth: 640 });
  const sliderSettings = {
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
    <div className="blog-list-slide-original-theme">
      <Slider {...sliderSettings}>
        {slideBannerImgs?.map((item, index) => {
          return (
            <a
              rel="noreferrer"
              onClick={() => {
                if (clickToFocusCustomize) {
                  clickToFocusCustomize(theme1ElementCustomize.Banner, index);
                }
              }}
            >
              {item?.image && (
                <img
                  src={getThumbnailUrl(item?.image, isMaxWidth640 ? "mobile" : "web")}
                  className="slide-image"
                  alt=""
                />
              )}
            </a>
          );
        })}
      </Slider>
    </div>
  );
}
