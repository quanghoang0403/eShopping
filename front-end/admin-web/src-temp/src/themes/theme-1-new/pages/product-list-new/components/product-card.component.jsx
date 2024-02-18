import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import styled from "styled-components";
import { EnumAddToCartType } from "../../../../constants/enums";
import { formatTextNumber, roundNumber } from "../../../../utils/helpers";
import { AddToCartIcon } from "../../../assets/icons.constants";
import BackgroundFlashSale from "../../../assets/images/flash-sale-background.png";
import FlashSaleProductBottom from "../../../assets/images/flash-sale-product-card.png";
import ImgDefault from "../../../assets/images/product-default.png";
import { ComboType } from "../../../constants/combo.constants";
import "./product-card.component.scss";

function ProductCard(props) {
  const history = useHistory();
  const { product, currency, handleAddToCart, styleProductList } = props;

  const [tagDiscount, setTagDiscount] = useState("");
  const navigateToProductDetail = () => {
    let url = "";
    if (product.isCombo) {
      if (product.comboTypeId === ComboType.SPECIFIC) {
        url = `/combo-detail/combo-product-price/${product.id}`;
      }
      if (product.comboTypeId === ComboType.FLEXIBLE) {
        url = `/combo-detail/combo-pricing/${product.id}`;
      }
    } else {
      url = `/product-detail/${product.id}`;
    }
    history.push(url);
  };

  const StyledProductCard = styled.div`
    @media (min-width: 1281px) {
      :hover {
        .product-card {
          &__content {
            background: ${styleProductList?.colorGroup?.buttonBackgroundColor};
          }
        }
      }
    }
    .product-card {
      &__title {
        color: ${styleProductList?.colorGroup?.textColor};
      }
      &__price-sell {
        color: ${styleProductList?.colorGroup?.titleColor};
      }
    }
  `;

  const onClickAddToCart = (product) => {
    let data = {};
    if (product.isCombo) {
      data = {
        id: product.id,
        isCombo: true,
        type:
          product.comboTypeId === ComboType.SPECIFIC
            ? EnumAddToCartType.ComboProductPrice
            : EnumAddToCartType.ComboPricing,
        data: product?.data,
      };
    } else {
      data = {
        flashSaleId: product?.flashSaleId,
        id: product.id,
        isCombo: false,
        isFlashSale: product.isFlashSale,
        productPriceId: product.productPriceId,
        type: EnumAddToCartType.Product,
      };
    }

    if (handleAddToCart) {
      handleAddToCart(data);
    }
  };

  useEffect(() => {
    let tag = "";
    if (product?.originalPrice > product?.sellingPrice) {
      if (product?.isCombo) {
        tag = `-${formatTextNumber(roundNumber(100 - (product?.sellingPrice / product?.originalPrice) * 100, 0))}%`;
      } else {
        if (product?.isFlashSale) {
          tag = `-${formatTextNumber(roundNumber(100 - (product?.sellingPrice / product?.originalPrice) * 100, 0))}%`;
        } else {
          tag = `-${product?.promotionTag}`;
        }
      }
    }
    setTagDiscount(tag);
  }, [currency, product]);

  return (
    <StyledProductCard className="product-card-theme1">
      {product.isFlashSale && <img className="product-card__flashsale-img" src={BackgroundFlashSale} alt="" />}
      <div
        className={`product-card__img-box ${product.isFlashSale ? "product-card__img-box--is-flashsale" : ""}`}
        onClick={navigateToProductDetail}
      >
        {tagDiscount !== "" && <div className="product-card__percent-discount">{tagDiscount}</div>}
        <img alt="" src={product.thumbnail ? product.thumbnail : ImgDefault} className="product-card__img" />
        {product.isFlashSale && <img className="product-card__flashsale-bottom" src={FlashSaleProductBottom} alt="" />}
      </div>
      <div className="product-card__content">
        <div className="product-card__title" onClick={navigateToProductDetail}>
          {product?.priceName ? `${product?.name} (${product?.priceName})` : product?.name}
        </div>
        <div className="product-card__bottom">
          <div className="product-card__price-block">
            <span className="product-card__price-sell">{`${formatTextNumber(product.sellingPrice)} ${currency}`}</span>
            {product?.originalPrice > product?.sellingPrice && (
              <span className="product-card__price-discount">{`${formatTextNumber(
                product.originalPrice,
              )} ${currency}`}</span>
            )}
          </div>
          <div className="product-card__btn-add-to-cart">
            <AddToCartIcon onClick={() => onClickAddToCart(product)} />
          </div>
        </div>
      </div>
    </StyledProductCard>
  );
}

export default ProductCard;
