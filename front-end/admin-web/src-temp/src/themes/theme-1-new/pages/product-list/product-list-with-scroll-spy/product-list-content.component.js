import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { comboType } from "../../../../constants/combo.constants";
import productDataService from "../../../../data-services/product-data.service";
import { setNotificationDialog } from "../../../../modules/session/session.actions";
import { setToastMessageAddUpdateProductToCart } from "../../../../modules/toast-message/toast-message.actions";
import { checkOutOfStockWhenQuickAdd } from "../../../../services/material/check-out-of-stock.service";
import productComboAddToCartServices from "../../../../services/product-combo-add-to-cart.services";
import { getStorage } from "../../../../utils/localStorage.helpers";
import { theme1ElementCustomize } from "../../../constants/store-web-page.constants";
import useDebounce, { TIME_DELAY } from "../../../hooks/useDebounce";
import ProductListRowComponent from "./product-list-row.component";
import { useScrollSpy } from "./product-list-scroll-spy.provider";
import { StyledProductList } from "./product-list-with-scroll-spy.styled";

const ProductListContentComponent = (props) => {
  const [t] = useTranslation();
  const translatedData = {
    outOfStock: t("storeWebPage.productDetailPage.outOfStock", "outOfStock"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Sorry! Product is not enough of stock"),
    okay: t("form.okay"),
    notification: t("loginPage.notification"),
  };
  const dispatch = useDispatch();
  const {
    isDefault = false,
    categories = [],
    products = undefined,
    clickToFocusCustomize = undefined,
    styleHeader = undefined,
    styledCardProductList = undefined,
    paging = undefined,
    storeCurrencyCode = "",
    storeCurrencySymbol = "",
  } = props;
  const {
    onSetLoading,
    tab,
    sources,
    onSetSources,
    onSetCategories,
    onLoadMoreCategory,
    listLoadings,
    onAddListLoadings,
    onRemoveListLoadings,
    onSetScrollContainerRef,
    onSetProductStyles,
    productStyles,
    onSetStoreCurrency,
  } = useScrollSpy();
  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  const scrollContainerRef = useRef(null);
  const configCustomize = JSON.parse(getStorage("config"));
  useEffect(() => {
    const res = categories.reduce((acc, curr) => {
      const itemPaging = paging ? paging[curr.id] : undefined;
      const isCombo = curr?.isCombo === true;
      const description = curr?.description;
      let totalItems;
      const data = products[curr.id] || [];
      const page = isCombo || data.length === 0 ? -1 : itemPaging?.page || -1;
      if (isCombo) {
        if (curr?.comboTypeId === comboType.comboProductPrice.id) {
          totalItems = 1;
        } else {
          totalItems = data.length;
        }
      } else {
        totalItems = itemPaging?.totalItem || 0;
      }
      return (
        (acc[curr.id] = {
          ...curr,
          title: curr.name,
          page,
          data,
          isCombo: isCombo,
          comboTypeId: curr?.comboTypeId,
          thumbnail: curr?.thumbnail,
          sellingPrice: curr?.sellingPrice,
          originalPrice: curr?.originalPrice,
          total: totalItems,
          description: description,
        }),
        acc
      );
    }, {});
    onSetProductStyles(styledCardProductList);
    onSetStoreCurrency({
      code: storeCurrencyCode,
      symbol: storeCurrencySymbol,
    });
    onSetCategories(() => {
      onSetLoading(false);
      onSetSources(res);
      return categories.map((x) => ({
        ...x,
        page: 1,
      }));
    });
  }, []);

  useEffect(() => {
    scrollContainerRef.current && onSetScrollContainerRef(scrollContainerRef);
  }, [scrollContainerRef]);

  useDebounce(
    async () => {
      if (tab !== "") {
        const item = sources[tab];
        const tabIsLoading = listLoadings.indexOf(tab) !== -1;
        if (item && item.page === 1 && !tabIsLoading) {
          onAddListLoadings(tab);
          const rsProducts = await productDataService.getProductsStoreScrollSpy(tab, branchAddress?.id);
          if (rsProducts.data) {
            const { products: productsRes } = rsProducts.data;
            onRemoveListLoadings(tab);
            onLoadMoreCategory(tab, Object.keys(productsRes).length ? productsRes[tab] : []);
          }
        }
      }
    },
    [tab, listLoadings, sources],
    TIME_DELAY,
  );

  const [isLoadingOutOfStock, setIsLoadingOutOfStock] = useState(false);
  const handleAddToCart = async (_data) => {
    let params = { id: _data.id, isCombo: _data?.isCombo };
    if (_data?.isCombo) {
      params.type = _data?.type;
      params.comboId = _data?.comboId;
      params.comboPricingProducts = _data?.comboPricingProducts;
      params.comboProductPrices = _data?.comboProductPrices;
    } else {
      params.productPriceId = _data?.productPriceId;
      params.isFlashSale = _data?.isFlashSale;
      params.flashSaleId = _data?.flashSaleId;
    }
    productComboAddToCartServices.quickAddToCart(params, _data.type, branchAddress?.id);
  };

  return (
    <div
      className="main-session"
      id="themeProductProductList"
      onClick={() => {
        if (configCustomize?.customizeTheme && clickToFocusCustomize) {
          clickToFocusCustomize(theme1ElementCustomize.ProductProductList);
        }
      }}
    >
      <StyledProductList isDefault={isDefault} styleHeade={styleHeader} styleProductsProductList={productStyles}>
        <div id={"product-list-wrapper-rows"} className="list-product-by-category">
          {sources &&
            Object.keys(sources).map((_key, index) => (
              <ProductListRowComponent
                key={`tab_${_key}_${index}`}
                id={_key}
                addToCart={handleAddToCart}
                row={sources[_key]}
                data={sources[_key].data}
                isLoading={listLoadings.indexOf(_key) !== -1}
                isDefault={isDefault}
                isLoadingOutOfStock={isLoadingOutOfStock}
                setIsLoadingOutOfStock={setIsLoadingOutOfStock}
              />
            ))}
        </div>
      </StyledProductList>
    </div>
  );
};
export default ProductListContentComponent;
