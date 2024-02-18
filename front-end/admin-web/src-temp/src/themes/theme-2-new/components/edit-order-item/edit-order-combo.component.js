import { Col, Collapse, Image, Input, Row } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { setCartItems, setNotificationDialog } from "../../../modules/session/session.actions";
import { getStorage, localStorageKeys, setStorage } from "../../../utils/localStorage.helpers";
import { CheckoutIcon, DecreaseQuantityProductIcon, IncreaseQuantityProductIcon } from "../../assets/icons.constants";
import { ReactComponent as NoteIconBlur } from "../../assets/icons/note-icon-blur.svg";
import { ReactComponent as NoteIcon } from "../../assets/icons/note-icon.svg";
import productImageDefault from "../../assets/images/product-img-default.png";
import ProductDetailImagesComponent from "../../components/product-detail-images-component/product-detail-images.component";
import { comboTypeEnum } from "../../constants/store-web-page.constants";

import productDataService from "../../../data-services/product-data.service";
import ProductDetailDescriptionComponent from "../product-detail-description-component/product-detail-description.component";
import { ProductDetailOptionComponent } from "../product-detail-option.component/product-detail-option.component";
import ProductDetailRateComponent from "../product-detail-rate-component/product-detail-rate.component";
import { ProductDetailToppingComponent } from "../product-detail-topping.component/product-detail-topping.component";

import shoppingCartService from "../../../services/shopping-cart/shopping-cart.service";
import { checkNonEmptyArray, formatTextNumber } from "../../../utils/helpers";
import PageType from "../../constants/page-type.constants";
import "./edit-order-combo.style.scss";

import comboDataService from "../../../data-services/combo-data.service";
import { setToastMessageUpdateToCart } from "../../../modules/toast-message/toast-message.actions";
import { checkListProductPriceIdOutOfStock } from "../../../services/material/check-out-of-stock.service";
import posCartService from "../../../services/pos/pos-cart.services";
import reduxService from "../../../services/redux.services";
import { HttpStatusCode } from "../../../utils/http-common";
import { EnumComboType } from "../../constants/enums";
import OutOfStockLabelBoxComponent from "../out-of-stock-label-box/out-of-stock-label-box.component";

export default function EditOrderComboComponent(props) {
  const { comboDetailData, currentIndex, onCancel, stateConfig, isPos = false, branchAddress, fontFamily } = props;

  const [t] = useTranslation();
  const isMaxWidth500 = useMediaQuery({ maxWidth: 500 });
  const numberColBtnAdd = isMaxWidth500 ? 18 : 24;
  const dispatch = useDispatch();
  const [comboData, setComboData] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [optionsSelected, setOptionsSelected] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [quantityProduct, setQuantityProduct] = useState(1);
  const [totalPriceTopping, setTotalPriceTopping] = useState(0);
  const [messagesForStore, setMessagesForStore] = useState("");
  const [thumbnail, setThumbnail] = useState([]);
  const [productName, setProductName] = useState();
  const [isDiscount, setIsDiscount] = useState(false);
  const [colorGroupBody, setColorGroupBody] = useState({});
  const [totalPriceOfProduct, setTotalPriceOfProduct] = useState(0);
  const [branchId, setBranchId] = useState(null);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const { TextArea } = Input;

  const translatedData = {
    noteAMessageForTheStore: t("storeWebPage.editOrderItem.noteAMessageForTheStore"),
    description: t("storeWebPage.generalUse.description"),
    review: t("storeWebPage.generalUse.review", "Review"),
    chooseOptions: t("storeWebPage.productDetailPage.chooseOptions"),
    updateCart: t("storeWebPage.generalUse.updateCart", "Update the cart"),
    selectOption: t("storeWebPage.editOrderItem.selectOption"),
    selectTopping: t("storeWebPage.editOrderItem.selectTopping"),
    addProductToCart: t("storeWebPage.productDetailPage.addProductToCart"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Sorry! Product is not enough of stock"),
    iGotIt: t("loginPage.iGotIt", "I got it"),
    cancel: t("storeWebPage.editOrderItem.cancel", "Cancel"),
  };

  const maximumQuantity = 999;

  useEffect(() => {
    if (comboDetailData) {
      initComboData(comboDetailData?.dataDetails, comboDetailData);
    }
  }, [comboDetailData]);

  //#region Checkout of stock
  useEffect(() => {
    if (comboData) {
      checkOutOfStock(quantityProduct, true);
    }
  }, [comboData, quantityProduct]);

  async function checkOutOfStock(quantity, isInitData) {
    let verifyOutOfStock = false;
    if (comboData) {
      const productPriceIds = comboData?.comboProductPrices?.map((p) => p?.productPriceId) ?? [];
      verifyOutOfStock = await checkListProductPriceIdOutOfStock(branchAddress?.id, productPriceIds, quantity);
      if (verifyOutOfStock) {
        if (isInitData) {
          setIsOutOfStock(true);
          if (quantity > 1) {
            showNotificationOutOfStock();
          }
        }
      } else {
        setIsOutOfStock(false);
      }
    }
    return verifyOutOfStock;
  }

  function showNotificationOutOfStock() {
    const notificationDialog = {
      isShow: true,
      content: translatedData.textOutOfStock,
      buttonText: translatedData.iGotIt,
    };
    dispatch(setNotificationDialog(notificationDialog));
  }
  //#endregion

  useEffect(() => {
    initBackgroundBody();
  }, []);

  const getDataCalculatePrice = async (comboDetailInformationData, toppingGroupSelected, quantityProduct, branchId) => {
    let productToppings = toppingGroupSelected.filter((a) => a.quantity >= 1);
    let toppingsData = [],
      dataSubmit = {};
    for (const item of productToppings) {
      let toppingItem = {
        ...item,
        toppingId: item?.id,
        quantity: item?.quantity,
      };

      toppingsData.push(toppingItem);
    }
    dataSubmit = {
      productId:
        comboDetailInformationData?.comboTypeId === comboTypeEnum.comboPricing.id
          ? comboDetailInformationData?.comboId
          : comboDetailInformationData?.id,
      isCombo: true,
      quantity: quantityProduct,
      toppings: toppingsData,
      comboTypeId: comboDetailInformationData?.comboTypeId,
      comboPricingId: comboDetailInformationData?.comboPricingId,
      productPriceId: "",
      productCategoryId: "",
      branchId: branchId,
    };
    let dataResult = await productDataService.calculatingPriceOfTheProduct(dataSubmit);
    return dataResult?.data;
  };

  const initBackgroundBody = () => {
    const { pages, general } = stateConfig;
    const configProductDetail = pages?.find((x) => x.id === PageType.PRODUCT_DETAIL)?.config?.productDetail;

    let colorGroup = general?.color?.colorGroups?.find((a) => a.id === configProductDetail?.colorGroupId);

    setColorGroupBody({ ...colorGroup });
  };

  const updateQuantityProduct = async (quantity, isIncrease) => {
    if (quantity >= 1 && quantity <= maximumQuantity) {
      const isOutOfStock = await checkOutOfStock(quantity, false);
      if (isIncrease && isOutOfStock === true) {
        showNotificationOutOfStock();
        return;
      }

      let priceValue = 0;
      let productToppings = Array.prototype.concat.apply([], toppings);
      let calculateValue = await getDataCalculatePrice(comboData, productToppings, quantity, branchId);
      priceValue = calculateValue?.sellingPrice;

      setQuantityProduct(quantity);
      setTotalPriceOfProduct(priceValue);
    }
  };

  const getPriceFormat = (number) => {
    let convertNumber = parseFloat(number);
    if (convertNumber > 0) {
      return (
        <>
          {formatTextNumber(convertNumber)}
          <>đ</>
        </>
      );
    }
    return "";
  };
  const getComboProductPrice = async (comboId) => {
    const comboDetail = await comboDataService.getComboProductPriceByComboIdAsync(comboId);
    return comboDetail;
  };

  const getComboPricing = async (comboPricingId) => {
    const comboDetail = await comboDataService.getComboPricingByComboPricingIdAsync(comboPricingId);
    return comboDetail;
  };
  const initComboData = async (combo, currentData) => {
    if (!combo) {
      if (currentData?.comboTypeId === EnumComboType.Flexible) {
        const response = await getComboPricing(currentData?.comboPricingId);
        if (response?.status === HttpStatusCode.Ok && response?.data?.isSuccess) {
          combo = response?.data?.combo;
        }
      } else {
        const response = await getComboProductPrice(currentData?.id);
        combo = response?.data?.combo;
      }
    }
    await Promise.all([]);
    let nameCombo = combo?.comboTypeId === comboTypeEnum.comboPricing.id ? combo?.comboPricingName : combo?.name;
    setProductName(nameCombo);
    setComboData(combo);
    let _toppings = [];
    let _options = [];
    let _originalPrice = 0;
    let _toppingPrice = 0;
    let listTopping = [];
    combo?.comboProductPrices?.map((item, index) => {
      const product = item?.productPrice?.product;

      ///Mapping toppings
      let currentProductToppings = currentData?.products?.filter((x) => x.productPrice?.id === item?.productPriceId);
      if (currentProductToppings.length > 1) {
        currentProductToppings = currentProductToppings[index]?.toppings;
      } else {
        currentProductToppings = currentProductToppings[0]?.toppings;
      }
      _toppings.push(currentProductToppings);
      currentProductToppings?.map((topping) => {
        _toppingPrice += topping.priceValue * topping.quantity;
        listTopping.push(topping);
      });
      _originalPrice += item?.priceValue;

      ///Mapping options
      let currentProductOptions = currentData?.products?.filter((x) => x.productPrice?.id === item?.productPriceId);
      if (currentProductOptions.length > 1) {
        currentProductOptions = currentProductOptions[index]?.options;
      } else {
        currentProductOptions = currentProductOptions[0]?.options;
      }
      _options.push(getOptionsInitData(currentProductOptions, product?.productOptions));
    });
    setOptionsSelected(_options);
    setToppings(_toppings);
    setSellingPrice(currentData?.sellingPrice);
    setOriginalPrice(_originalPrice);
    setTotalPriceTopping(_toppingPrice);
    setQuantityProduct(currentData?.quantity ?? 0);
    setMessagesForStore(currentData?.notes);
    setThumbnail([{ imageUrl: combo?.thumbnail }]);
    setIsDiscount(combo?.sellingPrice !== combo?.originalPrice);
    setBranchId(branchId);
    // The main price of the product.
    // This price will reset when the user handle add, edit or delete options of the current product
    const calculateValue = await getDataCalculatePrice(combo, listTopping, currentData?.quantity, branchId);
    setTotalPriceOfProduct(calculateValue?.sellingPrice);
  };

  const getOptionsInitData = (currentOptions, productOptions) => {
    let optionsSelected = [];
    const arrOptionLevelIds = currentOptions?.map((o) => o.optionLevelId);
    if (productOptions) {
      productOptions.map((productOption) => {
        let option = productOption?.optionLevels?.find((ol) => arrOptionLevelIds?.includes(ol.id));
        if (option) {
          optionsSelected.push(option);
        } else {
          optionsSelected.push("");
        }
      });
    }
    return optionsSelected;
  };

  const comboOnChangeOptions = (e, productPriceIndex, index) => {
    let optionsSelectedCopy = [...optionsSelected];
    let optionsSelectedIndex = optionsSelectedCopy[productPriceIndex];
    optionsSelectedIndex.splice(index, 1, e.target.value);
    optionsSelectedCopy.splice(productPriceIndex, 1, optionsSelectedIndex);
    setOptionsSelected(optionsSelectedCopy);
  };

  const comboUpdateQuantityTopping = async (productPriceIndex, index, quantity, price) => {
    let toppingEdit = toppings[productPriceIndex];
    let toppingIndex = toppingEdit[index];
    const quantityNew = toppingIndex.quantity + quantity;
    toppingIndex = { ...toppingIndex, quantity: quantityNew };
    let toppingsCopy = [...toppings];
    toppingEdit.splice(index, 1, toppingIndex);
    toppingsCopy.splice(productPriceIndex, 1, toppingEdit);
    let listTopping = Array.prototype.concat.apply([], toppingsCopy);
    const calculateValue = await getDataCalculatePrice(comboData, listTopping, quantityProduct, branchId);
    setTotalPriceTopping(calculateValue?.totalPriceOfTopping);
    setTotalPriceOfProduct(calculateValue?.sellingPrice);
    setToppings(toppingsCopy);
  };

  //#region Add to cart
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
    const newToppings = toppings?.map((t) => ({
      id: t?.id,
      name: t?.name,
      priceValue: t?.priceValue,
      quantity: t.quantity,
    }));
    return newToppings;
  };

  const addComboToCart = () => {
    if (isOutOfStock) {
      return;
    }
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
      id: comboDetailData?.id,
      name: comboDetailData?.name,
      comboPricingId: comboDetailData?.comboPricingId,
      comboPricingName: comboDetailData?.comboPricingName,
      thumbnail: comboData?.thumbnail,
      notes: messagesForStore,
      comboTypeId: comboData?.comboTypeId,
      products: _productList,
      quantity: quantityProduct,
      originalPrice: originalPrice,
      sellingPrice: sellingPrice,
      dataDetails: comboData,
      totalOfToppingPrice: totalPriceTopping,
      branchId: branchId,
    };
    updateStoreCart(combo);
    onShowToastMessage();
  };

  const onShowToastMessage = () => {
    dispatch(setToastMessageUpdateToCart(true));
    setTimeout(() => {
      dispatch(setToastMessageUpdateToCart(false));
    }, 3000);
  };

  const updateStoreCart = (combo) => {
    if (isPos) {
      let posCartItemsNew = [];
      let posCartItems = reduxService.getPOSCartItems();
      if (checkNonEmptyArray(posCartItems)) {
        posCartItemsNew = mergeCombos(combo, posCartItems);
      } else {
        posCartItemsNew.push(combo);
      }
      posCartService.verifyAndUpdateCart(posCartItemsNew);
    } else {
      const storeCart = getStorage(localStorageKeys.STORE_CART);
      let objectStoreCart = JSON.parse(storeCart);
      let storeCartNew = [];
      if (objectStoreCart) {
        storeCartNew = mergeCombos(combo, objectStoreCart);
      } else {
        storeCartNew.push(combo);
      }

      shoppingCartService.setStoreCartLocalStorage(storeCartNew);
      shoppingCartService?.setStoreCart(storeCartNew, true);
    }
    onCancel();
  };

  const mergeCombos = (product, productList) => {
    if (productList) {
      if (currentIndex === -1) {
        productList.push(product);
      } else {
        var index = productList.findIndex((productItem) => {
          return compareCombo(product, productItem);
        });
        if (index >= 0 && index !== currentIndex) {
          let productListNew = productList;
          productListNew[index].quantity += product?.quantity;
          productListNew?.splice(currentIndex, 1);
          return productListNew;
        } else {
          if (currentIndex >= 0) {
            const currentProduct = productList?.find((_, i) => i === currentIndex);
            productList?.splice(productList?.indexOf(currentProduct), 1, product);
          }
          return productList;
        }
      }
    } else {
      return [product];
    }
  };

  const compareCombo = (firstCombo, secondCombo) => {
    let isTheSame = false;
    if (!secondCombo?.isCombo || firstCombo?.comboTypeId !== secondCombo?.comboTypeId) {
      return isTheSame;
    }

    if (
      firstCombo?.id === secondCombo?.id &&
      firstCombo?.notes === secondCombo?.notes &&
      (firstCombo?.comboTypeId !== comboTypeEnum.comboPricing.id ||
        (firstCombo?.comboPricingId && firstCombo?.comboPricingId === secondCombo?.comboPricingId))
    ) {
      isTheSame = firstCombo?.products?.every((firstProduct) => {
        return secondCombo?.products?.some((secondProduct) => compareProduct(firstProduct, secondProduct));
      });
    }
    return isTheSame;
  };

  const compareProduct = (firstProduct, secondProduct) => {
    let isTheSame = false;
    if (
      firstProduct?.id === secondProduct?.id &&
      firstProduct?.productPrice?.id === secondProduct?.productPrice?.id &&
      firstProduct?.options?.every((firstOption) => {
        return secondProduct?.options?.some(
          (secondOption) =>
            firstOption?.id === secondOption?.id && firstOption?.optionLevelId === secondOption?.optionLevelId,
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
  //#endregion

  const StyledProductPrice = styled.div`
    .product-price-quantity,
    .product-price-btn-increase {
      svg > rect {
        fill: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }
    }
    .btn-add-to-cart-text {
      svg > path {
        fill: ${colorGroupBody?.buttonTextColor ?? "#ffffff"};
      }
    }
    .product-price-quantity {
      color: ${colorGroupBody?.textColor ?? "#282828"};
    }
  `;
  const StyledSelectCollapse = styled.div`
    .group-multiple-price,
    .group-product-option,
    .group-product-topping {
      span.ant-collapse-header-text {
        color: ${colorGroupBody?.titleColor ?? "#959595"};
      }
      .price-name,
      .option-name,
      .topping-name,
      .topping-quantity-value {
        color: ${colorGroupBody?.textColor ?? "#282828s"};
      }
    }
    .ant-radio-button-wrapper {
      .dot-select-product-option,
      .container-radio-option {
        color: ${colorGroupBody?.textColor ?? "#ffffff"};
      }

      .ant-radio-button-checked {
        background-color: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
        border: 1px solid ${colorGroupBody?.buttonBorderColor ?? "#db4d29"};
      }
    }
    .ant-radio-button-wrapper-checked {
      .dot-select-product-option,
      .container-radio-option {
        color: ${colorGroupBody?.buttonTextColor ?? "#ffffff"};
      }
    }
    .topping-quantity-btn-increase {
      svg > rect {
        fill: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }
    }
    .ant-radio-inner {
      border: 1px solid #a5abde;
    }
    .radio-style {
      .ant-radio-wrapper .ant-radio {
        border: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
        .ant-radio-inner {
          border: 1px solid #a5abde;
        }
      }

      .ant-radio-wrapper {
        .ant-radio {
          .ant-radio-inner {
            border: 1px solid #a5abde !important;
          }
        }

        .ant-radio-checked {
          .ant-radio-inner {
            border: 1px solid ${colorGroupBody?.buttonBackgroundColor} !important;
          }
        }
      }

      .ant-radio-wrapper .ant-radio-inner::after {
        background-color: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }

      .ant-radio-wrapper .ant-radio-checked .ant-radio-inner:after {
        border-color: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }

      .ant-radio-wrapper .ant-radio-checked .ant-radio-inner {
        border-color: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }

      .ant-radio-wrapper:hover .ant-radio,
      .ant-radio-wrapper:hover .ant-radio-inner,
      .ant-radio:hover .ant-radio-inner,
      .ant-radio-input:focus + .ant-radio-inner {
        border-color: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }
    }
  `;

  const renderProductOption = (options, productPricesIndex) => {
    return (
      <Collapse defaultActiveKey={["1"]} expandIconPosition="end" className="group-collapse">
        <CollapsePanel header={translatedData.selectOption} key="1">
          <div className="group-product-option-content">
            {options.map((option, index) => {
              return (
                <ProductDetailOptionComponent
                  option={option}
                  onChangeOptions={(e) => comboOnChangeOptions(e, productPricesIndex, index)}
                  defaultValue={optionsSelected?.[productPricesIndex]?.[index]}
                  isStyleHorizontal={true}
                  iconPrefix={"dot-select-product-option"}
                />
              );
            })}
          </div>
        </CollapsePanel>
      </Collapse>
    );
  };

  const renderProductTopping = (toppingList, productPricesIndex) => {
    return (
      <Collapse defaultActiveKey={["1"]} expandIconPosition="end" className="group-collapse">
        <CollapsePanel header={translatedData.selectTopping} key="1">
          <div className="group-product-topping-content">
            {toppingList.map((topping, index) => {
              return (
                <ProductDetailToppingComponent
                  maximumQuantityCustom={maximumQuantity}
                  topping={topping}
                  updateQuantityTopping={(quantity, priceValue) =>
                    comboUpdateQuantityTopping(productPricesIndex, index, quantity, priceValue)
                  }
                  iconPlus={<IncreaseQuantityProductIcon />}
                  iconMinus={<DecreaseQuantityProductIcon />}
                  isStyleHorizontal={true}
                />
              );
            })}
          </div>
        </CollapsePanel>
      </Collapse>
    );
  };

  const renderHeaderCombo = (product) => {
    return (
      <div className="product-title-box">
        <div className="product-logo">
          <img
            src={
              product?.product?.thumbnail && product?.product?.thumbnail !== ""
                ? product?.product?.thumbnail
                : productImageDefault
            }
            alt=""
            title=""
          />
        </div>

        <div className="product-information">
          <span className="product-label" style={{ color: colorGroupBody?.textColor }}>
            {product?.product?.name}
          </span>
          {product?.priceName && <span className="product-size-name">{product?.priceName}</span>}
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="edit-order-combo-theme-pho-viet-section" style={{ fontFamily: fontFamily }}>
        {/* Section product detail */}
        <div id="editOrderComboDetailBody">
          <div className="edit-order-theme-pho-viet-section-group">
            {isMaxWidth500 ? (
              <>
                <Row gutter={[24, 24]}>
                  <Col sm={9} xs={9}>
                    {isDiscount && (
                      <div className="discount-edit-order">
                        <span className="discount-text">
                          {comboData?.percentDisount
                            ? comboData?.percentDisount + "%"
                            : getPriceFormat(comboData?.originalPrice - comboData?.sellingPrice)}
                        </span>
                      </div>
                    )}
                    <div className="border-image-thumbnail">
                      <Image
                        src={thumbnail[0]?.imageUrl ?? "error"}
                        className="product-image"
                        fallback={productImageDefault}
                        preview={false}
                      />
                    </div>
                  </Col>
                  <Col sm={15} xs={15}>
                    <>
                      <h3 className="product-name text-line-clamp-2" style={{ color: colorGroupBody?.textColor }}>
                        {productName}
                      </h3>

                      <ProductDetailDescriptionComponent
                        isViewMore={true}
                        classNameDescription={"product-description"}
                        idDescription={"product-description"}
                        content={comboData?.description}
                        styleContent={{ color: colorGroupBody?.textColor }}
                      />
                      <StyledProductPrice>
                        <div className="product-price">
                          <div className="product-price-left">
                            {isDiscount && (
                              <span className="product-price-original">{getPriceFormat(originalPrice)}</span>
                            )}
                            <span className="product-price-discount" style={{ color: colorGroupBody?.titleColor }}>
                              {getPriceFormat(sellingPrice)}
                            </span>
                          </div>
                        </div>
                      </StyledProductPrice>

                      <ProductDetailRateComponent
                        classNameTotalReview={"total-review"}
                        numberOfReview={comboData?.numberOfReview}
                        defaultValueRate={comboData?.rating}
                        groupRateStart={"group-star-rate"}
                      />
                      <StyledProductPrice>
                        <div className="product-price">
                          <div className="product-price-right">
                            <div
                              className={`product-price-btn-decrease ${
                                quantityProduct <= 1 ? "prevent-click" : "active-click"
                              }`}
                              hidden={quantityProduct <= 0}
                              onClick={() => updateQuantityProduct(quantityProduct - 1)}
                            >
                              <DecreaseQuantityProductIcon />
                            </div>
                            <span className="product-price-quantity">{quantityProduct}</span>
                            <div
                              className={`product-price-btn-increase ${isOutOfStock && "btn-out-of-stock-disabled"}`}
                              hidden={quantityProduct >= maximumQuantity}
                              onClick={() => (isOutOfStock ? null : updateQuantityProduct(quantityProduct + 1, true))}
                            >
                              <IncreaseQuantityProductIcon />
                            </div>
                          </div>
                        </div>
                      </StyledProductPrice>
                    </>
                  </Col>
                </Row>
              </>
            ) : (
              <div className={`edit-order-theme-pho-viet-section-left "non-padding-left"`}>
                {thumbnail.length > 1 ? (
                  <ProductDetailImagesComponent
                    images={thumbnail}
                    isLoop={true}
                    isNavigation={true}
                    isPromotion={isDiscount}
                    promotion={
                      comboData?.percentDisount
                        ? comboData?.percentDisount + "%"
                        : getPriceFormat(comboData?.originalPrice - comboData?.sellingPrice)
                    }
                    classPromotion={"discount-edit-order"}
                  />
                ) : (
                  <div>
                    {isDiscount && (
                      <div className="discount-edit-order">
                        <span className="discount-text">
                          {comboData?.percentDisount
                            ? comboData?.percentDisount + "%"
                            : getPriceFormat(comboData?.originalPrice - comboData?.sellingPrice)}
                        </span>
                      </div>
                    )}
                    <div className="border-image-thumbnail">
                      <OutOfStockLabelBoxComponent isShow={isOutOfStock} smallSize />
                      <Image
                        src={thumbnail[0]?.imageUrl ?? "error"}
                        className={`product-image ${isOutOfStock && "out-of-stock-opacity"}`}
                        fallback={productImageDefault}
                        preview={false}
                      />
                    </div>
                    <div className="image-sub-group">
                      <Image
                        className="image-sub"
                        src={thumbnail[0]?.imageUrl ?? "error"}
                        fallback={productImageDefault}
                        preview={false}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="edit-order-theme-pho-viet-section-right">
              {!isMaxWidth500 && (
                <>
                  <h3 className="product-name text-line-clamp-2" style={{ color: colorGroupBody?.textColor }}>
                    {productName}
                  </h3>

                  <ProductDetailRateComponent
                    classNameTotalReview={"total-review"}
                    numberOfReview={comboData?.numberOfReview}
                    defaultValueRate={comboData?.rating}
                    groupRateStart={"group-star-rate"}
                  />
                  <ProductDetailDescriptionComponent
                    isViewMore={true}
                    classNameDescription={"product-description"}
                    idDescription={"product-description"}
                    content={comboData?.description}
                    styleContent={{ color: colorGroupBody?.textColor }}
                  />
                  <StyledProductPrice>
                    <div className="product-price">
                      <div className="product-price-left">
                        {isDiscount && <span className="product-price-original">{getPriceFormat(originalPrice)}</span>}
                        <span className="product-price-discount" style={{ color: colorGroupBody?.titleColor }}>
                          {getPriceFormat(sellingPrice)}
                        </span>
                      </div>
                      <div className="product-price-right">
                        <div
                          className={`product-price-btn-decrease ${
                            quantityProduct <= 1 ? "prevent-click" : "active-click"
                          }`}
                          hidden={quantityProduct <= 0}
                          onClick={() => updateQuantityProduct(quantityProduct - 1)}
                        >
                          <DecreaseQuantityProductIcon />
                        </div>
                        <span className="product-price-quantity">{quantityProduct}</span>
                        <div
                          className={`product-price-btn-increase ${isOutOfStock && "btn-out-of-stock-disabled"}`}
                          hidden={quantityProduct >= maximumQuantity}
                          onClick={() => (isOutOfStock ? null : updateQuantityProduct(quantityProduct + 1, true))}
                        >
                          <IncreaseQuantityProductIcon />
                        </div>
                      </div>
                    </div>
                  </StyledProductPrice>
                </>
              )}
              <div className="select-edit-order">
                <StyledSelectCollapse>
                  {comboData?.comboProductPrices?.map((item, index) => {
                    let product = item?.productPrice?.product;
                    return (
                      <div className={`group-product-combo ${index >= 1 && "margin-top"}`}>
                        <Collapse defaultActiveKey={["1"]} expandIconPosition="end" className="group-collapse">
                          <CollapsePanel
                            header={renderHeaderCombo(item?.productPrice)}
                            key="1"
                            className="product-name-banner"
                          >
                            <div className="group-product-option">
                              {product?.productOptions?.length > 0 &&
                                renderProductOption(product?.productOptions ?? [], index)}
                            </div>

                            <div className="group-product-topping">
                              {product?.productToppings?.length > 0 &&
                                renderProductTopping(toppings[index] ?? [], index)}
                            </div>
                          </CollapsePanel>
                        </Collapse>
                      </div>
                    );
                  })}
                </StyledSelectCollapse>
              </div>
              <div className="input-note-edit-order">
                {messagesForStore ? <NoteIcon className="note-icon" /> : <NoteIconBlur className="note-icon" />}
                <TextArea
                  className="product-note"
                  placeholder={translatedData.noteAMessageForTheStore}
                  onChange={(e) => setMessagesForStore(e.target.value)}
                  maxLength={100}
                  value={messagesForStore}
                  autoSize
                />
              </div>
              <Row className="total-cart">
                {isMaxWidth500 && (
                  <Col xs={5} sm={5} md={5} lg={5} style={{ marginRight: 12 }}>
                    <div className="btn-add-to-cart btn-add-cancel" onClick={onCancel}>
                      {translatedData.cancel}
                    </div>
                  </Col>
                )}
                <Col xs={numberColBtnAdd} sm={numberColBtnAdd} md={numberColBtnAdd} lg={numberColBtnAdd}>
                  <div
                    className="btn-add-to-cart"
                    onClick={addComboToCart}
                    style={{
                      opacity: isOutOfStock ? 0.5 : 1,
                      cursor: isOutOfStock ? "not-allowed" : "pointer",
                      background: colorGroupBody?.buttonBackgroundColor,
                      color: colorGroupBody?.buttonTextColor,
                      borderColor: colorGroupBody?.buttonBorderColor,
                    }}
                  >
                    <div className="btn-add-to-cart-price-value">{getPriceFormat(totalPriceOfProduct)}</div>
                    <StyledProductPrice>
                      <div className="btn-add-to-cart-text">
                        {currentIndex === -1 ? translatedData.addProductToCart : translatedData.updateCart}
                        <CheckoutIcon className="icon-check-out" />
                      </div>
                    </StyledProductPrice>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
