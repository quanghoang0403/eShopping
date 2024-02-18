import { Col, Image, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import {
  FacebookSocialIcon,
  InstagramSocialIcon,
  TikTokSocialIcon,
  TwitterSocialIcon,
  YoutubeSocialIcon,
} from "../assets/icons.constants";
import businessLicenseImage from "../assets/images/business-license.png";

import { handleHyperlinkValue } from "../../utils/helpers";
import "./footer.component.scss";

import appOnAppStore from "../assets/images/app-on-app-store.png";
import appOnGooglePlay from "../assets/images/app-on-google-play.png";

export function ThemeOriginalFooter({ menuItem, configFooter, colorGeneral }) {
  const [t] = useTranslation();
  const storeInformation = configFooter?.storeInformation;
  const generalCustomization = configFooter?.generalCustomization;
  const downloadApp = configFooter?.downloadApp;
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [socialFooter, setSocialFooter] = useState([]);

  // format Route download App
  const currentURL = new URL(window.location.href)?.origin;
  const downloadAppLink = currentURL + "/download-app";

  const pageData = {
    headquarters: t("storeWebPage.footerThemeConfiguration.storeInformation.headquarters"),
    address: t("storeWebPage.footerThemeConfiguration.storeInformation.address"),
    phoneNumber: t("storeWebPage.footerThemeConfiguration.storeInformation.phoneNumber"),
    email: t("storeWebPage.footerThemeConfiguration.storeInformation.email"),
  };

  useEffect(() => {
    setSocialFooter(socialNetwork);
  }, [configFooter]);

  const socialNetwork = [
    {
      url: configFooter?.socialNetwork?.facebookURL ?? "https://www.facebook.com/Gosell.vn",
      icon: <FacebookSocialIcon />,
      visible: configFooter?.socialNetwork?.isFacebook,
    },
    {
      url: configFooter?.socialNetwork?.instagramURL ?? "https://www.instagram.com/Gosell.vn",
      icon: <InstagramSocialIcon />,
      visible: configFooter?.socialNetwork?.isInstagram,
    },
    {
      url: configFooter?.socialNetwork?.tiktokURL ?? "https://www.tiktok.com/Gosell.vn",
      icon: <TikTokSocialIcon />,
      visible: configFooter?.socialNetwork?.isTiktok,
    },
    {
      url: configFooter?.socialNetwork?.twitterURL ?? "https://www.twitter.com/Gosell.vn",
      icon: <TwitterSocialIcon />,
      visible: configFooter?.socialNetwork?.isTwitter,
    },
    {
      url: configFooter?.socialNetwork?.youtubeURL ?? "https://www.youtube.com/Gosell.vn",
      icon: <YoutubeSocialIcon />,
      visible: configFooter?.socialNetwork?.isYoutube,
    },
  ];

  const StyledSocialNetwork = styled.div`
    .social-footer {
      svg path {
        fill: ${colorGeneral?.textColor ?? "rgba(0, 0, 0, 0.85)"};
      }
    }
  `;
  const StyledCopyright = styled.div`
    .border-copyright {
      border-top: 1px solid ${colorGeneral?.textColor ?? "rgba(0, 0, 0, 0.85)"};
    }
    .copy-right-text {
      color: ${colorGeneral?.textColor ?? "rgba(0, 0, 0, 0.85)"};
    }
  `;
  return (
    <>
      <div
        style={{
          background:
            generalCustomization?.backgroundType === 1
              ? generalCustomization?.backgroundColor
              : "url(" +
                (generalCustomization?.backgroundImage ??
                  "/images/default-theme/theme1-background-default-footer.png") +
                ") no-repeat top",
        }}
        id="footer-original-theme"
      >
        <div className="main-session">
          <div className={`info-store ${!storeInformation?.visible && "d-none"}`}>
            <div className="store-name">
              {storeInformation?.headOffice ? (
                <p>
                  <span className="info-store-bold" style={{ color: colorGeneral?.titleColor }}>
                    {pageData.headquarters}:
                  </span>
                  <span style={{ color: colorGeneral?.textColor }}>{storeInformation?.headOffice}</span>
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="address" style={{ color: colorGeneral?.titleColor }}>
              {storeInformation?.address ? (
                <p>
                  <span className="info-store-bold" style={{ color: colorGeneral?.titleColor }}>
                    {pageData.address}:
                  </span>
                  <span style={{ color: colorGeneral?.textColor }}>{storeInformation?.address}</span>
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="phone">
              {storeInformation?.phoneNumber ? (
                <p>
                  <span className="info-store-bold" style={{ color: colorGeneral?.titleColor }}>
                    {pageData.phoneNumber}:
                  </span>
                  <span style={{ color: colorGeneral?.textColor }}>{storeInformation?.phoneNumber}</span>
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="email">
              {storeInformation?.email ? (
                <p>
                  <span className="info-store-bold" style={{ color: colorGeneral?.titleColor }}>
                    {pageData.email}:
                  </span>
                  <span style={{ color: colorGeneral?.textColor }}>{storeInformation?.email}</span>
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="group-mobile">
            <div
              style={{
                width: menuItem?.length > 11 ? "320px" : "unset",
                maxWidth: menuItem?.length > 11 ? "320px" : "unset",
              }}
              className={`store-contact ${!configFooter?.menu?.visible && "d-none"}`}
            >
              <div className="store-contact-title">
                <div className={`${configFooter?.menu?.menuTitle?.trim() === "" && "d-none"}`}>
                  <div style={{ color: colorGeneral?.titleColor }}>
                    {configFooter?.menu?.menuTitle ? configFooter?.menu?.menuTitle : "ABOUT US"}
                  </div>
                </div>
              </div>
              <div
                className="store-contact-flex"
                style={{
                  height: menuItem?.length > 6 ? "280px" : "unset",
                  flexWrap: menuItem?.length > 6 ? "wrap" : "unset",
                }}
              >
                {menuItem?.length > 11
                  ? (showAllMenu ? menuItem : menuItem?.slice(0, 12))?.map((item, index) => {
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
                                  style={{
                                    color: colorGeneral?.textColor,
                                    cursor: "pointer",
                                  }}
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
                                      fill={colorGeneral?.textColor}
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
                                <div
                                  style={{
                                    color: colorGeneral?.textColor,
                                    fontSize: menuItem?.length > 6 ? 14 : isMobile ? 15 : 18,
                                  }}
                                >
                                  {item?.name}
                                </div>
                              </a>
                            </div>
                          )}
                        </>
                      );
                    })
                  : menuItem?.map((item, index) => {
                      return (
                        <div className="body-text-2" key={index}>
                          <a href={handleHyperlinkValue(item?.hyperlinkOption, item?.url)} title={item?.name}>
                            <div
                              style={{
                                color: colorGeneral?.textColor,
                                fontSize: isMobile ? 15 : 18,
                              }}
                            >
                              {item?.name}
                            </div>
                          </a>
                        </div>
                      );
                    })}
              </div>
            </div>
            <div className="scale-col-3-footer">
              <div className="scale-col-3-footer-empty" style={{ flex: 2 }}>
                {downloadApp?.visible && (
                  <div>
                    {downloadApp?.qrCode && (
                      <Row>
                        <Tooltip title={downloadApp?.title} color={colorGeneral?.buttonBackgroundColor}>
                          <span style={{ color: colorGeneral?.textColor }} className="download-app-title" tooltip>
                            {downloadApp?.title}
                          </span>
                        </Tooltip>
                      </Row>
                    )}
                    <Row>
                      <Col span={12}>
                        {downloadApp?.qrCode && (
                          <div className="qr-code-custom">
                            <Image className="image-qr-code" preview={false} src={downloadApp?.qrCodeImage} />
                          </div>
                        )}
                      </Col>
                      <Col span={12}>
                        <Row>
                          {downloadApp?.appStore && (
                            <Image
                              preview={false}
                              onClick={() => {
                                window.open(downloadApp?.appStoreLink, "_blank");
                              }}
                              className="download-app-image"
                              src={appOnAppStore}
                            />
                          )}
                        </Row>
                        <Row>
                          {downloadApp?.googlePlay && (
                            <Image
                              preview={false}
                              onClick={() => {
                                window.open(downloadApp?.googlePlayLink, "_blank");
                              }}
                              className="download-app-image"
                              src={appOnGooglePlay}
                            />
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
              <div className="scale-col-3-footer-business" style={{ flex: 1 }}>
                <div
                  className={configFooter?.businessLicense?.visible ? "" : "d-none"}
                  style={{ marginBottom: "32px" }}
                >
                  <a
                    href={
                      configFooter?.businessLicense?.businessLicenseURL
                        ? configFooter?.businessLicense?.businessLicenseURL
                        : ""
                    }
                    target="blank"
                  >
                    <img alt="" src={businessLicenseImage} />
                  </a>
                </div>
              </div>
              <div className="scale-col-3-footer-social-network" style={{ flex: 1 }}>
                <StyledSocialNetwork>
                  <div className={`social-footer ${!configFooter?.socialNetwork?.visible && "d-none"}`}>
                    {socialFooter?.map((item, index) => {
                      return (
                        <span key={`social_footer_${index}`} className={`margin-icon ${item?.visible ? "" : "d-none"}`}>
                          <a href={item?.url} target="blank">
                            {item?.icon}
                          </a>
                        </span>
                      );
                    })}
                  </div>
                </StyledSocialNetwork>
              </div>
            </div>
          </div>
        </div>

        <StyledCopyright>
          <div className={!configFooter?.copyRight?.visible ? "d-none" : "footer-copyright"}>
            <div className="border-copyright">
              <div className={`copy-right-text ${configFooter?.copyRight?.copyRightText?.trim() === "" && "d-none"}`}>
                {configFooter?.copyRight?.copyRightText
                  ? configFooter?.copyRight?.copyRightText
                  : "Copyright © 2022 Tropical"}
              </div>
            </div>
          </div>
        </StyledCopyright>
      </div>
    </>
  );
}
