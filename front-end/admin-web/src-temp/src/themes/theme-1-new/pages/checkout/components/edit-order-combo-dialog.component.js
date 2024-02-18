import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, Input, Row } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import comboDataService from "../../../../data-services/combo-data.service";
import { setCartItems, setNotificationDialog } from "../../../../modules/session/session.actions";
import { useAppCtx } from "../../../../providers/app.provider";
import { checkListProductPriceIdOutOfStock } from "../../../../services/material/check-out-of-stock.service";
import posCartService from "../../../../services/pos/pos-cart.services";
import reduxService from "../../../../services/redux.services";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import { calculatePercentage, checkNonEmptyArray, formatTextNumber } from "../../../../utils/helpers";
import { HttpStatusCode } from "../../../../utils/http-common";
import { getStorage, localStorageKeys } from "../../../../utils/localStorage.helpers";
import { CheckCircleIcon, CloseIcon, MinusOutlined, NoteIcon, PlusOutlined } from "../../../assets/icons.constants";
import productDefaultImage from "../../../assets/images/product-default-img.jpg";
import productDefault from "../../../assets/images/product-default.png";
import { EnumComboType } from "../../../constants/enums";
import { backgroundTypeEnum, comboType, theme1ElementRightId } from "../../../constants/store-web-page.constants";
import { CloseBranchContainer } from "../../../containers/close-branch/close-branch.container";
import ProductDetailImagesComponent from "../../product-detail/components/product-detail-images.component";
import { ProductDetailOptionComponent } from "../../product-detail/components/product-detail-option.component";
import ProductDetailRateDescriptionComponent from "../../product-detail/components/product-detail-rate-description.component";
import { ProductDetailToppingComponent } from "../../product-detail/components/product-detail-topping.component";
import "./edit-order-dialog.style.scss";

export const EditOrderComboDialogComponent = forwardRef((props, ref) => {
  const {
    comboDetailData,
    currentIndex,
    onCancel,
    setCurrentCartItems,
    isPOS = false,
    branchIdPos,
    colorGroup,
    calculateShoppingCart,
    fontFamily,
  } = props;
  const [t] = useTranslation();
  const { Toast } = useAppCtx();
  const dispatch = useDispatch();
  const [comboData, setComboData] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [optionsSelected, setOptionsSelected] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [quantityProduct, setQuantityProduct] = useState(1);
  const [totalPriceTopping, setTotalPriceTopping] = useState(0);
  const [messagesForStore, setMessagesForStore] = useState("");
  const [promotionValue, setPromotionValue] = useState("");
  const [comboName, setComboName] = useState("");
  const { TextArea } = Input;
  const branchAddress = isPOS ? { id: branchIdPos } : reduxService.getAllData()?.deliveryAddress?.branchAddress;
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const translatedData = {
    leaveAMessageForTheStore: t("storeWebPage.generalUse.leaveAMessageForTheStore"),
    description: t("storeWebPage.generalUse.description"),
    maybeYouLike: t("storeWebPage.generalUse.maybeYouLike"),
    review: t("storeWebPage.generalUse.review"),
    thereAreCurrentlyNoReviews: t("storeWebPage.generalUse.thereAreCurrentlyNoReviews"),
    chooseOptions: t("storeWebPage.productDetailPage.chooseOptions"),
    updateCart: t("storeWebPage.generalUse.updateCart"),
    addProductToCart: t("storeWebPage.productDetailPage.addProductToCart", "Add Product To Cart"),
    chooseSize: t("storeWebPage.productDetailPage.chooseSize", "Chọn size"),
    addTopping: t("storeWebPage.productDetailPage.addTopping", "Thêm topping"),
    outOfStock: t("storeWebPage.productDetailPage.outOfStock", "outOfStock"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Sorry! Product is not enough of stock"),
    collapse: t("storeWebPage.productDetailPage.collapse", "Collapse"),
    extend: t("storeWebPage.productDetailPage.extend", "Extend"),
    quantity: t("storeWebPage.productDetailPage.quantity", "Quantity"),
  };

  let defaultActiveKey = ["Size", "Topping", "Option"];
  let productPricesDefaultActiveKey = [];
  const isMobile = useMediaQuery({ maxWidth: 575 });

  const maximumQuantity = 999;

  let styleBackground = {};
  if (comboData?.backgroundType === backgroundTypeEnum.Color) {
    styleBackground = {
      backgroundColor: comboData?.backgroundColor,
    };
  } else if (comboData?.backgroundType === backgroundTypeEnum.Image) {
    styleBackground = {
      backgroundImage: `url(${comboData?.backgroundImage})`,
      backgroundAttachment: "initial",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    };
  }

  const styleTitleForPrice = {
    display: "flex",
    marginTop: "12px",
    alignItems: "center",
  };

  const styleTitle = {
    color: colorGroup?.titleColor,
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
      color: ${colorGroup?.buttonTextColor}!important;
      background-color: ${colorGroup?.buttonBackgroundColor}!important;
      border-color: ${colorGroup?.buttonBorderColor}!important;
    }
    .style-text-customize {
      color: ${colorGroup?.textColor}!important;
    }
  `;

  useEffect(() => {
    if (comboDetailData) {
      initComboData(comboDetailData?.dataDetails, comboDetailData);
    }
  }, [comboDetailData]);

  useImperativeHandle(ref, () => ({}));

  const updateQuantityProduct = async (quantity) => {
    if (comboData) {
      const productPriceIds = comboData?.comboProductPrices?.map((productPrice) => productPrice?.productPriceId);
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
    if (quantity >= 1 && quantity <= maximumQuantity) {
      setQuantityProduct(quantity);
    }
  };

  useEffect(() => {
    if (quantityProduct && comboData && JSON.stringify(comboData) !== "{}") {
      CheckListProductPriceIdOutOfStock(comboData, branchAddress?.id);
    }
  }, [quantityProduct, comboData]);

  async function CheckListProductPriceIdOutOfStock(comboData, branchId) {
    const productPriceIds = comboData?.comboProductPrices?.map((item) => item?.productPriceId);
    let verifyOutOfStock = await checkListProductPriceIdOutOfStock(branchId, productPriceIds, quantityProduct);
    // check outOfStock
    if (verifyOutOfStock) {
      setIsOutOfStock(true);
      const notificationDialog = {
        isShow: true,
        content: translatedData.textOutOfStock,
      };
      dispatch(setNotificationDialog(notificationDialog));
    } else {
      setIsOutOfStock(false);
    }
  }

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
        await getComboPricing(currentData?.comboPricingId).then((response) => {
          if (response?.status === HttpStatusCode.Ok && response?.data?.isSuccess) {
            combo = response?.data?.combo;
          }
        });
      } else {
        await getComboProductPrice(currentData?.id).then((response) => {
          combo = response?.data?.combo;
        });
      }
    }

    combo?.comboProductPrices.map((item, index) => {
      currentData?.products.map((currentItem, currentIndex) => {
        if (item?.productPriceId == currentItem?.productPrice?.id) {
          combo.comboProductPrices[index].productPrice.product.productToppings =
            currentData.products[currentIndex].toppings;
        }
      });
    });

    getComboName(combo);
    setComboData(combo);
    let _toppings = [];
    let _options = [];
    let _originalPrice = 0;
    let _toppingPrice = 0;

    combo?.comboProductPrices?.map((item, index) => {
      const product = item?.productPrice?.product;

      ///Mapping toppings
      const { productToppings } = product;
      _toppings.push(productToppings);
      productToppings?.map((topping) => {
        _toppingPrice += topping.priceValue * topping.quantity;
      });
      _originalPrice += item?.priceValue;

      ///Mapping options
      const currentProductOptions = currentData?.products?.find(
        (x) => x.productPrice?.id === item?.productPriceId,
      )?.options;
      _options.push(getOptionsInitData(currentProductOptions, product?.productOptions));
    });
    setOptionsSelected(_options);
    setToppings(_toppings);
    setSellingPrice(currentData?.sellingPrice);
    setOriginalPrice(_originalPrice);
    setTotalPriceTopping(_toppingPrice);
    setQuantityProduct(currentData?.quantity ?? 0);
    if (_originalPrice >= currentData?.sellingPrice) {
      setPromotionValue("-" + calculatePercentage(currentData?.sellingPrice, _originalPrice));
    }
    setMessagesForStore(currentData?.notes);
  };

  const getComboName = (comboData) => {
    if (comboData?.comboTypeId === comboType.comboPricing.id) {
      const comboName = comboData?.combo?.itemName;
      if (comboName) {
        setComboName(comboName);
      } else {
        setComboName(comboData?.comboPricingName);
      }
    } else {
      setComboName(comboData?.name);
    }
  };

  const getOptionsInitData = (currentOptions, productOptions) => {
    let optionsSelected = [];
    const arrOptionLevelIds = currentOptions?.map((o) => o.optionLevelId);
    if (productOptions) {
      productOptions?.map((productOption) => {
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
      name: comboData?.name,
      comboPricingId: comboData?.comboPricingId,
      comboPricingName: comboData?.comboPricingName,
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

  const updateStoreCart = (combo) => {
    if (isPOS) {
      let posCartItemsNew = [];
      let posCartItems = reduxService.getPOSCartItems();
      if (checkNonEmptyArray(posCartItems)) {
        posCartItemsNew = mergeCombos(combo, posCartItems);
      } else {
        posCartItemsNew.push(combo);
      }
      posCartService.verifyAndUpdateCart(posCartItemsNew);

      // If currentIndex === -1 is Add New
      if (currentIndex === -1) {
        Toast.show({
          messageType: "success",
          message: t("addCartItemToastMessage", "Sản phẩm đã được thêm vào giỏ hàng thành công"),
          icon: <CheckCircleIcon />,
          placement: "top",
          duration: 3,
          className: "toast-message-add-to-cart-theme1",
        });
      } else {
        Toast.show({
          messageType: "success",
          message: t("updateCartItemToastMessage", "Món ăn đã được cập nhật thành công"),
          icon: <CheckCircleIcon />,
          placement: "top",
          duration: 3,
          className: "toast-message-add-to-cart-theme1",
        });
      }
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
      dispatch(setCartItems(storeCartNew));
      setCurrentCartItems([...storeCartNew]);
      if (calculateShoppingCart) {
        calculateShoppingCart();
      }
    }

    onCancel();
  };

  const mergeCombos = (product, productList) => {
    if (productList) {
      var index = productList.findIndex((productItem) => {
        return shoppingCartService.compareCombo(product, productItem);
      });

      // If currentIndex === -1 is Add New
      if (currentIndex === -1) {
        productList.push(product);
      } else {
        if (index >= 0 && index !== currentIndex) {
          productList[index].quantity += product?.quantity;
          productList?.splice(currentIndex, 1);
          return productList;
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
  //#endregion

  const customExpandIcon = (panelProps) => {
    const { isActive } = panelProps;
    return isActive ? (
      <div className="caret-down-out">
        <span>{translatedData.collapse}</span>
        <UpOutlined />
      </div>
    ) : (
      <div className="caret-up-out">
        <span>{translatedData.extend}</span>
        <DownOutlined />
      </div>
    );
  };

  return (
    <>
      <div
        className="edit-product-cart-detail-container"
        style={{ fontFamily: fontFamily }}
        id={theme1ElementRightId.Checkout}
      >
        <Row className="product-detail-content">
          <Col span={10} xs={24} sm={24} md={24} lg={24} xl={10} xxl={10} className="product-detail-content-left">
            <div className="product-detail-image">
              {
                <ProductDetailImagesComponent
                  images={[
                    {
                      imageUrl:
                        comboData?.thumbnail && comboData?.thumbnail !== "" ? comboData.thumbnail : productDefault,
                      imageZoomOutUrl:
                        comboData?.thumbnail && comboData?.thumbnail !== "" ? comboData.thumbnail : productDefaultImage,
                    },
                  ]}
                  isOutOfStock={isOutOfStock}
                  outOfStock={translatedData.outOfStock}
                  isPromotion={true}
                  promotion={promotionValue}
                />
              }
            </div>
          </Col>
          <Col span={14} xs={24} sm={24} md={24} lg={24} xl={14} xxl={14} className="product-detail-content-right">
            <Row id="popup-choose-options">
              {isMobile && <CloseBranchContainer branchId={branchAddress?.id} />}
              <Col xs={24} className="choose-options-header">
                <CloseIcon onClick={onCancel} />
              </Col>
              <Col xs={24} className="product-detail-title h3" style={styleTitle}>
                {comboName}
              </Col>
              <Col xs={24} className="product-detail-title h3" style={styleTitle}>
                <ProductDetailRateDescriptionComponent
                  title={translatedData.description}
                  content={comboData?.description}
                  numberOfReview={comboData?.numberOfReview}
                  styleTitle={styleTitle}
                  classNameRate={"product-detail-rate"}
                  defaultValueRate={comboData?.rating}
                  styleContent={styleText}
                />
              </Col>

              <Col xs={24}>
                <Row>
                  <Col pan={12} xs={13} sm={16} md={16} lg={16} xl={16} xxl={16} style={styleTitleForPrice}>
                    <span className="product-price">{formatTextNumber(sellingPrice)}đ</span>
                    <span className="product-original-price">{formatTextNumber(originalPrice)}đ</span>
                    <div span={12} xs={11} sm={10} className="modify-quantity">
                      <Button
                        icon={<PlusOutlined />}
                        className="btn-increase"
                        disabled={quantityProduct < maximumQuantity ? false : true}
                        onClick={() => updateQuantityProduct(quantityProduct + 1)}
                      ></Button>
                      <span className="quantity-product">{quantityProduct}</span>
                      <Button
                        icon={<MinusOutlined />}
                        className="btn-reduce"
                        disabled={quantityProduct <= 1 ? true : false}
                        onClick={() => updateQuantityProduct(quantityProduct - 1)}
                      ></Button>
                    </div>
                  </Col>
                  <Col span={24} xs={24} className="note">
                    <div className="note-icon-theme1">
                      <NoteIcon className="note-icon" />
                      <div className="border"></div>
                    </div>
                    <div className="input-text-area-theme1">
                      <TextArea
                        className="product-detail-input"
                        placeholder={translatedData.leaveAMessageForTheStore}
                        onChange={(e) => setMessagesForStore(e.target.value)}
                        maxLength={100}
                        value={messagesForStore}
                        autoSize
                      />
                    </div>
                  </Col>
                  <Col span={24} xs={24} className="options">
                    <StyledButtonActive>
                      <Collapse
                        expandIconPosition="end"
                        className="combo-data-collapse-custom custom-collapse"
                        accordion
                        expandIcon={customExpandIcon}
                        activeKey={activeKey}
                        onChange={(keys) => setActiveKey(keys)}
                      >
                        {comboData?.comboProductPrices?.map((item, productPricesIndex) => {
                          let product = item?.productPrice?.product;
                          productPricesDefaultActiveKey.push(item?.productPrice?.productId);
                          return (
                            <Collapse.Panel
                              header={item?.productPrice?.product?.name?.concat(
                                item?.productPrice?.priceName ? ` (${item?.productPrice?.priceName})` : "",
                              )}
                              className="product-price-header"
                              key={item?.productPrice?.productId}
                            >
                              <div className="product-detail-collapse" defaultActiveKey={defaultActiveKey}>
                                {product?.productOptions?.length > 0 && (
                                  <>
                                    {product?.productOptions?.map((option, index) => {
                                      defaultActiveKey.push(option?.id);
                                      return (
                                        <div className="selection" key={index}>
                                          <span className="header">{option?.name}</span>
                                          <ProductDetailOptionComponent
                                            option={option}
                                            onChangeOptions={(e) => comboOnChangeOptions(e, productPricesIndex, index)}
                                            defaultValue={optionsSelected?.[productPricesIndex]?.[index]}
                                          />
                                        </div>
                                      );
                                    })}
                                  </>
                                )}
                                {product?.productToppings?.length > 0 && (
                                  <div key="Topping" className="selection">
                                    <span className="header">{translatedData.addTopping}</span>
                                    {product?.productToppings?.map((topping, index) => {
                                      return (
                                        <ProductDetailToppingComponent
                                          maximumQuantityCustom={maximumQuantity}
                                          topping={topping}
                                          updateQuantityTopping={(quantity, priceValue) =>
                                            comboUpdateQuantityTopping(productPricesIndex, index, quantity, priceValue)
                                          }
                                        />
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </Collapse.Panel>
                          );
                        })}
                      </Collapse>
                    </StyledButtonActive>
                  </Col>
                  <Col xs={24}>
                    <div className="quantity-responsive">
                      <div className="text-quanity">
                        <span>{translatedData.quantity}</span>
                      </div>
                      <div span={12} xs={11} sm={10} className="modify-quantity-for-responsive">
                        <Button
                          icon={<PlusOutlined />}
                          className="btn-increase"
                          disabled={quantityProduct < maximumQuantity ? false : true}
                          onClick={() => updateQuantityProduct(quantityProduct + 1)}
                        ></Button>
                        <span className="quantity-product">{quantityProduct}</span>
                        <Button
                          icon={<MinusOutlined />}
                          className="btn-reduce"
                          disabled={quantityProduct <= 1 ? true : false}
                          onClick={() => updateQuantityProduct(quantityProduct - 1)}
                        ></Button>
                      </div>
                    </div>
                    <div className="button-background">
                      <Button
                        disabled={isOutOfStock}
                        className={`btn-product-detail btn-submit ${isOutOfStock ? "out-of-stock" : ""}`}
                        style={styleButton}
                        onClick={addComboToCart}
                      >
                        {isOutOfStock ? (
                          translatedData.outOfStock
                        ) : (
                          <>
                            {formatTextNumber((totalPriceTopping + sellingPrice) * quantityProduct)} đ -{" "}
                            {currentIndex === -1 ? translatedData.addProductToCart : translatedData.updateCart}
                          </>
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
});
