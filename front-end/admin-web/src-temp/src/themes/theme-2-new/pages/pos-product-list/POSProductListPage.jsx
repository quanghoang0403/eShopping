import { Col, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Platform } from "../../../constants/platform.constants";
import qrCodeDataService from "../../../data-services/qrcode-data.service";
import { store } from "../../../modules";
import { qrOrderSelector } from "../../../modules/order/order.reducers";
import { productListPageDataSelector } from "../../../modules/product/product.reducers";
import { setPackageExpiredInfo } from "../../../modules/session/session.actions";
import { useAppCtx } from "../../../providers/app.provider";
import posAddToCartServices from "../../../services/pos/pos-add-to-cart.services";
import posCartService from "../../../services/pos/pos-cart.services";
import PackageExpiredDialog from "../../../shared/components/package-expired-dialog/package-expired-dialog.component";
import { StringWithLimitLength } from "../../../utils/helpers";
import { getStorage } from "../../../utils/localStorage.helpers";
import {
  ArrowBackIcon,
  ArrowRightIcon,
  LocationDiningTableIcon,
  ScanQRCodeSuccessfully,
  StoreIcon,
} from "../../assets/icons.constants";
import { BackIcon } from "../../assets/icons/BackIcon";
import EditOrderItem from "../../components/edit-order-item/edit-order-item.component";
import MinHeader from "../../components/min-header/MinHeader";
import { CloseBranchContainer } from "../../containers/close-branch/close-branch.container";
import { useSearchParams } from "../../hooks";
import BoxDrawer from "../order/components/BoxDrawer";
import "./POSProductListPage.scss";
import ProductCategoryComponent from "./components/ProductCategoryComponent";

export function POSProductListPage(props) {
  const { fontFamily } = props;
  const menuRef = useRef(null);
  const [swiperRef, setSwiperRef] = useState(null);
  const reduxQROrder = useSelector(qrOrderSelector);
  const query = useSearchParams();
  const qrCodeId = query.get("qrCodeId");
  const storageConfig = JSON.parse(getStorage("config")); //Refactor later

  async function fetchQRCodeData(qrCodeId) {
    if (qrCodeId) {
      const response = await qrCodeDataService.getQrCodeOrderAsync(qrCodeId);
      return response;
    }
  }

  const [t] = useTranslation();
  const [currentProductCategoryId, setCurrentProductCategoryId] = useState(null);

  const { Toast } = useAppCtx();
  const [categorys, setCategorys] = useState([]);
  const history = useHistory();
  const [categoryIdSelected, setCategoryIdSelected] = useState(null);

  const [isVisibleBoxDrawerProductDetail, setIsVisibleBoxDrawerProductDetail] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const productListPageData = useSelector(productListPageDataSelector);
  const indexAddToCart = -1;

  useEffect(() => {
    if (productListPageData && productListPageData?.length > 0) {
      setCategorys(productListPageData);
      setCategoryIdSelected(productListPageData?.[0]?.id);
    }
  }, [productListPageData]);

  async function initData() {
    const request = {
      branchId: reduxQROrder?.branchId,
    };
    await posCartService.fetchProductListPageDataAsync(request);
  }

  useEffect(() => {
    store?.dispatch(setPackageExpiredInfo(null));
    initData();
    handleShowToastSuccess();
  }, [reduxQROrder]);

  useEffect(() => {
    if (qrCodeId) {
      if (qrCodeId === reduxQROrder?.qrCodeId) {
        handleShowToastSuccess();
        initData();
      } else {
        fetchQRCodeData(qrCodeId).then((isSuccess) => {
          if (!isSuccess) {
            if (reduxQROrder) {
              initData();
            } else {
              goToHomePage();
            }
          }
        });
      }
    } else if (reduxQROrder) {
      handleShowToastSuccess();
      initData();
    } else {
      goToHomePage();
    }
  }, []);

  useEffect(() => {
    let nav = document.querySelectorAll(".swiper-slide");
    let indexMenuItem = Array.from(nav).findIndex((el) => el.id === `title_${categoryIdSelected}`);

    if (swiperRef && indexMenuItem !== -1 && !checkIfVisible(indexMenuItem)) {
      swiperRef.slideTo(indexMenuItem, 0);
    }
  }, [categoryIdSelected]);

  const swiperPosition = document.getElementById("product-menu-swiper")?.getBoundingClientRect();
  function checkIfVisible(index) {
    if (swiperRef && index && swiperPosition) {
      const slide = swiperRef.slides[index];
      const slidePosition = slide ? slide.getBoundingClientRect() : null;
      return slidePosition && slidePosition.left > swiperPosition.left && slidePosition.right < swiperPosition.right;
    }
    return false;
  }

  function goToHomePage() {
    posCartService.cleanPOSCartAsync(history.push("/"));
    Toast.show({
      messageType: "warning",
      message: t("messages.qrCodeIsNotAvailable"),
      icon: <ScanQRCodeSuccessfully />,
      placement: "bottom",
      duration: 3,
    });
  }

  function handleShowToastSuccess() {
    const previousQrCode = localStorage.getItem("QR_CODE");
    if (reduxQROrder?.qrCodeId !== previousQrCode) {
      localStorage.setItem("QR_CODE", reduxQROrder?.qrCodeId);
      Toast.show({
        messageType: "success",
        message: t("messages.scanQRCodeSuccessfully"),
        icon: <ScanQRCodeSuccessfully />,
        placement: "bottom",
        duration: 3,
      });
    }
  }

  async function handleShowProductDetail(item) {
    setIsVisibleBoxDrawerProductDetail(true);
    if (item?.isCombo) {
      const comboData = await posAddToCartServices.getComboDetailAsync(item?.id, item?.comboTypeId);
      setDataEdit(comboData);
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
      setDataEdit(productData);
    }
  }

  function handleCloseViewDetail() {
    setIsVisibleBoxDrawerProductDetail(false);
  }

  function handleClick(event, id) {
    setCategoryIdSelected(id);
    document.getElementById(id)?.scrollIntoView({
      block: "start",
    });
    const element = document.getElementById("product-category-" + id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  const max1Lines = 50;

  const renderCategories = categorys.map((pc, index) => {
    const N_COMBOS = categorys?.length;
    const isHasLeft = index + N_COMBOS > 0;
    const isHasRight = index + N_COMBOS < categorys.length + categorys.length - 1;
    const categoryStyle = {};
    if (isHasLeft) {
      Object.assign(categoryStyle, { paddingLeft: 24 });
    }
    if (isHasRight) {
      Object.assign(categoryStyle, { paddingRight: 24 });
    }
    if (categoryIdSelected === pc?.id) {
      Object.assign(categoryStyle, {
        color: "rgb(255, 255, 255)",
        backgroundColor: "rgb(219, 77, 41)",
        borderColor: "transparent",
        borderWidth: "1px",
      });
    }
    return (
      <SwiperSlide
        style={categoryStyle}
        className={"li-normal"}
        key={pc.id}
        onClick={(event) => {
          handleClick(event, pc?.id);
        }}
        id={"title_" + pc?.id}
      >
        {StringWithLimitLength(pc?.name, max1Lines, "...")}
      </SwiperSlide>
    );
  });

  const renderMenus = (
    <div id="nav-category-sticky" className="nav-category-sticky">
      <div className={`product-menu`} ref={menuRef}>
        <div className="arrow-left">
          <ArrowRightIcon width={24} height={24} />
        </div>
        <Swiper
          onSwiper={setSwiperRef}
          grabCursor={true}
          preventClicks={true}
          simulateTouch={true}
          slidesPerGroupAuto={true}
          navigation={{ nextEl: ".arrow-right", prevEl: ".arrow-left" }}
          slidesPerView={"auto"}
          modules={[Navigation]}
          className="swiper-related-product"
          id="product-menu-swiper"
        >
          {renderCategories}
        </Swiper>
        <div className="arrow-right">
          <ArrowRightIcon width={24} height={24} />
        </div>
      </div>
    </div>
  );

  function handleScrollContent(e) {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".product-category");
      const viewportHeight = e.target.offsetHeight;
      const offsetTop = e.target.offsetTop;
      if (elements) {
        elements.forEach((element) => {
          const { top, height } = element.getBoundingClientRect();
          const middlePosition = viewportHeight / 2;
          if (top - offsetTop <= middlePosition && top + height - offsetTop >= middlePosition) {
            const productCategoryId = element.getAttribute("data-id");
            if (productCategoryId && currentProductCategoryId !== productCategoryId) {
              setCategoryIdSelected(productCategoryId);
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
              <ArrowBackIcon className="arrow-left-icon" />
            </a>
          }
        />
        <Col className="store-info">
          <Row className="store-info-title">
            <StoreIcon className="icon" />
            <span className="text">{reduxQROrder?.branchName}</span>
          </Row>
          <Row className="store-info-sub-title">
            <LocationDiningTableIcon className="icon" />
            <span className="text">{reduxQROrder?.areaName}</span>
          </Row>
        </Col>

        <div className="pos-product-list-body" id="pos-product-list-body">
          <CloseBranchContainer branchId={reduxQROrder?.branchId} />
          {renderMenus}
          <div className="list-product-container" id="listProductContainer" onScroll={handleScrollContent}>
            {categorys?.map((item) => {
              return (
                <ProductCategoryComponent
                  data={item}
                  key={item?.id}
                  handleShowProductDetail={handleShowProductDetail}
                />
              );
            })}
          </div>
        </div>
        <BoxDrawer
          closeIcon={<BackIcon />}
          closable={true}
          className="product-detail-box-drawer"
          title={""}
          height={"100%"}
          open={isVisibleBoxDrawerProductDetail}
          onClose={handleCloseViewDetail}
          forceRender={true}
          destroyOnClose={true}
          body={
            <EditOrderItem
              {...props}
              dataEdit={{ ...dataEdit }}
              indexDefault={indexAddToCart}
              onCancel={handleCloseViewDetail}
              stateConfig={storageConfig}
              calculateShoppingCart={() => {}}
              isPos={true}
              branchIdPos={reduxQROrder?.branchId}
              platformId={Platform.POS}
            />
          }
        />
      </div>
      <PackageExpiredDialog />
    </>
  );
}
