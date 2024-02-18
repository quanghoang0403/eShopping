import { Button, Form, message } from "antd";
import jwt_decode from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import accountDataService from "../../../../../../data-services/account-data-service";
import { isEmptyObject } from "../../../../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../../../../utils/localStorage.helpers";
import { GooglePlacesAutocompleteInput } from "../../../../../components/fnb-google-map/google-map-address-input.component";
import { GoogleMapComponent } from "../../../../../components/fnb-google-map/google-map.component";
import { FnbInput } from "../../../../../components/fnb-input/fnb-input.component";
import { EnumCustomerAddressType } from "../../../../../constants/enum";
import "./add-edit-address-modal.component.scss";
import { useAppCtx } from "../../../../../../providers/app.provider";

export default function AddEditAddressModal(props) {
  const { visible, onClosed, t, currentAddressNames = [], currentAddress, disabledAddressTypes } = props;

  const [form] = Form.useForm();
  const [selectedAddressType, setSelectedAddressType] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { Toast } = useAppCtx();

  const googleMapInputRef = useRef();
  const googleMapRef = useRef();

  const translateData = {
    formTitle: currentAddress
      ? t("text.editAddressForm.title", "EDIT ADDRESS")
      : t("text.addNewAddressForm.title", "ADD NEW ADDRESS"),
    addressType: t("text.addNewAddressForm.addressType", "Address type"),
    home: t("text.home", "Home"),
    work: t("text.work", "Work"),
    name: t("text.addNewAddressForm.name", "Name"),
    nameExample: t("text.addNewAddressForm.nameExample", "E.g. School, Gym, etc..."),
    enterYourAddressName: t("text.addNewAddressForm.enterYourAddressName", "Enter your address name"),
    pleaseEnterAddressName: t("text.addNewAddressForm.pleaseEnterAddressName", "Please enter address name"),
    theAddressNameIsExistedAlready: t(
      "text.addNewAddressForm.theAddressNameIsExistedAlready",
      "The address name is existed already"
    ),
    address: t("text.addNewAddressForm.address", "Address"),
    addressPlaceholder: t("text.addNewAddressForm.deliverTo", "Deliver to"),
    addressLocationNotFound: t("text.addNewAddressForm.addressLocationNotFound", "Can't find your location on map"),
    pleaseSelectAddress: t("text.addNewAddressForm.pleaseEnterAddress", "Please enter address"),
    addressDetail: t("text.addNewAddressForm.addressDetail", "Address detail"),
    addressDetailExample: t("text.addNewAddressForm.addressDetailExample", "E.g. Block, floor, unit number, etc..."),
    note: t("text.addNewAddressForm.note", "Note"),
    noteExample: t("text.addNewAddressForm.noteExample", "E.g. Delivery at the lobby"),
    maximum100Characters: t("text.addNewAddressForm.maximum100Characters", "Maximum 100 characters"),
    btnSaveAddress: t("text.addNewAddressForm.btnSaveAddress", "Update"),
    btnCancel: t("text.addNewAddressForm.btnCancel", "Cancel"),
    updateSuccess: t("storeWebPage.profilePage.updateSuccess", "Cập nhật thành công!"),
    updateFailed: t("messages.updateFailed", "Update Failed "),
    createAddressSuccess: t("messages.createAddressSuccess", "Address is added successful"),
    createdFailed: t("messages.createdFailed", "Create Failed"),
  };

  useEffect(() => {
    const formData = getInitFormData();
    form.setFieldsValue(formData);
    setSelectedAddressType(formData?.addressTypeId);
    if (currentAddress) {
      setSelectedAddress({ center: { lat: formData.lat, lng: formData.lng }, address: formData.address });
      let addressTypeInput = document.getElementById(`address-type_${formData.addressTypeId}`);
      if (addressTypeInput) {
        addressTypeInput.checked = true;
      }
      googleMapRef.current.setCenter({ lat: currentAddress.lat, lng: currentAddress.lng });
    } else {
    }
    if (disabledAddressTypes?.length > 0) {
      handleDisabledAddressTypes();
    }

    const metaViewport = document.querySelector('meta[name="viewport"]');
    if(metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
    }

    return () => {
      if(metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
      }
    };
  }, []);

  useEffect(() => {
    if (selectedAddressType !== null) {
      form.setFieldValue(
        "name",
        Object.keys(EnumCustomerAddressType).find((k) => EnumCustomerAddressType[k] == selectedAddressType)
      );
      form.validateFields().catch((errorInfo) => {
        form.setFields([
          {
            name: "address",
            errors: [],
          },
        ]);
      });
    } else {
      if (currentAddress == null) {
        form.setFieldValue("name", "");
      } else {
        form.setFieldValue("name", currentAddress?.name);
      }
    }
  }, [form, selectedAddressType]);

  useEffect(() => {
    form.setFieldValue("address", selectedAddress?.address);
    onFieldsValid();
  }, [form, selectedAddress]);

  //#region Events

  const onCheckAddressType = (e) => {
    const value = e.target.value;
    if (value == selectedAddressType) {
      e.target.checked = false;
      setSelectedAddressType(null);
      return;
    } else {
      e.target.checked = true;
    }
    setSelectedAddressType(parseInt(value));
  };

  const onFormSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const token = getStorage(localStorageKeys.TOKEN);
        const decoded_token = token && jwt_decode(token);
        values.accountId = decoded_token?.ACCOUNT_ID;
        values.customerAddressTypeId = selectedAddressType;
        values.lat = selectedAddress?.center?.lat;
        values.lng = selectedAddress?.center?.lng;
        values.numberPhone = JSON.parse(getStorage("login"))?.phone;
        values.storeId = JSON.parse(getStorage("config")).storeId;
        //Update
        if (currentAddress) {
          values.accountAddressId = currentAddress.id;
          const res = await accountDataService.updateAccountAddressByIdAsync(values);
          if (res) {
            Toast.success({
              message: translateData.updateSuccess,
              placement: "top",
            });
          } else {
            Toast.error({
              message: translateData.updateFailed,
              placement: "top",
            });
          }
        }
        //Add new
        else {
          const res = await accountDataService.createAccountAddressAsync(values);
          if (res) {
            Toast.success({
              message: translateData.createAddressSuccess,
              placement: "top",
            });
            resetState();
            onClosed();
          } else {
            Toast.error({
              message: translateData.createdFailed,
              placement: "top",
            });
          }
        }
        resetState();
        onClosed();
      })
      .catch((errorInfo) => {
        const address = googleMapInputRef.current.getValue();
        const isNotSelectAddress = address !== "" && (isEmptyObject(selectedAddress) || selectedAddress === "");
        if (isNotSelectAddress) {
          form.setFields([
            {
              name: "address",
              errors: [translateData.addressLocationNotFound],
            },
          ]);
        }
      });
  };

  //#endregion

  //#region Functions

  const handleDisabledAddressTypes = () => {
    disabledAddressTypes.forEach((addressTypeId) => {
      document.getElementById(`address-type_${addressTypeId}`).disabled = true;
      let label = document.getElementById(`lb-address-type_${addressTypeId}`);
      label.style.color = "white";
      label.style.background = "#eda694";
    });
  };

  const getInitFormData = () => {
    let formData = {
      id: "",
      name: "",
      addressTypeId: null,
      address: "",
      addressDetail: "",
      note: "",
    };
    if (currentAddress) {
      formData.id = currentAddress?.id;
      formData.addressTypeId =
        currentAddress?.customerAddressTypeId >= 0 && currentAddress?.customerAddressTypeId < 2? currentAddress?.customerAddressTypeId : null;
      formData.name = currentAddress?.name;
      formData.address = currentAddress?.address;
      formData.addressDetail = currentAddress?.addressDetail;
      formData.note = currentAddress?.note;
    }
    return formData;
  };

  const resetState = () => {
    setSelectedAddress("");
    setSelectedAddressType(null);
    form.resetFields();
  };

  const mapAddressType = (value) => {
    switch (value) {
      case 1:
        return translateData.work;
      default:
        return translateData.home;
    }
  };

  const isSameName = (name) => {
    if (currentAddress) {
      return (
        currentAddressNames?.map((x) => x.toLowerCase()).indexOf(name.toLowerCase()) >= 0 &&
        name.toLowerCase() !== currentAddress.name.toLowerCase()
      );
    } else {
      return currentAddressNames?.map((x) => x.toLowerCase()).indexOf(name.toLowerCase()) >= 0;
    }
  };

  const onSelectLocation = (location) => {
    googleMapRef.current.setCenter(location.center);
    setSelectedAddress(location);
    form.setFieldValue("address", location.address);
    form.validateFields();
  };

  const onFieldsValid = (addressname) => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    const name = form.getFieldValue("name") ?? addressname;
    const rs = hasErrors === false && selectedAddress && name.length > 0;
    setIsFormValid(rs);
  };

  //#endregion

  //#region Render Components

  const renderAddressTypes = () => {
    return Object.entries(EnumCustomerAddressType).map((x) => {
      return (
        <>
          <input
            key={x[0]}
            type="radio"
            id={`address-type_${x[1]}`}
            name="address-type"
            value={x[1]}
            onClick={(e) => onCheckAddressType(e)}
          />
          <label id={`lb-address-type_${x[1]}`} htmlFor={`address-type_${x[1]}`}>
            {mapAddressType(x[1])}
          </label>
        </>
      );
    });
  };

  //#endregion

  return (
    <>
      {visible ? (
        <div className="upsert-modal-overlay" scroll="no" style={{ overflow: "hidden" }}>
          <div className="upsert-modal">
            <div className="modal-header">{translateData.formTitle}</div>

            <div className="modal-body">
              <Form form={form} style={{ width: "100%" }} autoComplete="off">
                {/* ADDRESS TYPE */}
                <div className="row row-first">
                  <div className="col-3">
                    <h2 className="fnb-form-label">{translateData.addressType}</h2>
                  </div>
                  <div className="col-9">
                    <div className="radio-toolbar">{renderAddressTypes()}</div>
                  </div>
                </div>

                {/* ADDRESS NAME */}
                <div className="row">
                  <div className="col-3">
                    <h2 className="fnb-form-label ant-lable-mt">{translateData.name}</h2>
                  </div>
                  <div className="col-9">
                    <Form.Item
                      name={"name"}
                      rules={[
                        {
                          required: true,
                          message: translateData.pleaseEnterAddressName,
                        },
                        {
                          type: "string",
                          max: 100,
                          message: translateData.maximum100Characters,
                        },
                        {
                          validator(rule, value) {
                            if (isSameName(value)) {
                              return Promise.reject(new Error(translateData.theAddressNameIsExistedAlready));
                            } else {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                    >
                      <FnbInput
                        maxLength={101}
                        placeholder={translateData.enterYourAddressName}
                        disabled={selectedAddressType !== null}
                        onChange={(e) => onFieldsValid(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                </div>

                {/* MAP */}
                <div className="row map-select-input row-address">
                  <div className="col-3">
                    <h2 className="fnb-form-label ant-lable-mt">{translateData.address}</h2>
                  </div>
                  <div className="col-9 address">
                    <Form.Item
                      name={"address"}
                      rules={[
                        {
                          required: true,
                          message: translateData.pleaseSelectAddress,
                        },
                      ]}
                    >
                      <GooglePlacesAutocompleteInput
                        initLocation={currentAddress?.address ?? ""}
                        ref={googleMapInputRef}
                        placeholder={translateData.addressPlaceholder}
                        onSelectLocation={(location) => {
                          onSelectLocation(location);
                          form.setFields([
                            {
                              name: "address",
                              errors: [],
                            },
                          ]);
                        }}
                        onEmptyLocation={() => {
                          setSelectedAddress("");
                          form.setFields([
                            {
                              name: "address",
                              errors: [translateData.pleaseSelectAddress],
                            },
                          ]);
                        }}
                        onErrorDataLocation={() => {
                          form.setFields([
                            {
                              name: "address",
                              errors: [translateData.addressLocationNotFound],
                            },
                          ]);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="row gg-map">
                  <GoogleMapComponent ref={googleMapRef} className="google-map-box" />
                </div>

                {/* ADDRESS DETAIL */}
                <div className="row">
                  <div className="col-3">
                    <h2 className="fnb-form-label ant-lable-mt">{translateData.addressDetail}</h2>
                  </div>
                  <div className="col-9">
                    <Form.Item
                      name={"addressDetail"}
                      rules={[
                        {
                          type: "string",
                          max: 100,
                          message: translateData.maximum100Characters,
                        },
                      ]}
                    >
                      <FnbInput placeholder={`${translateData.addressDetailExample}`} maxLength={101} />
                    </Form.Item>
                  </div>
                </div>

                {/* NOTE */}
                <div className="row">
                  <div className="col-3">
                    <h2 className="fnb-form-label ant-lable-mt">{translateData.note}</h2>
                  </div>
                  <div className="col-9">
                    <Form.Item
                      name={"note"}
                      rules={[
                        {
                          type: "string",
                          max: 100,
                          message: translateData.maximum100Characters,
                        },
                      ]}
                    >
                      <FnbInput placeholder={`${translateData.noteExample}`} maxLength={101} />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>

            <div className="modal-footer">
              <Button
                onClick={() => {
                  form.resetFields();
                  resetState();
                  onClosed();
                }}
                className="btn"
              >
                {translateData.btnCancel}
              </Button>
              <Button
                onClick={() => {
                  if (!isSubmitting) {
                    setIsSubmitting(true);
                    onFormSubmit();
                  }
                }}
                className="btn btn-submit"
                disabled={!isFormValid || isSubmitting}
                style={{ background: isFormValid ? "" : "#eda694" }}
              >
                {translateData.btnSaveAddress}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
