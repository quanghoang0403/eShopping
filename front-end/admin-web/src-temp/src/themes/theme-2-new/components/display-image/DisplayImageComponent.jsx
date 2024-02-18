import flashSaleLogo from "../../assets/images/flash-sale-tag-theme2.png";
import ImgDefault from "../../assets/images/product-default-img-none-radius.png";
import ImageWithFallback from "../fnb-image-with-fallback/fnb-image-with-fallback.component";
import "./DisplayImageComponent.scss";

export default function DisplayImageComponent(props) {
  //Add className prop to modify css of this component. fnb-display-image is default class if not set
  const { src, isPromotion, promotionTitle, isFlashSale, className = "fnb-display-image", onClick } = props;

  function handleOnClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <div className={className} onClick={handleOnClick}>
      <ImageWithFallback src={src} fallbackSrc={ImgDefault} className="display-image" />
      {isPromotion && promotionTitle && (
        <div className="promotion-label">
          <span>{promotionTitle}</span>
        </div>
      )}
      {isFlashSale && (
        <>
          <div className="flash-sale-border"></div>
          <div className="flash-sale">
            <img src={flashSaleLogo} className="flash-sale-logo" />
          </div>
        </>
      )}
    </div>
  );
}
