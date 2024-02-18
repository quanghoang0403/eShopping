/* eslint-disable jsx-a11y/anchor-is-valid */
import { CheckOutlined } from "@ant-design/icons";
import { Card, Col, Radio, Row } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { EnumTransferMaterialStatus } from "constants/transfer-material-history.constant";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";

export const FilterPopover = React.forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { fromWarehouseList, toWarehouseList, updatedByList } = props;
  const [selectedFromWarehouseId, setSelectedFromWarehouseId] = useState("");
  const [selectedToWarehouseId, setSelectedToWarehouseId] = useState("");
  const [selectedUpdatedId, setSelectedUpdatedId] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [resetFilter, setResetFilter] = useState(false);
  const defaultValue = "";
  const filterTypes = {
    fromWarehouse: "fromWarehouse",
    toWarehouse: "toWarehouse",
    updatedBy: "updatedId",
    status: "status",
  };

  useEffect(() => {
    let countBranch = selectedFromWarehouseId !== "" ? 1 : 0;
    let countAction = selectedToWarehouseId !== "" ? 1 : 0;
    let countMaterial = selectedUpdatedId !== "" ? 1 : 0;
    let countStatus = selectedStatusId !== "" ? 1 : 0;

    const filterOptions = {
      fromWarehouseId: selectedFromWarehouseId,
      toWarehouseId: selectedToWarehouseId,
      updatedId: selectedUpdatedId,
      statusId: selectedStatusId,
      count: countMaterial + countBranch + countAction + countStatus,
    };
    setResetFilter(filterOptions?.count < 1 ? false : true);
    props.fetchDataTransferMaterialHistory(filterOptions);
  }, [
    selectedFromWarehouseId,
    selectedToWarehouseId,
    selectedUpdatedId,
    selectedStatusId,
  ]);

  const pageData = {
    filter: {
      buttonResetFilter: t("button.resetData"),
      from: {
        title: t("transferMaterialHistory.from"),
        all: t("transferMaterialHistory.all"),
        placeholder: t("material.filter.branch.placeholder"),
        specialOptionKey: null,
      },
      destination: {
        title: t("transferMaterialHistory.destination"),
        all: t("transferMaterialHistory.all"),
        specialOptionKey: null,
      },
      updatedBy: {
        title: t("transferMaterialHistory.updatedBy"),
        all: t("transferMaterialHistory.all"),
        specialOptionKey: null,
      },
      status: {
        title: t("transferMaterialHistory.status"),
        all: t("transferMaterialHistory.all"),
        new: t("transferMaterialHistory.new"),
        inProgress: t("transferMaterialHistory.inProgress"),
        delivering: t("transferMaterialHistory.delivering"),
        completed: t("transferMaterialHistory.completed"),
        canceled: t("transferMaterialHistory.cancelled"),
        specialOptionKey: null,
      },
    },
  };

  React.useImperativeHandle(ref, () => ({
    /// Export this function to props with name exportFilter and param: data
    clear() {
      clearFilter();
    },
  }));

  const clearFilter = () => {
    setSelectedFromWarehouseId(defaultValue);
    setSelectedToWarehouseId(defaultValue);
    setSelectedUpdatedId(defaultValue);
    setSelectedStatusId(defaultValue);
  };

  const onFilterMaterial = (id, filterName) => {
    switch (filterName) {
      case filterTypes.fromWarehouse:
        setSelectedFromWarehouseId(id);
        break;
      case filterTypes.toWarehouse:
        setSelectedToWarehouseId(id);
        break;
      case filterTypes.updatedBy:
        setSelectedUpdatedId(id);
        break;
      default: //status
        setSelectedStatusId(id);
        break;
    }
  };

  return (
    <Card className="form-filter-popover popover-transfer-material-history">
      {/* FROM */}
      <Row className="mb-2 popover-filter-row">
        <Col span={6}>
          <span>{pageData.filter.from.title}</span>
        </Col>
        <Col span={18}>
          <FnbSelectSingle
            className="form-select"
            showSearch
            onChange={(value) =>
              onFilterMaterial(value, filterTypes.fromWarehouse)
            }
            value={selectedFromWarehouseId}
            defaultValue={defaultValue}
            option={toWarehouseList}
          />
        </Col>
      </Row>

      {/* DESTINATION */}
      <Row className="mb-2 popover-filter-row">
        <Col span={6}>
          <span>{pageData.filter.destination.title}</span>
        </Col>
        <Col span={18}>
          <FnbSelectSingle
            className="form-select"
            showSearch
            onChange={(value) =>
              onFilterMaterial(value, filterTypes.toWarehouse)
            }
            value={selectedToWarehouseId}
            defaultValue={defaultValue}
            option={fromWarehouseList}
          />
        </Col>
      </Row>

      {/* UPDATED BY */}
      <Row className="mb-2 popover-filter-row">
        <Col span={6}>
          <span>{pageData.filter.updatedBy.title}</span>
        </Col>
        <Col span={18}>
          <FnbSelectSingle
            className="form-select"
            showSearch
            onChange={(value) => onFilterMaterial(value, filterTypes.updatedBy)}
            value={selectedUpdatedId}
            defaultValue={defaultValue}
            option={updatedByList}
          />
        </Col>
      </Row>

      {/* STATUS */}
      <Row className="mb-3 popover-filter-row">
        <Col span={6} className="title-status-popover">
          <span>{pageData.filter.status.title}</span>
        </Col>
        <Col span={18}>
          <Radio.Group
            value={selectedStatusId}
            defaultValue={defaultValue}
            buttonStyle="solid"
            onChange={(e) =>
              onFilterMaterial(e.target.value, filterTypes.status)
            }
          >
            <Radio.Button value={defaultValue}>
              {selectedStatusId === "" && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {pageData.filter.status.all}
            </Radio.Button>
            <Radio.Button value={EnumTransferMaterialStatus.Completed}>
              {selectedStatusId === EnumTransferMaterialStatus.Completed && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {pageData.filter.status.completed}
            </Radio.Button>
            <Radio.Button value={EnumTransferMaterialStatus.Inprogress}>
              {selectedStatusId === EnumTransferMaterialStatus.Inprogress && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {pageData.filter.status.inProgress}
            </Radio.Button>
            <Radio.Button value={EnumTransferMaterialStatus.Delivering}>
              {selectedStatusId === EnumTransferMaterialStatus.Delivering && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {pageData.filter.status.delivering}
            </Radio.Button>
            <Radio.Button value={EnumTransferMaterialStatus.Canceled}>
              {selectedStatusId === EnumTransferMaterialStatus.Canceled && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {pageData.filter.status.canceled}
            </Radio.Button>
            <Radio.Button value={EnumTransferMaterialStatus.Draft}>
              {selectedStatusId === EnumTransferMaterialStatus.Draft && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {pageData.filter.status.new}
            </Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      {/* RESET BUTTON */}
      <Row className="row-reset-filter">
        <a
          onClick={clearFilter}
          className="reset-filter"
          aria-current={!resetFilter && "inventory-history-filter"}
        >
          {pageData.filter.buttonResetFilter}
        </a>
      </Row>
    </Card>
  );
});
