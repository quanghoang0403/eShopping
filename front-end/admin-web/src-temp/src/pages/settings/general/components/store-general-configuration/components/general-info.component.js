import { Button, Card, Col, Form, Input, Row, message } from "antd";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { CloneIcon } from "constants/icons.constants";
import { StoreSettingConstants } from "constants/store-setting.constants";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInformationPublishStore } from "store/modules/session/session.actions";
import "../store-general-configuration.style.scss";

export const CardGeneralInfo = forwardRef((props, ref) => {
  const { t, className, storeDataService } = props;
  const [formGeneral] = Form.useForm();
  const dispatch = useDispatch();
  const informationPublishStore = useSelector((state) => state?.session?.informationPublishStore);
  const [initDataAddress, setInitDataAddress] = useState(null);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsByDistrictId, setWardsByDistrictId] = useState([]);
  const [districtsByCityId, setDistrictsByCityId] = useState([]);
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);
  const [phoneCode, setPhoneCode] = useState(null);
  const [isChangeForm, setIsChangeForm] = useState(false);

  const pageData = {
    btnUpdate: t("button.update"),
    enter: t("form.enter"),
    storeName: t("registerAccount.storeName"),
    store: t("settings.tabStore"),
    updateSuccess: t("messages.isUpdatedSuccessfully"),
    inputStoreName: t("registerAccount.inputStoreName"),
    fullName: t("form.fullName"),
    enterFullName: t("form.enterFullName"),
    country: t("form.country"),
    phone: t("form.phone"),
    inputPhone: t("form.inputPhone"),
    validPhone: t("form.validPhone"),
    validPhonePattern: t("form.validPhonePattern"),
    phoneValidation: t("supplier.phoneValidation"),
    mustBeBetweenThreeAndFifteenCharacters: t("form.mustBeBetweenThreeAndFifteenCharacters"),
    allowNumberOnly: t("form.allowNumberOnly"),
    email: t("form.email"),
    validEmail: t("form.validEmail"),
    inputEmail: t("form.inputEmail"),
    validEmailPattern: t("form.validEmailPattern"),
    currency: t("form.currency"),
    selectCurrency: t("form.selectCurrency"),
    businessModel: t("form.businessModel"),
    selectBusinessModel: t("form.selectBusinessModel"),
    address: t("form.address"),
    validAddress: t("form.validAddress"),
    inputAddress: t("form.inputAddress"),
    addressTwo: t("form.addressTwo"),
    inputAddressOne: t("form.inputAddressOne"),
    inputAddressTwo: t("form.inputAddressTwo"),
    province: t("form.province"),
    selectProvince: t("form.selectProvince"),
    validSelectProvince: t("form.validSelectProvince"),
    district: t("form.district"),
    selectDistrict: t("form.selectDistrict"),
    validDistrict: t("form.validDistrict"),
    ward: t("form.ward"),
    selectWard: t("form.selectWard"),
    validWard: t("form.validWard"),
    city: t("form.city"),
    inputCity: t("form.inputCity"),
    validCity: t("form.validCity"),
    state: t("form.state"),
    selectState: t("form.selectState"),
    zip: t("form.zip"),
    inputZip: t("form.inputZip"),
    validZip: t("form.validZip"),
    invalidZip: t("form.invalidZip"),
    citySearchTextMaxLength: 255,
    leaveForm: t("messages.leaveForm"),
    confirmation: t("leaveDialog.confirmation"),
    confirmLeave: t("button.confirmLeave"),
    discard: t("button.discard"),
    generalInformation: t("title.generalInformation"),
    storeID: t("registerAccount.storeID"),
    storeCode: t("registerAccount.storeCode"),
    copiedSucess: t("supplier.copiedSuccess"),
  };

  const prefixSelector = <label>+{phoneCode}</label>;

  useImperativeHandle(ref, () => ({
    setInitGeneralInfoData(addressData, storeData) {
      setInitDataAddress(addressData);
      initDataGeneralInfo(addressData, storeData);
    },
  }));

  const initDataGeneralInfo = (initDataAddress, initStoreData) => {
    if (initDataAddress) {
      const { states, countries, cities, districts, wards } = initDataAddress;
      setCountries(countries);
      setCities(cities);
      setDistricts(districts);
      setStates(states);
      setWards(wards);

      if (initStoreData) {
        const { store, staff } = initStoreData;
        const { city, country, district } = store?.address;

        setPhoneCode(country?.phonecode);
        onChangeCity(city?.id);
        onChangeDistrict(district?.id);

        let districtsFilteredByCity = districts?.filter((item) => item.cityId === city?.id) ?? [];
        setDistrictsByCityId(districtsFilteredByCity);

        let wardsFilteredByCity = wards?.filter((item) => item.districtId === district?.id) ?? [];
        setWardsByDistrictId(wardsFilteredByCity);

        var isDefault = countries?.find((item) => item.iso === "VN")?.id === store?.address?.countryId;
        setIsDefaultCountry(isDefault);

        formGeneral.setFieldsValue({
          store: {
            ...store,
          },
          staff: {
            ...staff,
          },
        });
      }
    }
  };

  const onCountryChange = (countryId) => {
    let country = countries?.find((item) => item.id === countryId);
    setPhoneCode(country.phonecode);

    countryId === initDataAddress?.defaultCountry?.id ? setIsDefaultCountry(true) : setIsDefaultCountry(false);
  };

  const onChangeCity = (event) => {
    let districtsFilteredByCity = districts?.filter((item) => item.cityId === event) ?? [];
    setDistrictsByCityId(districtsFilteredByCity);

    let formValue = formGeneral.getFieldsValue();
    formValue.store.address.district.id = null;
    formValue.store.address.ward.id = null;
    formGeneral.setFieldsValue(formValue);
  };

  const onChangeDistrict = (event) => {
    let wardsFilteredByCity = wards?.filter((item) => item.districtId === event) ?? [];
    setWardsByDistrictId(wardsFilteredByCity);

    let formValue = formGeneral.getFieldsValue();
    formValue.store.address.ward.id = null;
    formGeneral.setFieldsValue(formValue);
  };

  const onChangeForm = () => {
    if (!isChangeForm) {
      setIsChangeForm(true);
    }
  };

  const onSaveGeneralInfo = async () => {
    const formValues = formGeneral.getFieldsValue();
    const res = await storeDataService?.updateStoreManagementAsync(formValues);
    if (res) {
      //save redux information store
      dispatch(setInformationPublishStore({ ...informationPublishStore, title: formValues?.store?.title }));
      message.success(`${pageData.store} ${formValues.store.title} ${pageData.updateSuccess}`);
    }
  };

  function CopyIdButton() {
    let formValue = formGeneral.getFieldsValue();
    navigator.clipboard.writeText(formValue.store.id);
    message.success(pageData.copiedSucess);
  }
  function CopyCodeButton() {
    let formValue = formGeneral.getFieldsValue();
    navigator.clipboard.writeText(formValue.store.code);
    message.success(pageData.copiedSucess);
  }
  return (
    <div className={className}>
      <Card className="fnb-card w-100 card-general">
        <Form form={formGeneral} autoComplete="off" onChange={onChangeForm}>
          <Row className="card-title-box">
            <Col span={12} className="d-flex-align-center">
              <h3 className="card-title">{pageData.generalInformation}</h3>
            </Col>
            <Col span={12}>
              {isChangeForm && (
                <Button onClick={onSaveGeneralInfo} type="primary" className="btn-save float-right">
                  {pageData.btnUpdate}
                </Button>
              )}
            </Col>
          </Row>
          <Row className="my-24" gutter={[24, 24]}>
            <Col lg={12} span={24}>
              <h4 className="fnb-form-label">{pageData.storeID}</h4>

              <Form.Item name={["store", "id"]} className="mb-0">
                <FnbInput
                  disabled
                  maxLength={255}
                  suffix={<CloneIcon style={{ cursor: "pointer" }} onClick={CopyIdButton} />}
                ></FnbInput>
              </Form.Item>
            </Col>
            <Col lg={12} span={24}>
              <h4 className="fnb-form-label">{pageData.storeCode}</h4>
              <Form.Item name={["store", "code"]} className="mb-0">
                <FnbInput
                  disabled
                  maxLength={255}
                  suffix={<CloneIcon style={{ cursor: "pointer" }} onClick={CopyCodeButton} />}
                ></FnbInput>
              </Form.Item>
            </Col>

            <Col span={24}>
              <h4 className="fnb-form-label">{pageData.storeName}</h4>
              <Form.Item
                name={["store", "title"]}
                rules={[
                  {
                    required: true,
                    message: pageData.inputStoreName,
                  },
                ]}
                className="mb-0"
              >
                <FnbInput placeholder={pageData.inputStoreName} maxLength={100} showCount />
              </Form.Item>
            </Col>
            <Col lg={12} span={24}>
              <h4 className="fnb-form-label">{pageData.fullName}</h4>
              <Form.Item
                name={["staff", "fullName"]}
                rules={[
                  {
                    required: true,
                    message: pageData.enterFullName,
                  },
                ]}
                className="mb-0"
              >
                <FnbInput placeholder={pageData.enterFullName} maxLength={50} showCount />
              </Form.Item>
            </Col>
            <Col lg={12} span={24}>
              <h4 className="fnb-form-label">{pageData.country}</h4>
              <Form.Item name={["store", "address", "countryId"]} rules={[{ required: true }]} className="mb-0">
                <FnbSelectSingle
                  size="large"
                  showSearch
                  autoComplete="none"
                  onChange={(e) => {
                    onCountryChange(e);
                    onChangeForm();
                  }}
                  option={countries?.map((item, index) => ({
                    id: item.id,
                    name: item.nicename,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col lg={12} span={24}>
              <h4 className="fnb-form-label">{pageData.phone}</h4>
              <Form.Item
                name={["staff", "phoneNumber"]}
                className="mb-0"
                rules={[
                  {
                    required: true,
                    message: pageData.phoneValidation,
                  },
                  {
                    min: 3,
                    max: 15,
                    message: `${pageData.phone} ${pageData.mustBeBetweenThreeAndFifteenCharacters}`,
                  },
                  {
                    pattern: /^\d+$/g,
                    message: pageData.allowNumberOnly,
                  },
                ]}
              >
                <Input
                  className="fnb-input-addon-before"
                  size="large"
                  placeholder={pageData.inputPhone}
                  addonBefore={prefixSelector}
                  maxLength={15}
                />
              </Form.Item>
            </Col>
            <Col lg={12} span={24}>
              <h4 className="fnb-form-label">{pageData.email}</h4>
              <Form.Item
                name={["staff", "account", "email"]}
                className="mb-0"
                rules={[
                  {
                    required: false,
                    message: pageData.emailValidation,
                  },
                  {
                    type: "email",
                    message: pageData.emailInvalidEmail,
                  },
                ]}
              >
                <FnbInput disabled placeholder={pageData.inputEmail} maxLength={100} />
              </Form.Item>
            </Col>
            {isDefaultCountry ? (
              <>
                <Col span={24} className="w-100">
                  <h4 className="fnb-form-label">{pageData.address}</h4>
                  <Form.Item
                    name={["store", "address", "address1"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.validAddress,
                      },
                    ]}
                    className="mb-0"
                  >
                    <FnbInput placeholder={pageData.inputAddress} maxLength={255} showCount />
                  </Form.Item>
                </Col>

                <Col span={24} lg={8} className="w-100">
                  <h4 className="fnb-form-label">{pageData.province}</h4>
                  <Form.Item name={["store", "address", "city", "id"]} className="mb-0">
                    <FnbSelectSingle
                      size="large"
                      placeholder={pageData.selectProvince}
                      onChange={(e) => {
                        onChangeCity(e);
                        onChangeForm();
                      }}
                      showSearch
                      autoComplete="none"
                      option={cities?.map((item, index) => ({
                        id: item.id,
                        name: item.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} lg={8} className="w-100">
                  <h4 className="fnb-form-label">{pageData.district}</h4>
                  <Form.Item name={["store", "address", "district", "id"]} className="mb-0">
                    <FnbSelectSingle
                      size="large"
                      placeholder={pageData.selectDistrict}
                      onChange={(e) => {
                        onChangeDistrict(e);
                        onChangeForm();
                      }}
                      showSearch
                      autoComplete="none"
                      option={districtsByCityId?.map((item, index) => ({
                        id: item.id,
                        name: `${item?.prefix} ${item.name}`,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} lg={8} className="w-100">
                  <h4 className="fnb-form-label">{pageData.ward}</h4>
                  <Form.Item name={["store", "address", "ward", "id"]}>
                    <FnbSelectSingle
                      size="large"
                      placeholder={pageData.selectWard}
                      showSearch
                      onChange={onChangeForm}
                      option={wardsByDistrictId?.map((item, index) => ({
                        id: item.id,
                        name: `${item?.prefix} ${item.name}`,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </>
            ) : (
              <>
                <Col span={24} className="w-100">
                  <h4 className="fnb-form-label">{pageData.address}</h4>
                  <Form.Item
                    name={["store", "address", "address1"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.validAddress,
                      },
                    ]}
                    className="mb-0"
                  >
                    <FnbInput placeholder={pageData.inputAddressOne} maxLength={255} showCount />
                  </Form.Item>
                </Col>
                <Col span={24} className="w-100">
                  <h4 className="fnb-form-label">{pageData.addressTwo}</h4>
                  <Form.Item name={["store", "address", "address2"]} className="mb-0">
                    <FnbInput placeholder={pageData.inputAddressTwo} maxLength={255} showCount />
                  </Form.Item>
                </Col>
                <Col span={24} lg={8} className="w-100">
                  <h4 className="fnb-form-label">{pageData.city}</h4>
                  <Form.Item
                    name={["store", "address", "cityTown"]}
                    rules={[{ required: true, message: pageData.validCity }]}
                    className="mb-0"
                  >
                    <FnbInput placeholder={pageData.inputCity} />
                  </Form.Item>
                </Col>
                <Col span={24} lg={8} className="w-100">
                  <h4 className="fnb-form-label">{pageData.state}</h4>
                  <Form.Item
                    className="mb-0"
                    name={["store", "address", "state", "id"]}
                    rules={[{ required: true, message: pageData.selectState }]}
                  >
                    <FnbSelectSingle
                      size="large"
                      placeholder={pageData.selectProvince}
                      showSearch
                      onChange={onChangeForm}
                      option={states?.map((item, index) => ({
                        id: item.id,
                        name: item.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} lg={8} className="w-100">
                  <h4 className="fnb-form-label">{pageData.zip}</h4>
                  <Form.Item
                    name={["store", "address", "postalCode"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.validZip,
                      },
                      {
                        pattern: /^[0-9]{5,6}?$/,
                        message: pageData.invalidZip,
                      },
                    ]}
                  >
                    <FnbInput placeholder={pageData.inputZip} />
                  </Form.Item>
                </Col>
              </>
            )}

            {/* Hidden values */}
            <Form.Item hidden name={["storeSetting"]} initialValue={StoreSettingConstants.GENERAL_CONFIG}></Form.Item>
            <Form.Item hidden name={["staff", "id"]}></Form.Item>
            <Form.Item hidden name={["store", "addressId"]}></Form.Item>
          </Row>
        </Form>
      </Card>
    </div>
  );
});
