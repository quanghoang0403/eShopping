import React from "react";
import { CloseBranchContainer } from "../../../containers/close-branch/close-branch.container";
import ProductListContentComponent from "./product-list-content.component";
import ProductListHeaderComponent from "./product-list-header.component";
import ProductListLoadingComponent from "./product-list-loading.component";
import ScrollSpyProvider from "./product-list-scroll-spy.provider";

const ProductListScrollSpy = (props) => {
  const {
    isDefault = false,
    loading = false,
    categories = [],
    products = undefined,
    clickToFocusCustomize = undefined,
    styleHeader = undefined,
    styledCardProductList = undefined,
    storeCurrencyCode = "",
    storeCurrencySymbol = "",
    paging = undefined,
    branchId,
  } = props;
  if (loading) return <ProductListLoadingComponent />;
  if (!products) return <></>;
  return (
    <ScrollSpyProvider
      header={
        <ProductListHeaderComponent
          isDefault={isDefault}
          styleHeader={styleHeader}
          clickToFocusCustomize={clickToFocusCustomize}
        />
      }
    >
      <CloseBranchContainer branchId={branchId} />
      <ProductListContentComponent
        styleHeader={styleHeader}
        isDefault={isDefault}
        styledCardProductList={styledCardProductList}
        storeCurrencyCode={storeCurrencyCode}
        storeCurrencySymbol={storeCurrencySymbol}
        categories={categories}
        products={products}
        paging={paging}
        clickToFocusCustomize={clickToFocusCustomize}
      />
    </ScrollSpyProvider>
  );
};
export default ProductListScrollSpy;
