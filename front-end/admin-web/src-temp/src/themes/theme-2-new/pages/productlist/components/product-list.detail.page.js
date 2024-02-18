import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import productDataService from "../../../../data-services/product-data.service";
import { StringWithLimitLength, calculatePercentage, getLabelPromotion, isValidGuid } from "../../../../utils/helpers";
import {
  ArrowRightIcon,
  EmptyProductListIcon,
  QrNotAvailableIcon,
  ScanQRCodeSuccessfully,
} from "../../../assets/icons.constants";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog.component";
import { comboTypeEnum } from "../../../constants/store-web-page.constants";
import { allCombosDefault, allProductsWithCategoryDefault, productCategoriesDefault } from "../default-data";

import { Typography } from "antd";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { EnumOrderType, EnumQRCodeStatus, EnumTargetQRCode, ScrollHeaderType } from "../../../../constants/enums";
import { store } from "../../../../modules";
import {
  setCartItems,
  setDataCallBackAddToCart,
  setDeliveryAddress,
  setShowFlashSaleInActive,
} from "../../../../modules/session/session.actions";
import { useAppCtx } from "../../../../providers/app.provider";
import orderService from "../../../../services/orders/order-service";
import productComboAddToCartServices from "../../../../services/product-combo-add-to-cart.services";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import { localStorageKeys } from "../../../../utils/localStorage.helpers";
import ProductItem from "../../../components/product-item";
import { CloseBranchContainer } from "../../../containers/close-branch/close-branch.container";
import { useSearchParams } from "../../../hooks";
import ProductListScrollSpyComponent from "./product-list-with-scroll-spy";
import "./product-list.detail.page.scss";

export default function ProductListPageDetail(props) {
  const { colorGroups, configuration, clickToFocusCustomize, isDefault } = props;
  const headerConfiguration = useSelector((state) => state.session?.themeConfig)?.general?.header;
  const backgroundImage = configuration?.backgroundImage;
  const backgroundColor = configuration?.backgroundColor;
  const backgroundType = configuration?.backgroundType;
  const colorGroup = colorGroups?.find((c) => c.id === configuration?.colorGroupId);

  let styleProductsProductList = configuration;

  styleProductsProductList = {
    ...styleProductsProductList,
    colorGroup: colorGroup,
  };
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const history = useHistory();
  const { Toast } = useAppCtx();
  const query = useSearchParams();
  const qrCodeId = query.get("qrCodeId");

  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  const stateIsShowFlashSaleInActive = useSelector((state) => state.session?.isShowFlashSaleInActive);
  const stateCallBackAddToCartFunction = useSelector((state) => state.session?.callBackAddToCartFunction);
  const nearestStoreBranches = useSelector((state) => state?.session?.nearestStoreBranches);
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);

  const menuRef = useRef(null);
  const [swiperRef, setSwiperRef] = useState(null);
  const [selectedId, setSelectedId] = useState(0);
  const [allProductsWithCategory, setAllProductsWithCategory] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [combos, setCombos] = useState([]);
  const isMaxWidth640 = useMediaQuery({ maxWidth: 640 });
  const [isShowFlashSaleInActive, setIsShowFlashSaleInActive] = useState(false);
  const [callBackAddToCartFunction, setCallBackAddToCartFunction] = useState(null);
  const [productByCategories, setProductByCategories] = useState(undefined);
  const [productPaging, setProductPaging] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [timeoutIdIsClicked, setTimeoutIdIsClicked] = useState(null);
  const [isShowCartBranchDiffWithQrCodeBranch, setIsShowCartBranchDiffWithQrCodeBranch] = useState(false);
  const [qrCodeOrder, setQrCodeOrder] = useState({});
  const translatedData = {
    flashSaleInActive: t("promotion.flashSale.description.inactive"),
    notification: t("loginPage.notification"),
    okay: t("form.okay"),
    noItemsOnTheMenuYet: t("storeWebPage.noItemsOnTheMenuYet", "There are no items on the menu yet"),
    items: t("orderStatus.items", "Món"),
    confirmation: t("order.confirmation"),
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
    switchBranch: t("button.switchBranch", "Chuyển chi nhánh"),
    no: t("button.no", "Không"),
    addToCartSuccess: t("addToCartSuccess", "Sản phẩm đã được thêm vào giỏ hàng thành công"),
  };
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

  // handle show quantity of nav

  useEffect(() => {
    setIsShowFlashSaleInActive(stateIsShowFlashSaleInActive);
    setCallBackAddToCartFunction(stateCallBackAddToCartFunction);
  }, [stateIsShowFlashSaleInActive]);

  useEffect(() => {
    // TODO: Fetch store info and init data from router parameters
    // branchName, branchAddress, storeLogo, area-table, products add to cart, redirect to store menu
    //http://localhost:3000/product-list?qrCodeId=69fb7d32-93c6-4b66-8a39-0df5713d469c
    if (isValidQrCodeId(qrCodeId)) {
      fetchData(qrCodeId);
    }
    const header = document.querySelector("#themeHeader");
    if (header) {
      if (document.querySelector("#themeProductProductList")) {
        header.classList.add("theme2-header-product-list");
      } else {
        header.classList.remove("theme2-header-product-list");
      }
    }
  }, []);

  useEffect(() => {
    if (clickToFocusCustomize || isDefault) {
      setCombos(allCombosDefault);
      setSelectedId(allCombosDefault[0]?.id);
      setProductCategories(productCategoriesDefault);
      setAllProductsWithCategory(allProductsWithCategoryDefault);
    } else {
      setLoading(true);
      const promiseProducts = productDataService.getProductsStoreScrollSpy("", branchAddress?.id);
      const promiseCombos = productDataService.getCombosStoreScrollSpy("", branchAddress?.id);

      Promise.all([promiseProducts, promiseCombos]).then((values) => {
        const [rsProducts, rsCombos] = values;
        if (rsCombos.data && rsProducts.data) {
          const { combos } = rsCombos.data;
          const { products, categories, productTotalPages, itemPerPage = 0 } = rsProducts.data;
          const comboCategories = [];
          const allProducts = { ...products };
          const paging = { ...productTotalPages };
          const dataPaging = {};
          Object.keys(paging).forEach((_page) => {
            const totalItem = paging[_page];
            dataPaging[_page] = {
              totalItem,
              page: totalItem > itemPerPage ? 1 : -1,
            };
          });
          combos &&
            combos.forEach((comboCategory) => {
              comboCategories.push({
                id: comboCategory.id,
                name: comboCategory.name,
                isCombo: true,
                ...comboCategory,
              });
              allProducts[comboCategory.id] = comboCategory?.comboPricings || [];
            });
          setProductPaging(dataPaging);
          const categoryList = [...comboCategories, ...categories];

          setProductCategories(categoryList);

          setSelectedId(categoryList[0]?.id);
          setProductByCategories(allProducts);
          setLoading(false);
        }
      });
    }
  }, [branchAddress]);

  useEffect(() => {
    let indexMenuItem = 0;
    let nav = document.querySelectorAll(".swiper-slide");
    let index = 0;
    for (let el of nav) {
      const attrId = el.id;
      if (attrId === `title_${selectedId}`) {
        indexMenuItem = index;
        break;
      }
      index++;
    }
    if (swiperRef && !checkIfVisible(indexMenuItem)) {
      swiperRef.slideTo(indexMenuItem, 0);
    }
  }, [selectedId]);

  const swiperPosition = document.getElementById("product-menu-swiper")?.getBoundingClientRect();
  const checkIfVisible = (index) => {
    if (swiperRef && index && swiperPosition) {
      const slide = swiperRef.slides[index];
      const slidePosition = slide ? slide.getBoundingClientRect() : null;
      return slidePosition && slidePosition.left > swiperPosition.left && slidePosition.right < swiperPosition.right;
    }
    return false;
  };

  const detailStyle =
    backgroundType === 1
      ? {
          background: backgroundColor,
        }
      : {
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundPosition: `${
            clickToFocusCustomize || isDefault
              ? document.getElementsByClassName("tc-body")[0].offsetWidth -
                document.getElementById("right-content").offsetWidth +
                "px"
              : ""
          } center`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        };

  //CLick on menu (combo or category) and scroll to prodcuts of combo or category
  const handleClick = async (event, id) => {
    if (timeoutIdIsClicked) {
      clearTimeout(timeoutIdIsClicked);
    }
    setIsClicked(true);
    const navWebHeight = document.getElementById("header-theme2").getBoundingClientRect().height;
    const navProductListHeight = document.getElementById("nav-category-sticky").getBoundingClientRect().height;

    const positionXPreviousId = document.getElementById(`title_${selectedId}`).getBoundingClientRect().x;
    const positionXCurrentId = document.getElementById(`title_${id}`).getBoundingClientRect().x;
    const isAfterPreviousId = positionXCurrentId > positionXPreviousId;
    if(headerConfiguration.scrollType === ScrollHeaderType.SCROLL && isAfterPreviousId){
      document.getElementById(id).style.scrollMarginTop = `${navProductListHeight}px`;
    }
    else {
      document.getElementById(id).style.scrollMarginTop = `${navWebHeight + navProductListHeight}px`;
    }
    setSelectedId(id);
    document.getElementById(id)?.scrollIntoView({
      block: "start",
    });
    setTimeoutIdIsClicked(
      setTimeout(() => {
        setIsClicked(false);
      }, 1000),
    );
  };

  const handleWheel = (id) => {
    let idnav = document.getElementById("nav-category-sticky");
    const elementHeader = document.getElementById("header-theme2");
    if (headerConfiguration?.scrollType === ScrollHeaderType.FIXED) {
      if (idnav) {
        idnav.style.top = `${elementHeader.offsetHeight}px`;
      }
    } else {
      if (idnav) {
        idnav.style.top = `${elementHeader.offsetHeight}px`;
      }
    }
    setSelectedId(id);
  };

  const addToCartWithNoFlashSale = () => {
    if (callBackAddToCartFunction) {
      productComboAddToCartServices.addProductToCart(
        callBackAddToCartFunction.isCombo,
        callBackAddToCartFunction.item,
        callBackAddToCartFunction.productPrice,
        callBackAddToCartFunction.isCheckFlashSaleAddToCart,
        branchAddress,
        (data) => {
          dispatch(setShowFlashSaleInActive(data ?? false));
        },
        (data) => {
          dispatch(setDataCallBackAddToCart(data));
        },
        (data) => {
          dispatch(setCartItems(data));
        },
      );
    }

    if (window.reloadProductList) {
      clearTimeout(window.reloadProductList);
    }
    window.reloadProductList = setTimeout(() => {
      window.location.reload(false);
    }, 1000);
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
          icon: <ScanQRCodeSuccessfully />,
          placement: "bottom",
          className: "theme-light-success message-scan-qr-code-theme-2",
          duration: 3,
        });
        return;
      }
    }
    Toast.show({
      messageType: "error",
      message: translatedData.qrCodeIsNotAvailable,
      icon: <QrNotAvailableIcon />,
      placement: "bottom",
      className: "theme-light-error message-scan-qr-code-theme-2",
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
        const storeCart = JSON.parse(jsonStringStoreCart);
        if (storeCart?.length > 0) {
          if (deliveryAddress?.branchAddress?.id?.toLowerCase() !== branchId?.toLowerCase()) {
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
    const branchAddress = {
      ...qrBranch,
      id: qrBranch?.branchId,
      addressDetail: qrBranch?.branchAddress,
    };
    const currentDeliveryAddress = {
      receiverAddress: deliveryAddress?.receiverAddress,
      branchAddress: branchAddress,
    };
    dispatch(setDeliveryAddress(currentDeliveryAddress));
  };

  const handleAddProductToCart = (productsAddToCart) => {
    for (let index = 0; index < productsAddToCart?.length; index++) {
      const item = productsAddToCart[index];
      productComboAddToCartServices.quickAddToCartQrProducts({
        ...item,
        quantity: item?.productDetail?.quantity,
      });
    }
    handleDeleteParamsOnUrl();
    setTimeout(() => {
      history.push("/checkout");
    }, 500);

    Toast.show({
      messageType: "success",
      message: translatedData.addToCartSuccess,
      icon: <ScanQRCodeSuccessfully />,
      placement: "bottom",
      className: "theme-light-success message-scan-qr-code-theme-2",
      duration: 3,
    });
  };

  const handleConfirmDialogSwitchBranch = () => {
    shoppingCartService.setStoreCartLocalStorage([]);
    handleSwitchBranch(qrCodeOrder.branchId);
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

  const max1Lines = 50;

  const renderCombos = combos.map((combo, index) => {
    const isHasLeft = index > 0;
    const isHasRight = index < combos.length + productCategories.length - 1;
    const comboStyle = {};
    if (isHasLeft) {
      Object.assign(comboStyle, { paddingLeft: 24 });
    }
    if (isHasRight) {
      Object.assign(comboStyle, { paddingRight: 24 });
    }
    if (selectedId === combo?.id) {
      Object.assign(comboStyle, {
        color: colorGroup?.buttonTextColor,
        backgroundColor: colorGroup?.buttonBackgroundColor,
        borderColor: colorGroup?.buttonBorderColor ? colorGroup?.buttonBorderColor : undefined,
        borderWidth: colorGroup?.buttonBorderColor ? 1 : undefined,
      });
    }
    return (
      <SwiperSlide
        style={comboStyle}
        className={"li-normal"}
        key={index}
        onClick={(event) => {
          handleClick(event, combo?.id);
        }}
        id={"title_" + combo?.id}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          {StringWithLimitLength(combo?.name, max1Lines, "...")}
        </Typography.Title>
      </SwiperSlide>
    );
  });

  const renderCategories = productCategories.map((pc, index) => {
    const N_COMBOS = combos?.length;
    const isHasLeft = index + N_COMBOS > 0;
    const isHasRight = index + N_COMBOS < combos.length + productCategories.length - 1;
    const categoryStyle = {};
    if (isHasLeft) {
      Object.assign(categoryStyle, { paddingLeft: 24 });
    }
    if (isHasRight) {
      Object.assign(categoryStyle, { paddingRight: 24 });
    }
    if (selectedId === pc?.id) {
      Object.assign(categoryStyle, {
        color: colorGroup?.buttonTextColor,
        backgroundColor: colorGroup?.buttonBackgroundColor,
        borderColor: colorGroup?.buttonBorderColor ? colorGroup?.buttonBorderColor : undefined,
        borderWidth: colorGroup?.buttonBorderColor ? 1 : undefined,
      });
    }
    return (
      <SwiperSlide
        style={categoryStyle}
        className={"li-normal"}
        key={pc.id}
        onClick={(event) => {
          handleClick(event, pc?.id);
        }}
        id={"title_" + pc?.id}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          {StringWithLimitLength(pc?.name, max1Lines, "...")}
        </Typography.Title>
      </SwiperSlide>
    );
  });

  const renderProductTitle = (pc) => {
    const numberOfProduct = allProductsWithCategory?.filter((p) => p.productCategoryId === pc.id)?.length ?? 0;
    return (
      <>
        <div
          key={pc.id}
          style={{ color: colorGroup?.titleColor }}
          className="product-category"
          id={pc.id}
          onWheel={() => {
            handleWheel(pc.id);
          }}
        >
          <Typography.Title level={5} style={{ margin: 0 }}>
            {StringWithLimitLength(pc.name, max1Lines, "...")} ({numberOfProduct} {translatedData.items})
          </Typography.Title>
        </div>
      </>
    );
  };

  const renderProductDetail = (categoryID, products) => {
    return (
      <>
        <div
          key={categoryID + "-product-list"}
          className="product-list"
          onWheel={() => {
            handleWheel(categoryID);
          }}
        >
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
                colorGroup={colorGroup}
                promotion={promotion}
                isCombo={false}
                isDefault={isDefault}
                isMockup={clickToFocusCustomize || isDefault}
              />
            );
          })}
        </div>
      </>
    );
  };

  const renderComboDetailTitle = (combo, quantity) => {
    return (
      <>
        <div
          key={combo.id}
          style={{ color: colorGroup?.titleColor }}
          className="product-category"
          id={combo.id}
          onWheel={() => {
            handleWheel(combo.id);
          }}
        >
          {StringWithLimitLength(combo.name, max1Lines, "...")} ({quantity} {translatedData.items})
        </div>
      </>
    );
  };

  const renderComboDetail = (combo) => {
    if (combo?.comboTypeId === comboTypeEnum?.comboPricing?.id)
      return (
        <>
          <div
            key={combo.id + "-product-list"}
            className="product-list"
            onWheel={() => {
              handleWheel(combo.id);
            }}
          >
            {combo.comboPricings?.map((comboPricing, index) => {
              const p = {
                id: comboPricing.comboId,
                name: comboPricing.comboName,
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
                  colorGroup={colorGroup}
                  promotion={promotion}
                  isComboPromotion={true}
                  pricingItem={comboPricing}
                  combo={combo}
                  isDefault={isDefault}
                  isMockup={clickToFocusCustomize || isDefault}
                />
              );
            })}
          </div>
        </>
      );

    //Specific combo
    const p = {
      id: combo.comboId,
      name: combo?.name,
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
            colorGroup={colorGroup}
            promotion={promotion}
            combo={combo}
            isDefault={isDefault}
            isMockup={clickToFocusCustomize || isDefault}
          />
        </div>
      </>
    );
  };

  const renderComboDetails = combos.map((combo) => {
    const comboQuantity = combo?.comboTypeId === 1 ? 1 : combo?.comboPricings?.length ?? 0;
    return (
      <>
        {renderComboDetailTitle(combo, comboQuantity)}
        {renderComboDetail(combo)}
      </>
    );
  });

  const renderCategoriesDetail = productCategories.map((pc) => {
    return (
      <>
        {renderProductTitle(pc)}
        {renderProductDetail(
          pc.id,
          allProductsWithCategory?.filter((p) => p.productCategoryId === pc.id),
        )}
      </>
    );
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderMenus = (
    <div id="nav-category-sticky" className="nav-category-sticky">
      <div className="header">
        <div className={`product-menu`} ref={menuRef}>
          <div className="arrow-left">
            <ArrowRightIcon width={24} height={24} />
          </div>
          <Swiper
            onSwiper={setSwiperRef}
            grabCursor={true}
            preventClicks={true}
            simulateTouch={true}
            slidesPerGroupAuto={true}
            navigation={{ nextEl: ".arrow-right", prevEl: ".arrow-left" }}
            slidesPerView={"auto"}
            modules={[Navigation]}
            className="swiper-related-product"
            id="product-menu-swiper"
          >
            {renderCombos}
            {renderCategories}
          </Swiper>
          <div className="arrow-right">
            <ArrowRightIcon width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    //Set default top sticky if type is FIXED
    if (headerConfiguration?.scrollType === ScrollHeaderType.FIXED) {
      const elementHeader = document.getElementById("header-theme2");
      const heighHeader = elementHeader.offsetHeight;
      const elementCategoryProductList = document.getElementById("nav-category-sticky");
      if (elementCategoryProductList && heighHeader) {
        elementCategoryProductList.style.top = `${heighHeader - 1}px`;
      }
    }
  }, [headerConfiguration?.scrollType, renderMenus]);

  const onChangeTab = (id) => {
    if (!isClicked) {
      setSelectedId(id);
    }
  };

  if (clickToFocusCustomize || isDefault)
    return (
      <>
        <div id="themeProductProductList" onClick={(e) => clickToFocusCustomize("customizeProductProductList")}>
          <div className="product-list-detail-theme2-customize" style={detailStyle} tabIndex="0">
            {renderMenus}
            {renderComboDetails}
            {renderCategoriesDetail}
            <div style={{ height: "30px" }}></div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <div id="themeProductProductList">
        <CloseBranchContainer branchId={branchAddress?.id} />
        <div className="product-list-detail-theme2" style={detailStyle} tabIndex="0">
          {productCategories?.length > 0 ? (
            <>
              {renderMenus}
              <ProductListScrollSpyComponent
                loading={loading}
                clickToFocusCustomize={clickToFocusCustomize}
                styledCardProductList={styleProductsProductList}
                products={productByCategories}
                paging={productPaging}
                categories={productCategories}
                isLoadData={true}
                onChangeTab={onChangeTab}
              />
              <div style={{ height: "30px" }}></div>
            </>
          ) : (
            <div className="empty-product-list">
              <EmptyProductListIcon />
              <p className="empty-product-list-text">{translatedData.noItemsOnTheMenuYet}</p>
            </div>
          )}
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
              dispatch(setShowFlashSaleInActive(false));
              addToCartWithNoFlashSale();
            }}
          >
            {translatedData.okay}
          </Button>,
        ]}
        className="flash-sale-in-active-theme2"
      />
      <ConfirmationDialog
        className={"confirm-modal-qr-config"}
        title={translatedData.confirmation}
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: `${t(translatedData.qrCodeIsOnlyValidAt, {
                branchName: qrCodeOrder?.branchName,
              })}. 
                  ${translatedData.doYouWantToClearCartAndSwitchToThatBranch}`,
            }}
          />
        }
        open={isShowCartBranchDiffWithQrCodeBranch}
        okText={translatedData.switchBranch}
        cancelText={translatedData.no}
        onCancel={() => handleCancelDialogSwitchBranch()}
        onConfirm={() => handleConfirmDialogSwitchBranch()}
      />
    </>
  );
}
