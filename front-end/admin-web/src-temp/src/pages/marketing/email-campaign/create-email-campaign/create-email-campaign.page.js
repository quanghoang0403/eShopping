 import {Editor} from "@tinymce/tinymce-react";
import {Checkbox, Col, Collapse, Form, Input, message, Row, Select, Tabs} from "antd";
import TextArea from "antd/lib/input/TextArea";
import {CancelButton} from "components/cancel-button";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import {FnbAddNewButton} from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import {FnbColorPicker} from "components/fnb-color-picker/fnb-color-picker.component";
import FnbDateTimePickerComponent from "components/fnb-datetime-picker";
import {FnbImageSelectComponent} from "components/fnb-image-select/fnb-image-select.component";
import {FnbInput} from "components/fnb-input/fnb-input.component";
import {FnbModal} from "components/fnb-modal/fnb-modal-component";
import {FnbPageHeader} from "components/fnb-page-header/fnb-page-header";
import {FnbSelectSingle} from "components/fnb-select-single/fnb-select-single";
import {TINY_MCE_API_KEY} from "constants/application.constants";
import {COLOR, DELAYED_TIME} from "constants/default.constants";
import {
  EmailCampaignSocial,
  EmailCampaignType,
  LimitNumberOfEmailCampaign,
  sessions,
} from "constants/email-campaign.constants";
import {
  ArrowDown,
  CheckboxCheckedIcon,
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  TwitterIcon,
  YoutubeIcon,
} from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { emailPattern } from "constants/string.constants";
import customerSegmentDataService from "data-services/customer-segment/customer-segment-data.service";
import emailCampaignDataService from "data-services/email-campaign/email-campaign-data.service";
import {emailCampaignDefaultTemplate} from "email-campaign-templates/email-campaign-default.template";
import {env} from "env";
import moment from "moment";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {getElement} from "utils/email-campaign.helpers";
import {isValidHttpUrl, momentFormatDateTime} from "utils/helpers";
import ContentEmailCampaign from "../components/content-email-campaign.component";
import {EmailCampaignTemplate} from "../components/email-campaign-template.component";
import "./create-email-campaign.page.scss";
import FnbFroalaEditor from "components/fnb-froala-editor";

const {TabPane} = Tabs;

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
    icon: <FacebookIcon/>,
    defaultUrl: "https://www.facebook.com/Gosell.vn",
  },
  {
    name: SocialNames.Instagram,
    icon: <InstagramIcon/>,
    defaultUrl: "https://www.instagram.com/Gosell.vn",
  },
  {
    name: SocialNames.Tiktok,
    icon: <TiktokIcon/>,
    defaultUrl: "https://www.tiktok.com/Gosell.vn",
  },
  {
    name: SocialNames.Twitter,
    icon: <TwitterIcon/>,
    defaultUrl: "https://www.twitter.com/Gosell.vn",
  },
  {
    name: SocialNames.Youtube,
    icon: <YoutubeIcon/>,
    defaultUrl: "https://www.youtube.com/Gosell.vn",
  },
];

export default function CreateEmailCampaignPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const emailTemplateRef = React.useRef();
  const logoRef = useRef();
  const titleEditRef = useRef();
  const mainArticleRef = useRef();
  const firstArticleRef = useRef();
  const secondArticleRef = useRef();
  const footerSectionRef = useRef();
  const emailLimit = LimitNumberOfEmailCampaign.EmailCampaignLimitSend;

  const tab = {
    general: "general",
    customize: "customize",
  };

  const rootUrl = env.REACT_APP_URL;

  const templateObjective = {
    primaryColor: COLOR.PRIMARY,
    secondaryColor: COLOR.SECONDARY,
    emailTitle: "",
    logo: "",
    mainProductImage: `${rootUrl}/images/default-email-template/main-product.jpg`,
    mainProductTitle: "Euismod purus sem ullamcorper nunc neque.",
    mainProductDescription: `
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. Senectus nullam quam viverra sit. Quis porta a.
    </p>
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. Senectus nullam quam viverra sit.     </p>
    </p>
    `,
    mainProductButton: "BOOK NOW",
    mainProductUrl: "javascript:void()",
    firstSubProductImage: `${rootUrl}/images/default-email-template/first-sub-product.jpg`,
    firstSubProductTitle: "Euismod purus sem ullamcorper nunc neque.",
    firstSubProductDescription: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. </p>`,
    firstSubProductButton: "EXPLORE NOW",
    firstSubProductUrl: "javascript:void()",
    secondSubProductImage: `${rootUrl}/images/default-email-template/second-sub-product.jpg`,
    secondSubProductTitle: "Euismod purus sem ullamcorper nunc neque.",
    secondSubProductDescription: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. </p>`,
    secondSubProductButton: "EXPLORE NOW",
    secondSubProductUrl: "javascript:void()",
    facebook: {
      url: "",
      isActive: false,
      isDisable: false,
    },
    instagram: {
      url: "",
      isActive: false,
      isDisable: false,
    },
    tiktok: {
      url: "",
      isActive: false,
      isDisable: false,
    },
    twitter: {
      url: "",
      isActive: false,
      isDisable: false,
    },
    youtube: {
      url: "",
      isActive: false,
      isDisable: false,
    },
    footerContent: `
      <p style="text-align: center;">Copyright 2010-2022 StoreName, all rights reserved.</p>
      <p style="text-align: center;">60A Trường Sơn, Phường 2, Quận T&acirc;n B&igrave;nh, Hồ Ch&iacute; Minh, Việt Nam</p>
      <p style="text-align: center;">(+84) 989 38 74 94 | youremail@gmail.com</p>
      <p style="text-align: center;">Privacy Policy | Unsubscribe</p>
      <p style="text-align: center;">Bạn nhận được tin n&agrave;y v&igrave; bạn đ&atilde; đăng k&yacute; hoặc chấp nhận lời mời của ch&uacute;ng t&ocirc;i để nhận email từ GoF&B hoặc bạn đ&atilde; mua h&agrave;ng từ GoF&B.</p>
    `,
  };
  const [currentEmailTemplateData, setCurrentEmailTemplateData] = useState(templateObjective);
  const [currentTab, setCurrentTab] = useState(tab.general);
  const [formGeneralTab] = Form.useForm();
  const [customerSegmentInSore, setCustomerSegmentInStore] = useState([]);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalEmail, setTotalEmail] = useState(0);
  const [totalSegment, setTotalSegment] = useState(0);
  const [showCountCustomerSegment, setShowCountCustomerSegment] = useState(false);
  const [showSelectControlCustomerSegment, setShowSelectControlCustomerSegment] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  const [socialFacebook, setSocialFacebook] = useState({
    url: templateObjective.facebook.url,
    isActive: false,
  });
  const [socialInstagram, setSocialInstagram] = useState({
    url: templateObjective.instagram.url,
    isActive: false,
  });
  const [socialTiktok, setSocialTiktok] = useState({
    url: templateObjective.tiktok.url,
    isActive: false,
  });
  const [socialTwitter, setSocialTwitter] = useState({
    url: templateObjective.twitter.url,
    isActive: false,
  });
  const [socialYoutube, setSocialYoutube] = useState({
    url: templateObjective.youtube.url,
    isActive: false,
  });
  const [socialContent, setSocialContent] = useState(templateObjective.footerContent);
  const [isVisibleSendingTimeDialog, setIsVisibleSendingTimeDialog] = useState(false);
  const [messageContentSendingTimeDialog, setMessageContentSendingTimeDialog] = useState(<></>);
  const [sendingTimeDefault, setSendingTimeDefault] = useState();
  const [formGeneralTabValue, setFormGeneralTabValue] = useState();
  const [titleDialog, setTitleDialog] = useState();
  const [isChangeForm, setIsChangeForm] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLimitEmailValidate, setShowLimitEmailValidate] = useState(false);

  const translateData = {
    addNew: t("button.addNew", "Add new"),
    color: t("emailCampaign.color", "Color"),
    primaryColor: t("emailCampaign.primaryColor", "Primary color"),
    secondaryColor: t("emailCampaign.secondaryColor", "Secondary color"),
    reset: t("emailCampaign.reset", "Reset"),
    createEmailCampaign: t("emailCampaign.createEmailCampaign", "Create Email campaign"),
    general: t("emailCampaign.general", "General"),
    customize: t("emailCampaign.customize", "Customize"),
    generalSetting: t("emailCampaign.generalSetting", "General setting"),
    header: t("emailCampaign.header", "Header"),
    title: t("emailCampaign.title", "Title"),
    logo: t("emailCampaign.logo", "Logo"),
    enterEmailTitle: t("emailCampaign.enterEmailTitle", "Enter email title"),
    footerSection: {
      footer: t("emailCampaign.footer", "Footer"),
      socialNetwork: t("emailCampaign.socialNetwork", "Social network"),
      pleaseEnterSocialNetworkLink: t("emailCampaign.pleaseEnterSocialNetworkLink", "Please enter social network link"),
      invalidSocialNetworkLink: t("emailCampaign.invalidSocialNetworkLink", "Invalid social network link"),
      content: t("emailCampaign.content", "Content"),
    },
    generalTab: {
      generalInformationTitle: t("marketing.emailCampaign.generalTab.generalInformationTitle"),
      emailInformationTitle: t("marketing.emailCampaign.generalTab.emailInformationTitle"),
      fieldName: t("marketing.emailCampaign.generalTab.fieldName"),
      campaignDescription: t("marketing.emailCampaign.generalTab.campaignDescription"),
      sendingTime: t("marketing.emailCampaign.generalTab.sendingTime"),
      subject: t("marketing.emailCampaign.generalTab.subject"),
      sendTo: t("marketing.emailCampaign.generalTab.sendTo"),
      emailAddress: t("marketing.emailCampaign.generalTab.emailAddress"),
      customerGroup: t("marketing.emailCampaign.generalTab.customerGroup"),
      nameRequiredMessage: t("marketing.emailCampaign.generalTab.nameRequiredMessage"),
      sendingTimeRequiredMessage: t("marketing.emailCampaign.generalTab.sendingTimeRequiredMessage"),
      subjectRequiredMessage: t("marketing.emailCampaign.generalTab.subjectRequiredMessage"),
      sendToRequiredMessage: t("marketing.emailCampaign.generalTab.sendToRequiredMessage"),
      emailAddressRequiredMessage: t("marketing.emailCampaign.generalTab.emailAddressRequiredMessage"),
      customerGroupRequiredMessage: t("marketing.emailCampaign.generalTab.customerGroupRequiredMessage"),
      namePlaceholder: t("marketing.emailCampaign.generalTab.namePlaceholder"),
      campaignDescriptionPlaceholder: t("marketing.emailCampaign.generalTab.campaignDescriptionPlaceholder"),
      sendingTimePlaceholder: t("marketing.emailCampaign.generalTab.sendingTimePlaceholder"),
      subjectPlaceholder: t("marketing.emailCampaign.generalTab.subjectPlaceholder"),
      sendToPlaceholder: t("marketing.emailCampaign.generalTab.sendToPlaceholder"),
      emailAddressPlaceholder: t("marketing.emailCampaign.generalTab.emailAddressPlaceholder"),
      customerGroupPlaceholder: t("marketing.emailCampaign.generalTab.customerGroupPlaceholder"),
      invalidEmailAddress: t("marketing.emailCampaign.generalTab.invalidEmailAddress"),
      btnIGotIt: t("marketing.emailCampaign.generalTab.btnIGotIt"),
      titleDialogSendingTime: t("marketing.emailCampaign.generalTab.titleDialogSendingTime"),
      createSuccessfullyMessage: t("marketing.emailCampaign.generalTab.createSuccessfullyMessage"),
      createIsNotSuccessfullyMessage: t("marketing.emailCampaign.generalTab.createIsNotSuccessfullyMessage"),
      tabRequiredMessage: t("marketing.emailCampaign.generalTab.tabRequiredMessage"),
    },
    limitSendEmailMessage: t("marketing.emailCampaign.limitSendEmail"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    maximum1000Characters: t("form.maximum1000Characters"),
  };

  const emailCampaignType = [
    {
      id: EmailCampaignType.SendToEmailAddress,
      name: t("marketing.emailCampaign.sendToEmailAddress"),
    },
    {
      id: EmailCampaignType.SendToCustomerGroup,
      name: t("marketing.emailCampaign.sendToCustomerGroup"),
    },
  ];

  useEffect(() => {
    updateTemplate(templateObjective);
    initialDataForGeneralTab();
  }, []);

  const onClickCreateEmailCampaign = () => {


    if (currentTab !== tab.general) {
      if (
        formGeneralTabValue?.emailCampaignType >= 0 &&
        formGeneralTabValue?.name &&
        formGeneralTabValue?.sendingTime &&
        formGeneralTabValue?.emailSubject
      ) {
        if (
          (formGeneralTabValue?.emailCampaignType === EmailCampaignType.SendToEmailAddress &&
            formGeneralTabValue?.emailAddress) ||
          (formGeneralTabValue?.emailCampaignType === EmailCampaignType.SendToCustomerGroup &&
            formGeneralTabValue?.customerSegmentIds?.length > 0)
        ) {
          saveEmailCampaign();
        } else {
          showWarningDialog();
        }
      } else {
        showWarningDialog();
      }
    } else {
      saveEmailCampaign();
    }
  };

  const saveEmailCampaign = () => {
    formGeneralTab.validateFields().then(async (values) => {
      for (let e of sessions) {
        const resetElement = getElement(e);
        if (resetElement) {
          resetElement.style.border = "0px solid transparent";
        }
      }

      const emailTemplateHtmlCode = emailTemplateRef.current.getTemplate();

      let emailAddress = null;
      if (formGeneralTabValue?.emailCampaignType === EmailCampaignType.SendToEmailAddress) {
        emailAddress = formGeneralTabValue.emailAddress.trim();
      }
      let socialList = getEmailCampaignSocials();
      let emailCampaignDetails = getEmailCampaignDetails();
      let dataSubmit = {
        ...formGeneralTabValue,
        emailAddress: emailAddress,
        footerContent: currentEmailTemplateData?.footerContent,
        primaryColor: currentEmailTemplateData?.primaryColor,
        secondaryColor: currentEmailTemplateData?.secondaryColor,
        logoUrl: currentEmailTemplateData?.logo,
        title: currentEmailTemplateData?.emailTitle,
        emailCampaignSocials: socialList,
        emailCampaignDetails: emailCampaignDetails,
        sendingTime: momentFormatDateTime(formGeneralTabValue?.sendingTime),
        template: emailTemplateHtmlCode,
      };

      const emailCampaignResult = await emailCampaignDataService.createEmailCampaignAsync(dataSubmit);
      if (emailCampaignResult?.isSuccess) {
        message.success(translateData.generalTab.createSuccessfullyMessage);
        onCancel();
      } else {
        message.error(translateData.generalTab.createIsNotSuccessfullyMessage);
      }
    });
  };

  const onClickSession = (sessionId) => {
    setCurrentTab(tab.customize);
    const scrollViewOption = {behavior: "smooth", block: "start", inline: "center"};
    const delayTimeOut = 200;
    switch (sessionId) {
      case emailCampaignDefaultTemplate.border.logo:
        setShowHeader(true);
        //Delayed time scroll into view when expanding Collapse
        setTimeout(() => {
          logoRef.current?.scrollIntoView(scrollViewOption);
        }, delayTimeOut);
        break;
      case emailCampaignDefaultTemplate.border.title:
        setShowHeader(true);
        setTimeout(() => {
          titleEditRef.current?.scrollIntoView(scrollViewOption);
        }, delayTimeOut);
        break;
      case emailCampaignDefaultTemplate.border.mainProduct:
        setShowContent(true);
        setTimeout(() => {
          mainArticleRef.current?.scrollIntoView(scrollViewOption);
        }, delayTimeOut);
        break;
      case emailCampaignDefaultTemplate.border.firstSubProduct:
        setShowContent(true);
        setTimeout(() => {
          firstArticleRef.current?.scrollIntoView(scrollViewOption);
        }, delayTimeOut);
        break;
      case emailCampaignDefaultTemplate.border.secondSubProduct:
        setShowContent(true);
        setTimeout(() => {
          secondArticleRef.current?.scrollIntoView(scrollViewOption);
        }, delayTimeOut);
        break;
      case emailCampaignDefaultTemplate.border.footer:
        setShowFooter(true);
        setTimeout(() => {
          footerSectionRef.current?.scrollIntoView(scrollViewOption);
        }, delayTimeOut);
        break;
      default:
        break;
    }
  };

  const onChangePrimaryColor = (color) => {
    const newData = {
      ...currentEmailTemplateData,
      primaryColor: color,
    };
    updateTemplate(newData);
  };

  const onChangeSecondaryColor = (color) => {
    const newData = {
      ...currentEmailTemplateData,
      secondaryColor: color,
    };
    updateTemplate(newData);
  };

  const onChangeEmailTitle = (e) => {
    const text = e.target.value;
    updateTemplate({
      ...currentEmailTemplateData,
      emailTitle: text ?? templateObjective?.emailTitle,
    });
  };

  //#region Footer Section

  const onChangeFooterContent = (value) => {
    setSocialContent(value);
    const newData = {
      ...currentEmailTemplateData,
      footerContent: value,
    };
    updateTemplate(newData);
  };

  const onCheckSocialLink = (socialName, isActive) => {
    switch (socialName) {
      case SocialNames.Facebook:
        setSocialFacebook((prev) => ({...prev, isActive}));
        break;
      case SocialNames.Instagram:
        setSocialInstagram((prev) => ({...prev, isActive}));
        break;
      case SocialNames.Tiktok:
        setSocialTiktok((prev) => ({...prev, isActive}));
        break;
      case SocialNames.Twitter:
        setSocialTwitter((prev) => ({...prev, isActive}));
        break;
      case SocialNames.Youtube:
        setSocialYoutube((prev) => ({...prev, isActive}));
        break;
      default:
        break;
    }
    // update to Preview
    const currentSocialValue = currentEmailTemplateData?.[socialName];
    const isValidLink = isValidHttpUrl(currentSocialValue.url);
    const newData = {
      ...currentEmailTemplateData,
      [socialName]: {
        url: currentSocialValue.url,
        isActive: isActive,
        isDisable: !isValidLink,
      },
    };
    updateTemplate(newData);
  };

  const onChangeSocialUrl = (socialName, url) => {
    switch (socialName) {
      case SocialNames.Facebook:
        setSocialFacebook((prev) => ({...prev, url}));
        break;
      case SocialNames.Instagram:
        setSocialInstagram((prev) => ({...prev, url}));
        break;
      case SocialNames.Tiktok:
        setSocialTiktok((prev) => ({...prev, url}));
        break;
      case SocialNames.Twitter:
        setSocialTwitter((prev) => ({...prev, url}));
        break;
      case SocialNames.Youtube:
        setSocialYoutube((prev) => ({...prev, url}));
        break;
      default:
        break;
    }

    // update to Preview
    const currentSocialValue = currentEmailTemplateData?.[socialName];
    const isValidLink = isValidHttpUrl(url);
    const newData = {
      ...currentEmailTemplateData,
      [socialName]: {
        url: url,
        isActive: currentSocialValue.isActive,
        isDisable: !isValidLink,
      },
    };
    updateTemplate(newData);
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

  const renderFooter = () => {
    return (
      <Collapse
        defaultActiveKey={"1"}
        className="fnb-collapse email-campaign__footer"
        onChange={(value) => onChangeCollapse(value, emailCampaignDefaultTemplate.border.footer)}
        activeKey={showFooter && "1"}
      >
        <Collapse.Panel key="1" header={<div>{translateData.footerSection.footer}</div>}>
          {/* Socials */}
          <div className="footer__social__title" ref={footerSectionRef}>
            <span>{translateData.footerSection.socialNetwork}</span>
          </div>
          <div className="footer__social__links">
            {DefaultSocialLinks?.map((social, index) => {
              const mappedSocialNetwork = getSocialNetworkByName(social.name);
              return (
                <div className="social__link" key={index}>
                  {/* Social Icon */}
                  <div className="link__icon">{social.icon}</div>

                  {/* Input URL */}
                  <Form.Item
                    name={["social", social.name, "url"]}
                    rules={[
                      {
                        validator: (_, value) => {
                          const isActive = form.getFieldValue(["social", social.name, "isActive"]);
                          if (isActive && !value) {
                            return Promise.reject(new Error(translateData.footerSection.pleaseEnterSocialNetworkLink));
                          }
                          if (value && value?.length > 0 && !isValidHttpUrl(value)) {
                            return Promise.reject(new Error(translateData.footerSection.invalidSocialNetworkLink));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    className="flex-1"
                  >
                    <FnbInput
                      placeholder={social.defaultUrl}
                      className="social__link__textInput"
                      onChange={(value) => onChangeSocialUrl(social.name, value.target.value)}
                      maxLength={2000}
                    />
                  </Form.Item>

                  {/* Checkbox */}
                  <Form.Item name={["social", social.name, "isActive"]} valuePropName="checked" className="flex-0">
                    <Checkbox
                      defaultChecked={social.isActive}
                      checked={mappedSocialNetwork.isActive}
                      onChange={(value) => onCheckSocialLink(social.name, value.target.checked)}
                    ></Checkbox>
                  </Form.Item>
                </div>
              );
            })}
          </div>

          {/* Content */}
          <div className="footer__content">
            <h3>{translateData.footerSection.content}</h3>
            <div className="footer__content_editor">
              <FnbFroalaEditor value={socialContent} onChange={(value) => onChangeFooterContent(value)}/>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    );
  };
  //#endregion

  const updateTemplate = (data) => {
    if (emailTemplateRef && emailTemplateRef.current) {
      emailTemplateRef.current.setTemplate(data);
    }

    setCurrentEmailTemplateData(data);
    form.setFieldsValue(data);
  };

  const renderGeneralSetting = () => {
    return (
      <Collapse className="fnb-collapse" defaultActiveKey={["1"]}>
        <Collapse.Panel key={"1"} header={<div>{translateData.generalSetting}</div>}>
          <div>
            <span className="setting-title">{translateData.color}</span>
          </div>
          <Row className="mt-4">
            <Col span={12} className="m-auto">
              <p className="setting-detail">{translateData.primaryColor}</p>
            </Col>
            <Col span={12} className="select-color">
              <div className="choose-color d-flex">
                <FnbColorPicker onChange={onChangePrimaryColor}
                                value={currentEmailTemplateData?.primaryColor}/>
                <p
                  className="setting-detail reset m-auto pointer"
                  onClick={() => {
                    onChangePrimaryColor(COLOR.PRIMARY);
                  }}
                >
                  {translateData.reset}
                </p>
              </div>
            </Col>
          </Row>
          <Row className="mt-4 mb-4">
            <Col span={12} className="m-auto">
              <p className="setting-detail">{translateData.secondaryColor}</p>
            </Col>
            <Col span={12} className="select-color">
              <div className="choose-color d-flex">
                <FnbColorPicker onChange={onChangeSecondaryColor}
                                value={currentEmailTemplateData?.secondaryColor}/>
                <p
                  className="setting-detail reset m-auto pointer"
                  onClick={() => {
                    onChangeSecondaryColor(COLOR.SECONDARY);
                  }}
                >
                  {translateData.reset}
                </p>
              </div>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
    );
  };

  const onChangeImage = (fileUrl) => {
    updateTemplate({
      ...currentEmailTemplateData,
      logo: fileUrl ?? templateObjective?.logo,
    });
  };

  const onChangeCollapse = (key, tag) => {
    switch (tag) {
      case emailCampaignDefaultTemplate.border.logo:
        key.length <= 0 ? setShowHeader(false) : setShowHeader(true);
        break;
      case emailCampaignDefaultTemplate.border.mainProduct:
        key.length <= 0 ? setShowContent(false) : setShowContent(true);
        break;
      case emailCampaignDefaultTemplate.border.footer:
        key.length <= 0 ? setShowFooter(false) : setShowFooter(true);
        break;
      default:
        break;
    }
  };

  const renderHeader = () => {
    return (
      <Collapse
        className="fnb-collapse"
        defaultActiveKey={["1"]}
        onChange={(value) => onChangeCollapse(value, emailCampaignDefaultTemplate.border.logo)}
        activeKey={showHeader && "1"}
      >
        <Collapse.Panel className="fnb-collapse" key={"1"} header={<div>{translateData.header}</div>}>
          <Row id={`_${emailCampaignDefaultTemplate.border.logo}`} className="mt-2" ref={logoRef}>
            <Col span={24} className="mb-2">
              <span className="setting-title">{translateData.logo}</span>
            </Col>
            <Col span={24}>
              <Form.Item name="logo">
                <FnbImageSelectComponent className="email-campaign-logo" onChange={onChangeImage}/>
              </Form.Item>
            </Col>
          </Row>
          <Row ref={titleEditRef} className="mt-3">
            <Col span={24} className="mb-2">
              <span className="setting-title">{translateData.title}</span>
            </Col>
            <Col span={24} className="m-auto">
              <Form.Item name="emailTitle">
                <FnbInput
                  showCount
                  placeholder={translateData.enterEmailTitle}
                  maxLength={255}
                  onChange={onChangeEmailTitle}
                />
              </Form.Item>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
    );
  };

  const initialDataForGeneralTab = async () => {
    // Get customer segment list
    const customerSegmentListResult = await customerSegmentDataService.getCustomerSegmentByStoreIdAsync();
    setCustomerSegmentInStore(customerSegmentListResult);
    let currentDatetime = moment();
    if (formGeneralTabValue?.sendingTime) {
      currentDatetime = formGeneralTabValue?.sendingTime;
    }

    // Set form value
    formGeneralTab.setFieldsValue({
      ...formGeneralTab.getFieldValue(),
      emailCampaignType: EmailCampaignType.SendToEmailAddress,
      sendingTime: currentDatetime,
      customerSegmentIds: [],
    });
    setSendingTimeDefault(currentDatetime);
    setTotalCustomer(0);
    setTotalEmail(0);
    setTotalSegment(0);
    setShowSelectControlCustomerSegment(false);
    setFormGeneralTabValue(formGeneralTab.getFieldsValue());
  };

  const onChangeEmailCampaignType = (value) => {
    formGeneralTab.setFieldsValue({
      ...formGeneralTab.getFieldValue(),
      emailAddress: null,
      customerSegmentIds: [],
    });
    if (value === EmailCampaignType.SendToEmailAddress) {
      setTotalCustomer(0);
      setTotalEmail(0);
      setTotalSegment(0);
      setShowCountCustomerSegment(false);
      setShowSelectControlCustomerSegment(false);
    } else {
      setShowSelectControlCustomerSegment(true);
    }

    setFormGeneralTabValue({
      ...formGeneralTab.getFieldsValue(),
    });
  };

  const onUpdateCustomerSegment = (values) => {
    let totalCustomerValue = 0;
    let totalEmailValue = 0;

    const selectedCustomersSegment = customerSegmentInSore?.filter((x) => values.indexOf(x.id) > -1);

    //Count distinct customers
    const distinctCustomers = [];
    selectedCustomersSegment?.forEach((x) => {
      if (x?.customers?.length > 0) {
        countDistinceObjectInArray(distinctCustomers, x.customers);
      }
    });
    setTotalCustomer(distinctCustomers.length);

    //Count distinct emails
    const distinctEmails = [];
    selectedCustomersSegment?.forEach((x) => {
      if (x?.emails?.length > 0) {
        countDistinceObjectInArray(distinctEmails, x.emails);
      }
    });
    setTotalEmail(distinctEmails.length);

    setTotalSegment(values?.length);
    setShowCountCustomerSegment(values?.length > 0 ? true : false);
    const formGeneralTabFieldsValue = {...formGeneralTab.getFieldsValue()};
    const formGeneralTabFieldsValueEdit = {...formGeneralTabFieldsValue, customerSegmentIds: values};
    formGeneralTab.setFieldsValue({formGeneralTabFieldsValueEdit});

    if (totalEmailValue > emailLimit) {
      setShowLimitEmailValidate(true);
    } else {
      setShowLimitEmailValidate(false);
    }
    setFormGeneralTabValue({
      ...formGeneralTab.getFieldsValue(),
    });
  };

  const countDistinceObjectInArray = (arrayDistinct, array) => {
    array?.forEach((y) => {
      if (!arrayDistinct.includes(y)) {
        arrayDistinct.push(y);
      }
    });
    return arrayDistinct;
  };

  const getEmailCampaignSocials = () => {
    let socials = [];
    let socialItem = {};
    if (currentEmailTemplateData.facebook.isActive) {
      socialItem = {
        enumEmailCampaignSocialId: EmailCampaignSocial.Facebook,
        isActive: true,
        url: currentEmailTemplateData.facebook.url,
      };
      socials.push(socialItem);
    }
    if (currentEmailTemplateData.instagram.isActive) {
      socialItem = {
        enumEmailCampaignSocialId: EmailCampaignSocial.Instagram,
        isActive: true,
        url: currentEmailTemplateData.instagram.url,
      };
      socials.push(socialItem);
    }
    if (currentEmailTemplateData.tiktok.isActive) {
      socialItem = {
        enumEmailCampaignSocialId: EmailCampaignSocial.Tiktok,
        isActive: true,
        url: currentEmailTemplateData.tiktok.url,
      };
      socials.push(socialItem);
    }
    if (currentEmailTemplateData.twitter.isActive) {
      socialItem = {
        enumEmailCampaignSocialId: EmailCampaignSocial.Twiter,
        isActive: true,
        url: currentEmailTemplateData.twitter.url,
      };
      socials.push(socialItem);
    }
    if (currentEmailTemplateData.youtube.isActive) {
      socialItem = {
        enumEmailCampaignSocialId: EmailCampaignSocial.Youtube,
        isActive: true,
        url: currentEmailTemplateData.youtube.url,
      };
      socials.push(socialItem);
    }

    return socials;
  };

  const getEmailCampaignDetails = () => {
    let emailCampaignDetails = [];
    let mainProductInformation = {
      title: currentEmailTemplateData.mainProductTitle,
      description: currentEmailTemplateData.mainProductDescription,
      imageUrl: currentEmailTemplateData.mainProductImage,
      buttonUrl: currentEmailTemplateData.mainProductUrl,
      position: 1,
      isMain: true,
      buttonName: currentEmailTemplateData.mainProductButton,
    };
    emailCampaignDetails.push(mainProductInformation);

    let firstSubProductInformation = {
      title: currentEmailTemplateData.firstSubProductTitle,
      description: currentEmailTemplateData.firstSubProductDescription,
      imageUrl: currentEmailTemplateData.firstSubProductImage,
      buttonUrl: currentEmailTemplateData.firstSubProductUrl,
      position: 2,
      buttonName: currentEmailTemplateData.firstSubProductButton,
    };
    emailCampaignDetails.push(firstSubProductInformation);

    let secondSubProductInformation = {
      title: currentEmailTemplateData.secondSubProductTitle,
      description: currentEmailTemplateData.secondSubProductDescription,
      imageUrl: currentEmailTemplateData.secondSubProductImage,
      buttonUrl: currentEmailTemplateData.secondSubProductUrl,
      position: 3,
      buttonName: currentEmailTemplateData.secondSubProductButton,
    };
    emailCampaignDetails.push(secondSubProductInformation);

    return emailCampaignDetails;
  };

  const handleOkSendingTimeDialog = () => {
    setIsVisibleSendingTimeDialog(false);
  };

  const renderContentSendingTimeDialog = () => {
    return <div dangerouslySetInnerHTML={{__html: `${messageContentSendingTimeDialog}`}}></div>;
  };

  const onChangeSendingTime = (values) => {
    let dateTimeValue = moment(values);
    formGeneralTab.setFieldsValue({
      ...formGeneralTab.getFieldValue(),
      sendingTime: dateTimeValue,
    });
    setSendingTimeDefault(dateTimeValue);
    setFormGeneralTabValue(formGeneralTab.getFieldsValue());
  };

  const onOkSendingTime = (values) => {
    // TODO: Handle save email campaign template
  };

  const onChangeFormGeneralTab = (values) => {
    setFormGeneralTabValue({
      ...formGeneralTab.getFieldsValue(),
    });
  };

  const showWarningDialog = () => {
    setCurrentTab(tab.general);
    setTimeout(() => {
      formGeneralTab.validateFields();
    }, 100);

    setTitleDialog(translateData.generalTab.titleDialogSendingTime);
    setMessageContentSendingTimeDialog(translateData.generalTab.tabRequiredMessage);
    setIsVisibleSendingTimeDialog(true);
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onCancel = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      history.push("/marketing/email-campaign");
    }, DELAYED_TIME);
  };

  return (
    <>
      <div className="create-email-campaign-template">
        <FnbPageHeader
          title={translateData.createEmailCampaign}
          actionButtons={[
            {
              action: (
                <FnbAddNewButton
                  idControl="btn-create-email-campaign"
                  onClick={onClickCreateEmailCampaign}
                  text={translateData.addNew}
                />
              ),
              permission: PermissionKeys.CREATE_EMAIL_CAMPAIGN,
            },
            {
              action: <CancelButton onOk={history.goBack}/>,
            },
          ]}
        />

        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Tabs
              activeKey={currentTab}
              defaultActiveKey={currentTab}
              className="fnb-tabs"
              onChange={(key) => {
                setCurrentTab(key);
              }}
              id="create-email-campaign-tabs"
            >
              <TabPane id="general-tab" tab={translateData.general} key={tab.general}></TabPane>
              <TabPane id="customize-tab" tab={translateData.customize} key={tab.customize}></TabPane>
            </Tabs>

            {/* General tab */}
            {currentTab === tab.general && (
              <Form
                form={formGeneralTab}
                className="general-campaign-email-form"
                layout="vertical"
                autoComplete="off"
                onChange={onChangeFormGeneralTab}
                onFieldsChange={() => setIsChangeForm(true)}
              >
                <FnbCard title={translateData.generalTab.generalInformationTitle} className="pt-3">
                  {/* email name */}
                  <h4 className="fnb-form-label mt-32">
                    {translateData.generalTab.fieldName}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: translateData.generalTab.nameRequiredMessage,
                      },
                      {
                        type: "string",
                        max: 100,
                      },
                    ]}
                  >
                    <Input
                      className="fnb-input-with-count"
                      showCount
                      maxLength={100}
                      placeholder={translateData.generalTab.namePlaceholder}
                    />
                  </Form.Item>

                  <h4 className="fnb-form-label">{translateData.generalTab.campaignDescription}</h4>
                  <Form.Item name="description">
                    <TextArea
                      showCount
                      className="fnb-text-area-with-count no-resize email-campaign-description-box"
                      placeholder={translateData.generalTab.campaignDescriptionPlaceholder}
                      maxLength={1000}
                    />
                  </Form.Item>

                  <h4 className="fnb-form-label">
                    {translateData.generalTab.sendingTime}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name="sendingTime"
                    rules={[
                      {
                        required: true,
                        message: translateData.generalTab.sendToRequiredMessage,
                      },
                    ]}
                  >
                    <FnbDateTimePickerComponent
                      placeholder={translateData.generalTab.sendingTimePlaceholder}
                      onChangeDateTime={onChangeSendingTime}
                      onOk={onOkSendingTime}
                      defaultDateTimeValue={sendingTimeDefault}
                      disabledPastTime={true}
                      isCurrent={true}
                    />
                  </Form.Item>
                </FnbCard>

                {/* Card email information */}
                <FnbCard title={translateData.generalTab.emailInformationTitle}
                         className="pt-3 margin-top-24">
                  {/* email subject */}
                  <h4 className="fnb-form-label mt-32">
                    {translateData.generalTab.subject}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name="emailSubject"
                    rules={[
                      {
                        required: true,
                        message: translateData.generalTab.subjectRequiredMessage,
                      },
                      {
                        type: "string",
                        max: 255,
                      },
                    ]}
                  >
                    <Input
                      className="fnb-input-with-count"
                      showCount
                      maxLength={255}
                      placeholder={translateData.generalTab.subjectPlaceholder}
                    />
                  </Form.Item>

                  {/* option send to of email */}
                  <h4 className="fnb-form-label">{translateData.generalTab.sendTo}</h4>
                  <Form.Item
                    name="emailCampaignType"
                    rules={[
                      {
                        required: true,
                        message: translateData.generalTab.emailCa,
                      },
                    ]}
                  >
                    <FnbSelectSingle
                      placeholder={translateData.generalTab.sendToPlaceholder}
                      option={emailCampaignType?.map((item) => ({
                        id: item.id,
                        name: item.name,
                      }))}
                      showSearch
                      onChange={onChangeEmailCampaignType}
                    />
                  </Form.Item>

                  {showSelectControlCustomerSegment ? (
                    <>
                      {/* Customer segment */}
                      <h4 className="fnb-form-label">
                        {translateData.generalTab.customerGroup}
                        <span className="text-danger">*</span>
                      </h4>
                      <Form.Item
                        className="select-control"
                        name="customerSegmentIds"
                        rules={[
                          {
                            required: true,
                            message: translateData.generalTab.customerGroupRequiredMessage,
                          },
                          {
                            validator: () => {
                              if (showLimitEmailValidate) {
                                return Promise.reject(t(translateData.limitSendEmailMessage, {emailLimit}));
                              } else {
                                return Promise.resolve();
                              }
                            },
                          },
                        ]}
                      >
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          mode="multiple"
                          onChange={(e) => onUpdateCustomerSegment(e)}
                          className={`fnb-select-multiple-customer-segment dont-show-item`}
                          popupClassName="fnb-select-multiple-dropdown"
                          suffixIcon={<ArrowDown/>}
                          menuItemSelectedIcon={<CheckboxCheckedIcon/>}
                          placeholder={translateData.generalTab.customerGroupPlaceholder}
                          optionFilterProp="children"
                          showArrow
                          showSearch={true}
                          allowClear={true}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          id="fnb-select-multiple-customer-segment"
                        >
                          {customerSegmentInSore?.map((item) => (
                            <Select.Option key={item.id} value={item.id}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      {showCountCustomerSegment && (
                        <div
                          className="selected-customer-segment selected-customer-segment-position"
                          dangerouslySetInnerHTML={{
                            __html: `${t("marketing.emailCampaign.generalTab.customerSegmentSelected", {
                              totalSegment: totalSegment,
                              totalCustomer: totalCustomer,
                              totalEmail: totalEmail,
                            })}`,
                          }}
                        ></div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Email address of customer */}
                      <h4 className="fnb-form-label">
                        {translateData.generalTab.emailAddress}
                        <span className="text-danger">*</span>
                      </h4>
                      <Form.Item
                        name="emailAddress"
                        rules={[
                          {
                            required: !showSelectControlCustomerSegment && true,
                            message: translateData.generalTab.emailAddressRequiredMessage,
                          },
                          {
                            type: "string",
                            pattern: emailPattern,
                            message: translateData.generalTab.invalidEmailAddress,
                          },
                        ]}
                      >
                        <Input className="fnb-input"
                               placeholder={translateData.generalTab.emailAddressPlaceholder}/>
                      </Form.Item>
                    </>
                  )}
                </FnbCard>
              </Form>
            )}

            {currentTab === tab.customize && (
              <Form form={form} className="customize-email-template">
                <Row gutter={[24, 24]} className="mt-2">
                  <Col span={24}>{renderGeneralSetting()}</Col>
                  <Col span={24}>{renderHeader()}</Col>
                  <Col span={24}>
                    {
                      <ContentEmailCampaign
                        currentEmailTemplateData={currentEmailTemplateData}
                        onChange={(data) => updateTemplate(data)}
                        defaultData={templateObjective}
                        mainArticleRef={mainArticleRef}
                        firstArticleRef={firstArticleRef}
                        secondArticleRef={secondArticleRef}
                        showContent={showContent}
                        onChangeCollapse={(value) =>
                          onChangeCollapse(value, emailCampaignDefaultTemplate.border.mainProduct)
                        }
                      />
                    }
                  </Col>
                  <Col span={24}>{renderFooter()}</Col>
                </Row>
              </Form>
            )}
          </Col>

          <Col span={12}>
            <EmailCampaignTemplate onClickSession={onClickSession} ref={emailTemplateRef}/>
          </Col>
        </Row>
      </div>

      <FnbModal
        width={"500px"}
        title={titleDialog}
        visible={isVisibleSendingTimeDialog}
        okText={translateData.generalTab.btnIGotIt}
        onOk={handleOkSendingTimeDialog}
        content={renderContentSendingTimeDialog()}
        className="sending-time-dialog"
        cancelButtonProps={{style: {display: "none"}}}
        centered={true}
        closable={false}
      />

      <DeleteConfirmComponent
        title={translateData.leaveDialog.confirmation}
        content={translateData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={translateData.discardBtn}
        okText={translateData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCancel}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
