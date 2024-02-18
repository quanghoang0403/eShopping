import { Radio } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import styled from "styled-components";
import { FreeMode, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import discountCodeDataService from "../../data-services/discount-code-data.service";
import { store } from "../../modules";
import { LockMultipleCalls, getPromotionsAsync } from "../../services/promotion.services";
import { getStorage, localStorageKeys } from "../../utils/localStorage.helpers";
import { DiscountCodeResponseMessage, EnumDiscountCodeResponseCode } from "../constants/enums";
import {
  backgroundTypeEnum,
  theme1ElementCustomize,
  theme1ElementRightId,
} from "../constants/store-web-page.constants";
import DiscountSlide from "../pages/home/components/DiscountSlide";
import { discountCodeDefault, storeDiscountDefault } from "../pages/home/default-data";
import { DiscountCodeCard } from "./discount-code-card/discount-code-card.component";
import { DiscountCodeToastMessageComponent } from "./discount-code-toast-message/discount-code-toast-message.component";
import "./discount-list.component.scss";
import { FnbLoadingSpinner } from "./fnb-loading-spinner/fnb-loading-spinner.component";

const CARD_DESKTOP_WIDTH = 420;
const CARD_MOBILE_WIDTH = 297;

export function DiscountList(props) {
  const { config, isCustomize, general, clickToFocusCustomize } = props;
  const [t] = useTranslation();
  const history = useHistory();
  const reduxState = store.getState();
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
  const storeConfig = JSON.parse(jsonConfig);
  const branchAddress = reduxState?.session?.deliveryAddress?.branchAddress;
  const promotionSection = props?.config?.promotionSection;
  const generalCustomization = promotionSection?.generalCustomization;
  const colorConfig = general?.color?.colorGroups?.find((c) => c?.id === generalCustomization?.colorGroupId) ?? null;

  const [dataDiscountCode, setDataDiscountCode] = useState([]);
  const [dataStoreDiscount, setDataStoreDiscount] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [loadingDisplayStoreDiscount, setLoadingDisplayStoreDiscount] = useState(false);
  const [isShowDiscountCodeComponent, setIsShowDiscountCodeComponent] = useState(false);
  const [isShowStoreDiscountComponent, setIsShowStoreDiscountComponent] = useState(false);
  const [isShowRedeem, setIsShowRedeem] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [messageRedeemDiscountCode, setMessageRedeemDiscountCode] = useState("");

  const translateData = {
    discountCode: t("promotion.discountCode.title", "Mã giảm giá"),
    storeDiscount: t("promotion.storeDiscount.title", "Giảm giá của cửa hàng"),
    displayStoreDiscount: t(
      "promotion.storeDiscount.display",
      "Các chương trình khuyến mãi này sẽ được <strong>tự động </strong> áp dụng khi đơn hàng của bạn thỏa mãn các điều kiện của chương trình",
    ),
  };

  useEffect(() => {
    fetchDiscountData();
  }, []);

  const fetchDiscountData = async () => {
    handleLoadStoreDiscount();
    handleLoadDiscountCode();
  };

  const handleLoadDiscountCode = async () => {
    let customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
    setLoadingSpinner(true);
    if (isCustomize) {
      setDataDiscountCode(discountCodeDefault);
      setLoadingSpinner(false);
    } else {
      let accountId = customerInfo?.accountId;

      // Getting accountId from the Store App to sync
      let isStoreAppWebView = window.isStoreAppWebView;
      let accountIdOnStoreApp = window.accountIdOnStoreApp;
      if (isStoreAppWebView && accountIdOnStoreApp) {
        accountId = accountIdOnStoreApp;
      }
      LockMultipleCalls(async () => {
        const disCountCodeResults = await discountCodeDataService.getAllDiscountCodeAsync(null, accountId);
        if (disCountCodeResults) {
          setDataDiscountCode(disCountCodeResults.data.discountCodes);
          if (disCountCodeResults.data.discountCodes.length <= 0) {
            setIsShowDiscountCodeComponent(true);
            setActiveScreen(screens.storeDiscount.key);
          }
          setLoadingSpinner(false);
        }
      }, "Lock_handleLoadDiscountCode");
    }
  };

  const handleLoadStoreDiscount = async () => {
    setLoadingSpinner(true);
    if (isCustomize) {
      setDataStoreDiscount(storeDiscountDefault);
    } else {
      LockMultipleCalls(async () => {
        const discounts = await getPromotionsAsync(null);
        if (discounts.data.promotions) {
          setDataStoreDiscount(discounts.data.promotions);
          if (discounts.data.promotions.length <= 0) {
            setIsShowStoreDiscountComponent(true);
            setActiveScreen(screens.discountCode.key);
          }
          setLoadingSpinner(false);
        }
      }, "Lock_handleLoadStoreDiscount");
    }
  };

  const isViewOnStoreApp = () => {
    let isViewOnStoreApp = window.isStoreAppWebView ?? false;
    return isViewOnStoreApp;
  };

  const handleRedeem = async (id) => {
    const isLogin = getStorage(localStorageKeys.LOGIN);
    if (isLogin) {
      const params = {
        discountCodeId: id,
        storeId: storeConfig?.storeId ?? null,
        branchId: branchAddress?.id ?? null,
        accountId: JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.accountId,
        customerId: JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.id,
        code: null,
      };
      const verifyDiscountCode = await discountCodeDataService.redeemDiscountCodeAsync(params);
      if (verifyDiscountCode?.data) {
        const isSuccess = verifyDiscountCode?.data?.isVerifyRedeemDisCount;
        if (Boolean(isSuccess)) {
          setMessageRedeemDiscountCode(DiscountCodeResponseMessage[EnumDiscountCodeResponseCode.Success].message);
        } else {
          const responseRedeemDiscountCode = verifyDiscountCode?.data?.discountCodeResult?.responseCode;
          switch (responseRedeemDiscountCode) {
            case EnumDiscountCodeResponseCode.Expired:
              setMessageRedeemDiscountCode(DiscountCodeResponseMessage[EnumDiscountCodeResponseCode.Expired].message);
              break;
            case EnumDiscountCodeResponseCode.MinimumPurchaseValue:
              setMessageRedeemDiscountCode(
                DiscountCodeResponseMessage[EnumDiscountCodeResponseCode.MinimumPurchaseValue].message,
              );
              break;
            case EnumDiscountCodeResponseCode.OverLimited:
              setMessageRedeemDiscountCode(
                DiscountCodeResponseMessage[EnumDiscountCodeResponseCode.OverLimited].message,
              );
              break;
            case EnumDiscountCodeResponseCode.OverLimitedPerCustomer:
              setMessageRedeemDiscountCode(
                DiscountCodeResponseMessage[EnumDiscountCodeResponseCode.OverLimitedPerCustomer].message,
              );
              break;
            case EnumDiscountCodeResponseCode.NotFound:
              setMessageRedeemDiscountCode(DiscountCodeResponseMessage[EnumDiscountCodeResponseCode.NotFound].message);
              break;
            case EnumDiscountCodeResponseCode.BranchNotApplicable:
              setMessageRedeemDiscountCode(
                DiscountCodeResponseMessage[EnumDiscountCodeResponseCode.BranchNotApplicable].message,
              );
              break;
            case EnumDiscountCodeResponseCode.PlatformNotApplicable:
              setMessageRedeemDiscountCode(
                DiscountCodeResponseMessage[EnumDiscountCodeResponseCode.PlatformNotApplicable].message,
              );
              break;
            case EnumDiscountCodeResponseCode.Existed:
              setMessageRedeemDiscountCode(DiscountCodeResponseMessage[EnumDiscountCodeResponseCode.Existed].message);
              break;
            default:
              setMessageRedeemDiscountCode("promotion.discountCode.redeemFailed");
              break;
          }
        }
        setTimeout(() => {
          setIsShowRedeem(false);
        }, 3000);
        setIsShowRedeem(true);
        setIsSuccess(isSuccess);
        handleLoadDiscountCode();
      }
    } else {
      if (!isViewOnStoreApp()) {
        history.push("/login");
      }
    }
    publishMessageRedeemToStoreApp(id);
  };

  const publishMessageRedeemToStoreApp = (discountCodeId) => {
    let payload = {
      key: "redeemDiscountCode",
      value: discountCodeId,
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
  };

  let settings = {};
  const isMaxWidth575 = useMediaQuery({ maxWidth: 576 });
  if (!isMaxWidth575) {
    settings = {
      navigation: true,
    };
  }

  const gapColumnCardPromotion = isMaxWidth575 ? 12 : 24;
  const lengthCardPromotion = (isMaxWidth575 ? CARD_MOBILE_WIDTH : CARD_DESKTOP_WIDTH) + gapColumnCardPromotion * 2.5;

  const renderDiscountContent = (isDiscountCode) => {
    const dataDiscount = isDiscountCode === true ? dataDiscountCode : dataStoreDiscount;
    if (!Boolean(dataDiscount)) {
      return <></>;
    }
    return (
      <div className="discount-code-list">
        {loadingSpinner ? (
          <FnbLoadingSpinner />
        ) : (
          <>
            {isMaxWidth575 && (
              <DiscountSlide
                width={CARD_MOBILE_WIDTH}
                dataSource={dataDiscount}
                isShowRedeem={isDiscountCode}
                colorConfig={colorConfig}
                onClick={handleRedeem}
              />
            )}

            {!isMaxWidth575 && (
              <div className="regular slider">
                <Swiper
                  {...settings}
                  freeMode={true}
                  modules={[FreeMode, Navigation]}
                  width={lengthCardPromotion}
                  allowTouchMove={true}
                >
                  {dataDiscount?.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <DiscountCodeCard
                          key={index}
                          data={item}
                          isShowRedeem={false}
                          isHomepage={true}
                          onClickRedeem={handleRedeem}
                          colorConfig={colorConfig}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )}

            {loadingDisplayStoreDiscount && (
              <div className="display-store-discount">
                <span
                  dangerouslySetInnerHTML={{
                    __html: t(translateData.displayStoreDiscount),
                  }}
                ></span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const screens = {
    discountCode: {
      key: "discountCode",
      component: <>{renderDiscountContent(true)}</>,
    },
    storeDiscount: {
      key: "storeDiscount",
      component: <>{renderDiscountContent(false)}</>,
    },
  };

  const [activeScreen, setActiveScreen] = useState(screens.discountCode.key);

  const handleChangeScreen = (e) => {
    setActiveScreen(e.target.value);
  };

  const DiscountSlider = () => {
    activeScreen === screens.storeDiscount.key
      ? setLoadingDisplayStoreDiscount(true)
      : setLoadingDisplayStoreDiscount(false);
    switch (activeScreen) {
      case screens.storeDiscount.key:
        return screens.storeDiscount.component;
      default:
        return screens.discountCode.component;
    }
  };

  const DiscountTabs = () => {
    return (
      <Radio.Group value={activeScreen} className="store-discount" onChange={handleChangeScreen}>
        <Radio.Button value={screens.discountCode.key} className={`style-discount-code ${isShowDiscountCodeComponent}`}>
          {translateData.discountCode}
        </Radio.Button>
        <Radio.Button
          value={screens.storeDiscount.key}
          className={`style-store-discount ${isShowStoreDiscountComponent}`}
        >
          {translateData.storeDiscount}
        </Radio.Button>
      </Radio.Group>
    );
  };

  const StyledPromotionSection = styled.div`
    display: ${props?.config?.promotionSection?.visible ? "block" : "none"};
    background-color: ${(props) =>
      (props?.theme?.config?.promotionSection?.generalCustomization?.backgroundType === backgroundTypeEnum.Color ||
        props?.theme?.config?.promotionSection?.generalCustomization?.backgroundType == undefined) &&
      (dataStoreDiscount?.length > 0 || dataDiscountCode?.length > 0) &&
      `${props?.theme?.config?.promotionSection?.generalCustomization?.backgroundColor ?? "#ffffff"}`};
      background-image: url(${(props) =>
        props?.theme?.config?.promotionSection?.generalCustomization?.backgroundType === backgroundTypeEnum.Image &&
        (dataStoreDiscount?.length > 0 || dataDiscountCode?.length > 0) &&
        props?.theme?.config?.promotionSection?.generalCustomization?.backgroundImage})}
        ${!isMobile ? "padding: 30px 0;" : "padding: 1px 0px 17px;"}
        .fnb-discount-code-card-theme-1 .discount-code-content .discount-code-currency {
      border: 1px solid ${colorConfig?.titleColor};
      .value span {
        color: ${colorConfig?.titleColor};
      }
      .currency {
        background-color: ${colorConfig?.titleColor};
      }
    }
    .fnb-discount-code-card-theme-1 .discount-code-content-store-discount .discount-code-currency{
      border: 1px solid ${colorConfig?.titleColor};
      .value span {
        color: ${colorConfig?.titleColor};
      }
      .currency {
        background-color: ${colorConfig?.titleColor};
      }
    }
    .background-discount {
      background-color: ${(props) =>
        (props?.theme?.config?.promotionSection?.generalCustomization?.backgroundTypeDiscountSection ===
          backgroundTypeEnum.Color ||
          props?.theme?.config?.promotionSection?.generalCustomization?.backgroundTypeDiscountSection == undefined) &&
        (dataStoreDiscount?.length > 0 || dataDiscountCode?.length > 0) &&
        props?.theme?.config?.promotionSection?.generalCustomization?.backgroundColorDiscountSection};
      background-image: url(${(props) =>
        props?.theme?.config?.promotionSection?.generalCustomization?.backgroundTypeDiscountSection ===
          backgroundTypeEnum.Image &&
        (dataStoreDiscount?.length > 0 || dataDiscountCode?.length > 0) &&
        props?.theme?.config?.promotionSection?.generalCustomization?.backgroundImageDiscountSection});
    }
    .card-promotion-section-theme1 {
      margin: 0 24px;
    }
    background-size: 100% 100%;
    background-repeat: no-repeat;   
  `;

  return (
    <>
      {(dataStoreDiscount?.length > 0 || dataDiscountCode?.length > 0) && (
        <StyledPromotionSection className="styles-promotion-section-theme1">
          <div
            id={theme1ElementRightId.PromotionSection}
            className="card-promotion-section-theme1"
            onClick={(event) => {
              if (event.target.tagName == "DIV" && clickToFocusCustomize)
                clickToFocusCustomize(theme1ElementCustomize.PromotionSection, null, null);
            }}
          >
            <div
              className={`background-discount main-session ${isShowDiscountCodeComponent} ${isShowStoreDiscountComponent}`}
            >
              {isShowRedeem === true && (
                <DiscountCodeToastMessageComponent isSuccess={isSuccess} message={messageRedeemDiscountCode} />
              )}
              <DiscountTabs />
              <DiscountSlider />
            </div>
          </div>
        </StyledPromotionSection>
      )}
    </>
  );
}
