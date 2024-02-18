import { Checkbox, Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import productDataService from "../../../../data-services/product-data.service";
import { LockMultipleCalls } from "../../../../services/promotion.services";
import { BucketGeneralCustomizeIcon, TodayMenuStoreWebIcon } from "../../../assets/icons.constants";
import CustomizationCollapseBlock from "../../../components/customization-block-component/customization-block.page";
import { FnbInput } from "../../../components/fnb-input/fnb-input.component";
import { FnbSelectMultiple } from "../../../components/fnb-select-multiple/fnb-select-multiple";
import SelectBackgroundComponent from "../../../components/select-background/select-background.component";
import SelectColorGroupComponent from "../../../components/select-color-group/select-color-group.component";
import { backgroundTypeEnum } from "../../../constants/store-web-page.constants";
import menuSpecialBgImgUrl from "../../../assets/images/menu_special_bg.png";

export function TodayMenuCustomization(props) {
  const { form, updateFormValues, onChange, clickToScroll } = props;
  const [t] = useTranslation();
  const [categories, setCategories] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [disableAllCategories, setDisableAllCategories] = useState(false);

  const pageData = {
    header: t("emailCampaign.header", "Header"),
    title: t("storeWebPage.menuSpecialTitle"),
    menuSpecial: t("storeWebPage.menuSpecial"),
    todayMenuSpecial: t("storeWebPage.todayMenuSpecial"),
    category: t("material.filter.category.title"),
    allCategory: t("material.filter.category.all"),
    selectCategoryValidateMessage: t("storeWebPage.selectCategoryValidateMessage"),
    selectCategoryPlaceholder: t("storeWebPage.selectCategoryPlaceholder"),
    maxSizeUploadMb: 20,
    todayMenu: t("storeWebPage.todayMenuTitle"),
    generalCustomizationTitle: t("storeWebPage.banner.generalCustomizationTitle"),
  };

  useEffect(() => {
    if (updateFormValues) {
      updateFormValues();
    }
    setInitFormValue();
  }, []);

  const setInitFormValue = async () => {
    LockMultipleCalls(async () => {
      setDisableAllCategories(form.getFieldsValue()?.config?.todayMenu?.isCheckAllCategory);
      const res = await productDataService.getProductCategoriesStoreTheme();
      if (res) {
        setCategories(res?.data?.productCategories);
      }
    }, "Lock_setInitFormValue");
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
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        window.oldElements = elementId;
      }
    } catch {}
  };
  //#region On change
  const onChangeBackgroundType = (value) => {
    let changedValue = {
      key: [],
      value: null,
    };
    if (value === backgroundTypeEnum.Image) {
      changedValue.key = ["config", "todayMenu", "generalCustomization", "backgroundColor"];
    } else {
      changedValue.key = ["config", "todayMenu", "generalCustomization", "backgroundImage"];
    }

    if (onChange) {
      onChange(changedValue);
    }
  };

  const onSelectAllCategory = (e) => {
    const isChecked = e.target.checked;
    setSelectedValues([]);
    setDisableAllCategories(isChecked);
  };

  //#endregion

  //#region Render today menu

  const renderSelectCategory = () => {
    return (
      <Row className="mt-16">
        <Col span={8}>
          <h3>{pageData.category}</h3>
        </Col>
        <Col span={16} className="text-right">
          <Form.Item name={["config", "todayMenu", "isCheckAllCategory"]} valuePropName="checked">
            <Checkbox onChange={(e) => onSelectAllCategory(e)}>{pageData.allCategory}</Checkbox>
          </Form.Item>
        </Col>
        <Col span={24} hidden={disableAllCategories}>
          <Form.Item name={["config", "todayMenu", "productCategoryIds"]}>
            <FnbSelectMultiple
              placeholder={pageData.selectCategoryPlaceholder}
              defaultValue={selectedValues}
              className="w-100"
              allowClear
              option={categories?.map((item) => ({
                id: item?.id,
                name: item?.name,
              }))}
            ></FnbSelectMultiple>
          </Form.Item>
        </Col>
        <Col span={24} hidden={!disableAllCategories}>
          <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
        </Col>
      </Row>
    );
  };

  const renderTodayMenu = () => {
    return (
      <Row>
        {/* Header */}
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{pageData.header}</h3>
          <Form.Item name={["config", "todayMenu", "headerText"]}>
            <FnbInput showCount placeholder={pageData.menuSpecial} maxLength={100} allowClear />
          </Form.Item>
        </Col>

        {/* Title */}
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{pageData.title}</h3>
          <Form.Item name={["config", "todayMenu", "titleText"]}>
            <FnbInput showCount placeholder={pageData.todayMenuSpecial} maxLength={255} allowClear />
          </Form.Item>
        </Col>

        {/* Category */}
        <Col span={24}>{renderSelectCategory()}</Col>
      </Row>
    );
  };

  const renderGeneralCustomization = () => {
    return (
      <Row className="mt-2">
        <Col span={24} className="size-general">
          <SelectBackgroundComponent
            {...props}
            backgroundCustomize={form.getFieldsValue()?.config?.todayMenu?.generalCustomization}
            formItemPreName={["config", "todayMenu", "generalCustomization"]}
            onChangeBackgroundType={onChangeBackgroundType}
            defaultImage={menuSpecialBgImgUrl}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config", "todayMenu", "generalCustomization"]} />
        </Col>
      </Row>
    );
  };

  const groupCollapseTodayMenu = [
    {
      title: pageData.generalCustomizationTitle,
      content: renderGeneralCustomization(),
      icon: <BucketGeneralCustomizeIcon />,
    },
    {
      title: pageData.todayMenu,
      content: renderTodayMenu(),
      icon: <TodayMenuStoreWebIcon />,
    },
  ];

  return (
    <div
      onClick={() => {
        removeOldFocusElement();

        setFocusElement(clickToScroll);
      }}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col sm={24} lg={24} className="w-100">
              {groupCollapseTodayMenu?.map((group, index) => {
                return (
                  <CustomizationCollapseBlock
                    title={group.title}
                    isNormal={true}
                    content={group.content}
                    defaultActiveKey={999}
                    icon={group.icon}
                  />
                );
              })}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
