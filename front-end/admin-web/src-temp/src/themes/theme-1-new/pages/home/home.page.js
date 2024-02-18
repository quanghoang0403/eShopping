import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useAppCtx } from "../../../providers/app.provider";
import { WarningTriangle } from "../../assets/icons.constants";
import { BestSellingProduct } from "../../components/best-selling-product.component";
import { CategoryList } from "../../components/category-list.component";
import { DiscountList } from "../../components/discount-list.component";
import { GoFnBCarousel } from "../../components/gofnb-carousel.component";
import { useSearchParams } from "../../hooks";
import Index from "../../index";
import BlogComponent from "./components/blog/BlogComponent.jsx";
import FlashSaleComponent from "./components/flash-sale/flash-sale.component";
import { SignatureProduct } from "./components/signature-product/signature-product.component";
import { bannerImgs } from "./default-data";

function HomePage(props) {
  const { isDefault, isCustomize } = props;
  window.showDeliveryAddressSelector = true;
  const [slideBannerImgs, setSlideBannerImgs] = useState(bannerImgs);
  const [t] = useTranslation();
  const { Toast } = useAppCtx();
  const query = useSearchParams();
  const history = useHistory();
  const isQrCodeExpired = query.get("isQrCodeExpired");
  const isLoadFromStoreApp = window.isStoreAppWebView;

  const translatedData = {
    qrCodeIsNotAvailable: t("messages.qrCodeIsNotAvailable", "Mã QR không khả dụng"),
  };

  useEffect(() => {
    verfiyQRrCodeIsExpired();
  }, []);

  const verfiyQRrCodeIsExpired = () => {
    if (isQrCodeExpired !== null && isQrCodeExpired !== undefined && isQrCodeExpired) {
      query.delete("isQrCodeExpired");
      history.replace({
        search: query.toString(),
      });
      Toast.show({
        messageType: "error",
        message: translatedData.qrCodeIsNotAvailable,
        icon: <WarningTriangle />,
        placement: "bottom",
        duration: 3,
      });
    }
    return;
  };

  return (
    <>
      <GoFnBCarousel slideBannerImgs={slideBannerImgs} {...props} />
      <FlashSaleComponent {...props} isCustomize={isCustomize} />
      {!isLoadFromStoreApp && <DiscountList {...props} isCustomize={isCustomize} />}
      <CategoryList {...props} />
      <BestSellingProduct {...props} />
      <SignatureProduct {...props} />
      <BlogComponent {...props} />
    </>
  );
}

export default function HomePageContainer(props) {
  return (
    <Index
      {...props}
      contentPage={(indexProps) => {
        return <HomePage {...indexProps} />;
      }}
    />
  );
}
