import { Editor } from "@tinymce/tinymce-react";
import { Checkbox, Col, Collapse, Form, Input, Row, Select, Tabs, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { CancelButton } from "components/cancel-button";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbColorPicker } from "components/fnb-color-picker/fnb-color-picker.component";
import FnbDateTimePickerComponent from "components/fnb-datetime-picker";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { TINY_MCE_API_KEY } from "constants/application.constants";
import { COLOR, DELAYED_TIME } from "constants/default.constants";
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
import { DateFormat, emailPattern } from "constants/string.constants";
import customerSegmentDataService from "data-services/customer-segment/customer-segment-data.service";
import emailCampaignDataService from "data-services/email-campaign/email-campaign-data.service";
import { emailCampaignDefaultTemplate } from "email-campaign-templates/email-campaign-default.template";
import { env } from "env";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getElement } from "utils/email-campaign.helpers";
import { convertUtcToLocalTime, isValidHttpUrl, momentFormatDateTime } from "utils/helpers";
import ContentEmailCampaign from "../components/content-email-campaign.component";
import { EmailCampaignTemplate } from "../components/email-campaign-template.component";
import "../create-email-campaign/create-email-campaign.page.scss";
import EditEmailCampaignHiddenValuesComponent from "./edit-email-campaign-hidden-values.component";
import FnbFroalaEditor from "components/fnb-froala-editor";

const { TabPane } = Tabs;

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
  },
  {
    name: SocialNames.Instagram,
    icon: <InstagramIcon />,
    defaultUrl: "https://www.instagram.com/Gosell.vn",
  },
  {
    name: SocialNames.Tiktok,
    icon: <TiktokIcon />,
    defaultUrl: "https://www.tiktok.com/Gosell.vn",
  },
  {
    name: SocialNames.Twitter,
    icon: <TwitterIcon />,
    defaultUrl: "https://www.twitter.com/Gosell.vn",
  },
  {
    name: SocialNames.Youtube,
    icon: <YoutubeIcon />,
    defaultUrl: "https://www.youtube.com/Gosell.vn",
  },
];

export default function EditEmailCampaignPage(props) {
  const [form] = Form.useForm();
  const [t] = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
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

  const emailCampaignDetailPosition = {
    MAIN_PRODUCT: 1,
    FIRST_SUB_PRODUCT: 2,
    SECOND_SUB_PRODUCT: 3,
  };

  const rootUrl = env.REACT_APP_URL;

  const templateObjective = {
    id: "",
    primaryColor: COLOR.PRIMARY,
    secondaryColor: COLOR.SECONDARY,
    emailTitle: "",
    logo: "",
    mainProductId: "",
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
    firstSubProductId: "",
    firstSubProductImage: `${rootUrl}/images/default-email-template/first-sub-product.jpg`,
    firstSubProductTitle: "Euismod purus sem ullamcorper nunc neque.",
    firstSubProductDescription: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. </p>`,
    firstSubProductButton: "EXPLORE NOW",
    firstSubProductUrl: "javascript:void()",
    secondSubProductId: "",
    secondSubProductImage: `${rootUrl}/images/default-email-template/second-sub-product.jpg`,
    secondSubProductTitle: "Euismod purus sem ullamcorper nunc neque.",
    secondSubProductDescription: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. </p>`,
    secondSubProductButton: "EXPLORE NOW",
    secondSubProductUrl: "javascript:void()",
    facebook: {
      id: "",
      url: "",
      isActive: false,
      isDisable: false,
    },
    instagram: {
      id: "",
      url: "",
      isActive: false,
      isDisable: false,
    },
    tiktok: {
      id: "",
      url: "",
      isActive: false,
      isDisable: false,
    },
    twitter: {
      id: "",
      url: "",
      isActive: false,
      isDisable: false,
    },
    youtube: {
      id: "",
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
  const [customerSegmentInStore, setCustomerSegmentInStore] = useState([]);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalEmail, setTotalEmail] = useState(0);
  const [totalSegment, setTotalSegment] = useState(0);
  const [showCountCustomerSegment, setShowCountCustomerSegment] = useState(false);
  const [showSelectControlCustomerSegment, setShowSelectControlCustomerSegment] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [title, setTitle] = useState("");

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
  const [titleDialog, setTitleDialog] = useState();
  const [isChangeForm, setIsChangeForm] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLimitEmailValidate, setShowLimitEmailValidate] = useState(false);
  const translateData = {
    update: t("button.update", "Update"),
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
      updateSuccessfullyMessage: t("marketing.emailCampaign.generalTab.updateSuccessfullyMessage"),
      updateFailMessage: t("marketing.emailCampaign.generalTab.updateFailMessage"),
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
    getEditData();
  }, []);

  const getEditData = async () => {
    const { emailCampaignId } = match?.params;
    if (emailCampaignId) {
      let promises = [];
      promises.push(emailCampaignDataService.getEmailCampaignByIdAsync(emailCampaignId));
      promises.push(customerSegmentDataService.getCustomerSegmentByStoreIdAsync());
      const [emailCampaignDataResponse, customerSegmentDataResponse] = await Promise.all(promises);

      if (customerSegmentDataResponse) {
        setCustomerSegmentInStore(customerSegmentDataResponse);
      }
      if (emailCampaignDataResponse) {
        const { emailCampaign } = emailCampaignDataResponse;
        const { emailCampaignDetails, emailCampaignSocials } = emailCampaign;
        const mainProduct = emailCampaignDetails?.find((x) => x.position === emailCampaignDetailPosition.MAIN_PRODUCT);
        const firstSubProduct = emailCampaignDetails?.find(
          (x) => x.position === emailCampaignDetailPosition.FIRST_SUB_PRODUCT
        );
        const secondSubProduct = emailCampaignDetails?.find(
          (x) => x.position === emailCampaignDetailPosition.SECOND_SUB_PRODUCT
        );

        //Set templateObjective
        let currentTemplate = templateObjective;
        currentTemplate.id = emailCampaign.id;
        currentTemplate.primaryColor = emailCampaign.primaryColor;
        currentTemplate.secondaryColor = emailCampaign.secondaryColor;
        currentTemplate.emailTitle = emailCampaign.title;
        currentTemplate.logo = emailCampaign.logoUrl;
        currentTemplate.footerContent = emailCampaign.footerContent;

        //Set emailCampaignDetails
        if (mainProduct) {
          currentTemplate.mainProductId = mainProduct.id;
          currentTemplate.mainProductImage =
            mainProduct.thumbnail ?? `${rootUrl}/images/default-email-template/main-product.jpg`;
          currentTemplate.mainProductTitle = mainProduct.title;
          currentTemplate.mainProductDescription = mainProduct.description;
          currentTemplate.mainProductButton = mainProduct.buttonName;
          currentTemplate.mainProductUrl = mainProduct.buttonLink;
        }

        if (firstSubProduct) {
          currentTemplate.firstSubProductId = firstSubProduct.id;
          currentTemplate.firstSubProductImage =
            firstSubProduct.thumbnail ?? `${rootUrl}/images/default-email-template/first-sub-product.jpg`;
          currentTemplate.firstSubProductTitle = firstSubProduct.title;
          currentTemplate.firstSubProductDescription = firstSubProduct.description;
          currentTemplate.firstSubProductButton = firstSubProduct.buttonName;
          currentTemplate.firstSubProductUrl = firstSubProduct.buttonLink;
        }

        if (secondSubProduct) {
          currentTemplate.secondSubProductId = secondSubProduct.id;
          currentTemplate.secondSubProductImage =
            secondSubProduct.thumbnail ?? `${rootUrl}/images/default-email-template/main-product.jpg`;
          currentTemplate.secondSubProductTitle = secondSubProduct.title;
          currentTemplate.secondSubProductDescription = secondSubProduct.description;
          currentTemplate.secondSubProductButton = secondSubProduct.buttonName;
          currentTemplate.secondSubProductUrl = secondSubProduct.buttonLink;
        }

        //Set emailCampaignSocial
        const facebook = emailCampaignSocials?.find(
          (x) => x.enumEmailCampaignSocialId === EmailCampaignSocial.Facebook
        );
        const instagram = emailCampaignSocials?.find(
          (x) => x.enumEmailCampaignSocialId === EmailCampaignSocial.Instagram
        );
        const tiktok = emailCampaignSocials?.find((x) => x.enumEmailCampaignSocialId === EmailCampaignSocial.Tiktok);
        const twitter = emailCampaignSocials?.find((x) => x.enumEmailCampaignSocialId === EmailCampaignSocial.Twiter);
        const youtube = emailCampaignSocials?.find((x) => x.enumEmailCampaignSocialId === EmailCampaignSocial.Youtube);

        if (facebook) {
          currentTemplate.facebook.id = facebook.id;
          currentTemplate.facebook.url = facebook.url;
          currentTemplate.facebook.isActive = facebook.isActive;
          currentTemplate.facebook.isDisable = !isValidHttpUrl(facebook.url);
        }

        if (instagram) {
          currentTemplate.instagram.id = instagram.id;
          currentTemplate.instagram.url = instagram.url;
          currentTemplate.instagram.isActive = instagram.isActive;
          currentTemplate.instagram.isDisable = !isValidHttpUrl(instagram.url);
        }

        if (tiktok) {
          currentTemplate.tiktok.id = tiktok.id;
          currentTemplate.tiktok.url = tiktok.url;
          currentTemplate.tiktok.isActive = tiktok.isActive;
          currentTemplate.tiktok.isDisable = !isValidHttpUrl(tiktok.url);
        }

        if (twitter) {
          currentTemplate.twitter.id = twitter.id;
          currentTemplate.twitter.url = twitter.url;
          currentTemplate.twitter.isActive = twitter.isActive;
          currentTemplate.twitter.isDisable = !isValidHttpUrl(twitter.url);
        }

        if (youtube) {
          currentTemplate.youtube.id = youtube.id;
          currentTemplate.youtube.url = youtube.url;
          currentTemplate.youtube.isActive = youtube.isActive;
          currentTemplate.youtube.isDisable = !isValidHttpUrl(youtube.url);
        }

        const templateData = {
          ...emailCampaign,
          ...currentTemplate,
          sendingTime: convertUtcToLocalTime(emailCampaign.sendingTime),
        };

        updateTemplate(templateData);

        ///Set init state value
        setSendingTimeDefault(convertUtcToLocalTime(emailCampaign.sendingTime));
        setShowSelectControlCustomerSegment(emailCampaign.emailCampaignType === EmailCampaignType.SendToCustomerGroup);
        onUpdateCustomerSegment(emailCampaign.customerSegmentIds, customerSegmentDataResponse);
        setSocialContent(emailCampaign.footerContent);
        setTitle(emailCampaign.name);
      }
    }
  };

  const updateTemplate = (data) => {
    if (emailTemplateRef && emailTemplateRef.current) {
      emailTemplateRef.current.setTemplate(data);
    }

    setCurrentEmailTemplateData(data);
    form.setFieldsValue(data);
  };

  const onChangeSendingTime = (values) => {
    let dateTimeValue = moment(values);
    setSendingTimeDefault(dateTimeValue);

    let formValue = form.getFieldsValue();
    formValue.sendingTime = dateTimeValue;
    form.setFieldsValue(formValue);
  };

  const onOkSendingTime = (values) => {
    // TODO: Handle save email campaign template
  };

  const onChangeEmailCampaignType = (value) => {
    let formValue = form.getFieldsValue();
    if (value === EmailCampaignType.SendToEmailAddress) {
      formValue.customerSegmentIds = [];
      setTotalCustomer(0);
      setTotalEmail(0);
      setTotalSegment(0);
      setShowCountCustomerSegment(false);
      setShowSelectControlCustomerSegment(false);
    } else {
      formValue.emailAddress = null;
      setShowSelectControlCustomerSegment(true);
    }
    form.setFieldsValue(formValue);
  };

  const onUpdateCustomerSegment = (values, customerSegmentInStore) => {
    let totalCustomerValue = 0;
    let totalEmailValue = 0;
    values?.forEach((value) => {
      const customerSegment = customerSegmentInStore?.find((a) => a.id === value);
      totalEmailValue += customerSegment?.totalEmail;
      totalCustomerValue += customerSegment?.totalCustomer;
      setTotalCustomer(totalCustomerValue);
      setTotalEmail(totalEmailValue);
    });
    setTotalSegment(values?.length);
    setShowCountCustomerSegment(values?.length > 0 ? true : false);

    if (totalEmailValue > LimitNumberOfEmailCampaign.EmailCampaignLimitSend) {
      setShowLimitEmailValidate(true);
    } else {
      setShowLimitEmailValidate(false);
    }
  };

  const onChangePrimaryColor = (color) => {
    const newData = {
      ...currentEmailTemplateData,
      ...form.getFieldsValue(),
      primaryColor: color,
    };
    updateTemplate(newData);
  };

  const onChangeSecondaryColor = (color) => {
    const newData = {
      ...currentEmailTemplateData,
      ...form.getFieldsValue(),
      secondaryColor: color,
    };
    updateTemplate(newData);
  };

  const onChangeImage = (fileUrl) => {
    updateTemplate({
      ...currentEmailTemplateData,
      ...form.getFieldsValue(),
      logo: fileUrl ?? templateObjective?.logo,
    });
  };

  const onChangeEmailTitle = (e) => {
    const text = e.target.value;
    updateTemplate({
      ...currentEmailTemplateData,
      ...form.getFieldsValue(),
      emailTitle: text ?? templateObjective?.emailTitle,
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

  const onChangeSocialUrl = (socialName, url) => {
    switch (socialName) {
      case SocialNames.Facebook:
        setSocialFacebook((prev) => ({ ...prev, url }));
        currentEmailTemplateData.facebook.url = url;
        break;
      case SocialNames.Instagram:
        setSocialInstagram((prev) => ({ ...prev, url }));
        currentEmailTemplateData.instagram.url = url;
        break;
      case SocialNames.Tiktok:
        setSocialTiktok((prev) => ({ ...prev, url }));
        currentEmailTemplateData.tiktok.url = url;
        break;
      case SocialNames.Twitter:
        setSocialTwitter((prev) => ({ ...prev, url }));
        currentEmailTemplateData.twitter.url = url;
        break;
      case SocialNames.Youtube:
        setSocialYoutube((prev) => ({ ...prev, url }));
        currentEmailTemplateData.youtube.url = url;
        break;
      default:
        break;
    }
    const newData = {
      ...currentEmailTemplateData,
      ...form.getFieldsValue(),
    };
    updateTemplate(newData);
  };


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
        setSocialFacebook((prev) => ({ ...prev, isActive }));
        break;
      case SocialNames.Instagram:
        setSocialInstagram((prev) => ({ ...prev, isActive }));
        break;
      case SocialNames.Tiktok:
        setSocialTiktok((prev) => ({ ...prev, isActive }));
        break;
      case SocialNames.Twitter:
        setSocialTwitter((prev) => ({ ...prev, isActive }));
        break;
      case SocialNames.Youtube:
        setSocialYoutube((prev) => ({ ...prev, isActive }));
        break;
      default:
        break;
    }
    // update to Preview
    const currentSocialValue = currentEmailTemplateData?.[socialName];
    const isValidLink = isValidHttpUrl(currentSocialValue.url);
    const newData = {
      ...currentEmailTemplateData,
      ...form.getFieldsValue(),
      [socialName]: {
        url: currentSocialValue.url,
        isActive: isActive,
        isDisable: !isValidLink,
      },
    };
    updateTemplate(newData);
  };

  const onChangeContentEmailCampaign = (data) => {
    const newData = {
      ...data,
      ...form.getFieldsValue(),
    };
    updateTemplate(newData);
  };

  const onClickSession = (sessionId) => {
    setCurrentTab(tab.customize);
    const scrollViewOption = { behavior: "smooth", block: "start", inline: "center" };
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

  const handleOkSendingTimeDialog = () => {
    setIsVisibleSendingTimeDialog(false);
  };

  const renderContentSendingTimeDialog = () => {
    return <div dangerouslySetInnerHTML={{ __html: `${messageContentSendingTimeDialog}` }}></div>;
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onCompleted = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      history.push("/marketing/email-campaign");
    }, DELAYED_TIME);
  };

  const showWarningDialog = () => {
    setCurrentTab(tab.general);
    setTimeout(() => {
      form.validateFields();
    }, 100);

    setTitleDialog(translateData.generalTab.titleDialogSendingTime);
    setMessageContentSendingTimeDialog(translateData.generalTab.tabRequiredMessage);
    setIsVisibleSendingTimeDialog(true);
  };

  const getEmailCampaignDetails = () => {
    let emailCampaignDetails = [];
    let mainProductInformation = {
      id: currentEmailTemplateData.mainProductId,
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
      id: currentEmailTemplateData.firstSubProductId,
      title: currentEmailTemplateData.firstSubProductTitle,
      description: currentEmailTemplateData.firstSubProductDescription,
      imageUrl: currentEmailTemplateData.firstSubProductImage,
      buttonUrl: currentEmailTemplateData.firstSubProductUrl,
      position: 2,
      buttonName: currentEmailTemplateData.firstSubProductButton,
    };
    emailCampaignDetails.push(firstSubProductInformation);

    let secondSubProductInformation = {
      id: currentEmailTemplateData.secondSubProductId,
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

  const getEmailCampaignSocials = () => {
    let formValues = form.getFieldsValue();
    let socials = [];
    let socialItem = {};

    if (formValues.facebook) {
      socialItem = {
        id: formValues.facebook.id,
        enumEmailCampaignSocialId: EmailCampaignSocial.Facebook,
        isActive: formValues.facebook.isActive,
        url: formValues.facebook.url,
      };
      socials.push(socialItem);
    }
    if (formValues.instagram) {
      socialItem = {
        id: formValues.instagram.id,
        enumEmailCampaignSocialId: EmailCampaignSocial.Instagram,
        isActive: formValues.instagram.isActive,
        url: formValues.instagram.url,
      };
      socials.push(socialItem);
    }
    if (formValues.tiktok) {
      socialItem = {
        id: formValues.tiktok.id,
        enumEmailCampaignSocialId: EmailCampaignSocial.Tiktok,
        isActive: formValues.tiktok.isActive,
        url: formValues.tiktok.url,
      };
      socials.push(socialItem);
    }
    if (formValues.twitter) {
      socialItem = {
        id: formValues.twitter.id,
        enumEmailCampaignSocialId: EmailCampaignSocial.Twiter,
        isActive: formValues.twitter.isActive,
        url: formValues.twitter.url,
      };
      socials.push(socialItem);
    }
    if (formValues.youtube) {
      socialItem = {
        id: formValues.youtube.id,
        enumEmailCampaignSocialId: EmailCampaignSocial.Youtube,
        isActive: formValues.youtube.isActive,
        url: formValues.youtube.url,
      };
      socials.push(socialItem);
    }

    return socials;
  };

  //#region Update Email campaign
  const onClickUpdateEmailCampaign = async () => {
    await form.validateFields();
    const formValues = form.getFieldsValue();


    if (currentTab !== tab.general) {
      if (
        formValues?.emailCampaignType >= 0 &&
        formValues?.name &&
        formValues?.sendingTime &&
        formValues?.emailSubject
      ) {
        if (
          (formValues?.emailCampaignType === EmailCampaignType.SendToEmailAddress && formValues?.emailAddress) ||
          (formValues?.emailCampaignType === EmailCampaignType.SendToCustomerGroup &&
            formValues?.customerSegmentIds?.length > 0)
        ) {
          saveEmailCampaign(formValues);
        } else {
          showWarningDialog();
        }
      } else {
        showWarningDialog();
      }
    } else {
      saveEmailCampaign(formValues);
    }
  };

  const saveEmailCampaign = async (formValues) => {
    for (let e of sessions) {
      const resetElement = getElement(e);
      if (resetElement) {
        resetElement.style.border = "0px solid transparent";
      }
    }

    const emailTemplateHtmlCode = emailTemplateRef.current.getTemplate();
    let dateTimeNow = moment(new Date()).format(DateFormat.YYYY_MM_DD_HH_MM);
    let sendingTimeValue = moment(formValues?.sendingTime).format(DateFormat.YYYY_MM_DD_HH_MM);
    let compareDateTime = dateTimeNow > sendingTimeValue;
    if (compareDateTime) {
      let messageSendingTimeDialog = t("marketing.emailCampaign.generalTab.sendingTimeMessageDialog", {
        dateTimeValue: moment(dateTimeNow).format(DateFormat.DD_MM_YYYY_HH_MM),
      });
      setTitleDialog(translateData.generalTab.titleDialogSendingTime);
      setMessageContentSendingTimeDialog(messageSendingTimeDialog);
      setIsVisibleSendingTimeDialog(true);
    } else {
      let emailAddress = null;
      if (formValues?.emailCampaignType === EmailCampaignType.SendToEmailAddress) {
        emailAddress = formValues?.emailAddress?.trim();
      }
      let emailCampaignDetails = getEmailCampaignDetails();
      let emailCampaignSocials = getEmailCampaignSocials();
      let dataSubmit = {
        ...formValues,
        emailAddress: emailAddress,
        footerContent: currentEmailTemplateData?.footerContent,
        primaryColor: currentEmailTemplateData?.primaryColor,
        secondaryColor: currentEmailTemplateData?.secondaryColor,
        logoUrl: currentEmailTemplateData?.logo,
        title: currentEmailTemplateData?.emailTitle,
        emailCampaignSocials: emailCampaignSocials,
        emailCampaignDetails: emailCampaignDetails,
        sendingTime: momentFormatDateTime(formValues?.sendingTime),
        template: emailTemplateHtmlCode,
      };

      const emailCampaignResult = await emailCampaignDataService.updateEmailCampaignAsync(dataSubmit);
      if (emailCampaignResult?.isSuccess) {
        message.success(translateData.generalTab.updateSuccessfullyMessage);
        onCompleted();
      } else {
        message.error(translateData.generalTab.updateFailMessage);
      }
    }
  };
  //#endregion

  const renderGeneralSetting = () => {
    return (
      <Collapse className="fnb-collapse" defaultActiveKey={["1"]}>
        <Collapse.Panel key={"1"} header={<div>{translateData.generalSetting}</div>} forceRender={true}>
          <div>
            <span className="setting-title">{translateData.color}</span>
          </div>
          <Row className="mt-4">
            <Col span={12} className="m-auto">
              <p className="setting-detail">{translateData.primaryColor}</p>
            </Col>
            <Col span={12} className="select-color">
              <div className="choose-color d-flex">
                <FnbColorPicker onChange={onChangePrimaryColor} value={currentEmailTemplateData?.primaryColor} />
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
                <FnbColorPicker onChange={onChangeSecondaryColor} value={currentEmailTemplateData?.secondaryColor} />
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

  const renderHeader = () => {
    return (
      <Collapse
        className="fnb-collapse"
        defaultActiveKey={["1"]}
        onChange={(value) => onChangeCollapse(value, emailCampaignDefaultTemplate.border.logo)}
        activeKey={showHeader && "1"}
      >
        <Collapse.Panel
          className="fnb-collapse"
          key={"1"}
          header={<div>{translateData.header}</div>}
          forceRender={true}
        >
          <Row id={`_${emailCampaignDefaultTemplate.border.logo}`} className="mt-2" ref={logoRef}>
            <Col span={24} className="mb-2">
              <span className="setting-title">{translateData.logo}</span>
            </Col>
            <Col span={24}>
              <Form.Item name="logo">
                <FnbImageSelectComponent className="email-campaign-logo" onChange={onChangeImage} />
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

  const renderFooter = () => {
    return (
      <Collapse
        defaultActiveKey={"1"}
        className="fnb-collapse email-campaign__footer"
        onChange={(value) => onChangeCollapse(value, emailCampaignDefaultTemplate.border.footer)}
        activeKey={showFooter && "1"}
      >
        <Collapse.Panel key="1" header={<div>{translateData.footerSection.footer}</div>} forceRender={true}>
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
                    name={[social.name, "url"]}
                    rules={[
                      {
                        required: mappedSocialNetwork.isActive,
                        message: translateData.footerSection.pleaseEnterSocialNetworkLink,
                      },
                      {
                        validator: (_, value) => {
                          if (value && value.length > 0 && !isValidHttpUrl(value)) {
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
                  <Form.Item name={[social.name, "isActive"]} className="flex-0" valuePropName="checked">
                    <Checkbox onChange={(value) => onCheckSocialLink(social.name, value.target.checked)}></Checkbox>
                  </Form.Item>

                  {/* Hidden values */}
                  <Form.Item name={[social.name, "id"]} hidden />
                </div>
              );
            })}
          </div>

          {/* Content */}
          <div className="footer__content">
            <h3>{translateData.footerSection.content}</h3>
            <div className="footer__content_editor">

              <FnbFroalaEditor value={socialContent} onChange={value => onChangeFooterContent(value)} />
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    );
  };

  return (
    <>
      <div className="create-email-campaign-template">
        <FnbPageHeader
          title={title}
          actionButtons={[
            {
              action: (
                <FnbAddNewButton
                  idControl="btn-create-email-campaign"
                  onClick={onClickUpdateEmailCampaign}
                  text={translateData.update}
                />
              ),
              permission: PermissionKeys.EDIT_EMAIL_CAMPAIGN,
            },
            {
              action: <CancelButton onOk={history.goBack} />,
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

            <Form
              form={form}
              className="general-campaign-email-form customize-email-template"
              layout="vertical"
              autoComplete="off"
              onFieldsChange={() => setIsChangeForm(true)}
            >
              {/* General tab */}
              {currentTab === tab.general && (
                <>
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
                      />
                    </Form.Item>
                  </FnbCard>

                  {/* Card email information */}
                  <FnbCard title={translateData.generalTab.emailInformationTitle} className="pt-3 margin-top-24">
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
                          name={"customerSegmentIds"}
                          rules={[
                            {
                              required: true,
                              message: translateData.generalTab.customerGroupRequiredMessage,
                            },
                            {
                              validator: () => {
                                if (showLimitEmailValidate) {
                                  return Promise.reject(t(translateData.limitSendEmailMessage, { emailLimit }));
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
                            onChange={(e) => onUpdateCustomerSegment(e, customerSegmentInStore)}
                            className={`fnb-select-multiple-customer-segment dont-show-item`}
                            popupClassName="fnb-select-multiple-dropdown"
                            suffixIcon={<ArrowDown />}
                            menuItemSelectedIcon={<CheckboxCheckedIcon />}
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
                            {customerSegmentInStore?.map((item) => (
                              <Select.Option key={item.id} value={item.id}>
                                {item.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {showCountCustomerSegment && (
                          <div
                            className="selected-customer-segment"
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
                          <Input className="fnb-input" placeholder={translateData.generalTab.emailAddressPlaceholder} />
                        </Form.Item>
                      </>
                    )}
                  </FnbCard>
                </>
              )}

              {/* Customize tab */}
              {currentTab === tab.customize && (
                <Row gutter={[24, 24]} className="mt-2">
                  <Col span={24}>{renderGeneralSetting()}</Col>
                  <Col span={24}>{renderHeader()}</Col>
                  <Col span={24}>
                    {
                      <ContentEmailCampaign
                        currentEmailTemplateData={currentEmailTemplateData}
                        onChange={(data) => onChangeContentEmailCampaign(data)}
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
              )}

              {/* Hidden values */}
              <EditEmailCampaignHiddenValuesComponent defaultSocialLinks={DefaultSocialLinks} />
            </Form>
          </Col>

          <Col span={12}>
            <EmailCampaignTemplate onClickSession={onClickSession} ref={emailTemplateRef} />
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
        cancelButtonProps={{ style: { display: "none" } }}
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
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
