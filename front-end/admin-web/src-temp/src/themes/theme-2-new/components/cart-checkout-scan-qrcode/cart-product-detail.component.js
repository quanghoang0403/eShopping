import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Platform } from "../../../constants/platform.constants";
import { getStorage } from "../../../utils/localStorage.helpers";
import { BackIcon } from "../../assets/icons/BackIcon";
import checkoutAddIcon from "../../assets/icons/checkout-add.svg";
import noProductInCart from "../../assets/images/no-product-in-cart.png";
import EditOrderItem from "../../components/edit-order-item/edit-order-item.component";
import CheckoutOrderItems from "../../pages/checkout/components/checkout-order-items";
import BoxDrawer from "../../pages/order/components/BoxDrawer";
import "./header-cart-checkout.component";

export default function CartProductDetailComponent(props) {
  const {
    colorGroup,
    shoppingCart,
    addMoreProducts,
    mockupCustomize,
    onUpdateCartQuantity,
    onDeleteProduct,
    setShoppingCart,
    isCart,
    branchId,
    fontFamily,
  } = props;
  const { t } = useTranslation();
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });
  const storageConfig = JSON.parse(getStorage("config"));
  const [visibleEditProduct, setVisibleEditProduct] = useState(false);
  const [productSelectEdit, setProductSelectEdit] = useState({});
  const [indexDefault, setIndexDefault] = useState(null);

  const pageData = {
    addMoreProducts: t("checkOutPage.addMoreProducts", "Add more products"),
    cartProduct: t("checkOutPage.cartProduct", "Product"),
    cartPrice: t("checkOutPage.cartPrice", "Price"),
    cartQuantity: t("checkOutPage.cartQuantity", "Quantity"),
    cartTotal: t("checkOutPage.cartTotal", "Total"),
    placeHolderNote: t("checkOutPage.laceHolderNote", "Note"),
    yourCart: t("checkOutPage.yourCart", "Your cart"),
    items: t("checkOutPage.items", "items"),
    emptyCart: t("checkOutPage.emptyCart", "You do not have any items in your shopping cart"),
  };

  const getTotalIemsInShoppingCart = (shoppingCart) => {
    let totalItems = 0;
    if (shoppingCart?.length > 0) {
      shoppingCart.forEach((cartItem) => {
        totalItems += cartItem.quantity;
      });
    }

    return totalItems;
  };

  function handleCloseViewEdit() {
    setVisibleEditProduct(false);
  }
  function handleOnclickViewEdit(data, index) {
    setProductSelectEdit(data);
    setIndexDefault(index);
    setVisibleEditProduct(true);
  }

  return (
    <>
      <div className="check_out_product">
        <div className="product_summary">
          <div className="total">
            <div className="shoppingCart" style={{ color: colorGroup?.titleColor }}>
              {pageData.yourCart}
            </div>
            <div className="quantity">
              ({getTotalIemsInShoppingCart(shoppingCart)} {pageData.items})
            </div>
          </div>
          <div className="add">
            <div className="add_icon" onClick={addMoreProducts}>
              <img src={checkoutAddIcon} alt={pageData.placeHolderNote} />
            </div>
            <div className="add_button" onClick={addMoreProducts}>
              {pageData.addMoreProducts}
            </div>
          </div>
        </div>
        <div className="product_title product-title-web">
          <div style={{ flex: 2 }}>{pageData.cartProduct}</div>
          {!isMaxWidth575 && (
            <>
              <div style={{ flex: 1 }}>{pageData.cartPrice}</div>
              <div style={{ flex: 1 }}>{pageData.cartQuantity}</div>
              <div style={{ flex: 1 }}>{pageData.cartTotal}</div>
            </>
          )}
        </div>
        <div className="product_title product-title-mobile">{pageData.cartProduct}</div>
        <div className="product_detail">
          {!mockupCustomize ? (
            shoppingCart?.map((cart, index) => {
              return (
                <>
                  <CheckoutOrderItems
                    key={cart.id + index}
                    cartItem={cart}
                    currentIndex={index}
                    onUpdateCartQuantity={onUpdateCartQuantity}
                    onDeleteProduct={onDeleteProduct}
                    setCurrentCartItems={(cartItems) => setShoppingCart(cartItems)}
                    index={index}
                    isCart={isCart}
                    storageConfig={storageConfig}
                    isPos
                    handleOnclickViewEditPos={handleOnclickViewEdit}
                  />
                </>
              );
            })
          ) : (
            <div className="noProductInCart">
              <img src={noProductInCart} alt=""></img>
              <div className="noProductInCartText">{pageData.emptyCart}</div>
            </div>
          )}
        </div>

        <BoxDrawer
          className="box-drawer-pos-theme2"
          height={"100%"}
          title={<span style={{ fontFamily: fontFamily }}>{t("storeWebPage.generalUse.updateCart")}</span>}
          open={visibleEditProduct}
          onClose={handleCloseViewEdit}
          closeIcon={<BackIcon />}
          closable={true}
          style={{ fontFamily: fontFamily }}
          body={
            <EditOrderItem
              {...props}
              dataEdit={{ ...productSelectEdit }}
              indexDefault={indexDefault}
              onCancel={handleCloseViewEdit}
              stateConfig={storageConfig}
              calculateShoppingCart={() => {}}
              isPos={true}
              branchIdPos={branchId}
              platformId={Platform.POS}
            />
          }
        />
      </div>
    </>
  );
}
