import { Card, Form, Row, Typography } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { FnbTable } from "components/fnb-table/fnb-table";
import { DateFormat } from "constants/string.constants";
import branchDataService from "data-services/branch/branch-data.service";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import supplierDataService from "data-services/supplier/supplier-data.service";
import { env } from "env";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import languageService from "services/language/language.service";
import { executeAfter, formatNumberDecimalOrInteger } from "utils/helpers";
import { formatDate, getCurrency } from "../../../../utils/helpers";
import { FilterPopover } from "./filter-popover.component";
import "./index.scss";

const { Text } = Typography;
const { forwardRef, useImperativeHandle } = React;
const TablePurchaseOrderComponent = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    /// Export this function to props with name exportFilter and param: data
    exportFilter(data) {
      exportPurchaseOrder(data);
    },
  }));
  const [t] = useTranslation();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [showPaging, setShowPaging] = useState(false);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [countFilter, setCountFilter] = useState(0);
  const [showPopover, setShowPopover] = useState(true);
  const filterPopoverRef = React.useRef();
  const [branches, setBranches] = useState([]);
  const [supplierFilter, setSupplierFilter] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString("en-US"),
    endDate: moment().toDate().toLocaleDateString("en-US"),
  });
  const [dataFilterAndSearch, setDataFilterAndSearch] = useState({
    keySearch: undefined,
    startDate: undefined,
    endDate: undefined,
    branchId: undefined,
    supplierId: undefined,
    statusId: undefined,
  });

  const pageData = {
    btnFilter: t("button.filter"),
    table: {
      searchPlaceholder: t("purchaseOrder.searchBySupplierName"),
      code: t("table.code"),
      supplier: t("supplier.title"),
      branch: t("purchaseOrder.branch"),
      amount: t("purchaseOrder.amount"),
      status: t("table.status"),
      createdBy: t("table.createdBy"),
      createdDate: t("purchaseOrder.createdDate"),
    },
    today: t("optionDatetime.today"),
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
    yesterday: "dashboard.compareDate.yesterday",
  };

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.table.code,
        dataIndex: "id",
        key: "index",
        width: "10%",
        align: "center",
        render: (_, record) => {
          return <Link to={`/inventory/detail-purchase-order/${record?.id}`}>{record?.code}</Link>;
        },
      },
      {
        title: pageData.table.supplier,
        dataIndex: "supplier",
        key: "index",
        width: "25%",
        className: "table-text-supplier-overflow",
        render: (_, record) => {
          return (
            <>
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.supplier }}
                color="#50429B"
              >
                <span>{record?.supplier}</span>
              </Paragraph>
            </>
          );
        },
      },
      {
        title: pageData.table.branch,
        dataIndex: "branch",
        key: "index",
        width: "10%",
        className: "table-text-branch-overflow",
        render: (_, record) => {
          return (
            <>
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.branch }}
                color="#50429B"
              >
                <span>{record?.branch}</span>
              </Paragraph>
            </>
          );
        },
      },
      {
        title: `${pageData.table.amount} (${getCurrency()})`,
        dataIndex: "amount",
        key: "index",
        align: "right",
        width: "25%",
        render: (_, record) => {
          return <Text>{formatNumberDecimalOrInteger(record.amount)}</Text>;
        },
      },
      {
        title: pageData.table.status,
        dataIndex: "status",
        key: "index",
        width: "10%",
        align: "left",
        render: (_, record) => {
          return (
            <div
              className="text-status text-no-wrap"
              style={{ backgroundColor: record.status.backGroundColor, color: record.status.color }}
            >
              {t(record.status.name)}
            </div>
          );
        },
      },
      {
        title: pageData.table.createdBy,
        dataIndex: "createdBy",
        key: "index",
        width: "10%",
        className: "table-text-createdBy-overflow",
        render: (_, record) => {
          return (
            <>
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.createdBy }}
                color="#50429B"
              >
                <span>{record?.createdBy}</span>
              </Paragraph>
            </>
          );
        },
      },
      {
        title: pageData.table.createdDate,
        dataIndex: "createdDate",
        key: "index",
        width: "10%",
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync({
        pageNumber: page,
        pageSize: pageSize,
        keySearch: dataFilterAndSearch.keySearch ?? "",
        fromDate: dataFilterAndSearch.startDate,
        toDate: dataFilterAndSearch.endDate,
        branchId: dataFilterAndSearch.branchId,
        supplierId: dataFilterAndSearch.supplierId,
        status: dataFilterAndSearch.statusId,
      });
    },
    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        setDataFilterAndSearch({ ...dataFilterAndSearch, keySearch: keySearch });
        await fetchDatableAsync({
          pageNumber: 1,
          pageSize: tableSettings.pageSize,
          keySearch: keySearch,
          fromDate: dataFilterAndSearch.startDate,
          toDate: dataFilterAndSearch.endDate,
          branchId: dataFilterAndSearch.branchId,
          supplierId: dataFilterAndSearch.supplierId,
          status: dataFilterAndSearch.statusId,
        });
      });
    },
  };

  useEffect(() => {
    fetchDatableAsync({
      pageNumber: currentPageNumber,
      pageSize: tableSettings.pageSize,
      keySearch: "",
    });
  }, []);

  const fetchDatableAsync = async ({
    pageNumber,
    pageSize,
    keySearch,
    fromDate,
    toDate,
    branchId,
    supplierId,
    status,
  }) => {
    const response = await purchaseOrderDataService.getAllPurchaseOrderAsync(
      pageNumber,
      pageSize,
      keySearch,
      fromDate,
      toDate,
      branchId,
      supplierId,
      status,
    );
    const data = response?.purchaseOrders.map((s) => mappingRecordToColumns(s));
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
    setDataSource(data);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > response.total) {
      numberRecordCurrent = response.total;
    }
    setNumberRecordCurrent(numberRecordCurrent);

    if (response.total <= 20) {
      setShowPaging(false);
    } else {
      setShowPaging(true);
    }
  };

  const mappingRecordToColumns = (item) => {
    return {
      id: item?.id,
      code: item?.code,
      supplier: item?.supplier?.name,
      branch: item?.storeBranch?.name,
      amount: calculateTotalOfMaterialPrice(item?.purchaseOrderMaterials),
      status: item?.status,
      createdDate: formatDate(item?.createdTime, DateFormat.DD_MM_YYYY_DASH),
      createdBy: item?.createdBy,
    };
  };

  /**
   * Calculate the total of material price
   * @param {*} orderMaterial
   * @returns total price
   */
  const calculateTotalOfMaterialPrice = (orderMaterial) => {
    let total = 0;
    orderMaterial.forEach((item) => {
      total += item?.total;
    });
    return total;
  };

  const getTableColumns = () => {
    return tableSettings.columns;
  };
  const onClearFilter = (e) => {
    if (filterPopoverRef && filterPopoverRef.current) {
      filterPopoverRef.current.clear();
    }
    setCountFilter(0);
    setShowPopover(false);
    setDataFilterAndSearch({
      ...dataFilterAndSearch,
      branchId: "",
      supplierId: "",
      statusId: "",
    });
  };
  const handleFilter = (data) => {
    setCurrentPageNumber(1);
    setCountFilter(Object.values(data).length);
    setDataFilterAndSearch({ ...dataFilterAndSearch, ...data });
    fetchDatableAsync({
      pageNumber: 1,
      pageSize: tableSettings.pageSize,
      keySearch: dataFilterAndSearch.keySearch || "",
      fromDate: dataFilterAndSearch.startDate,
      toDate: dataFilterAndSearch.endDate,
      branchId: data.branchId,
      supplierId: data.supplierId,
      status: data.statusId,
    });
  };
  //#region
  const filterComponent = () => {
    return (
      showPopover && (
        <FilterPopover
          fetchDataPurchaseOrder={handleFilter}
          ref={filterPopoverRef}
          branches={branches}
          supplierFilter={supplierFilter}
        />
      )
    );
  };
  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
    }
    var resBranch = await branchDataService.getAllBranchsAsync();
    if (resBranch) {
      const allBranchOption = {
        id: "",
        name: t("material.filter.branch.all"),
      };
      const branchOptions = [allBranchOption, ...resBranch.branchs];
      setBranches(branchOptions);
    }

    var supplierData = await supplierDataService.getAllSupplierAsync();
    if (supplierData) {
      const allSuppliers = {
        id: "",
        name: t("purchaseOrder.allSupplier"),
      };
      var supplierFilterData = supplierData.suppliers.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      const suppliersData = [allSuppliers, ...supplierFilterData];
      setSupplierFilter(suppliersData);
    }
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    setDataFilterAndSearch({ ...dataFilterAndSearch, ...date });
    fetchDatableAsync({
      pageNumber: currentPageNumber,
      pageSize: tableSettings.pageSize,
      fromDate: date.startDate,
      toDate: date.endDate,
      keySearch: dataFilterAndSearch.keySearch || "",
      branchId: dataFilterAndSearch.branchId,
      supplierId: dataFilterAndSearch.supplierId,
      status: dataFilterAndSearch.statusId,
    });
  };

  const exportPurchaseOrder = (storeId) => {
    let languageCode = languageService.getLang();
    const link = document.createElement("a");
    let url = `${
      env.REACT_APP_ROOT_DOMAIN
    }/api/purchaseorder/export?languageCode=${languageCode}&storeId=${storeId}&keySearch=${
      dataFilterAndSearch.keySearch ?? ""
    }`;
    if (dataFilterAndSearch.startDate && dataFilterAndSearch.endDate)
      url += `&fromDate=${dataFilterAndSearch.startDate}&toDate=${dataFilterAndSearch.endDate}`;
    if (dataFilterAndSearch.branchId) url += `&branchId=${dataFilterAndSearch.branchId}`;
    if (dataFilterAndSearch.supplierId) url += `&supplierId=${dataFilterAndSearch.supplierId}`;
    if (dataFilterAndSearch.statusId != undefined) url += `&status=${dataFilterAndSearch.statusId}`;
    var timeZone = new Date().getTimezoneOffset() / 60;
    url += `&timeZone=${timeZone}`;

    link.href = url;
    link.click();
  };

  //#endregion

  return (
    <>
      <Form className="form-staff">
        <Card className="fnb-card-full">
          <Row className="form-staff">
            <FnbTable
              className="mt-4 table-striped-rows table-purchase-order-management"
              dataSource={dataSource}
              columns={getTableColumns()}
              pageSize={tableSettings.pageSize}
              currentPageNumber={currentPageNumber}
              total={totalRecords}
              onChangePage={tableSettings.onChangePage}
              numberRecordCurrent={numberRecordCurrent}
              search={{
                placeholder: pageData.table.searchPlaceholder,
                onChange: tableSettings.onSearch,
                maxLength: 100,
              }}
              filter={{
                onClickFilterButton: onClickFilterButton,
                totalFilterSelected: countFilter,
                onClearFilter: onClearFilter,
                buttonTitle: pageData.btnFilter,
                component: filterComponent(),
              }}
              calendarComponent={{
                onSelectedDatePicker: onSelectedDatePicker,
                selectedDate: selectedDate,
              }}
            />
          </Row>
        </Card>
      </Form>
    </>
  );
});

export default TablePurchaseOrderComponent;
