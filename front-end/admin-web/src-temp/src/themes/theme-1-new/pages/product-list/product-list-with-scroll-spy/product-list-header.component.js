import { Col, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from "swiper/react";
import { getStorage } from "../../../../utils/localStorage.helpers";
import { theme1ElementCustomize } from "../../../constants/store-web-page.constants";
import { useScrollSpy } from "./product-list-scroll-spy.provider";
import { StyledCategory, StyledHeader } from "./product-list-with-scroll-spy.styled";
import { ScrollHeaderType } from "../../../../constants/enums";

const ProductListHeaderComponent = (props) => {
  const { clickToFocusCustomize = undefined, styleHeader, isDefault } = props;
  const configCustomize = JSON.parse(getStorage("config"));
  const { categories, loading, tab, onPressTab } = useScrollSpy();
  const [isSticky, setIsSticky] = useState(false);
  const navCategoryClassName = isSticky ? "nav-category-sticky" : "";
  const ulNav = document.querySelectorAll(".li-category");
  const sliderRef = useRef();
  let settings = {};
  if (window.matchMedia("(max-width: 740px)").matches) {
    settings = {
      spaceBetween: 30,
    };
  } else {
    settings = {
      spaceBetween: 40.94,
    };
  }
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });

  useEffect(() => {
    let pos = 0;
    ulNav.length > 0 &&
      ulNav.forEach((el, index) => {
        const attrId = el.getAttribute(`id`);
        if (attrId === `li-category-${tab}`) {
          pos = index;
        }
      });
    sliderRef.current.swiper.slideTo(pos);
  }, [tab, ulNav]);

  useEffect(() => {
    if (categories.length > 0) {
      let arrParam = window.location.pathname.split("/");
      let idParam = arrParam.slice(-1)[0];
      if (idParam) {
        const tabActive = document.getElementById("category-" + idParam);
        tabActive && tabActive.click();
      }
    }
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("nav-category-sticky");
      const title = document.getElementById("font-size-title");
      if (navbar) {
        if (title?.offsetTop && window.scrollY < title?.offsetTop) {
          setIsSticky(false);
        } else {
          const navbarOffset = navbar.offsetTop;
          const isScrollingDown = window.scrollY > navbarOffset;
          setIsSticky(isScrollingDown);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleClickHeaderProductList = () => {
    configCustomize?.customizeTheme && clickToFocusCustomize(theme1ElementCustomize.HeaderProductList);
  };
  return (
    <div id="themeHeaderProductList" onClick={handleClickHeaderProductList}>
      <StyledHeader className="product-list-header-theme-1" styleHeader={styleHeader} isDefault={isDefault}>
        <div className="header-page-title">
          <Row gutter={[8, 16]} className="row-header-page main-session">
            <div id="font-size-title" className="font-size-title">
              <Col span={24} className="mb-0" style={{ fontSize: "60px" }}>
                {styleHeader?.title}
              </Col>
              {isDefault ? (
                <></>
              ) : (
                <Col span={24} className="hr-header-title">
                  {styleHeader?.title && styleHeader?.title !== "" && <hr />}
                </Col>
              )}
            </div>
            <Col
              span={24}
              style={{
                padding: 0,
                overflow: "hidden",
                top:
                  isMaxWidth575 && configCustomize?.general?.header?.scrollType == ScrollHeaderType.FIXED
                    ? "60px"
                    : !isMaxWidth575 && configCustomize?.general?.header?.scrollType == ScrollHeaderType.FIXED
                    ? "100px"
                    : "0",
              }}
              id="nav-category-sticky"
              className={`main-session ${navCategoryClassName}`}
            >
              <StyledCategory className="product-list-menu-theme-1" styleHeader={styleHeader} isDefault={isDefault}>
                <ul id="nav-category" className="my-row scroll-nav-category">
                  <Swiper
                    ref={sliderRef}
                    id={"product-list-swiper"}
                    {...settings}
                    grabCursor={true}
                    preventClicks={true}
                    simulateTouch={true}
                    slidesOffsetAfter={50}
                    slidesPerGroupAuto={true}
                    slidesPerView={"auto"}
                  >
                    {categories?.map((_cate, index) => {
                      return (
                        <SwiperSlide key={`tab_ca_${_cate.id}_${index}`}>
                          <li className={"li-category"} id={`li-category-${_cate.id}`} key={_cate.id}>
                            <a
                              href={`#${_cate.id}`}
                              onClick={(e) => onPressTab(e)}
                              id={`category-${_cate.id}`}
                              style={{ display: "flex" }}
                              className={`${tab === _cate.id ? "active active-category-item category-0" : ""}`}
                            >
                              <span className="ellipsisCategory" title={_cate?.name}>
                                {_cate?.name}
                              </span>
                            </a>
                          </li>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </ul>
              </StyledCategory>
            </Col>
          </Row>
        </div>
      </StyledHeader>
    </div>
  );
};
export default ProductListHeaderComponent;
