import { Checkbox, Col, Form, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StoreWebBannerGeneralCustomizationIcon, TodayMenuCustomizationIcon } from "../assets/icons.constants";
import CustomizationBlock from "./customization-block-component/customization-block.page";
import { FnbInput } from "./fnb-input/fnb-input.component";
import { FnbSelectMultiple } from "./fnb-select-multiple/fnb-select-multiple";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import "./best-selling-product.component.scss";
import SelectBackgroundComponent from "./select-background.component";
import SelectColorGroupComponent from "./select-color-group.component";

export default function Theme1BestSellingProductCustomization(props) {
  const { clickToScroll } = props;
  const [t] = useTranslation();
  const reduxState = useSelector((state) => state);
  const [products, setProducts] = useState();
  const [disableAllProduct, setDisableAllProduct] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    const listProductIsInCategory = reduxState?.session?.prepareDataBanner?.products?.filter((product)=> {
      return product?.productCategoryId;
    })
    setProducts(listProductIsInCategory);
  }, []);
  
  const translateData = {
    bestSellingProduct: t("", "Best selling product"),
    generalCustomizationTitle: t("storeWebPage.banner.generalCustomizationTitle"),
    title: t("storeWebPage.bestSellingProduct.title", "Title"),
    enterTitle: t("storeWebPage.bestSellingProduct.menuSpecial", "Enter title"),
    product: t("storeWebPage.bestSellingProduct.product", "Product"),
    allProduct: t("storeWebPage.bestSellingProduct.allProduct", "All product"),
    selectProduct: t("storeWebPage.bestSellingProduct.selectProduct", "Select product"),
    todayMenu: t("storeWebPage.todayMenu"),
  };

  const onSelectAllProduct = (event) => {
    let isChecked = event.target.checked;
    setSelectedValues([]);
    setDisableAllProduct(isChecked);
  };

  const renderGeneralCustomizationGroup = () => {
    return (
      <div className="general-container">
        <SelectBackgroundComponent
          {...props}
          backgroundCustomize={props?.pageConfig?.config?.bestSellingProduct?.generalCustomization}
          formItemPreName={["config", "bestSellingProduct", "generalCustomization"]}
          isRequired={false}
        />
        <SelectColorGroupComponent
          {...props}
          formItemPreName={["config", "bestSellingProduct", "generalCustomization"]}
        />
      </div>
    );
  };

  const renderBestSellingProductGroup = () => {
    return (
      <div className="today-menu-best-selling-product-homepage-theme1">
        <h3 className="today-menu-title">{translateData.title}</h3>
        <Form.Item
          name={["config", "bestSellingProduct", "title"]}
          rules={[
            {
              type: "string",
              max: 100,
            },
          ]}
        >
          <FnbInput className="fnb-input-with-count" maxLength={100} showCount placeholder={translateData.enterTitle} />
        </Form.Item>
        <Row className="mt-5">
          <Col span={12}>
            <h3>{translateData.product}</h3>
          </Col>
          <Col span={12} className="text-right">
            <Form.Item name={["config", "bestSellingProduct", "isCheckAllProduct"]} valuePropName="checked">
              <Checkbox onChange={(event) => onSelectAllProduct(event)}>
                <span style={{ whiteSpace: "nowrap" }}>{translateData.allProduct}</span>
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={24} hidden={disableAllProduct}>
            <Form.Item name={["config", "bestSellingProduct", "bestSellingProductIds"]}>
              <FnbSelectMultiple
                placeholder={translateData.selectProduct}
                defaultValue={selectedValues}
                className="w-100"
                allowClear
                option={products?.map((item) => ({
                  id: item?.id,
                  name: item?.name,
                }))}
              ></FnbSelectMultiple>
            </Form.Item>
          </Col>
          <Col span={24} hidden={!disableAllProduct}>
            <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
          </Col>
        </Row>
      </div>
    );
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
        element.scrollIntoView({ block: "start" });
        window.oldElements = elementId;
      }
    } catch {}
  };

  return (
    <>
      <Row
        className="best-selling-product-main"
        onClick={() => {
          removeOldFocusElement();
          setFocusElement(clickToScroll);
        }}
      >
        <Col span={24}>
          <CustomizationBlock
            icon={<StoreWebBannerGeneralCustomizationIcon />}
            title={translateData.generalCustomizationTitle}
            isNormal={true}
            content={renderGeneralCustomizationGroup()}
            defaultActiveKey={1}
            isShowKey={true}
            className="banner-detail-body-general"
          ></CustomizationBlock>
        </Col>
        <Col span={24}>
          <CustomizationBlock
            icon={<TodayMenuCustomizationIcon />}
            title={translateData.todayMenu}
            isNormal={true}
            content={renderBestSellingProductGroup()}
            className="banner-detail-body-content"
          ></CustomizationBlock>
        </Col>
      </Row>
    </>
  );
}
