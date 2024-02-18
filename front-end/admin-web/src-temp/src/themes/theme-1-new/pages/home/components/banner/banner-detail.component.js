import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  StoreBannerTrashIcon,
  StoreWebBannerGeneralCustomizationIcon,
  StoreWebBannerIcon,
} from "../../../../assets/icons.constants";
import CustomizationCollapseBlock from "../../../../components/customization-block-component/customization-block.page";
import CustomizationGroup from "../../../../components/customization-group-component/customization-group.page";
import { FnbAddNewButton } from "../../../../components/fnb-add-new-button/fnb-add-new-button";
import FnbSelectHyperlinkCustomize from "../../../../components/fnb-select-hyperlink-customize/fnb-select-hyperlink-customize";
import FnbUploadBackgroundImageCustomizeComponent from "../../../../components/fnb-upload-background-image-customize/fnb-upload-background-image-customize";
import SelectBackgroundComponent from "../../../../components/select-background.component";
import SelectColorGroupComponent from "../../../../components/select-color-group.component";
import { amountMaximumOfBanner, theme1ElementCustomize } from "../../../../constants/store-web-page.constants";

import "./banner.customize.component.scss";

export default function BannerCustomizeComponent(props) {
  const { form, prepareDataForHyperlink, updateFormValues, clickToScroll } = props;
  const { getFieldsValue } = form;
  const [t] = useTranslation();
  const translateData = {
    title: t("storeWebPage.banner.title"),
    generalCustomizationTitle: t("storeWebPage.banner.generalCustomizationTitle"),
    imageTitle: t("storeWebPage.banner.imageTitle"),
    hyperlink: t("storeWebPage.banner.hyperlink"),
    btnAddNewBanner: t("storeWebPage.banner.btnAddNewBanner"),
    dynamic: {
      url: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.url.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.url.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.url.validation"),
      },
      blog: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.blog.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.blog.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.blog.validation"),
      },
      product: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.product.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.product.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.product.validation"),
      },
      category: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.category.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.category.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.category.validation"),
      },
      page: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.page.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.page.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.page.validation"),
      },
      subMenu: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.subMenu.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.subMenu.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.subMenu.validation"),
      },
    },
    bannerDefaultTitle: t("storeWebPage.banner.bannerDefaultTitle"),
    bannerImageRequiredMessage: t("storeWebPage.banner.bannerImageRequiredMessage"),
    hyperlinkTypePlaceholder: t("storeWebPage.banner.selectLinkType"),
  };

  const newBanner = {
    hyperlinkType: null,
    hyperlinkValue: null,
    imageUrl: null,
  };

  useEffect(() => {
    if (updateFormValues) {
      updateFormValues();
    }
  }, []);

  const renderGeneralCustomizationGroup = () => {
    return (
      <>
        <SelectBackgroundComponent
          {...props}
          formItemPreName={["config", "banner"]}
          backgroundCustomize={getFieldsValue()?.config?.banner}
          bestDisplay={"1269 x 778 px"}
        />
        <SelectColorGroupComponent {...props} formItemPreName={["config", "banner"]} />
      </>
    );
  };

  const onChangeHyperlink = (e, index) => {
    const changedValue = {
      key: ["config", "banner", "bannerList", index, "hyperlinkValue"],
      value: null,
    };

    if (props.onChange) {
      props.onChange(changedValue);
    }
  };

  const renderBannerGroupItem = (field, index) => {
    let bannerGroupItem = (
      <>
        <Row>
          <Col span={24}>
            <span className="label-banner-field">{translateData.imageTitle}</span>
          </Col>
          <Col span={24}>
            <Form.Item
              name={[field.name, "imageUrl"]}
              rules={[
                {
                  required: true,
                  message: translateData.bannerImageRequiredMessage,
                },
              ]}
            >
              <FnbUploadBackgroundImageCustomizeComponent bestDisplay={"1269 x 778 px"} maxSizeUploadMb={20} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="banner-field-margin-top">
          <Col span={24}>
            <FnbSelectHyperlinkCustomize
              showSearch
              allowClear
              fixed={false}
              placeholder={translateData.hyperlinkTypePlaceholder}
              onChangeHyperlinkType={(e) => onChangeHyperlink(e, index)}
              formItemHyperlinkTypePath={[field.name, "hyperlinkType"]}
              formItemHyperlinkValuePath={[field.name, "hyperlinkValue"]}
              prepareDataForHyperLink={prepareDataForHyperlink}
              defaultValue={getFieldsValue()?.config?.banner?.bannerList[index]?.hyperlinkType}
            />
          </Col>
        </Row>
      </>
    );
    return bannerGroupItem;
  };

  const removeOldFocusElement = () => {
    // Remove old focus
    let oldElementId = window.oldElements;
    const oldElement = document.querySelector(oldElementId);
    if (oldElement) {
      oldElement.className = "";
    }
  };

  const setFocusElement = (elementId) => {
    try {
      const element = document.querySelector(elementId);
      if (element) {
        // set border element on focused
        element.className = "tc-on-focus";
        element.scrollIntoView({ behavior: "smooth" });
        window.oldElements = elementId;
      }
    } catch {}
  };

  const renderBannerGroup = () => {
    return (
      <Form.List name={["config", "banner", "bannerList"]}>
        {(fields, { add, remove }, { errors }) => {
          return (
            <>
              {fields.map((field, index) => {
                return (
                  <>
                    {
                      <CustomizationGroup
                        title={
                          index <= 0
                            ? translateData.bannerDefaultTitle
                            : t(`storeWebPage.banner.bannerDefaultIndexTitle`, { index: index })
                        }
                        isNormal={true}
                        defaultActiveKey={"1"}
                        content={renderBannerGroupItem(field, index)}
                        icon={index <= 0 ? <></> : <StoreBannerTrashIcon />}
                        className="group-banner-detail"
                        customizeKey={`${theme1ElementCustomize.Banner}-item-${index}`}
                        isShowRightIconWhenHoverMouse={true}
                        onClickIconRight={() => remove(field.name)}
                        titleIconRight={t("storeWebPage.banner.iconDeleteTooltip", { index: index })}
                      ></CustomizationGroup>
                    }
                  </>
                );
              })}

              <FnbAddNewButton
                disabled={form.getFieldsValue()?.config?.banner?.bannerList?.length >= amountMaximumOfBanner}
                onClick={() => add({ ...newBanner })}
                text={translateData.btnAddNewBanner}
                className="btn-add-new-banner"
              />
            </>
          );
        }}
      </Form.List>
    );
  };

  return (
    <div
      onClick={() => {
        removeOldFocusElement();
        setFocusElement(clickToScroll);
      }}
    >
      <div className="banner-detail-content">
        <div className="banner-detail-body">
          <CustomizationCollapseBlock
            icon={<StoreWebBannerGeneralCustomizationIcon></StoreWebBannerGeneralCustomizationIcon>}
            title={translateData.generalCustomizationTitle}
            isNormal={true}
            content={renderGeneralCustomizationGroup()}
            defaultActiveKey={1}
            isShowKey={true}
            className="banner-detail-body-general"
          ></CustomizationCollapseBlock>

          <CustomizationCollapseBlock
            icon={<StoreWebBannerIcon></StoreWebBannerIcon>}
            title={translateData.title}
            isNormal={true}
            content={renderBannerGroup()}
            defaultActiveKey={1}
            isShowKey={true}
            className="banner-detail-body-content"
          ></CustomizationCollapseBlock>
        </div>
      </div>
    </div>
  );
}
