import { Checkbox, Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CheckoutPageStoreWebIcon } from "../../assets/icons.constants";
import CustomizationGroup from "../../components/customization-group-component/customization-group.page";
import { FnbInput } from "../../components/fnb-input/fnb-input.component";
import SelectBackgroundComponent from "../../components/select-background.component";
import SelectColorGroupComponent from "../../components/select-color-group.component";
import PageType from "../../constants/page-type.constants";
import { theme1ElementCustomize, theme1IdScrollView } from "../../constants/store-web-page.constants";
import defaultConfig from "../../default-store.config";
import "./checkout.customize.scss";

function CheckoutComponent(props) {
  const initialConfig = useSelector((state)=> state?.themeConfig?.data?.pages)?.find((page)=> page?.id === PageType.CHECKOUT_PAGE);
  const { defaultActiveKey, form } = props;
  const [t] = useTranslation();
  const [showHeader, setShowHeader] = useState(true);
  const [showCheckout, setShowCheckout] = useState(true);

  const pageData = {
    title: t("storeWebPage.checkoutPage"),
    header: t("theme.checkoutCustomize.header.title"),
    placeHolder: t("theme.checkoutCustomize.header.placeHolder"),
    checkout: t("theme.checkoutCustomize.checkout.title"),
    titleHeader: t("theme.checkoutCustomize.title"),
    maxSizeUploadMb: 5,
    maxSizeUploadBackgroundImage: 20,
    border: {
      header: "#checkoutHeader",
      checkout: "#checkoutCheckout",
    },
  };

  const bestDisplay = "1920 x 569 px";
  const defaultThemePageConfig = defaultConfig?.pages?.find((p) => p.id === PageType.CHECKOUT_PAGE);

  const onChangeCollapse = (key, tag) => {
    switch (tag) {
      case pageData.border.header:
        key.length <= 0 ? setShowHeader(false) : setShowHeader(true);
        break;
      case pageData.border.checkout:
        key.length <= 0 ? setShowCheckout(false) : setShowCheckout(true);
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

  useEffect(() => {
    const configHeaderType = form.getFieldsValue()?.config?.header?.backgroundType;
    if(!configHeaderType) {
      form.setFieldsValue({
        config : props?.pageConfig?.config ?? initialConfig?.config,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderHeader = () => {
    return (
      <Row id={`_${pageData.border.header}`} className="mt-2">
        <SelectBackgroundComponent
          {...props}
          formItemPreName={["config", "header"]}
          backgroundCustomize={props?.pageConfig?.config?.header}
          bestDisplay={bestDisplay}
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

  const renderCheckout = () => {
    return (
      <>
        <Row id={`_${pageData.border.checkout}`} className="mt-2">
          <SelectBackgroundComponent
            {...props}
            formItemPreName={["config", "checkout"]}
            bestDisplay={bestDisplay}
            backgroundCustomize={props?.pageConfig?.config?.checkout}
            defaultThemeColor={defaultThemePageConfig?.config?.checkout?.backgroundColor}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config", "checkout"]} />
        </Row>
      </>
    );
  };

  const groupCollapse = [
    {
      title: pageData.header,
      content: renderHeader(),
      onChangeEye: pageData.border.header,
      icon: null,
      isShowKey: showHeader,
      clickToScroll: theme1IdScrollView.HeaderCheckout,
      customizeKey: theme1ElementCustomize.HeaderCheckout,
      isShowRightIconWhenHoverMouse: true,
      isShowTooltip: false,
      titleIconRight: null,
    },
    {
      title: pageData.checkout,
      content: renderCheckout(),
      onChangeEye: pageData.border.checkout,
      icon: null,
      isShowKey: showCheckout,
      clickToScroll: theme1IdScrollView.CheckoutCheckout,
      customizeKey: theme1ElementCustomize.CheckoutCheckout,
      isShowRightIconWhenHoverMouse: true,
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
            className={"size-group"}
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
    icon: <CheckoutPageStoreWebIcon className="product-list-icon-title" />,
    title: "Checkout",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: false,
    isShowRightIconWhenHoverMouse: true,
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
