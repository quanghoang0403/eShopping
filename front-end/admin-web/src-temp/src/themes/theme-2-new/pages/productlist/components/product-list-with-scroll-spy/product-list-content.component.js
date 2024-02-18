import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { EnumAddToCartType, EnumFlashSaleResponseCode } from "../../../../../constants/enums";
import productDataService from "../../../../../data-services/product-data.service";
import { setToastMessageAddUpdateProductToCart } from "../../../../../modules/toast-message/toast-message.actions";
import productComboAddToCartServices from "../../../../../services/product-combo-add-to-cart.services";
import { getStorage } from "../../../../../utils/localStorage.helpers";
import NotificationDialog from "../../../../components/notification-dialog/notification-dialog.component";
import { comboTypeEnum } from "../../../../constants/store-web-page.constants";
import useDebounce, { TIME_DELAY } from "../../../../hooks/useDebounce";
import ProductListRowComponent from "./product-list-row.component";
import { useScrollSpy } from "./product-list-scroll-spy.provider";

const ProductListContentComponent = (props) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [isShowNotifyFlashSaleDialog, setIsShowNotifyFlashSaleDialog] = useState(false);
  const [flashSaleProduct, setFlashSaleProduct] = useState(null);

  const translatedData = {
    okay: t("storeWebPage.generalUse.okay"),
    notification: t("storeWebPage.generalUse.notification"),
    flashSaleEndNotification: t("storeWebPage.flashSale.flashSaleEndNotification"),
  };

  const {
    categories = [],
    products = undefined,
    clickToFocusCustomize = undefined,
    styledCardProductList = undefined,
    paging = undefined,
    onChangeTab,
    isLoadData = true,
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
  } = useScrollSpy();

  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  const scrollContainerRef = useRef(null);
  const configCustomize = JSON.parse(getStorage("config"));
  useEffect(() => {
    const res = categories.reduce((acc, curr) => {
      const itemPaging = paging ? paging[curr.id] : undefined;
      const isCombo = curr?.isCombo === true;
      const description = curr?.description;

      let totalItems = 0;

      const data = products[curr.id] || [];
      const page = isCombo || data.length === 0 ? -1 : itemPaging?.page || -1;
      if (isCombo) {
        if (curr?.comboTypeId === comboTypeEnum.comboProductPrice.id) {
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
        onChangeTab(tab);
        const item = sources[tab];
        const tabIsLoading = listLoadings.indexOf(tab) !== -1;
        if (isLoadData && item && item.page === 1 && !tabIsLoading) {
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

  const handleAddToCart = (_data) => {
    let params = { id: _data.id, isCombo: _data?.isCombo };
    if (_data?.isCombo) {
      params.type = _data?.type;
      params.comboId = _data?.comboId;
      params.id = _data?.id;
      params.comboPricingProducts = _data?.comboPricingProducts;
      params.comboProductPrices = _data?.comboProductPrices;
    } else {
      params.productPriceId = _data?.productPrices[0]?.id;
      params.isFlashSale = _data?.isFlashSale;
      params.flashSaleId = _data?.flashSaleId;
    }

    productComboAddToCartServices.quickAddToCart(
      params,
      !_data.isCombo ? EnumAddToCartType.Product : _data.type,
      branchAddress?.id,
      null,
      (allAreApplicable, responseCode, product) => checkFlashSaleApplicable(allAreApplicable, responseCode, product),
    );
  };

  const checkFlashSaleApplicable = (allAreApplicable, responseCode, product) => {
    if (allAreApplicable) {
      updateCartToRedux(product);
    } else {
      if (responseCode === EnumFlashSaleResponseCode.Inactive) {
        setIsShowNotifyFlashSaleDialog(true);
        setFlashSaleProduct(product);
      } else {
        updateCartToRedux(product);
      }
    }
  };

  const handleConfirmNotify = () => {
    if (flashSaleProduct) {
      updateCartToRedux();
      setIsShowNotifyFlashSaleDialog(false);
      window.location.reload();
    }
  };

  const updateCartToRedux = (product) => {
    const currentProduct = product ?? flashSaleProduct;
    productComboAddToCartServices.updateCartInLocalAndRedux(
      productComboAddToCartServices.mappingToProductLocal(currentProduct),
      false,
    );
    dispatch(
      setToastMessageAddUpdateProductToCart({
        icon: null,
        message: t("addCartItemToastMessage", "Sản phẩm đã được thêm vào giỏ hàng thành công"),
      }),
    );
  };

  return (
    <div
      id="themeProductProductList"
      onClick={() => configCustomize?.customizeTheme && clickToFocusCustomize("customizeProductProductList")}
    >
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
            />
          ))}
      </div>
      {/* Product flash sale notify */}
      <NotificationDialog
        open={isShowNotifyFlashSaleDialog}
        title={translatedData.notification}
        onConfirm={handleConfirmNotify}
        confirmLoading={false}
        className="checkout-theme1-notify-dialog"
        content={translatedData.flashSaleEndNotification}
        footer={[<Button onClick={handleConfirmNotify}>{translatedData.okay}</Button>]}
        closable={true}
      />
    </div>
  );
};
export default ProductListContentComponent;
