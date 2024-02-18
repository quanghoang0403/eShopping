import { useEffect } from "react";
import { calculatePercentage, getLabelPromotion } from "../../../../../utils/helpers";
import ProductItem from "../../../../components/product-item";
import { comboTypeEnum } from "../../../../constants/store-web-page.constants";
import ProductListCategoryLoadingComponent from "./product-list-category-loading.component";
import { useScrollSpy } from "./product-list-scroll-spy.provider";
import { Row } from "antd";

const ProductListRowComponent = (props) => {
  const { id, row = undefined, data = [], isLoading = false, addToCart = undefined } = props;
  const { productStyles, categories, currency } = useScrollSpy();

  useEffect(() => {
    if (categories.length > 0) {
      let arrParam = window.location.pathname.split("/");
      let idParam = arrParam.slice(-1)[0];
      if (idParam) {
        const tabActive = document.getElementById("title_" + idParam);
        tabActive && tabActive.click();
      }
    }
  }, [categories]);

  const renderProductDetail = (categoryID, products) => {
    return (
      <>
        <div key={categoryID + "-product-list"} className="product-list">
          {products?.map((p, index) => {
            let promotionTitle = null;
            const sellingPrice = p?.productPrices?.[p?.defaultProductPriceIndex ?? 0]?.priceValue;
            const originalPrice = p?.productPrices?.[p?.defaultProductPriceIndex ?? 0]?.originalPrice;
            if (p?.isHasPromotion || p?.isFlashSale) {
              promotionTitle = getLabelPromotion(
                p?.isFlashSale,
                p?.isDiscountPercent,
                p?.discountValue,
                p?.isHasPromotion,
                originalPrice,
                sellingPrice,
                "đ",
                false,
              );
            }
            let productItem = {
              ...p,
              id: p?.id,
              name: p?.name,
              thumbnail: p?.thumbnail,
              sellingPrice: sellingPrice,
              originalPrice: originalPrice,
              description: p?.description,
              isFlashSale: p?.isFlashSale,
              promotionTitle: promotionTitle,
              navigateTo: `/product-detail/${p?.id}`,
            };
            const promotion = p.isDiscountPercent ? { percentNumber: p.discountValue } : undefined;
            return (
              <ProductItem
                key={index}
                product={productItem}
                colorGroup={productStyles?.colorGroup}
                promotion={promotion}
                isCombo={false}
                addProductToCart={() => addToCart && addToCart(productItem)}
                useIconAddtoCart={true}
                {...props}
              />
            );
          })}
        </div>
      </>
    );
  };
  const renderComboDetail = (combo) => {
    if (combo?.comboTypeId === comboTypeEnum?.comboPricing?.id)
      return (
        <>
          <div key={combo.id + "-product-list"} className="product-list">
            {combo.comboPricings?.map((comboPricing, index) => {
              const p = {
                ...comboPricing,
                id: comboPricing.comboId,
                name: comboPricing?.customName ?? comboPricing.comboName,
                thumbnail: combo?.thumbnail,
                sellingPrice: comboPricing?.sellingPrice,
                originalPrice: comboPricing?.originalPrice,
                description: combo?.description,
                promotionTitle: calculatePercentage(comboPricing?.sellingPrice, comboPricing?.originalPrice),
                navigateTo: `/combo-detail/${comboTypeEnum.comboPricing.path}/${comboPricing.id}`,
              };

              const promotion = {
                percentNumber: Math.round(
                  ((comboPricing?.originalPrice - comboPricing?.sellingPrice) * 100) / comboPricing?.originalPrice,
                ),
              };
              return (
                <ProductItem
                  key={index}
                  product={p}
                  colorGroup={productStyles?.colorGroup}
                  promotion={promotion}
                  isCombo={true}
                  pricingItem={comboPricing}
                  combo={combo}
                  addProductToCart={(id) => {
                    addToCart && addToCart({ ...p, id, type: combo.comboTypeId, isCombo: true });
                  }}
                  useIconAddtoCart={true}
                />
              );
            })}
          </div>
        </>
      );

    //Specific combo
    const p = {
      ...combo,
      id: combo.comboId,
      name: combo?.title,
      thumbnail: combo?.thumbnail,
      sellingPrice: combo?.sellingPrice,
      originalPrice: combo?.originalPrice,
      description: combo?.description,
      promotionTitle: calculatePercentage(combo?.sellingPrice, combo?.originalPrice),
      navigateTo: `/combo-detail/${comboTypeEnum.comboProductPrice.path}/${combo.id}`,
    };

    const promotion = {
      percentNumber: Math.round(((combo?.originalPrice - combo?.sellingPrice) * 100) / combo?.originalPrice),
    };
    return (
      <>
        <div key={combo.id + "-product-list"} className="product-list">
          <ProductItem
            key={combo.id}
            product={p}
            colorGroup={productStyles?.colorGroup}
            promotion={promotion}
            isCombo={true}
            combo={combo}
            useIconAddtoCart={true}
            addProductToCart={(id) => {
              addToCart && addToCart({ ...p, id, type: combo.comboTypeId, isCombo: true });
            }}
          />
        </div>
      </>
    );
  };

  if (!row) return null;
  return (
    <>
      <Row
        style={{ color: productStyles?.colorGroup?.titleColor }}
        id={id}
        className="product-list-row product-category"
      >
        {`${row?.title} (${row?.total} món)`}
      </Row>
      <div className="product-list-padding" style={{ position: "relative" }}>
        {row?.isCombo === true
          ? renderComboDetail({
              ...row,
              id,
              comboPricings: data,
            })
          : renderProductDetail(id, data)}
        <ProductListCategoryLoadingComponent isLoading={isLoading} />
      </div>
    </>
  );
};
export default ProductListRowComponent;
