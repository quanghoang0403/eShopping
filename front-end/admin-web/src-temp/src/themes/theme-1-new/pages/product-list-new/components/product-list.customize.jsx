import React, { useState, useEffect } from "react";
import { currency, listCategoriesNavbar, listSectionGroups } from "../data/default-data";
import NavigationCategory from "./navigation-category.component";
import ProductListCard from "./product-list-card.component";
import "./product-list.component.scss";
import "./product-list.customize.scss";
import { backgroundTypeEnum } from "../../../constants/store-web-page.constants";
import styled from "styled-components";

function ProductListTheme1Customize(props) {
  window.showDeliveryAddressSelector = true;
  const [styleProductList, setStyleProductList] = useState(null);
  const [styleProductListHeader, setStyleProductListHeader] = useState(null);

  // Set style color for product list
  useEffect(() => {
    let newStyleProductList = props?.config?.productsProductList;
    const colorGroupProductsProductList = props?.general?.color?.colorGroups?.find(
      (g) => g.id === props?.config?.productsProductList?.colorGroupId,
    );

    newStyleProductList = {
      ...newStyleProductList,
      colorGroup: colorGroupProductsProductList,
    };

    let newStyleHeaderProduct = props?.config?.header;
    const colorGroupHeaderProduct = props?.general?.color?.colorGroups?.find(
      (g) => g.id === props?.config?.header?.colorGroupId,
    );
    newStyleHeaderProduct = {
      ...newStyleHeaderProduct,
      colorGroup: colorGroupHeaderProduct,
    };
    setStyleProductList(newStyleProductList);
    setStyleProductListHeader(newStyleHeaderProduct);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.config]);

  const PADDING_PRODUCT_LIST = 30;
  const GAP_COLUMN_PRODUCT_LIST = 24;
  const MAX_WIDTH_PRODUCT_CARD = 315;
  const [widthCardProduct, setWidthCardProduct] = useState(MAX_WIDTH_PRODUCT_CARD);

  const handleChangeSizeBrowser = () => {
    // Transfrom to always display 4 items in row
    const isMaxWidth1400 = window.innerWidth <= 1400 && window.innerWidth > 1080;
    const isMaxWidth1080 = window.innerWidth <= 1080;
    const widthSectionProductList = document.getElementsByClassName("product-list-card-theme1")[0]?.offsetWidth;

    // Check case browser zoom in > 110%
    const quantityProduct = isMaxWidth1400 ? 3 : isMaxWidth1080 ? 2 : 4;
    const widthProductCard = Math.min(
      MAX_WIDTH_PRODUCT_CARD,
      (widthSectionProductList -
        GAP_COLUMN_PRODUCT_LIST * (quantityProduct - 1) -
        PADDING_PRODUCT_LIST * 2 -
        5) /
        quantityProduct,
    );

    const elementCategoryList = document.getElementById("wrapper-sticky-slider-category-product-list-theme1-id");
    elementCategoryList.style.maxWidth = `${widthSectionProductList + 2}px`;
    elementCategoryList.style.width = `${widthSectionProductList + 2}px`;
    setWidthCardProduct(widthProductCard);
  };

  useEffect(() => {
    handleChangeSizeBrowser();
    window.addEventListener("resize", handleChangeSizeBrowser);
    return () => {
      window.removeEventListener("resize", handleChangeSizeBrowser);
    };
  }, []);

  const StyledSectionProductList = styled.div`
    .product-list-card-theme1 {
      .product-list {
        &__container {
          padding: ${PADDING_PRODUCT_LIST}px;
          gap: 30px ${GAP_COLUMN_PRODUCT_LIST}px;
          .product-card-theme1 {
            width: ${widthCardProduct}px;
            .product-card {
              &__flashsale-img {
                width: ${widthCardProduct}px;
              }
              &__img-box {
                height: ${widthCardProduct}px;

                &--is-flashsale {
                  height: ${widthCardProduct - 10}px;
                }
              }
              &__img {
                width: ${widthCardProduct}px;
                height: ${widthCardProduct}px;
              }
              &__content {
                height: calc(100% - ${widthCardProduct}px);
                @media (max-width: 1460px) {
                  padding: 14px;
                }
              }
            }
          }
        }
      }
    }
  `;

  return (
    <div className="page-product-list-theme1 page-product-list-theme1--is-customize">
      <div className="banner-top-product-list">
        {styleProductListHeader?.backgroundType === backgroundTypeEnum.Image ? (
          <img className="banner-top-product-list__img" src={styleProductListHeader?.backgroundImage} alt="" />
        ) : (
          <div
            className="banner-top-product-list__banner-color"
            style={{ background: `${styleProductListHeader?.backgroundColor}` }}
          />
        )}
        <span
          className="banner-top-product-list__title"
          style={{ color: `${styleProductListHeader?.colorGroup?.titleColor}` }}
        >
          {styleProductListHeader?.title}
        </span>
      </div>
      <div
        className={`wrapper-nav-and-products ${
          styleProductList?.backgroundType === backgroundTypeEnum.Image
            ? "wrapper-nav-and-products--background-type-image"
            : "wrapper-nav-and-products--background-type-color"
        }`}
        style={
          styleProductList?.backgroundType === backgroundTypeEnum.Image
            ? { backgroundImage: `url(${styleProductList?.backgroundImage})` }
            : { backgroundColor: styleProductList?.backgroundColor }
        }
      >
        <NavigationCategory
          listCategories={listCategoriesNavbar}
          styleProductList={styleProductList}
          isCustomize={true}
        />
        <StyledSectionProductList className="section-product-list">
          {listSectionGroups?.map((item, index) => {
            return (
              <ProductListCard
                key={`product-list-card-${index}}`}
                id={item.id}
                name={item.name}
                listProducts={item.products}
                currency={currency}
                totalItems={item.products?.length ? item.products?.length : 1}
                styleProductList={styleProductList}
              />
            );
          })}
        </StyledSectionProductList>
      </div>
    </div>
  );
}

export default ProductListTheme1Customize;
