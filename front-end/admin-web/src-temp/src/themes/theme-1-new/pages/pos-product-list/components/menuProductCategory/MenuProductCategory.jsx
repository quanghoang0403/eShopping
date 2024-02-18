import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { productListPageDataSelector } from "../../../../../modules/product/product.reducers";
import { addEventClickAndStretchToScroll } from "../../../../../utils/helpers";
import "./MenuProductCategory.scss";

function MenuProductCategory(props) {
  const { productCategoryId, onChange } = props;

  const elementId = "ul-product-category";
  const [dataMenuProductCategory, setDataMenuProductCategory] = useState([]);
  const [categoryIdSelected, setCategoryIdSelected] = useState(null);
  const productListPageData = useSelector(productListPageDataSelector);

  useEffect(() => {
    if (productCategoryId) {
      setCategoryIdSelected(productCategoryId);
      const elementMenu = document.getElementById("menu-" + productCategoryId);
      if (elementMenu) {
        elementMenu.scrollIntoView({ behavior: "instant" });
      }
    }
  }, [productCategoryId]);

  useEffect(() => {
    if (productListPageData && productListPageData?.length > 0) {
      setDataMenuProductCategory(productListPageData);
      setCategoryIdSelected(productListPageData?.[0]?.id);
    }
  }, [productListPageData]);

  function onChangeCategory(categoryId) {
    if (onChange) {
      onChange(categoryId);
    }
  }

  useEffect(() => {
    addEventClickAndStretchToScroll(elementId);
  }, []);

  useEffect(() => {
    if (categoryIdSelected) {
      // active menu
      const elements = document.querySelectorAll(".li-product-category");
      if (elements) {
        elements.forEach((el) => {
          el.classList.remove("active");
        });
      }

      const elementActive = document.getElementById("menu-" + categoryIdSelected);
      if (elementActive) {
        elementActive.classList.add("active");
      }
    }
  }, [categoryIdSelected]);

  return (
    <div className="menu-product-category">
      <div className="ul-product-category" id={elementId}>
        {dataMenuProductCategory.map((item) => {
          return (
            <div
              className={`li-product-category`}
              onClick={() => onChangeCategory(item.id)}
              key={item?.id}
              id={`menu-${item.id}`}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default React.memo(
  MenuProductCategory,
  (prevProps, nextProps) => prevProps.productCategoryId === nextProps.productCategoryId,
);
