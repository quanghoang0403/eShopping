import { useMediaQuery } from "react-responsive";
import { FreeMode, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import FlashSaleProductComponent from "../flash-sale-product/flash-sale-product.component";
import "./flash-sale-slider.component.scss";

export default function FlashSaleSliderComponent(props) {
  const { products, flashSaleStatus } = props;
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });

  let spaceBetween = 32;
  if (isMaxWidth575) {
    spaceBetween = 16;
  }
  const fitSpaceRightLastSlide = -32 * (products?.length - 1) - spaceBetween;

  return (
    <Swiper
      slidesPerView={"auto"}
      spaceBetween={32}
      slidesOffsetAfter={fitSpaceRightLastSlide}
      freeMode={true}
      pagination={{
        clickable: true,
      }}
      breakpoints={{
        576: {
          slidesOffsetAfter: fitSpaceRightLastSlide,
        },
      }}
      modules={[FreeMode, Pagination]}
      className="flash-sale-slider"
    >
      {products.map((item, index) => {
        return (
          <SwiperSlide key={index}>
            <FlashSaleProductComponent product={item} index={index} flashSaleStatus={flashSaleStatus} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
