import { Row } from "antd";
import styled from "styled-components";
import { formatTextNumber, roundNumber, roundNumberBaseCurrency, StringWithLimitLength } from "../../../utils/helpers";
import productDefaultImage from "../../assets/images/product-default.png";
import { FnbAddNewButton } from "../../components/fnb-add-new-button/fnb-add-new-button";
import FnbDisplayImageComponent from "../../components/fnb-display-image/fnb-display-image.component";
import "./product-card.component.scss";
import { useTranslation } from "react-i18next";

export function ProductCardComponent(props) {
  const [t] = useTranslation();
  const translatedData = {
    addProductToCart: t("storeWebPage.productDetailPage.addProductToCart", "Thêm vào giỏ hàng"),
    outOfStock: t("storeWebPage.productDetailPage.outOfStock", "outOfStock"),
  };
  const {
    productList,
    storeCurrencyCode,
    storeCurrencySymbol,
    addProductToCart,
    isDefault,
    productStyles,
    isLoadingOutOfStock,
    setIsLoadingOutOfStock,
  } = props;
  const path = props?.path ?? "";

  const StyledCardProductList = styled.div`
    .product-price {
      color: ${productStyles?.colorGroup?.titleColor};
    }

    .product-name {
      color: ${productStyles?.colorGroup?.textColor};
    }

    .custom-btn-add-cart {
      border: 1px solid ${productStyles?.colorGroup?.buttonBorderColor};
      color: ${productStyles?.colorGroup?.buttonTextColor};
      background-color: ${productStyles?.colorGroup?.buttonBackgroundColor};
      .loading-color {
        color: ${productStyles?.colorGroup?.buttonTextColor};
      }
    }
  `;

  return (
    <Row>
      {productList?.map((item, index) => {
        let product = item?.productPrices[item?.defaultProductPriceIndex ?? 0];
        return (
          <StyledCardProductList className="product-card-theme-1" key={index}>
            <div className="product-card">
              <a className="w-100" href={`${path}/product-detail/${item?.id}`}>
                <div className={`product-list-image${item?.isFlashSale ? " flash-sale-border" : ""}`}>
                  <FnbDisplayImageComponent
                    src={
                      item?.thumbnail == null || item?.thumbnail.trim() === "" ? productDefaultImage : item?.thumbnail
                    }
                    isOutOfStock={false}
                    outOfStock={translatedData.outOfStock}
                    isFlashSale={item?.isFlashSale}
                  />
                </div>

                <div className="product-name">{StringWithLimitLength(item?.name, 60, "...")}</div>
              </a>
              <div className="product-price-discount">
                <div className="product-price">
                  {product?.priceValue < 0
                    ? 0
                    : formatTextNumber(roundNumberBaseCurrency(product?.priceValue, storeCurrencyCode))}
                  {storeCurrencySymbol}
                </div>
                {product?.originalPrice !== product?.priceValue && product?.originalPrice > 0 ? (
                  <>
                    <div className="promotion-tag">
                      {item?.isFlashSale ? (
                        "-" +
                        formatTextNumber(roundNumber(100 - (product?.priceValue / product?.originalPrice) * 100, 0)) +
                        "%"
                      ) : item?.isDiscountPercent === true ? (
                        "-" + formatTextNumber(roundNumber(item?.discountValue, 0)) + "%"
                      ) : (
                        <div
                          className={`promotion-tag-discount-value ${
                            item?.discountValue > 99999999 && "promotion-tag-discount-max-value"
                          }`}
                        >
                          {"-" + formatTextNumber(item?.discountValue) + "đ"}
                        </div>
                      )}
                    </div>
                    <div className="product-discount">
                      {formatTextNumber(roundNumberBaseCurrency(product?.originalPrice, storeCurrencyCode))}
                      {storeCurrencySymbol}
                    </div>
                  </>
                ) : (
                  <div className="product-discount d-none">0</div>
                )}
              </div>
              {Boolean(isDefault) ? <></> : <div className="product-description">{item?.description}</div>}
            </div>
            <div className="btn-add-to-cart">
              <FnbAddNewButton
                className="custom-btn-add-cart btn-cart"
                onClick={() => {
                  addProductToCart(item, product);
                  setIsLoadingOutOfStock(true);
                }}
                text={translatedData.addProductToCart}
                hideIcon={true}
                isNormal={true}
                disabled={false}
                loading={isLoadingOutOfStock}
                keyItem={item?.id}
                //className={`custom-btn-add-cart btn-cart ${'out-of-stock'}`}
                //text={translatedData.outOfStock}
              />
            </div>
          </StyledCardProductList>
        );
      })}
    </Row>
  );
}
