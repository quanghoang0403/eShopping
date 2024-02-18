import styled from "styled-components";
import BackgroundHeaderPreview from "../../../assets/images/background-header.png";
import { backgroundTypeEnum } from "../../../constants/store-web-page.constants";

export const StyledProductList = styled.div`
  .list-product-by-category {
    background-color: ${(props) =>
      props?.styleProductsProductList?.backgroundType === backgroundTypeEnum.Color &&
      props?.styleProductsProductList?.backgroundColor};
    background-image: url(${(props) =>
      props?.styleProductsProductList?.backgroundType === backgroundTypeEnum.Image &&
      props?.styleProductsProductList?.backgroundImage});
    background-size: contain;
    background-repeat: repeat-y;
  }

  .product-list-page-theme-1 {
    scroll-margin-top: 226px;
    width: 100%;
    text-align: center;
  }

  .product-list-title {
    color: ${(props) => props?.styleHeader?.colorGroup?.titleColor};
  }
`;

export const StyledCategory = styled.div`
  .active {
    color: ${(props) => props?.styleHeader?.colorGroup?.titleColor} !important;
  }

  #nav-category li a {
    color: ${(props) => (Boolean(props?.isDefault) ? "#000000" : props?.styleHeader?.colorGroup?.titleColor)};

    ::before {
      content: "/";
      font-size: 35px;
      color: transparent;
      font-weight: 700;
      line-height: 30px;
    }

    ::after {
      content: "/";
      font-size: 35px;
      color: transparent;
      font-weight: 700;
      line-height: 30px;
    }
  }

  #nav-category li a:hover,
  .active-category-item {
    color: ${(props) => props?.styleHeader?.colorGroup?.titleColor};

    ::before {
      color: ${(props) => props?.styleHeader?.colorGroup?.titleColor} !important;
    }

    ::after {
      color: ${(props) => props?.styleHeader?.colorGroup?.titleColor} !important;
    }

    .ellipsisCategory {
      -webkit-text-stroke: 1.5px;
      text-stroke: 1.5px;
    }
  }

  /*Mobile*/
  @media screen and (max-width: 600px) {
    .active {
      color: ${(props) => props?.styleHeader?.colorGroup?.titleColor} !important;
    }

    #nav-category li a {
      color: ${(props) => (Boolean(props?.isDefault) ? "#000000" : props?.styleHeader?.colorGroup?.titleColor)};

      ::before {
        content: "/";
        font-size: 22px;
        color: transparent;
        font-weight: 700;
        line-height: 30px;
      }

      ::after {
        content: "/";
        font-size: 22px;
        color: transparent;
        font-weight: 700;
        line-height: 30px;
      }
    }
  }
`;
export const StyledHeader = styled.div`
  .header-page-title {
    background-color: ${(props) =>
      props?.styleHeader?.backgroundType === backgroundTypeEnum.Color && props?.styleHeader?.backgroundColor};
    background-image: url(${(props) =>
      Boolean(props?.isDefault)
        ? BackgroundHeaderPreview
        : props?.styleHeader?.backgroundType === backgroundTypeEnum.Image && props?.styleHeader?.backgroundImage});
    background-size: cover;

    .font-size-title {
      color: ${(props) => props?.styleHeader?.colorGroup?.titleColor};
    }

    hr {
      border: 1px solid ${(props) => props?.styleHeader?.colorGroup?.titleColor};
    }
  }
`;
export const StyleLoadingProducts = {
  width: "100%",
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  display: "flex",
  zIndex: 10000,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.4)",
};
