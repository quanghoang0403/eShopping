import { CaretDownOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Select } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { getStorage, localStorageKeys } from "../../../../../utils/localStorage.helpers";
import {
  BranchIcon,
  CircleCheckIcon,
  CircleUnCheckIcon,
  LocationAreaIcon,
  LocationReservePageIcon,
  NoTableIcon,
} from "../../../../assets/icons.constants";
import noneReserveATable from "../../../../assets/images/reserve-area-default-theme2.png";
import areaDataService from "./../../../../../data-services/area-data.service";
import InformationOfFormComponent from "./InformationCustomerForm";
import TableListOrSwiperFormComponent from "./TableListOrSwiperForm";

const { Option } = Select;

const TableReserveFormComponent = (props) => {
  const {
    form,
    onFinish,
    value,
    setValue,
    reserveTime,
    setReserveTime,
    reserveDate,
    setReserveDate,
    note,
    setNote,
    inputValue,
    setInputValue,
    branchAddressId,
    branchesByCustomerAddress,
    onChangeBranch,
    colorGroupReservation,
    reserveTableData,
    areaSelected,
    handleChangeArea,
    tableSelected,
    setAreaTableDetail,
    setIsVisibleArea,
    setIsVisibleAreaTable,
    setTableSelected,
    translateData,
    areaTableDetail,
    fontFamily,
    handleSetDescriptionArea,
  } = props;
  const isMaxWidth768 = useMediaQuery({ maxWidth: 768 });
  const userInfo = useSelector((state) => state?.session?.userInfo);
  const customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
  const accessToken = getStorage(localStorageKeys.TOKEN);
  const isLogin = customerInfo && accessToken;
  useEffect(() => {
    if (userInfo && isLogin) {
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

  const handleOnClickViewDetail = async (area) => {
    await areaDataService.getDescriptionById(area.id).then((response) => {
      const description = response?.data?.description;
      handleSetDescriptionArea(area, description);
    });
    setIsVisibleArea(true);
  };

  const renderResereTableArea = (area) => {
    return (
      <>
        <div className="select-option-area-img">
          <img src={areaSelected?.imageUrl ? areaSelected?.imageUrl : noneReserveATable} alt="" />
        </div>
        {areaSelected?.shortDescription && (
          <div className="select-option-content">
            {areaSelected?.shortDescription ? (
              <div>
                <Paragraph
                  ellipsis={{
                    rows: 2,
                    expandable: false,
                    suffix: (
                      <span className="see-more-text" onClick={() => handleOnClickViewDetail(area)}>
                        {translateData.viewDetail}
                      </span>
                    ),
                  }}
                >
                  {areaSelected?.shortDescription}
                </Paragraph>
              </div>
            ) : (
              <div className="wrapper-see-more-image" onClick={() => handleOnClickViewDetail(area)}>
                <span>-</span>
                <span className="see-more-image">{translateData.viewDetail}</span>
              </div>
            )}
          </div>
        )}
      </>
    );
  };
  const handleSelectTable = (table) => {
    if (!tableSelected?.includes(table)) {
      if (tableSelected) {
        setTableSelected([...tableSelected, table]);
      } else {
        setTableSelected([table]);
      }
    } else if (tableSelected) {
      const filteredArray = tableSelected?.filter((item) => {
        return !(item.areaId === table.areaId && item.name === table.name);
      });
      setTableSelected(filteredArray);
    }
  };

  return (
    <Form layout={"vertical"} form={form} className="reserve-table-form" onFinish={onFinish}>
      <div className="reserve-table-form-field">
        <InformationOfFormComponent
          {...props}
          value={value}
          setValue={setValue}
          reserveTime={reserveTime}
          setReserveTime={setReserveTime}
          reserveDate={reserveDate}
          setReserveDate={setReserveDate}
          note={note}
          setNote={setNote}
          inputValue={inputValue}
          setInputValue={setInputValue}
          branchAddressId={branchAddressId}
        />
        <div>
          <Row className="reserve-table-form-field-location">
            <h1>*{translateData.selectLocation}</h1>
          </Row>
          <Row className="reserve-table-form-field-multiple">
            <Col className="gutter-row" span={24}>
              <Form.Item name="branch" className="form-item" label={translateData.branch}>
                <Select
                  placeholder={translateData.branchPlaceHolder}
                  optionLabelProp="label"
                  className="select-components"
                  popupClassName="popup-reserve-table-branch-select-custom-theme-2"
                  suffixIcon={<CaretDownOutlined />}
                  onChange={(e) => {
                    onChangeBranch(e);
                  }}
                  autoComplete="off"
                  showSearch={false}
                >
                  {branchesByCustomerAddress?.map((branch) => (
                    <Option key={branch.branchId} value={branch.branchId} label={branch.branchName}>
                      <div className="branch-options-custom" style={{ fontFamily: fontFamily }}>
                        <div className="icon">
                          <BranchIcon />
                        </div>
                        <div className="information">
                          <span className="branch-name" style={{ color: colorGroupReservation?.titleColor }}>
                            {branch.branchName}
                            {branch.distance > 0 && (
                              <span className="branch-distance" style={{ color: colorGroupReservation?.textColor }}>
                                {(branch.distance / 1000).toFixed(1).toString()?.replace(".", ",")}km
                              </span>
                            )}
                          </span>
                          <span className="branch-address">{branch.branchAddress}</span>
                        </div>
                        <div className="check-icon">
                          <CircleCheckIcon className="checked" />
                          <CircleUnCheckIcon className="un-checked" />
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row className="reserve-table-form-select-location">
            {!reserveTableData?.length ? (
              <div className="reserve-table-form-location-error">
                <LocationReservePageIcon className="icon" />
                <span className="text">{translateData.noAreaContent}</span>
              </div>
            ) : (
              <>
                <div className="reserve-table-form-location">
                  <Col span={0} xs={0} sm={0} md={0} lg={0} xl={8} xxl={8} className="reserve-table-select-area">
                    {reserveTableData?.map((area, index) => (
                      <>
                        <div key={index} className="select-option-area-table-map">
                          {area?.id !== areaSelected?.id ? (
                            <>
                              <LocationAreaIcon />
                              <div
                                onClick={() => {
                                  handleChangeArea(area);
                                }}
                                className="select-option-field"
                              >
                                {area.name}
                              </div>
                            </>
                          ) : (
                            <div className="reserve-table-select-option-area">
                              <div className="select-option-area-icon">
                                <LocationAreaIcon />
                                <div className="select-option-field">{areaSelected?.name}</div>
                              </div>
                              {renderResereTableArea(area)}
                            </div>
                          )}
                        </div>
                      </>
                    ))}
                  </Col>
                  <Col
                    span={0}
                    xs={0}
                    sm={0}
                    md={0}
                    lg={0}
                    xl={1}
                    xxl={1}
                    className="reserve-table-select-area-space"
                  ></Col>
                  <Col
                    span={24}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={15}
                    xxl={15}
                    className="reserve-table-select-table"
                  >
                    <span className="table-name">
                      {translateData.locationSelected}:{" "}
                      {tableSelected?.length > 0 && (
                        <span className="location">
                          {areaSelected?.name}
                          {" - "}
                          {tableSelected?.map((table) => table?.name).join(", ")}
                        </span>
                      )}
                    </span>
                    <Col span={24} xs={24} sm={24} md={24} lg={24} xl={0} xxl={0}>
                      <div className="reserve-table-select-option-area">
                        <div className="select-option-area-responsive">
                          <LocationAreaIcon />
                          <div className="select-option-area-icon-responsive">
                            <Select
                              placeholder={translateData.branchPlaceHolder}
                              optionLabelProp="label"
                              className="select-area-components"
                              popupClassName="popup-reserve-table-option-area-select-custom"
                              suffixIcon={<CaretDownOutlined />}
                              value={areaSelected?.id}
                            >
                              {reserveTableData?.map((area) => (
                                <Option
                                  key={area?.id}
                                  value={area?.id}
                                  label={area?.name}
                                  className={area?.id === areaSelected?.id ? "hidden-option" : ""}
                                >
                                  <div
                                    className="option-field"
                                    onClick={() => {
                                      handleChangeArea(area);
                                    }}
                                  >
                                    <LocationAreaIcon />
                                    <span className="area-name">{area?.name}</span>
                                  </div>
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                        <div className="location-responsive">{renderResereTableArea(areaSelected)}</div>
                      </div>
                    </Col>
                    <Col
                      span={24}
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                      xxl={24}
                      className={`col-area-table is-show`}
                    >
                      {areaSelected?.tables?.length <= 0 && (
                        <Row className="no-table-data-row">
                          <Col className="no-table-data-col">
                            <div>
                              <NoTableIcon />
                            </div>
                            <span className="no-table-content">{translateData.noAreaContent}</span>
                          </Col>
                        </Row>
                      )}
                      <TableListOrSwiperFormComponent
                        areaSelected={areaSelected}
                        tableSelected={tableSelected}
                        handleSelectTable={handleSelectTable}
                        translateData={translateData}
                        setAreaTableDetail={setAreaTableDetail}
                        setIsVisibleAreaTable={setIsVisibleAreaTable}
                      />
                    </Col>
                  </Col>
                </div>
              </>
            )}
          </Row>
        </div>
      </div>
      <Row className={`submit-reserve-table ${isMaxWidth768 ? "" : "is-show"}`}>
        <Button className="button-submit-reserve-table" htmlType="submit">
          {translateData.reserve}
        </Button>
      </Row>
    </Form>
  );
};
export default memo(TableReserveFormComponent);
