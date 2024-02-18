import { Button, Modal } from "antd";
import jwt_decode from "jwt-decode";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import branchDataService from "../../../data-services/branch-data.services";
import loginDataService from "../../../data-services/login-data.service";
import {
  setAddressList,
  setCartItems,
  setDeliveryAddress,
  setNearestStoreBranches,
} from "../../../modules/session/session.actions";
import { userInfoSelector } from "../../../modules/session/session.reducers";
import { LockMultipleCalls } from "../../../services/promotion.services";
import shoppingCartService from "../../../services/shopping-cart/shopping-cart.service";
import { getStorage, localStorageKeys } from "../../../utils/localStorage.helpers";
import { DeliveryHeaderIcon } from "../../assets/icons.constants";
import { IconAddressDeliveryCustomize } from "../../assets/icons/AddressDeliveryIcon";
import { IconPickupCustomize } from "../../assets/icons/PickupDeliveryIcon";
import { enumOrderType } from "../../constants/enum";
import ConfirmationDialog from "../confirmation-dialog/confirmation-dialog.component";
import { CustomerAddresses } from "../customer-address/customer-address.component";
import { BranchAddressSelector } from "../store-branch-address-selector/branch-address-selector.component";
import { StoreBranchAddressSelector } from "./../store-branch-address-selector/store-branch-address-selector.component";
import DeliveryAddessDetail from "./delivery-addess-detail/delivery-addess-detail.component";
import "./delivery-address-selector.style.scss";
import { PlacesAutocompleteComponent } from "./places-autocomplete/places-autocomplete.component";

const HANDLE_GET_ADDRESS_LIST = "HANDLE_GET_ADDRESS_LIST"; // Lock multiple calls function key
export const DeliveryAddressSelectorComponent = forwardRef((props, ref) => {
  const { className, groupColorConfig, isCustomize } = props;
  const fontFamily = useSelector((state) => state?.session?.themeConfig?.general?.font?.name);

  const [t] = useTranslation();
  const dispatch = useDispatch();
  const autoCompleteRef = useRef();
  const customerAddressRef = useRef();
  const storeBranchAddressSelectorRef = useRef();
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const isOpenReceiverAddressDialog = useSelector((state) => state?.session?.isOpenReceiverAddressDialog);
  const [isVisibleModalDeliveryTo, setIsVisibleModalDeliveryTo] = useState(false);
  const addressList = useSelector(userInfoSelector)?.addressList;
  const [hasCustomerAddresses, setHasCustomerAddresses] = useState(false); // TODO: check login token

  const [openStoreBranchAddressSelector, setOpenStoreBranchAddressSelector] = useState(false);
  const [openDeliveryAddessDetail, setOpenDeliveryAddessDetail] = useState(false);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [branchSelected, setBranchSelected] = useState(null);
  const [itemsWillRemove, setItemsWillRemove] = useState(null);
  const [reloadLocationEvent, setReloadLocationEvent] = useState(true);
  const [storeCartAfterChangeBranch, setStoreCartAfterChangeBranch] = useState([]);
  const themeConfigReduxState = useSelector((state) => state?.session?.themeConfig);
  const config = themeConfigReduxState;
  const colorGroupFirstDefault = config?.general?.color?.colorGroups[0];
  const [openBranchAddressSelector, setOpenBranchAddressSelector] = useState(false);

  const translatedData = {
    continue: t("button.continue", "Tiếp tục"),
    shoppingCartItemBelongToBranchWarning: t(
      "shoppingCartItemBelongToBranchWarning",
      `Giỏ hàng có những sản phẩm không thuộc chi nhánh <b>{{branchName}}</b>. <p>Những sản phẩm đó sẽ bị xóa khỏi giỏ hàng?</p>`,
    ),
    deliveryTo: t("checkOutPage.deliveryTo", "Giao hàng tới"),
    chooseBranch: t("orderDetail.chooseBranch", "Chọn chi nhánh"),
    chooseAddress: t("orderDetail.chooseAddress", "Chọn địa chỉ"),
    toPickup: t("checkOutPage.toPickup", "Tự lấy hàng"),
    delivery: t("checkOutPage.delivery", "Giao hàng"),
  };

  useEffect(() => {
    if (deliveryAddress) {
      setCustomerAddress(deliveryAddress?.receiverAddress);
      setBranchSelected(deliveryAddress?.branchAddress ?? null);
    } else {
      getCurrentDefaultAddress();
    }
    const token = getStorage(localStorageKeys.TOKEN);
    const decoded_token = token && jwt_decode(token);
    if (decoded_token) {
      LockMultipleCalls(() => handleGetAddressList(decoded_token?.ACCOUNT_ID), HANDLE_GET_ADDRESS_LIST);
      setHasCustomerAddresses(true);
    } else {
      setHasCustomerAddresses(false);
    }
  }, []);

  useEffect(() => {
    if (customerAddress || deliveryAddress?.receiverAddress) {
      const currentDeliveryAddress = {
        ...deliveryAddress,
        branchAddress: deliveryAddress?.branchAddress,
        receiverAddress: customerAddress ?? deliveryAddress?.receiverAddress,
      };
      dispatch(setDeliveryAddress(currentDeliveryAddress));
    }
  }, [customerAddress]);

  useEffect(() => {
    if (branchSelected) {
      const currentDeliveryAddress = {
        ...deliveryAddress,
        receiverAddress: deliveryAddress?.receiverAddress,
        branchAddress: branchSelected,
      };
      dispatch(setDeliveryAddress(currentDeliveryAddress));
      if (!window.isCreateOrderCheckoutProcessing) {
        verifyStoreCart(branchSelected);
      }
    }
  }, [branchSelected]);

  useImperativeHandle(ref, () => ({}));

  const handleGetAddressList = async (accountId) => {
    const storeConfig = JSON.parse(getStorage(localStorageKeys.STORE_CONFIG));
    const res = await loginDataService.getAddressListByAccountIdAsync(accountId, storeConfig?.storeId);
    if (res) {
      const accountAddress = res?.data?.accountAddress;
      dispatch(setAddressList(accountAddress));
    }
  };

  const mappingLocationToCustomerAddress = (location) => {
    return {
      id: null,
      name: location?.address,
      address: location?.address,
      customerAddressTypeId: null,
      lat: location?.center?.lat,
      lng: location?.center?.lng,
      addressDetail: location?.address,
      note: null,
    };
  };

  const onSelectLocation = (location) => {
    if (location) {
      setIsVisibleModalDeliveryTo(false);
      getNearestStoreBranches(location);

      const locationAddress = mappingLocationToCustomerAddress(location);
      saveOrderTypeToRedux(enumOrderType.ONLINE_DELIVERY);
      setCustomerAddress(locationAddress);
    }
  };

  const openDialogSelectReceiverAddress = () => {
    setIsVisibleModalDeliveryTo(true);
    saveOrderTypeToRedux(enumOrderType.ONLINE_DELIVERY);
  };

  const getNearestStoreBranches = async (location) => {
    if (location) {
      const res = await branchDataService.getBranchesByCustomerAddressAsync(
        location?.center?.lat,
        location?.center?.lng,
        false,
      );
      if (res) {
        const branchesByCustomerAddress = res?.data?.branchesByCustomerAddress;
        dispatch(setNearestStoreBranches(branchesByCustomerAddress));
        onAutoPickNearestBranchAddress(branchesByCustomerAddress);
      }
    }
  };

  const onSelectCustomerAddress = (customerAddress) => {
    if (customerAddress) {
      autoCompleteRef?.current?.setAddress(customerAddress?.address); // set address search field value
      const location = {
        address: customerAddress?.address,
        center: {
          lat: customerAddress?.lat,
          lng: customerAddress?.lng,
        },
      };
      getNearestStoreBranches(location);
      setCustomerAddress(customerAddress);
      setIsVisibleModalDeliveryTo(false);
    }
  };

  const onAutoPickNearestBranchAddress = (branchesByCustomerAddress) => {
    storeBranchAddressSelectorRef?.current?.setAutoPickStoreBranchAddress(branchesByCustomerAddress);
  };

  const onClearCustomerAddress = () => {
    if (customerAddress && deliveryAddress) {
      setCustomerAddress(null);
      const currentDeliveryAddress = {
        ...deliveryAddress,
        branchAddress: deliveryAddress?.branchAddress,
        receiverAddress: null,
      };
      dispatch(setDeliveryAddress(currentDeliveryAddress));
    }
  };

  const getCurrentDefaultAddress = async () => {
    if (!deliveryAddress?.receiverAddress) {
      const res = await branchDataService.getBranchesByCustomerAddressAsync(0, 0, true);
      if (res) {
        const branchesByCustomerAddress = res?.data?.branchesByCustomerAddress;
        dispatch(setNearestStoreBranches(branchesByCustomerAddress));
        onAutoPickNearestBranchAddress(branchesByCustomerAddress);
      }
    }
  };

  function changeTabsDeliveryMethod() {
    const currentDeliveryAddress = {
      ...deliveryAddress,
      receiverAddress: deliveryAddress?.receiverAddress,
      branchAddress: branchSelected,
    };
    dispatch(setDeliveryAddress(currentDeliveryAddress));
    saveOrderTypeToRedux(enumOrderType.ONLINE_DELIVERY);
  }

  function changeTabsPickupMethod() {
    setOpenStoreBranchAddressSelector(true);
    setIsVisibleModalDeliveryTo(false);
    const currentDeliveryAddress = {
      ...deliveryAddress,
      receiverAddress: deliveryAddress?.receiverAddress,
      branchAddress: branchSelected,
    };
    dispatch(setDeliveryAddress(currentDeliveryAddress));
    saveOrderTypeToRedux(enumOrderType.PICK_UP);
    if (!deliveryAddress?.branchAddress && !deliveryAddress?.receiverAddress) {
      getCurrentDefaultAddress();
    }
  }

  function saveOrderTypeToRedux(type) {
    const currentDeliveryAddress = {
      ...deliveryAddress,
      orderType: type,
    };
    dispatch(setDeliveryAddress(currentDeliveryAddress));
  }

  const renderModalDeliveryToContent = (deliveryAddress) => {
    return (
      <>
        <div className="header-container-parent">
          <div
            onClick={changeTabsDeliveryMethod}
            className="header-container header-container-child-first"
            style={{
              background: colorGroupFirstDefault?.buttonBackgroundColor,
              height: 92,
              marginTop: "none",
            }}
          >
            <div className="header-tab-first">
              <IconAddressDeliveryCustomize />
              <span className="header-text" style={{ color: colorGroupFirstDefault?.buttonTextColor }}>
                {translatedData.delivery}
              </span>
            </div>
          </div>
          <div
            onClick={changeTabsPickupMethod}
            className="header-container header-container-child-second"
            style={{
              background: "rgba(196, 196, 196, 1)",
              height: 68,
              marginTop: 24,
            }}
          >
            <div className="header-tab-first">
              <IconPickupCustomize />
              <span className="header-text" style={{ color: "rgba(77, 77, 77, 1)" }}>
                {translatedData.toPickup}
              </span>
            </div>
          </div>
        </div>

        <div
          className="body-container"
          style={{ borderRadius: hasCustomerAddresses && addressList?.length > 0 ? "none" : "0 0 20px 20px" }}
        >
          <PlacesAutocompleteComponent
            placeholder={"Please enter your address"}
            onSelectLocation={(location) => onSelectLocation(location)}
            onEmptyLocation={onClearCustomerAddress}
            initAddress={customerAddress?.address}
            ref={autoCompleteRef}
          />
        </div>

        {/* Customer address list */}
        {addressList?.length > 0 && hasCustomerAddresses && (
          <CustomerAddresses
            addressList={addressList}
            ref={customerAddressRef}
            setCustomerAddress={(address) => onSelectCustomerAddress(address)}
          />
        )}
      </>
    );
  };

  const onSelectStoreBranchAddress = (storeBranch, isSelectNewBranch) => {
    setBranchSelected(storeBranch);
    if (isSelectNewBranch) {
      setTimeout(() => {
        setOpenStoreBranchAddressSelector(false);
      }, 500);
    }
  };

  const verifyStoreCart = (storeBranchSelected) => {
    /// call this function only one time after store branch has been changed
    if (window.verifyStoreCart) {
      clearTimeout(window.verifyStoreCart);
    }
    window.verifyStoreCart = setTimeout(async () => {
      const branchId = storeBranchSelected.id;
      const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
      const storeConfig = JSON.parse(jsonConfig);
      const storeId = storeConfig.storeId;
      const response = await shoppingCartService.verifyProductInShoppingCartAsync(
        storeId,
        branchId,
        onDisplayItemWillRemoveFromCart,
      );
      setStoreCartAfterChangeBranch(response?.newStoreCart);
    }, 100);
  };

  const onDisplayItemWillRemoveFromCart = (itemsWillRemove) => {
    setItemsWillRemove(itemsWillRemove);
  };

  const updateCartAfterChangeBranch = () => {
    shoppingCartService.setStoreCartLocalStorage(storeCartAfterChangeBranch);
    setItemsWillRemove(null);
  };

  const ShoppingCartWarningContent = () => {
    const text = t(translatedData.shoppingCartItemBelongToBranchWarning, {
      branchName: branchSelected?.title,
    });
    return (
      <>
        <span className="text" dangerouslySetInnerHTML={{ __html: text }}></span>
      </>
    );
  };

  // sync shopping cart local storage and redux
  const onSyncShoppingCart = () => {
    const storeCart = getStorage(localStorageKeys.STORE_CART);
    let objectStoreCart = JSON.parse(storeCart);
    dispatch(setCartItems(objectStoreCart));
  };

  const handleOpenDialogSelectBranchAddress = () => {
    setReloadLocationEvent(!reloadLocationEvent);
    deliveryAddress?.orderType === enumOrderType.PICK_UP ? changeTabsPickupMethod() : openDialogSelectReceiverAddress();
  };

  const hanldeChangeTabDeliveryMethod = () => {
    deliveryAddress?.orderType === enumOrderType.PICK_UP ? changeTabsPickupMethod() : openDialogSelectReceiverAddress();
    setOpenStoreBranchAddressSelector(false);
    setOpenDeliveryAddessDetail(false);
    openDialogSelectReceiverAddress();
  };

  const ReceiverAddressSelectorDialog = () => {
    return (
      <Modal
        className={`modal-delivery-address-selector-theme2  ${
          hasCustomerAddresses === true && addressList?.length > 0 && "login"
        }`}
        width={800}
        open={isVisibleModalDeliveryTo}
        onCancel={() => {
          setIsVisibleModalDeliveryTo(false);
        }}
        footer={(null, null)}
        centered
        forceRender={true}
        destroyOnClose={true}
        closeIcon
        style={{ fontFamily: fontFamily }}
      >
        {renderModalDeliveryToContent(deliveryAddress)}
      </Modal>
    );
  };

  return (
    <div>
      <ConfirmationDialog
        className="shopping-cart-warning-dialog-2"
        open={itemsWillRemove && itemsWillRemove?.length > 0}
        content={
          <div className="shopping-cart-warning-content">
            <ShoppingCartWarningContent />
          </div>
        }
        footer={
          <Button
            type="button"
            className="btn-shopping-cart-warning-continue"
            onClick={() => updateCartAfterChangeBranch()}
          >
            {translatedData.continue}
          </Button>
        }
        afterClose={() => onSyncShoppingCart()}
      />

      <div
        className="receiver-address-select-button"
        style={{ display: "none" }}
        onClick={hanldeChangeTabDeliveryMethod}
      ></div>

      <div
        className="receiver-address-select-button-from-checkout"
        style={{ display: "none" }}
        onClick={() => {
          setIsVisibleModalDeliveryTo(true);
        }}
      ></div>

      <div className="delivery-address-selector-theme2">
        <div className="delivery-address-header-box">
          <div className="left-box" onClick={handleOpenDialogSelectBranchAddress}>
            <div className="img-box ">
              {(deliveryAddress?.orderType == enumOrderType.ONLINE_DELIVERY ||
                deliveryAddress?.orderType == undefined) && <DeliveryHeaderIcon />}
              {deliveryAddress?.orderType == enumOrderType.PICK_UP && <IconPickupCustomize />}
            </div>
          </div>
          <div className="middle-box select-branch-dialog-class" onClick={handleOpenDialogSelectBranchAddress}>
            <span className="text-delivery-to" style={{ color: groupColorConfig?.titleColor ?? "#FFF" }}>
              {(deliveryAddress?.orderType == enumOrderType.ONLINE_DELIVERY ||
                deliveryAddress?.orderType == undefined) &&
                translatedData.delivery}
              {deliveryAddress?.orderType == enumOrderType.PICK_UP && translatedData.toPickup}
            </span>
            <div className="text-delivery-address" style={{ color: groupColorConfig?.titleColor ?? "#FFF" }}>
              <span style={{ color: groupColorConfig?.titleColor ?? "#FFF" }}>
                {deliveryAddress?.orderType == enumOrderType.ONLINE_DELIVERY || deliveryAddress?.orderType == undefined
                  ? customerAddress?.address ?? translatedData.chooseAddress
                  : branchSelected?.addressDetail}
              </span>
            </div>
          </div>

          {deliveryAddress?.orderType !== enumOrderType.PICK_UP && (
            <DeliveryAddessDetail
              onClick={openDeliveryAddessDetail}
              onClose={() => setOpenDeliveryAddessDetail(false)}
              onClickDropDown={() => setOpenDeliveryAddessDetail(!openDeliveryAddessDetail)}
              selectedAddress={customerAddress}
              openDialogSelectReceiverAddress={openDialogSelectReceiverAddress}
              openDialogSelectStoreBranchAddress={() => {
                setOpenBranchAddressSelector(true);
              }}
              openDialogSelectTypeAndBranch={() => {
                setOpenStoreBranchAddressSelector(true);
              }}
              branchSelected={branchSelected}
            />
          )}
        </div>
      </div>

      <ReceiverAddressSelectorDialog />

      <StoreBranchAddressSelector
        ref={storeBranchAddressSelectorRef}
        open={openStoreBranchAddressSelector}
        initStoreBranchData={deliveryAddress?.branchAddress}
        onSelected={(branch, isSelectNewBranch) => {
          onSelectStoreBranchAddress(branch, isSelectNewBranch);
        }}
        onClose={() => setOpenStoreBranchAddressSelector(false)}
      />

      <BranchAddressSelector
        ref={storeBranchAddressSelectorRef}
        open={openBranchAddressSelector}
        initStoreBranchData={deliveryAddress?.branchAddress}
        onSelected={(branch, isSelectNewBranch) => {
          onSelectStoreBranchAddress(branch, isSelectNewBranch);
        }}
        onClose={() => setOpenBranchAddressSelector(false)}
      />
    </div>
  );
});
