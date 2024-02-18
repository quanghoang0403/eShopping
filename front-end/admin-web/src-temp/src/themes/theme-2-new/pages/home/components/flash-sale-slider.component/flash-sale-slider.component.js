import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { FreeMode, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { EnumAddToCartType } from "../../../../../constants/enums";
import { store } from "../../../../../modules";
import productComboAddToCartServices from "../../../../../services/product-combo-add-to-cart.services";
import { formatTextNumber } from "../../../../../utils/helpers";
import fireImage from "../../../../assets/images/fire.png";
import ProductItem from "../../../../components/product-item";
import { EnumFlashSaleStatus } from "../../../../constants/enum";
import "./flash-sale-slider.component.scss";

export default function FlashSaleSliderComponent(props) {
  const { products, flashSaleStatus, flashSaleId, isCustomize } = props;
  const [t] = useTranslation();
  const translatedData = {
    ended: t("storeWebPage.flashSale.ended", "Ended"),
    endAfter: t("storeWebPage.flashSale.endAfter", "End after"),
    coming: t("storeWebPage.flashSale.coming", "Coming"),
    notOpenYet: t("storeWebPage.flashSale.notOpenYet", "Not open yet"),
    soldOut: t("storeWebPage.flashSale.soldOut", "Sold out"),
    remaining: t("storeWebPage.flashSale.remaining", "Remaining"),
  };
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });
  let spaceBetween = 22.6;
  if (isMaxWidth575) {
    spaceBetween = 22.6;
  }
  const fitSpaceRightLastSlide = -32 * (products?.length - 1) - spaceBetween;
  const branchId = store.getState()?.session?.deliveryAddress?.branchAddress?.id;

  const quickAddToCart = async (data) => {
    let requestData = {
      id: data?.id,
      productPriceId: data?.productPriceId,
      isFlashSale: true,
      flashSaleId: flashSaleId,
    };
    productComboAddToCartServices.quickAddToCart(requestData, EnumAddToCartType.Product, branchId);
  };

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
      navigation={true}
      modules={[FreeMode, Pagination, Navigation]}
      className="flash-sale-slider"
    >
      {products?.map((item, index) => {
        let footerContent = null;
        if (flashSaleStatus === EnumFlashSaleStatus.FlashSaleIsHappening) {
          let StyledQuantityBarProgress = styled.div``;
          if (item?.remainingQuantity > 0) {
            const percentSold = (item?.remainingQuantity / item?.flashSaleQuantity) * 100;
            StyledQuantityBarProgress = styled.div`
              background: linear-gradient(
                90deg,
                #ffb909,
                #ff3a05 ${percentSold}%,
                #ffd39f ${percentSold}%,
                #ffd39f
              ) !important;
            `;
          }

          footerContent = (
            <div className="quantity-bar">
              {item?.remainingQuantity > 0 ? (
                <>
                  <div className="fire">
                    <img src={fireImage}></img>
                  </div>
                  <StyledQuantityBarProgress
                    className="quantity-bar-progress"
                    id={`quantity-bar-progress-${index}`}
                  ></StyledQuantityBarProgress>
                  <div className="quantity-bar-text">{translatedData.remaining}</div>
                  <div className="quantity-bar-number">{formatTextNumber(item?.remainingQuantity)}</div>
                </>
              ) : (
                <div className="sold-out">
                  <div className="quantity-bar-text">{translatedData.soldOut}</div>
                </div>
              )}
            </div>
          );
        }
        return (
          <SwiperSlide>
            <ProductItem
              product={item}
              footerContent={footerContent}
              addProductToCart={() => quickAddToCart(item)}
              useIconAddtoCart={true}
              isDefault={isCustomize}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
