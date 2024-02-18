import { CheckOutlined } from "@ant-design/icons";
import { Card, Form, Radio, Row, Space, Skeleton, Button } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./filter-customer.style.scss";
import { useMediaQuery } from "react-responsive";

export default function FilterCustomer(props) {
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const {
    dataFilter,
    setDataFilter,
    handleFilterCustomer,
    pageSize,
    keySearch,
    onCloseFilter,
    requestingPlatform,
    listPlatforms,
    listCustomerMembershipLevels,
    listCustomerSegmets,
    listTags,
    handleScrollDownCustomerMembership,
    handleScrollDownCustomerSegment,
    onSearchCustomerSegment,
    onClearCustomerSegment
  } = props;
  const isMobile = useMediaQuery({ maxWidth: 576 });
  const isMaxWidth790px = useMediaQuery({ minWidth: 577, maxWidth: 790 });
  const isMaxWidth1080px = useMediaQuery({ minWidth: 791, maxWidth: 1080 });
  const MAX_LENGTH_TAG =
    isMobile || isMaxWidth1080px ? 27 : isMaxWidth790px ? 24 : 45;
  const pageData = {
    filter: {
      platform: {
        title: t("platform.title"),
      },
      customerMemberShipLevels: {
        title: t("customerManagement.filter.rank.title"),
      },
      customerSegment: {
        title: t("customerManagement.filter.customerSegment.title"),
        noSegmentIsSelected: t(
          "customerManagement.filter.customerSegment.noSegmentIsSelected"
        ),
      },
      tag: {
        title: t("customerManagement.filter.tag.title"),
        noTagIsSelected: t("customerManagement.filter.tag.noTagIsSelected"),
      },
      resetAllfilters: t("customerManagement.filter.resetAllFilters"),
      title: t("customerManagement.filter.title"),
      cancel: t("customerManagement.filter.cancel"),
      apply: t("customerManagement.filter.apply"),
    },
  };

  const defaultPlatformId = "";
  const defaultValueCustomerMembershipLevel = "";

  const [isHaveTag, setIsHaveTag] = useState(false);
  const [isFocusSegment, setIsFocusSegment] = useState(false);
  const [isFocusTag, setIsFocusTag] = useState(false);

  const onApplyFilter = () => {
    var fieldsErrors = form.getFieldsError();
    let isFormValid = fieldsErrors.find((item) => item?.errors?.length > 0);
    if (isFormValid === undefined || !isFormValid) {
      let formValue = form.getFieldsValue();
      setIsHaveTag(formValue?.tagIds?.length > 0);
      if (!isMobile) {
        handleFilterCustomer(1, pageSize, keySearch, formValue);
        setDataFilter(formValue);
        formValue.count = countFilterControl(formValue);
      }
    }
  };

  // Update datafilter when using mobile
  useEffect(() => {
    if (isMobile && dataFilter) {
      form.setFieldsValue({
        platformId: dataFilter?.platformId ?? defaultPlatformId,
        customerMembershipId:
          dataFilter?.customerMembershipId ??
          defaultValueCustomerMembershipLevel,
      });

      if (dataFilter?.customerSegmentId) {
        form.setFieldsValue({
          customerSegmentId: dataFilter?.customerSegmentId,
        });
      } else {
        form.resetFields(["customerSegmentId"]);
      }
      if (dataFilter?.tagIds) {
        form.setFieldsValue({
          tagIds: dataFilter?.tagIds,
        });
        setIsHaveTag(dataFilter?.tagIds?.length > 0);
      } else {
        form.resetFields(["tagIds"]);
      }
    }
  }, []);
  const handleApplyFilter = () => {
    let formValue = form.getFieldsValue();
    formValue.count = countFilterControl(formValue);
    handleFilterCustomer(1, pageSize, keySearch, formValue);
    setDataFilter(formValue);
    onCloseFilter();
  };

  const countFilterControl = (formValue) => {
    let countPlatform =
      formValue.platformId === "" || formValue.platformId === undefined ? 0 : 1;
    let countcustomerMembership =
      formValue.customerMembershipId === "" ||
      formValue.customerMembershipId === undefined
        ? 0
        : 1;
    let countCustomerSegmentId =
      formValue.customerSegmentId === "" ||
      formValue.customerSegmentId === undefined
        ? 0
        : 1;
    let countTag =
      formValue.tagIds === "" ||
      formValue.tagIds === undefined ||
      formValue.tagIds?.length == 0
        ? 0
        : 1;
    return (
      countPlatform +
      countcustomerMembership +
      countCustomerSegmentId +
      countTag
    );
  };

  const onResetForm = () => {
    form?.resetFields();
    if (isMobile) {
      form.setFieldsValue({
        customerMembershipId: defaultValueCustomerMembershipLevel,
      });
    } else {
      onApplyFilter();
    }
  };

  return (
    <Form
      form={form}
      onFieldsChange={onApplyFilter}
      className="filter-customer-management"
    >
      <Card className="form-filter-popover">
        {/* Title filter */}
        {isMobile && (
          <div className="top-popover-customer">
            <span className="top-popover-customer__top-title">
              {pageData.filter.title}
            </span>
            <div className="top-popover-customer__list-buttons">
              <Button
                className="top-popover-customer__button top-popover-customer__button--cancel"
                onClick={onCloseFilter}
              >
                {pageData.filter.cancel}
              </Button>
              <Button
                className="top-popover-customer__button top-popover-customer__button--apply"
                onClick={handleApplyFilter}
              >
                {pageData.filter.apply}
              </Button>
            </div>
          </div>
        )}
        {/* Platform */}
        <Row>
          <div className="first-column">
            <span>{pageData.filter.platform.title}</span>
          </div>
          <div className="second-column">
            {requestingPlatform === true ? (
              <Space className="skeleton-platform">
                <Skeleton.Button active={true} size="default" shape="round" />
                <Skeleton.Avatar active={true} size="default" shape="circle" />
                <Skeleton.Input active={true} size="default" />
              </Space>
            ) : (
              <Form.Item name="platformId">
                <Radio.Group
                  defaultValue={defaultPlatformId}
                  buttonStyle="solid"
                  className="filter-customer-management__options-sale-channels"
                >
                  {listPlatforms?.map((item, index) => (
                    <Radio.Button value={item?.id} key={index}>
                      <CheckOutlined className="check-icon" /> {item?.name}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            )}
          </div>
        </Row>
        {/* Rank */}
        <Row>
          <div className="first-column">
            <span>{pageData.filter.customerMemberShipLevels.title}</span>
          </div>
          <div className="second-column">
            <Form.Item name="customerMembershipId">
              <FnbSelectSingle
                className="form-select"
                fixed
                showSearch
                defaultValue={defaultValueCustomerMembershipLevel}
                option={listCustomerMembershipLevels}
                onPopupScroll={handleScrollDownCustomerMembership}
              />
            </Form.Item>
          </div>
        </Row>
        {/* Customer segment */}
        <Row>
          <div className="first-column">
            <span>{pageData.filter.customerSegment.title}</span>
          </div>
          <div
            className={`second-column selection-item-customer-manager ${
              isFocusSegment
                ? "selection-item-customer-manager--show-clear-icon"
                : ""
            } `}
          >
            <Form.Item name="customerSegmentId">
              <FnbSelectSingle
                placeholder={
                  pageData.filter.customerSegment.noSegmentIsSelected
                }
                className="form-select"
                showSearch
                allowClear
                fixed={!isMobile}
                option={listCustomerSegmets}
                onPopupScroll={handleScrollDownCustomerSegment}
                onFocus={() => setIsFocusSegment(true)}
                onBlur={() => setIsFocusSegment(false)}
                onSearch={onSearchCustomerSegment}
                onClear={onClearCustomerSegment}
              />
            </Form.Item>
          </div>
        </Row>
        {/* Tag */}
        <Row>
          <div className="first-column">
            <span>{pageData.filter.tag.title}</span>
          </div>
          <div
            className={`second-column selection-item-customer-manager ${
              isFocusTag
                ? "selection-item-customer-manager--show-clear-icon"
                : ""
            }`}
          >
            <Form.Item name="tagIds">
              <FnbSelectMultiple
                fixed={!isMobile}
                placeholder={pageData.filter.tag.noTagIsSelected}
                className={`form-select select-muliple-tags-customer selection-item-customer-manager ${
                  isHaveTag
                    ? ""
                    : "select-muliple-tags-customer--not-have-value"
                }`}
                allowClear
                option={listTags?.map((item) => ({
                  id: item.id,
                  name:
                    item.name.length > MAX_LENGTH_TAG
                      ? `${item.name.substring(0, MAX_LENGTH_TAG)}...`
                      : item.name,
                }))}
                placement={`${isMobile ? "topRight" : ""}`}
                onFocus={() => setIsFocusTag(true)}
                onBlur={() => setIsFocusTag(false)}
              />
            </Form.Item>
          </div>
        </Row>

        <Row className="row-reset-filter">
          <span
            onClick={() => onResetForm()}
            className="reset-filter-customer-manager "
          >
            {pageData.filter.resetAllfilters}
          </span>
        </Row>
      </Card>
    </Form>
  );
}
