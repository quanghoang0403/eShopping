import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Slider from "react-slick";
import "swiper/css";
import "./navigation-category.component.scss";
import styled from "styled-components";
import { backgroundTypeEnum } from "../../../constants/store-web-page.constants";
import { ScrollHeaderType } from "../../../../constants/enums";

function NavigationCategory(props) {
  const { listCategories, styleProductList, headerConfig, isCustomize = false } = props;
  const sliderRef = React.useRef();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listRefSectionProduct = [];
  const scrollRef = React.useRef(null);
  const refContainListCategory = React.useRef(null);

  const isDesktop = useMediaQuery({ minWidth: 1281 });
  const isTablet = useMediaQuery({ minWidth: 576, maxWidth: 1280 });
  const isMaxWidth1280 = useMediaQuery({ minWidth: 741, maxWidth: 1280 });
  const isMaxWidth740 = useMediaQuery({ minWidth: 576, maxWidth: 740 });
  const isMobile = useMediaQuery({ maxWidth: 575 });

  const [itemSelected, setItemSelected] = useState("");
  const [isOverflowCategory, setIsOverflowCategory] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [heightHeader, setHeightHeader] = useState(100);
  const [currentIndexCategory, setCurrentIndexCategory] = useState("");

  const PADDING_TOP_NAV = isCustomize ? 375 : 75;
  const [widthSectionProductList, setWidthSectionProductList] = useState(
    `${document.getElementsByClassName("product-list-card-theme1")[0]?.offsetWidth + 2}px`,
  );

  const handleClickItem = (id, isCombo, index) => {
    setItemSelected(id);
    setCurrentIndexCategory(index);
    const element = document.getElementById(`list-products-section-id-${id}`);
    if (isCustomize) {
      element.style.scrollMargin = "300px";
      element.scrollIntoView();
    }
    window.removeEventListener("scroll", handleScrollItemSelected);
    const isScrollHeader = headerConfig?.scrollType !== ScrollHeaderType.FIXED;
    let paddingValue = 0;
    // if is scroll up
    if (isScrollHeader) {
      let rowGap = 0;
      if (isTablet) rowGap = -20;
      if (isMobile) rowGap = -35;
      paddingValue = index < currentIndexCategory ? heightHeader + rowGap : rowGap;
    } else {
      paddingValue = heightHeader;
    }
    window.scrollTo({
      top: element?.offsetTop - paddingValue,
      behavior: "smooth",
    });

    if (isOverflowCategory && isCombo) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const handleScrollShadow = () => {
    const position = window.pageYOffset;
    if (isDesktop) {
      setIsSticky(position >= 352);
    } else if (isMaxWidth1280) {
      setIsSticky(position >= 290);
    } else if (isMaxWidth740) {
      setIsSticky(position >= 200);
    } else if (isMobile) {
      setIsSticky(position >= 225);
    }
  };

  const handleScrollItemSelected = () => {
    if (scrollRef.current) clearTimeout(scrollRef.current);
    scrollRef.current = setTimeout(() => {
      const rowGap = isDesktop ? 80 : isTablet ? 36 : 16;
      const heightHeader = document.getElementById("header")?.offsetHeight;
      const offsetHeader = heightHeader + rowGap;

      let currentCategory = null;

      let index = 0;
      if (
        document.documentElement.scrollTop <
        document.getElementById(`list-products-section-id-${listCategories[0]?.id}`)?.offsetTop
      ) {
        currentCategory = listCategories[0];
        index = 0;
      } else {
        currentCategory = listCategories.find((category) => {
          const currentScrollY = document.documentElement.scrollTop + offsetHeader;
          const offsetTopCategory = document.getElementById(`list-products-section-id-${category?.id}`)?.offsetTop;
          const heightCategory = document.getElementById(`list-products-section-id-${category?.id}`)?.offsetHeight;
          index++;
          return currentScrollY >= offsetTopCategory - rowGap && currentScrollY < offsetTopCategory + heightCategory;
        });
        index--;
      }

      if (currentCategory === undefined || currentCategory === null) {
        currentCategory = listCategories[listCategories.length - 1];
        index = listCategories.length;
      }
      window.history.replaceState(null, null, `/product-list/${currentCategory.id}`);
      setItemSelected(currentCategory.id);
      setCurrentIndexCategory(index);
      if (currentCategory.isCombo) {
        if (isOverflowCategory) {
          sliderRef.current.slickGoTo(index);
        }
      } else {
        const elementNav = document.getElementById("wrapper-sticky-slider-category-product-list-theme1-id");
        const offsetLeftNav = elementNav.offsetLeft;
        const beginIndex = listCategories.findIndex((item) => {
          const elementItem = document.getElementById(`item-slide-category-id-${item.id}`);
          return elementItem.getBoundingClientRect().left >= offsetLeftNav - 5;
        });
        let endIndex = beginIndex - 1;
        for (let i = beginIndex, sumWidth = -20; i < listCategories.length; i++) {
          const element = document.getElementById(`item-slide-category-id-${listCategories[i].id}`);
          sumWidth += element.offsetWidth;
          if (sumWidth > elementNav.offsetWidth) {
            break;
          }
          endIndex++;
        }

        // If cateogories position is overflow left
        if (index < beginIndex) {
          if (isOverflowCategory) {
            sliderRef.current.slickGoTo(index);
          }
        }

        // If cateogories position is overflow right
        let indexNeedToSlide = 0;
        if (index > endIndex) {
          for (let i = index, sumWidth = -20; i > 0; i--) {
            const element = document.getElementById(`item-slide-category-id-${listCategories[i].id}`);
            sumWidth += element.offsetWidth;
            if (sumWidth > elementNav.offsetWidth) {
              break;
            }
            indexNeedToSlide = i;
          }
          sliderRef.current.slickGoTo(indexNeedToSlide);
        }
      }
    }, isDesktop ? 20 : 50);
  };

  useEffect(() => {
    const elementHeader = document.getElementById("header");
    if (elementHeader) {
      setHeightHeader(elementHeader.offsetHeight);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("scrollend", handleScrollShadow, { passive: true });
    window.addEventListener("scrollend", handleScrollItemSelected, { passive: true });

    return () => {
      window.removeEventListener("scrollend", handleScrollShadow);
      window.removeEventListener("scrollend", handleScrollItemSelected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOverflowCategory]);

  const settings = {
    swipeToSlide: true,
    variableWidth: true,
  };

  useEffect(() => {
    if (listRefSectionProduct.length > 0 && listRefSectionProduct[0].current) {
      // set default category or combo selected
      const pathNames = window.location.pathname.split("/");
      if (!pathNames[2]) {
        setItemSelected(listCategories[0]?.id)
      }
      let sumWidth = 0;
      listRefSectionProduct.forEach((item) => {
        sumWidth += item.current.offsetWidth;
      });
      if (sumWidth > refContainListCategory.current.offsetWidth && refContainListCategory.current.offsetWidth > 0) {
        setIsOverflowCategory(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRefSectionProduct]);

  const handleChangeSizeBrowser = () => {
    setWidthSectionProductList(`${document.getElementsByClassName("product-list-card-theme1")[0]?.offsetWidth + 2}px`);
  };

  useEffect(() => {
    window.addEventListener("resize", handleChangeSizeBrowser);
    return () => {
      window.removeEventListener("resize", handleChangeSizeBrowser);
    };
  }, []);
  const StyledNavigationCategories = styled.div`
    .item-slider-category {
      &--is-selected {
        background: ${styleProductList?.colorGroup?.buttonBackgroundColor};
        color: ${styleProductList?.colorGroup?.buttonTextColor};
      }
      &--not-selected {
        &__title {
          color: ${styleProductList?.colorGroup?.textColor};
        }
        &:hover {
          .arrow-up {
            border-bottom-color: ${styleProductList?.colorGroup?.buttonBackgroundColor} !important;
          }
        }
      }
    }

    @media (min-width: 1281px) {
      .item-slider-category {
        &--not-selected {
          &:hover {
            .arrow-up {
              border-bottom-color: ${styleProductList?.colorGroup?.buttonBackgroundColor} !important;
            }
          }
        }
      }
    }
  `;

  return (
    <div
      className={`wrapper-sticky-slider-category-product-list-theme1 
        ${isSticky ? "wrapper-sticky-slider-category-product-list-theme1--is-sticky" : ""
        }`}
      id="wrapper-sticky-slider-category-product-list-theme1-id"
      style={{
        background:
          styleProductList?.backgroundType === backgroundTypeEnum.Color ? styleProductList?.backgroundColor : "unset",
        top:
          headerConfig?.scrollType === ScrollHeaderType.FIXED
            ? `${heightHeader - PADDING_TOP_NAV + 24}px`
            : isCustomize
              ? 50
              : 0,
        maxWidth: widthSectionProductList,
      }}
    >
      <div
        ref={refContainListCategory}
        className={`slider-category-product-list-theme1 slider variable-width `}
      >
        <Slider infinite={false} className="slider-category" {...settings} ref={sliderRef}>
          {listCategories.map((item, index) => {
            listRefSectionProduct[index] = React.createRef();
            return (
              <StyledNavigationCategories>
                <div
                  ref={listRefSectionProduct[index]}
                  key={item.id}
                  className={`item-slider-category ${item.id === itemSelected
                    ? "item-slider-category--is-selected"
                    : "item-slider-category--not-selected"
                    } `}
                  onClick={() => handleClickItem(item.id, item.isCombo, index)}
                  id={`item-slide-category-id-${item.id}`}
                >
                  <span className="item-slider-category__title">{item.name}</span>
                  <span className="arrow-up"></span>
                </div>
              </StyledNavigationCategories>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}

export default NavigationCategory;
