import { Button, Col, Image, Row, Space, Tag, Tooltip, message } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import PageTitle from "components/page-title";
import { CustomerGenderConstant } from "constants/customer.constant";
import { images } from "constants/images.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { platformNames } from "constants/platform.constants";
import { ClassicMember, DateFormat } from "constants/string.constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { formatCurrency, formatNumber } from "utils/helpers";
import "./detail-customer.scss";
import { OtherFoodyPlatformString } from "constants/other-foody-platform.constants";

export default function DetailCustomerPage(props) {
  const { t, customerDataService, match, history } = props;

  const pageData = {
    btnEdit: t("button.edit"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    btnLeave: t("button.leave"),
    allowedLetterAndNumber: t("form.allowedLetterAndNumber"),
    code: t("table.code"),
    leaveForm: t("messages.leaveForm"),
    confirmation: t("leaveDialog.confirmation"),
    confirmLeave: t("button.confirmLeave"),
    discard: t("button.discard"),
    fullName: t("customer.fullName"),
    firstName: t("customer.addNewForm.firstName"),
    lastName: t("customer.addNewForm.lastName"),
    name: t("customer.addNewForm.name"),
    phone: t("customer.addNewForm.phone"),
    email: t("customer.addNewForm.email"),
    birthday: t("customer.addNewForm.birthday"),
    gender: t("customer.gender"),
    female: t("customer.female"),
    male: t("customer.addNewForm.male"),
    note: t("customer.addNewForm.note"),
    country: t("form.country"),
    province: t("form.province"),
    district: t("form.district"),
    ward: t("form.ward"),
    stateProvinceRegion: t("form.stateProvinceRegion"),
    selectProvinceStateRegion: t("form.selectProvinceStateRegion"),
    selectDistrict: t("form.selectDistrict"),
    validDistrict: t("form.validDistrict"),
    selectWard: t("form.selectWard"),
    uploadImage: t("productManagement.generalInformation.uploadImage"),
    backTo: t("button.backTo"),
    customerManagement: t("customer.title"),
    address: t("customer.addNewForm.address"),
    addressTwo: t("form.addressTwo"),
    city: t("form.city"),
    state: t("form.state"),
    rank: t("customer.rank"),
    rewardPoint: t("customer.updateForm.rewardPoint"),
    totalOrder: t("customer.updateForm.totalOrder"),
    totalMoney: t("customer.updateForm.totalMoney"),
    generalInformation: t("customer.generalInformation"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    customerDeleteSuccess: t("customer.customerDeleteSuccess"),
    customerDeleteFail: t("customer.customerDeleteFail"),
    goBack: t("customer.goBack"),
    platformTitle: t("platform.title"),
    other: t("customer.addNewForm.other"),
    tag: t("customer.tag"),
  };

  const [phonecode, setPhonecode] = useState(null);
  const [gender, setGender] = useState(CustomerGenderConstant.Female);
  const [countryName, setCountryName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [wardName, setWardName] = useState(null);
  const [districtName, setDistrictName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [customer, setCustomer] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

  const prefixSelector = <label>+{phonecode}</label>;
  const prepareAddressData = useSelector((state) => state?.session?.prepareAddressData);

  useEffect(() => {
    getInitDataAsync();
  }, [prepareAddressData]);

  const getInitDataAsync = async () => {
    let promises = [];
    promises.push(customerDataService.getCustomerByIdAsync(match?.params?.customerId));
    let [customerResponse] = await Promise.all(promises);

    if (prepareAddressData) {
      /// Meta data
      const { states, countries, cities, districts, wards, defaultCountryStore, defaultCountry } = prepareAddressData;
      setPhonecode(defaultCountryStore?.phonecode);
      setCountryName(defaultCountryStore?.nicename);

      let cityId = null;
      let districtId = null;
      let wardId = null;
      let countryId = null;
      let stateId = null;
      /// Set customer data
      if (customerResponse) {
        const { customer } = customerResponse;
        countryId = customer?.customerAddress?.countryId;
        cityId = customer?.customerAddress?.cityId;
        districtId = customer?.customerAddress?.districtId;
        wardId = customer?.customerAddress?.wardId;
        stateId = customer?.customerAddress?.stateId;
        setCustomer(customer);
        setGender(customer?.gender);

        if (countryId && countryId !== defaultCountry?.id) {
          setIsDefaultCountry(false);
        }

        let country = countries?.filter((item) => item.id === countryId) ?? [];
        if (country.length > 0) {
          setCountryName(country[0]?.name);
          setPhonecode(country[0]?.phonecode);
        }

        let state = states?.filter((item) => item.id === stateId) ?? [];
        if (state.length > 0) {
          setStateName(state[0]?.name);
        }

        let city = cities?.filter((item) => item.id === cityId) ?? [];
        if (city.length > 0) {
          setCityName(city[0]?.name);
        }

        let district = districts?.filter((item) => item.id === districtId) ?? [];
        if (district.length > 0) {
          setDistrictName(district[0]?.name);
        }

        let ward = wards?.filter((item) => item.id === wardId) ?? [];
        if (ward.length > 0) {
          setWardName(ward[0]?.name);
        }
      }
    }
  };

  const gotoEditCustomerPage = () => {
    history.push(`/customer/edit/${match?.params?.customerId}`);
  };

  const onDeleteCustomer = () => {
    setShowConfirm(true);
  };

  const handleDeleteItem = async (id) => {
    await customerDataService.deleteCustomerByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.customerDeleteSuccess);
        history.push(`/customer/management`);
      } else {
        message.error(pageData.customerDeleteFail);
      }
    });
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const goBack = () => {
    history.push(`/customer/management`);
  };

  const getNameGender = (valueGender) => {
    let nameGender = "";
    if (valueGender === parseInt(CustomerGenderConstant.Male)) {
      nameGender = pageData.male;
    } else if (valueGender === parseInt(CustomerGenderConstant.Female)) {
      nameGender = pageData.female;
    } else {
      nameGender = pageData.other;
    }
    return nameGender;
  };

  const platformIcon = platformNames.find((x) => x.name === customer?.platformName)?.icon;

  const renderTagComponent = () => {
    return (
      <Space size={[0, 8]} wrap>
        {customer?.tags?.map((tag, index) => {
          const isLongTag = tag?.name?.length > 100;
          const tagElem = (
            <Tag
              key={tag?.name}
              closable={false}
              style={{
                userSelect: "none",
                backgroundColor: tag?.color,
              }}
              className="tag-customer-custom"
            >
              <span onDoubleClick={(e) => {}}>{isLongTag ? `${tag?.name?.slice(0, 20)}...` : tag?.name}</span>
            </Tag>
          );

          return isLongTag ? (
            <Tooltip title={tag?.name} key={tag?.name}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
      </Space>
    );
  };

  const getOtherCustomerPlatformIcon = (foodyPlatformId, foodyPlatformLogo) => {
    switch (foodyPlatformId) {
      case OtherFoodyPlatformString.GrabFood:
        return <Image preview={false} src={images.grabFoodLogo} style={{ width: 24, height: 24 }} />;
      case OtherFoodyPlatformString.GoFood:
        return <Image preview={false} src={images.goFoodLogo} style={{ width: 24, height: 24 }} />;
      case OtherFoodyPlatformString.BeFood:
        return <Image preview={false} src={images.beFoodLogo} style={{ width: 24, height: 24 }} />;
      case OtherFoodyPlatformString.Baemin:
        return <Image preview={false} src={images.baeminLogo} style={{ width: 24, height: 24 }} />;
      case OtherFoodyPlatformString.ShopeeFood:
        return <Image preview={false} src={images.shopeeFoodLogo} style={{ width: 24, height: 24 }} />;
      default:
        if (foodyPlatformLogo) {
          return (
            <Image
              preview={false}
              src={foodyPlatformLogo ?? images.defaultFoodyPlatformLogo}
              style={{ width: 24, height: 24 }}
            />
          );
        }
        return <Image preview={false} src={images.defaultFoodyPlatformLogo} style={{ width: 24, height: 24 }} />;
    }
  };

  const renderCustomerPlatform = (data) => {
    if (data?.platformName) {
      return (
        <>
          {platformIcon} {data?.platformName}
        </>
      );
    } else {
      if (data?.otherCustomerPlatform) {
        return (
          <>
            {getOtherCustomerPlatformIcon(
              data?.otherCustomerPlatform?.foodyPlatformId?.toLowerCase(),
              data?.otherCustomerPlatform?.logo,
            )}{" "}
            {data?.otherCustomerPlatform?.name}
          </>
        );
      }
      return null;
    }
  };

  return (
    <div className={isTabletOrMobile ? "responsive" : ""}>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle content={customer?.fullName} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button type="primary" className="btn-edit" onClick={() => gotoEditCustomerPage()}>
                    {pageData.btnEdit}
                  </Button>
                ),
                permission: PermissionKeys.EDIT_CUSTOMER,
              },
              {
                action: (
                  <a onClick={goBack} className="action-cancel">
                    {pageData.btnLeave}
                  </a>
                ),
                permission: null,
              },
              {
                action: (
                  <a className="action-delete" onClick={() => onDeleteCustomer()}>
                    {pageData.btnDelete}
                  </a>
                ),
                permission: PermissionKeys.DELETE_CUSTOMER,
              },
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>

      {isTabletOrMobile ? (
        <>
          <div className="customer-detail-card-responsive">
            <div className="customer-detail-box">
              <div className="card-image">
                <Image
                  className="thumbnail"
                  width={176}
                  src={customer?.thumbnail ?? "error"}
                  fallback={images.imgDefault}
                />
              </div>

              <div className="info-container">
                <div className="platform-detail">
                  <span className="text-left">{pageData.platformTitle}</span>
                  <div className="text-right">{renderCustomerPlatform(customer)}</div>
                </div>

                <div className="rank-box">
                  <span className="text-left">{pageData.rank}</span>
                  <span
                    className="rank-badge"
                    style={
                      customer.badgeColor && customer.badgeColor !== ""
                        ? { background: customer.badgeColor }
                        : { background: "#efbb00" }
                    }
                  >
                    {customer?.rank ?? ClassicMember}
                  </span>
                </div>
                <div className="other-info-box">
                  <div className="reward">
                    <span className="text-left">{pageData.rewardPoint}</span>
                    <span className="reward-point">{formatNumber(customer?.rewardPoint)}</span>
                  </div>
                  <div className="total">
                    <span className="text-left">{pageData.totalOrder}</span>
                    <span className="total-amount">
                      <b>{formatNumber(customer?.totalOrder)}</b>
                    </span>
                  </div>
                  <div className="total">
                    <span className="text-left">{pageData.totalMoney}</span>
                    <span className="total-amount">
                      <b>{formatCurrency(customer?.totalMoney)}</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="general-info-card-responsive">
            <div className="title-session">
              <span>{pageData.generalInformation}</span>
            </div>
            <div className="detail-container">
              <div>
                <p className="text-label">{pageData.name}</p>
                <p className="text-detail">{customer?.firstName ?? "-"}</p>
              </div>
              <div>
                <p className="text-label">{pageData.lastName}</p>
                <p className="text-detail">{customer?.lastName ?? "-"}</p>
              </div>
              <div>
                <p className="text-label">{pageData.country}</p>
                <p className="text-detail">{countryName ?? "-"}</p>
              </div>
              <div>
                <p className="text-label">{pageData.phone}</p>
                <p className="text-detail">
                  {prefixSelector} {customer?.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-label">{pageData.email}</p>
                <p className="text-detail">{customer?.email ?? "-"}</p>
              </div>
              <div>
                <p className="text-label">{pageData.birthday}</p>
                <p className="text-detail">
                  {customer?.birthday ? moment.utc(customer?.birthday).local().format(DateFormat.DD_MM_YYYY) : "-"}
                </p>
              </div>
              <div>
                <p className="text-label">{pageData.gender}</p>
                <p className="text-detail">{getNameGender(gender)}</p>
              </div>
              <div>
                <p className="text-label">{pageData.address}</p>
                <p className="text-detail">{customer?.customerAddress?.address1 ?? "-"}</p>
              </div>
              {isDefaultCountry ? (
                <>
                  <div>
                    <p className="text-label">{pageData.province}</p>
                    <p className="text-detail">{cityName ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-label">{pageData.district}</p>
                    <p className="text-detail">{districtName ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-label">{pageData.ward}</p>
                    <p className="text-detail">{wardName ?? "-"}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-label">{pageData.addressTwo}</p>
                    <p className="text-detail">{customer?.customerAddress?.address2 ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-label">{pageData.city}</p>
                    <p className="text-detail">{customer?.customerAddress?.cityTown ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-label">{pageData.state}</p>
                    <p className="text-detail">{stateName ?? "-"}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-label">{pageData.tag}</p>
                <p className="text-detail" style={{ overflowY: "auto", maxHeight: "288px" }}>
                  {renderTagComponent()}
                </p>
              </div>
              <div>
                <p className="text-label">{pageData.note}</p>
                <p className="text-detail">
                  <div className="text-overflow">
                    <Paragraph
                      style={{ maxWidth: "inherit" }}
                      placement="top"
                      ellipsis={{ tooltip: customer?.note ?? "-" }}
                      color="#50429B"
                    >
                      <span className="text-name">{customer?.note ?? "-"}</span>
                    </Paragraph>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="customer-detail-card">
            <div className="title-session">
              <span>{pageData.generalInformation}</span>
            </div>
            <Row className="pb-4">
              <Col span={8}>
                <div className="left-card">
                  <div className="left-card-image">
                    <Image
                      className="thumbnail"
                      width={176}
                      src={customer?.thumbnail ?? "error"}
                      fallback={images.imgDefault}
                    />
                  </div>
                  <div className="info-container">
                    <div className="platform-detail">
                      <span className="text-left">{pageData.platformTitle}</span>
                      <div className="text-right">{renderCustomerPlatform(customer)}</div>
                    </div>
                    <div className="rank-box">
                      <span className="text-left">{pageData.rank}</span>
                      <span
                        className="rank-badge"
                        style={
                          customer.badgeColor && customer.badgeColor !== ""
                            ? { background: customer.badgeColor }
                            : { background: "#efbb00" }
                        }
                      >
                        {customer?.rank ?? ClassicMember}
                      </span>
                    </div>
                    <div className="other-info-box">
                      <div className="reward">
                        <span className="text-left">{pageData.rewardPoint}</span>
                        <span className="reward-point">{formatNumber(customer?.rewardPoint)}</span>
                      </div>
                      <div className="total">
                        <span className="text-left">{pageData.totalOrder}</span>
                        <span className="total-amount">
                          <b>{formatNumber(customer?.totalOrder)}</b>
                        </span>
                      </div>
                      <div className="total">
                        <span className="text-left">{pageData.totalMoney}</span>
                        <span className="total-amount">
                          <b>{formatCurrency(customer?.totalMoney)}</b>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={16}>
                <Row>
                  <Col span={12}>
                    <div className="detail-container-left">
                      <div>
                        <p className="text-label">{pageData.name}</p>
                        <p className="text-detail">{customer?.firstName ?? "-"}</p>
                      </div>
                      <div>
                        <p className="text-label">{pageData.country}</p>
                        <p className="text-detail">{countryName ?? "-"}</p>
                      </div>
                      <div>
                        <p className="text-label">{pageData.phone}</p>
                        <p className="text-detail">
                          {prefixSelector} {customer?.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-label">{pageData.email}</p>
                        <p className="text-detail">{customer?.email ?? "-"}</p>
                      </div>
                      <div>
                        <p className="text-label">{pageData.birthday}</p>
                        <p className="text-detail">
                          {customer?.birthday
                            ? moment.utc(customer?.birthday).local().format(DateFormat.DD_MM_YYYY)
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-label">{pageData.gender}</p>
                        <p className="text-detail">{getNameGender(gender)}</p>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="detail-container-right">
                      <div>
                        <p className="text-label">{pageData.lastName}</p>
                        <p className="text-detail">{customer?.lastName ?? "-"}</p>
                      </div>
                      <div>
                        <p className="text-label">{pageData.address}</p>
                        <p className="text-detail">{customer?.customerAddress?.address1 ?? "-"}</p>
                      </div>
                      {isDefaultCountry ? (
                        <>
                          <div>
                            <p className="text-label">{pageData.province}</p>
                            <p className="text-detail">{cityName ?? "-"}</p>
                          </div>
                          <div>
                            <p className="text-label">{pageData.district}</p>
                            <p className="text-detail">{districtName ?? "-"}</p>
                          </div>
                          <div>
                            <p className="text-label">{pageData.ward}</p>
                            <p className="text-detail">{wardName ?? "-"}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-label">{pageData.addressTwo}</p>
                            <p className="text-detail">{customer?.customerAddress?.address2 ?? "-"}</p>
                          </div>
                          <div>
                            <p className="text-label">{pageData.city}</p>
                            <p className="text-detail">{customer?.customerAddress?.cityTown ?? "-"}</p>
                          </div>
                          <div>
                            <p className="text-label">{pageData.state}</p>
                            <p className="text-detail">{stateName ?? "-"}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="detail-container-left">
                      <p className="text-label">{pageData.tag}</p>
                      <p className="text-detail" style={{ overflowY: "auto", maxHeight: "288px" }}>
                        {renderTagComponent()}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div className="detail-container-left">
                      <p className="text-label">{pageData.note}</p>
                      <p className="text-detail">
                        <div className="text-overflow">
                          <Paragraph
                            style={{ maxWidth: "inherit" }}
                            placement="top"
                            ellipsis={{ tooltip: customer?.note ?? "-" }}
                            color="#50429B"
                          >
                            <span className="text-name">{customer?.note ?? "-"}</span>
                          </Paragraph>
                        </div>
                      </p>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </>
      )}
      <DeleteConfirmComponent
        title={pageData.confirmDelete}
        content={formatDeleteMessage(customer?.fullName)}
        okText={pageData.btnDelete}
        skipPermission={true}
        cancelText={pageData.btnIgnore}
        permission={PermissionKeys.DELETE_CUSTOMER}
        onOk={() => handleDeleteItem(match?.params?.customerId)}
        onCancel={onDiscard}
        visible={showConfirm}
      />
    </div>
  );
}
