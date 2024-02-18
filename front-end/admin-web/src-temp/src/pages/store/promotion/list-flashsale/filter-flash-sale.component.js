import { CheckOutlined } from "@ant-design/icons";
import { Card, Col, DatePicker, Form, InputNumber, Radio, Row } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { inputNumberRange1To999999999 } from "constants/default.constants";
import { CalendarNewIconBold } from "constants/icons.constants";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { getCurrency } from "utils/helpers";

export default function FilterFlashSale(props) {
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const { branches, pageSize, keySearch, setDataFilter } = props;
  const defaultValue = "";
  const [resetFilter, setResetFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [selectedIncludeTopping, setSelectedIncludeTopping] = useState("");
  const isMobileMode = useMediaQuery({ maxWidth: 575 });

  const pageData = {
    filter: {
      button: t("button.clear"),
      branch: {
        title: t("productManagement.filter.branch.title"),
        all: t("productManagement.filter.branch.all"),
        placeholder: t("productManagement.filter.branch.placeholder"),
      },
      status: {
        all: t("material.filter.status.all"),
        title: t("material.filter.status.title"),
        active: t("promotion.status.active"),
        scheduled: t("promotion.status.scheduled"),
        finished: t("promotion.status.finished"),
        specialOptionKey: null,
      },
      applicableType: t("promotion.applicableType"),
      valueType: t("promotion.valueType"),
      amount: t("promotion.amount"),
      startDate: t("promotion.form.startDate"),
      endDate: t("promotion.form.endDate"),
      minimumPurchaseOnBill: t("promotion.minimumPurchaseOnBill"),
      resetallfilters: t("productManagement.filter.resetallfilters"),
      fromAmount: t("promotion.fromAmount"),
      toAmount: t("promotion.toAmount"),
      amountValidateMessage: t("productManagement.pricing.priceRange"),
      toAmountValidate: t("promotion.toAmountValidate"),
      includeTopping: t("promotion.includeTopping"),
      notIncludeTopping: t("promotion.notIncludeTopping"),
      topping: t("productManagement.topping"),
    },
  };

  useEffect(() => {
    props.tableFuncs.current = onResetForm;
  }, []);

  const onApplyFilter = () => {
    var fieldsErrors = form.getFieldsError();
    let isFormValid = fieldsErrors.find((item) => item?.errors?.length > 0);

    if (!isFormValid) {
      let formValue = form.getFieldsValue();
      formValue.count = countFilterControl(formValue);
      setDataFilter(formValue);
      setResetFilter(formValue.count < 1 ? false : true);
      props.fetchDataFlashSale(1, pageSize, keySearch, formValue);
    }
  };

  const countFilterControl = (formValue) => {
    var checkStartDate = moment(formValue.startDate, "YYYY-MM-DD").isValid();
    var checkEndDate = moment(formValue.endDate, "YYYY-MM-DD").isValid();

    let countBranch = formValue.branchId === "" || formValue.branchId === undefined ? 0 : 1;

    let countStatus = formValue.statusId === "" || formValue.statusId === undefined ? 0 : 1;

    let countStartDate = formValue.startDate === "" || formValue.startDate === undefined || !checkStartDate ? 0 : 1;

    let countEndDate = formValue.endDate === "" || formValue.endDate === undefined || !checkEndDate ? 0 : 1;

    let countIncludeTopping = formValue.includeTopping === "" || formValue.includeTopping === undefined ? 0 : 1;

    let countMinMinimumPurchaseOnBill =
      formValue.minMinimumPurchaseOnBill === "" ||
      formValue.minMinimumPurchaseOnBill === undefined ||
      formValue.minMinimumPurchaseOnBill === null
        ? 0
        : 1;

    let countMaxMinimumPurchaseOnBill =
      formValue.maxMinimumPurchaseOnBill === "" ||
      formValue.maxMinimumPurchaseOnBill === undefined ||
      formValue.maxMinimumPurchaseOnBill === null
        ? 0
        : 1;

    return (
      countBranch +
      countStatus +
      countStartDate +
      countEndDate +
      countMinMinimumPurchaseOnBill +
      countMaxMinimumPurchaseOnBill +
      countIncludeTopping
    );
  };

  const onResetForm = () => {
    form?.resetFields();
    onApplyFilter();
  };

  const onChangeStatus = (id) => {
    setSelectedStatus(id);
  };

  const onChangeIncludeTopping = (id) => {
    setSelectedIncludeTopping(id);
  };

  const disabledDateByStartDate = (current) => {
    // Can not select days before today and today
    return current && current < startDate;
  };

  return (
    <Form form={form} onFieldsChange={onApplyFilter}>
      <Card className="discount-code-filter-scroll">
        <div className="discount-filter">
          <Card className="form-filter-discount-popover ">
            <Row style={{ alignItems: "center" }}>
              <div className="first-column">
                <span>{pageData.filter.branch.title}</span>
              </div>

              <div className="second-column">
                <Form.Item name="branchId">
                  <FnbSelectSingle
                    placeholder={pageData.filter.branch.placeholder}
                    className="form-select"
                    showSearch
                    defaultValue={defaultValue}
                    option={branches}
                  />
                </Form.Item>
              </div>
            </Row>

            <Row style={{ alignItems: "center", marginTop: "-12px" }}>
              <div className="first-column" style={isMobileMode ? { marginBottom: "-5px" } : { marginBottom: "0px" }}>
                <span>{pageData.filter.status.title}</span>
              </div>
              <div className="second-column">
                <Form.Item name="statusId">
                  <Radio.Group
                    value={selectedStatus}
                    defaultValue={defaultValue}
                    buttonStyle="solid"
                    onChange={(e) => onChangeStatus(e.target.value)}
                  >
                    <Radio.Button value={defaultValue}>
                      {selectedStatus === "" && <CheckOutlined className="check-icon" />} {pageData.filter.status.all}
                    </Radio.Button>
                    <Radio.Button value={2}>
                      {selectedStatus === 2 && <CheckOutlined className="check-icon" />} {pageData.filter.status.active}
                    </Radio.Button>
                    <Radio.Button value={1}>
                      {selectedStatus === 1 && <CheckOutlined className="check-icon" />}{" "}
                      {pageData.filter.status.scheduled}
                    </Radio.Button>
                    <Radio.Button value={3}>
                      {selectedStatus === 3 && <CheckOutlined className="check-icon" />}{" "}
                      {pageData.filter.status.finished}
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Row>

            <Row style={{ alignItems: "center" }}>
              <div className="first-column">
                <span>{pageData.filter.startDate}</span>
              </div>
              <div className="second-column">
                <Form.Item name="startDate">
                  <DatePicker
                    suffixIcon={<CalendarNewIconBold />}
                    placeholder={DateFormat.DD_MM_YYYY_DASH.toLowerCase()}
                    className="fnb-date-picker w-100"
                    disabledDate={false}
                    format={DateFormat.DD_MM_YYYY_DASH}
                    onChange={(date) => {
                      setStartDate(date);

                      // Clear end date after select start date if endate < startdate only
                      const formValues = form.getFieldsValue();
                      if (formValues?.endDate != null && formValues?.endDate < date) {
                        form.setFieldsValue({
                          ...formValues,
                          startDate: null,
                          endDate: null,
                        });
                      }
                    }}
                  />
                </Form.Item>
              </div>
            </Row>

            <Row style={{ alignItems: "center" }}>
              <div className="first-column">
                <span>{pageData.filter.endDate}</span>
              </div>
              <div className="second-column">
                <Form.Item name="endDate">
                  <DatePicker
                    suffixIcon={<CalendarNewIconBold />}
                    placeholder={DateFormat.DD_MM_YYYY_DASH.toLowerCase()}
                    className="fnb-date-picker w-100"
                    format={DateFormat.DD_MM_YYYY_DASH}
                    disabledDate={disabledDateByStartDate}
                  />
                </Form.Item>
              </div>
            </Row>

            <Row style={{ alignItems: "center", marginTop: "-12px" }}>
              <div className="first-column" style={isMobileMode ? { marginBottom: "-5px" } : { marginBottom: "0px" }}>
                <span>{pageData.filter.topping}</span>
              </div>
              <div className="second-column">
                <Form.Item name="includeTopping">
                  <Radio.Group
                    value={selectedIncludeTopping}
                    defaultValue={defaultValue}
                    buttonStyle="solid"
                    onChange={(e) => onChangeIncludeTopping(e.target.value)}
                  >
                    <Radio.Button value={defaultValue}>
                      {selectedIncludeTopping === "" && <CheckOutlined className="check-icon" />}{" "}
                      {pageData.filter.status.all}
                    </Radio.Button>
                    <Radio.Button value={1}>
                      {selectedIncludeTopping === 1 && <CheckOutlined className="check-icon" />}{" "}
                      {pageData.filter.includeTopping}
                    </Radio.Button>
                    <Radio.Button value={2}>
                      {selectedIncludeTopping === 2 && <CheckOutlined className="check-icon" />}{" "}
                      {pageData.filter.notIncludeTopping}
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Row>

            <Row style={{ alignItems: "center" }}>
              <div className="first-column">
                <span>{pageData.filter.minimumPurchaseOnBill}</span>
              </div>
              <div className="second-column">
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="minMinimumPurchaseOnBill"
                      rules={[
                        {
                          pattern: new RegExp(inputNumberRange1To999999999.range),
                          message: pageData.filter.amountValidateMessage,
                        },
                      ]}
                    >
                      <InputNumber
                        maxLength={13}
                        className="w-100 fnb-input-number"
                        placeholder={pageData.filter.fromAmount}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        addonAfter={getCurrency()}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2} className="icon-between-date ">
                    {"-"}
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      name="maxMinimumPurchaseOnBill"
                      rules={[
                        {
                          pattern: new RegExp(inputNumberRange1To999999999.range),
                          message: pageData.filter.amountValidateMessage,
                        },
                        () => ({
                          validator(_, value) {
                            let formValue = form.getFieldsValue();
                            const regex = new RegExp(inputNumberRange1To999999999.range);
                            if (!regex.test(formValue?.maxMinimumPurchaseOnBill)) return Promise.reject()

                            if (
                              (value && value <= formValue?.minMinimumPurchaseOnBill) ||
                              (value === 0 && formValue?.minMinimumPurchaseOnBill >= 0)
                            ) {
                              return Promise.reject(
                                `${pageData.filter.toAmountValidate} ${formValue?.minMinimumPurchaseOnBill?.toLocaleString() || 0}`
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        maxLength={13}
                        className="w-100 fnb-input-number"
                        placeholder={pageData.filter.toAmount}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        addonAfter={getCurrency()}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Row>
          </Card>
        </div>
        <Row className="row-reset-filter mt-3">
          <a
            onClick={() => onResetForm()}
            className="reset-filter"
            aria-current={!resetFilter && "inventory-history-filter"}
          >
            {pageData.filter.resetallfilters}
          </a>
        </Row>
      </Card>
    </Form>
  );
}
