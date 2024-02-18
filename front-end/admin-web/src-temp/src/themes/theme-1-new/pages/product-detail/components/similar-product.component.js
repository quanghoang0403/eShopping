import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { FreeMode, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import ImgDefault from "../../../assets/icons/img_default.png";
// Import Swiper styles
import { useMediaQuery } from "react-responsive";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { formatTextNumber } from "../../../../utils/helpers";
import { CartPlusIcon, StarVoteIcon } from "../../../assets/icons.constants";
import FnbDisplayImageComponent from "../../../components/fnb-display-image/fnb-display-image.component";
import "./similar-product.component.scss";
export function Theme1SimilarProduct({ similarProducts, addToCart, swiperRef }) {
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });
  let spaceBetween = 52;
  if (isMaxWidth575) {
    spaceBetween = 16;
  }

  const fitSpaceRightLastSlide = -50 * (similarProducts?.length - 1) - spaceBetween;
  const [t] = useTranslation();
  const translatedData = {
    addProductToCart: t("storeWebPage.productDetailPage.addProductToCart", "Add to cart"),
    outOfStock: t("storeWebPage.productDetailPage.outOfStock", "Out Of Stock"),
  };

  return (
    <Swiper
      navigation={false}
      slidesPerView={"auto"}
      spaceBetween={52}
      freeMode={true}
      ref={swiperRef}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode, Pagination, Navigation]}
      slidesOffsetAfter={fitSpaceRightLastSlide}
      breakpoints={{
        576: {
          slidesOffsetAfter: fitSpaceRightLastSlide,
        },
      }}
      className="similar-product-content"
    >
      {similarProducts?.map((item, index) => {
        return (
          <SwiperSlide key={index}>
            <div className="product-card" key={index}>
              <a className="w-100" href={item?.navigateTo ?? "#"}>
                <div className={`product-list-image${item?.isFlashSale ? " flash-sale-border" : ""}`}>
                  <FnbDisplayImageComponent
                    src={item?.thumbnail ?? ImgDefault}
                    isFlashSale={item?.isFlashSale}
                    isPromotion={item?.isPromotion}
                    promotionTitle={item?.promotionTitle}
                    isOutOfStock={item?.isOutOfStock ? true : false}
                    outOfStock={translatedData.outOfStock}
                  />
                </div>

                <div className="product-card-content">
                  <div className="product-name">
                    {item?.priceName ? `${item?.name} (${item?.priceName})` : item?.name}
                  </div>
                  <div className="star-vote">
                    <StarVoteIcon /> 4,0
                  </div>
                  <div className="product-price">
                    <div className="price-container">
                      <div className="selling-price">{formatTextNumber(item?.sellingPrice)}đ</div>
                      {item?.originalPrice > 0 && item?.originalPrice !== item?.sellingPrice ? (
                        <div className="original-price">{formatTextNumber(item?.originalPrice)}đ</div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <Button
                      onClick={(e) => {
                        e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
                        if (addToCart) addToCart(item);
                      }}
                      className={`add-to-cart ${item?.isOutOfStock ? "out-of-stock" : ""}`}
                      disabled={item?.isOutOfStock ? true : false}
                      icon={<CartPlusIcon />}
                    ></Button>
                  </div>
                </div>
              </a>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
