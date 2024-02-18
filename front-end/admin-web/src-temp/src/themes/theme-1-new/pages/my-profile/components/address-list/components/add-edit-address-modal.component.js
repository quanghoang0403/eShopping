import { Button, Form, Image, message } from "antd";
import jwt_decode from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import accountDataService from "../../../../../../data-services/account-data-service";
import { isEmptyObject } from "../../../../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../../../../utils/localStorage.helpers";
import { ArrowLeftIcon, IconWarning } from "../../../../../assets/icons.constants";
import SymbolsInfoRounded from "../../../../../assets/images/symbols_info-rounded.png";
import { GooglePlacesAutocompleteInput } from "../../../../../components/fnb-google-map/google-map-address-input.component";
import { GoogleMapComponent } from "../../../../../components/fnb-google-map/google-map.component";
import { FnbInput } from "../../../../../components/fnb-input/fnb-input.component";
import { EnumCustomerAddressType } from "../../../../../constants/enums";
import "./add-edit-address-modal.component.scss";
import { useAppCtx } from "../../../../../../providers/app.provider";

export default function AddEditAddressModal(props) {
  const { visible, onClosed, t, currentAddressNames = [], setCurrentAddress, disabledAddressTypes, getListAddress } = props;

  const [form] = Form.useForm();
  const [selectedAddressType, setSelectedAddressType] = useState(null);
  const [currentAddress, setCurrentAddess] = useState(setCurrentAddress() ?? null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddressNotFound, setIsAddressNotFound] = useState(false);

  const googleMapInputRef = useRef();
  const googleMapRef = useRef();
  const { Toast } = useAppCtx();

  const translateData = {
    formTitle: currentAddress
      ? t("text.editAddressForm.title", "Edit address")
      : t("text.addNewAddressForm.title", "Add new address"),
    addressType: t("text.addNewAddressForm.addressType", "Address type"),
    home: t("text.addNewAddressForm.home", "Home"),
    work: t("text.addNewAddressForm.work", "Work"),
    name: t("text.addNewAddressForm.name", "Name"),
    nameExample: t("text.addNewAddressForm.nameExample", "E.g. School, Gym, etc..."),
    pleaseEnterAddressName: t("text.addNewAddressForm.pleaseEnterAddressName", "Please enter address name"),
    theAddressNameIsExistedAlready: t(
      "text.addNewAddressForm.theAddressNameIsExistedAlready",
      "The address name is existed already",
    ),
    address: t("text.addNewAddressForm.deliverTo", "Deliver to"),
    pleaseSelectAddress: t("text.addNewAddressForm.pleaseSelectAddress", "Please select address"),
    addressLocationNotFound: t("text.addNewAddressForm.addressLocationNotFound", "Can't find your location on map"),
    enterYourAddressAgain: t("text.addNewAddressForm.enterYourAddressAgain"),
    addressDetail: t("text.addNewAddressForm.addressDetail", "Address detail"),
    addressDetailExample: t("text.addNewAddressForm.addressDetailExample", "E.g. Block, floor, unit number, etc..."),
    note: t("text.addNewAddressForm.note", "Note"),
    noteExample: t("text.addNewAddressForm.noteExample", "E.g. Delivery at the lobby"),
    maximum100Characters: t("text.addNewAddressForm.maximum100Characters", "Maximum 100 characters"),
    btnSaveAddress: t("text.addNewAddressForm.btnSaveAddress", "Save address"),
    btnComplete: t("text.editAddressForm.btnComplete", "Update"),
    btnBack: t("text.addNewAddressForm.btnBack", "Back"),
    updateSuccess: t("messages.updateSuccess", "Update Success "),
    updateFailed: t("messages.updateFailed", "Update Failed "),
    createAddressSuccess: t("messages.createAddressSuccess", "Address is added successful"),
    createdFailed: t("messages.createdFailed", "Create Failed"),
    enterYourAddressName: t("text.addNewAddressForm.enterYourAddressName", "Enter your address name"),
  };

  useEffect(() => {
    const formData = getInitFormData();
    form.setFieldsValue(formData);
    setSelectedAddressType(formData?.addressTypeId);

    if (currentAddress) {
      setSelectedAddress({
        center: { lat: currentAddress.lat, lng: currentAddress.lng },
        address: currentAddress.address,
      });

      let addressTypeInput = document.getElementById(`address-type_${formData.addressTypeId}`);
      if (addressTypeInput) {
        addressTypeInput.checked = true;
      }
      googleMapRef.current.setCenter({ lat: currentAddress.lat, lng: currentAddress.lng });
    }

    if (disabledAddressTypes?.length > 0) {
      handleDisabledAddressTypes();
    }
  }, []);

  useEffect(() => {
    if (
      selectedAddressType !== null &&
      Object.keys(EnumCustomerAddressType).find((k) => EnumCustomerAddressType[k] == selectedAddressType)
    ) {
      form.setFieldValue(
        "name",
        Object.keys(EnumCustomerAddressType).find((k) => EnumCustomerAddressType[k] == selectedAddressType),
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
        form.setFieldValue("name", currentAddress.name);
      }
    }
  }, [form, selectedAddressType]);

  useEffect(() => {
    form.setFieldValue("address", selectedAddress?.address);
    onFieldsValid();
  }, [selectedAddress]);

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
      document.getElementById(`address-type_${addressTypeId}`)?.setAttribute("disabled", "disabled");
      let label = document.getElementById(`lb-address-type_${addressTypeId}`);
      if (label !== null) {
        label.style.color = "#CFCFCF";
        label.style.background = "#F2F2F2";
      }
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
        currentAddress?.customerAddressTypeId >= 0 ? currentAddress?.customerAddressTypeId : null;
      formData.name = currentAddress?.name;
      formData.address = currentAddress?.address;
      formData.addressDetail = currentAddress?.addressDetail;
      formData.note = currentAddress?.note;
      formData.lat = currentAddress?.lat;
      formData.lng = currentAddress?.lng;
    }
    return formData;
  };

  const resetState = () => {
    setSelectedAddress("");
    setSelectedAddressType(null);
    if(getListAddress) {
      getListAddress();
    }
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
    const rs = hasErrors === false && selectedAddress && name?.length > 0;
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
      {visible === true ? (
        <div className="upsert-modal-overlay">
          <div className="upsert-modal">
            <div className="body">
              <div className="header">
                <Button
                  className="btn-back"
                  id="btn-back-mobile"
                  onClick={() => {
                    form.resetFields();
                    resetState();
                    onClosed();
                  }}
                >
                  <ArrowLeftIcon />
                </Button>
                <h3>{translateData.formTitle}</h3>
              </div>
              <div className="body customTextError">
                <Form form={form} style={{ width: "100%" }} autoComplete="off">
                  {/* ADDRESS TYPE */}
                  <div className="row">
                    <div className="address-types">
                      <div className="address-types-selection">
                        <p className="form-label">{translateData.addressType}</p>
                        <Image src={SymbolsInfoRounded} width="32" height="32" alt="information" preview={false} />
                      </div>
                      <div className="radio-toolbar">{renderAddressTypes()}</div>
                    </div>
                  </div>

                  {/* ADDRESS NAME */}
                  <div className="row">
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
                        placeholder={translateData.enterYourAddressName}
                        disabled={selectedAddressType == 0 || selectedAddressType == 1}
                        maxLength={100}
                        onChange={(e) => onFieldsValid(e.target.value)}
                      />
                    </Form.Item>
                  </div>

                  {/* ADDRESS */}
                  <div className="row">
                    <Form.Item
                      name={"address"}
                      rules={[
                        {
                          required: true,
                          message: translateData.pleaseSelectAddress,
                        },
                        {
                          type: "string",
                          max: 100,
                          message: translateData.maximum100Characters,
                        },
                      ]}
                    >
                      <GooglePlacesAutocompleteInput
                        maxLength={100}
                        initLocation={currentAddress?.address ?? ""}
                        ref={googleMapInputRef}
                        placeholder={translateData.address}
                        onSelectLocation={(location) => {
                          onSelectLocation(location);
                          form.setFields([
                            {
                              name: "address",
                              errors: [],
                            },
                          ]);
                        }}
                        onEmptyLocation={(value) => {
                          if (value === "") {
                            form.setFields([{ name: "address", errors: [translateData.pleaseSelectAddress] }]);
                            setIsAddressNotFound(false);
                          } else {
                            form.setFields([{ name: "address", errors: [""] }]);
                          }
                          setSelectedAddress("");
                        }}
                        onErrorDataLocation={(isError) => {
                          setIsAddressNotFound(isError);
                        }}
                      />
                    </Form.Item>
                  </div>

                  {/* GOOGLE MAP */}
                  <div className="row" style={{ position: "relative" }}>
                    {isAddressNotFound && (
                      <div className="errorContainer">
                        <div className="errorBox">
                          <div className="boxIcon">
                            <IconWarning className="iconWarning" />
                          </div>
                          <div className="boxText">
                            <p className="textWarnign">{translateData.addressLocationNotFound}</p>
                            <p className="textRetype">{translateData.enterYourAddressAgain}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <GoogleMapComponent ref={googleMapRef} className="google-map-box" />
                  </div>

                  {/* ADDRESS DETAIL */}
                  <div className="row">
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
                      <FnbInput
                        placeholder={`${translateData.addressDetail} (${translateData.addressDetailExample})`}
                        maxLength={100}
                      />
                    </Form.Item>
                  </div>

                  {/* NOTE */}
                  <div className="row">
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
                      <FnbInput placeholder={`${translateData.note} (${translateData.noteExample}})`} maxLength={100} />
                    </Form.Item>
                  </div>
                </Form>
              </div>
              <div className="footer">
                <Button className="btn-back" id="btn-back-web" onClick={() => onClosed()}>
                  {translateData.btnBack}
                </Button>
                <Button
                  id="btn-commit"
                  onClick={() => {
                    if (!isSubmitting) {
                      setIsSubmitting(true);
                      onFormSubmit();
                    }
                  }}
                  disabled={!isFormValid || isSubmitting}
                  style={{ background: isFormValid ? "#026f30" : "#71b88f", width: 368, height: 80 }}
                >
                  {currentAddress ? (
                    <>
                      <p style={{ flex: 1 }}>{translateData.btnComplete}</p>
                    </>
                  ) : (
                    <>
                      <span className="full-width">{translateData.btnSaveAddress}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
