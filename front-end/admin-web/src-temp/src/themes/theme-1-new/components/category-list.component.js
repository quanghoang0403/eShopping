import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { backgroundTypeEnum } from "../constants/store-web-page.constants";

import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { Autoplay, FreeMode, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { handleHyperlinkValue } from "../../utils/helpers";
import "./category-list.component.scss";

export function CategoryList(props) {
  const { config, clickToFocusCustomize, isCustomize = false } = props;
  const history = useHistory();
  const swiperRef = useRef(null);
  const isMaxWidth740 = useMediaQuery({ maxWidth: 740 });
  const isMaxWidth1024 = useMediaQuery({ maxWidth: 1024 });
  let settings = {};
  let min_loop_quantity = 2;
  if (isMaxWidth740) {
    settings = {
      spaceBetween: 8,
      slidesPerView: 2,
    };
  } else if (isMaxWidth1024) {
    settings = {
      spaceBetween: 26,
      slidesPerView: 4,
    };
    min_loop_quantity = 4;
  } else {
    settings = {
      spaceBetween: 78,
      slidesPerView: 5,
    };
    min_loop_quantity = 5;
  }

  const handleLeftArrow = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };
  const handleRightArrow = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const colorGroup = props?.general?.color?.colorGroups?.find(
    (g) => g.id === props?.config?.category?.generalCustomization?.colorGroupId,
  );

  const StyledCategoryList = styled.div`
    display: ${props?.config?.category?.visible ? "block" : "none"};
    background-color: ${(props) =>
      props?.theme?.config?.category?.generalCustomization?.backgroundType === backgroundTypeEnum.Color &&
      props?.theme?.config?.category?.generalCustomization?.backgroundColor};
    background-image: url(${(props) =>
      props?.theme?.config?.category?.generalCustomization?.backgroundType === backgroundTypeEnum.Image &&
      props?.theme?.config?.category?.generalCustomization?.backgroundImage});

    .category-title {
      color: ${colorGroup?.titleColor};
    }
    .category-description {
      color: ${colorGroup?.textColor};
    }
    .category-order-btn {
      background-color: ${colorGroup?.buttonBackgroundColor};
      border-color: ${colorGroup?.buttonBorderColor};
    }
    .category-order-btn .text-btn {
      color: ${colorGroup?.buttonTextColor} !important;
    }
  `;

  const handleHyperlink = (hyperlinkType, hyperlinkValue) => {
    if (hyperlinkType) {
      window.location.href = handleHyperlinkValue(hyperlinkType, hyperlinkValue);
    }
  };

  return (
    <div id="themeCategory">
      <StyledCategoryList className="category-list-homepage">
      <div className="main-session">
      <div
          hidden={config?.category?.categoryList?.length === 0 && true}
          className="button-left-arrow"
          onClick={handleLeftArrow}
        />
        <Swiper
          {...settings}
          ref={swiperRef} 
          freeMode={true}
          modules={[FreeMode, Navigation, Autoplay]}
          lazy={true}
          loop={config?.category?.categoryList?.length > min_loop_quantity}
          speed={1000}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          freeModeMomentumBounce={true}
          scrollbar={{
            el: ".swiper-scrollbar",
            draggable: true,
          }}
        >
          {config?.category?.categoryList
            ?.filter(
              (c) => c.thumbnail || c.title || c.description || c.buttonText || c.hyperlinkType || c.hyperlinkValue,
            )
            .map((item, index) => {
              return (
                <SwiperSlide
                  className={`category-card ${isCustomize ? "category-card-customize" : ""}`}
                  key={index}
                  onClick={() => handleHyperlink(item?.hyperlinkType, item?.hyperlinkValue)}
                >
                  <div className="category-image">
                    <img src={item?.thumbnail} alt={item?.title} className="zoom-image-category-theme1" />
                  </div>
                  <div className="category-content-theme1">
                    <div className="category-title text-line-clamp-1">{item?.title}</div>
                    <div className="category-description text-line-clamp-2">{item?.description}</div>
                  </div>
                </SwiperSlide>
              );
            })}
        </Swiper>
        <div
          hidden={config?.category?.categoryList?.length === 0 && true}
          className="button-right-arrow"
          onClick={handleRightArrow}
        />
      </div>
      </StyledCategoryList>
    </div>
  );
}