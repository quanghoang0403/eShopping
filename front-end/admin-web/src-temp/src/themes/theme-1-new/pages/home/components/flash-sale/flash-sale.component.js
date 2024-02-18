import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { Tabs } from "antd";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import flashSaleDataService from "../../../../../data-services/flash-sale-data.service";
import { formatDate, formatDateTime } from "../../../../../utils/helpers";
import flashSaleLogo from "../../../../assets/images/flash-sale-logo.png";
import { EnumFlashSaleStatus } from "../../../../constants/enums";
import {
  backgroundTypeEnum,
  theme1ElementCustomize,
  theme1ElementRightId,
} from "../../../../constants/store-web-page.constants";
import { DateFormat, ThemeKey } from "../../../../constants/string.constants";
import { flashSaleDefault } from "../../default-data";
import FlashSaleSliderComponent from "../flash-sale-slider.component/flash-sale-slider.component";
import "./flash-sale.component.scss";

const { TabPane } = Tabs;
const FlashSaleComponent = memo((props) => {
  const { clickToFocusCustomize, general, isCustomize } = props;
  const flashSale = props?.config?.flashSale;
  const generalCustomization = flashSale?.generalCustomization;
  const colorConfig = general?.color?.colorGroups?.find((c) => c?.id === generalCustomization?.colorGroupId) ?? null;
  const StyledFlashSale = styled.div`
    .flash-sale-product {
      .name {
        color: ${colorConfig?.textColor};
      }

      .selling-price {
        color: ${colorConfig?.titleColor};
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
  };

  const [flashSaleData, setFlashSaleData] = useState(null);
  const [activeTab, setActiveTab] = useState("");

  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const branchAddressId = deliveryAddress?.branchAddress?.id ?? "";

  const loadFlashSales = useCallback(async () => {
    if (isCustomize) {
      setFlashSaleData(flashSaleDefault);
    } else {
      let currentBranchId = branchAddressId;
      let isStoreAppWebView = window.isStoreAppWebView;
      let branchIdOnStoreApp = window.branchIdOnStoreApp;
      if (isStoreAppWebView && branchIdOnStoreApp) {
        currentBranchId = branchIdOnStoreApp;
      }
      await flashSaleDataService
        .getFlashSaleTodayStoreWebAsync(currentBranchId)
        .then((response) => {
          if (response?.status === 200) {
            setFlashSaleData(response?.data);
          } else {
            //To do
          }
        })
        .catch((response) => {
          //To do
        });
    }
  }, [branchAddressId]);

  useEffect(() => {
    loadFlashSales();
  }, [branchAddressId]);

  const mappingDataProducts = (products) => {
    const newProducts = products?.map((p) => ({
      id: p?.productPrice?.productId,
      name: p?.productPrice?.priceName
        ? p?.productPrice?.product?.name + " (" + p?.productPrice?.priceName + ")"
        : p?.productPrice?.product?.name,
      sellingPrice: p?.flashSalePrice,
      originalPrice: p?.productPrice?.priceValue,
      thumbnail: p?.productPrice?.product?.thumbnail,
      flashSaleQuantity: p?.flashSaleQuantity,
      remainingQuantity: p?.remainingQuantity,
    }));
    return newProducts;
  };

  const handleCompleteCountdown = () => {
    setTimeout(() => {
      loadFlashSales();
    }, 2000);
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    const activeKey = flashSaleData?.flashSaleIsHappening
      ? EnumFlashSaleStatus.FlashSaleIsHappening.toString()
      : flashSaleData?.flashSaleIsComing
      ? EnumFlashSaleStatus.FlashSaleIsComing.toString()
      : EnumFlashSaleStatus.FlashSaleHasEnded.toString();
    setActiveTab(activeKey);
  }, [flashSaleData]);

  return (
    <div
      id={theme1ElementRightId.FlashSale}
      onClick={() => {
        if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.FlashSale, null, ThemeKey);
      }}
      style={styleBackground}
      hidden={!flashSale?.visible}
    >
      {flashSaleData && Object.keys(flashSaleData).length > 0 && (
        <div className="main-session">
          <div className="flash-sale-home-page-theme-1">
            <div className="flash-sale-logo">
              <img src={flashSaleLogo}></img>
            </div>
            <Tabs activeKey={activeTab} onTabClick={handleTabClick} centered>
              {flashSaleData?.flashSaleHasEnded && (
                <TabPane
                  tab={
                    <>
                      <div className="tab-item-name">{translatedData.ended}</div>
                      <div className="tab-item-time">
                        {formatDate(flashSaleData?.flashSaleHasEnded?.endDate, DateFormat.HH_MM)}
                      </div>
                    </>
                  }
                  key={EnumFlashSaleStatus.FlashSaleHasEnded.toString()}
                >
                  <StyledFlashSale>
                    <FlashSaleSliderComponent
                      products={mappingDataProducts(flashSaleData?.flashSaleHasEnded?.flashSaleProducts)}
                      flashSaleStatus={EnumFlashSaleStatus.FlashSaleHasEnded}
                    />
                  </StyledFlashSale>
                </TabPane>
              )}
              {flashSaleData?.flashSaleIsHappening && (
                <TabPane
                  tab={
                    <>
                      <div className="tab-item-name">{translatedData.endAfter}</div>
                      <div className="tab-item-time">
                        <FlipClockCountdown
                          className="flip-countdown"
                          to={formatDateTime(flashSaleData?.flashSaleIsHappening?.endDate)}
                          onComplete={handleCompleteCountdown}
                          showSeparators={false}
                          renderMap={[false, true, true, true]}
                          showLabels={false}
                          digitBlockStyle={{
                            width: 24,
                            height: 40,
                            fontSize: 24,
                            color: "#50429B",
                            background: "#FFFFFF",
                            fontWeight: 700,
                          }}
                          dividerStyle={{ color: "rgba(0, 0, 0, 0.1)", height: 1 }}
                          separatorStyle={{ color: "#FFFFFF", size: "5px" }}
                          duration={0.5}
                        />
                      </div>
                    </>
                  }
                  key={EnumFlashSaleStatus.FlashSaleIsHappening.toString()}
                >
                  <StyledFlashSale>
                    <FlashSaleSliderComponent
                      products={mappingDataProducts(flashSaleData?.flashSaleIsHappening?.flashSaleProducts)}
                      flashSaleStatus={EnumFlashSaleStatus.FlashSaleIsHappening}
                    />
                  </StyledFlashSale>
                </TabPane>
              )}
              {flashSaleData?.flashSaleIsComing && (
                <TabPane
                  tab={
                    <>
                      <div className="tab-item-name">{translatedData.coming}</div>
                      <div className="tab-item-time">
                        {formatDate(flashSaleData?.flashSaleIsComing?.startDate, DateFormat.HH_MM)}
                      </div>
                      {!flashSaleData?.flashSaleIsHappening && (
                        <div className="d-none">
                          <FlipClockCountdown
                            to={formatDateTime(flashSaleData?.flashSaleIsComing?.startDate)}
                            onComplete={handleCompleteCountdown}
                          />
                        </div>
                      )}
                    </>
                  }
                  key={EnumFlashSaleStatus.FlashSaleIsComing.toString()}
                >
                  <StyledFlashSale>
                    <FlashSaleSliderComponent
                      products={mappingDataProducts(flashSaleData?.flashSaleIsComing?.flashSaleProducts)}
                      flashSaleStatus={EnumFlashSaleStatus.FlashSaleIsComing}
                    />
                  </StyledFlashSale>
                </TabPane>
              )}
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
});
export default FlashSaleComponent;
