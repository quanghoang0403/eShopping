import { useEffect } from "react";
import styled from "styled-components";
import { handleHyperlinkValue } from "../../../../../utils/helpers";
import "./signature-product.component.scss";
import { Button } from "antd";
import SignatureProductComponent from "./SignatureProductComponent";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, EffectCoverflow, FreeMode, Navigation, Pagination } from "swiper";
import { useMediaQuery } from "react-responsive";

const BackgroundType = {
  COLOR: 1,
  IMAGE: 2,
};

export function SignatureProduct(props) {
  const { config, general, isCustomize = false } = props;
  const generalCustomizationId = config?.signatureProduct?.generalCustomization?.colorGroupId;
  const colorGroupSignature = general?.color?.colorGroups?.find((c) => c?.id === generalCustomizationId) ?? {};

  useEffect(() => {
    handleSeeMoreLessMore();
  }, []);

  const handleSeeMoreLessMore = () => {
    let seeMore = document.querySelectorAll(".signature-product-see-more");
    for (let i = 0; i < seeMore.length; i++) {
      seeMore[i].addEventListener("click", () => {
        seeMore[i].parentNode.classList.toggle("active");
      });
      var description = document.getElementById(`signature-product-description-${i}`);
      if (description.scrollHeight > description.clientHeight) {
        seeMore[i].classList.add("active");
      }
    }
  };

  const handleHyperlink = (hyperlinkType, hyperlinkValue) => {
    if (hyperlinkType) {
      window.location.href = handleHyperlinkValue(hyperlinkType, hyperlinkValue);
    }
  };

  const ProductCard = (props) => {
    const { index, title, description, buttonText, imageUrl, hyperlinkValue, hyperlinkType } = props;

    return (
      <div className="signature-product-container main-session">
        <div className="signature-product-image">
          <img src={imageUrl} />
        </div>
        <div className="signature-product-none"></div>
        <div className="signature-product-info">
          <h2 className="signature-product-title">{title}</h2>
          <p id={`signature-product-description-${index}`} className="signature-product-description">
            {description}
          </p>
          <a className="signature-product-see-more"></a>
          <div className="try-now-btn">
            <Button className="signature-product-btn" onClick={() => handleHyperlink(hyperlinkType, hyperlinkValue)}>
              <span className="text-line-clamp-1">{buttonText}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const SignatureProductStyled = styled.div`
    #signature-product {
      display: ${props?.config?.signatureProduct?.visible ? "block" : "none"};
      background-color: ${(props) => {
        if (
          props.theme?.config?.signatureProduct?.generalCustomization?.backgroundType === BackgroundType.IMAGE ||
          props.theme?.config?.general?.generalBackground?.backgroundType === BackgroundType.IMAGE
        ) {
          return;
        }
        return (
          props.theme?.config?.signatureProduct?.generalCustomization?.backgroundColor ??
          props.theme?.config?.general?.generalBackground?.backgroundColor
        );
      }};
      background-image: ${(props) => {
        if (
          props.theme?.config?.signatureProduct?.generalCustomization?.backgroundType === BackgroundType.COLOR ||
          props.theme?.config?.general?.generalBackground?.backgroundType === BackgroundType.COLOR
        ) {
          return;
        }

        let image = `url(${props.theme?.config?.general?.generalBackground?.backgroundImage})`;
        image = `url(${props.theme?.config?.signatureProduct?.generalCustomization?.backgroundImage})`;
        if (props.theme?.config?.signatureProduct?.generalCustomization?.backgroundImage) {
          image = `url(${props.theme?.config?.signatureProduct?.generalCustomization?.backgroundImage})`;
        }

        return image;
      }};
      background-size: ${(props) => {
        if (
          props.theme?.config?.signatureProduct?.generalCustomization?.backgroundType === BackgroundType.COLOR ||
          props.theme?.config?.general?.generalBackground?.backgroundType === BackgroundType.COLOR
        ) {
          return;
        }
        return "100% 100%";
      }};
      background-repeat: ${(props) => {
        if (
          props.theme?.config?.signatureProduct?.generalCustomization?.backgroundType === BackgroundType.COLOR ||
          props.theme?.config?.general?.generalBackground?.backgroundType === BackgroundType.COLOR
        ) {
          return;
        }
        return "no-repeat";
      }};
      .signature-product-mobile, .signature-product {
        svg path {
          fill: ${colorGroupSignature?.titleColor ?? "#026F30"}
        }
      }
      .signature-product-title {
        color: ${colorGroupSignature?.textColor ?? "#000"}
      }
      .signature-product-description {
        color: ${colorGroupSignature?.textColor ?? "#000"}
      }
      .try-now-btn {
        .signature-product-btn {
          background: ${colorGroupSignature?.buttonBackgroundColor ?? "#026F30"};
          border-color: ${colorGroupSignature?.buttonBorderColor ?? "auto"};
          color: ${colorGroupSignature?.buttonTextColor ?? "#FFF"};
          span {
            color: ${colorGroupSignature?.buttonTextColor ?? "#FFF"};
          }

          &:hover {
            background: ${colorGroupSignature?.buttonTextColor ?? "#FFF"};
            span {
              color: ${colorGroupSignature?.buttonBackgroundColor ?? "#026F30"};
            }
          }
        }
      }
    }
  `;

  let settings = {
    slidesPerView: 1,
    spaceBetween: 50
  };

  const isMinWidth1200 = useMediaQuery({minWidth: 1200})

  return (
    <>
      <SignatureProductStyled>
        <div id="signature-product">
          <Swiper
            {...settings}
            speed={500}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={!isMinWidth1200 || isCustomize ? [Navigation, Autoplay] : [Navigation, Autoplay, Pagination]}
            lazy={true}
            scrollbar={{
              el: ".swiper-scrollbar",
              draggable: true,
            }}
            pagination={{
            clickable: true,
          }}
            className="signature-product-theme-1"
          >
            {config?.signatureProduct &&
              config?.signatureProduct?.signatureProducts?.length > 0 &&
              config?.signatureProduct?.signatureProducts?.map((item, index) => {
                return (
                  <SwiperSlide>
                    <SignatureProductComponent
                      index={index}
                      imageUrl={item?.thumbnail}
                      title={item?.nameCategory}
                      description={item?.textArea}
                      buttonText={item?.buttonText}
                      hyperlinkValue={item?.hyperlinkValue}
                      hyperlinkType={item?.hyperlinkType}
                    />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </SignatureProductStyled>
    </>
  );
}
