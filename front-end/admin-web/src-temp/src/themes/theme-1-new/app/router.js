import OrderPage from "../pages/order/order.page";
import POSCartPage from "../pages/pos-cart/POSCart.page";
import POSCheckout from "../pages/pos-checkout/POSCheckout.page";
import POSProductListPage from "../pages/pos-product-list/POSProductList.page";

export const defaultRouters = [
  {
    id: "app.actionPage",
    name: "Order",
    component: OrderPage,
    path: "/action-page",
  },
  {
    id: "app.productList",
    name: "Product List",
    component: POSProductListPage,
    path: "/pos",
  },
  {
    id: "app.posCart",
    name: "POS Cart",
    component: POSCartPage,
    path: "/pos-cart",
  },
  {
    id: "app.posCheckout",
    name: "POS Checkout",
    component: POSCheckout,
    path: "/pos-checkout",
  },
];
