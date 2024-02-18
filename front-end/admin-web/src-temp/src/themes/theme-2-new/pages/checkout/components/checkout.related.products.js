import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { EnumAddToCartType, EnumFlashSaleResponseCode } from "../../../../constants/enums";
import productDataService from "../../../../data-services/product-data.service";
import { store } from "../../../../modules";
import productComboAddToCartServices from "../../../../services/product-combo-add-to-cart.services";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import { getLabelPromotion } from "../../../../utils/helpers";
import NotificationDialog from "../../../components/notification-dialog/notification-dialog.component";
import ProductItem from "../../../components/product-item";
import "./checkout.related.products.scss";
import { setToastMessageAddToCart } from "../../../../modules/toast-message/toast-message.actions";
export default function CheckOutRelatedProducts(props) {
  const { addProductToCart, configuration, colorGroups, clickToFocusCustomize, isDefault } = props;
  const colorGroup = colorGroups?.find((c) => c.id === configuration?.colorGroupId);
  const title = configuration?.title ?? "Related Products";
  const backgroundImage = configuration?.backgroundImage;
  const backgroundColor = configuration?.backgroundColor;
  const backgroundType = configuration?.backgroundType;
  const headerStyle =
    backgroundType === 1
      ? {
          background: backgroundColor,
          display: !configuration?.visible && "none",
        }
      : {
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          display: !configuration?.visible && "none",
        };
  const [products, setProducts] = useState(null);
  const branchId = useSelector((state) => state.session?.deliveryAddress?.branchAddress?.id);
  const isMockup = Boolean(clickToFocusCustomize) || Boolean(isDefault);
  const [isShowNotifyFlashSaleDialog, setIsShowNotifyFlashSaleDialog] = useState(false);
  const [flashSaleProduct, setFlashSaleProduct] = useState(null);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const translatedData = {
    okay: t("storeWebPage.generalUse.okay"),
    notification: t("storeWebPage.generalUse.notification"),
    flashSaleEndNotification: t("storeWebPage.flashSale.flashSaleEndNotification"),
  };

  const relatedProductMockup = [
    {
      id: "1",
      name: "Phở tái đặc biệt",
      thumbnail: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/08122022173217.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Molestie.",
      productPrices: [
        {
          priceValue: 50000,
        },
      ],
    },
    {
      id: "2",
      name: "Cam tươi cà phê",
      thumbnail: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/08122022173234.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Molestie.",
      productPrices: [
        {
          priceValue: 40000,
        },
      ],
    },
    {
      id: "3",
      name: "Cơm cá hồi",
      thumbnail: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/08122022173248.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Molestie.",
      productPrices: [
        {
          priceValue: 40000,
        },
      ],
    },
    {
      id: "4",
      name: "Mì xào thập cẩm",
      thumbnail: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/08122022173303.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Molestie.",
      productPrices: [
        {
          priceValue: 40000,
        },
      ],
    },
  ];
  const isMaxWidth640 = useMediaQuery({ maxWidth: 640 });
  useEffect(() => {
    if (isMockup) {
      setProducts(relatedProductMockup);
    } else {
      if (!configuration?.categoryId) return;
      loadProducts();
    }
  }, [configuration?.categoryId]);

  const loadProducts = async () => {
    if (!configuration?.categoryId) {
      setProducts([]);
      return;
    }
    const responseData = await productDataService.getProductsStoreTheme(
      configuration?.categoryId,
      isMockup ? "" : branchId,
    );
    if (responseData) setProducts(responseData.data.products);
  };

  const quickAddToCart = async (data) => {
    let requestData = {
      id: data?.id,
      productPriceId: data?.productPrices[0]?.id,
      isFlashSale: data?.isFlashSale,
      flashSaleId: data?.flashSaleId,
    };
    productComboAddToCartServices.quickAddToCart(
      requestData,
      EnumAddToCartType.Product,
      branchId,
      () => calculateShoppingCart(),
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
    calculateShoppingCart();
  };

  const calculateShoppingCart = () => {
    const reduxState = store.getState();
    const session = reduxState?.session;
    const cartItems = session?.cartItems ?? [];
    const orderInfo = session?.orderInfo;
    shoppingCartService?.setStoreCart(cartItems, true, orderInfo?.shippingFee ?? 0);
  };

  const renderRelatedProducts = () => {
    let containerRelatedProducts = <></>;
    let containRelatedProducts = products?.map((p, index) => {
      const originalPrice = p?.productPrices?.[p?.defaultProductPriceIndex ?? 0]?.originalPrice ?? 0;
      const sellingPrice = p?.productPrices?.[p?.defaultProductPriceIndex ?? 0]?.priceValue ?? 0;
      const promotionTitle =
        p?.isHasPromotion || p?.isFlashSale
          ? getLabelPromotion(
              p?.isFlashSale,
              p?.isDiscountPercent,
              p?.discountValue,
              p?.isHasPromotion,
              originalPrice,
              sellingPrice,
            )
          : null;
      const product = {
        ...p,
        originalPrice: originalPrice,
        sellingPrice: sellingPrice,
        promotionTitle: promotionTitle,
        defaultProductPriceIndex: 0,
      };
      if (isMaxWidth640) {
        return (
          <SwiperSlide className="swiper-slide-related-product">
            <ProductItem
              key={index}
              product={product}
              colorGroup={colorGroup}
              addProductToCart={() => quickAddToCart(product)}
              useIconAddtoCart={true}
              isCombo={false}
              className={"checkout-related-product-item-theme2"}
            />
          </SwiperSlide>
        );
      }
      return (
        <ProductItem
          key={index}
          product={product}
          colorGroup={colorGroup}
          addProductToCart={() => quickAddToCart(product)}
          useIconAddtoCart={true}
          isCombo={false}
        />
      );
    });

    if (isMaxWidth640) {
      containerRelatedProducts = (
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={12}
          pagination={{
            clickable: false,
          }}
          modules={[Pagination]}
          className="swiper-related-product"
        >
          {containRelatedProducts}
        </Swiper>
      );
    } else {
      containerRelatedProducts = <>{containRelatedProducts}</>;
    }
    return containerRelatedProducts;
  };

  return (
    <>
      <div
        id="themeRelatedProductsCheckout"
        onClick={() => {
          if (clickToFocusCustomize) clickToFocusCustomize("customizeRelatedProductCheckout");
        }}
      >
        <div className="check_out_theme2_related_products" style={headerStyle}>
          <div className="header_title" style={{ color: colorGroup?.titleColor }}>
            {title}
          </div>
          <div className="product_list">
            <div className="product_row">{renderRelatedProducts()}</div>
          </div>
        </div>
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
    </>
  );
}
