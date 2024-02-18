import { CheckOutlined } from "@ant-design/icons";
import { Card, Col, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const FilterPopover = React.forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { actions, branches, materials } = props;

  const [selectedStatus, setSelectedStatus] = useState("");
  const defaultValue = "";

  useEffect(() => {
    let countStatus = selectedStatus !== "" ? 1 : 0;

    const filterOptions = {
      status: selectedStatus,
      count: countStatus,
    };
    props.fetchData(filterOptions);
  }, [selectedStatus]);

  //#region PageData
  const pageData = {
    filter: {
      buttonResetFilter: t("button.resetData"),
      status: {
        all: t("material.filter.status.all"),
        title: t("material.filter.status.title"),
        active: t("promotion.status.active"),
        scheduled: t("promotion.status.scheduled"),
        finished: t("promotion.status.finished"),
        specialOptionKey: null,
      },
    },
  };
  //#endregion

  React.useImperativeHandle(ref, () => ({
    /// Export this function to props with name exportFilter and param: data
    clear() {
      clearFilter();
    },
  }));

  const clearFilter = () => {
    setSelectedStatus(defaultValue);
  };

  const onFilterMaterial = (id) => {
    setSelectedStatus(id);
  };

  return (
    <Card className="flash-sale-form-filter-popover">
      {/* STATUS */}
      <Row className="mb-3 popover-filter-row">
        <Col span={6}>
          <span>{pageData.filter.status.title}</span>
        </Col>
        <Col span={18}>
          <Radio.Group
            value={selectedStatus}
            defaultValue={defaultValue}
            buttonStyle="solid"
            onChange={(e) => onFilterMaterial(e.target.value)}
          >
            <Radio.Button value={defaultValue}>
              {selectedStatus === "" && <CheckOutlined className="check-icon" />} {pageData.filter.status.all}
            </Radio.Button>
            <Radio.Button value={1}>
              {selectedStatus === 1 && <CheckOutlined className="check-icon" />} {pageData.filter.status.active}
            </Radio.Button>
            <Radio.Button value={0}>
              {selectedStatus === 0 && <CheckOutlined className="check-icon" />} {pageData.filter.status.scheduled}
            </Radio.Button>
            <Radio.Button value={2}>
              {selectedStatus === 2 && <CheckOutlined className="check-icon" />} {pageData.filter.status.finished}
            </Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      {/* RESET BUTTON */}
      <Row className="row-reset-filter">
        <a onClick={clearFilter} className="reset-filter">
          {pageData.filter.buttonResetFilter}
        </a>
      </Row>
    </Card>
  );
});
