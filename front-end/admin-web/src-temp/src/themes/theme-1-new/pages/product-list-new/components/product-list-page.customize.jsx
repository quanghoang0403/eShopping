import { Col, Form, Row } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductListStoreWebIcon } from "../../../assets/icons.constants";
import CustomizationGroup from "../../../components/customization-group-component/customization-group.page";
import { FnbInput } from "../../../components/fnb-input/fnb-input.component";
import SelectBackgroundComponent from "../../../components/select-background.component";
import SelectColorGroupComponent from "../../../components/select-color-group.component";
import PageType from "../../../constants/page-type.constants";
import { theme1ElementCustomize, theme1IdScrollView } from "../../../constants/store-web-page.constants";
import defaultConfig from "../../../default-store.config";

function ProductListPageCustomize(props) {
  const productListRef = useRef();
  const { defaultActiveKey } = props;
  const [t] = useTranslation();
  const [showHeader, setShowHeader] = useState(true);
  const [showProducts, setShowProducts] = useState(true);
  
  const pageData = {
    title: t("storeWebPage.productList", "Product List"),
    header: t("storeWebPage.productListPage.headerCustomization", "Header"),
    placeHolder: t("storeWebPage.productListPage.placeHolderTheme2", "Menu"),
    products: t("storeWebPage.productListPage.productCustomization", "Products"),
    titleHeader: t("storeWebPage.productListPage.titleHeader", "Title"),
    maxSizeUploadMb: 5,
    maxSizeUploadBackgroundImage: 20,
    border: {
      header: "#productListHeader",
      products: "#productListProducts",
    },
  };

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
      <Row id={`_${pageData.border.header}`} className="mt-2" ref={productListRef}>
        <SelectBackgroundComponent
          {...props}
          formItemPreName={["config", "header"]}
          backgroundCustomize={props?.pageConfig?.config?.header}
          bestDisplay={"1920 x 569 px"}
          maxSizeUploadMb={pageData.maxSizeUploadBackgroundImage}
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
              <FnbInput className="fnb-input-with-count" placeholder={pageData.placeHolder} maxLength={100} showCount />
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
          defaultThemeColor={defaultThemePageConfig?.config?.productsProductList?.backgroundColor}
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
      clickToScroll: theme1IdScrollView.HeaderProductList,
      customizeKey: theme1ElementCustomize.HeaderProductList,
    },
    {
      title: pageData.products,
      content: renderProducts(),
      onChangeEye: pageData.border.logo,
      icon: "",
      isShowKey: showProducts,
      clickToScroll: theme1IdScrollView.ProductProductList,
      customizeKey: theme1ElementCustomize.ProductProductList,
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

export const ProductListCustomize = [
  {
    icon: <ProductListStoreWebIcon className="product-list-icon-title" />,
    title: "Product list",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: false,
    // name:
    content: (props) => {
      return (
        <>
          <ProductListPageCustomize {...props} />
        </>
      );
    },
  },
];
