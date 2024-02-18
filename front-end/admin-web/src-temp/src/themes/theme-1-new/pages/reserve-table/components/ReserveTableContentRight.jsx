import { CheckOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DateTimePickerReserveComponent from "../../../components/date-time-picker-reserve/date-time-picker-reserve.component";
import styled from "styled-components";
import { IconBranchStoreCustomize } from "../../../assets/icons/BranchStoreIcon";
const { Option } = Select;

export default function ReserveTableContentRight(props) {
  const {
    form,
    onSubmitReserveForm,
    deliveryAddress,
    reserveTime,
    setReserveTime,
    reserveDate,
    setReserveDate,
    onChangeBranch,
    branchAddressId,
    colorGroup,
    selectTimeByDeliveryDay,
    setSelectTimeByDeliveryDay,
    branchesByCustomerAddress,
  } = props;
  const [t] = useTranslation();
  const translateData = {
    cancel: t("deliveryTime.cancel"),
    confirm: t("deliveryTime.confirm"),
    pickDate: t("reserve.pickDate"),
    reserveInformation: t("reserve.reserveInformation"),
    branch: t("reserve.branch"),
    branchPlaceHolder: t("reserve.branchPlaceHolder"),
    pleaseSelectTheBranch: t("reserve.pleaseSelectTheBranch"),
    yourFullName: t("reserve.yourFullName"),
    name: t("reserve.name"),
    pleaseEnterTheReservationName: t("reserve.pleaseEnterTheReservationName"),
    phoneNumber: t("reserve.phoneNumber"),
    pleaseEnterTheReservationPhone: t("reserve.pleaseEnterTheReservationPhone"),
    email: t("reserve.email"),
    invalidPhoneNumber: t("loginPage.invalidPhoneNumber", "Invalid phone number"),
    numberOfGuests: t("reserve.numberOfGuests"),
    pleaseEnterTheNumberOfGuests: t("reserve.pleaseEnterTheNumberOfGuests"),
    yourArrivaltime: t("reserve.yourArrivaltime"),
    enterYourArrivalTime: t("reserve.enterYourArrivalTime"),
    pleaseEnterYourArrivalTime: t("reserve.pleaseEnterYourArrivalTime"),
    notes: t("reserve.notes"),
    exNotes: t("reserve.exNotes"),
    iNeedTheChairForMyChildren: t("reserve.iNeedTheChairForMyChildren"),
    doesTheRestaurantHaveAParkingLot: t("reserve.doesTheRestaurantHaveAParkingLot"),
    canISeeTheMenuInAdvance: t("reserve.canISeeTheMenuInAdvance"),
    reserve: t("reserve.reserve"),
    submit: t("reserve.submit"),
    emailInvalid: t("reserve.emailInvalid"),
    pleaseEnterTheReservationEmail: t("reserve.pleaseEnterTheReservationEmail"),
  };

  const [note, setNote] = useState("");
  const [inputValue, setInputValue] = useState(null);
  const [isMappingBranchIcon, setIsMappingBranchIcon] = useState(false);
  const userInfo = useSelector((state) => state?.session?.userInfo);
  const suggestionList = [
    translateData.iNeedTheChairForMyChildren,
    translateData.doesTheRestaurantHaveAParkingLot,
    translateData.canISeeTheMenuInAdvance,
  ];
  
  useEffect(() => {
    if (note) {
      form.setFieldsValue({ note: note });
    }
  }, [note]);

  useEffect(() => {
    if (userInfo) {
      //getNearestStoreBranches(deliveryAddress);
      form.setFieldsValue({
        phone: userInfo?.phoneNumber,
        name: userInfo?.fullName
          ? userInfo?.fullName
          : userInfo?.firstName
          ? userInfo?.firstName
          : "" + userInfo?.lastName
          ? userInfo?.lastName
          : "",
        email: userInfo?.email,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (branchesByCustomerAddress) {
      if (deliveryAddress && branchesByCustomerAddress) {
        form.setFieldsValue({
          branch: deliveryAddress?.branchAddress?.id,
        });
        onChangeBranch(deliveryAddress?.branchAddress?.id);
      } else {
        // Case not select branch or address
        const { branchId } = branchesByCustomerAddress[0];
        form.setFieldsValue({ branch: branchId });
        onChangeBranch(branchId);
      }
    }
  }, [branchesByCustomerAddress]);

  const StyleBranchOption = styled.div`
    .branch-options-custom {
      .check-icon {
        svg {
          path {
            fill: ${colorGroup?.buttonBackgroundColor};
          }
        } 
      }
      .information {
        .branch-name {
          .distance {
            color: ${colorGroup?.buttonBackgroundColor};
          }
        }
      }
    }
  `;

  return (
    <div className="reserve-table-right-content">
      <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
        <div className="form-information-reserve">
          <span className="title">{translateData.reserveInformation}</span>
          <Form.Item
            className="w-100 branch-desktop"
            name="branch"
            label={
              <span>
                {translateData.branch}
                <span>*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: translateData.pleaseSelectTheBranch,
              },
            ]}
          >
            <Select
              placeholder={translateData.branchPlaceHolder}
              optionLabelProp="label"
              style={{ width: "100%" }}
              className="select-components"
              popupClassName="popup-reserve-table-branch-select-custom popup-reserve-table-branch-select-custom-right-content"
              onChange={onChangeBranch}
            >
              {branchesByCustomerAddress?.map((branch) => (
                <Option key={branch.branchId} value={branch.branchId} label={branch.branchName}>
                  <StyleBranchOption className="style-mapping-color">
                    <div className="branch-options-custom">
                      <CheckOutlined className="check-icon" />
                      <div className="icon">
                        <IconBranchStoreCustomize
                          color={branchAddressId == branch.branchId ? colorGroup?.buttonBackgroundColor : "#c0c0c0"}
                        />
                      </div>
                      <div className="information">
                        <span className="branch-name">
                          {branch.branchName}&nbsp;
                          {branch.distance > 0 && (
                            <span className="distance">({(branch.distance / 1000).toFixed(1)}km)</span>
                          )}
                        </span>
                        <span className="branch-address">{branch.branchAddress}</span>
                      </div>
                    </div>
                  </StyleBranchOption>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label={
              <span>
                {translateData.name}
                <span>*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: translateData.pleaseEnterTheReservationName,
              },
            ]}
          >
            <Input
              placeholder={translateData.yourFullName}
              maxLength={100}
              className="input-information-component"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label={
              <span>
                {translateData.phoneNumber}
                <span>*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: translateData.pleaseEnterTheReservationPhone,
              },
              {
                pattern: /^[\+]?[(]?[0-9]{2}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                message: translateData.invalidPhoneNumber,
              },
            ]}
          >
            <Input
              inputMode="tel"
              placeholder={translateData.phoneNumber}
              className="input-information-component"
              maxLength={15}
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="email"
            label={<span>{translateData.email}</span>}
            rules={[
              {
                type: "email",
                message: translateData.emailInvalid,
              },
            ]}
          >
            <Input
              placeholder={translateData.pleaseEnterTheReservationEmail}
              className="input-information-component"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label={
              <span>
                {translateData.numberOfGuests}
                <span>*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: translateData.pleaseEnterTheNumberOfGuests,
              },
            ]}
          >
            <Input
              placeholder={translateData.numberOfGuests}
              className="input-information-component"
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
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="time"
            label={
              <span>
                {translateData.yourArrivaltime}
                <span>*</span>
              </span>
            }
            rules={[
              {
                required: reserveTime == undefined || reserveDate == undefined,
                message: translateData.pleaseEnterYourArrivalTime,
              },
            ]}
          >
            <DateTimePickerReserveComponent
              setReserveTime={setReserveTime}
              reserveTime={reserveTime}
              setReserveDate={setReserveDate}
              reserveDate={reserveDate}
              branchAddressId={branchAddressId ?? null}
              colorGroup={colorGroup}
              selectTimeByDeliveryDay={selectTimeByDeliveryDay}
              setSelectTimeByDeliveryDay={setSelectTimeByDeliveryDay}
            />
          </Form.Item>
          <Form.Item name="note" label={<span>{translateData.notes}</span>}>
            <Input.TextArea
              className="note-information-component"
              placeholder={translateData.exNotes}
              maxLength={255}
              autoSize
              onChange={(e) => setNote(e.target.value)}
              allowClear
            />
          </Form.Item>
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
        </div>

        <Form.Item className="form-item-button-reserve">
          <Button className="button-reserve" onClick={() => onSubmitReserveForm()}>
            {translateData.reserve}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
