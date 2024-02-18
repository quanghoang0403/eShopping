import { Image } from "antd";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import accountDataService from "../../../../../data-services/account-data-service";
import loginDataService from "../../../../../data-services/login-data.service";
import { getStorage, localStorageKeys } from "../../../../../utils/localStorage.helpers";
import { ArrowLeftIcon } from "../../../../assets/icons.constants";
import AddEditAddressModal from "./components/add-edit-address-modal.component";
import DeleteAddressModal from "./components/delete-address-modal.component";

import { EnumCustomerAddressType } from "../../../../constants/enums";
import "./address-list.component.scss";
import { useAppCtx } from "../../../../../providers/app.provider";

export default function AddressListTheme1(props) {
  const { handleClickTitle } = props;
  const [t] = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 740 });
  const { Toast } = useAppCtx();

  const [showAddEditAddress, setShowAddEditAddress] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [listAddressNames, setListAddressNames] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [disabledAddressTypes, setDisabledAddressTypes] = useState([]);

  const translateData = {
    addAddress: t("myProfile.addressList.addAddress", "Thêm địa chỉ"),
    noAddress: t("myProfile.addressList.noAddress", "Bạn hiện không có bất kỳ địa chỉ nào!!!"),
    pleaseClick: t("myProfile.addressList.pleaseClick", "Vui lòng bấm"),
    toAddANew: t("myProfile.addressList.toAddANew", "để thêm địa chỉ mới"),
    addressList: t("myProfile.addressList.title", "Danh sách địa chỉ"),
    deleteModal: {
      title: t("", "Confirmation"),
      content: t("", "Do you want to delete this address?"),
      btnConfirm: t("", "Confirm"),
      btnCancel: t("", "Ignore"),
      successMessage: t("", "Delete successfully"),
      failedMessage: t("", "Delete failed"),
    },
    homeLabel: t("myProfile.addressList.homeLabel", "Nhà riêng"),
    workLabel: t("myProfile.addressList.workLabel", "Văn phòng"),
    defaultLabel: t("myProfile.addressList.defaultLabel", "Mặc định"),
    setDefault: t("myProfile.addressList.setDefault", "Thiết lập mặc định"),
    editAddress: t("myProfile.addressList.editAddress", "Chỉnh sửa"),
    deleteAddress: t("myProfile.addressList.deleteAddress", "Xóa"),
  };

  useEffect(() => {
    getListAddress();
  }, []);

  useEffect(() => {
    if (showAddEditAddress) {
      getListAddress();
    }
  }, [showAddEditAddress]);

  const getListAddress = () => {
    const token = getStorage(localStorageKeys.TOKEN);
    const decoded_token = token && jwt_decode(token);
    handleGetAddressList(decoded_token?.ACCOUNT_ID);
  };

  const onEditAddress = (address) => {
    setSelectedAddress(address);
    setShowAddEditAddress(true);
  };

  const onAddAddress = () => {
    setShowAddEditAddress(true);
  };

  const handleDeleteAddress = async (addressId) => {
    let customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
    const req = {
      numberPhone: customerInfo?.phoneNumber,
      accountAddressId: addressId,
    };
    const res = await accountDataService.deleteAccountAddressByIdAsync(req);
    if (res) {
      getListAddress();
      Toast.success({
        message: translateData.deleteModal.successMessage,
        placement: "top",
      });
    } else {
      Toast.error({
        message: translateData.deleteModal.failedMessage,
        placement: "top",
      });
    }
    setSelectedAddress(null);
    setShowConfirmDelete(false);
  };

  const onDeleteAddress = (addressId) => {
    setSelectedAddress(addressId);
    setShowConfirmDelete(true);
  };

  const handleGetAddressList = async (accountId) => {
    const storeConfig = JSON.parse(getStorage(localStorageKeys.STORE_CONFIG));
    const result = await loginDataService.getAddressListByAccountIdAsync(accountId, storeConfig?.storeId);
    if (result) {
      let addressList = result?.data?.accountAddress;
      const existHomeWork = addressList?.filter((x) => x.customerAddressTypeId >= 0);
      setDisabledAddressTypes([...existHomeWork.map((x) => x.customerAddressTypeId)]);
      setAddressList(result?.data?.accountAddress);
      setListAddressNames(result?.data?.accountAddress.map((x) => x.name));
    }
  };

  const handleSetDefault = async (id) => {
    const responseUpdate = await accountDataService.updateDefaultAccountAddressAsync({
      accountAddressId: id,
      isDefault: true,
    });
    if(responseUpdate.data?.isSuccess) {
      getListAddress();
    }
  };

  return (
    <div className="address-list-theme1">
      <div className="address-header">
        {isMobile ? (
          <a onClick={() => handleClickTitle()} className="arrow-left-title">
            <ArrowLeftIcon /> {translateData.addressList}
          </a>
        ) : (
          <h3 className="address-header-title">{translateData.addressList}</h3>
        )}
        <a className="add-address-btn user-select-none" role={"button"} onClick={() => setShowAddEditAddress(true)}>
          {translateData.addAddress}
        </a>
      </div>
      {addressList && addressList?.length > 0 ? (
        <div className="address-content">
          {addressList?.map((item, index) => {
            return (
              <>
                <div key={index} className="address-table-item">
                  <div className="address-item">
                    <div className="address-name-type">
                      <span className="text-line-clamp-2">{item?.name}</span>
                      {item?.customerAddressTypeId == EnumCustomerAddressType.Home && (
                        <span className="home-lable">{translateData.homeLabel}</span>
                      )}
                      {item?.customerAddressTypeId == EnumCustomerAddressType.Work && (
                        <span className="work-lable">{translateData.workLabel}</span>
                      )}
                      {item?.isDefault && (
                        <span className="default-lable">{translateData.defaultLabel}</span>
                      )}
                    </div>
                    <div className="address-name text-line-clamp-2">{item?.address}</div>
                  </div>
                  <div className="address-navigation">
                    <a onClick={() => handleSetDefault(item?.id)}>
                      {!item?.isDefault && translateData.setDefault}
                    </a>
                    <a onClick={() => onEditAddress(item)}>{translateData.editAddress}</a>
                    <a onClick={() => onDeleteAddress(item?.id)}>{translateData.deleteAddress}</a>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <div className="no-address-content">
          <p>
            {translateData.noAddress}
            <br />
            {translateData.pleaseClick}{" "}
            <a role={"button"} onClick={() => onAddAddress()} className="user-select-none">
              {translateData.addAddress}
            </a>{" "}
            {translateData.toAddANew}
          </p>
          <Image preview={false} src="/images/default-theme/no-address.png" />
        </div>
      )}
      {showAddEditAddress ? (
        <AddEditAddressModal
          setCurrentAddress={() => selectedAddress}
          disabledAddressTypes={disabledAddressTypes}
          currentAddressNames={listAddressNames}
          visible={true}
          onClosed={() => {
            setShowAddEditAddress(false);
            setSelectedAddress(null);
          }}
          t={t}
          getListAddress={getListAddress}
        />
      ) : null}
      <DeleteAddressModal
        open={showConfirmDelete}
        title={translateData.deleteModal.title}
        onOk={() => handleDeleteAddress(selectedAddress)}
        okText={translateData.deleteModal.btnConfirm}
        onCancel={() => setShowConfirmDelete(false)}
        cancelText={translateData.deleteModal.btnCancel}
        content={translateData.deleteModal.content}
      />
    </div>
  );
}
