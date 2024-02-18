import { Checkbox, Col, Form, Input, InputNumber, Row, Tooltip, Typography } from "antd";
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
import FnbUploadBackgroundImageCustomizeComponent from "themes/theme-1-new/components/fnb-upload-background-image-customize/fnb-upload-background-image-customize";
import { isValidHttpUrl } from "utils/helpers";
import footerBgDefault from "../../../../themes/theme-2-new/assets/images/footer.png";
import logoDefault from "../../../../themes/theme-2-new/assets/images/logo-footer.png";
import CustomizationGroup from "../customization-group-component/customization-group.page";
import SelectGeneralBackgroundComponent from "../select-general-background/select-general-background.component";
import "./footer-customization.page.scss";
import defaultConfig from "../../../../themes/theme-2-new/default-store.config";

const { Text } = Typography;
export default function FooterTheme2Customization(props) {
  const {
    initialData,
    onChangeMenu,
    colorGroups,
    setValueDefault,
    defaultConfigTheme,
    form,
    appStoreLink,
    googlePlayLink,
  } = props;
  const [t] = useTranslation();
  const { Text } = Typography;
  const [menuList, setMenuList] = useState([]);
  const footerState = initialData?.footer;

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
    placeholderStoreName: t(
      "storeWebPage.footerThemeConfiguration.storeInformation.placeholderStoreName",
      "CỬA HÀNG PHỞ VIỆT"
    ),
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
    menu: t("storeWebPage.footerThemeConfiguration.menu"),
    selectMenu: t("storeWebPage.footerThemeConfiguration.selectMenu"),
    titleSocialNetwork: t("storeWebPage.footerThemeConfiguration.socialNetwork.titleSocialNetwork"),
    pleaseEnterSocialNetwork: t("storeWebPage.footerThemeConfiguration.socialNetwork.pleaseEnterSocialNetwork"),
    invalidSocialNetworkLink: t("storeWebPage.footerThemeConfiguration.socialNetwork.invalidSocialNetworkLink"),
    titleBusinessLicense: t("storeWebPage.footerThemeConfiguration.businessLicense.titleBusinessLicense"),
    url: t("storeWebPage.footerThemeConfiguration.businessLicense.url"),
    enterURL: t("storeWebPage.footerThemeConfiguration.businessLicense.enterURL"),
    toolTipNoticeLogo: t("storeWebPage.footerThemeConfiguration.businessLicense.toolTipNoticeLogo"),
    placeholderPolicy: t("storeWebPage.footerThemeConfiguration.policy.placeholder"),
    placeholderCopyright: t("storeWebPage.footerThemeConfiguration.copyRight.placeholder"),
    border: {
      generalCustomization: "#sGeneralCustomization",
      logo: "#sLogo",
      storeInformation: "#sStoreInformation",
      menu: "#sMenu",
      socialNetwork: "#sSocialNetwork",
      businessLicense: "#sBusinessLicense",
      policy: "#sPolicy",
      copyRight: "#sCopyRight",
      downloadApp: "#sDownloadApp",
    },
    maxSizeUploadMb: 5,
    maxSizeUploadBackgroundImage: 20,
    defaultBestDisplay: "154 x 136 px",
    defaultBestDisplayDownloadApp: "137 x 137px",
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
  };

  const downloadAppDefault = initialData?.footer?.downloadApp;
  const [visibleQrCode, setIsVisibleQrCode] = useState(downloadAppDefault?.qrCode ?? false);
  const [visibleAppStore, setIsVisibleAppStore] = useState(downloadAppDefault?.appStore ?? false);
  const [visibleGooglePlay, setIsVisibleGooglePlay] = useState(downloadAppDefault?.googlePlay ?? false);
  const imageDownloadApp = defaultConfig?.general?.footer?.downloadApp;

  const handelChangeCheckedQrCode = (value) => {
    setIsVisibleQrCode(value?.target?.checked);
  };

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

  useEffect(() => {
    const state = store.getState();
    const listMenu = state?.session?.themeConfigMenu;
    setMenuList(listMenu);
    const menuDefault = listMenu?.find((x) => x.isDefault === true);
    if (!footerState?.menu?.menuId && menuDefault) {
      form.setFields([
        {
          name: ["general", "footer", "menu", "menuId"],
          value: menuDefault?.id,
        },
      ]);
    }
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
    if(!footerState?.downloadApp || footerState?.downloadApp?.visible == undefined){
      form.setFields([
        {
          name: ["general", "footer", "downloadApp", "visible"],
          value: true,
        },
      ]);
    }
  }, [initialData]);

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

  const renderIconEye = (group) => {
    return (
      <Form.Item name={["general", "footer", `${group}`, "visible"]} valuePropName="checked">
        <Checkbox className="visible-component" />
      </Form.Item>
    );
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

  const onChangeImage = (name, url, defaultImage) => {
    if (!url && defaultImage && setValueDefault) {
      setValueDefault(name, defaultImage, true);
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
            imgFallbackDefault={footerBgDefault}
          />
        </Col>
      </Row>
    );
  };

  const renderLogo = () => {
    return (
      <Row id={`_${pageData.border.logo}`} className="mt-2">
        <Col span={24}>
          <Form.Item name={["general", "footer", "logo", "logoUrl"]}>
            <FnbUploadBackgroundImageCustomizeComponent
              bestDisplay={pageData.defaultBestDisplay}
              maxSizeUploadMb={pageData.maxSizeUploadMb}
              onChange={(url) =>
                onChangeImage(
                  ["general", "footer", "logo", "logoUrl"],
                  url,
                  defaultConfigTheme?.general?.footer?.logo?.logoUrl
                )
              }
              imgFallbackDefault={logoDefault}
            />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const renderStoreInformation = () => {
    return (
      <Row id={`_${pageData.border.storeInformation}`} className="mt-2">
        <Col span={24}>
          <div>
            <h4 className="fnb-form-label">{pageData.storeName}</h4>
            <Form.Item
              name={["general", "footer", "storeInformation", "storeName"]}
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
                placeholder={pageData.placeholderStoreName}
              />
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
            <h4 className="fnb-form-label">{pageData.hotline}</h4>
            <Form.Item
              name={["general", "footer", "storeInformation", "hotline"]}
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
          <div className="mt-16">
            <h4 className="fnb-form-label">{pageData.branch}</h4>
            <Form.Item name={["general", "footer", "storeInformation", "showAllBranch"]} valuePropName="checked">
              <Checkbox>{pageData.showAllBranch}</Checkbox>
            </Form.Item>
          </div>
          <div className="mt-16" style={{ display: "none" }}>
            <Form.Item name={["general", "footer", "storeInformation", "numberOfBranches"]}>
              <InputNumber />
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
            <Form.Item name={["general", "footer", "menu", "menuId"]}>
              <FnbSelectSingle
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
      <Row id={`_${pageData.border.downloadApp}`} className="mt-2">
        <Col span={24}>
          <div>
            <h4 className="fnb-form-label">{pageData.title}</h4>
            <Form.Item
              name={["general", "footer", "downloadApp", "downloadAppTitle"]}
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <FnbInput className="fnb-input-with-count" maxLength={100} showCount placeholder={pageData.enterTitle} />
            </Form.Item>
            <Form.Item
              name={["general", "footer", "downloadApp", "qrCode"]}
              valuePropName="checked"
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <Checkbox onChange={(value) => handelChangeCheckedQrCode(value)}>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {pageData.qrCodeToDownload}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    whiteSpace: "pre-line",
                    fontSize: "16px",
                    color: "#B1B1B1",
                  }}
                >
                  {pageData.qrCodeDescription}
                </span>
              </Checkbox>
            </Form.Item>
            <div hidden={!visibleQrCode} id="qrCodeImageScroll">
              <h4 className="fnb-form-label">{pageData.uploadQR}</h4>
              <Form.Item name={["general", "footer", "downloadApp", "qrCodeImage"]}>
                <FnbUploadBackgroundImageCustomizeComponent
                  bestDisplay={pageData.defaultBestDisplayDownloadApp}
                  maxSizeUploadMb={pageData.maxSizeUploadMb}
                  isRequired={visibleQrCode}
                />
              </Form.Item>
            </div>

            <Form.Item
              name={["general", "footer", "downloadApp", "appStore"]}
              valuePropName="checked"
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <Checkbox onChange={(value) => handelChangeCheckedAppStore(value)}>
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
                <img style={{ marginBottom: 12 }} width={200} height={62} src={imageDownloadApp?.appStoreImage}></img>
                <Form.Item
                  name={["general", "footer", "downloadApp", "appStoreLink"]}
                  style={{ display: "none" }}
                  rules={[
                    {
                      type: "string",
                      max: 100,
                    },
                  ]}
                ></Form.Item>
              </div>
            )}

            <Form.Item
              name={["general", "footer", "downloadApp", "googlePlay"]}
              valuePropName="checked"
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <Checkbox onChange={(value) => handelChangeCheckedGooglePlay(value)}>
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
                <img style={{ marginBottom: 12 }} width={200} height={62} src={imageDownloadApp?.googlePlayImage}></img>
                <Form.Item
                  name={["general", "footer", "downloadApp", "googlePlayLink"]}
                  style={{ display: "none" }}
                  rules={[
                    {
                      type: "string",
                      max: 100,
                    },
                  ]}
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
      <Row id={`_${pageData.border.socialNetwork}`} className="social-network-row mb-16">
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
                <div className="social__link" key={index}>
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
                      className="social__link__textInput"
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

  const renderPolicy = () => {
    return (
      <Row id={`_${pageData.border.policy}`} className="mt-2">
        <Col span={24}>
          <div>
            <h4 className="fnb-form-label">{pageData.selectMenu}</h4>
            <Form.Item name={["general", "footer", "policy", "menuId"]}>
              <FnbSelectSingle
                size="large"
                showSearch
                autoComplete="none"
                option={menuList?.map((item, index) => ({
                  id: item.id,
                  name: item.name,
                }))}
                onChange={(value) => onChangeMenu(value, true)}
                allowClear
                placeholder={pageData.placeholderPolicy}
              />
            </Form.Item>
          </div>
          <div className="mt-16" style={{ display: "none" }}>
            <h4 className="fnb-form-label">{pageData.selectMenu}</h4>
            <Form.List name={["general", "footer", "policy", "menuItems"]}>
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
            <FnbInput
              className="fnb-input-with-count"
              maxLength={255}
              showCount
              placeholder={pageData.placeholderCopyright}
            />
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
    },
    {
      title: pageData.logo,
      content: renderLogo(),
      className: pageData.border.logo,
      isShowKey: false,
      icon: renderIconEye(element.logo),
      isShowRightIconWhenHoverMouse: true,
      visible: footerState?.logo?.visible,
    },
    {
      title: pageData.titleStoreInformation,
      content: renderStoreInformation(),
      className: pageData.border.storeInformation,
      isShowKey: false,
      icon: renderIconEye(element.storeInformation),
      isShowRightIconWhenHoverMouse: true,
      visible: footerState?.storeInformation?.visible,
    },
    {
      title: pageData.menu,
      content: renderMenu(),
      className: pageData.border.menu,
      isShowKey: false,
      icon: renderIconEye(element.menu),
      isShowRightIconWhenHoverMouse: true,
      visible: footerState?.menu?.visible,
    },
    {
      title: pageData.downloadApp,
      content: renderDownloadApp(),
      className: pageData.border.downloadApp,
      isShowKey: false,
      icon: renderIconEye(element.downloadApp),
      isShowRightIconWhenHoverMouse: true,
      visible: footerState?.downloadApp?.visible,
    },
    {
      title: pageData.titleSocialNetwork,
      content: renderSocialNetWork(),
      className: pageData.border.socialNetwork,
      isShowKey: false,
      icon: renderIconEye(element.socialNetwork),
      isShowRightIconWhenHoverMouse: true,
      visible: footerState?.socialNetwork?.visible,
    },
    {
      title: pageData.titleBusinessLicense,
      content: renderBusinessLicense(),
      className: pageData.border.businessLicense,
      isShowKey: false,
      icon: renderIconEye(element.businessLicense),
      isShowRightIconWhenHoverMouse: true,
      visible: footerState?.businessLicense?.visible,
    },
    {
      title: pageData.policy,
      content: renderPolicy(),
      className: pageData.border.policy,
      isShowKey: false,
      icon: renderIconEye(element.policy),
      isShowRightIconWhenHoverMouse: true,
      visible: footerState?.policy?.visible,
    },
    {
      title: pageData.copyRight,
      content: renderCopyright(),
      className: pageData.border.copyRight,
      isShowKey: false,
      icon: renderIconEye(element.copyRight),
      isShowRightIconWhenHoverMouse: true,
      visible: footerState?.copyRight?.visible,
    },
  ];

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col sm={24} lg={24} className="w-100 customize-theme-footer">
          {groupCollapseFooter?.map((group, index) => {
            return (
              <CustomizationGroup
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
