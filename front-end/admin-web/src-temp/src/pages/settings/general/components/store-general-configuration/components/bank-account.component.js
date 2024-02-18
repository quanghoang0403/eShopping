import { Button, Card, Col, Form, Row, message } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import "../store-general-configuration.style.scss";
import dataBank from "../../../../../../assets/json/bank-infomation.json";
import { StoreSettingConstants } from "constants/store-setting.constants";

export const CardBankAccount = forwardRef((props, ref) => {
  const { t, className, storeDataService } = props;
  const dataBankInfo = dataBank.data;
  const [formBankAccount] = Form.useForm();
  const [initDataAddress, setInitDataAddress] = useState(null);
  const [isDefaultBankCountry, setIsDefaultBankCountry] = useState(true);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [acpId, setAcpId] = useState("");
  const [bankName, setBankName] = useState("");

  const pageData = {
    btnUpdate: t("button.update"),
    enter: t("form.enter"),
    storeName: t("registerAccount.storeName"),
    store: t("settings.tabStore"),
    updateSuccess: t("messages.isUpdatedSuccessfully"),
    province: t("form.province"),
    selectProvince: t("form.selectProvince"),
    validSelectProvince: t("form.validSelectProvince"),
    leaveForm: t("messages.leaveForm"),
    confirmation: t("leaveDialog.confirmation"),
    confirmLeave: t("button.confirmLeave"),
    country: t("form.country"),
    discard: t("button.discard"),
    titleBank: t("storeBankAccount.title"),
    accountHolder: t("storeBankAccount.accountHolder"),
    accountNumber: t("storeBankAccount.accountNumber"),
    bankName: t("storeBankAccount.bankName"),
    bankBranchName: t("storeBankAccount.bankBranchName"),
    swiftCode: t("storeBankAccount.swiftCode"),
    routingNumber: t("storeBankAccount.routingNumber"),
    swiftCodeMaxLength: 65,
    routingNumberMaxLength: 100,
    kitchenSetting: t("store.kitchenSetting"),
    storeHasKitchen: t("store.storeHasKitchen.title"),
    ifNotHaveKitchen: t("store.storeHasKitchen.tooltip.ifNotHaveKitchen"),
    orderNotHaveKitchen: t("store.storeHasKitchen.tooltip.orderNotHaveKitchen"),
    ifHasKitchen: t("store.storeHasKitchen.tooltip.ifHasKitchen"),
    orderHasKitchen: t("store.storeHasKitchen.tooltip.orderHasKitchen"),
    autoPrintStamp: t("store.autoPrintStamp.title"),
    operation: t("store.operation"),
    paymentFirst: t("store.paymentFirst"),
    paymentLater: t("store.paymentLater"),
    paymentType: t("store.paymentType"),
    tooltipPaymentFirst: t("store.tooltipPaymentFirst"),
    tooltipPaymentLater: t("store.tooltipPaymentLater"),
    inventoryTitle: t("table.inventory"),
    inventory: t("store.inventory"),
    tooltipInventory: t("store.tooltipInventory"),
    generalInformation: t("title.generalInformation"),
  };

  useImperativeHandle(ref, () => ({
    setInitBankAccountData(
      storeBankAccountResponse,
      prepareAddressDataResponse
    ) {
      setInitDataAddress(prepareAddressDataResponse);
      initDataBankAccount(storeBankAccountResponse, prepareAddressDataResponse);
    },
  }));

  const initDataBankAccount = (
    storeBankAccountResponse,
    prepareAddressDataResponse
  ) => {
    const { countries, cities, defaultCountry } = prepareAddressDataResponse;
    setCountries(countries);
    setCities(cities);

    if (storeBankAccountResponse.storeBankAccount) {
      const { storeBankAccount } = storeBankAccountResponse;
      formBankAccount.setFieldsValue({
        storeBankAccount: {
          ...storeBankAccount,
        },
      });
      if (storeBankAccount?.acpId) {
        setBankName(
          dataBankInfo?.find((bank) => bank?.bin === storeBankAccount?.acpId)
            ?.name
        );
      }
      onChangeCountryBank(storeBankAccount?.countryId);
    } else {
      let formValue = formBankAccount.getFieldsValue();
      formValue.storeBankAccount.countryId =
        prepareAddressDataResponse?.defaultCountryStore?.id;
      formBankAccount.setFieldsValue(formValue);
      onChangeCountryBank(prepareAddressDataResponse?.defaultCountryStore?.id);
    }
    storeBankAccountResponse?.storeBankAccount?.countryId === defaultCountry?.id
      ? setIsDefaultBankCountry(true)
      : setIsDefaultBankCountry(false);
  };

  const onChangeCountryBank = (countryId) => {
    countryId === initDataAddress?.defaultCountry?.id
      ? setIsDefaultBankCountry(true)
      : setIsDefaultBankCountry(false);
  };

  const onChangeForm = () => {
    if (!isChangeForm) {
      setIsChangeForm(true);
    }
  };

  const onSaveBankAccount = async () => {
    const formValues = formBankAccount.getFieldsValue();
    const { storeBankAccount, storeSetting } = formValues;
    const storeBankAccountConfig = {
      storeBankAccount: { ...storeBankAccount, bankName },
      storeSetting,
    };
    const res = await storeDataService?.updateStoreManagementAsync(
      storeBankAccountConfig
    );
    if (res) {
      message.success(`${pageData.titleBank} ${pageData.updateSuccess}`);
    }
  };

  const onChangeBankName = (bin) => {
    if (!bin) return;
    setAcpId(bin);
    setBankName(dataBankInfo.find((x) => x.bin === bin).name);
  };

  return (
    <div className={className}>
      <Card className="fnb-card w-100 card-bank-account">
        <Form form={formBankAccount} autoComplete="off" onChange={onChangeForm}>
          <Row className="card-title-box">
            <Col span={12} className="d-flex-align-center">
              <h3 className="card-title">{pageData.titleBank}</h3>
            </Col>
            <Col span={12}>
              {isChangeForm && (
                <Button
                  onClick={onSaveBankAccount}
                  type="primary"
                  className="btn-save float-right"
                >
                  {pageData.btnUpdate}
                </Button>
              )}
            </Col>
          </Row>
          <Row className="my-24" gutter={[24, 24]}>
            <Col lg={12} span={24}>
              <h4 className="fnb-form-label">{pageData.country}</h4>
              <Form.Item
                name={["storeBankAccount", "countryId"]}
                rules={[{ required: true }]}
                className="mb-0"
              >
                <FnbSelectSingle
                  size="large"
                  showSearch
                  autoComplete="none"
                  onChange={(e) => {
                    onChangeCountryBank(e);
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
              <h4 className="fnb-form-label">{pageData.bankName}</h4>
              <Form.Item
                name={["storeBankAccount", "acpId"]}
                className="mb-0"
                rules={[
                  {
                    message: pageData.validBankName,
                    required: true,
                  },
                ]}
              >
                <FnbSelectSingle
                  placeholder={`${pageData.enter} ${pageData.bankName}`}
                  option={dataBankInfo?.map((item, index) => ({
                    id: item.bin,
                    name: item.shortName + " - " + item.name,
                    key: index + item.id,
                  }))}
                  onChange={onChangeBankName}
                  showSearch
                />
              </Form.Item>
            </Col>
            <Col lg={12} span={24}>
              <h4 className="fnb-form-label">{pageData.accountHolder}</h4>
              <Form.Item
                name={["storeBankAccount", "accountHolder"]}
                className="mb-0"
              >
                <FnbInput
                  placeholder={`${pageData.enter} ${pageData.accountHolder}`}
                  maxLength={100}
                />
              </Form.Item>
            </Col>
            <Col lg={12} span={24}>
              <h4 className="fnb-form-label">{pageData.accountNumber}</h4>
              <Form.Item
                name={["storeBankAccount", "accountNumber"]}
                rules={[
                  {
                    pattern: /^\d+$/g,
                    message: pageData.allowNumberOnly,
                  },
                ]}
                className="mb-0"
              >
                <FnbInput
                  placeholder={`${pageData.enter} ${pageData.accountNumber}`}
                  maxLength={100}
                />
              </Form.Item>
            </Col>
            {isDefaultBankCountry ? (
              <>
                <Col lg={12} span={24}>
                  <h4 className="fnb-form-label">{pageData.province}</h4>
                  <Form.Item
                    name={["storeBankAccount", "cityId"]}
                    className="mb-0"
                  >
                    <FnbSelectSingle
                      size="large"
                      placeholder={pageData.selectProvince}
                      showSearch
                      autoComplete="none"
                      onChange={onChangeForm}
                      option={cities?.map((item, index) => ({
                        id: item.id,
                        name: item.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col lg={12} span={24}>
                  <h4 className="fnb-form-label">{pageData.bankBranchName}</h4>
                  <Form.Item
                    name={["storeBankAccount", "bankBranchName"]}
                    className="mb-0"
                  >
                    <FnbInput
                      placeholder={`${pageData.enter} ${pageData.bankBranchName}`}
                      maxLength={100}
                    />
                  </Form.Item>
                </Col>
              </>
            ) : (
              <>
                <Col lg={12} span={24}>
                  <h4 className="fnb-form-label">{pageData.swiftCode}</h4>
                  <Form.Item
                    name={["storeBankAccount", "swiftCode"]}
                    className="mb-0"
                  >
                    <FnbInput
                      maxLength={pageData.swiftCodeMaxLength}
                      placeholder={`${pageData.enter} ${pageData.swiftCode}`}
                    />
                  </Form.Item>
                </Col>
                <Col lg={12} span={24}>
                  <h4 className="fnb-form-label">{pageData.routingNumber}</h4>
                  <Form.Item
                    name={["storeBankAccount", "routingNumber"]}
                    rules={[
                      {
                        pattern: /^\d+$/g,
                        message: pageData.allowNumberOnly,
                      },
                    ]}
                    className="mb-0"
                  >
                    <FnbInput
                      maxLength={pageData.routingNumberMaxLength}
                      placeholder={`${pageData.enter} ${pageData.routingNumber}`}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
          <Form.Item
            hidden
            name={["storeSetting"]}
            initialValue={StoreSettingConstants.BANK_ACCOUNT_CONFIG}
          ></Form.Item>
        </Form>
      </Card>
    </div>
  );
});
