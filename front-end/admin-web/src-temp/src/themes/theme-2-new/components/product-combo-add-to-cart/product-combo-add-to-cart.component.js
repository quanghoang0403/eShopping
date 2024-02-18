import { useDispatch } from "react-redux";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  setCartItems,
  setDataCallBackAddToCart,
  setShowFlashSaleInActive,
} from "../../../modules/session/session.actions";
import productComboAddToCartServices from "../../../services/product-combo-add-to-cart.services";
import { AddToCart } from "../../assets/icons.constants";
import { comboTypeEnum } from "../../constants/store-web-page.constants";

import { useSelector } from "react-redux";
import "./product-combo-add-to-cart.component.scss";
import { setToastMessageAddToCart } from "../../../modules/toast-message/toast-message.actions";
import comboDataService from "../../../data-services/combo-data.service";
import shoppingCartService from "../../../services/shopping-cart/shopping-cart.service";

export default function ProductComboAddToCart({
  isCombo = true,
  isMockup = false,
  product,
  combo,
  pricingItem,
  colorGroup,
  setIsShowFlashSaleInActive,
  setCallBackAddToCartFunction,
}) {
  const { addProductToCart } = productComboAddToCartServices;
  const dispatch = useDispatch();
  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  //Add product/combo to cart
  const addToCart = () => {
    if (isMockup) return;
    if (productComboAddToCartServices.addProductToCart) {
      if (isCombo === false) {
        addProductToCart(
          false,
          product,
          product?.productPrices[product?.defaultProductPriceIndex ?? 0],
          null,
          branchAddress,
          (data) => {
            dispatch(setDataCallBackAddToCart(data));
          },
          (data) => {
            dispatch(setCartItems(data));
          },
        );
      } else {
        if (combo?.comboTypeId === comboTypeEnum.comboProductPrice.id) {
          addComboToCart(combo);
        } else {
          addProductToCart(
            true,
            pricingItem,
            combo,
            null,
            branchAddress,
            (data) => {
              dispatch(setShowFlashSaleInActive(data ?? false));
            },
            (data) => {
              dispatch(setDataCallBackAddToCart(data));
            },
            (data) => {
              dispatch(setCartItems(data));
            },
          );
        }
      }

      onShowToastMessage();
    }
  };

  const addComboToCart = async (data)=>{
    let comboDetail = {};
    let productList = [];
    let thumbnailProduct = [];
    let isFlashSaleIncludedTopping = false;
    if (data?.comboTypeId === comboTypeEnum.comboProductPrice.id) {
      // combo specific
      comboDetail = await comboDataService.getComboProductPriceByComboIdAsync(data?.id);
    } else if (data?.comboTypeId === comboTypeEnum.comboPricing.id) {
      // combo flexible
      comboDetail = await comboDataService.getComboPricingByComboPricingIdAsync(data?.id, isFlashSaleIncludedTopping);
    }
    comboDetail = comboDetail?.data?.combo;
    thumbnailProduct.push({ imageUrl: comboDetail?.thumbnail });
    comboDetail?.comboProductPrices?.map((item) => {
      let productPriceSelected = comboDetail?.product?.productDetail?.productPrices.find(
        (a) => a.id === item?.productPriceId,
      );
      isFlashSaleIncludedTopping = (productPriceSelected?.flashSaleId && productPriceSelected?.isIncludedTopping);
      let itemProduct = item?.productPrice?.product;
      let optionsSelected = item?.productPrice?.product?.productOptions;
      let toppingSelected = item?.productPrice?.product?.productToppings
      let productItem = {
        id: item?.productPrice?.productId,
        name: itemProduct?.name,
        thumbnail: itemProduct?.thumbnail,
        productPrice: {
          id: item?.productPriceId,
          priceName: item?.priceName,
          priceValue: item?.priceValue,
        },
        options: mappingDataOptions(optionsSelected),
        toppings: mappingDataToppings(toppingSelected),
      };
      productList.push(productItem);
    });
    product = {
      isCombo: true,
      id:
        comboDetail?.comboTypeId === comboTypeEnum.comboPricing.id
          ? comboDetail?.comboId
          : comboDetail?.id,
      name: comboDetail?.name,
      comboPricingId: comboDetail?.comboPricingId,
      comboPricingName: comboDetail?.comboPricingName,
      thumbnail: comboDetail?.thumbnail,
      notes: "",
      comboTypeId: comboDetail?.comboTypeId,
      products: productList,
      quantity: 1,
      originalPrice: data?.originalPrice,
      sellingPrice: data?.sellingPrice,
      dataDetails: { ...comboDetail },
      totalOfToppingPrice: 0,
      branchId: branchAddress?.id,
    };
    shoppingCartService.updateStoreCart(product, (storeCartNew) => {
      dispatch(setCartItems(storeCartNew));
    });
  }
  const mappingDataOptions = (options) => {
    var defaultOption = [];
    options.forEach(item => {
      let defaultLevel = item?.optionLevels?.filter(a=>a.isSetDefault === true);
      let option ={
        id: item?.id,
        name: item?.name,
        isSetDefault : defaultLevel[0]?.isSetDefault,
        optionLevelId: defaultLevel[0]?.id,
        optionLevelName: defaultLevel[0]?.name
      };
      defaultOption.push(option);
    });
    return defaultOption;
  };
  const mappingDataToppings = (toppings, isFlashSaleIncludedTopping) => {
    if (isFlashSaleIncludedTopping) {
      const newToppings = toppings?.map((t) => ({
        id: t?.toppingId,
        name: t?.name,
        priceValue: 0,
        originalPrice: t?.priceValue,
        quantity: t.quantity,
      }));
      return newToppings;
    } else {
      const newToppings = toppings?.map((t) => ({
        id: t?.toppingId,
        name: t?.name,
        priceValue: t?.priceValue,
        originalPrice: t?.priceValue,
        quantity: t.quantity,
      }));
      return newToppings;
    }
  };

  const onShowToastMessage = () => {
    dispatch(setToastMessageAddToCart(true));
    setTimeout(() => {
      dispatch(setToastMessageAddToCart(false));
    }, 3000);
  };

  return (
    <AddToCart
      className="cart-item"
      style={{
        fill: colorGroup?.buttonTextColor,
        backgroundColor: colorGroup?.buttonBackgroundColor,
        borderColor: colorGroup?.buttonBorderColor ? colorGroup?.buttonBorderColor : undefined,
        borderWidth: colorGroup?.buttonBorderColor ? 1 : undefined,
      }}
      onClick={addToCart}
      alt={product.description}
    />
  );
}
