import { Button, Card, Checkbox, Col, Form, InputNumber, Radio, Row, Space, Switch, Tooltip, message } from "antd";
import { EditFill, StoreGeneralConfigInfoCircleIcon, TrashFill } from "constants/icons.constants";
import { ReservationType, StoreSettingConstants } from "constants/store-setting.constants";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { checkOnKeyPressValidation } from "utils/helpers";
import "../store-general-configuration.style.scss";

export const CardOperationConfiguration = forwardRef((props, ref) => {
  const { t, className, storeDataService } = props;
  const [formOperation] = Form.useForm();
  const isMaxWidth780 = useMediaQuery({ maxWidth: 780 });
  const [isPaymentLater, setIsPaymentLater] = useState(false);
  const [isAutoConfirmOrder, setIsAutoConfirmOrder] = useState(false);
  const [isStoreHasKitchen, setIsStoreHasKitchen] = useState(false);
  const [isAutoPrintBillWhenCreateOrder, setIsAutoPrintBillWhenCreateOrder] = useState(false);
  const [isAutoPrintBillWhenDoPaymentForOrder, setIsAutoPrintBillWhenDoPaymentForOrder] = useState(false);
  const [isAllowPrintBillAtOrderManagement, setIsAllowPrintBillAtOrderManagement] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [initStoreOperationData, setInitStoreOperationData] = useState(null);
  const [initPaymentType, setInitPaymentType] = useState(false);
  const [isAllowReserveTable, setIsAllowReserveTable] = useState(false);
  const [isOrderSlipAutoPrintAfterCreate, setIsOrderSlipAutoPrintAfterCreate] = useState(false);

  const pageData = {
    btnUpdate: t("button.update"),
    updateSuccess: t("messages.isUpdatedSuccessfully"),
    paymentFirst: t("store.paymentFirst"),
    paymentLater: t("store.paymentLater"),
    autoConfirmOrder: t("store.autoConfirmOrder"),
    autoConfirmOrderAfter: t("store.autoConfirmOrderAfter"),
    autoConfirmOrderUnit: t("store.autoConfirmOrderUnit"),
    paymentType: t("store.paymentType"),
    tooltipPaymentFirst: t("store.tooltipPaymentFirst"),
    tooltipPaymentFirstMore: t("store.tooltipPaymentFirstMore"),
    tooltipPaymentLater: t("store.tooltipPaymentLater"),
    tooltipAutoConfirmOrder: t("store.tooltipAutoConfirmOrder"),
    tooltipPaymentLaterMore: t("store.tooltipPaymentLaterMore"),
    generalInformation: t("title.generalInformation"),
    title: t("store.operationConfiguration.title"),
    kitchen: t("store.operationConfiguration.kitchen"),
    cashier: t("store.operationConfiguration.cashier"),
    order: t("store.operationConfiguration.order"),
    storeHasKitchen: {
      title: t("store.operationConfiguration.storeHasKitchen.title"),
      tooltip: {
        kitchenOn: t("store.operationConfiguration.storeHasKitchen.tooltip.on"),
        kitchenOff: t("store.operationConfiguration.storeHasKitchen.tooltip.off"),
        ifNotHaveKitchen: t("store.operationConfiguration.storeHasKitchen.tooltip.ifNotHaveKitchen"),
        orderNotHaveKitchen: t("store.operationConfiguration.storeHasKitchen.tooltip.orderNotHaveKitchen"),
        ifHasKitchen: t("store.operationConfiguration.storeHasKitchen.tooltip.ifHasKitchen"),
        orderHasKitchen: t("store.operationConfiguration.storeHasKitchen.tooltip.orderHasKitchen"),
      },
    },
    printStamp: {
      title: t("store.operationConfiguration.printStamp.title"),
      kitchenAutoPrint: t("store.operationConfiguration.printStamp.kitchenAutoPrint"),
      whenCreateOrder: t("store.operationConfiguration.printStamp.whenCreateOrder"),
      atOrderManagement: t("store.operationConfiguration.printStamp.atOrderManagement"),
    },
    printBill: {
      title: t("store.operationConfiguration.printBill.title"),
      whenDoPayment: t("store.operationConfiguration.printBill.whenDoPayment"),
      whenCreateOrder: t("store.operationConfiguration.printBill.whenCreateOrder"),
      atOrderManagement: t("store.operationConfiguration.printBill.atOrderManagement"),
      billsWillBePrint: t("store.operationConfiguration.printBill.billsWillBePrint"),
      printOrderSlip: t("store.operationConfiguration.printBill.printOrderSlip"),
      autoPrintOrderSlipAfterCreate: t("store.operationConfiguration.printBill.autoPrintOrderSlipAfterCreate"),
      slipsWillBePrinted: t("store.operationConfiguration.printBill.slipsWillBePrinted"),
    },
    inventory: {
      title: t("store.operationConfiguration.inventory.title"),
      allowToSellProduct: t("store.operationConfiguration.inventory.allowToSellProduct"),
      tooltip: {
        on: t("store.operationConfiguration.inventory.tooltip.on"),
        off: t("store.operationConfiguration.inventory.tooltip.off"),
      },
    },
    updateSuccessfullyMessage: t("store.operationConfiguration.updateSuccessfullyMessage"),
    reserveTable: {
      title: t("store.operationConfiguration.reserveTable.title"),
      numberOfDaysAdvanceReservations: {
        title: t("store.operationConfiguration.reserveTable.numberOfDaysAdvanceReservations.title"),
        validate: t("store.operationConfiguration.reserveTable.numberOfDaysAdvanceReservations.validate"),
        numberValidate: t("store.operationConfiguration.reserveTable.numberOfDaysAdvanceReservations.numberValidate"),
        placeholder: t("store.operationConfiguration.reserveTable.numberOfDaysAdvanceReservations.placeholder"),
        days: t("store.operationConfiguration.reserveTable.numberOfDaysAdvanceReservations.days"),
      },
      reservationType: {
        title: t("store.operationConfiguration.reserveTable.reservationType.title"),
        staffArrange: t("store.operationConfiguration.reserveTable.reservationType.staffArrange"),
        lockPeriodTime: t("store.operationConfiguration.reserveTable.reservationType.lockPeriodTime"),
        fixedTime: t("store.operationConfiguration.reserveTable.reservationType.fixedTime"),
        comingSoon: t("store.operationConfiguration.reserveTable.reservationType.comingSoon"),
        lockTimeByHours: {
          validate: t("store.operationConfiguration.reserveTable.reservationType.lockTimeByHours.validate"),
          placeholder: t("store.operationConfiguration.reserveTable.reservationType.lockTimeByHours.placeholder"),
          hrs: t("store.operationConfiguration.reserveTable.reservationType.lockTimeByHours.hrs"),
        },
        addTime: t("store.operationConfiguration.reserveTable.reservationType.addTime"),
      },
    },
    cookingTime: {
      title: t("store.operationConfiguration.cookingTime.title"),
      averageTime: t("store.operationConfiguration.cookingTime.averageTime"),
      placeholder: t("store.operationConfiguration.cookingTime.placeholder"),
      unit: t("store.operationConfiguration.cookingTime.unit"),
    },
  };

  useImperativeHandle(ref, () => ({
    setInitOperationData(data) {
      if (data) {
        const store = data;
        store.reservationType = store.reservationType !== 0 ? store.reservationType : 1;
        store.numberOfDaysAdvanceReservations =
          store.numberOfDaysAdvanceReservations !== 0 ? store.numberOfDaysAdvanceReservations : "";
        formOperation.setFieldsValue(store);

        setIsStoreHasKitchen(store?.isStoreHasKitchen);
        setIsPaymentLater(store?.isPaymentLater);
        setIsAutoConfirmOrder(store?.isAutoConfirmOrder);
        setIsAutoPrintBillWhenCreateOrder(store?.isAutoPrintBillWhenCreateOrder);
        setIsAutoPrintBillWhenDoPaymentForOrder(store?.isAutoPrintBillWhenDoPaymentForOrder);
        setIsAllowPrintBillAtOrderManagement(store?.isAllowPrintBillAtOrderManagement);

        ///Bug 14224
        setInitPaymentType(store?.isPaymentLater);
        setInitStoreOperationData(store);

        setIsAutoPrintBillWhenCreateOrder(store?.isAutoPrintBillWhenCreateOrder);
        setIsAutoPrintBillWhenDoPaymentForOrder(store?.isAutoPrintBillWhenDoPaymentForOrder);
        setIsAllowPrintBillAtOrderManagement(store?.isAllowPrintBillAtOrderManagement);

        setIsAllowReserveTable(store?.isAllowReserveTable);
        setIsOrderSlipAutoPrintAfterCreate(store?.isOrderSlipAutoPrintAfterCreate);
      }
    },
  }));

  const onPaymentTypeChange = (e) => {
    const value = e.target.value;
    setIsPaymentLater(value);
    setIsChangeForm(true);

    let formValues = formOperation.getFieldsValue();
    ///Payment later
    if (value === true && value !== initPaymentType) {
      setDefaultFormValuesWhenChangePaymentType(formValues);
      formValues.isAutoPrintBillWhenCreateOrder = false;
      formValues.isAutoPrintBillWhenDoPaymentForOrder = true;
      formValues.isAllowPrintBillAtOrderManagement = true;
      formValues.isOrderSlipAutoPrintAfterCreate = false;

      setIsAutoPrintBillWhenCreateOrder(false);
      setIsAutoPrintBillWhenDoPaymentForOrder(true);
      setIsAllowPrintBillAtOrderManagement(true);
      setIsOrderSlipAutoPrintAfterCreate(false);
    }

    ///Payment first
    else if (value === false && value !== initPaymentType) {
      setDefaultFormValuesWhenChangePaymentType(formValues);
      formValues.isAutoPrintBillWhenCreateOrder = true;
      formValues.isAllowPrintBillAtOrderManagement = true;
      formValues.isOrderSlipAutoPrintAfterCreate = false;

      setIsAutoPrintBillWhenCreateOrder(true);
      setIsAllowPrintBillAtOrderManagement(true);
      setIsOrderSlipAutoPrintAfterCreate(false);
    }

    ///Move back to initial Payment type
    else if (value === initPaymentType) {
      setDefaultFormValuesWhenMoveBackToInitialPaymentType(formValues, initStoreOperationData);
    }
    formOperation.setFieldsValue(formValues);
  };

  const setDefaultFormValuesWhenChangePaymentType = (formValues) => {
    formValues.numberOfBillsPrintWhenCreateOrder = 1;
    formValues.numberOfBillsPrintWhenDoPaymentForOrder = 1;
    formValues.numberOfBillsPrintAtOrderManagement = 1;
    formValues.isAutoPrintStampWhenCreateOrder = true;
    formValues.isAllowPrintStampAtOrderManagement = true;
    formValues.numberOfSlipsWillBePrinted = 1;
  };

  const setDefaultFormValuesWhenMoveBackToInitialPaymentType = (formValues, store) => {
    setIsAutoPrintBillWhenCreateOrder(store?.isAutoPrintBillWhenCreateOrder);
    setIsAutoPrintBillWhenDoPaymentForOrder(store?.isAutoPrintBillWhenDoPaymentForOrder);
    setIsAllowPrintBillAtOrderManagement(store?.isAllowPrintBillAtOrderManagement);
    setIsOrderSlipAutoPrintAfterCreate(store?.isOrderSlipAutoPrintAfterCreate);
    formValues.isAutoPrintBillWhenCreateOrder = store?.isAutoPrintBillWhenCreateOrder;
    formValues.isAutoPrintBillWhenDoPaymentForOrder = store?.isAutoPrintBillWhenDoPaymentForOrder;
    formValues.isAllowPrintBillAtOrderManagement = store?.isAllowPrintBillAtOrderManagement;
    formValues.numberOfBillsPrintWhenCreateOrder = store?.numberOfBillsPrintWhenCreateOrder;
    formValues.numberOfBillsPrintWhenDoPaymentForOrder = store?.numberOfBillsPrintWhenDoPaymentForOrder;
    formValues.numberOfBillsPrintAtOrderManagement = store?.numberOfBillsPrintAtOrderManagement;
    formValues.isAutoPrintStampWhenCreateOrder = store?.isAutoPrintStampWhenCreateOrder;
    formValues.isAllowPrintStampAtOrderManagement = store?.isAllowPrintStampAtOrderManagement;
    formValues.isOrderSlipAutoPrintAfterCreate = store?.isOrderSlipAutoPrintAfterCreate;
    formValues.numberOfSlipsWillBePrinted = store?.numberOfSlipsWillBePrinted;
  };

  const onChangeForm = () => {
    if (!isChangeForm) {
      setIsChangeForm(true);
    }
  };

  const onChangeSwitchReserveTable = (checked) => {
    onChangeForm();
    setIsAllowReserveTable(checked);
    if (checked) document.getElementById("numberOfDaysAdvanceReservations_help").style.display = "block";
    else document.getElementById("numberOfDaysAdvanceReservations_help").style.display = "none";
  };

  const onSaveOperationConfig = async () => {
    formOperation
      .validateFields()
      .then(async (value) => {
        const request = {
          store: {
            ...formOperation.getFieldsValue(),
            isPaymentLater: isPaymentLater,
          },
          storeSetting: StoreSettingConstants.OPERATION_CONFIG,
        };
        const res = await storeDataService?.updateStoreManagementAsync(request);
        if (res) {
          ///Bug 14224
          setInitPaymentType(isPaymentLater);
          setInitStoreOperationData({
            ...formOperation.getFieldsValue(),
          });
          message.success(`${pageData.updateSuccessfullyMessage}`);
        }
      })
      .catch((errors) => {
        if (errors?.errorFields?.length > 0) {
          let nameInputFirst = errors?.errorFields[0]?.name.join("-");
          const input = document.getElementById(`${nameInputFirst}`);
          input.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          });
        }
      });
  };

  const renderCashierPaymentOption = () => {
    return (
      <>
        <div className="sub-info-wrapper mt-24">
          <h3 className="sub-text-label">{pageData.printBill.title}</h3>
          {/* 1 */}
          <Row>
            <Col lg={15} md={24} className="d-flex-align-center">
              <Form.Item name="isAutoPrintBillWhenCreateOrder" valuePropName="checked" className="mb-0">
                <Switch
                  onChange={(value) => {
                    setIsAutoPrintBillWhenCreateOrder(value);
                    onChangeForm();
                  }}
                />
              </Form.Item>
              <span className="text-option ml-16">{pageData.printBill.whenCreateOrder}</span>
            </Col>
            <Col lg={9} md={24} className={`d-flex-align-center ${isMaxWidth780 && "mt-24"}`}>
              <Form.Item
                className={`mb-0 d-flex my-25 ${isMaxWidth780 && "ml-24"}`}
                name="numberOfBillsPrintWhenCreateOrder"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              >
                <InputNumber
                  disabled={!isAutoPrintBillWhenCreateOrder}
                  placeholder=""
                  className="fnb-input-number sub-input-box"
                  min={1}
                  max={10}
                  type="number"
                />
              </Form.Item>
              <span className="text-option my-25">{pageData.printBill.billsWillBePrint}</span>
            </Col>
          </Row>

          {/* 2 */}
          {isPaymentLater && (
            <Row className="mt-32">
              <Col lg={15} md={24} className="d-flex-align-center">
                <Form.Item name="isAutoPrintBillWhenDoPaymentForOrder" valuePropName="checked" className="mb-0">
                  <Switch
                    onChange={(value) => {
                      setIsAutoPrintBillWhenDoPaymentForOrder(value);
                      onChangeForm();
                    }}
                  />
                </Form.Item>
                <span className="text-option ml-16">{pageData.printBill.whenDoPayment}</span>
              </Col>
              <Col lg={9} md={24} className={`d-flex-align-center ${isMaxWidth780 && "mt-24"}`}>
                <Form.Item
                  className={`mb-0 d-flex my-25 ${isMaxWidth780 && "ml-24"}`}
                  name="numberOfBillsPrintWhenDoPaymentForOrder"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <InputNumber
                    disabled={!isAutoPrintBillWhenDoPaymentForOrder}
                    placeholder=""
                    className="fnb-input-number sub-input-box"
                    min={1}
                    max={10}
                    type="number"
                  />
                </Form.Item>
                <span className="text-option my-25">{pageData.printBill.billsWillBePrint}</span>
              </Col>
            </Row>
          )}

          {/* 3 */}
          <Row className="mt-32">
            <Col lg={15} md={24} className="d-flex-align-center">
              <Form.Item name="isAllowPrintBillAtOrderManagement" valuePropName="checked" className="mb-0">
                <Switch
                  onChange={(value) => {
                    setIsAllowPrintBillAtOrderManagement(value);
                    onChangeForm();
                  }}
                />
              </Form.Item>
              <span className="text-option ml-16">{pageData.printBill.atOrderManagement}</span>
            </Col>
            <Col lg={9} md={24} className={`d-flex-align-center ${isMaxWidth780 && "mt-24"}`}>
              <Form.Item
                className={`mb-0 d-flex my-25 ${isMaxWidth780 && "ml-24"}`}
                name="numberOfBillsPrintAtOrderManagement"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              >
                <InputNumber
                  disabled={!isAllowPrintBillAtOrderManagement}
                  placeholder=""
                  className="fnb-input-number sub-input-box"
                  min={1}
                  max={10}
                  type="number"
                />
              </Form.Item>
              <span className="text-option my-25">{pageData.printBill.billsWillBePrint}</span>
            </Col>
          </Row>

          {/* Print Order Slip  */}
          <h3 className="sub-text-label mt-32">{pageData.printBill.printOrderSlip}</h3>
          <Row>
            <Col lg={15} md={24} className="d-flex-align-center">
              <Form.Item name="isOrderSlipAutoPrintAfterCreate" valuePropName="checked" className="mb-0">
                <Switch
                  onChange={(value) => {
                    setIsOrderSlipAutoPrintAfterCreate(value);
                    onChangeForm();
                  }}
                />
              </Form.Item>
              <span className="text-option ml-16">{pageData.printBill.autoPrintOrderSlipAfterCreate}</span>
            </Col>
            <Col lg={9} md={24} className={`d-flex-align-center ${isMaxWidth780 && "mt-24"}`}>
              <Form.Item
                className={`mb-0 d-flex my-25 ${isMaxWidth780 && "ml-24"}`}
                name="numberOfSlipsWillBePrinted"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  () => ({
                    validator(_, value) {
                      if (value > 999) {
                        formOperation.setFieldValue("numberOfSlipsWillBePrinted", 1);
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  disabled={!isOrderSlipAutoPrintAfterCreate}
                  className="fnb-input-number sub-input-box"
                  min={1}
                  type="number"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
              <span className="text-option my-25">{pageData.printBill.slipsWillBePrinted}</span>
            </Col>
          </Row>
        </div>

        {/* Print stamp */}
        <div className="sub-info-wrapper my-24">
          <h3 className="sub-text-label mb-16">{pageData.printStamp.title}</h3>
          <Row>
            <Col span={21} lg={24} className="d-flex-align-center">
              <Form.Item name="isAutoPrintStampWhenCreateOrder" valuePropName="checked" className="mb-0">
                <Switch onChange={onChangeForm} />
              </Form.Item>
              <div className="ml-20">
                <span className="text-option">{pageData.printStamp.whenCreateOrder}</span>
              </div>
            </Col>
          </Row>
          <Row className="mt-24">
            <Col span={21} lg={24} className="d-flex-align-center">
              <Form.Item name="isAllowPrintStampAtOrderManagement" valuePropName="checked" className="mb-0">
                <Switch onChange={onChangeForm} />
              </Form.Item>
              <div className="ml-20">
                <span className="text-option">{pageData.printStamp.atOrderManagement}</span>
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  };

  const renderAutoConfirmOrder = () => {
    return (
      <>
        {/* Auto Confirm Order */}
        <div className="sub-info-wrapper">
          <Row>
            <Col className="d-flex mr-2 mb-0" style={{ alignItems: "center" }}>
              <span className="text-label">{pageData.autoConfirmOrderAfter}</span>
            </Col>
            <Col className="d-flex mb-0" style={{ alignItems: "center" }}>
              <Form.Item
                className="mb-0 d-flex"
                name="autoConfirmOrderInMinutes"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              >
                <InputNumber
                  name="autoConfirmOrderInMinutes"
                  className="fnb-input-number sub-input-box mr-2"
                  min={0}
                  max={1440}
                />
              </Form.Item>
              <span className="text-option">{pageData.autoConfirmOrderUnit}</span>
            </Col>
          </Row>
        </div>
      </>
    );
  };

  return (
    <div className={className}>
      <Form form={formOperation} autoComplete="off" onChange={onChangeForm}>
        <div className="fnb-card w-100 card-operation mb-16 top-card">
          <h3 className="card-title mb-0">{pageData.title}</h3>
          {isChangeForm && (
            <Button onClick={onSaveOperationConfig} type="primary" className="btn-save ml-auto">
              {pageData.btnUpdate}
            </Button>
          )}
        </div>

        {/* Kitchen */}
        <Card className="fnb-card w-100 card-operation mt-24 mb-16">
          <Row className="mb-16">
            <Col span={24} className="d-flex-align-center">
              <h3 className="card-label">{pageData.kitchen}</h3>
            </Col>
          </Row>
          <Row>
            <Col span={21} lg={24} className="d-flex-align-center">
              <Form.Item name="isStoreHasKitchen" valuePropName="checked" className="mb-0">
                <Switch
                  onChange={(value) => {
                    setIsStoreHasKitchen(value);
                    onChangeForm();
                  }}
                />
              </Form.Item>
              <span className="text-option ml-16">{pageData.storeHasKitchen.title}</span>
              <span className="d-flex-align-center">
                <Tooltip
                  placement="top"
                  overlayClassName="tooltip-kitchen"
                  title={
                    <div className="pl-2">
                      <ul style={{ marginBottom: 0 }}>
                        <li>
                          <p
                            style={{
                              lineHeight: "20px",
                            }}
                          >
                            <strong>{pageData.storeHasKitchen.tooltip.kitchenOff}</strong>
                            {pageData.storeHasKitchen.tooltip.ifNotHaveKitchen} {"=>"}{" "}
                            {pageData.storeHasKitchen.tooltip.orderNotHaveKitchen}
                          </p>
                        </li>
                        <li>
                          <p
                            style={{
                              lineHeight: "20px",
                              marginBottom: 0,
                            }}
                          >
                            <strong>{pageData.storeHasKitchen.tooltip.kitchenOn}</strong>{" "}
                            {pageData.storeHasKitchen.tooltip.ifHasKitchen} {"=>"}{" "}
                            {pageData.storeHasKitchen.tooltip.orderHasKitchen}
                          </p>
                        </li>
                      </ul>
                    </div>
                  }
                >
                  <StoreGeneralConfigInfoCircleIcon className="ml-1" />
                </Tooltip>
              </span>
            </Col>
          </Row>
          <div className="sub-info-wrapper my-24">
            <h3 className="sub-text-label mb-16"> {pageData.printStamp.title}</h3>
            <Row>
              <Col span={21} lg={24} className="d-flex-align-center">
                <Form.Item name="isAutoPrintStamp" valuePropName="checked" className="mb-0">
                  <Switch disabled={!isStoreHasKitchen} onChange={onChangeForm} />
                </Form.Item>
                <div className="ml-20">
                  <span className="text-option">{pageData.printStamp.kitchenAutoPrint}</span>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Cooking Time */}
        <Card className="fnb-card w-100 card-operation mt-24 pb-0">
          <Row className="mb-16">
            <Col span={24} className="d-flex-align-center">
              <h3 className="card-label">{pageData.cookingTime.title}</h3>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} className="width-input cooking-time">
              <h4 className="fnb-form-label cooking-time-label">{pageData.cookingTime.averageTime}</h4>
              <Form.Item name="cookingTime">
                <InputNumber
                  placeholder={pageData.cookingTime.placeholder}
                  className="fnb-input-number w-100"
                  min={1}
                  max={999}
                  type="number"
                  addonAfter={pageData.cookingTime.unit}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  defaultValue={15}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Cashier */}
        <Card className="fnb-card w-100 card-operation mt-24">
          <Row className="mb-16">
            <Col span={24} className="d-flex-align-center">
              <h3 className="card-label mb-0">{pageData.cashier}</h3>
            </Col>
          </Row>
          <Row className="mt-24">
            <Radio.Group onChange={onPaymentTypeChange} value={isPaymentLater}>
              <Row>
                {/* Payment first */}
                <Col span={24}>
                  <Radio value={false}>
                    <div className="d-flex-align-center">
                      <span className="text-option"> {pageData.paymentFirst}</span>
                      <span className="d-flex-align-center">
                        <Tooltip
                          placement="top"
                          overlayClassName="tooltip-payment"
                          title={
                            <div className="pl-2">
                              <ul>
                                <li>
                                  <p>{pageData.tooltipPaymentFirst}</p>
                                </li>
                                <li>
                                  <p>{pageData.tooltipPaymentFirstMore}</p>
                                </li>
                              </ul>
                            </div>
                          }
                        >
                          <StoreGeneralConfigInfoCircleIcon className="ml-1" />
                        </Tooltip>
                      </span>
                    </div>
                  </Radio>
                </Col>
                {!isPaymentLater && renderCashierPaymentOption()}

                {/* Payment later */}
                <Col className={isPaymentLater ? "mt-16" : "mb-24"} span={24}>
                  <Radio value={true}>
                    <div className="d-flex-align-center">
                      <span className="text-option"> {pageData.paymentLater}</span>
                      <span className="d-flex-align-center">
                        <Tooltip
                          placement="top"
                          overlayClassName="tooltip-payment"
                          title={
                            <div className="pl-2">
                              <ul>
                                <li>
                                  <p>{pageData.tooltipPaymentLater}</p>
                                </li>
                                <li>
                                  <p>{pageData.tooltipPaymentLaterMore}</p>
                                </li>
                              </ul>
                            </div>
                          }
                        >
                          <StoreGeneralConfigInfoCircleIcon className="ml-1" />
                        </Tooltip>
                      </span>
                    </div>
                  </Radio>
                </Col>
                {isPaymentLater && renderCashierPaymentOption()}
              </Row>
            </Radio.Group>
          </Row>
        </Card>
        <Card className="fnb-card w-100 card-operation mt-24 pb-4">
          <Row>
            <Col span={24} className="d-flex-align-center">
              <h3 className="card-label">{pageData.order}</h3>
            </Col>
          </Row>
          <Row className="isAutoConfirmOrder">
            {/* Auto Confirm Order */}
            <Col span={24}>
              <Form.Item name="isAutoConfirmOrder" valuePropName="checked">
                <Checkbox
                  onChange={(e) => setIsAutoConfirmOrder(!isAutoConfirmOrder)}
                  defaultChecked={isAutoConfirmOrder}
                >
                  <div className="d-flex-align-center">
                    <span className="text-option"> {pageData.autoConfirmOrder}</span>
                    <span className="d-flex-align-center">
                      <Tooltip
                        placement="top"
                        overlayClassName="tooltip-payment isAutoConfirmOrderTooltip"
                        title={
                          <div>
                            <ul>
                              <li>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: `${t("store.tooltipAutoConfirmOrder")}`,
                                  }}
                                ></p>
                              </li>
                            </ul>
                          </div>
                        }
                      >
                        <StoreGeneralConfigInfoCircleIcon className="ml-1" />
                      </Tooltip>
                    </span>
                  </div>
                </Checkbox>
              </Form.Item>
            </Col>
            {isAutoConfirmOrder && renderAutoConfirmOrder()}
          </Row>
        </Card>

        {/* Inventory */}
        <Card className="fnb-card w-100 card-operation mt-24">
          <Row className="mb-16">
            <Col span={24} className="d-flex-align-center">
              <h3 className="card-label">{pageData.inventory.title}</h3>
            </Col>
          </Row>
          <Row className="mb-16">
            <Col span={21} lg={24} className="d-flex-align-center">
              <Form.Item name="isCheckProductSell" valuePropName="checked" className="mb-0">
                <Switch onChange={onChangeForm} />
              </Form.Item>
              <span className="text-option ml-16">{pageData.inventory.allowToSellProduct}</span>
              <span className={`d-flex-align-center ${isMaxWidth780 && "ml-8"}`}>
                <Tooltip
                  placement="top"
                  overlayClassName="tooltip-inventory"
                  title={
                    <div className="pl-2">
                      <ul>
                        <li>
                          <p>{pageData.inventory.tooltip.off}</p>
                        </li>
                        <li>
                          <p>{pageData.inventory.tooltip.on}</p>
                        </li>
                      </ul>
                    </div>
                  }
                >
                  <StoreGeneralConfigInfoCircleIcon className="ml-1" />
                </Tooltip>
              </span>
            </Col>
          </Row>
        </Card>

        {/* Reserve Table */}
        <Card className="fnb-card w-100 card-operation mt-24">
          <Row className="mb-16">
            <Col span={24} className="d-flex-align-center">
              <h3 className="card-label mb-0">{pageData.reserveTable.title}</h3>
              <Form.Item name="isAllowReserveTable" valuePropName="checked" className="mb-0 ml-4">
                <Switch onChange={onChangeSwitchReserveTable} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} className="width-input">
              <h4 className="fnb-form-label">{pageData.reserveTable.numberOfDaysAdvanceReservations.title}</h4>
              <Form.Item
                name="numberOfDaysAdvanceReservations"
                rules={[
                  {
                    required: isAllowReserveTable,
                    message: pageData.reserveTable.numberOfDaysAdvanceReservations.validate,
                  },
                ]}
              >
                <InputNumber
                  id={`numberOfDaysAdvanceReservations`}
                  placeholder={pageData.reserveTable.numberOfDaysAdvanceReservations.placeholder}
                  className={`fnb-input-number w-100 ` + (!isAllowReserveTable ? `disabled` : ``)}
                  min={1}
                  max={99}
                  disabled={!isAllowReserveTable}
                  type="number"
                  addonAfter={pageData.reserveTable.numberOfDaysAdvanceReservations.days}
                  onKeyPress={(event) => {
                    const checkValidKey = checkOnKeyPressValidation(event, `numberOfDaysAdvanceReservations`, 1, 99, 0);
                    if (!checkValidKey) event.preventDefault();
                  }}
                  onWheel={(e) => e.target.blur()}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {/* Reservation type */}
            <div className="sub-info-wrapper my-24 mt-1 pb-4 mb-3">
              <h3 className="sub-text-label mb-16">{pageData.reserveTable.reservationType.title}</h3>
              <Form.Item name="reservationType">
                <Radio.Group>
                  <Row>
                    {/* staff Arrange */}
                    <Col className="mb-24" span={24}>
                      <Radio defaultChecked value={ReservationType.STAFF_ARRANGE} disabled={!isAllowReserveTable}>
                        <div className="d-flex-align-center">
                          <span className="text-option"> {pageData.reserveTable.reservationType.staffArrange}</span>
                        </div>
                      </Radio>
                    </Col>

                    {/* lock Period Time */}
                    <Col span={24}>
                      <Row className="w-100 content-reservation-type">
                        <Radio value={ReservationType.LOCK_PERIOD_TIME} disabled>
                          <div className="d-flex-align-center content-name-type">
                            <span className="text-option"> {pageData.reserveTable.reservationType.lockPeriodTime}</span>
                          </div>
                        </Radio>
                        <span className="d-flex-align-center content-coming-soon">
                          {pageData.reserveTable.reservationType.comingSoon}
                        </span>
                      </Row>
                      <Row className="w-100">
                        <Col xs={24} sm={24} md={24} lg={11} className="width-input-fixed">
                          <Form.Item className="ml-tab" name="lockTimeByHours">
                            <InputNumber
                              id={`lockTimeByHours`}
                              placeholder={pageData.reserveTable.reservationType.lockTimeByHours.placeholder}
                              className="fnb-input-number w-100 disabled"
                              min={1}
                              max={24}
                              disabled
                              type="number"
                              addonAfter={pageData.reserveTable.reservationType.lockTimeByHours.hrs}
                              onKeyPress={(event) => {
                                const checkValidKey = checkOnKeyPressValidation(event, `lockTimeByHours`, 1, 24, 0);
                                if (!checkValidKey) event.preventDefault();
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    {/* fixed Time */}
                    <Col className="" span={24}>
                      <Row className="w-100 content-reservation-type">
                        <Radio value={ReservationType.FIXED_TIME} disabled>
                          <div className="d-flex-align-center content-name-type">
                            <span className="text-option"> {pageData.reserveTable.reservationType.fixedTime}</span>
                          </div>
                        </Radio>
                        <span className="d-flex-align-center content-coming-soon">
                          {pageData.reserveTable.reservationType.comingSoon}
                        </span>
                      </Row>
                      <Row className="w-100">
                        <Col xs={24} sm={24} md={24} lg={11} className="width-input-fixed">
                          <div className="content-fixed-time ml-tab">
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={24} className="mt-0">
                                <div className="d-flex-align-center justify-space-between">
                                  <div>{`09:00  to  12:00`}</div>
                                  <div className="">
                                    <div className="action-column">
                                      <Space wrap className="fnb-table-action-icon">
                                        <div className="fnb-table-action-icon">
                                          <Tooltip placement="top" title={t("button.edit")} color="#50429B">
                                            <EditFill className="icon-svg-hover" style={{ cursor: "not-allowed" }} />
                                          </Tooltip>
                                        </div>
                                      </Space>
                                      <Space wrap>
                                        <div className="fnb-table-action-icon ml-3">
                                          <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                                            <TrashFill className="icon-svg-hover" style={{ cursor: "not-allowed" }} />
                                          </Tooltip>
                                        </div>
                                      </Space>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={24} className="mt-2">
                                <div className="d-flex-align-center justify-space-between">
                                  <div>{`13:00  to  17:00`}</div>
                                  <div className="">
                                    <div className="action-column">
                                      <Space wrap className="fnb-table-action-icon">
                                        <div className="fnb-table-action-icon">
                                          <Tooltip placement="top" title={t("button.edit")} color="#50429B">
                                            <EditFill className="icon-svg-hover" style={{ cursor: "not-allowed" }} />
                                          </Tooltip>
                                        </div>
                                      </Space>
                                      <Space wrap>
                                        <div className="fnb-table-action-icon ml-3">
                                          <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                                            <TrashFill className="icon-svg-hover" style={{ cursor: "not-allowed" }} />
                                          </Tooltip>
                                        </div>
                                      </Space>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={24} className="mt-2">
                                <div className="d-flex-align-center justify-space-between">
                                  <div>{`18:00  to  22:00`}</div>
                                  <div className="">
                                    <div className="action-column">
                                      <Space wrap className="fnb-table-action-icon">
                                        <div className="fnb-table-action-icon">
                                          <Tooltip placement="top" title={t("button.edit")} color="#50429B">
                                            <EditFill className="icon-svg-hover" style={{ cursor: "not-allowed" }} />
                                          </Tooltip>
                                        </div>
                                      </Space>
                                      <Space wrap>
                                        <div className="fnb-table-action-icon ml-3">
                                          <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                                            <TrashFill className="icon-svg-hover" style={{ cursor: "not-allowed" }} />
                                          </Tooltip>
                                        </div>
                                      </Space>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={3} className="content-reservation-type">
                          <Button type="primary" disabled className="btn-save margin-left-btn">
                            {pageData.reserveTable.reservationType.addTime}
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
            </div>
          </Row>
        </Card>
      </Form>
    </div>
  );
});
