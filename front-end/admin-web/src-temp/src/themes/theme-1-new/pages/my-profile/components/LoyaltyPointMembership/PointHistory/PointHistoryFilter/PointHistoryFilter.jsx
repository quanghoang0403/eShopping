import { CheckOutlined, CloseCircleFilled } from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  DatePicker,
  Form,
  Popover,
  Radio,
  Row,
} from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FilterIcon,
  SearchICon,
} from "../../../../../../assets/icons.constants";
import { FnbInput } from "../../../../../../components/fnb-input/fnb-input.component";
import { DateFormat } from "../../../../../../constants/string.constants";
import "./PointHistoryFilter.scss";
import { useMediaQuery } from "react-responsive";

function PointHistoryFilter(props) {
  const { handleOnSubmitFilter, handleChangeKeySearch, countFilter } = props;
  const [form] = Form.useForm();
  const isMobileDevice = useMediaQuery({ maxWidth: 576 });
  const [t] = useTranslation();
  const translateData = {
    activePoint: t("loyaltyPoint.activePoint"),
    allPoints: t("loyaltyPoint.allPoints"),
    usedPoints: t("loyaltyPoint.usedPoints"),
    earnedPoints: t("loyaltyPoint.earnedPoints"),
    newestOnTop: t("loyaltyPoint.newestOnTop"),
    point: t("loyaltyPoint.point"),
    filterBy: t("loyaltyPoint.filterBy"),
    filter: t("loyaltyPoint.filter"),
    sortBy: t("loyaltyPoint.sortBy"),
    fromTo: t("loyaltyPoint.fromTo"),
    apply: t("loyaltyPoint.apply"),
    reset: t("loyaltyPoint.reset"),
    setTime: t("loyaltyPoint.setTime"),
    anytime: t("loyaltyPoint.anytime"),
    from: t("loyaltyPoint.from"),
    to: t("loyaltyPoint.to"),
    fromDate: t("loyaltyPoint.fromDate"),
    toDate: t("loyaltyPoint.toDate"),
    searchByOrderId: t("loyaltyPoint.searchByOrderId")
  };
  const [selectedDatePicker, setSelectedDatePicker] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [params, setParams] = useState({
    enumPointHistoryFilterSortType: 1,
    enumPointHistoryFilterType: 1,
    keySearch: "",
    fromTo: 1,
  });

  const content = (
    <Form
      form={form}
      onFieldsChange={() =>
        setSelectedDatePicker(form.getFieldValue(["fromTo"]))
      }
      className="content-theme1"
      onFinish={(values) =>
        handleOnSubmitFilter && handleOnSubmitFilter(values, form)
      }
      initialValues={params}
    >
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
        <Col className="title-name"> {translateData.fromTo}</Col>
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
                  className="date-picker-customize-theme1"
                  format={DateFormat.DD_MM_YYYY}
                  placeholder={translateData.fromDate}
                  popupClassName="popup-picker-customize-theme1"
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
                  className="date-picker-customize-theme1"
                  format={DateFormat.DD_MM_YYYY}
                  placeholder={translateData.toDate}
                  popupClassName="popup-picker-customize-theme1"
                  showToday={false}
                  disabledDate={value => value < form?.getFieldValue(["startDate"])}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

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
        <Col className="btn-apply" onClick={() => setIsShowFilter(false)}>
          <Button type="submit">{translateData.apply}</Button>
        </Col>
      </Row>
    </Form>
  );

  return (
    <div className="point-history-filter-theme1">
      <div className="search">
        <FnbInput
          prefix={<SearchICon />}
          placeholder={translateData.searchByOrderId}
          className="input-search"
          onChange={(event) =>
            handleChangeKeySearch && handleChangeKeySearch(event?.target?.value)
          }
        />
      </div>
      <div className="filter">
        <Popover
          content={content}
          trigger="click"
          placement={isMobileDevice ? "bottom" : "bottomRight"}
          overlayClassName="popover-point-history-customize"
          open={isShowFilter}
          onOpenChange={isOpen => setIsShowFilter(isOpen)}
        >
          {!isMobileDevice ? (
            <Button
              icon={<FilterIcon />}
              className={`btn-filter ${
                countFilter > 0 ? "btn-filter-icon" : ""
              }`}
              onClick={() => setIsShowFilter(true)}
            >
              {translateData.filter}
              {countFilter > 0 ? (
                <div className="filter-count-number">{`(${countFilter})`}</div>
              ) : null}
            </Button>
          ) : (
            <Badge count={countFilter > 0 ? countFilter : 0}>
              <Button
                icon={<FilterIcon />}
                className={`btn-filter ${
                  countFilter > 0 ? "btn-filter-icon" : ""
                }`}
                onClick={() => setIsShowFilter(true)}
              />
            </Badge>
          )}
        </Popover>
      </div>
    </div>
  );
}

export default PointHistoryFilter;
