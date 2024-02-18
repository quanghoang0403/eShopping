import React from "react";
import ProductListContentComponent from "./product-list-content.component";
import ProductListLoadingComponent from "./product-list-loading.component";
import ScrollSpyProvider from "./product-list-scroll-spy.provider";

const ProductListScrollSpy = (props) => {
  const {
    loading = false,
    categories = [],
    products = undefined,
    clickToFocusCustomize = undefined,
    styledCardProductList = undefined,
    paging = undefined,
    onChangeTab,
    isLoadData = true,
  } = props;
  if (loading) return <ProductListLoadingComponent />;
  if (!products) return <></>;

  return (
    <ScrollSpyProvider header={<></>}>
      <ProductListContentComponent
        styledCardProductList={styledCardProductList}
        categories={categories}
        products={products}
        paging={paging}
        clickToFocusCustomize={clickToFocusCustomize}
        onChangeTab={onChangeTab}
        isLoadData={isLoadData}
      />
    </ScrollSpyProvider>
  );
};
export default ProductListScrollSpy;
