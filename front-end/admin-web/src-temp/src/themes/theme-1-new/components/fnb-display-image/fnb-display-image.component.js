import flashSaleLogo from "../../assets/images/flash-sale-logo.png";
import ImgDefault from "../../assets/images/product-default.png";
import ImageWithFallback from "../fnb-image-with-fallback/fnb-image-with-fallback.component";
import "./fnb-display-image.component.scss";
export default function FnbDisplayImageComponent(props) {
  //Add className prop to modify css of this component. fnb-display-image is default class if not set
  const {
    src,
    isPromotion,
    promotionTitle,
    isFlashSale,
    flashSaleDiscountPercent,
    className = "fnb-display-image",
    bestSellingProduct,
    isOutOfStock = false,
    outOfStock = "",
    isBestSellingProduct = false
  } = props;
  return (
    <div className={className}>
      <ImageWithFallback
        src={src}
        fallbackSrc={bestSellingProduct ? bestSellingProduct : ImgDefault}
        className="display-image"
      />
      {isOutOfStock && <div className="out-of-stock-badge">{outOfStock}</div>}
      {isPromotion && (
        <div className="promotion-label">
          <span>{promotionTitle}</span>
        </div>
      )}
      {isFlashSale && (
        <div className="flash-sale">
          <img src={flashSaleLogo} className="flash-sale-logo" />
        </div>
      )}
      {isFlashSale && flashSaleDiscountPercent && !isBestSellingProduct && (
        <div className="flash-sale-discount">
          <span>-{flashSaleDiscountPercent}%</span>
        </div>
      )}
      {isBestSellingProduct && (
        <div className="flash-sale-discount">
          <span>{promotionTitle}</span>
        </div>
      )}
    </div>
  );
}
