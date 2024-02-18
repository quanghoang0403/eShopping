import { CaretDownOutlined, CaretRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Input, Row, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { EnumAddToCartType } from "../../../../constants/enums";
import { Platform } from "../../../../constants/platform.constants";
import comboDataService from "../../../../data-services/combo-data.service";
import orderDataService from "../../../../data-services/order-data.service";
import productDataService from "../../../../data-services/product-data.service";
import { setCartItems, setNotificationDialog } from "../../../../modules/session/session.actions";
import {
  setToastMessageAddUpdateProductToCart,
  setToastMessageMaxDiscount,
} from "../../../../modules/toast-message/toast-message.actions";
import {
  checkListProductPriceIdOutOfStock,
  checkOutOfStockWhenQuickAdd,
} from "../../../../services/material/check-out-of-stock.service";
import maxDiscountService from "../../../../services/max-discount.services";
import productComboAddToCartServices from "../../../../services/product-combo-add-to-cart.services";
import { LockMultipleCalls } from "../../../../services/promotion.services";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import {
  calculatePercentage,
  formatTextNumber,
  getLabelPromotion,
  mappingDiscountApplyToPromotionPopupData,
} from "../../../../utils/helpers";
import { HttpStatusCode } from "../../../../utils/http-common";
import { getStorage, localStorageKeys } from "../../../../utils/localStorage.helpers";
import {
  CartLinearIcon,
  CloseIcon,
  HomePageStoreWebIcon,
  MinusOutlined,
  NoteIcon,
  PlusOutlined,
  ReviewIcon,
  RightCategoryIcon,
} from "../../../assets/icons.constants";
import productDefaultImage from "../../../assets/images/product-default-img.jpg";
import productDefault from "../../../assets/images/product-default.png";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog.component";
import FnbFlashSaleBannerComponent from "../../../components/fnb-flash-sale-banner/fnb-flash-sale-banner.component";
import { MaximumLimitFlashSaleNotifyComponent } from "../../../components/maximum-limit-flash-sale-notify/maximum-limit-flash-sale-notify.component";
import NameAndValuePopoverStoreWeb from "../../../components/name-and-value-popup-store-web/NameAndValuePopoverStoreWeb";
import { EnumPromotion } from "../../../constants/enums";
import {
  backgroundTypeEnum,
  comboType,
  theme1ElementCustomize,
  theme1ElementRightId,
} from "../../../constants/store-web-page.constants";
import { CloseBranchContainer } from "../../../containers/close-branch/close-branch.container";
import { dataProductDefault, productImagesDefault } from "../default-data";
import "./flash-sale.scss";
import ProductDetailDescriptionComponent from "./product-detail-description.component";
import ProductDetailImagesComponent from "./product-detail-images.component";
import { ProductDetailOptionComponent } from "./product-detail-option.component";
import ProductDetailProductPriceComponent from "./product-detail-product-price.component";
import ProductDetailRateComponent from "./product-detail-rate.component";
import { ProductDetailToppingComponent } from "./product-detail-topping.component";
import "./product-detail.component.scss";
import { Theme1SimilarProduct } from "./similar-product.component";
const StyledProductDetail = styled.div`
  .product-detail-container {
    .product-header-content .product-name {
      color: ${(props) => props?.colorConfig?.titleColor};
    }
    .product-detail-content {
      .btn-submit .btn-add-to-cart .btn-add-to-cart-text {
        .add-to-card {
          svg {
            path {
              stroke: ${(props) => props?.colorConfig?.buttonTextColor};
            }
          }
        }
      }
      .modify-quantity {
        background: ${(props) => props?.colorConfig?.buttonBackgroundColor};
        .quantity-product {
          color: ${(props) => props?.colorConfig?.buttonTextColor};
        }
        .ant-btn-icon {
        }
        .btn-reduce {
          background-color: transparent;
        }
        .btn-increase {
          background-color: transparent;
        }
      }
      .quantity-responsive .modify-quantity-for-responsive {
        background: ${(props) => props?.colorConfig?.buttonBackgroundColor};
        .quantity-product {
          color: ${(props) => props?.colorConfig?.buttonTextColor};
        }
        .btn-reduce {
          background-color: transparent;
        }
        .btn-increase {
          background-color: transparent;
        }
      }
      .modify-quantity-topping {
        .active {
          background: ${(props) => props?.colorConfig?.buttonBackgroundColor};
          .quantity-product {
            color: ${(props) => props?.colorConfig?.buttonTextColor};
          }
        }
      }
    }
  }
`;
export function ProductDetailComponent(props) {
  const { pageDefaultData, clickToFocusCustomize, isCustomize, isDefault } = props;
  const path = props?.path ?? "";
  const productDetail = props?.config;
  const dispatch = useDispatch();
  const param = useParams();
  const [t] = useTranslation();
  const { TextArea } = Input;
  const translatedData = {
    leaveAMessageForTheStore: t("storeWebPage.generalUse.leaveAMessageForTheStore", "leaveAMessageForTheStore"),
    description: t("storeWebPage.generalUse.description", "description"),
    maybeYouLike: t("storeWebPage.generalUse.maybeYouLike", "maybeYouLike"),
    review: t("storeWebPage.generalUse.review", "review"),
    thereAreCurrentlyNoReviews: t("storeWebPage.generalUse.thereAreCurrentlyNoReviews", "thereAreCurrentlyNoReviews"),
    addProductToCart: t("storeWebPage.productDetailPage.addProductToCart", "addProductToCart"),
    chooseOptions: t("storeWebPage.productDetailPage.chooseOptions", "chooseOptions"),
    promotion: t("storeWebPage.productDetailPage.promotion", "promotion"),
    flashSaleInActive: t("promotion.flashSale.description.inactive"),
    notification: t("loginPage.notification"),
    okay: t("form.okay"),
    productNotInBranch: t("form.productNotInBranch"),
    addCartItemToastMessage: t("addCartItemToastMessage", "Sản phẩm đã được thêm vào giỏ hàng thành công"),
    notePlaceHolder: t("checkOutPage.notePlaceHolder", "Nhập ghi chú"),
    chooseSize: t("storeWebPage.productDetailPage.chooseSize", "Chọn size"),
    addTopping: t("storeWebPage.productDetailPage.addTopping", "Thêm topping"),
    outOfStock: t("storeWebPage.productDetailPage.outOfStock", "outOfStock"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Sorry! Product is not enough of stock"),
    collapse: t("storeWebPage.productDetailPage.collapse", "Sorry! Product is not enough of stock"),
    extend: t("storeWebPage.productDetailPage.extend", "Sorry! Product is not enough of stock"),
    homePage: t("blogDetail.home", "Home Page"),
    quantity: t("storeWebPage.productDetailPage.quantity", "Sorry! Product is not enough of stock"),
  };
  const [isChangeSize, setIsChangeSize] = useState(false);
  const [noData, setNoData] = useState(false);
  const [productData, setProductData] = useState();
  const [similarProducts, setSimilarProducts] = useState();
  const [isCombo, setIsCombo] = useState(false);
  const [comboData, setComboData] = useState();
  const [productName, setProductName] = useState();
  const [description, setDescription] = useState();
  const [productImages, setProductImages] = useState([]);
  const [productPrices, setProductPrices] = useState([]);
  const [productPriceSelected, setProductPriceSelected] = useState({});
  const [isPromotion, setIsPromotion] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionsSelected, setOptionsSelected] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [quantityProduct, setQuantityProduct] = useState(1);
  const [totalProductPrice, setTotalProductPrice] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [promotionValue, setPromotionValue] = useState("");
  const [totalOriginalPrice, setTotalOriginalPrice] = useState(0);
  const [totalPriceTopping, setTotalPriceTopping] = useState(0);
  const [messagesForStore, setMessagesForStore] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isShowFlashSaleInActive, setIsShowFlashSaleInActive] = useState(false);
  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  const [isShowProductNotInBranchModal, setIsShowProductNotInBranchModal] = useState(false);

  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [isLoadingOutOfStock, setIsLoadingOutOfStock] = useState(false);

  const [promotionsOfProductPriceApplied, setPromotionOfProductPriceApplied] = useState([]);
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const branchAddressId = deliveryAddress?.branchAddress?.id ?? "";
  const history = useHistory();
  const swiperRef = useRef(null);
  const handleLeftArrow = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };
  const handleRightArrow = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  useEffect(() => {
    if (!Boolean(branchAddressId)) {
      return;
    }

    if (!productData?.product?.productDetail?.id || isCustomize || isDefault) return;
    const handleCheckProductInBranch = async () => {
      const checkProductInBranch = await productDataService.checkProductInBranchAsync(
        productData?.product?.productDetail?.id,
        branchAddressId,
      );
      if (checkProductInBranch?.data?.success === false) {
        setIsShowProductNotInBranchModal(true);
        return;
      } else {
        getDataProductOrCombo(param, branchAddressId);
        return () => {
          window.scrollTo(0, 0);
        };
      }
    };
    handleCheckProductInBranch();
  }, [branchAddressId, productData?.product?.productDetail?.id]);

  useEffect(() => {
    setIsLoadingData(true);
    var productPrice = productPrices.find((item) => item?.flashSaleId);
    if (productPrice) {
      setProductPriceSelected(productPrice);
    } else {
      const defaultProductPriceIndex = productData?.product?.productDetail?.defaultProductPriceIndex;
      setProductPriceSelected(
        productPrices[defaultProductPriceIndex] ? productPrices[defaultProductPriceIndex] : productPrices[0],
      );
    }
    setIsLoadingData(false);
  }, [productPrices]);

  useEffect(() => {
    getPriceToppingProduct(productData?.product, toppings);
  }, [productPriceSelected]);

  useEffect(() => {
    setIsLoadingData(true);
    setOriginalPrice(productPriceSelected?.originalPrice);
    setSellingPrice(productPriceSelected?.priceValue);
    setPromotionOfProductPriceApplied(productPriceSelected?.promotions);

    if (productPriceSelected?.flashSaleId) {
      //apply flash sale
      if (productPriceSelected?.originalPrice > productPriceSelected?.priceValue) {
        setPromotionValue(
          "-" + calculatePercentage(productPriceSelected?.priceValue, productPriceSelected?.originalPrice),
        );
      } else {
        setPromotionValue("");
      }
    } else {
      if (productPriceSelected?.isApplyPromotion) {
        setPromotionValue(productPriceSelected?.promotionTag);
      } else {
        setPromotionValue("");
      }
    }
    setIsLoadingData(false);
  }, [productPriceSelected]);

  useEffect(() => {
    setIsLoadingData(true);
    if (!isCombo) {
      setOptionsSelected(getOptionsSelected(options));
    }
    setIsLoadingData(false);
  }, [options]);

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

  useEffect(() => {
    setIsLoadingData(true);
    if (productData) {
      initProductData();
    }
    setIsLoadingData(false);
  }, [productData]);

  const initProductData = () => {
    setProductName(productData?.product?.productDetail?.name);
    setDescription(productData?.product?.productDetail?.description);
    setProductPrices(productData?.product?.productDetail?.productPrices);
    setOptions(productData?.product?.productDetail?.productOptions);
    setToppings(productData?.product?.productToppings);
    getPriceToppingProduct(productData?.product);
    if (param?.productId || (pageDefaultData && Object.keys(pageDefaultData).length)) {
      const productImage = productData?.product?.productDetail?.thumbnail;
      setProductImages([
        {
          imageUrl: Boolean(productImage) ? productImage : productDefault,
          imageZoomOutUrl: Boolean(productImage) ? productImage : productDefaultImage,
        },
      ]);
    }
    setMessagesForStore("");
    setTotalPriceTopping(0);
    setQuantityProduct(1);
  };

  useEffect(() => {
    setIsLoadingData(true);
    if (comboData) {
      initComboData();
      //Set Active Key - Auto Extend Combo Data Product Prices Ids
      const productPriceIds = [comboData?.comboProductPrices[0]?.productPriceId];
      setActiveKey(productPriceIds);
    }
    setIsLoadingData(false);
  }, [comboData]);

  const initComboData = () => {
    if (comboData?.comboTypeId === comboType.comboPricing.id) {
      setProductName(comboData?.comboPricingName);
    } else {
      setProductName(comboData?.name);
    }

    setDescription(comboData?.description);
    setProductImages([
      {
        imageUrl: Boolean(comboData?.thumbnail) ? comboData?.thumbnail : productDefault,
        imageZoomOutUrl: Boolean(comboData?.thumbnail) ? comboData?.thumbnail : productDefaultImage,
      },
    ]);
    let _toppings = [];
    let _options = [];
    let _originalPrice = 0;
    comboData?.comboProductPrices?.map((item) => {
      let product = item?.productPrice?.product;
      _options.push(getOptionsSelected(product?.productOptions));
      _toppings.push(product?.productToppings);
      _originalPrice += item?.priceValue;
    });
    setOptionsSelected(_options);
    setToppings(_toppings);
    setSellingPrice(comboData?.sellingPrice);
    setOriginalPrice(_originalPrice);
    setIsPromotion(true);
    setPromotionValue(calculatePercentage(comboData?.sellingPrice, _originalPrice));
    setMessagesForStore("");
    setTotalPriceTopping(0);
    setQuantityProduct(1);
  };

  const getProductDetail = async (productId, branchId) => {
    return await productDataService.getProductDetailByIdAsync(productId, Platform.StoreWebsite, branchId);
  };

  useEffect(() => {
    setIsLoadingData(true);
    getDataProductOrCombo(param, branchAddressId);
    setIsLoadingData(false);
  }, [branchAddressId]);

  const getSimilarProduct = async (categoryId) => {
    const similarProduct = await productDataService.getProductsStoreTheme(
      categoryId,
      deliveryAddress?.branchAddress?.id ?? "",
    );
    return similarProduct;
  };

  const getComboProductPrice = async (comboId) => {
    const comboDetail = await comboDataService.getComboProductPriceByComboIdAsync(comboId);
    return comboDetail;
  };

  const getComboPricing = async (comboPricingId) => {
    const comboDetail = await comboDataService.getComboPricingByComboPricingIdAsync(comboPricingId);
    return comboDetail;
  };

  const getSimilarCombos = async () => {
    const combos = await comboDataService.getSimilarCombosByBranchIdAsync();
    return combos;
  };

  const mappingSimilarProducts = (similarProducts) => {
    const newSimilarProducts = similarProducts?.map((s) => {
      let _promotionTitle = "";
      const _sellingPrice = s?.productPrices?.[s?.defaultProductPriceIndex ?? 0]?.priceValue;
      const _originalPrice = s?.productPrices?.[s?.defaultProductPriceIndex ?? 0]?.originalPrice;
      const _promotionTag = s?.productPrices?.[s?.defaultProductPriceIndex ?? 0]?.promotionTag;

      if (s?.isHasPromotion || s?.isFlashSale) {
        _promotionTitle = getLabelPromotion(
          s?.isFlashSale,
          s?.isDiscountPercent,
          s?.discountValue,
          s?.isHasPromotion,
          _originalPrice,
          _sellingPrice,
          _promotionTag,
        );
      }
      return {
        id: s?.id,
        name: s?.name,
        thumbnail: s?.thumbnail ?? productDefault,
        sellingPrice: _sellingPrice,
        originalPrice: _originalPrice,
        navigateTo: path + "/product-detail/" + s?.id,
        isFlashSale: s?.isFlashSale,
        flashSaleId: s?.flashSaleId,
        productPriceId: s?.productPrices?.[s?.defaultProductPriceIndex ?? 0]?.id, // productPriceId default
        isPromotion: s?.isHasPromotion,
        promotionTitle: _promotionTitle,
        priceName: s?.productPrices?.[s?.defaultProductPriceIndex ?? 0]?.priceName,
      };
    });
    return newSimilarProducts;
  };

  const mappingSimilarCombos = (similarCombos) => {
    const newSimilarCombos = [];
    similarCombos?.map((combo) => {
      if (combo?.comboTypeId === comboType.comboPricing.id) {
        combo?.comboPricings?.map((comboPricing) =>
          newSimilarCombos.push({
            id: comboPricing?.id,
            comboPricingProducts: comboPricing?.comboPricingProducts,
            name: comboPricing?.customName,
            thumbnail: combo?.thumbnail ?? productDefault,
            sellingPrice: comboPricing?.sellingPrice,
            originalPrice: comboPricing?.originalPrice,
            isPromotion: true,
            comboTypeId: combo?.comboTypeId,
            promotionTitle: calculatePercentage(comboPricing?.sellingPrice, comboPricing?.originalPrice),
            navigateTo: path + "/combo-detail/" + comboType.comboPricing.path + "/" + comboPricing?.id,
          }),
        );
      } else if (combo?.comboTypeId === comboType.comboProductPrice.id) {
        newSimilarCombos.push({
          id: combo?.id,
          name: combo?.name,
          comboProductPrices: combo.comboProductPrices,
          thumbnail: combo?.thumbnail ?? productDefault,
          sellingPrice: combo?.sellingPrice,
          originalPrice: combo?.originalPrice,
          isPromotion: true,
          comboTypeId: combo?.comboTypeId,
          promotionTitle: calculatePercentage(combo?.sellingPrice, combo?.originalPrice),
          navigateTo: path + "/combo-detail/" + comboType.comboProductPrice.path + "/" + combo?.id,
        });
      }
    });
    return newSimilarCombos;
  };

  const getDataProductOrCombo = (param, branchId) => {
    let newData = {};
    if (param?.comboType) {
      if (param?.comboId) {
        setIsCombo(true);
        if (param?.comboType === comboType.comboProductPrice.path) {
          getComboProductPrice(param?.comboId)
            .then((response) => {
              if (response?.status === HttpStatusCode.Ok && response?.data?.isSuccess) {
                newData = response?.data?.combo;
                setComboData(newData);
                getSimilarCombos()
                  .then((responseSimilarCombos) => {
                    if (responseSimilarCombos?.status === HttpStatusCode.Ok && responseSimilarCombos?.data?.isSuccess) {
                      const _similarProducts = mappingSimilarCombos(
                        responseSimilarCombos?.data?.combos?.filter((p) => p.id !== param?.comboId),
                      );
                      setSimilarProducts(_similarProducts);
                    } else {
                      //To do
                    }
                  })
                  .catch((responseSimilarCombos) => {
                    // To do
                  });
              } else {
                setNoData(true);
              }
            })
            .catch((response) => {
              setNoData(true);
            });
        } else if (param?.comboType === comboType.comboPricing.path) {
          // param?.comboId is comboPricingId
          getComboPricing(param?.comboId)
            .then((response) => {
              if (response?.status === HttpStatusCode.Ok && response?.data?.isSuccess) {
                newData = response?.data?.combo;
                setComboData(newData);
                getSimilarCombos()
                  .then((responseSimilarCombos) => {
                    if (responseSimilarCombos?.status === HttpStatusCode.Ok && responseSimilarCombos?.data?.isSuccess) {
                      const _similarProducts = mappingSimilarCombos(
                        responseSimilarCombos?.data?.combos?.filter((p) => p.id !== param?.comboId),
                      );
                      setSimilarProducts(_similarProducts);
                    } else {
                      //To do
                    }
                  })
                  .catch((responseSimilarCombos) => {
                    //To do
                  });
              } else {
                setNoData(true);
              }
            })
            .catch((response) => {
              setNoData(true);
            });
        } else {
          setNoData(true);
        }
      } else {
        setNoData(true);
      }
    } else if (param?.productId) {
      getProductDetail(param?.productId, branchId)
        .then((response) => {
          if (response?.status === HttpStatusCode.Ok) {
            newData.product = response?.data;
            newData.promotions = response?.data?.promotions;
            setProductData(newData);
            const categoryId = response?.data?.productDetail?.productCategoryId;
            if (categoryId) {
              getSimilarProduct(categoryId)
                .then((responseSimilarProduct) => {
                  if (responseSimilarProduct?.status === HttpStatusCode.Ok) {
                    let _similarProducts = responseSimilarProduct?.data?.products;
                    _similarProducts = mappingSimilarProducts(
                      _similarProducts?.filter((p) => p.id !== param?.productId),
                    );
                    setSimilarProducts(_similarProducts);
                  }
                })
                .catch((response) => {
                  //To do
                });
            }
          } else {
            setNoData(true);
          }
        })
        .catch((response) => {
          setNoData(true);
          return history.push("/product-list");
        });
    } else {
      if (pageDefaultData && Object.keys(pageDefaultData).length) {
        newData = { ...pageDefaultData };
        const _similarProducts = mappingSimilarProducts(
          pageDefaultData?.similarProducts?.filter((p) => p.id !== param?.productId),
        );
        setProductData(newData);
        setSimilarProducts(_similarProducts);
      } else {
        newData = dataProductDefault;
        setProductData(newData);
        setSimilarProducts(newData?.similarProducts);
        setProductImages(productImagesDefault);
      }
    }
  };

  const isFlashSaleIncludedTopping = () => {
    return productPriceSelected?.flashSaleId && productPriceSelected?.isIncludedTopping;
  };

  /// Handle caculateTotalOfAmountHaveMaximumLimit
  const calculateTotalOfAmountHaveMaximumLimit = async (quantityHaveFlashSale, quantity, originalPrice, priceValue) => {
    const priceAfterMaximumLimit = await calculateAmountAfterMaximumLimit(quantity - quantityHaveFlashSale);
    setPromotionOfProductPriceApplied(priceAfterMaximumLimit?.promotions);
    return quantityHaveFlashSale * priceValue + priceAfterMaximumLimit.sellingPrice;
  };

  const calculateAmountAfterMaximumLimit = async (quantity) => {
    let productToppings = toppings.filter((a) => a.quantity >= 1) ?? [];
    let toppingsData = [];
    for (const item of productToppings) {
      let toppingItem = {
        ...item,
        toppingId: item?.toppingId ?? item?.id,
        quantity: item?.quantity,
      };

      toppingsData.push(toppingItem);
    }
    const dataSubmit = {
      productId: productData?.product?.productDetail?.id,
      productPriceId: productPriceSelected?.id,
      productCategoryId: productData?.product?.productDetail?.productCategoryId,
      isCombo: false,
      quantity: quantity,
      toppings: toppingsData,
      comboTypeId: "",
      comboPricingId: "",
      branchId: branchAddress?.id,
      isProductAfterMaximumLimit: true,
    };

    let dataResult = await productDataService.calculatingPriceOfTheProduct(dataSubmit);
    return dataResult.data;
  };

  const getDataCalculatePrice = async (toppingGroupSelected, quantityProduct, sizeId = "") => {
    if (isCombo) return;
    let dataSubmit = {};
    let productToppings = toppingGroupSelected?.filter((a) => a?.quantity > 0) ?? [];

    if (!productData) return;
    let productPriceValue = productData?.product?.productDetail?.productPrices?.find(
      (a) => a.id === (sizeId ? sizeId : productPriceSelected?.id),
    );
    const totalOriginalPriceOfTopping = productToppings?.reduce(
      (totalPriceOfTopping, topping) =>
        totalPriceOfTopping +
        (topping?.originalPrice ? topping?.originalPrice : topping?.priceValue) * topping?.quantity * quantityProduct,
      0,
    );

    if (productPriceValue?.flashSaleId != null) {
      const totalPriceOfTopping = productPriceValue?.isIncludedTopping ? 0 : totalOriginalPriceOfTopping ?? 0;
      const dataResult = {
        sellingPrice: productPriceValue?.priceValue * quantityProduct + (totalPriceOfTopping ?? 0),
        originalPrice: productPriceValue?.originalPrice * quantityProduct + (totalOriginalPriceOfTopping ?? 0),
        totalPriceOfTopping: totalPriceOfTopping ?? 0,
        quantityProduct: quantityProduct,
        sellingPriceNotYetHaveQuantity: productPriceValue?.priceValue,
        originalPriceNotYetHaveQuantity: productPriceValue?.originalPrice,
      };
      return dataResult;
    } else {
      dataSubmit = {
        productId: productData?.product?.productDetail?.id,
        productPriceId: productPriceValue?.id,
        productCategoryId: productData?.product?.productDetail?.productCategoryId,
        isCombo: false,
        quantity: quantityProduct,
        toppings: productToppings,
        comboTypeId: "",
        comboPricingId: "",
        branchId: branchAddress?.id,
      };
    }

    let dataResult = null;
    if (dataSubmit?.productPriceId && isCustomize !== true) {
      dataResult = await productDataService.calculatingPriceOfTheProduct(dataSubmit);
    }

    return dataResult?.data;
  };

  const calculateTotalOfAmount = async () => {
    if (isCombo) {
      setTotalProductPrice((totalPriceTopping + comboData?.sellingPrice) * quantityProduct);
      setTotalOriginalPrice((totalPriceTopping + comboData?.originalPrice) * quantityProduct);
    } else {
      /// Handle caculateTotalOfAmountHaveMaximumLimit
      if (quantityProduct > productPriceSelected?.maximumLimit && productPriceSelected?.maximumLimit > 0) {
        if (isFlashSaleIncludedTopping()) {
          setTotalProductPrice(
            await calculateTotalOfAmountHaveMaximumLimit(
              productPriceSelected?.maximumLimit,
              quantityProduct,
              productPriceSelected?.originalPrice,
              productPriceSelected?.priceValue,
            ),
          );
          setTotalOriginalPrice((totalPriceTopping + productPriceSelected?.originalPrice) * quantityProduct);
        } else {
          setTotalProductPrice(
            totalPriceTopping * productPriceSelected?.maximumLimit +
              (await calculateTotalOfAmountHaveMaximumLimit(
                productPriceSelected?.maximumLimit,
                quantityProduct,
                productPriceSelected?.originalPrice,
                productPriceSelected?.priceValue,
              )),
          );
          setTotalOriginalPrice((totalPriceTopping + productPriceSelected?.originalPrice) * quantityProduct);
        }
      } else {
        const calculateValue = await getDataCalculatePrice(toppings, quantityProduct, productPriceSelected?.id);
        if (calculateValue) {
          setTotalProductPrice(calculateValue?.sellingPrice);
          setTotalOriginalPrice(calculateValue?.originalPrice);
          setPromotionOfProductPriceApplied(calculateValue?.promotions);
        }
      }
    }
  };

  useEffect(() => {
    setIsLoadingData(true);
    calculateTotalOfAmount();
    if (!isCombo) {
      setIsPromotion(productPriceSelected?.isApplyPromotion);
    }
    setIsLoadingData(false);
  }, [totalPriceTopping, productPriceSelected, quantityProduct, comboData]);

  const maximumQuantity = 99;
  let defaultActiveKey = ["ProductPrices", "Topping"];
  let productPricesDefaultActiveKey = [];
  const [activeKey, setActiveKey] = useState([]);

  const onChangeActiveKeys = (keys, productPricesIndex) => {
    const updatedActiveKey = [...activeKey];
    updatedActiveKey[productPricesIndex] = keys;
    setActiveKey(updatedActiveKey);
  };
  let colorGroup = productDetail?.colorGroup;
  let styleBackground = {};
  if (productDetail?.backgroundType == backgroundTypeEnum.Color) {
    styleBackground = {
      backgroundColor: productDetail?.backgroundColor,
    };
  } else if (productDetail?.backgroundType == backgroundTypeEnum.Image) {
    styleBackground = {
      backgroundImage: `url(${productDetail?.backgroundImage})`,
      backgroundAttachment: "initial",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    };
  }

  const styleTitle = {
    color: colorGroup?.titleColor,
  };

  const styleTitleForPrice = {
    color: colorGroup?.titleColor,
    display: "flex",
    marginTop: "12px",
    alignItems: "center",
  };

  const styleText = {
    color: colorGroup?.textColor,
  };

  const styleButton = {
    color: colorGroup?.buttonTextColor,
    backgroundColor: colorGroup?.buttonBackgroundColor,
  };

  const StyledButtonActive = styled.div`
    .ant-radio-button-wrapper-checked {
      color: ${colorGroup?.textColor} !important;
      background-color: ${colorGroup?.buttonBackgroundColor} !important;
      border: 1px solid ${colorGroup?.buttonBackgroundColor} !important;
    }

    .ant-collapse-header-text {
      color: ${colorGroup?.titleColor} !important;
    }

    .style-text-customize {
      color: ${colorGroup?.textColor} !important;
    }
  `;

  const updateQuantityProduct = async (quantity, isIncrease) => {
    if (isCombo && comboData) {
      const productPriceIds = comboData?.comboProductPrices?.map((productPrice) => productPrice.productPriceId);
      let verifyOutOfStock = await checkListProductPriceIdOutOfStock(branchAddress?.id, productPriceIds, quantity);
      if (verifyOutOfStock) {
        //setIsOutOfStock(true);
        const notificationDialog = {
          isShow: true,
          content: translatedData.textOutOfStock,
        };
        dispatch(setNotificationDialog(notificationDialog));
        return;
      }
    }
    if (!isCombo && productPriceSelected) {
      let verifyOutOfStock = await checkOutOfStockWhenQuickAdd(
        false,
        branchAddress?.id,
        productPriceSelected?.id,
        quantity,
      );
      if (verifyOutOfStock) {
        if (isIncrease) {
          const notificationDialog = {
            isShow: true,
            content: translatedData.textOutOfStock,
          };
          dispatch(setNotificationDialog(notificationDialog));
        } else {
          setIsOutOfStock(true);
          setQuantityProduct(quantity);
        }
        return;
      } else {
        setIsOutOfStock(false);
      }
    }

    if (quantity >= 1 && quantity <= maximumQuantity) {
      setQuantityProduct(quantity);

      /// Handle calculation max discount
      const data = {
        isApplyPromotion: productData?.product?.productDetail?.isHasPromotion,
        isIncludedTopping: productData?.product?.productDetail?.isIncludedTopping,
        isDiscountProductCategory: productData?.product?.productDetail?.isPromotionProductCategory,
        totalPriceTopping:
          (quantity * totalPriceTopping * productData?.product?.productDetail?.discountValue || 1) / 100,
        totalPriceValue: quantity * productPriceSelected?.priceValue,
        maximumDiscountAmount: productData?.product?.productDetail?.maximumDiscountAmount,
        quantity: quantity,
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
  };

  const onChangeSize = (e) => {
    setProductPriceSelected(e.target.value);
    setIsChangeSize(true);
  };

  function handleCheckInventory(branchId) {
    // check combo
    if (isCombo && comboData) {
      const productPriceIds = comboData?.comboProductPrices?.map((productPrice) => productPrice.productPriceId);
      handleCheckListProductPriceIdOutOfStock(productPriceIds, branchId);
    }

    // check product
    if (!isCombo && productPriceSelected) {
      if (Object.keys(productPriceSelected)?.length !== 0) {
        handleCheckProductPriceIdOutOfStock(productPriceSelected, branchId);
      }
    }
  }

  useEffect(() => {
    LockMultipleCalls(
      () => {
        handleCheckInventory(branchAddressId);
      },
      "handleCheckInventory",
      500,
    );
  }, [branchAddressId, productPriceSelected, comboData]);

  async function handleCheckListProductPriceIdOutOfStock(productPriceIds, branchId) {
    const verifyOutOfStock = await checkListProductPriceIdOutOfStock(branchId, productPriceIds, quantityProduct);
    // Kiểm tra xem outOfStock
    if (verifyOutOfStock) {
      if (quantityProduct > 1) {
        const notificationDialog = {
          isShow: true,
          content: translatedData.textOutOfStock,
        };
        dispatch(setNotificationDialog(notificationDialog));
      }
      if (quantityProduct > 1) {
        setQuantityProduct(quantityProduct - 1);
      } else {
        setIsOutOfStock(true);
      }
    } else {
      setIsOutOfStock(false);
    }
  }

  async function handleCheckProductPriceIdOutOfStock(productPriceSelected, branchId) {
    let verifyOutOfStock = await checkOutOfStockWhenQuickAdd(
      false,
      branchId,
      productPriceSelected?.id,
      quantityProduct,
    );
    // Kiểm tra xem outOfStock
    if (verifyOutOfStock) {
      if (quantityProduct != 1) {
        if (isChangeSize) {
          setIsOutOfStock(true);
        } else {
          const notificationDialog = {
            isShow: true,
            content: translatedData.textOutOfStock,
          };
          dispatch(setNotificationDialog(notificationDialog));
        }
      }
      if (quantityProduct <= 1) {
        setIsOutOfStock(true);
      }
    } else {
      setIsOutOfStock(false);
    }
  }

  const onChangeOptions = (e, index) => {
    const optionsSelectedCopy = [...optionsSelected];
    optionsSelectedCopy.splice(index, 1, e.target.value);
    setOptionsSelected(optionsSelectedCopy);
  };

  const comboOnChangeOptions = (e, productPriceIndex, index) => {
    let optionsSelectedCopy = [...optionsSelected];
    let optionsSelectedIndex = optionsSelectedCopy[productPriceIndex];
    optionsSelectedIndex.splice(index, 1, e.target.value);
    optionsSelectedCopy.splice(productPriceIndex, 1, optionsSelectedIndex);
    setOptionsSelected(optionsSelectedCopy);
  };

  const onShowChooseOptions = () => {
    document.getElementById("popup-choose-options")?.classList.add("d-block");
    document.getElementById("overlay-product-detail-id")?.classList.add("d-block");
    document.getElementsByTagName("body")?.[0]?.classList.add("overflow-hidden");
  };

  const onHideChooseOptions = () => {
    document.getElementById("popup-choose-options")?.classList.remove("d-block");
    document.getElementById("overlay-product-detail-id")?.classList.remove("d-block");
    document.getElementsByTagName("body")?.[0]?.classList.remove("overflow-hidden");
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

  const customExpandIcon = (panelProps) => {
    const { isActive } = panelProps;
    return isActive ? (
      <div className="caret-down-out">
        <span>{translatedData.collapse}</span>
        <CaretDownOutlined />
      </div>
    ) : (
      <div className="caret-up-out">
        <span>{translatedData.extend}</span>
        <CaretRightOutlined />
      </div>
    );
  };

  const mappingDataOptions = (options) => {
    const newOptions = options?.map((o) => ({
      id: o?.optionId,
      name: o?.optionName,
      isSetDefault: o?.isSetDefault,
      optionLevelId: o?.id,
      optionLevelName: o?.name,
    }));
    return newOptions;
  };

  const mappingDataToppings = (toppings) => {
    if (isFlashSaleIncludedTopping()) {
      const newOptions = toppings?.map((t) => ({
        id: t?.toppingId,
        name: t?.name,
        priceValue: 0,
        originalPrice: t?.priceValue,
        quantity: t.quantity,
      }));
      return newOptions;
    } else {
      const newOptions = toppings?.map((t) => ({
        id: t?.toppingId,
        name: t?.name,
        priceValue: t?.priceValue,
        originalPrice: t?.priceValue,
        quantity: t.quantity,
      }));
      return newOptions;
    }
  };

  const updateStoreCart = (product) => {
    const storeCartNew = shoppingCartService.updateStoreCart(product);
    dispatch(setCartItems(storeCartNew));
    onHideChooseOptions();
    onShowToastMessageAddCartItem();
  };

  const onShowToastMessageAddCartItem = () => {
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
  };

  const addSimilarProduct = async (data) => {
    if (isCombo) {
      let requestData = {
        id: data?.id,
        comboProductPrices: data?.comboProductPrices,
        comboPricingProducts: data?.comboPricingProducts,
      };
      productComboAddToCartServices.quickAddToCart(requestData, data?.comboTypeId, branchAddress?.id);
    } else {
      //Verify Out Of Stock
      let verifyOutOfStock = await checkOutOfStockWhenQuickAdd(isCombo, branchAddress?.id, data?.productPriceId, 1);
      if (verifyOutOfStock) {
        const notificationDialog = {
          isShow: true,
          content: translatedData.textOutOfStock,
        };
        dispatch(setNotificationDialog(notificationDialog));
        setIsLoadingOutOfStock(false);
        return;
      } else {
        let requestData = {
          id: data?.id,
          productPriceId: data?.productPriceId,
          isFlashSale: data?.isFlashSale,
          flashSaleId: data?.flashSaleId,
        };
        productComboAddToCartServices.quickAddToCart(requestData, EnumAddToCartType.Product, branchAddress?.id);
      }
    }

    onShowToastMessageAddCartItem();
  };

  const handleVerifyProductInStoreBranchBeforeAddToCart = async () => {
    let canAddToCart = true;
    const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
    const storeConfig = JSON.parse(jsonConfig);
    const storeId = storeConfig?.storeId;
    const branchId = branchAddress?.id;

    let queryString = `storeId=${storeId}&branchId=${branchId}`;
    if (isCombo) {
      const comboId = comboData?.comboTypeId === comboType.comboPricing.id ? comboData?.comboId : comboData?.id;
      queryString += `&comboIds=${comboId}`;
    } else {
      const productId = productData?.product?.productDetail?.id;
      queryString += `&productIds=${productId}`;
    }

    const response = await orderDataService.verifyProductInShoppingCartAsync(queryString);
    if (response) {
      const { comboIds, productIds } = response.data;
      if ((isCombo && comboIds?.length === 0) || (!isCombo && productIds?.length === 0)) {
        canAddToCart = false;
      }
    }

    return canAddToCart;
  };

  const addProductToCart = async () => {
    //Verify product belong to branch befor add to cart
    const canAddToCart = await handleVerifyProductInStoreBranchBeforeAddToCart();
    if (canAddToCart === false) {
      setIsShowProductNotInBranchModal(true);
      return;
    }

    //Verify Out Of Stock
    if (!isCombo) {
      const isOutOfStock = await checkOutOfStockWhenQuickAdd(
        false,
        branchAddress?.id,
        productPriceSelected?.id,
        quantityProduct,
      );
      if (isOutOfStock) {
        const notificationDialog = {
          isShow: true,
          content: translatedData.textOutOfStock,
        };
        dispatch(setNotificationDialog(notificationDialog));
        setIsLoadingOutOfStock(false);
        return;
      }
    }

    if (isCombo) {
      let verifyOutOfStock = await checkOutOfStockWhenQuickAdd(true, branchAddress?.id, comboData, quantityProduct);
      // Kiểm tra xem outOfStock
      if (verifyOutOfStock) {
        const notificationDialog = {
          isShow: true,
          content: translatedData.textOutOfStock,
        };
        dispatch(setNotificationDialog(notificationDialog));
        setIsLoadingOutOfStock(false);
        return;
      }
    }

    //If data is loading from API or product price is re-calculating => Do nothing
    if (isLoadingData || totalProductPrice === null) {
      return;
    }
    if (isCombo) {
      addComboToCart();
    } else {
      const checkProductInBranch = await productDataService.checkProductInBranchAsync(
        productData?.product?.productDetail?.id,
        branchAddress?.id,
      );

      if (!checkProductInBranch?.data?.success) {
        setIsShowProductNotInBranchModal(true);
        return;
      } else {
        const _productPrice = { ...productPriceSelected };
        _productPrice.totalOfToppingOriginalPrice = totalPriceTopping;
        _productPrice.maximumDiscountAmount = productData?.product?.productDetail?.maximumDiscountAmount;
        _productPrice.totalOfToppingPrice = isFlashSaleIncludedTopping() ? 0 : totalPriceTopping;

        const product = {
          isCombo: false,
          id: productData?.product?.productDetail?.id,
          name: productData?.product?.productDetail?.name,
          thumbnail: productImages[0]?.imageUrl,
          notes: messagesForStore,
          productPrice: _productPrice,
          quantity: quantityProduct,
          isFlashSale: productData?.product?.productDetail?.isFlashSale,
          isPromotionProductCategory: productData?.product?.productDetail?.isPromotionProductCategory,
          isPromotionTotalBill: productData?.promotions?.some(
            (item) => item?.promotionTypeId === EnumPromotion.DiscountTotal,
          ),
          options: mappingDataOptions(optionsSelected),
          toppings: mappingDataToppings(toppings),
          dataDetails: productData,
        };
        const currentDate = new Date().toISOString();
        if (
          currentDate > product?.productPrice?.promotionEndTime &&
          product?.productPrice?.promotionEndTime != undefined
        ) {
          setIsShowFlashSaleInActive(true);
        }
        updateStoreCart(product);
      }
    }
    setIsLoadingOutOfStock(false);
    getDataProductOrCombo(param, branchAddressId);
  };

  const addComboToCart = () => {
    let _productList = [];
    comboData?.comboProductPrices?.map((item, index) => {
      let itemProduct = item?.productPrice?.product;
      let _product = {
        id: item?.productPrice?.productId,
        name: itemProduct?.name,
        thumbnail: itemProduct?.thumbnail,
        productPrice: {
          id: item?.productPriceId,
          priceName: item?.priceName,
          priceValue: item?.priceValue,
        },
        options: mappingDataOptions(optionsSelected[index]),
        toppings: mappingDataToppings(toppings[index]),
      };
      _productList.push(_product);
    });

    const combo = {
      isCombo: true,
      id: comboData?.comboTypeId === comboType.comboPricing.id ? comboData?.comboId : comboData?.id,
      name: comboData?.comboPricingName ?? "",
      comboPricingId: comboData?.comboPricingId,
      comboPricingName:
        comboData?.comboTypeId === comboType.comboProductPrice.id ? comboData?.name : comboData?.comboPricingName, //comboData?.comboPricingName,
      thumbnail: comboData?.thumbnail,
      notes: messagesForStore,
      comboTypeId: comboData?.comboTypeId,
      products: _productList,
      quantity: quantityProduct,
      originalPrice: originalPrice,
      sellingPrice: sellingPrice,
      totalOfToppingPrice: totalPriceTopping,
      dataDetails: comboData,
    };
    updateStoreCart(combo);
  };

  const updateQuantityTopping = (index, quantity, price) => {
    let toppingEdit = toppings[index];
    const quantityNew = toppingEdit.quantity + quantity;
    toppingEdit = { ...toppingEdit, quantity: quantityNew };
    let toppingsCopy = [...toppings];
    toppingsCopy.splice(index, 1, toppingEdit);
    setToppings(toppingsCopy);
    setTotalPriceTopping(totalPriceTopping + price * quantity);

    /// Handle calculation max discount for topping
    const data = {
      isApplyPromotion: productData?.product?.productDetail?.isHasPromotion,
      isIncludedTopping: productData?.product?.productDetail?.isIncludedTopping,
      isDiscountProductCategory: productData?.product?.productDetail?.isPromotionProductCategory,
      totalPriceTopping:
        (((totalPriceTopping + price * quantity) * productData?.product?.productDetail?.discountValue || 1) / 100) *
        quantityProduct,
      totalPriceValue: quantityProduct * productData?.product?.productDetail?.discountPrice,
      maximumDiscountAmount: productData?.product?.productDetail?.maximumDiscountAmount,
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
  };

  const comboUpdateQuantityTopping = (productPriceIndex, index, quantity, price) => {
    let toppingEdit = toppings[productPriceIndex];
    let toppingIndex = toppingEdit[index];
    const quantityNew = toppingIndex.quantity + quantity;
    toppingIndex = { ...toppingIndex, quantity: quantityNew };
    let toppingsCopy = [...toppings];
    toppingEdit.splice(index, 1, toppingIndex);
    toppingsCopy.splice(productPriceIndex, 1, toppingEdit);
    setToppings(toppingsCopy);
    setTotalPriceTopping(totalPriceTopping + price * quantity);
  };

  const handleComplete = () => {
    //To do
  };

  const getPriceToppingProduct = (product, listTopping) => {
    let productToppings = product?.productToppings;
    if (listTopping?.length > 0 && listTopping !== undefined) productToppings = listTopping;
    const isHasPromotion = product?.productDetail?.isHasPromotion;
    const isIncludedTopping = product?.productDetail?.isIncludedTopping;
    const isFlashSale = product?.productDetail?.isFlashSale;
    const isDiscountPercent = product?.productDetail?.isDiscountPercent;
    const maximumDiscountAmount = product?.productDetail?.maximumDiscountAmount;
    const discountValue = product?.productDetail?.discountValue;
    if (isHasPromotion && isIncludedTopping && !isFlashSale) {
      if (isDiscountPercent) {
        if (maximumDiscountAmount === 0) {
          productToppings?.forEach((item) => {
            if (item?.originalPrice === undefined || item?.priceValue === item?.originalPrice) {
              item.originalPrice = item?.priceValue;
              item.priceValue = item?.priceValue - (item?.priceValue / 100) * product?.productDetail?.discountValue;
            }
          });
        } else {
          productToppings?.forEach((item) => {
            item.originalPrice = item?.priceValue;
            item.priceValueInMaxDiscount =
              item?.priceValue - (item?.priceValue / 100) * product?.productDetail?.discountValue;
          });
        }
      }
    }
    if (isFlashSaleIncludedTopping()) {
      productToppings?.forEach((item) => {
        delete item?.priceValueInMaxDiscount;
        if (item?.originalPrice === undefined || item?.originalPrice === item?.priceValue) {
          item.originalPrice = item?.priceValue;
          item.priceValue = 0;
        } else if (item?.originalPrice > item?.priceValue) {
          item.priceValue = 0;
        }
      });
    }
    // case: The product has flash sale 1 size, the other size has no flash sale
    else if (productPriceSelected !== undefined && !productPriceSelected?.isIncludedTopping && isFlashSale) {
      if (!productPriceSelected?.flashSaleId) {
        if (!isIncludedTopping) {
          productToppings?.forEach((item) => {
            item.priceValue = item?.originalPrice ?? item.priceValue;
          });
        } else {
          handelToppingInPromotionAndFlashSale(
            maximumDiscountAmount,
            isDiscountPercent,
            productToppings,
            discountValue,
          );
        }
      } else {
        productToppings?.forEach((item) => {
          delete item?.priceValueInMaxDiscount;
          item.priceValue = item?.originalPrice ?? item.priceValue;
        });
      }
    }
    setToppings(productToppings);
  };

  const handelToppingInPromotionAndFlashSale = (
    maximumDiscountAmount,
    isDiscountPercent,
    productToppings,
    discountValue,
  ) => {
    if (maximumDiscountAmount === 0) {
      if (isDiscountPercent) {
        productToppings?.forEach((item) => {
          if (item?.originalPrice === undefined) item.originalPrice = item.priceValue;
          item.priceValue =
            (item?.originalPrice ?? item?.priceValue) -
            ((item?.originalPrice ?? item?.priceValue) / 100) * discountValue;
        });
      } else {
        productToppings?.forEach((item) => {
          if (item?.originalPrice === undefined) item.originalPrice = item.priceValue;
          item.priceValue = item?.originalPrice ?? item?.priceValue;
        });
      }
    } else {
      if (isDiscountPercent) {
        productToppings?.forEach((item) => {
          if (item?.originalPrice === undefined) item.originalPrice = item.priceValue;
          item.priceValueInMaxDiscount =
            (item?.originalPrice ?? item?.priceValue) -
            ((item?.originalPrice ?? item?.priceValue) / 100) * discountValue;
        });
      } else {
        productToppings?.forEach((item) => {
          if (item?.originalPrice === undefined) item.originalPrice = item.priceValue;
          item.priceValue = item?.originalPrice ?? item?.priceValue;
        });
      }
    }
  };

  return (
    <StyledProductDetail config={colorGroup} colorConfig={colorGroup}>
      <>
        <ConfirmationDialog
          open={isShowFlashSaleInActive}
          title={translatedData.notification}
          content={translatedData.flashSaleInActive}
          footer={[
            <Button
              className="button-okay"
              onClick={() => {
                setIsShowFlashSaleInActive(false);
              }}
            >
              {translatedData.okay}
            </Button>,
          ]}
          onCancel={() => {
            setIsShowFlashSaleInActive(false);
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
                history.push("/product-list");
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
        <label className="overlay-product-detail" id="overlay-product-detail-id" onClick={onHideChooseOptions}></label>
        {noData ? (
          <div className="product-detail-container">
            {/* temporary plan. wait US */}
            <div className="product-detail-content">Không tìm thấy thông tin sản phẩm</div>
          </div>
        ) : (
          <div
            className="w-100 product-detail-theme-1"
            style={styleBackground}
            id={theme1ElementRightId.ProductDetail}
            onClick={() => clickToFocusCustomize && clickToFocusCustomize(theme1ElementCustomize.ProductDetail)}
          >
            <CloseBranchContainer branchId={branchAddress?.id} />
            <div className="product-detail-container main-session">
              <Row className="product-header-content">
                <HomePageStoreWebIcon href="/home" />
                <a href="/home">{translatedData.homePage}</a>
                <RightCategoryIcon className="icon-right-arrow" />
                <a
                  href={`/product-list/${
                    productData?.product?.productDetail?.productCategoryId ?? comboData?.comboId ?? comboData?.id
                  }`}
                >
                  {productData?.product?.productDetail?.productCategory
                    ? productData?.product?.productDetail?.productCategory
                    : comboData?.combo?.name ?? comboData?.name}
                </a>
                <RightCategoryIcon className="icon-right-arrow" />
                <span className="product-name">{productName}</span>
              </Row>
              <Row className={`product-detail-content ${isCustomize ? "is-customize" : ""}`}>
                <Col span={10} xs={24} sm={24} md={24} lg={24} xl={10} xxl={10} className="product-detail-content-left">
                  <div className="product-detail-image">
                    <ProductDetailImagesComponent
                      images={productImages}
                      isPromotion={isPromotion}
                      promotion={promotionValue}
                      isOutOfStock={isOutOfStock}
                      outOfStock={translatedData.outOfStock}
                    />
                  </div>
                </Col>
                <Col
                  span={14}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={14}
                  xxl={14}
                  className="product-detail-content-right"
                >
                  <Row id="popup-choose-options">
                    <div className="close-icon" onClick={onHideChooseOptions}>
                      <CloseIcon />
                    </div>

                    <Col xs={24} className="product-detail-title h3" style={styleTitle}>
                      {productName}
                    </Col>

                    <ProductDetailRateComponent
                      numberOfReview={productData?.product?.productDetail?.numberOfReview}
                      classNameRate={"product-detail-rate"}
                      defaultValueRate={productData?.product?.productDetail?.rating}
                    />

                    {promotionsOfProductPriceApplied?.length > 0 && (
                      <NameAndValuePopoverStoreWeb
                        data={mappingDiscountApplyToPromotionPopupData(promotionsOfProductPriceApplied)}
                        className="popover-promotion-product-detail-theme1"
                      />
                    )}

                    {productPriceSelected?.promotionEndTime && (
                      <Col xs={24} className="product-detail-flash-sale">
                        <FnbFlashSaleBannerComponent
                          data={productPriceSelected}
                          endAtZero
                          onComplete={handleComplete}
                        />
                      </Col>
                    )}

                    {productPriceSelected?.promotionEndTime && (
                      <div className="flip-countdown-on-mobile">
                        <FnbFlashSaleBannerComponent data={productPriceSelected} />
                      </div>
                    )}

                    {quantityProduct > productPriceSelected?.maximumLimit && productPriceSelected?.maximumLimit > 0 && (
                      <MaximumLimitFlashSaleNotifyComponent maximumLimit={productPriceSelected?.maximumLimit} />
                    )}

                    <ProductDetailDescriptionComponent
                      title={translatedData.description}
                      content={description}
                      styleTitle={styleTitle}
                      styleContent={styleText}
                      isViewMore={true}
                    />

                    <Col span={24}>
                      <Row>
                        <Col span={12} xs={13} sm={16} md={16} lg={16} xl={16} xxl={16} style={styleTitleForPrice}>
                          <span className="product-price">{formatTextNumber(sellingPrice)}đ</span>
                          {(isPromotion || isCombo) && (
                            <span className="product-original-price">{formatTextNumber(originalPrice)}đ</span>
                          )}
                          <div span={8} xs={11} sm={8} md={8} lg={8} xl={8} xxl={8} className="modify-quantity">
                            <Button
                              icon={<PlusOutlined className="btn-quantity" />}
                              className="btn-increase"
                              disabled={isOutOfStock || quantityProduct >= maximumQuantity}
                              onClick={() => updateQuantityProduct(quantityProduct + 1, true)}
                            ></Button>
                            <span className="quantity-product">{quantityProduct}</span>
                            <Button
                              icon={<MinusOutlined className="btn-quantity" />}
                              className="btn-reduce"
                              disabled={quantityProduct <= 1 ? true : false}
                              onClick={() => updateQuantityProduct(quantityProduct - 1, false)}
                            ></Button>
                          </div>
                        </Col>
                      </Row>
                    </Col>

                    <Col span={24} xs={24} className="note">
                      <div className="note-icon-theme1">
                        <NoteIcon className="note-icon" />
                      </div>
                      <div className="input-text-area-theme1">
                        <TextArea
                          className="product-detail-input"
                          value={messagesForStore}
                          placeholder={translatedData.leaveAMessageForTheStore}
                          onChange={(e) => setMessagesForStore(e.target.value)}
                          maxLength={100}
                          autoSize
                        />
                      </div>
                    </Col>
                    <Col span={24} xs={24} className="options">
                      <StyledButtonActive>
                        {isCombo ? (
                          <>
                            {comboData?.comboProductPrices?.map((item, productPricesIndex) => {
                              let product = item?.productPrice?.product;
                              productPricesDefaultActiveKey.push(item?.productPrice?.productId);
                              return (
                                <Collapse
                                  expandIconPosition="end"
                                  className="combo-data-collapse-custom custom-collapse"
                                  accordion
                                  expandIcon={customExpandIcon}
                                  activeKey={activeKey[productPricesIndex]}
                                  onChange={(keys) => onChangeActiveKeys(keys, productPricesIndex)}
                                >
                                  <Collapse.Panel
                                    header={
                                      <span className="header">
                                        {item?.productPrice?.product?.name?.concat(
                                          item?.productPrice?.priceName ? `(${item?.productPrice?.priceName})` : "",
                                        )}
                                      </span>
                                    }
                                    collapsible={"header"}
                                    forceRender={true}
                                    destroyInactivePanel={true}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                    key={item?.productPriceId}
                                  >
                                    <div className="product-price-header">
                                      <div className="product-detail-collapse" defaultActiveKey={defaultActiveKey}>
                                        {product?.productOptions?.length > 0 && (
                                          <>
                                            {product?.productOptions.map((option, index) => {
                                              defaultActiveKey.push(option?.id);
                                              return (
                                                <div className="selection" key={index}>
                                                  <span className="header">{option?.name}</span>
                                                  <ProductDetailOptionComponent
                                                    option={option}
                                                    onChangeOptions={(e) => {
                                                      e.stopPropagation();
                                                      comboOnChangeOptions(e, productPricesIndex, index);
                                                    }}
                                                    defaultValue={optionsSelected?.[productPricesIndex]?.[index]}
                                                    key={index}
                                                  />
                                                </div>
                                              );
                                            })}
                                          </>
                                        )}
                                        {product?.productToppings?.length > 0 && (
                                          <div key="Topping" className="selection">
                                            <span className="header">{translatedData.addTopping}</span>
                                            {product?.productToppings.map((topping, index) => {
                                              return (
                                                <ProductDetailToppingComponent
                                                  key={index}
                                                  topping={topping}
                                                  colorGroup={colorGroup}
                                                  updateQuantityTopping={(quantity, priceValue) =>
                                                    comboUpdateQuantityTopping(
                                                      productPricesIndex,
                                                      index,
                                                      quantity,
                                                      priceValue,
                                                    )
                                                  }
                                                />
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Collapse.Panel>
                                </Collapse>
                              );
                            })}
                          </>
                        ) : (
                          <div className="product-detail-collapse">
                            {productPrices?.length > 1 && (
                              <div className="selection">
                                <span className="header">{translatedData.chooseSize}</span>
                                <ProductDetailProductPriceComponent
                                  productPrices={productPrices}
                                  productPriceDefault={productPriceSelected}
                                  onChange={onChangeSize}
                                />
                              </div>
                            )}
                            {options?.length > 0 && (
                              <>
                                {options.map((option, index) => {
                                  defaultActiveKey.push(option?.id);
                                  return (
                                    <div className="selection">
                                      <span className="header">{option?.name}</span>
                                      <ProductDetailOptionComponent
                                        option={option}
                                        onChangeOptions={(e) => onChangeOptions(e, index)}
                                        defaultValue={optionsSelected[index]}
                                        key={index}
                                      />
                                    </div>
                                  );
                                })}
                              </>
                            )}
                            {toppings?.length > 0 && (
                              <div className="selection">
                                <span className="header">{translatedData.addTopping}</span>
                                {toppings.map((topping, index) => {
                                  return (
                                    <ProductDetailToppingComponent
                                      key={index}
                                      topping={topping}
                                      colorGroup={colorGroup}
                                      updateQuantityTopping={(quantity, priceValue) =>
                                        updateQuantityTopping(index, quantity, priceValue)
                                      }
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </StyledButtonActive>
                    </Col>
                    <Col span={24}>
                      <div className="quantity-responsive">
                        <div className="text-quanity">
                          <span>{translatedData.quantity}</span>
                        </div>
                        <div className="modify-quantity-for-responsive">
                          <Button
                            icon={<PlusOutlined className="btn-quantity" />}
                            className="btn-increase"
                            disabled={isOutOfStock || quantityProduct >= maximumQuantity}
                            onClick={() => updateQuantityProduct(quantityProduct + 1, true)}
                          ></Button>
                          <span className="quantity-product">{quantityProduct}</span>
                          <Button
                            icon={<MinusOutlined className="btn-quantity" />}
                            className="btn-reduce"
                            disabled={quantityProduct <= 1 ? true : false}
                            onClick={() => updateQuantityProduct(quantityProduct - 1, false)}
                          ></Button>
                        </div>
                      </div>
                      <div className="button-background">
                        <Button
                          className={`btn-product-detail btn-submit ${isOutOfStock ? "out-of-stock" : ""}`}
                          style={styleButton}
                          onClick={() => {
                            setIsLoadingOutOfStock(true);
                            addProductToCart();
                          }}
                          disabled={isOutOfStock}
                        >
                          {isLoadingOutOfStock ? (
                            <div>
                              <Spin
                                indicator={
                                  <LoadingOutlined
                                    style={{
                                      fontSize: 24,
                                      color: colorGroup?.buttonTextColor,
                                    }}
                                    spin
                                  />
                                }
                              />
                            </div>
                          ) : (
                            <div className="btn-add-to-cart">
                              <div className="btn-add-to-cart-text">
                                {isOutOfStock ? (
                                  translatedData.outOfStock
                                ) : (
                                  <div className="add-to-card">
                                    <CartLinearIcon /> {translatedData.addProductToCart}
                                  </div>
                                )}
                              </div>
                              {!isOutOfStock && (
                                <div>
                                  <div className="btn-add-to-cart-price" style={{ color: colorGroup?.buttonTextColor }}>
                                    {formatTextNumber(totalProductPrice < 0 ? 0 : totalProductPrice)}đ
                                  </div>
                                  {totalProductPrice !== totalOriginalPrice && (
                                    <div
                                      className="btn-add-to-cart-original-price"
                                      style={{ color: colorGroup?.buttonTextColor }}
                                    >
                                      {formatTextNumber(totalOriginalPrice)}đ
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row id="popup-choose-options-for-responsive">
                    <Col span={24} className="product-detail-title h3" style={styleTitle}>
                      {productName}
                    </Col>

                    <ProductDetailRateComponent
                      numberOfReview={productData?.product?.productDetail?.numberOfReview}
                      classNameRate={"product-detail-rate"}
                      defaultValueRate={productData?.product?.productDetail?.rating}
                    />

                    {productPriceSelected?.promotionEndTime && (
                      <div className="flip-countdown-on-mobile">
                        <FnbFlashSaleBannerComponent data={productPriceSelected} />
                      </div>
                    )}

                    {productPriceSelected?.promotionEndTime && (
                      <Col span={24} className="product-detail-flash-sale">
                        <FnbFlashSaleBannerComponent
                          data={productPriceSelected}
                          endAtZero
                          onComplete={handleComplete}
                        />
                      </Col>
                    )}

                    <ProductDetailDescriptionComponent
                      title={translatedData.description}
                      content={description}
                      styleTitle={styleTitle}
                      styleContent={styleText}
                      isViewMore={true}
                    />

                    {quantityProduct > productPriceSelected?.maximumLimit && productPriceSelected?.maximumLimit > 0 && (
                      <MaximumLimitFlashSaleNotifyComponent maximumLimit={productPriceSelected?.maximumLimit} />
                    )}

                    <Col span={24}>
                      <Row>
                        <Col span={12} xs={13} sm={16} style={styleTitleForPrice}>
                          <span className="product-price">{formatTextNumber(sellingPrice)}đ</span>
                          {(isPromotion || isCombo) && (
                            <span className="product-original-price">{formatTextNumber(originalPrice)}đ</span>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24} className="position-submit">
                      <Button
                        className="btn-product-detail btn-hide-show-popup-when-mobile"
                        style={styleButton}
                        onClick={onShowChooseOptions}
                      >
                        <div className="btn-add-to-cart-responsive">
                          <div>
                            <div className="btn-add-to-cart-price" style={{ color: colorGroup?.buttonTextColor }}>
                              {formatTextNumber(totalProductPrice < 0 ? 0 : totalProductPrice)}đ
                            </div>
                            {totalProductPrice !== totalOriginalPrice && (
                              <div
                                className="btn-add-to-cart-original-price"
                                style={{ color: colorGroup?.buttonTextColor }}
                              >
                                {formatTextNumber(totalOriginalPrice)}đ
                              </div>
                            )}
                          </div>
                          <span style={{ marginLeft: "8px", marginRight: "8px" }}>-</span>
                          <div className="btn-add-to-cart-text" style={{ color: colorGroup?.buttonTextColor }}>
                            {translatedData.addProductToCart}
                          </div>
                        </div>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card
                    className="review-content"
                    title={
                      <div className="header-comment">
                        {t("storeWebPage.generalUse.reviewHaveQuantity", "review", { quantity: 0 })}
                      </div>
                    }
                    headStyle={styleTitle}
                  >
                    <div className="review-content-icon">
                      <ReviewIcon className="review-icon" />
                    </div>
                    <div className="review-content-text">
                      <p className="review-text" style={styleText}>
                        {translatedData.thereAreCurrentlyNoReviews}
                      </p>
                    </div>
                  </Card>
                </Col>
                <Col span={24} className="similar-product">
                  <div
                    className="similar-product-title"
                    style={{ display: "flex", justifyContent: "space-between", ...styleTitle }}
                  >
                    <div>{translatedData.maybeYouLike}</div>
                    <div>
                      <div className="button-left-arrow" onClick={handleLeftArrow}></div>
                      <div className="button-right-arrow" onClick={handleRightArrow}></div>
                    </div>
                  </div>
                  <Theme1SimilarProduct
                    swiperRef={swiperRef}
                    similarProducts={similarProducts}
                    addToCart={addSimilarProduct}
                  />
                </Col>
              </Row>
            </div>
          </div>
        )}
      </>
    </StyledProductDetail>
  );
}
