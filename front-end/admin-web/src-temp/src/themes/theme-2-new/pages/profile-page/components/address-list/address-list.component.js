import { Button } from "antd";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getStorage, localStorageKeys } from "../../../../../utils/localStorage.helpers";
import NoAddressFoundImg from "../../../../assets/images/my-profile-addresses-no-data.png";
import "./address-list.component.scss";
import AddEditAddressModal from "./components/add-edit-address-modal.component";
// import AddEditAddressModal from "./components/add-edit-address-modal.component";
import accountDataService from "../../../../../data-services/account-data-service";
import loginDataService from "../../../../../data-services/login-data.service";
import {
  HomeIcon,
  LocationAddressIcon,
  OfficeIcon,
  PencilIcon,
  TrashBinIcon,
} from "../../../../assets/icons.constants";
import { EnumCustomerAddressType } from "../../../../constants/enum";
import DeleteAddressModal from "./components/delete-address-modal.component";
import { LockMultipleCalls } from "../../../../../services/promotion.services";
import { useAppCtx } from "../../../../../providers/app.provider";
import { useDispatch, useSelector } from "react-redux";
import { setAddressList } from "../../../../../modules/session/session.actions";
import { userInfoSelector } from "../../../../../modules/session/session.reducers";

const HANDLE_GET_ADDRESS_LIST = "HANDLE_GET_ADDRESS_LIST"; // Lock multiple calls function key
export default function AddressListTheme2({ colorGroup }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const listAddress = useSelector(userInfoSelector)?.addressList;
  const [showAddEditAddress, setShowAddEditAddress] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [listAddressNames, setListAddressNames] = useState([]);
  const [disabledAddressTypes, setDisabledAddressTypes] = useState([]);
  const [isProcessingDeleteAddress, setIsProcessingDeleteAddress] = useState(false);
  const { Toast } = useAppCtx();

  const translateData = {
    youDoNotHaveAnyAddress: t(
      "storeWebPage.profilePage.youDoNotHaveAnyAddress",
      "You currently do not have any address!!!",
    ),
    pleaseClickToAddNew: t("storeWebPage.profilePage.pleaseClickToAddNew", "Please click Add address to add a new"),
    deleteModal: {
      title: t("", "Confirmation"),
      content: t("", "Do you want to delete this address?"),
      btnConfirm: t("", "Confirm"),
      btnCancel: t("", "Ignore"),
      successMessage: t("", "Delete successfully"),
      failedMessage: t("", "Delete failed"),
    },
    addAddress: t("storeWebPage.profilePage.addAddress", "Add address"),
    myAddress: t("storeWebPage.profilePage.myAddress"),
    addressList: t("storeWebPage.profilePage.addressList"),
    home: t("text.home", "Home"),
    work: t("text.work", "Work"),
    successMessage: t("storeWebPage.profilePage.successMessage"),
    deleteMessage: t("storeWebPage.profilePage.deleteMessage"),
    setDefault: t("storeWebPage.addressList.setDefault", "Thiết lập mặc định"),
    defaultLabel: t("storeWebPage.addressList.defaultLabel", "Mặc định"),
  };

  useEffect(() => {
    if (!showAddEditAddress) {
      setSelectedAddress(null);
    }
    LockMultipleCalls(() => handleGetAddressList(), HANDLE_GET_ADDRESS_LIST);
  }, [showAddEditAddress]);

  useEffect(() => {
    if (showAddEditAddress) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showAddEditAddress]);

  //#region Events

  const onEditAddress = (address) => {
    setSelectedAddress(address);
    setShowAddEditAddress(true);
  };

  const onAddAddress = () => {
    setShowAddEditAddress(true);
  };

  const onDeleteAddress = (address) => {
    setShowConfirmDelete(true);
    setSelectedAddress(address);
  };

  const HandleDeleteAddress = async () => {
    setIsProcessingDeleteAddress(true);
    const req = {
      numberPhone: JSON.parse(getStorage("login"))?.phone,
      accountAddressId: selectedAddress?.id,
    };
    var res = await accountDataService.deleteAccountAddressByIdAsync(req);
    if (res) {
      Toast.success({
        message: translateData.deleteMessage,
        placement: "top",
      });
    } else {
      Toast.error({
        message: translateData.deleteModal.failedMessage,
        placement: "top",
      });
    }
    setIsProcessingDeleteAddress(false);
    setSelectedAddress(null);
    setShowConfirmDelete(false);
    handleGetAddressList();
  };

  //#endregion

  //#region Funtions

  //#endregion

  //#region Render components
  const renderNoData = () => {
    return (
      <div className="no-data-found-container">
        <div className="no-data-found">
          <div>
            <img src={NoAddressFoundImg} alt="" />
          </div>
          <p>{translateData.youDoNotHaveAnyAddress}</p>
          <p>{translateData.pleaseClickToAddNew}</p>
        </div>
      </div>
    );
  };

  const handleGetAddressList = async () => {
    const storeConfig = JSON.parse(getStorage(localStorageKeys.STORE_CONFIG));
    const token = getStorage(localStorageKeys.TOKEN);
    const decoded_token = token && jwt_decode(token);
    var result = await loginDataService.getAddressListByAccountIdAsync(decoded_token?.ACCOUNT_ID, storeConfig?.storeId);
    if (result) {
      let addressList = result?.data?.accountAddress;
      const existHomeWork = addressList?.filter((x) => x.customerAddressTypeId >= 0 && x.customerAddressTypeId < 2);
      setDisabledAddressTypes([...existHomeWork.map((x) => x.customerAddressTypeId)]);
      dispatch(setAddressList(addressList));
      setListAddressNames(addressList?.map((x) => x.name));
    }
  };
  const handleSetDefault = async (id) => {
    const responseUpdate = await accountDataService.updateDefaultAccountAddressAsync({
      accountAddressId: id,
      isDefault: true,
    });
    if(responseUpdate.data?.isSuccess) {
      handleGetAddressList();
    }
  };

  const renderListAddress = () => {
    return (
      <div className="address-container">
        {listAddress?.map((item, index) => {
          return (
            <>
              <div key={index} className="address-table-item">
                <div className="address-item">
                  <div className="address-name-type">
                    {item?.customerAddressTypeId === EnumCustomerAddressType.Home ? (
                      <>
                        <div className="address-icon">
                          <HomeIcon />
                        </div>
                        <div className="address-info-container">
                          <div className="home-lable">{translateData.home}</div>
                          <div className="address-name">{item?.address}</div>
                          {item?.isDefault && (
                            <div className="default-lable">{translateData.defaultLabel}</div>
                          )}
                        </div>
                      </>
                    ) : item?.customerAddressTypeId === EnumCustomerAddressType.Work ? (
                      <>
                        <div className="address-icon">
                          <OfficeIcon />
                        </div>
                        <div className="address-info-container">
                          <div className="work-lable">{translateData.work}</div>
                          <div className="address-name">{item?.address}</div>
                          {item?.isDefault && (
                            <div className="default-lable">{translateData.defaultLabel}</div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="address-icon">
                          <LocationAddressIcon />
                        </div>
                        <div className="address-info-container">
                          <div className="address-label">{item?.name}</div>
                          <div className="address-name">{item?.address}</div>
                          {item?.isDefault && (
                            <div className="default-lable">{translateData.defaultLabel}</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="address-navigation">
                  <div>
                    <a href="javascript:void()" style={{ marginRight: 32 }}>
                      <PencilIcon onClick={() => onEditAddress(item)} />
                    </a>
                    <a href="javascript:void()">
                      <TrashBinIcon onClick={() => onDeleteAddress(item)} />
                    </a>
                  </div>

                  {!item?.isDefault && (
                    <a onClick={() => handleSetDefault(item?.id)} className="default-setting">
                      {translateData.setDefault}
                    </a>
                  )}
                </div>
              </div>
            </>
          );
        })}
      </div>
    );
  };
  //#endregion

  return (
    <div className="my-profile-address-list">
      <div className="header">
        <div className="address-card-title"> {translateData.addressList}</div>
        <Button
          className="btn-primary"
          style={{
            color: colorGroup?.buttonTextColor,
            backgroundColor: colorGroup?.buttonBackgroundColor,
            border: colorGroup?.buttonBorderColor + "1px solid",
            fontWeight: 600,
          }}
          onClick={() => onAddAddress()}
        >
          {translateData.addAddress}
        </Button>
      </div>
      <div className="content">{listAddress?.length === 0 ? renderNoData() : renderListAddress()}</div>
      {showAddEditAddress ? (
        <AddEditAddressModal
          currentAddress={selectedAddress}
          currentAddressNames={listAddressNames}
          visible={true}
          onClosed={() => setShowAddEditAddress(false)}
          disabledAddressTypes={disabledAddressTypes}
          t={t}
        />
      ) : null}

      <DeleteAddressModal
        open={showConfirmDelete}
        title={translateData.deleteModal.title}
        onOk={() => HandleDeleteAddress()}
        okText={translateData.deleteModal.btnConfirm}
        onCancel={() => setShowConfirmDelete(false)}
        cancelText={translateData.deleteModal.btnCancel}
        content={translateData.deleteModal.content}
        okButtonProps={{
          style: {
            color: colorGroup?.buttonTextColor,
            backgroundColor: colorGroup?.buttonBackgroundColor,
            border: colorGroup?.buttonBorderColor + "1px solid",
          },
          disabled: isProcessingDeleteAddress,
        }}
      />
    </div>
  );
}
