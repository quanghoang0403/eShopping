import { Card } from "antd";
import { HyperlinkType } from "../../constants/hyperlink-type.constants";
import { formatTextNumber, handleHyperlinkValue } from "../../utils/helpers";
import { AddToCart } from "../assets/icons.constants";
import productDefaultImage from "../assets/images/product-default-img-none-radius.png";
import ratingIcon from "../assets/images/product_star_rating.svg";
import unRatingIcon from "../assets/images/product_star_unrating.svg";
import { comboTypeEnum } from "../constants/store-web-page.constants";
import FnbDisplayImageComponent from "./fnb-display-image/fnb-display-image.component";
import ProductComboAddToCart from "./product-combo-add-to-cart/product-combo-add-to-cart.component";
import "./product-item.scss";

/**
 * Model: product = {
            id: {value},
            name: {value},
            thumbnail: {value},
            sellingPrice: {value},
            originalPrice: {value},
            description: {value},
            isFlashSale: {value},
            promotionTitle: {value},
            navigateTo: {value},
          };
 */
export default function ProductItem(props) {
  const {
    colorGroup,
    product,
    footerContent,
    isCombo,
    pricingItem,
    combo,
    useIconAddtoCart = false,
    addProductToCart,
    isDefault,
    className,
    isMockup = false,
  } = props;

  if (!product) return <></>;

  const N_RATING = 5;

  const priceName = product?.productPrices?.[0]?.priceName;

  const rateProduct = (rating) => {};

  //Add product to cart
  const addToCartProduct = () => {
    if (isMockup) return;
    if (addProductToCart) {
      if (isCombo === false) {
        addProductToCart(product?.productPrices[product?.defaultProductPriceIndex ?? 0], product);
      } else {
        if (combo?.comboTypeId === comboTypeEnum.comboProductPrice.id) {
          addProductToCart(combo.id);
        } else {
          addProductToCart(pricingItem?.id);
        }
      }
    }
  };

  const onHandleAddFastProductByPlatforms = () => {
    let isStoreAppWebView = window.isStoreAppWebView;
    if (isStoreAppWebView == true) {
      if (!isCombo) {
        const values = {};
        if (product?.productPrices?.length > 0) {
          const productPrice = product?.productPrices[product?.defaultProductPriceIndex ?? 0];
          values.productPriceId = productPrice?.id;
        } else {
          values.productPriceId = product?.productPriceId;
        }
        values.productId = product?.id;
        let payload = {
          key: "addFastProductToCart",
          value: values,
        };

        window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      }
    } else {
      addToCartProduct();
    }
  };

  const generateProductDetailUrl = (productId, productItem) => {
    const arrParam = window.location.pathname.split("/");
    const prefixDefault = isDefault ? "/" + arrParam[1] + "/" + arrParam[2] : "";
    if (productItem?.navigateTo) {
      window.location.href = prefixDefault + productItem?.navigateTo;
    } else {
      if (productId) {
        window.location.href = prefixDefault + handleHyperlinkValue(HyperlinkType.PRODUCT_DETAIL, productId);
      }
    }
  };

  return (
    <>
      <Card key={product.id} className={`product-item-card ${className ?? "product-main-theme2"}`}>
        <div
          style={{ flexDirection: "column", display: "flex", width: "100%" }}
          className="product-main-content-theme2"
        >
          <div
            className="product-img"
            onClick={() => {
              if (!isMockup) generateProductDetailUrl(product?.id, product);
            }}
          >
            <FnbDisplayImageComponent
              src={Boolean(product?.thumbnail) ? product?.thumbnail : productDefaultImage}
              isFlashSale={product?.isFlashSale}
              isPromotion={product?.productPrices?.[0]?.promotionTag !== null || product?.promotionTitle !== null}
              promotionTitle={product?.productPrices?.[0]?.promotionTag ?? product?.promotionTitle}
            />
          </div>
          <div className="product-rating m-content">
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
          <div className="m-content">
            <div
              className="product-name"
              title={priceName ? `${product?.name} (${priceName})` : product?.name}
              onClick={() => generateProductDetailUrl(product?.id, product)}
            >
              {priceName ? `${product?.name} (${priceName})` : product?.name}
            </div>
            <div className="product-description" >
              {product.description}
            </div>
          </div>
          <div className="price-box">
            <div className="price-box-left">
              {product?.originalPrice > product?.sellingPrice && (
                <div className="product-price">{formatTextNumber(product?.originalPrice)}đ</div>
              )}
              <div
                style={{
                  color: colorGroup?.titleColor,
                }}
                className="product-price-with-discount"
              >
                {formatTextNumber(Math.round(product?.sellingPrice))} đ
              </div>
            </div>
            {useIconAddtoCart ? (
              <div onClick={onHandleAddFastProductByPlatforms} style={{ display: "flex" }}>
                <AddToCart
                  className="cart"
                  style={{
                    fill: colorGroup?.buttonTextColor,
                    backgroundColor: colorGroup?.buttonBackgroundColor,
                    borderColor: colorGroup?.buttonBorderColor ? colorGroup?.buttonBorderColor : undefined,
                    borderWidth: colorGroup?.buttonBorderColor ? 1 : undefined,
                  }}
                  alt={product.description}
                />
              </div>
            ) : (
              <ProductComboAddToCart
                isCombo={isCombo}
                product={product}
                combo={combo}
                pricingItem={pricingItem}
                colorGroup={colorGroup}
              />
            )}
          </div>
          <>{footerContent}</>
        </div>
      </Card>
    </>
  );
}
