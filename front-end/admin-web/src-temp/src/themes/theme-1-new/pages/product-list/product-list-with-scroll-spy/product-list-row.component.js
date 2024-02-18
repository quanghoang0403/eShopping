import { ProductCardComponent } from "./../product-card.component";
import { ProductCardComboComponent } from "./../product-card-combo.component";
import { useScrollSpy } from "./product-list-scroll-spy.provider";
import ProductListCategoryLoadingComponent from "./product-list-category-loading.component";
import { EnumAddToCartType } from "../../../../constants/enums";

const ProductListRowComponent = (props) => {
  const {
    id,
    row = undefined,
    data = [],
    isLoading = false,
    addToCart = undefined,
    isDefault = false,
    isLoadingOutOfStock = false,
  } = props;
  const { productStyles, currency } = useScrollSpy();
  const calculatorOriginalPriceComboSpecific = (comboProductPrices) =>
    comboProductPrices?.reduce((a, v) => (a = a + v.priceValue), 0);

  if (!row) return null;
  return (
    <div id={id} className={"product-list-row product-list-page-theme-1"}>
      <div className={`product-list-title ${data.length > 0 && "margin-bottom-product-category-title"}`}>
        {row?.title || ""}&nbsp; ({`${row?.total || 0}`})
      </div>
      <div className="product-list-padding" style={{ position: "relative" }}>
        {row?.isCombo === true ? (
          <ProductCardComboComponent
            storeCurrencyCode={currency.code}
            storeCurrencySymbol={currency.symbol}
            combo={{
              ...row,
              id,
              comboPricings: data,
            }}
            addProductToCart={(id) =>
              addToCart &&
              addToCart({
                id,
                isCombo: true,
                type: row?.comboTypeId,
                data: data,
              })
            }
            calculatorOriginalPriceComboSpecific={calculatorOriginalPriceComboSpecific}
            productStyles={productStyles}
            {...props}
          />
        ) : (
          <ProductCardComponent
            storeCurrencyCode={currency.code}
            storeCurrencySymbol={currency.symbol}
            productList={data}
            productStyles={productStyles}
            isLoadingOutOfStock={isLoadingOutOfStock}
            addProductToCart={(item, product) => {
              addToCart &&
                addToCart({
                  id: item.id,
                  flashSaleId: item?.flashSaleId,
                  isFlashSale: item?.isFlashSale,
                  productPriceId: product?.id,
                  type: EnumAddToCartType.Product,
                  isCombo: false,
                });
            }}
            isDefault={isDefault}
            {...props}
          />
        )}
        <ProductListCategoryLoadingComponent isLoading={isLoading} />
      </div>
    </div>
  );
};
export default ProductListRowComponent;
