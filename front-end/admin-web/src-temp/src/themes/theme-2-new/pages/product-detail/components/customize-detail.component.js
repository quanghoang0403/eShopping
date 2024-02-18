import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomizationGroup from "../../../components/customization-group-component/customization-group.page";
import { FnbInput } from "../../../components/fnb-input/fnb-input.component";
import SelectBackgroundComponent from "../../../components/select-background/select-background.component";
import SelectColorGroupComponent from "../../../components/select-color-group/select-color-group.component";
import { backgroundTypeEnum, theme2ElementCustomize } from "../../../constants/store-web-page.constants";

export default function CustomizeDetailComponent(props) {
  const [t] = useTranslation();
  const { form, updateFormValues, onChange } = props;
  const { getFieldsValue } = form;
  const translateData = {
    headerTitle: t("storeWebPage.header.title"),
    productDetailTitle: t("storeWebPage.productDetail"),
    relatedProductTitle: t("storeWebPage.productDetailPage.relatedProducts"),
  };

  useEffect(() => {
    if (updateFormValues) {
      updateFormValues();
    }
  });

  const onChangeBackgroundHeader = (value) => {
    let changedValue = {
      key: [],
      value: null,
    };
    if (value === backgroundTypeEnum.IMAGE) {
      changedValue.key = ["config", "header", "backgroundColor"];
    } else {
      changedValue.key = ["config", "header", "backgroundImage"];
    }

    if (onChange) {
      onChange(changedValue);
    }
  };

  const onChangeBackgroundBody = (value) => {
    let changedValue = {
      key: [],
      value: null,
    };
    if (value === backgroundTypeEnum.IMAGE) {
      changedValue.key = ["config", "productDetail", "backgroundColor"];
    } else {
      changedValue.key = ["config", "productDetail", "backgroundImage"];
    }
    if (onChange) {
      onChange(changedValue);
    }
  };

  const onChangeBackgroundRelatedProducts = (value) => {
    let changedValue = {
      key: [],
      value: null,
    };
    if (value === backgroundTypeEnum.IMAGE) {
      changedValue.key = ["config", "relatedProducts", "backgroundColor"];
    } else {
      changedValue.key = ["config", "relatedProducts", "backgroundImage"];
    }
    if (onChange) {
      onChange(changedValue);
    }
  };

  return (
    <>
      <CustomizationGroup
        title={translateData.headerTitle}
        defaultActiveKey={"0"}
        content={
          <>
            <SelectBackgroundComponent
              {...props}
              formItemPreName={["config", "header"]}
              backgroundCustomize={getFieldsValue()?.config?.header}
              onChangeBackgroundType={onChangeBackgroundHeader}
              maxSizeUploadMb={20}
            />
            <SelectColorGroupComponent {...props} formItemPreName={["config", "header"]} />
          </>
        }
        clickToScroll="#productDetailHeader"
        customizeKey={theme2ElementCustomize.HeaderProductDetail}
      ></CustomizationGroup>

      <CustomizationGroup
        title={translateData.productDetailTitle}
        defaultActiveKey={"0"}
        content={
          <>
            <SelectBackgroundComponent
              {...props}
              formItemPreName={["config", "productDetail"]}
              backgroundCustomize={getFieldsValue()?.config?.productDetail}
              onChangeBackgroundType={onChangeBackgroundBody}
              maxSizeUploadMb={20}
            />
            <SelectColorGroupComponent {...props} formItemPreName={["config", "productDetail"]} />
          </>
        }
        clickToScroll="#productDetailBodyandChat"
        customizeKey={theme2ElementCustomize.MainProductDetail}
      ></CustomizationGroup>

      <CustomizationGroup
        title={translateData.relatedProductTitle}
        defaultActiveKey={"0"}
        content={
          <>
            <SelectBackgroundComponent
              {...props}
              formItemPreName={["config", "relatedProducts"]}
              backgroundCustomize={getFieldsValue()?.config?.relatedProducts}
              onChangeBackgroundType={onChangeBackgroundRelatedProducts}
              maxSizeUploadMb={20}
            />
            <SelectColorGroupComponent {...props} formItemPreName={["config", "relatedProducts"]} />

            <div className="related-product-detail-title">
              <p>Title</p>
              <Form.Item
                name={["config", "relatedProducts", "title"]}
              >
                <FnbInput showCount allowClear placeholder="Title" maxLength={100} />
              </Form.Item>
            </div>
          </>
        }
        clickToScroll="#relatedProductsDetail"
        customizeKey={theme2ElementCustomize.RelatedProductDetail}
      ></CustomizationGroup>
    </>
  );
}
