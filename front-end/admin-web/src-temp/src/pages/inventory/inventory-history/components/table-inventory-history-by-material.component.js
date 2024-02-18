import { Button, Card, Col, Form, Modal, Popover, Row, message } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { FnbTable } from "components/fnb-table/fnb-table";
import { ArrowDropDownIcon, FlashSaleCalendarIcon } from "constants/icons.constants";
import { ListInventoryHistoryAction } from "constants/inventory-history-action.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import inventoryHistoryDataService from "data-services/inventory/inventory-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import languageService from "services/language/language.service";
import { executeAfter, formatNumberDecimalOrInteger, handleDownloadFile, hasPermission } from "utils/helpers";
import { FilterPopover } from "./filter-popover.component";
import "./index.scss";
import "./table-inventory-history.component.scss";

const TableInventoryHistoryByMaterialComponent = (props) => {
  const [t] = useTranslation();
  const MAX_LENGTH_SEARCH = 100;
  const pageData = {
    btnFilter: t("button.filter"),
    table: {
      searchPlaceholder: t("inventoryHistory.searchPlaceHolder"),
      time: t("order.time"),
      material: t("material.material"),
      sku: t("material.inventory.sku"),
      category: t("form.category"),
      branch: t("purchaseOrder.branch"),
      unit: t("table.unit"),
      totalChange: t("inventoryHistory.totalChange"),
      remain: t("inventoryHistory.remain"),
      action: t("inventoryHistory.action"),
      note: t("form.note"),
      reference: t("inventoryHistory.reference"),
      createdBy: t("table.createdBy"),
    },
    date: {
      yesterday: "dashboard.compareDate.yesterday",
      previousDay: "dashboard.compareDate.previousDay",
      lastWeek: "dashboard.compareDate.lastWeek",
      previousWeek: "dashboard.compareDate.previousWeek",
      lastMonth: "dashboard.compareDate.lastMonth",
      previousMonth: "dashboard.compareDate.previousMonth",
      lastYear: "dashboard.compareDate.lastYear",
      previousSession: t("dashboard.compareDate.previousSession"),
    },
    today: t("optionDatetime.today"),
    yesterday: "dashboard.compareDate.yesterday",
    buttonIGotIt: t("form.buttonIGotIt"),
    notificationTitle: t("form.notificationTitle"),
    materialIsDeleted: t("inventoryHistory.materialIsDeleted"),
    btnExport: t("button.export"),
  };

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [showPopover, setShowPopover] = useState(true);
  const [countFilter, setCountFilter] = useState(0);
  const [branches, setBranches] = useState([]);
  const [materialCategories, setMaterialCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString("en-US"),
    endDate: moment().toDate().toLocaleDateString("en-US"),
  });
  const [dataFilter, setDataFilter] = useState({});
  const [keySearchFilter, setKeySearchFilter] = useState("");
  const filterPopoverRef = React.useRef();
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.yesterday);
  const [showModalNotification, setShowModalNotification] = useState(false);
  const [categoryFilterOptions, setCategoryFilterOptions] = useState([]);
  const [materialFilters, setMaterialFilters] = useState([]);

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.table.time,
        dataIndex: "time",
        width: "10%",
        align: "center",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={24}>
                  <span className="inventory-history-time">{record?.time?.format(DateFormat.HH_MM)}</span>
                </Col>
              </Row>
              <Row className="flash-sale-list-date">
                <Col span={6}>
                  <FlashSaleCalendarIcon />
                </Col>
                <Col span={18}>
                  <Col span={24}>{record?.time?.format(DateFormat.DD_MM_YYYY)}</Col>
                </Col>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.table.material,
        dataIndex: "materialName",
        className: "table-text-supplier-overflow",
        render: (_, record) => {
          if (record?.isDeleted) {
            return (
              <div
                onClick={() => {
                  setShowModalNotification(true);
                }}
              >
                <Paragraph
                  style={{ maxWidth: "inherit" }}
                  placement="top"
                  ellipsis={{ tooltip: record.materialName }}
                  color="#50429B"
                >
                  <a> {record.materialName}</a>
                </Paragraph>
              </div>
            );
          }
          return (
            <div>
              <Link to={`/inventory/material/detail/${record?.materialId}`} target="_blank">
                <Paragraph
                  style={{ maxWidth: "inherit" }}
                  placement="top"
                  ellipsis={{ tooltip: record.materialName }}
                  color="#50429B"
                >
                  <a> {record.materialName}</a>
                </Paragraph>
              </Link>
            </div>
          );
        },
      },
      {
        title: pageData.table.sku,
        dataIndex: "sku",
        width: "10%",
      },
      {
        title: pageData.table.category,
        dataIndex: "category",
        width: "10%",
        className: "table-text-branch-overflow",
        render: (_, record) => {
          return (
            <Paragraph
              style={{ maxWidth: "inherit" }}
              placement="top"
              ellipsis={{ tooltip: record.category }}
              color="#50429B"
            >
              <a> {record.category}</a>
            </Paragraph>
          );
        },
      },
      {
        title: pageData.table.branch,
        dataIndex: "branchName",
        width: "20%",
        className: "table-text-branch-overflow",
        render: (_, record) => {
          return (
            <Paragraph
              style={{ maxWidth: "inherit" }}
              placement="top"
              ellipsis={{ tooltip: record.branchName }}
              color="#50429B"
            >
              <a> {record.branchName}</a>
            </Paragraph>
          );
        },
      },
      {
        title: pageData.table.unit,
        dataIndex: "baseUnitName",
        width: "10%",
      },
      {
        title: pageData.table.totalChange,
        width: "10%",
        render: (_, record) => {
          return record?.totalChange > 0
            ? "+" + formatNumberDecimalOrInteger(record?.totalChange)
            : formatNumberDecimalOrInteger(record?.totalChange);
        },
      },
      {
        title: pageData.table.remain,
        dataIndex: "newQuantity",
        width: "10%",
        className: "table-inventory-history-text-remain",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={24}>
                  {record?.refund < 0
                    ? 0
                    : record?.newQuantity < 0
                    ? 0
                    : formatNumberDecimalOrInteger(record?.newQuantity)}
                  <Popover
                    placement="bottomLeft"
                    content={record?.unitConversion?.map((unit, index) => {
                      return (
                        <>
                          <Row
                            className="inventory-history-tooltip"
                            style={index % 2 === 0 ? { background: "#F9F8FF" } : { background: "#FFFFFF" }}
                          >
                            <Col span={24}>
                              <div className="unit"> {unit?.unitName}</div>
                              <div className="quantity"> {formatNumberDecimalOrInteger(unit?.quantity)}</div>
                            </Col>
                          </Row>
                        </>
                      );
                    })}
                    overlayClassName="inventory-history-tooltip"
                    trigger={["click"]}
                  >
                    {record?.unitConversion.length > 0 && (
                      <ArrowDropDownIcon width={14} height={14} className="inventory-history-tooltip-arrow-icon" />
                    )}
                  </Popover>
                </Col>
              </Row>
            </>
          );
        },
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(
        page,
        pageSize,
        keySearchFilter,
        dataFilter?.branchId,
        dataFilter?.action,
        dataFilter?.materialId,
        dataFilter?.isActive,
        selectedDate?.startDate,
        selectedDate?.endDate,
        dataFilter?.categoryId,
      );
    },
    onSearch: async (keySearch) => {
      setKeySearchFilter(keySearch);
      executeAfter(500, async () => {
        await fetchDatableAsync(
          1,
          tableSettings.pageSize,
          keySearch,
          dataFilter?.branchId,
          dataFilter?.action,
          dataFilter?.materialId,
          dataFilter?.isActive,
          selectedDate?.startDate,
          selectedDate?.endDate,
          dataFilter?.categoryId,
        );
      });
    },
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDatableAsync = async (
    pageNumber,
    pageSize,
    keySearch,
    branchId,
    materialCategoryId,
    unitId,
    isActive,
    startDate,
    endDate,
    categoryId,
  ) => {
    const response = await inventoryHistoryDataService.getInventoryHistoryManagementByMaterialAsync(
      pageNumber,
      pageSize,
      keySearch,
      branchId ?? "",
      materialCategoryId ?? "",
      unitId ?? "",
      isActive ?? "",
      startDate ?? "",
      endDate ?? "",
      categoryId ?? "",
    );
    const data = response?.materialInventoryHistories.map((s) => mappingRecordToColumns(s));
    setTotalRecords(response.total);
    setCurrentPageNumber(pageNumber);
    setDataSource(data);
  };

  const mappingRecordToColumns = (item) => {
    return {
      oldQuantity: item?.oldQuantity,
      newQuantity: item?.newQuantity,
      time: moment.utc(item?.time).local(),
      materialName: item?.materialName,
      baseUnitName: item?.baseUnitName,
      branchName: item?.branchName,
      unitConversion: item?.unitConversion,
      materialId: item?.materialId,
      isDeleted: item?.isDeleted,
      isActive: item?.isActive,
      sku: item?.sku,
      category: item?.category,
      totalChange: item?.totalChange,
    };
  };

  const getTableColumns = () => {
    return tableSettings.columns;
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterPopover
          fetchDataMaterials={handleFilter}
          actions={materialCategories}
          branches={branches}
          materials={units}
          category={categoryFilterOptions}
          ref={filterPopoverRef}
          changeCategoryId={changeCategoryId}
          isHidden={true}
        />
      )
    );
  };

  const onClearFilter = (e) => {
    if (filterPopoverRef && filterPopoverRef.current) {
      filterPopoverRef.current.clear();
    }
    setCountFilter(0);
    setShowPopover(false);

    setDataFilter({
      branchId: "",
      action: "",
      materialId: "",
      isActive: "",
      categoryId: "",
    });

    fetchDatableAsync(
      1,
      tableSettings.pageSize,
      keySearchFilter,
      "",
      "",
      "",
      "",
      selectedDate?.startDate,
      selectedDate?.endDate,
      "",
    );
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
    }

    var filterData = await inventoryHistoryDataService.getFilterInventoryHistory();
    const { branchFilters, categoryFilters, materialFilters } = filterData;

    if (branchFilters) {
      const allBranchOption = {
        id: "",
        name: t("material.filter.branch.all"),
      };
      const branchOptions = [allBranchOption, ...branchFilters];
      setBranches(branchOptions);
    }

    if (categoryFilters) {
      const allCategoryOption = {
        id: "",
        name: t("material.filter.category.all"),
      };
      const categoryOptions = [allCategoryOption, ...categoryFilters];
      setCategoryFilterOptions(categoryOptions);
    }

    if (materialFilters) {
      const allUnitOption = {
        id: "",
        name: t("inventoryHistory.allMaterials"),
      };
      const unitOptions = [allUnitOption, ...materialFilters];
      setMaterialFilters(unitOptions);
      if (dataFilter?.categoryId) {
        var newMaterials = unitOptions?.filter((item) => !item.id || item.categoryId === dataFilter?.categoryId);
        setUnits(newMaterials);
      } else {
        setUnits(unitOptions);
      }
    }

    const allAction = {
      id: "",
      name: t("inventoryHistory.allAction"),
    };
    const allActionOptions = [allAction, ...ListInventoryHistoryAction];
    setMaterialCategories(allActionOptions);
  };

  const changeCategoryId = (id) => {
    if (!id) {
      setUnits(materialFilters);
    } else {
      var newMaterials = materialFilters?.filter((item) => !item.id || item.categoryId === id);
      setUnits(newMaterials);
    }
  };

  const handleFilter = (data) => {
    setCountFilter(data?.count);
    setDataFilter(data);
    fetchDatableAsync(
      1,
      tableSettings.pageSize,
      keySearchFilter,
      data?.branchId,
      data?.action,
      data?.materialId,
      data?.isActive,
      selectedDate?.startDate,
      selectedDate?.endDate,
      data?.categoryId,
    );
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    fetchDatableAsync(
      1,
      tableSettings.pageSize,
      keySearchFilter,
      dataFilter?.branchId,
      dataFilter?.action,
      dataFilter?.materialId,
      dataFilter?.isActive,
      date?.startDate,
      date?.endDate,
      dataFilter?.categoryId,
    );
  };

  const onConditionCompare = (key) => {
    let titleConditionCompare = "";
    switch (key) {
      case OptionDateTime.today:
        titleConditionCompare = pageData.date.yesterday;
        break;
      case OptionDateTime.yesterday:
        titleConditionCompare = pageData.date.previousDay;
        break;
      case OptionDateTime.thisWeek:
        titleConditionCompare = pageData.date.lastWeek;
        break;
      case OptionDateTime.lastWeek:
        titleConditionCompare = pageData.date.previousWeek;
        break;
      case OptionDateTime.thisMonth:
        titleConditionCompare = pageData.date.lastMonth;
        break;
      case OptionDateTime.lastMonth:
        titleConditionCompare = pageData.date.previousMonth;
        break;
      case OptionDateTime.thisYear:
        titleConditionCompare = pageData.date.lastYear;
        break;
      default:
        break;
    }

    setTitleConditionCompare(titleConditionCompare);
  };

  const exportFile = async () => {
    let languageCode = languageService.getLang();
    let startDate = moment(selectedDate?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(selectedDate?.endDate).format(DateFormat.MM_DD_YYYY);

    try {
      const response = await inventoryHistoryDataService.exportByMaterialAsync(
        keySearchFilter,
        dataFilter?.branchId ?? "",
        dataFilter?.action ?? "",
        dataFilter?.materialId ?? "",
        dataFilter?.isActive ?? "",
        startDate,
        endDate,
        languageCode,
        dataFilter?.categoryId ?? "",
      );
      handleDownloadFile(response);
    } catch (error) {
      const { statusText } = error;
      message.error(statusText);
    }
  };

  return (
    <>
      <Form className="form-staff">
        <Card className="fnb-card-full">
          <Row className="form-staff inventory-history">
            <FnbTable
              className="mt-4 table-striped-rows table-inventory-history"
              dataSource={dataSource}
              columns={getTableColumns()}
              pageSize={tableSettings.pageSize}
              currentPageNumber={currentPageNumber}
              total={totalRecords}
              onChangePage={tableSettings.onChangePage}
              numberRecordCurrent={numberRecordCurrent}
              search={{
                maxLength: MAX_LENGTH_SEARCH,
                placeholder: pageData.table.searchPlaceholder,
                onChange: tableSettings.onSearch,
              }}
              filter={{
                onClickFilterButton: onClickFilterButton,
                totalFilterSelected: countFilter,
                onClearFilter: onClearFilter,
                buttonTitle: pageData.filter,
                component: filterComponent(),
              }}
              calendarComponent={{
                onSelectedDatePicker: onSelectedDatePicker,
                selectedDate: selectedDate,
                onConditionCompare: onConditionCompare,
              }}
              exportExcel={
                hasPermission(PermissionKeys.VIEW_INVENTORY_HISTORY) && {
                  buttonTitle: pageData.btnExport,
                  onClick: exportFile,
                }
              }
            />
          </Row>
        </Card>
      </Form>
      <Modal
        width={500}
        className="delete-confirm-modal"
        title={pageData.notificationTitle}
        closeIcon
        visible={showModalNotification}
        footer={(null, null)}
      >
        <Row>
          <div className="table-notification">{pageData.materialIsDeleted}</div>
        </Row>
        <Row className="btn-i-got-it">
          <Button type="primary" onClick={() => setShowModalNotification(false)}>
            {pageData.buttonIGotIt}
          </Button>
        </Row>
      </Modal>
    </>
  );
};

export default TableInventoryHistoryByMaterialComponent;
