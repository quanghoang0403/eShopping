import Layout from "antd/lib/layout/layout";
import Index from "../../index";
import ProductListPageDetail from "./components/product-list.detail.page";
import ProductListPageHeader from "./components/product-list.header.page";
import { ScrollHeaderType } from "../../constants/string.constant";

function ProductListPage(props) {
  const { colorGroups, clickToFocusCustomize, productList, isDefault, scrollType } = props;
  return (
    <>
      <Layout className="product-list-layout">
        <div>
          <ProductListPageHeader
            configuration={productList?.header}
            colorGroups={colorGroups}
            clickToFocusCustomize={clickToFocusCustomize}
            isDefault={isDefault}
            scrollType={scrollType}
          />
        </div>
        <div>
          <ProductListPageDetail
            configuration={productList?.productsProductList}
            colorGroups={colorGroups}
            clickToFocusCustomize={clickToFocusCustomize}
            isDefault={isDefault}
            scrollType={scrollType}
          />
        </div>
      </Layout>
    </>
  );
}

export default function Theme2ProductList(props) {
  return (
    <Index
      {...props}
      contentPage={(props) => {
        return (
          <>
            <ProductListPage
              clickToFocusCustomize={props?.clickToFocusCustomize}
              productList={props?.config}
              colorGroups={props?.general?.color?.colorGroups}
              isDefault={props?.isDefault}
              scrollType={props?.general?.header?.scrollType}
            />
          </>
        );
      }}
    />
  );
}
