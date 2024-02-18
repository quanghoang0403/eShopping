import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { TIME_DELAY } from "../../../../hooks/useDebounce";

const ProductListScrollSpyContext = createContext({ categories: [], loading: false, sources: undefined, tab: "" });
const throttle = (callback = () => { }, limit = TIME_DELAY) => {
  let tick = false;
  return () => {
    if (!tick) {
      callback();
      tick = true;
      setTimeout(function () {
        tick = false;
      }, limit);
    }
  };
};

const offsetTop = 0;
const offsetBottom = 0;
const activeClass = "active-scroll-spy";
const ProductListScrollSpyProvider = ({ children, header = undefined }) => {
  const [loading, setLoading] = useState(false);
  const [listLoadings, setListLoadings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState(undefined);
  const [tab, setTab] = useState("");
  const [productStyles, setProductStyles] = useState(undefined);
  const [currency, setCurrency] = useState({
    code: "",
    symbol: "",
  });
  const scrollRef = useRef(null);
  let scrollContainerRef = useRef(null);

  const [navContainerItems, setNavContainerItems] = useState([]);
  const prevIdTracker = useRef("");
  const childNodes = document.querySelectorAll(".product-list-row") || [];
  const isVisible = (el) => {
    const rectInView = el.getBoundingClientRect();
    const useHeight = window.innerHeight;
    const hitbox_top = useHeight;
    const element_top = rectInView.top;
    const element_bottom = rectInView.top + useHeight;
    return hitbox_top < element_bottom + offsetBottom && hitbox_top > element_top - offsetTop;
  };

  const handleSetProductStyles = (_value) => setProductStyles(_value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleWindowScroll = useCallback(() => {
    if (scrollRef.current) {
      clearTimeout(scrollRef.current);
    }
    scrollRef.current = setTimeout(() => {
      const productListRows = document.getElementById('product-list-wrapper-rows');
      if (!(productListRows && navContainerItems)) return;
      for (let i = 0; i < productListRows.children.length; i++) {
        const useChild = productListRows.children.item(i);
        const elementIsVisible = isVisible(useChild);
        if (elementIsVisible) {
          const changeHighlightedItemId = useChild.id;
          handleSetTabActive(changeHighlightedItemId);
          if (prevIdTracker.current === changeHighlightedItemId) return;
          navContainerItems.forEach((el) => {
            const attrId = el.getAttribute(`id`);
            if (el.classList.contains(activeClass)) {
              el.classList.remove(activeClass);
            }
            if (
              attrId === changeHighlightedItemId &&
              !el.classList.contains(activeClass)
            ) {
              el.classList.add(activeClass);
              prevIdTracker.current = changeHighlightedItemId;
              let arrParam = window.location.pathname.split("/");
              let url = `${changeHighlightedItemId}`;
              if (arrParam.length === 2) {
                url = `product-list/${url}`
              }
              window.history.replaceState(
                {},
                "",
                url
              );
            }
          });
          break;
        }
      }
    }, 30)
    
  });
  useEffect(() => {
    setNavContainerItems((pre) => {
      return childNodes;
    });
  }, [childNodes.length]);

  useEffect(() => {
    if (navContainerItems.length > 0) {
      handleWindowScroll();
    }
  }, [navContainerItems]);

  useEffect(() => {
    window.addEventListener("scroll", throttle(handleWindowScroll, TIME_DELAY));
    return () => {
      window.removeEventListener("scroll", throttle(handleWindowScroll, TIME_DELAY));
    };
  }, [handleWindowScroll]);
  const handleSetTabActive = (_key) => setTab(_key);
  const handleLoadMoreCategory = (_key, _value = []) => {
    const crrItem = sources[_key];
    if (crrItem && crrItem.data) {
      crrItem.page = -1;
      crrItem.data = [...crrItem.data, ..._value];
      setSources((prevState) => {
        prevState[_key] = crrItem;
        return prevState;
      });
    }
  };
  const handleSetStoreCurrency = (_currency) => {
    setCurrency(_currency);
  };
  const handlePressTab = (e) => {
    e.preventDefault();
    const target = window.document.getElementById(e.currentTarget.href.split("#")[1]);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleUpdateSetLoading = (_key, isAdd = true) => {
    if (isAdd) {
      if (listLoadings.indexOf(_key) === -1) setListLoadings(listLoadings.concat([_key]));
    } else {
      const arr = [...listLoadings];
      setListLoadings(arr.slice(arr.indexOf(_key), 1));
    }
  };
  const handleSetScrollContainerRef = (_ref) => {
    scrollContainerRef = _ref;
  };
  const getValue = useCallback(() => {
    return {
      loading,
      tab,
      categories,
      sources,
      currency,
      productStyles,
      onSetCategories: (_val) => setCategories(_val),
      onSetSources: (_val) => {
        setSources(_val);
      },
      onSetLoading: (_val) => setLoading(_val),
      listLoadings: listLoadings,
      onLoadMoreCategory: handleLoadMoreCategory,
      onSetTabActive: handleSetTabActive,
      onPressTab: handlePressTab,
      onSetProductStyles: handleSetProductStyles,
      onAddListLoadings: (_key) => handleUpdateSetLoading(_key),
      onRemoveListLoadings: (_key) => handleUpdateSetLoading(_key, false),
      onSetStoreCurrency: handleSetStoreCurrency,
      onSetScrollContainerRef: handleSetScrollContainerRef,
    };
  }, [
    categories,
    currency,
    productStyles,
    handleSetStoreCurrency,
    listLoadings,
    handleSetProductStyles,
    tab,
    handleSetScrollContainerRef,
    sources,
    loading,
    setLoading,
    setCategories,
    setSources,
    handlePressTab,
    handleSetTabActive,
    handleLoadMoreCategory,
  ]);

  return (
    <ProductListScrollSpyContext.Provider value={getValue()}>
      {header}
      {<div ref={scrollContainerRef}>{children}</div>}
    </ProductListScrollSpyContext.Provider>
  );
};
export default ProductListScrollSpyProvider;
export const useScrollSpy = () => {
  return useContext(ProductListScrollSpyContext);
};
