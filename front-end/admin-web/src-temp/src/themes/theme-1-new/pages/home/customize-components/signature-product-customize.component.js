import { Col, Form, message, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SignatureProductsCustomization,
  StoreWebBannerGeneralCustomizationIcon,
} from "../../../assets/icons.constants";
import { CustomizationGroup } from "../../../components/customization-group-component/customization-group.component";
import { ElementCustomizationCollapseBlock } from "../../../components/element-general-customization/element-general-customization.component";
import { FnbAddNewButton } from "../../../components/fnb-add-new-button/fnb-add-new-button";
import { FnbInput } from "../../../components/fnb-input/fnb-input.component";
import FnbSelectHyperlinkCustomize from "../../../components/fnb-select-hyperlink-customize/fnb-select-hyperlink-customize";
import { FnbTrashFillIcon } from "../../../components/fnb-trash-fill-icon/fnb-trash-fill-icon";
import FnbUploadBackgroundImageCustomizeComponent from "../../../components/fnb-upload-background-image-customize/fnb-upload-background-image-customize";
import { FormItemLabel } from "../../../components/form-item-label/form-item-label.component";
import SelectBackgroundComponent from "../../../components/select-background.component";
import SelectColorGroupComponent from "../../../components/select-color-group.component";
import "./signature-product-customize.component.scss";
import BackgroundSignatureProductDefault from "../../../assets/images/bg-default-signature-product.png";

export function SignatureProductCustomize(props) {
  const { getFieldsValue } = props.form;
  useEffect(() => {
    if (props?.updateFormValues) {
      props?.updateFormValues();
    }
    setTimeout(() => {
      setFocusElement(props.clickToScroll);
    }, 100);
  }, []);

  const setFocusElement = (elementId) => {
    try {
      const element = document.querySelector(elementId);
      if (element) {
        // set border element on focused
        element.className = "tc-on-focus";
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.oldElements = elementId;
      }
    } catch { }
  };

  return (
    <div className="home-signature-product-customize" >
      {/* General customization section */}
      <ElementCustomizationCollapseBlock
        props={props}
        defaultActiveKey={1}
        title="General customization"
        icon={<StoreWebBannerGeneralCustomizationIcon />}
        content={() => {
          return (
            <>
              <SelectBackgroundComponent
                {...props}
                formItemPreName={["config", "signatureProduct", "generalCustomization"]}
                backgroundCustomize={getFieldsValue()?.config?.signatureProduct?.generalCustomization}
                defaultImage={BackgroundSignatureProductDefault}
              />
              <SelectColorGroupComponent
                {...props}
                formItemPreName={["config", "signatureProduct", "generalCustomization"]}
              />
            </>
          );
        }}
      />

      {/* Signature product section */}
      <ElementCustomizationCollapseBlock
        title="Signature product"
        icon={<SignatureProductsCustomization />}
        defaultActiveKey={1}
        content={() => {
          return (
            <>
              <SignatureProductSection
                {...props}
                formItemPreName={["config", "signatureProduct", "signatureProducts"]}
              />
            </>
          );
        }}
      />
    </div>
  );
}

const SignatureProductSection = (props) => {
  const [t] = useTranslation();
  const translateData = {
    addSignatureProduct: t("storeWebPage.header.addSignatureProduct", "Add signature product"),
  };
  const maximumProduct = 5;

  // default value
  const products = [
    {
      nameCategory: "Cà Phê",
      textArea:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      buttonText: "Thử ngay",
      hyperlinkType: null,
      hyperlinkValue: "/static/media/signature-product.9f15c97ea7c886dbfe92.png",
      thumbnail: "/static/media/signature-product.9f15c97ea7c886dbfe92.png",
    },
    {
      nameCategory: "Cà Phê",
      textArea:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      buttonText: "Thử ngay",
      hyperlinkType: null,
      hyperlinkValue: "/static/media/signature-product.9f15c97ea7c886dbfe92.png",
      thumbnail: "/static/media/signature-product.9f15c97ea7c886dbfe92.png",
    },
  ];

  const getPageConfig = (pageId, reduxStorage) => {
    const { themeConfig } = reduxStorage.getState().session;
    const pageConfig = themeConfig?.pages?.find((c) => c.id === pageId);
    return pageConfig ?? null;
  };

  const pageConfig = getPageConfig(props?.pageId, props?.reduxStorage);
  const [currentSignatureProducts, setCurrentSignatureProducts] = useState(
    [...pageConfig.config.signatureProduct.signatureProducts] ?? products
  );

  useEffect(() => {
    props.updateFormValues();
  }, [currentSignatureProducts]);

  const onAddMoreSignatureProduct = () => {
    const { pageId, reduxStorage, updateReduxStorage } = props;
    const { themeConfig } = reduxStorage.getState().session;
    const pageConfig = getPageConfig(pageId, reduxStorage);

    if (pageConfig && pageConfig.config) {
      let newSignatureProducts = [...pageConfig.config.signatureProduct.signatureProducts] ?? products;
      // add new object with default value
      newSignatureProducts.push({
        nameCategory: "Cà Phê",
        textArea:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        buttonText: "Thử ngay",
        hyperlinkType: null,
        hyperlinkValue: "/images/default-theme/signature-product.png",
        thumbnail: "/images/default-theme/signature-product.png",
      });

      if (newSignatureProducts?.length > maximumProduct) {
        message.warn("Max 5 similar products");
        return;
      }
      setCurrentSignatureProducts([...newSignatureProducts]);

      let pages = themeConfig?.pages?.filter((c) => c.id !== pageId);
      pages.push({
        ...pageConfig,
        config: {
          ...pageConfig.config,
          signatureProduct: {
            ...pageConfig.config.signatureProduct,
            signatureProducts: newSignatureProducts,
          },
        },
      });

      const newThemeConfig = {
        ...themeConfig,
        pages: pages,
      };

      updateReduxStorage(newThemeConfig);
    }
  };

  const onRemoveSignatureProduct = (index) => {
    const { pageId, reduxStorage, updateReduxStorage } = props;
    const { themeConfig } = reduxStorage.getState().session;
    const pageConfig = getPageConfig(pageId, reduxStorage);

    if (pageConfig && pageConfig.config) {
      let newSignatureProducts = [...pageConfig.config.signatureProduct.signatureProducts] ?? products;
      newSignatureProducts.splice(index, 1);
      setCurrentSignatureProducts([...newSignatureProducts]);

      let pages = themeConfig?.pages?.filter((c) => c.id !== pageId);
      pages.push({
        ...pageConfig,
        config: {
          ...pageConfig.config,
          signatureProduct: {
            ...pageConfig.config.signatureProduct,
            signatureProducts: newSignatureProducts,
          },
        },
      });

      const newThemeConfig = {
        ...themeConfig,
        pages: pages,
      };

      updateReduxStorage(newThemeConfig);
    }
  };

  return (
    <>
      {currentSignatureProducts.map((p, index) => {
        return (
          <>
            <CustomizationGroup
              key={index}
              title={`Signature product ${index + 1}`}
              icon={index + 1 > products.length ? <FnbTrashFillIcon /> : <></>}
              onClickIconRight={() => {
                onRemoveSignatureProduct(index);
              }}
              content={<ProductCustomize index={index} {...props} />}
              isShowRightIconWhenHoverMouse={true}
            />
          </>
        );
      })}
      <div className="break-section"></div>
      <FnbAddNewButton
        className={currentSignatureProducts?.length < maximumProduct ? "mt-3" : "signature_products_disabled"}
        disabled={currentSignatureProducts?.length === maximumProduct}
        onClick={onAddMoreSignatureProduct}
        text={translateData.addSignatureProduct}
      />
    </>
  );
};

const ProductCustomize = (props) => {
  const [t] = useTranslation();
  const translateData = {
    valueNotNull: t("form.valueNotNull"),
  };
  const { index, formItemPreName } = props;

  const hyperlinks = [
    {
      id: "1",
      name: "Link",
    },
    {
      id: "2",
      name: "Product Link",
    },
  ];

  const onChangeHyperlinkType = (e, index) => {
    const changedValue = {
      key: [...formItemPreName, index, "hyperlinkType"],
      value: e,
    };

    if (props.onChange) {
      props.onChange(changedValue);
    }
  };

  const onChangeHyperlinkValue = (e, index) => {
    const changedValue = {
      key: [...formItemPreName, index, "hyperlinkValue"],
      value: e,
    };

    if (props.onChange) {
      props.onChange(changedValue);
    }
  };

  return (
    <Row key={index}>
      <Col span={24}>
        <div>
          <FormItemLabel>Title</FormItemLabel>
          <Form.Item
            name={[...formItemPreName, index, "nameCategory"]}
            rules={[
              {
                required: true,
                message: translateData.valueNotNull,
              },
            ]}
          >
            <FnbInput placeholder="Enter name category" />
          </Form.Item>
        </div>
        <div className="mt-3">
          <FormItemLabel>Text area</FormItemLabel>
          <Form.Item
            name={[...formItemPreName, index, "textArea"]}
            rules={[
              {
                required: true,
                message: translateData.valueNotNull,
              },
            ]}
          >
            <FnbInput placeholder="Enter text area" />
          </Form.Item>
        </div>
        <div className="mt-3">
          <FormItemLabel>Thumbnail</FormItemLabel>
          <Form.Item name={[...formItemPreName, index, "thumbnail"]}>
            <FnbUploadBackgroundImageCustomizeComponent maxSizeUploadMb={20} bestDisplay={"770 x 1016 px"} />
          </Form.Item>
        </div>
        <div className="mt-3">
          <FormItemLabel>Button text</FormItemLabel>
          <Form.Item
            name={[...formItemPreName, index, "buttonText"]}
            rules={[
              {
                required: true,
                message: translateData.valueNotNull,
              },
            ]}
          >
            <FnbInput placeholder="Enter button text" />
          </Form.Item>
        </div>
        <div className="mt-3">
          <FnbSelectHyperlinkCustomize
            showSearch
            allowClear
            fixed={false}
            placeholder={""}
            onChangeHyperlinkValue={(e) => onChangeHyperlinkValue(e, index)}
            onChangeHyperlinkType={(e) => onChangeHyperlinkType(e, index)}
            formItemHyperlinkTypePath={[...formItemPreName, index, "hyperlinkType"]}
            formItemHyperlinkValuePath={[...formItemPreName, index, "hyperlinkValue"]}
            prepareDataForHyperLink={props.prepareDataForHyperlink}
            defaultValue={
              props?.form.getFieldsValue()?.config?.signatureProduct?.signatureProducts[index]?.hyperlinkType
            }
          />
        </div>
      </Col>
    </Row>
  );
};
