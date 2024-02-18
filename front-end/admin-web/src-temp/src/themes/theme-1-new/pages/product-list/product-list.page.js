import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Index from "../../index";
import { Theme1ProductList } from "./product-list.component";

function ProductListPage(props) {
  return (
    <Index
      {...props}
      contentPage={(props) => {
        return <Theme1ProductList {...props} />;
      }}
    />
  );
}

export default ProductListPage;
