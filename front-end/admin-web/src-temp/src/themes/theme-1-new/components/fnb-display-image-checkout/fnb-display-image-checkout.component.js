import flashSaleLogo from "../../assets/images/flash-sale-logo.png";
import ImgDefault from "../../assets/images/product-default.png";
import "./fnb-display-image-checkout.component.scss";
export default function FnbDisplayImageCheckoutComponent(props) {
  const { src, isPromotion, promotionTitle, flashSaleTitle, isFlashSale, outOfStockText, isCart } = props;
  return (
    <div className={`fnb-display-image-checkout`}>
      <img className="display-image-checkout" src={Boolean(src) ? src : ImgDefault} />
      {outOfStockText && <div className="out-of-stock-badge">{outOfStockText}</div>}
      {isFlashSale && (
        <div className={isCart ? "flash-sale-cart" : "flash-sale-checkout"}>
          <img src={flashSaleLogo} className="flash-sale-logo-checkout flash-sale-item-thumbnail" />
        </div>
      )}
      {isFlashSale ? (
        <div className="promotion-label-checkout">
          <span>{flashSaleTitle}</span>
        </div>
      ) : (
        isPromotion &&
        Boolean(promotionTitle) &&
        (promotionTitle.includes("%") ? (
          <div className="promotion-label-checkout">
            <span>{promotionTitle}</span>
          </div>
        ) : (
          <div className="promotion-label-checkout-max-value">
            <span>{promotionTitle}</span>
          </div>
        ))
      )}
    </div>
  );
}
