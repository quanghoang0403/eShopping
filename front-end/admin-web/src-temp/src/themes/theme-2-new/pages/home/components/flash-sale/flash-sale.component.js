import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { Segmented, Tabs } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import flashSaleDataService from "../../../../../data-services/flash-sale-data.service";
import { calculatePercentage, formatDate, formatDateTime } from "../../../../../utils/helpers";
import { HttpStatusCode } from "../../../../../utils/http-common";
import FnbFlashSaleBannerZeroComponent from "../../../../components/fnb-flash-sale-banner-zero/fnb-flash-sale-banner-zero.component";
import { EnumFlashSaleStatus } from "../../../../constants/enum";
import {
  backgroundTypeEnum,
  theme2ElementCustomize,
  theme2ElementRightId,
} from "../../../../constants/store-web-page.constants";
import { DateFormat, ThemeKey } from "../../../../constants/string.constant";
import { flashSaleDefault } from "../../default-data";
import FlashSaleSliderComponent from "../flash-sale-slider.component/flash-sale-slider.component";
import "./flash-sale.component.scss";

const { TabPane } = Tabs;

export default function FlashSaleComponent(props) {
  //handle customize
  const { clickToFocusCustomize, general, isCustomize } = props;
  const flashSale = props?.config?.flashSale;
  const generalCustomization = flashSale?.generalCustomization;
  const colorConfig = general?.color?.colorGroups?.find((c) => c.id === generalCustomization?.colorGroupId);
  const StyledFlashSale = styled.div`
    .product-main-theme2 {
      .product-name {
        color: ${colorConfig?.textColor};
      }
      .product-name .item {
        color: ${colorConfig?.textColor};
      }
      .price-box .price-box-left .product-price-with-discount {
        color: ${colorConfig?.titleColor};
      }
      .price-box .cart {
        background: ${colorConfig?.buttonBackgroundColor};
        path {
          fill: ${colorConfig?.buttonTextColor};
        }
      }
    }
  `;

  let styleBackground = {};
  if (generalCustomization?.backgroundType === backgroundTypeEnum.Color) {
    styleBackground = {
      backgroundColor: generalCustomization?.backgroundColor,
    };
  } else if (generalCustomization?.backgroundType === backgroundTypeEnum.Image) {
    styleBackground = {
      backgroundImage: `url(${generalCustomization?.backgroundImage})`,
      backgroundAttachment: "initial",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  const [t] = useTranslation();
  const translatedData = {
    flashSale: t("storeWebPage.flashSale.title", "Flash sale"),
    ended: t("storeWebPage.flashSale.ended", "Đã kết thúc"),
    endAfter: t("storeWebPage.flashSale.endAfter", "Kết thúc sau"),
    coming: t("storeWebPage.flashSale.coming", "Sắp diễn ra"),
    notOpenYet: t("storeWebPage.flashSale.notOpenYet", "Chưa mở bán"),
    isHappening: t("storeWebPage.flashSale.isHappening", "Đang diễn ra"),
    beginAfter: t("storeWebPage.flashSale.beginAfter", "Bắt đầu sau"),
  };

  const [flashSaleData, setFlashSaleData] = useState(null);
  const [activeTab, setActiveTab] = useState("");

  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const loadFlashSalesAsync = useCallback(async () => {
    if (isCustomize) {
      setFlashSaleData(flashSaleDefault);
    } else {
      let currentBranchId = deliveryAddress?.branchAddress?.id ?? "";
      let isStoreAppWebView = window.isStoreAppWebView;
      let branchIdOnStoreApp = window.branchIdOnStoreApp;
      if (isStoreAppWebView && branchIdOnStoreApp) {
        currentBranchId = branchIdOnStoreApp;
      }

      const flashSaleResponse = await flashSaleDataService.getFlashSaleTodayStoreWebAsync(currentBranchId);
      if (flashSaleResponse?.status === HttpStatusCode.Ok) {
        setFlashSaleData(flashSaleResponse?.data);
      }
    }
  }, [deliveryAddress?.branchAddress?.id, isCustomize]);

  useEffect(() => {
    const fetchFlashSaleData = async () => {
      loadFlashSalesAsync();
    };

    fetchFlashSaleData();
  }, [loadFlashSalesAsync]);

  useEffect(() => {
    const activeKey = flashSaleData?.flashSaleIsHappening
      ? EnumFlashSaleStatus.FlashSaleIsHappening.toString()
      : flashSaleData?.flashSaleIsComing
      ? EnumFlashSaleStatus.FlashSaleIsComing.toString()
      : EnumFlashSaleStatus.FlashSaleHasEnded.toString();
    setActiveTab(activeKey);
  }, [flashSaleData]);

  const mappingDataProducts = (products) => {
    const newProducts = products?.map((p) => ({
      id: p?.productPrice?.productId,
      name: p?.productPrice?.priceName
        ? p?.productPrice?.product?.name + " (" + p?.productPrice?.priceName + ")"
        : p?.productPrice?.product?.name,
      sellingPrice: p?.flashSalePrice,
      originalPrice: p?.productPrice?.priceValue,
      thumbnail: p?.productPrice?.product?.thumbnail,
      description: p?.productPrice?.product?.description,
      flashSaleQuantity: p?.flashSaleQuantity,
      remainingQuantity: p?.remainingQuantity,
      promotionTitle: "-" + calculatePercentage(p?.flashSalePrice, p?.productPrice?.priceValue),
      productPriceId: p?.productPriceId,
      navigateTo: `/product-detail/${p?.productPrice?.productId}`,
    }));
    return newProducts;
  };

  const handleCompleteCountdown = () => {
    setTimeout(() => {
      loadFlashSalesAsync();
    }, 2000);
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
  };
  const options = [
    {
      key: "flashSaleHasEnded",
      label: (
        <>
          <div className="tab-item-time">
            <span>{formatDate(flashSaleData?.flashSaleHasEnded?.endDate, DateFormat.HH)}</span>
            <span className="tab-item-time-separator">:</span>
            <span>{formatDate(flashSaleData?.flashSaleHasEnded?.endDate, DateFormat.MM)}</span>
          </div>
          <div className="tab-item-name">{translatedData.ended.toUpperCase()}</div>
        </>
      ),
      value: EnumFlashSaleStatus.FlashSaleHasEnded.toString(),
    },
    {
      key: "flashSaleIsHappening",
      label: (
        <>
          <div className="tab-item-time">
            <span>{formatDate(flashSaleData?.flashSaleIsHappening?.startDate, DateFormat.HH)}</span>
            <span className="tab-item-time-separator">:</span>
            <span>{formatDate(flashSaleData?.flashSaleIsHappening?.startDate, DateFormat.MM)}</span>
          </div>
          <div className="tab-item-name">{translatedData.isHappening.toUpperCase()}</div>
        </>
      ),
      value: EnumFlashSaleStatus.FlashSaleIsHappening.toString(),
    },
    {
      key: "flashSaleIsComing",
      label: (
        <>
          <div className="tab-item-time">
            <span>{formatDate(flashSaleData?.flashSaleIsComing?.startDate, DateFormat.HH)}</span>
            <span className="tab-item-time-separator">:</span>
            <span>{formatDate(flashSaleData?.flashSaleIsComing?.startDate, DateFormat.MM)}</span>
          </div>
          <div className="tab-item-name">{translatedData.coming}</div>
        </>
      ),
      value: EnumFlashSaleStatus.FlashSaleIsComing.toString(),
    },
  ];

  const renderTabsBanner = () => {
    const keyOptions = Object.keys(flashSaleData);
    return options
      ?.filter((option) => keyOptions?.includes(option.key))
      ?.map((option) => ({ label: option.label, value: option.value }));
  };

  const renderCrossbarCountdown = () => {
    switch (activeTab) {
      case EnumFlashSaleStatus.FlashSaleHasEnded.toString():
        return (
          <>
            {flashSaleData?.flashSaleHasEnded && (
              <div className="crossbar-count-down">
                <div className="crossbar-count-down-title">{translatedData.ended.toUpperCase()}</div>
                <FnbFlashSaleBannerZeroComponent className="flash-sale-banner-zero-custom" />
              </div>
            )}
          </>
        );

      case EnumFlashSaleStatus.FlashSaleIsHappening.toString():
        return (
          <>
            {flashSaleData?.flashSaleIsHappening && (
              <div className="crossbar-count-down" id="crossbar-count-down-1">
                <div className="crossbar-count-down-title">{translatedData.endAfter.toUpperCase()}</div>
                <FlipClockCountdown
                  className="flip-countdown"
                  to={formatDateTime(flashSaleData?.flashSaleIsHappening?.endDate)}
                  onComplete={handleCompleteCountdown}
                  showSeparators={true}
                  renderMap={[false, true, true, true]}
                  showLabels={false}
                  digitBlockStyle={{
                    width: 25,
                    height: 43,
                    fontSize: 24,
                    color: "#FFFFFF",
                    background: "#FF8718",
                    fontWeight: 700,
                  }}
                  dividerStyle={{ color: "rgba(0, 0, 0, 0.1)", height: 1 }}
                  separatorStyle={{ color: "#FFFFFF", size: "4px" }}
                  duration={0.5}
                />
              </div>
            )}
          </>
        );

      case EnumFlashSaleStatus.FlashSaleIsComing.toString():
        return (
          <>
            {flashSaleData?.flashSaleIsComing && (
              <div className="crossbar-count-down" id="crossbar-count-down-2">
                <div className="crossbar-count-down-title">{translatedData.beginAfter.toUpperCase()}</div>
                <FlipClockCountdown
                  className="flip-countdown"
                  to={formatDateTime(flashSaleData?.flashSaleIsComing?.startDate)}
                  onComplete={!flashSaleData?.flashSaleIsHappening && handleCompleteCountdown}
                  showSeparators={true}
                  renderMap={[false, true, true, true]}
                  showLabels={false}
                  digitBlockStyle={{
                    width: 25,
                    height: 43,
                    fontSize: 24,
                    color: "#FFFFFF",
                    background: "#FF8718",
                    fontWeight: 700,
                  }}
                  dividerStyle={{ color: "rgba(0, 0, 0, 0.1)", height: 1 }}
                  separatorStyle={{ color: "#FFFFFF", size: "4px" }}
                  duration={0.5}
                />
              </div>
            )}
          </>
        );

      default:
        return <></>;
    }
  };

  const renderTabsContent = () => {
    switch (activeTab) {
      case EnumFlashSaleStatus.FlashSaleHasEnded.toString():
        return (
          <FlashSaleSliderComponent
            products={mappingDataProducts(flashSaleData?.flashSaleHasEnded?.flashSaleProducts)}
            flashSaleStatus={EnumFlashSaleStatus.FlashSaleHasEnded}
            isCustomize={isCustomize}
          />
        );

      case EnumFlashSaleStatus.FlashSaleIsHappening.toString():
        return (
          <FlashSaleSliderComponent
            products={mappingDataProducts(flashSaleData?.flashSaleIsHappening?.flashSaleProducts)}
            flashSaleStatus={EnumFlashSaleStatus.FlashSaleIsHappening}
            flashSaleId={flashSaleData?.flashSaleIsHappening?.id}
            isCustomize={isCustomize}
          />
        );

      case EnumFlashSaleStatus.FlashSaleIsComing.toString():
        return (
          <FlashSaleSliderComponent
            products={mappingDataProducts(flashSaleData?.flashSaleIsComing?.flashSaleProducts)}
            flashSaleStatus={EnumFlashSaleStatus.FlashSaleIsComing}
            isCustomize={isCustomize}
          />
        );

      default:
        return <></>;
    }
  };

  return (
    <div
      id={theme2ElementRightId.FlashSale}
      onClick={() => {
        if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.FlashSale, null, ThemeKey);
      }}
      style={styleBackground}
      hidden={!flashSale?.visible}
    >
      {flashSaleData && Object.keys(flashSaleData).length > 0 && (
        <div className="flash-sale-wrapper">
          <div className="flash-sale-banner-container">
            <Segmented value={activeTab} options={renderTabsBanner()} onChange={handleTabClick} />
          </div>
          {renderCrossbarCountdown()}
          <div className="flash-sale-content">
            <StyledFlashSale>{renderTabsContent()}</StyledFlashSale>
          </div>
        </div>
      )}
    </div>
  );
}
