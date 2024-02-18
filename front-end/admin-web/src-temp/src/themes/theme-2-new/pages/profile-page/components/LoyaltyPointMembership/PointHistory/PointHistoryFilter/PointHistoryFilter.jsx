import { CheckOutlined } from "@ant-design/icons";
import { Badge, Button, Col, DatePicker, Form, Popover, Radio, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { FilterLoyaltyPointIcon, SearchICon } from "../../../../../../assets/icons.constants";
import { FnbInput } from "../../../../../../components/fnb-input/fnb-input.component";
import { DateFormat } from "../../../../../../constants/string.constant";
import "./PointHistoryFilter.scss";

function PointHistoryFilter(props) {
  const { handleOnSubmitFilter, handleChangeKeySearch, countFilter } = props;
  const [form] = Form.useForm();
  const isMobileDevice = useMediaQuery({ maxWidth: 576 });
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [t] = useTranslation();
  const translateData = {
    activePoint: t("loyaltyPoint.activePoint"),
    allPoints: t("loyaltyPoint.allPoints"),
    usedPoints: t("loyaltyPoint.usedPoints"),
    earnedPoints: t("loyaltyPoint.earnedPoints"),
    newestOnTop: t("loyaltyPoint.newestOnTop"),
    point: t("loyaltyPoint.point"),
    filter: t("loyaltyPoint.filter"),
    sortBy: t("loyaltyPoint.sortBy"),
    fromTo: t("loyaltyPoint.fromTo"),
    apply: t("loyaltyPoint.apply"),
    reset: t("loyaltyPoint.reset"),
    setTime: t("loyaltyPoint.setTime"),
    anytime: t("loyaltyPoint.anytime"),
    from: t("loyaltyPoint.from"),
    to: t("loyaltyPoint.to"),
    searchByOrderId: t("loyaltyPoint.searchByOrderId"),
  };
  const [selectedDatePicker, setSelectedDatePicker] = useState(false);
  const [params, setParams] = useState({
    enumPointHistoryFilterSortType: 1,
    keySearch: "",
    enumPointHistoryFilterType: 1,
    startDate: "",
    endDate: "",
    fromTo: 1,
  });

  const content = (
    <Form
      form={form}
      onFieldsChange={() => setSelectedDatePicker(form?.getFieldValue(["fromTo"]))}
      className="content-theme2"
      onFinish={(values) => handleOnSubmitFilter && handleOnSubmitFilter(values, form)}
      initialValues={params}
    >
      {!isMobileDevice ? null : (
        <Row className="submit-form">
          <Col
            className="btn-reset"
            onClick={() => {
              form?.resetFields();
              handleOnSubmitFilter && handleOnSubmitFilter(params);
            }}
          >
            {translateData.reset}
          </Col>
          <Col className="btn-apply">
            <button type="submit" onClick={() => setIsShowFilter(false)}>
              {translateData.apply}
            </button>
          </Col>
        </Row>
      )}

      <Row className="filter-by">
        <Col className="title-name">{translateData.filter}</Col>
        <Col className="radio-group">
          <Form.Item name="enumPointHistoryFilterType">
            <Radio.Group defaultValue={1} buttonStyle="solid">
              <Radio.Button value={1}>
                <CheckOutlined className="check-icon" />
                {translateData.activePoint}
              </Radio.Button>
              <Radio.Button value={2}>
                <CheckOutlined className="check-icon" />
                {translateData.allPoints}
              </Radio.Button>
              <Radio.Button value={3}>
                <CheckOutlined className="check-icon" />
                {translateData.usedPoints}
              </Radio.Button>
              <Radio.Button value={4}>
                <CheckOutlined className="check-icon" />
                {translateData.earnedPoints}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Row className="sort-by">
        <Col className="title-name">{translateData.sortBy}</Col>
        <Col className="radio-group">
          <Form.Item name="enumPointHistoryFilterSortType">
            <Radio.Group defaultValue={1} buttonStyle="solid">
              <Radio.Button value={1}>
                <CheckOutlined className="check-icon" />
                {translateData.newestOnTop}
              </Radio.Button>
              <Radio.Button value={2}>
                <CheckOutlined className="check-icon" />
                {translateData.point}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Row className="from-to">
        <Col className="title-name">{translateData.fromTo}</Col>
        <Col className="radio-group">
          <Form.Item name="fromTo">
            <Radio.Group defaultValue={1} buttonStyle="solid">
              <Radio.Button value={1}>
                <CheckOutlined className="check-icon" />
                {translateData.anytime}
              </Radio.Button>
              <Radio.Button value={2}>
                <CheckOutlined className="check-icon" />
                {translateData.setTime}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      {selectedDatePicker > 1 && (
        <>
          <Row className="from-time">
            <Col className="title-name">{translateData.from}</Col>
            <Col className="date-picker">
              <Form.Item name="startDate">
                <DatePicker
                  className="date-picker-customize-theme2"
                  format={DateFormat.DD_MM_YYYY}
                  placeholder="dd-mm-yyyy"
                  popupClassName="popup-picker-customize-theme2"
                  showToday={false}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="to-time">
            <Col className="title-name">{translateData.to}</Col>
            <Col className="date-picker">
              <Form.Item name="endDate">
                <DatePicker
                  className="date-picker-customize-theme2"
                  format={DateFormat.DD_MM_YYYY}
                  placeholder="dd-mm-yyyy"
                  popupClassName="popup-picker-customize-theme2"
                  showToday={false}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
      {isMobileDevice ? null : (
        <Row className="submit-form">
          <Col
            className="btn-reset"
            onClick={() => {
              form?.resetFields();
              handleOnSubmitFilter && handleOnSubmitFilter(params);
            }}
          >
            {translateData.reset}
          </Col>
          <Col className="btn-apply">
            <button type="submit" onClick={() => setIsShowFilter(false)}>
              {translateData.apply}
            </button>
          </Col>
        </Row>
      )}
    </Form>
  );

  return (
    <div className="point-history-filter-theme2">
      <div className="search">
        <FnbInput
          prefix={<SearchICon />}
          placeholder={translateData.searchByOrderId}
          className="input-search"
          onChange={(event) => handleChangeKeySearch && handleChangeKeySearch(event?.target?.value)}
        />
      </div>
      <div className="filter">
        <Popover
          content={content}
          trigger="click"
          placement={"bottomRight"}
          overlayClassName="popover-point-history-customize-theme2"
          open={isShowFilter}
          onOpenChange={(isOpen) => setIsShowFilter(isOpen)}
        >
          {countFilter > 0 && isMobileDevice ? (
            <Badge count={countFilter}>
              <Button
                icon={<FilterLoyaltyPointIcon />}
                className="btn-filter"
                onClick={() => setIsShowFilter(true)}
              ></Button>
            </Badge>
          ) : countFilter < 1 ? (
            <Button
              icon={<FilterLoyaltyPointIcon />}
              className="btn-filter"
              onClick={() => setIsShowFilter(true)}
            ></Button>
          ) : (
            <Button
              icon={<FilterLoyaltyPointIcon />}
              className="btn-filter btn-filter-desktop-devices"
              onClick={() => setIsShowFilter(true)}
            >
              <div className="filter-count-number">{`(${countFilter})`}</div>
            </Button>
          )}
        </Popover>
      </div>
    </div>
  );
}

export default PointHistoryFilter;
