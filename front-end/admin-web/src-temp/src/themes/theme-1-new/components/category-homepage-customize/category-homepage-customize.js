import { Form } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BucketGeneralCustomizeIcon, CategoryHomepageIcon, StoreBannerTrashIcon } from "../../assets/icons.constants";
import CustomizationGroup from "../../components/customization-group-component/customization-group.page";
import SelectBackgroundComponent from "../../components/select-background.component";
import SelectColorGroupComponent from "../../components/select-color-group.component";
import { Hyperlink, HYPERLINK_SELECT_OPTION } from "../../constants/hyperlink.constants";
import PageType from "../../constants/page-type.constants";
import defaultConfig from "../../default-store.config";
import CustomizationCollapseBlock from "../customization-block-component/customization-block.page";
import { FnbAddNewButton } from "../fnb-add-new-button/fnb-add-new-button";
import { FnbInput } from "../fnb-input/fnb-input.component";
import FnbSelectHyperlinkCustomize from "../fnb-select-hyperlink-customize/fnb-select-hyperlink-customize";
import FnbUploadBackgroundImageCustomizeComponent from "../fnb-upload-background-image-customize/fnb-upload-background-image-customize";
import "./category-homepage-customize.scss";

export default function CategoryHomepageCustomization(props) {
  const { form, prepareDataForHyperlink, onChange, updateFormValues, clickToScroll } = props;
  const { getFieldsValue } = form;
  const [t] = useTranslation();
  const defaultBestDisplay = "80 x 80px";
  const maxSizeUploadMb = 20;
  const amountMaximumOfCategory = 20;

  const translateData = {
    category: t("form.category", "Category"),
    categoryCustomization: t("storeWebPage.categoryCustomization", "Category customization"),
    titleCategory: t("storeWebPage.titleCategory", "Title category"),
    thumbnail: t("emailCampaign.thumbnail", "Thumbnail"),
    description: t("form.description", "Description"),
    buttonText: t("storeWebPage.buttonText", "Button text"),
    hyperlink: t("menuManagement.menuItem.hyperlink.title", "Hyperlink"),
    addCategory: t("storeWebPage.addCategory", "Add category"),
    generalCustomization: t("onlineStore.introductionConfiguration.generalCustomization", "General customization"),
    hyperlinkTypePlaceholder: t("storeWebPage.banner.selectLinkType"),
    enterDescription: t("emailCampaign.enterDescription", "Enter description"),
    enterCategoryName: t("materialCategory.enterCategoryName", "Enter category name"),
    enterTextForButton: t("storeWebPage.enterTextForButton", "Enter text for button"),
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadBackgroundImage"),
  };

  const initCategory = {
    thumbnail: null,
    title: "",
    description: "",
    buttonText: "",
    hyperlinkType: 6,
    hyperlinkValue: "#",
  };

  const defaultThemePageConfig = defaultConfig?.pages?.find((p) => p.id === PageType.HOME_PAGE);

  useEffect(() => {
    if (updateFormValues) {
      updateFormValues();
    }
  }, []);

  const [hyperlinkSelectOptions, setHyperlinkSelectOptions] = useState(() => {
    let hyperlinkOptions = HYPERLINK_SELECT_OPTION.filter((a) => a.id !== Hyperlink.SUB_MENU);
    return hyperlinkOptions;
  });

  const onChangeHyperlink = (e, index) => {
    const changedValue = {
      key: ["config", "category", "categoryList", index, "hyperlinkValue"],
      value: null,
    };

    if (onChange) {
      onChange(changedValue);
    }
  };

  const renderGeneralCustomization = () => {
    return (
      <>
        <SelectBackgroundComponent
          {...props}
          defaultColorPath="config.category.generalCustomization.backgroundColor"
          defaultConfig={defaultConfig}
          formItemPreName={["config", "category", "generalCustomization"]}
          backgroundCustomize={getFieldsValue()?.config?.category?.generalCustomization}
          defaultThemeColor={defaultThemePageConfig?.config?.category?.generalCustomization?.backgroundColor}
        />
        <SelectColorGroupComponent {...props} formItemPreName={["config", "category", "generalCustomization"]} />
      </>
    );
  };

  const renderCategoryGroup = () => {
    return (
      <Form.List name={["config", "category", "categoryList"]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key}>
                <CustomizationGroup
                  key={index}
                  title={`${translateData.category} ${index + 1}`}
                  isNormal={true}
                  defaultActiveKey={"1"}
                  content={renderCategoryItem(field, index)}
                  icon={<StoreBannerTrashIcon />}
                  className="group-banner-detail"
                  isShowRightIconWhenHoverMouse={true}
                  isShowTooltip={true}
                  onClickIconRight={() => {
                    remove(field.name);
                  }}
                  titleIconRight="Delete"
                ></CustomizationGroup>
              </div>
            ))}
            <FnbAddNewButton
              disabled={form.getFieldsValue()?.config?.category?.categoryList?.length >= amountMaximumOfCategory}
              onClick={() => add({ ...initCategory })}
              text={translateData.addCategory}
            />
          </>
        )}
      </Form.List>
    );
  };

  const renderCategoryItem = (field, index) => {
    return (
      <div className="category-homepage-collapse">
        <h3>{translateData.titleCategory}</h3>
        <Form.Item name={[field.name, "title"]}>
          <FnbInput showCount allowClear placeholder={translateData.enterCategoryName} maxLength={100} />
        </Form.Item>
        <h3>{translateData.thumbnail}</h3>
        <Form.Item
          name={[field.name, "thumbnail"]}
          rules={[
            {
              required: true,
              message: translateData.pleaseUploadBackgroundImage,
            },
          ]}
        >
          <FnbUploadBackgroundImageCustomizeComponent
            bestDisplay={defaultBestDisplay}
            maxSizeUploadMb={maxSizeUploadMb}
          />
        </Form.Item>
        <h3>{translateData.description}</h3>
        <Form.Item name={[field.name, "description"]}>
          <FnbInput showCount allowClear placeholder={translateData.enterDescription} maxLength={100} />
        </Form.Item>
        <h3>{translateData.buttonText}</h3>
        <Form.Item name={[field.name, "buttonText"]}>
          <FnbInput showCount allowClear placeholder={translateData.enterTextForButton} maxLength={100} />
        </Form.Item>
        <FnbSelectHyperlinkCustomize
          showSearch
          allowClear
          fixed={false}
          onChangeHyperlinkType={(e) => onChangeHyperlink(e, index)}
          placeholder={translateData.hyperlinkTypePlaceholder}
          option={hyperlinkSelectOptions}
          formItemHyperlinkTypePath={[field.name, "hyperlinkType"]}
          formItemHyperlinkValuePath={[field.name, "hyperlinkValue"]}
          prepareDataForHyperLink={prepareDataForHyperlink}
          defaultValue={getFieldsValue()?.config?.category?.categoryList[index]?.hyperlinkType}
          defaultValueForHyperlinkValue={getFieldsValue()?.config?.category?.categoryList[index]?.hyperlinkValue}
        />
      </div>
    );
  };

  const renderCategory = () => {
    return <>{renderCategoryGroup()}</>;
  };

  const groupCollapseCategoryHomepage = [
    {
      title: translateData.generalCustomization,
      content: renderGeneralCustomization(),
      onChangeEye: "#sGeneralCustomization",
      icon: <BucketGeneralCustomizeIcon />,
      defaultActiveKey: "1",
    },
    {
      title: translateData.categoryCustomization,
      content: renderCategory(),
      onChangeEye: "#sCategoryHomepage",
      icon: <CategoryHomepageIcon />,
      defaultActiveKey: "2",
    },
  ];

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

  return (
    <div
      onClick={() => {
        removeOldFocusElement();
        setFocusElement(clickToScroll);
      }}
    >
      {groupCollapseCategoryHomepage?.map((group, index) => {
        return (
          <CustomizationCollapseBlock
            title={group.title}
            isNormal={true}
            content={group.content}
            defaultActiveKey={[group.defaultActiveKey]}
            activeKey={group.defaultActiveKey === "1" && group.defaultActiveKey}
            icon={group.icon}
            className="customization-block-category"
          />
        );
      })}
    </div>
  );
}
