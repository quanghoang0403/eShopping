import Index from "../../index";
import ProductListTheme1 from "./components/product-list.component";
import ProductListTheme1Customize from "./components/product-list.customize";

export default function ProductListPage(props) {
  return (
    <Index
      {...props}
      contentPage={(props) => {
        return (
          <>
            {window.location.pathname.includes("online-store/theme-customize") ? (
              <ProductListTheme1Customize {...props} />
            ) : (
              <ProductListTheme1 {...props} />
            )}
          </>
        );
      }}
    />
  );
}
