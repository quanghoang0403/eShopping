import { Input, Modal, Radio } from "antd";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import checkOutDataService from "../../../../data-services/checkout-data.service";
import deliveryMethodDataService from "../../../../data-services/delivery-method-data.service";
import paymentMethodDataService from "../../../../data-services/paymentMethod-data.service";
import storeDataService from "../../../../data-services/store-data.service";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import { checkOnKeyPressValidation, formatTextNumber } from "../../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../../utils/localStorage.helpers";
import checkoutAddIcon from "../../../assets/icons/checkout-add.svg";
import checkoutNoteIcon from "../../../assets/icons/checkout-note.svg";
import locationIcon from "../../../assets/icons/location.svg";
import userIcon from "../../../assets/icons/user.svg";
import userPhoneIcon from "../../../assets/icons/user_phone.svg";
import noProductInCart from "../../../assets/images/no-product-in-cart.png";
import ListenMoMoPaymentStatus from "../../../components/listen-momo-payment-status/listen-momo-payment-status.component";
import { PaymentMethodType } from "../../../constants/payment-method.constants";
import { theme2ElementCustomize } from "../../../constants/store-web-page.constants";
import { paymentIcons } from "../default-data";
import CheckOutCash from "./checkout-cash";
import CheckOutMomo from "./checkout-momo";
import CheckOutMomoFailed from "./checkout-momo-failed";
import CheckOutMomoSuccess from "./checkout-momo-success";
import CheckOutMomoWeb from "./checkout-momo-web";
import CheckoutOrderItems from "./checkout-order-items";
import "./checkout.detail.scss";
import { enumOrderType } from "../../../constants/enum";
export default function OrderCheckout(props) {
  const history = useHistory();
  const { t } = useTranslation();
  const pageData = {
    addMoreProducts: t("checkOutPage.addMoreProducts", "Add more products"),
    changeAddress: t("checkOutPage.changeAddress", "Change another address"),
    configureAddress: t("checkOutPage.configureAddress", "Configure address"),
    noAddressMessage: t("checkOutPage.noAddressMessage", "You have no shipping address. Please configure one"),
    complete: t("checkOutPage.complete", "Complete"),
    pay: t("checkOutPage.pay", "Pay"),
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
    cartProduct: t("checkOutPage.cartProduct", "Product"),
    cartPrice: t("checkOutPage.cartPrice", "Price"),
    cartQuantity: t("checkOutPage.cartQuantity", "Quantity"),
    cartTotal: t("checkOutPage.cartTotal", "Total"),
    placeHolderNote: t("checkOutPage.laceHolderNote", "Note"),
    yourCart: t("checkOutPage.yourCart", "Your cart"),
    items: t("checkOutPage.items", "items"),
    emptyCart: t("checkOutPage.emptyCart", "Không có gì trong giỏ hàng của bạn"),
  };

  const { configuration, colorGroups, clickToFocusCustomize } = props;
  const backgroundImage = configuration?.backgroundImage;
  const backgroundColor = configuration?.backgroundColor;
  const backgroundType = configuration?.backgroundType;
  const categoryId = configuration?.categoryId;
  const colorGroup = colorGroups?.find((c) => c.id === configuration?.colorGroupId);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [customerName, setCustomerName] = useState(null);
  const [note, setNote] = useState(null);
  const [phone, setPhone] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [placeName, setPlaceName] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [showShippingAddressModal, setShowShippingAddressModal] = useState(false);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [enumShippingMethod, setEnumShippingMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [fee, setFee] = useState(0);
  const [tax, setTax] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [position, setPosition] = useState(null);
  const [isShowCash, setIsShowCash] = useState(false);
  const [isShowMomo, setIsShowMomo] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const [orderId, setOrderId] = useState(false);
  const [orderCode, setOrderCode] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditPhone, setIsEditPhone] = useState(false);
  const storageConfig = JSON.parse(getStorage("config"));
  const mockupCustomize = storageConfig.customizeTheme;
  const [momoQRCodeURL, setMomoQRCodeURL] = useState(false);
  const [momoDeeplink, setMomoDeeplink] = useState(false);
  const [usingMomoWeb, setUsingMomoWeb] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [isShowPaymentMomoFailed, setIsShowPaymentMomoFailed] = useState(false);
  const [momoError, setMomoError] = useState(null);
  const [isShowPaymentMomoSuccess, setIsShowPaymentMomoSuccess] = useState(false);
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);

  const paymentMethodMockup = [
    {
      enumId: 0,
      name: "MoMo",
      icon: paymentIcons.momoIcon,
      id: "0",
      isDeleted: false,
    },
    {
      enumId: 2,
      name: "Credit / Debit Card",
      icon: paymentIcons.visaIcon,
      id: "2",
      isDeleted: false,
    },
    {
      enumId: 3,
      name: "Cash",
      icon: paymentIcons.cashIcon,
      id: "3",
      isDeleted: false,
    },
    {
      enumId: 4,
      name: "VNPay",
      icon: paymentIcons.vnPayIcon,
      id: "4",
      isDeleted: false,
    },
  ];
  const shippingMethodMockup = [
    { id: "1", name: "Self Delivery", enumId: 1 },
    { id: "2", name: "AhaMove", enumId: 2 },
  ];
  useEffect(() => {
    if (mockupCustomize) {
      setPaymentMethods(paymentMethodMockup);
      setShippingMethods(shippingMethodMockup);
    } else {
      loadProducts();
      loadPaymentMethods();
      loadShippingMethods(shippingAddress);

      const token = getStorage(localStorageKeys.TOKEN);
      const decoded_token = token && jwt_decode(token);
      setAccountId(decoded_token?.ACCOUNT_ID);
      setCustomerName(decoded_token?.FULL_NAME);
    }
  }, []);

  useEffect(() => {
    loadShippingMethods(shippingAddress);
  }, [shippingAddress]);

  const loadProducts = () => {
    let store_cart = JSON.parse(localStorage.getItem(localStorageKeys.STORE_CART));
    setShoppingCart(store_cart);
    const loginData = JSON.parse(getStorage(localStorageKeys.LOGIN));
    setCountryCode(loginData?.countryCode);
    setPhone(loginData?.phone);
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

  const loadShippingMethods = (address) => {
    const fetchDeliveryMethod = async () => {
      const data = { address: address, longItude: position?.long, latItude: position?.lat };
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
  };

  const onDeleteProduct = (id, cartIndex) => {
    if (!shoppingCart || shoppingCart.length === 0) return;
    let data = [...shoppingCart];
    data.splice(cartIndex, 1);
    setShoppingCart([...data]);
    shoppingCartService.setStoreCartLocalStorage(data);
  };

  const addMoreProducts = () => {
    if (!shoppingCart || shoppingCart.length === 0) return;
    let data = shoppingCart;
    data = data.map((cart) => (cart.quantity < 0 ? { ...cart, quantity: 0 } : cart));
    setShoppingCart(data);
  };

  const readPhoneFromStorage = () => {
    const loginData = JSON.parse(getStorage(localStorageKeys.LOGIN));
    return loginData?.phone;
  };

  const isHasAddress = () => {
    if (shippingAddress === undefined || shippingAddress === null || shippingAddress === "") return false;
    return true;
  };

  const isHasCustomerName = () => {
    if (customerName === undefined || customerName === null || customerName === "") return false;
    return true;
  };

  const isHasPhone = () => {
    if (phone === undefined || phone === null || phone === "") return false;
    return true;
  };

  const checkValidData = () => {
    if (!customerName) return false;
    if (!phone) return false;
    if (!shippingAddress) return false;
    return shoppingCart.filter((p) => p.quantity > 0).length > 0;
  };

  const onChangeCustomerName = (e) => {
    setIsEditName(true);
    setCustomerName(e.target.value);
  };

  const onChangeNote = (e) => {
    setNote(e.target.value);
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
      address: shippingAddress,
      longitude: position?.long,
      latitude: position?.lat,
      shoppingCart: shoppingCart
        ?.filter((cart) => cart.quantity > 0)
        .map((cart) => ({
          isCombo: cart?.isCombo,
          itemID: cart?.id,
          quantity: cart?.quantity,
          productPriceId: cart?.productPrice?.id,
          price: cart.isCombo ? cart?.originalPrice : cart?.productPrice?.originalPrice,
          priceAfterDiscount: cart.isCombo ? cart?.sellingPrice : cart?.productPrice?.priceValue,
          comboPricingId: cart?.comboPricingId,
          productName: cart?.isCombo ? "" : cart?.name,
          productPriceName: cart?.isCombo ? cart?.name : cart?.productPrice?.priceName,
          comboName: cart?.isCombo ? cart?.name : "",
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
      note: note,
      deliveryMethodId: shippingMethod,
      enumDeliveryMethod: enumShippingMethod,
      paymentMethodId: paymentMethod,
      discountCodeId: null,
      deliveryFee: deliveryAddress.orderType === enumOrderType.ONLINE_DELIVERY ? shippingFee : 0,
      totalTax: tax,
      totalFee: fee,
      totalAmount: totalAmount(),
      totalDiscount: totalDiscount,
      branchId: branchId,
      accountId: accountId,
      discountId: null,
    };
    checkOutDataService
      .createCheckoutOrder(checkOutData)
      .then((response) => {
        const checkOutResponse = response.data;
        if (checkOutResponse.success) {
          setOrderId(checkOutResponse.orderID);
          setOrderCode(checkOutResponse.orderCode);
          setMomoQRCodeURL(checkOutResponse.qrCodeURL);
          setMomoDeeplink(checkOutResponse.deepLink);
          if (paymentMethod === PaymentMethodType.Cash) {
            setIsShowCash(true);
          } else if (paymentMethod === PaymentMethodType.Momo) {
            if (!isMobile || !momoDeeplink) setUsingMomoWeb(true);
            else setIsShowMomo(true);
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

  const addShippingAddress = () => {
    const address = document.getElementById("txtShippingAddress").value;
    setPlaceName(address);
    closeShippingAddressModal();
    setShippingAddress(address);
    //Temporary get location from company. Other US will get correct GPS location
    const addressLocation = { long: 106.670739, lat: 10.793063 };
    setPosition(addressLocation);
    //Load closest branch base on address & location
    const addressData = {
      address: address,
      longitude: addressLocation?.long,
      latitude: addressLocation?.lat,
    };
    storeDataService.getClosestBranchByAddress(addressData).then((response) => {
      setBranchId(response?.data?.branch?.id);
    });
    if (addressList.indexOf(address) < 0) setAddressList([...addressList, address]);
  };

  const chooseShippingAddress = (data) => {
    setShippingAddress(data);
    //Temporary get location from company. Other US will get correct GPS location
    const addressLocation = { long: 106.670739, lat: 10.793063 };
    setPosition(addressLocation);
    //Load closest branch base on address & location
    const addressData = {
      address: data,
      longitude: addressLocation?.long,
      latitude: addressLocation?.lat,
    };
    storeDataService.getClosestBranchByAddress(addressData).then((response) => {
      setBranchId(response?.data?.branch?.id);
    });
    setShowShippingAddressModal(false);
  };

  const openShippingAddressModal = () => {
    if (
      document.getElementById("txtShippingAddress") !== undefined &&
      document.getElementById("txtShippingAddress") !== null
    ) {
      document.getElementById("txtShippingAddress").value = "";
      document.getElementById("txtShippingAddress").focus();
    }
    setShowShippingAddressModal(true);
  };

  const closeShippingAddressModal = () => {
    setShowShippingAddressModal(false);
  };

  const onChangeShippingMethod = (e) => {
    setShippingMethod(e.target.value);
    const shippingData = shippingMethods.find((s) => s.id === e.target.value);
    if (shippingData && deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY) {
      setShippingFee(shippingData?.cost);
    } else {
      setShippingFee(0);
    }
    setEnumShippingMethod(shippingData.enumId);
  };

  const onChangePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
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
  const totalAmount = () => {
    return totalOriginalPrice - totalDiscount + (fee ?? 0) + (tax ?? 0) + (shippingFee ?? 0) + (totalToppings ?? 0);
  };

  const onViewOrderDetail = () => {
    setIsShowCash(false);
    setIsShowMomo(false);
    setUsingMomoWeb(false);
    setIsShowPaymentMomoFailed(false);
    setIsShowPaymentMomoSuccess(false);
    setShoppingCart([]);
    localStorage.removeItem(localStorageKeys.STORE_CART);
    //The other US will view detail of OrderID = orderID here
  };

  const onCreateNewOrder = () => {
    setIsShowCash(false);
    setIsShowMomo(false);
    setUsingMomoWeb(false);
    setIsShowPaymentMomoFailed(false);
    setIsShowPaymentMomoSuccess(false);
    localStorage.removeItem(localStorageKeys.STORE_CART);
    history.push("/checkout");
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
  const renderAddressList = addressList.map((address) => {
    return (
      <>
        <div className="choose_shipping_address">
          <div
            className="shipping_place"
            onClick={() => {
              chooseShippingAddress(address);
            }}
          >
            {address}
          </div>
          <div
            className="shipping_address"
            onClick={() => {
              chooseShippingAddress(address);
            }}
          >
            {address}
          </div>
        </div>
      </>
    );
  });

  const renderModalShippingAddress = (
    <>
      <Modal
        className="modal_shipping_address"
        title={pageData.deliveryTo}
        open={showShippingAddressModal}
        afterClose={closeShippingAddressModal}
        onOk={addShippingAddress}
        onCancel={closeShippingAddressModal}
        closable={true}
        footer={(null, null)}
      >
        <Input
          id="txtShippingAddress"
          className="modal_shipping_address_text"
          maxLength={200}
          allowClear={true}
          placeholder={pageData.placeHolderShippingAddress}
          onKeyUp={(event) => {
            if (event.key === "Enter") addShippingAddress();
          }}
          style={{ marginBottom: "20px", marginTop: "20px", paddingLeft: "10px", paddingRight: "10px" }}
        />
        {renderAddressList}
      </Modal>
    </>
  );

  const renderShippingMethods = shippingMethods.map((shipping) => {
    return (
      <>
        <Radio key={shipping.id} value={shipping.id} className="shipping_method_item">
          <div className="shipping_option_item">
            <div className="shipping_name">{shipping.name}</div>
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
            <div className="payment_name">{payment.name}</div>
            <div className="payment_icon">
              <img src={icon} alt={payment.name} style={{ width: "20px", height: "20px" }} />
            </div>
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
          if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.CheckoutCheckout);
        }}
        className="old-checkout-detail-page"
      >
        <ListenMoMoPaymentStatus accountId={accountId} onSuccess={onMomoSuccess} onFailed={onMomoFailed} />
        <CheckOutCash visible={isShowCash} onCancel={onCreateNewOrder} onOk={onViewOrderDetail} />
        <CheckOutMomo visible={isShowMomo} onCancel={onUsingMomoWeb} onOk={onUsingMomoApp} />
        <CheckOutMomoWeb
          visible={usingMomoWeb}
          onCancel={() => {
            setUsingMomoWeb(false);
          }}
          orderID={orderId}
          orderCode={orderCode}
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
        {renderModalShippingAddress}
        <div className="check_out_theme2_container page-container" style={detailStyle}>
          <div className="check_out_product">
            <div className="product_summary">
              <div className="total">
                <div className="shoppingCart" style={{ color: colorGroup?.titleColor }}>
                  {pageData.yourCart}
                </div>
                <div className="quantity">
                  ({!shoppingCart ? 0 : shoppingCart.filter((cart) => cart.quantity > 0).length} {pageData.items})
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
              <div style={{ flex: 1 }}>{pageData.cartPrice}</div>
              <div style={{ flex: 1 }}>{pageData.cartQuantity}</div>
              <div style={{ flex: 1 }}>{pageData.cartTotal}</div>
            </div>
            <div className="product_title product-title-mobile">{pageData.cartProduct}</div>
            <div className="product_detail">
              {!mockupCustomize ? (
                shoppingCart?.map((cart, index) => {
                  return (
                    <CheckoutOrderItems
                      key={cart.id + index}
                      cartItem={cart}
                      currentIndex={index}
                      onUpdateCartQuantity={onUpdateCartQuantity}
                      onDeleteProduct={onDeleteProduct}
                      setCurrentCartItems={(cartItems) => setShoppingCart(cartItems)}
                      index={index}
                    />
                  );
                })
              ) : (
                <div className="noProductInCart">
                  <img src={noProductInCart} alt=""></img>
                  <div className="noProductInCartText">{pageData.emptyCart}</div>
                </div>
              )}
            </div>
          </div>

          <div className="check_out_shipping">
            <div className="box_delivery">
              <div className="delivery">{pageData.deliveryTo}</div>
              <div className="shipping_location_info">
                <img className="shipping_location_icon" src={locationIcon} alt="" />
                <div className="shipping_location_detail">
                  <div className="shipping_name">{placeName}</div>
                  <div className="shipping_address">
                    {!isHasAddress() ? pageData.noAddressMessage : shippingAddress}
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
                    autoFocus={mockupCustomize ? false : true}
                    allowClear={false}
                    placeholder={pageData.placeHolderName}
                    onChange={onChangeCustomerName}
                    defaultValue={customerName}
                  />
                </div>
                {!isHasCustomerName() && isEditName && !mockupCustomize && (
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
                {!isHasPhone() && isEditPhone && !mockupCustomize && (
                  <span className="check_out_missing_phone_error">{pageData.missingPhoneMessage}</span>
                )}
              </div>
            </div>
            <div className="box_shipping">
              <div className="shipping">{pageData.shippingMethod}</div>
              <Radio.Group
                className="radio_options_shipping_method"
                onChange={(e) => onChangeShippingMethod(e)}
                value={shippingMethod}
              >
                {renderShippingMethods}
              </Radio.Group>
            </div>
            <div className="box_payment_method">
              <div className="payment_method">{pageData.paymentMethod}</div>
              <Radio.Group
                className="radio_options_payment_method"
                onChange={(e) => onChangePaymentMethod(e)}
                value={paymentMethod}
              >
                {renderPaymentMethods}
              </Radio.Group>
            </div>
            <div className="shipping_checkout_note">
              <img className="shipping_checkout_note_icon" src={checkoutNoteIcon} alt={pageData.placeHolderNote} />
              <Input
                id="txtShippingNote"
                className="textbox_shipping_note"
                maxLength={200}
                allowClear={true}
                placeholder={pageData.placeHolderNote}
                onChange={onChangeNote}
              />
            </div>
            <div className="box_summary">
              <div className="cart_sub_total">
                <div className="title">{pageData.subTotal}</div>
                <div className="amount">
                  {formatTextNumber(totalOriginalPrice + totalToppings)} {pageData.vnd}
                </div>
              </div>
              <div className="cart_discount">
                <div className="title">{pageData.discount}</div>
                <div className="amount">
                  {formatTextNumber(totalDiscount)} {pageData.vnd}
                </div>
              </div>
              <div className="cart_fee_and_tax">
                <div className="title">{pageData.feeAndTax}</div>
                <div className="amount">
                  {formatTextNumber(fee + tax)} {pageData.vnd}
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
              <div className="shipping_complete_title">{pageData.pay}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
