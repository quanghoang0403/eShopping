import { Col, Form, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, CheckedIcon } from "../../assets/icons.constants";
import { HYPERLINK_SELECT_OPTION, Hyperlink } from "../../constants/hyperlink.constants";
import { FnbSelectSingle } from "../fnb-select-single/fnb-select-single";

import "./fnb-select-hyperlink-customize.scss";

export default function FnbSelectHyperlinkCustomize({
  onChangeHyperlinkType,
  className,
  disabled,
  allowClear,
  showSearch,
  placeholder,
  dropdownRender,
  style,
  defaultValue,
  onSelect,
  fixed,
  option,
  listHeight,
  formItemHyperlinkTypePath = ["hyperlinkType"],
  formItemHyperlinkValuePath = ["hyperlinkValue"],
  prepareDataForHyperLink,
  onChangeHyperlinkValue,
  defaultValueForHyperlinkValue,
  form,
  fieldPreName,
}) {
  const [t] = useTranslation();
  const [hyperlinkOption, setHyperlinkOption] = useState(HYPERLINK_SELECT_OPTION);
  const [products, setProducts] = useState(prepareDataForHyperLink?.products);
  const [productCategories, setProductCategories] = useState(prepareDataForHyperLink?.productCategories);
  const [subMenus, setSubMenus] = useState(prepareDataForHyperLink?.subMenus);
  const [pages, setPages] = useState(prepareDataForHyperLink?.pages);
  const [hyperlinkValueLabel, setHyperlinkValueLabel] = useState(null);
  const [hyperlinkValuePlaceholder, setHyperlinkValuePlaceholder] = useState(null);
  const [hyperlinkValueSelectOptionData, setHyperlinkValueSelectOptionData] = useState([]);
  const [hyperlinkValueValidationMessage, setHyperlinkValueValidationMessage] = useState(null);
  const [isVisibleHyperlinkValue, setIsVisibleHyperlinkValue] = useState(true);
  const [hyperlinkValue, setHyperlinkValue] = useState(Hyperlink.URL);
  const translateData = {
    hyperlink: t("storeWebPage.banner.hyperlink"),
    dynamic: {
      url: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.url.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.url.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.url.validation"),
        invalidUrl: t("menuManagement.menuItem.hyperlink.dynamic.url.invalidUrl")
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
  };
  const [checkHyperlinkValueIsUrl, setCheckHyperlinkValueIsUrl] = useState(false);

  useEffect(() => {
    if (option) {
      setHyperlinkOption(option);
    }
    onChangeHyperlinkTypeFunction(defaultValue);
  }, []);

  const onChangeHyperlinkTypeFunction = (e, isChange = false) => {
    let formLabel = "";
    let placeholder = "";
    let validationMessage = "";
    let selectOptionData = [];
    let translateDataValue = null;
    let visibleHyperlinkValue = true;
    switch (e) {
      case Hyperlink.URL:
        translateDataValue = translateData.dynamic.url;
        setHyperlinkValue(Hyperlink.URL);
        setCheckHyperlinkValueIsUrl(true);
        break;
      case Hyperlink.CATEGORY:
        translateDataValue = translateData.dynamic.category;
        selectOptionData = productCategories;
        setHyperlinkValue(Hyperlink.CATEGORY);
        setCheckHyperlinkValueIsUrl(false);
        break;
      case Hyperlink.PRODUCT_DETAIL:
        translateDataValue = translateData.dynamic.product;
        selectOptionData = products;
        setHyperlinkValue(Hyperlink.PRODUCT_DETAIL);
        setCheckHyperlinkValueIsUrl(false);
        break;
      case Hyperlink.BLOG_DETAIL:
        translateDataValue = translateData.dynamic.blog;
        setHyperlinkValue(Hyperlink.BLOG_DETAIL);
        setCheckHyperlinkValueIsUrl(false);
        break;
      case Hyperlink.MY_PAGES:
        translateDataValue = translateData.dynamic.page;
        selectOptionData = pages;
        setHyperlinkValue(Hyperlink.MY_PAGES);
        setCheckHyperlinkValueIsUrl(false);
        break;
      case Hyperlink.SUB_MENU:
        translateDataValue = translateData.dynamic.subMenu;
        selectOptionData = subMenus;
        setHyperlinkValue(Hyperlink.SUB_MENU);
        setCheckHyperlinkValueIsUrl(false);
        break;
      default:
        visibleHyperlinkValue = false;
        setHyperlinkValue(Hyperlink.URL);
        setCheckHyperlinkValueIsUrl(false);
        break;
    }
    formLabel = translateDataValue?.title;
    placeholder = translateDataValue?.placeholder;
    validationMessage = translateDataValue?.validation;

    setHyperlinkValueLabel(formLabel);
    setHyperlinkValuePlaceholder(placeholder);
    setHyperlinkValueSelectOptionData(selectOptionData);
    setHyperlinkValueValidationMessage(validationMessage);

    setIsVisibleHyperlinkValue(visibleHyperlinkValue);

    if (onChangeHyperlinkType && isChange) {
      onChangeHyperlinkType(e);
      if (form) {
        const fields = [
          {
            name: [...fieldPreName, ...formItemHyperlinkValuePath],
            errors: [validationMessage],
          },
        ];
        form.setFields(fields);
      }
    }
  };

  const onChangeHyperlinkValueFunction = (e, isTextBox) => {
    let value = e;
    if (isTextBox) {
      value = e?.target?.value;
    }
    if (onChangeHyperlinkValue) {
      onChangeHyperlinkValue(value);
    }
  };

  const OptionComponent = ({ hyperlinkValueLabel,
    formItemHyperlinkValuePath,
    checkHyperlinkValueIsUrl,
    hyperlinkValueValidationMessage,
    defaultValueForHyperlinkValue,
    hyperlinkValue,
    hyperlinkValuePlaceholder,
    hyperlinkValueSelectOptionData,
    onChangeHyperlinkValueFunction
  }) => {
    return (
      <Col className="banner-field-margin-top" span={24} style={{ position: "relative" }}>
          <h4 className="fnb-form-label mt-36">
            {hyperlinkValueLabel}
            {hyperlinkValueLabel && <span className="text-danger">*</span>}
          </h4>
          <Form.Item
            name={[...formItemHyperlinkValuePath]}
            rules={[
              {
                required: true,
                message: hyperlinkValueValidationMessage
              },
              {
                type: checkHyperlinkValueIsUrl ? 'url' : '',
                message:  hyperlinkValueValidationMessage,
              },
            ]}
            initialValue={defaultValueForHyperlinkValue}
          >
            {hyperlinkValue === Hyperlink.URL ? (
              <Input
                className="fnb-input-with-count"
                showCount
                maxLength={2000}
                placeholder={hyperlinkValuePlaceholder}
                onChange={(e) => onChangeHyperlinkValueFunction(e, true)}
              />
            ) : (
              <FnbSelectSingle
                placeholder={hyperlinkValuePlaceholder}
                showSearch
                fixed={fixed}
                option={hyperlinkValueSelectOptionData?.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
                allowClear
                onChange={(e) => onChangeHyperlinkValueFunction(e)}
                defaultValue={defaultValueForHyperlinkValue}
              />
            )}
          </Form.Item>
        </Col>
    )
  }

  return (
    <Row>
      <Col span={24}>
        <h4 className="fnb-form-label mt-36">{translateData.hyperlink}</h4>
        <Form.Item name={[...formItemHyperlinkTypePath]}>
          <Select
            getPopupContainer={fixed ? null : (trigger) => trigger.parentNode}
            defaultValue={defaultValue}
            onChange={(e) => onChangeHyperlinkTypeFunction(e, true)}
            onSelect={onSelect}
            style={style}
            className={`fnb-select-hyperlink ${className}`}
            popupClassName="fnb-select-hyperlink-dropdown"
            suffixIcon={<ArrowDown />}
            menuItemSelectedIcon={<CheckedIcon />}
            disabled={disabled}
            showSearch={showSearch}
            allowClear={allowClear}
            placeholder={placeholder}
            dropdownRender={dropdownRender}
            optionFilterProp="children"
            listHeight={listHeight}
            showArrow
            filterOption={(input, option) => {
              const newOption = t(option?.name);
              const inputStr = input.removeVietnamese();
              const hyperlink = newOption?.removeVietnamese();
              return hyperlink?.trim().toLowerCase().indexOf(inputStr.trim().toLowerCase()) >= 0;
            }}
          >
            {hyperlinkOption?.map((item) => (
              <Select.Option key={item.id} value={item.id} name={item?.name}>
                <div className="hyperlink-option">
                  <div className="icon">{item.icon}</div>
                  <div className="text-name">{t(item.name)}</div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {isVisibleHyperlinkValue && <OptionComponent
        hyperlinkValueLabel={hyperlinkValueLabel}
        formItemHyperlinkValuePath={formItemHyperlinkValuePath}
        checkHyperlinkValueIsUrl={checkHyperlinkValueIsUrl}
        hyperlinkValueValidationMessage={hyperlinkValueValidationMessage}
        defaultValueForHyperlinkValue={defaultValueForHyperlinkValue}
        hyperlinkValue={hyperlinkValue}
        hyperlinkValuePlaceholder={hyperlinkValuePlaceholder}
        hyperlinkValueSelectOptionData={hyperlinkValueSelectOptionData}
        onChangeHyperlinkValueFunction={onChangeHyperlinkValueFunction}
      />}
    </Row>
  );
}
