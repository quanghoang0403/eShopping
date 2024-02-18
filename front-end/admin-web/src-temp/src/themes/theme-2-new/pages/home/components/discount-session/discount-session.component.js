import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Col, Row, Tabs } from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import styled from "styled-components";
import "swiper/css/pagination";
import { DiscountCodeResponseMessage, EnumDiscountCodeResponseCode } from "../../../../../constants/enums";
import discountCodeDataService from "../../../../../data-services/discount-code-data.service";
import { store } from "../../../../../modules";
import { LockMultipleCalls, getPromotionsAsync } from "../../../../../services/promotion.services";
import { getStorage, localStorageKeys } from "../../../../../utils/localStorage.helpers";
import "../../../../assets/css/home-page.style.scss";
import { DiscountCodeToastMessageComponent } from "../../../../components/discount-code-toast-message/discount-code-toast-message.component";
import { FnbLoadingSpinner } from "../../../../components/fnb-loading-spinner/fnb-loading-spinner.component";
import { FnbPromotionCard } from "../../../../components/fnb-promotion-card";
import { EnumPromotionTabKey, EnumPromotionType } from "../../../../constants/enum";
import {
  backgroundTypeEnum,
  theme2ElementCustomize,
  theme2ElementRightId,
} from "../../../../constants/store-web-page.constants";
import { DateFormat, ThemeKey } from "../../../../constants/string.constant";
import { discountCodeDefault, storeDiscountDefault } from "../../default-data";
import "./discount-session.style.scss";

const StyledPromotionSection = styled.div`
  display: ${(props) => (props?.config?.promotionSection?.visible ? "block" : "none")};
  background-color: ${(props) =>
    props?.theme?.config?.promotionSection?.generalCustomization?.backgroundType === backgroundTypeEnum.Color &&
    props?.theme?.config?.promotionSection?.generalCustomization?.backgroundColor};
  background-image: ${(props) =>
    props?.theme?.config?.promotionSection?.generalCustomization?.backgroundType === backgroundTypeEnum.Image &&
    `url(${props?.theme?.config?.promotionSection?.generalCustomization?.backgroundImage})`};
  padding: 24px 12px;

  .fnb-promotion-card .header-card .card-title-discount {
    color: ${(props) => props?.colorConfig?.textColor};
  }

  .fnb-promotion-card .header-card .card-title-store {
    color: ${(props) => props?.colorConfig?.textColor};
  }

  .fnb-promotion-card .content-card {
    color: ${(props) => props?.colorConfig?.textColor};
  }

  .fnb-promotion-card .row-header-card .col-button-redeem .card-icon .card-icon-content .btn-redeem {
    background: ${(props) => props?.colorConfig?.buttonBackgroundColor};
    color: ${(props) => props?.colorConfig?.buttonTextColor};
    border: 1px solid ${(props) => props?.colorConfig?.buttonBorderColor} !important;
    min-width: auto;
  }
  .fnb-promotion-card .content-card-discount .discount-amount {
    border: 1px solid ${(props) => props?.colorConfig?.textColor} !important;
  }
  .fnb-promotion-card .content-card .discount-amount {
    border: 1px solid ${(props) => props?.colorConfig?.textColor} !important;
  }
  .discount-session-home-page .ant-tabs .ant-tabs-nav .ant-tabs-nav-list .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${(props) => props?.colorConfig?.titleColor};
  }

  .discount-session-home-page .ant-tabs .ant-tabs-nav .ant-tabs-nav-list .ant-tabs-tab-active::after {
    background-color: ${(props) => props?.colorConfig?.titleColor};
  }

  .extra-content .button-extra .red-icon {
    color: ${(props) => props?.colorConfig?.buttonTextColor};
  }

  .promotion-section-components {
    background-color: ${(props) =>
      props?.theme?.config?.promotionSection?.generalComponentCustomization?.backgroundType ===
        backgroundTypeEnum.Color &&
      props?.theme?.config?.promotionSection?.generalComponentCustomization?.backgroundColor};
    background-image: ${(props) =>
      props?.theme?.config?.promotionSection?.generalComponentCustomization?.backgroundType ===
        backgroundTypeEnum.Image &&
      `url(${props?.theme?.config?.promotionSection?.generalComponentCustomization?.backgroundImage})`};
  }
  background-size: 100% 100%;
  background-repeat: no-repeat;
`;

export default function DiscountSession(props) {
  const [t] = useTranslation();
  const translatedData = {
    storeDiscountInfo: t(
      "promotion.discount.storeDiscountInfo",
      "Các chương trình khuyến mãi này sẽ được tự động áp dụng khi đơn hàng của bạn thỏa mãn các điều kiện của chương trình",
    ),
    discountCodeTab: t("promotion.discount.discountCodeTab", "Mã giảm giá"),
    storeDiscountTab: t("promotion.discount.storeDiscountTab", "Giảm giá của cửa hàng"),
    storeDiscountTitle: t("promotion.discount.title"),
  };

  const history = useHistory();
  const reduxState = store.getState();
  const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
  const storeConfig = JSON.parse(jsonConfig);
  const branchAddress = reduxState?.session?.deliveryAddress?.branchAddress;

  const { config, general, isCustomize, isDefault, clickToFocusCustomize } = props;
  const promotionSection = config?.promotionSection;
  const generalCustomization = promotionSection?.generalCustomization;
  const containerRefCode = useRef(null);
  const containerRefStore = useRef(null);
  const [activeTab, setActiveTab] = useState(EnumPromotionTabKey.discountCode);
  const [isLeftEndCode, setIsLeftEndCode] = useState(true);
  const [isRightEndCode, setIsRightEndCode] = useState(false);
  const [isLeftEndStore, setIsLeftEndStore] = useState(true);
  const [isRightEndStore, setIsRightEndStore] = useState(false);
  const [isLeftEnd, setIsLeftEnd] = useState(true);
  const [isRightEnd, setIsRightEnd] = useState(false);
  const [isHiddenButton, setIsHiddenButton] = useState(false);

  const [dataDiscountCode, setDataDiscountCode] = useState([]);
  const [dataStoreDiscountCode, setDataStoreDiscountCode] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [isShowRedeem, setIsShowRedeem] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [messageRedeemDiscountCode, setMessageRedeemDiscountCode] = useState("");

  const colorConfig = general?.color?.colorGroups?.find((c) => c?.id === generalCustomization?.colorGroupId) ?? null;
  useEffect(() => {
    handleLoadDiscountCode();
  }, []);

  const handleLoadDiscountCode = async () => {
    let customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
    const params = {
      storeId: storeConfig?.storeId ?? null,
      branchId: branchAddress?.id ?? null,
      currentDate: moment.utc(Date.now()).local().format(DateFormat.DD_MMMM_YYYY_HH_mm_ss),
      accountId: customerInfo?.accountId,
    };
    setLoadingSpinner(true);

    let accountId = params.accountId;
    // Getting accountId from the Store App to sync
    let isStoreAppWebView = window.isStoreAppWebView;
    let accountIdOnStoreApp = window.accountIdOnStoreApp;
    if (isStoreAppWebView && accountIdOnStoreApp) {
      accountId = accountIdOnStoreApp;
    }

    if (isCustomize) {
      setDataStoreDiscountCode(storeDiscountDefault);
      setDataDiscountCode(discountCodeDefault);
    } else {
      LockMultipleCalls(async () => {
        const storeDiscountCodeResults = await getPromotionsAsync(params.branchId);
        if (storeDiscountCodeResults) {
          setDataStoreDiscountCode(storeDiscountCodeResults.data.promotions);
        }
      }, "Lock_getPromotionsAsync");
      LockMultipleCalls(async () => {
        const disCountCodeResults = await discountCodeDataService.getAllDiscountCodeAsync(params.branchId, accountId);
        if (disCountCodeResults.data.discountCodes.length === 0) {
          setActiveTab(EnumPromotionTabKey.storeDiscount);
        }
        if (disCountCodeResults) {
          setDataDiscountCode(disCountCodeResults.data.discountCodes);
        }
      }, "Lock_getAllDiscountCodeAsync");
    }
    setLoadingSpinner(false);
  };

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

  //#region Handle the mouse drag event in the list card
  const handleMouseDown = (event, ref) => {
    ref.current.isDragging = true;
    ref.current.startX = event.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = ref.current.scrollLeft;
  };

  const handleMouseMove = (event, ref) => {
    if (!ref.current.isDragging) return;
    event.preventDefault();
    const x = event.pageX - ref.current.offsetLeft;
    const walk = (x - ref.current.startX) * 0.1;
    ref.current.scrollLeft = ref.current.scrollLeft - walk;
  };

  const handleMouseUp = (ref) => {
    ref.current.isDragging = false;
  };
  //#endregion

  const isViewOnStoreApp = () => {
    let isViewOnStoreApp = window.isStoreAppWebView ?? false;
    return isViewOnStoreApp;
  };

  const handleClickRedeem = async (id) => {
    const isLogin = getStorage(localStorageKeys.TOKEN);
    if (isLogin) {
      const params = {
        discountCodeId: id,
        storeId: storeConfig?.storeId ?? null,
        branchId: branchAddress?.id ?? null,
        accountId: JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.accountId,
        customerId: JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.id,
        currentDate: moment.utc(Date.now()).local().format(DateFormat.DD_MMMM_YYYY_HH_mm_ss),
      };
      const verifyDiscountCode = await discountCodeDataService.redeemDiscountCodeAsync(params);
      if (verifyDiscountCode?.data) {
        const isSuccessResponse = verifyDiscountCode?.data?.isVerifyRedeemDisCount;
        if (Boolean(isSuccessResponse)) {
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
        setIsSuccess(isSuccessResponse);

        //Remove code in list
        const removeIndex = dataDiscountCode.findIndex((obj) => obj.id === id);
        if (removeIndex > -1) {
          dataDiscountCode.splice(removeIndex, 1);
        }
        if (dataDiscountCode?.length <= 0 && dataStoreDiscountCode.length >= 0) {
          setActiveTab(EnumPromotionTabKey.storeDiscount);
        }
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

  let itemsTabs = [];
  let discountCodeTab = {
    label: translatedData.discountCodeTab,
    key: EnumPromotionTabKey.discountCode,
    children: (
      <div
        className="card-list-container tab-discount-code"
        onMouseDown={(event) => handleMouseDown(event, containerRefCode)}
        onMouseMove={(event) => handleMouseMove(event, containerRefCode)}
        onMouseUp={() => handleMouseUp(containerRefCode)}
        ref={containerRefCode}
      >
        <div className="card-list">
          {dataDiscountCode?.map((item, index) => (
            <FnbPromotionCard
              key={index}
              type={EnumPromotionType.DISCOUNT_CODE}
              onClickRedeem={handleClickRedeem}
              data={item}
              colorConfig={colorConfig}
            />
          ))}
        </div>
      </div>
    ),
  };

  let storeDiscountCodeTab = {
    label: translatedData.storeDiscountTab,
    key: EnumPromotionTabKey.storeDiscount,
    children: (
      <>
        <div
          className="card-list-container tab-store-discount"
          onMouseDown={(event) => handleMouseDown(event, containerRefStore)}
          onMouseMove={(event) => handleMouseMove(event, containerRefStore)}
          onMouseUp={() => handleMouseUp(containerRefStore)}
          ref={containerRefStore}
        >
          <div className="card-list">
            {dataStoreDiscountCode?.map((item, index) => (
              <FnbPromotionCard key={index} type={EnumPromotionType.STORE_CODE} data={item} colorConfig={colorConfig} />
            ))}
          </div>
        </div>
        <div className="storeDiscountInfo">
          <span
            dangerouslySetInnerHTML={{
              __html: t(translatedData.storeDiscountInfo),
            }}
          ></span>
        </div>
      </>
    ),
  };

  if (dataDiscountCode?.length > 0) {
    itemsTabs.push(discountCodeTab);
  }
  if (dataStoreDiscountCode?.length > 0) {
    itemsTabs.push(storeDiscountCodeTab);
  }

  //#region Handle button scroll list card
  const handleScrollLeft = () => {
    if (activeTab == EnumPromotionTabKey.discountCode) {
      if (containerRefCode.current) {
        containerRefCode.current.scrollLeft -= 200;
        const containerCode = containerRefCode.current;
        if (containerCode) {
          setIsLeftEndCode(containerCode.scrollLeft === 0);
          setIsRightEndCode(containerCode.scrollLeft + containerCode.clientWidth === containerCode.scrollWidth);
        }
      }
    }
    if (activeTab == EnumPromotionTabKey.storeDiscount) {
      if (containerRefStore.current) {
        containerRefStore.current.scrollLeft -= 200;
        const containerStore = containerRefStore.current;
        if (containerStore) {
          setIsLeftEndStore(containerStore.scrollLeft === 0);
          setIsRightEndStore(containerStore.scrollLeft + containerStore.clientWidth === containerStore.scrollWidth);
        }
      }
    }
  };

  const handleScrollRight = () => {
    if (activeTab == EnumPromotionTabKey.discountCode) {
      if (containerRefCode.current) {
        containerRefCode.current.scrollLeft += 200;
        const containerCode = containerRefCode.current;

        if (containerCode) {
          setIsLeftEndCode(containerCode.scrollLeft === 0);
          setIsRightEndCode(containerCode.scrollLeft + containerCode.clientWidth === containerCode.scrollWidth);
        }
      }
    }
    if (activeTab == EnumPromotionTabKey.storeDiscount) {
      if (containerRefStore.current) {
        containerRefStore.current.scrollLeft += 200;
        const containerStore = containerRefStore.current;
        if (containerStore) {
          setIsLeftEndStore(containerStore.scrollLeft === 0);
          setIsRightEndStore(containerStore.scrollLeft + containerStore.clientWidth === containerStore.scrollWidth);
        }
      }
    }
  };

  useEffect(() => {
    if (activeTab == EnumPromotionTabKey.discountCode) {
      setIsLeftEnd(isLeftEndCode);
      setIsRightEnd(isRightEndCode);
    } else if (activeTab == EnumPromotionTabKey.storeDiscount) {
      setIsLeftEnd(isLeftEndStore);
      setIsRightEnd(isRightEndStore);
    }
  }, [isLeftEndCode, isRightEndCode, isLeftEndStore, isRightEndStore]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key == EnumPromotionTabKey.discountCode) {
      setIsLeftEnd(isLeftEndCode);
      setIsRightEnd(isRightEndCode);
    } else if (key == EnumPromotionTabKey.storeDiscount) {
      setIsLeftEnd(isLeftEndStore);
      setIsRightEnd(isRightEndStore);
    }
  };
  //#endregion

  var width = window.innerWidth;
  const thresholdWidth3Item = 1270;
  const thresholdWidth2Item = 830;
  useEffect(() => {
    if (activeTab == EnumPromotionTabKey.discountCode) {
      if (width > thresholdWidth3Item && dataDiscountCode?.length <= 3) {
        setIsRightEnd(true);
        setIsHiddenButton(true);
      } else if (width > thresholdWidth2Item && dataDiscountCode?.length <= 2) {
        setIsRightEnd(true);
        setIsHiddenButton(true);
      } else {
        setIsRightEnd(false);
        setIsHiddenButton(false);
      }
    } else if (activeTab == EnumPromotionTabKey.storeDiscount) {
      if (width > thresholdWidth3Item && dataStoreDiscountCode?.length <= 3) {
        setIsRightEnd(true);
        setIsHiddenButton(true);
      } else if (width > thresholdWidth2Item && dataStoreDiscountCode?.length <= 2) {
        setIsRightEnd(true);
        setIsHiddenButton(true);
      } else {
        setIsRightEnd(false);
        setIsHiddenButton(false);
      }
    }
  }, [dataDiscountCode?.length, dataStoreDiscountCode?.length, activeTab]);

  function throttle(callback, delay) {
    let timerId;
    return function () {
      if (timerId) return;
      timerId = setTimeout(() => {
        callback();
        timerId = null;
      }, delay);
    };
  }
  function handleResize() {
    var width = window.innerWidth;
    if (activeTab == EnumPromotionTabKey.discountCode) {
      if (width > thresholdWidth3Item && dataDiscountCode?.length <= 3) {
        setIsRightEnd(true);
        setIsHiddenButton(true);
      } else if (width > thresholdWidth2Item && dataDiscountCode?.length <= 2) {
        setIsRightEnd(true);
        setIsHiddenButton(true);
      } else {
        setIsRightEnd(false);
        setIsHiddenButton(false);
      }
    } else if (activeTab == EnumPromotionTabKey.storeDiscount) {
      if (width > thresholdWidth3Item && dataStoreDiscountCode?.length <= 3) {
        setIsRightEnd(true);
        setIsHiddenButton(true);
      } else if (width > thresholdWidth2Item && dataStoreDiscountCode?.length <= 2) {
        setIsRightEnd(true);
        setIsHiddenButton(true);
      } else {
        setIsRightEnd(false);
        setIsHiddenButton(false);
      }
    }
  }
  const throttledHandleResize = throttle(handleResize, 200);
  window.addEventListener("resize", throttledHandleResize);

  return (
    <div
      id={theme2ElementRightId.PromotionSection}
      onClick={(event) => {
        if (event.target.tagName !== "svg" && clickToFocusCustomize)
          clickToFocusCustomize(theme2ElementCustomize.PromotionSection, null, ThemeKey);
      }}
      hidden={dataDiscountCode?.length <= 0 && dataStoreDiscountCode?.length <= 0}
      className="theme-promotion-section-theme2"
    >
      {(dataDiscountCode?.length > 0 || dataStoreDiscountCode?.length > 0) && (
        <StyledPromotionSection config={props.config} colorConfig={colorConfig} theme={props.theme}>
          <div className="promotion-section-background">
            <div className="promotion-section-components">
              <div className="discount-session-container">
                <div className="discount-session-home-page">
                  {isShowRedeem === true && (
                    <DiscountCodeToastMessageComponent isSuccess={isSuccess} message={messageRedeemDiscountCode} />
                  )}
                  {loadingSpinner ? (
                    <FnbLoadingSpinner />
                  ) : (
                    <Tabs
                      defaultActiveKey={EnumPromotionTabKey.discountCode}
                      style={{
                        marginBottom: 32,
                      }}
                      items={itemsTabs}
                      onChange={handleTabChange}
                      activeKey={activeTab}
                      tabBarExtraContent={
                        <Row gutter={8} className="extra-content">
                          <Col hidden={isHiddenButton}>
                            <Button
                              className={`button-extra`}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleScrollLeft();
                              }}
                              disabled={isLeftEnd}
                            >
                              <LeftOutlined className={"red-icon"} />
                            </Button>
                          </Col>
                          <Col hidden={isHiddenButton}>
                            <Button className={`button-extra`} onClick={handleScrollRight} disabled={isRightEnd}>
                              <RightOutlined className={"red-icon"} />
                            </Button>
                          </Col>
                        </Row>
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </StyledPromotionSection>
      )}
    </div>
  );
}
