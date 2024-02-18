import { Checkbox, Col, Form, Input, InputNumber, Row, Tooltip, Typography, Image } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import {
  FacebookIcon,
  InstagramIcon,
  OnlineStoreFooterNoticeLogo,
  TiktokIcon,
  TwitterIcon,
  YoutubeIcon,
} from "constants/icons.constants";
import { images } from "constants/images.constants";
import { DefaultActiveKeyBlockCollapse } from "constants/store-web-key-collapse.constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { store } from "store";
import { isValidHttpUrl } from "utils/helpers";
import CustomizationGroup from "../customization-group-component/customization-group.page";
import SelectGeneralBackgroundComponent from "../select-general-background/select-general-background.component";
import "./footer-customization-theme-1.scss";
import appOnAppStore from "../../../../assets/images/app-on-app-store.png";
import appOnGooglePlay from "../../../../assets/images/app-on-google-play.png";
import FnbUploadBackgroundImageCustomizeComponent from "themes/theme-1-new/components/fnb-upload-background-image-customize/fnb-upload-background-image-customize";

export default function FooterTheme1Customization(props) {
  const {
    initialData,
    onChangeMenu,
    colorGroups,
    countBranch,
    setValueDefault,
    defaultConfigTheme,
    form,
    appStoreLink,
    googlePlayLink,
  } = props;
  const [t] = useTranslation();
  const [menuList, setMenuList] = useState([]);
  const [defaultMenuId, setDefaultMenuId] = useState(null);
  const footerState = initialData?.footer;
  const { Text } = Typography;
  const bestDisplay = "81 x 81px";
  const downloadAppDefault = initialData?.footer?.downloadApp;
  const [visibleQrCode, setIsVisibleQrCode] = useState(downloadAppDefault?.qrCode ?? false);
  const [visibleAppStore, setIsVisibleAppStore] = useState(downloadAppDefault?.appStore ?? false);
  const [visibleGooglePlay, setIsVisibleGooglePlay] = useState(downloadAppDefault?.googlePlay ?? false);

  const handelChangeCheckedAppStore = (value) => {
    setIsVisibleAppStore(value?.target?.checked);
    if (value?.target?.checked && form) {
      form.setFields([
        {
          name: ["general", "footer", "downloadApp", "appStoreLink"],
          value: appStoreLink,
        },
      ]);
    }
  };

  const handelChangeCheckedGooglePlay = (value) => {
    setIsVisibleGooglePlay(value?.target?.checked);
    if (value?.target?.checked && form) {
      form.setFields([
        {
          name: ["general", "footer", "downloadApp", "googlePlayLink"],
          value: googlePlayLink,
        },
      ]);
    }
  };

  const handelChangeCheckedQRCode = (value) => {
    setIsVisibleQrCode(value?.target?.checked);
  };
  //region SocialNetwork
  const groupSocialNetwork = initialData?.footer?.socialNetwork;
  const [socialFacebook, setSocialFacebook] = useState({
    url: groupSocialNetwork?.facebookURL,
    isActive: groupSocialNetwork?.isFacebook,
  });
  const [socialInstagram, setSocialInstagram] = useState({
    url: groupSocialNetwork?.instagramURL,
    isActive: groupSocialNetwork?.isInstagram,
  });
  const [socialTiktok, setSocialTiktok] = useState({
    url: groupSocialNetwork?.tiktokURL,
    isActive: groupSocialNetwork?.isTiktok,
  });
  const [socialTwitter, setSocialTwitter] = useState({
    url: groupSocialNetwork?.twitterURL,
    isActive: groupSocialNetwork?.isTwitter,
  });
  const [socialYoutube, setSocialYoutube] = useState({
    url: groupSocialNetwork?.youtubeURL,
    isActive: groupSocialNetwork?.isYoutube,
  });

  const SocialNames = {
    Facebook: "facebook",
    Instagram: "instagram",
    Tiktok: "tiktok",
    Twitter: "twitter",
    Youtube: "youtube",
  };

  const DefaultSocialLinks = [
    {
      name: SocialNames.Facebook,
      icon: <FacebookIcon />,
      defaultUrl: "https://www.facebook.com/Gosell.vn",
      nameIsActive: "isFacebook",
    },
    {
      name: SocialNames.Instagram,
      icon: <InstagramIcon />,
      defaultUrl: "https://www.instagram.com/Gosell.vn",
      nameIsActive: "isInstagram",
    },
    {
      name: SocialNames.Tiktok,
      icon: <TiktokIcon />,
      defaultUrl: "https://www.tiktok.com/Gosell.vn",
      nameIsActive: "isTiktok",
    },
    {
      name: SocialNames.Twitter,
      icon: <TwitterIcon />,
      defaultUrl: "https://www.twitter.com/Gosell.vn",
      nameIsActive: "isTwitter",
    },
    {
      name: SocialNames.Youtube,
      icon: <YoutubeIcon />,
      defaultUrl: "https://www.youtube.com/Gosell.vn",
      nameIsActive: "isYoutube",
    },
  ];
  //endregion

  const element = {
    generalCustomization: "generalCustomization",
    logo: "logo",
    storeInformation: "storeInformation",
    menu: "menu",
    downloadApp: "downloadApp",
    socialNetwork: "socialNetwork",
    businessLicense: "businessLicense",
    policy: "policy",
    copyRight: "copyRight",
    downloadApp: "downloadApp",
  };

  const pageData = {
    generalCustomization: t("storeWebPage.footerThemeConfiguration.generalCustomization"),
    footer: t("storeWebPage.footerThemeConfiguration.footer"),
    logo: t("storeWebPage.footerThemeConfiguration.logo"),
    policy: t("storeWebPage.footerThemeConfiguration.policy.title"),
    copyRight: t("storeWebPage.footerThemeConfiguration.copyRight.title"),
    title: t("storeWebPage.footerThemeConfiguration.title"),
    placeholderMenu: t("storeWebPage.footerThemeConfiguration.placeholderMenu", "ABOUT US"),
    placeholderSocialNetwork: t("storeWebPage.footerThemeConfiguration.placeholderSocialNetwork", "CONNECT US"),
    titleStoreInformation: t("storeWebPage.footerThemeConfiguration.storeInformation.titleStoreInformation"),
    storeName: t("storeWebPage.footerThemeConfiguration.storeInformation.storeName"),
    address: t("storeWebPage.footerThemeConfiguration.storeInformation.address"),
    hotline: t("storeWebPage.footerThemeConfiguration.storeInformation.hotline"),
    email: t("storeWebPage.footerThemeConfiguration.storeInformation.email"),
    branch: t("storeWebPage.footerThemeConfiguration.storeInformation.branch"),
    showAllBranch: t("storeWebPage.footerThemeConfiguration.storeInformation.showAllBranch"),
    placeholderAddress: t("storeWebPage.footerThemeConfiguration.storeInformation.placeholderAddress"),
    placeholderHotline: t("storeWebPage.footerThemeConfiguration.storeInformation.placeholderHotline"),
    placeholderEmail: t("storeWebPage.footerThemeConfiguration.storeInformation.placeholderEmail"),
    maximum255Characters: t("storeWebPage.footerThemeConfiguration.storeInformation.maximum255Characters"),
    headquarters: t("storeWebPage.footerThemeConfiguration.storeInformation.headquarters"),
    phoneNumber: t("storeWebPage.footerThemeConfiguration.storeInformation.phoneNumber"),
    menu: t("storeWebPage.footerThemeConfiguration.menu"),
    downloadApp: t("storeWebPage.footerThemeConfiguration.downloadApp.downloadAppText"),
    qrCodeToDownload: t("storeWebPage.footerThemeConfiguration.downloadApp.qrCodeToDownload"),
    qrCodeDescription: t("storeWebPage.footerThemeConfiguration.downloadApp.qrCodeDescription"),
    enterTitle: t("storeWebPage.footerThemeConfiguration.downloadApp.enterTitle"),
    uploadQR: t("storeWebPage.footerThemeConfiguration.downloadApp.uploadQR"),
    uploadQRDescription: t("storeWebPage.footerThemeConfiguration.downloadApp.uploadQRDescription"),
    appStore: t("storeWebPage.footerThemeConfiguration.downloadApp.appStore"),
    hyperlink: t("storeWebPage.footerThemeConfiguration.downloadApp.hyperlink"),
    hyperlinkAppStore: t("storeWebPage.footerThemeConfiguration.downloadApp.hyperlinkAppStore"),
    googlePlay: t("storeWebPage.footerThemeConfiguration.downloadApp.googlePlay"),
    hyperlinkGooglePlay: t("storeWebPage.footerThemeConfiguration.downloadApp.hyperlinkGooglePlay"),
    selectMenu: t("storeWebPage.footerThemeConfiguration.selectMenu"),
    titleSocialNetwork: t("storeWebPage.footerThemeConfiguration.socialNetwork.titleSocialNetwork"),
    pleaseEnterSocialNetwork: t("storeWebPage.footerThemeConfiguration.socialNetwork.pleaseEnterSocialNetwork"),
    invalidSocialNetworkLink: t("storeWebPage.footerThemeConfiguration.socialNetwork.invalidSocialNetworkLink"),
    titleBusinessLicense: t("storeWebPage.footerThemeConfiguration.businessLicense.titleBusinessLicense"),
    url: t("storeWebPage.footerThemeConfiguration.businessLicense.url"),
    enterURL: t("storeWebPage.footerThemeConfiguration.businessLicense.enterURL"),
    toolTipNoticeLogo: t("storeWebPage.footerThemeConfiguration.businessLicense.toolTipNoticeLogo"),
    border: {
      generalCustomization: "#sGeneralCustomization",
      logo: "#sLogo",
      storeInformation: "#sStoreInformation",
      menu: "#sMenu",
      socialNetwork: "#sSocialNetwork",
      businessLicense: "#sBusinessLicense",
      policy: "#sPolicy",
      copyRight: "#sCopyRight",
    },
    maxSizeUploadMb: 5,
    maxSizeUploadBackgroundImage: 20,
    defaultBestDisplay: "154 x 136 px",
  };

  useEffect(() => {
    const state = store.getState();
    const listMenu = state?.session?.themeConfigMenu;
    setMenuList(listMenu);
    const menuDefault = listMenu?.find((x) => x.isDefault === true);

    if (form) {
      form.setFields([
        {
          name: ["general", "footer", "downloadApp", "appStoreLink"],
          value: appStoreLink,
        },
        {
          name: ["general", "footer", "downloadApp", "googlePlayLink"],
          value: googlePlayLink,
        },
      ]);
    }

    if (!footerState?.menu?.menuId && menuDefault) {
      form.setFields([
        {
          name: ["general", "footer", "menu", "menuId"],
          value: menuDefault?.id,
        },
      ]);
    }
  }, [initialData]);

  const renderIconEye = (group) => {
    return (
      <Form.Item name={["general", "footer", `${group}`, "visible"]} valuePropName="checked">
        <Checkbox className="visible-component" />
      </Form.Item>
    );
  };

  const onChangeSocial = (name, key, value) => {
    switch (name) {
      case SocialNames.Facebook:
        setSocialFacebook((prev) => ({ ...prev, [key]: value }));
        break;
      case SocialNames.Instagram:
        setSocialInstagram((prev) => ({ ...prev, [key]: value }));
        break;
      case SocialNames.Tiktok:
        setSocialTiktok((prev) => ({ ...prev, [key]: value }));
        break;
      case SocialNames.Twitter:
        setSocialTwitter((prev) => ({ ...prev, [key]: value }));
        break;
      case SocialNames.Youtube:
        setSocialYoutube((prev) => ({ ...prev, [key]: value }));
        break;
      default:
        break;
    }
  };

  const getSocialNetworkByName = (name) => {
    switch (name) {
      case SocialNames.Facebook:
        return socialFacebook;
      case SocialNames.Instagram:
        return socialInstagram;
      case SocialNames.Tiktok:
        return socialTiktok;
      case SocialNames.Twitter:
        return socialTwitter;
      case SocialNames.Youtube:
        return socialYoutube;
      default:
        break;
    }
  };

  //#region render component
  const renderGeneralCustomization = () => {
    return (
      <Row id={`_${pageData.border.generalCustomization}`} className="mt-2">
        <Col span={24} className="size-general">
          <SelectGeneralBackgroundComponent
            isRequired={false}
            {...props}
            formItemPreName={["general", "footer", "generalCustomization"]}
            bestDisplay={pageData.bestDisplay}
            backgroundCustomize={initialData?.footer?.generalCustomization}
            colorGroups={colorGroups}
            setValueDefault={setValueDefault}
            defaultImage={defaultConfigTheme?.general?.footer?.generalCustomization?.backgroundImage}
          />
        </Col>
      </Row>
    );
  };

  const renderStoreInformation = () => {
    return (
      <Row id={`_${pageData.border.storeInformation}`} className="mt-2">
        <Col span={24}>
          <div>
            <h4 className="fnb-form-label">{pageData.headquarters}</h4>
            <Form.Item
              name={["general", "footer", "storeInformation", "headOffice"]}
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <FnbInput className="fnb-input-with-count" maxLength={100} showCount />
            </Form.Item>
          </div>
          <div className="mt-16">
            <h4 className="fnb-form-label">{pageData.address}</h4>
            <Form.Item name={["general", "footer", "storeInformation", "address"]}>
              <TextArea
                showCount
                className="fnb-text-area-with-count no-resize store-information-address-box "
                placeholder={pageData.placeholderAddress}
                maxLength={255}
              />
            </Form.Item>
          </div>
          <div className="mt-16">
            <h4 className="fnb-form-label">{pageData.phoneNumber}</h4>
            <Form.Item
              name={["general", "footer", "storeInformation", "phoneNumber"]}
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <FnbInput
                className="fnb-input-with-count"
                showCount
                maxLength={100}
                placeholder={pageData.placeholderHotline}
              />
            </Form.Item>
          </div>
          <div className="mt-16">
            <h4 className="fnb-form-label">{pageData.email}</h4>
            <Form.Item
              name={["general", "footer", "storeInformation", "email"]}
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <FnbInput className="fnb-input" size="large" placeholder={pageData.placeholderEmail} maxLength={100} />
            </Form.Item>
          </div>
          <div className="mt-16" style={{ display: "none" }}>
            <Form.Item name={["general", "footer", "storeInformation", "numberOfBranches"]}>
              <InputNumber value={countBranch} />
            </Form.Item>
          </div>
        </Col>
      </Row>
    );
  };

  const renderMenu = () => {
    return (
      <Row id={`_${pageData.border.menu}`} className="mt-2">
        <Col span={24}>
          <div>
            <h4 className="fnb-form-label">{pageData.title}</h4>
            <Form.Item
              name={["general", "footer", "menu", "menuTitle"]}
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <FnbInput
                className="fnb-input-with-count"
                maxLength={100}
                showCount
                placeholder={pageData.placeholderMenu}
              />
            </Form.Item>
          </div>
          <div className="mt-16">
            <h4 className="fnb-form-label">{pageData.selectMenu}</h4>
            <Form.Item initialValue={defaultMenuId} name={["general", "footer", "menu", "menuId"]}>
              <FnbSelectSingle
                defaultValue={defaultMenuId}
                size="large"
                showSearch
                autoComplete="none"
                option={menuList?.map((item, index) => ({
                  id: item.id,
                  name: item.name,
                }))}
                onChange={(value) => onChangeMenu(value)}
                allowClear
              />
            </Form.Item>
          </div>
          <div className="mt-16" style={{ display: "none" }}>
            <h4 className="fnb-form-label">{pageData.selectMenu}</h4>
            <Form.List name={["general", "footer", "menu", "menuItems"]}>
              {(fields) => (
                <>
                  {fields.map((field) => (
                    <div key={field.key}>
                      <Form.Item name={[field.name, "menuId"]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "url"]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "name"]}>
                        <Input />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </div>
        </Col>
      </Row>
    );
  };

  const renderDownloadApp = () => {
    return (
      <Row id={`_${pageData.border.menu}`} className="mt-2">
        <Col span={24}>
          <div>
            <h4 className="fnb-form-label">{pageData.title}</h4>
            <Form.Item
              name={["general", "footer", "downloadApp", "title"]}
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <FnbInput className="fnb-input-with-count" maxLength={100} showCount placeholder={pageData.enterTitle} />
            </Form.Item>
            <Form.Item name={["general", "footer", "downloadApp", "qrCode"]} valuePropName="checked">
              <Checkbox
                onChange={(value) => {
                  handelChangeCheckedQRCode(value);
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {pageData.qrCodeToDownload}
                </span>
                <span className="qr-code-description">{pageData.qrCodeDescription}</span>
              </Checkbox>
            </Form.Item>
            <div hidden={!visibleQrCode}>
              <h4 className="fnb-form-label">{pageData.uploadQR}</h4>
              <Col span={24}>
                <Form.Item name={["general", "footer", "downloadApp", "qrCodeImage"]}>
                  <FnbUploadBackgroundImageCustomizeComponent
                    bestDisplay={bestDisplay}
                    maxSizeUploadMb={pageData.maxSizeUploadMb}
                    imgFallbackDefault={""}
                    defaultImage={""}
                    isRequired={visibleQrCode}
                    nameComponents="SelectQRCodeImage"
                  />
                </Form.Item>
              </Col>
            </div>

            <Form.Item name={["general", "footer", "downloadApp", "appStore"]} valuePropName="checked">
              <Checkbox
                onChange={(value) => {
                  handelChangeCheckedAppStore(value);
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {pageData.appStore}
                </span>
              </Checkbox>
            </Form.Item>

            {visibleAppStore && (
              <div>
                <Image preview={false} className="download-app-image" src={appOnAppStore} />
                <Form.Item
                  name={["general", "footer", "downloadApp", "appStoreLink"]}
                  initialValue={appStoreLink}
                  rules={[
                    {
                      type: "string",
                      max: 2048,
                    },
                  ]}
                ></Form.Item>
              </div>
            )}
            <Form.Item name={["general", "footer", "downloadApp", "googlePlay"]} valuePropName="checked">
              <Checkbox
                onChange={(value) => {
                  handelChangeCheckedGooglePlay(value);
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {pageData.googlePlay}
                </span>
              </Checkbox>
            </Form.Item>
            {visibleGooglePlay && (
              <div>
                <Image preview={false} className="download-app-image" src={appOnGooglePlay} />
                <Form.Item
                  name={["general", "footer", "downloadApp", "googlePlayLink"]}
                  rules={[
                    {
                      type: "string",
                      max: 2048,
                    },
                  ]}
                  initialValue={googlePlayLink}
                ></Form.Item>
              </div>
            )}
          </div>
        </Col>
      </Row>
    );
  };

  const renderSocialNetWork = () => {
    return (
      <Row id={`_${pageData.border.socialNetwork}`} className="social-network-row">
        <Col span={24}>
          <h4 className="fnb-form-label mb-37">{pageData.title}</h4>
          <Form.Item
            name={["general", "footer", "socialNetwork", "socialNetworkTitle"]}
            rules={[
              {
                type: "string",
                max: 100,
              },
            ]}
          >
            <FnbInput
              className="fnb-input-with-count"
              maxLength={100}
              showCount
              placeholder={pageData.placeholderSocialNetwork}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          {DefaultSocialLinks?.map((social, index) => {
            const mappedSocialNetwork = getSocialNetworkByName(social.name);
            return (
              <Row>
                <div className="social___link" key={index}>
                  {/* Social Icon */}
                  <div className="link__icon">{social.icon}</div>

                  {/* Input URL */}
                  <Form.Item
                    name={["general", "footer", "socialNetwork", social.name + "URL"]}
                    rules={[
                      {
                        required: mappedSocialNetwork.isActive,
                        message: pageData.pleaseEnterSocialNetwork,
                      },
                    ]}
                    className="flex-1"
                  >
                    <FnbInput
                      placeholder={social.defaultUrl}
                      className={`social__link__textInput ${!mappedSocialNetwork.isActive && "border-error"}`}
                      maxLength={2000}
                      onChange={(value) => onChangeSocial(social.name, "url", value.target.value)}
                    />
                  </Form.Item>

                  {/* Checkbox */}
                  <Form.Item
                    name={["general", "footer", "socialNetwork", social.nameIsActive]}
                    className="flex-0"
                    valuePropName="checked"
                  >
                    <Checkbox
                      defaultChecked={social.isActive}
                      checked={mappedSocialNetwork.isActive}
                      onChange={(value) => onChangeSocial(social.name, "isActive", value.target.checked)}
                    ></Checkbox>
                  </Form.Item>
                </div>
                <div>
                  {mappedSocialNetwork.url === ""
                    ? mappedSocialNetwork.isActive && (
                        <Text className="errorMessage">{pageData.pleaseEnterSocialNetwork}</Text>
                      )
                    : !isValidHttpUrl(mappedSocialNetwork.url) && (
                        <Text className="errorMessage">{pageData.invalidSocialNetworkLink}</Text>
                      )}
                </div>
              </Row>
            );
          })}
        </Col>
      </Row>
    );
  };

  const renderBusinessLicense = () => {
    return (
      <Row id={`_${pageData.border.businessLicense}`} className="mt-2">
        <Col span={24}>
          <div className="d-flex">
            <h4 className="fnb-form-label margin-left-notice">{pageData.url}</h4>
            <Tooltip placement="topLeft" title={pageData.toolTipNoticeLogo}>
              <span>{<OnlineStoreFooterNoticeLogo width={20} height={20} />}</span>
            </Tooltip>
          </div>
          <Row className="justify-content-center mb-16">
            <Col span={24} className="center">
              <img src={images.onlineStoreBusinessLicense} alt={pageData.titleBusinessLicense}></img>
            </Col>
          </Row>
          <Form.Item
            name={["general", "footer", "businessLicense", "businessLicenseURL"]}
            rules={[
              {
                type: "string",
                max: 2000,
              },
            ]}
          >
            <FnbInput className="fnb-input-with-count" maxLength={2000} showCount placeholder={pageData.enterURL} />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const renderCopyright = () => {
    return (
      <Row id={`_${pageData.border.copyRight}`} className="mt-2">
        <Col span={24}>
          <h4 className="fnb-form-label">{pageData.copyRight}</h4>
          <Form.Item
            name={["general", "footer", "copyRight", "copyRightText"]}
            rules={[
              {
                type: "string",
                max: 255,
              },
            ]}
          >
            <FnbInput className="fnb-input-with-count" maxLength={255} showCount />
          </Form.Item>
        </Col>
      </Row>
    );
  };
  // #endregion

  const groupCollapseFooter = [
    {
      title: pageData.generalCustomization,
      content: renderGeneralCustomization(),
      className: pageData.border.generalCustomization,
      isShowKey: true,
      icon: "",
      visible: true,
    },
    {
      title: pageData.titleStoreInformation,
      content: renderStoreInformation(),
      className: pageData.border.storeInformation,
      isShowKey: false,
      icon: renderIconEye(element.storeInformation),
      isShowRightIconWhenHoverMouse: true,
      key: element.storeInformation,
      visible: footerState?.storeInformation?.visible,
    },
    {
      title: pageData.menu,
      content: renderMenu(),
      className: pageData.border.menu,
      isShowKey: false,
      icon: renderIconEye(element.menu),
      isShowRightIconWhenHoverMouse: true,
      key: element.menu,
      visible: footerState?.menu?.visible,
    },
    {
      title: pageData.downloadApp,
      content: renderDownloadApp(),
      className: pageData.border.downloadApp,
      isShowKey: false,
      icon: renderIconEye(element.downloadApp),
      isShowRightIconWhenHoverMouse: true,
      key: element.downloadApp,
      visible: footerState?.downloadApp?.visible,
    },
    {
      title: pageData.titleSocialNetwork,
      content: renderSocialNetWork(),
      className: pageData.border.socialNetwork,
      isShowKey: false,
      icon: renderIconEye(element.socialNetwork),
      isShowRightIconWhenHoverMouse: true,
      key: element.socialNetwork,
      visible: footerState?.socialNetwork?.visible,
    },
    {
      title: pageData.titleBusinessLicense,
      content: renderBusinessLicense(),
      className: pageData.border.businessLicense,
      isShowKey: false,
      icon: renderIconEye(element.businessLicense),
      isShowRightIconWhenHoverMouse: true,
      key: element.businessLicense,
      visible: footerState?.businessLicense?.visible,
    },
    {
      title: pageData.copyRight,
      content: renderCopyright(),
      className: pageData.border.copyRight,
      isShowKey: false,
      icon: renderIconEye(element.copyRight),
      isShowRightIconWhenHoverMouse: true,
      key: element.copyRight,
      visible: footerState?.copyRight?.visible,
    },
  ];

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col sm={24} lg={24} className="w-100 customize-footer">
          {groupCollapseFooter?.map((group, index) => {
            return (
              <CustomizationGroup
                key={index}
                title={group.title}
                isNormal={true}
                defaultActiveKey={DefaultActiveKeyBlockCollapse.Footer + "." + ++index}
                content={group.content}
                icon={group.icon}
                isShowKey={group.isShowKey}
                isShowRightIconWhenHoverMouse={group.isShowRightIconWhenHoverMouse}
                visible={group.visible}
                className={group.className}
              />
            );
          })}
        </Col>
      </Row>
    </div>
  );
}
