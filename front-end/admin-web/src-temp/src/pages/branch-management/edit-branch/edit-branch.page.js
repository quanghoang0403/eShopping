import { Button, Card, Col, Form, Input, Layout, message, Row, Space } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbGoogleMap } from "components/fnb-google-map/google-map.component";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import PageTitle from "components/page-title";
import { PlacesAutocomplete } from "components/places-auto-complete/places-auto-complete.component";
import { mappingWorkingHours } from "constants/day-of-week.constants";
import { DELAYED_TIME, INPUT_PHONE_NUMBER_REGEX } from "constants/default.constants";
import { FORMAT_GOOGLE_ADDRESS } from "constants/google.constant";
import { PermissionKeys } from "constants/permission-key.constants";
import storeDataService from "data-services/store/store-data.service";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setBranchWorkingHoursData } from "store/modules/branch/branch.actions";
import { getAddressDetails } from "utils/google";
import { getUrlQrCode, getValidationMessages } from "utils/helpers";
import i18n from "utils/i18n";
import { BranchBankTransferComponent } from "../components/branch-bank-transfer/Index";
import { EditBranchWorkingHourComponent } from "../components/branch-working-hour/edit-branch-working-hour.component";

export default function EditBranchPage(props) {
  const { t, branchDataService, match, history } = props;

  const { Content } = Layout;
  const [form] = Form.useForm();
  const [formSelectTimeOption] = Form.useForm();
  const dispatch = useDispatch();

  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    labelBranchName: t("settings.createBranch.branchName"),
    inputBranchName: t("settings.createBranch.inputBranchName"),
    validBranchName: t("settings.createBranch.validBranchName"),
    titleEditBranch: t("settings.editBranch.titleEditBranch"),
    branchUpdatedSuccessfully: t("settings.editBranch.branchUpdatedSuccessfully"),
    mustBeBetweenThreeAndOneHundredsCharacters: t("form.mustBeBetweenThreeAndOneHundredsCharacters"),

    labelCountry: t("form.country"),

    labelPhone: t("form.phone"),
    inputPhone: t("form.inputPhone"),
    validPhone: t("form.validPhone"),
    validPhonePattern: t("form.validPhonePattern"),

    labelEmail: t("form.email"),
    inputEmail: t("form.inputEmail"),
    validEmail: t("form.validEmail"),
    invalidMessageEmail: t("staffManagement.generalInformation.emailInvalidMessage"),

    labelAddress: t("form.address"),
    inputAddress: t("form.inputAddress"),
    validAddress: t("form.validAddress"),
    inputAddressOne: t("form.inputAddressOne"),
    inputAddressTwo: t("form.inputAddressTwo"),
    labelAddressTwo: t("form.addressTwo"),

    labelProvince: t("form.province"),
    selectProvince: t("form.selectProvince"),
    validProvince: t("form.validProvince"),

    labelDistrict: t("form.district"),
    selectDistrict: t("form.selectDistrict"),
    validDistrict: t("form.validDistrict"),

    labelWard: t("form.ward"),
    selectWard: t("form.selectWard"),
    validWard: t("form.validWard"),

    labelCity: t("form.city"),
    inputCity: t("form.inputCity"),
    validCity: t("form.validCity"),

    labelState: t("form.state"),
    validState: t("form.validState"),

    labelZip: t("form.zip"),
    inputZip: t("form.inputZip"),
    validZip: t("form.validZip"),
    invalidZip: t("form.invalidZip"),

    leaveForm: t("messages.leaveForm"),
    confirmation: t("messages.confirmation"),
    confirmLeave: t("button.confirmLeave"),
    discard: t("button.discard"),
    backBtn: t("settings.createBranch.back"),
    generalInformation: t("settings.createBranch.generalInformation"),
    mustBeBetweenThreeAndFifteenCharacters: t("form.mustBeBetweenThreeAndFifteenCharacters"),
    allowNumberOnly: t("form.allowNumberOnly"),
    inputBranchAddressPlaceholder: t("settings.createBranch.inputBranchAddressPlaceholder"),
    inputBranchAddressValidateMessage: t("settings.createBranch.inputBranchAddressValidateMessage"),
    phoneValidation: t("customer.addNewForm.phoneValidation"),
    validateAddressMessage: t("settings.createBranch.validateAddress"),

    titleBank: t("BranchBankTransfer.title"),
    useBankAccount: t("BranchBankTransfer.useBankAccount"),
    accountHolder: t("BranchBankTransfer.accountHolder"),
    inputAccountHolder: t("BranchBankTransfer.inputAccountHolder"),
    validAccountHolder: t("BranchBankTransfer.validAccountHolder"),
    bankName: t("BranchBankTransfer.bankName"),
    selectBankName: t("BranchBankTransfer.selectBankName"),
    validBankName: t("BranchBankTransfer.validBankName"),
    inputBankName: t("BranchBankTransfer.inputBankName"),
    validInputBankName: t("BranchBankTransfer.validInputBankName"),
    accountNumber: t("BranchBankTransfer.accountNumber"),
    inputAccountNumber: t("BranchBankTransfer.inputAccountNumber"),
    validAccountNumber: t("BranchBankTransfer.validAccountNumber"),
    country: t("BranchBankTransfer.country"),
    selectCountry: t("BranchBankTransfer.selectCountry"),
    validCountry: t("BranchBankTransfer.validCountry"),
    qRCode: t("BranchBankTransfer.qRCode"),
    bankBranchName: t("BranchBankTransfer.bankBranchName"),
    inputBankBranchName: t("BranchBankTransfer.inputBankBranchName"),
    swiftCode: t("BranchBankTransfer.swiftCode"),
    inputSwiftCode: t("BranchBankTransfer.inputSwiftCode"),
    routingNumber: t("BranchBankTransfer.routingNumber"),
    inputRoutingNumber: t("BranchBankTransfer.inputRoutingNumber"),
    download: t("BranchBankTransfer.download"),
    swiftCodeMaxLength: 100,
    routingNumberMaxLength: 100,
  };

  const [isChangeForm, setIsChangeForm] = useState(false);
  const [initData, setInitData] = useState({});
  const [countries, setCountries] = useState(null);
  const [phonecode, setPhonecode] = useState(null);
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);

  //Address Info
  const [fullStates, setFullStates] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsByCityId, setDistrictsByCityId] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsByDistrictId, setWardsByDistrictId] = useState([]);
  const [fullAddressMap, setFullAddressMap] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [branchLocation, setBranchLocation] = useState(null);
  const autoCompleteRef = useRef();
  const googleMapRef = useRef();
  const workingHourRef = useRef();
  const [isFullTime, setIsFullTime] = useState(true);
  const [isAllDays, setIsAllDays] = useState(false);
  const [currentWorkingHoursData, setCurrentWorkingHoursData] = useState([]); ///Current working hours
  const [isUseStoreBankAccount, setIsUseStoreBankAccount] = useState(false);
  const [bankName, setBankName] = useState("");
  const bankTransferRef = useRef();

  useEffect(() => {
    async function fetchData() {
      await getInitDataAsync();
    }
    fetchData();
    dispatch(setBranchWorkingHoursData(null));
  }, []);

  const getInitDataAsync = async () => {
    let promises = [];
    promises.push(storeDataService.getPrepareAddressDataAsync());
    promises.push(branchDataService.getBranchByIdAsync(match?.params?.id));
    let [prepareAddressDataResponse, branchData] = await Promise.all(promises);

    bankTransferRef?.current?.setInitBankAccountData(branchData, prepareAddressDataResponse);

    /// Meta data
    const { countries, cities, districts, wards, states, defaultCountry } = prepareAddressDataResponse;
    setInitData(prepareAddressDataResponse);
    setCountries(countries);
    setCities(cities);
    setDistricts(districts);
    setWards(wards);
    setFullStates(states);

    /// Set customer data
    if (branchData) {
      const { branch } = branchData;
      getInitDataWorkingHours(branch);

      let address1 = branch?.address1;
      let cityId = branch?.cityId;
      let districtId = branch?.districtId;
      let wardId = branch?.wardId;
      let countryId = branch?.countryId;
      let stateId = branch?.stateId;
      let fullAddress = "";

      onChangeCity(cityId);
      onChangeDistrict(districtId);
      const initField = {
        ...branch,
      };
      form.setFieldsValue(initField);
      if (branch?.countryId === defaultCountry?.id) {
        setIsDefaultCountry(true);
      } else {
        setIsDefaultCountry(false);
      }
      let country = countries?.find((item) => item.id === countryId);
      setPhonecode(country.phonecode);

      const countryStates = states?.filter((s) => s.countryCode === country.iso);
      setStates(countryStates);

      let districtsFilteredByCity = districts?.filter((item) => item.cityId === cityId) ?? [];
      setDistrictsByCityId(districtsFilteredByCity);

      let wardsFilteredByCity = wards?.filter((item) => item.districtId === districtId) ?? [];
      setWardsByDistrictId(wardsFilteredByCity);

      ///Set location
      if (branch?.countryId === defaultCountry?.id) {
        const currentAddress = address1;
        const currentWard = wards?.find((x) => x.id === wardId);
        const districtName = districts?.find((x) => x.id === districtId)?.name;
        const cityName = cities?.find((x) => x.id === cityId)?.name;
        fullAddress = `${currentAddress}, ${currentWard?.prefix} ${currentWard?.name}, ${districtName}, ${cityName}`;
      } else {
        const currentAddress = address1;
        const stateName = states?.find((x) => x.id === stateId)?.name;
        const countryName = countries?.find((x) => x.id === countryId).name;
        fullAddress = `${currentAddress}, ${stateName}, ${countryName}`;
      }

      setFullAddressMap(fullAddress);

      ///Set google map marker
      const currentBranchLocation = { lat: branch?.lat, lng: branch?.lng };

      if (autoCompleteRef && autoCompleteRef.current) {
        autoCompleteRef.current.setAddressWhenEdit(fullAddress);
      }

      setBranchLocation({
        center: currentBranchLocation,
        address: fullAddress,
      });

      if (googleMapRef && googleMapRef.current) {
        googleMapRef.current.setCenter(currentBranchLocation);
      }

      setIsUseStoreBankAccount(branch?.isUseStoreBankAccount);
    }
  };

  const getInitDataWorkingHours = (branch) => {
    setIsFullTime(branch?.isFullTime);
    setIsAllDays(branch?.isWorkingAllDays);
    setCurrentWorkingHoursData(branch?.storeBranchWorkingHours ?? []);
    workingHourRef?.current?.setInitData(branch?.isFullTime, branch?.isWorkingAllDays, branch?.storeBranchWorkingHours);
  };

  useEffect(() => {
    const errorFields = form
      .getFieldsError()
      .reduce((arr, field) => (field.errors.length && arr.push(field.name), arr), []);

    form.validateFields(errorFields);
  }, [i18n.language]);

  const onCountryChange = (countryId) => {
    let country = countries?.find((item) => item.id === countryId);
    setPhonecode(country?.phonecode);
    const countryStates = fullStates?.filter((s) => s.countryCode === country.iso);
    setStates(countryStates);
    countryId === initData?.defaultCountry?.id ? setIsDefaultCountry(true) : setIsDefaultCountry(false);
    let formValue = form.getFieldsValue();
    formValue.address1 = null;
    formValue.cityId = null;
    formValue.districtId = null;
    formValue.wardId = null;
    formValue.stateId = null;
    formValue.phoneNumber = null;
    form.setFieldsValue(formValue);

    ///Set region for select address autocomplete
    if (autoCompleteRef && autoCompleteRef.current) {
      autoCompleteRef.current.setDefaultCountry(countryId === initData?.defaultCountry?.id ? true : false);
      autoCompleteRef.current.clearCurrentLocation();
    }
  };

  const onChangeCity = (event) => {
    let districtsFilteredByCity = districts?.filter((item) => item.cityId === event) ?? [];
    setDistrictsByCityId(districtsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.districtId = null;
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const onChangeDistrict = (event) => {
    let wardsFilteredByCity = wards?.filter((item) => item.districtId === event) ?? [];
    setWardsByDistrictId(wardsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const prefixSelector = <label>+{phonecode}</label>;

  const onFinish = async (values) => {
    if (!branchLocation) {
      message.error(pageData.inputBranchAddressValidateMessage);
      if (autoCompleteRef && autoCompleteRef.current) {
        autoCompleteRef.current.setIsError(true);
      }
      return;
    } else {
      if (autoCompleteRef && autoCompleteRef.current) {
        autoCompleteRef.current.setIsError(false);
      }
    }

    var newFullAddressMap = handleGenerateNewAddressByForm();

    const isValidate = validateAddress(values, newFullAddressMap);
    if (isValidate) {
      message.error(pageData.validateAddressMessage);
      return;
    }

    ///Validate working hours before saving
    if (isFullTime === false && currentWorkingHoursData?.length > 0) {
      await formSelectTimeOption.validateFields();
    }
    const qRCode = getUrlQrCode(values.acpId, values.accountNumber);

    var editModel = {
      ...values,
      branchId: match?.params.id,
      location: {
        lat: branchLocation?.center?.lat,
        lng: branchLocation?.center?.lng,
      },
      isFullTime: isFullTime,
      isWorkingAllDays: isAllDays,
      storeBranchWorkingHours: isFullTime ? [] : mappingWorkingHours(currentWorkingHoursData),
      isUseStoreBankAccount: isUseStoreBankAccount,
      bankName: bankName,
      qRCode: qRCode,
    };

    let res = null;
    try {
      res = await branchDataService.updateBranchByIdAsync(editModel);
    } catch (errs) {
      form.setFields(getValidationMessages(errs));
    }

    if (res) {
      navigateToManagementPage({
        savedSuccessfully: true,
        message: pageData.branchUpdatedSuccessfully,
      });
      onResetFields();
    }
  };

  const handleGenerateNewAddressByForm = () => {
    let formValue = form.getFieldsValue();
    let address1 = formValue.address1;
    let cityId = formValue.cityId;
    let districtId = formValue.districtId;
    let wardId = formValue.wardId;
    let stateId = formValue.stateId;
    let countryId = formValue.countryId;
    let fullAddress = "";

    ///Set location
    if (isDefaultCountry) {
      const currentAddress = address1;
      const currentWard = wards?.find((x) => x.id === wardId);
      const districtName = districts?.find((x) => x.id === districtId)?.name;
      const cityName = cities?.find((x) => x.id === cityId)?.name;
      fullAddress = `${currentAddress}, ${currentWard?.prefix} ${currentWard?.name}, ${districtName}, ${cityName}`;
    } else {
      const currentAddress = address1;
      const stateName = states?.find((x) => x.id === stateId)?.name;
      const countryName = countries?.find((x) => x.id === countryId).name;
      fullAddress = `${currentAddress}, ${stateName}, ${countryName}`;
    }

    return fullAddress;
  };

  /**
   * This function is used to set the form status,
   * if value is true when you leave this page then a confirmation box will be displayed.
   *
   */
  const onFormChanged = () => {
    if (form.getFieldsValue()) {
      setIsChangeForm(true);
      setDisableSaveButton(false);
    } else {
      setIsChangeForm(false);
      setDisableSaveButton(true);
    }
  };

  /**
   * This function is used to navigate to the Staff Management page.
   * @param  {any} data This data will be called at the Branch Management page.
   */
  const navigateToManagementPage = (data) => {
    dispatch(setBranchWorkingHoursData(null));
    setIsChangeForm(false);
    setTimeout(() => {
      history.push({ pathname: "/branch", state: data });
    }, DELAYED_TIME);
  };

  /**
   * This function is used to get location from the google map
   * @param {*} location
   */
  const onSelectLocation = (location, addressInfo) => {
    setBranchLocation(location);
    const addressInfoData = getAddressDetails(addressInfo ?? []);
    onSetFormAddressValue(location.address, addressInfoData);

    ///Set google map marker
    if (googleMapRef && googleMapRef.current) {
      googleMapRef.current.setCenter(location.center);
    }
    if (autoCompleteRef && autoCompleteRef.current) {
      autoCompleteRef.current.setIsError(false);
    }
  };

  /// Set form address value when input address google map
  const onSetFormAddressValue = (address, addressInfo) => {
    if (address) {
      if (isDefaultCountry) {
        const addressGoogleMap = getAddressGoogleMap(address, addressInfo);

        ///Filter address id
        setDistrictsByCityId(addressGoogleMap.districtsFilteredByCity);
        setWardsByDistrictId(addressGoogleMap.wardsFilteredByCity);

        ///Set address field value
        let formValue = form.getFieldsValue();
        formValue.address1 = addressGoogleMap.address;
        formValue.cityId = addressGoogleMap.cityId;
        formValue.districtId = addressGoogleMap.districtId;
        formValue.wardId = addressGoogleMap.wardId;
        form.setFieldsValue(formValue);
      } else {
        const [street, ...otherAddressInfo] = address.split(",");
        const mainAddress = street;
        let stateId = states?.find((x) =>
          addressInfo?.city?.trim().toLowerCase().includes(x.name?.trim().toLowerCase()),
        )?.id;

        ///Set address field value
        let formValue = form.getFieldsValue();
        formValue.address1 = mainAddress;
        formValue.stateId = stateId;
        formValue.cityTown = addressInfo?.district;
        form.setFieldsValue(formValue);
      }
      setFullAddressMap(address);
    }
  };

  const onSetEmptyLocation = () => {
    setBranchLocation(null);
  };

  const onResetFields = () => {
    if (autoCompleteRef && autoCompleteRef.current) {
      autoCompleteRef.current.clearCurrentLocation();
    }
    form.resetFields();
    onSetEmptyLocation();
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
      return false;
    } else {
      setShowConfirm(false);
      navigateToManagementPage();
      return true;
    }
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
  };

  //This function is used to compare the address in form with the address Google Map
  function validateAddress(values, addressMap) {
    if (!Boolean(values) || !Boolean(addressMap)) {
      return;
    }

    const addressGoogleMap = getAddressGoogleMap(addressMap);
    if (
      addressGoogleMap.address?.trim().toLowerCase() !== values.address1?.trim().toLowerCase() &&
      addressGoogleMap.cityId !== values.cityId &&
      addressGoogleMap.districtId !== values.districtId &&
      addressGoogleMap.wardId !== values.wardId
    ) {
      return true;
    } else {
      return false;
    }
  }

  //This function is used to get the address from Google Map
  function getAddressGoogleMap(addressMap, addressInfo) {
    if (!Boolean(addressMap)) {
      return;
    }

    const splitAddress = addressMap.split(",");
    const mainAddress =
      splitAddress.length === FORMAT_GOOGLE_ADDRESS.defaultLength
        ? splitAddress[0]
        : splitAddress[0].concat(", ", splitAddress[1]);
    let city = splitAddress[splitAddress.length === FORMAT_GOOGLE_ADDRESS.defaultLength ? 3 : 4];
    let district = splitAddress[splitAddress.length === FORMAT_GOOGLE_ADDRESS.defaultLength ? 2 : 3];
    let fullWard = splitAddress[splitAddress.length === FORMAT_GOOGLE_ADDRESS.defaultLength ? 1 : 2];

    if (splitAddress && splitAddress?.length <= 3) {
      city = addressInfo?.city;
      district = addressInfo?.district;
      fullWard = addressInfo?.ward;
    }

    const ward = fullWard?.replace("phường", "")?.replace("Phường", "");

    ///Find address id
    let cityId = cities?.find((x) => city?.trim().toLowerCase().includes(x.name?.trim().toLowerCase()))?.id;

    let districtsFilteredByCity = districts?.filter((item) => item.cityId === cityId) ?? [];
    let districtId = districtsFilteredByCity?.find(
      (x) => district?.trim().toLowerCase() === x.name?.trim().toLowerCase(),
    )?.id;

    let wardsFilteredByCity = wards?.filter((item) => item.districtId === districtId) ?? [];
    let wardId = wardsFilteredByCity?.find((x) => ward?.trim().toLowerCase() === x.name?.trim().toLowerCase())?.id;
    if (!wardId) {
      wardId = wardsFilteredByCity?.find(
        (x) =>
          ward?.trim().toLowerCase().includes("(") & ward?.trim().toLowerCase().includes(")") &&
          ward?.trim().toLowerCase().includes(x.name?.trim().toLowerCase()),
      )?.id;
    }
    return {
      address: mainAddress?.trim(),
      cityId: cityId,
      districtsFilteredByCity: districtsFilteredByCity,
      districtId: districtId,
      wardsFilteredByCity: wardsFilteredByCity,
      wardId: wardId,
    };
  }

  return (
    <>
      <Form
        autoComplete="off"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onFinish}
        form={form}
        onChange={onFormChanged}
        onFieldsChange={(e) => changeForm(e)}
      >
        <Row className="fnb-row-page-header">
          <Space className="page-title">
            <PageTitle content={pageData.titleEditBranch} />
          </Space>
          <Space className="page-action-group action-button-custom">
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button disabled={disableSaveButton} type="primary" htmlType="submit">
                      {pageData.btnSave}
                    </Button>
                  ),
                  permission: PermissionKeys.ADMIN,
                },
                {
                  action: (
                    <a onClick={() => onCancel()} className="action-cancel">
                      {pageData.btnCancel}
                    </a>
                  ),
                  permission: null,
                },
              ]}
            />
          </Space>
        </Row>

        <div className="clearfix"></div>

        <Content>
          <Card className="fnb-box custom-box">
            <Row className="group-header-box">
              <Col xs={24} sm={24} lg={24}>
                {pageData.generalInformation}
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">
                  {pageData.labelBranchName}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  name="branchName"
                  rules={[
                    { required: true, message: pageData.validBranchName },
                    { type: "string", warningOnly: true },
                    {
                      type: "string",
                      max: 100,
                      min: 3,
                      message: `${pageData.labelBranchName} ${pageData.mustBeBetweenThreeAndOneHundredsCharacters}`,
                    },
                  ]}
                >
                  <Input
                    showCount
                    maxLength={100}
                    className="fnb-input-with-count"
                    placeholder={pageData.inputBranchName}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">
                  {pageData.labelCountry}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  name="countryId"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <FnbSelectSingle
                    option={countries?.map((item, index) => ({
                      id: item.id,
                      name: item.nicename,
                      key: index + item.id,
                    }))}
                    onChange={onCountryChange}
                    showSearch
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">
                  {pageData.labelPhone}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: pageData.phoneValidation,
                    },
                    {
                      pattern: INPUT_PHONE_NUMBER_REGEX,
                      message: pageData.validPhonePattern,
                    },
                  ]}
                >
                  <Input
                    className="fnb-input-addon-before"
                    size="large"
                    placeholder={pageData.inputPhone}
                    addonBefore={prefixSelector}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">{pageData.labelEmail}</h4>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: pageData.invalidMessageEmail,
                    },
                  ]}
                >
                  <Input className="fnb-input" size="large" placeholder={pageData.inputEmail} />
                </Form.Item>
              </Col>
            </Row>

            {isDefaultCountry ? (
              <>
                <Row gutter={[24, 24]}>
                  <Col sm={24} xs={24} lg={12}>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelAddress}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item
                          name="address1"
                          rules={[
                            {
                              required: true,
                              message: pageData.validAddress,
                            },
                          ]}
                        >
                          <Input
                            showCount
                            maxLength={255}
                            className="fnb-input-with-count"
                            size="large"
                            placeholder={pageData.inputAddress}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelProvince}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item name="cityId" rules={[{ required: true, message: pageData.validProvince }]}>
                          <FnbSelectSingle
                            placeholder={pageData.inputCity}
                            option={cities?.map((item, index) => ({
                              id: item.id,
                              name: item.name,
                              key: index + item.id,
                            }))}
                            onChange={onChangeCity}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelDistrict}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item name="districtId" rules={[{ required: true, message: pageData.validDistrict }]}>
                          <FnbSelectSingle
                            placeholder={pageData.selectDistrict}
                            option={districtsByCityId?.map((item, index) => ({
                              id: item.id,
                              name: item.name,
                              key: index + item.id,
                            }))}
                            onChange={onChangeDistrict}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelWard}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item name="wardId" rules={[{ required: true, message: pageData.validWard }]}>
                          <FnbSelectSingle
                            placeholder={pageData.selectWard}
                            option={wardsByDistrictId?.map((item, index) => ({
                              id: item.id,
                              name: item?.prefix + " " + item.name,
                              key: index + item.id,
                            }))}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  {/* Google map */}
                  <Col sm={24} xs={24} lg={12}>
                    <div className="branch-google-map-container">
                      <PlacesAutocomplete
                        inputClassName="input-address"
                        addressPopoverClassName="input-address-popover"
                        textOverflowClassName="input-address-text-overflow"
                        ref={autoCompleteRef}
                        inputPlaceholder={pageData.inputBranchAddressPlaceholder}
                        onSelectLocation={onSelectLocation}
                        onEmptyLocation={onSetEmptyLocation}
                      ></PlacesAutocomplete>
                      <FnbGoogleMap ref={googleMapRef} className="google-map-box"></FnbGoogleMap>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row gutter={[24, 24]}>
                  <Col sm={24} xs={24} lg={12}>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelAddress}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item
                          name="address1"
                          rules={[
                            {
                              required: true,
                              message: pageData.validAddress,
                            },
                          ]}
                        >
                          <Input className="fnb-input" placeholder={pageData.inputAddressTwo} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">{pageData.labelAddressTwo}</h4>
                        <Form.Item name="address2">
                          <Input className="fnb-input" placeholder={pageData.inputAddressTwo} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelCity}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item name="cityTown" rules={[{ required: true, message: pageData.validCity }]}>
                          <Input className="fnb-input" placeholder={pageData.inputCity} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelState}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item name="stateId" rules={[{ required: true, message: pageData.validState }]}>
                          <FnbSelectSingle
                            placeholder={pageData.selectProvince}
                            option={states?.map((item, index) => ({
                              id: item.id,
                              name: item.name,
                              key: index + item.id,
                            }))}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelZip}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item
                          name="postalCode"
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
                          <Input type={"number"} className="fnb-input" placeholder={pageData.inputZip} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  {/* Google map */}
                  <Col sm={24} xs={24} lg={12}>
                    <div className="branch-google-map-container">
                      <PlacesAutocomplete
                        inputClassName="input-address"
                        addressPopoverClassName="input-address-popover"
                        textOverflowClassName="input-address-text-overflow"
                        ref={autoCompleteRef}
                        inputPlaceholder={pageData.inputBranchAddressPlaceholder}
                        onSelectLocation={onSelectLocation}
                        onEmptyLocation={onSetEmptyLocation}
                      ></PlacesAutocomplete>
                      <FnbGoogleMap ref={googleMapRef} className="google-map-box" zoom={18}></FnbGoogleMap>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </Content>

        {/* Branch Bank Transfer */}
        <BranchBankTransferComponent
          ref={bankTransferRef}
          t={t}
          isUseStoreBankAccount={isUseStoreBankAccount}
          setIsUseStoreBankAccount={setIsUseStoreBankAccount}
          setBankName={setBankName}
          form={form}
        />
      </Form>

      {/* Branch working hours */}
      <EditBranchWorkingHourComponent
        setCurrentWorkingHoursData={setCurrentWorkingHoursData}
        setIsCheckedFullTime={setIsFullTime}
        setIsSelectedAllDays={setIsAllDays}
        formSelectTimeOption={formSelectTimeOption}
        ref={workingHourRef}
        setIsChangeForm={(isChangeForm) => setDisableSaveButton(!isChangeForm)}
      />

      <DeleteConfirmComponent
        title={pageData.confirmation}
        content={pageData.leaveForm}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discard}
        okText={pageData.confirmLeave}
        onCancel={() => setShowConfirm(false)}
        onOk={navigateToManagementPage}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
