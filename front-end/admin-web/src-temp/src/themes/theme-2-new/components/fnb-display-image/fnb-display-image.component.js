import flashSaleLogo from "../../assets/images/flash-sale-tag-theme2.png";
import ImgDefault from "../../assets/images/product-default.png";
import ImageWithFallback from "../fnb-image-with-fallback/fnb-image-with-fallback.component";
import OutOfStockLabelBoxComponent from "../out-of-stock-label-box/out-of-stock-label-box.component";
import "./fnb-display-image.component.scss";

export default function FnbDisplayImageComponent(props) {
  //Add className prop to modify css of this component. fnb-display-image is default class if not set
  const { src, isPromotion, promotionTitle, isFlashSale, className = "fnb-display-image", isOutOfStock } = props;
  const isPromotionTitle = promotionTitle ?? false;
  return (
    <>
      {isPromotion && isPromotionTitle && (
        <div className="promotion-label">
          <span>{promotionTitle}</span>
        </div>
      )}
      <div className={className}>
        <ImageWithFallback src={src} fallbackSrc={ImgDefault} className="display-image" />
        {isFlashSale && (
          <>
            <div className="flash-sale-border"></div>
            <div className="flash-sale">
              <img src={flashSaleLogo} className="flash-sale-logo" />
            </div>
          </>
        )}
        <OutOfStockLabelBoxComponent isShow={isOutOfStock} isCartItem />
      </div>
    </>
  );
}
