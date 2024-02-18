import { Col, Form, Input, Row } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { checkOnKeyPressValidation } from "../../../../../utils/helpers";

import DateTimePickerReserveComponent from "../../../../components/DateTimePickerReserve/DateTimePickerReserve.component";
const InformationOfFormComponent = (props) => {
  const {
    value,
    reserveTime,
    setReserveTime,
    reserveDate,
    setReserveDate,
    setNote,
    inputValue,
    setInputValue,
    branchAddressId,
  } = props;
  const [t] = useTranslation();

  const translateData = {
    infoCustomer: t("reserveTable.infoCustomer", "Thông tin khách hàng"),
    branch: t("reserveTable.branch", "Chi nhánh"),
    time: t("reserveTable.time", "Thời gian đến"),
    name: t("reserveTable.name", "Họ tên"),
    phone: t("reserveTable.phone", "Số điện thoại"),
    email: t("reserveTable.email", "Email"),
    note: t("reserveTable.note", "Ghi chú"),
    numberOfGuest: t("reserveTable.numberOfGuest", "Số lượng khách"),
    enterGuest: t("reserveTable.enterGuest", "Vui lòng nhập số lượng khách"),
    enterPhone: t("reserveTable.enterPhone", "Vui lòng nhập số điện thoại đặt chỗ"),
    enterName: t("reserveTable.enterName", "Vui lòng nhập tên người đặt chỗ"),
    enterEmail: t("reserveTable.enterEmail", "Vui lòng nhập email người đặt chỗ"),
    notePlaceHolder: t(
      "reserveTable.notePlaceHolder",
      "Tôi cần ghế cho trẻ em. Nhà hàng cho chỗ đỗ xe không? Tôi có thể xem trước thực đơn không?",
    ),
    selectTable: t("reserveTable.selectTable", "Chọn bàn"),
    reserve: t("reserveTable.reserve", "Đặt bàn"),
    validatePhone: t("reserveTable.validatePhone", "Số điện thoại không hợp lệ"),
    iNeedTheChairForMyChildren: t("reserveTable.iNeedTheChairForMyChildren", "Tôi cần ghế cho trẻ em"),
    doesTheRestaurantHaveAParkingLot: t(
      "reserveTable.doesTheRestaurantHaveAParkingLot",
      "Nhà hàng cho chỗ đỗ xe không?",
    ),
    canISeeTheMenuInAdvance: t("reserveTable.canISeeTheMenuInAdvance", "Tôi có thể xem trước thực đơn không?"),
  };

  const suggestionList = [
    translateData.iNeedTheChairForMyChildren,
    translateData.doesTheRestaurantHaveAParkingLot,
    translateData.canISeeTheMenuInAdvance,
  ];

  return (
    <div>
      <Row className="reserve-table-form-field-single">
        <h1>{translateData.infoCustomer}</h1>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="reserve-table-form-field-multiple">
        <Col className="gutter-row col-responsive" span={8}>
          <Form.Item
            className="form-item"
            name="name"
            label={
              <span>
                {translateData.name}
                <span className="required-class">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: translateData.enterName,
              },
            ]}
          >
            <Input allowClear maxLength={100} placeholder={translateData.enterName} />
          </Form.Item>
        </Col>
        <Col className="gutter-row col-responsive" span={8}>
          <Form.Item
            className="form-item"
            name="phone"
            label={
              <span>
                {translateData.phone}
                <span className="required-class">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: translateData.enterPhone,
              },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject();
                  }
                  if (!value.match("[0-9]{10}")) {
                    return Promise.reject(translateData.validatePhone);
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              allowClear
              maxLength={15}
              onKeyDown={(event) => {
                const checkValidKey = checkOnKeyPressValidation(event, "txtPhone", 0, null, 0);
                if (!checkValidKey && event.key !== "Delete" && event.key !== "Del" && event.key !== "Backspace") {
                  event.preventDefault();
                }
              }}
              onPaste={(e) => {
                const pasteData = e?.clipboardData?.getData("Text");
                //Only allow number only
                if (!pasteData || isNaN(pasteData)) {
                  e.preventDefault();
                  return false;
                }
                return true;
              }}
              inputMode="tel"
              placeholder={translateData.enterPhone}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row col-responsive" span={8}>
          <Form.Item name="email" className="form-item" label={translateData.email}>
            <Input placeholder={translateData.enterEmail} allowClear />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="reserve-table-form-field-multiple">
        <Col span={16} xs={24} sm={24} md={24} lg={24} xl={16} xxl={16} className="col-responsive datetime-mobile">
          <DateTimePickerReserveComponent
            {...props}
            setReserveTime={setReserveTime}
            reserveTime={reserveTime}
            setReserveDate={setReserveDate}
            reserveDate={reserveDate}
            branchAddressId={branchAddressId ?? null}
          />
        </Col>
        <Col span={8} xs={24} sm={24} md={24} lg={24} xl={8} xxl={8} className="gutter-row col-responsive">
          <Form.Item
            className="form-item"
            label={
              <span>
                {translateData.numberOfGuest}
                <span className="required-class">*</span>
              </span>
            }
            name="quantity"
            rules={[
              {
                required: true,
                message: translateData.enterGuest,
              },
            ]}
          >
            <Input
              allowClear
              placeholder={translateData.enterGuest}
              onInput={(e) => {
                const numericValue = parseInt(e.target.value.replace(/[^\d]/, ""));
                if (numericValue && numericValue < 1000 && numericValue > 0) {
                  e.target.value = numericValue;
                  setInputValue(numericValue);
                } else if (e.target.value.length === 0) {
                  e.target.value = "";
                  setInputValue("");
                } else {
                  e.target.value = inputValue;
                }
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row className="reserve-table-form-field-multiple">
        <Col className="gutter-row" span={24}>
          <Form.Item name="note" className="form-item-note" label={translateData.note}>
            <Input.TextArea
              value={value}
              onChange={(e) => setNote(e.target.value)}
              placeholder={translateData.notePlaceHolder}
              autoSize={{ minRows: 3, maxRows: 5 }}
              className="input-area-custom"
              maxLength={255}
              allowClear="true"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row className="reserve-table-form-field-multiple">
        <Col className="gutter-row" span={24}>
          <Form.Item>
            <div className="suggestion-list">
              {suggestionList?.map((suggestion) => (
                <span
                  className="suggestion-item"
                  onClick={() => {
                    setNote(suggestion);
                  }}
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
export default memo(InformationOfFormComponent);
