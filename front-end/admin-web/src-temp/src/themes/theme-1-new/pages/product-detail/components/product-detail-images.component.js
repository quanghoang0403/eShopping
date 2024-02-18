import { useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./product-detail-images.component.scss";

export default function ProductDetailImagesComponent(props) {
  const {
    images,
    promotion,
    isPromotion,
    classPromotion = "promotional-product",
    isNavigation = false,
    isLoop = false,
    isOutOfStock = false,
    outOfStock = null,
  } = props;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        loop={isLoop}
        spaceBetween={0}
        navigation={isNavigation}
        thumbs={{ swiper: thumbsSwiper }}
        centeredSlides={false}
        modules={[FreeMode, Navigation, Thumbs]}
        className="product-detail-image-swiper"
      >
        {isPromotion && promotion !== "" && (promotion > 0 || promotion?.length > 0) && (
          <div className={classPromotion}>
            <span>{promotion}</span>
          </div>
        )}
        {images.map((image) => (
          <SwiperSlide className="slide-image" key={image.id}>
            <div>
              <img className="image-zoom-in" src={image?.imageUrl} alt={image?.altText} />
              {isOutOfStock && <div className="out-of-stock-badge">{outOfStock}</div>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={isLoop}
        spaceBetween={10}
        slidesPerView={images?.length}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper swiper-small-image"
      >
        {images.map((image) => (
          <SwiperSlide className="image-zoom-out-slide">
            <img className="image-zoom-out" src={image?.imageZoomOutUrl} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
