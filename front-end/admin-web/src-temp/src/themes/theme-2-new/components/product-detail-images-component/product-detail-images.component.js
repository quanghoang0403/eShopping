import { useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./product-detail-images.component.scss";

export default function ProductDetailImagesComponent({
  images,
  promotion,
  isPromotion,
  classPromotion = "promotional-product",
  isNavigation = false,
  isLoop = false,
  isShowImageBottom = false,
}) {
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
        {isPromotion && (
          <div className={classPromotion}>
            <span>{promotion}</span>
          </div>
        )}
        {images?.map((image, key) => (
          <SwiperSlide className="slide-image" key={key}>
            <img className="image-zoom-in" src={image?.imageUrl} />
          </SwiperSlide>
        ))}
      </Swiper>
      {isShowImageBottom && (
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
              <img className="image-zoom-out" src={image?.imageUrl} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
}
