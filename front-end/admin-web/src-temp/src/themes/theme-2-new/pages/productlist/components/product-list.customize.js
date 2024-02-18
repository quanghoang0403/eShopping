import { Col, Form, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductListStoreWebIcon } from "../../../assets/icons.constants";
import CustomizationGroup from "../../../components/customization-group-component/customization-group.page";
import { FnbInput } from "../../../components/fnb-input/fnb-input.component";
import SelectBackgroundComponent from "../../../components/select-background/select-background.component";
import SelectColorGroupComponent from "../../../components/select-color-group/select-color-group.component";
import PageType from "../../../constants/page-type.constants";
import { theme2ElementCustomize, theme2IdScrollView } from "../../../constants/store-web-page.constants";
import defaultConfig from "../../../default-store.config";
import "./product-list.customize.scss";

function ProductListComponent(props) {
  const { defaultActiveKey } = props;
  const [t] = useTranslation();
  const [showHeader, setShowHeader] = useState(true);
  const [showProducts, setShowProducts] = useState(true);

  const pageData = {
    title: t("storeWebPage.productList"),
    header: t("storeWebPage.productListPage.headerCustomization"),
    products: t("storeWebPage.productListPage.productCustomization"),
    titleHeader: t("storeWebPage.productListPage.titleHeader"),
    placeHolder: t("storeWebPage.productListPage.placeHolderTheme2"),
    border: {
      header: "#productListHeader",
      products: "#productListProducts",
    },
  };

  const bestDisplay = "1920 x 569 px";
  const defaultMaxSizeUpload = 20;
  const defaultThemePageConfig = defaultConfig?.pages?.find((p) => p.id === PageType.PRODUCT_LIST);

  const onChangeCollapse = (key, tag) => {
    switch (tag) {
      case pageData.border.header:
        key.length <= 0 ? setShowHeader(false) : setShowHeader(true);
        break;
      case pageData.border.products:
        key.length <= 0 ? setShowProducts(false) : setShowProducts(true);
        break;
      default:
        break;
    }
  };

  const renderHeader = () => {
    return (
      <Row id={`_${pageData.border.header}`} className="mt-2">
        <SelectBackgroundComponent
          {...props}
          formItemPreName={["config", "header"]}
          backgroundCustomize={props?.pageConfig?.config?.header}
          bestDisplay={bestDisplay}
          maxSizeUploadMb={defaultMaxSizeUpload}
          defaultImage={defaultThemePageConfig?.config?.header?.backgroundImage}
          defaultThemeColor={defaultThemePageConfig?.config?.header?.backgroundColor}
        />
        <SelectColorGroupComponent {...props} formItemPreName={["config", "header"]} />
        <Row gutter={[8, 16]} align="middle" className="row-header">
          <Col span={24}>{pageData.titleHeader}</Col>
          <Col span={24}>
            <Form.Item
              name={["config", "header", "title"]}
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <FnbInput className="fnb-input-with-count" maxLength={100} placeholder={pageData.placeHolder} showCount />
            </Form.Item>
          </Col>
        </Row>
      </Row>
    );
  };

  const renderProducts = () => {
    return (
      <>
        <SelectBackgroundComponent
          {...props}
          formItemPreName={["config", "productsProductList"]}
          backgroundCustomize={props?.pageConfig?.config?.productsProductList}
          maxSizeUploadMb={defaultMaxSizeUpload}
          bestDisplay={bestDisplay}
          defaultThemeColor={defaultThemePageConfig?.config?.productsProductList?.backgroundColor}
          defaultImage={defaultThemePageConfig?.config?.productsProductList?.backgroundImage}
        />
        <SelectColorGroupComponent {...props} formItemPreName={["config", "productsProductList"]} />
      </>
    );
  };

  const groupCollapse = [
    {
      title: pageData.header,
      content: renderHeader(),
      onChangeEye: pageData.border.header,
      icon: "",
      isShowKey: showHeader,
      clickToScroll: theme2IdScrollView.HeaderProductList,
      customizeKey: theme2ElementCustomize.HeaderProductList,
    },
    {
      title: pageData.products,
      content: renderProducts(),
      onChangeEye: pageData.border.logo,
      icon: "",
      isShowKey: showProducts,
      clickToScroll: theme2IdScrollView.ProductProductList,
      customizeKey: theme2ElementCustomize.ProductProductList,
    },
  ];

  return (
    <>
      {groupCollapse?.map((group, index) => {
        return (
          <CustomizationGroup
            title={group.title}
            isNormal={true}
            defaultActiveKey={defaultActiveKey + "." + ++index}
            content={group.content}
            icon={group.icon}
            className={"size-group"}
            isShowKey={group.isShowKey}
            onChangeCollapse={(value) => onChangeCollapse(value, group.onChangeEye)}
            clickToScroll={group.clickToScroll}
            customizeKey={group.customizeKey}
          ></CustomizationGroup>
        );
      })}
    </>
  );
}

export const ProductListCustomizes = [
  {
    icon: <ProductListStoreWebIcon className="product-list-icon-title" />,
    title: "Product list",
    className: "form-customize-product-list",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: false,
    // name:
    content: (props) => {
      return (
        <>
          <ProductListComponent {...props} />
        </>
      );
    },
  },
];
