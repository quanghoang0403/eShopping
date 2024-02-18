import { Checkbox, Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CheckoutCustomizeIcon } from "../../../assets/icons.constants";
import CustomizationGroup from "../../../components/customization-group-component/customization-group.page";
import { FnbSelectSingle } from "../../../components/fnb-select-single/fnb-select-single";
import SelectBackgroundComponent from "../../../components/select-background/select-background.component";
import SelectColorGroupComponent from "../../../components/select-color-group/select-color-group.component";
import PageType from "../../../constants/page-type.constants";
import { theme2ElementCustomize, theme2IdScrollView } from "../../../constants/store-web-page.constants";
import defaultConfig from "../../../default-store.config";
import "./checkout.customize.scss";

function CheckoutComponent(props) {
  const { defaultActiveKey } = props;
  const [t] = useTranslation();
  const [categories, setCategories] = useState();
  const [showHeader, setShowHeader] = useState(true);
  const [showCheckout, setShowCheckout] = useState(true);
  const [showRelatedProduct, setShowRelatedProduct] = useState(true);
  const translateData = {
    customize: {
      checkoutCustomize: {
        title: t("theme.checkoutCustomize.title"),
        header: {
          title: t("theme.checkoutCustomize.header.title"),
        },
        checkout: {
          title: t("theme.checkoutCustomize.checkout.title"),
        },
        relatedProducts: {
          title: t("theme.checkoutCustomize.relatedProducts.title"),
          selectCategory: t("theme.checkoutCustomize.relatedProducts.selectCategory"),
        },
      },
    },
    border: {
      header: "#checkoutHeader",
      checkout: "#checkoutSection",
      relatedProducts: "#checkoutRelatedProduct",
    },
  };

  const bestDisplay = "1920 x 323 px";
  const defaultMaxSizeUpload = 20;
  const defaultThemePageConfig = defaultConfig?.pages?.find((p) => p.id === PageType.CHECKOUT_PAGE);
  const reduxState = useSelector((state) => state);

  useEffect(() => {
    let data = reduxState?.session?.prepareDataBanner?.productCategories;
    data.sort((a, b) => {
      const fa = a.name.toLowerCase();
      const fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    setCategories(data);
  }, []);

  const onChangeCollapse = (key, tag) => {
    switch (tag) {
      case translateData.border.header:
        key.length <= 0 ? setShowHeader(false) : setShowHeader(true);
        break;
      case translateData.border.products:
        key.length <= 0 ? setShowCheckout(false) : setShowCheckout(true);
        break;
      case translateData.border.relatedProducts:
        key.length <= 0 ? setShowRelatedProduct(false) : setShowRelatedProduct(true);
        break;
      default:
        break;
    }
  };

  const onChangeIconRight = (event, isCheckFirstTime, customizeKey) => {
    if (customizeKey) {
      const isShowComponent = isCheckFirstTime === true ? event : event.target.checked;
      const panel = document.getElementById(`collapse-panel-${customizeKey}`)?.childNodes[0];
      if (panel) {
        let icon = panel.childNodes[0];
        let text = panel.childNodes[1];
        if (isShowComponent) {
          icon.setAttribute("style", "opacity: 1 !important");
          text.setAttribute("style", "opacity: 1 !important");
        } else {
          icon.setAttribute("style", "opacity: 0.5 !important");
          text.setAttribute("style", "opacity: 0.5 !important");
        }
      }
    }
  };
  const renderIconEye = (group) => {
    return (
      <Form.Item name={["config", `${group}`, "visible"]} valuePropName="checked">
        <Checkbox className="visible-component" onChange={(e) => onChangeIconRight(e, false, group)} />
      </Form.Item>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <Row id={`_${translateData.border.header}`} className="mt-2">
          <SelectBackgroundComponent
            {...props}
            formItemPreName={["config", "header"]}
            backgroundCustomize={props?.pageConfig?.config?.header}
            bestDisplay={bestDisplay}
            maxSizeUploadMb={defaultMaxSizeUpload}
            defaultThemeColor={defaultThemePageConfig?.config?.header?.backgroundColor}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config", "header"]} />
        </Row>
      </>
    );
  };

  const renderCheckout = () => {
    return (
      <>
        <Row id={`_${translateData.border.checkout}`} className="mt-2">
          <SelectBackgroundComponent
            {...props}
            formItemPreName={["config", "checkout"]}
            backgroundCustomize={props?.pageConfig?.config?.checkout}
            bestDisplay={bestDisplay}
            maxSizeUploadMb={defaultMaxSizeUpload}
            defaultThemeColor={defaultThemePageConfig?.config?.checkout?.backgroundColor}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config", "checkout"]} />
        </Row>
      </>
    );
  };

  const renderRelatedProducts = () => {
    return (
      <>
        <Row gutter={[8, 16]} align="middle">
          <SelectBackgroundComponent
            {...props}
            formItemPreName={["config", "relatedProducts"]}
            backgroundCustomize={props?.pageConfig?.config?.relatedProducts}
            bestDisplay={bestDisplay}
            maxSizeUploadMb={defaultMaxSizeUpload}
            defaultThemeColor={defaultThemePageConfig?.config?.relatedProducts?.backgroundColor}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config", "relatedProducts"]} />
          <Col span={24} className="fontSizeTitle">
            {translateData.customize.checkoutCustomize.relatedProducts.selectCategory}
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[
                { required: true, message: translateData.customize.checkoutCustomize.relatedProducts.selectCategory },
              ]}
              name={["config", "relatedProducts", "categoryId"]}
            >
              <FnbSelectSingle
                placeholder={translateData.customize.checkoutCustomize.relatedProducts.selectCategory}
                showSearch
                option={categories?.map((b) => ({
                  id: b.id,
                  name: b?.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  const groupCollapse = [
    {
      title: translateData.customize.checkoutCustomize.header.title,
      isShowRightIconWhenHoverMouse: true,
      icon: renderIconEye("header"),
      content: renderHeader(),
      onChangeEye: translateData.border.header,
      isShowKey: showHeader,
      clickToScroll: theme2IdScrollView.HeaderCheckout,
      customizeKey: theme2ElementCustomize.HeaderCheckout,
      isShowTooltip: false,
      titleIconRight: null,
    },
    {
      title: translateData.customize.checkoutCustomize.checkout.title,
      isShowRightIconWhenHoverMouse: true,
      icon: renderIconEye("checkout"),
      content: renderCheckout(),
      onChangeEye: translateData.border.checkout,
      isShowKey: showCheckout,
      clickToScroll: theme2IdScrollView.CheckoutCheckout,
      customizeKey: theme2ElementCustomize.CheckoutCheckout,
      isShowTooltip: false,
      titleIconRight: null,
    },
    {
      title: translateData.customize.checkoutCustomize.relatedProducts.title,
      isShowRightIconWhenHoverMouse: true,
      icon: renderIconEye("relatedProducts"),
      content: renderRelatedProducts(),
      onChangeEye: translateData.border.relatedProducts,
      isShowKey: showRelatedProduct,
      clickToScroll: theme2IdScrollView.RelatedProductsCheckout,
      customizeKey: theme2ElementCustomize.RelatedProductsCheckout,
      isShowTooltip: false,
      titleIconRight: null,
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
            className={"customize-checkout-page"}
            isShowKey={group.isShowKey}
            onChangeCollapse={(value) => onChangeCollapse(value, group.onChangeEye)}
            clickToScroll={group.clickToScroll}
            customizeKey={group.customizeKey}
            isShowRightIconWhenHoverMouse={group.isShowRightIconWhenHoverMouse}
            isShowTooltip={group.isShowTooltip}
            titleIconRight={group.titleIconRight}
          ></CustomizationGroup>
        );
      })}
    </>
  );
}
export const CheckoutCustomizes = [
  {
    icon: <CheckoutCustomizeIcon />,
    title: "theme.checkoutCustomize.title",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: false,
    // name:
    content: (props) => {
      return (
        <>
          <CheckoutComponent {...props} />
        </>
      );
    },
  },
];
