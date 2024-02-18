import { CheckOutlined } from "@ant-design/icons";
import { Card, Col, Radio, Row } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { PurchaseOrderStatus } from "constants/purchase-order-status.constants";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const FilterPopover = React.forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { branches, supplierFilter } = props;
  const [resetFilter, setResetFilter] = useState(false);

  const pageData = {
    filter: {
      buttonResetFilter: t("button.resetData"),
      status: {
        title: t("material.filter.status.title"),
        all: t("material.filter.status.all"),
      },
      startDate: t("promotion.form.startDate"),
      endDate: t("promotion.form.endDate"),
    },
  };
  const defaultValue = "";
  React.useImperativeHandle(ref, () => ({
    /// Export this function to props with name exportFilter and param: data
    clear() {
      console.log("clear => ");
      clearFilter();
    },
  }));
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    setResetFilter(Object.values(formData).length > 0);
    props.fetchDataPurchaseOrder(formData)
  }, [formData])

  const clearFilter = () => {
    setFormData({});
    props.fetchDataPurchaseOrder({});
  };
  

  return (
    <Card className="form-filter-popover popover-purchase-order">
      {/* BRANCH */}
      <Row className="mb-2 popover-filter-row">
        <Col span={7} className="first-column">
            <span>{t("purchaseOrder.branch")}</span>
        </Col>
        <Col span={18} className="second-column">
            <FnbSelectSingle
              className="form-select"
              showSearch
              onChange={(value) => {
                setFormData({
                  ...formData,
                  branchId: value
                })
              }}
              value={formData.branchId || ''}
              defaultValue={defaultValue}
              option={branches}
            />
        </Col>
      </Row>
      {/* Supplier */}
      <Row className="mb-2 popover-filter-row">
        <Col span={7} className="first-column">
            <span>{t("supplier.title")}</span>
        </Col>
        <Col span={18} className="second-column">
            <FnbSelectSingle
              className="form-select"
              showSearch
              onChange={(value) => {
                setFormData({
                  ...formData,
                  supplierId: value
                })
              }}
              value={formData.supplierId || ''}
              defaultValue={defaultValue}
              option={supplierFilter}
            />
        </Col>
      </Row>
      {/* STATUS */}
      <Row className="mb-3 popover-filter-row">
        <Col span={7} className="first-column">
          <span>{t("table.status")}</span>
        </Col>
        <Col span={18}>
          <Radio.Group
            value={formData.statusId == undefined ? "" : formData.statusId}
            defaultValue={defaultValue}
            buttonStyle="solid"
            onChange={(e) =>{
              setFormData({
                  ...formData,
                  statusId: e.target.value
                })
            }}
          >
            <Radio.Button value={defaultValue}>
              {formData.statusId === "" || formData.statusId == undefined && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {pageData.filter.status.all}
            </Radio.Button>
            <Radio.Button value={PurchaseOrderStatus.Canceled }>
              {formData.statusId === PurchaseOrderStatus.Canceled && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {t('status.canceled')}
            </Radio.Button>
            <Radio.Button value={PurchaseOrderStatus.Draft}>
              {formData.statusId === PurchaseOrderStatus.Draft && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {t('status.draft')}
            </Radio.Button>
            <Radio.Button value={PurchaseOrderStatus.Approved}>
              {formData.statusId === PurchaseOrderStatus.Approved && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {t('status.approved')}
            </Radio.Button>
            <Radio.Button value={PurchaseOrderStatus.Completed}>
              {formData.statusId === PurchaseOrderStatus.Completed && (
                <CheckOutlined className="check-icon" />
              )}{" "}
              {t('status.complete')}
            </Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      {/* RESET BUTTON */}
      <Row className="row-reset-filter">
        <a onClick={clearFilter} className="reset-filter" aria-current={!resetFilter && "inventory-history-filter"}> 
          {pageData.filter.buttonResetFilter}
        </a>
      </Row>
    </Card>
  );
});
