import { Button, Input, Popover, Radio } from "antd";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import checkOutDataService from "../../../../data-services/checkout-data.service";
import deliveryMethodDataService from "../../../../data-services/delivery-method-data.service";
import paymentMethodDataService from "../../../../data-services/paymentMethod-data.service";
import storeDataService from "../../../../data-services/store-data.service";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import { checkOnKeyPressValidation, formatTextNumber } from "../../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../../utils/localStorage.helpers";
import { CheckoutCompleteIcon } from "../../../assets/icons.constants";
import checkout_arrow_down from "../../../assets/icons/checkout-arrow-down.svg";
import checkout_arrow_up from "../../../assets/icons/checkout-arrow-up.svg";
import locationIcon from "../../../assets/icons/location.svg";
import userIcon from "../../../assets/icons/user.svg";
import userPhoneIcon from "../../../assets/icons/user_phone.svg";
import emptyCart from "../../../assets/images/check-out-empty-cart.png";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog.component";
import ListenMoMoPaymentStatus from "../../../components/listen-momo-payment-status/listen-momo-payment-status.component";
import { EnumDeliveryMethod } from "../../../constants/delivery-method.constants";
import { EnumComboType, EnumResponseCode } from "../../../constants/enums";
import { PaymentMethodType } from "../../../constants/payment-method.constants";
import { theme1ElementCustomize } from "../../../constants/store-web-page.constants";
import { paymentIcons, shippingIcons } from "../default-data";
import CheckOutCash from "./checkout-cash";
import CheckOutMomo from "./checkout-momo";
import CheckOutMomoFailed from "./checkout-momo-failed";
import CheckOutMomoSuccess from "./checkout-momo-success";
import CheckOutMomoWeb from "./checkout-momo-web";
import CheckOutTaxes from "./checkout-taxes";
import "./checkout.detail.scss";
import CheckOutProductItem from "./checkout.product.item";
import { enumOrderType } from "themes/theme-2-new/constants/enum";

export default function CheckOutDetail(props) {
  const history = useHistory();
  const { t } = useTranslation();
  const pageData = {
    addMoreProducts: t("checkOutPage.addMoreProducts", "Add more products"),
    changeAddress: t("checkOutPage.changeAddress", "Change another address"),
    configureAddress: t("checkOutPage.configureAddress", "Configure address"),
    noAddressMessage: t("checkOutPage.noAddressMessage", "You have no shipping address. Please configure one"),
    complete: t("checkOutPage.complete", "Complete"),
    deliveryTo: t("checkOutPage.deliveryTo", "Delivery to"),
    discount: t("checkOutPage.discount", "Discount"),
    feeAndTax: t("checkOutPage.feeAndTax", "Fee & Tax"),
    shippingFee: t("checkOutPage.shippingFee", "Shipping Fee"),
    paymentMethod: t("checkOutPage.paymentMethod", "Payment method"),
    products: t("checkOutPage.products", "Products"),
    shippingMethod: t("checkOutPage.shippingMethod", "Shipping method"),
    shoppingCart: t("checkOutPage.shoppingCart", "Shopping Cart"),
    summary: t("checkOutPage.summary", "Summary"),
    subTotal: t("checkOutPage.subTotal", "Subtotal"),
    total: t("checkOutPage.total", "Total"),
    product: t("checkOutPage.product", "Product"),
    vnd: t("checkOutPage.vnd", "VNĐ"),
    placeHolderName: t("checkOutPage.placeHolderName", "Full name"),
    placeHolderPhone: t("checkOutPage.placeHolderPhone", "Phone number"),
    placeHolderShippingAddress: t("checkOutPage.placeHolderShippingAddress", "Shipping Address"),
    missingCustomerNameMessage: t("checkOutPage.missingCustomerNameMessage", "Please enter name"),
    missingPhoneMessage: t("checkOutPage.missingPhoneMessage", "Please enter phone"),
    gotIt: t("storeWebPage.generalUse.gotIt", "Got it!"),
    deliveryMethod: {
      shopDelivery: t("deliveryMethod.shopDelivery"),
      ahamove: t("deliveryMethod.ahamove"),
    },
  };

  const { configuration, colorGroups, clickToFocusCustomize, isDefault } = props;
  const backgroundImage = configuration?.backgroundImage;
  const backgroundColor = configuration?.backgroundColor;
  const backgroundType = configuration?.backgroundType;
  const colorGroup = colorGroups?.find((c) => c.id === configuration?.colorGroupId);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [customerName, setCustomerName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [enumShippingMethod, setEnumShippingMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [fee, setFee] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [isShowCash, setIsShowCash] = useState(false);
  const [isShowMomo, setIsShowMomo] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const [orderId, setOrderId] = useState(false);
  const [orderStringCode, setOrderStringCode] = useState(null);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditPhone, setIsEditPhone] = useState(false);
  const [isShowDiscount, setIsShowDiscount] = useState(false);
  const [isShowFeeAndTax, setIsShowFeeAndTax] = useState(false);
  const [momoQRCodeURL, setMomoQRCodeURL] = useState(false);
  const [momoDeeplink, setMomoDeeplink] = useState(false);
  const [usingMomoWeb, setUsingMomoWeb] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [isShowPaymentMomoFailed, setIsShowPaymentMomoFailed] = useState(false);
  const [momoError, setMomoError] = useState(null);
  const [isShowPaymentMomoSuccess, setIsShowPaymentMomoSuccess] = useState(false);
  const [isShowNotifyDialog, setIsShowNotifyDialog] = useState(false);
  const [contentNotifyDialog, setContentNotifyDialog] = useState("");
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const [taxes, setTaxes] = useState([]);

  useEffect(() => {
    loadProducts();
    loadPaymentMethods();
    const token = getStorage(localStorageKeys.TOKEN);
    const decoded_token = token && jwt_decode(token);
    setAccountId(decoded_token?.ACCOUNT_ID);
    setCustomerName(decoded_token?.FULL_NAME);
  }, []);

  useEffect(() => {
    loadShippingMethods();
  }, [deliveryAddress]);

  const loadProducts = () => {
    if (!clickToFocusCustomize && !isDefault) {
      let store_cart = JSON.parse(localStorage.getItem(localStorageKeys.STORE_CART));
      setShoppingCart(store_cart);
      loadTaxes(store_cart);
      const loginData = JSON.parse(getStorage(localStorageKeys.LOGIN));
      setCountryCode(loginData?.countryCode);
      setPhone(loginData?.phone);
    } else {
      const loginData = JSON.parse(getStorage(localStorageKeys.LOGIN));
      setCountryCode(loginData?.countryCode);
      setPhone(loginData?.phone);
    }
  };

  const loadPaymentMethods = () => {
    const fetchPaymentMethod = async () => {
      await paymentMethodDataService.getStoreConfigPaymentMethods().then((res) => {
        setPaymentMethods(res.data);
        if (res?.data?.length > 0) setPaymentMethod(res?.data[0].enumId);
      });
    };
    fetchPaymentMethod();
  };

  const loadShippingMethods = () => {
    if (!deliveryAddress?.receiverAddress || !deliveryAddress?.branchAddress) return;
    const fetchDeliveryMethod = async () => {
      const data = {
        address: deliveryAddress?.receiverAddress?.address,
        longitude: deliveryAddress?.receiverAddress?.lng,
        latitude: deliveryAddress?.receiverAddress?.lat,
        senderLongItude: deliveryAddress?.branchAddress?.lng,
        senderLatItude: deliveryAddress?.branchAddress?.lat,
        senderAddress: deliveryAddress?.branchAddress?.addressDetail,
        distance: deliveryAddress?.branchAddress?.distance?.replace("km", "").replace(",", ".").trim(),
      };
      await deliveryMethodDataService.getStoreConfigDeliveryMethods(data).then((res) => {
        setShippingMethods(res.data);
        if (res?.data?.length > 0) {
          setShippingMethod(res?.data[0].id);
          setEnumShippingMethod(res?.data[0].enumId);
          setShippingFee(res?.data[0].cost);
        }
      });
    };

    fetchDeliveryMethod();
  };

  const loadTaxes = (cart) => {
    const fetchLoadTaxes = async () => {
      const data = { productIDList: cart?.filter((c) => !c.isCombo)?.map((c) => c.id) };
      await storeDataService.getAllStoreTaxes(data).then((res) => {
        setTaxes(res.data.taxes);
      });
    };
    fetchLoadTaxes();
  };

  const detailStyle =
    backgroundType === 1
      ? {
          background: backgroundColor,
        }
      : {
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        };

  //Update shoppingcart when user click + or - button
  const onUpdateCartQuantity = (id, quantity, cartIndex) => {
    if (!shoppingCart || shoppingCart.length === 0) return;
    let data = shoppingCart;
    data = data.map((cart, index) =>
      cart.id === id && index === cartIndex ? { ...cart, quantity: Math.max(cart.quantity + quantity, 0) } : cart,
    );
    setShoppingCart(data);
    shoppingCartService.setStoreCartLocalStorage(data);
    document.getElementById("cart-quantity").innerText = data?.reduce((total, cart) => {
      return total + cart.quantity;
    }, 0);
  };

  const onDeleteProduct = (id, cartIndex) => {
    if (!shoppingCart || shoppingCart.length === 0) return;
    let data = shoppingCart;
    data = data.map((cart, index) => (cart.id === id && index === cartIndex ? { ...cart, quantity: 0 } : cart));
    setShoppingCart(data);
    shoppingCartService.setStoreCartLocalStorage(data);
    document.getElementById("cart-quantity").innerText = data?.reduce((total, cart) => {
      return total + cart.quantity;
    }, 0);
  };

  // Update product prices when Flash Sale is not applicable
  const onUpdateProductPriceInCart = (productPriceId, flashSaleId) => {
    if (!shoppingCart || shoppingCart.length === 0) return;
    let data = shoppingCart;
    data = data.map((cart) =>
      cart?.productPrice?.id === productPriceId && cart?.productPrice?.flashSaleId === flashSaleId
        ? {
            ...cart,
            productPrice: { ...cart?.productPrice, priceValue: cart?.productPrice?.originalPrice, flashSaleId: null },
          }
        : cart,
    );
    setShoppingCart(data);
    shoppingCartService.setStoreCartLocalStorage(data);
  };

  const addMoreProducts = () => {
    //This feature will implemented by another US
  };

  const readPhoneFromStorage = () => {
    const loginData = JSON.parse(getStorage(localStorageKeys.LOGIN));
    return loginData?.phone;
  };

  const isHasAddress = () => {
    if (!deliveryAddress?.receiverAddress) return false;
    return true;
  };

  const isHasCustomerName = () => {
    if (!customerName) return false;
    return true;
  };

  const isHasPhone = () => {
    if (!phone) return false;
    return phone;
  };

  const checkValidData = () => {
    if (!customerName) return false;
    if (!phone) return false;
    if (!deliveryAddress?.receiverAddress) return false;
    return shoppingCart.filter((p) => p.quantity > 0).length > 0;
  };

  const onChangeCustomerName = (e) => {
    setIsEditName(true);
    setCustomerName(e.target.value);
  };

  const onChangePhone = (e) => {
    setIsEditPhone(true);
    setPhone(e.target.value);
  };

  const checkOutOrder = () => {
    const checkOutData = {
      phone: phone,
      countryCode: countryCode,
      name: customerName,
      address: deliveryAddress?.receiverAddress?.address,
      longitude: deliveryAddress?.receiverAddress?.lng,
      latitude: deliveryAddress?.receiverAddress?.lat,
      shoppingCart: shoppingCart
        ?.filter((cart) => cart.quantity > 0)
        .map((cart) => ({
          isCombo: cart?.isCombo,
          itemID: cart?.id,
          quantity: cart?.quantity,
          productPriceId: cart?.productPrice?.id,
          price: cart?.isCombo ? cart?.originalPrice : cart?.productPrice?.originalPrice,
          priceAfterDiscount: cart?.isCombo ? cart?.sellingPrice : cart?.productPrice?.priceValue,
          comboPricingId: cart?.comboPricingId,
          productId: cart?.isCombo ? null : cart?.dataDetails?.id,
          productName: cart?.isCombo ? "" : cart?.name,
          productPriceName: cart?.isCombo ? cart?.name : cart?.productPrice?.priceName,
          comboName:
            cart?.isCombo && (cart?.comboTypeId === EnumComboType.Flexible ? cart?.comboPricingName : cart?.name),
          flashSaleId: cart?.productPrice?.flashSaleId,
          orderItemToppings: cart?.isCombo
            ? null
            : cart?.toppings?.map((topping) => ({
                ...topping,
                toppingName: topping.name,
                toppingValue: topping.priceValue,
              })),
          orderItemOptions: cart?.isCombo
            ? null
            : cart?.options?.map((o) => ({
                ...o,
                optionName: o.name,
              })),
        })),
      note: "",
      deliveryMethodId: shippingMethod,
      enumDeliveryMethod: enumShippingMethod,
      paymentMethodId: paymentMethod,
      discountCodeId: null,
      deliveryFee: deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY ? shippingFee : 0,
      totalTax: totalTaxes(),
      totalFee: fee,
      totalAmount: totalAmount(),
      totalDiscount: totalDiscount,
      branchId: deliveryAddress?.branchAddress?.id,
      accountId: accountId,
      discountId: null,
    };
    checkOutDataService
      .createCheckoutOrder(checkOutData)
      .then((response) => {
        const checkOutResponse = response.data;
        if (checkOutResponse.success) {
          setOrderId(checkOutResponse.orderID);
          setOrderStringCode(responseData.orderStringCode);
          setMomoQRCodeURL(checkOutResponse.qrCodeURL);
          setMomoDeeplink(checkOutResponse.deepLink);
          if (paymentMethod === PaymentMethodType.Cash) {
            setIsShowCash(true);
          } else if (paymentMethod === PaymentMethodType.Momo) {
            if (!isMobile || !momoDeeplink) setUsingMomoWeb(true);
            else setIsShowMomo(true);
          }
        } else {
          // Flash Sale failed
          if (checkOutResponse?.responseCode === EnumResponseCode.flashSaleFailed) {
            var responseData = JSON.parse(checkOutResponse?.responseData);
            const content = t(responseData?.[0]?.DescriptionTranslation);
            setContentNotifyDialog(content);
            responseData?.map((data) => {
              onUpdateProductPriceInCart(data?.ProductPriceId, data?.FlashSaleId);
            });
            setIsShowNotifyDialog(true);
          } else {
            //To do
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onCompleteCheckOut = () => {
    if (!checkValidData()) return;
    checkOutOrder();
  };

  const openShippingAddressModal = () => {
    const chooseAddressModal = document.getElementsByClassName("receiver-address-select-button")[0];
    chooseAddressModal?.click();
  };

  const onChangeShippingMethod = (e) => {
    const shipping = shippingMethods.find((s) => s.id === e.target.value);
    if (shipping) setShippingFee(shipping.cost);
    else setShippingFee(0);
    setShippingMethod(e.target.value);
    setEnumShippingMethod(shipping.enumId);
  };

  const onChangePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  const showDiscount = () => {
    setIsShowDiscount(!isShowDiscount);
  };

  const showFeeAndTax = () => {
    setIsShowFeeAndTax(!isShowFeeAndTax);
  };

  const totalOriginalPrice = shoppingCart?.reduce(
    (sum, cart) =>
      sum + Math.floor(cart.quantity * (cart?.isCombo ? cart?.originalPrice : cart?.productPrice?.originalPrice)),
    0,
  );
  const totalDiscount = shoppingCart?.reduce(
    (sum, cart) =>
      sum +
      Math.floor(
        cart.quantity *
          (cart?.isCombo
            ? cart?.originalPrice - cart?.sellingPrice
            : cart?.productPrice?.originalPrice - cart?.productPrice?.priceValue),
      ),
    0,
  );
  const totalToppings = shoppingCart?.reduce(
    (sum, cart) =>
      sum + cart.quantity * (cart?.isCombo ? cart?.totalOfToppingPrice : cart?.productPrice?.totalOfToppingPrice),
    0,
  );
  const totalTax = (productId, price) => {
    const tax = taxes?.find((tax) => tax.productId === productId);
    return Math.round((tax?.percentage * price) / 100);
  };
  const totalTaxes = () => {
    return shoppingCart
      ?.filter((c) => !c.isCombo)
      ?.reduce((total, c) => total + c?.quantity * totalTax(c?.id, c?.productPrice?.originalPrice), 0);
  };
  const totalAmount = () => {
    return (
      totalOriginalPrice - totalDiscount + (fee ?? 0) + (totalTaxes() ?? 0) + (shippingFee ?? 0) + (totalToppings ?? 0)
    );
  };

  const onViewOrderDetail = () => {
    setIsShowCash(false);
    setIsShowMomo(false);
    setUsingMomoWeb(false);
    setIsShowPaymentMomoFailed(false);
    setIsShowPaymentMomoSuccess(false);
    setShoppingCart([]);
    localStorage.removeItem(localStorageKeys.STORE_CART);
    document.getElementById("cart-quantity").innerText = "0";
    //The other US will view detail of OrderID = orderID here
  };

  const onCreateNewOrder = () => {
    setIsShowCash(false);
    setIsShowMomo(false);
    setUsingMomoWeb(false);
    setIsShowPaymentMomoFailed(false);
    setIsShowPaymentMomoSuccess(false);
    localStorage.removeItem(localStorageKeys.STORE_CART);
    document.getElementById("cart-quantity").innerText = "0";
    history.push("/product-list");
  };

  const onUsingMomoApp = () => {
    setUsingMomoWeb(false);
    setIsShowMomo(false);
    if (momoDeeplink) {
      window.location.assign(momoDeeplink);
    }
  };

  const onUsingMomoWeb = () => {
    setUsingMomoWeb(true);
    setIsShowMomo(false);
  };

  const onMomoSuccess = () => {
    setUsingMomoWeb(false);
    setIsShowMomo(false);
    setIsShowCash(false);
    setIsShowPaymentMomoSuccess(true);
  };

  const onMomoFailed = (error) => {
    setUsingMomoWeb(false);
    setIsShowMomo(false);
    setIsShowCash(false);
    setMomoError(error);
    setIsShowPaymentMomoFailed(true);
  };

  const handleConfirmNotify = () => {
    setIsShowNotifyDialog(false);
    window.location.reload();
  };

  const onMomoExpire = (orderId) => {
    setUsingMomoWeb(false);
    setIsShowMomo(false);
    setIsShowCash(false);
  };

  const defaultCustomerName = () => {
    const token = getStorage(localStorageKeys.TOKEN);
    const decoded_token = token && jwt_decode(token);
    return decoded_token?.FULL_NAME;
  };

  const renderShippingMethods = shippingMethods.map((shipping) => {
    const icon = shippingIcons.find((x) => x.enumId === shipping.enumId)?.icon;
    return (
      <>
        <Radio key={shipping.id} value={shipping.id} className="shipping_method_item">
          <div className="shipping_option_item">
            <img src={icon} className="shipping_icon" alt={shipping.name} />

            <div className="shipping_name">
              {shipping.enumId == EnumDeliveryMethod.ShopDelivery
                ? pageData.deliveryMethod.shopDelivery
                : pageData.deliveryMethod.ahamove}
            </div>
            <div className="shipping_amount">{formatTextNumber(shipping.cost)}đ</div>
          </div>
        </Radio>
      </>
    );
  });

  const renderPaymentMethods = paymentMethods.map((payment) => {
    const icon = paymentIcons.find((x) => x.enumId === payment.enumId)?.icon;
    return (
      <>
        <Radio key={payment.enumId} value={payment.enumId} className="payment_method_item">
          <div className="payment_option_item">
            <img src={icon} className="payment_icon" alt={payment.name} />
            <div className="payment_name">{payment.name}</div>
          </div>
        </Radio>
      </>
    );
  });

  return (
    <>
      <div
        id="themeCheckoutCheckout"
        onClick={() => {
          if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.CheckoutCheckout);
        }}
      >
        <ConfirmationDialog
          open={isShowNotifyDialog}
          onCancel={() => {}}
          onConfirm={handleConfirmNotify}
          confirmLoading={false}
          className="checkout-theme1-notify-dialog"
          content={contentNotifyDialog}
          footer={[<Button onClick={handleConfirmNotify}>{pageData.gotIt}</Button>]}
        />
        <ListenMoMoPaymentStatus accountId={accountId} onSuccess={onMomoSuccess} onFailed={onMomoFailed} />
        <CheckOutCash visible={isShowCash} onCancel={onCreateNewOrder} onOk={onViewOrderDetail} />
        <CheckOutMomo visible={isShowMomo} onCancel={onUsingMomoWeb} onOk={onUsingMomoApp} />
        <CheckOutMomoWeb
          visible={usingMomoWeb}
          onCancel={() => {
            setUsingMomoWeb(false);
          }}
          onMomoExpire={onMomoExpire}
          orderID={orderId}
          orderStringCode={orderStringCode}
          amount={totalAmount()}
          momoQRCodeURL={momoQRCodeURL}
          momoDeeplink={momoDeeplink}
        />
        <CheckOutMomoFailed
          visible={isShowPaymentMomoFailed}
          onCancel={() => {
            setIsShowPaymentMomoFailed(false);
          }}
          orderID={orderId}
          error={momoError}
        />
        <CheckOutMomoSuccess
          visible={isShowPaymentMomoSuccess}
          onCancel={() => {
            setIsShowPaymentMomoSuccess(false);
          }}
          orderID={orderId}
          onViewDetail={onViewOrderDetail}
          onCreateNewOrder={onCreateNewOrder}
        />
        <div className="check_out_theme1_container" style={detailStyle}>
          <div className="check_out_product">
            <div className="product_summary">
              <div className="total">
                <div className="shoppingCart" style={{ color: colorGroup?.titleColor }}>
                  {pageData.shoppingCart}
                </div>
                <div className="quantity">
                  {!shoppingCart ? 0 : shoppingCart.filter((cart) => cart.quantity > 0).length} {pageData.product}
                </div>
              </div>
              <div className="add" onClick={addMoreProducts}>
                {pageData.addMoreProducts}
              </div>
            </div>
            <div
              className="check_out_empty_cart"
              style={
                !shoppingCart || shoppingCart.length === 0
                  ? { display: "block", alignItems: "center" }
                  : { display: "none" }
              }
            >
              <img src={emptyCart} alt="Empty cart" style={{ marginTop: 40, width: "100%" }} />
            </div>
            <div style={{ height: "10px" }}></div>
            <div className="product_detail">
              {shoppingCart?.map((cart, index) => {
                return (
                  <CheckOutProductItem
                    cartItem={cart}
                    currentIndex={index}
                    key={cart.id + index}
                    onUpdateCartQuantity={onUpdateCartQuantity}
                    onDeleteProduct={onDeleteProduct}
                    setCurrentCartItems={(cartItems) => setShoppingCart(cartItems)}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
          <div className="check_out_shipping">
            <div className="box_delivery">
              <div className="delivery">{pageData.deliveryTo}</div>
              <div className="shipping_location_info">
                <img className="shipping_location_icon" src={locationIcon} alt="" />
                <div className="shipping_location_detail">
                  <div className="shipping_name"></div>
                  <div className="shipping_address">
                    {!isHasAddress() ? pageData.noAddressMessage : deliveryAddress?.receiverAddress?.address}
                  </div>
                  <div className="change_shipping_address" onClick={openShippingAddressModal}>
                    {!isHasAddress() ? pageData.configureAddress : pageData.changeAddress}
                  </div>
                </div>
              </div>
              <div className="shipping_info_box">
                <div className="shipping_info_name">
                  <img className="check_out_name_icon" src={userIcon} alt="" />
                  <Input
                    id="txtName"
                    className="check_out_name"
                    maxLength={200}
                    autoFocus={true}
                    allowClear={false}
                    placeholder={pageData.placeHolderName}
                    onChange={onChangeCustomerName}
                    defaultValue={defaultCustomerName()}
                  />
                </div>
                {!isHasCustomerName() && isEditName && (
                  <span className="check_out_missing_name_error">{pageData.missingCustomerNameMessage}</span>
                )}
                <div className="shipping_info_phone">
                  <img className="check_out_phone_icon" src={userPhoneIcon} alt="" />
                  <Input
                    id="txtPhone"
                    className="check_out_phone"
                    maxLength={15}
                    allowClear={false}
                    placeholder={pageData.placeHolderPhone}
                    onChange={onChangePhone}
                    defaultValue={readPhoneFromStorage()}
                    onKeyPress={(event) => {
                      const checkValidKey = checkOnKeyPressValidation(event, "txtPhone", 0, 999999999, 0);
                      if (!checkValidKey) event.preventDefault();
                    }}
                  />
                </div>
                {!isHasPhone() && isEditPhone && (
                  <span className="check_out_missing_phone_error">{pageData.missingPhoneMessage}</span>
                )}
              </div>
            </div>
            <div className="box_shipping">
              <div className="shipping">{pageData.shippingMethod}</div>
              <Radio.Group
                className="shipping_radio_shipping_method"
                onChange={(e) => onChangeShippingMethod(e)}
                value={shippingMethod}
              >
                {renderShippingMethods}
              </Radio.Group>
            </div>
            <div className="box_payment_method">
              <div className="payment_method">{pageData.paymentMethod}</div>
              <Radio.Group
                className="shipping_radio_payment_method"
                onChange={(e) => onChangePaymentMethod(e)}
                value={paymentMethod}
              >
                {renderPaymentMethods}
              </Radio.Group>
            </div>
            <div className="box_summary">
              <div className="summary">{pageData.summary}</div>
              <div className="cart_sub_total">
                <div className="title">{pageData.subTotal}</div>
                <div className="amount">
                  {formatTextNumber(totalOriginalPrice + totalToppings)} {pageData.vnd}
                </div>
              </div>
              <div className="cart_discount">
                <div className="discount_title">
                  <div className="title">{pageData.discount}</div>
                  <img
                    className="img_show_discount"
                    src={isShowDiscount ? checkout_arrow_up : checkout_arrow_down}
                    alt={totalDiscount}
                    onClick={showDiscount}
                  />
                </div>
                <div className="amount">
                  {formatTextNumber(totalDiscount)} {pageData.vnd}
                </div>
              </div>
              <div className="cart_fee_and_tax">
                <div className="fee_and_tax_title">
                  <div className="title">{pageData.feeAndTax}</div>
                  <Popover
                    placement="bottom"
                    content={<CheckOutTaxes shoppingCart={shoppingCart} taxes={taxes} />}
                    trigger="click"
                    open={isShowFeeAndTax}
                    onOpenChange={(isShowFeeAndTax) => setIsShowFeeAndTax(isShowFeeAndTax)}
                    getPopupContainer={(trigger) => trigger.parentElement}
                  >
                    <img
                      className="img_show_fee_and_tax"
                      src={isShowFeeAndTax ? checkout_arrow_up : checkout_arrow_down}
                      alt={fee + totalTaxes()}
                      onClick={showFeeAndTax}
                    />
                  </Popover>
                </div>
                <div className="amount">
                  {formatTextNumber(fee + totalTaxes())} {pageData.vnd}
                </div>
              </div>
              <div className="cart_shipping_fee">
                <div className="title">{pageData.shippingFee}</div>
                <div className="amount">
                  {formatTextNumber(shippingFee)} {pageData.vnd}
                </div>
              </div>
              <div className="cart_amount">
                <div className="title">{pageData.total}</div>
                <div className="amount">
                  {formatTextNumber(totalAmount())} {pageData.vnd}
                </div>
              </div>
            </div>
            <div
              className="shipping_complete"
              onClick={onCompleteCheckOut}
              style={checkValidData() ? { opacity: 1 } : { opacity: 0.5 }}
            >
              <div className="shipping_complete_title">{pageData.complete}</div>
              <CheckoutCompleteIcon className="shipping_complete_icon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
