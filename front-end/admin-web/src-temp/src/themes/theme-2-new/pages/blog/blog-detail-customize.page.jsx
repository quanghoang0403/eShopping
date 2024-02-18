import { ProductDetailTitleIcon } from "../../assets/icons.constants";
import BlogDetailCustomize from "./components/BlogDetailCustomize";

export const BlogDetailCustomizePage = [
  {
    icon: <ProductDetailTitleIcon />,
    title: "Blog detail",
    isNormal: true,
    defaultActiveKey: 0,
    iconRight: null,
    collapsible: "false",
    name: "blog-detail",
    content: (props) => {
      return <BlogDetailCustomize {...props} />;
    },
  },
];
