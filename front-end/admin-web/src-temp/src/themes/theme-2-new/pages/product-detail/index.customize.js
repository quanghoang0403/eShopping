import { ProductDetailTitleIcon } from "../../assets/icons.constants";
import CustomizeDetailComponent from "./components/customize-detail.component";

export const ProductDetailCustomize = [
  {
    icon: <ProductDetailTitleIcon />,
    title: "storeWebPage.productDetail",
    isNormal: true,
    defaultActiveKey: 0,
    iconRight: null,
    collapsible: "disabled",
    name: "product-detail",
    content: (props) => {
      return <CustomizeDetailComponent {...props} />;
    },
  },
];
