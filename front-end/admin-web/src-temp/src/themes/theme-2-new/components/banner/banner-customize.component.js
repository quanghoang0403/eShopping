import { Form } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StoreBannerTrashIcon,
  StoreWebBannerGeneralCustomizationIcon,
  StoreWebBannerIcon,
} from "../../assets/icons.constants";
import { HYPERLINK_SELECT_OPTION, Hyperlink } from "../../constants/hyperlink.constants";
import { backgroundTypeEnum } from "../../constants/store-web-page.constants";
import { amountMaximumOfBanner } from "../../constants/string.constant";
import CustomizationCollapseBlock from "../customization-block-component/customization-block.page";
import CustomizationGroup from "../customization-group-component/customization-group.page";
import { FnbAddNewButton } from "../fnb-add-new-button/fnb-add-new-button";
import FnbSelectHyperlinkCustomize from "../fnb-select-hyperlink-customize/fnb-select-hyperlink-customize";
import FnbUploadBackgroundImageCustomizeComponent from "../fnb-upload-background-image-customize/fnb-upload-background-image-customize";
import SelectBackgroundComponent from "../select-background/select-background.component";
import SelectColorGroupComponent from "../select-color-group/select-color-group.component";
import "./banner-customize.component.scss";

export default function BannerCustomizeComponent(props) {
  const { form, clickToScroll, prepareDataForHyperlink, updateFormValues, onChange } = props;
  const { getFieldsValue } = form;
  const [t] = useTranslation();
  useEffect(() => {
    setTimeout(() => {
      setFocusElement(clickToScroll);
    }, 100);
  }, []);
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
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        window.oldElements = elementId;
      }
    } catch {}
  };
  const translateData = {
    title: t("storeWebPage.banner.bannerCustomiztion"),
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
  const [hyperlinkSelectOptions, setHyperlinkSelectOptions] = useState(() => {
    let hyperlinkOptions = HYPERLINK_SELECT_OPTION.filter((a) => a.id !== Hyperlink.SUB_MENU);
    return hyperlinkOptions;
  });
  const newBanner = {
    imageUrl: "/images/default-theme/theme2-banner-default.png",
    hyperlinkType: null,
    hyperlinkValue: null,
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
          onChangeBackgroundType={onChangeBackgroundType}
        />
        <SelectColorGroupComponent {...props} formItemPreName={["config", "banner"]} />
      </>
    );
  };

  const onChangeHyperlink = (id, index) => {
    const changedValue = {
      key: ["config", "banner", "bannerList", index, "hyperlinkValue"],
      value: null,
    };
    if (onChange) {
      onChange(changedValue);
    }
  };
  const onChangeHyperlinkValue = (id, index) => {
    const changedValue = {
      key: ["config", "banner", "bannerList", index, "hyperlinkValue"],
      value: id,
    };
    if (onChange) {
      onChange(changedValue);
    }
  };

  const onChangeBackgroundType = (value) => {
    let changedValue = {
      key: [],
      value: null,
    };
    if (value === backgroundTypeEnum.IMAGE) {
      changedValue.key = ["config", "banner", "backgroundColor"];
    } else {
      changedValue.key = ["config", "banner", "backgroundImage"];
    }

    if (onChange) {
      onChange(changedValue);
    }
  };

  return (
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
          clickToScroll={clickToScroll}
        ></CustomizationCollapseBlock>

        <Form.List name={["config", "banner", "bannerList"]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              <CustomizationCollapseBlock
                icon={<StoreWebBannerIcon></StoreWebBannerIcon>}
                title={translateData.title}
                clickToScroll={clickToScroll}
                isNormal={true}
                content={
                  <>
                    {fields.map((field, index) => {
                      return (
                        <>
                          <CustomizationGroup
                            title={
                              index <= 0
                                ? translateData.bannerDefaultTitle
                                : t(`storeWebPage.banner.bannerDefaultIndexTitle`, { index: index })
                            }
                            isNormal={true}
                            content={
                              <>
                                <h4 className="fnb-form-label mt-36">
                                  {translateData.imageTitle}
                                  <span className="text-danger">*</span>
                                </h4>
                                <Form.Item
                                  name={[field.name, "imageUrl"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: translateData.bannerImageRequiredMessage,
                                    },
                                  ]}
                                >
                                  <FnbUploadBackgroundImageCustomizeComponent
                                    bestDisplay={"1920 x 760px"}
                                    maxSizeUploadMb={20}
                                  />
                                </Form.Item>
                                <div className="hyperlink-group">
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
                                    onChangeHyperlinkValue={(e) => onChangeHyperlinkValue(e, index)}
                                    defaultValueForHyperlinkValue={getFieldsValue()?.config?.banner?.bannerList[index]?.hyperlinkValue}
                                  />
                                </div>
                              </>
                            }
                            icon={index <= 0 ? <></> : <StoreBannerTrashIcon />}
                            className="group-banner-detail"
                            clickToScroll={clickToScroll}
                            isShowRightIconWhenHoverMouse={true}
                            onClickIconRight={() => remove(field.name)}
                            titleIconRight={t("storeWebPage.banner.iconDeleteTooltip", { index: index })}
                          ></CustomizationGroup>
                        </>
                      );
                    })}
                  </>
                }
                defaultActiveKey={1}
                isShowKey={true}
                className="banner-detail-body-content"
              ></CustomizationCollapseBlock>

              <FnbAddNewButton
                disabled={form.getFieldsValue()?.config?.banner?.bannerList?.length >= amountMaximumOfBanner}
                onClick={() => add({ ...newBanner })}
                text={translateData.btnAddNewBanner}
                className="btn-add-new-banner"
              />
            </>
          )}
        </Form.List>
      </div>
    </div>
  );
}
