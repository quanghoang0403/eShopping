import { Row } from "antd";
import styled from "styled-components";
import { formatTextNumber, roundNumber } from "../../../utils/helpers";
import productDefaultImage from "../../assets/images/product-default.png";
import { FnbAddNewButton } from "../../components/fnb-add-new-button/fnb-add-new-button";
import { comboType } from "../../constants/store-web-page.constants";
import "./product-card.component.scss";
import { useTranslation } from "react-i18next";

export function ProductCardComboComponent(props) {
  const [t] = useTranslation();
  const translatedData = {
    addProductToCart: t("storeWebPage.productDetailPage.addProductToCart", "Thêm vào giỏ hàng"),
  };

  const { combo, addProductToCart, calculatorOriginalPriceComboSpecific, productStyles } = props;

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
    }
  `;

  return (
    <Row>
      {combo?.comboTypeId === comboType.comboProductPrice.id ? (
        <StyledCardProductList className="product-card-theme-1">
          <div className="product-card">
            <a href={`/combo-detail/${comboType.comboProductPrice.path}/${combo?.id}`}>
              <img src={combo?.thumbnail || productDefaultImage} className="product-list-image" />
              <div className="product-name">{combo?.name}</div>
            </a>
            <div className="product-price-discount">
              <div className="product-price">{formatTextNumber(combo?.sellingPrice)}đ</div>
              <div className="promotion-tag">
                {"-" + formatTextNumber(roundNumber(100 - (combo?.sellingPrice / combo?.originalPrice) * 100, 0)) + "%"}
              </div>
              <div className="product-discount">{formatTextNumber(combo?.originalPrice)}đ</div>
            </div>
            <div className="product-description">{combo?.description}</div>
          </div>
          <div className="btn-add-to-cart">
            <FnbAddNewButton
              className="custom-btn-add-cart"
              onClick={() => addProductToCart(combo?.id)}
              text={translatedData.addProductToCart}
              hideIcon={true}
            />
          </div>
        </StyledCardProductList>
      ) : combo?.comboTypeId === comboType.comboPricing.id ? (
        <>
          {combo?.comboPricings?.map((pricingItem, index) => (
            <StyledCardProductList className="product-card-theme-1" key={index}>
              <div className="product-card">
                <a href={`/combo-detail/${comboType.comboPricing.path}/${pricingItem?.id}`}>
                  <img src={combo?.thumbnail || productDefaultImage} className="product-list-image" />
                  <div className="product-name">{pricingItem?.customName ?? pricingItem?.comboName}</div>
                </a>
                <div className="product-price-discount">
                  <div className="product-price">{formatTextNumber(pricingItem?.sellingPrice)}đ</div>
                  <div className="promotion-tag">
                    {"-" +
                      formatTextNumber(
                        roundNumber(100 - (pricingItem?.sellingPrice / pricingItem?.originalPrice) * 100, 0)
                      ) +
                      "%"}
                  </div>
                  <div className="product-discount">{formatTextNumber(pricingItem?.originalPrice)}đ</div>
                </div>
                <div className="product-description">{combo?.description}</div>
              </div>
              <div className="btn-add-to-cart">
                <FnbAddNewButton
                  className="custom-btn-add-cart"
                  onClick={() => addProductToCart(pricingItem.id)}
                  text={translatedData.addProductToCart}
                  hideIcon={true}
                />
              </div>
            </StyledCardProductList>
          ))}
        </>
      ) : (
        <></>
      )}
    </Row>
  );
}
