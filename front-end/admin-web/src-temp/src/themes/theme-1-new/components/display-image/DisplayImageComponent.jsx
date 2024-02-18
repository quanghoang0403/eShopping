import ImgDefault from "../../assets/images/product-default.png";
import ImageWithFallback from "../fnb-image-with-fallback/fnb-image-with-fallback.component";
import "./DisplayImageComponent.scss";
export default function DisplayImageComponent(props) {
  //Add className prop to modify css of this component. fnb-display-image is default class if not set
  const { src, promotionTag, className, onClick } = props;

  function handleOnClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <div className={`pos-display-image ${className}`} onClick={handleOnClick}>
      <ImageWithFallback src={src} fallbackSrc={ImgDefault} className="display-image" />
      {promotionTag && (
        <div className="promotion-label">
          <span>{promotionTag}</span>
        </div>
      )}
    </div>
  );
}
