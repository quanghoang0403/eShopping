import { t } from "i18next";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { handleHyperlinkValue } from "../../../utils/helpers";
import "../../assets/css/home-page.style.scss";
import {
  FacebookSocialIcon,
  InstagramSocialIcon,
  LocationIcon,
  PhoneIcon,
  SMSIcon,
  ShopIcon,
  TikTokSocialIcon,
  TwitterSocialIcon,
  YoutubeSocialIcon,
} from "../../assets/icons.constants";
import businessLicenseImage from "../../assets/images/business-license.png";
import footerImage from "../../assets/images/footer.png";
import logoFooterImage from "../../assets/images/logo-footer.png";
import defaultConfig from "../../default-store.config";
import BackToTopComponent from "../back-to-top/back-to-top.component";
import ImageWithFallback from "../fnb-image-with-fallback/fnb-image-with-fallback.component";
import "./footer.component.scss";

export function ThemeOriginalFooter({ menuItem, menuItemPolicy, config, colorGeneral, isDefault }) {
  const configFooter = config?.footer;
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [socialFooter, setSocialFooter] = useState([]);
  const generalCustomization = configFooter?.generalCustomization;
  const storeInformation = configFooter?.storeInformation;
  const menuItems = menuItem;
  const socialNetwork = configFooter?.socialNetwork;
  const imageDownloadApp = defaultConfig?.general?.footer?.downloadApp;
  const downloadApp = configFooter?.downloadApp;
  const isMobile = useMediaQuery({ maxWidth: 576 });

  const social = [
    {
      url: socialNetwork?.facebookURL ?? "https://www.facebook.com/Gosell.vn",
      icon: <FacebookSocialIcon />,
      visible: socialNetwork?.isFacebook,
    },
    {
      url: socialNetwork?.instagramURL ?? "https://www.instagram.com/Gosell.vn",
      icon: <InstagramSocialIcon />,
      visible: socialNetwork?.isInstagram,
    },
    {
      url: socialNetwork?.tiktokURL ?? "https://www.tiktok.com/Gosell.vn",
      icon: <TikTokSocialIcon />,
      visible: socialNetwork?.isTiktok,
    },
    {
      url: socialNetwork?.twitterURL ?? "https://www.twitter.com/Gosell.vn",
      icon: <TwitterSocialIcon />,
      visible: socialNetwork?.isTwitter,
    },
    {
      url: socialNetwork?.youtubeURL ?? "https://www.youtube.com/Gosell.vn",
      icon: <YoutubeSocialIcon />,
      visible: socialNetwork?.isYoutube,
    },
  ];

  const pageData = {
    chainOfBranches: t("storeWebPage.footerThemeConfiguration.chainOfBranches", "Chain of {{number}} branches"),
  };

  useEffect(() => {
    setSocialFooter(social);
  }, [config]);

  const colorText = isDefault ? "rgb(243 239 239)" : colorGeneral?.textColor;
  const colorTitle = isDefault ? "rgb(243 239 239)" : colorGeneral?.titleColor;
  const StyledSocialNetwork = styled.div`
    svg path {
      fill: ${colorGeneral?.textColor ?? "rgba(0, 0, 0, 0.85)"};
    }
  `;

  return (
    <div className="footer-customize main-session">
      <div
        style={{
          background:
            generalCustomization?.backgroundType === 1
              ? generalCustomization?.backgroundColor
              : "url(" +
                (generalCustomization?.backgroundImage ? generalCustomization?.backgroundImage : footerImage) +
                ") no-repeat top",
        }}
        className="footer-bg"
      >
        <div
          className="footer-info page-container"
          style={!downloadApp?.visible ? { borderBottom: "1px solid #4d4d4d" } : undefined}
        >
          <div className="container-logo">
            <div className={`${configFooter?.logo?.visible ? "" : "d-none"}`}>
              <ImageWithFallback
                src={configFooter?.logo?.logoUrl}
                fallbackSrc={logoFooterImage}
                style={{ width: "209px", minHeight: "160px", objectFit: "contain", objectPosition: "top" }}
              />
            </div>
          </div>
          <div className={`store-info ${!storeInformation?.visible && "d-none"}`}>
            <div style={{ flex: 2 }}>
              <div className={`h3 ${storeInformation?.storeName?.trim() === "" && "d-none"}`}>
                <div style={{ color: colorTitle }}>
                  {storeInformation?.storeName ? storeInformation?.storeName : "CỬA HÀNG PHỞ VIỆT"}
                </div>
              </div>
            </div>
            <div className="store-info-flex">
              <StyledSocialNetwork>
                <div style={{ flex: 2 }}>
                  <div className={`location-icon ${storeInformation?.address?.trim() === "" && "d-none"}`}>
                    <div>
                      <LocationIcon />
                    </div>
                    <div className="body-text-2">
                      <div style={{ color: colorText }}>
                        {storeInformation?.address
                          ? storeInformation?.address
                          : "60A Trường Sơn, Phường 2, Quận Tân Bình, Hồ Chí Minh, Việt Nam"}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className={`phone-icon ${storeInformation?.hotline?.trim() === "" && "d-none"}`}>
                    <div>
                      <PhoneIcon />
                    </div>
                    <div className="body-text-2">
                      <div style={{ color: colorText, flex: 1 }}>
                        {storeInformation?.hotline ? storeInformation?.hotline : "098 938 74 83"}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className={`sms-icon ${storeInformation?.email?.trim() === "" && "d-none"}`}>
                    <div>
                      <SMSIcon />
                    </div>
                    <div className="body-text-2">
                      <div style={{ color: colorText }}>
                        {storeInformation?.email ? storeInformation?.email : "hello@phoplay.com"}
                      </div>
                    </div>
                  </div>
                </div>
                {storeInformation?.showAllBranch && (
                  <div className="shop-icon" style={{ flex: 1 }}>
                    <div>
                      <ShopIcon />
                    </div>
                    <div style={{ color: colorText }}>
                      <div className="body-text-2 text-blue">
                        {t(pageData.chainOfBranches, { number: configFooter?.storeInformation?.numberOfBranches ?? 0 })}
                      </div>
                    </div>
                  </div>
                )}
              </StyledSocialNetwork>
            </div>
          </div>
          <div
            style={{
              width: menuItems?.length > 11 ? "100%" : "unset",
              maxWidth: menuItem?.length > 11 ? "100%" : "unset",
            }}
            className={`store-contact ${configFooter?.menu?.visible ? "" : "d-none"}`}
          >
            <div className="store-contact-title">
              <div className={`h3 ${configFooter?.menu?.menuTitle?.trim() === "" && "d-none"}`}>
                <div style={{ color: colorTitle }}>
                  {configFooter?.menu?.menuTitle ? configFooter?.menu?.menuTitle : "ABOUT US"}
                </div>
              </div>
            </div>
            <div
              className="store-contact-flex"
              style={{
                height: menuItems?.length > 6 ? "180px" : "unset",
                flexWrap: menuItems?.length > 6 ? "wrap" : "unset",
              }}
            >
              {menuItems?.length > 11
                ? (showAllMenu ? menuItems : menuItems?.slice(0, 12))?.map((item, index) => {
                    return (
                      <>
                        {index === 11 && !showAllMenu ? (
                          <div
                            className="body-text-2"
                            style={{
                              width: "fit-content",
                            }}
                            key={index}
                          >
                            {!showAllMenu && (
                              <div
                                style={{ color: colorText, cursor: "pointer" }}
                                onClick={() => setShowAllMenu(!showAllMenu)}
                              >
                                <svg
                                  width="18"
                                  height="14"
                                  viewBox="0 0 18 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17.75 1.375C17.75 1.54076 17.6842 1.69973 17.5669 1.81694C17.4497 1.93415 17.2908 2 17.125 2H0.875C0.70924 2 0.550268 1.93415 0.433058 1.81694C0.315848 1.69973 0.25 1.54076 0.25 1.375C0.25 1.20924 0.315848 1.05027 0.433058 0.933058C0.550268 0.815848 0.70924 0.75 0.875 0.75H17.125C17.2908 0.75 17.4497 0.815848 17.5669 0.933058C17.6842 1.05027 17.75 1.20924 17.75 1.375ZM14.625 6.375H0.875C0.70924 6.375 0.550268 6.44085 0.433058 6.55806C0.315848 6.67527 0.25 6.83424 0.25 7C0.25 7.16576 0.315848 7.32473 0.433058 7.44194C0.550268 7.55915 0.70924 7.625 0.875 7.625H14.625C14.7908 7.625 14.9497 7.55915 15.0669 7.44194C15.1842 7.32473 15.25 7.16576 15.25 7C15.25 6.83424 15.1842 6.67527 15.0669 6.55806C14.9497 6.44085 14.7908 6.375 14.625 6.375ZM9 12H0.875C0.70924 12 0.550268 12.0658 0.433058 12.1831C0.315848 12.3003 0.25 12.4592 0.25 12.625C0.25 12.7908 0.315848 12.9497 0.433058 13.0669C0.550268 13.1842 0.70924 13.25 0.875 13.25H9C9.16576 13.25 9.32473 13.1842 9.44194 13.0669C9.55915 12.9497 9.625 12.7908 9.625 12.625C9.625 12.4592 9.55915 12.3003 9.44194 12.1831C9.32473 12.0658 9.16576 12 9 12Z"
                                    fill={colorText}
                                  />
                                </svg>
                                &nbsp;Tất cả
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="body-text-2"
                            style={{
                              width: "fit-content",
                            }}
                            key={index}
                          >
                            <a href={handleHyperlinkValue(item?.hyperlinkOption, item?.url)} title={item?.name}>
                              <div style={{ color: colorText }}>{item?.name}</div>
                            </a>
                          </div>
                        )}
                      </>
                    );
                  })
                : menuItems?.map((item, index) => {
                    return (
                      <div className="body-text-2" key={index}>
                        <a href={handleHyperlinkValue(item?.hyperlinkOption, item?.url)} title={item?.name}>
                          <div style={{ color: colorText }}>{item?.name}</div>
                        </a>
                      </div>
                    );
                  })}
            </div>
          </div>
          <div className="store-linked">
            <div style={{ flex: 2 }}>
              <div className={`store-linked-title ${!socialNetwork?.visible && "d-none"}`}>
                <div className={`h3 ${socialNetwork?.socialNetworkTitle?.trim() === "" && "d-none"}`}>
                  <div style={{ color: colorTitle }}>
                    {socialNetwork?.socialNetworkTitle ? socialNetwork?.socialNetworkTitle : "KẾT NỐI VỚI CHÚNG TÔI"}
                  </div>
                </div>
              </div>
              <StyledSocialNetwork>
                <div className={`store-linked-flex ${!socialNetwork?.visible && "d-none"}`}>
                  {socialFooter?.map((item, index) => {
                    return (
                      <span key={index} className={`margin-icon ${item?.visible ? "" : "d-none"}`}>
                        <a href={`${item?.url}`} target="blank">
                          {item?.icon}
                        </a>
                      </span>
                    );
                  })}
                </div>
              </StyledSocialNetwork>
            </div>
            <div style={{ flex: 3 }}>
              <div className={configFooter?.businessLicense?.visible ? "" : "d-none"} style={{ marginTop: "32px" }}>
                <a
                  href={
                    configFooter?.businessLicense?.businessLicenseURL
                      ? `${configFooter?.businessLicense?.businessLicenseURL}`
                      : ""
                  }
                  target="blank"
                >
                  <img alt="" src={businessLicenseImage} />
                </a>
              </div>
            </div>
          </div>
        </div>
        {downloadApp?.visible && (
          <div className="page-container page-download-app">
            <div className="download-app">
                          <div className={`${configFooter?.downloadApp?.visible ? "" : "d-none"} download-app-responsive-mobile`}>
                <div
                  className={`h3 download-app-title-mobile ${
                    configFooter?.downloadApp?.downloadAppTitle === "" && "d-none"
                  }`}
                >
                  <div style={{ color: colorTitle }}>
                    <span className="download-app-title">
                      {configFooter?.downloadApp?.downloadAppTitle
                        ? configFooter?.downloadApp?.downloadAppTitle
                        : "TẢI ỨNG DỤNG TRÊN THIẾT BỊ DI ĐỘNG"}
                    </span>
                  </div>
                </div>
                <div
                  className="download-app-icon"
                  style={{
                    justifyContent:
                      isMobile &&
                      (!downloadApp?.qrCode || downloadApp?.qrCodeImage == undefined) &&
                      (downloadApp?.appStore || downloadApp?.googlePlay)
                        ? "left"
                        : "center",
                  }}
                >
                  {downloadApp?.qrCode && (
                    <div flex={1}>
                      {downloadApp?.qrCodeImage && <img className="qr-code-custom" src={downloadApp?.qrCodeImage} />}
                    </div>
                  )}
                  {downloadApp?.qrCode &&
                    downloadApp?.qrCodeImage != undefined &&
                    (downloadApp?.appStore || downloadApp?.googlePlay) && (
                      <div
                        flex={1}
                        className="download-app-icon-on"
                        style={{
                          justifyContent: downloadApp?.appStore && downloadApp?.googlePlay ? "space-between" : "center",
                        }}
                      >
                        {downloadApp?.appStore && (
                          <div>
                            <img
                              className="download-app-icon-appStore"
                              src={imageDownloadApp?.appStoreImage}
                              onClick={() => {
                                window.open(downloadApp?.appStoreLink, "_blank");
                              }}
                            ></img>
                          </div>
                        )}
                        {downloadApp?.googlePlay && (
                          <div>
                            <img
                              className="download-app-icon-ggPlay"
                              src={imageDownloadApp?.googlePlayImage}
                              onClick={() => {
                                window.open(downloadApp?.googlePlayLink, "_blank");
                              }}
                            ></img>
                          </div>
                        )}
                      </div>
                    )}
                  {!isMobile &&
                    (!downloadApp?.qrCode || downloadApp?.qrCodeImage == undefined) &&
                    (downloadApp?.appStore || downloadApp?.googlePlay) && (
                      <div flex={1} className="download-app-icon-on" style={{ flexDirection: "row", padding: 24 }}>
                        {downloadApp?.appStore && (
                          <div
                            style={{ flexDirection: "column", marginRight: 12 }}
                            onClick={() => {
                              window.open(downloadApp?.appStoreLink, "_blank");
                            }}
                          >
                            <img
                              alt="download app iOS"
                              className="download-app-icon-appStore"
                              src={imageDownloadApp?.appStoreImage}
                            ></img>
                          </div>
                        )}
                        {downloadApp?.googlePlay && (
                          <div
                            style={{ flexDirection: "column" }}
                            onClick={() => {
                              window.open(downloadApp?.googlePlayLink, "_blank");
                            }}
                          >
                            <img
                              alt="download app google"
                              className="download-app-icon-ggPlay"
                              src={imageDownloadApp?.googlePlayImage}
                            ></img>
                          </div>
                        )}
                      </div>
                    )}
                  {isMobile &&
                    (!downloadApp?.qrCode || downloadApp?.qrCodeImage === undefined) &&
                    (downloadApp?.appStore || downloadApp?.googlePlay) && (
                      <div
                        flex={1}
                        className="download-app-icon-on"
                        style={{ justifyContent: "left", alignItems: "flex-start" }}
                      >
                        {downloadApp?.appStore && (
                          <div
                            style={{ marginBottom: 12 }}
                            onClick={() => {
                              window.open(downloadApp?.appStoreLink, "_blank");
                            }}
                          >
                            <img
                              alt="download app iOS"
                              className="download-app-icon-appStore"
                              src={imageDownloadApp?.appStoreImage}
                            ></img>
                          </div>
                        )}
                        {downloadApp?.googlePlay && (
                          <div
                            onClick={() => {
                              window.open(downloadApp?.googlePlayLink, "_blank");
                            }}
                          >
                            <img
                              alt="download app google"
                              className="download-app-icon-ggPlay"
                              src={imageDownloadApp?.googlePlayImage}
                            ></img>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="page-container">
          <div className={`policy-information ${configFooter?.policy?.visible ? "" : "d-none"}`}>
            {menuItemPolicy?.map((item, index) => {
              return (
                <div style={{ color: colorText }} key={index}>
                  {item?.name}
                </div>
              );
            })}
          </div>
          <div className={`copyright ${configFooter?.copyRight?.visible ? "" : "d-none"}`}>
            <div
              style={{ color: colorText }}
              className={configFooter?.copyRight?.copyRightText?.trim() === "" ? "d-none" : ""}
            >
              {configFooter?.copyRight?.copyRightText
                ? configFooter?.copyRight?.copyRightText
                : "Copyright © 2022 Pho Viet"}
            </div>
          </div>
          <BackToTopComponent />
        </div>
      </div>
    </div>
  );
}
