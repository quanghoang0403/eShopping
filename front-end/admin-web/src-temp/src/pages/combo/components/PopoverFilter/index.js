import { Col, Row } from "antd";
import { Container, Label, ResetFilter } from "./styled";
import { useTranslation } from "react-i18next";
import { useState, useLayoutEffect, forwardRef, useImperativeHandle } from "react";
import SingleSelect from "../SingleSelect";
import ProductSelect from "../ProductSelect";
import InputDate from "../InputDate";
import RadioButtonGroup from "../RadioButtonGroup";
import { ComboStatus, ComboType } from "constants/combo.constants";
import comboDataService from "data-services/combo/combo-data.service";
import commonDataService from "data-services/common/common-data.service";
import moment from "moment";
import { tableSettings } from "constants/default.constants";

const DEFAULT_SELECTED_ALL_VALUE = "SELECTED_ALL";
const DEFAULT_CHECK_ALL = "";
const DEFAULT_FORMAT_DATE = "DD/MM/YYYY";
const DEFAULT_FORMAT_UTC_DATE = "MM/D/YYYY, hh:mm:ss A";

const PopoverFilter = forwardRef((props, ref) => {
  const { totalFilterSelected, comboParams, onChange } = props;
  const [t] = useTranslation();
  const [branches, setBranches] = useState([]);
  const [productInCombos, setProductInCombos] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(DEFAULT_CHECK_ALL);
  const [selectedProducts, setSelectedProducts] = useState([DEFAULT_SELECTED_ALL_VALUE]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [type, setType] = useState(DEFAULT_CHECK_ALL);
  const [status, setStatus] = useState(DEFAULT_CHECK_ALL);

  const pageData = {
    resetAllFilters: t("combo.resetAllFilters"),
    branch: t("combo.branch"),
    allBranches: t("combo.allBranches"),
    fromDate: t("combo.fromDate"),
    toDate: t("combo.toDate"),
    all: t("combo.all"),
    productTitle: t("combo.product.title"),
    productAllProducts: t("combo.product.allProducts"),
    typeTitle: t("combo.type.title"),
    typeFlexible: t("combo.type.flexible"),
    typeSpecific: t("combo.type.specific"),
    statusTitle: t("combo.status.title"),
    statusActive: t("combo.status.active"),
    statusScheduled: t("combo.status.scheduled"),
    statusFinished: t("combo.status.finished"),
  };

  useLayoutEffect(() => {
    getAllBranchManagementAsync();
    getAllProductInComboAsync();
  }, []);

  useImperativeHandle(ref, () => ({
    resetFilter() {
      handleResetFilter();
    }
  }));

  const getAllBranchManagementAsync = async () => {
    await commonDataService
      .getAllBranchManagementAsync()
      .then((res) => {
        setBranches(res?.branchs?.map((branch) => ({ label: branch?.name, value: branch?.id })));
      })
      .catch((_ex) => {
        setBranches([]);
      });
  };

  const getAllProductInComboAsync = async (params) => {
    await comboDataService
      .getAllProductInComboAsync(params)
      .then((res) => {
        setProductInCombos(res?.products);
      })
      .catch((_ex) => {
        setProductInCombos([]);
      });
  };

  const typeOptions = [
    {
      label: t(pageData.typeFlexible),
      value: ComboType.Fixed,
    },
    {
      label: t(pageData.typeSpecific),
      value: ComboType.Specific,
    },
  ];

  const statusOptions = [
    {
      label: t(pageData.statusActive),
      value: ComboStatus.Active,
    },
    {
      label: t(pageData.statusScheduled),
      value: ComboStatus.Schedule,
    },
    {
      label: t(pageData.statusFinished),
      value: ComboStatus.Finish,
    },
  ];

  const handleChangeBranch = (branchId) => {
    setSelectedBrand(branchId);
    setSelectedProducts([DEFAULT_SELECTED_ALL_VALUE]);

    if (branchId) {
      getAllProductInComboAsync({ branchId });
    } else {
      getAllProductInComboAsync();
    }
    onChange && onChange({
      ...comboParams,
      pageNumber: tableSettings.page,
      branchId,
      productIds: [],
    });
  };

  const handleChangeProducts = (productIds) => {
    setSelectedProducts(productIds);
    onChange &&
      onChange({
        ...comboParams,
        pageNumber: tableSettings.page,
        productIds: productIds?.filter((option) => option !== DEFAULT_SELECTED_ALL_VALUE) || [],
      });
  };

  const handleChangeFromDate = (_date, dateString) => {
    setFromDate(dateString);
    setToDate("");
    onChange &&
      onChange({
        ...comboParams,
        pageNumber: tableSettings.page,
        fromDate: moment(dateString, DEFAULT_FORMAT_DATE).isValid()
          ? moment(dateString, DEFAULT_FORMAT_DATE).startOf("day").locale("en-US").format(DEFAULT_FORMAT_UTC_DATE)
          : "",
        toDate: "",
      });
  };

  const disabledToDate = (current) => {
    return current && current < moment(fromDate, DEFAULT_FORMAT_DATE).endOf("day");
  };

  const handleChangeToDate = (_date, dateString) => {
    setToDate(dateString);
    onChange &&
      onChange({
        ...comboParams,
        pageNumber: tableSettings.page,
        toDate: moment(dateString, DEFAULT_FORMAT_DATE).isValid()
          ? moment(dateString, DEFAULT_FORMAT_DATE).endOf("day").locale("en-US").format(DEFAULT_FORMAT_UTC_DATE)
          : "",
      });
  };

  const handleChangeType = (typeId) => {
    setType(typeId);
    onChange && onChange({ ...comboParams, pageNumber: tableSettings.page, typeId });
  };

  const handleChangeStatus = (statusId) => {
    setStatus(statusId);
    onChange && onChange({ ...comboParams, pageNumber: tableSettings.page, statusId });
  };

  const handleResetFilter = () => {
    const { branchId, productIds, fromDate, toDate, typeId, statusId, ...rest } = comboParams;
    setSelectedBrand(DEFAULT_CHECK_ALL);
    setSelectedProducts([DEFAULT_SELECTED_ALL_VALUE]);
    setFromDate();
    setToDate();
    setType(DEFAULT_CHECK_ALL);
    setStatus(DEFAULT_CHECK_ALL);
    onChange && onChange({ ...rest, pageNumber: tableSettings.page });
  };

  return (
    <Container>
      <Row gutter={[10, 32]} align="top">
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Label>{pageData.branch}</Label>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <SingleSelect
            options={branches}
            placeholder={pageData.allBranches}
            onChange={handleChangeBranch}
            value={selectedBrand}
          />
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Label>{pageData.productTitle}</Label>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <ProductSelect
            options={productInCombos}
            placeholder={pageData.productAllProducts}
            onChange={handleChangeProducts}
            defaultSelectedAll={DEFAULT_SELECTED_ALL_VALUE}
            value={selectedProducts}
          />
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Label>{pageData.fromDate}</Label>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <InputDate onChange={handleChangeFromDate} value={fromDate} />
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Label>{pageData.toDate}</Label>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <InputDate disabledDate={disabledToDate} onChange={handleChangeToDate} value={toDate} disabled={!Boolean(fromDate)} />
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Label>{pageData.typeTitle}</Label>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <RadioButtonGroup options={typeOptions} onChange={handleChangeType} value={type} />
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Label>{pageData.statusTitle}</Label>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <RadioButtonGroup options={statusOptions} onChange={handleChangeStatus} value={status} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <ResetFilter disable={totalFilterSelected < 1}>
            <span onClick={handleResetFilter}>{pageData.resetAllFilters}</span>
          </ResetFilter>
        </Col>
      </Row>
    </Container>
  );
});

export default PopoverFilter;
