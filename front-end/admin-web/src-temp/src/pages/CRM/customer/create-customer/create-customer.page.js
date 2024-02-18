import { Card, Col, DatePicker, Form, Input, message, Radio, Row, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import PageTitle from "components/page-title";
import SelectCustomerTagComponent from "components/select-tag-customer/select-tag-customer.components";
import { CustomerGenderConstant } from "constants/customer.constant";
import { DELAYED_TIME } from "constants/default.constants";
import { AdminWebIcon, CalendarNewIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { platformList } from "constants/platform.constants";
import { DateFormat } from "constants/string.constants";
import customerDataService from "data-services/customer/customer-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getValidationMessages } from "utils/helpers";
import "./create-customer.page.scss";

export default function CreateCustomerPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const pageData = {
    title: t("customer.addNewForm.titleAddNew"),
    generalInformation: t("customer.generalInformation"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.add"),
    allowedLetterAndNumber: t("form.allowedLetterAndNumber"),
    code: t("table.code"),
    mustBeBetweenThreeAndFifteenCharacters: t("form.mustBeBetweenThreeAndFifteenCharacters"),
    customerAddSuccess: t("customer.addNewForm.customerAddSuccess"),
    leaveForm: t("messages.leaveForm"),
    confirmation: t("leaveDialog.confirmation"),
    confirmLeave: t("button.confirmLeave"),
    discard: t("button.discard"),
    fullName: t("customer.addNewForm.fullName"),
    firstName: t("customer.addNewForm.firstName"),
    lastName: t("customer.addNewForm.lastName"),
    name: t("customer.addNewForm.name"),
    phone: t("customer.addNewForm.phone"),
    email: t("customer.addNewForm.email"),
    birthday: t("customer.addNewForm.birthday"),
    gender: t("customer.addNewForm.gender"),
    male: t("customer.addNewForm.male"),
    female: t("customer.addNewForm.female"),
    note: t("customer.addNewForm.note"),
    fullNamePlaceholder: t("customer.addNewForm.fullNamePlaceholder"),
    firstNamePlaceholder: t("customer.addNewForm.firstNamePlaceholder"),
    lastNamePlaceholder: t("customer.addNewForm.lastNamePlaceholder"),
    namePlaceholder: t("customer.addNewForm.namePlaceholder"),
    emailPlaceholder: t("customer.addNewForm.emailPlaceholder"),
    phonePlaceholder: t("customer.addNewForm.phonePlaceholder"),
    addressPlaceholder: t("customer.addNewForm.addressPlaceholder"),
    fullNameValidation: t("customer.addNewForm.fullNameValidation"),
    firstNameValidation: t("customer.addNewForm.firstNameValidation"),
    lastNameValidation: t("customer.addNewForm.lastNameValidation"),
    nameValidation: t("customer.addNewForm.nameValidation"),
    phoneValidation: t("customer.addNewForm.phoneValidation"),
    emailValidation: t("customer.addNewForm.emailValidation"),
    address: t("customer.addNewForm.address"),
    mustBeBetweenOneAndHundredCharacters: t("customer.addNewForm.mustBeBetweenOneAndHundredCharacters"),
    emailInvalidEmail: t("customer.addNewForm.emailInvalidEmail"),
    birthdayPlaceholder: t("customer.addNewForm.birthdayPlaceholder"),
    allowNumberOnly: t("form.allowNumberOnly"),
    validPhonePattern: t("form.validPhonePattern"),
    countryValidation: t("customer.addNewForm.countryValidation"),
    country: t("form.country"),
    province: t("form.province"),
    district: t("form.district"),
    ward: t("form.ward"),
    stateProvinceRegion: t("form.stateProvinceRegion"),
    selectCountry: t("form.selectCountry"),
    selectProvince: t("form.selectProvince"),
    selectProvinceStateRegion: t("form.selectProvinceStateRegion"),
    selectDistrict: t("form.selectDistrict"),
    validDistrict: t("form.validDistrict"),
    selectWard: t("form.selectWard"),
    labelAddress: t("form.address"),
    inputAddress: t("form.inputAddress"),
    validAddress: t("form.validAddress"),
    inputAddressOne: t("form.inputAddressOne"),
    inputAddressTwo: t("form.inputAddressTwo"),
    labelAddressTwo: t("form.addressTwo"),
    labelState: t("form.state"),
    labelZip: t("form.zip"),
    inputZip: t("form.inputZip"),
    validZip: t("form.validZip"),
    labelCity: t("form.city"),
    inputCity: t("form.inputCity"),
    validCity: t("form.validCity"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    platform: t("platform.title"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    other: t("customer.addNewForm.other"),
    tag: t("customer.tag"),
    limitTagMessage: t("customer.limitTagMessage"),
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [phonecode, setPhonecode] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [genderSelected, setGenderSelected] = useState(CustomerGenderConstant.Female);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsByDistrictId, setWardsByDistrictId] = useState([]);
  const [districtsByCityId, setDistrictsByCityId] = useState([]);
  const [defaultCountryId, setDefaultCountryId] = useState(null);
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tagDataTemp, setTagDataTemp] = useState(false);
  const storeId = useSelector((state) => state?.session?.currentUser?.storeId);
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState(false);
  const prepareAddressData = useSelector((state) => state?.session?.prepareAddressData);

  useEffect(() => {
    getInitDataAsync();
  }, [prepareAddressData]);

  useEffect(() => {
    getInitDataAsync();
    getTagsData();
  }, []);

  const getInitDataAsync = () => {
    if (prepareAddressData) {
      const { states, defaultCountry, countries, cities, districts, wards } =
        prepareAddressData;
      setCountries(countries);
      setPhonecode(defaultCountry?.phonecode);
      setCities(cities);
      setDistricts(districts);
      setWards(wards);
      setDefaultCountryId(defaultCountry?.id);
      setIsDefaultCountry(true);
      setStates(states);
      if (form) {
        form.setFieldsValue({
          address: {
            countryId: defaultCountry?.id,
          },
        });
      }
    }
  };

  const getTagsData = async () => {
    const tagData = await customerDataService.getCustomerTagAsync();
    setTagDataTemp(tagData?.tags);
  };

  const prefixSelector = <label>+{phonecode}</label>;

  const clickCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      navigateToManagementPage();
    }
  };

  const onFinish = async () => {
    form.validateFields().then(async (values) => {
      let dataSave = {
        ...values,
        birthDay: values.birthDay ? moment.utc(values.birthDay).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2) : null,
        tags: tags,
      };
      customerDataService
        .createCustomerAsync(dataSave)
        .then((res) => {
          if (res) {
            setIsChangeForm(false);
            // navigate to management list
            navigateToManagementPage();
            message.success(pageData.customerAddSuccess);
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessages(errs));
        });
    });
  };

  const onGenderChange = (e) => {
    setGenderSelected(e.target.value);
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const navigateToManagementPage = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/customer/management");
    }, DELAYED_TIME);
  };

  const onChangeCity = (event) => {
    let districtsFilteredByCity = districts?.filter((item) => item.cityId === event) ?? [];
    setDistrictsByCityId(districtsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.address.districtId = null;
    formValue.address.wardId = null;
    formValue.districtId = null;
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const onChangeDistrict = (event) => {
    let wardsFilteredByCity = wards?.filter((item) => item.districtId === event) ?? [];
    setWardsByDistrictId(wardsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.address.wardId = null;
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const renderAddress = () => {
    if (isDefaultCountry) {
      return (
        <>
          <Row gutter={[25, 25]} className="form-row">
            <Col sm={24} md={24} className="w-100">
              <h4 className="fnb-form-label">{pageData.address}</h4>
              <Form.Item className="form-create-customer" name={["address", "address1"]}>
                <Input className="fnb-input" size="large" placeholder={pageData.addressPlaceholder} maxLength={255} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[25, 25]} className="form-row">
            <Col sm={24} md={8} className="w-100">
              <h4 className="fnb-form-label">{pageData.province}</h4>
              <Form.Item name={["address", "cityId"]} className="last-item">
                <FnbSelectSingle
                  size="large"
                  placeholder={pageData.selectProvince}
                  onChange={onChangeCity}
                  showSearch
                  autoComplete="none"
                  option={cities?.map((item, index) => ({
                    id: item.id,
                    name: item.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={8} className="w-100">
              <h4 className="fnb-form-label">{pageData.district}</h4>
              <Form.Item name={["address", "districtId"]} className="last-item">
                <FnbSelectSingle
                  size="large"
                  placeholder={pageData.selectDistrict}
                  onChange={onChangeDistrict}
                  showSearch
                  autoComplete="none"
                  option={districtsByCityId?.map((item, index) => ({
                    id: item.id,
                    name: item.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={8} className="w-100">
              <h4 className="fnb-form-label">{pageData.ward}</h4>
              <Form.Item name={["address", "wardId"]} className="last-item">
                <FnbSelectSingle
                  size="large"
                  placeholder={pageData.selectWard}
                  showSearch
                  option={wardsByDistrictId?.map((item, index) => ({
                    id: item.id,
                    name: item.name,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      );
    }

    return (
      <>
        <Row gutter={[25, 25]} className="form-row">
          <Col sm={24} md={12} className="w-100">
            <h4 className="fnb-form-label">{pageData.labelAddress}</h4>
            <Form.Item className="form-create-customer" name={["address", "address1"]}>
              <Input className="fnb-input" size="large" placeholder={pageData.inputAddressTwo} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[25, 25]} className="form-row">
          <Col sm={24} md={8} className="w-100">
            <h4 className="fnb-form-label">{pageData.labelAddressTwo}</h4>
            <Form.Item name={["address", "address2"]} className="last-item">
              <Input className="fnb-input" size="large" placeholder={pageData.inputAddressTwo} />
            </Form.Item>
          </Col>
          <Col sm={24} md={8} className="w-100">
            <h4 className="fnb-form-label">{pageData.labelCity}</h4>
            <Form.Item name={["address", "cityTown"]} className="last-item">
              <Input className="fnb-input" placeholder={pageData.inputCity} />
            </Form.Item>
          </Col>

          <Col sm={24} md={8} className="w-100">
            <h4 className="fnb-form-label">{pageData.labelState}</h4>
            <Form.Item name={["address", "stateId"]} className="last-item">
              <FnbSelectSingle
                placeholder={pageData.selectProvinceStateRegion}
                option={states?.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={navigateToManagementPage}
        isChangeForm={isChangeForm}
      />
      <Row className="fnb-row-page-header">
        <Space className="page-title">
          <PageTitle content={pageData.title} />
        </Space>
        <ActionButtonGroup
          arrayButton={[
            {
              action: <FnbAddNewButton onClick={onFinish} className="btn-add" text={pageData.btnSave} />,
              permission: PermissionKeys.CREATE_CUSTOMER,
            },
            {
              action: (
                <p className="fnb-text-action-group mr-3 action-cancel" onClick={clickCancel}>
                  {pageData.btnCancel}
                </p>
              ),
              permission: null,
            },
          ]}
        />
      </Row>

      <div className="clearfix"></div>
      <Form
        autoComplete="off"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFieldsChange={() => {
          if (!isChangeForm) setIsChangeForm(true);
        }}
        form={form}
      >
        <Content>
          <Card className="fnb-card">
            <Row>
              <Col span={24}>
                <h5 className="title-group">{pageData.generalInformation}</h5>
              </Col>
            </Row>
            <Row style={{ display: "grid" }}>
              <Row gutter={[25, 25]} className="form-row">
                <Col sm={24} md={12} className="w-100">
                  <h4 className="fnb-form-label">{pageData.platform}</h4>
                  <Form.Item className="form-create-customer platform-detail">
                    <AdminWebIcon />
                    <span className="text-detail">{platformList.AdminWeb}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[25, 25]} className="form-row">
                <Col sm={24} md={8} className="w-100">
                  <h4 className="fnb-form-label">
                    {pageData.name} <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    className="last-item"
                    name={"firstName"}
                    rules={[
                      { required: true, message: pageData.nameValidation },
                      { type: "string", warningOnly: true },
                      {
                        validator: (_, value) => (value.trim() !== "" ? Promise.resolve() : Promise.reject()),
                        message: `${pageData.name} ${pageData.mustBeBetweenOneAndHundredCharacters}`,
                      },
                      {
                        type: "string",
                        max: 100,
                        min: 1,
                        message: `${pageData.name} ${pageData.mustBeBetweenOneAndHundredCharacters}`,
                      },
                    ]}
                  >
                    <Input
                      className="fnb-input-with-count"
                      showCount
                      maxLength={100}
                      size="large"
                      placeholder={pageData.namePlaceholder}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={8} className="w-100">
                  <h4 className="fnb-form-label">{pageData.lastName}</h4>
                  <Form.Item
                    className="last-item"
                    name={"lastName"}
                    rules={[
                      { type: "string", warningOnly: true },
                      {
                        type: "string",
                        max: 100,
                        min: 1,
                      },
                    ]}
                  >
                    <Input
                      className="fnb-input-with-count"
                      showCount
                      maxLength={100}
                      size="large"
                      placeholder={pageData.lastNamePlaceholder}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={8} className="w-100">
                  <h4 className="fnb-form-label">{pageData.country}</h4>
                  <Form.Item
                    className="form-create-customer"
                    initialValue={defaultCountryId}
                    name={["address", "countryId"]}
                    rules={[{ required: true, message: pageData.countryValidation }]}
                  >
                    <FnbSelectSingle
                      defaultValue={defaultCountryId}
                      size="large"
                      placeholder={pageData.selectCountry}
                      onChange={(value) => {
                        if (value && value !== defaultCountryId) {
                          setIsDefaultCountry(false);
                        } else {
                          setIsDefaultCountry(true);
                        }
                        let country = countries?.find((item) => item.id === value);
                        setPhonecode(country.phonecode);
                      }}
                      showSearch
                      autoComplete="none"
                      option={countries?.map((item, index) => ({
                        id: item.id,
                        name: item.nicename,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[25, 25]} className="form-row">
                <Col sm={24} md={12} className="w-100">
                  <h4 className="fnb-form-label">
                    {pageData.phone}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    className="last-item"
                    name={"phone"}
                    rules={[
                      {
                        required: true,
                        message: pageData.phoneValidation,
                      },
                      {
                        pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                        message: pageData.validPhonePattern,
                      },
                    ]}
                  >
                    <Input
                      className="fnb-input-addon-before"
                      size="large"
                      placeholder={pageData.phonePlaceholder}
                      addonBefore={prefixSelector}
                      maxLength={15}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} className="w-100">
                  <h4 className="fnb-form-label">{pageData.email}</h4>
                  <Form.Item
                    className="form-create-customer"
                    name={"email"}
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
                    <Input className="fnb-input" size="large" placeholder={pageData.emailPlaceholder} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[25, 25]} className="form-row">
                <Col sm={24} md={12} className="w-100">
                  <h4 className="fnb-form-label">{pageData.birthday}</h4>
                  <Form.Item name={"birthDay"} className="last-item">
                    <DatePicker
                      suffixIcon={<CalendarNewIcon />}
                      className="fnb-date-picker w-100"
                      format={DateFormat.DD_MM_YYYY}
                      onChange={(date) => setStartDate(date)}
                      placeholder={pageData.birthdayPlaceholder}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} className="w-100">
                  <h4 className="fnb-form-label">{pageData.gender}</h4>
                  <Form.Item
                    name={"gender"}
                    className="form-create-customer form-gender"
                    style={{ marginBottom: "34.14px !important" }}
                  >
                    <Radio.Group onChange={onGenderChange} defaultValue={genderSelected}>
                      <Radio value={CustomerGenderConstant.Female}>{pageData.female}</Radio>
                      <Radio className="last-gender-option" value={CustomerGenderConstant.Male}>
                        {pageData.male}
                      </Radio>
                      <Radio className="last-gender-option" value={CustomerGenderConstant.Other}>
                        {pageData.other}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              {renderAddress()}
              <Row gutter={[25, 25]} className="form-row">
                <Col span={24} className="form-row">
                  <h4 className="fnb-form-label">{pageData.tag}</h4>
                  <SelectCustomerTagComponent
                    tagDataTemp={tagDataTemp}
                    tags={tags}
                    setTags={setTags}
                    setTagError={setTagError}
                    setIsChangeForm={setIsChangeForm}
                  />
                  <span hidden={!tagError} className="customer-tag-error-message">
                    {pageData.limitTagMessage}
                  </span>
                </Col>
              </Row>
              <Row gutter={[25, 25]} className="last-row">
                <Col span={24} className="form-row">
                  <h4 className="fnb-form-label">{pageData.note}</h4>
                  <Form.Item
                    name={"note"}
                    rules={[
                      {
                        max: 1000,
                        message: pageData.descriptionMaximum,
                      },
                    ]}
                  >
                    <FnbTextArea showCount maxLength={1000} rows={4}></FnbTextArea>
                  </Form.Item>
                </Col>
              </Row>
            </Row>
          </Card>
        </Content>
      </Form>
    </>
  );
}
