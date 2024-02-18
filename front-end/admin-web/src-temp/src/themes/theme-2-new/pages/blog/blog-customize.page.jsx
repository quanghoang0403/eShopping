import { ProductDetailTitleIcon } from "../../assets/icons.constants";
import BlogCustomize from "./components/BlogCustomize";

export const BlogCustomizePage = [
  {
    icon: <ProductDetailTitleIcon />,
    title: "blog.blogs",
    isNormal: true,
    defaultActiveKey: 0,
    iconRight: null,
    collapsible: false,
    name: "blog",
    content: (props) => {
      return <BlogCustomize {...props} />;
    },
  },
];
