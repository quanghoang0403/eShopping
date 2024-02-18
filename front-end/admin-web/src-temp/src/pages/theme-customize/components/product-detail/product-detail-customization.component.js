import { ProductDetailStoreWebIcon } from "constants/icons.constants";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FnbBackgroundCustomizeComponent } from "../fnb-background-customize/fnb-background-customize";
import "./product-detail-customization.component.scss";
export default function ProductDetailCustomizationComponent(props) {
  const { setStoreThemeData, form, newStoreThemeData } = props;
  const [t] = useTranslation();
  const pageData = {
    productDetailTitle: t("storeWebPage.productDetail"),
  };
  const maxSizeUploadMb = 20;
  const bestDisplay = "1920 x 760 px";
  const dataTmp = {
    storeThemeConfiguration: {
      page: {
        productDetail: {
          backgroundType: "color",
          backgroundColorHex: "red",
          BackgroundImageUrl: "",
          ColorGroupId: 0,
        },
      },
    },
  };

  useEffect(() => {
    form.setFieldsValue({ productDetail: productDetail });
  }, []);

  const productDetail = newStoreThemeData?.storeThemeConfiguration?.pages?.productDetail;
  const changeGeneralCustomization = (key, value) => {
    if (newStoreThemeData) {
      const { storeThemeConfiguration } = newStoreThemeData;
      const { pages } = storeThemeConfiguration;
      const { productDetail } = pages;

      let newData = {
        storeThemeConfiguration: {
          ...storeThemeConfiguration,
          pages: {
            ...pages,
            productDetail: {
              ...productDetail,
              [key]: value,
            },
          },
        },
      };
      setStoreThemeData(newData);
    }
  };

  return (
    <div className="product-detail-customization-content">
      <div className="product-detail-customization-header">
        <ProductDetailStoreWebIcon className="product-detail-customization-icon-title" />
        <span className="product-detail-customization-title">{pageData.productDetailTitle}</span>
      </div>
      <div className="product-detail-customization-body">
        <FnbBackgroundCustomizeComponent
          defaultOption={productDetail?.backgroundType}
          prevName={"productDetail"}
          form={form}
          storeThemeData={newStoreThemeData}
          changeValueOfKey={changeGeneralCustomization}
          primaryColorDefault={productDetail?.backgroundColorHex}
          maxSizeUploadMb={maxSizeUploadMb}
          bestDisplay={bestDisplay}
          parentBlockCustom={"pages"}
        />
      </div>
    </div>
  );
}
