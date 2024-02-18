import { Button } from "antd";
import { t } from "i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import {
  setCartItems,
  setDataCallBackAddToCart,
  setShowFlashSaleInActive,
} from "../../../modules/session/session.actions";
import { useAppCtx } from "../../../providers/app.provider";
import productComboAddToCartServices from "../../../services/product-combo-add-to-cart.services";
import { QrNotAvailableIcon } from "../../assets/icons.constants";
import Advertisement from "../../components/advertisement/advertisement.component";
import BannerComponent from "../../components/banner/banner.component";
import ConfirmationDialog from "../../components/confirmation-dialog/confirmation-dialog.component";
import Introduction from "../../components/introduction/introduction.component";
import { useSearchParams } from "../../hooks";
import Index from "../../index";
import Blogs from "./components/blogs/blogs.component";
import DiscountSession from "./components/discount-session/discount-session.component";
import FlashSaleComponent from "./components/flash-sale/flash-sale.component";
import TodaySpecialMenu from "./components/today-special-menu/today-special-menu.component";
import "./home.style.scss";

export default function HomePage(props) {
  const { isDefault, themeConfig, isCustomize = false } = props;
  const dispatch = useDispatch();
  const { Toast } = useAppCtx();
  const query = useSearchParams();
  const history = useHistory();
  const isQrCodeExpired = query.get("isQrCodeExpired");
  const isLoadFromStoreApp = window.isStoreAppWebView;

  const isShowFlashSaleInActive = useSelector((state) => state.session?.isShowFlashSaleInActive);
  const callBackAddToCartFunction = useSelector((state) => state.session?.callBackAddToCartFunction ?? null);
  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);

  const translatedData = {
    flashSaleInActive: t("promotion.flashSale.description.inactive"),
    notification: t("loginPage.notification"),
    okay: t("form.okay"),
    qrCodeIsNotAvailable: t("messages.qrCodeIsNotAvailable", "Mã QR không khả dụng"),
  };

  useEffect(() => {
    if (!isDefault) {
      // TODO: if the page not default => the data should be pull from api
    }
    verfiyQRrCodeIsExpired();
  }, []);

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

  const verfiyQRrCodeIsExpired = () => {
    if (isQrCodeExpired !== null && isQrCodeExpired !== undefined && isQrCodeExpired) {
      query.delete("isQrCodeExpired");
      history.replace({
        search: query.toString(),
      });
      Toast.show({
        messageType: "error",
        message: translatedData.qrCodeIsNotAvailable,
        icon: <QrNotAvailableIcon />,
        placement: "bottom",
        className: "theme-light-error",
        duration: 3,
      });
    }
    return;
  };

  return (
    <Index
      {...props}
      contentPage={(props) => {
        return (
          <>
            <BannerComponent {...props} isCustomize={isCustomize}></BannerComponent>
            <FlashSaleComponent {...props} isCustomize={isCustomize} />
            {!isLoadFromStoreApp && <DiscountSession {...props} isCustomize={isCustomize}></DiscountSession>}
            <Advertisement {...props}></Advertisement>
            <Introduction {...props} isCustomize={isCustomize}></Introduction>
            <TodaySpecialMenu {...props}></TodaySpecialMenu>
            <Blogs {...props} isCustomize={isCustomize}></Blogs>
            {/* Temporary hide component that don't have customize page */}
            {/* <CategoryMenu {...props}> </CategoryMenu>
            <Review {...props}></Review>
            <News {...props}></News>
            <Booking {...props}></Booking> */}
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
          </>
        );
      }}
    />
  );
}
