import { useHistory, useRouteMatch } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import emailCampaignDataService from "data-services/email-campaign/email-campaign-data.service";
import customerSegmentDataService from "data-services/customer-segment/customer-segment-data.service";
import { COLOR } from "constants/default.constants";
import {
  convertUtcToLocalTime,
  formatDate,
  formatTextNumber,
  isValidHttpUrl,
} from "utils/helpers";
import { DateFormat } from "constants/string.constants";
import {
  EmailCampaignSocial,
  EmailCampaignType,
} from "constants/email-campaign.constants";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { Button, Card, Col, Row } from "antd";
import "./view-email-campaign.style.scss";
import OverviewWidget from "components/overview-widget/overview-widget.component";
import widgetPurple from "assets/images/widget-purple.png";
import widgetRed from "assets/images/widget-red.png";
import widgetBlue from "assets/images/widget-blue.png";
import widgetGreen from "assets/images/widget-green.png";
import {
  DateTimePickerIcon,
  FailedSentWidgetIcon,
  ResentSuccessWidgetIcon,
  SuccessSentWidgetIcon,
  TotalSentWidgetIcon,
} from "constants/icons.constants";
import { EmailCampaignSendingDetailComponent } from "./email-campaign-sending-detail.component";
import { EmailCampaignTemplate } from "../components/email-campaign-template.component";

export default function ViewEmailCampaignPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const isMaxWidth500 = useMediaQuery({ maxWidth: 500 });
  const sendingDetailRef = useRef();
  const emailTemplateRef = useRef();

  const [showModalSendingDetail, setShowModalSendingDetail] = useState(false);
  const [title, setTitle] = useState("");
  const [totalSent, setTotalSent] = useState(0);
  const [successfullySent, setSuccessfullySent] = useState(0);
  const [resentSuccessfully, setResentSuccessfully] = useState(0);
  const [failedSent, setFailedSent] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalEmail, setTotalEmail] = useState(0);
  const [totalSegment, setTotalSegment] = useState(0);

  const emailCampaignDetailPosition = {
    MAIN_PRODUCT: 1,
    FIRST_SUB_PRODUCT: 2,
    SECOND_SUB_PRODUCT: 3,
  };

  const rootUrl = process.env.REACT_APP_URL;

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

  const [currentEmailTemplateData, setCurrentEmailTemplateData] =
    useState(templateObjective);

  const translateData = {
    btnCancel: t("button.cancel"),
    btnLeave: t("button.leave"),
    btnEdit: t("button.edit"),
    btnSave: t("button.save"),
    update: t("button.update", "Update"),
    color: t("emailCampaign.color", "Color"),
    primaryColor: t("emailCampaign.primaryColor", "Primary color"),
    secondaryColor: t("emailCampaign.secondaryColor", "Secondary color"),
    reset: t("emailCampaign.reset", "Reset"),
    createEmailCampaign: t(
      "emailCampaign.createEmailCampaign",
      "Create Email campaign"
    ),
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
      pleaseEnterSocialNetworkLink: t(
        "emailCampaign.pleaseEnterSocialNetworkLink",
        "Please enter social network link"
      ),
      invalidSocialNetworkLink: t(
        "emailCampaign.invalidSocialNetworkLink",
        "Invalid social network link"
      ),
      content: t("emailCampaign.content", "Content"),
    },
    generalTab: {
      generalInformationTitle: t(
        "marketing.emailCampaign.generalTab.generalInformationTitle"
      ),
      emailInformationTitle: t(
        "marketing.emailCampaign.generalTab.emailInformationTitle"
      ),
      fieldName: t("marketing.emailCampaign.generalTab.fieldName"),
      campaignDescription: t(
        "marketing.emailCampaign.generalTab.campaignDescription"
      ),
      sendingTime: t("marketing.emailCampaign.generalTab.sendingTime"),
      subject: t("marketing.emailCampaign.generalTab.subject"),
      sendTo: t("marketing.emailCampaign.generalTab.sendTo"),
      emailAddress: t("marketing.emailCampaign.generalTab.emailAddress"),
      customerGroup: t("marketing.emailCampaign.generalTab.customerGroup"),
      nameRequiredMessage: t(
        "marketing.emailCampaign.generalTab.nameRequiredMessage"
      ),
      sendingTimeRequiredMessage: t(
        "marketing.emailCampaign.generalTab.sendingTimeRequiredMessage"
      ),
      subjectRequiredMessage: t(
        "marketing.emailCampaign.generalTab.subjectRequiredMessage"
      ),
      sendToRequiredMessage: t(
        "marketing.emailCampaign.generalTab.sendToRequiredMessage"
      ),
      emailAddressRequiredMessage: t(
        "marketing.emailCampaign.generalTab.emailAddressRequiredMessage"
      ),
      customerGroupRequiredMessage: t(
        "marketing.emailCampaign.generalTab.customerGroupRequiredMessage"
      ),
      namePlaceholder: t("marketing.emailCampaign.generalTab.namePlaceholder"),
      campaignDescriptionPlaceholder: t(
        "marketing.emailCampaign.generalTab.campaignDescriptionPlaceholder"
      ),
      sendingTimePlaceholder: t(
        "marketing.emailCampaign.generalTab.sendingTimePlaceholder"
      ),
      subjectPlaceholder: t(
        "marketing.emailCampaign.generalTab.subjectPlaceholder"
      ),
      sendToPlaceholder: t(
        "marketing.emailCampaign.generalTab.sendToPlaceholder"
      ),
      emailAddressPlaceholder: t(
        "marketing.emailCampaign.generalTab.emailAddressPlaceholder"
      ),
      customerGroupPlaceholder: t(
        "marketing.emailCampaign.generalTab.customerGroupPlaceholder"
      ),
      invalidEmailAddress: t(
        "marketing.emailCampaign.generalTab.invalidEmailAddress"
      ),
      btnIGotIt: t("marketing.emailCampaign.generalTab.btnIGotIt"),
      titleDialogSendingTime: t(
        "marketing.emailCampaign.generalTab.titleDialogSendingTime"
      ),
      createSuccessfullyMessage: t(
        "marketing.emailCampaign.generalTab.createSuccessfullyMessage"
      ),
      createIsNotSuccessfullyMessage: t(
        "marketing.emailCampaign.generalTab.createIsNotSuccessfullyMessage"
      ),
      tabRequiredMessage: t(
        "marketing.emailCampaign.generalTab.tabRequiredMessage"
      ),
      updateSuccessfullyMessage: t(
        "marketing.emailCampaign.generalTab.updateSuccessfullyMessage"
      ),
      updateFailMessage: t(
        "marketing.emailCampaign.generalTab.updateFailMessage"
      ),
      sendToEmailAddress: t("marketing.emailCampaign.sendToEmailAddress"),
      sendToCustomerGroup: t("marketing.emailCampaign.sendToCustomerGroup"),
    },
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    maximum1000Characters: t("form.maximum1000Characters"),
    summary: {
      title: t("marketing.emailCampaign.summary.title"),
      viewDetail: t("marketing.emailCampaign.summary.viewDetail"),
      totalSent: t("marketing.emailCampaign.summary.totalSent"),
      successSent: t("marketing.emailCampaign.summary.successSent"),
      resentSuccessfully: t(
        "marketing.emailCampaign.summary.resentSuccessfully"
      ),
      failedSent: t("marketing.emailCampaign.summary.failedSent"),
    },
  };

  useEffect(() => {
    async function fetchData() {
      await getInitDataAsync(match?.params?.emailCampaignId);
    }
    fetchData();
  }, []);

  const getInitDataAsync = async (emailCampaignId) => {
    if (emailCampaignId) {
      let promises = [];
      promises.push(
        emailCampaignDataService.getEmailCampaignByIdAsync(emailCampaignId)
      );
      promises.push(
        customerSegmentDataService.getCustomerSegmentByStoreIdAsync()
      );
      const [emailCampaignDataResponse, customerSegmentDataResponse] =
        await Promise.all(promises);

      if (emailCampaignDataResponse) {
        const {
          emailCampaign,
          failedSent,
          resentSuccessfully,
          successfullySent,
          totalSent,
        } = emailCampaignDataResponse;
        setTotalSent(totalSent);
        setSuccessfullySent(successfullySent);
        setResentSuccessfully(resentSuccessfully);
        setFailedSent(failedSent);

        const { emailCampaignDetails, emailCampaignSocials } = emailCampaign;
        const mainProduct = emailCampaignDetails?.find(
          (x) => x.position === emailCampaignDetailPosition.MAIN_PRODUCT
        );
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
            mainProduct.thumbnail ??
            `${rootUrl}/images/default-email-template/main-product.jpg`;
          currentTemplate.mainProductTitle = mainProduct.title;
          currentTemplate.mainProductDescription = mainProduct.description;
          currentTemplate.mainProductButton = mainProduct.buttonName;
          currentTemplate.mainProductUrl = mainProduct.buttonLink;
        }

        if (firstSubProduct) {
          currentTemplate.firstSubProductId = firstSubProduct.id;
          currentTemplate.firstSubProductImage =
            firstSubProduct.thumbnail ??
            `${rootUrl}/images/default-email-template/first-sub-product.jpg`;
          currentTemplate.firstSubProductTitle = firstSubProduct.title;
          currentTemplate.firstSubProductDescription =
            firstSubProduct.description;
          currentTemplate.firstSubProductButton = firstSubProduct.buttonName;
          currentTemplate.firstSubProductUrl = firstSubProduct.buttonLink;
        }

        if (secondSubProduct) {
          currentTemplate.secondSubProductId = secondSubProduct.id;
          currentTemplate.secondSubProductImage =
            secondSubProduct.thumbnail ??
            `${rootUrl}/images/default-email-template/main-product.jpg`;
          currentTemplate.secondSubProductTitle = secondSubProduct.title;
          currentTemplate.secondSubProductDescription =
            secondSubProduct.description;
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
        const tiktok = emailCampaignSocials?.find(
          (x) => x.enumEmailCampaignSocialId === EmailCampaignSocial.Tiktok
        );
        const twitter = emailCampaignSocials?.find(
          (x) => x.enumEmailCampaignSocialId === EmailCampaignSocial.Twiter
        );
        const youtube = emailCampaignSocials?.find(
          (x) => x.enumEmailCampaignSocialId === EmailCampaignSocial.Youtube
        );

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
        setTitle(emailCampaign.name);

        if (customerSegmentDataResponse) {
          onUpdateCustomerSegment(
            emailCampaign.customerSegmentIds,
            customerSegmentDataResponse
          );
        }
      }
    }
  };

  const updateTemplate = (data) => {
    emailTemplateRef?.current?.setTemplate(data);
    setCurrentEmailTemplateData(data);
  };

  const onClickViewSendingDetail = () => {
    sendingDetailRef?.current?.fetchData(match?.params?.emailCampaignId);
    setShowModalSendingDetail(true);
  };

  const onUpdateCustomerSegment = (values, customerSegmentInStore) => {
    let totalCustomerValue = 0;
    let totalEmailValue = 0;
    values?.forEach((value) => {
      const customerSegment = customerSegmentInStore?.find(
        (a) => a.id === value
      );
      totalEmailValue += customerSegment?.totalEmail;
      totalCustomerValue += customerSegment?.totalCustomer;
      setTotalCustomer(totalCustomerValue);
      setTotalEmail(totalEmailValue);
    });
    setTotalSegment(values?.length);
  };

  return (
    <>
      <FnbPageHeader
        title={title}
        actionButtons={[
          {
            action: (
              <Button
                type="primary"
                onClick={history.goBack}
                className="button-edit-qr-code"
              >
                {translateData.btnLeave}
              </Button>
            ),
          },
        ]}
      />

      {/* Overview widget */}
      <div className="card-email-campaign-detail">
        <div className="d-flex justify-space-between w-100">
          <div className="title-session">
            <span>{translateData.summary.title}</span>
          </div>
          <div
            className="view-detail-text ml-auto cursor-pointer"
            onClick={onClickViewSendingDetail}
          >
            <span>{translateData.summary.viewDetail}</span>
          </div>
        </div>

        {isMaxWidth500 ? (
          <div>
            <OverviewWidget
              backgroundImage={widgetPurple}
              widgetIcon={<TotalSentWidgetIcon />}
              amount={formatTextNumber(totalSent)}
              description={translateData.summary.totalSent}
            />
            <OverviewWidget
              backgroundImage={widgetGreen}
              widgetIcon={<SuccessSentWidgetIcon />}
              amount={formatTextNumber(successfullySent)}
              className="mt-24"
              description={translateData.summary.successSent}
            />
            <OverviewWidget
              backgroundImage={widgetBlue}
              widgetIcon={<ResentSuccessWidgetIcon />}
              amount={formatTextNumber(resentSuccessfully)}
              className="mt-24"
              description={translateData.summary.resentSuccessfully}
            />
            <OverviewWidget
              backgroundImage={widgetRed}
              widgetIcon={<FailedSentWidgetIcon />}
              amount={formatTextNumber(failedSent)}
              className="mt-24"
              description={translateData.summary.failedSent}
            />
          </div>
        ) : (
          <Row gutter={[36, 36]}>
            <Col xs={24} md={12} xl={6}>
              <OverviewWidget
                backgroundImage={widgetPurple}
                widgetIcon={<TotalSentWidgetIcon />}
                amount={formatTextNumber(totalSent)}
                description={translateData.summary.totalSent}
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <OverviewWidget
                backgroundImage={widgetGreen}
                widgetIcon={<SuccessSentWidgetIcon />}
                amount={formatTextNumber(successfullySent)}
                description={translateData.summary.successSent}
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <OverviewWidget
                backgroundImage={widgetBlue}
                widgetIcon={<ResentSuccessWidgetIcon />}
                amount={formatTextNumber(resentSuccessfully)}
                description={translateData.summary.resentSuccessfully}
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <OverviewWidget
                backgroundImage={widgetRed}
                widgetIcon={<FailedSentWidgetIcon />}
                amount={formatTextNumber(failedSent)}
                description={translateData.summary.failedSent}
              />
            </Col>
          </Row>
        )}
      </div>

      <Row gutter={[54, 54]} className={isMaxWidth500 ? "mt-36" : "mt-48"}>
        <Col xl={12} md={24}>
          {/* General information */}
          <Card className="fnb-card card-email-campaign-detail">
            <div className="title-session">
              <span>{translateData.generalTab.generalInformationTitle}</span>
            </div>
            <Row>
              <Col span={24}>
                <div className="text-container">
                  <p className="text-label">
                    {translateData.generalTab.fieldName}
                  </p>
                  <p className="text-detail">
                    {currentEmailTemplateData?.name}
                  </p>
                </div>
              </Col>
              <Col span={24}>
                <div className="text-container">
                  <p className="text-label">
                    {translateData.generalTab.campaignDescription}
                  </p>
                  <p className="text-detail">
                    {currentEmailTemplateData?.description}
                  </p>
                </div>
              </Col>
              <Col span={24}>
                <div className="text-container">
                  <p className="text-label">
                    {translateData.generalTab.sendingTime}
                  </p>
                  <p className="text-detail d-flex-align-center">
                    <span>
                      <DateTimePickerIcon />
                    </span>
                    <span className="ml-16">
                      {formatDate(
                        currentEmailTemplateData?.sendingTime,
                        DateFormat.HH_MM
                      )}
                    </span>
                    <span className="ml-20">
                      {formatDate(
                        currentEmailTemplateData?.sendingTime,
                        DateFormat.DD_MM_YYYY
                      )}
                    </span>
                  </p>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Email information */}
          <Card className="fnb-card card-email-campaign-detail mt-24">
            <div className="title-session">
              <span>{translateData.generalTab.emailInformationTitle}</span>
            </div>
            <Row>
              <Col span={24}>
                <div className="text-container">
                  <p className="text-label">
                    {translateData.generalTab.subject}
                  </p>
                  <p className="text-detail">
                    {currentEmailTemplateData?.emailSubject}
                  </p>
                </div>
              </Col>
              <Col span={24}>
                <div className="text-container">
                  <p className="text-label">
                    {translateData.generalTab.sendTo}
                  </p>
                  <p className="text-detail">
                    {currentEmailTemplateData?.emailCampaignType ===
                    EmailCampaignType.SendToEmailAddress
                      ? translateData.generalTab.sendToEmailAddress
                      : translateData.generalTab.sendToCustomerGroup}
                  </p>
                </div>
              </Col>

              {currentEmailTemplateData?.emailCampaignType ===
                EmailCampaignType.SendToEmailAddress && (
                <Col span={24}>
                  <div className="text-container">
                    <p className="text-label">
                      {translateData.generalTab.emailAddress}
                    </p>
                    <p className="text-detail">
                      {currentEmailTemplateData?.emailAddress}
                    </p>
                  </div>
                </Col>
              )}

              {currentEmailTemplateData?.emailCampaignType ===
                EmailCampaignType.SendToCustomerGroup && (
                <Col span={24}>
                  <div className="text-container">
                    <p className="text-label">
                      {translateData.generalTab.customerGroup}
                    </p>
                    <div
                      className="selected-customer-group"
                      dangerouslySetInnerHTML={{
                        __html: `${t(
                          "marketing.emailCampaign.generalTab.customerSegmentSelected",
                          {
                            totalSegment: totalSegment,
                            totalCustomer: totalCustomer,
                            totalEmail: totalEmail,
                          }
                        )}`,
                      }}
                    ></div>
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
        <Col xl={12} md={24}>
          <EmailCampaignTemplate ref={emailTemplateRef} />
        </Col>
      </Row>

      {/* Sending detail */}
      <EmailCampaignSendingDetailComponent
        t={t}
        ref={sendingDetailRef}
        emailCampaignDataService={emailCampaignDataService}
        showModalSendingDetail={showModalSendingDetail}
        onCancel={() => setShowModalSendingDetail(false)}
      />
    </>
  );
}
