import { Col, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { EnumQRCodeStatus } from "../../../constants/enums";
import { Platform } from "../../../constants/platform.constants";
import { store } from "../../../modules";
import { qrOrderSelector } from "../../../modules/order/order.reducers";
import { productListPageDataSelector } from "../../../modules/product/product.reducers";
import { setPackageExpiredInfo } from "../../../modules/session/session.actions";
import { useAppCtx } from "../../../providers/app.provider";
import orderService from "../../../services/orders/order-service";
import posAddToCartServices from "../../../services/pos/pos-add-to-cart.services";
import posCartService from "../../../services/pos/pos-cart.services";
import PackageExpiredDialog from "../../../shared/components/package-expired-dialog/package-expired-dialog.component";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  DiningTableIcon,
  StoreIcon,
  WarningTriangle,
} from "../../assets/icons.constants";
import { BackIcon } from "../../assets/icons/BackIcon";
import DefaultLogo from "../../assets/images/coffee-mug-logo.png";
import ImageWithFallback from "../../components/fnb-image-with-fallback/fnb-image-with-fallback.component";
import MinHeader from "../../components/min-header/MinHeader";
import { CloseBranchContainer } from "../../containers/close-branch/close-branch.container";
import { useSearchParams } from "../../hooks";
import { EditOrderProductDialogComponent } from "../checkout/components/edit-order-product-dialog.component";
import BoxDrawer from "../order/components/BoxDrawer";
import "./POSProductList.style.scss";
import MenuProductCategory from "./components/menuProductCategory/MenuProductCategory";
import ProductCategoryComponent from "./components/productCategory/ProductCategoryComponent";

function POSProductListPage(props) {
  const { fontFamily } = props;
  const [t] = useTranslation();
  const history = useHistory();
  const { Toast } = useAppCtx();
  const viewDetailRef = useRef();
  const [categories, setCategories] = useState([]);
  const [dataMenuProductCategory, setDataMenuProductCategory] = useState([]);
  const [categoryIdSelected, setCategoryIdSelected] = useState(null);
  const [isVisibleBoxDrawerProductDetail, setIsVisibleBoxDrawerProductDetail] = useState(false);
  const productListPageData = useSelector(productListPageDataSelector);
  const reduxQROrder = useSelector(qrOrderSelector);
  const query = useSearchParams();
  const qrCodeId = query.get("qrCodeId");
  const paramIsLoadData = "isLoadData";
  const isLoadQRCodeData = query.get(paramIsLoadData);
  const screenRatio = 2;
  const TIME_DELAY = 200;

  const [currentProductCategoryId, setCurrentProductCategoryId] = useState(null);
  const [selectProductCategoryId, setSelectProductCategoryId] = useState(null);

  const pageData = {
    scanQRCodeSuccessfully: t("messages.scanQRCodeSuccessfully", "Scan QR code successfully"),
  };

  async function fetchQRCodeData(qrCodeId, forceReduxToChange) {
    if (qrCodeId) {
      const response = await orderService.getQrCodeOrderAsync(qrCodeId, forceReduxToChange);
      return response;
    }
  }

  async function initData() {
    const request = {
      branchId: reduxQROrder?.branchId,
    };
    await posCartService.fetchProductListPageDataAsync(request);
  }

  useEffect(() => {
    store?.dispatch(setPackageExpiredInfo(null));
    if (reduxQROrder?.qrCodeId) {
      //QR Code Is Expired
      if (reduxQROrder?.qrCodeStatus === EnumQRCodeStatus.Finished && !reduxQROrder?.isStopped) {
        goToHomePage(true);
      } else if (reduxQROrder?.isStopped || reduxQROrder?.qrCodeStatus !== EnumQRCodeStatus.Active) {
        goToHomePage();
      } else {
        initData();
        if (isLoadQRCodeData === "true") {
          query.delete(paramIsLoadData);
          history.replace({
            search: query.toString(),
          });
          handleShowToastSuccess();
        }
      }
    }
  }, [reduxQROrder]);

  useEffect(() => {
    let _qrCodeId = qrCodeId;
    if (!_qrCodeId) {
      _qrCodeId = reduxQROrder?.qrCodeId;
    }
    if (_qrCodeId) {
      fetchQRCodeData(_qrCodeId, true).then((isSuccess) => {
        if (!isSuccess) {
          goToHomePage();
        }
      });
    } else {
      goToHomePage();
    }
  }, []);

  function goToHomePage(isShowExpiredToast = false) {
    posCartService.cleanPOSCartAsync(history.push("/"));
    const _message = isShowExpiredToast ? t("messages.qrCodeIsExpired") : t("messages.qrCodeIsNotAvailable");
    Toast.show({
      messageType: "warning",
      message: _message,
      icon: <WarningTriangle />,
      placement: "bottom",
      duration: 3,
    });
  }

  useEffect(() => {
    if (productListPageData && productListPageData?.length > 0) {
      setCategories(productListPageData);
      setDataMenuProductCategory(productListPageData);
      setCategoryIdSelected(productListPageData?.[0]?.id);
    }
  }, [productListPageData]);

  function handleShowToastSuccess() {
    Toast.show({
      messageType: "success",
      message: pageData.scanQRCodeSuccessfully,
      icon: <CheckCircleIcon />,
      placement: "bottom",
      duration: 3,
    });
  }

  function handleChangeProductCategoryTab(categoryId) {
    // scroll to content
    const element = document.getElementById("product-category-" + categoryId);
    if (element) {
      setSelectProductCategoryId(categoryId);
      setTimeout(() => {
        setSelectProductCategoryId(null);
      }, 1000);
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function handleShowProductDetail(item) {
    setIsVisibleBoxDrawerProductDetail(true);
    if (item?.isCombo) {
      const comboData = await posAddToCartServices.getComboDetailAsync(item?.id, item?.comboTypeId);
      setTimeout(() => {
        viewDetailRef?.current?.setProductData(comboData, -1);
      }, TIME_DELAY);
    } else {
      const productData = {
        isCombo: false,
        id: item?.id,
        quantity: 1,
        productPrice: {
          id: item?.productPriceDefault?.id,
          originalPrice: item?.productPriceDefault?.originalPrice,
          priceValue: item?.productPriceDefault?.sellingPrice,
          isApplyPromotion:
            item?.productPriceDefault?.discountAmount?.id !== null &&
            item?.productPriceDefault?.discountAmount?.id !== undefined,
          promotionId: item?.productPriceDefault?.discountAmount?.id,
          isDiscountPercent: item?.productPriceDefault?.discountAmount?.isPercentDiscount,
          discountValue: item?.productPriceDefault?.discountAmount?.isPercentDiscount
            ? item?.productPriceDefault?.discountAmount?.percentNumber
            : item?.productPriceDefault?.discountAmount?.maximumDiscountAmount,
        },
        toppings: [],
        options: [],
        branchId: reduxQROrder?.branchId,
      };
      setTimeout(() => {
        viewDetailRef?.current?.setProductData(productData, -1);
      }, TIME_DELAY);
    }
  }

  function handleCloseViewDetail() {
    setIsVisibleBoxDrawerProductDetail(false);
  }

  // In the mobile interface: when hiding/showing the toolbar
  // The height must be reassigned so that the interface does not break
  const windowHeight = () => {
    const element = document.documentElement;
    element.style.setProperty("--window-height", `${window.innerHeight}px`);
  };
  window.addEventListener("resize", windowHeight);
  windowHeight();

  function handleScrollContent(e) {
    const handleScroll = () => {
      const container = e.target; // Replace 'e.target' with your scrollable container element
      const elements = document.querySelectorAll(".product-category");
      const viewportHeight = e.target.offsetHeight;
      const offsetTop = e.target.offsetTop;
      if (elements) {
        elements.forEach((element) => {
          const { top, height } = element.getBoundingClientRect();
          const middlePosition = viewportHeight / screenRatio;
          if (top - offsetTop <= middlePosition && top + height - offsetTop >= middlePosition) {
            const productCategoryId = element.getAttribute("data-id");
            if (productCategoryId && currentProductCategoryId !== productCategoryId) {
              if (selectProductCategoryId) {
                setCurrentProductCategoryId(selectProductCategoryId);
              } else {
                setCurrentProductCategoryId(productCategoryId);
              }
            }
          }

          const isAtTop = e.target.scrollTop === 0;
          if (isAtTop) {
            const productCategoryId = element.getAttribute("data-id");
            if (productCategoryId && currentProductCategoryId !== productCategoryId) {
              setCurrentProductCategoryId(categories?.[0]?.id);
            }
          }

          const isAtBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight;
          if (isAtBottom) {
            const productCategoryId = element.getAttribute("data-id");
            if (productCategoryId && currentProductCategoryId !== productCategoryId) {
              setCurrentProductCategoryId(productCategoryId);
            }
          }
        });
      }
    };
    handleScroll();
  }

  return (
    <>
      <div className="pos-product-list" style={{ fontFamily: fontFamily }}>
        <MinHeader
          addonBefore={
            <a href={qrCodeId ? `/action-page?qrCodeId=${qrCodeId}` : "/action-page"}>
              <ArrowLeftIcon className="arrow-left-icon" />
            </a>
          }
          addonBetween={
            reduxQROrder?.storeLogo && (
              <ImageWithFallback
                src={reduxQROrder?.storeLogo}
                alt="icon"
                fallbackSrc={DefaultLogo}
                className="logo-original-theme"
              />
            )
          }
        />
        <div className="pos-product-list-body" id="pos-product-list-body">
          <CloseBranchContainer branchId={reduxQROrder?.branchId} />
          <Col className="store-info">
            <Row className="store-info-title">
              <StoreIcon className="icon" />
              <span className="text">{reduxQROrder?.branchName}</span>
            </Row>
            <Row className="store-info-sub-title">
              <DiningTableIcon className="icon" />
              <span className="text">{reduxQROrder?.areaName}</span>
            </Row>
          </Col>

          <MenuProductCategory
            data={dataMenuProductCategory}
            categoryIdSelected={categoryIdSelected}
            productCategoryId={currentProductCategoryId}
            onChange={handleChangeProductCategoryTab}
          />

          <div className="list-product-container" id="listProductContainer" onScroll={handleScrollContent}>
            {categories?.map((item) => {
              return (
                <ProductCategoryComponent
                  data={item}
                  key={item?.id}
                  handleShowProductDetail={handleShowProductDetail}
                  branchId={reduxQROrder?.branchId}
                />
              );
            })}
          </div>
        </div>
        <BoxDrawer
          closeIcon={<BackIcon />}
          closable={true}
          className="edit-cart-item-box-drawer"
          title={""}
          height={"100%"}
          open={isVisibleBoxDrawerProductDetail}
          onClose={handleCloseViewDetail}
          destroyOnClose={true}
          style={{ fontFamily: fontFamily }}
          body={
            <EditOrderProductDialogComponent
              ref={viewDetailRef}
              onCancel={handleCloseViewDetail}
              setCurrentCartItems={() => {}}
              isPOS={true}
              branchIdPos={reduxQROrder?.branchId}
              platformId={Platform.POS}
              fontFamily={fontFamily}
            />
          }
        />
      </div>
      <PackageExpiredDialog />
    </>
  );
}

export default React.memo(POSProductListPage, (prevProps, nextProps) => true);
