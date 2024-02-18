import { theme1ElementCustomize } from "../../constants/store-web-page.constants";
import { StoreWebBannerIcon } from "../../assets/icons.constants";
import SelectBackgroundComponent from "../../components/select-background.component";
import SelectColorGroupComponent from "../../components/select-color-group.component";

export const ProductDetailCustomizes = [
  {
    icon: <StoreWebBannerIcon />,
    title: "General customization",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: false,
    name: "productDetail",
    customizeKey: theme1ElementCustomize.ProductDetail,
    content: (props) => {
      return (
        <>
          <SelectBackgroundComponent
            {...props}
            formItemPreName={["config"]}
            backgroundCustomize={props?.pageConfig.config}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config"]} />
        </>
      );
    },
  },
];
