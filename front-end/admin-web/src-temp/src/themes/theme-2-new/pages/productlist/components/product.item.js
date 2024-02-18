import { formatTextNumber, StringWithLimitLength } from "../../../../utils/helpers";
import productDefaultImage from "../../../assets/images/product-default-img.jpg";
import ratingIcon from "../../../assets/images/product_star_rating.svg";
import unRatingIcon from "../../../assets/images/product_star_unrating.svg";
import "./product.item.scss";

export default function ProductItem(props) {
  const { colorGroup, product, promotion } = props;
  if (!product) return <></>;

  const product_discount = promotion?.percentNumber ?? 0;
  const product_price = product.productPrices?.length > 0 ? product.productPrices[0].priceValue : undefined;
  const product_price_discount = Math.round((1 - product_discount / 100) * product_price);
  const maxlength = 75;
  const max2Lines = 50;
  const postfix = "...";
  const N_RATING = Math.floor(Math.random() * (5 + 1));
  const backgroundImageStyle = !product?.thumbnail
    ? {
        backgroundImage: "url(" + productDefaultImage + ")",
      }
    : {
        backgroundImage: "url(" + product?.thumbnail + ")",
      };

  //Add product to cart
  const addToCartProduct = () => {};
  const rateProduct = (rating) => {};

  return (
    <>
      <div key={product.id} className="product-main-theme-2">
        <div style={{ flexDirection: "column", display: "flex" }}>
          <div>
            <div className="product-image" style={backgroundImageStyle}>
              {product_discount !== null && product_discount > 0 && (
                <div className="discount-box">
                  <div className="discount-text">{product_discount} %</div>
                </div>
              )}
            </div>
          </div>
          <div className="product-rating">
            {N_RATING >= 1 && (
              <img
                src={ratingIcon}
                alt={product.description}
                style={{ cursor: "pointer" }}
                onClick={() => rateProduct(1)}
              />
            )}
            {N_RATING >= 2 && (
              <img
                src={ratingIcon}
                alt={product.description}
                style={{ cursor: "pointer" }}
                onClick={() => rateProduct(2)}
              />
            )}
            {N_RATING >= 3 && (
              <img
                src={ratingIcon}
                alt={product.description}
                style={{ cursor: "pointer" }}
                onClick={() => rateProduct(3)}
              />
            )}
            {N_RATING >= 4 && (
              <img
                src={ratingIcon}
                alt={product.description}
                style={{ cursor: "pointer" }}
                onClick={() => rateProduct(4)}
              />
            )}
            {N_RATING >= 5 && (
              <img
                src={ratingIcon}
                alt={product.description}
                style={{ cursor: "pointer" }}
                onClick={() => rateProduct(5)}
              />
            )}
            {N_RATING < 1 && (
              <img
                src={unRatingIcon}
                alt={product.description}
                style={{ cursor: "pointer" }}
                onClick={() => rateProduct(1)}
              />
            )}
            {N_RATING < 2 && (
              <img
                src={unRatingIcon}
                alt={product.description}
                style={{ cursor: "pointer" }}
                onClick={() => rateProduct(2)}
              />
            )}
            {N_RATING < 3 && (
              <img
                src={unRatingIcon}
                alt={product.description}
                style={{ cursor: "pointer" }}
                onClick={() => rateProduct(3)}
              />
            )}
            {N_RATING < 4 && (
              <img
                src={unRatingIcon}
                alt={product.description}
                style={{ cursor: "pointer" }}
                onClick={() => rateProduct(4)}
              />
            )}
            {N_RATING < 5 && (
              <img
                src={unRatingIcon}
                alt={product.description}
                style={{ cursor: "pointer" }}
                onClick={() => rateProduct(5)}
              />
            )}
          </div>
          <div className="product-name" title={product.description}>
            {StringWithLimitLength(product.name, max2Lines, postfix)}
          </div>
          <div className="product-description" title={product.description}>
            {StringWithLimitLength(product.description, maxlength, postfix)}
          </div>
          <div className="price-box">
            <div className="price-box-left">
              {product_discount !== null && product_discount > 0 && (
                <div className="product-price">{formatTextNumber(product_price)}</div>
              )}
              <div
                style={{
                  color: colorGroup?.buttonTextColor,
                  background: colorGroup?.buttonBackgroundColor,
                  borderColor: colorGroup?.buttonBorderColor ? colorGroup?.buttonBorderColor : undefined,
                  borderWidth: colorGroup?.buttonBorderColor ? 1 : undefined,
                }}
                className="product-price-with-discount"
              >
                <span>{formatTextNumber(product_price_discount)} VNĐ</span>
              </div>
            </div>
            <div className="cart" onClick={addToCartProduct} title={product.description}></div>
          </div>
        </div>
      </div>
    </>
  );
}
