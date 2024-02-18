import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import styled from "styled-components";
import { EnumOrderType, EnumQRCodeStatus, EnumTargetQRCode, ScrollHeaderType } from "../../../../constants/enums";
import flashSaleDataService from "../../../../data-services/flash-sale-data.service";
import productDataService from "../../../../data-services/product-data.service";
import { store } from "../../../../modules";
import { setCartItems, setDeliveryAddress } from "../../../../modules/session/session.actions";
import {
  setToastMessageAddUpdateProductToCart,
  setToastMessageMaxDiscount,
} from "../../../../modules/toast-message/toast-message.actions";
import { useAppCtx } from "../../../../providers/app.provider";
import maxDiscountService from "../../../../services/max-discount.services";
import orderService from "../../../../services/orders/order-service";
import productComboAddToCartServices from "../../../../services/product-combo-add-to-cart.services";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import { formatTextNumber, isValidGuid, roundNumber } from "../../../../utils/helpers";
import { localStorageKeys } from "../../../../utils/localStorage.helpers";
import { CheckCircleIcon, WarningTriangle } from "../../../assets/icons.constants";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog.component";
import { ComboType } from "../../../constants/combo.constants";
import { EnumPromotion } from "../../../constants/enums";
import { backgroundTypeEnum, comboType } from "../../../constants/store-web-page.constants";
import { CloseBranchContainer } from "../../../containers/close-branch/close-branch.container";
import { useSearchParams } from "../../../hooks";
import useLayoutProductList from "../hooks/useLayoutProductList";
import NavigationCategory from "./navigation-category.component";
import ProductListCard from "./product-list-card.component";
import "./product-list.component.scss";
import { React, useMemo } from "react";

function ProductListTheme1(props) {
  window.showDeliveryAddressSelector = true;
  const params = useParams();
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const { Toast } = useAppCtx();
  const history = useHistory();
  const query = useSearchParams();
  const qrCodeId = query.get("qrCodeId");

  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  const nearestStoreBranches = useSelector((state) => state?.session?.nearestStoreBranches);
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const { paddingTopProductList } = useLayoutProductList();

  const [listCategories, setListCategories] = useState([]);
  const [listSectionGroups, setListSectionGroups] = useState([]);
  const [currency, setCurrency] = useState("đ");
  const [isFirstCallProductsDone, setIsFirstCallProductsDone] = useState(false);
  const [isSecondCallProductsDone, setIsSecondCallProductsDone] = useState(false);
  const [initializingProducts, setInitializingProducts] = useState(true);
  const [productTotalPage, setProductTotalPage] = useState([]);
  const [isShowProductNotInBranchModal, setIsShowProductNotInBranchModal] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [callBackAddToCartFunction, setCallBackAddToCartFunction] = useState(null);
  const [isShowFlashSaleInActive, setIsShowFlashSaleInActive] = useState(false);
  const [isShowCartBranchDiffWithQrCodeBranch, setIsShowCartBranchDiffWithQrCodeBranch] = useState(false);
  const [qrCodeOrder, setQrCodeOrder] = useState({});
  const [styleProductList, setStyleProductList] = useState(null);
  const [styleProductListHeader, setStyleProductListHeader] = useState(null);
  const [timeoutIndex, setTimeoutIndex] = useState(0);

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

    setStyleProductList(newStyleProductList);

    let newStyleHeaderProduct = props?.config?.header;
    const colorGroupHeaderProduct = props?.general?.color?.colorGroups?.find(
      (g) => g.id === props?.config?.header?.colorGroupId,
    );
    newStyleHeaderProduct = {
      ...newStyleHeaderProduct,
      colorGroup: colorGroupHeaderProduct,
    };
    setStyleProductListHeader(newStyleHeaderProduct);
    getDataProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDataProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchAddress]);

  const translatedData = {
    product: t("home.product"),
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

  const checkComboIsHaveProducts = (combo) => {
    if (combo?.comboTypeId === ComboType.FLEXIBLE) {
      if (combo?.comboPricings?.length > 0) return true;
    } else if (combo?.comboTypeId === ComboType.SPECIFIC) {
      return true;
    }
    return false;
  };

  const getDataProducts = async () => {
    const resCombo = await productDataService.getCombosStoreScrollSpy("", branchAddress?.id);
    const listComboNavbar = [];
    const listSectionGroups = [];
    // Get all combos
    if (resCombo) {
      resCombo?.data?.combos?.forEach((item) => {
        const isHaveProducts = checkComboIsHaveProducts(item);
        if (isHaveProducts) {
          listComboNavbar.push({ id: item.id, name: item.name, isCombo: true });
          const sectionGroupCombo = {
            id: item?.id,
            name: item?.name,
            products: [],
            isCombo: true,
          };
          if (item.comboTypeId === ComboType.SPECIFIC) {
            sectionGroupCombo.products.push({
              data: {
                ...item,
              },
              id: item?.id,
              name: item?.name,
              originalPrice: item?.originalPrice,
              sellingPrice: item?.sellingPrice,
              thumbnail: item?.thumbnail,
              isCombo: true,
              comboTypeId: item?.comboTypeId,
            });
          } else if (item.comboTypeId === ComboType.FLEXIBLE) {
            item.comboPricings?.forEach((comboPricingItem) => {
              sectionGroupCombo.products.push({
                id: comboPricingItem?.id,
                name: comboPricingItem?.customName ? comboPricingItem?.customName : comboPricingItem?.comboName,
                originalPrice: comboPricingItem?.originalPrice,
                sellingPrice: comboPricingItem?.sellingPrice,
                thumbnail: item?.thumbnail,
                isCombo: true,
                comboTypeId: item?.comboTypeId,
                data: comboPricingItem,
              });
            });
          }

          listSectionGroups.push(sectionGroupCombo);
        }
      });

      // Get all products in categories
      const resProductStore = await productDataService.getProductsStoreScrollSpy("", branchAddress?.id);
      const resCatetogries = resProductStore.data.categories.map(({ id, name, isCombo = false }) => ({
        id,
        name,
        isCombo,
      }));
      const products = resProductStore.data.products;
      const resProductTotalPages = resProductStore.data.productTotalPages;
      resCatetogries.forEach((category) => {
        const sectionGroupProduct = {
          id: category?.id,
          name: category?.name,
          products: [],
          isCombo: false,
        };

        if (products[category.id] && products[category.id].length > 0) {
          products[category.id].forEach((product) => {
            sectionGroupProduct.products.push(converToProductItem(product));
          });
        }

        listSectionGroups.push(sectionGroupProduct);
      });

      setListCategories([...listComboNavbar, ...resCatetogries]);
      setCurrency(resProductStore.data.storeCurrencySymbol);
      setProductTotalPage(resProductTotalPages);
      setPromotions(resProductStore.data.promotions);
      setListSectionGroups(listSectionGroups);
      setIsFirstCallProductsDone(true);
      setTimeout(() => {
        setInitializingProducts(false);
      }, 400);
    }
  };

  useEffect(() => {
    if (isFirstCallProductsDone) {
      setIsSecondCallProductsDone(true);
      getProductsAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstCallProductsDone]);

  useEffect(() => {
    if (
      isSecondCallProductsDone === true &&
      params.productCategoryId !== "" &&
      params.productCategoryId !== undefined
    ) {
      setTimeout(() => {
        let paddingTop = 0;
        const elementHeader = document.getElementById("header");
        if (elementHeader) {
          if (props?.general?.header?.scrollType !== ScrollHeaderType.FIXED) {
            paddingTop += elementHeader.offsetHeight;
          }
        }

        const element = document.getElementById(`list-products-section-id-${params.productCategoryId}`);
        window.scrollTo({
          top: element?.offsetTop - paddingTopProductList + paddingTop,
          behavior: "smooth",
        });
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSecondCallProductsDone]);

  useEffect(() => {
    // Avoid infinite loops
    const newTimeoutIndex = timeoutIndex + 1;
    if (
      newTimeoutIndex < 10 &&
      isSecondCallProductsDone &&
      listSectionGroups.some(
        (category) => category?.isCombo === false && category?.products?.length < productTotalPage?.[category.id],
      )
    ) {
      getProductsAsync();
    }
    setTimeoutIndex(newTimeoutIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSectionGroups]);

  const getProductsAsync = async () => {
    const categoryId = listSectionGroups.find(
      (category) => category?.isCombo === false && category?.products?.length < productTotalPage?.[category.id],
    )?.id;
    if (categoryId) {
      const resProduct = await productDataService.getProductsStoreScrollSpy(categoryId, branchAddress?.id);
      if (resProduct) {
        Object.keys(resProduct.data.products).forEach((categoryId) => {
          const category = listSectionGroups.find((category) => category.id === categoryId);
          const listNewProducts = resProduct.data.products[categoryId]
            .filter((product) => !category.products.some((productInCategory) => productInCategory.id === product.id))
            .map((product) => converToProductItem(product));

          const indexSectionGroup = listSectionGroups.findIndex((section) => section.id === categoryId);
          setListSectionGroups((prev) =>
            prev.map((section, i) =>
              i === indexSectionGroup ? { ...section, products: [...section.products, ...listNewProducts] } : section,
            ),
          );
        });
      }
    }
  };

  const converToProductItem = (productApi) => {
    const product = {
      id: productApi?.id,
      name: productApi?.name,
      productPriceId: productApi?.productPrices[0]?.id,
      originalPrice: productApi?.productPrices[0]?.originalPrice,
      sellingPrice: productApi?.productPrices[0]?.priceValue,
      flashSaleId: productApi?.flashSaleId,
      isFlashSale: productApi?.isFlashSale,
      thumbnail: productApi?.thumbnail,
      isCombo: false,
      isDiscountPercent: productApi?.isDiscountPercent,
      discountValue: productApi?.discountValue,
      promotionTag: productApi?.productPrices?.[0]?.promotionTag,
      priceName: productApi?.productPrices?.[0]?.priceName,
    };
    return product;
  };

  const handleAddToCart = async (_data) => {
    let params = { id: _data.id, isCombo: _data?.isCombo };
    if (_data?.isCombo) {
      params.type = _data?.type;
      params.comboId = _data?.comboId;
      params.comboPricingProducts = _data?.data?.comboPricingProducts;
      params.comboProductPrices = _data?.data?.comboProductPrices;
    } else {
      params.productPriceId = _data?.productPriceId;
      params.isFlashSale = _data?.isFlashSale;
      params.flashSaleId = _data?.flashSaleId;
    }
    productComboAddToCartServices.quickAddToCart(params, _data.type, branchAddress?.id, (isOutOfStock) =>
      callBackOutOfStock(isOutOfStock),
    );
  };

  function callBackOutOfStock(isOutOfStock) {
    if (!isOutOfStock) onShowToastMessageAddToCart();
  }

  function onShowToastMessageAddToCart() {
    dispatch(
      setToastMessageAddUpdateProductToCart({
        position: "topRight",
        icon: null,
        message: translatedData.addCartItemToastMessage,
      }),
    );
    setTimeout(() => {
      dispatch(setToastMessageAddUpdateProductToCart(null));
    }, 100);
  }

  // region handle cart

  //http://localhost:3000/product-list?qrCodeId=69fb7d32-93c6-4b66-8a39-0df5713d469c
  useEffect(() => {
    // TODO: Fetch store info and init data from router parameters
    // branchName, branchAddress, storeLogo, area-table, products add to cart, redirect to store menu
    if (isValidQrCodeId(qrCodeId)) {
      fetchData(qrCodeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getOptionsSelected = (options) => {
    let optionsSelected = [];
    if (options) {
      // eslint-disable-next-line array-callback-return
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

  // eslint-disable-next-line no-unused-vars
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
    // eslint-disable-next-line array-callback-return
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
          className: "message-scan-qr-code",
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
      className: "message-scan-qr-code",
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
      const paramState = {
        isGoFromScanQR: true,
      };
      history.push({
        pathname: "/checkout",
        state: paramState,
      });
    }, 500);

    Toast.show({
      messageType: "success",
      message: translatedData.addCartItemToastMessage,
      icon: <CheckCircleIcon />,
      placement: "bottom",
      duration: 3,
      className: "message-scan-qr-code",
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
  // end region handle cart

  const renderCategory = useMemo(() => {
    if (document.getElementsByClassName("product-list-card-theme1")?.length > 0 &&
      !initializingProducts &&
      listCategories &&
      styleProductList)
      return (
        <NavigationCategory
          listCategories={listCategories}
          styleProductList={styleProductList}
          headerConfig={props?.general?.header}
        />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listCategories]);

  return (
    <div className="page-product-list-theme1">
      <div className="banner-top-product-list">
        {styleProductListHeader?.backgroundType === backgroundTypeEnum.Image ? (
          <img className="banner-top-product-list__img" src={styleProductListHeader?.backgroundImage} alt="" />
        ) : (
          <div
            className="banner-top-product-list__banner-color"
            style={{ background: `${styleProductListHeader?.backgroundColor}` }}
          />
        )}
        <span className="banner-top-product-list__title"
          style={{ color: styleProductListHeader?.colorGroup?.titleColor }}>
          {props?.config?.header?.title}
        </span>
      </div>
      <div
        className={`wrapper-nav-and-products ${styleProductList?.backgroundType === backgroundTypeEnum.Image
          ? "wrapper-nav-and-products--background-type-image"
          : "wrapper-nav-and-products--background-type-color"
          }`}
        style={styleProductList?.backgroundType === backgroundTypeEnum.Image ?
          { backgroundImage: `url(${styleProductList?.backgroundImage})` } :
          { backgroundColor: styleProductList?.backgroundColor }
        }
      >
        {renderCategory}
        <CloseBranchContainer branchId={branchAddress?.id} />
        <div className="section-product-list">
          {listSectionGroups.map((item, index) => {
            return (
              <ProductListCard
                key={`product-list-card-${index}}`}
                id={item.id}
                name={item.name}
                listProducts={item.products}
                currency={currency}
                totalItems={
                  productTotalPage && productTotalPage?.[item.id] > 0
                    ? productTotalPage?.[item.id]
                    : item.products.length
                }
                handleAddToCart={(data) => handleAddToCart(data)}
                styleProductList={styleProductList}
              />
            );
          })}
        </div>
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
    </div>
  );
}

export default ProductListTheme1;
