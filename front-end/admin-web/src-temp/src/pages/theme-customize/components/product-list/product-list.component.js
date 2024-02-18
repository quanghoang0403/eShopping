import { Col, Form, Row } from "antd";
import { FnbBackgroundCustomizeComponent } from "../../../store-web/components/fnb-background-customize/fnb-background-customize";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { ProductListStoreWebIcon } from "constants/icons.constants";
import { backgroundTypeEnum } from "constants/store-web-page.constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomizationBlock from "../customization-block-component/customization-block.page";
import CustomizationGroup from "../customization-group-component/customization-group.page";
import "./product-list.component.scss";

export default function ProductListComponent(props) {
  const productListRef = useRef();
  const { defaultActiveKey, form, storeThemeData, setNewStoreThemeData, newStoreThemeData } = props;

  const [t] = useTranslation();
  const [showHeader, setShowHeader] = useState(true);
  const [showProducts, setShowProducts] = useState(false);

  const pageData = {
    title: t("storeWebPage.productList"),
    header: t("storeWebPage.productListPage.header"),
    products: t("storeWebPage.productListPage.products"),
    titleHeader: t("storeWebPage.productListPage.titleHeader"),
    maxSizeUploadMb: 5,
    maxSizeUploadBackgroundImage: 20,
    border: {
      header: "#productListHeader",
      products: "#productListProducts",
    },
  };
  useEffect(() => {
    setInitFormValue();
  }, [storeThemeData]);

  const setInitFormValue = async () => {
    if (storeThemeData) {
      const { productList } = storeThemeData.storeThemeConfiguration.pages;
      if (form && productList) {
        form.setFieldsValue({
          productList: {
            ...productList,
          },
        });
      }
    }
  };

  const changeValueOfKey = (key, value, tag) => {
    if (newStoreThemeData) {
      const { storeThemeConfiguration } = newStoreThemeData;
      const { pages } = storeThemeConfiguration;
      const { productList } = pages;
      const { header, productsProductList } = productList;
      let newData = {};
      switch (tag) {
        case "header":
          newData = {
            storeThemeConfiguration: {
              ...storeThemeConfiguration,
              pages: {
                ...pages,
                productList: {
                  ...productList,
                  header: {
                    ...header,
                    [key]: value,
                  },
                },
              },
            },
          };
          break;
        case "productsProductList":
          newData = {
            storeThemeConfiguration: {
              ...storeThemeConfiguration,
              pages: {
                ...pages,
                productList: {
                  ...productList,
                  productsProductList: {
                    ...productsProductList,
                    [key]: value,
                  },
                },
              },
            },
          };
          break;
        default:
          break;
      }
      form.setFields([
        {
          name: ["productList", tag, key],
          value: value,
        },
      ]);
      setNewStoreThemeData(newData);
    }
  };

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
        <Col span={24}>
          <FnbBackgroundCustomizeComponent
            defaultOption={
              storeThemeData?.storeThemeConfiguration?.pages?.productList?.header?.backgroundType ??
              backgroundTypeEnum.Color
            }
            bestDisplay={"1920 x 569 px"}
            maxSizeUploadMb={pageData.maxSizeUploadBackgroundImage}
            prevName={"productList,header"}
            primaryColorDefault="#fff"
            storeThemeData={storeThemeData}
            form={form}
            changeValueOfKey={(key, value) => changeValueOfKey(key, value, "header")}
            parentBlockCustom={"pages"}
          ></FnbBackgroundCustomizeComponent>
        </Col>
        <Row gutter={[8, 16]} align="middle" className="row-header">
          <Col span={24}>{pageData.titleHeader}</Col>
          <Col span={24}>
            <Form.Item
              name={["productList", "header", "title"]}
              rules={[
                {
                  type: "string",
                  max: 100,
                },
              ]}
            >
              <FnbInput
                className="fnb-input-with-count"
                maxLength={100}
                showCount
                onChange={(e) => changeValueOfKey("title", e.target.value, "header")}
              />
            </Form.Item>
          </Col>
        </Row>
      </Row>
    );
  };

  const renderProducts = () => {
    return (
      <Row id={`_${pageData.border.products}`} className="mt-2" ref={productListRef}>
        <Col span={24}>
          <FnbBackgroundCustomizeComponent
            defaultOption={
              storeThemeData?.storeThemeConfiguration?.pages?.productList?.productsProductList?.backgroundType ??
              backgroundTypeEnum.Color
            }
            bestDisplay={"1920 x 569 px"}
            maxSizeUploadMb={pageData.maxSizeUploadBackgroundImage}
            prevName={"productList,productsProductList"}
            primaryColorDefault="#fff"
            storeThemeData={storeThemeData}
            form={form}
            changeValueOfKey={(key, value) => changeValueOfKey(key, value, "productsProductList")}
            parentBlockCustom={"pages"}
          ></FnbBackgroundCustomizeComponent>
        </Col>
      </Row>
    );
  };

  const groupCollapse = [
    {
      title: pageData.header,
      content: renderHeader(),
      onChangeEye: pageData.border.header,
      icon: "",
      isShowKey: showHeader,
    },
    {
      title: pageData.products,
      content: renderProducts(),
      onChangeEye: pageData.border.logo,
      icon: "",
      isShowKey: showProducts,
    },
  ];

  return (
    <CustomizationBlock
      icon={<ProductListStoreWebIcon className="product-list-icon-title" />}
      title={pageData.title}
      className={"form-customize-product-list"}
      isNormal={true}
      defaultActiveKey={defaultActiveKey}
      collapsible={false}
      content={
        <Form form={form} layout="vertical" autoComplete="off" name="form-customize-banner">
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
              ></CustomizationGroup>
            );
          })}
        </Form>
      }
    ></CustomizationBlock>
  );
}
