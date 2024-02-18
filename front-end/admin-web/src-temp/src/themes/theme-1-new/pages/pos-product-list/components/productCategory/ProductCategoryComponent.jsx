import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EnumAddToCartType } from "../../../../../constants/enums";
import { Platform } from "../../../../../constants/platform.constants";
import productDataService from "../../../../../data-services/product-data.service";
import { useAppCtx } from "../../../../../providers/app.provider";
import posAddToCartServices from "../../../../../services/pos/pos-add-to-cart.services";
import { isVisible, throttle } from "../../../../../utils/helpers";
import { CheckCircleIcon } from "../../../../assets/icons.constants";
import { FnbLoadingSpinner } from "../../../../components/fnb-loading-spinner/fnb-loading-spinner.component";
import ProductCartComponent from "../../../../components/product-cart/ProductCartComponent";
import { TIME_DELAY } from "../../../../hooks/useDebounce";
import { classLoadMoreData } from "../../POSProductList.provider";
import "./ProductCategoryComponent.scss";
export default function ProductCategoryComponent(props) {
  const { data, handleShowProductDetail, branchId } = props;
  const pageSize = 20;
  const [t] = useTranslation();
  const { Toast } = useAppCtx();

  const [dataProductCategory, setDataProductCategory] = useState(data);
  const [isAllowLoadData, setIsAllowLoadData] = useState(true);

  function getProductByCategory(categoryId, pageNumber, elementLoadMoreData) {
    if (!isAllowLoadData) return;

    setIsAllowLoadData(false);
    if (elementLoadMoreData) {
      elementLoadMoreData?.children?.[0].classList.remove("d-none");
    }

    const request = {
      platformId: Platform.POS,
      categoryId: categoryId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      branchId: branchId,
    };

    productDataService
      .getProductsAsync(request)
      .then((response) => {
        const responseData = response?.data;
        if (responseData?.succeeded) {
          const productsOfCategory = responseData?.data?.productCategorys[0]?.products;
          if (productsOfCategory?.length > 0) {
            let dataProductCategoryNew = { ...dataProductCategory };
            if (request.pageNumber === 1) {
              dataProductCategoryNew.products = [...productsOfCategory];
            } else {
              dataProductCategoryNew.products = [...dataProductCategoryNew.products, ...productsOfCategory];
            }
            dataProductCategoryNew.currentPage = request.pageNumber;
            setDataProductCategory(dataProductCategoryNew);
          }
        }
      })
      .catch((errors) => {})
      .finally(() => {
        setIsAllowLoadData(true);
        if (elementLoadMoreData) {
          elementLoadMoreData?.children?.[0].classList.add("d-none");
        }
      });
  }

  function getProductByCategoryDeplay(categoryId, pageNumber, elementLoadMoreData) {
    if (window.getProductByCategory) {
      clearTimeout(window.getProductByCategory);
    }
    window.getProductByCategory = setTimeout(() => {
      getProductByCategory(categoryId, pageNumber, elementLoadMoreData);
    }, TIME_DELAY);
  }

  function handleWindowScroll() {
    const elementLoadMoreData = document.getElementById(dataProductCategory?.id);
    if (elementLoadMoreData) {
      const elementIsVisible = isVisible(elementLoadMoreData);
      if (elementIsVisible) {
        const categoryIdIsVisible = elementLoadMoreData.id;
        let pageNumber = 1;
        const currentPage = dataProductCategory?.currentPage;
        if (currentPage > 0) {
          pageNumber = currentPage + 1;
        }
        getProductByCategoryDeplay(categoryIdIsVisible, pageNumber, elementLoadMoreData);
      }
    }
  }

  useEffect(() => {
    const element = document.getElementById("listProductContainer");
    if (element) {
      element.addEventListener("scroll", throttle(handleWindowScroll, TIME_DELAY));
      return () => {
        element.removeEventListener("scroll", throttle(handleWindowScroll, TIME_DELAY));
      };
    }
  }, [handleWindowScroll]);

  function mappingProductToProductCartData(item) {
    return {
      name: Boolean(item?.productPriceDefault?.name)
        ? `${item?.name} (${item?.productPriceDefault?.name})`
        : item?.name,
      promotionTag: item?.productPriceDefault?.promotionTag,
      sellingPrice: item?.productPriceDefault?.sellingPrice,
      originalPrice: item?.productPriceDefault?.originalPrice,
      thumbnail: item?.thumbnail,
    };
  }

  function handleQuickAddComboToCart(item) {
    let request = {
      id: item?.id,
    };
    const isSuccess = posAddToCartServices.quickAddToCartAsync(request, dataProductCategory?.comboTypeId, branchId);
    if (isSuccess) {
      Toast.show({
        messageType: "success",
        message: t("addCartItemToastMessage", "Sản phẩm đã được thêm vào giỏ hàng thành công"),
        icon: <CheckCircleIcon />,
        placement: "top",
        duration: 3,
        className: "toast-message-add-to-cart-theme1",
      });
    }
  }

  async function handleQuickAddProductToCart(item) {
    const request = {
      id: item?.id, //productId
      productPriceId: item?.productPriceDefault?.id, //productPriceId
    };
    const isSuccess = await posAddToCartServices.quickAddToCartAsync(request, EnumAddToCartType.Product, branchId);
    if (isSuccess) {
      Toast.show({
        messageType: "success",
        message: t("addCartItemToastMessage", "Sản phẩm đã được thêm vào giỏ hàng thành công"),
        icon: <CheckCircleIcon />,
        placement: "top",
        duration: 3,
        className: "toast-message-add-to-cart-theme1",
      });
    }
  }

  return (
    <div
      className="product-category"
      id={`product-category-${dataProductCategory?.id}`}
      data-id={dataProductCategory?.id}
    >
      <Row className="product-category-header">
        <div className="text-line-clamp-1 product-category-name">{dataProductCategory?.name} </div>
        <span className="product-quantity">({dataProductCategory?.totalQuantity})</span>
      </Row>
      <div className="product-category-body">
        <Row
          gutter={[
            { xs: 16, sm: 24 },
            { xs: 16, sm: 24 },
          ]}
        >
          {dataProductCategory?.isCombo
            ? dataProductCategory?.comboItems.map((item) => {
                const _data = {
                  ...item,
                  thumbnail: dataProductCategory?.thumbnail,
                  comboTypeId: dataProductCategory?.comboTypeId,
                  isCombo: true,
                };
                return (
                  <Col xs={12} sm={8} md={8} key={item?.id}>
                    <ProductCartComponent
                      data={_data}
                      onClickButtonAdd={() => handleQuickAddComboToCart(item)}
                      onClickTitle={() => handleShowProductDetail(_data)}
                    />
                  </Col>
                );
              })
            : dataProductCategory?.products.map((item) => {
                const _data = mappingProductToProductCartData(item);
                return (
                  <Col xs={12} sm={8} md={8} key={item?.id}>
                    <ProductCartComponent
                      data={_data}
                      onClickButtonAdd={() => handleQuickAddProductToCart(item)}
                      onClickTitle={() => handleShowProductDetail(item)}
                    />
                  </Col>
                );
              })}
          {dataProductCategory?.totalQuantity > dataProductCategory?.products?.length && (
            <div className={`${classLoadMoreData}`} id={dataProductCategory?.id}>
              <div className="d-none center">
                <FnbLoadingSpinner />
              </div>
            </div>
          )}
        </Row>
      </div>
    </div>
  );
}
