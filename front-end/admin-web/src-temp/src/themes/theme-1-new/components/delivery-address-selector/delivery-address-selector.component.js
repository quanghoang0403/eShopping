import { Modal } from "antd";
import jwt_decode from "jwt-decode";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import branchDataService from "../../../data-services/branch-data.services";
import loginDataService from "../../../data-services/login-data.service";
import { setCartItems, setDeliveryAddress, setNearestStoreBranches } from "../../../modules/session/session.actions";
import shoppingCartService from "../../../services/shopping-cart/shopping-cart.service";
import { getStorage, localStorageKeys } from "../../../utils/localStorage.helpers";
import { enumOrderType } from "../../constants/enums";
import ConfirmationDialog from "../confirmation-dialog/confirmation-dialog.component";
import { CustomerAddresses } from "../customer-address/customer-address.component";
import { StoreBranchAddressSelector } from "./../store-branch-address-selector/store-branch-address-selector.component";
import "./delivery-address-selector.style.scss";
import { ReactComponent as LocationIcon } from "./location-icon.svg";
import { PlacesAutocompleteComponent } from "./places-autocomplete/places-autocomplete.component";
import { ReactComponent as StoreIcon } from "./store-icon.svg";

export const DeliveryAddressSelectorComponent = forwardRef((props, ref) => {
  const { colorGroup, config } = props;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const autoCompleteRef = useRef();
  const storeBranchAddressSelectorRef = useRef();
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const [isVisibleModalDeliveryTo, setIsVisibleModalDeliveryTo] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [hasCustomerAddresses, setHasCustomerAddresses] = useState(false); // TODO: check login token
  const [openStoreBranchAddressSelector, setOpenStoreBranchAddressSelector] = useState(false);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [storeBranchSelected, setStoreBranchSelected] = useState(null);
  const [itemsWillRemove, setItemsWillRemove] = useState(null);
  const [storeCartAfterChangeBranch, setStoreCartAfterChangeBranch] = useState([]);
  const [groupColorConfig, setGroupColorConfig] = useState();
  const [currentOrderType, setCurrentOrderType] = useState(deliveryAddress?.orderType ?? enumOrderType.ONLINE_DELIVERY);
  const isMaxWidth576 = useMediaQuery({ maxWidth: 576 });
  const translatedData = {
    deliveryTo: t("addUserLocation.deliveryTo", "Giao đến"),
    pickUp: t("addUserLocation.pickUp", "Tự lấy hàng"),
    pleaseSelectAddress: t("addUserLocation.pleaseSelectAddress", "Vui lòng cho chúng tôi biết địa chỉ của bạn"),
    selectStoreBranch: t("addUserLocation.selectStoreBranch", "Chọn chi nhánh"),
    autoCompletePlaceholder: t("addUserLocation.autoCompletePlaceholder", "Nhập địa chỉ giao hàng"),
    continue: t("button.continue", "Tiếp tục"),
    shoppingCartItemBelongToBranchWarning: t(
      "shoppingCartItemBelongToBranchWarning",
      `Giỏ hàng có những sản phẩm không thuộc chi nhánh <b>{{branchName}}</b>. <p>Những sản phẩm đó sẽ bị xóa khỏi giỏ hàng?</p>`,
    ),
  };

  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    const group = colorGroup?.[0];
    setGroupColorConfig(group);
    if (deliveryAddress) {
      setCustomerAddress(deliveryAddress?.receiverAddress);
      setStoreBranchSelected(deliveryAddress?.branchAddress ?? null);
    } else {
      getDefaultStoreBranch(true);
    }
    const token = getStorage(localStorageKeys.TOKEN);
    const decoded_token = token && jwt_decode(token);
    if (decoded_token) {
      getCustomerAddresses(decoded_token?.ACCOUNT_ID);
      setHasCustomerAddresses(true);
    } else {
      setHasCustomerAddresses(false);
    }
  }, []);

  useEffect(() => {
    setCurrentOrderType(deliveryAddress?.orderType ?? enumOrderType.ONLINE_DELIVERY);
  }, [deliveryAddress?.orderType]);

  useEffect(() => {
    if (customerAddress) {
      const currentDeliveryAddress = {
        ...deliveryAddress,
        branchAddress: deliveryAddress?.branchAddress,
        receiverAddress: customerAddress,
      };
      dispatch(setDeliveryAddress(currentDeliveryAddress));
    }
  }, [customerAddress]);

  useEffect(() => {
    if (deliveryAddress) {
      if (deliveryAddress?.branchAddress?.id?.toLowerCase() !== storeBranchSelected?.id?.toLowerCase()) {
        setStoreBranchSelected(deliveryAddress?.branchAddress);
      }
    }
  }, [deliveryAddress?.branchAddress]);

  useEffect(() => {
    if (storeBranchSelected) {
      const currentDeliveryAddress = {
        ...deliveryAddress,
        receiverAddress: deliveryAddress?.receiverAddress,
        branchAddress: storeBranchSelected,
      };
      dispatch(setDeliveryAddress(currentDeliveryAddress));
      verifyStoreCart(storeBranchSelected);
    }
  }, [storeBranchSelected]);

  const getCustomerAddresses = async (accountId) => {
    const storeConfig = JSON.parse(getStorage(localStorageKeys.STORE_CONFIG));
    const res = await loginDataService.getAddressListByAccountIdAsync(accountId, storeConfig?.storeId);
    if (res) {
      const accountAddress = res?.data?.accountAddress;
      setAddressList(accountAddress);
    }
  };

  const getNearestStoreBranches = async (location, isAutoPickBranch) => {
    if (location) {
      const lat = location?.center?.lat;
      const lng = location?.center?.lng;
      const res = await branchDataService.getBranchesByCustomerAddressAsync(lat, lng);
      if (res) {
        const branchesByCustomerAddress = res?.data?.branchesByCustomerAddress;
        dispatch(setNearestStoreBranches(branchesByCustomerAddress));
        if (isAutoPickBranch === true) {
          onAutoPickNearestBranchAddress(branchesByCustomerAddress);
        }
      }
    }
  };

  const getDefaultStoreBranch = async (isAutoPickBranch) => {
    const res = await branchDataService.getBranchesByCustomerAddressAsync(0, 0, true);
    if (res) {
      const branchesByCustomerAddress = res?.data?.branchesByCustomerAddress;
      dispatch(setNearestStoreBranches(branchesByCustomerAddress));
      // if (isAutoPickBranch === true) {
      //   onAutoPickNearestBranchAddress(branchesByCustomerAddress);
      // }
    }
  };

  const onSelectCustomerAddress = (customerAddress, isAutoPickBranch) => {
    if (customerAddress) {
      setIsVisibleModalDeliveryTo(false); // close modal
      autoCompleteRef?.current?.setAddress(customerAddress?.address); // set address search field value
      const location = {
        address: customerAddress?.address,
        center: {
          lat: customerAddress?.lat,
          lng: customerAddress?.lng,
        },
      };
      getNearestStoreBranches(location, isAutoPickBranch);
      setCustomerAddress(customerAddress);
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
      getNearestStoreBranches(location, true);

      const locationAddress = mappingLocationToCustomerAddress(location);
      setCustomerAddress(locationAddress);
    }
  };

  const openDialogSelectReceiverAddress = () => {
    const currentDeliveryAddress = {
      ...deliveryAddress,
      orderType: enumOrderType.ONLINE_DELIVERY,
    };
    dispatch(setDeliveryAddress(currentDeliveryAddress));
    setIsVisibleModalDeliveryTo(true);
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
      //getDefaultStoreBranch(true);
    }
  };

  const onSelectStoreBranchAddress = (storeBranch, isSelectNewBranch) => {
    setStoreBranchSelected(storeBranch);
    if (isSelectNewBranch === true) {
      setTimeout(() => {
        setOpenStoreBranchAddressSelector(false);
      }, 1000);
    }
  };

  const onAutoPickNearestBranchAddress = (branchesByCustomerAddress) => {
    storeBranchAddressSelectorRef?.current?.setAutoPickStoreBranchAddress(branchesByCustomerAddress);
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
    }, 0);
  };

  const updateCartAfterChangeBranch = () => {
    shoppingCartService.setStoreCartLocalStorage(storeCartAfterChangeBranch);
    setItemsWillRemove(null);
  };

  const onDisplayItemWillRemoveFromCart = (itemsWillRemove) => {
    setItemsWillRemove(itemsWillRemove);

    //itemsWillRemove
  };

  const ShoppingCartWarningContent = () => {
    const text = t(translatedData.shoppingCartItemBelongToBranchWarning, {
      branchName: storeBranchSelected?.title,
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

  // Select delivery type, save to delivery address redux
  function handleSelectType(type) {
    if (type !== deliveryAddress?.orderType) {
      setCurrentOrderType(type);
      const currentDeliveryAddress = {
        ...deliveryAddress,
        orderType: type,
      };
      dispatch(setDeliveryAddress(currentDeliveryAddress));
    }
    //Open select branch modal when choose pickup
    if (type === enumOrderType.PICK_UP) {
      if (customerAddress) {
        onSelectCustomerAddress(customerAddress, true);
      } else {
        getDefaultStoreBranch(true);
        setIsVisibleModalDeliveryTo(false);
      }
      setOpenStoreBranchAddressSelector(true);
    }
  }

  const ReceiverAddressSelectorDialog = () => {
    return (
      <Modal
        className={`modal-delivery-address-selector ${hasCustomerAddresses === true && "login"}`}
        width={918}
        open={isVisibleModalDeliveryTo}
        onCancel={() => setIsVisibleModalDeliveryTo(false)}
        footer={(null, null)}
        centered
        forceRender={true}
        destroyOnClose={true}
        closeIcon
        title={
          <div className="header-container">
            <div
              className="header-left"
              style={{
                backgroundColor:
                  currentOrderType === enumOrderType.ONLINE_DELIVERY
                    ? groupColorConfig?.buttonBackgroundColor
                    : "transparent",
              }}
              onClick={() => handleSelectType(enumOrderType.ONLINE_DELIVERY)}
            >
              <span
                className="header-text"
                style={{
                  color:
                    currentOrderType === enumOrderType.ONLINE_DELIVERY ? groupColorConfig?.buttonTextColor : "#fff",
                }}
              >
                {translatedData.deliveryTo}
              </span>
            </div>
            <div
              className="header-right"
              style={{
                backgroundColor:
                  currentOrderType === enumOrderType.PICK_UP ? groupColorConfig?.buttonBackgroundColor : "transparent",
              }}
              onClick={() => handleSelectType(enumOrderType.PICK_UP)}
            >
              <span
                className="header-text"
                style={{
                  color: currentOrderType === enumOrderType.PICK_UP ? groupColorConfig?.buttonTextColor : "#fff",
                }}
              >
                {translatedData.pickUp}
              </span>
            </div>
          </div>
        }
      >
        <div className="body-container">
          <PlacesAutocompleteComponent
            ref={autoCompleteRef}
            groupColorConfig={groupColorConfig}
            placeholder={translatedData.autoCompletePlaceholder}
            onSelectLocation={(location) => onSelectLocation(location)}
            onEmptyLocation={onClearCustomerAddress}
            initAddress={customerAddress?.address}
            maxLength={100}
          />
        </div>

        {/* Customer address list */}
        {hasCustomerAddresses && addressList?.length > 0 && (
          <CustomerAddresses
            addressList={addressList}
            setCustomerAddress={(address) => {
              onSelectCustomerAddress(address, true);
            }}
            groupColorConfig={groupColorConfig}
          />
        )}
      </Modal>
    );
  };

  return (
    <div>
      <ConfirmationDialog
        className="shopping-cart-warning-dialog"
        open={itemsWillRemove && itemsWillRemove?.length > 0}
        content={
          <div className="shopping-cart-warning-content">
            <ShoppingCartWarningContent />
          </div>
        }
        footer={
          <p className="btn-shopping-cart-warning-continue" onClick={() => updateCartAfterChangeBranch()}>
            {translatedData.continue}
          </p>
        }
        afterClose={() => onSyncShoppingCart()}
      />
      <div
        id="deliveryAddressSelector"
        style={{ marginTop: isMaxWidth576 ? 0 : 0 }}
        className={`delivery-address-selector ${
          window.showDeliveryAddressSelector ?? "delivery-address-selector-default-hide"
        }`}
      >
        <div className="delivery-address-header-box">
          <div className="middle-box">
            <div
              className="delivery-address-button receiver-address-select-button cursor-pointer"
              onClick={openDialogSelectReceiverAddress}
            >
              <LocationIcon />
              <span>{customerAddress?.address ?? translatedData.pleaseSelectAddress}</span>
            </div>
            <div
              className="delivery-address-button store-branch-address-select-button cursor-pointer delivery-address-button-bg"
              onClick={() => {
                if (deliveryAddress) {
                  onSelectCustomerAddress(customerAddress, false);
                  setOpenStoreBranchAddressSelector(true);
                  const currentDeliveryAddress = {
                    ...deliveryAddress,
                    orderType: enumOrderType.PICK_UP,
                  };
                  dispatch(setDeliveryAddress(currentDeliveryAddress));
                } else {
                  openDialogSelectReceiverAddress();
                }
              }}
            >
              <StoreIcon />
              <span>{storeBranchSelected?.title ?? translatedData.selectStoreBranch}</span>
            </div>
          </div>
        </div>
      </div>

      <ReceiverAddressSelectorDialog />

      <StoreBranchAddressSelector
        colorGroup={colorGroup}
        config={config}
        ref={storeBranchAddressSelectorRef}
        open={openStoreBranchAddressSelector}
        onSelected={(branch, isSelectNewBranch) => {
          onSelectStoreBranchAddress(branch, isSelectNewBranch);
        }}
        onClose={() => setOpenStoreBranchAddressSelector(false)}
        initStoreBranchData={storeBranchSelected}
        getDefaultStoreBranch={() => getDefaultStoreBranch(true)}
      />
    </div>
  );
});
