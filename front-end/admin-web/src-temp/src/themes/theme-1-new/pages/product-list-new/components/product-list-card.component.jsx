import React from "react";
import styled from "styled-components";
import ProductCard from "../components/product-card.component";
import "./product-list-card.component.scss";

function ProductListCard(props) {
  const { id, name, listProducts, currency, totalItems, handleAddToCart, styleProductList } = props;

  const StyledProductListCard = styled.div`
    .product-list {
      &__title {
        .title-name {
          color: ${styleProductList?.colorGroup?.textColor};
        }
        .quantity-products {
          color: ${styleProductList?.colorGroup?.titleColor};
        }
      }
    }

    .quantity-products {
      color: ${styleProductList?.colorGroup?.titleColor};
    }
  `;
  return (
    <StyledProductListCard id={`list-products-section-id-${id}`} className="product-list-card-theme1">
      <div className="product-list__title">
        <span className="title-name">{name}</span>
        <span className="quantity-products">{`(${totalItems})`}</span>
      </div>
      <div className="product-list__container">
        {listProducts?.map((item) => {
          return (
            <ProductCard
              product={item}
              key={item.id}
              currency={currency}
              handleAddToCart={handleAddToCart}
              styleProductList={styleProductList}
            />
          );
        })}
      </div>
    </StyledProductListCard>
  );
}

export default ProductListCard;
