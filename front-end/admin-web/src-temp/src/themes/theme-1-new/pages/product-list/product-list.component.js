import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import flashSaleDataService from "../../../data-services/flash-sale-data.service";
import productDataService from "../../../data-services/product-data.service";
import { store } from "../../../modules";
import { setCartItems, setDeliveryAddress } from "../../../modules/session/session.actions";
import {
  setToastMessageAddUpdateProductToCart,
  setToastMessageMaxDiscount,
} from "../../../modules/toast-message/toast-message.actions";
import maxDiscountService from "../../../services/max-discount.services";
import shoppingCartService from "../../../services/shopping-cart/shopping-cart.service";
import { formatTextNumber, isValidGuid, roundNumber } from "../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../utils/localStorage.helpers";
import ConfirmationDialog from "../../components/confirmation-dialog/confirmation-dialog.component";
import { EnumPromotion } from "../../constants/enums";
import { comboType } from "../../constants/store-web-page.constants";
import ProductListParser from "../../parsers/product-list/product-list.parser";
import { allCombosDefault, allProductsWithCategoryDefault, productCategoriesDefault } from "./default-data";
import ProductListScrollSpyComponent from "./product-list-with-scroll-spy";
import "./product-list.component.scss";
import "./product-not-in-branch.scss";
import { useAppCtx } from "../../../providers/app.provider";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { EnumOrderType, EnumQRCodeStatus, EnumTargetQRCode } from "../../../constants/enums";
import { CheckCircleIcon, WarningTriangle } from "../../assets/icons.constants";
import productComboAddToCartServices from "../../../services/product-combo-add-to-cart.services";
import { orderInfoSelector } from "../../../modules/order/order.reducers";
import { useSearchParams } from "../../hooks";
import orderService from "../../../services/orders/order-service";

export function Theme1ProductList(props) {
  window.showDeliveryAddressSelector = true;
  const config = JSON.parse(getStorage("config"));
  const { clickToFocusCustomize } = props;
  const isDefault = props?.isDefault;
  const history = useHistory();
  const dispatch = useDispatch();
  const { Toast } = useAppCtx();
  const [t] = useTranslation();
  const query = useSearchParams();
  const qrCodeId = query.get("qrCodeId");

  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  const nearestStoreBranches = useSelector((state) => state?.session?.nearestStoreBranches);
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);

  const [isShowFlashSaleInActive, setIsShowFlashSaleInActive] = useState(false);
  const [callBackAddToCartFunction, setCallBackAddToCartFunction] = useState(null);
  const [isShowProductNotInBranchModal, setIsShowProductNotInBranchModal] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [storeCurrencyCode, setStoreCurrencyCode] = useState();
  const [storeCurrencySymbol, setStoreCurrencySymbol] = useState();
  const [promotions, setPromotions] = useState([]);
  const [productByCategories, setProductByCategories] = useState(undefined);
  const [productPaging, setProductPaging] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [isShowCartBranchDiffWithQrCodeBranch, setIsShowCartBranchDiffWithQrCodeBranch] = useState(false);
  const [qrCodeOrder, setQrCodeOrder] = useState({});

  const translatedData = {
    flashSaleInActive: t("promotion.flashSale.description.inactive"),
    notification: t("loginPage.notification"),
    okay: t("form.okay"),
    productNotInBranch: t("form.productNotInBranch"),
    item: t("storeWebPage.productDetailPage.items"),
    addCartItemToastMessage: t("addCartItemToastMessage", "Sản phẩm đã được thêm vào giỏ hàng thành công"),
    qrCodeIsNotAvailable: t("messages.qrCodeIsNotAvailable", "Mã QR không khả dụng"),
    scanQRCodeSuccessfully: t("messages.scanQRCodeSuccessfully", "Đã quét mã QR thành công"),
    qrCodeIsOnlyValidAt: t(
      "messages.qrCodeIsOnlyValidAt",
      "Mã QR này chỉ khả dụng ở chi nhánh <strong>{{branchName}}</strong>",
    ),
    doYouWantToClearCartAndSwitchToThatBranch: t(
      "messages.doYouWantToClearCartAndSwitchToThatBranch",
      "Bạn có muốn xóa giỏ hàng và chuyển qua chi nhánh này không?",
    ),
    confirmation: t("order.confirmation", "Xác nhận"),
    switchBranch: t("button.switchBranch", "Chuyển chi nhánh"),
    no: t("button.no", "Không"),
  };

  let styleHeader = props?.config?.header;
  const colorGroupHeader = props?.general?.color?.colorGroups?.find(
    (g) => g.id === props?.config?.header?.colorGroupId,
  );

  styleHeader = {
    ...styleHeader,
    colorGroup: colorGroupHeader,
  };

  let styleProductsProductList = props?.config?.productsProductList;
  const colorGroupProductsProductList = props?.general?.color?.colorGroups?.find(
    (g) => g.id === props?.config?.productsProductList?.colorGroupId,
  );

  styleProductsProductList = {
    ...styleProductsProductList,
    colorGroup: colorGroupProductsProductList,
  };

  const getDataInit = async () => {
    setLoading(true);
    const promiseCombos = productDataService.getCombosStoreScrollSpy("", branchAddress?.id);
    const promiseProducts = productDataService.getProductsStoreScrollSpy("", branchAddress?.id);

    Promise.all([promiseProducts, promiseCombos]).then((values) => {
      const [rsProducts, rsCombos] = values;
      if (rsCombos.data && rsProducts.data) {
        const { combos } = rsCombos.data;
        const {
          products,
          promotions,
          categories,
          productTotalPages,
          itemPerPage = 0,
          storeCurrencyCode,
          storeCurrencySymbol,
        } = rsProducts.data;
        const comboCategories = [];
        const allProducts = { ...products };
        const paging = { ...productTotalPages };
        const dataPaging = {};
        Object.keys(paging).forEach((_page) => {
          const totalItem = paging[_page];
          dataPaging[_page] = { totalItem, page: totalItem > itemPerPage ? 1 : -1 };
        });
        combos &&
          combos.forEach((comboCategory) => {
            comboCategories.push({
              id: comboCategory.id,
              name: comboCategory.name,
              isCombo: true,
              ...comboCategory,
            });
            allProducts[comboCategory.id] = comboCategory?.comboPricings || comboCategory;
          });
        setProductPaging(dataPaging);
        setProductCategories([...comboCategories, ...categories]);
        setStoreCurrencyCode(storeCurrencyCode);
        setStoreCurrencySymbol(storeCurrencySymbol);
        setPromotions(promotions);
        setProductByCategories(allProducts);
        setLoading(false);
      }
    });
  };

  //http://localhost:3000/product-list?qrCodeId=69fb7d32-93c6-4b66-8a39-0df5713d469c
  useEffect(() => {
    // TODO: Fetch store info and init data from router parameters
    // branchName, branchAddress, storeLogo, area-table, products add to cart, redirect to store menu
    if (isValidQrCodeId(qrCodeId)) {
      fetchData(qrCodeId);
    }
  }, []);

  const isValidQrCodeId = (qrCodeId) => {
    if (qrCodeId !== null && qrCodeId !== undefined && isValidGuid(qrCodeId)) {
      return true;
    }
    return false;
  };

  async function fetchData(qrCodeId) {
    if (qrCodeId && isValidGuid(qrCodeId)) {
      await orderService.getQrCodeOrderAsync(qrCodeId);
      const reduxQrCodeOrder = store.getState()?.order?.qrOrder;
      if (reduxQrCodeOrder) {
        setQrCodeOrder(reduxQrCodeOrder);
        handleQRCode(reduxQrCodeOrder);
      }
    }
  }

  useEffect(() => {
    if (config?.customizeTheme) {
      const productListParser = new ProductListParser();
      productListParser
        .setProductCategories(productCategoriesDefault)
        .setProducts(allProductsWithCategoryDefault)
        .setCombos(allCombosDefault)
        .parse();
      setPromotions([]);
      setProductPaging(productListParser.dataPaging);
      setProductCategories(productListParser.categories);
      setProductByCategories(productListParser.productByCategories);
      setStoreCurrencyCode("VND");
      setStoreCurrencySymbol("đ");
    } else {
      getDataInit();
    }
  }, [branchAddress]);

  const getOptionsSelected = (options) => {
    let optionsSelected = [];
    if (options) {
      options.map((productOption) => {
        let option = productOption?.optionLevels?.find((option) => option?.isSetDefault);
        if (option) {
          optionsSelected.push(option);
        } else {
          optionsSelected.push("");
        }
      });
    }
    return optionsSelected;
  };

  const mappingDataOptions = (options, isComboPricingProducts) => {
    const newOptions = options?.map((o) => ({
      id: isComboPricingProducts ? o?.id : o?.optionId,
      name: isComboPricingProducts ? o?.name : o?.optionName,
      isSetDefault: isComboPricingProducts
        ? o?.optionLevels?.find((x) => x.isSetDefault === true)?.isSetDefault
        : o?.isSetDefault,
      optionLevelId: isComboPricingProducts ? o?.optionLevels?.find((x) => x.isSetDefault === true)?.id : o?.id,
      optionLevelName: isComboPricingProducts ? o?.optionLevels?.find((x) => x.isSetDefault === true)?.name : o?.name,
    }));
    return newOptions;
  };

  const mappingDataToppings = (toppings) => {
    const newOptions = toppings?.map((t) => ({
      ...t,
      id: t?.toppingId,
      name: t?.name,
      originalPrice: t?.priceValue,
      priceValue: t?.priceValue,
      quantity: t.quantity,
    }));
    return newOptions;
  };

  const compareProduct = (firstProduct, secondProduct) => {
    let isTheSame = false;
    if (
      firstProduct?.id === secondProduct?.id &&
      firstProduct?.productPrice?.flashSaleId === secondProduct?.productPrice?.flashSaleId &&
      firstProduct?.productPrice?.id === secondProduct?.productPrice?.id &&
      firstProduct?.options?.every((firstOption) => {
        return secondProduct?.options?.some(
          (secondOption) => firstOption?.optionLevelId === secondOption?.optionLevelId,
        );
      }) &&
      firstProduct?.toppings.length === secondProduct?.toppings.length &&
      firstProduct?.toppings?.every((firstTopping) => {
        return secondProduct?.toppings?.some(
          (secondTopping) =>
            secondTopping?.id === firstTopping?.id && secondTopping?.quantity === firstTopping?.quantity,
        );
      })
    ) {
      isTheSame = true;
    }
    return isTheSame;
  };

  const updateStoreCart = (product) => {
    const storeCartNew = shoppingCartService.updateStoreCart(product);
    dispatch(setCartItems(storeCartNew));
  };

  const onShowToastMessageAddCartItem = () => {
    dispatch(
      setToastMessageAddUpdateProductToCart({
        icon: null,
        message: translatedData.addCartItemToastMessage,
      }),
    );
  };

  const calculatorOriginalPriceComboSpecific = (comboProductPrices) => {
    const originalPrice = comboProductPrices?.reduce((a, v) => (a = a + v.priceValue), 0);
    return originalPrice;
  };

  const calculatePercent = (sellingPrice, originalPrice, iscomboProductPrice, comboProductPrices) => {
    if (iscomboProductPrice) {
      return formatTextNumber(
        roundNumber(100 - (sellingPrice / calculatorOriginalPriceComboSpecific(comboProductPrices)) * 100, 0),
      );
    } else {
      return formatTextNumber(roundNumber(100 - (sellingPrice / originalPrice) * 100, 0));
    }
  };

  const addComboToCart = (item, comboData) => {
    let _productList = [];
    let _productPricesList = [];
    let _toppings = [];
    let _options = [];
    var dataComboMap =
      comboData?.comboTypeId === comboType.comboPricing.id ? item?.comboPricingProducts : item?.comboProductPrices;
    dataComboMap?.map((item, index) => {
      let itemProduct = item?.productPrice?.product;
      _options.push(itemProduct?.productOptions);
      _toppings.push(itemProduct?.productToppings);
      let _product = {
        id: item?.productPrice?.productId,
        name: itemProduct?.name,
        thumbnail: itemProduct?.thumbnail,
        productPrice: {
          id: item?.productPriceId,
          priceName: item?.productPrice?.priceName,
          priceValue: item?.productPrice?.priceValue,
          product: item?.productPrice?.product,
        },
        options: mappingDataOptions(_options[index], true),
        toppings: mappingDataToppings(_toppings[index]),
      };
      _productList.push(_product);
      _productPricesList.push({
        productPriceId: item?.productPriceId,
        priceName: item?.productPrice?.priceName,
        priceValue: item?.productPrice?.priceValue,
        productPrice: item?.productPrice,
      });
    });
    let comboProductPrice =
      comboData?.comboTypeId === comboType.comboPricing.id ? _productPricesList : item?.comboProductPrices;

    let percentDisount =
      comboData?.comboTypeId === comboType.comboPricing.id
        ? calculatePercent(item?.sellingPrice, item?.originalPrice, false)
        : calculatePercent(item?.sellingPrice, item?.originalPrice, true, comboData?.comboProductPrices);
    let comboPrevData = comboData?.comboTypeId === comboType.comboPricing.id ? comboData : item;
    let dataDetailCombo = {
      ...comboPrevData,
      isCombo: true,
      comboPricingName: item?.comboName,
      comboProductPrices: comboProductPrice,
      percentDisount: percentDisount,
      combo: {
        name: comboData?.comboTypeId === comboType.comboPricing.id ? item?.comboName : item.name,
      },
    };

    const combo = {
      isCombo: true,
      id: comboData?.comboTypeId === comboType.comboPricing.id ? item?.comboId : item.id,
      name: comboData?.comboTypeId === comboType.comboPricing.id ? item?.comboName : item.name,
      comboPricingId: comboData?.comboTypeId === comboType.comboPricing.id ? item?.id : null,
      comboPricingName: item?.comboName,
      thumbnail: comboData?.comboTypeId === comboType.comboPricing.id ? comboData?.thumbnail : item?.thumbnail,
      message: "",
      comboTypeId: comboData?.comboTypeId === comboType.comboPricing.id ? comboData.comboTypeId : item.comboTypeId,
      products: _productList,
      quantity: 1,
      originalPrice: item?.originalPrice,
      sellingPrice: item?.sellingPrice,
      totalOfToppingPrice: 0,
      dataDetails: dataDetailCombo,
    };
    updateStoreCart(combo);
  };

  const addToCartWithNoFlashSale = () => {
    if (callBackAddToCartFunction) {
      addProductToCart(
        callBackAddToCartFunction.isCombo,
        callBackAddToCartFunction.item,
        callBackAddToCartFunction.thumbnailComboPricing,
        callBackAddToCartFunction.productPrice,
        callBackAddToCartFunction.isCheckFlashSaleAddToCart,
      );
    }

    if (window.reloadProductList) {
      clearTimeout(window.reloadProductList);
    }
    window.reloadProductList = setTimeout(() => {
      window.location.reload(false);
    }, 1000);
  };

  const handleCheckHaveFlashSaleAsync = async (productPriceId, flashSaleId, isFlashSale) => {
    if (isFlashSale === true) {
      const verifyFlashSaleRequest = {
        branchId: branchAddress?.id,
        productPriceId,
        quantity: 1,
        flashSaleId,
      };
      const flashSaleVerifyResult = await flashSaleDataService.verifyProductFlashSaleAsync(verifyFlashSaleRequest);
      const allAreApplicable = flashSaleVerifyResult?.data?.allAreApplicable;
      if (allAreApplicable === false) {
        return false;
      }
      return true;
    } else {
      return true;
    }
  };

  const handleProductAddToCart = async (isCheckFlashSaleAddToCart, item, productPrice) => {
    var res = await productDataService.getToppingsByProductIdAsync(item?.id);
    if (res) {
      const _productPrice = productPrice;
      _productPrice.totalOfToppingPrice = 0;
      _productPrice.isDiscountPercent = item?.isDiscountPercent;
      _productPrice.maximumDiscountAmount = item?.maximumDiscountAmount;
      if (isCheckFlashSaleAddToCart) {
        _productPrice.flashSaleId = undefined;
        _productPrice.flashSaleQuantity = undefined;
        _productPrice.maximumLimit = undefined;
        _productPrice.promotionEndTime = undefined;
        _productPrice.isApplyPromotion = false;
        _productPrice.priceValue = _productPrice.originalPrice;
      } else {
        _productPrice.originalPrice =
          _productPrice.originalPrice === 0 ? _productPrice.priceValue : _productPrice.originalPrice;
      }
      const productToppings = mappingDataToppings(res?.data?.productToppings);

      const product = {
        isCombo: false,
        id: item?.id,
        name: item?.name,
        thumbnail: item?.thumbnail,
        message: "",
        productPrice: _productPrice,
        quantity: 1,
        isFlashSale: isCheckFlashSaleAddToCart === true ? false : item?.isFlashSale,
        isPromotionProductCategory: item?.isPromotionProductCategory,
        isPromotionTotalBill: promotions?.some((item) => item?.promotionTypeId === EnumPromotion.DiscountTotal),
        options: mappingDataOptions(getOptionsSelected(item?.productOptions)),
        toppings: productToppings,
        dataDetails: {
          product: {
            productDetail: {
              ...item,
            },
            productToppings: productToppings,
          },
          promotions: promotions,
        },
      };
      updateStoreCart(product);
    }
  };

  const addProductToCart = async (isCombo, item, thumbnailComboPricing, productPrice, isCheckFlashSaleAddToCart) => {
    if (isCheckFlashSaleAddToCart === true) {
      await handleProductAddToCart(isCheckFlashSaleAddToCart, item, productPrice);
    } else {
      if (isCombo) {
        addComboToCart(item, thumbnailComboPricing);
      } else {
        const checkProductInBranch = await productDataService.checkProductInBranchAsync(item?.id, branchAddress?.id);
        if (!checkProductInBranch?.data?.success) {
          setIsShowProductNotInBranchModal(true);
          return;
        }
        /// Handle check flash sale
        const checkFlashSale = await handleCheckHaveFlashSaleAsync(
          productPrice?.id,
          item?.flashSaleId,
          item?.isFlashSale,
        );
        if (checkFlashSale === false) {
          setIsShowFlashSaleInActive(true);
          setCallBackAddToCartFunction({
            isCombo,
            item,
            thumbnailComboPricing,
            productPrice,
            isCheckFlashSaleAddToCart: true,
          });
          return;
        }

        await handleProductAddToCart(isCheckFlashSaleAddToCart, item, productPrice);

        /// Handle calculation max discount
        const currentCartItems = store.getState().session?.cartItems;
        let currentCart = currentCartItems?.find((cart) => cart.id === item.id);
        const data = {
          isApplyPromotion: productPrice?.isApplyPromotion,
          isIncludedTopping: false,
          totalPriceValue: currentCart?.quantity * productPrice?.priceValue,
          isDiscountPercent: item?.isDiscountPercent,
          maximumDiscountAmount: item?.maximumDiscountAmount,
          quantity: currentCart?.quantity,
        };
        maxDiscountService.calculationMaxDiscountService(
          data,
          () => {
            dispatch(setToastMessageMaxDiscount(true));
          },
          () => {
            dispatch(setToastMessageMaxDiscount(false));
          },
        );
      }
    }
    onShowToastMessageAddCartItem();
  };

  const handleQRCode = (qrCodeOrder) => {
    if (qrCodeOrder) {
      const { qrCodeStatus, products, serviceTypeId, targetId, branchId } = qrCodeOrder;
      if (qrCodeStatus === EnumQRCodeStatus.Active) {
        switch (serviceTypeId) {
          case EnumOrderType.Online:
            handleOnlineQrCode(targetId, branchId, products);
            break;
          case EnumOrderType.Instore:
            break;
          default:
            break;
        }
        Toast.show({
          messageType: "success",
          message: translatedData.scanQRCodeSuccessfully,
          icon: <CheckCircleIcon />,
          placement: "bottom",
          duration: 3,
        });
        return;
      }
    }
    Toast.show({
      messageType: "error",
      message: translatedData.qrCodeIsNotAvailable,
      icon: <WarningTriangle />,
      placement: "bottom",
      duration: 3,
    });
    handleDeleteParamsOnUrl();
    history.push("/home");
  };

  const handleOnlineQrCode = (targetId, branchId, products) => {
    switch (targetId) {
      case EnumTargetQRCode.ShopMenu:
        handleDeleteParamsOnUrl();
        handleSwitchBranch(branchId);
        break;
      case EnumTargetQRCode.AddProductToCart:
        const jsonStringStoreCart = localStorage.getItem(localStorageKeys.STORE_CART);
        const cartItems = JSON.parse(jsonStringStoreCart);
        if (cartItems && cartItems?.length > 0) {
          const branchAddressId = branchAddress?.id;
          if (branchAddressId?.toLowerCase() !== branchId?.toLowerCase()) {
            setIsShowCartBranchDiffWithQrCodeBranch(true);
          } else {
            handleAddProductToCart(products);
          }
        } else {
          handleSwitchBranch(branchId);
          handleAddProductToCart(products);
        }
        break;
      default:
        break;
    }
  };

  const handleSwitchBranch = (branchId) => {
    const qrBranch = nearestStoreBranches?.find((storeBranch) => storeBranch?.branchId === branchId);
    const currentDeliveryAddress = {
      receiverAddress: deliveryAddress?.receiverAddress,
      branchAddress: {
        ...qrBranch,
        id: qrBranch?.branchId,
        title: qrBranch?.branchName,
        addressDetail: qrBranch?.branchAddress,
      },
    };
    dispatch(setDeliveryAddress(currentDeliveryAddress));
  };

  const handleAddProductToCart = (productsAddToCart) => {
    for (let index = 0; index < productsAddToCart?.length; index++) {
      const item = productsAddToCart[index];
      productComboAddToCartServices.quickAddToCartQrProducts({ ...item, quantity: item?.productDetail?.quantity });
    }

    handleDeleteParamsOnUrl();
    setTimeout(() => {
      history.push("/checkout");
    }, 500);

    Toast.show({
      messageType: "success",
      message: translatedData.addCartItemToastMessage,
      icon: <CheckCircleIcon />,
      placement: "bottom",
      duration: 3,
    });
  };

  const handleConfirmDialogSwitchBranch = () => {
    shoppingCartService.setStoreCartLocalStorage([]);
    handleSwitchBranch(qrCodeOrder?.branchId);
    handleAddProductToCart(qrCodeOrder?.products);
    setIsShowCartBranchDiffWithQrCodeBranch(false);
  };

  const handleCancelDialogSwitchBranch = () => {
    setIsShowCartBranchDiffWithQrCodeBranch(false);
  };

  const handleDeleteParamsOnUrl = () => {
    query.delete("qrCodeId");
    history.replace({
      search: query.toString(),
    });
  };

  return (
    <>
      <div className="container-product-list">
        {productCategories?.length > 0 ? (
          <ProductListScrollSpyComponent
            isDefault={isDefault}
            loading={loading}
            storeCurrencyCode={storeCurrencyCode}
            storeCurrencySymbol={storeCurrencySymbol}
            clickToFocusCustomize={clickToFocusCustomize}
            styleHeader={styleHeader}
            styledCardProductList={styleProductsProductList}
            products={productByCategories}
            paging={productPaging}
            categories={productCategories}
            branchId={branchAddress?.id}
          />
        ) : (
          <div className="empty-product-list" />
        )}
      </div>
      <ConfirmationDialog
        open={isShowFlashSaleInActive}
        title={translatedData.notification}
        content={translatedData.flashSaleInActive}
        footer={[
          <Button
            className="button-okay"
            onClick={() => {
              setIsShowFlashSaleInActive(false);
              addToCartWithNoFlashSale();
            }}
          >
            {translatedData.okay}
          </Button>,
        ]}
        onCancel={() => {
          setIsShowFlashSaleInActive(false);
          addToCartWithNoFlashSale();
        }}
        className="flash-sale-in-active-theme1"
        closable={true}
        maskClosable={true}
      />
      <ConfirmationDialog
        open={isShowProductNotInBranchModal}
        title={translatedData.notification}
        content={translatedData.productNotInBranch}
        footer={[
          <Button
            className="button-okay"
            onClick={() => {
              setIsShowProductNotInBranchModal(false);
            }}
          >
            {translatedData.okay}
          </Button>,
        ]}
        onCancel={() => {
          setIsShowProductNotInBranchModal(false);
        }}
        className="product-not-in-branch-theme1"
        closable={true}
        maskClosable={true}
      />
      <ConfirmationDialog
        open={isShowCartBranchDiffWithQrCodeBranch}
        title={translatedData.confirmation}
        content={
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: t(translatedData.qrCodeIsOnlyValidAt, {
                  branchName: qrCodeOrder?.branchName,
                }),
              }}
            ></span>
            <div>{translatedData.doYouWantToClearCartAndSwitchToThatBranch}</div>
          </>
        }
        footer={[
          <Button className="button-confirm-dialog btn-cancel" onClick={() => handleCancelDialogSwitchBranch()}>
            {translatedData.no}
          </Button>,
          <Button className="button-confirm-dialog btn-confirm" onClick={() => handleConfirmDialogSwitchBranch()}>
            {translatedData.switchBranch}
          </Button>,
        ]}
        className="notification-time-out-working-hours confirm-dialog-switch-branch"
        closable={false}
        maskClosable={true}
      />
    </>
  );
}
